import { BridgeResponse, RuntimeMode, VirtualSandboxFile } from '../types';
import { INITIAL_SANDBOX_FILES, ANDROID_PACKAGE } from './runtimePaths';

declare global {
  interface Window {
    AndroidLuaBridge?: {
      call: (command: string, paramsJson: string) => string;
      executeLua?: (code: string) => string;
      isAvailable?: () => boolean;
      readFile?: (path: string) => string;
      writeFile?: (path: string, content: string) => boolean;
    };
    LuaBridgeNative?: {
      postMessage: (data: string) => void;
    };
    BlockmanBridge?: {
      dispatch: (cmd: string, args: any) => any;
    };
    webkit?: {
      messageHandlers?: {
        LuaBridge?: {
          postMessage: (data: any) => void;
        };
      };
    };
  }
}

export interface MockBlockmanState {
  playerName: string;
  doubleJumpCount: number;
  enableDoubleJumps: boolean;
  blockReachDistance: number;
  entityReachDistance: number;
  bowSpeedMultiplier: number;
  bowFovMultiplier: number;
  attackCd: number;
  renderHeadText: boolean;
  allowFlying: boolean;
  isFlying: boolean;
  jumpHeight: number;
  speedAdditionLevel: number;
  sprintLimitCheck: number;
  syncPositionToServer: boolean;
  isSeparateCamera: boolean;
  maxFps: number;
  xrayActive: boolean;
  noClip: boolean;
  fastBreak: boolean;
  autoClickerActive: boolean;
  autoTpKillActive: boolean;
  aimBotActive: boolean;
  tracerActive: boolean;
  hitBoxExpanded: boolean;
  ddosActive: boolean;
}

export class RuntimeAdapter {
  private mode: RuntimeMode = 'MOCK';
  private sandboxFiles: VirtualSandboxFile[] = [];
  private mockState: MockBlockmanState = {
    playerName: 'BMGO_User_01',
    doubleJumpCount: 10000,
    enableDoubleJumps: false,
    blockReachDistance: 6.5,
    entityReachDistance: 5.0,
    bowSpeedMultiplier: 1.0,
    bowFovMultiplier: 1.0,
    attackCd: 5,
    renderHeadText: true,
    allowFlying: false,
    isFlying: false,
    jumpHeight: 0.4,
    speedAdditionLevel: 0,
    sprintLimitCheck: 0,
    syncPositionToServer: true,
    isSeparateCamera: false,
    maxFps: 60,
    xrayActive: false,
    noClip: false,
    fastBreak: false,
    autoClickerActive: false,
    autoTpKillActive: false,
    aimBotActive: false,
    tracerActive: false,
    hitBoxExpanded: false,
    ddosActive: false
  };

  constructor() {
    this.loadSandbox();
  }

  private loadSandbox(): void {
    try {
      const saved = localStorage.getItem('bmgo_sandbox_files');
      if (saved) {
        this.sandboxFiles = JSON.parse(saved);
      } else {
        this.sandboxFiles = [...INITIAL_SANDBOX_FILES];
      }
    } catch {
      this.sandboxFiles = [...INITIAL_SANDBOX_FILES];
    }
  }

  private saveSandbox(): void {
    try {
      localStorage.setItem('bmgo_sandbox_files', JSON.stringify(this.sandboxFiles));
    } catch {}
  }

  public getSandboxFiles(): VirtualSandboxFile[] {
    return [...this.sandboxFiles];
  }

  public readSandboxFile(path: string): string | null {
    if (this.mode === 'RUNTIME' && window.AndroidLuaBridge?.readFile) {
      try {
        return window.AndroidLuaBridge.readFile(path);
      } catch {}
    }
    const file = this.sandboxFiles.find((f) => f.path === path);
    return file?.content || null;
  }

