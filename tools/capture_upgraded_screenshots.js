import { chromium } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SERVER_URL = 'http://127.0.0.1:4173/';

async function capture() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(SERVER_URL, { waitUntil: 'domcontentloaded' });

  // Enter 3D scene
  await page.waitForSelector('#enter', { state: 'visible', timeout: 30000 });
  await page.click('#enter');
  await page.waitForFunction(() => {
    const worldUi = document.getElementById('worldUi');
    return worldUi && worldUi.classList.contains('is-visible');
  }, { timeout: 45000 });
  await page.waitForTimeout(1000);

  // Wait for scene transition to settle
  await page.waitForFunction(() => window.state && !window.state.busy, { timeout: 15000 });
  await page.waitForTimeout(500);

  // Focus laptop
  await page.evaluate(() => window.focusLaptop());
  await page.waitForFunction(() => {
    const screenUi = document.getElementById('screenUi');
    return screenUi && screenUi.classList.contains('is-open');
  }, { timeout: 15000 });
  await page.waitForTimeout(1000);

  // 1. Clean Desktop
  await page.screenshot({ path: path.join(ROOT_DIR, 'upgraded_desktop_clean.png') });
  console.log('Captured upgraded_desktop_clean.png');

  // 2. Action Center
  await page.evaluate(() => window.world.desktopManager.openActionCenter());
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ROOT_DIR, 'upgraded_desktop_action_center.png') });
  console.log('Captured upgraded_desktop_action_center.png');
  await page.evaluate(() => window.world.desktopManager.closeActionCenter());
  await page.waitForTimeout(200);

  // 3. Start Menu
  await page.evaluate(() => document.getElementById('winStartToggleBtn').click());
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ROOT_DIR, 'upgraded_desktop_start_menu.png') });
  console.log('Captured upgraded_desktop_start_menu.png');
  await page.evaluate(() => document.getElementById('winStartToggleBtn').click());
  await page.waitForTimeout(200);

  // 4. WindSim (Simulation Tab)
  await page.evaluate(() => window.world.desktopManager.openApp('windsim'));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ROOT_DIR, 'upgraded_app_windsim_simulation.png') });
  console.log('Captured upgraded_app_windsim_simulation.png');

  // 5. WindSim (Dossier Tab)
  await page.evaluate(() => {
    const win = window.world.desktopManager.windows.get('windsim');
    win.querySelector('[data-target-tab="dossier"]')?.click();
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ROOT_DIR, 'upgraded_app_windsim_dossier.png') });
  console.log('Captured upgraded_app_windsim_dossier.png');
  await page.evaluate(() => window.world.desktopManager.closeApp('windsim'));

  // 6. BerryBot (Simulation Tab)
  await page.evaluate(() => window.world.desktopManager.openApp('berrybot'));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ROOT_DIR, 'upgraded_app_berrybot_simulation.png') });
  console.log('Captured upgraded_app_berrybot_simulation.png');
  await page.evaluate(() => window.world.desktopManager.closeApp('berrybot'));

  // 7. File Explorer
  await page.evaluate(() => window.world.desktopManager.openExplorer('Projects'));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ROOT_DIR, 'upgraded_app_explorer.png') });
  console.log('Captured upgraded_app_explorer.png');
  await page.evaluate(() => window.world.desktopManager.closeWindow('explorer_projects'));

  // 8. Terminal
  await page.evaluate(() => {
    const dm = window.world.desktopManager;
    dm.openApp('terminal');
    const term = dm.instances.get('terminal');
    term.executeCommand('theme matrix');
    term.executeCommand('whoami');
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ROOT_DIR, 'upgraded_app_terminal.png') });
  console.log('Captured upgraded_app_terminal.png');
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    window.world.desktopManager.closeApp('terminal');
  });

  // 9. Contact Dispatch with feedback
  await page.evaluate(() => {
    const dm = window.world.desktopManager;
    dm.openApp('contact');
    const win = dm.windows.get('contact');
    win.querySelector('#contactName').value = 'Dr. Robert Vance';
    win.querySelector('#contactEmail').value = 'rvance@robotics-lab.mit.edu';
    win.querySelector('#contactMessage').value = 'Reviewed your LBM D2Q9 CFD wind tunnel simulation and ESP32 robotics platform. Impressive work.';
    win.querySelector('#contactDispatchForm').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ROOT_DIR, 'upgraded_app_contact.png') });
  console.log('Captured upgraded_app_contact.png');
  await page.evaluate(() => window.world.desktopManager.closeApp('contact'));

  await browser.close();
  console.log('All upgraded screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
