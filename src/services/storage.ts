import { CommunityPost, ConfigItem, ScriptItem } from '../types';

const DEFAULT_SCRIPTS: ScriptItem[] = [
  {
    id: 'script-gm-full-hacks',
    title: 'GMHelper Ultimate Combat Pack',
    description: 'Activates Unlimited Jumps, Reach 999, BedWars bypass, and removes attack delay.',
    category: 'Combat' as any,
    tags: ['GMHelper', 'Reach', 'NoDelay', 'BedWars'],
    author: 'm7md kicking',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
    favorite: true,
    code: `LuaBridge.call("unlimitedJumps")
LuaBridge.call("Reach")
LuaBridge.call("BanClickCD")
LuaBridge.call("BW")
UIHelper.showToast("^00FF00[BMGO] Combat Pack Activated!")`
  },
  {
    id: 'script-devfly-speed',
    title: 'DevFly & Hyperspeed Glider',
    description: 'Enables engine flying permissions, lifts player into air and sets speed level to 300,000.',
    category: 'Hacks',
    tags: ['Fly', 'Speed', 'Movement'],
    author: 'BlockmanDev',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    favorite: true,
    code: `local player = PlayerManager:getClientPlayer()
if player and player.Player then
    player.Player:setAllowFlying(true)
    player.Player:setFlying(true)
    local moveDir = VectorUtil.newVector3(0.0, 1.35, 0.0)
    player.Player:moveEntity(moveDir)
    player.Player:setSpeedAdditionLevel(300000)
    UIHelper.showToast("^FF00EEDevFly + Hyperspeed Active")
else
    UIHelper.showToast("^FF0000Player not loaded")
end`
  },
  {
    id: 'script-esp-radar',
    title: 'Tracer & HitBox Expansion',
    description: 'Draws directional guide arrows to all enemy positions and expands bounding boxes to 10x10.',
    category: 'Visual',
    tags: ['ESP', 'Tracer', 'HitBox'],
    author: 'MatrixHunter',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    favorite: false,
    code: `LuaBridge.call("Tracer")
LuaBridge.call("HitBox")
UIHelper.showToast("^00FFDDTracer and 10x Hitbox Applied")`
  },
  {
    id: 'script-fast-mining',
    title: 'Fast Break 40,000 Blocks',
    description: 'Loops through all blocks in world cache and zeros out hardness for instant one-tap mining.',
    category: 'Utility',
    tags: ['Mining', 'Blocks', 'FastBreak'],
    author: 'MinerPro',
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 12,
    favorite: false,
    code: `for blockId = 1, 40000 do
    local block = BlockManager.getBlockById(blockId)
    if block then
        block:setHardness(0)
    end
end
UIHelper.showToast("^00FF00Fast Break 40000 blocks set to 0 hardness")`
  },
  {
    id: 'script-harumi-welcome',
    title: 'Harumi Lua 5.1 Test Print',
    description: 'Basic Lua 5.1 verification script displaying welcome banner and client information.',
    category: 'AI Generated',
    tags: ['Lua5.1', 'Harumi', 'Test'],
    author: 'HARUMI GPT',
    createdAt: Date.now() - 1800000,
    updatedAt: Date.now() - 1800000,
    favorite: false,
    code: `print("========================================")
print("BMGO Lua 5.1 Runtime Test Initialized")
print("Host: Android Chrome / Appilix WebView")
print("Target Package: com.sandboxol.blockymods")
print("========================================")
UIHelper.showToast("^2196F3Welcome ^•^ BMGO Ready")`
  }
];

const DEFAULT_CONFIGS: ConfigItem[] = [
  {
    id: 'cfg-default-mobile',
    name: 'Mobile PvP Default',
    description: 'Compact overlay positioned at top-right with reach and double jump presets.',
    theme: 'cyber',
    uiScale: 'normal',
    overlay: {
      x: 16,
      y: 72,
      width: 350,
      height: 480,
      minimized: false,
      opacity: 0.95
    },
    preferences: {
      autoClearOnExecute: false,
      showLineNumbers: true,
      fontSize: 13,
      logLevel: 'all',
      hapticFeedback: true,
      buttonSize: 'normal'
    },
    activeToggles: {
      unlimitedJumps: true,
      Reach: true,
      BanClickCD: true
    },
    active: true,
    createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 'cfg-tablet-fullscreen',
    name: 'Landscape Expanded',
    description: 'Larger overlay optimized for wide aspect ratio devices and tablet displays.',
    theme: 'neon',
    uiScale: 'large',
    overlay: {
      x: 32,
      y: 40,
      width: 480,
      height: 560,
      minimized: false,
      opacity: 0.98
    },
    preferences: {
      autoClearOnExecute: false,
      showLineNumbers: true,
      fontSize: 14,
      logLevel: 'all',
      hapticFeedback: true,
      buttonSize: 'large'
    },
    activeToggles: {
      Tracer: true,
      HitBox: true,
      MaxFPS: true
    },
    active: false,
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'cfg-stealth-minimal',
    name: 'Stealth Pill',
    description: 'Minimally translucent overlay focused on stealth and name concealment.',
    theme: 'matrix',
    uiScale: 'compact',
    overlay: {
      x: 20,
      y: 90,
      width: 320,
      height: 420,
      minimized: true,
      opacity: 0.85
    },
    preferences: {
      autoClearOnExecute: true,
      showLineNumbers: false,
      fontSize: 12,
      logLevel: 'errors_only',
      hapticFeedback: false,
      buttonSize: 'normal'
    },
    activeToggles: {
      HideNames: true,
      NoFall: true,
      BlinkOP: true
    },
    active: false,
    createdAt: Date.now() - 86400000
  }
];

