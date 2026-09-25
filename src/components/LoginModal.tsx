import React, { useState } from 'react';
import { ActiveScreen } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (target: ActiveScreen) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [role, setRole] = useState<'docente' | 'aluno' | 'reitoria'>('docente');
  const [email, setEmail] = useState('docente@faculdade.edu.br');
  const [password, setPassword] = useState('••••••••');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'reitoria') {
      onLoginSuccess('governance');
    } else if (role === 'docente') {
      onLoginSuccess('osce');
    } else {
      onLoginSuccess('portal');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white text-[#131b2e] rounded-3xl shadow-2xl overflow-hidden border border-[#eaedff]">
        <div className="bg-[#00332f] text-white p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#89f5e7] bg-[#89f5e7]/15 px-2 py-0.5 rounded">
              Acesso Restrito
            </span>
            <h3 className="font-serif text-[20px] font-bold mt-1">Portal Acadêmico Sim⁴</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
              Perfil de Acesso
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-[#faf8ff] p-1 rounded-xl border border-[#eaedff]">
              <button
                type="button"
                onClick={() => {
                  setRole('docente');
                  setEmail('docente@faculdade.edu.br');
                }}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                  role === 'docente' ? 'bg-[#0e4b46] text-white' : 'text-[#404947]'
                }`}
              >
                Docente
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('aluno');
                  setEmail('residente@faculdade.edu.br');
                }}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                  role === 'aluno' ? 'bg-[#0e4b46] text-white' : 'text-[#404947]'
                }`}
              >
                Aluno
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('reitoria');
                  setEmail('coordenacao@faculdade.edu.br');
                }}
                className={`py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                  role === 'reitoria' ? 'bg-[#0e4b46] text-white' : 'text-[#404947]'
                }`}
              >
                Gestão/MEC
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
              E-mail Institucional ou RA
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
            />
          </div>

          <div className="p-3 bg-[#f2f3ff] rounded-xl text-[11px] text-[#404947]">
            <strong>Acesso Homologado:</strong> Acesso direto integrado com Single Sign-On (SSO) acadêmico e credenciais federadas CAFe / RNP.
          </div>

          <button
            type="submit"
            className="w-full bg-[#0e4b46] hover:bg-[#00332f] text-white py-3 rounded-xl font-bold text-[13px] shadow transition-colors"
          >
            Entrar no Ambiente
          </button>
        </form>
      </div>
    </div>
  );
};
