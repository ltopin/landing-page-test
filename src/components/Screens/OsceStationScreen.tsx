import React, { useState, useEffect } from 'react';

interface OsceStationScreenProps {
  onBackToLanding: () => void;
  onOpenPilotoModal: () => void;
}

interface ChecklistItem {
  id: string;
  category: string;
  text: string;
  weight: number;
  selectedScore: number; // 0, 0.5, or 1.0 (multiplier)
}

export const OsceStationScreen: React.FC<OsceStationScreenProps> = ({
  onBackToLanding,
  onOpenPilotoModal,
}) => {
  const [activeStation, setActiveStation] = useState(3);
  const [stationTime, setStationTime] = useState(360); // 6 minutes remaining
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [preceptorNotes, setPreceptorNotes] = useState(
    'Aluna demonstrou excelente postura ética, lavou as mãos antes do exame físico e identificou o supra no ECG sem hesitação.'
  );
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'c1',
      category: '1. Relação Médico-Paciente & Comunicação',
      text: 'Apresenta-se ao paciente, chama-o pelo nome e estabelece contato visual adequado.',
      weight: 1.0,
      selectedScore: 1.0,
    },
    {
      id: 'c2',
      category: '1. Relação Médico-Paciente & Comunicação',
      text: 'Explica os procedimentos de forma clara e empática antes da execução.',
      weight: 1.0,
      selectedScore: 1.0,
    },
    {
      id: 'c3',
      category: '2. Anamnese & Semiotécnica',
      text: 'Caracteriza a dor torácica: tipo, localização, irradiação, duração e fatores de melhora/piora.',
      weight: 2.0,
      selectedScore: 2.0,
    },
    {
      id: 'c4',
      category: '2. Anamnese & Semiotécnica',
      text: 'Pesquisa sintomas neurovegetativos (sudorese fria, náuseas, vômitos, pré-síncope).',
      weight: 1.5,
      selectedScore: 1.5,
    },
    {
      id: 'c5',
      category: '3. Exames Complementares & Diagnóstico',
      text: 'Solicita e interpreta ECG de 12 derivações dentro da janela preconizada (<10 min).',
      weight: 2.0,
      selectedScore: 2.0,
    },
    {
      id: 'c6',
      category: '3. Exames Complementares & Diagnóstico',
      text: 'Reconhece infarto de parede inferior e solicita derivações direitas (V3R e V4R).',
      weight: 1.5,
      selectedScore: 1.0, // Partial
    },
    {
      id: 'c7',
      category: '4. Conduta & Segurança do Paciente',
      text: 'Prescreve dupla antiagregação (AAS + Inibidor P2Y12) e evita nitratos pelo risco de choque.',
      weight: 1.0,
      selectedScore: 1.0,
    },
  ]);

  // Station timer tick
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setStationTime((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleScoreChange = (id: string, score: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selectedScore: score } : item))
    );
  };

  const totalPossible = checklist.reduce((acc, curr) => acc + curr.weight, 0);
  const totalEarned = checklist.reduce((acc, curr) => acc + curr.selectedScore, 0);
  const finalPercentage = Math.round((totalEarned / totalPossible) * 100);

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
                Módulo 2 · Avaliação Prática Estruturada
              </span>
              <span className="text-[12px] text-[#404947]">100% Digital sem Pranchetas de Papel</span>
            </div>
            <h1 className="font-serif text-[28px] sm:text-[34px] font-medium text-[#00332f] tracking-tight mt-1">
              Estação de Habilidades Clínicas: Dor Torácica Aguda
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenPilotoModal}
              className="bg-[#0e4b46] hover:bg-[#00332f] text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Solicitar Demonstração para Banca OSCE</span>
            </button>
          </div>
        </div>

        {/* Station Carousel / Track */}
        <div className="bg-white p-5 rounded-2xl border border-[#eaedff] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#404947]">
              Circuito OSCE · Turma 10º Período (Internato Médico)
            </span>
            <span className="text-[12px] font-semibold text-[#0e4b46]">
              8 Estações Simultâneas Ativas
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((st) => (
              <button
                key={st}
                onClick={() => setActiveStation(st)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  activeStation === st
                    ? 'bg-[#0e4b46] text-white border-[#0e4b46] shadow'
                    : 'bg-[#faf8ff] text-[#404947] border-[#eaedff] hover:bg-[#eaedff]'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block">
                  Estação {st}
                </span>
                <span className="font-bold text-[14px]">
                  {st === 1
                    ? 'Pediatria'
                    : st === 2
                    ? 'GO/Parto'
                    : st === 3
                    ? 'Cardiologia'
                    : st === 4
                    ? 'Trauma ATLS'
                    : st === 5
                    ? 'UTI Choque'
                    : st === 6
                    ? 'Saúde Família'
                    : st === 7
                    ? 'Cirurgia'
                    : 'Ética & Morte'}
                </span>
                <span className="text-[10px] block opacity-80 mt-0.5">
                  {st === activeStation ? 'Avaliando' : 'Rodando'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Evaluator Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Rubric (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#eaedff] shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#eaedff]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                  Candidato em Atendimento:
                </span>
                <h3 className="font-serif text-[20px] font-bold text-[#00332f]">
                  Amanda Silveira Costa (RA: 20210481)
                </h3>
              </div>

              {/* Station Timer Countdown */}
              <div className="flex items-center gap-3 bg-[#f2f3ff] px-4 py-2 rounded-xl border border-[#eaedff]">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#404947] block">
                    Tempo de Estação
                  </span>
                  <span className="font-mono text-[22px] font-bold text-[#00332f]">
                    {formatTimer(stationTime)}
                  </span>
                </div>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-1.5 rounded-lg bg-[#0e4b46] text-white hover:bg-[#00332f]"
                  title={isTimerRunning ? 'Pausar' : 'Iniciar'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isTimerRunning ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#404947] block">
                Rubrica Objetiva Parametrizada (Gabarito da Banca):
              </span>

              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#faf8ff] border border-[#eaedff] space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1 max-w-xl">
                      <span className="text-[10px] font-bold uppercase text-[#0e4b46] tracking-wider">
                        {item.category}
                      </span>
                      <p className="text-[14px] font-medium text-[#131b2e] leading-snug">
                        {item.text}
                      </p>
                    </div>
                    <span className="text-[12px] font-mono font-bold text-[#404947] bg-[#eaedff] px-2 py-0.5 rounded">
                      Peso: {item.weight.toFixed(1)} pts
                    </span>
                  </div>

                  {/* Radio grading row */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#eaedff]/60">
                    <button
                      onClick={() => handleScoreChange(item.id, item.weight)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-colors ${
                        item.selectedScore === item.weight
                          ? 'bg-[#0e4b46] text-white shadow-sm'
                          : 'bg-white border border-[#eaedff] text-[#404947] hover:bg-[#eaedff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Executou Integralmente ({item.weight.toFixed(1)})</span>
                    </button>

                    <button
                      onClick={() => handleScoreChange(item.id, item.weight * 0.5)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-colors ${
                        item.selectedScore === item.weight * 0.5
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-white border border-[#eaedff] text-[#404947] hover:bg-[#eaedff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">remove_circle</span>
                      <span>Parcial ({(item.weight * 0.5).toFixed(1)})</span>
                    </button>

                    <button
                      onClick={() => handleScoreChange(item.id, 0)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-colors ${
                        item.selectedScore === 0
                          ? 'bg-red-700 text-white shadow-sm'
                          : 'bg-white border border-[#eaedff] text-[#404947] hover:bg-[#eaedff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                      <span>Não Executou (0.0)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Preceptor observations */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                Observações Qualitativas do Preceptor
              </label>
              <textarea
                value={preceptorNotes}
                onChange={(e) => setPreceptorNotes(e.target.value)}
                rows={3}
                className="w-full bg-[#faf8ff] border border-[#eaedff] p-3.5 rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
              />
            </div>
          </div>

          {/* Right Summary & Grade Compilation Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#eaedff] shadow-sm space-y-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#404947] block">
                Compilação em Tempo Real
              </span>

              <div className="p-5 rounded-2xl bg-[#00332f] text-white space-y-2">
                <span className="text-[11px] uppercase font-bold text-[#89f5e7] tracking-wider">
                  Nota Provisória da Estação
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-[48px] font-bold leading-none">
                    {(totalEarned).toFixed(1)}
                  </span>
                  <span className="text-[18px] text-white/70">/ {totalPossible.toFixed(1)} pts</span>
                </div>
                <div className="flex items-center justify-between text-[13px] pt-1">
                  <span>Aproveitamento:</span>
                  <span className="font-bold text-[#89f5e7]">{finalPercentage}%</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-[#89f5e7] h-full rounded-full transition-all duration-300"
                    style={{ width: `${finalPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3 text-[13px] text-[#404947]">
                <div className="flex justify-between pb-2 border-b border-[#eaedff]">
                  <span>Status do Checklist:</span>
                  <span className="font-bold text-emerald-700">7/7 Itens Avaliados</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#eaedff]">
                  <span>Critério de Corte (60%):</span>
                  <span className="font-bold text-emerald-700">Apto / Aprovado</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#eaedff]">
                  <span>Sincronização LMS:</span>
                  <span className="font-bold text-[#0e4b46]">Pronto p/ Moodle/Canvas</span>
                </div>
              </div>

              <button
                onClick={() => setSubmittedFeedback(true)}
                className="w-full bg-[#0e4b46] hover:bg-[#00332f] text-white py-3 rounded-xl font-bold text-[13px] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Finalizar Avaliação & Salvar Espelho</span>
              </button>

              {submittedFeedback && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-[12px] flex items-center gap-2 border border-emerald-200">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Nota sincronizada! O aluno Amanda receberá o espelho automaticamente.</span>
                </div>
              )}
            </div>

            {/* Institutional Security Notice */}
            <div className="bg-[#f2f3ff] p-5 rounded-2xl border border-[#eaedff] text-[12px] text-[#404947] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#00332f]">
                <span className="material-symbols-outlined text-[18px]">security</span>
                <span>Auditoria & Imparcialidade</span>
              </div>
              <p className="leading-relaxed">
                Cada clique do preceptor é assinado digitalmente com carimbo de tempo (timestamp), eliminando contestações de recurso de banca examinadora perante o MEC.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
