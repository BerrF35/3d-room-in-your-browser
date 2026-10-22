import { sound } from './audio.js';
import { TerminalEngine } from './terminal.js';
import { WindSimulator } from './simWind.js';
import { RobotSimulator } from './simRobot.js';
import { AgentSimulator } from './simAgent.js';
import {
  IDENTITY,
  PROJECTS,
  RESEARCH,
  HARDWARE_DEFINITIONS,
  TIMELINE_MILESTONES,
  VIRTUAL_FILESYSTEM
} from './portfolioData.js';

export class DesktopManager {
  constructor(screenBody, onHardwareInspect, onExit) {
    this.container = screenBody;
    this.onHardwareInspect = onHardwareInspect;
    this.onExit = onExit;

    this.windows = new Map();
    this.activeWindowId = null;
    this.highestZ = 100;
    this.instances = new Map();
    this.isStartOpen = false;
    this.isActionCenterOpen = false;
    this.windowCascadeCount = 0;
    this.currentExplorerPath = 'Projects';

    this.desktopItems = VIRTUAL_FILESYSTEM['Desktop'].items;
    this.fileSystem = VIRTUAL_FILESYSTEM;

    this.init();
  }

  init() {
    this.renderDesktop();
    this.startClock();
  }

  open() {
    if (this.container) {
      this.container.style.display = 'block';
    }
  }

  close() {
    this.closeStartMenu();
    this.closeActionCenter();
    const ctx = this.container?.querySelector('#winContextMenu');
    if (ctx) ctx.style.display = 'none';
  }

  launchApp(appId) {
    return this.openApp(appId);
  }

  closeApp(appId) {
    return this.closeWindow(appId);
  }

