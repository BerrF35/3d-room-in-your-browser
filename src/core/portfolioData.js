/**
 * JAIJITESH.OS — CANONICAL PORTFOLIO DATA ARCHITECTURE
 * Centralized Single Source of Truth for all Systems (3D Bench, OS Desktop, Explorer, Terminal, Timeline)
 * Authoritative content verified against official GitHub repositories (@BerrF35) and LinkedIn profile.
 */

export const IDENTITY = {
  name: 'Jaijitesh Suryaprakash',
  handle: 'BerrF35',
  university: 'Vellore Institute of Technology (VIT Vellore)',
  degree: 'B.Tech Information Technology',
  regNo: '25BIT0235',
  cohort: '2025 – 2029',
  location: 'Vellore, Tamil Nadu, India (+05:30 IST)',
  email: 'jaijiteshsp@gmail.com',
  phone: '+91 9940970749',
  github: 'https://github.com/BerrF35',
  linkedin: 'https://www.linkedin.com/in/jaijitesh',
  website: 'https://jaijitesh.runs-on.dev',
  portraitImage: 'assets/images/profile/portrait_full_body.jpg',
  tagline: 'Information Technology Undergrad @ VIT Vellore | Software Engineering & Systems Architecture',
  summary: 'Systems thinker, software engineer, and robotics builder. Focused on high-performance platforms, real-time Lattice Boltzmann Method (LBM D2Q9) CFD aerodynamics, 12-layer embedded robot operating firmware, operating system simulation environments, and local-first AI agent architectures.',
  pillars: [
    {
      title: 'Scientific Simulation & CFD',
      desc: 'Real-time Lattice Boltzmann Method (LBM D2Q9) aerodynamic solvers running 60 FPS in WebGL with interactive NACA airfoil analysis (WindSim).',
      tag: 'SIMULATION'
    },
    {
      title: 'Autonomous Robotics & Firmware',
      desc: '12-layer embedded robot OS on dual-core ESP32 (AutoBot) and pendulum-driven spherical robotics (BALLZ) with 20kHz FreeRTOS PWM and IMU fusion.',
      tag: 'ROBOTICS'
    },
    {
      title: 'Systems Engineering & OS Architecture',
      desc: 'Visual File Allocation Simulator (AetherOS FS-SIM) and real-time Windows Performance Monitor with native OS telemetry surfaces.',
      tag: 'SYSTEMS'
    },
    {
      title: 'Local-First AI & Perception',
      desc: 'Air-gapped desktop agents (Berry AI), from-scratch ReAct multi-hop QA (Agentic RAG), audio speech forensics (SpeakSafe), and CV automation.',
      tag: 'AGENTS & CV'
    }
  ],
  interests: [
    'Lattice Boltzmann Method (LBM D2Q9)',
    'Operating System Architecture & File Systems',
    'Autonomous Robotics & Track Kinematics',
    'FreeRTOS & Dual-Core ESP32 Firmware',
    'SolidWorks CAD & Mechanical Engineering',
    'Local-First LLMs & Agentic ReAct Loops',
    'Audio Signal Processing & Forensic Voice Analysis',
    'Optical Sensing & Spectral Decomposition',
    'Astronomy, Optics & Space Systems'
  ]
};

