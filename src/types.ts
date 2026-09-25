export type ActiveScreen = 'landing' | 'simulation' | 'osce' | 'governance' | 'portal';

export interface VitalSigns {
  fc: number; // Heart rate in bpm
  paSistolica: number;
  paDiastolica: number;
  spo2: number; // SpO2 in %
  fr: number; // Respiratory rate in irpm
  temperatura?: number; // °C
  stability: number; // 0-100%
  rhythm: 'sinusal' | 'taquicardia_sinusal' | 'bradicardia' | 'taqui_ventricular' | 'recuperacao';
}

export interface DialogueMessage {
  id: string;
  sender: 'aluno' | 'paciente' | 'sistema' | 'preceptor';
  authorName: string;
  content: string;
  timestamp: string;
  isAudioTranscription?: boolean;
  highlight?: boolean;
}

export interface TimelineNode {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'diagnostic' | 'pharmacology' | 'warning' | 'corrective' | 'success';
}

export interface CognitiveBias {
  detected: boolean;
  type: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  correctiveGuidance: string;
}

export interface ClinicalCase {
  id: string;
  name: string;
  age: number;
  gender: string;
  bed: string;
  sector: string;
  priority: 'Vermelha' | 'Laranja' | 'Amarela';
  syndrome: string;
  background: string;
  initialVitals: VitalSigns;
  initialDialogues: DialogueMessage[];
  initialTimeline: TimelineNode[];
  examResults: {
    ecg: string;
    troponina: string;
    gasometria: string;
    rxTorax: string;
  };
  availableInterventions: {
    id: string;
    label: string;
    description: string;
    type: 'safe' | 'caution' | 'contraindicated';
    impact: {
      fcDelta: number;
      paDelta: [number, number];
      spo2Delta: number;
      stabilityDelta: number;
      eventTitle: string;
      eventDesc: string;
      biasTriggered?: CognitiveBias;
    };
  }[];
}
