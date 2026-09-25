import React, { useState } from 'react';

interface GovernanceDashboardProps {
  onBackToLanding: () => void;
  onOpenPilotoModal: () => void;
}

export const GovernanceDashboard: React.FC<GovernanceDashboardProps> = ({
  onBackToLanding,
  onOpenPilotoModal,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<number | 'all'>('all');
  const [exportNotice, setExportNotice] = useState(false);

  const competencyMatrix = [
    { name: '1. Relação Médico-Paciente & Empatia', p1_4: 94, p5_8: 91, p9_12: 96, status: 'Conforme DCN' },
    { name: '2. Semiotécnica & Raciocínio Diagnóstico', p1_4: 86, p5_8: 89, p9_12: 93, status: 'Conforme DCN' },
    { name: '3. Farmacodinâmica & Prescrição Segura', p1_4: 72, p5_8: 81, p9_12: 89, status: 'Atenção 6º Per' },
    { name: '4. Suporte Avançado & Manejo de Choque', p1_4: 65, p5_8: 84, p9_12: 92, status: 'Conforme DCN' },
    { name: '5. Bioética, Terminalidade & Segurança', p1_4: 90, p5_8: 93, p9_12: 97, status: 'Padrão Ouro' },
  ];

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] pt-20 pb-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1280px] mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#eaedff]">
          <div>
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 text-[13px] text-[#0e4b46] hover:underline mb-2 font-medium"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Voltar à Apresentação Sim⁴
            </button>
            <div className="flex items-center gap-2">
              <span className="bg-[#eaedff] text-[#00332f] text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                Módulo 4 · Governança para Reitorias & MEC
              </span>
              <span className="text-[12px] text-[#404947]">Matriz Curricular CAEM / ABEM</span>
            </div>
            <h1 className="font-serif text-[28px] sm:text-[34px] font-medium text-[#00332f] tracking-tight mt-1">
              Painel de Evidências Regulatórias & Telemetria Curricular
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="bg-[#0e4b46] hover:bg-[#00332f] text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              <span>Exportar Dossiê de Evidências MEC</span>
            </button>
          </div>
        </div>

        {exportNotice && (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-[13px] font-medium flex items-center justify-between border border-emerald-200">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              Dossiê Institucional compilado com sucesso! Arquivo "Laudo_Auditoria_Competencias_DCN_2026.pdf" gerado com validação criptográfica.
            </span>
            <button onClick={() => setExportNotice(false)} className="text-emerald-700 font-bold text-[12px]">
              Fechar
            </button>
          </div>
        )}

        {/* Global Key Metrics for Deans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#eaedff] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#404947]">
              <span className="text-[12px] font-bold uppercase tracking-wider">Aderência DCN</span>
              <span className="material-symbols-outlined text-[#0e4b46] text-[20px]">verified</span>
            </div>
            <p className="font-serif text-[38px] font-bold text-[#00332f] leading-none">98.4%</p>
            <p className="text-[12px] text-emerald-700 font-semibold">Nota 5 / Padrão Máximo MEC</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#eaedff] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#404947]">
              <span className="text-[12px] font-bold uppercase tracking-wider">Alunos Ativos no Sim⁴</span>
              <span className="material-symbols-outlined text-[#0e4b46] text-[20px]">groups</span>
            </div>
            <p className="font-serif text-[38px] font-bold text-[#00332f] leading-none">1.240</p>
            <p className="text-[12px] text-[#404947]">Distribuídos do 1º ao 12º período</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#eaedff] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#404947]">
              <span className="text-[12px] font-bold uppercase tracking-wider">Simulações Auditadas</span>
              <span className="material-symbols-outlined text-[#0e4b46] text-[20px]">history_edu</span>
            </div>
            <p className="font-serif text-[38px] font-bold text-[#00332f] leading-none">18.950</p>
            <p className="text-[12px] text-emerald-700 font-semibold">+34% vs semestre anterior</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#eaedff] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[#404947]">
              <span className="text-[12px] font-bold uppercase tracking-wider">Redução de Iatrogenias</span>
              <span className="material-symbols-outlined text-[#0e4b46] text-[20px]">trending_down</span>
            </div>
            <p className="font-serif text-[38px] font-bold text-emerald-700 leading-none">-78%</p>
            <p className="text-[12px] text-[#404947]">Identificadas em ambiente simulado</p>
          </div>
        </div>

        {/* Competency Heatmap Matrix */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#eaedff] shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-[22px] font-bold text-[#00332f]">
                Matriz Curricular Longitudinal de Competências Médicas
              </h3>
              <p className="text-[13px] text-[#404947]">
                Acompanhamento por coorte: do ciclo propedêutico ao internato hospitalar.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 bg-[#f2f3ff] p-1 rounded-xl">
              <button
                onClick={() => setSelectedPeriod('all')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                  selectedPeriod === 'all'
                    ? 'bg-[#0e4b46] text-white shadow-sm'
                    : 'text-[#404947] hover:text-[#00332f]'
                }`}
              >
                Todos os Ciclos
              </button>
              <button
                onClick={() => setSelectedPeriod(1)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                  selectedPeriod === 1
                    ? 'bg-[#0e4b46] text-white shadow-sm'
                    : 'text-[#404947] hover:text-[#00332f]'
                }`}
              >
                Básico (1º-4º)
              </button>
              <button
                onClick={() => setSelectedPeriod(2)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                  selectedPeriod === 2
                    ? 'bg-[#0e4b46] text-white shadow-sm'
                    : 'text-[#404947] hover:text-[#00332f]'
                }`}
              >
                Clínico (5º-8º)
              </button>
              <button
                onClick={() => setSelectedPeriod(3)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                  selectedPeriod === 3
                    ? 'bg-[#0e4b46] text-white shadow-sm'
                    : 'text-[#404947] hover:text-[#00332f]'
                }`}
              >
                Internato (9º-12º)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#eaedff] text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                  <th className="py-3 px-4">Eixo de Competência DCN</th>
                  <th className="py-3 px-4">Ciclo Básico (1º-4º)</th>
                  <th className="py-3 px-4">Ciclo Clínico (5º-8º)</th>
                  <th className="py-3 px-4">Internato Médico (9º-12º)</th>
                  <th className="py-3 px-4">Auditoria Regulatória</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaedff]">
                {competencyMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#faf8ff] transition-colors">
                    <td className="py-4 px-4 font-semibold text-[#00332f]">{row.name}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#00332f]">{row.p1_4}%</span>
                        <div className="w-20 bg-[#eaedff] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0e4b46] h-full rounded-full"
                            style={{ width: `${row.p1_4}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#00332f]">{row.p5_8}%</span>
                        <div className="w-20 bg-[#eaedff] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0e4b46] h-full rounded-full"
                            style={{ width: `${row.p5_8}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0e4b46]">{row.p9_12}%</span>
                        <div className="w-20 bg-[#eaedff] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0d9488] h-full rounded-full"
                            style={{ width: `${row.p9_12}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          row.status.includes('Atenção')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cognitive Biases Analysis & LMS Sync */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-[#eaedff] shadow-sm space-y-4">
            <h3 className="font-serif text-[18px] font-bold text-[#00332f]">
              Top Vieses Cognitivos Detectados nas Turmas
            </h3>
            <p className="text-[12px] text-[#404947]">
              Mapeamento metacognitivo automatizado para guiar reuniões pedagógicas e tutoriais.
            </p>
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="font-semibold text-[#131b2e]">
                    Ancoragem / Fechamento Prematuro
                  </span>
                  <span className="font-mono font-bold text-amber-700">24% dos alunos</span>
                </div>
                <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '24%' }} />
                </div>
                <span className="text-[11px] text-[#404947] mt-0.5 block">
                  Ex: Não checar derivações direitas antes do nitrato em IAM inferior.
                </span>
              </div>

              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="font-semibold text-[#131b2e]">Viés de Representatividade</span>
                  <span className="font-mono font-bold text-amber-700">18% dos alunos</span>
                </div>
                <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '18%' }} />
                </div>
                <span className="text-[11px] text-[#404947] mt-0.5 block">
                  Ex: Tratar dispneia exclusivamente como asma e omitir TEP.
                </span>
              </div>

              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="font-semibold text-[#131b2e]">Omissão de Checklist de Segurança</span>
                  <span className="font-mono font-bold text-[#0e4b46]">7% dos alunos</span>
                </div>
                <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0e4b46] h-full rounded-full" style={{ width: '7%' }} />
                </div>
                <span className="text-[11px] text-[#404947] mt-0.5 block">
                  Excelente controle institucional perante a meta da OMS.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#eaedff] shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-serif text-[18px] font-bold text-[#00332f]">
                Integração com Sistemas Acadêmicos & LMS
              </h3>
              <p className="text-[12px] text-[#404947]">
                Sincronização bidirecional de notas de estações, espelhos de prova e presença.
              </p>
              <div className="space-y-2.5">
                <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#eaedff] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <div>
                      <p className="font-bold text-[13px] text-[#131b2e]">Canvas LMS</p>
                      <p className="text-[11px] text-[#404947]">Sincronização de notas ativa via LTI 1.3</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">Online</span>
                </div>

                <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#eaedff] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <div>
                      <p className="font-bold text-[13px] text-[#131b2e]">Moodle Acadêmico</p>
                      <p className="text-[11px] text-[#404947]">Webhooks de notas e presença configurados</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">Online</span>
                </div>

                <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#eaedff] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <div>
                      <p className="font-bold text-[13px] text-[#131b2e]">Blackboard Learn</p>
                      <p className="text-[11px] text-[#404947]">Conexão REST API homologada</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">Online</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenPilotoModal}
                className="w-full py-3 bg-[#0e4b46] hover:bg-[#00332f] text-white text-[13px] font-bold rounded-xl transition-colors shadow-sm"
              >
                Agendar Reunião Técnica de Integração
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