  getIconHtml(type) {
    const s = 'class="win-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    switch (type) {
      case 'folder':
        return `<svg ${s} class="win-svg win-svg--folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
      case 'txt':
        return `<svg ${s} class="win-svg win-svg--txt"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
      case 'pdf':
        return `<svg ${s} class="win-svg win-svg--pdf"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><text x="7" y="17" font-size="5" font-family="monospace" font-weight="900" fill="currentColor" stroke="none">PDF</text></svg>`;
      case 'cad':
        return `<svg ${s} class="win-svg win-svg--cad"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`;
      case 'wind':
      case 'cfd':
        return `<svg ${s} class="win-svg win-svg--wind"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>`;
      case 'ai':
        return `<svg ${s} class="win-svg win-svg--ai"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`;
      case 'robot':
        return `<svg ${s} class="win-svg win-svg--robot"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>`;
      case 'cmd':
        return `<svg ${s} class="win-svg win-svg--cmd"><rect x="2" y="4" width="20" height="16" rx="2"></rect><polyline points="6 9 10 12 6 15"></polyline><line x1="12" y1="15" x2="18" y2="15"></line></svg>`;
      case 'game':
      case 'timeline':
        return `<svg ${s} class="win-svg win-svg--timeline"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
      case 'mail':
      case 'contact':
        return `<svg ${s} class="win-svg win-svg--mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;
      case 'trash':
        return `<svg ${s} class="win-svg win-svg--trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
      case 'gear':
      case 'settings':
        return `<svg ${s} class="win-svg win-svg--gear"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
      default:
        return `<svg ${s} class="win-svg win-svg--folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
    }
  }

  renderDesktop() {
    this.container.innerHTML = `
      <div class="win-desktop-environment">
        <!-- Desktop Wallpaper Blueprint Surface -->
        <div class="win-desktop-surface" id="winDesktopSurface">
          <div class="win-icons-grid" id="winIconsGrid">
            ${this.desktopItems.map(item => `
              <div class="win-desktop-icon" data-id="${item.id}" data-type="${item.type}" data-target="${item.target}" tabindex="0" role="button" aria-label="Open ${item.name}">
                <div class="win-desktop-icon__graphic">
                  ${this.getIconHtml(item.iconType)}
                </div>
                <span class="win-desktop-icon__name">${item.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Windows Layer -->
        <div class="win-windows-layer" id="winWindowsLayer"></div>

        <!-- Start Menu Popup -->
        <div class="win-start-menu" id="winStartMenu">
          <div class="win-start-menu__header">
            <div class="win-start-avatar">JS</div>
            <div class="win-start-user">
              <b>${IDENTITY.name}</b>
              <small>${IDENTITY.degree} • ${IDENTITY.university.split('(')[0].trim()}</small>
            </div>
          </div>
          <div class="win-start-search">
            <span style="color:#888;">🔍</span>
            <input type="text" placeholder="Search applications, projects, research..." id="winStartSearchInput" />
          </div>
          
          <div id="winStartMainView">
            <div class="win-start-section-title">Pinned Applications</div>
            <div class="win-start-apps-grid">
              <button class="win-start-app-item" data-launch="windsim" type="button">
                ${this.getIconHtml('wind')}
                <span>WindSim</span>
              </button>
              <button class="win-start-app-item" data-launch="berry" type="button">
                ${this.getIconHtml('ai')}
                <span>Berry AI</span>
              </button>
              <button class="win-start-app-item" data-launch="berrybot" type="button">
                ${this.getIconHtml('robot')}
                <span>BerryBot</span>
              </button>
              <button class="win-start-app-item" data-launch="terminal" type="button">
                ${this.getIconHtml('cmd')}
                <span>Command Prompt</span>
              </button>
              <button class="win-start-app-item" data-launch="timeline" type="button">
                ${this.getIconHtml('timeline')}
                <span>Timeline</span>
              </button>
              <button class="win-start-app-item" data-launch="contact" type="button">
                ${this.getIconHtml('mail')}
                <span>Contact</span>
              </button>
            </div>

            <div class="win-start-section-title">Quick Access &amp; Documents</div>
            <div class="win-start-recent-list">
              <button class="win-start-recent-item" data-open-doc="about" type="button">
                ${this.getIconHtml('txt')}
                <div><b>About_Dossier.txt</b><small>Developer Profile &amp; Research Focus</small></div>
              </button>
              <button class="win-start-recent-item" data-launch="impactx" type="button">
                ${this.getIconHtml('txt')}
                <div><b>ImpactX_3.0_Winner.txt</b><small>3rd Place Overall Hackathon Case File</small></div>
              </button>
              <button class="win-start-recent-item" data-open-folder="Research" type="button">
                ${this.getIconHtml('folder')}
                <div><b>Research Papers</b><small>ColorSplitter &amp; Synthetic Data Pipelines</small></div>
              </button>
              <button class="win-start-recent-item" data-open-folder="Hardware" type="button">
                ${this.getIconHtml('cad')}
                <div><b>Hardware 3D</b><small>SolidWorks CAD &amp; Robotics Models</small></div>
              </button>
            </div>
          </div>

          <div id="winStartSearchResults" style="display: none; padding: 10px 16px; flex: 1; overflow-y: auto;"></div>

          <div class="win-start-menu__footer">
            <button class="win-start-power-btn" id="winExitBenchBtn" type="button">
              <span>⏻</span>
              <span>Exit to 3D Bench</span>
            </button>
          </div>
        </div>

        <!-- Action Center Flyout -->
        <div class="win-action-center" id="winActionCenter" hidden>
          <div class="win-action-center__header">
            <span>ACTION CENTER // TELEMETRY</span>
            <button class="win-action-center__close" id="winActionCenterClose" type="button">&times;</button>
          </div>
          <div class="win-action-center__clock">
            <div class="win-action-time" id="winActionBigTime">00:00:00</div>
            <div class="win-action-date" id="winActionBigDate">Thursday, October 22, 2026</div>
          </div>
          <div class="win-action-section-title">AUDIO CONTROL &amp; MASTER GAIN</div>
          <div class="win-action-slider-row">
            <span id="winVolumeIcon">🔊</span>
            <input type="range" class="win-action-slider" id="winVolumeSlider" min="0" max="1" step="0.02" value="0.75" />
            <span class="win-action-val" id="winVolumeLabel">75%</span>
          </div>
          <div class="win-action-section-title">DISPLAY THEME PRESETS</div>
          <div class="win-action-tiles-grid">
            <button class="win-action-tile is-active" data-action-theme="dark" type="button">
              <span>💻</span>
              <b>Cyber Dark</b>
            </button>
            <button class="win-action-tile" data-action-theme="matrix" type="button">
              <span>⚡</span>
              <b>Matrix Green</b>
            </button>
            <button class="win-action-tile" data-action-theme="amber" type="button">
              <span>📟</span>
              <b>Amber CRT</b>
            </button>
            <button class="win-action-tile" data-action-theme="light" type="button">
              <span>☀️</span>
              <b>Paper Light</b>
            </button>
          </div>
          <div class="win-action-section-title">QUICK SHORTCUTS</div>
          <div class="win-action-tiles-grid">
            <button class="win-action-tile" id="winActionMuteBtn" type="button">
              <span>🔇</span>
              <b>Audio Mute</b>
            </button>
            <button class="win-action-tile" id="winActionTerminalBtn" type="button">
              <span>&gt;_</span>
              <b>Terminal</b>
            </button>
            <button class="win-action-tile" id="winActionReturnRoomBtn" type="button" style="grid-column: span 2; border-color: #38bdf8;">
              <span>⏻</span>
              <b style="color: #38bdf8;">Exit to 3D Bench</b>
            </button>
          </div>
          <div class="win-action-telemetry">
            <div><span>HOST:</span> <b>JAIJITESH-WORKSTATION-X1</b></div>
            <div><span>CFD ACCEL:</span> <b>LBM D2Q9 ACTIVE (60 FPS)</b></div>
            <div><span>ROBOT LINK:</span> <b>ESP32 TELEMETRY CONNECTED</b></div>
          </div>
        </div>

        <!-- Alt+Tab HUD Window Switcher -->
        <div class="win-alttab-hud" id="winAltTabHud" hidden>
          <div class="win-alttab-title">WINDOW SWITCHER (Alt + Tab)</div>
          <div class="win-alttab-list" id="winAltTabList"></div>
        </div>

        <!-- Taskbar -->
        <div class="win-taskbar" id="winTaskbar">
          <div class="win-taskbar__start-group">
            <button class="win-start-btn" id="winStartToggleBtn" type="button" title="Start">
              <div class="win-logo-quadrant">
                <i></i><i></i><i></i><i></i>
              </div>
              <span>Start</span>
            </button>
            <div class="win-taskbar-search">
              <span>🔍</span>
              <input type="text" placeholder="Type here to search" id="winTaskbarSearchInput" />
            </div>
          </div>
          <div class="win-taskbar__tasks" id="winTaskbarItems"></div>
          <div class="win-taskbar__tray">
            <button class="win-tray-btn" id="winTraySoundBtn" type="button" title="Audio">🔊</button>
            <button class="win-tray-btn" id="winTrayThemeBtn" type="button" title="Display">◐</button>
            <div class="win-tray-clock" id="winTrayClock" title="Open Action Center">
              <span class="win-clock-time" id="winClockTime">12:00:00</span>
              <span class="win-clock-date" id="winClockDate">01/09/2026</span>
            </div>
            <button class="win-bench-exit-tray" id="winBenchExitTray" type="button" title="Return to 3D Workbench">
              ← 3D BENCH
            </button>
            <div class="win-show-desktop-bar" id="winShowDesktopBar" title="Show Desktop"></div>
          </div>
        </div>

        <!-- Lightbox Overlay for Real Project Images -->
        <div class="win-lightbox" id="winLightbox" hidden>
          <div class="win-lightbox__backdrop" id="winLightboxBackdrop"></div>
          <div class="win-lightbox__content">
            <button class="win-lightbox__close" id="winLightboxClose" type="button">&times;</button>
            <img class="win-lightbox__img" id="winLightboxImg" src="" alt="Project Evidence Preview" />
            <div class="win-lightbox__caption" id="winLightboxCaption"></div>
          </div>
        </div>

        <!-- Desktop Context Menu -->
        <div class="win-context-menu" id="winContextMenu" style="display: none; position: fixed; z-index: 99999; background: #181d24; border: 1px solid #384252; box-shadow: 0 10px 30px rgba(0,0,0,0.85); min-width: 190px; padding: 4px 0;">
          <button class="win-ctx-item" data-ctx="explorer" type="button" style="display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 14px; background: none; border: 0; color: #fff; font-size: 11.5px; text-align: left; cursor: pointer;">📁 Open File Explorer</button>
          <button class="win-ctx-item" data-ctx="terminal" type="button" style="display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 14px; background: none; border: 0; color: #fff; font-size: 11.5px; text-align: left; cursor: pointer;">🖥️ Open Command Prompt</button>
          <button class="win-ctx-item" data-ctx="timeline" type="button" style="display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 14px; background: none; border: 0; color: #fff; font-size: 11.5px; text-align: left; cursor: pointer;">📊 Open Projects Timeline</button>
          <button class="win-ctx-item" data-ctx="about" type="button" style="display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 14px; background: none; border: 0; color: #fff; font-size: 11.5px; text-align: left; cursor: pointer;">📄 View About Dossier</button>
          <div style="border-top: 1px solid #283342; margin: 4px 0;"></div>
          <button class="win-ctx-item" data-ctx="theme" type="button" style="display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 14px; background: none; border: 0; color: #fff; font-size: 11.5px; text-align: left; cursor: pointer;">◐ Toggle Display Theme</button>
          <button class="win-ctx-item" data-ctx="sound" type="button" style="display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 14px; background: none; border: 0; color: #fff; font-size: 11.5px; text-align: left; cursor: pointer;">🔊 Toggle Audio Mute</button>
          <div style="border-top: 1px solid #283342; margin: 4px 0;"></div>
          <button class="win-ctx-item" data-ctx="exit" type="button" style="display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 14px; background: none; border: 0; color: #38bdf8; font-size: 11.5px; text-align: left; cursor: pointer;">⏻ Exit to 3D Bench</button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  startClock() {
    const timeEl = this.container.querySelector('#winClockTime');
    const dateEl = this.container.querySelector('#winClockDate');
    const bigTimeEl = this.container.querySelector('#winActionBigTime');
    const bigDateEl = this.container.querySelector('#winActionBigDate');

    const update = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour12: false });
      const dateStr = now.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
      if (timeEl) timeEl.textContent = timeStr;
      if (dateEl) dateEl.textContent = dateStr;
      if (bigTimeEl) bigTimeEl.textContent = timeStr;
      if (bigDateEl) {
        bigDateEl.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      }
    };
    update();
    this.clockInterval = setInterval(update, 1000);
  }

  bindEvents() {
    const grid = this.container.querySelector('#winIconsGrid');
    const startMenu = this.container.querySelector('#winStartMenu');
    const startBtn = this.container.querySelector('#winStartToggleBtn');
    const exitBtn = this.container.querySelector('#winExitBenchBtn');
    const trayExitBtn = this.container.querySelector('#winBenchExitTray');
    const showDesktop = this.container.querySelector('#winShowDesktopBar');
    const startSearchInput = this.container.querySelector('#winStartSearchInput');
    const taskbarSearchInput = this.container.querySelector('#winTaskbarSearchInput');
    const lightbox = this.container.querySelector('#winLightbox');
    const lightboxClose = this.container.querySelector('#winLightboxClose');
    const lightboxBackdrop = this.container.querySelector('#winLightboxBackdrop');
    const surface = this.container.querySelector('#winDesktopSurface');
    const ctxMenu = this.container.querySelector('#winContextMenu');

    // Action Center Elements
    const trayClock = this.container.querySelector('#winTrayClock');
    const actionCenter = this.container.querySelector('#winActionCenter');
    const actionCenterClose = this.container.querySelector('#winActionCenterClose');
    const volumeSlider = this.container.querySelector('#winVolumeSlider');
    const volumeLabel = this.container.querySelector('#winVolumeLabel');
    const volumeIcon = this.container.querySelector('#winVolumeIcon');
    const actionMuteBtn = this.container.querySelector('#winActionMuteBtn');
    const actionTerminalBtn = this.container.querySelector('#winActionTerminalBtn');
    const actionReturnRoomBtn = this.container.querySelector('#winActionReturnRoomBtn');

    // Desktop Right-Click Context Menu
    surface?.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (!ctxMenu) return;
      ctxMenu.style.display = 'block';
      ctxMenu.style.left = `${Math.min(window.innerWidth - 210, e.clientX)}px`;
      ctxMenu.style.top = `${Math.min(window.innerHeight - 250, e.clientY)}px`;
      sound.tick(1100);
    });

    document.addEventListener('click', (e) => {
      if (ctxMenu && !ctxMenu.contains(e.target)) {
        ctxMenu.style.display = 'none';
      }
    });

    ctxMenu?.querySelectorAll('.win-ctx-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.ctx;
        ctxMenu.style.display = 'none';
        if (action === 'explorer') this.openExplorer('Projects');
        else if (action === 'terminal') this.openApp('terminal');
        else if (action === 'timeline') this.openApp('timeline');
        else if (action === 'about') this.openDocument('about');
        else if (action === 'theme') {
          const cur = document.documentElement.getAttribute('data-theme') || 'dark';
          const nxt = cur === 'dark' ? 'matrix' : (cur === 'matrix' ? 'amber' : (cur === 'amber' ? 'light' : 'dark'));
          document.documentElement.setAttribute('data-theme', nxt);
          window.set3DTheme?.(nxt);
        } else if (action === 'sound') {
          sound.toggleMute();
        } else if (action === 'exit') {
          this.onExit?.();
        }
        sound.click(600, 0.02);
      });
    });

    // Alt+Tab HUD Window Switcher & Escape Dismissal
    let isAltDown = false;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const hud = this.container.querySelector('#winAltTabHud');
        if (hud && (!hud.hidden || hud.classList.contains('is-open'))) {
          this.hideAltTabHud(false);
        } else if (lightbox && !lightbox.hidden) {
          hideLightbox();
        } else if (this.isStartOpen) {
          this.closeStartMenu();
        } else if (this.isActionCenterOpen) {
          this.closeActionCenter();
        } else if (ctxMenu && ctxMenu.style.display !== 'none') {
          ctxMenu.style.display = 'none';
        }
      } else if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        isAltDown = true;
        this.showAltTabHud();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (isAltDown && (e.key === 'Alt' || !e.altKey)) {
        isAltDown = false;
        this.hideAltTabHud(true);
      }
    });

    // Desktop icons click and double click
    grid.querySelectorAll('.win-desktop-icon').forEach(icon => {
      icon.addEventListener('click', () => {
        grid.querySelectorAll('.win-desktop-icon').forEach(i => i.classList.remove('is-selected'));
        icon.classList.add('is-selected');
        sound.tick(1200);
      });

      icon.addEventListener('dblclick', () => {
        const id = icon.dataset.id;
        const type = icon.dataset.type;
        const target = icon.dataset.target;

        if (type === 'folder') {
          this.openExplorer(target);
        } else if (type === 'app') {
          this.openApp(target);
        } else if (type === 'file') {
          this.openDocument(target);
        }
        sound.click(600, 0.03);
      });
    });

    // Start Menu toggle
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeActionCenter();
      this.toggleStartMenu();
    });

    document.addEventListener('click', (e) => {
      if (this.isStartOpen && !startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        this.closeStartMenu();
      }
      if (this.isActionCenterOpen && !actionCenter.contains(e.target) && !trayClock.contains(e.target)) {
        this.closeActionCenter();
      }
    });

    exitBtn.addEventListener('click', () => {
      sound.click(400, 0.05);
      this.onExit?.();
    });

    trayExitBtn.addEventListener('click', () => {
      sound.click(400, 0.05);
      this.onExit?.();
    });

    // Action Center toggles
    trayClock?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeStartMenu();
      this.toggleActionCenter();
    });

    actionCenterClose?.addEventListener('click', () => this.closeActionCenter());

    volumeSlider?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      sound.setVolume(val);
      const pct = Math.round(val * 100);
      if (volumeLabel) volumeLabel.textContent = `${pct}%`;
      if (volumeIcon) volumeIcon.textContent = val === 0 ? '🔇' : (val < 0.4 ? '🔉' : '🔊');
    });

    actionMuteBtn?.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      actionMuteBtn.querySelector('b').textContent = isMuted ? 'Audio Unmute' : 'Audio Mute';
      actionMuteBtn.querySelector('span').textContent = isMuted ? '🔊' : '🔇';
      sound.click(600, 0.02);
    });

    actionTerminalBtn?.addEventListener('click', () => {
      this.closeActionCenter();
      this.openApp('terminal');
    });

    actionReturnRoomBtn?.addEventListener('click', () => {
      this.closeActionCenter();
      this.onExit?.();
    });

    // Theme selector tiles in Action Center
    actionCenter?.querySelectorAll('[data-action-theme]').forEach(tile => {
      tile.addEventListener('click', () => {
        const t = tile.dataset.actionTheme;
        actionCenter.querySelectorAll('[data-action-theme]').forEach(i => i.classList.remove('is-active'));
        tile.classList.add('is-active');
        document.documentElement.setAttribute('data-theme', t);
        window.set3DTheme?.(t);
        sound.click(800, 0.02);
      });
    });

    const traySoundBtn = this.container.querySelector('#winTraySoundBtn');
    const trayThemeBtn = this.container.querySelector('#winTrayThemeBtn');

    traySoundBtn?.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      traySoundBtn.textContent = isMuted ? '🔇' : '🔊';
      traySoundBtn.title = isMuted ? 'Unmute Audio' : 'Mute Audio';
      sound.click(600, 0.02);
    });

    trayThemeBtn?.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'matrix' : (currentTheme === 'matrix' ? 'amber' : (currentTheme === 'amber' ? 'light' : 'dark'));
      document.documentElement.setAttribute('data-theme', nextTheme);
      window.set3DTheme?.(nextTheme);
      sound.click(750, 0.02);
    });

    showDesktop.addEventListener('click', () => {
      this.windows.forEach((win, id) => {
        this.minimizeWindow(id);
      });
      sound.click(300, 0.02);
    });

    // Start menu app launches
    startMenu.querySelectorAll('[data-launch]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openApp(btn.dataset.launch);
        this.closeStartMenu();
      });
    });

    startMenu.querySelectorAll('[data-open-doc]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openDocument(btn.dataset.openDoc);
        this.closeStartMenu();
      });
    });

    startMenu.querySelectorAll('[data-open-folder]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openExplorer(btn.dataset.openFolder);
        this.closeStartMenu();
      });
    });

    // Start menu search
    const handleSearch = (val) => {
      const q = val.trim().toLowerCase();
      const mainView = this.container.querySelector('#winStartMainView');
      const resultsView = this.container.querySelector('#winStartSearchResults');

      if (!q) {
        if (mainView) mainView.style.display = 'block';
        if (resultsView) resultsView.style.display = 'none';
        return;
      }

      if (mainView) mainView.style.display = 'none';
      if (resultsView) {
        resultsView.style.display = 'block';
        const matches = [];

        // Search projects
        Object.values(PROJECTS).forEach(p => {
          if (p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) {
            matches.push({ title: p.title, subtitle: `Project • ${p.category}`, type: 'project', id: p.id });
          }
        });

        // Search research
        Object.values(RESEARCH).forEach(r => {
          if (r.title.toLowerCase().includes(q) || r.abstract.toLowerCase().includes(q)) {
            matches.push({ title: r.title, subtitle: `Research • ${r.category}`, type: 'research', id: r.id });
          }
        });

        // Search hardware
        Object.values(HARDWARE_DEFINITIONS).forEach(h => {
          if (h.title.toLowerCase().includes(q) || h.summary.toLowerCase().includes(q)) {
            matches.push({ title: h.title, subtitle: `Hardware CAD • ${h.cadId}`, type: 'hardware', id: h.id });
          }
        });

        if (matches.length === 0) {
          resultsView.innerHTML = `<div style="padding: 20px; text-align: center; color: #888; font-size: 11px;">No matching records found for "${q}"</div>`;
        } else {
          resultsView.innerHTML = matches.map(m => `
            <button class="win-start-recent-item" data-search-type="${m.type}" data-search-id="${m.id}" type="button" style="width: 100%; text-align: left;">
              ${this.getIconHtml(m.type === 'project' ? 'cfd' : (m.type === 'hardware' ? 'cad' : 'pdf'))}
              <div>
                <b>${m.title}</b>
                <small>${m.subtitle}</small>
              </div>
            </button>
          `).join('');

          resultsView.querySelectorAll('.win-start-recent-item').forEach(item => {
            item.addEventListener('click', () => {
              const type = item.dataset.searchType;
              const id = item.dataset.searchId;
              this.closeStartMenu();
              if (type === 'project') this.openApp(id);
              else if (type === 'research') this.openDocument(id);
              else if (type === 'hardware') {
                this.onHardwareInspect?.(id);
                this.onExit?.();
              }
            });
          });
        }
      }
    };

    startSearchInput?.addEventListener('input', (e) => handleSearch(e.target.value));

    // Taskbar search connects to start menu
    if (taskbarSearchInput) {
      taskbarSearchInput.addEventListener('focus', () => {
        this.openStartMenu();
        setTimeout(() => startSearchInput?.focus(), 50);
      });
    }

    // Lightbox handlers
    const hideLightbox = () => {
      if (lightbox) {
        lightbox.hidden = true;
        lightbox.classList.remove('is-open');
      }
    };

    lightboxClose?.addEventListener('click', hideLightbox);
    lightboxBackdrop?.addEventListener('click', hideLightbox);
  }

  toggleStartMenu() {
    this.isStartOpen = !this.isStartOpen;
    const startMenu = this.container.querySelector('#winStartMenu');
    const startBtn = this.container.querySelector('#winStartToggleBtn');
    startMenu?.classList.toggle('is-open', this.isStartOpen);
    startBtn?.classList.toggle('is-active', this.isStartOpen);
    sound.tick(800);
  }

  openStartMenu() {
    this.isStartOpen = true;
    const startMenu = this.container.querySelector('#winStartMenu');
    const startBtn = this.container.querySelector('#winStartToggleBtn');
    startMenu?.classList.add('is-open');
    startBtn?.classList.add('is-active');
  }

  closeStartMenu() {
    this.isStartOpen = false;
    const startMenu = this.container.querySelector('#winStartMenu');
    const startBtn = this.container.querySelector('#winStartToggleBtn');
    startMenu?.classList.remove('is-open');
    startBtn?.classList.remove('is-active');
  }

  toggleActionCenter() {
    this.isActionCenterOpen = !this.isActionCenterOpen;
    const ac = this.container.querySelector('#winActionCenter');
    if (ac) {
      ac.hidden = !this.isActionCenterOpen;
      ac.classList.toggle('is-open', this.isActionCenterOpen);
    }
    sound.tick(900);
  }

  openActionCenter() {
    this.isActionCenterOpen = true;
    const ac = this.container.querySelector('#winActionCenter');
    if (ac) {
      ac.hidden = false;
      ac.classList.add('is-open');
    }
  }

  closeActionCenter() {
    this.isActionCenterOpen = false;
    const ac = this.container.querySelector('#winActionCenter');
    if (ac) {
      ac.hidden = true;
      ac.classList.remove('is-open');
    }
  }

  showAltTabHud() {
    const hud = this.container.querySelector('#winAltTabHud');
    const list = this.container.querySelector('#winAltTabList');
    if (!hud || !list) return;

    const winEntries = Array.from(this.windows.entries());
    if (winEntries.length === 0) return;

    hud.hidden = false;
    hud.classList.add('is-open');

    const curIdx = winEntries.findIndex(([id]) => id === this.activeWindowId);
    const nextIdx = (curIdx + 1) % winEntries.length;
    const targetId = winEntries[nextIdx][0];

    list.innerHTML = winEntries.map(([id, win], idx) => {
      const isSel = idx === nextIdx;
      let title = id.replace('explorer_', '📁 ').replace('doc_', '📄 ');
      if (id === 'windsim') title = 'CFD WindSim';
      if (id === 'berry') title = 'Berry AI';
      if (id === 'berrybot') title = 'BerryBot';
      if (id === 'terminal') title = 'Command Prompt';
      if (id === 'timeline') title = 'Timeline';
      if (id === 'contact') title = 'Contact';

      return `
        <div class="win-alttab-card ${isSel ? 'is-selected' : ''}" data-win-id="${id}">
          <div class="win-alttab-card__icon">${this.getIconHtml(id.includes('explorer') ? 'folder' : (id.includes('doc') ? 'txt' : 'cmd'))}</div>
          <span class="win-alttab-card__title">${title}</span>
        </div>
      `;
    }).join('');

    this.pendingAltTabId = targetId;
    sound.tick(1300);
  }

  hideAltTabHud(commit = true) {
    const hud = this.container.querySelector('#winAltTabHud');
    if (!hud) return;
    hud.hidden = true;
    hud.classList.remove('is-open');

    if (commit && this.pendingAltTabId && this.windows.has(this.pendingAltTabId)) {
      this.restoreWindow(this.pendingAltTabId);
      sound.click(650, 0.02);
    }
    this.pendingAltTabId = null;
  }

  showLightbox(src, caption) {
    const lightbox = this.container.querySelector('#winLightbox');
    const img = this.container.querySelector('#winLightboxImg');
    const cap = this.container.querySelector('#winLightboxCaption');
    if (!lightbox || !img) return;

    img.src = src;
    if (cap) cap.textContent = caption || '';
    lightbox.hidden = false;
    lightbox.classList.add('is-open');
    sound.click(750, 0.02);
  }

  openExplorer(folderKey = 'Projects') {
    const windowId = `explorer_${folderKey.toLowerCase()}`;
    if (this.windows.has(windowId)) {
      const win = this.windows.get(windowId);
      if (win.classList.contains('is-minimized') || win.classList.contains('win-window--minimizing')) {
        this.restoreWindow(windowId);
      } else {
        this.focusWindow(windowId);
      }
      return;
    }

    const folderData = this.fileSystem[folderKey] || this.fileSystem['Projects'];
    this.currentExplorerPath = folderKey;

    this.highestZ++;
    this.windowCascadeCount = (this.windowCascadeCount || 0) + 1;
    const cascadeOffset = ((this.windowCascadeCount - 1) % 6) * 26;

    const win = document.createElement('div');
    win.className = 'win-window win-window--entering';
    win.id = `win_${windowId}`;
    win.style.zIndex = this.highestZ;
    win.style.top = `${40 + cascadeOffset}px`;
    win.style.left = `${60 + cascadeOffset}px`;
    win.style.width = '840px';
    win.style.height = '520px';

    const onEnterEnd = () => {
      win.removeEventListener('animationend', onEnterEnd);
      win.classList.remove('win-window--entering');
    };
    win.addEventListener('animationend', onEnterEnd, { once: true });
    setTimeout(onEnterEnd, 260);

    win._history = [folderKey];
    win._historyIdx = 0;

    const renderFolderContent = (key) => {
      const fData = this.fileSystem[key] || this.fileSystem['Projects'];
      const filesContainer = win.querySelector(`#winExplorerFiles_${windowId}`);
      const addressPath = win.querySelector('.win-address-path');
      const titleText = win.querySelector('.win-title-text');
      const statusBar = win.querySelector('.win-explorer-statusbar');

      if (addressPath) addressPath.textContent = fData.path;
      if (titleText) titleText.textContent = fData.title;
      if (statusBar) statusBar.innerHTML = `<span>${fData.items.length} item(s)</span><span>NTFS | Local Storage</span>`;

      // Update sidebar active item
      win.querySelectorAll('.win-side-item').forEach(s => {
        s.classList.toggle('is-active', s.dataset.side === key);
      });

      if (filesContainer) {
        filesContainer.classList.add('is-transitioning');
        setTimeout(() => {
          filesContainer.innerHTML = fData.items.map(item => `
            <div class="win-file-item" data-id="${item.id}" data-type="${item.type}" data-target="${item.target}" tabindex="0">
              ${this.getIconHtml(item.iconType)}
              <div>
                <span class="win-file-name">${item.name}</span>
                <span class="win-file-desc">${item.desc}</span>
              </div>
              <span class="win-file-size">${item.size}</span>
            </div>
          `).join('');

          filesContainer.querySelectorAll('.win-file-item').forEach(item => {
            item.addEventListener('click', () => {
              filesContainer.querySelectorAll('.win-file-item').forEach(i => i.classList.remove('is-selected'));
              item.classList.add('is-selected');
              sound.tick(1200);
            });

            item.addEventListener('dblclick', () => {
              const type = item.dataset.type;
              const target = item.dataset.target;
              if (type === 'app') {
                this.openApp(target);
              } else if (type === 'doc') {
                this.openDocument(target);
              } else if (type === 'cad') {
                this.onHardwareInspect?.(target);
                this.onExit?.();
              }
              sound.click(600, 0.03);
            });
          });

          filesContainer.classList.remove('is-transitioning');
        }, 80);
      }
    };

    win.innerHTML = `
      <div class="win-titlebar">
        <div class="win-title">
          <div class="win-title-icon">${this.getIconHtml('folder')}</div>
          <span class="win-title-text">${folderData.title}</span>
          <div class="win-titlebar__telemetry"><span class="telemetry-led"></span><span>SYS.FS // 0x4B</span></div>
        </div>
        <div class="win-controls">
          <button class="win-ctrl-btn win-ctrl-min" data-action="min" type="button" title="Minimize">—</button>
          <button class="win-ctrl-btn win-ctrl-max" data-action="max" type="button" title="Maximize">&#9633;</button>
          <button class="win-ctrl-btn win-ctrl-close" data-action="close" type="button" title="Close">&times;</button>
        </div>
      </div>
      <div class="win-explorer-toolbar">
        <div class="win-nav-buttons">
          <button class="win-tool-btn" data-nav="back" title="Back">←</button>
          <button class="win-tool-btn" data-nav="forward" title="Forward">→</button>
          <button class="win-tool-btn" data-nav="up" title="Up">↑</button>
        </div>
        <div class="win-address-bar">
          <span style="color:#888;">📁</span>
          <span class="win-address-path">${folderData.path}</span>
        </div>
        <div class="win-explorer-search">
          <span style="color:#888;">🔍</span>
          <input type="text" placeholder="Search ${folderData.title}" class="win-explorer-filter" />
        </div>
      </div>
      <div class="win-explorer-body">
        <div class="win-explorer-sidebar">
          <div class="win-side-section">Quick Access</div>
          <button class="win-side-item ${folderKey === 'Projects' ? 'is-active' : ''}" data-side="Projects" type="button">📁 Projects</button>
          <button class="win-side-item ${folderKey === 'Research' ? 'is-active' : ''}" data-side="Research" type="button">📄 Research</button>
          <button class="win-side-item ${folderKey === 'Hardware' ? 'is-active' : ''}" data-side="Hardware" type="button">⚙ Hardware 3D</button>
          <button class="win-side-item ${folderKey === 'RecycleBin' ? 'is-active' : ''}" data-side="RecycleBin" type="button">🗑 Recycle Bin</button>
          <div class="win-side-section" style="margin-top: 10px;">This PC</div>
          <div class="win-side-drive">🖴 Local System (C:)</div>
          <div class="win-side-drive">🖴 Engineering NVMe (D:)</div>
        </div>
        <div class="win-explorer-files" id="winExplorerFiles_${windowId}"></div>
      </div>
      <div class="win-explorer-statusbar">
        <span>${folderData.items.length} item(s)</span>
        <span>NTFS | Local Storage</span>
      </div>
    `;

    const layer = this.container.querySelector('#winWindowsLayer');
    layer.appendChild(win);
    this.windows.set(windowId, win);
    this.focusWindow(windowId);
    this.updateTaskbar();
    this.setupWindowInteractions(win, windowId);

    // Initial folder render
    renderFolderContent(folderKey);

    // Navigation buttons wiring
    const btnBack = win.querySelector('[data-nav="back"]');
    const btnFwd = win.querySelector('[data-nav="forward"]');
    const btnUp = win.querySelector('[data-nav="up"]');

    btnBack?.addEventListener('click', () => {
      if (win._historyIdx > 0) {
        win._historyIdx--;
        renderFolderContent(win._history[win._historyIdx]);
        sound.tick(1000);
      }
    });

    btnFwd?.addEventListener('click', () => {
      if (win._historyIdx < win._history.length - 1) {
        win._historyIdx++;
        renderFolderContent(win._history[win._historyIdx]);
        sound.tick(1000);
      }
    });

    btnUp?.addEventListener('click', () => {
      win._history.push('Projects');
      win._historyIdx = win._history.length - 1;
      renderFolderContent('Projects');
      sound.tick(1000);
    });

    // Sidebar navigation inside the same explorer window
    win.querySelectorAll('.win-side-item').forEach(side => {
      side.addEventListener('click', () => {
        const dest = side.dataset.side;
        win._history.push(dest);
        win._historyIdx = win._history.length - 1;
        renderFolderContent(dest);
        sound.tick(1100);
      });
    });

    // Explorer filter search
    const filterInput = win.querySelector('.win-explorer-filter');
    filterInput?.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      win.querySelectorAll('.win-file-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'grid' : 'none';
      });
    });
  }

  openApp(appId) {
    const windowId = appId;
    if (this.windows.has(windowId)) {
      const win = this.windows.get(windowId);
      if (win.classList.contains('is-minimized') || win.classList.contains('win-window--minimizing')) {
        this.restoreWindow(windowId);
      } else {
        this.focusWindow(windowId);
      }
      return;
    }

    let title = 'Application';
    let iconType = 'cmd';
    let defaultWidth = '920px';
    let defaultHeight = '600px';

    if (appId === 'windsim') {
      title = 'WindSim — Real-Time LBM CFD Aerodynamics Platform';
      iconType = 'wind';
      defaultWidth = '980px';
      defaultHeight = '640px';
    } else if (appId === 'berry') {
      title = 'Berry AI — Local-First Desktop Assistant';
      iconType = 'ai';
      defaultWidth = '940px';
      defaultHeight = '610px';
    } else if (appId === 'berrybot') {
      title = 'BerryBot — Tracked Autonomous Robotics Platform';
      iconType = 'robot';
      defaultWidth = '960px';
      defaultHeight = '630px';
    } else if (appId === 'impactx') {
      title = 'ImpactX 3.0 — 3rd Place Overall Hackathon Case File';
      iconType = 'txt';
      defaultWidth = '880px';
      defaultHeight = '560px';
    } else if (appId === 'farmassist') {
      title = 'FarmAssist AI — Agricultural Disease Diagnostics';
      iconType = 'txt';
      defaultWidth = '880px';
      defaultHeight = '560px';
    } else if (appId === 'vinhack') {
      title = 'VinHack 25 — Peer-to-Peer Academic Resource Exchange';
      iconType = 'txt';
      defaultWidth = '880px';
      defaultHeight = '560px';
    } else if (appId === 'terminal') {
      title = 'Command Prompt (Administrator: C:\\Windows\\System32\\cmd.exe)';
      iconType = 'cmd';
      defaultWidth = '880px';
      defaultHeight = '530px';
    } else if (appId === 'timeline') {
      title = 'Projects & Hackathons Timeline Directory';
      iconType = 'timeline';
      defaultWidth = '900px';
      defaultHeight = '560px';
    } else if (appId === 'contact') {
      title = 'Contact Dispatch — Direct Communication';
      iconType = 'mail';
      defaultWidth = '680px';
      defaultHeight = '530px';
    }

    this.highestZ++;
    this.windowCascadeCount = (this.windowCascadeCount || 0) + 1;
    const cascadeOffset = ((this.windowCascadeCount - 1) % 6) * 26;

    const win = document.createElement('div');
    win.className = 'win-window win-window--entering';
    win.id = `win_${windowId}`;
    win.style.zIndex = this.highestZ;
    win.style.top = `${32 + cascadeOffset}px`;
    win.style.left = `${48 + cascadeOffset}px`;
    win.style.width = defaultWidth;
    win.style.height = defaultHeight;

    const onEnterEnd = () => {
      win.removeEventListener('animationend', onEnterEnd);
      win.classList.remove('win-window--entering');
    };
    win.addEventListener('animationend', onEnterEnd, { once: true });
    setTimeout(onEnterEnd, 260);

    const pid = Math.floor(1000 + Math.random() * 9000);

    win.innerHTML = `
      <div class="win-titlebar">
        <div class="win-title">
          <div class="win-title-icon">${this.getIconHtml(iconType)}</div>
          <span>${title}</span>
          <div class="win-titlebar__telemetry"><span class="telemetry-led"></span><span>PID:${pid} // ACTIVE</span></div>
        </div>
        <div class="win-controls">
          <button class="win-ctrl-btn win-ctrl-min" data-action="min" type="button" title="Minimize">—</button>
          <button class="win-ctrl-btn win-ctrl-max" data-action="max" type="button" title="Maximize">&#9633;</button>
          <button class="win-ctrl-btn win-ctrl-close" data-action="close" type="button" title="Close">&times;</button>
        </div>
      </div>
      <div class="win-app-body" id="appBody_${windowId}"></div>
    `;

    const layer = this.container.querySelector('#winWindowsLayer');
    layer.appendChild(win);
    this.windows.set(windowId, win);
    this.focusWindow(windowId);
    this.updateTaskbar();
    this.setupWindowInteractions(win, windowId);

    const body = win.querySelector(`#appBody_${windowId}`);
    this.mountAppContent(appId, body);
  }

  openDocument(fileId) {
    if (PROJECTS[fileId]) {
      this.openApp(fileId);
      return;
    }

    const windowId = `doc_${fileId}`;
    if (this.windows.has(windowId)) {
      const win = this.windows.get(windowId);
      if (win.classList.contains('is-minimized') || win.classList.contains('win-window--minimizing')) {
        this.restoreWindow(windowId);
      } else {
        this.focusWindow(windowId);
      }
      return;
    }

    this.highestZ++;
    this.windowCascadeCount = (this.windowCascadeCount || 0) + 1;
    const cascadeOffset = ((this.windowCascadeCount - 1) % 6) * 26;

    const win = document.createElement('div');
    win.className = 'win-window win-window--entering';
    win.id = `win_${windowId}`;
    win.style.zIndex = this.highestZ;
    win.style.top = `${48 + cascadeOffset}px`;
    win.style.left = `${64 + cascadeOffset}px`;
    win.style.width = '800px';
    win.style.height = '540px';

    const onEnterEnd = () => {
      win.removeEventListener('animationend', onEnterEnd);
      win.classList.remove('win-window--entering');
    };
    win.addEventListener('animationend', onEnterEnd, { once: true });
    setTimeout(onEnterEnd, 260);

    const isTxt = fileId === 'about';
    const docTitle = isTxt ? 'About_Dossier.txt - Identity & Affiliation Dossier' : `${fileId}.pdf - Document Viewer`;

    win.innerHTML = `
      <div class="win-titlebar">
        <div class="win-title">
          <div class="win-title-icon">${this.getIconHtml(isTxt ? 'txt' : 'pdf')}</div>
          <span>${docTitle}</span>
          <div class="win-titlebar__telemetry"><span class="telemetry-led"></span><span>SYS.DOC // UTF-8</span></div>
        </div>
        <div class="win-controls">
          <button class="win-ctrl-btn win-ctrl-min" data-action="min" type="button" title="Minimize">—</button>
          <button class="win-ctrl-btn win-ctrl-max" data-action="max" type="button" title="Maximize">&#9633;</button>
          <button class="win-ctrl-btn win-ctrl-close" data-action="close" type="button" title="Close">&times;</button>
        </div>
      </div>
      ${isTxt ? `
        <div class="win-notepad-menu">
          <span>File</span><span>Edit</span><span>Format</span><span>View</span><span>Help</span>
        </div>
      ` : ''}
      <div class="win-app-body" id="docBody_${windowId}"></div>
    `;

    const layer = this.container.querySelector('#winWindowsLayer');
    layer.appendChild(win);
    this.windows.set(windowId, win);
    this.focusWindow(windowId);
    this.updateTaskbar();
    this.setupWindowInteractions(win, windowId);

    const body = win.querySelector(`#docBody_${windowId}`);
    if (fileId === 'about') {
      this.renderAboutDossier(body);
    } else if (fileId === 'res_color' || fileId === 'res_synth' || fileId === 'res_vision') {
      this.renderResearchDoc(fileId, body);
    } else {
      body.innerHTML = `<div style="padding: 24px; color: #fff; font-family: monospace;">Document: ${fileId}</div>`;
    }
  }

  setupWindowInteractions(win, id) {
    const titlebar = win.querySelector('.win-titlebar');

    win.addEventListener('mousedown', () => this.focusWindow(id));

    let isDragging = false;
    let startX, startY, origLeft, origTop;

    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.win-controls') || win.classList.contains('is-maximized')) return;
      isDragging = true;
      win.classList.add('is-dragging');
      startX = e.clientX;
      startY = e.clientY;
      const rect = win.getBoundingClientRect();
      const parentRect = this.container.getBoundingClientRect();
      origLeft = rect.left - parentRect.left;
      origTop = rect.top - parentRect.top;
      this.focusWindow(id);
      sound.tick(900);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      win.style.left = `${Math.max(0, origLeft + dx)}px`;
      win.style.top = `${Math.max(0, origTop + dy)}px`;
      win.style.transform = 'none';
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        win.classList.remove('is-dragging');
      }
    });

    // Window Resize Grip
    const resizer = document.createElement('div');
    resizer.className = 'win-resizer';
    resizer.style.cssText = 'position: absolute; right: 0; bottom: 0; width: 16px; height: 16px; cursor: se-resize; z-index: 20;';
    win.appendChild(resizer);

    let isResizing = false;
    let rStartX, rStartY, rStartW, rStartH;

    resizer.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      isResizing = true;
      win.classList.add('is-resizing');
      rStartX = e.clientX;
      rStartY = e.clientY;
      rStartW = win.offsetWidth;
      rStartH = win.offsetHeight;
      this.focusWindow(id);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const dw = e.clientX - rStartX;
      const dh = e.clientY - rStartY;
      win.style.width = `${Math.max(480, rStartW + dw)}px`;
      win.style.height = `${Math.max(300, rStartH + dh)}px`;
    });

    window.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        win.classList.remove('is-resizing');
      }
    });

    win.querySelector('.win-ctrl-close').addEventListener('click', () => this.closeWindow(id));
    win.querySelector('.win-ctrl-min').addEventListener('click', () => this.minimizeWindow(id));
    win.querySelector('.win-ctrl-max').addEventListener('click', () => this.toggleMaximize(win));
  }

  focusWindow(id) {
    this.activeWindowId = id;
    this.highestZ++;
    const win = this.windows.get(id);
    if (win) {
      win.style.zIndex = this.highestZ;
      this.container.querySelectorAll('.win-window').forEach(w => w.classList.remove('is-focused'));
      win.classList.add('is-focused');
      win.classList.remove('is-minimized', 'win-window--minimizing');
    }
    this.updateTaskbar();
  }

  minimizeWindow(id) {
    const win = this.windows.get(id);
    if (!win) return;
    if (win.classList.contains('is-minimized') && !win.classList.contains('win-window--minimizing')) return;

    sound.click(420, 0.02);
    win.classList.remove('win-window--restoring', 'win-window--entering');
    win.classList.add('win-window--minimizing');
    win.classList.add('is-minimized');
    this.updateTaskbar();

    const onMinEnd = () => {
      win.removeEventListener('animationend', onMinEnd);
      win.classList.remove('win-window--minimizing');
      this.updateTaskbar();
    };
    win.addEventListener('animationend', onMinEnd, { once: true });
    setTimeout(onMinEnd, 220);
  }

  restoreWindow(id) {
    const win = this.windows.get(id);
    if (!win) return;

    win.classList.remove('win-window--minimizing', 'is-minimized');
    win.classList.add('win-window--restoring');
    sound.click(520, 0.02);
    this.focusWindow(id);

    const onRestoreEnd = () => {
      win.removeEventListener('animationend', onRestoreEnd);
      win.classList.remove('win-window--restoring');
      this.updateTaskbar();
    };
    win.addEventListener('animationend', onRestoreEnd, { once: true });
    setTimeout(onRestoreEnd, 240);
  }

  toggleMaximize(win) {
    const isMax = win.classList.toggle('is-maximized');
    const maxBtn = win.querySelector('.win-ctrl-max');
    if (isMax) {
      win.dataset.restoreTop = win.style.top;
      win.dataset.restoreLeft = win.style.left;
      win.dataset.restoreWidth = win.style.width;
      win.dataset.restoreHeight = win.style.height;
      win.style.top = '0px';
      win.style.left = '0px';
      win.style.width = '100%';
      win.style.height = 'calc(100% - 44px)';
      if (maxBtn) {
        maxBtn.innerHTML = '&#10697;';
        maxBtn.title = 'Restore Down';
      }
    } else {
      win.style.top = win.dataset.restoreTop || '40px';
      win.style.left = win.dataset.restoreLeft || '40px';
      win.style.width = win.dataset.restoreWidth || '900px';
      win.style.height = win.dataset.restoreHeight || '580px';
      if (maxBtn) {
        maxBtn.innerHTML = '&#9633;';
        maxBtn.title = 'Maximize';
      }
    }
    sound.click(650, 0.02);
  }

  closeWindow(id, { immediate = false } = {}) {
    const win = this.windows.get(id);
    if (!win) return;

    const inst = this.instances.get(id);
    if (inst?.destroy) inst.destroy();
    this.instances.delete(id);

    this.windows.delete(id);
    if (this.activeWindowId === id) {
      this.activeWindowId = null;
      const remaining = Array.from(this.windows.keys());
      if (remaining.length > 0) {
        this.focusWindow(remaining[remaining.length - 1]);
      }
    }
    sound.click(320, 0.03);
    this.updateTaskbar();

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (immediate || prefersReduced) {
      win.remove();
      return;
    }

    win.style.pointerEvents = 'none';
    win.classList.remove('win-window--entering', 'win-window--restoring', 'win-window--minimizing');
    win.classList.add('win-window--closing');

    const onEnd = () => {
      win.removeEventListener('animationend', onEnd);
      win.remove();
    };
    win.addEventListener('animationend', onEnd, { once: true });
    setTimeout(onEnd, 180);
  }

  updateTaskbar() {
    const taskbar = this.container.querySelector('#winTaskbarItems');
    if (!taskbar) return;

    taskbar.innerHTML = Array.from(this.windows.keys()).map(id => {
      const isFocused = this.activeWindowId === id;
      const isMin = this.windows.get(id)?.classList.contains('is-minimized');
      let title = id.replace('explorer_', '📁 ').replace('doc_', '📄 ');
      if (id === 'windsim') title = 'CFD WindSim';
      if (id === 'berry') title = 'Berry AI';
      if (id === 'berrybot') title = 'BerryBot';
      if (id === 'impactx') title = 'ImpactX 3.0';
      if (id === 'farmassist') title = 'FarmAssist AI';
      if (id === 'vinhack') title = 'VinHack 25';
      if (id === 'terminal') title = 'Command Prompt';
      if (id === 'timeline') title = 'Projects Timeline';
      if (id === 'contact') title = 'Contact Dispatch';

      return `
        <button class="win-taskbar-tab ${isFocused && !isMin ? 'is-active' : ''} ${isMin ? 'is-min' : ''}" data-task-id="${id}" type="button">
          <span class="win-tab-status-dot ${isFocused && !isMin ? 'is-active' : ''}"></span>
          <span>${title}</span>
        </button>
      `;
    }).join('');

    taskbar.querySelectorAll('[data-task-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.taskId;
        const win = this.windows.get(id);
        if (!win) return;
        if (win.classList.contains('is-minimized') || win.classList.contains('win-window--minimizing')) {
          this.restoreWindow(id);
        } else if (this.activeWindowId === id) {
          this.minimizeWindow(id);
        } else {
          this.focusWindow(id);
        }
      });
    });
  }

  mountAppContent(id, body) {
    if (PROJECTS[id]) {
      this.renderProjectCaseFile(id, body);
    } else if (id === 'terminal') {
      const term = new TerminalEngine(
        body,
        (navId) => {
          if (navId === 'close_current') this.closeWindow('terminal');
          else if (PROJECTS[navId]) this.openApp(navId);
          else this.openExplorer(navId);
        },
        (cadId) => {
          this.onHardwareInspect?.(cadId);
          this.onExit?.();
        },
        (simId) => this.openApp(simId)
      );
      this.instances.set(id, term);
    } else if (id === 'timeline') {
      this.renderTimelineApp(body);
    } else if (id === 'contact') {
      this.renderContactApp(body);
    }
  }

  renderProjectCaseFile(projId, body) {
    const proj = PROJECTS[projId];
    if (!proj) return;

    const hasSim = ['windsim', 'berrybot', 'berry'].includes(projId);

    body.innerHTML = `
      <div class="project-casefile" style="display: flex; flex-direction: column; background: #111418; color: #f3f4f6; font-family: var(--font-sans, sans-serif); height: 100%; overflow: hidden;">
        <!-- Header -->
        <header style="padding: 18px 24px 14px 24px; border-bottom: 1px solid #282f38; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-shrink: 0; background: #13171d;">
          <div style="flex: 1; min-width: 260px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="font-family: var(--font-mono); font-size: 10px; font-weight: 700; color: #38bdf8; letter-spacing: 0.12em; text-transform: uppercase;">${proj.badge}</span>
              <span style="color: #64748b; font-size: 11px;">•</span>
              <span style="color: #8b949e; font-size: 11px; font-family: var(--font-mono);">${proj.year}</span>
            </div>
            <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 4px 0; color: #ffffff; letter-spacing: -0.01em;">${proj.title}</h1>
            <p style="font-size: 12px; color: #8b949e; margin: 0; line-height: 1.45;">${proj.subtitle}</p>
          </div>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            ${proj.demo ? `
              <a href="${proj.demo}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #38bdf8; color: #090b0d; text-decoration: none; font-size: 10.5px; font-weight: 700; font-family: var(--font-mono); letter-spacing: 0.06em;">
                <span>LIVE DEMO</span>
                <span>↗</span>
              </a>
            ` : ''}
            ${proj.github ? `
              <a href="${proj.github}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #1c222b; border: 1px solid #384252; color: #f3f4f6; text-decoration: none; font-size: 10.5px; font-weight: 600; font-family: var(--font-mono); letter-spacing: 0.06em;">
                <span>GITHUB REPO</span>
                <span>↗</span>
              </a>
            ` : ''}
          </div>
        </header>

        <!-- Tabbed Navigation Bar -->
        <div class="win-app-nav-tabs">
          ${hasSim ? `
            <button class="win-tab-btn is-active" data-target-tab="sim" type="button">
              <span>⚡</span>
              <span>LIVE SIMULATOR</span>
            </button>
            <button class="win-tab-btn" data-target-tab="dossier" type="button">
              <span>📋</span>
              <span>TECHNICAL DOSSIER</span>
            </button>
            <button class="win-tab-btn" data-target-tab="evidence" type="button">
              <span>🖼️</span>
              <span>EVIDENCE &amp; SCHEMATICS (${proj.images ? proj.images.length : 0})</span>
            </button>
          ` : `
            <button class="win-tab-btn is-active" data-target-tab="dossier" type="button">
              <span>📋</span>
              <span>TECHNICAL DOSSIER</span>
            </button>
            <button class="win-tab-btn" data-target-tab="evidence" type="button">
              <span>🖼️</span>
              <span>EVIDENCE &amp; SPECIFICATIONS (${proj.images ? proj.images.length : 0})</span>
            </button>
          `}
        </div>

        <!-- Tab Panels Container -->
        <div class="win-tab-content" style="flex: 1; overflow: hidden; position: relative;">
          ${hasSim ? `
            <!-- Panel 1: Simulation-First Experience -->
            <div class="win-tab-panel is-active" id="winTabPanel_sim" style="height: 100%; display: flex; flex-direction: column;">
              <div id="simMount_${projId}" style="flex: 1; min-height: 480px; background: #0c0f13; position: relative;"></div>
            </div>
          ` : ''}

          <!-- Panel 2: Technical Dossier -->
          <div class="win-tab-panel ${!hasSim ? 'is-active' : ''}" id="winTabPanel_dossier" style="height: 100%; overflow-y: auto; padding: 24px 28px;">
            <div style="display: grid; grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr); gap: 24px; margin-bottom: 24px;">
              <!-- Left Column -->
              <div style="display: grid; gap: 20px;">
                <div>
                  <h2 style="font-size: 11px; font-family: var(--font-mono); font-weight: 700; color: #38bdf8; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 8px 0;">01 // PROBLEM STATEMENT &amp; OBJECTIVE</h2>
                  <div style="background: #161b22; border: 1px solid #262f3d; padding: 16px; font-size: 12.5px; line-height: 1.6; color: #cbd5e1;">
                    <p style="margin: 0 0 10px 0;">${proj.problem}</p>
                    <p style="margin: 0; color: #94a3b8;"><b style="color: #38bdf8;">Engineering Solution:</b> ${proj.solution}</p>
                  </div>
                </div>

                <div>
                  <h2 style="font-size: 11px; font-family: var(--font-mono); font-weight: 700; color: #38bdf8; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 8px 0;">02 // SYSTEM ARCHITECTURE &amp; SUBSYSTEMS</h2>
                  <div style="display: grid; gap: 10px;">
                    ${proj.architecture.map((arch) => `
                      <div style="background: #161b22; border: 1px solid #262f3d; border-left: 3px solid #38bdf8; padding: 12px 16px;">
                        <b style="display: block; color: #ffffff; font-size: 12px; margin-bottom: 4px; font-family: var(--font-mono);">${arch.name}</b>
                        <span style="font-size: 11.5px; color: #94a3b8; line-height: 1.5;">${arch.detail}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div>
                  <h2 style="font-size: 11px; font-family: var(--font-mono); font-weight: 700; color: #38bdf8; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 8px 0;">03 // PERSONAL ENGINEERING CONTRIBUTION</h2>
                  <div style="background: #161b22; border: 1px solid #262f3d; padding: 14px 16px; font-size: 12px; line-height: 1.6; color: #cbd5e1;">
                    ${proj.contribution}
                  </div>
                </div>
              </div>

              <!-- Right Column -->
              <div style="display: grid; gap: 20px; align-content: start;">
                <div>
                  <h2 style="font-size: 11px; font-family: var(--font-mono); font-weight: 700; color: #38bdf8; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 8px 0;">SYSTEM METADATA</h2>
                  <div style="background: #161b22; border: 1px solid #262f3d; padding: 14px;">
                    <dl style="margin: 0; display: grid; grid-template-columns: 85px 1fr; gap: 8px 10px; font-size: 11px;">
                      <dt style="color: #64748b; font-family: var(--font-mono);">ROLE</dt>
                      <dd style="margin: 0; color: #fff; font-weight: 500;">${proj.role}</dd>
                      <dt style="color: #64748b; font-family: var(--font-mono);">YEAR</dt>
                      <dd style="margin: 0; color: #fff;">${proj.year}</dd>
                      <dt style="color: #64748b; font-family: var(--font-mono);">STATUS</dt>
                      <dd style="margin: 0; color: #38ef7d; font-weight: 600;">${proj.status}</dd>
                      ${proj.specs ? proj.specs.map(([k, v]) => `
                        <dt style="color: #64748b; font-family: var(--font-mono);">${k}</dt>
                        <dd style="margin: 0; color: #e2e8f0;">${v}</dd>
                      `).join('') : ''}
                    </dl>
                  </div>
                </div>

                <div>
                  <h2 style="font-size: 11px; font-family: var(--font-mono); font-weight: 700; color: #38bdf8; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 8px 0;">TECHNOLOGIES</h2>
                  <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${proj.technologies.map(t => `
                      <span style="padding: 3px 8px; background: #161b22; border: 1px solid #262f3d; font-family: var(--font-mono); font-size: 10px; color: #94a3b8;">${t}</span>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Panel 3: Evidence & Schematics -->
          <div class="win-tab-panel" id="winTabPanel_evidence" style="height: 100%; overflow-y: auto; padding: 24px 28px;">
            ${proj.images && proj.images.length > 0 ? `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <h2 style="font-size: 11px; font-family: var(--font-mono); font-weight: 700; color: #38bdf8; letter-spacing: 0.1em; text-transform: uppercase; margin: 0;">
                  VISUAL ARTIFACTS, CAD SCHEMATICS &amp; FIELD OUTPUTS
                </h2>
                <span style="font-size: 10px; font-family: var(--font-mono); color: #64748b;">CLICK IMAGE TO EXPAND LIGHTBOX</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
                ${proj.images.map(img => `
                  <div class="casefile-evidence-card" data-img-src="${img.url}" data-img-cap="${img.caption}" style="background: #161b22; border: 1px solid #262f3d; cursor: pointer; overflow: hidden; transition: border-color 0.2s ease;">
                    <div style="width: 100%; height: 180px; background: #0b0d10; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                      <img src="${img.url}" alt="${img.caption}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.style.display='none'" />
                    </div>
                    <div style="padding: 10px 14px; font-size: 11px; color: #94a3b8; line-height: 1.4; border-top: 1px solid #202733;">
                      ${img.caption}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div style="padding: 30px; text-align: center; color: #64748b; font-family: var(--font-mono); font-size: 11px;">
                ALL VERIFIED ARTIFACTS FOR THIS SYSTEM ARE ARCHIVED AS CODE AND SCHEMATIC SPECIFICATIONS IN THE TECHNICAL DOSSIER.
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    // Tab navigation logic
    body.querySelectorAll('.win-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.targetTab;
        body.querySelectorAll('.win-tab-btn').forEach(b => b.classList.remove('is-active'));
        body.querySelectorAll('.win-tab-panel').forEach(p => p.classList.remove('is-active'));
        btn.classList.add('is-active');
        const activePanel = body.querySelector(`#winTabPanel_${target}`);
        if (activePanel) activePanel.classList.add('is-active');
        sound.tick(1100);
      });
    });

    // Evidence image lightboxes
    body.querySelectorAll('.casefile-evidence-card').forEach(card => {
      card.addEventListener('click', () => {
        this.showLightbox(card.dataset.imgSrc, card.dataset.imgCap);
      });
    });

    // Mount interactive simulation engine
    if (projId === 'windsim') {
      const mount = body.querySelector(`#simMount_${projId}`);
      if (mount) {
        const sim = new WindSimulator(mount);
        this.instances.set(projId, sim);
      }
    } else if (projId === 'berrybot') {
      const mount = body.querySelector(`#simMount_${projId}`);
      if (mount) {
        const sim = new RobotSimulator(mount);
        this.instances.set(projId, sim);
      }
    } else if (projId === 'berry') {
      const mount = body.querySelector(`#simMount_${projId}`);
      if (mount) {
        const sim = new AgentSimulator(mount);
        this.instances.set(projId, sim);
      }
    }
  }

  renderAboutDossier(body) {
    body.innerHTML = `
      <div style="padding: 24px 28px; background: #111418; color: #f3f4f6; font-family: var(--font-sans, sans-serif); height: 100%; overflow-y: auto;">
        <!-- Header Banner -->
        <div style="border-bottom: 1px solid #282f38; padding-bottom: 18px; margin-bottom: 20px; display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap;">
          <div style="width: 130px; height: 170px; background: #181d24; border: 1px solid #384252; overflow: hidden; flex-shrink: 0;">
            <img src="${IDENTITY.portraitImage}" alt="${IDENTITY.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<div style=\\'display:grid;place-items:center;height:100%;font-size:10px;font-family:monospace;color:#888;\\'>PERSONNEL ID</div>'" />
          </div>
          <div style="flex: 1; min-width: 250px;">
            <div style="font-family: var(--font-mono); font-size: 10px; color: #38bdf8; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px;">PERSONNEL DOSSIER // SYS-ID: JAIJITESH-01</div>
            <h1 style="font-size: 22px; font-weight: 600; margin: 0 0 4px 0; color: #ffffff;">${IDENTITY.name}</h1>
            <p style="font-size: 12px; color: #8b949e; margin: 0 0 10px 0; line-height: 1.45;">
              ${IDENTITY.degree} • ${IDENTITY.university} (${IDENTITY.cohort})
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              <span style="padding: 3px 8px; background: #182029; border: 1px solid #2d3b4d; font-family: var(--font-mono); font-size: 10px; color: #38bdf8;">LOCATION: ${IDENTITY.location}</span>
              <span style="padding: 3px 8px; background: #182029; border: 1px solid #2d3b4d; font-family: var(--font-mono); font-size: 10px; color: #38ef7d;">STATUS: ACTIVE</span>
            </div>
          </div>
        </div>

        <!-- Dossier Pillars Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-bottom: 20px;">
          ${IDENTITY.pillars.map((pil, idx) => `
            <div style="background: #161b22; border: 1px solid #262f3d; padding: 14px 16px;">
              <div style="font-family: var(--font-mono); font-size: 9px; color: #38bdf8; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px;">PILLAR 0${idx + 1} // ${pil.tag}</div>
              <b style="display: block; font-size: 12.5px; color: #ffffff; margin-bottom: 4px;">${pil.title}</b>
              <p style="font-size: 11px; color: #94a3b8; margin: 0; line-height: 1.45;">${pil.desc}</p>
            </div>
          `).join('')}
        </div>

        <!-- Technical Affiliations & Contact Dispatch -->
        <div style="background: #161b22; border: 1px solid #262f3d; padding: 18px; margin-bottom: 20px;">
          <h3 style="font-size: 11px; font-family: var(--font-mono); font-weight: 700; color: #38bdf8; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 12px 0;">VERIFIED DISPATCH &amp; CONTACT CHANNELS</h3>
          <dl style="margin: 0; display: grid; grid-template-columns: 110px 1fr; gap: 8px 12px; font-size: 11.5px;">
            <dt style="color: #64748b; font-family: var(--font-mono);">PRIMARY EMAIL</dt>
            <dd style="margin: 0;"><a href="mailto:${IDENTITY.email}" style="color: #38bdf8; text-decoration: none;">${IDENTITY.email}</a></dd>
            <dt style="color: #64748b; font-family: var(--font-mono);">PHONE</dt>
            <dd style="margin: 0; color: #e2e8f0;">${IDENTITY.phone}</dd>
            <dt style="color: #64748b; font-family: var(--font-mono);">GITHUB</dt>
            <dd style="margin: 0;"><a href="${IDENTITY.github}" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: none;">${IDENTITY.github} ↗</a></dd>
            <dt style="color: #64748b; font-family: var(--font-mono);">LINKEDIN</dt>
            <dd style="margin: 0;"><a href="${IDENTITY.linkedin}" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: none;">${IDENTITY.linkedin} ↗</a></dd>
          </dl>
        </div>

        <!-- Interests & Curiosity -->
        <div style="background: #161b22; border: 1px solid #262f3d; padding: 16px;">
          <h3 style="font-size: 10.5px; font-family: var(--font-mono); font-weight: 700; color: #8b949e; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 8px 0;">RESEARCH TOPICS &amp; ENGINEERING DOMAINS</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${IDENTITY.interests.map(int => `
              <span style="padding: 3px 8px; background: #1c222b; border: 1px solid #2d3847; font-size: 10.5px; color: #cbd5e1; font-family: var(--font-mono);">${int}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderResearchDoc(fileId, body) {
    let resKey = 'colorsplitter';
    if (fileId === 'res_synth') resKey = 'synthetic_data';
    if (fileId === 'res_vision') resKey = 'edge_vision';

    const r = RESEARCH[resKey] || RESEARCH['colorsplitter'];

    body.innerHTML = `
      <div style="padding: 24px 28px; background: #111418; color: #f3f4f6; font-family: var(--font-sans, sans-serif); height: 100%; overflow-y: auto;">
        <header style="border-bottom: 1px solid #282f38; padding-bottom: 16px; margin-bottom: 20px;">
          <div style="font-family: var(--font-mono); font-size: 10px; color: #38bdf8; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px;">${r.status}</div>
          <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 4px 0; color: #ffffff;">${r.title}</h1>
          <p style="font-size: 12px; color: #8b949e; margin: 0;">${r.subtitle} • ${r.group}</p>
        </header>

        <div style="display: grid; gap: 18px; margin-bottom: 20px;">
          <div>
            <h2 style="font-size: 11px; font-family: var(--font-mono); font-weight: 700; color: #38bdf8; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 6px 0;">ABSTRACT &amp; PROBLEM FORMULATION</h2>
            <div style="background: #161b22; border: 1px solid #262f3d; padding: 16px; font-size: 12px; line-height: 1.6; color: #cbd5e1;">
              ${r.abstract}
            </div>
          </div>

          <div>
            <h2 style="font-size: 11px; font-family: var(--font-mono); font-weight: 700; color: #38bdf8; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 6px 0;">METHODOLOGY &amp; MATHEMATICAL ALGORITHMS</h2>
            <div style="background: #161b22; border: 1px solid #262f3d; padding: 16px; font-size: 12px; line-height: 1.6; color: #cbd5e1;">
              ${r.method}
            </div>
          </div>
        </div>

        ${r.images && r.images.length > 0 ? `
          <div style="border-top: 1px solid #282f38; padding-top: 18px;">
            <h2 style="font-size: 11px; font-family: var(--font-mono); font-weight: 700; color: #38bdf8; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 10px 0;">EXPERIMENTAL UI &amp; OUTPUT EVIDENCE</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
              ${r.images.map(img => `
                <div class="casefile-evidence-card" data-img-src="${img.url}" data-img-cap="${img.caption}" style="background: #161b22; border: 1px solid #262f3d; cursor: pointer; overflow: hidden;">
                  <img src="${img.url}" alt="${img.caption}" style="width: 100%; height: auto; display: block;" />
                  <div style="padding: 8px 12px; font-size: 10.5px; color: #8b949e; border-top: 1px solid #262f3d;">${img.caption}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    body.querySelectorAll('.casefile-evidence-card').forEach(card => {
      card.addEventListener('click', () => {
        this.showLightbox(card.dataset.imgSrc, card.dataset.imgCap);
      });
    });
  }

  renderTimelineApp(body) {
    body.innerHTML = `
      <div style="padding: 24px 28px; background: #111418; color: #f3f4f6; font-family: var(--font-sans, sans-serif); height: 100%; overflow-y: auto;">
        <header style="border-bottom: 1px solid #282f38; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="font-family: var(--font-mono); font-size: 10px; color: #c2185b; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px;">DEVELOPMENTAL CHRONOLOGY</div>
            <h1 style="font-size: 20px; font-weight: 600; margin: 0; color: #ffffff;">Projects &amp; Hackathons Timeline</h1>
          </div>
          <a href="${IDENTITY.github}" target="_blank" rel="noopener noreferrer" style="padding: 6px 14px; background: #1c222b; border: 1px solid #384252; color: #f3f4f6; text-decoration: none; font-size: 10.5px; font-family: var(--font-mono);">
            GITHUB REPOSITORY INDEX ↗
          </a>
        </header>

        <div style="display: grid; gap: 12px;">
          ${TIMELINE_MILESTONES.map(m => `
            <div class="timeline-card" data-link-type="${m.type}" data-link-target="${m.link}" style="background: #161b22; border: 1px solid #262f3d; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; gap: 16px; cursor: pointer; transition: border-color 0.2s ease;">
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span style="font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; color: #38bdf8;">${m.year}</span>
                  <span style="padding: 2px 6px; background: #1f2733; font-family: var(--font-mono); font-size: 9px; color: #94a3b8; letter-spacing: 0.08em;">${m.category}</span>
                </div>
                <b style="font-size: 13px; color: #ffffff; display: block; margin-bottom: 4px;">${m.title}</b>
                <p style="font-size: 11.5px; color: #8b949e; margin: 0; line-height: 1.45;">${m.desc}</p>
              </div>
              <div style="font-family: var(--font-mono); font-size: 11px; color: #38bdf8; display: flex; align-items: center; gap: 4px;">
                <span>OPEN</span>
                <span>→</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    body.querySelectorAll('.timeline-card').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.dataset.linkType;
        const target = card.dataset.linkTarget;
        if (type === 'project') {
          this.openApp(target);
        } else if (type === 'file') {
          this.openDocument(target);
        } else if (type === 'folder') {
          this.openExplorer(target);
        }
        sound.click(600, 0.03);
      });
    });
  }

  renderContactApp(body) {
    body.innerHTML = `
      <div style="padding: 24px; background: #14171c; color: #ffffff; font-family: var(--font-sans, sans-serif); height: 100%; overflow-y: auto;">
        <div style="font-family: var(--font-mono); font-size: 10px; color: #38bdf8; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px;">DIRECT DISPATCH CHANNEL</div>
        <h2 style="font-size: 18px; font-weight: 600; margin: 0 0 4px 0; color: #ffffff;">Contact Jaijitesh Suryaprakash</h2>
        <p style="color: #8b949e; font-size: 11.5px; margin: 0 0 16px 0;">Primary communication dispatch for engineering collaborations, research discussions, and project inquiries.</p>
        
        <form id="contactDispatchForm" style="display: grid; gap: 12px; max-width: 500px;">
          <div>
            <label style="display: block; font-family: var(--font-mono); font-size: 9.5px; color: #94a3b8; margin-bottom: 4px;">SENDER NAME</label>
            <input type="text" id="contactName" required style="width: 100%; padding: 7px 10px; background: #1c222b; border: 1px solid #2d3847; color: #ffffff; font-size: 11.5px; font-family: inherit; outline: none;" placeholder="Your Name or Organization" />
          </div>
          <div>
            <label style="display: block; font-family: var(--font-mono); font-size: 9.5px; color: #94a3b8; margin-bottom: 4px;">EMAIL ADDRESS</label>
            <input type="email" id="contactEmail" required style="width: 100%; padding: 7px 10px; background: #1c222b; border: 1px solid #2d3847; color: #ffffff; font-size: 11.5px; font-family: inherit; outline: none;" placeholder="your.email@domain.com" />
          </div>
          <div>
            <label style="display: block; font-family: var(--font-mono); font-size: 9.5px; color: #94a3b8; margin-bottom: 4px;">MESSAGE</label>
            <textarea id="contactMessage" rows="4" required style="width: 100%; padding: 7px 10px; background: #1c222b; border: 1px solid #2d3847; color: #ffffff; font-size: 11.5px; font-family: inherit; outline: none; resize: vertical;" placeholder="Type your engineering inquiry or dispatch message..."></textarea>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button type="submit" style="padding: 8px 18px; background: #38bdf8; color: #090b0d; border: 0; font-family: var(--font-mono); font-weight: 700; font-size: 10.5px; cursor: pointer; letter-spacing: 0.08em;">
              SEND DISPATCH &rarr;
            </button>
            <button type="button" id="copyEmailBtn" style="padding: 8px 12px; background: #1c222b; border: 1px solid #2d3847; color: #e2e8f0; font-family: var(--font-mono); font-size: 10.5px; cursor: pointer;">
              COPY EMAIL
            </button>
          </div>
        </form>

        <div id="contactStatusMount" style="margin-top: 14px;"></div>

        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #262f3d; display: flex; gap: 14px; font-size: 11px;">
          <a href="${IDENTITY.github}" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: none; font-family: var(--font-mono);">GitHub (${IDENTITY.handle}) ↗</a>
          <a href="${IDENTITY.linkedin}" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: none; font-family: var(--font-mono);">LinkedIn ↗</a>
          <a href="mailto:${IDENTITY.email}" style="color: #94a3b8; text-decoration: none; font-family: var(--font-mono);">${IDENTITY.email}</a>
        </div>
      </div>
    `;

    const form = body.querySelector('#contactDispatchForm');
    const copyBtn = body.querySelector('#copyEmailBtn');
    const statusMount = body.querySelector('#contactStatusMount');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = body.querySelector('#contactName')?.value;
      const email = body.querySelector('#contactEmail')?.value;
      const msg = body.querySelector('#contactMessage')?.value;
      const mailtoUrl = `mailto:${IDENTITY.email}?subject=${encodeURIComponent('Inquiry from ' + name)}&body=${encodeURIComponent(msg + '\n\nSender: ' + name + ' (' + email + ')')}`;
      window.open(mailtoUrl, '_blank');
      sound.sonarPing(900);

      if (statusMount) {
        statusMount.innerHTML = `
          <div class="win-dispatch-status">
            <b style="color: #38ef7d; display: block; margin-bottom: 2px;">✓ DISPATCH TRANSMITTED SUCCESSFULLY</b>
            <span>Default mail composer opened for <b>${IDENTITY.email}</b>. Secure inquiry record dispatched.</span>
          </div>
        `;
        setTimeout(() => { statusMount.innerHTML = ''; }, 6000);
      }
    });

    copyBtn?.addEventListener('click', () => {
      navigator.clipboard?.writeText(IDENTITY.email);
      sound.tick(1400);
      copyBtn.textContent = 'COPIED TO CLIPBOARD!';
      setTimeout(() => { copyBtn.textContent = 'COPY EMAIL'; }, 2000);
    });
  }
}
