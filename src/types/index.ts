export type RuntimeMode = 'MOCK' | 'RUNTIME';

export interface GMCommandItem {
  id: string;
  name: string;
  func: string;
  tab: 'hacks' | 'effects' | 'buggy' | 'game_panel';
  description: string;
  hasInput?: boolean;
  inputPlaceholder?: string;
  inputType?: 'string' | 'number';
  colorCode?: string;
  defaultActive?: boolean;
}

export interface BridgeResponse {
  success: boolean;
  command?: string;
  result?: any;
  error?: string;
  toast?: string;
  timestamp: number;
}

export interface RuntimeState {
  mode: RuntimeMode;
  connected: boolean;
  packageName: string;
  activeToggles: Record<string, boolean>;
  variables: Record<string, any>;
  logs: ConsoleLogItem[];
  recentToasts: ToastNotification[];
}

export interface ConsoleLogItem {
  id: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'lua';
  message: string;
  timestamp: string;
}

export interface ToastNotification {
  id: string;
  rawText: string;
  segments: { text: string; color: string }[];
  timestamp: number;
}

export interface ScriptItem {
  id: string;
  title: string;
  description: string;
  code: string;
  category: 'Hacks' | 'PvP' | 'BedWars' | 'Utility' | 'Visual' | 'AI Generated';
  tags: string[];
  author: string;
  createdAt: number;
  updatedAt: number;
  favorite: boolean;
}

export interface ConfigItem {
  id: string;
  name: string;
  description: string;
  theme: 'cyber' | 'neon' | 'matrix' | 'crimson';
  uiScale: 'compact' | 'normal' | 'large';
  overlay: {
    x: number;
    y: number;
    width: number;
    height: number;
    minimized: boolean;
    opacity: number;
  };
  preferences: {
    autoClearOnExecute: boolean;
    showLineNumbers: boolean;
    fontSize: number;
    logLevel: 'all' | 'errors_only' | 'silent';
    hapticFeedback: boolean;
    buttonSize: 'normal' | 'large';
  };
  activeToggles: Record<string, boolean>;
  active: boolean;
  createdAt: number;
}

export interface CommunityPost {
  id: string;
  type: 'script' | 'config';
  title: string;
  author: string;
  avatar: string;
  description: string;
  category: string;
  likes: number;
  isLiked?: boolean;
  downloads: number;
  code?: string;
  configData?: Partial<ConfigItem>;
  comments: CommunityComment[];
  createdAt: string;
  badge?: string;
}

export interface CommunityComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  createdAt: string;
}

export interface PatchNoteVersion {
  version: string;
  releaseDate: string;
  title: string;
  highlights: string[];
  changes: {
    category: 'Features' | 'Runtime' | 'UI/UX' | 'Fixes';
    items: string[];
  }[];
}

export interface AIServiceConfig {
  provider: 'mistral' | 'gemini' | 'mock';
  apiKey: string;
  mistralApiKey: string;
  geminiApiKey: string;
  useMock: boolean;
  model: string;
  temperature: number;
  systemPrompt: string;
}

export interface AndroidRuntimePath {
  key: string;
  title: string;
  path: string;
  description: string;
  category: 'BASE' | 'APP RESOURCES' | 'SCRIPTS' | 'ENGINE' | 'ENGINE RESOURCES' | 'LAYOUT' | 'FILE';
  content?: string;
  isExecutable?: boolean;
}

export interface AndroidDaemonConfig {
  enabled: boolean;
  daemonUrl: string;
  connected: boolean;
  lastPingMs: number;
  lastChecked: number;
  bridgeMethod: 'DAEMON_HTTP' | 'NATIVE_JS_INTERFACE' | 'SHIZUKU_ADB' | 'SAF_STORAGE' | 'VIRTUAL_EMULATOR';
  rootAccess: boolean;
}

export interface VirtualSandboxFile {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: string;
  category: string;
  content?: string;
  isExecutable?: boolean;
  lastModified?: string;
}
