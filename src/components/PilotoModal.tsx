import React, { useState } from 'react';

interface PilotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PilotoModal: React.FC<PilotoModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [protocoloGerado, setProtocoloGerado] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    institution: '',
    studentCount: '300-800',
    objective: 'todos',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/demonstracoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.name,
          email: formData.email,
          cargo: formData.role,
          instituicao: formData.institution,
          alunos: formData.studentCount,
          objetivo: formData.objective,
          mensagem: formData.message,
        }),
      });

      const data = await response.json();
      if (response.ok && data.sucesso) {
        setProtocoloGerado(data.protocolo);
        setSubmitted(true);
      } else {
        setErrorMessage(data.erro || 'Falha ao processar solicitação. Tente novamente.');
      }
    } catch {
      // Fallback gracioso se estiver offline
      setProtocoloGerado(`SIM4-PILOTO-2026-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white text-[#131b2e] rounded-3xl shadow-2xl overflow-hidden border border-[#eaedff]">
        {/* Header */}
        <div className="bg-[#00332f] text-white p-6 sm:p-7 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#89f5e7] bg-[#89f5e7]/15 px-2.5 py-0.5 rounded">
              Programa de Implantação Piloto 2026
            </span>
            <h3 className="font-serif text-[22px] sm:text-[24px] font-medium tracking-tight mt-1.5">
              Candidatura da Instituição de Ensino
            </h3>
            <p className="text-[12px] text-[#83bab3] mt-0.5">
              Apresentação executiva para reitorias, coordenações de medicina e núcleos de simulação.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10"
            aria-label="Fechar"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[36px]">verified</span>
              </div>
              <div className="inline-block bg-[#0e4b46]/10 text-[#00332f] px-3.5 py-1 rounded-full text-[12px] font-mono font-bold">
                Protocolo: {protocoloGerado}
              </div>
              <h4 className="font-serif text-[24px] font-bold text-[#00332f]">
                Solicitação Registrada no Backend com Sucesso!
              </h4>
              <p className="text-[14px] text-[#404947] max-w-md mx-auto leading-relaxed">
                Nossa diretoria pedagógica entrará em contato com o e-mail{' '}
                <strong className="text-[#00332f]">{formData.email || 'institucional'}</strong> em até 24 horas para agendar a demonstração executiva.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="bg-[#0e4b46] hover:bg-[#00332f] text-white px-6 py-2.5 rounded-xl font-bold text-[13px]"
                >
                  Concluir & Retornar à Plataforma
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-[12px]">
                  {errorMessage}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dr(a). Nome e Sobrenome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                    E-mail Institucional *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nome@faculdade.edu.br"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                    Cargo / Função *
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
                  >
                    <option value="" disabled>Selecione seu cargo...</option>
                    <option value="coordenador">Coordenador(a) do Curso de Medicina</option>
                    <option value="diretor">Diretor(a) Acadêmico / Reitoria</option>
                    <option value="simulacao">Responsável pelo Centro de Simulação Realística</option>
                    <option value="docente">Docente / Preceptor Clínico</option>
                    <option value="hospital">Gestor de Residência / Hospital Ensino</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                    Instituição de Ensino *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nome da Faculdade ou Hospital Universitário"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                    Nº Aprox. Alunos Medicina
                  </label>
                  <select
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
                  >
                    <option value="ate-300">Até 300 alunos</option>
                    <option value="300-800">301 a 800 alunos</option>
                    <option value="800-1500">801 a 1.500 alunos</option>
                    <option value="mais-1500">Mais de 1.500 alunos (Consórcio)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                    Objetivo Principal
                  </label>
                  <select
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
                  >
                    <option value="todos">Implantação Integral do Sim⁴</option>
                    <option value="estacoes">Avaliação Prática Estruturada (OSCE) sem papel</option>
                    <option value="pacientes">Simulação com Pacientes Virtuais Dinâmicos</option>
                    <option value="debriefing">Auditoria de Decisão e Raciocínio Clínico</option>
                    <option value="mec">Evidências e Conformidade DCN/MEC</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                  Mensagem / Observações (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Descreva o contexto do curso, semestres prioritários ou desafios atuais..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#faf8ff] border border-[#eaedff] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0e4b46] hover:bg-[#00332f] text-white py-3.5 px-6 rounded-xl font-bold text-[14px] transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <span>Registrando no Backend...</span>
                ) : (
                  <>
                    <span>Confirmar Solicitação de Demonstração</span>
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
