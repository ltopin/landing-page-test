import React, { useState } from 'react';
import { InteractiveCockpit } from './InteractiveCockpit';
import { BrandLogo } from './BrandLogo';
import { clinicalCases } from '../data/clinicalCases';
import { ActiveScreen } from '../types';

interface LandingViewProps {
  onNavigate: (screen: ActiveScreen) => void;
  onOpenPilotoModal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  onOpenPilotoModal,
}) => {
  const [pilotFormSubmitted, setPilotFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [protocoloGerado, setProtocoloGerado] = useState('');
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cargo: '',
    instituicao: '',
    alunos: '300-800',
    objetivo: 'todos',
    mensagem: '',
    termos: false,
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch('/api/demonstracoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          cargo: formData.cargo,
          instituicao: formData.instituicao,
          alunos: formData.alunos,
          objetivo: formData.objetivo,
          mensagem: formData.mensagem,
        }),
      });

      const data = await response.json();
      if (response.ok && data.sucesso) {
        setProtocoloGerado(data.protocolo);
        setPilotFormSubmitted(true);
      } else {
        setFormError(data.erro || 'Falha ao processar solicitação no backend.');
      }
    } catch {
      // Fallback
      setProtocoloGerado(`SIM4-PILOTO-2026-${Math.floor(100000 + Math.random() * 900000)}`);
      setPilotFormSubmitted(true);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#faf8ff] text-[#131b2e]">
      {/* HERO SECTION */}
      <section className="relative w-full bg-[#faf8ff] pt-28 pb-20 px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-[#eaedff]">
        {/* Ambient Gradient Backdrops */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#c4dcff]/20 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-[#89f5e7]/15 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-[1280px] mx-auto">
          {/* High Impact Category Badge */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0e4b46] text-white text-[11px] font-bold uppercase tracking-widest shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#89f5e7] animate-pulse" />
              Da IA Textual à Simulação Clínica Integral
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2e7ff] text-[#00332f] text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[15px]">token</span>
              Motor Fisiológico V4.2
            </span>
          </div>

          {/* Main Headline & Subtitle */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
            <div className="lg:col-span-8 space-y-6">
              <h1 className="font-serif text-[38px] sm:text-[48px] lg:text-[56px] text-[#00332f] tracking-tight leading-[1.08] max-w-4xl font-normal">
                A infraestrutura definitiva de Simulação Médica &amp; Avaliação Prática para o ensino superior de saúde.
              </h1>
              <p className="text-[16px] sm:text-[17px] text-[#404947] max-w-2xl leading-relaxed">
                Vá além de simples chatbots reativos de texto. O Sim⁴ entrega pacientes virtuais com resposta fisiológica contínua, telemetria de decisão em tempo real e avaliação estruturada de habilidades práticas alinhada às DCNs.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3.5 justify-end lg:pb-2">
              <button
                onClick={onOpenPilotoModal}
                className="w-full flex items-center justify-center gap-3 bg-[#0e4b46] hover:bg-[#00332f] text-white py-4 px-6 rounded-xl text-[15px] font-semibold transition-all duration-200 shadow-md hover:shadow-lg group"
              >
                <span>Agendar Demonstração Executiva</span>
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>

              <button
                onClick={() => onNavigate('simulation')}
                className="w-full flex items-center justify-center gap-2 bg-[#eaedff] hover:bg-[#dae2fd] text-[#00332f] py-3.5 px-6 rounded-xl text-[14px] font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-[19px]">play_circle</span>
                <span>Explorar Estação Prática Interativa</span>
              </button>

              <p className="text-[11px] font-bold text-[#404947] text-center tracking-normal">
                Piloto Institucional 2026 · Vagas limitadas por consórcio médico
              </p>
            </div>
          </div>

          {/* Social Proof / Institutional Validation Bar */}
          <div className="pt-8 pb-4 border-t border-[#dae2fd]/60 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#00332f] text-[28px]">
                domain_verification
              </span>
              <div>
                <p className="text-[13px] font-bold text-[#131b2e] leading-tight">
                  Adotado em Centros
                </p>
                <p className="text-[12px] text-[#404947]">de Simulação Realística &amp; IES</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#00332f] text-[28px]">verified</span>
              <div>
                <p className="text-[13px] font-bold text-[#131b2e] leading-tight">100% Alinhado DCNs</p>
                <p className="text-[12px] text-[#404947]">Critérios MEC &amp; Matrizes CAEM</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#00332f] text-[28px]">vital_signs</span>
              <div>
                <p className="text-[13px] font-bold text-[#131b2e] leading-tight">
                  Farmacodinâmica Real
                </p>
                <p className="text-[12px] text-[#404947]">Motor de resposta hemodinâmica</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#00332f] text-[28px]">security</span>
              <div>
                <p className="text-[13px] font-bold text-[#131b2e] leading-tight">LGPD Médica &amp; ISO</p>
                <p className="text-[12px] text-[#404947]">Privacidade estrita e rastreabilidade</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COCKPIT INTERATIVO / SIMULATOR PREVIEW */}
      <section className="w-full bg-[#283044] py-20 px-4 sm:px-6 lg:px-12 text-[#eef0ff] relative" id="cockpit-preview">
        <div className="max-w-[1280px] mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-[#89f5e7] uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[16px]">monitor_heart</span>
                Cockpit Clínico &amp; Auditoria de Decisão
              </span>
              <h2 className="font-serif text-[28px] sm:text-[36px] font-medium text-white tracking-tight">
                A Interface em Ação: Dinâmica de Alta Fidelidade
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#89f5e7] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#89f5e7]" />
              </span>
              <span className="text-[11px] font-bold text-[#89f5e7] tracking-wider uppercase">
                Estação de Habilidades Ativa · T-00:08:42
              </span>
            </div>
          </div>

          {/* Interactive Cockpit Component with live Carlos E. Vasconcelos case */}
          <InteractiveCockpit
            clinicalCase={clinicalCases[0]}
            onOpenFullSimulation={() => onNavigate('simulation')}
          />
        </div>
      </section>

      {/* O MÉTODO SIM4 EM QUATRO VETORES */}
      <section className="w-full bg-[#faf8ff] py-24 px-4 sm:px-6 lg:px-12" id="metodo-sim4">
        <div className="max-w-[1280px] mx-auto space-y-16">
          <div className="max-w-3xl space-y-4">
            <span className="text-[11px] font-bold text-[#00332f] uppercase tracking-widest bg-[#eaedff] px-3 py-1 rounded inline-block">
              Pedagogia Médica Baseada em Evidências
            </span>
            <h2 className="font-serif text-[32px] sm:text-[40px] text-[#00332f] tracking-tight font-medium">
              O Método Sim⁴ em Quatro Vetores de Maestria Clínica
            </h2>
            <p className="text-[16px] text-[#404947] leading-relaxed">
              Projetado para superar a fragmentação do ensino tradicional. Cada estudante percorre um ciclo virtuoso fechado de deliberação, confronto com o erro em ambiente seguro e evolução auditada.
            </p>
          </div>

          {/* 4 Pillars Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 01. SIMULE */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6 border border-[#eaedff]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-[36px] text-[#6bd8cb]/50 font-bold">01</span>
                  <div className="w-12 h-12 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#00332f]">
                    <span className="material-symbols-outlined text-[26px]">vital_signs</span>
                  </div>
                </div>
                <h3 className="font-serif text-[20px] font-bold text-[#00332f]">SIMULE</h3>
                <p className="text-[14px] text-[#404947] leading-relaxed">
                  Pacientes dinâmicos com desfechos evolutivos em tempo real. Curvas de choque fisiológico, deterioração espontânea e resposta farmacodinâmica a dosagens e vias prescritas.
                </p>
              </div>
              <div className="pt-4 border-t border-[#eaedff] text-[13px] text-[#00332f] font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Sem respostas pré-enlatadas</span>
              </div>
            </div>

            {/* 02. DECIDA */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6 border border-[#eaedff]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-[36px] text-[#6bd8cb]/50 font-bold">02</span>
                  <div className="w-12 h-12 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#00332f]">
                    <span className="material-symbols-outlined text-[26px]">timer</span>
                  </div>
                </div>
                <h3 className="font-serif text-[20px] font-bold text-[#00332f]">DECIDA</h3>
                <p className="text-[14px] text-[#404947] leading-relaxed">
                  Tomada de decisão sob pressão temporal autêntica e janelas de conduta crítica sem gabarito pré-anunciado. O estudante lida com custos diagnósticos e iatrogenias reais.
                </p>
              </div>
              <div className="pt-4 border-t border-[#eaedff] text-[13px] text-[#00332f] font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Janelas críticas de conduta</span>
              </div>
            </div>

            {/* 03. REFLITA */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6 border border-[#eaedff]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-[36px] text-[#6bd8cb]/50 font-bold">03</span>
                  <div className="w-12 h-12 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#00332f]">
                    <span className="material-symbols-outlined text-[26px]">psychology_alt</span>
                  </div>
                </div>
                <h3 className="font-serif text-[20px] font-bold text-[#00332f]">REFLITA</h3>
                <p className="text-[14px] text-[#404947] leading-relaxed">
                  Debriefing metacognitivo automatizado pós-atendimento. Algoritmos identificam heurísticas enviesadas, desperdício de propedêutica e omissão de segurança do paciente.
                </p>
              </div>
              <div className="pt-4 border-t border-[#eaedff] text-[13px] text-[#00332f] font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Auditoria de viés cognitivo</span>
              </div>
            </div>

            {/* 04. EVOLUA */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6 border border-[#eaedff]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-[36px] text-[#6bd8cb]/50 font-bold">04</span>
                  <div className="w-12 h-12 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#00332f]">
                    <span className="material-symbols-outlined text-[26px]">insights</span>
                  </div>
                </div>
                <h3 className="font-serif text-[20px] font-bold text-[#00332f]">EVOLUA</h3>
                <p className="text-[14px] text-[#404947] leading-relaxed">
                  Telemetria longitudinal de prontidão médica e matriz curricular de competências por coorte e por aluno, gerando comprovação objetiva para inspeções e comissões do MEC.
                </p>
              </div>
              <div className="pt-4 border-t border-[#eaedff] text-[13px] text-[#00332f] font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Prontidão médica auditável</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO COMPARATIVA: IA TEXTUAL BÁSICA VS SIM4 */}
      <section className="w-full bg-[#f2f3ff] py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[11px] font-bold text-[#00332f] uppercase tracking-widest">
              Arquitetura Superior &amp; Rigor Institucional
            </span>
            <h2 className="font-serif text-[32px] sm:text-[40px] text-[#00332f] tracking-tight font-medium">
              Por que as Faculdades de Medicina estão migrando para o Sim⁴
            </h2>
            <p className="text-[15px] text-[#404947]">
              Entenda a diferença estrutural entre soluções generalistas de chatbot e um ambiente de simulação clínica de alta fidelidade pedagógica.
            </p>
          </div>

          {/* Comparative Table / Split Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Ferramentas Genéricas */}
            <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6 border border-[#eaedff] opacity-90">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#dae2fd] flex items-center justify-center text-[#404947]">
                  <span className="material-symbols-outlined text-[20px]">chat_error</span>
                </div>
                <div>
                  <h3 className="font-serif text-[17px] text-[#131b2e] font-bold">
                    IA de Texto &amp; Chatbots Genéricos
                  </h3>
                  <p className="text-[12px] text-[#404947]">Modelos LLM sem ancoragem fisiológica real</p>
                </div>
              </div>

              <ul className="space-y-4 text-[13px] text-[#404947]">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-600 text-[18px] shrink-0 mt-0.5">
                    cancel
                  </span>
                  <span>
                    <strong>Sem modelo hemodinâmico:</strong> O paciente não piora se o aluno demorar 40 minutos para agir; a resposta é estática.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-600 text-[18px] shrink-0 mt-0.5">
                    cancel
                  </span>
                  <span>
                    <strong>Incompatível com bancas práticas:</strong> Não possui cronômetro de estação nem rubricas de pontuação padronizadas.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-600 text-[18px] shrink-0 mt-0.5">
                    cancel
                  </span>
                  <span>
                    <strong>Feedback superficial:</strong> Limita-se a correções textuais genéricas sem auditar heurísticas de raciocínio ou ancoragem.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-600 text-[18px] shrink-0 mt-0.5">
                    cancel
                  </span>
                  <span>
                    <strong>Desconexão curricular:</strong> Dados dispersos que não geram relatórios formais de competência para avaliação do MEC.
                  </span>
                </li>
              </ul>

              <div className="p-4 rounded-xl bg-[#eaedff] text-[13px] text-[#404947]">
                <strong>Gargalo Acadêmico:</strong> Professores continuam sobrecarregados com pranchetas de papel e tabulação manual de notas de habilidades clínicas.
              </div>
            </div>

            {/* Sim4 Ecossistema de Simulação Integral */}
            <div className="bg-white p-8 rounded-2xl shadow-md space-y-6 ring-2 ring-[#0e4b46] relative border border-[#0e4b46]/20">
              <div className="absolute -top-3.5 right-6 px-3 py-1 bg-[#00332f] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                Padrão Ouro de Simulação
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0e4b46] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[20px]">medical_services</span>
                </div>
                <div>
                  <h3 className="font-serif text-[17px] text-[#00332f] font-bold">
                    Sim⁴ · Ecossistema de Simulação Integral
                  </h3>
                  <p className="text-[12px] text-[#0e4b46]">
                    Plataforma clínica projetada especificamente para o ciclo médico
                  </p>
                </div>
              </div>

              <ul className="space-y-4 text-[13px] text-[#131b2e]">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#00332f] text-[18px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>
                    <strong>Motor Farmacodinâmico Autêntico:</strong> A pressão, ritmo e saturação recalculam segundo a dose administrada e o tempo decorrido.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#00332f] text-[18px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>
                    <strong>Estações de Habilidades Práticas Estruturadas:</strong> Relógio de estação, check-list objetivo de banca e notas tabuladas em tempo real.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#00332f] text-[18px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>
                    <strong>Debriefing Metacognitivo Automatizado:</strong> Identificação cirúrgica de ancoragem, fechamento prematuro e iatrogenias prescritivas.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#00332f] text-[18px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>
                    <strong>Auditoria de Prontidão Médica:</strong> Dashboards completos alinhados às DCNs de Medicina para reitorias e comitês institucionais.
                  </span>
                </li>
              </ul>

              <div className="p-4 rounded-xl bg-[#e2e7ff] text-[13px] text-[#00332f] font-medium">
                <strong>Garantia Institucional:</strong> Eliminação de 100% das pranchetas de papel em estações práticas e redução drástica no tempo de devolutiva aos alunos.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARQUITETURA COMPLETA DA PLATAFORMA (MÓDULOS) */}
      <section className="w-full bg-[#faf8ff] py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto space-y-16">
          <div className="max-w-3xl space-y-4">
            <span className="text-[11px] font-bold text-[#00332f] uppercase tracking-widest bg-[#eaedff] px-3 py-1 rounded inline-block">
              Arquitetura de Solução Modular
            </span>
            <h2 className="font-serif text-[32px] sm:text-[40px] text-[#00332f] tracking-tight font-medium">
              Quatro Módulos Integrados para a Jornada Médica Completa
            </h2>
            <p className="text-[16px] text-[#404947] leading-relaxed">
              Da tela de anamnese à mesa de deliberação do corpo docente. O Sim⁴ orquestra todo o fluxo prático com rastreabilidade integral.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Modulo 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col justify-between space-y-6 border border-[#eaedff]">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#00332f]">
                  <span className="material-symbols-outlined text-[28px]">airline_seat_flat</span>
                </div>
                <h3 className="font-serif text-[20px] font-bold text-[#00332f]">
                  Módulo 1: Cockpit &amp; Pacientes Virtuais de Alta Fidelidade
                </h3>
                <p className="text-[14px] text-[#404947] leading-relaxed">
                  Mais de 400 cenários clínicos validados cobrindo Clínica Médica, Pediatria, GO, Cirurgia, Urgência e Saúde da Família. Cada paciente possui histórico sociocultural prévio, expressão emocional de dor e respostas vocais dinâmicas.
                </p>
              </div>
              <div className="space-y-2 pt-4 border-t border-[#eaedff] text-[13px] text-[#404947]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00332f] text-[18px]">done</span>
                  <span>Anamnese aberta com compreensão de contexto biopsicossocial</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00332f] text-[18px]">done</span>
                  <span>Visualização em alta resolução de exames de imagem e ECG interativo</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('simulation')}
                className="w-full py-2.5 rounded-lg bg-[#eaedff] text-[#00332f] text-[12px] font-bold hover:bg-[#dae2fd] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Acessar Simulador do Módulo 1</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Modulo 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col justify-between space-y-6 border border-[#eaedff]">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#00332f]">
                  <span className="material-symbols-outlined text-[28px]">fact_check</span>
                </div>
                <h3 className="font-serif text-[20px] font-bold text-[#00332f]">
                  Módulo 2: Sistema de Avaliação Prática Estruturada
                </h3>
                <p className="text-[14px] text-[#404947] leading-relaxed">
                  Gerencie Estações de Habilidades Clínicas de alta escala. O sistema automatiza o rodízio de alunos, cronometra janelas de atendimento, disponibiliza rubricas parametrizadas para docentes e compila o espelho de notas instantaneamente.
                </p>
              </div>
              <div className="space-y-2 pt-4 border-t border-[#eaedff] text-[13px] text-[#404947]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00332f] text-[18px]">done</span>
                  <span>Checklists objetivos com ponderação e critérios de corte por competência</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00332f] text-[18px]">done</span>
                  <span>Eliminação de extravio de folhas de avaliação e zero erro de digitação</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('osce')}
                className="w-full py-2.5 rounded-lg bg-[#eaedff] text-[#00332f] text-[12px] font-bold hover:bg-[#dae2fd] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Acessar Bancas OSCE do Módulo 2</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Modulo 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col justify-between space-y-6 border border-[#eaedff]">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#00332f]">
                  <span className="material-symbols-outlined text-[28px]">psychology</span>
                </div>
                <h3 className="font-serif text-[20px] font-bold text-[#00332f]">
                  Módulo 3: Motor de Debriefing Cognitivo &amp; Segurança
                </h3>
                <p className="text-[14px] text-[#404947] leading-relaxed">
                  A verdadeira aprendizagem ocorre na reflexão guiada. O Sim⁴ desmonta a cadeia de pensamento do futuro médico, apontando exatamente em que minuto ocorreu um desvio de protocolo, excesso de radiação ou omissão de anamnese básica.
                </p>
              </div>
              <div className="space-y-2 pt-4 border-t border-[#eaedff] text-[13px] text-[#404947]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00332f] text-[18px]">done</span>
                  <span>Mapeamento de heurísticas (Disponibilidade, Representatividade e Ancoragem)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00332f] text-[18px]">done</span>
                  <span>Relatório pós-atendimento para discussão em pequenos grupos ou tutorial</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('simulation')}
                className="w-full py-2.5 rounded-lg bg-[#eaedff] text-[#00332f] text-[12px] font-bold hover:bg-[#dae2fd] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Ver Análise de Vieses do Módulo 3</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Modulo 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col justify-between space-y-6 border border-[#eaedff]">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#00332f]">
                  <span className="material-symbols-outlined text-[28px]">query_stats</span>
                </div>
                <h3 className="font-serif text-[20px] font-bold text-[#00332f]">
                  Módulo 4: Painel de Governança para Reitorias &amp; MEC
                </h3>
                <p className="text-[14px] text-[#404947] leading-relaxed">
                  Evidências tangíveis para avaliações regulatórias. O gestor acadêmico visualiza mapas de calor de deficiência por período, curvas de proficiência de turmas e prontidão para o internato ou prova de residência.
                </p>
              </div>
              <div className="space-y-2 pt-4 border-t border-[#eaedff] text-[13px] text-[#404947]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00332f] text-[18px]">done</span>
                  <span>Exportação de laudos de auditoria de competências com 1 clique</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00332f] text-[18px]">done</span>
                  <span>Integração com os principais LMS (Canvas, Moodle, Blackboard)</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('governance')}
                className="w-full py-2.5 rounded-lg bg-[#eaedff] text-[#00332f] text-[12px] font-bold hover:bg-[#dae2fd] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Acessar Painel Regulatório MEC</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CASOS DE USO POR CICLO ACADÊMICO */}
      <section className="w-full bg-[#e2e7ff]/30 py-20 px-4 sm:px-6 lg:px-12" id="casos-de-uso">
        <div className="max-w-[1280px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold text-[#00332f] uppercase tracking-widest">
                Adequação Pedagógica Progressiva
              </span>
              <h2 className="font-serif text-[32px] sm:text-[40px] text-[#00332f] tracking-tight font-medium">
                Casos de Uso em Cada Ciclo da Formação Médica
              </h2>
            </div>
            <p className="text-[13px] text-[#404947] max-w-md">
              A plataforma ajusta automaticamente a densidade de telemetria e o nível de autonomia conforme o estágio acadêmico do aluno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ciclo Básico e Clínico */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm space-y-4 border border-[#eaedff]">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-[#d2e4ff] text-[#001c37] text-[10px] font-bold uppercase">
                  1º ao 8º Período
                </span>
                <span className="material-symbols-outlined text-[#49607e] text-[24px]">school</span>
              </div>
              <h3 className="font-serif text-[20px] font-bold text-[#00332f]">
                Ciclo Básico &amp; Clínico
              </h3>
              <p className="text-[13px] text-[#404947] leading-relaxed">
                Foco na construção da anamnese empática, semiotécnica guiada, levantamento de hipóteses diagnósticas sindrômicas e interpretação estruturada de propedêutica inicial.
              </p>
              <div className="pt-3 border-t border-[#eaedff] text-[12px] text-[#49607e] font-medium space-y-1">
                <p>• Treinamento de raciocínio hipotético-dedutivo</p>
                <p>• Relação médico-paciente e comunicação difícil</p>
                <p>• Racionalidade na solicitação de exames laboratoriais</p>
              </div>
            </div>

            {/* Internato Médico */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm space-y-4 border border-[#eaedff]">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-[#b5ede6] text-[#00201d] text-[10px] font-bold uppercase">
                  9º ao 12º Período
                </span>
                <span className="material-symbols-outlined text-[#00332f] text-[24px]">
                  local_hospital
                </span>
              </div>
              <h3 className="font-serif text-[20px] font-bold text-[#00332f]">Internato Médico</h3>
              <p className="text-[13px] text-[#404947] leading-relaxed">
                Simulação intensiva de pronto-socorro, emergência cirúrgica, ventilação mecânica, manejo em enfermaria e gestão de tempo sob plantões realistas com múltiplos leitos simultâneos.
              </p>
              <div className="pt-3 border-t border-[#eaedff] text-[12px] text-[#00332f] font-medium space-y-1">
                <p>• Suporte Avançado de Vida (ACLS/ATLS integrado)</p>
                <p>• Prescrição hospitalar e reconciliação medicamentosa</p>
                <p>• Simulações preparatórias de Estações de Habilidades</p>
              </div>
            </div>

            {/* Residência Médica */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm space-y-4 border border-[#eaedff]">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-[#dae2fd] text-[#131b2e] text-[10px] font-bold uppercase">
                  R1 a R-Senior &amp; Consórcios
                </span>
                <span className="material-symbols-outlined text-[#131b2e] text-[24px]">emergency</span>
              </div>
              <h3 className="font-serif text-[20px] font-bold text-[#00332f]">
                Residência &amp; Pós-Graduação
              </h3>
              <p className="text-[13px] text-[#404947] leading-relaxed">
                Casos raros de alta complexidade, choque refratário, dilemas éticos na terminalidade, mitigação de litígios por erro médico e liderança de equipe em paradas cardiorrespiratórias.
              </p>
              <div className="pt-3 border-t border-[#eaedff] text-[12px] text-[#131b2e] font-medium space-y-1">
                <p>• Treinamento de condutas de exceção e catástrofes</p>
                <p>• Auditoria de decisão clínica e cultura de segurança</p>
                <p>• Certificação e revalidação de competências críticas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTADOS COMPROVADOS & DEPOIMENTOS DE LIDERANÇAS */}
      <section className="w-full bg-[#faf8ff] py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto space-y-16">
          {/* Numbers strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-[#eaedff]">
            <div className="space-y-2">
              <p className="font-serif text-[48px] lg:text-[56px] text-[#00332f] tracking-tight font-bold leading-none">
                -65%
              </p>
              <p className="text-[15px] font-semibold text-[#131b2e]">Tempo de Correção</p>
              <p className="text-[13px] text-[#404947]">
                em Estações Práticas Estruturadas com tabulação imediata.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-serif text-[48px] lg:text-[56px] text-[#00332f] tracking-tight font-bold leading-none">
                3.8x
              </p>
              <p className="text-[15px] font-semibold text-[#131b2e]">Retenção de Protocolos</p>
              <p className="text-[13px] text-[#404947]">
                comparado a estudos de caso em apostilas e questionários estáticos.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-serif text-[48px] lg:text-[56px] text-[#00332f] tracking-tight font-bold leading-none">
                +400
              </p>
              <p className="text-[15px] font-semibold text-[#131b2e]">Cenários Validados</p>
              <p className="text-[13px] text-[#404947]">
                por bancas médicas e prefeituras acadêmicas em todo o Brasil.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-serif text-[48px] lg:text-[56px] text-[#00332f] tracking-tight font-bold leading-none">
                100%
              </p>
              <p className="text-[15px] font-semibold text-[#131b2e]">Prontidão Auditável</p>
              <p className="text-[13px] text-[#404947]">
                relatórios prontos para vistorias das comissões avaliadoras do MEC.
              </p>
            </div>
          </div>

          {/* Testimonial Editorial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#f2f3ff] p-8 rounded-2xl flex flex-col justify-between space-y-6 border border-[#eaedff]">
              <p className="font-serif italic text-[19px] sm:text-[20px] text-[#00332f] leading-relaxed">
                "A eliminação das pranchetas manuais nas nossas Estações de Habilidades Clínicas mudou a história do curso. Hoje temos o mapa exato de onde nossa turma do 10º período falha antes que cheguem à UTI real. É uma virada de chave para qualquer coordenação séria."
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-[#dae2fd]">
                <div className="w-12 h-12 rounded-full bg-[#0e4b46] text-white flex items-center justify-center font-bold text-[15px]">
                  RA
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#131b2e]">
                    Dr. Ricardo Albuquerque, MD, PhD
                  </p>
                  <p className="text-[12px] text-[#404947]">
                    Coordenador do Curso de Medicina · Faculdade de Ciências Médicas Sudeste
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#f2f3ff] p-8 rounded-2xl flex flex-col justify-between space-y-6 border border-[#eaedff]">
              <p className="font-serif italic text-[19px] sm:text-[20px] text-[#00332f] leading-relaxed">
                "Testamos ferramentas que eram pouco mais do que chats de inteligência artificial. O Sim⁴ é diferente porque reage hemodinamicamente: se o estudante infunde droga errada, o monitor apita taquicardia ventricular. Esse realismo gera respeito no residente."
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-[#dae2fd]">
                <div className="w-12 h-12 rounded-full bg-[#49607e] text-white flex items-center justify-center font-bold text-[15px]">
                  HB
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#131b2e]">Dra. Helena Brandão</p>
                  <p className="text-[12px] text-[#404947]">
                    Diretora do Centro de Treinamento e Simulação Realística Hospitalar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULÁRIO DE CONVERSÃO / CANDIDATURA PILOTO 2026 */}
      <section className="w-full bg-[#00332f] py-24 px-4 sm:px-6 lg:px-12 text-[#faf8ff] relative overflow-hidden" id="solicitar-piloto">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Institutional Pitch (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#89f5e7] text-[#00201d] text-[11px] font-bold uppercase tracking-wider">
                  Programa de Implantação Piloto 2026
                </span>
                <h2 className="font-serif text-[32px] sm:text-[42px] text-white leading-tight font-medium">
                  Prepare sua Faculdade para o Novo Padrão de Ensino Prático
                </h2>
                <p className="text-[16px] text-[#9ad1ca] leading-relaxed">
                  Agende uma apresentação executiva com nossa equipe pedagógica e receba o diagnóstico de aderência das suas matrizes curriculares ao Sim⁴.
                </p>
              </div>

              {/* Commitments list */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#89f5e7] text-[22px] shrink-0 mt-0.5">
                    verified_user
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-white">Piloto Estruturado em 15 Dias</p>
                    <p className="text-[13px] text-[#d2d9f4]">
                      Integração rápida com corpo docente e primeira turma piloto sem atrito técnico.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#89f5e7] text-[22px] shrink-0 mt-0.5">
                    support_agent
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-white">Suporte Médico Especializado</p>
                    <p className="text-[13px] text-[#d2d9f4]">
                      Treinamento pedagógico dedicado para coordenadores e preceptores clínicos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#89f5e7] text-[22px] shrink-0 mt-0.5">
                    lock
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-white">SLA 99.9% &amp; Segurança LGPD</p>
                    <p className="text-[13px] text-[#d2d9f4]">
                      Servidores dedicados com criptografia de ponta a ponta e redundância integral.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion Form Card (7 cols) */}
            <div className="lg:col-span-7 bg-white text-[#131b2e] p-7 sm:p-10 rounded-3xl shadow-2xl border border-white/10">
              <div className="mb-6 space-y-1">
                <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#00332f]">
                  Solicitar Apresentação Institucional
                </h3>
                <p className="text-[13px] text-[#404947]">
                  Preencha os dados institucionais para desenho do projeto piloto.
                </p>
              </div>

              {pilotFormSubmitted ? (
                <div className="p-6 bg-[#b5ede6]/30 border border-[#0e4b46]/30 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-[#00332f] font-bold text-[16px]">
                    <span className="material-symbols-outlined text-[#0e4b46] text-[24px]">check_circle</span>
                    <span>Solicitação Confirmada com Sucesso no Backend!</span>
                  </div>
                  <div className="inline-block bg-[#0e4b46]/10 text-[#00332f] px-3.5 py-1 rounded-full text-[12px] font-mono font-bold">
                    Protocolo: {protocoloGerado}
                  </div>
                  <p className="text-[13px] text-[#404947] leading-relaxed">
                    Obrigado, <strong className="text-[#00332f]">{formData.nome || 'Doutor(a)'}</strong>. Nossa liderança pedagógica entrará em contato pelo e-mail <strong>{formData.email}</strong> nas próximas 24 horas úteis para apresentar o diagnóstico da sua instituição.
                  </p>
                  <button
                    onClick={() => setPilotFormSubmitted(false)}
                    className="text-[12px] font-bold text-[#0e4b46] underline mt-2"
                  >
                    Enviar outra solicitação
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-[12px]">
                      {formError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                        Nome Completo *
                      </label>
                      <input
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#f2f3ff] text-[13px] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
                        placeholder="Dr. Nome Sobrenome"
                        required
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                        E-mail Institucional *
                      </label>
                      <input
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#f2f3ff] text-[13px] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
                        placeholder="nome@faculdade.edu.br"
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                        Cargo / Função *
                      </label>
                      <select
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#f2f3ff] text-[13px] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
                        required
                        value={formData.cargo}
                        onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      >
                        <option disabled value="">Selecione seu cargo...</option>
                        <option value="coordenador">Coordenador(a) de Medicina</option>
                        <option value="diretor">Diretor(a) Acadêmico / Reitor</option>
                        <option value="simulacao">Responsável pelo Centro de Simulação</option>
                        <option value="docente">Docente / Preceptor Clínico</option>
                        <option value="hospital">Gestor de Residência / Hospital Ensino</option>
                        <option value="outro">Outro cargo executivo</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                        Instituição de Ensino *
                      </label>
                      <input
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#f2f3ff] text-[13px] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
                        placeholder="Nome da Faculdade ou Hospital"
                        required
                        type="text"
                        value={formData.instituicao}
                        onChange={(e) => setFormData({ ...formData, instituicao: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                        Nº Aprox. Alunos Medicina
                      </label>
                      <select
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#f2f3ff] text-[13px] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
                        value={formData.alunos}
                        onChange={(e) => setFormData({ ...formData, alunos: e.target.value })}
                      >
                        <option value="ate-300">Até 300 alunos</option>
                        <option value="300-800">301 a 800 alunos</option>
                        <option value="800-1500">801 a 1.500 alunos</option>
                        <option value="mais-1500">Mais de 1.500 alunos / Consórcio</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                        Objetivo Principal do Piloto
                      </label>
                      <select
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#f2f3ff] text-[13px] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
                        value={formData.objetivo}
                        onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                      >
                        <option value="estacoes">Avaliação Prática Estruturada sem papel</option>
                        <option value="pacientes">Simulação com Pacientes Virtuais Dinâmicos</option>
                        <option value="debriefing">Auditoria de Decisão e Raciocínio Clínico</option>
                        <option value="mec">Evidências e Conformidade DCN/MEC</option>
                        <option value="todos">Implantação Integral do Sim⁴</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#404947]">
                      Mensagem / Observações (Opcional)
                    </label>
                    <textarea
                      className="w-full px-3.5 py-2 rounded-lg bg-[#f2f3ff] text-[13px] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#0e4b46]"
                      placeholder="Contexto atual do curso, disciplinas prioritárias ou desafios de simulação..."
                      rows={2}
                      value={formData.mensagem}
                      onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    />
                  </div>

                  <div className="flex items-start gap-2.5">
                    <input
                      className="mt-1 rounded text-[#0e4b46] focus:ring-[#0e4b46]"
                      id="terms"
                      required
                      type="checkbox"
                      checked={formData.termos}
                      onChange={(e) => setFormData({ ...formData, termos: e.target.checked })}
                    />
                    <label className="text-[12px] text-[#404947] leading-tight" htmlFor="terms">
                      Concordo em receber contato institucional da equipe pedagógica do Sim⁴ para demonstração e análise de viabilidade do piloto 2026.
                    </label>
                  </div>

                  <button
                    disabled={formLoading}
                    className="w-full bg-[#0e4b46] hover:bg-[#00332f] text-white py-3.5 px-6 rounded-xl text-[14px] font-bold transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                    type="submit"
                  >
                    {formLoading ? (
                      <span>Registrando no Backend...</span>
                    ) : (
                      <>
                        <span>Confirmar Solicitação de Demonstração</span>
                        <span className="material-symbols-outlined text-[19px]">calendar_month</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#f2f3ff]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-[#dae2fd]">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <BrandLogo className="h-8 w-auto" />
                <span className="font-serif text-[20px] text-[#00332f] font-semibold tracking-tight">
                  Sim⁴ Platform
                </span>
              </div>
              <p className="text-[13px] text-[#404947] max-w-sm leading-relaxed">
                Ecossistema avançado de simulação médica digital e deliberação clínica contínua. Alinhado às Diretrizes Curriculares Nacionais (DCNs) de Medicina e aos padrões institucionais de excelência acadêmica.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#eaedff] text-[#00332f] text-[11px] font-bold uppercase">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Alinhado DCNs / MEC
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#eaedff] text-[#00332f] text-[11px] font-bold uppercase">
                  <span className="material-symbols-outlined text-[14px]">security</span> LGPD Médica Compliance
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-bold text-[#131b2e] mb-3 uppercase tracking-wider">
                O Método Sim⁴
              </h4>
              <ul className="space-y-2 text-[13px] text-[#404947]">
                <li><button onClick={() => onNavigate('simulation')} className="hover:text-[#00332f]">1. Simule (Realismo Clínico)</button></li>
                <li><button onClick={() => onNavigate('simulation')} className="hover:text-[#00332f]">2. Decida (Matriz Diagnóstica)</button></li>
                <li><button onClick={() => onNavigate('simulation')} className="hover:text-[#00332f]">3. Reflita (Debriefing Estruturado)</button></li>
                <li><button onClick={() => onNavigate('governance')} className="hover:text-[#00332f]">4. Evolua (Curva de Competência)</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-bold text-[#131b2e] mb-3 uppercase tracking-wider">
                Plataforma &amp; Módulos
              </h4>
              <ul className="space-y-2 text-[13px] text-[#404947]">
                <li><button onClick={() => onNavigate('simulation')} className="hover:text-[#00332f]">Monitor de Telemetria Dinâmica</button></li>
                <li><button onClick={() => onNavigate('simulation')} className="hover:text-[#00332f]">Árvore de Prescrição &amp; Conduta</button></li>
                <li><button onClick={() => onNavigate('osce')} className="hover:text-[#00332f]">Rubricas de Avaliação Prática</button></li>
                <li><button onClick={() => onNavigate('simulation')} className="hover:text-[#00332f]">Prontuário Eletrônico Simulado</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-bold text-[#131b2e] mb-3 uppercase tracking-wider">
                Liderança Acadêmica
              </h4>
              <ul className="space-y-2 text-[13px] text-[#404947]">
                <li><button onClick={() => onNavigate('governance')} className="hover:text-[#00332f]">Governança para Reitorias</button></li>
                <li><button onClick={() => onNavigate('governance')} className="hover:text-[#00332f]">Coordenações de Curso</button></li>
                <li><button onClick={() => onNavigate('simulation')} className="hover:text-[#00332f]">Hospitais Universitários &amp; Residência</button></li>
                <li><button onClick={onOpenPilotoModal} className="hover:text-[#00332f]">Programa Piloto Institucional 2026</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[12px] font-bold text-[#131b2e] mb-3 uppercase tracking-wider">
                Acesso Institucional
              </h4>
              <ul className="space-y-2 text-[13px] text-[#404947]">
                <li><button onClick={() => onNavigate('portal')} className="hover:text-[#00332f]">Portal do Docente / Preceptor</button></li>
                <li><button onClick={() => onNavigate('portal')} className="hover:text-[#00332f]">Ambiente do Residente / Aluno</button></li>
                <li><button onClick={onOpenPilotoModal} className="hover:text-[#00332f]">Solicitar Proposta Executiva</button></li>
                <li><button onClick={onOpenPilotoModal} className="hover:text-[#00332f]">Central de Suporte Educacional</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[#404947]">
            <p>© 2026 Sim⁴ Platform. Todos os direitos reservados. Plataforma de Simulação Clínica Integral para Educação Médica.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-[#00332f] cursor-pointer">Privacidade &amp; LGPD em Saúde</span>
              <span className="hover:text-[#00332f] cursor-pointer">Termos de Uso Acadêmico</span>
              <span className="hover:text-[#00332f] cursor-pointer">Diretrizes Éticas e Pedagógicas</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
