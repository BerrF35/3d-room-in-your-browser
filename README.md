# 3D Room in Your Browser — JAIJITESH.OS

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![WebGL 2.0](https://img.shields.io/badge/WebGL-2.0-orange.svg)](https://www.khronos.org/webgl/)
[![Three.js r162](https://img.shields.io/badge/Three.js-r162-black.svg)](https://threejs.org/)
[![Asset Compression](https://img.shields.io/badge/GLB_Optimized-14.36MB_(-88.8%25)-green.svg)](assets/jaijitesh_room.glb)
[![Tests Passing](https://img.shields.io/badge/Tests-37%2F37_Passed-brightgreen.svg)](tools/test_room.js)

> **A fully interactive 3D cyberpunk engineering workstation and bedroom environment rendered in your browser.**  
> Originally created by **Jaijitesh Suryaprakash** ([@BerrF35](https://github.com/BerrF35)), preserved, optimized, and published as a high-performance standalone web experience.

**Live Demo**: [https://berrf35.github.io/3d-room-in-your-browser/](https://berrf35.github.io/3d-room-in-your-browser/)

---

## 🌌 Overview

This project is an immersive 3D interactive room experience featuring:
- **First-Person POV & Orbit Controls**: Walk freely around the room, explore the engineering workbench, Chesterfield sofa, loft bunk bed, and circular window looking out onto a cyberpunk cityscape.
- **HP Omen Workstation OS Mirroring**: Walk up to the desk or click the laptop screen to ease into a full-screen, desktop-style operating environment (**JAIJITESH.OS**) with draggable, resizable windows.
- **Physical 3D CAD Props & Telemetry Inspectors**: Inspect authentic 3D models resting in the room — the **BerryBot Tracked Autonomous Robot**, the **Raspberry Pi 4 Model B**, and the **Canon AT-1 Retro 35mm SLR Camera**.
- **Interactive Room Systems**: 3-button switchboard to toggle ceiling fixtures, ambient neon, and the operational ventilation fan.
- **Airlock Security Protocol**: Cyberpunk decontamination lockdown alert on the heavy yellow bulkhead door.

---

## ⚡ Performance & Optimization Breakdown

In earlier versions, the raw uncompressed 3D scene and 4K textures consumed ~128 MB of bandwidth, resulting in slow initial load times and high GPU VRAM consumption. Through targeted asset pipeline engineering, the scene has been optimized while maintaining 100% visual fidelity:

| Metric | Original Backup | Optimized Production | Reduction / Result |
| :--- | :--- | :--- | :--- |
| **GLB File Size** | 128.14 MB | **14.36 MB** | **-88.8%** bandwidth reduction |
| **Embedded Textures** | 71.66 MB (Raw PNG) | **9.12 MB** (WebP 2048px, q=88) | **-87.3%** texture payload |
| **Geometry Footprint**| 50.29 MB (Raw Buffer) | **5.24 MB** (Draco quantization) | **-89.6%** vertex buffer size |
| **Scene Hierarchy** | 370 Nodes, 100 Materials | **370 Nodes, 100 Materials** | **100% Preserved** (Zero node stripping) |
| **Git LFS Requirement**| Mandatory (>100MB) | **Eliminated** (Standard Git <15MB) | No LFS bandwidth quota limits |
| **Draco Decoders** | External CDN | **Local WASM (`assets/draco/`)** | Zero third-party CDN failure risk |
| **Draw Calls** | ~140 unbatched | **97 batched draw calls** | Stable 60 FPS on integrated GPUs |
| **Raycast Overhead** | Every frame (16ms) | **Throttled (80ms interval)** | ~80% CPU raycasting savings |

> **Preservation Guarantee**: Unlike blunt `gltf-transform optimize` operations that weld and flatten meshes (which breaks interactable raycast targets like `PC_0`, `propmaker`, `cam0001`, `rpi_L`, and `d1_454_block`), our targeted Draco + WebP pipeline preserved every individual mesh node, material binding, and animation clip intact.

---

## 🎮 Controls & Interactions

### Desktop Controls
| Input | Action |
| :--- | :--- |
| **W / A / S / D** | Walk forward / left / backward / right |
| **Mouse Drag / Look** | Free-look camera orientation |
| **Space / Shift** | Vertical height adjust (clamped to room bounds) |
| **E or F** | Interact with targeted object (Laptop, Switchboard, Hardware, Vault Door) |
| **Click on Laptop** | Boot into full-screen JAIJITESH.OS desktop |
| **Escape (ESC)** | Exit full-screen workstation or close hardware telemetry modal |
| **Click Canvas** | Request Pointer Lock mode for mouse look |

### Mobile & Touch Controls
- **Virtual Joystick** (Bottom-left): Move across floor planes with collision clamping.
- **Swipe Surface**: 1:1 camera rotation.
- **Action Button [E]**: Contextual interaction trigger.
- **▲ / ▼ Buttons**: Ascend / descend eye level.

---

## 🖥️ JAIJITESH.OS Desktop Applications

When focused on the HP Omen workstation, users can launch simulated engineering applications:
1. **Command Prompt (`terminal`)**: Functional CLI with system commands (`dir`, `neofetch`, `type`, `cat`, `help`, `matrix`, `clear`).
2. **WindSim LBM CFD (`windsim`)**: Real-time Lattice Boltzmann Method aerodynamic fluid simulation.
3. **BerryBot Telemetry (`berrybot`)**: ESP32 closed-loop differential track kinematics, optical encoder tracking, and S-curve profiling.
4. **Berry AI Assistant (`berry`)**: Architecture graph for local-first desktop agent systems.
5. **Projects Timeline (`timeline`)**: Interactive directory of robotics and software hackathon milestones.
6. **Contact Dispatch (`contact`)**: Direct communication form with tactile sound feedback.
7. **File Explorer (`explorer`)**: Hierarchical virtual filesystem.

---

## 🛠️ Technology Stack

- **Core**: Vanilla HTML5, CSS3, Modern JavaScript (ES Modules).
- **3D Renderer**: [Three.js r162](https://threejs.org/) with ACESFilmic Tone Mapping and sRGB color space.
- **Compression**: Google Draco Geometry Compression (`DRACOLoader` via local WebAssembly binaries).
- **Audio**: Procedural Web Audio API sound synthesis (mechanical clicks, sonar pings, power chimes).
- **Choreography**: GSAP 3.12 (camera easing transitions and window animations).
- **Test Harness**: Playwright Core automated verification suite (`tools/test_room.js`).

---

## 📁 Repository Structure

```
3d-room-in-your-browser/
├── index.html                  # Production entry point & WebGL viewport
├── app.js                      # Core 3D engine, FPOV controller, raycasting, interactions
├── style.css                   # Responsive layout, tactile HUD, cyberpunk modals
├── package.json                # Project configuration & npm scripts
├── LICENSE                     # MIT License
│
├── assets/
│   ├── jaijitesh_room.glb      # Optimized Draco/WebP room model (14.36 MB)
│   ├── draco/                  # Local Draco WebAssembly decoders
│   │   ├── draco_decoder.wasm
│   │   ├── draco_decoder.js
│   │   └── draco_wasm_wrapper.js
│   ├── images/                 # Project schematics and interface textures
│   └── cad/                    # CAD assets and schematics
│
├── js/                         # OS Subsystems & Simulators
│   ├── desktop.js              # Multi-window desktop manager & taskbar
│   ├── terminal.js             # Command Prompt terminal engine
│   ├── portfolioData.js        # Project specs & hardware definitions
│   ├── audio.js                # Procedural Web Audio API sound engine
│   ├── simWind.js              # Lattice Boltzmann CFD aerodynamics simulator
│   ├── simRobot.js             # BerryBot ESP32 kinematics simulator
│   ├── simAgent.js             # Berry AI agent visualization
│   └── tubesCursor.js          # Spline-based 3D glowing cursor tubes
│
├── tools/                      # Test Automation & Verification Oracles
│   ├── test_room.js            # 37-check Playwright automated test suite
│   ├── verify_assets.py        # Python asset integrity validator
│   └── inspect_glb.py          # GLB binary node hierarchy inspector
│
└── .github/workflows/
    └── deploy.yml              # Automated GitHub Pages deployment pipeline
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) or Python 3.8+ (for local preview server).

### Installation
```bash
# Clone the repository
git clone https://github.com/BerrF35/3d-room-in-your-browser.git
cd 3d-room-in-your-browser

# Install testing dependencies
npm install
```

### Running Locally
```bash
# Start local static development server
npm run dev
# or
python -m http.server 4173
```
Open **`http://127.0.0.1:4173/`** in your browser.

---

## 🧪 Automated Testing Oracle

The repository includes a comprehensive verification suite (`tools/test_room.js`) powered by headless Chromium/Edge:

```bash
npm test
```

### Verification Matrix (37 Deterministic Checks)
- **Suite 1: Local Asset & Model Integrity**: Validates GLB presence, size under 50 MB (standard Git compliance), valid `glTF` magic header, and local Draco WASM decoder files.
- **Suite 2: Runtime WebGL & Scene Initialization**: Confirms WebGL context creation, room geometry loading, screen mesh setup, 142 interactable raycasting targets, 3 hardware objects, and renders over 336,000 triangles across 97 draw calls.
- **Suite 3: Room Controls & Interactions**: Tests WASD movement physics, switchboard systems toggle, and the cyberpunk decontamination airlock alert.
- **Suite 4: Hardware Telemetry Inspector**: Confirms modal inspection of the Raspberry Pi 4, BerryBot Chassis, and Canon AT-1 Camera.
- **Suite 5: Laptop Focus & JAIJITESH.OS**: Tests cinematic camera easing, OS desktop boot, launching and closing 6 applications, and exiting back to the room orbit.
- **Suite 6: Multi-Viewport Responsive Integrity**: Tests dynamic resizing across Mobile (iPhone 13 - 390px), Tablet (iPad Mini - 768px), and Desktop (1440px).
- **Suite 7: Console Cleanliness**: Asserts zero unhandled exceptions, zero WebGL runtime errors, and zero failed network requests.

---

## 🌐 Deployment to GitHub Pages

This project is configured for automated continuous deployment to GitHub Pages using GitHub Actions:

1. Push changes to the `main` branch.
2. In your GitHub repository settings, go to **Settings > Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. The workflow defined in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) automatically builds and publishes the site to `https://berrf35.github.io/3d-room-in-your-browser/`.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Jaijitesh Suryaprakash J.
