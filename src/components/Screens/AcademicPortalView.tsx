import React, { useState } from 'react';

interface AcademicPortalViewProps {
  onBackToLanding: () => void;
  onOpenSimulation: () => void;
}

export const AcademicPortalView: React.FC<AcademicPortalViewProps> = ({
  onBackToLanding,
  onOpenSimulation,
}) => {
  const [userRole, setUserRole] = useState<'aluno' | 'docente'>('aluno');

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
                Ambiente Acadêmico Sim⁴
              </span>
              <span className="text-[12px] text-[#404947]">Faculdade de Ciências Médicas</span>
            </div>
            <h1 className="font-serif text-[28px] sm:text-[34px] font-medium text-[#00332f] tracking-tight mt-1">
              {userRole === 'aluno'
                ? 'Painel do Residente & Aluno de Medicina'
                : 'Portal do Docente & Preceptor Clínico'}
            </h1>
          </div>

          {/* Role switcher toggle */}
          <div className="flex items-center gap-2 bg-[#eaedff] p-1 rounded-xl">
            <button
              onClick={() => setUserRole('aluno')}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                userRole === 'aluno'
                  ? 'bg-[#0e4b46] text-white shadow-sm'
                  : 'text-[#404947] hover:text-[#00332f]'
              }`}
            >
              Visão Residente/Aluno
            </button>
            <button
              onClick={() => setUserRole('docente')}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                userRole === 'docente'
                  ? 'bg-[#0e4b46] text-white shadow-sm'
                  : 'text-[#404947] hover:text-[#00332f]'
              }`}
            >
              Visão Preceptor/Docente
            </button>
          </div>
        </div>

        {/* Student View */}
        {userRole === 'aluno' ? (
          <div className="space-y-8">
            {/* User Profile Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#eaedff] shadow-sm flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#00332f] text-white flex items-center justify-center font-bold text-[20px] font-serif">
                  AS
                </div>
                <div>
                  <h3 className="font-serif text-[20px] font-bold text-[#00332f]">
                    Amanda Silveira Costa
                  </h3>
                  <p className="text-[13px] text-[#404947]">
                    10º Período · Internato em Emergência e UTI · RA: 20210481
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <span className="text-[11px] font-bold uppercase text-[#404947] block">
                    Horas de Simulação
                  </span>
                  <span className="font-mono text-[22px] font-bold text-[#00332f]">48h</span>
                </div>
                <div className="text-center border-l border-[#eaedff] pl-6">
                  <span className="text-[11px] font-bold uppercase text-[#404947] block">
                    Casos Concluídos
                  </span>
                  <span className="font-mono text-[22px] font-bold text-[#00332f]">34</span>
                </div>
                <div className="text-center border-l border-[#eaedff] pl-6">
                  <span className="text-[11px] font-bold uppercase text-[#404947] block">
                    Média DCN
                  </span>
                  <span className="font-mono text-[22px] font-bold text-emerald-700">92%</span>
                </div>
              </div>
            </div>

            {/* Recent Simulation Cases */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#eaedff] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-[20px] font-bold text-[#00332f]">
                    Histórico Recente de Simulações
                  </h3>
                  <p className="text-[13px] text-[#404947]">
                    Clique em um caso para rever o debriefing e a curva de estabilidade hemodinâmica.
                  </p>
                </div>
                <button
                  onClick={onOpenSimulation}
                  className="bg-[#0e4b46] hover:bg-[#00332f] text-white px-4 py-2 rounded-lg text-[13px] font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">play_circle</span>
                  <span>Iniciar Nova Simulação</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#faf8ff] border border-[#eaedff] flex flex-wrap items-center justify-between gap-4 hover:border-[#0e4b46] transition-colors">
                  <div className="flex items-center gap-3.5">
                    <span className="material-symbols-outlined text-red-600 text-[26px]">
                      vital_signs
                    </span>
                    <div>
                      <p className="font-bold text-[14px] text-[#131b2e]">
                        Carlos E. Vasconcelos (IAM Inferior com Ventrículo Direito)
                      </p>
                      <p className="text-[12px] text-[#404947]">
                        Concluído há 2 horas · Tempo de porta-balão atingido em 42min.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase">
                      Nota DCN: 92%
                    </span>
                    <button
                      onClick={onOpenSimulation}
                      className="text-[#0e4b46] text-[12px] font-bold hover:underline"
                    >
                      Revisar Árvore
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#faf8ff] border border-[#eaedff] flex flex-wrap items-center justify-between gap-4 hover:border-[#0e4b46] transition-colors">
                  <div className="flex items-center gap-3.5">
                    <span className="material-symbols-outlined text-amber-600 text-[26px]">
                      air
                    </span>
                    <div>
                      <p className="font-bold text-[14px] text-[#131b2e]">
                        Dra. Mariana Costa (Crise Asmática Grave Refratária)
                      </p>
                      <p className="text-[12px] text-[#404947]">
                        Concluído ontem · Broncodilatação inalatória e sulfato de magnésio.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase">
                      Nota DCN: 88%
                    </span>
                    <button
                      onClick={onOpenSimulation}
                      className="text-[#0e4b46] text-[12px] font-bold hover:underline"
                    >
                      Revisar Árvore
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Preceptor View */
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#eaedff] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-[20px] font-bold text-[#00332f]">
                  Fila de Avaliações Práticas Pendentes
                </h3>
                <p className="text-[13px] text-[#404947]">
                  Alunos que finalizaram estações e aguardam validação de rubrica.
                </p>
              </div>
              <span className="text-[12px] font-bold text-[#0e4b46] bg-[#eaedff] px-3 py-1 rounded-full">
                4 Alunos na Fila
              </span>
            </div>

            <div className="divide-y divide-[#eaedff]">
              {[
                { name: 'Lucas Brandão', ra: '20210319', station: 'Estação 3: Dor Torácica Aguda', score: '9.4' },
                { name: 'Carolina Rezende', ra: '20210204', station: 'Estação 4: Choque Séptico UTI', score: '8.8' },
                { name: 'Gabriel Toledo', ra: '20210512', station: 'Estação 1: Reanimação Neonatal', score: '9.0' },
              ].map((student, i) => (
                <div key={i} className="py-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-[14px] text-[#131b2e]">{student.name}</p>
                    <p className="text-[12px] text-[#404947]">
                      RA: {student.ra} · {student.station}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[14px] font-bold text-emerald-700">
                      Nota: {student.score}
                    </span>
                    <button className="px-3.5 py-1.5 rounded-lg bg-[#0e4b46] text-white text-[12px] font-bold hover:bg-[#00332f]">
                      Homologar Espelho
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
