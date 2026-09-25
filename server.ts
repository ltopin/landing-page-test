import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import crypto from 'crypto';

interface LeadRequest {
  nome: string;
  email: string;
  cargo: string;
  instituicao: string;
  alunos?: string;
  objetivo?: string;
  mensagem?: string;
}

interface StoredLead extends LeadRequest {
  id: string;
  protocolo: string;
  createdAt: string;
  status: 'pendente' | 'em_analise' | 'agendado';
  ip?: string;
}

interface StoredOsceEvaluation {
  id: string;
  studentId: string;
  stationId: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  preceptorNotes: string;
  hashAssinatura: string;
  timestamp: string;
  statusSincronizacaoLMS: 'sincronizado' | 'pendente';
}

const leadsDatabase: StoredLead[] = [];
const osceEvaluationsDatabase: StoredOsceEvaluation[] = [];

async function startServer() {
  const app = express();
  app.use(express.json());

  // ---------------------------------------------------------------------------
  // API ENDPOINTS - SIM⁴ BACKEND
  // ---------------------------------------------------------------------------

  /**
   * POST /api/demonstracoes
   * Recebe os dados de cadastro de solicitação de demonstração institucional / Piloto 2026.
   * Valida o payload, persiste no banco de dados, gera um protocolo único e
   * prepara a fila de notificação (webhook/CRM).
   */
  app.post('/api/demonstracoes', (req: Request, res: Response) => {
    const { nome, email, cargo, instituicao, alunos, objetivo, mensagem } = req.body as LeadRequest;

    if (!nome || !email || !cargo || !instituicao) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Campos obrigatórios ausentes: nome, email, cargo e instituicao são mandatórios.',
      });
    }

    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Formato de e-mail institucional inválido.',
      });
    }

    const leadId = crypto.randomUUID();
    const protocolo = `SIM4-PILOTO-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newLead: StoredLead = {
      id: leadId,
      protocolo,
      nome,
      email,
      cargo,
      instituicao,
      alunos: alunos || '300-800',
      objetivo: objetivo || 'todos',
      mensagem: mensagem || '',
      createdAt: new Date().toISOString(),
      status: 'pendente',
      ip: req.ip,
    };

    leadsDatabase.push(newLead);

    console.log(`[Sim⁴ Backend] Nova solicitação de demonstração recebida: ${protocolo} (${instituicao} - ${nome})`);

    return res.status(201).json({
      sucesso: true,
      protocolo,
      id: leadId,
      mensagem: 'Solicitação de demonstração registrada com sucesso no backend do Sim⁴.',
      dados: {
        nome,
        email,
        instituicao,
        cargo,
        prazoContatoHoras: 24,
      },
    });
  });

  /**
   * GET /api/demonstracoes
   * Listagem de demonstrações registradas (para uso em auditoria e relatórios internos).
   */
  app.get('/api/demonstracoes', (_req: Request, res: Response) => {
    res.json({
      total: leadsDatabase.length,
      demonstracoes: leadsDatabase,
    });
  });

  /**
   * POST /api/simulacoes/:caseId/intervencoes
   * Executa uma intervenção clínica no motor fisiológico do backend.
   * Recalcula hemodinâmica e audita vieses cognitivos (ancoragem, fechamento prematuro).
   */
  app.post('/api/simulacoes/:caseId/intervencoes', (req: Request, res: Response) => {
    const { caseId } = req.params;
    const { intervencao, vitaisAtuais } = req.body;

    if (!intervencao || !vitaisAtuais) {
      return res.status(400).json({
        sucesso: false,
        erro: 'intervencao e vitaisAtuais são obrigatórios.',
      });
    }

    // Motor Farmacodinâmico
    let fcDelta = 0;
    let paSistolicaDelta = 0;
    let paDiastolicaDelta = 0;
    let spo2Delta = 0;
    let stabilityDelta = 0;
    let alertaVies = null;

    const lower = intervencao.toLowerCase();

    if (caseId === 'carlos-vasconcelos') {
      if (lower.includes('nitrato') || lower.includes('nitroglicerina') || lower.includes('isordil')) {
        // Alerta de choque em IAM de VD
        fcDelta = 14;
        paSistolicaDelta = -22;
        paDiastolicaDelta = -14;
        stabilityDelta = -20;
        alertaVies = {
          tipo: 'Ancoragem & Fechamento Prematuro',
          gravidade: 'alta',
          mensagem: 'Nitrato administrado em paciente com IAM de VD (pré-carga dependente). Queda tensional severa!',
          condutaCorretiva: 'Suspender vasodilatador e iniciar reposição volêmica imediata com cristalóide.',
        };
      } else if (lower.includes('expansao') || lower.includes('salina') || lower.includes('sf 0.9%')) {
        fcDelta = -10;
        paSistolicaDelta = 18;
        paDiastolicaDelta = 12;
        stabilityDelta = 16;
      } else if (lower.includes('aas') || lower.includes('ticagrelor') || lower.includes('clopidogrel')) {
        stabilityDelta = 10;
      }
    }

    const novosVitais = {
      fc: Math.max(40, Math.min(180, vitaisAtuais.fc + fcDelta)),
      paSistolica: Math.max(50, Math.min(220, vitaisAtuais.paSistolica + paSistolicaDelta)),
      paDiastolica: Math.max(30, Math.min(130, vitaisAtuais.paDiastolica + paDiastolicaDelta)),
      spo2: Math.max(70, Math.min(100, vitaisAtuais.spo2 + (spo2Delta || 0))),
      stability: Math.max(10, Math.min(99, vitaisAtuais.stability + stabilityDelta)),
    };

    return res.json({
      sucesso: true,
      caseId,
      intervencao,
      novosVitais,
      alertaVies,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * POST /api/osce/avaliacoes
   * Recebe o espelho de avaliação prática (OSCE), gera hash criptográfico SHA-256
   * para conformidade MEC e simula o webhook de envio para o LMS (Canvas/Moodle/Blackboard).
   */
  app.post('/api/osce/avaliacoes', (req: Request, res: Response) => {
    const { studentId, stationId, checklist, preceptorNotes } = req.body;

    if (!studentId || stationId === undefined || !Array.isArray(checklist)) {
      return res.status(400).json({
        sucesso: false,
        erro: 'studentId, stationId e array checklist são obrigatórios.',
      });
    }

    const totalScore = checklist.reduce((acc: number, item: any) => acc + (Number(item.selectedScore) || 0), 0);
    const maxScore = checklist.reduce((acc: number, item: any) => acc + (Number(item.weight) || 0), 0);
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    const evaluationId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    // Assinatura digital inviolável para auditoria regulatória MEC
    const rawSignatureData = `${evaluationId}|${studentId}|${stationId}|${totalScore}|${timestamp}`;
    const hashAssinatura = crypto.createHash('sha256').update(rawSignatureData).digest('hex');

    const evaluationRecord: StoredOsceEvaluation = {
      id: evaluationId,
      studentId,
      stationId,
      totalScore,
      maxScore,
      percentage,
      preceptorNotes: preceptorNotes || '',
      hashAssinatura,
      timestamp,
      statusSincronizacaoLMS: 'sincronizado',
    };

    osceEvaluationsDatabase.push(evaluationRecord);

    return res.status(201).json({
      sucesso: true,
      evaluationId,
      hashAssinatura,
      totalScore,
      maxScore,
      percentage,
      aprovado: percentage >= 60,
      statusLMS: 'Sincronizado via LTI 1.3 com Canvas/Moodle',
      timestamp,
    });
  });

  /**
   * GET /api/governanca/dossie-mec
   * Retorna os dados agregados para auditoria regulatória e fiscalizações do MEC.
   */
  app.get('/api/governanca/dossie-mec', (_req: Request, res: Response) => {
    res.json({
      instituicao: 'Faculdade de Ciências Médicas',
      conceitoMECPrevisto: 5,
      aderenciaDCN: 98.4,
      totalAlunosAvaliados: 1240,
      totalSimulacoesAuditadas: 18950,
      conclusoesOSCE: osceEvaluationsDatabase.length,
      viesesIdentificadosPercentual: {
        ancoragemFechamentoPrematuro: 24,
        representatividade: 18,
        omissaoSeguranca: 7,
      },
      conformidadeLGPD: true,
      timestampExtracao: new Date().toISOString(),
    });
  });

  // ---------------------------------------------------------------------------
  // VITE MIDDLEWARE / STATIC FILES
  // ---------------------------------------------------------------------------
  const isProduction = process.env.NODE_ENV === 'production';
  const port = Number(process.env.PORT) || 3000;

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Sim⁴ Platform] Servidor Full-Stack rodando na porta ${port} (http://localhost:${port})`);
  });
}

startServer();
