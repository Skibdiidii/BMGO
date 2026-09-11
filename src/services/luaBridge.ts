import { BridgeResponse, ConsoleLogItem, RuntimeMode, ToastNotification, VirtualSandboxFile } from '../types';
import { defaultRuntimeAdapter, RuntimeAdapter } from './runtimeAdapter';
import { parseColorCodes } from './gmHelperCatalog';

type ToastListener = (toast: ToastNotification) => void;
type LogListener = (log: ConsoleLogItem) => void;
type StateChangeListener = (toggles: Record<string, boolean>) => void;
type ModeListener = (mode: RuntimeMode) => void;

class LuaBridgeService {
  private adapter: RuntimeAdapter = defaultRuntimeAdapter;
  private toastListeners: Set<ToastListener> = new Set();
  private logListeners: Set<LogListener> = new Set();
  private stateListeners: Set<StateChangeListener> = new Set();
  private modeListeners: Set<ModeListener> = new Set();
  private activeToggles: Record<string, boolean> = {};

  constructor() {
    if (typeof window !== 'undefined') {
      (window as any).LuaBridge = this;
    }
  }

  public getAdapter(): RuntimeAdapter {
    return this.adapter;
  }

  public getMode(): RuntimeMode {
    return this.adapter.getMode();
  }

  public setMode(mode: RuntimeMode): void {
    this.adapter.setMode(mode);
    this.emitLog({
      id: Math.random().toString(36).substring(2, 9),
      type: 'info',
      message: `LuaBridge runtime mode switched to ${mode}`,
      timestamp: new Date().toLocaleTimeString()
    });
    this.modeListeners.forEach((fn) => fn(mode));
  }

  public getSandboxFiles(): VirtualSandboxFile[] {
    return this.adapter.getSandboxFiles();
  }

  public readSandboxFile(path: string): string | null {
    return this.adapter.readSandboxFile(path);
  }

  public writeSandboxFile(path: string, content: string, name?: string): VirtualSandboxFile {
    const file = this.adapter.writeSandboxFile(path, content, name);
    this.emitLog({
      id: Math.random().toString(36).substring(2, 9),
      type: 'info',
      message: `[FS] Written ${file.path} (${file.size})`,
      timestamp: new Date().toLocaleTimeString()
    });
    this.dispatchToast(`^00FF00[FS] Saved: ${file.name}`);
    return file;
  }

  public deleteSandboxFile(id: string): void {
    this.adapter.deleteSandboxFile(id);
    this.emitLog({
      id: Math.random().toString(36).substring(2, 9),
      type: 'warn',
      message: `[FS] Removed file id ${id}`,
      timestamp: new Date().toLocaleTimeString()
    });
  }

  public testPathConnection(path: string): { verified: boolean; latencyMs: number; message: string } {
    return this.adapter.testPathConnection(path);
  }

  public async executeSandboxFile(path: string): Promise<BridgeResponse> {
    const content = this.readSandboxFile(path);
    if (!content) {
      const err = `File at path ${path} not found or empty`;
      this.dispatchToast(`^FF0000${err}`);
      return {
        success: false,
        error: err,
        timestamp: Date.now()
      };
    }
    return this.executeScript(content);
  }

  public onToast(listener: ToastListener): () => void {
    this.toastListeners.add(listener);
    return () => this.toastListeners.delete(listener);
  }

  public onLog(listener: LogListener): () => void {
    this.logListeners.add(listener);
    return () => this.logListeners.delete(listener);
  }

  public onStateChange(listener: StateChangeListener): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  public onModeChange(listener: ModeListener): () => void {
    this.modeListeners.add(listener);
    return () => this.modeListeners.delete(listener);
  }

  public getActiveToggles(): Record<string, boolean> {
    return { ...this.activeToggles };
  }

  public isToggleActive(cmd: string): boolean {
    return !!this.activeToggles[cmd];
  }

  public setToggle(cmd: string, active: boolean): void {
    this.activeToggles[cmd] = active;
    this.stateListeners.forEach((fn) => fn(this.activeToggles));
  }

  public async call(command: string, ...parameters: any[]): Promise<BridgeResponse> {
    const timeStr = new Date().toLocaleTimeString();

    this.emitLog({
      id: Math.random().toString(36).substring(2, 9),
      type: 'lua',
      message: `LuaBridge.call("${command}"${parameters.length ? ', ' + parameters.map(p => JSON.stringify(p)).join(', ') : ''})`,
      timestamp: timeStr
    });

    try {
      const resp = await this.adapter.call(command, ...parameters);

      if (resp.toast) {
        this.dispatchToast(resp.toast);
      }

      if (resp.success) {
        const currentlyActive = !!this.activeToggles[command];
        this.activeToggles[command] = !currentlyActive;
        this.stateListeners.forEach((fn) => fn(this.activeToggles));

        this.emitLog({
          id: Math.random().toString(36).substring(2, 9),
          type: 'success',
          message: `[OK] ${command} -> ${JSON.stringify(resp.result ?? 'done')}`,
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        this.emitLog({
          id: Math.random().toString(36).substring(2, 9),
          type: 'error',
          message: `[FAIL] ${command}: ${resp.error || 'Unknown error'}`,
          timestamp: new Date().toLocaleTimeString()
        });
      }

      return resp;
    } catch (err: any) {
      const errorMsg = err?.message || 'Bridge exception';
      this.emitLog({
        id: Math.random().toString(36).substring(2, 9),
        type: 'error',
        message: `[EXCEPTION] ${command}: ${errorMsg}`,
        timestamp: new Date().toLocaleTimeString()
      });
      const errorToast = `^FF0000Error: ${errorMsg}`;
      this.dispatchToast(errorToast);
      return {
        success: false,
        command,
        error: errorMsg,
        toast: errorToast,
        timestamp: Date.now()
      };
    }
  }

  public async executeScript(luaCode: string): Promise<BridgeResponse> {
    const timeStr = new Date().toLocaleTimeString();
    this.emitLog({
      id: Math.random().toString(36).substring(2, 9),
      type: 'lua',
      message: `Executing script (${luaCode.split('\n').length} lines)...`,
      timestamp: timeStr
    });

    try {
      const resp = await this.adapter.executeScript(luaCode);

      if (resp.toast) {
        this.dispatchToast(resp.toast);
      }

      if (resp.success) {
        this.emitLog({
          id: Math.random().toString(36).substring(2, 9),
          type: 'success',
          message: `Execution result:\n${resp.result ?? 'nil'}`,
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        this.emitLog({
          id: Math.random().toString(36).substring(2, 9),
          type: 'error',
          message: `Execution error: ${resp.error}`,
          timestamp: new Date().toLocaleTimeString()
        });
      }

      return resp;
    } catch (err: any) {
      const errorMsg = err?.message || 'Script error';
      this.emitLog({
        id: Math.random().toString(36).substring(2, 9),
        type: 'error',
        message: `Execution failed: ${errorMsg}`,
        timestamp: new Date().toLocaleTimeString()
      });
      return {
        success: false,
        error: errorMsg,
        toast: `^FF0000Script error: ${errorMsg}`,
        timestamp: Date.now()
      };
    }
  }

  private dispatchToast(rawText: string): void {
    const toastItem: ToastNotification = {
      id: Math.random().toString(36).substring(2, 9),
      rawText,
      segments: parseColorCodes(rawText),
      timestamp: Date.now()
    };
    this.toastListeners.forEach((fn) => fn(toastItem));
  }

  private emitLog(log: ConsoleLogItem): void {
    this.logListeners.forEach((fn) => fn(log));
  }
}

export const LuaBridge = new LuaBridgeService();
