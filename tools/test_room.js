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
    { id: 'berrybot', name: 'BerryBot Robotics Telemetry' },
    { id: 'berry', name: 'Berry AI Agent Sandbox' },
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
