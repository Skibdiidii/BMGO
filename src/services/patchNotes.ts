import { PatchNoteVersion } from '../types';

export const PATCH_NOTES_HISTORY: PatchNoteVersion[] = [
  {
    version: 'v1.9.1',
    releaseDate: 'September 2026 (Latest)',
    title: 'Automated Tunnel Engine & Zero-Config Background Supervisor',
    highlights: [
      'Automated Background Runner: Zero-touch automatic startup on application boot with persistent supervisor loop',
      'Instant Live Tunnel Forwarding: Automatically links local runtime port to public bore endpoint upon server launch',
      'Realtime Health & Tunnel Diagnostics: Live endpoint status monitoring at /api/tunnel/status and /api/health',
      'Auto-Recovery Pipeline: Automatic reconnection if network interruption or process termination occurs'
    ],
    changes: [
      {
        category: 'Features',
        items: [
          'Added automatic bore tunnel supervisor daemon running alongside Express server',
          'Self-healing connection recovery with automatic retry interval',
          'Public port auto-extraction with real-time console logging and status endpoint'
        ]
      },
      {
        category: 'UI/UX',
        items: [
          'Integrated automatic popup on launch with auto-scrolling historical version archive',
          'Cleaned status indicators and streamlined mobile-first layout'
        ]
      },
      {
        category: 'Runtime',
        items: [
          'Direct fullstack Express and Vite middleware coordination',
          'Zero-config local port forwarding without requiring manual execution commands'
        ]
      }
    ]
  },
  {
    version: 'v1.9.0',
    releaseDate: 'September 2026',
    title: 'Engine Optimization, Streamlined Navigation & Zero-Lag Execution',
    highlights: [
      'Streamlined Core Navigation: Refined primary tabs focusing on high-performance in-game utilities',
      'Lua 5.1 Realtime Execution Pipeline: Ultra-low latency script evaluation and GMHelper response dispatching',
      'Enhanced Android Sandbox Explorer: Faster inspection and script syncing with the floating draggable overlay',
      'Optimized Touch Gestures & Draggable GM Bubble: Smooth edge physics and responsive clamping'
    ],
    changes: [
      {
        category: 'Features',
        items: [
          'Streamlined dashboard navigation hierarchy for clean mobile-first usage',
          'Accelerated Lua 5.1 AST syntax validation and GMHelper command dispatching',
          'Instant floating overlay bridge synchronization across all client modules',
          'Updated environment toolchain and local execution binaries'
        ]
      },
      {
        category: 'UI/UX',
        items: [
          'Cleaned mobile and desktop navigation bars for focused gameplay execution',
          'Preserved auto-scrolling version history modal with complete archive access',
          'Enhanced glowing active indicator states and responsive touch targets'
        ]
      },
      {
        category: 'Runtime',
        items: [
          'Direct offline Lua 5.1 emulation engine enhancements',
          'Seamless Android Sandbox Filesystem script writing and export capabilities'
        ]
      }
    ]
  },
  {
    version: 'v1.8.1',
    releaseDate: 'September 2026',
    title: 'Zero-Config Bore Tunnel Integration (No Auth Tokens / Zero Manual Setup)',
    highlights: [
      'Zero-Config Bore Tunneling: No NGROK_AUTH_TOKEN, no account registration, and zero manual credential configuration required',
      'Automatic Port Forwarding: GitHub Actions runner boots Bore and immediately maps port 8088 to bore.pub:PORT',
      'Smart Endpoint Normalizer: Accepts 5-digit port (e.g. 38472) or full URL with automatic formatting',
      'Preserved auto-scrolling changelog history for all past versions in What\'s New popup'
    ],
    changes: [
      {
        category: 'Features',
        items: [
          'Added automatic Bore tunnel downloader and runner in local environment',
          'Automated public port extraction and display in runner logs',
          'Removed required secret token barriers for immediate 1-click cloud startup'
        ]
      },
      {
        category: 'UI/UX',
        items: [
          'Streamlined connector interface with single-field port/URL quick input',
          'Real-time connection latency and status feedback over Bore tunnels',
          'Updated step-by-step 1-minute runner launch guide'
        ]
      },
      {
        category: 'Runtime',
        items: [
          'Direct Lua 5.1 and Bash command execution via remote Bore endpoints',
          'Preserved offline simulation fallback when cloud runner is disconnected'
        ]
      }
    ]
  },
  {
    version: 'v1.8.0',
    releaseDate: 'September 2026',
    title: 'FreeVPS Cloud Runner & Remote Daemon Hub',
    highlights: [
      'FreeVPS Cloud Runner integration for 6-hour high-speed remote cloud computing',
      'Remote BMGO Daemon over tunnels for offloading Lua execution & ADB bridges',
      'Interactive Remote Terminal & LuaJIT tester running directly on runner',
      'Cleaned user navigation by removing developer-only Appilix bridge tab from standard layout'
    ],
    changes: [
      {
        category: 'Features',
        items: [
          'Added live remote latency diagnostics and status checker',
          'Automated Python 3 HTTP daemon (port 8088) bootstrapping',
          'Remote Bash terminal execution and live Lua 5.1 code evaluator on runners'
        ]
      },
      {
        category: 'UI/UX',
        items: [
          'Removed developer-only Appilix tab from main navigation for streamlined user experience',
          'Preserved auto-scrolling version history modal with full changelog archive'
        ]
      },
      {
        category: 'Runtime',
        items: [
          'Seamless fallback between Client Simulation Mode and Remote Daemon',
          'Direct remote Lua execution pipeline from floating overlay to cloud runner'
        ]
      }
    ]
  },
  {
    version: 'v1.7.0',
    releaseDate: 'September 2026',
    title: 'Appilix Web-to-APK Floating Window & BMG File Bridge Hub',
    highlights: [
      'Appilix APK Android Floating Mode with Samsung Pop-up View & MIUI Floating Window compatibility',
      'Web Picture-in-Picture (PiP) trigger for real-time in-game executor streaming',
      'Termux Local Bridge Daemon (http://127.0.0.1:8088) for live read/write to /data/user/0/com.sandboxol.blockymods',
      '1-Click MT Manager & ZArchiver script exporter and native Appilix JavascriptInterface generator'
    ],
    changes: [
      {
        category: 'Features',
        items: [
          'Added dedicated Appilix APK Integration Hub tab in main navigation',
          'Live local daemon connection tester with ping latency measurement for port 8088',
          '1-Click GMHelper.lua downloader and full sandbox JSON exporter for MT Manager',
          'Web Picture-in-Picture floating HUD trigger directly over running games'
        ]
      },
      {
        category: 'Runtime',
        items: [
          'Direct HTTP bridge communication to physical Android device files via local daemon',
          'Appilix JavascriptInterface (window.AndroidLuaBridge) binding definitions and generator',
          'Complete AndroidManifest.xml and FloatingWindowService.java system overlay templates'
        ]
      },
      {
        category: 'UI/UX',
        items: [
          'Interactive Android Pop-up View guide for Samsung, Xiaomi, POCO, Oppo, and Vivo devices',
          'Continuous auto-scrolling version history preservation in What\'s New modal'
        ]
      }
    ]
  },
  {
    version: 'v1.6.0',
    releaseDate: 'September 2026',
    title: 'Real Draggable Floating Engine & GM Floater Bubble',
    highlights: [
      'Genuine floating draggable overlay with global window pointer tracking for zero-lag motion',
      'Persistent Draggable Floating GM Bubble with real-time status and instant one-tap toggle',
      'Multi-touch pan, smooth edge clamping, active glow rings, and responsive touch gestures',
      'Automatic overlay coordinate persistence to maintain exact user-placed positions'
    ],
    changes: [
      {
        category: 'Features',
        items: [
          'Added real-time Draggable GM Floater Bubble that stays floating on screen even when closed',
          'Global window pointer listeners for drag and resize handles preventing pointer loss during fast moves',
          'Isolated touch-action controls allowing natural scrolling inside editor and code tabs while dragging from headers'
        ]
      },
      {
        category: 'UI/UX',
        items: [
          'Active drag visual states with glowing cyan rings and smooth shadow depth',
          'Smooth screen edge boundary clamping preventing overlay loss across device resizes',
          'Immediate local coordinate storage synchronization upon pointer release'
        ]
      },
      {
        category: 'Runtime',
        items: [
          'Full compatibility with Android Chrome, Appilix WebViews, and desktop browser pointers',
          'Seamless integration between GM Floater Bubble, Floating Window, and GMHelper command execution'
        ]
      }
    ]
  },
  {
    version: 'v1.5.0',
    releaseDate: 'September 2026',
    title: 'Mistral AI & Android Sandbox Filesystem Integration',
    highlights: [
      'Mistral AI Codestral integration with native API key connectivity for instant Lua 5.1 generation',
      'Interactive Android Virtual Sandbox Filesystem Explorer for /data/user/0/com.sandboxol.blockymods',
      'Real-time path latency diagnostics and file sync with Executor Overlay',
      'Full GMHelper.lua source viewer, binary layout inspector, and custom sandbox script writer'
    ],
    changes: [
      {
        category: 'Features',
        items: [
          'Connected Mistral AI (codestral-latest, mistral-small, mistral-large) directly into Harumi GPT',
          'Strict Lua 5.1 Blockman GO code synthesizer with client player hooks and ClientHelper preference controls',
          'Configurable provider engine selector (Mistral AI, Google Gemini, and Offline Mock)'
        ]
      },
      {
        category: 'Runtime',
        items: [
          'Added Android FS Explorer tab mapped to /data/user/0/com.sandboxol.blockymods/app_resources/Media/Scripts',
          'Integrated live GMHelper.lua source code editor with direct overlay injection',
          'Live connection diagnostic tests with ping latency measurements for all core Android paths',
          'Support for creating, editing, testing, and deleting virtual scripts in the sandbox'
        ]
      },
      {
        category: 'UI/UX',
        items: [
          'Direct script pipeline from Android Sandbox Filesystem into Floating Draggable Overlay',
          'Enhanced BridgeResponse handling with real-time colored toast feedback (^00FF00 / ^FF0000)'
        ]
      }
    ]
  },
  {
    version: 'v1.4.0',
    releaseDate: 'September 2026',
    title: 'BMGO Complete MVP Engine & Floating Executor Release',
    highlights: [
      'Pure web-based mobile-first dashboard and floating draggable/resizable overlay',
      'Realtime Lua 5.1 bridge architecture with Mock & Runtime modes',
      'Integrated Harumi GPT Lua 5.1 AI code synthesis engine',
      'Full GMHelper.lua command catalog (Hacks, Effects, Buggy, Game & Panel)',
      '100vw/100dvh safe-area support optimized for Android Chrome & Appilix APK'
    ],
    changes: [
      {
        category: 'Features',
        items: [
          'Floating Executor Overlay with interactive drag, minimize, maximize, and touch handles',
          'Lua 5.1 editor with instant syntax highlighting, line numbers, and script quick-loader',
          'Harumi GPT AI Code Maker with prompt presets and instant executor insertion',
          'Script library with export/import, favorites, tag filtering, and execution history',
          'Config manager with preset storage, overlay positions, sizes, and theme customizations'
        ]
      },
      {
        category: 'Runtime',
        items: [
          'Full GMHelper command integration with authentic toast colors (^RRGGBB format)',
          'Preserved Android runtime directory & file references for com.sandboxol.blockymods',
          'Simulated Blockman GO player attributes (speed, fly, hitboxes, reach, blink, auto-click)',
          'Dual runtime mode: Offline Mock Emulation and Native Android Lua Bridge Adapter'
        ]
      },
      {
        category: 'UI/UX',
        items: [
          'Cyber dark gaming aesthetic with glowing neon accents and glassmorphism',
          'Safe-area insets compatibility for edge-to-edge Android displays and WebView cutouts',
          'Persistent What\'s New update modal with complete version history auto-scrolling'
        ]
      }
    ]
  },
  {
    version: 'v1.3.0',
    releaseDate: 'August 2026',
    title: 'GMHelper Command Catalog & Engine References',
    highlights: [
      'Implemented authentic GMHelper.lua hacks, effects, and game control routines',
      'Integrated Android sandbox path viewer for Engine, Media/Scripts, and Layouts',
      'Added BedWars bypass, SpeedManager, and Noclip block boundary controls'
    ],
    changes: [
      {
        category: 'Runtime',
        items: [
          'Registered 20+ hacks including Reach 999, BowSpeed, BanClickCD, and ViewRaket',
          'Added X-Ray all blocks (40,000 blocks toggle) and WWE Camera detached mode',
          'PacketSender rebirth automation and LagServer2 ddos stress loop'
        ]
      },
      {
        category: 'Fixes',
        items: [
          'Excluded deprecated teleport tab per MVP specifications',
          'Sanitized Android filesystem calls to run safely in pure web browser sandboxes'
        ]
      }
    ]
  },
  {
    version: 'v1.2.0',
    releaseDate: 'July 2026',
    title: 'Harumi GPT Lua 5.1 Code Maker',
    highlights: [
      'Added dedicated AI Code Maker panel inside Dashboard and Executor Overlay',
      'Strict Lua 5.1 compatibility enforcement (no Lua 5.2+ unsupported keywords)',
      'Prompt recommendations for combat, movement, and automation scripts'
    ],
    changes: [
      {
        category: 'Features',
        items: [
          'One-click insert generated Lua 5.1 code directly into Executor editor',
          'Configurable AI API connection with offline fallback generator',
          'Explanation breakdown for all generated client game hooks'
        ]
      }
    ]
  },
  {
    version: 'v1.1.0',
    releaseDate: 'June 2026',
    title: 'Floating Overlay & Touch Pointer System',
    highlights: [
      'Multi-touch draggable overlay with screen boundary clamping',
      'Resizable bottom-right handle and quick fullscreen expand toggle',
      'Minimizable floating pill badge for unobtrusive in-game navigation'
    ],
    changes: [
      {
        category: 'UI/UX',
        items: [
          'Full viewport 100vw and 100dvh responsiveness for Appilix WebView packaging',
          'Haptic-friendly action buttons with adjustable sizes in Settings',
          'Custom scrollbars with glowing neon cyan indicators'
        ]
      }
    ]
  },
  {
    version: 'v1.0.0',
    releaseDate: 'May 2026',
    title: 'BMGO Foundation Architecture',
    highlights: [
      'Initial prototype of web-based Blockman GO script dashboard and executor',
      'LuaBridge communication abstraction layer',
      'Local storage persistence for user scripts and configurations'
    ],
    changes: [
      {
        category: 'Features',
        items: [
          'Dashboard navigation layout (Home, Executor, Scripts, Configs, Settings)',
          'Local script storage with JSON/LUA import and export',
          'Basic community showcase mock feeds'
        ]
      }
    ]
  }
];

export const LATEST_VERSION = PATCH_NOTES_HISTORY[0].version;
