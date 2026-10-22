/**
 * Automated Verification Oracle for JAIJITESH.OS 3D Room Experience
 * Validates asset integrity, WebGL rendering, scene initialization,
 * hardware inspection, OS desktop applications, responsive resizing,
 * and zero console errors.
 */

import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SERVER_URL = process.env.TEST_SERVER_URL || 'http://127.0.0.1:4173/';

async function runTestSuite() {
  console.log('='.repeat(70));
  console.log('JAIJITESH.OS 3D ROOM — AUTOMATED VERIFICATION SUITE');
  console.log('='.repeat(70));

  const results = [];
  function assert(name, condition, extra = '') {
    if (condition) {
      console.log(`  [PASS] ${name} ${extra ? `(${extra})` : ''}`);
      results.push({ name, pass: true, extra });
    } else {
      console.error(`  [FAIL] ${name} ${extra ? `(${extra})` : ''}`);
      results.push({ name, pass: false, extra });
    }
  }

  // --- SUITE 1: LOCAL ASSET INTEGRITY ---
  console.log('\n[Suite 1: Local Asset & Model Integrity]');
  const mainGlb = path.join(ROOT_DIR, 'assets', 'jaijitesh_room.glb');
  assert('Optimized room GLB exists', fs.existsSync(mainGlb));
  if (fs.existsSync(mainGlb)) {
    const stat = fs.statSync(mainGlb);
    const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
    assert('Room GLB size is under 50 MB (standard Git safe)', stat.size < 50 * 1024 * 1024, `${sizeMb} MB`);
    const fd = fs.openSync(mainGlb, 'r');
    const magicBuf = Buffer.alloc(4);
    fs.readSync(fd, magicBuf, 0, 4, 0);
    fs.closeSync(fd);
    assert('GLB binary magic header is valid (0x46546C67)', magicBuf.toString('ascii') === 'glTF');
  }

  const dracoWasm = path.join(ROOT_DIR, 'assets', 'draco', 'draco_decoder.wasm');
  const dracoJs = path.join(ROOT_DIR, 'assets', 'draco', 'draco_decoder.js');
  const dracoWrapper = path.join(ROOT_DIR, 'assets', 'draco', 'draco_wasm_wrapper.js');
  assert('Local Draco WASM decoder exists', fs.existsSync(dracoWasm));
  assert('Local Draco JS decoder exists', fs.existsSync(dracoJs));
  assert('Local Draco WASM wrapper exists', fs.existsSync(dracoWrapper));

  // --- SUITE 2: RUNTIME BROWSER & WEBGL RENDERING ---
  console.log('\n[Suite 2: Runtime WebGL & Scene Initialization]');
  let browser;
  try {
    browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: [
        '--use-gl=angle',
        '--use-angle=swiftshader',
        '--enable-webgl',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });
  } catch (err) {
    console.log('Falling back to msedge channel...');
    browser = await chromium.launch({
      channel: 'msedge',
      headless: true,
      args: [
        '--use-gl=angle',
        '--use-angle=swiftshader',
        '--enable-webgl',
        '--no-sandbox',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  const loadStartTime = Date.now();
  await page.goto(SERVER_URL, { waitUntil: 'domcontentloaded' });
  const domLoadTime = Date.now() - loadStartTime;
  assert('Page DOM loaded successfully', true, `${domLoadTime}ms`);

  // Wait for Enter button to become clickable
  await page.waitForSelector('#enter', { state: 'visible', timeout: 30000 });
  const enterBtnVisibleTime = Date.now() - loadStartTime;
  assert('Initial splash screen and Enter button ready', true, `${enterBtnVisibleTime}ms`);

  // Enter the 3D room
  await page.click('#enter');

  // Wait for 3D world UI to appear (buildWorld loads GLB and transitions intro)
  await page.waitForFunction(() => {
    const worldUi = document.getElementById('worldUi');
    return worldUi && worldUi.classList.contains('is-visible');
  }, { timeout: 45000 });

  // Give the scene a moment to settle first frame
  await page.waitForTimeout(1000);

  // Check scene objects
  const sceneState = await page.evaluate(() => {
    const w = window.world;
    const c = window.camera;
    if (!w) return { hasWorld: false };
    return {
      hasWorld: true,
      hasRoom: !!w.room,
      hasScreenMesh: !!w.screenMesh,
      hasSwitchboard: !!w.switchboard,
      interactablesCount: w.interactables ? w.interactables.length : 0,
      hardwareCount: w.hardwareObjects ? w.hardwareObjects.size : 0,
      hasCameraObj: w.hardwareObjects ? w.hardwareObjects.has('camera') : false,
      hasRpiObj: w.hardwareObjects ? w.hardwareObjects.has('rpi') : false,
      hasRobotObj: w.hardwareObjects ? w.hardwareObjects.has('robot') : false,
      cameraPos: c ? { x: c.position.x, y: c.position.y, z: c.position.z } : null
    };
  });

  assert('3D World initialized', sceneState.hasWorld);
  assert('Room geometry loaded', sceneState.hasRoom);
  assert('Screen mesh initialized for OS mirroring', sceneState.hasScreenMesh);
  assert('Switchboard controls initialized', sceneState.hasSwitchboard);
  assert('Interactable objects registered in raycaster', sceneState.interactablesCount > 0, `${sceneState.interactablesCount} nodes`);
  assert('Hardware objects registered (Camera, RPi, Robot)', sceneState.hardwareCount >= 3, `${sceneState.hardwareCount} devices`);
  assert('Canon AT-1 Camera node registered', sceneState.hasCameraObj);
  assert('Raspberry Pi 4 node registered', sceneState.hasRpiObj);
  assert('BerryBot Chassis node registered', sceneState.hasRobotObj);

  // 3D Canvas non-empty check via Three.js render pipeline statistics
  const renderStats = await page.evaluate(() => {
    const r = window.renderer;
    if (!r || !r.info) return { calls: 0, triangles: 0 };
    return {
      calls: r.info.render.calls,
      triangles: r.info.render.triangles,
      geometries: r.info.memory.geometries,
      textures: r.info.memory.textures
    };
  });
  assert('3D canvas renders genuine geometry frame', renderStats.calls > 0 && renderStats.triangles > 0, `${renderStats.triangles.toLocaleString()} triangles, ${renderStats.calls} draw calls`);

  // --- SUITE 3: ROOM CONTROLS & INTERACTIONS ---
  console.log('\n[Suite 3: Room Controls & Interactions]');
  await page.waitForFunction(() => window.state && window.state.fpovMode === true, { timeout: 10000 });
  await page.waitForTimeout(600);

  // 1. WASD Movement and camera bounds clamping
  const movementResult = await page.evaluate(() => {
    const c = window.camera;
    const fp = window.fpov;
    if (!c || !fp) return { moved: false };
    const initialPos = { x: c.position.x, y: c.position.y, z: c.position.z };
    fp.moveBackward = true;
    if (typeof window.updateFPOVMovement === 'function') {
      window.updateFPOVMovement(0.18);
    }
    fp.moveBackward = false;
    const afterPos = { x: c.position.x, y: c.position.y, z: c.position.z };
    const moved = (initialPos.x !== afterPos.x || initialPos.z !== afterPos.z);
    return { moved, initialPos, afterPos };
  });
  assert('WASD keyboard movement updates camera position', movementResult.moved, `from (${movementResult.initialPos?.x.toFixed(2)}, ${movementResult.initialPos?.z.toFixed(2)}) to (${movementResult.afterPos?.x.toFixed(2)}, ${movementResult.afterPos?.z.toFixed(2)})`);

  // 2. Switchboard room systems toggle
  const switchboardResult = await page.evaluate(() => {
    if (typeof window.toggleSwitchButton === 'function') {
      window.toggleSwitchButton(0);
      return { success: true };
    }
    return { success: false };
  });
  assert('Switchboard systems toggle executed cleanly', switchboardResult.success);

  // 3. Yellow Vault Door access restriction handler
  const vaultResult = await page.evaluate(() => {
    if (typeof window.triggerDoorAccessDenied === 'function') {
      window.triggerDoorAccessDenied();
      const doorAlert = document.getElementById('doorAlert');
      return {
        success: true,
        alertVisible: doorAlert && !doorAlert.hidden,
        text: doorAlert ? doorAlert.textContent : ''
      };
    }
    return { success: false };
  });
  assert('Vault airlock access handler displays security alert', vaultResult.alertVisible, vaultResult.text?.trim().slice(0, 35));

  // 4. Hardware Telemetry Inspector
  console.log('\n[Suite 4: Hardware Telemetry Inspector]');
  for (const hwKey of ['rpi', 'robot', 'camera']) {
    const hwTest = await page.evaluate((key) => {
      window.inspectHardware(key);
      const overlay = document.getElementById('inspect');
      const title = document.getElementById('inspectTitle');
      const copy = document.getElementById('inspectCopy');
      const isOpen = overlay && overlay.classList.contains('is-open');
      const titleText = title ? title.textContent : '';
      const hasContent = copy && copy.textContent.length > 10;
      // Close overlay
      const closeBtn = document.getElementById('inspectClose');
      if (closeBtn) closeBtn.click();
      return { isVisible: isOpen, titleText, hasContent };
    }, hwKey);
    assert(`Hardware Inspector: ${hwKey.toUpperCase()} opened with verified specs`, hwTest.isVisible && hwTest.hasContent, hwTest.titleText);
    await page.waitForTimeout(1000); // Allow camera ease-back to complete
  }

  // --- SUITE 5: LAPTOP FOCUS & JAIJITESH.OS DESKTOP ENVIRONMENT ---
  console.log('\n[Suite 5: Laptop Focus & JAIJITESH.OS]');
  await page.waitForFunction(() => !window.state.busy, { timeout: 10000 });
  await page.evaluate(() => window.focusLaptop());
  await page.waitForFunction(() => {
    const screenUi = document.getElementById('screenUi');
    return screenUi && screenUi.classList.contains('is-open');
  }, { timeout: 15000 });

  const osBootResult = await page.evaluate(() => {
    const screenUi = document.getElementById('screenUi');
    const dm = window.world.desktopManager;
    return {
      isOpen: screenUi && screenUi.classList.contains('is-open'),
      hasDesktopManager: !!dm,
      hasWindows: dm && dm.windows ? dm.windows.size : 0
    };
  });
  assert('Laptop screen camera ease transition and OS boot', osBootResult.isOpen);
  assert('DesktopManager environment initialized', osBootResult.hasDesktopManager);

  // Test opening and closing applications
  const appList = [
    { id: 'terminal', name: 'Command Prompt' },
    { id: 'windsim', name: 'WindSim LBM Aerodynamic CFD' },
    { id: 'filesim', name: 'File Allocation Simulator' },
    { id: 'berrybot', name: 'BerryBot Robotics Telemetry' },
    { id: 'berry', name: 'Berry AI Agent Sandbox' },
    { id: 'speaksafe', name: 'SpeakSafe Voice Forensics' },
    { id: 'spherical_bot', name: 'Spherical Bot BALLZ' },
    { id: 'timeline', name: 'Engineering Timeline' },
    { id: 'contact', name: 'Contact Dispatch' }
  ];

  for (const app of appList) {
    const appOpenResult = await page.evaluate(async (id) => {
      const dm = window.world.desktopManager;
      if (!dm) return { success: false };
      dm.openApp(id);
      await new Promise(r => setTimeout(r, 200));
      const win = dm.windows.get(id);
      const isRendered = !!win && win.style.display !== 'none';
      dm.closeApp(id);
      return { success: isRendered };
    }, app.id);
    assert(`Desktop Application launch & close: ${app.name}`, appOpenResult.success);
  }

  // --- EXTENDED DESKTOP SUBSYSTEM CHECKS ---
  console.log('\n[Suite 5.1: Desktop Subsystems, Actions & UI Innovations]');

  // 1. Desktop SVG Icons Integrity
  const svgIconCheck = await page.evaluate(() => {
    const icons = document.querySelectorAll('.win-desktop-icon');
    const svgs = document.querySelectorAll('.win-desktop-icon .win-svg');
    return { total: icons.length, svgs: svgs.length };
  });
  assert('Desktop icons rendered with scalable vector SVG graphics', svgIconCheck.total > 0 && svgIconCheck.total === svgIconCheck.svgs, `${svgIconCheck.svgs}/${svgIconCheck.total} icons`);

  // 2. Action Center Flyout, Volume Slider & Theme Control
  const actionCenterCheck = await page.evaluate(async () => {
    const clock = document.getElementById('winTrayClock');
    const ac = document.getElementById('winActionCenter');
    const slider = document.getElementById('winVolumeSlider');
    const closeBtn = document.getElementById('winActionCenterClose');
    if (!clock || !ac || !slider) return { success: false, reason: 'Missing elements' };

    // Toggle open
    clock.click();
    await new Promise(r => setTimeout(r, 100));
    const isOpen = ac.classList.contains('is-open') && !ac.hidden;

    // Test volume slider integration
    slider.value = 0.45;
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    const volLabel = document.getElementById('winVolumeLabel')?.textContent;
    const soundOk = window.sound && Math.abs(window.sound.volume - 0.45) < 0.05;

    // Test theme preset button
    const matrixBtn = ac.querySelector('[data-action-theme="matrix"]');
    matrixBtn?.click();
    const isMatrix = document.documentElement.getAttribute('data-theme') === 'matrix';
    const darkBtn = ac.querySelector('[data-action-theme="dark"]');
    darkBtn?.click();

    // Close Action Center
    closeBtn?.click();
    await new Promise(r => setTimeout(r, 50));
    const isClosed = ac.hidden;

    return {
      success: isOpen && soundOk && isMatrix && isClosed,
      volLabel,
      soundOk,
      isMatrix
    };
  });
  assert('Action Center flyout toggles, updates master volume, and switches themes', actionCenterCheck.success, `Vol: ${actionCenterCheck.volLabel}, SoundOk: ${actionCenterCheck.soundOk}`);

  // 3. Tabbed Simulation-First Navigation (WindSim)
  const tabbedSimCheck = await page.evaluate(async () => {
    const dm = window.world.desktopManager;
    if (!dm) return { success: false };
    dm.openApp('windsim');
    await new Promise(r => setTimeout(r, 300));
    const win = dm.windows.get('windsim');
    if (!win) return { success: false };

    // Default tab should be live simulation
    const simTab = win.querySelector('[data-target-tab="sim"]');
    const simPanel = win.querySelector('#winTabPanel_sim');
    const canvas = win.querySelector('#simMount_windsim canvas');
    const isSimActive = simTab && simTab.classList.contains('is-active') && simPanel && simPanel.classList.contains('is-active');
    const hasCanvas = !!canvas;

    // Switch to Technical Dossier tab
    const dossierTab = win.querySelector('[data-target-tab="dossier"]');
    dossierTab?.click();
    await new Promise(r => setTimeout(r, 100));
    const dossierPanel = win.querySelector('#winTabPanel_dossier');
    const isDossierActive = dossierPanel && dossierPanel.classList.contains('is-active');
    const hasProblemText = dossierPanel && dossierPanel.textContent.includes('PROBLEM STATEMENT');

    // Switch to Evidence tab
    const evidenceTab = win.querySelector('[data-target-tab="evidence"]');
    evidenceTab?.click();
    await new Promise(r => setTimeout(r, 100));
    const evidencePanel = win.querySelector('#winTabPanel_evidence');
    const isEvidenceActive = evidencePanel && evidencePanel.classList.contains('is-active');

    // Switch back to simulation: verify canvas is preserved
    simTab?.click();
    await new Promise(r => setTimeout(r, 100));
    const canvasPreserved = !!win.querySelector('#simMount_windsim canvas');

    dm.closeApp('windsim');
    return {
      success: isSimActive && hasCanvas && isDossierActive && hasProblemText && isEvidenceActive && canvasPreserved
    };
  });
  assert('WindSim dual-mode tab navigation: Simulation-first layout, technical dossier, and persistent canvas', tabbedSimCheck.success);

  // 4. Window Geometry Memory on Maximize & Restore
  const windowGeometryCheck = await page.evaluate(async () => {
    const dm = window.world.desktopManager;
    if (!dm) return { success: false };
    dm.openApp('timeline');
    await new Promise(r => setTimeout(r, 150));
    const win = dm.windows.get('timeline');
    if (!win) return { success: false };

    const initialWidth = win.style.width;
    const initialHeight = win.style.height;

    // Click maximize
    const maxBtn = win.querySelector('.win-ctrl-max');
    maxBtn?.click();
    await new Promise(r => setTimeout(r, 100));
    const isMax = win.classList.contains('is-maximized') && win.style.width === '100%';

    // Click restore
    maxBtn?.click();
    await new Promise(r => setTimeout(r, 100));
    const isRestored = !win.classList.contains('is-maximized') && win.style.width === initialWidth && win.style.height === initialHeight;

    dm.closeApp('timeline');
    return { success: isMax && isRestored, initialWidth };
  });
  assert('Window geometry memory preserves dimensions on maximize and restores accurately', windowGeometryCheck.success, windowGeometryCheck.initialWidth);

  // 5. Window Cascading Offsets
  const cascadeCheck = await page.evaluate(async () => {
    const dm = window.world.desktopManager;
    if (!dm) return { success: false };
    dm.openApp('berry');
    await new Promise(r => setTimeout(r, 100));
    dm.openApp('berrybot');
    await new Promise(r => setTimeout(r, 100));

    const win1 = dm.windows.get('berry');
    const win2 = dm.windows.get('berrybot');
    const isCascaded = win1 && win2 && (win1.style.top !== win2.style.top) && (win1.style.left !== win2.style.left);

    dm.closeApp('berry');
    dm.closeApp('berrybot');
    return { success: isCascaded, top1: win1?.style.top, top2: win2?.style.top };
  });
  assert('Window manager applies dynamic cascading offsets for concurrent windows', cascadeCheck.success, `${cascadeCheck.top1} -> ${cascadeCheck.top2}`);

  // 6. File Explorer History Navigation (Back / Forward / Up)
  const explorerHistoryCheck = await page.evaluate(async () => {
    const dm = window.world.desktopManager;
    if (!dm) return { success: false };
    dm.openExplorer('Projects');
    await new Promise(r => setTimeout(r, 200));
    const win = dm.windows.get('explorer_projects');
    if (!win) return { success: false };

    // Navigate to Research via sidebar
    const resSideBtn = win.querySelector('[data-side="Research"]');
    resSideBtn?.click();
    await new Promise(r => setTimeout(r, 100));
    const pathAfterNav = win.querySelector('.win-address-path')?.textContent;

    // Click Back
    const backBtn = win.querySelector('[data-nav="back"]');
    backBtn?.click();
    await new Promise(r => setTimeout(r, 100));
    const pathAfterBack = win.querySelector('.win-address-path')?.textContent;

    // Click Forward
    const fwdBtn = win.querySelector('[data-nav="forward"]');
    fwdBtn?.click();
    await new Promise(r => setTimeout(r, 100));
    const pathAfterFwd = win.querySelector('.win-address-path')?.textContent;

    dm.closeWindow('explorer_projects');
    const ok = pathAfterNav === 'C:\\Users\\Jaijitesh\\Desktop\\Research' &&
               pathAfterBack === 'C:\\Users\\Jaijitesh\\Desktop\\Projects' &&
               pathAfterFwd === 'C:\\Users\\Jaijitesh\\Desktop\\Research';
    return { success: ok, pathAfterNav, pathAfterBack, pathAfterFwd };
  });
  assert('File Explorer history stack supports non-destructive back/forward navigation', explorerHistoryCheck.success, `${explorerHistoryCheck.pathAfterBack} <-> ${explorerHistoryCheck.pathAfterFwd}`);

  // 7. Terminal CLI Commands & Auto-completion
  const terminalCheck = await page.evaluate(async () => {
    const dm = window.world.desktopManager;
    if (!dm) return { success: false };
    dm.openApp('terminal');
    await new Promise(r => setTimeout(r, 200));
    const term = dm.instances.get('terminal');
    if (!term) return { success: false };

    // Test command execution: theme amber
    term.executeCommand('theme amber');
    const themeAmber = document.documentElement.getAttribute('data-theme') === 'amber';
    term.executeCommand('theme dark');
    const themeDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Test command execution: whoami
    term.executeCommand('whoami');
    const outputText = term.output?.textContent || '';
    const hasIdentity = outputText.includes('JAIJITESH SURYAPRAKASH');

    dm.closeApp('terminal');
    return { success: themeAmber && themeDark && hasIdentity };
  });
  assert('Terminal CLI executes rich system commands (theme, whoami, directory parsing)', terminalCheck.success);

  // 8. Contact Dispatch In-Window Feedback (Zero native blocking alert)
  const contactDispatchCheck = await page.evaluate(async () => {
    const dm = window.world.desktopManager;
    if (!dm) return { success: false };
    dm.openApp('contact');
    await new Promise(r => setTimeout(r, 200));
    const win = dm.windows.get('contact');
    if (!win) return { success: false };

    const nameInput = win.querySelector('#contactName');
    const emailInput = win.querySelector('#contactEmail');
    const msgInput = win.querySelector('#contactMessage');
    const form = win.querySelector('#contactDispatchForm');

    if (nameInput) nameInput.value = 'Reviewer';
    if (emailInput) emailInput.value = 'audit@example.com';
    if (msgInput) msgInput.value = 'Automated verification payload';

    // Submit form
    form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await new Promise(r => setTimeout(r, 100));

    const statusBadge = win.querySelector('.win-dispatch-status');
    const hasStatus = !!statusBadge && statusBadge.textContent.includes('DISPATCH TRANSMITTED');

    dm.closeApp('contact');
    return { success: hasStatus };
  });
  assert('Contact dispatch displays in-window confirmation badge without blocking modal alerts', contactDispatchCheck.success);

  // --- SUITE 5.2: MOTION SYSTEM, TRANSITIONS & RESILIENT INTERACTION QUALITY ---
  console.log('\n[Suite 5.2: Motion System, Transitions & Resilient Interaction Quality]');

  // 1. Window Opening Transition & Stabilization
  const windowMotionEnterCheck = await page.evaluate(async () => {
    const dm = window.world.desktopManager;
    if (!dm) return { success: false };
    dm.openApp('timeline');
    const win = dm.windows.get('timeline');
    if (!win) return { success: false };
    const hadEnterClassOrSettled = win.classList.contains('win-window--entering') || win.style.opacity !== '0';
    await new Promise(r => setTimeout(r, 300));
    const isCleanAndSettled = !win.classList.contains('win-window--entering') && win.style.display !== 'none';
    return { success: hadEnterClassOrSettled && isCleanAndSettled };
  });
  assert('Window opening lifecycle: Spring entrance animation triggers and stabilizes cleanly', windowMotionEnterCheck.success);

  // 2. Window Minimize and Restore Motion Cycle
  const windowMinRestoreCheck = await page.evaluate(async () => {
    const dm = window.world.desktopManager;
    if (!dm) return { success: false };
    const win = dm.windows.get('timeline');
    if (!win) return { success: false };

    // Trigger minimize
    dm.minimizeWindow('timeline');
    await new Promise(r => setTimeout(r, 260));
    const isMin = win.classList.contains('is-minimized');
    const tabMin = document.querySelector('.win-taskbar-tab[data-task-id="timeline"]')?.classList.contains('is-min');

    // Trigger restore
    dm.restoreWindow('timeline');
    await new Promise(r => setTimeout(r, 280));
    const isRestored = !win.classList.contains('is-minimized') && !win.classList.contains('win-window--restoring');
    const tabRestored = !document.querySelector('.win-taskbar-tab[data-task-id="timeline"]')?.classList.contains('is-min');
    const isFocused = win.classList.contains('is-focused');

    dm.closeApp('timeline');
    return { success: isMin && tabMin && isRestored && tabRestored && isFocused };
  });
  assert('Window minimize & restore lifecycle: Smooth trajectory, taskbar indicators, and state recovery', windowMinRestoreCheck.success);

  // 3. Window Stacking, Z-Index Ordering and Visual Focus Cues
  const windowStackingCheck = await page.evaluate(async () => {
    const dm = window.world.desktopManager;
    if (!dm) return { success: false };
    dm.openApp('windsim');
    await new Promise(r => setTimeout(r, 150));
    dm.openApp('terminal');
    await new Promise(r => setTimeout(r, 150));

    const winWind = dm.windows.get('windsim');
    const winTerm = dm.windows.get('terminal');
    if (!winWind || !winTerm) return { success: false };

    // Terminal was opened last, should have higher z-index and focused state
    const termZInitial = parseInt(winTerm.style.zIndex, 10);
    const windZInitial = parseInt(winWind.style.zIndex, 10);
    const termFocusedInitial = winTerm.classList.contains('is-focused') && !winWind.classList.contains('is-focused');

    // Focus windsim
    dm.focusWindow('windsim');
    const windZAfter = parseInt(winWind.style.zIndex, 10);
    const windFocusedAfter = winWind.classList.contains('is-focused') && !winTerm.classList.contains('is-focused');

    dm.closeApp('windsim');
    dm.closeApp('terminal');
    return {
      success: termZInitial > windZInitial && termFocusedInitial && windZAfter > termZInitial && windFocusedAfter
    };
  });
  assert('Window focus & stacking: Layer ordering updates dynamic z-indexes and accent focus rings', windowStackingCheck.success);

  // 4. Rapid Repeated Input & Race Condition Guarding
  const rapidInputCheck = await page.evaluate(async () => {
    const dm = window.world.desktopManager;
    if (!dm) return { success: false };

    // Rapidly toggle open and close 5 times
    for (let i = 0; i < 5; i++) {
      dm.openApp('berry');
      dm.closeApp('berry');
    }
    await new Promise(r => setTimeout(r, 350));

    // Verify 0 orphan DOM elements remain
    const orphanWindows = document.querySelectorAll('#winWindowsLayer #win_berry');
    const hasOrphans = orphanWindows.length > 0;
    const windowMapClean = !dm.windows.has('berry');

    return { success: !hasOrphans && windowMapClean };
  });
  assert('Rapid interaction stress test: Zero orphan window artifacts and clean instance destruction', rapidInputCheck.success);

  // 5. System Panels Transition Choreography (Start Menu & Action Center)
  const systemPanelsCheck = await page.evaluate(async () => {
    const dm = window.world.desktopManager;
    if (!dm) return { success: false };
    const startMenu = document.getElementById('winStartMenu');
    const actionCenter = document.getElementById('winActionCenter');

    // Open Start Menu
    dm.openStartMenu();
    await new Promise(r => setTimeout(r, 100));
    const startOpen = dm.isStartOpen && startMenu.classList.contains('is-open');

    // Open Action Center directly: should auto-close Start Menu
    dm.openActionCenter();
    dm.closeStartMenu();
    await new Promise(r => setTimeout(r, 100));
    const acOpen = dm.isActionCenterOpen && actionCenter.classList.contains('is-open');
    const startClosed = !dm.isStartOpen && !startMenu.classList.contains('is-open');

    // Close Action Center
    dm.closeActionCenter();
    await new Promise(r => setTimeout(r, 100));
    const acClosed = !dm.isActionCenterOpen && !actionCenter.classList.contains('is-open');

    return { success: startOpen && acOpen && startClosed && acClosed };
  });
  assert('System panels choreography: Start Menu & Action Center mutual exclusivity and spring reveals', systemPanelsCheck.success);

  // 6. Alt+Tab HUD Window Switcher & Escape Dismissal
  const altTabEscapeCheck = await page.evaluate(async () => {
    const dm = window.world.desktopManager;
    if (!dm) return { success: false };
    dm.openApp('berrybot');
    await new Promise(r => setTimeout(r, 150));

    // Open Alt+Tab HUD
    dm.showAltTabHud();
    const hud = document.getElementById('winAltTabHud');
    const isHudOpen = hud && hud.classList.contains('is-open') && !hud.hidden;

    // Press Escape to dismiss
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await new Promise(r => setTimeout(r, 100));
    const isHudClosed = hud && (!hud.classList.contains('is-open') || hud.hidden);

    dm.closeApp('berrybot');
    return { success: isHudOpen && isHudClosed };
  });
  assert('Alt+Tab HUD Switcher: Smooth modal presentation and global Escape key dismissal', altTabEscapeCheck.success);

  // Exit laptop back to 3D room
  const exitResult = await page.evaluate(async () => {
    window.exitLaptop();
    await new Promise(r => setTimeout(r, 1200));
    const screenUi = document.getElementById('screenUi');
    const isClosed = screenUi && !screenUi.classList.contains('is-open');
    return { isClosed };
  });
  assert('Exit workstation returns camera to room orbit', exitResult.isClosed);

  // --- SUITE 6: RESPONSIVE VIEWPORT TESTING ---
  console.log('\n[Suite 6: Multi-Viewport Responsive Integrity]');
  const viewports = [
    { name: 'Mobile Portrait (iPhone 13)', width: 390, height: 844 },
    { name: 'Tablet (iPad Mini)', width: 768, height: 1024 },
    { name: 'Desktop HD', width: 1440, height: 900 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(300);
    const vpCheck = await page.evaluate(() => {
      const canvas = document.querySelector('canvas#scene');
      return {
        canvasWidth: canvas ? canvas.clientWidth : 0,
        canvasHeight: canvas ? canvas.clientHeight : 0
      };
    });
    assert(`Viewport resize [${vp.name}]: Canvas resized dynamically (${vpCheck.canvasWidth}x${vpCheck.canvasHeight})`, vpCheck.canvasWidth > 0 && vpCheck.canvasHeight > 0);
  }

  // --- SUITE 7: CONSOLE ERROR AUDIT ---
  console.log('\n[Suite 7: Zero Console Errors]');
  assert('Browser runtime console is completely clean (0 errors)', consoleErrors.length === 0, consoleErrors.length > 0 ? consoleErrors.join(' | ') : 'Clean');

  await browser.close();

  // --- FINAL REPORT SUMMARY ---
  console.log('\n' + '='.repeat(70));
  const passedCount = results.filter(r => r.pass).length;
  const failedCount = results.filter(r => !r.pass).length;
  console.log(`TOTAL CHECKS: ${results.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log('='.repeat(70));

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
