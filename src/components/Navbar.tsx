import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { ActiveScreen } from '../types';

interface NavbarProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenPilotoModal: () => void;
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onOpenPilotoModal,
  onOpenLoginModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (screen: ActiveScreen, anchorId?: string) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
    if (anchorId && screen === 'landing') {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#faf8ff]/90 backdrop-blur-xl border-b border-[#eaedff] shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-all">
      <div className="h-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand Area */}
        <div className="flex items-center gap-6 lg:gap-8">
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <BrandLogo className="h-8 sm:h-9 w-auto" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-[20px] font-semibold text-[#00332f] tracking-tight leading-none">
                  Sim⁴
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#89f5e7] text-[#00201d] leading-none">
                  Med Ed
                </span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#404947] mt-0.5 leading-tight">
                Simulação Clínica Integral
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-5 text-[14px]">
            <button
              onClick={() => handleNavClick('landing', 'metodo-sim4')}
              className={`font-medium transition-colors hover:text-[#00332f] ${
                currentScreen === 'landing' ? 'text-[#00332f] font-semibold' : 'text-[#404947]'
              }`}
            >
              O Método Sim⁴
            </button>
            <button
              onClick={() => handleNavClick('simulation')}
              className={`font-medium transition-colors hover:text-[#00332f] flex items-center gap-1.5 ${
                currentScreen === 'simulation'
                  ? 'text-[#0e4b46] font-bold border-b-2 border-[#0e4b46] pb-0.5'
                  : 'text-[#404947]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488]" />
              Plataforma & Simulação
            </button>
            <button
              onClick={() => handleNavClick('osce')}
              className={`font-medium transition-colors hover:text-[#00332f] ${
                currentScreen === 'osce'
                  ? 'text-[#0e4b46] font-bold border-b-2 border-[#0e4b46] pb-0.5'
                  : 'text-[#404947]'
              }`}
            >
              Avaliação Prática (OSCE)
            </button>
            <button
              onClick={() => handleNavClick('governance')}
              className={`font-medium transition-colors hover:text-[#00332f] ${
                currentScreen === 'governance'
                  ? 'text-[#0e4b46] font-bold border-b-2 border-[#0e4b46] pb-0.5'
                  : 'text-[#404947]'
              }`}
            >
              Impacto Institucional / MEC
            </button>
            <button
              onClick={() => handleNavClick('landing', 'casos-de-uso')}
              className="font-medium text-[#404947] hover:text-[#00332f] transition-colors"
            >
              Casos de Uso
            </button>
            <button
              onClick={() => handleNavClick('landing', 'solicitar-piloto')}
              className="font-medium text-[#404947] hover:text-[#00332f] transition-colors"
            >
              Preços / Piloto
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLoginModal}
            className="hidden sm:inline-flex items-center font-medium text-[13px] text-[#00332f] hover:text-[#0e4b46] px-3 py-2 rounded-lg hover:bg-[#eaedff] transition-colors"
          >
            Login Acadêmico / Docente
          </button>

          <button
            onClick={onOpenPilotoModal}
            className="relative inline-flex items-center gap-2 bg-[#0e4b46] text-white hover:bg-[#00332f] text-[13px] font-semibold px-3.5 sm:px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all group"
          >
            <span className="whitespace-nowrap">Agendar Apresentação</span>
            <span className="hidden md:inline-block bg-[#89f5e7] text-[#00201d] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              Piloto 2026
            </span>
          </button>

          {/* User Avatar / Portal Switcher */}
          <button
            onClick={() => onNavigate('portal')}
            title="Abrir Portal Acadêmico"
            className="w-9 h-9 rounded-full bg-[#00332f] text-white flex items-center justify-center shrink-0 hover:ring-2 hover:ring-[#89f5e7] transition-all ml-1"
          >
            <span className="material-symbols-outlined text-[19px]">person</span>
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-[#00332f] hover:bg-[#eaedff]"
            aria-label="Abrir Menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#faf8ff] border-b border-[#eaedff] px-6 py-4 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2 text-[14px]">
            <button
              onClick={() => handleNavClick('landing')}
              className="text-left py-2 font-medium text-[#00332f]"
            >
              Visão Geral Sim⁴
            </button>
            <button
              onClick={() => handleNavClick('simulation')}
              className="text-left py-2 font-medium text-[#0e4b46] flex items-center justify-between"
            >
              <span>Cockpit de Simulação Interativo</span>
              <span className="text-[10px] bg-[#89f5e7] text-[#00201d] px-2 py-0.5 rounded font-bold uppercase">
                Ao Vivo
              </span>
            </button>
            <button
              onClick={() => handleNavClick('osce')}
              className="text-left py-2 font-medium text-[#00332f]"
            >
              Estações Práticas (OSCE)
            </button>
            <button
              onClick={() => handleNavClick('governance')}
              className="text-left py-2 font-medium text-[#00332f]"
            >
              Painel Governança & MEC
            </button>
            <button
              onClick={() => handleNavClick('landing', 'casos-de-uso')}
              className="text-left py-2 font-medium text-[#404947]"
            >
              Casos de Uso por Período
            </button>
            <button
              onClick={() => handleNavClick('portal')}
              className="text-left py-2 font-medium text-[#00332f] border-t border-[#eaedff] pt-3"
            >
              Portal Acadêmico do Aluno
            </button>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLoginModal();
              }}
              className="w-full text-center py-2.5 rounded-lg border border-[#0e4b46] text-[#0e4b46] font-medium text-[13px]"
            >
              Acesso Docente / Coordenador
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPilotoModal();
              }}
              className="w-full text-center py-2.5 rounded-lg bg-[#0e4b46] text-white font-medium text-[13px]"
            >
              Solicitar Piloto 2026
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
