import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { SimulationWorkbench } from './components/Screens/SimulationWorkbench';
import { OsceStationScreen } from './components/Screens/OsceStationScreen';
import { GovernanceDashboard } from './components/Screens/GovernanceDashboard';
import { AcademicPortalView } from './components/Screens/AcademicPortalView';
import { PilotoModal } from './components/PilotoModal';
import { LoginModal } from './components/LoginModal';
import { ActiveScreen } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('landing');
  const [isPilotoModalOpen, setIsPilotoModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Scroll to top when switching screens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e] selection:bg-[#89f5e7] selection:text-[#00201d]">
      {/* Top Header Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenPilotoModal={() => setIsPilotoModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Screen Routing */}
      <main className="flex-1 w-full">
        {currentScreen === 'landing' && (
          <LandingView
            onNavigate={(screen) => setCurrentScreen(screen)}
            onOpenPilotoModal={() => setIsPilotoModalOpen(true)}
          />
        )}

        {currentScreen === 'simulation' && (
          <SimulationWorkbench
            onBackToLanding={() => setCurrentScreen('landing')}
            onOpenPilotoModal={() => setIsPilotoModalOpen(true)}
          />
        )}

        {currentScreen === 'osce' && (
          <OsceStationScreen
            onBackToLanding={() => setCurrentScreen('landing')}
            onOpenPilotoModal={() => setIsPilotoModalOpen(true)}
          />
        )}

        {currentScreen === 'governance' && (
          <GovernanceDashboard
            onBackToLanding={() => setCurrentScreen('landing')}
            onOpenPilotoModal={() => setIsPilotoModalOpen(true)}
          />
        )}

        {currentScreen === 'portal' && (
          <AcademicPortalView
            onBackToLanding={() => setCurrentScreen('landing')}
            onOpenSimulation={() => setCurrentScreen('simulation')}
          />
        )}
      </main>

      {/* Modals */}
      <PilotoModal
        isOpen={isPilotoModalOpen}
        onClose={() => setIsPilotoModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(targetScreen) => setCurrentScreen(targetScreen)}
      />
    </div>
  );
}
