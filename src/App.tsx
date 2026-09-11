import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardHome } from './components/DashboardHome';
import { DashboardExecutor } from './components/DashboardExecutor';
import { DashboardScripts } from './components/DashboardScripts';
import { DashboardConfigs } from './components/DashboardConfigs';
import { DashboardHarumi } from './components/DashboardHarumi';
import { DashboardCommunity } from './components/DashboardCommunity';
import { DashboardSettings } from './components/DashboardSettings';
import { AndroidPathExplorer } from './components/AndroidPathExplorer';
import { DashboardFreeVPS } from './components/DashboardFreeVPS';
import { ExecutorOverlay } from './components/ExecutorOverlay';
import { ToastContainer } from './components/ToastContainer';
import { WhatsNewModal } from './components/WhatsNewModal';
import { StorageService } from './services/storage';
import { LATEST_VERSION } from './services/patchNotes';
import { LuaBridge } from './services/luaBridge';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(true);
  const [isWhatsNewOpen, setIsWhatsNewOpen] = useState<boolean>(false);
  const [injectedCode, setInjectedCode] = useState<string>('');
  const [runtimeMode, setRuntimeMode] = useState<'MOCK' | 'RUNTIME'>(LuaBridge.getMode());

  useEffect(() => {
    const lastSeen = StorageService.getLastVersionSeen();
    if (!lastSeen || lastSeen !== LATEST_VERSION) {
      setIsWhatsNewOpen(true);
    }

    const unsubMode = LuaBridge.onModeChange((m) => setRuntimeMode(m));
    return unsubMode;
  }, []);

  const handleOpenOverlay = () => {
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  const handleLoadScriptToExecutor = (code: string) => {
    setInjectedCode(code);
    setIsOverlayOpen(true);
  };

  const handleToggleRuntimeMode = () => {
    LuaBridge.setMode(runtimeMode === 'MOCK' ? 'RUNTIME' : 'MOCK');
  };

  return (
    <div className="min-h-screen bg-[#070a10] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenOverlay={handleOpenOverlay}
        onOpenWhatsNew={() => setIsWhatsNewOpen(true)}
        runtimeMode={runtimeMode}
        onToggleRuntimeMode={handleToggleRuntimeMode}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-20 md:pb-8">
        {activeTab === 'home' && (
          <DashboardHome
            onOpenExecutor={handleOpenOverlay}
            onNavigateTab={setActiveTab}
            onLoadScriptToExecutor={handleLoadScriptToExecutor}
          />
        )}
        {activeTab === 'executor' && (
          <DashboardExecutor
            onOpenOverlay={handleOpenOverlay}
            onLoadScriptToOverlay={handleLoadScriptToExecutor}
          />
        )}
        {activeTab === 'freevps' && (
          <DashboardFreeVPS
            onLoadScriptToOverlay={handleLoadScriptToExecutor}
            onOpenOverlay={handleOpenOverlay}
          />
        )}
        {activeTab === 'scripts' && (
          <DashboardScripts
            onLoadScriptToExecutor={handleLoadScriptToExecutor}
            onOpenExecutor={handleOpenOverlay}
          />
        )}
        {activeTab === 'sandbox' && (
          <AndroidPathExplorer
            onLoadScriptToOverlay={handleLoadScriptToExecutor}
            onOpenOverlay={handleOpenOverlay}
          />
        )}
        {activeTab === 'configs' && <DashboardConfigs />}
        {activeTab === 'harumi' && (
          <DashboardHarumi
            onLoadScriptToExecutor={handleLoadScriptToExecutor}
            onOpenExecutor={handleOpenOverlay}
          />
        )}
        {activeTab === 'community' && (
          <DashboardCommunity
            onLoadScriptToExecutor={handleLoadScriptToExecutor}
            onOpenExecutor={handleOpenOverlay}
          />
        )}
        {activeTab === 'settings' && <DashboardSettings />}
      </main>

      <ExecutorOverlay
        isOpen={isOverlayOpen}
        onOpen={handleOpenOverlay}
        onClose={handleCloseOverlay}
        externalCode={injectedCode}
        onCodeInjected={() => setInjectedCode('')}
      />

      <ToastContainer />

      <WhatsNewModal
        isOpen={isWhatsNewOpen}
        onClose={() => setIsWhatsNewOpen(false)}
      />
    </div>
  );
}