const DEFAULT_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    type: 'script',
    title: 'BedWars Auto-Bridge & QuickBlock Macro',
    author: 'BlockMaster_99',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80',
    description: 'Bypasses placement limits and enables rapid block streaming while sprinting forward.',
    category: 'BedWars',
    likes: 342,
    downloads: 1205,
    createdAt: '2 hours ago',
    badge: 'Trending',
    code: `LuaBridge.call("quickblock", 128)
LuaBridge.call("BW")
local client = PlayerManager:getClientPlayer()
if client and client.Player then
    client.Player:setSpeedAdditionLevel(80000)
end
UIHelper.showToast("^00FF00QuickBlock Bridge Macro Enabled")`,
    comments: [
      {
        id: 'c1',
        author: 'AuraPlayer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        text: 'Works great in bedwars duo! No ban at all.',
        createdAt: '1 hour ago'
      },
      {
        id: 'c2',
        author: 'GamerX',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
        text: 'Can you add an auto-aim hook next?',
        createdAt: '35 mins ago'
      }
    ]
  },
  {
    id: 'post-2',
    type: 'script',
    title: 'Harumi AI: Auto TP Kill Combo',
    author: 'HARUMI GPT Community',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    description: 'Clean Lua 5.1 target evaluation routine that snaps above enemy coordinates with no-click cooldown.',
    category: 'PvP',
    likes: 498,
    downloads: 2430,
    createdAt: '1 day ago',
    badge: 'AI Generated',
    code: `LuaBridge.call("tpKill")
LuaBridge.call("BanClickCD")
LuaBridge.call("AimBot")
UIHelper.showToast("^FF00EEAuto TP Kill Sequence Running")`,
    comments: [
      {
        id: 'c3',
        author: 'BlockmanSniper',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
        text: 'Insane combo speed, 10/10.',
        createdAt: '18 hours ago'
      }
    ]
  },
  {
    id: 'post-3',
    type: 'config',
    title: 'Cyberpunk Neon Mobile Overlay Preset',
    author: 'VortexUI',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&auto=format&fit=crop&q=80',
    description: 'Ultra-sleek cyan and violet styling with optimal button touch targets for Android Chrome and Appilix.',
    category: 'UI Presets',
    likes: 189,
    downloads: 780,
    createdAt: '3 days ago',
    configData: {
      name: 'Cyberpunk Neon Preset',
      theme: 'neon',
      uiScale: 'normal',
      overlay: {
        x: 20,
        y: 80,
        width: 360,
        height: 500,
        minimized: false,
        opacity: 0.95
      }
    },
    comments: []
  }
];

export class StorageService {
  private static SCRIPTS_KEY = 'bmgo_scripts_data';
  private static CONFIGS_KEY = 'bmgo_configs_data';
  private static COMMUNITY_KEY = 'bmgo_community_posts';
  private static HISTORY_KEY = 'bmgo_script_history';
  private static SETTINGS_KEY = 'bmgo_app_settings';
  private static LAST_VERSION_SEEN_KEY = 'bmgo_last_version_seen';

