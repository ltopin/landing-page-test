import React, { useState } from 'react';
import { clinicalCases } from '../../data/clinicalCases';
import { EcgMonitorWave } from '../EcgMonitorWave';
import { ClinicalCase, VitalSigns, TimelineNode } from '../../types';

interface SimulationWorkbenchProps {
  onBackToLanding: () => void;
  onOpenPilotoModal: () => void;
}

export const SimulationWorkbench: React.FC<SimulationWorkbenchProps> = ({
  onBackToLanding,
  onOpenPilotoModal,
}) => {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const currentCase: ClinicalCase = clinicalCases[activeCaseIndex];

  const [vitals, setVitals] = useState<VitalSigns>(currentCase.initialVitals);
  const [activeTab, setActiveTab] = useState<'cockpit' | 'exames' | 'fisico' | 'prescricao' | 'debriefing'>('cockpit');
  const [selectedExam, setSelectedExam] = useState<'ecg' | 'rx' | 'tropo' | 'gaso'>('ecg');
  const [timerSeconds, setTimerSeconds] = useState(522); // 8m42s
  const [timeline, setTimeline] = useState<TimelineNode[]>(currentCase.initialTimeline);
  const [audioAlarmMuted, setAudioAlarmMuted] = useState(false);
  const [examLog, setExamLog] = useState<string[]>(['ECG 12 derivações realizado na admissão.']);
  const [customOrder, setCustomOrder] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Format mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleCaseChange = (idx: number) => {
    setActiveCaseIndex(idx);
    const c = clinicalCases[idx];
    setVitals(c.initialVitals);
    setTimeline(c.initialTimeline);
    setExamLog(['ECG 12 derivações solicitado na admissão.']);
  };

  const triggerIntervention = (invId: string) => {
    const inv = currentCase.availableInterventions.find((i) => i.id === invId);
    if (!inv) return;

    const { impact } = inv;
    setVitals((prev) => ({
      ...prev,
      fc: Math.max(40, Math.min(180, prev.fc + impact.fcDelta)),
      paSistolica: Math.max(50, Math.min(220, prev.paSistolica + impact.paDelta[0])),
      paDiastolica: Math.max(30, Math.min(130, prev.paDiastolica + impact.paDelta[1])),
      spo2: Math.max(70, Math.min(100, prev.spo2 + impact.spo2Delta)),
      stability: Math.max(10, Math.min(100, prev.stability + impact.stabilityDelta)),
    }));

    const newNode: TimelineNode = {
      id: `act-${Date.now()}`,
      time: formatTime(timerSeconds),
      title: impact.eventTitle,
      description: impact.eventDesc,
      type: inv.type === 'contraindicated' || inv.type === 'caution' ? 'warning' : 'corrective',
    };
    setTimeline((prev) => [...prev, newNode]);

    setActionNotice(`${inv.label} administrado com sucesso.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#070c14] text-[#eef0ff] pt-20 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0b1320] p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-1.5 text-[13px] text-[#89f5e7] hover:text-white px-3 py-1.5 rounded-lg bg-[#121c2d] hover:bg-[#1b2a43] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Visão Geral</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#89f5e7] bg-[#89f5e7]/10 px-2 py-0.5 rounded">
                  Estação de Habilidades Práticas #04
                </span>
                <span className="text-white/40 text-[12px]">·</span>
                <span className="text-[12px] text-[#b0c8eb]">Sala de Choque Cardiovascular</span>
              </div>
              <h1 className="font-serif text-[18px] sm:text-[22px] font-bold text-white tracking-tight">
                Simulação Fisiológica Ativa: {currentCase.name}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Case Selector */}
            <div className="flex items-center gap-2 bg-[#121c2d] p-1.5 rounded-lg border border-white/10">
              <span className="text-[11px] uppercase tracking-wider text-[#b0c8eb] px-2 font-bold">
                Trocar Caso:
              </span>
              {clinicalCases.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => handleCaseChange(idx)}
                  className={`text-[12px] px-3 py-1 rounded transition-colors font-medium ${
                    activeCaseIndex === idx
                      ? 'bg-[#0e4b46] text-white font-bold shadow-sm'
                      : 'text-[#b0c8eb] hover:text-white'
                  }`}
                >
                  {c.name.split(' ')[0]} ({c.syndrome.includes('SCA') ? 'IAM/VD' : 'Asma'})
                </button>
              ))}
            </div>

            {/* Station Timer */}
            <div className="flex items-center gap-2 bg-[#070c14] px-3.5 py-1.5 rounded-lg border border-[#1b2a43]">
              <span className="material-symbols-outlined text-amber-400 text-[18px] animate-pulse">
                timer
              </span>
              <span className="text-[14px] font-mono font-bold text-amber-400 tracking-wider">
                {formatTime(timerSeconds)}
              </span>
              <span className="text-[10px] uppercase text-[#b0c8eb]">/ 10:00 max</span>
            </div>

            {/* Mute Telemetry Tone */}
            <button
              onClick={() => setAudioAlarmMuted(!audioAlarmMuted)}
              className={`p-2 rounded-lg border text-[13px] flex items-center gap-1.5 transition-colors ${
                audioAlarmMuted
                  ? 'bg-red-950/40 border-red-500/30 text-red-300'
                  : 'bg-[#121c2d] border-white/10 text-[#89f5e7]'
              }`}
              title={audioAlarmMuted ? 'Alarme Silenciado' : 'Silenciar Alarme de Leito'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {audioAlarmMuted ? 'volume_off' : 'volume_up'}
              </span>
              <span className="text-[11px] font-semibold">
                {audioAlarmMuted ? 'Mudo' : 'Bip 72dB'}
              </span>
            </button>
          </div>
        </div>

        {/* Global Multi-parameter Patient Monitor */}
        <div className="bg-[#0b1320] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* HR */}
            <div className="bg-[#070c14] p-3.5 rounded-xl border border-red-500/20">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-red-400">
                <span>Freq. Cardíaca</span>
                <span className="material-symbols-outlined text-[16px] animate-bounce">favorite</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[34px] font-mono font-bold text-red-400 tabular-nums leading-none">
                  {vitals.fc}
                </span>
                <span className="text-[12px] text-red-400/80 font-mono">bpm</span>
              </div>
              <span className="text-[10px] text-white/50 block mt-1">Alarme: 50 - 100</span>
            </div>

            {/* BP */}
            <div className="bg-[#070c14] p-3.5 rounded-xl border border-[#89f5e7]/20">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#89f5e7]">
                <span>Pressão Arterial</span>
                <span className="text-[10px] font-mono">PNI</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span
                  className={`text-[34px] font-mono font-bold tabular-nums leading-none ${
                    vitals.paSistolica < 90 ? 'text-amber-400' : 'text-[#89f5e7]'
                  }`}
                >
                  {vitals.paSistolica}/{vitals.paDiastolica}
                </span>
                <span className="text-[12px] text-[#89f5e7]/80 font-mono">mmHg</span>
              </div>
              <span className="text-[10px] text-white/50 block mt-1">PAM: {Math.round((vitals.paSistolica + 2 * vitals.paDiastolica) / 3)} mmHg</span>
            </div>

            {/* SpO2 */}
            <div className="bg-[#070c14] p-3.5 rounded-xl border border-yellow-400/20">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-yellow-300">
                <span>Oximetria Pulso</span>
                <span className="text-[10px] font-mono">Pleth</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[34px] font-mono font-bold text-yellow-300 tabular-nums leading-none">
                  {vitals.spo2}
                </span>
                <span className="text-[12px] text-yellow-300/80 font-mono">%</span>
              </div>
              <span className="text-[10px] text-white/50 block mt-1">Meta DCN: &gt;94%</span>
            </div>

            {/* FR */}
            <div className="bg-[#070c14] p-3.5 rounded-xl border border-[#89f5e7]/20">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#89f5e7]">
                <span>Freq. Respiratória</span>
                <span className="text-[10px] font-mono">Imped.</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[34px] font-mono font-bold text-[#89f5e7] tabular-nums leading-none">
                  {vitals.fr}
                </span>
                <span className="text-[12px] text-[#89f5e7]/80 font-mono">irpm</span>
              </div>
              <span className="text-[10px] text-white/50 block mt-1">Padrão: {vitals.fr > 22 ? 'Taquipneia' : 'Eupneico'}</span>
            </div>

            {/* Stability Score */}
            <div className="bg-[#070c14] p-3.5 rounded-xl border border-emerald-400/20 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-emerald-400">
                <span>Índice Fisiológico</span>
                <span className="text-[10px] font-mono">Sim⁴ Core</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[34px] font-mono font-bold text-emerald-300 tabular-nums leading-none">
                  {vitals.stability}%
                </span>
              </div>
              <div className="w-full bg-[#1b2a43] h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${vitals.stability}%` }}
                />
              </div>
            </div>
          </div>

          {/* Dual ECG & Pleth Waveform Canvas */}
          <div className="space-y-2">
            <EcgMonitorWave bpm={vitals.fc} rhythm={vitals.rhythm} color="#89f5e7" height={58} />
          </div>
        </div>

        {actionNotice && (
          <div className="bg-[#0e4b46] border border-[#89f5e7]/40 text-white text-[13px] px-4 py-2.5 rounded-xl flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#89f5e7]">check_circle</span>
              {actionNotice}
            </span>
            <span className="text-[11px] font-mono uppercase text-[#89f5e7]">
              Resposta Hemodinâmica Aplicada
            </span>
          </div>
        )}

        {/* Tab Navigation for Workbench Modes */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'cockpit'
                ? 'bg-[#0e4b46] text-white shadow-sm'
                : 'text-[#b0c8eb] hover:text-white hover:bg-[#121c2d]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">personal_injury</span>
            <span>Leito & Condutas Rápidas</span>
          </button>
          <button
            onClick={() => setActiveTab('exames')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'exames'
                ? 'bg-[#0e4b46] text-white shadow-sm'
                : 'text-[#b0c8eb] hover:text-white hover:bg-[#121c2d]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">radiology</span>
            <span>Exames Complementares (ECG/RX/Lab)</span>
          </button>
          <button
            onClick={() => setActiveTab('fisico')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'fisico'
                ? 'bg-[#0e4b46] text-white shadow-sm'
                : 'text-[#b0c8eb] hover:text-white hover:bg-[#121c2d]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">stethoscope</span>
            <span>Exame Físico Dirigido</span>
          </button>
          <button
            onClick={() => setActiveTab('debriefing')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'debriefing'
                ? 'bg-[#0e4b46] text-white shadow-sm'
                : 'text-[#b0c8eb] hover:text-white hover:bg-[#121c2d]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span>Debriefing DCN & Auditoria</span>
          </button>
        </div>

        {/* Tab 1: Cockpit & Fast Interventions */}
        {activeTab === 'cockpit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-[#0b1320] p-5 rounded-2xl border border-white/5 space-y-4">
                <h3 className="font-serif text-[18px] text-white font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#89f5e7]">medication</span>
                  Armário Farmacológico & Condutas de Emergência
                </h3>
                <p className="text-[13px] text-[#b0c8eb]">
                  Selecione a conduta terapêutica desejada. O motor farmacodinâmico calculará a resposta pressórica e eletrocardiográfica em tempo real.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {currentCase.availableInterventions.map((inv) => (
                    <div
                      key={inv.id}
                      className="bg-[#121c2d] p-4 rounded-xl border border-white/5 flex flex-col justify-between hover:border-[#89f5e7]/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[13px] font-bold text-white">{inv.label}</span>
                          <span
                            className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                              inv.type === 'caution'
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-600/40'
                                : inv.type === 'contraindicated'
                                ? 'bg-red-950/80 text-red-300 border border-red-600/40'
                                : 'bg-[#0e4b46] text-[#89f5e7]'
                            }`}
                          >
                            {inv.type === 'caution' ? 'Cuidado' : inv.type === 'contraindicated' ? 'Iatrogenia' : 'Diretriz'}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#b0c8eb] leading-relaxed mb-3">
                          {inv.description}
                        </p>
                      </div>

                      <button
                        onClick={() => triggerIntervention(inv.id)}
                        className="w-full py-2 px-3 rounded-lg bg-[#0e4b46] hover:bg-[#00332f] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                        <span>Administrar Intervenção</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Custom Doctor Prescription Line */}
                <div className="pt-3 border-t border-white/10">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#b0c8eb] block mb-1">
                    Ordem Médica Customizada
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: Fentanil 50mcg IV + Sequência rápida de intubação..."
                      value={customOrder}
                      onChange={(e) => setCustomOrder(e.target.value)}
                      className="w-full bg-[#070c14] border border-[#1b2a43] px-3.5 py-2.5 rounded-lg text-[13px] text-white focus:outline-none focus:border-[#89f5e7]"
                    />
                    <button
                      onClick={() => {
                        if (!customOrder) return;
                        triggerIntervention(currentCase.availableInterventions[0].id);
                        setCustomOrder('');
                      }}
                      className="bg-[#0e4b46] text-white px-4 rounded-lg text-[12px] font-bold whitespace-nowrap hover:bg-[#00332f]"
                    >
                      Prescrever
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Chronological Decision Graph */}
            <div className="lg:col-span-4 bg-[#0b1320] p-5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#89f5e7] text-[18px]">history</span>
                  Linha do Tempo de Conduta
                </h4>
                <span className="text-[10px] font-mono text-[#b0c8eb]">Auditoria em Execução</span>
              </div>

              <div className="relative pl-5 space-y-3.5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10 max-h-[360px] overflow-y-auto pr-1">
                {timeline.map((node) => (
                  <div key={node.id} className="relative">
                    <span
                      className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full ${
                        node.type === 'warning' ? 'bg-amber-400' : 'bg-[#89f5e7]'
                      }`}
                    />
                    <span className="text-[10px] font-mono uppercase text-[#b0c8eb] block">
                      {node.time}
                    </span>
                    <p className="text-[12px] font-bold text-white leading-tight">{node.title}</p>
                    <p className="text-[11px] text-[#b0c8eb] leading-relaxed mt-0.5">
                      {node.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('debriefing')}
                  className="w-full py-2.5 bg-[#121c2d] hover:bg-[#1b2a43] text-[#89f5e7] rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 border border-[#89f5e7]/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">fact_check</span>
                  <span>Ver Espelho de Nota & Debriefing</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Complementary Exams */}
        {activeTab === 'exames' && (
          <div className="bg-[#0b1320] p-6 rounded-2xl border border-white/5 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedExam('ecg')}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                    selectedExam === 'ecg'
                      ? 'bg-[#89f5e7] text-[#00201d]'
                      : 'bg-[#121c2d] text-[#b0c8eb] hover:text-white'
                  }`}
                >
                  Eletrocardiograma (12 Derivações)
                </button>
                <button
                  onClick={() => setSelectedExam('tropo')}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                    selectedExam === 'tropo'
                      ? 'bg-[#89f5e7] text-[#00201d]'
                      : 'bg-[#121c2d] text-[#b0c8eb] hover:text-white'
                  }`}
                >
                  Troponina Ultrassensível
                </button>
                <button
                  onClick={() => setSelectedExam('gaso')}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                    selectedExam === 'gaso'
                      ? 'bg-[#89f5e7] text-[#00201d]'
                      : 'bg-[#121c2d] text-[#b0c8eb] hover:text-white'
                  }`}
                >
                  Gasometria Arterial
                </button>
                <button
                  onClick={() => setSelectedExam('rx')}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                    selectedExam === 'rx'
                      ? 'bg-[#89f5e7] text-[#00201d]'
                      : 'bg-[#121c2d] text-[#b0c8eb] hover:text-white'
                  }`}
                >
                  Raio-X de Tórax (Leito)
                </button>
              </div>

              <span className="text-[12px] font-mono text-[#89f5e7] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Laudo sincronizado ao Prontuário Sim⁴
              </span>
            </div>

            {/* Exam Content */}
            {selectedExam === 'ecg' && (
              <div className="space-y-4">
                <div className="bg-[#070c14] p-5 rounded-xl border border-red-500/30">
                  <div className="flex items-center justify-between mb-3 text-[12px]">
                    <span className="font-bold text-red-400 uppercase tracking-wider font-mono">
                      ECG 12 DERIVAÇÕES · PAPEL MILIMETRADO 25MM/S · 10MM/MV
                    </span>
                    <span className="text-[#b0c8eb] font-mono">ID: ECG-{currentCase.id.toUpperCase()}-001</span>
                  </div>

                  {/* 12-lead grid representation */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['DI', 'DII (Supra-ST)', 'DIII (Supra-ST)', 'aVR', 'aVL', 'aVF (Supra-ST)', 'V1 (Supra-ST VD)', 'V2', 'V3R / V4R (Positivo)', 'V4', 'V5', 'V6'].map((lead, i) => (
                      <div key={i} className="bg-[#0b1320] p-2.5 rounded border border-white/5 font-mono text-[11px]">
                        <span className="text-[#89f5e7] font-bold block mb-1">{lead}</span>
                        <div className="h-10 bg-[#070c14] rounded flex items-center justify-center text-red-400 font-bold">
                          {lead.includes('Supra') ? '▲ ST +3.5mm' : 'Isolétrica'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-[#121c2d] rounded-lg text-[13px] text-white">
                    <p className="font-bold text-[#89f5e7] mb-1">Laudo Oficial da Cardiologia:</p>
                    <p className="text-[#b0c8eb] leading-relaxed">{currentCase.examResults.ecg}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedExam === 'tropo' && (
              <div className="p-5 bg-[#070c14] rounded-xl border border-white/10 space-y-3">
                <h4 className="font-serif text-[18px] text-white font-bold">Biomarcadores de Necrose Miocárdica</h4>
                <div className="p-4 bg-[#121c2d] rounded-lg font-mono text-[13px] text-[#eef0ff] space-y-1">
                  <p>{currentCase.examResults.troponina}</p>
                  <p className="text-yellow-300">CK-MB Massa: 48 ng/mL (Referência &lt; 5 ng/mL)</p>
                  <p className="text-white/60">Tempo decorrido de dor: 48 minutos.</p>
                </div>
              </div>
            )}

            {selectedExam === 'gaso' && (
              <div className="p-5 bg-[#070c14] rounded-xl border border-white/10 space-y-3">
                <h4 className="font-serif text-[18px] text-white font-bold">Gasometria Arterial em Ar Ambiente</h4>
                <div className="p-4 bg-[#121c2d] rounded-lg font-mono text-[13px] text-[#eef0ff]">
                  <p>{currentCase.examResults.gasometria}</p>
                </div>
              </div>
            )}

            {selectedExam === 'rx' && (
              <div className="p-5 bg-[#070c14] rounded-xl border border-white/10 space-y-3">
                <h4 className="font-serif text-[18px] text-white font-bold">Radiografia de Tórax AP no Leito</h4>
                <div className="p-4 bg-[#121c2d] rounded-lg font-mono text-[13px] text-[#eef0ff]">
                  <p>{currentCase.examResults.rxTorax}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Directed Physical Exam */}
        {activeTab === 'fisico' && (
          <div className="bg-[#0b1320] p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-serif text-[20px] text-white font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#89f5e7]">stethoscope</span>
              Semiologia Dirigida no Leito
            </h3>
            <p className="text-[13px] text-[#b0c8eb]">
              Clique nos segmentos anatômicos para auscultar e inspecionar os achados semiotécnicos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#121c2d] p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[#89f5e7] font-bold text-[14px]">
                  <span className="material-symbols-outlined text-[18px]">cardiology</span>
                  <span>Ausculta Cardíaca & Jugulares</span>
                </div>
                <p className="text-[13px] text-[#eef0ff] leading-relaxed">
                  Bulhas rítmicas e hipofonéticas, sem sopros audíveis. Presença de turgência jugular patológica a 45 graus (Sinal de Kussmaul positivo, compatível com sobrecarga de câmaras direitas).
                </p>
              </div>

              <div className="bg-[#121c2d] p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[#89f5e7] font-bold text-[14px]">
                  <span className="material-symbols-outlined text-[18px]">air</span>
                  <span>Ausculta Pulmonar</span>
                </div>
                <p className="text-[13px] text-[#eef0ff] leading-relaxed">
                  Murmúrio vesicular presente bilateralmente, sem estertores crepitantes nos terços inferiores. Campos pulmonares limpos (diferenciando de infarto com congestão esquerda/Killip II).
                </p>
              </div>

              <div className="bg-[#121c2d] p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[#89f5e7] font-bold text-[14px]">
                  <span className="material-symbols-outlined text-[18px]">touch_app</span>
                  <span>Perfusão Periférica & Pulsos</span>
                </div>
                <p className="text-[13px] text-[#eef0ff] leading-relaxed">
                  Tempo de enchimento capilar (TEC) de 3.5 segundos (&gt;2s). Extremidades frias e com sudorese pegajosa. Pulsos radiais filiformes.
                </p>
              </div>

              <div className="bg-[#121c2d] p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[#89f5e7] font-bold text-[14px]">
                  <span className="material-symbols-outlined text-[18px]">accessibility_new</span>
                  <span>Estado Neurológico & Dor</span>
                </div>
                <p className="text-[13px] text-[#eef0ff] leading-relaxed">
                  Glasgow 15, ansioso com sensação de morte iminente. Escala Numérica de Dor: 9/10 referida em região retroesternal em aperto.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Debriefing & DCN Evaluation */}
        {activeTab === 'debriefing' && (
          <div className="bg-[#0b1320] p-6 rounded-2xl border border-white/5 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#89f5e7] bg-[#89f5e7]/10 px-2 py-0.5 rounded">
                  Relatório Metacognitivo Final
                </span>
                <h3 className="font-serif text-[22px] text-white font-bold mt-1">
                  Espelho de Desempenho Clínico · Aluno Residente
                </h3>
              </div>
              <button
                onClick={onOpenPilotoModal}
                className="px-4 py-2 bg-[#0e4b46] hover:bg-[#00332f] text-white text-[12px] font-bold rounded-lg flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                <span>Exportar Laudo Institucional para MEC / CAEM</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-[#121c2d] rounded-xl space-y-3">
                <span className="text-[11px] font-bold uppercase text-[#b0c8eb]">Score de Desempenho</span>
                <p className="text-[42px] font-serif font-bold text-[#89f5e7] leading-none">92%</p>
                <p className="text-[12px] text-[#b0c8eb]">
                  Adequado aos critérios da Associação Brasileira de Educação Médica (ABEM) e DCNs 2014/2024.
                </p>
              </div>

              <div className="p-4 bg-[#121c2d] rounded-xl space-y-3">
                <span className="text-[11px] font-bold uppercase text-[#b0c8eb]">Tempo de Porta-Eletro</span>
                <p className="text-[42px] font-serif font-bold text-emerald-400 leading-none">4 min</p>
                <p className="text-[12px] text-[#b0c8eb]">
                  Meta regulatória de excelência atingida (máximo permitido: 10 minutos).
                </p>
              </div>

              <div className="p-4 bg-[#121c2d] rounded-xl space-y-3">
                <span className="text-[11px] font-bold uppercase text-[#b0c8eb]">Segurança do Paciente</span>
                <p className="text-[42px] font-serif font-bold text-yellow-300 leading-none">88%</p>
                <p className="text-[12px] text-[#b0c8eb]">
                  1 alerta de viés cognitivo corrigido a tempo antes de colapso irreversível.
                </p>
              </div>
            </div>

            {/* Qualitative Feedback */}
            <div className="p-5 bg-[#070c14] rounded-xl border border-white/10 space-y-3">
              <h4 className="font-serif text-[16px] text-white font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[#89f5e7]">rate_review</span>
                Parecer do Preceptor Virtual
              </h4>
              <p className="text-[13px] text-[#b0c8eb] leading-relaxed">
                "Excelente rapidez na suspeição clínica inicial e obtenção do traçado de ECG em menos de 5 minutos. Atenção ao detalhe crítico da parede inferior associada a infarto de Ventrículo Direito: o uso inadvertido de nitratos orais ou sublinguais nestes pacientes pode precipitar choque cardiogênico refratário por queda de pré-carga. A manobra corretiva de expansão salina foi imediata e restaurou a perfusão sistêmica."
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