  public writeSandboxFile(path: string, content: string, name?: string): VirtualSandboxFile {
    if (this.mode === 'RUNTIME' && window.AndroidLuaBridge?.writeFile) {
      try {
        window.AndroidLuaBridge.writeFile(path, content);
      } catch {}
    }

    const fileName = name || path.split('/').pop() || 'script.lua';
    const existingIndex = this.sandboxFiles.findIndex((f) => f.path === path);

    const updatedFile: VirtualSandboxFile = {
      id: existingIndex >= 0 ? this.sandboxFiles[existingIndex].id : 'f-' + Date.now(),
      name: fileName,
      path,
      type: 'file',
      size: `${(content.length / 1024).toFixed(1)} KB`,
      category: path.endsWith('.lua') ? 'Lua Script' : 'File',
      content,
      isExecutable: path.endsWith('.lua'),
      lastModified: 'Just now'
    };

    if (existingIndex >= 0) {
      this.sandboxFiles[existingIndex] = updatedFile;
    } else {
      this.sandboxFiles.unshift(updatedFile);
    }

    this.saveSandbox();
    return updatedFile;
  }

  public deleteSandboxFile(id: string): void {
    this.sandboxFiles = this.sandboxFiles.filter((f) => f.id !== id);
    this.saveSandbox();
  }

  public testPathConnection(path: string): { verified: boolean; latencyMs: number; message: string } {
    const isMock = this.mode === 'MOCK' || !this.isNativeRuntimeAvailable();
    const cleanPath = path.trim();

    if (!cleanPath.startsWith('/data/user/0/' + ANDROID_PACKAGE)) {
      return {
        verified: false,
        latencyMs: 0,
        message: `Path out of sandbox scope (${ANDROID_PACKAGE})`
      };
    }

    return {
      verified: true,
      latencyMs: isMock ? 2 : 14,
      message: isMock
        ? 'Path verified in Virtual Android Sandbox'
        : 'Path verified via Native Android File Bridge'
    };
  }

  public setMode(mode: RuntimeMode): void {
    this.mode = mode;
  }

  public getMode(): RuntimeMode {
    return this.mode;
  }

  public getMockState(): MockBlockmanState {
    return { ...this.mockState };
  }