  public static getScripts(): ScriptItem[] {
    try {
      const data = localStorage.getItem(this.SCRIPTS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    this.saveScripts(DEFAULT_SCRIPTS);
    return DEFAULT_SCRIPTS;
  }

  public static saveScripts(scripts: ScriptItem[]): void {
    try {
      localStorage.setItem(this.SCRIPTS_KEY, JSON.stringify(scripts));
    } catch {}
  }

  public static addScript(script: Omit<ScriptItem, 'id' | 'createdAt' | 'updatedAt'>): ScriptItem {
    const scripts = this.getScripts();
    const newScript: ScriptItem = {
      ...script,
      id: 'script-' + Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    scripts.unshift(newScript);
    this.saveScripts(scripts);
    return newScript;
  }

  public static updateScript(id: string, updates: Partial<ScriptItem>): ScriptItem | null {
    const scripts = this.getScripts();
    const index = scripts.findIndex((s) => s.id === id);
    if (index === -1) return null;
    scripts[index] = { ...scripts[index], ...updates, updatedAt: Date.now() };
    this.saveScripts(scripts);
    return scripts[index];
  }

  public static deleteScript(id: string): void {
    const scripts = this.getScripts().filter((s) => s.id !== id);
    this.saveScripts(scripts);
  }

  public static getConfigs(): ConfigItem[] {
    try {
      const data = localStorage.getItem(this.CONFIGS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    this.saveConfigs(DEFAULT_CONFIGS);
    return DEFAULT_CONFIGS;
  }

  public static saveConfigs(configs: ConfigItem[]): void {
    try {
      localStorage.setItem(this.CONFIGS_KEY, JSON.stringify(configs));
    } catch {}
  }

  public static getActiveConfig(): ConfigItem {
    const configs = this.getConfigs();
    const active = configs.find((c) => c.active);
    return active || configs[0] || DEFAULT_CONFIGS[0];
  }

  public static setActiveConfig(id: string): void {
    const configs = this.getConfigs().map((c) => ({
      ...c,
      active: c.id === id
    }));
    this.saveConfigs(configs);
  }

  public static addConfig(name: string, description: string, partial?: Partial<ConfigItem>): ConfigItem {
    const configs = this.getConfigs();
    const newConfig: ConfigItem = {
      id: 'cfg-' + Math.random().toString(36).substring(2, 9),
      name,
      description,
      theme: partial?.theme || 'cyber',
      uiScale: partial?.uiScale || 'normal',
      overlay: partial?.overlay || {
        x: 20,
        y: 80,
        width: 350,
        height: 480,
        minimized: false,
        opacity: 0.95
      },
      preferences: partial?.preferences || {
        autoClearOnExecute: false,
        showLineNumbers: true,
        fontSize: 13,
        logLevel: 'all',
        hapticFeedback: true,
        buttonSize: 'normal'
      },
      activeToggles: partial?.activeToggles || {},
      active: true,
      createdAt: Date.now()
    };
    const updated = configs.map((c) => ({ ...c, active: false }));
    updated.unshift(newConfig);
    this.saveConfigs(updated);
    return newConfig;
  }

  public static getCommunityPosts(): CommunityPost[] {
    try {
      const data = localStorage.getItem(this.COMMUNITY_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    this.saveCommunityPosts(DEFAULT_COMMUNITY_POSTS);
    return DEFAULT_COMMUNITY_POSTS;
  }

  public static saveCommunityPosts(posts: CommunityPost[]): void {
    try {
      localStorage.setItem(this.COMMUNITY_KEY, JSON.stringify(posts));
    } catch {}
  }

  public static toggleLikeCommunityPost(postId: string): CommunityPost | null {
    const posts = this.getCommunityPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return null;
    post.isLiked = !post.isLiked;
    post.likes = post.isLiked ? post.likes + 1 : Math.max(0, post.likes - 1);
    this.saveCommunityPosts(posts);
    return post;
  }

  public static addCommentToPost(postId: string, commentText: string, author = 'You'): void {
    const posts = this.getCommunityPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    post.comments.push({
      id: 'c-' + Math.random().toString(36).substring(2, 9),
      author,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      text: commentText,
      createdAt: 'Just now'
    });
    this.saveCommunityPosts(posts);
  }

  public static updateOverlayConfig(overlay: { x: number; y: number; width: number; height: number; minimized: boolean }): void {
    const configs = this.getConfigs();
    const active = configs.find((c) => c.active) || configs[0];
    if (active) {
      active.overlay = {
        ...active.overlay,
        ...overlay
      };
      this.saveConfigs(configs);
    }
  }

  public static getHistory(): string[] {
    try {
      const data = localStorage.getItem(this.HISTORY_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return [];
  }

  public static addToHistory(code: string): void {
    if (!code.trim()) return;
    try {
      let history = this.getHistory();
      history = history.filter((item) => item.trim() !== code.trim());
      history.unshift(code);
      if (history.length > 50) history = history.slice(0, 50);
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    } catch {}
  }

  public static getLastVersionSeen(): string | null {
    try {
      return localStorage.getItem(this.LAST_VERSION_SEEN_KEY);
    } catch {
      return null;
    }
  }

  public static setLastVersionSeen(version: string): void {
    try {
      localStorage.setItem(this.LAST_VERSION_SEEN_KEY, version);
    } catch {}
  }

  public static resetAllStorage(): void {
    try {
      localStorage.removeItem(this.SCRIPTS_KEY);
      localStorage.removeItem(this.CONFIGS_KEY);
      localStorage.removeItem(this.COMMUNITY_KEY);
      localStorage.removeItem(this.HISTORY_KEY);
      localStorage.removeItem(this.SETTINGS_KEY);
      localStorage.removeItem(this.LAST_VERSION_SEEN_KEY);
      localStorage.removeItem('bmgo_harumi_config');
    } catch {}
  }
}