export const PROJECTS = {
  windsim: {
    id: 'windsim',
    title: 'WindSim',
    subtitle: 'Browser-Native LBM CFD Aerodynamics Platform',
    category: 'Computational Physics & Aerodynamics',
    badge: 'BEST WORK // FLAGSHIP',
    year: '2025 – 2026',
    role: 'Sole Creator & Lead Engineer',
    team: 'Solo Project',
    status: 'Active Production / Live',
    github: 'https://github.com/BerrF35/Windsim',
    demo: 'https://berrf35.github.io/Windsim/',
    summary: 'A real-time, browser-native 2D computational fluid dynamics aerodynamic analysis platform powered by the discrete Lattice Boltzmann Method (LBM D2Q9). Features real-time reduced-order wind tunnel simulation, discrete BGK collision modeling, boundary layer separation visualization, and NACA airfoil aerodynamic coefficient analysis (C_L, C_D, L/D).',
    problem: 'Traditional Navier-Stokes CFD solvers (e.g. OpenFOAM, ANSYS Fluent) are computationally heavy, non-interactive, and run on offline clusters, creating high latency in early aerodynamic concept iteration and intuition building.',
    solution: 'Designed a real-time, browser-native 2D Lattice Boltzmann CFD platform using the discrete D2Q9 lattice velocity discretization with BGK (Bhatnagar-Gross-Krook) single-relaxation-time collision operator, achieving deterministic 60 FPS aerodynamics analysis directly in WebGL.',
    contribution: 'Wrote the complete LBM D2Q9 streaming & collision solver from scratch in JavaScript/GLSL, formulated Zou-He velocity and open boundary conditions, implemented NACA 4-digit airfoil geometry generators, and created real-time particle streamline and dynamic pressure visualization.',
    technologies: ['JavaScript (ES Modules)', 'WebGL 2.0 / GLSL', 'HTML5 Canvas', 'LBM D2Q9 BGK', 'Zou-He Boundary Conditions', 'Numerical Physics'],
    architecture: [
      {
        name: 'D2Q9 Velocity Discretization',
        detail: 'Simulates fluid distribution functions f₀ … f₈ across 9 discrete velocity vectors on a 2D Cartesian lattice mesh.'
      },
      {
        name: 'BGK Collision Operator',
        detail: 'Relaxes particle distributions toward local Maxwell-Boltzmann equilibrium fᵢᵉᑫ governed by kinematic viscosity parameter τ.'
      },
      {
        name: 'Zou-He & Bounce-Back Boundaries',
        detail: 'Exact bounce-back boundary collisions for solid obstacle airfoils; Zou-He velocity boundaries at inlet; open anti-reflective pressure boundaries at outlet.'
      },
      {
        name: 'Aerodynamic Coefficient Extraction',
        detail: 'Integrates surface momentum exchange to calculate real-time Lift Coefficient (C_L), Drag Coefficient (C_D), and aerodynamic efficiency (L/D).'
      }
    ],
    specs: [
      ['SOLVER', 'Lattice Boltzmann Method (LBM) D2Q9'],
      ['COLLISION', 'Single-Relaxation-Time BGK (1/τ)'],
      ['COMPUTE', 'WebGL 2.0 / GPU Accelerated Canvas'],
      ['TARGETS', 'NACA 0012, NACA 2412, Cylinders, Custom'],
      ['FRAME RATE', '60 FPS Real-Time Deterministic'],
      ['METRICS', 'Re, Dynamic Pressure q, C_L, C_D, L/D'],
      ['SOURCE', 'GitHub (BerrF35/Windsim)']
    ],
    images: [
      {
        url: 'assets/images/projects/windsim/overview.png',
        caption: 'WindSim Primary Simulation Interface with NACA Airfoil in Airflow Tunnel'
      },
      {
        url: 'assets/images/projects/windsim/streamlines.png',
        caption: 'Real-Time Particle Streamlines and Velocity Vector Topology'
      },
      {
        url: 'assets/images/projects/windsim/pressure_field.png',
        caption: 'Dynamic Pressure Gradient Distribution across Airfoil Upper & Lower Surfaces'
      },
      {
        url: 'assets/images/projects/windsim/vorticity.png',
        caption: 'Vorticity Curl and Boundary Layer Wake Detachment'
      },
      {
        url: 'assets/images/projects/windsim/airfoil_slice.png',
        caption: 'Parametric Airfoil Geometry Generation & Grid Discretization'
      },
      {
        url: 'assets/images/projects/windsim/controls.png',
        caption: 'Aerodynamic Parameter Controls: Angle of Attack, Wind Speed, Viscosity'
      }
    ]
  },

  filesim: {
    id: 'filesim',
    title: 'File Allocation Simulator (AetherOS FS-SIM)',
    subtitle: 'Visual Simulator for Classical OS File Allocation Techniques',
    category: 'Systems Engineering & Operating Systems',
    badge: 'ACADEMIC CAPSTONE // OS PRINCIPLES',
    year: '2026',
    role: 'Lead Architect & Sole Developer',
    team: 'Academic Solo Project (25BIT0235)',
    status: 'Completed & Fully Verified',
    github: 'https://github.com/BerrF35/File-Allocation-Simulator',
    demo: null,
    summary: 'An interactive visual simulator demonstrating how operating systems manage secondary storage allocation across Contiguous, Linked, and Indexed techniques. Built with React 19, TypeScript, Vite, and Vitest, featuring an interactive 512-byte physical sector grid, transactional atomic rollback, 4-quadrant step explanations, and 3× side-by-side comparative mode.',
    problem: 'Operating system storage allocation theory is traditionally taught through static blackboard diagrams and abstract textbook formulas, making it difficult for students to visualize physical sector fragmentation, link pointer traversal overhead, and index block overflow in real time.',
    solution: 'Built an interactive, desktop-grade visual simulator (AetherOS FS-SIM) implementing genuine, transactional disk allocation algorithms. Implements First-Fit contiguous run allocation, linked pointer chains with 4-byte sector headers, and 16-pointer direct indexed block tables with atomic rollback on failure.',
    contribution: 'Designed and implemented the core storage allocation engine, wrote the complete Vitest unit test suite validating boundary conditions and fragmentation traps, created the 4-quadrant pedagogical cards (What, Why, What Changed, Trade-off), and built the 3× simultaneous comparison matrix.',
    technologies: ['React 19', 'TypeScript', 'Vite', 'Vitest', 'Vanilla CSS Design System', 'Transactional Storage Engine'],
    architecture: [
      {
        name: 'Contiguous Allocation Engine',
        detail: 'Scans free sector runs using First-Fit; demonstrates $O(1)$ random access alongside external fragmentation vulnerability during dynamic growth.'
      },
      {
        name: 'Linked Allocation Engine',
        detail: 'Scatters data blocks across non-contiguous free sectors with 4-byte forward link pointers embedded in sector headers; eliminates external fragmentation.'
      },
      {
        name: 'Indexed Allocation Engine',
        detail: 'Allocates dedicated 16-pointer direct index blocks mapping logical offsets to physical sectors; supports fast 2-hop direct access.'
      },
      {
        name: 'Transactional Rollback & 3× Mode',
        detail: 'Guarantees zero block leaks during failed writes (e.g. fragmentation traps or index overflow); simultaneously benchmarks all 3 methods on identical workloads.'
      }
    ],
    specs: [
      ['COURSE', 'Operating System Principles (VIT Vellore)'],
      ['STUDENT ID', 'Jaijitesh Suryaprakash (25BIT0235)'],
      ['ALGORITHMS', 'Contiguous (First-Fit), Linked, Indexed'],
      ['SECTOR GEOMETRY', '512 Bytes / Block (64–128 Blocks Capacity)'],
      ['INDEX CAPACITY', '16 Direct Pointers / Index Block'],
      ['TEST SUITE', 'Automated Vitest Algorithm & Invariant Suite'],
      ['SOURCE', 'GitHub (BerrF35/File-Allocation-Simulator)']
    ],
    images: []
  },

  berrybot: {
    id: 'berrybot',
    title: 'AutoBot (BerryBot)',
    subtitle: '12-Layer Autonomous Tracked Robotics Firmware & Tactical HUD',
    category: 'Autonomous Robotics & Embedded Systems',
    badge: 'EMBEDDED OS // SOLIDWORKS CAD',
    year: '2025 – 2026',
    role: 'Mechanical Designer & Firmware Architect',
    team: 'Solo Hardware & Firmware Build',
    status: 'Operational Hardware Prototype',
    github: 'https://github.com/BerrF35/AutoBot',
    demo: null,
    summary: 'A 12-layer embedded robot operating system and tactical command center engineered for dual-core ESP32-powered tracked chassis (TS100 / Waveshare). Integrates 50Hz closed-loop velocity control, 100Hz PID, quadrature encoder odometry, QMI8658 6-DOF IMU sensor fusion, autonomous waypoint path tracking, and a self-hosted 20Hz WebSocket Tactical HUD.',
    problem: 'Tracked ground vehicles suffer from non-linear friction, track slippage, motor deadbands, and sensor noise, causing open-loop heading drift and jerky speed transitions during autonomous waypoint navigation.',
    solution: 'Engineered a strictly decoupled 12-layer embedded architecture on the ESP32: Core 1 handles 100Hz PID velocity regulation, quadrature encoder PCNT counting, and IMU complementary filtering; Core 0 hosts the WiFi SoftAP and full-duplex WebSocket Tactical HUD streaming telemetry at 20Hz.',
    contribution: 'Designed the physical chassis in SolidWorks CAD (M4 tracked tractor assembly), fabricated chassis mounts and electronics decks, wrote the 12-layer FreeRTOS firmware from scratch in C++, implemented S-curve jerk-limited velocity profiling, and built the self-hosted canvas radar HUD.',
    technologies: ['ESP32-WROOM-32 (240MHz)', 'C++ / FreeRTOS', 'SolidWorks CAD', 'QMI8658 6-DOF IMU', 'INA219 Power Telemetry', 'Optical Encoders', 'WebSockets', 'HTML5 Canvas HUD'],
    architecture: [
      {
        name: 'Layers 1–3: HAL, Kinematics & Navigation',
        detail: 'Hardware abstraction for 20kHz PWM timers, discrete PID velocity controllers, and fused dead-reckoning odometry combining encoders and yaw gyro.'
      },
      {
        name: 'Layers 4–6: Perception, Behavior & Mission',
        detail: 'QMI8658 6-DOF sensor fusion, stall/tilt detection failsafes, priority behavior arbitration, and autonomous waypoint goal sequencing.'
      },
      {
        name: 'Layers 7–9: Planner, NVS Memory & CommLayer',
        detail: 'Multi-point waypoint trajectory generation, non-volatile parameter calibration storage in ESP32 flash, and full-duplex WebSocket JSON messaging.'
      },
      {
        name: 'Layers 10–12: EventBus, Scheduler & Supervisor',
        detail: 'Asynchronous pub/sub event broker, multi-rate cooperative task executive, and high-priority global safety supervisor with dynamic braking E-Stop.'
      }
    ],
    specs: [
      ['CHASSIS', 'TS100 Metal Tracked Chassis / SolidWorks M4 Assembly'],
      ['CONTROLLER', 'ESP32-WROOM-32 (Dual-Core Xtensa @ 240MHz)'],
      ['FIRMWARE ARCH', '12-Layer Decoupled Robot Operating System'],
      ['CONTROL RATE', '50Hz Closed-Loop Executive, 100Hz PID Regulation'],
      ['SENSOR FUSION', 'Dual Quadrature Encoders + QMI8658 6-DOF IMU'],
      ['POWER TELEMETRY', 'INA219 I2C High-Side Current & Voltage Monitor'],
      ['COMMAND HUD', 'Self-Hosted Web Interface via ESP32 SPIFFS (20Hz WebSockets)'],
      ['SOURCE', 'GitHub (BerrF35/AutoBot)']
    ],
    images: [
      {
        url: 'assets/images/hardware/berrybot/robot_photo_01.jpg',
        caption: 'Physical BerryBot Tracked Robot Chassis Assembly on Workshop Bench'
      },
      {
        url: 'assets/images/hardware/berrybot/robot_photo_02.jpg',
        caption: 'Side Elevation showing High-Traction Rubber Treads, Drive Sprockets & Suspension'
      },
      {
        url: 'assets/images/hardware/berrybot/robot_photo_03.jpg',
        caption: 'Internal Electronics Deck with ESP32 Controller, Motor Drivers & Power Distribution'
      }
    ]
  },

  berry: {
    id: 'berry',
    title: 'Berry AI',
    subtitle: 'Local-First Desktop AI Assistant & OS Automation Sidecar',
    category: 'Autonomous Agents & Local Systems',
    badge: 'LOCAL-FIRST // AIR-GAPPED',
    year: '2025 – 2026',
    role: 'Sole Creator & System Architect',
    team: 'Solo Project',
    status: 'Active Development',
    github: 'https://github.com/BerrF35/Berry',
    demo: null,
    summary: 'An air-gapped, local-first Python desktop assistant featuring Computer-Use Automation (CUA), persistent multi-turn vector memory, semantic tooling orchestration, and browser control relay with zero telemetry.',
    problem: 'Cloud-dependent AI assistants introduce high API latency, severe data privacy vulnerabilities, and lack native integration with local operating system windows, file systems, and CLI tools.',
    solution: 'Built an open-source, local-first Python desktop agent that runs quantized LLMs on-device (Ollama / Llama.cpp), orchestrates system tools via sub-processes, manages persistent semantic context in SQLite/ChromaDB, and automates OS tasks through CUA (Computer-Use Automation).',
    contribution: 'Designed the four-pillar agent pipeline (Core Engine, Berry CUA, Browser Relay, Berry Vault), implemented the ReAct multi-step planning loop, built local vector embeddings storage, and engineered shell/file automation relays.',
    technologies: ['Python 3.11', 'Ollama / Llama.cpp', 'ChromaDB', 'SQLite', 'FastAPI', 'WebSockets', 'AGPL-3.0'],
    architecture: [
      {
        name: '01 // Central Engine',
        detail: 'Local LLM orchestrator running quantized models on-device with sub-50ms token dispatch and multi-step tool reasoning.'
      },
      {
        name: '02 // Berry CUA (Computer-Use)',
        detail: 'Direct OS interaction sidecar capable of file editing, shell command execution, window inspection, and GUI automation.'
      },
      {
        name: '03 // Browser Relay',
        detail: 'Headless Chromium bridge for live web scraping, documentation indexing, and online research collation.'
      },
      {
        name: '04 // Berry Vault',
        detail: 'Persistent local vector memory storing developer interaction logs and codebase knowledge embeddings with hybrid search.'
      }
    ],
    specs: [
      ['ARCHITECTURE', 'Local-First Autonomous ReAct Agent Loop'],
      ['INFERENCE', 'On-Device Quantized LLMs via Ollama / Llama.cpp'],
      ['MEMORY', 'SQLite + ChromaDB Persistent Vector Vault'],
      ['AUTOMATION', 'Berry CUA (OS Shell / FS / Window Relay)'],
      ['PRIVACY', '100% Air-Gapped / Zero External Telemetry'],
      ['LICENSE', 'GNU Affero General Public License (AGPL-3.0)']
    ],
    images: [
      {
        url: 'assets/images/projects/berry_ai/hero.png',
        caption: 'Berry AI Local Assistant Interface & Real-Time Tool Execution Graph'
      }
    ]
  },

  speaksafe: {
    id: 'speaksafe',
    title: 'SpeakSafe',
    subtitle: 'AI-Generated Speech Forensics & Voice Spoofing Detector',
    category: 'Audio Signal Processing & Machine Learning',
    badge: 'VORTEX 2.0 HACKATHON',
    year: '2026',
    role: 'Lead Developer & ML Engineer',
    team: 'Hackathon Project',
    status: 'Completed Deliverable',
    github: 'https://github.com/BerrF35/speaksafe',
    demo: null,
    summary: 'An AI-generated speech forensics platform built during the Vortex 2.0 Hackathon. Extracts 12+ acoustic features (MFCCs, spectral centroid, ZCR, HNR, RMS, mel banding) to classify audio as human, AI-generated, or hybrid synthesized speech with ~91% accuracy.',
    problem: 'Rapid proliferation of neural text-to-speech (TTS) systems makes synthetic audio impersonations indistinguishable to the human ear, driving identity theft, voice fraud, and audio misinformation.',
    solution: 'Engineered a forensic audio pipeline using librosa and a calibrated GradientBoosting classifier that identifies unnatural temporal smoothness, micro-jitter suppression, and spectral distribution anomalies characteristic of synthetic voices.',
    contribution: 'Built the acoustic feature extraction pipeline in Python/librosa, trained and calibrated the GradientBoosting ensemble, engineered the live canvas spectrogram heatmap, and containerized the FastAPI backend with Docker.',
    technologies: ['Python', 'FastAPI', 'scikit-learn (GradientBoosting)', 'librosa', 'HTML5 Canvas Spectrogram', 'Docker', 'REST API'],
    architecture: [
      {
        name: 'Audio Ingestion & Preprocessing',
        detail: 'Decodes arbitrary audio formats, resamples to 16 kHz mono, and segments into 25ms Hamming-windowed analysis frames.'
      },
      {
        name: '12+ Acoustic Feature Extraction',
        detail: 'Computes MFCC coefficients, spectral centroid, zero-crossing rate (ZCR), harmonics-to-noise ratio (HNR), and RMS energy variance.'
      },
      {
        name: 'Ensemble Classification & Calibration',
        detail: 'GradientBoosting classifier outputs calibrated probabilities for Human, AI-Generated, and Spliced Hybrid voices.'
      },
      {
        name: 'Live Spectrogram & Signal Breakdown',
        detail: 'Interactive canvas heatmap visualizes frequency distribution over time with per-feature confidence metrics.'
      }
    ],
    specs: [
      ['HACKATHON', 'Vortex 2.0 Hackathon Submission'],
      ['ACCURACY', '~91% on clean audio across modern neural TTS models'],
      ['FEATURES', '12+ Acoustic Metrics (MFCC, Spectral Centroid, ZCR, HNR)'],
      ['MODES', 'File Upload Analysis, Live Mic Stream (2s Windows), REST API'],
      ['BACKEND', 'FastAPI + Uvicorn + librosa in Docker Container'],
      ['SOURCE', 'GitHub (BerrF35/speaksafe)']
    ],
    images: []
  },

  spherical_bot: {
    id: 'spherical_bot',
    title: 'Spherical Bot (BALLZ)',
    subtitle: 'Pendulum-Driven Spherical Robotics Platform & FreeRTOS Control',
    category: 'Autonomous Robotics & Embedded Systems',
    badge: 'INVERTED PENDULUM // HARDWARE BUILD',
    year: '2026',
    role: 'Mechanical Designer & Embedded Firmware Engineer',
    team: 'Solo Hardware Build',
    status: 'Operational Hardware Prototype',
    github: 'https://github.com/BerrF35/Spherical-bot-',
    demo: null,
    summary: 'An autonomous spherical robot operating inside a hollow 71cm-circumference shell. Forward and reverse propulsion is achieved by driving internal weighted wheels along the inner surface, while steering is accomplished by tilting an internal counterweight pendulum via a high-torque servo to laterally shift the center of mass.',
    problem: 'Traditional wheeled and tracked robots get easily immobilized by uneven terrain, curbs, and inverted rollover traps, limiting exploration in unstructured environments.',
    solution: 'Designed and built a self-contained spherical robot with internal pendulum drive kinematics. Runs a deterministic 200Hz control task on ESP32 Core 1 with closed-loop motor synchronization, active short-braking, servo slew rate limiting, and complementary IMU filtering.',
    contribution: 'Engineered the internal mechanical chassis with dual TT gearmotors, high-torque steering servo, and 2S LiPo power distribution; wrote the dual-core ESP32 FreeRTOS firmware with 20kHz motor PWM and encoder synchronization; built the embedded WiFi dashboard.',
    technologies: ['ESP32 (Dual-Core 240MHz)', 'C++ / FreeRTOS', 'TB6612FNG H-Bridge', 'MPU-6050 6-DOF IMU', 'INA219 Power Monitor', 'Hall Quadrature Encoders', 'WebSockets'],
    architecture: [
      {
        name: 'Pendulum Drive Kinematics',
        detail: 'Propulsion drives weighted wheels along inner shell; lateral steering swings an internal pendulum counterweight to shift center of mass and roll the sphere.'
      },
      {
        name: 'Core 1 Control Task (200 Hz)',
        detail: 'Synchronizes dual motor encoders (450 ticks/rev) with P-controller trimming, active short-braking (280ms), and 120°/s servo slew rate limiting.'
      },
      {
        name: 'Core 0 Communication & Web HUD',
        detail: 'Broadcasts WiFi SoftAP (BALLZ_TF), serves embedded HTML5 dashboard, and handles bidirectional WebSockets at 20–50 Hz with 600ms dead-man safety.'
      },
      {
        name: 'Resonance Rocking Mode',
        detail: 'Automated 1.0 Hz sinusoidal rocking cycle with 90° phase lead between drive and pendulum to shake the robot free when trapped against obstacles.'
      }
    ],
    specs: [
      ['GEOMETRY', 'Hollow Spherical Shell (~71 cm Circumference)'],
      ['CONTROLLER', 'ESP32 Dev Module (WROOM-32)'],
      ['CONTROL LOOP', '200 Hz (5 ms tick) FreeRTOS Task on Core 1'],
      ['ACTUATION', '2x TT Geared DC Motors (Encoders) + High-Torque Servo'],
      ['SENSORS', 'MPU-6050 6-DOF IMU, INA219 Current/Voltage Monitor'],
      ['POWER', '2S LiPo Battery (7.4V nominal) + 5V Buck Regulator'],
      ['SOURCE', 'GitHub (BerrF35/Spherical-bot-)']
    ],
    images: []
  },

  synthetic_data_gen: {
    id: 'synthetic_data_gen',
    title: 'Local AI Synthetic Data Generator',
    subtitle: '100% Local CLI Tool for Statistical & Constrained Tabular Synthesis',
    category: 'Data Engineering & Synthetic Datasets',
    badge: 'LOCAL CLI // CTGAN & COPULA',
    year: '2026',
    role: 'Sole Creator & Lead Developer',
    team: 'Solo Open-Source Tool',
    status: 'Maintained Open-Source Utility',
    github: 'https://github.com/BerrF35/synthetic-data-generator',
    demo: null,
    summary: 'A 100% local CLI tool for Windows, Linux, and Google Colab that ingests tabular datasets (Excel, CSV, JSON, Parquet) and generates realistic synthetic rows matching statistical distributions, inter-column correlations, and business rules without exposing private data.',
    problem: 'Sharing real-world operational datasets for machine learning or vendor benchmarking exposes sensitive personal identifiable information (PII) and violates privacy regulations.',
    solution: 'Built an offline synthesis CLI incorporating Gaussian Copula, CTGAN, TVAE, and empirical rule-based models. Features automated LLM schema reasoning via local Ollama/LM Studio servers, 20+ PII semantic detectors with Faker masking, and 2-sample Kolmogorov-Smirnov quality scorecards.',
    contribution: 'Architected the CLI workflow with subcommands (profile, analyze, benchmark, evaluate, system), implemented automated PII detection and Faker substitution, built multi-sheet styled Excel report exports, and created the Google Colab verification notebook.',
    technologies: ['Python 3.10+', 'PyTorch / CUDA', 'CTGAN / TVAE / SDV', 'Faker', 'scipy (Kolmogorov-Smirnov)', 'pandas / openpyxl', 'Ollama / LM Studio API'],
    architecture: [
      {
        name: 'Multi-Model Synthesis Engine',
        detail: 'Supports Gaussian Copula for fast linear correlations, CTGAN and TVAE for complex non-linear distributions, and rule-based fallback.'
      },
      {
        name: 'Local LLM Schema Reasoning',
        detail: 'Queries local Ollama or LM Studio servers to infer semantic column types, business constraints, and value boundaries without cloud transmission.'
      },
      {
        name: 'PII Scrubbing & Quality Scorecard',
        detail: 'Masks 20+ PII types with realistic synthetic entities; benchmarks synthetic rows against original data using KS-tests and correlation Frobenius norms.'
      }
    ],
    specs: [
      ['MODELS', 'Gaussian Copula, CTGAN, TVAE, Empirical / Faker Hybrid'],
      ['ACCELERATION', 'CUDA GPU Acceleration with automatic CPU Fallback'],
      ['INPUT/OUTPUT', 'Excel (.xlsx), CSV, JSON, Parquet'],
      ['PRIVACY', '100% Air-Gapped / Zero External Telemetry'],
      ['EVALUATION', '2-Sample Kolmogorov-Smirnov, TVD, Correlation Norms'],
      ['SOURCE', 'GitHub (BerrF35/synthetic-data-generator)']
    ],
    images: []
  },

  perfmon: {
    id: 'perfmon',
    title: 'Performance Monitor',
    subtitle: 'Real-Time Windows System Performance & Hardware Health Dashboard',
    category: 'Systems Engineering & Desktop Tools',
    badge: 'ELECTRON // SYSTEM TELEMETRY',
    year: '2026',
    role: 'Sole Creator & Lead Developer',
    team: 'Solo Project',
    status: 'Active Development',
    github: 'https://github.com/BerrF35/Performance-Monitor',
    demo: null,
    summary: 'A real-time Windows desktop system monitoring dashboard built with Electron, React, TypeScript, Tailwind CSS, Zustand, and Recharts. Tracks CPU, GPU, RAM, storage health, network throughput, thermals, and power consumption with 60-point rolling trend histories.',
    problem: 'Standard Windows Task Manager lacks customizable rolling trend visualizations, GPU power telemetry breakdown, and storage reliability metrics in a unified, modern interface.',
    solution: 'Built an Electron desktop application with a decoupled architecture: the main Node process queries native Windows OS surfaces (PowerShell, WMI/CIM, performance counters, nvidia-smi) and broadcasts typed PerformanceSnapshots over IPC to a lightweight React/Recharts renderer.',
    contribution: 'Designed the complete Electron IPC data pipeline, implemented native Windows collectors with fallback adapters for unsupported hardware, configured Zustand state stores, and built responsive SVG trend charts with Recharts.',
    technologies: ['Electron', 'React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Recharts', 'PowerShell / WMI API', 'nvidia-smi'],
    architecture: [
      {
        name: 'Decoupled IPC Telemetry Pipeline',
        detail: 'Electron main process polls native OS performance counters and emits typed PerformanceSnapshot payloads over IPC to the renderer.'
      },
      {
        name: 'Hardware Telemetry Collectors',
        detail: 'Queries nvidia-smi for dedicated GPU metrics, WMI for battery and thermals, and Get-StorageReliabilityCounter for physical drive health.'
      },
      {
        name: 'Rolling Time-Series Visualization',
        detail: 'Zustand stores maintain 60-point rolling trend arrays rendered via Recharts at fluid 60 FPS without DOM thrashing.'
      }
    ],
    specs: [
      ['PLATFORM', 'Windows 10 / 11 Desktop (Electron Host)'],
      ['MONITORED METRICS', 'CPU, GPU, RAM, Disk, Network, Thermals, Power'],
      ['COLLECTION SURFACES', 'Node os, PowerShell, WMI/CIM, nvidia-smi'],
      ['STATE & CHARTS', 'Zustand Immutable Store + Recharts 60-Point History'],
      ['SOURCE', 'GitHub (BerrF35/Performance-Monitor)']
    ],
    images: []
  },

  agentic_rag: {
    id: 'agentic_rag',
    title: 'Agentic RAG From Scratch',
    subtitle: 'Frameworkless Multi-Hop Question Answering & ReAct Reasoning Loop',
    category: 'AI Systems & Information Retrieval',
    badge: 'FRAMEWORKLESS // REACT LOOP',
    year: '2026',
    role: 'Sole Creator & Algorithm Engineer',
    team: 'Solo Project',
    status: 'Completed Deliverable',
    github: 'https://github.com/BerrF35/Agentic-RAG-Practice-Project',
    demo: null,
    summary: 'A from-scratch implementation of multi-hop question-answering using an explicit ReAct (Thought → Action → Observation) agent loop, custom TF-IDF context retriever, and tool execution registry built in pure Python without LangChain, LlamaIndex, or any prebuilt RAG framework.',
    problem: 'Off-the-shelf RAG frameworks (LangChain, CrewAI) introduce heavy abstractions that obscure retrieval mechanics, inflate prompt token costs, and make multi-hop reasoning loops difficult to inspect, debug, and evaluate.',
    solution: 'Built an explicit from-scratch agentic RAG pipeline in pure Python using only standard library data structures plus minimal LLM client wrappers. Builds fresh TF-IDF indices per question, enforces strict single-document retrieval, limits reasoning to 4 search calls, and records execution trajectories.',
    contribution: 'Wrote the custom TF-IDF indexer and cosine similarity ranker, built the ReAct action parser and execution loop, implemented automated evaluation computing Exact Match, retrieval recall, and premature-stop diagnostics across Groq, OpenRouter, and Ollama.',
    technologies: ['Python 3.11', 'TF-IDF Vectorization', 'ReAct Agent Loop', 'Groq / Ollama / OpenRouter API', 'Evaluation Metrics'],
    architecture: [
      {
        name: 'Per-Question TF-IDF Retriever',
        detail: 'Constructs an isolated TF-IDF index over each question\'s document context and ranks candidates using cosine similarity for deterministic top-1 retrieval.'
      },
      {
        name: 'Explicit ReAct Reasoning Loop',
        detail: 'Parses model actions (Search / Finish) turn-by-turn, bounds search depth to 4 iterations, and injects retrieved facts as structured observations.'
      },
      {
        name: 'Comprehensive Evaluation Pipeline',
        detail: 'Generates execution trajectory logs and computes exact match accuracy, retrieval recall, and premature-stop distributions.'
      }
    ],
    specs: [
      ['FRAMEWORK', '100% From Scratch (Zero LangChain / LlamaIndex)'],
      ['REASONING', 'Turn-by-Turn ReAct (Thought → Action → Observation)'],
      ['RETRIEVAL', 'Isolated TF-IDF Index with Cosine Similarity Ranking'],
      ['SUPPORTED LLMS', 'Groq (Llama-3.1), OpenRouter, Local Ollama'],
      ['EVALUATION', 'Exact Match, Retrieval Recall, Trajectory Analysis'],
      ['SOURCE', 'GitHub (BerrF35/Agentic-RAG-Practice-Project)']
    ],
    images: []
  },

  gesturecontrol: {
    id: 'gesturecontrol',
    title: 'GestureControlPC',
    subtitle: 'Computer Vision PC Command Automation via Gestures & Winks',
    category: 'Computer Vision & Human-Computer Interaction',
    badge: 'OPENCV & MEDIAPIPE',
    year: '2025',
    role: 'Sole Creator & Developer',
    team: 'Solo Project',
    status: 'Completed Deliverable',
    github: 'https://github.com/BerrF35/gesturecontrolpc',
    demo: null,
    summary: 'A computer vision desktop automation interface built with Python, OpenCV, and MediaPipe. Tracks hand landmarks and facial features via a standard webcam to execute Windows system commands (screen capture, screen lock, application launch) through physical hand gestures and eye winks.',
    problem: 'Interacting with desktop PCs traditionally requires continuous physical contact with keyboard and mouse, creating friction during presentations, media consumption, or hands-free environments.',
    solution: 'Developed a real-time vision pipeline tracking 21 3D hand landmarks and facial mesh landmarks with MediaPipe. Maps distinct gesture sequences (Fist → Open Hand → Fist, Index Point, Spider-Man sign) and eye winks directly to Windows system calls.',
    contribution: 'Implemented landmark feature extraction and gesture state machine in OpenCV/MediaPipe, created debounce logic to prevent accidental triggers, and integrated native Windows execution routines via rundll32 and shell commands.',
    technologies: ['Python 3.8+', 'OpenCV', 'MediaPipe', 'NumPy', 'Windows OS Automation'],
    architecture: [
      {
        name: 'MediaPipe Landmark Extraction',
        detail: 'Detects 21 3D hand joints and facial landmarks at 30 FPS from standard 720p webcam input.'
      },
      {
        name: 'Gesture State Machine',
        detail: 'Tracks transitions (e.g. Fist → Open Hand → Fist) with temporal hysteresis to eliminate false positive triggers.'
      },
      {
        name: 'System Action Dispatcher',
        detail: 'Executes native Windows commands for screen lock, Snip & Sketch capture, and browser launch via subprocesses.'
      }
    ],
    specs: [
      ['TRACKING', 'MediaPipe Hands (21 Landmarks) + Face Mesh'],
      ['CAMERA', 'Standard 720p Webcam @ 30 FPS'],
      ['GESTURES', 'Fist Toggle (Screenshot), Wink (Snip), Middle Finger (Lock), Index (Browser)'],
      ['LATENCY', 'Sub-40ms real-time perception pipeline'],
      ['SOURCE', 'GitHub (BerrF35/gesturecontrolpc)']
    ],
    images: []
  },

  impactx: {
    id: 'impactx',
    title: 'ImpactX 3.0 (Quick Gigs)',
    subtitle: 'Hyperlocal Dispatch & Real-Time Logistics Routing Engine',
    category: 'Hackathon Award Winner / Distributed Systems',
    badge: '3RD PLACE OVERALL // HACKATHON WINNER',
    year: '2026',
    role: 'Lead Developer & System Architect',
    team: 'Hackathon Team',
    status: '3rd Place Overall Winner',
    github: 'https://github.com/BerrF35',
    demo: null,
    summary: 'A high-throughput geospatial dispatch and real-time logistics routing platform built during the ImpactX 3.0 Hackathon, securing 3rd Place Overall. Features automated batch allocation, dynamic Voronoi partitioning, and WebSocket driver tracking for hyperlocal delivery networks.',
    problem: 'High-density campus and urban delivery networks suffer from suboptimal manual order allocation, high dispatch latency, and inefficient vehicle routing during peak demand spikes.',
    solution: 'Architected a real-time hyperlocal dispatch engine featuring automated batching, dynamic Voronoi-partitioned order allocation, and real-time geospatial route calculation over WebSockets.',
    contribution: 'Architected backend dispatch microservices, wrote the geospatial allocation algorithms, and built the real-time driver tracking WebSocket dashboard under 36-hour hackathon constraints.',
    technologies: ['TypeScript', 'Node.js', 'FastAPI', 'WebSockets', 'Leaflet / MapLibre', 'PostgreSQL / PostGIS'],
    architecture: [
      {
        name: 'Geospatial Dispatch Engine',
        detail: 'Clusters incoming orders geographically in sub-second timeframes and matches them to nearest available couriers using Voronoi partitioning.'
      },
      {
        name: 'Real-Time WebSocket Mesh',
        detail: 'Streams driver telemetry and route progress with bidirectional sub-50ms latency.'
      }
    ],
    specs: [
      ['AWARD', '3rd Place Overall Winner (ImpactX 3.0 Hackathon)'],
      ['ROLE', 'Lead Developer & System Architect'],
      ['PIPELINE', 'Automated Geospatial Batch Allocation & Routing'],
      ['STACK', 'TypeScript, Node.js, WebSockets, PostGIS']
    ],
    images: [
      {
        url: 'assets/images/hackathons/impactx/team.jpg',
        caption: 'ImpactX 3.0 Hackathon Team — 3rd Place Overall Award'
      }
    ]
  },

  farmassist: {
    id: 'farmassist',
    title: 'FarmAssist AI',
    subtitle: 'Edge Computer Vision Agricultural Disease Diagnostics',
    category: 'Hackathon / Edge Computer Vision',
    badge: 'YANTRA 26 CENTRAL HACK',
    year: '2026',
    role: 'Lead Developer & Model Engineer',
    team: 'Hackathon Team',
    status: 'Central Hackathon Submission',
    github: 'https://github.com/BerrF35/FarmAssist',
    demo: null,
    summary: 'An edge-deployable computer vision diagnostic system that classifies agricultural leaf pathologies in offline environments using quantized lightweight CNN models on low-power Raspberry Pi edge hardware.',
    problem: 'Smallholder farmers lack immediate access to agricultural pathologists, resulting in delayed pest/fungal identification and severe crop yield losses.',
    solution: 'Developed an edge-deployable computer vision diagnostic system that classifies leaf pathologies in offline environments using quantized lightweight CNN models on edge hardware.',
    contribution: 'Trained and quantized the crop disease classification model for low-latency edge inference on Raspberry Pi, designed the camera capture pipeline, and built the diagnostic UI.',
    technologies: ['Python', 'PyTorch', 'OpenCV', 'MobileNetV3 / ONNX Runtime', 'Raspberry Pi 4', 'Flask'],
    architecture: [
      {
        name: 'Edge Vision Pipeline',
        detail: 'Captures leaf samples via CSI camera module, performs optical contrast normalization, and runs INT8-quantized neural inference in <120ms.'
      },
      {
        name: 'Offline Field Diagnostic Interface',
        detail: 'Local web interface running directly from the Raspberry Pi access point without requiring cloud connectivity.'
      }
    ],
    specs: [
      ['EVENT', 'Yantra 26 Central Hackathon'],
      ['ROLE', 'Lead Developer & Model Engineer'],
      ['INFERENCE', 'INT8 Quantized MobileNet on Raspberry Pi 4'],
      ['DIAGNOSTICS', 'Multi-Class Foliar Pathology Classification'],
      ['SOURCE', 'GitHub (BerrF35/FarmAssist)']
    ],
    images: [
      {
        url: 'assets/images/hackathons/yantra/team.jpg',
        caption: 'FarmAssist AI Development Team at Yantra 26 Central Hackathon'
      }
    ]
  },

  vinhack: {
    id: 'vinhack',
    title: 'PustakLink (VinHack 2025)',
    subtitle: 'Peer-to-Peer Academic Resource & Book Exchange Network',
    category: 'Hackathon / Distributed Systems',
    badge: 'VINHACK 2025',
    year: '2025',
    role: 'Lead Coder & Backend Architect',
    team: 'Hackathon Team',
    status: 'Hackathon Submission',
    github: 'https://github.com/BerrF35',
    demo: null,
    summary: 'A verified peer-to-peer campus exchange network designed strictly for students to trade textbooks and hardware development kits efficiently within their university ecosystem with authenticated student trust graphs and automated escrow verification.',
    problem: 'Campus academic textbooks and hardware development kits remain idle after semester completions with high frictional resale costs.',
    solution: 'Built a verified peer-to-peer campus exchange network with authenticated student trust graphs and automated escrow exchange verification.',
    contribution: 'Designed the database relational schema, wrote the authentication & escrow state machine, and deployed the production demo.',
    technologies: ['TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'TailwindCSS'],
    architecture: [
      {
        name: 'Escrow State Machine',
        detail: 'Guarantees secure exchange verification between students with double-blind QR token handshake.'
      },
      {
        name: 'Peer Discovery Mesh',
        detail: 'Categorizes academic courses, departments, and specific book editions for instant matching.'
      }
    ],
    specs: [
      ['EVENT', 'VinHack 2025 Hackathon'],
      ['ROLE', 'Lead Coder & Backend Architect'],
      ['DOMAIN', 'Peer-to-Peer Distributed Resource Exchange'],
      ['STACK', 'TypeScript, React, Node.js, PostgreSQL']
    ],
    images: []
  }
};

export const RESEARCH = {
  colorsplitter: {
    id: 'colorsplitter',
    title: 'VIBGYOR Color Decomposer (Spectral Splitter)',
    subtitle: 'Optical Color-Space Mathematical Hue Decomposition',
    status: 'Open-Source Research Tool // GitHub Verified',
    category: 'Computer Vision & Optical Color-Space',
    group: 'Jaijitesh Suryaprakash (Solo Research Tool)',
    abstract: 'Investigates mathematical color-space transformation algorithms (RGB/HEX → HSV hue decomposition) to break down arbitrary color inputs into relative percentage components across the visible VIBGYOR spectrum summing exactly to 100%.',
    method: 'Converts input color values to HSV coordinates, isolates the angular hue on the color wheel, and computes inverse-distance linear interpolation between bounding spectral color anchors across a decoupled database of 900+ verified color names.',
    findings: 'Provides an exact mathematical hue-space decomposition for robotic vision segmentation and chromatic feature isolation without requiring physical spectrometer hardware.',
    specs: [
      ['DOMAINS', 'Color-Space Transformation, Hue Analysis, Python CLI'],
      ['INPUTS', 'Color Names (900+ database), 6-Digit HEX, RGB Triplet'],
      ['ACCURACY', 'Exact Mathematical VIBGYOR Percentage Breakdown (100% Sum)'],
      ['SOURCE', 'GitHub (BerrF35/color-splitter)']
    ],
    images: [
      {
        url: 'assets/images/research/colorsplitter/ui.png',
        caption: 'Spectral Color Splitter Image Analysis, Chromatic Decomposition & Filter Suite'
      }
    ]
  },

  synthetic_data: {
    id: 'synthetic_data',
    title: 'Local AI Synthetic Data Generation Pipeline',
    subtitle: 'Parametric Tabular Synthesis & Scene Generation for Machine Learning',
    status: 'Open-Source Tool & Active Paper in Preparation',
    category: 'Synthetic Datasets & Privacy-Preserving ML',
    group: 'Research Project with Local AI Tools & Faculty Collaboration',
    abstract: 'Explores domain randomization, generative copulas (Gaussian Copula, CTGAN, TVAE), and procedural synthetic data generation pipelines to train robust classifiers while guaranteeing complete differential privacy and zero PII leakage.',
    method: 'Combines local LLM schema reasoning (via Ollama/LM Studio) with parametric statistical distribution fitting, constraint discovery (e.g. range bounds, conditional logic), and automated Faker semantic entity masking across 20+ PII categories.',
    findings: 'Synthetically generated tabular datasets achieve statistical fidelity matching original distributions across 2-sample Kolmogorov-Smirnov and correlation Frobenius norm metrics while achieving zero identity disclosure risk.',
    specs: [
      ['TOOLS', 'Local AI Synthetic Data Generator & ImageGen Pipelines'],
      ['MODELS', 'CTGAN, TVAE, Gaussian Copula, Empirical Faker Hybrids'],
      ['PRIVACY', 'Air-Gapped Synthesis with Zero Cloud Telemetry'],
      ['SOURCE', 'GitHub (BerrF35/synthetic-data-generator & BerrF35/imagegen)']
    ],
    images: []
  },

  edge_vision: {
    id: 'edge_vision',
    title: 'Edge Vision Systems on Low-Power MCUs',
    subtitle: 'Embedded Computer Vision Algorithms for Constrained ARM Microcontrollers',
    status: 'Research Investigation & Hardware Profiling',
    category: 'Embedded Perception & Firmware',
    group: 'Academic Research Group with Faculty',
    abstract: 'Investigates sub-50ms optical flow, lightweight edge filtering, and low-latency spatial feature extraction running directly within memory-constrained microcontroller architectures (ESP32 / ARM Cortex-M).',
    method: 'Optimized integer-arithmetic spatial convolution kernels running on ARM Cortex-M / FreeRTOS hardware with zero dynamic memory allocation and fixed-point math.',
    findings: 'Enables real-time obstacle avoidance and visual odometry on sub-watt embedded hardware nodes without requiring full single-board computer power overhead.',
    specs: [
      ['DOMAINS', 'Embedded Perception, ARM Microcontrollers, FreeRTOS'],
      ['STATUS', 'Algorithm Optimization & Hardware Profiling'],
      ['APPLICATIONS', 'Autonomous Robotics & Edge Diagnostics']
    ],
    images: []
  }
};

export const HARDWARE_DEFINITIONS = {
  robot: {
    id: 'robot',
    file: 'assets/chassis.glb',
    title: 'AUTOBOT // 12-LAYER TRACKED ROBOTICS PLATFORM',
    eyebrow: 'PHYSICAL 3D MODEL // SOLIDWORKS CAD ASSEMBLY',
    category: 'AUTONOMOUS ROBOTICS',
    summary: 'A tracked autonomous robotics platform designed and built by Jaijitesh around a dual-core ESP32 controller. Powered by a 12-layer embedded robot operating system with optical quadrature encoders, 20kHz PWM H-bridge drivers, QMI8658 6-DOF IMU fusion, S-curve trajectory profiling, and a self-hosted 20Hz WebSocket Tactical HUD.',
    specs: [
      ['CONTROLLER', 'ESP-WROOM-32 (Dual-Core Xtensa 240MHz)'],
      ['FIRMWARE', '12-Layer Decoupled Robot OS (50Hz Executive, 100Hz PID)'],
      ['KINEMATICS', 'Differential Track Drive w/ S-Curve Acceleration Smoothing'],
      ['SENSORS', 'Optical Quadrature Encoders + QMI8658 6-DOF IMU + INA219'],
      ['CAPABILITIES', 'Waypoint Navigation, Return-To-Home, Tactical WebSocket HUD'],
      ['CAD SOURCE', 'SolidWorks CAD Assembly (TV_ensemble / M4 / TS100)']
    ],
    scale: 0.30,
    isGroundedOnFloor: false,
    benchPosition: { x: -3.22, y: 0.380, z: -0.05 },
    benchRotation: { x: 0, y: 1.57, z: 0 },
    projectId: 'berrybot'
  },

  spherical_bot: {
    id: 'spherical_bot',
    file: 'assets/chassis.glb',
    title: 'SPHERICAL BOT (BALLZ) // PENDULUM ROBOT',
    eyebrow: 'HARDWARE PLATFORM // ESP32 INVERTED PENDULUM',
    category: 'AUTONOMOUS ROBOTICS',
    summary: 'A spherical robot operating inside a hollow 71cm-circumference shell. Uses internal weighted DC gearmotors for forward/reverse roll and an internal servo-tilted pendulum counterweight for lateral steering, driven by an ESP32 FreeRTOS 200Hz control task.',
    specs: [
      ['CONTROLLER', 'ESP32 Dev Module (WROOM-32)'],
      ['CONTROL RATE', '200 Hz (5 ms tick) FreeRTOS Task on Core 1'],
      ['KINEMATICS', 'Internal Weighted Wheels Propulsion + Servo Pendulum Steering'],
      ['SENSORS', 'MPU-6050 6-DOF IMU + INA219 Power Monitor + Encoders'],
      ['SPECIAL MODE', '1.0 Hz Resonance Rocking Obstacle Recovery Cycle'],
      ['SOURCE', 'GitHub (BerrF35/Spherical-bot-)']
    ],
    scale: 0.25,
    isGroundedOnFloor: false,
    benchPosition: { x: -2.80, y: 0.380, z: 0.20 },
    benchRotation: { x: 0, y: 0.5, z: 0 },
    projectId: 'spherical_bot'
  },

  raspberry: {
    id: 'raspberry',
    file: 'assets/raspberry.glb',
    title: 'RASPBERRY PI 4 // MODEL B',
    eyebrow: 'PHYSICAL 3D MODEL // SINGLE-BOARD COMPUTER',
    category: 'EDGE COMPUTE NODE',
    summary: 'High-performance edge computational node for on-board autonomous robot processing, local vision pipeline orchestration, and system telemetry logging.',
    specs: [
      ['SOC', 'Broadcom BCM2711 Quad-core Cortex-A72 @ 1.5GHz'],
      ['MEMORY', '4GB LPDDR4-3200 SDRAM'],
      ['IO PORTS', '2x USB 3.0, 2x USB 2.0, Gigabit Ethernet, Dual Micro-HDMI'],
      ['GPIO', 'Standard 40-Pin Header (I2C, SPI, UART, PWM)'],
      ['ROLE', 'Edge Vision & High-Level Autonomy Coordinator']
    ],
    scale: 0.12,
    isGroundedOnFloor: false,
    benchPosition: { x: -3.60, y: 0.380, z: -0.22 },
    benchRotation: { x: 0, y: -0.35, z: 0 }
  },

  esp32: {
    id: 'esp32',
    file: 'assets/esp32.glb',
    title: 'ESP32-WROOM // DUAL-CORE MICROCONTROLLER',
    eyebrow: 'PHYSICAL 3D MODEL // EMBEDDED HARDWARE',
    category: 'MICROCONTROLLER & MOTOR CONTROL',
    summary: 'High-speed 240MHz dual-core embedded processor driving low-latency motor control loops, real-time optical encoder counting, and hardware sensor telemetry.',
    specs: [
      ['MCU', 'ESP-WROOM-32 (Tensilica Xtensa Dual-Core 240MHz)'],
      ['TIMING', 'Hardware Timers for 20kHz Motor PWM Generation'],
      ['PULSE COUNT', 'Hardware PCNT Peripheral for Encoder Ranging'],
      ['CONNECTIVITY', '2.4 GHz Wi-Fi & Bluetooth v4.2 BR/EDR/BLE'],
      ['ROLE', 'Low-Level Real-Time Motor & Sensor Controller']
    ],
    scale: 0.10,
    isGroundedOnFloor: false,
    benchPosition: { x: -3.15, y: 0.380, z: 0.15 },
    benchRotation: { x: 0, y: 0.45, z: 0 }
  },

  camera: {
    id: 'camera',
    file: 'assets/canon_at-1_retro_camera.glb',
    title: 'CANON AT-1 // 35MM RETRO OPTICS',
    eyebrow: 'PHYSICAL 3D MODEL // COMPUTER VISION & SENSING',
    category: 'OPTICAL SENSING PROP',
    summary: 'Retro 35mm SLR optical camera body resting on the leather sofa cushion, representing computer vision, photogrammetry data synthesis pipelines, and spectral chromaticity research.',
    specs: [
      ['MOUNT', 'Canon FD Bayonet System'],
      ['LOCATION', 'Chesterfield Leather Sofa Cushion'],
      ['ROLE', 'Optical Perception & Image Processing Asset'],
      ['SHUTTER', 'Focal-Plane Electronic Shutter'],
      ['RESEARCH LINK', 'Spectral Color-Space & Data Generation']
    ],
    scale: 0.15,
    isGroundedOnFloor: false,
    benchPosition: { x: -4.35, y: 0.465, z: -0.15 },
    benchRotation: { x: 0.1, y: 0.85, z: 0.05 }
  },

  telescope: {
    id: 'telescope',
    file: 'assets/telescope.glb',
    title: 'REFRACTOR TELESCOPE // ASTRONOMICAL OPTICS',
    eyebrow: 'PERSONALITY PROP // SCIENTIFIC CURIOSITY',
    category: 'SPACE & ASTRONOMICAL INTERESTS',
    summary: 'Precision equatorial refractor telescope standing right beside the workbench, symbolizing celestial observation, rockets, mathematical systems, and scientific curiosity.',
    specs: [
      ['OPTICS', 'Achromatic Refractor Objective Lens'],
      ['MOUNT', 'Heavy-Duty Equatorial Tripod with Setting Circles'],
      ['SIGNIFICANCE', 'Personal curiosity in space, astrophysics & rocket systems'],
      ['TYPE', 'Personality Prop (Not a formal portfolio project)']
    ],
    scale: 1.55,
    isGroundedOnFloor: true,
    benchPosition: { x: 1.48, y: 0, z: 0.55 },
    benchRotation: { x: 0, y: -0.55, z: 0 }
  },

  dog: {
    id: 'dog',
    file: 'assets/full_body_shepherd_dog_meshy.glb',
    title: 'BERRY // PET DOG',
    eyebrow: 'EASTER EGG // BERRY',
    category: 'COMPANION',
    summary: 'Berry the loyal Belgian Malinois resting beside the engineering lab bench.',
    specs: [
      ['BREED', 'Belgian Malinois'],
      ['NAME', 'Berry'],
      ['STATUS', 'Chief Morale Officer & Lab Companion']
    ],
    scale: 0.75,
    isGroundedOnFloor: true,
    benchPosition: { x: -2.60, y: 0.05, z: 0.20 },
    benchRotation: { x: 0, y: -0.75, z: 0 }
  },

  cat: {
    id: 'cat',
    file: 'assets/3d_modelling_my_cat_fripouille.glb',
    title: 'CRISPY // PET CAT',
    eyebrow: 'EASTER EGG // CRISPY',
    category: 'COMPANION',
    summary: 'Crispy the pet cat peacefully resting on top of the bed sheets.',
    specs: [
      ['SPECIES', 'Domestic Cat'],
      ['NAME', 'Crispy'],
      ['STATUS', 'Workbench Supervisor & Nap Specialist']
    ],
    scale: 0.48,
    isGroundedOnFloor: false,
    benchPosition: { x: -0.75, y: 0.735, z: -1.90 },
    benchRotation: { x: 0, y: 0.65, z: 0 }
  }
};
HARDWARE_DEFINITIONS.rpi = HARDWARE_DEFINITIONS.raspberry;

export const TIMELINE_MILESTONES = [
  {
    year: 'October 2026',
    title: 'File Allocation Simulator (AetherOS FS-SIM)',
    category: 'SYSTEMS',
    role: 'Lead Architect & Developer',
    desc: 'Engineered an interactive visual OS simulator in React 19 + TypeScript + Vitest covering Contiguous, Linked, and Indexed allocation with 512B sector grids and transactional rollback.',
    link: 'filesim',
    type: 'project'
  },
  {
    year: 'October 2026',
    title: 'Spherical Bot (BALLZ) — Pendulum Robotics Platform',
    category: 'ROBOTICS',
    role: 'Mechanical & Firmware Engineer',
    desc: 'Built an ESP32 FreeRTOS inverted pendulum spherical robot (~71cm circumference) with 200Hz motor synchronization, MPU-6050 complementary filtering, and WebSockets HUD.',
    link: 'spherical_bot',
    type: 'project'
  },
  {
    year: 'August 2026',
    title: 'AutoBot — 12-Layer Embedded Robotics OS',
    category: 'ROBOTICS',
    role: 'Mechanical & Firmware Engineer',
    desc: 'Architected 12-layer decoupled robot OS on dual-core ESP32 with 20kHz motor PWM, QMI8658 IMU fusion, closed-loop PID odometry, and 20Hz WebSocket Tactical HUD.',
    link: 'berrybot',
    type: 'project'
  },
  {
    year: 'August 2026',
    title: 'Local AI Synthetic Data Generator CLI',
    category: 'DATA & ML',
    role: 'Sole Creator',
    desc: 'Created 100% local CLI tool for Windows, Linux, and Colab generating realistic synthetic tabular rows with CTGAN, TVAE, Gaussian Copula, Faker PII masking, and KS scorecards.',
    link: 'synthetic_data_gen',
    type: 'project'
  },
  {
    year: 'August 2026',
    title: 'VIBGYOR Color Decomposer (Spectral Splitter)',
    category: 'RESEARCH',
    role: 'Sole Developer',
    desc: 'Built Python color-space transformation tool converting HEX/RGB/names to HSV and mathematically decomposing hue into exact percentage VIBGYOR wavelength components.',
    link: 'Research',
    type: 'folder'
  },
  {
    year: 'July 2026',
    title: 'Agentic RAG From Scratch — Pure Python ReAct Loop',
    category: 'AGENTS',
    role: 'Sole Creator',
    desc: 'Built frameworkless multi-hop question answering system from scratch with custom TF-IDF indexer, ReAct loop, and automated evaluation without LangChain/LlamaIndex.',
    link: 'agentic_rag',
    type: 'project'
  },
  {
    year: 'April – May 2026',
    title: 'Performance Monitor — Windows Desktop Dashboard',
    category: 'SYSTEMS',
    role: 'Sole Developer',
    desc: 'Engineered real-time Windows system telemetry dashboard in Electron, React, TypeScript, Tailwind, and Recharts monitoring CPU, GPU (nvidia-smi), RAM, and thermals.',
    link: 'perfmon',
    type: 'project'
  },
  {
    year: 'April 2026',
    title: 'Berry AI — Local-First Assistant & CUA Sidecar',
    category: 'AGENTS',
    role: 'Sole Creator',
    desc: 'Created air-gapped on-device desktop assistant with Computer-Use Automation (CUA), vector memory vault (SQLite/ChromaDB), and headless browser relay.',
    link: 'berry',
    type: 'project'
  },
  {
    year: 'March 2026',
    title: 'WindSim — Lattice Boltzmann CFD Aerodynamics Platform',
    category: 'SIMULATION',
    role: 'Sole Creator & Lead Engineer',
    desc: 'Developed real-time browser LBM D2Q9 aerodynamics platform with NACA airfoil analysis, particle streamlines, and dynamic pressure fields running at 60 FPS in WebGL.',
    link: 'windsim',
    type: 'project'
  },
  {
    year: 'March 2026',
    title: 'SpeakSafe — Vortex 2.0 Hackathon Speech Forensics',
    category: 'HACKATHONS',
    role: 'Lead Developer & ML Engineer',
    desc: 'Built AI-generated voice detector with 12+ acoustic features (MFCCs, spectral centroid, ZCR, HNR), live canvas spectrogram, and FastAPI backend (~91% accuracy).',
    link: 'speaksafe',
    type: 'project'
  },
  {
    year: 'February 2026',
    title: 'ImpactX 3.0 Hackathon — 3rd Place Overall Winner',
    category: 'HACKATHONS',
    role: 'Lead Developer & System Architect',
    desc: 'Led architecture and development of high-concurrency geospatial dispatch and real-time logistics routing engine (Quick Gigs) over WebSockets.',
    link: 'impactx',
    type: 'project'
  },
  {
    year: 'February 2026',
    title: 'FarmAssist AI — Yantra 26 Central Hackathon',
    category: 'HACKATHONS',
    role: 'Lead Developer & Model Engineer',
    desc: 'Built offline edge computer vision agricultural diagnostics pipeline running quantized lightweight CNN models on Raspberry Pi hardware.',
    link: 'farmassist',
    type: 'project'
  },
  {
    year: 'August 2025',
    title: 'GestureControlPC — CV Automation via Gestures & Winks',
    category: 'PERCEPTION',
    role: 'Sole Developer',
    desc: 'Developed computer vision PC command automation interface using OpenCV and MediaPipe to execute Windows shortcuts via hand gestures and eye winks.',
    link: 'gesturecontrol',
    type: 'project'
  },
  {
    year: '2025',
    title: 'PustakLink — VinHack 2025 Campus Book Exchange',
    category: 'HACKATHONS',
    role: 'Lead Coder & Backend Architect',
    desc: 'Built peer-to-peer campus resource and textbook exchange marketplace with authenticated student verification and escrow state handshake.',
    link: 'vinhack',
    type: 'project'
  },
  {
    year: '2025',
    title: 'B.Tech Information Technology — VIT Vellore',
    category: 'EDUCATION',
    role: 'Undergraduate Student (25BIT0235)',
    desc: 'Commenced B.Tech in Information Technology at Vellore Institute of Technology (VIT Vellore, 2025–2029).',
    link: 'about',
    type: 'file'
  }
];

export const VIRTUAL_FILESYSTEM = {
  'Desktop': {
    title: 'Desktop',
    path: 'C:\\Users\\Jaijitesh\\Desktop',
    items: [
      { id: 'projects', name: 'Projects', type: 'folder', target: 'Projects', iconType: 'folder', desc: 'Engineering & Hackathon Projects Folder', size: 'DIR' },
      { id: 'research', name: 'Research', type: 'folder', target: 'Research', iconType: 'folder', desc: 'Academic Research & Data Generation Tools', size: 'DIR' },
      { id: 'hardware', name: 'Hardware 3D', type: 'folder', target: 'Hardware', iconType: 'folder', desc: 'SolidWorks CAD & 3D Hardware Models', size: 'DIR' },
      { id: 'about', name: 'About_Dossier.txt', type: 'file', target: 'about', iconType: 'txt', desc: 'Jaijitesh Personnel Dossier & Verified Links', size: '4.8 KB' },
      { id: 'windsim', name: 'WindSim.exe', type: 'app', target: 'windsim', iconType: 'wind', desc: 'Real-Time LBM CFD Aerodynamics Platform', size: '4.2 MB' },
      { id: 'filesim', name: 'File_Allocation_Sim.exe', type: 'app', target: 'filesim', iconType: 'cmd', desc: 'Visual OS Storage Simulator (AetherOS)', size: '3.6 MB' },
      { id: 'berrybot', name: 'AutoBot.exe', type: 'app', target: 'berrybot', iconType: 'robot', desc: '12-Layer Tracked Autonomous Robotics OS', size: '6.1 MB' },
      { id: 'berry', name: 'BerryAI.exe', type: 'app', target: 'berry', iconType: 'ai', desc: 'Local Desktop AI Assistant & CUA Sidecar', size: '12.8 MB' },
      { id: 'terminal', name: 'Command_Prompt.cmd', type: 'app', target: 'terminal', iconType: 'cmd', desc: 'Engineering Workstation Shell Interface', size: '512 KB' },
      { id: 'timeline', name: 'Projects_Timeline.exe', type: 'app', target: 'timeline', iconType: 'game', desc: 'Chronological Milestones & Project Directory', size: '2.4 MB' },
      { id: 'contact', name: 'Contact_Dispatch.exe', type: 'app', target: 'contact', iconType: 'mail', desc: 'Direct Communication & Dispatch Interface', size: '1.8 MB' },
      { id: 'recycle', name: 'Recycle Bin', type: 'folder', target: 'RecycleBin', iconType: 'trash', desc: 'System Trash & Deleted Files', size: 'DIR' }
    ]
  },
  'Projects': {
    title: 'Projects',
    path: 'C:\\Users\\Jaijitesh\\Desktop\\Projects',
    items: [
      { id: 'windsim', name: 'WindSim_CFD.exe', type: 'app', target: 'windsim', iconType: 'wind', desc: 'Real-Time LBM CFD Aerodynamics Platform (Flagship)', size: '4.2 MB' },
      { id: 'filesim', name: 'File_Allocation_Sim.exe', type: 'app', target: 'filesim', iconType: 'cmd', desc: 'Visual OS Storage Simulator (React 19 / Vitest)', size: '3.6 MB' },
      { id: 'berrybot', name: 'AutoBot_Robotics.exe', type: 'app', target: 'berrybot', iconType: 'robot', desc: '12-Layer Tracked Robotics OS & Tactical HUD', size: '6.1 MB' },
      { id: 'berry', name: 'Berry_AI_Assistant.exe', type: 'app', target: 'berry', iconType: 'ai', desc: 'Local Desktop Agent (Python / AGPL-3.0)', size: '12.8 MB' },
      { id: 'speaksafe', name: 'SpeakSafe_Detector.exe', type: 'app', target: 'speaksafe', iconType: 'mail', desc: 'AI Voice Forensics (Vortex 2.0 Hackathon)', size: '5.2 MB' },
      { id: 'spherical_bot', name: 'Spherical_Bot.exe', type: 'app', target: 'spherical_bot', iconType: 'robot', desc: 'Pendulum-Driven Spherical Robot Controller', size: '4.8 MB' },
      { id: 'synthetic_data_gen', name: 'Synthetic_Data_Gen.exe', type: 'app', target: 'synthetic_data_gen', iconType: 'cad', desc: 'Local AI Synthetic Tabular Generator CLI', size: '8.4 MB' },
      { id: 'perfmon', name: 'Performance_Monitor.exe', type: 'app', target: 'perfmon', iconType: 'cmd', desc: 'Real-Time Windows OS Telemetry Dashboard', size: '14.2 MB' },
      { id: 'agentic_rag', name: 'Agentic_RAG.txt', type: 'doc', target: 'agentic_rag', iconType: 'txt', desc: 'Frameworkless Multi-Hop QA ReAct Loop', size: '4.1 KB' },
      { id: 'gesturecontrol', name: 'Gesture_Control_PC.txt', type: 'doc', target: 'gesturecontrol', iconType: 'txt', desc: 'OpenCV + MediaPipe PC Control via Winks & Gestures', size: '3.2 KB' },
      { id: 'impactx', name: 'ImpactX_3.0_Winner.txt', type: 'doc', target: 'impactx', iconType: 'txt', desc: 'ImpactX 3.0 Hackathon 3rd Place Overall (Lead Dev)', size: '3.4 KB' },
      { id: 'farmassist', name: 'FarmAssist_AI.txt', type: 'doc', target: 'farmassist', iconType: 'txt', desc: 'Yantra 26 Central Hackathon (Lead Developer)', size: '3.1 KB' },
      { id: 'vinhack', name: 'PustakLink_VinHack.txt', type: 'doc', target: 'vinhack', iconType: 'txt', desc: 'P2P Academic Resource Exchange (Lead Coder)', size: '2.8 KB' }
    ]
  },
  'Research': {
    title: 'Research',
    path: 'C:\\Users\\Jaijitesh\\Desktop\\Research',
    items: [
      { id: 'res_color', name: 'Spectral_Color_Splitter.pdf', type: 'doc', target: 'res_color', iconType: 'pdf', desc: 'VIBGYOR color decomposition algorithms (Repo Verified)', size: '920 KB' },
      { id: 'res_synth', name: 'Synthetic_Data_Generator.pdf', type: 'doc', target: 'res_synth', iconType: 'pdf', desc: 'Local AI synthetic data generator & scene synthesis', size: '1.4 MB' },
      { id: 'res_vision', name: 'Edge_Vision_Systems.pdf', type: 'doc', target: 'res_vision', iconType: 'pdf', desc: 'Low-power ARM vision integration on microcontrollers', size: '2.1 MB' }
    ]
  },
  'Hardware': {
    title: 'Hardware 3D',
    path: 'C:\\Users\\Jaijitesh\\Desktop\\Hardware 3D',
    items: [
      { id: 'cad_chassis', name: 'BerryBot_Chassis.step', type: 'cad', target: 'robot', iconType: 'cad', desc: 'SolidWorks M4 High-Speed Tracked Chassis Assembly', size: '3.8 MB' },
      { id: 'cad_sphere', name: 'Spherical_Bot_Chassis.cad', type: 'cad', target: 'spherical_bot', iconType: 'cad', desc: 'ESP32 Inverted Pendulum Spherical Shell Assembly', size: '4.2 MB' },
      { id: 'cad_rpi', name: 'Raspberry_Pi_4_Model_B.step', type: 'cad', target: 'raspberry', iconType: 'cad', desc: 'BCM2711 4-Core Quad 64-bit Compute Board', size: '5.9 MB' },
      { id: 'cad_esp', name: 'ESP32_WROOM_38Pin.step', type: 'cad', target: 'esp32', iconType: 'cad', desc: 'Dual-Core Controller with 20kHz Motor PWM', size: '6.2 MB' },
      { id: 'cad_camera', name: 'Canon_AT1_Retro.cad', type: 'cad', target: 'camera', iconType: 'cad', desc: 'Canon AT-1 35mm Vintage SLR & Perception Optics', size: '19.5 MB' },
      { id: 'cad_telescope', name: 'Refractor_Telescope.cad', type: 'cad', target: 'telescope', iconType: 'cad', desc: 'Scientific Refractor & Equatorial Mount Prop', size: '6.6 MB' }
    ]
  },
  'RecycleBin': {
    title: 'Recycle Bin',
    path: 'Recycle Bin',
    items: [
      { id: 'junk_logs', name: 'previous_build_logs.log', type: 'doc', target: 'junk_logs', iconType: 'trash', desc: '14 KB (Deleted)', size: '14 KB' },
      { id: 'junk_temp', name: 'temp_debug_dump.tmp', type: 'doc', target: 'junk_temp', iconType: 'trash', desc: '28 KB (Deleted)', size: '28 KB' }
    ]
  }
};
