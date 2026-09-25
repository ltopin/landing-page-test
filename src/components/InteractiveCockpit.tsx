import React, { useState } from 'react';
import { EcgMonitorWave } from './EcgMonitorWave';
import { ClinicalCase, DialogueMessage, TimelineNode, CognitiveBias } from '../types';

interface InteractiveCockpitProps {
  clinicalCase: ClinicalCase;
  onOpenFullSimulation?: () => void;
}

export const InteractiveCockpit: React.FC<InteractiveCockpitProps> = ({
  clinicalCase,
  onOpenFullSimulation,
}) => {
  const [vitals, setVitals] = useState(clinicalCase.initialVitals);
  const [dialogues, setDialogues] = useState<DialogueMessage[]>(clinicalCase.initialDialogues);
  const [timeline, setTimeline] = useState<TimelineNode[]>(clinicalCase.initialTimeline);
  const [currentBias, setCurrentBias] = useState<CognitiveBias | null>({
    detected: true,
    type: 'Ancoragem & Fechamento Prematuro',
    title: 'Viés Detectado: Ancoragem / Fechamento Prematuro',
    description:
      'O estudante administrou nitrato sem antes checar derivações direitas (V3R/V4R), negligenciando risco de Infarto de Ventrículo Direito com hipotensão associada.',
    severity: 'high',
    correctiveGuidance: 'Suspenda o nitrato e administre cristalóides imediatos.',
  });
  const [selectedPrescription, setSelectedPrescription] = useState('AAS 300mg VO + Ticagrelor 180mg + O2 sob máscara 3L/min');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Quick preset semiology questions
  const sampleQuestions = [
    'A dor piora com a respiração profunda ou ao deitar?',
    'Sentiu náuseas, vômitos ou palidez súbita?',
    'Faz uso de algum remédio de pressão ou sildenafil recente?',
  ];

  const handleAskQuestion = (question: string) => {
    const studentMsg: DialogueMessage = {
      id: `std-${Date.now()}`,
      sender: 'aluno',
      authorName: 'Médico Residente (Você)',
      content: question,
      timestamp: '00:08:15',
    };

    let patientAnswer = 'Não doutor... a dor não muda com a respiração, parece um aperto de caminhão no peito.';
    if (question.includes('náuseas') || question.includes('palidez')) {
      patientAnswer = 'Vomitei uma vez antes do SAMU chegar e estou suando frio até agora...';
    } else if (question.includes('sildenafil') || question.includes('remédio')) {
      patientAnswer = 'Só tomo losartana 50mg pela manhã, nada de estimulante sexual.';
    }

    const patientMsg: DialogueMessage = {
      id: `pt-${Date.now()}`,
      sender: 'paciente',
      authorName: 'Paciente Virtual (Carlos) · Fala ofegante',
      content: `"${patientAnswer}"`,
      timestamp: '00:08:28',
      isAudioTranscription: true,
    };

    setDialogues((prev) => [...prev, studentMsg, patientMsg]);
  };

  const handleApplyPrescription = (orderText: string) => {
    const matched = clinicalCase.availableInterventions.find((i) =>
      orderText.toLowerCase().includes(i.label.toLowerCase().slice(0, 10))
    ) || clinicalCase.availableInterventions[0];

    const { impact } = matched;

    // Update vitals
    setVitals((prev) => {
      const newFc = Math.max(45, Math.min(180, prev.fc + impact.fcDelta));
      const newPas = Math.max(60, Math.min(220, prev.paSistolica + impact.paDelta[0]));
      const newPad = Math.max(35, Math.min(130, prev.paDiastolica + impact.paDelta[1]));
      const newSpo2 = Math.max(70, Math.min(100, prev.spo2 + impact.spo2Delta));
      const newStability = Math.max(10, Math.min(99, prev.stability + impact.stabilityDelta));

      let rhythm = prev.rhythm;
      if (newPas < 80) rhythm = 'taquicardia_sinusal';
      if (newStability > 85) rhythm = 'recuperacao';

      return {
        ...prev,
        fc: newFc,
        paSistolica: newPas,
        paDiastolica: newPad,
        spo2: newSpo2,
        stability: newStability,
        rhythm,
      };
    });

    // Add timeline node
    const nowNode: TimelineNode = {
      id: `tn-${Date.now()}`,
      time: '00:08:42',
      title: impact.eventTitle,
      description: impact.eventDesc,
      type: matched.type === 'contraindicated' || matched.type === 'caution' ? 'warning' : 'corrective',
    };
    setTimeline((prev) => [...prev, nowNode]);

    // Handle cognitive bias trigger
    if (impact.biasTriggered) {
      setCurrentBias(impact.biasTriggered);
    } else if (impact.stabilityDelta > 10) {
      setCurrentBias((b) => (b ? { ...b, correctiveGuidance: 'Boa conduta! Estabilidade hemodinâmica em ascensão.' } : null));
    }

    setFeedbackNotice(`Conduta executada: ${matched.label}`);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  return (
    <div className="bg-[#0b1320] rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6 text-[#eef0ff] border border-white/5">
      {/* Patient Header Banner & Dynamic Vital Monitor Strip */}
      <div className="bg-[#121c2d] p-4 sm:p-5 rounded-xl flex flex-wrap items-center justify-between gap-6 border border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1b2a43] flex items-center justify-center text-[#89f5e7] shrink-0">
            <span className="material-symbols-outlined text-[26px]">personal_injury</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif text-[18px] sm:text-[20px] font-bold text-white tracking-tight">
                {clinicalCase.name}, {clinicalCase.age} anos
              </h3>
              <span className="px-2.5 py-0.5 rounded bg-red-950/80 text-red-300 text-[10px] font-bold uppercase tracking-wider border border-red-500/30">
                {clinicalCase.priority} · {clinicalCase.bed}
              </span>
            </div>
            <p className="text-[13px] text-[#b0c8eb] mt-0.5">
              {clinicalCase.sector} · {clinicalCase.syndrome}
            </p>
          </div>
        </div>

        {/* Dynamic Vital Monitor Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#070c14] p-3 rounded-xl border border-[#1b2a43]/60 w-full lg:w-auto">
          <div className="px-3 py-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#b0c8eb]/70 block">
              FC (bpm)
            </span>
            <p className="text-[26px] font-bold text-red-400 tracking-tight flex items-center gap-1 font-mono tabular-nums leading-none mt-1">
              {vitals.fc}{' '}
              <span className="material-symbols-outlined text-[16px] animate-pulse">
                {vitals.fc > 100 ? 'arrow_upward' : 'favorite'}
              </span>
            </p>
          </div>
          <div className="px-3 py-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#b0c8eb]/70 block">
              PA (mmHg)
            </span>
            <p
              className={`text-[26px] font-bold tracking-tight font-mono tabular-nums leading-none mt-1 ${
                vitals.paSistolica < 90 ? 'text-amber-400' : 'text-[#89f5e7]'
              }`}
            >
              {vitals.paSistolica}/{vitals.paDiastolica}
            </p>
          </div>
          <div className="px-3 py-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#b0c8eb]/70 block">
              SpO2 (%)
            </span>
            <p
              className={`text-[26px] font-bold tracking-tight font-mono tabular-nums leading-none mt-1 ${
                vitals.spo2 < 93 ? 'text-yellow-300' : 'text-[#89f5e7]'
              }`}
            >
              {vitals.spo2}%
            </p>
          </div>
          <div className="px-3 py-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#b0c8eb]/70 block">
              FR (irpm)
            </span>
            <p className="text-[26px] font-bold text-[#89f5e7] tracking-tight font-mono tabular-nums leading-none mt-1">
              {vitals.fr}
            </p>
          </div>
        </div>
      </div>

      {/* Live ECG sweep strip */}
      <div className="space-y-1">
        <EcgMonitorWave bpm={vitals.fc} rhythm={vitals.rhythm} color="#89f5e7" height={52} />
      </div>

      {feedbackNotice && (
        <div className="bg-[#0e4b46] border border-[#89f5e7]/40 text-white text-[12px] px-3.5 py-2 rounded-lg flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#89f5e7] text-[18px]">verified</span>
            {feedbackNotice}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[#89f5e7]">Telemetria Recalculada</span>
        </div>
      )}

      {/* 3-Column Simulator Interactive Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Col 1: Paciente Virtual & Diálogo Deliberativo (4 cols) */}
        <div className="lg:col-span-4 bg-[#121c2d] p-5 rounded-xl flex flex-col justify-between space-y-4 border border-white/5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[14px] font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#89f5e7] text-[18px]">
                  record_voice_over
                </span>
                Diálogo Semiológico Ativo
              </span>
              <span className="text-[11px] font-bold text-[#89f5e7] uppercase tracking-wider">
                IA Fisiológica
              </span>
            </div>

            {/* Message Stream */}
            <div className="space-y-3 mt-4 text-[13px] max-h-[260px] overflow-y-auto pr-1">
              {dialogues.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg leading-relaxed ${
                    msg.sender === 'paciente'
                      ? 'bg-[#1f3350] border-l-2 border-[#89f5e7] text-white'
                      : msg.sender === 'sistema'
                      ? 'bg-[#070c14] border border-[#1b2a43] text-[#b0c8eb]'
                      : 'bg-[#18253b] text-[#faf8ff]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider mb-1">
                    <span className={msg.sender === 'paciente' ? 'text-[#89f5e7]' : 'text-[#b0c8eb]'}>
                      {msg.authorName}
                    </span>
                    <span className="text-white/40">{msg.timestamp}</span>
                  </div>
                  <p className={msg.sender === 'paciente' ? 'italic font-serif text-[15px]' : ''}>
                    {msg.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="pt-3">
              <span className="text-[10px] uppercase font-bold text-[#b0c8eb]/70 tracking-wider block mb-1.5">
                Perguntas Semiológicas Rápidas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskQuestion(q)}
                    className="text-[11px] bg-[#070c14] hover:bg-[#18253b] text-[#b0c8eb] hover:text-white px-2.5 py-1 rounded border border-[#1b2a43] text-left transition-colors truncate max-w-full"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Intervention Input Box */}
          <div className="pt-4 border-t border-white/10">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#b0c8eb] block mb-1.5">
              Prescrever / Intervir na Janela de Choque
            </label>
            <div className="flex gap-2">
              <input
                className="w-full bg-[#070c14] text-white text-[13px] px-3.5 py-2.5 rounded-lg border border-[#1b2a43] focus:outline-none focus:border-[#89f5e7]"
                type="text"
                value={selectedPrescription}
                onChange={(e) => setSelectedPrescription(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyPrescription(selectedPrescription);
                  }
                }}
              />
              <button
                onClick={() => handleApplyPrescription(selectedPrescription)}
                className="bg-[#0e4b46] hover:bg-[#00332f] text-white px-3.5 rounded-lg text-[13px] font-semibold flex items-center justify-center border border-[#89f5e7]/30 transition-colors"
                title="Administrar Prescrição"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>

            {/* Quick intervention buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {clinicalCase.availableInterventions.map((inv) => (
                <button
                  key={inv.id}
                  onClick={() => {
                    setSelectedPrescription(inv.label);
                    handleApplyPrescription(inv.label);
                  }}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-all ${
                    inv.type === 'caution'
                      ? 'bg-amber-950/60 text-amber-200 border border-amber-600/40 hover:bg-amber-900'
                      : 'bg-[#1b2a43] text-[#89f5e7] hover:bg-[#243757]'
                  }`}
                >
                  + {inv.label.split('+')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Col 2: Linha do Tempo de Conduta & Resposta Dinâmica (4 cols) */}
        <div className="lg:col-span-4 bg-[#121c2d] p-5 rounded-xl space-y-4 flex flex-col justify-between border border-white/5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[14px] font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#89f5e7] text-[18px]">timeline</span>
                Árvore de Decisão & Efeitos
              </span>
              <span className="text-[11px] font-mono text-[#b0c8eb]">Janela Crítica: 30 min</span>
            </div>

            {/* Vertical Timeline Track */}
            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10 max-h-[280px] overflow-y-auto pr-1">
              {timeline.map((node) => (
                <div key={node.id} className="relative">
                  <span
                    className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ${
                      node.type === 'warning'
                        ? 'bg-amber-400'
                        : node.type === 'corrective'
                        ? 'bg-[#89f5e7] ring-4 ring-[#89f5e7]/20'
                        : 'bg-[#89f5e7]'
                    }`}
                  />
                  <span className="text-[10px] font-mono uppercase text-[#b0c8eb] block">
                    {node.time} · {node.type === 'warning' ? 'Alerta Farmacodinâmico' : 'Decisão Clínica'}
                  </span>
                  <p className="text-[13px] text-white font-semibold leading-snug">{node.title}</p>
                  <p className="text-[12px] text-[#b0c8eb] mt-0.5 leading-relaxed">{node.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hemodynamic Stability Meter */}
          <div className="p-3.5 bg-[#0a1422] rounded-xl border border-white/5">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-bold uppercase tracking-wider text-[#b0c8eb]">
                Estabilidade Hemodinâmica
              </span>
              <span
                className={`font-bold font-mono ${
                  vitals.stability >= 75
                    ? 'text-[#89f5e7]'
                    : vitals.stability >= 50
                    ? 'text-yellow-300'
                    : 'text-red-400'
                }`}
              >
                {vitals.stability}% ({vitals.stability >= 75 ? 'Recuperando' : 'Instável'})
              </span>
            </div>
            <div className="w-full bg-[#1b2a43] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  vitals.stability >= 75
                    ? 'bg-[#89f5e7]'
                    : vitals.stability >= 50
                    ? 'bg-yellow-400'
                    : 'bg-red-500'
                }`}
                style={{ width: `${vitals.stability}%` }}
              />
            </div>
          </div>
        </div>

        {/* Col 3: Debriefing Metacognitivo & Auditoria de Decisão (4 cols) */}
        <div className="lg:col-span-4 bg-[#121c2d] p-5 rounded-xl space-y-4 flex flex-col justify-between border border-white/5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[14px] font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#89f5e7] text-[18px]">psychology</span>
                Debriefing Metacognitivo
              </span>
              <span className="px-2 py-0.5 rounded bg-[#89f5e7]/20 text-[#89f5e7] text-[10px] font-bold tracking-wider font-mono">
                Score DCN 92%
              </span>
            </div>

            {/* Cognitive Bias Detector Card */}
            {currentBias && (
              <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  <span className="text-[13px] font-bold">{currentBias.title}</span>
                </div>
                <p className="text-[12px] text-[#b0c8eb] leading-relaxed">{currentBias.description}</p>
                <div className="pt-1 text-[11px] text-[#89f5e7] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">tips_and_updates</span>
                  <span>{currentBias.correctiveGuidance}</span>
                </div>
              </div>
            )}

            {/* Competency Scoring Bars */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[10px] font-bold uppercase text-[#b0c8eb] tracking-wider block">
                Auditoria de Competências Práticas (DCN)
              </span>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-white">Anamnese Direcionada & Empatia</span>
                  <span className="font-semibold text-[#89f5e7] font-mono">95%</span>
                </div>
                <div className="w-full bg-[#1b2a43] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#89f5e7] h-full rounded-full" style={{ width: '95%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-white">Priorização de Exames Críticos</span>
                  <span className="font-semibold text-[#89f5e7] font-mono">90%</span>
                </div>
                <div className="w-full bg-[#1b2a43] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#89f5e7] h-full rounded-full" style={{ width: '90%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-white">Manejo Farmacológico Hemodinâmico</span>
                  <span className="font-semibold text-yellow-300 font-mono">
                    {Math.min(96, vitals.stability)}%
                  </span>
                </div>
                <div className="w-full bg-[#1b2a43] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full rounded-full"
                    style={{ width: `${Math.min(96, vitals.stability)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Callout / Full Workbench Action */}
          <div className="space-y-2">
            <div className="p-3 bg-[#0b1320] rounded-lg text-[12px] text-[#b0c8eb] flex items-center justify-between border border-white/5">
              <span>Rubrica de Avaliação Prática sincronizada ao prontuário.</span>
              <span className="material-symbols-outlined text-[#89f5e7] text-[18px]">verified</span>
            </div>
            {onOpenFullSimulation && (
              <button
                onClick={onOpenFullSimulation}
                className="w-full py-2.5 px-3 bg-[#1b2a43] hover:bg-[#25395c] text-[#89f5e7] rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 border border-[#89f5e7]/30 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_full</span>
                <span>Abrir Estação de Simulação em Tela Cheia</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