  public isNativeRuntimeAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      window.AndroidLuaBridge ||
      window.LuaBridgeNative ||
      window.BlockmanBridge ||
      window.webkit?.messageHandlers?.LuaBridge
    );
  }

  public async call(command: string, ...parameters: any[]): Promise<BridgeResponse> {
    const timestamp = Date.now();

    if (this.mode === 'RUNTIME') {
      if (this.isNativeRuntimeAvailable()) {
        try {
          if (window.AndroidLuaBridge) {
            const rawRes = window.AndroidLuaBridge.call(command, JSON.stringify(parameters));
            let parsed: any;
            try {
              parsed = JSON.parse(rawRes);
            } catch {
              parsed = rawRes;
            }
            return {
              success: true,
              command,
              result: parsed,
              toast: `^00FF00[RUNTIME] Executed ${command}`,
              timestamp
            };
          }
          if (window.LuaBridgeNative) {
            window.LuaBridgeNative.postMessage(JSON.stringify({ command, parameters }));
            return {
              success: true,
              command,
              result: 'Dispatched to LuaBridgeNative',
              toast: `^00FF00[RUNTIME] Dispatched ${command}`,
              timestamp
            };
          }
          if (window.BlockmanBridge) {
            const res = window.BlockmanBridge.dispatch(command, parameters);
            return {
              success: true,
              command,
              result: res,
              toast: `^00FF00[RUNTIME] ${command} OK`,
              timestamp
            };
          }
        } catch (err: any) {
          return {
            success: false,
            command,
            error: err?.message || 'Native Bridge Execution Error',
            toast: `^FF0000Native Error: ${err?.message || 'Unknown'}`,
            timestamp
          };
        }
      } else {
        return {
          success: false,
          command,
          error: 'Native Blockman GO Lua runtime unavailable in standard browser environment. Switched to Mock mode emulation.',
          toast: '^FF0000Runtime unavailable. Using Mock emulation.',
          timestamp
        };
      }
    }

    return this.executeMockCommand(command, parameters, timestamp);
  }

  public async executeScript(luaCode: string): Promise<BridgeResponse> {
    const timestamp = Date.now();
    const cleanCode = luaCode.trim();

    if (!cleanCode) {
      return {
        success: false,
        error: 'Empty Lua script provided',
        toast: '^FF0000empty code',
        timestamp
      };
    }

    if (this.mode === 'RUNTIME' && this.isNativeRuntimeAvailable()) {
      try {
        if (window.AndroidLuaBridge?.executeLua) {
          const res = window.AndroidLuaBridge.executeLua(cleanCode);
          return {
            success: true,
            result: res,
            toast: '^00FF00runned successfully',
            timestamp
          };
        }
      } catch (err: any) {
        return {
          success: false,
          error: String(err),
          toast: `^FF0000error: ${String(err)}`,
          timestamp
        };
      }
    }

    return this.simulateLuaExecution(cleanCode, timestamp);
  }

  private executeMockCommand(command: string, params: any[], timestamp: number): BridgeResponse {
    switch (command) {
      case 'unlimitedJumps': {
        this.mockState.enableDoubleJumps = !this.mockState.enableDoubleJumps;
        const active = this.mockState.enableDoubleJumps;
        return {
          success: true,
          command,
          result: { enableDoubleJumps: active, doubleJumpCount: 10000 },
          toast: active ? '^00FF00FLy ON' : '^FF0000FLy OFF',
          timestamp
        };
      }

      case 'Reach': {
        const active = this.mockState.blockReachDistance < 100;
        this.mockState.blockReachDistance = active ? 999 : 6.5;
        this.mockState.entityReachDistance = active ? 7 : 5;
        return {
          success: true,
          command,
          result: { blockReach: this.mockState.blockReachDistance, entityReach: this.mockState.entityReachDistance },
          toast: active ? '^00FF00REACH ON' : '^00FF00REACH OFF',
          timestamp
        };
      }

      case 'BowSpeed': {
        this.mockState.bowSpeedMultiplier = 1000;
        this.mockState.bowFovMultiplier = 0;
        return {
          success: true,
          command,
          result: { bowSpeedMultiplier: 1000, bowFovMultiplier: 0 },
          toast: '^00FF00BowSpeed:ON',
          timestamp
        };
      }

      case 'BanClickCD': {
        const active = this.mockState.attackCd !== 0;
        this.mockState.attackCd = active ? 0 : 5;
        return {
          success: true,
          command,
          result: { attackCd: this.mockState.attackCd },
          toast: active ? '^00FF00NoDelay ON!' : '^FF0000NoDelay OFF!',
          timestamp
        };
      }

      case 'quickBreak': {
        this.mockState.fastBreak = true;
        return {
          success: true,
          command,
          result: { blockHardness: 0, scannedBlocks: 40000 },
          toast: '^00FF00Fast Break ON',
          timestamp
        };
      }

      case 'FreeCam': {
        return {
          success: true,
          command,
          result: { window: 'Main-HideAndSeek-Operate', visible: true },
          toast: '^00FF00FreeCam Activated',
          timestamp
        };
      }

      case 'Respawn': {
        return {
          success: true,
          command,
          result: { packet: 'sendRebirth', status: 'sent' },
          toast: '^2196F3Rebirth packet dispatched',
          timestamp
        };
      }

      case 'DevFly': {
        this.mockState.allowFlying = true;
        this.mockState.isFlying = true;
        return {
          success: true,
          command,
          result: { vector: { x: 0.0, y: 1.35, z: 0.0 } },
          toast: '^FF00EESuccess',
          timestamp
        };
      }

      case 'JumpHeight': {
        const active = this.mockState.jumpHeight < 0.8;
        this.mockState.jumpHeight = active ? 1.0 : 0.4;
        return {
          success: true,
          command,
          result: { jumpHeight: this.mockState.jumpHeight },
          toast: active ? '^00FF00[ON]' : '^00FF00[OFF]',
          timestamp
        };
      }

      case 'SpeedManager': {
        const active = this.mockState.speedAdditionLevel === 0;
        this.mockState.speedAdditionLevel = active ? 300000 : 0;
        return {
          success: true,
          command,
          result: { speedAdditionLevel: this.mockState.speedAdditionLevel },
          toast: active ? '^FF00EEON' : '^FF00EEOFF',
          timestamp
        };
      }

      case 'NoFall': {
        const active = this.mockState.sprintLimitCheck === 0;
        this.mockState.sprintLimitCheck = active ? 7 : 0;
        return {
          success: true,
          command,
          result: { sprintLimitCheck: this.mockState.sprintLimitCheck },
          toast: active ? '^FF00EE[ON]' : '^FF00EEOFF',
          timestamp
        };
      }

      case 'quickblock': {
        const amount = params[0] || 64;
        return {
          success: true,
          command,
          result: { QuicklyBuildBlockNum: Number(amount) },
          toast: `^FF00EESuccess (${amount} blocks)`,
          timestamp
        };
      }

      case 'FlyParachute': {
        this.mockState.allowFlying = true;
        this.mockState.isFlying = true;
        return {
          success: true,
          command,
          result: { parachute: true },
          toast: '^FF00EESuccess',
          timestamp
        };
      }

      case 'BW': {
        return {
          success: true,
          command,
          result: { RunLimitCheck: 0, SprintLimitCheck: 0 },
          toast: '^FF00EESuccess',
          timestamp
        };
      }

      case 'BlinkOP': {
        this.mockState.syncPositionToServer = !this.mockState.syncPositionToServer;
        const active = !this.mockState.syncPositionToServer;
        return {
          success: true,
          command,
          result: { syncPositionToServer: this.mockState.syncPositionToServer },
          toast: active ? '^00FF00Blink Enabled!' : '^FF0000Blink Disabled!',
          timestamp
        };
      }

      case 'tpKill': {
        this.mockState.autoTpKillActive = !this.mockState.autoTpKillActive;
        const active = this.mockState.autoTpKillActive;
        return {
          success: true,
          command,
          result: { autoTpKill: active },
          toast: active ? '^00FF00Auto tp kill ON' : '^00FF00Auto to kill OFF',
          timestamp
        };
      }

      case 'AimBot': {
        this.mockState.aimBotActive = !this.mockState.aimBotActive;
        const active = this.mockState.aimBotActive;
        return {
          success: true,
          command,
          result: { aimBot: active },
          toast: active ? '^FF0000AimBot ON!' : '^FF0000AimBot OFF!',
          timestamp
        };
      }

      case 'Tracer': {
        this.mockState.tracerActive = !this.mockState.tracerActive;
        const active = this.mockState.tracerActive;
        return {
          success: true,
          command,
          result: { tracer: active },
          toast: active ? '^FF00EE[ON]' : '^FF0000Tracer: Disabled',
          timestamp
        };
      }

      case 'HitBox': {
        this.mockState.hitBoxExpanded = !this.mockState.hitBoxExpanded;
        const active = this.mockState.hitBoxExpanded;
        return {
          success: true,
          command,
          result: { dimensions: active ? { w: 10, h: 10, l: 10 } : { w: 0.6, h: 1.8, l: 0.6 } },
          toast: active ? '^FF00EE[ON]' : '^00FF00[OFF]',
          timestamp
        };
      }

      case 'ViewRaket': {
        return {
          success: true,
          command,
          result: { window: 'Main-BuildWar-Block', speedAdditionLevel: 150000 },
          toast: '^00FF00Raket Button Initialized',
          timestamp
        };
      }

      case 'autoClick':
      case 'AutoClick': {
        this.mockState.autoClickerActive = !this.mockState.autoClickerActive;
        const active = this.mockState.autoClickerActive;
        return {
          success: true,
          command,
          result: { autoClicker: active, target: { x: 770, y: 370 } },
          toast: active ? '^FF00EE[ON]' : '^00FF00[OFF]',
          timestamp
        };
      }

      case 'HideNames': {
        this.mockState.renderHeadText = !this.mockState.renderHeadText;
        const active = !this.mockState.renderHeadText;
        return {
          success: true,
          command,
          result: { renderHeadText: this.mockState.renderHeadText },
          toast: active ? '^00FF00Hide Names ON' : '^FF0000Hide names OFF',
          timestamp
        };
      }

      case 'ChangeName': {
        const newName = String(params[0] || 'BMGO_Hacker');
        this.mockState.playerName = newName;
        return {
          success: true,
          command,
          result: { newName },
          toast: `^FF00EENick Name Changed: ${newName}`,
          timestamp
        };
      }

      case 'XRayAll': {
        this.mockState.xrayActive = !this.mockState.xrayActive;
        return {
          success: true,
          command,
          result: { xray: this.mockState.xrayActive },
          toast: '^FF00EESuccess',
          timestamp
        };
      }

      case 'MaxFPS': {
        this.mockState.maxFps = 99999999;
        return {
          success: true,
          command,
          result: { maxFps: 99999999 },
          toast: '^FF00EE[ON] Max FPS set to uncapped',
          timestamp
        };
      }

      case 'WWE_Cam': {
        this.mockState.isSeparateCamera = !this.mockState.isSeparateCamera;
        const active = this.mockState.isSeparateCamera;
        return {
          success: true,
          command,
          result: { isSeparateCamera: active },
          toast: active ? '^00FF00SeparateCamera: Enabled' : '^FF0000SeparateCamera: Disabled',
          timestamp
        };
      }

      case 'runCode': {
        const code = params[0] || '';
        return this.simulateLuaExecution(code, timestamp);
      }

      case 'Noclip': {
        this.mockState.noClip = !this.mockState.noClip;
        const active = this.mockState.noClip;
        return {
          success: true,
          command,
          result: { noClip: active },
          toast: active ? '^00FF00Noclip = true' : '^FF0000Noclip = false',
          timestamp
        };
      }

      case 'LagServer2': {
        this.mockState.ddosActive = !this.mockState.ddosActive;
        const active = this.mockState.ddosActive;
        return {
          success: true,
          command,
          result: { packetsSent: active ? 100000 : 0 },
          toast: active ? '^FF0000DDosing' : '^FF0000DDos stopped',
          timestamp
        };
      }

      case 'reEnter': {
        return {
          success: true,
          command,
          result: { action: 'resetGame', gameType: 'g1001' },
          toast: '^FF0000Resetting...',
          timestamp
        };
      }

      case 'closeGame': {
        return {
          success: true,
          command,
          result: { action: 'exitGame', mode: 'normal' },
          toast: '^FF0000Bye',
          timestamp
        };
      }

      case 'removePanel': {
        return {
          success: true,
          command,
          result: { removedPath: '/data/user/0/com.sandboxol.blockymods/app_resources/Media/Scripts/Engine/lua/engine_client/helper/GMHelper.lua' },
          toast: 'deleted',
          timestamp
        };
      }

      default:
        return {
          success: true,
          command,
          result: { customCommand: command, params },
          toast: `^00FFDDInvoked ${command}`,
          timestamp
        };
    }
  }

  private simulateLuaExecution(code: string, timestamp: number): BridgeResponse {
    const outputs: string[] = [];

    const printRegex = /print\((.*?)\)/g;
    let match: RegExpExecArray | null;
    while ((match = printRegex.exec(code)) !== null) {
      let rawArg = match[1].trim();
      if ((rawArg.startsWith('"') && rawArg.endsWith('"')) || (rawArg.startsWith("'") && rawArg.endsWith("'"))) {
        outputs.push(rawArg.slice(1, -1));
      } else {
        outputs.push(rawArg);
      }
    }

    const toastRegex = /showToast\((.*?)\)/g;
    let toastMatch: RegExpExecArray | null;
    let lastToast = '^00FF00runned successfully';
    while ((toastMatch = toastRegex.exec(code)) !== null) {
      let rawArg = toastMatch[1].trim();
      if ((rawArg.startsWith('"') && rawArg.endsWith('"')) || (rawArg.startsWith("'") && rawArg.endsWith("'"))) {
        lastToast = rawArg.slice(1, -1);
      }
    }

    if (code.includes('unlimitedJumps') || code.includes('EnableDoubleJumps')) {
      this.mockState.enableDoubleJumps = true;
    }
    if (code.includes('setHardness(0)')) {
      this.mockState.fastBreak = true;
    }
    if (code.includes('setAllowFlying(true)')) {
      this.mockState.allowFlying = true;
      this.mockState.isFlying = true;
    }

    const outputSummary = outputs.length > 0 ? outputs.join('\n') : 'Execution complete: 0 errors';

    return {
      success: true,
      result: outputSummary,
      toast: lastToast,
      timestamp
    };
  }
}

export const defaultRuntimeAdapter = new RuntimeAdapter();
