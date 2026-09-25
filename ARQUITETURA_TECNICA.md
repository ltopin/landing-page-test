# Sim⁴ Med Ed — Arquitetura Técnica & Especificação de Engenharia

> Este documento detalha **como a plataforma Sim⁴ funciona sob o ponto de vista de arquitetura de software, engenharia de sistemas, contratos de API e fluxos de dados ponta a ponta**.

---

## 1. Visão Geral da Arquitetura

O Sim⁴ é projetado como uma aplicação web moderna **Full-Stack Event-Driven**, construída para suportar alta concorrência de estudantes em estações práticas simultâneas e resposta farmacodinâmica contínua em tempo real:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (SPA - React 19)                       │
│  - Landing Page Institucional & Agendamento de Demonstração            │
│  - Cockpit Clínico de Alta Fidelidade (Canvas ECG 25mm/s + Telemetria) │
│  - Sistema OSCE Digital de Rubricas Ponderadas para Preceptores       │
│  - Painel de Governança DCN/MEC & Portal Acadêmico                     │
└───────────────────▲────────────────────────────────────┬───────────────┘
                    │ HTTPS / REST JSON                  │ WebSocket / SSE
                    │                                    ▼
┌───────────────────┴────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express API)                     │
│  - Roteamento REST (/api/demonstracoes, /api/simulacoes, /api/osce)    │
│  - Motor Farmacodinâmico & Fisiológico em Tempo Real                   │
│  - Algoritmo Detector de Vieses Metacognitivos (Ancoragem / Iatrogenia)│
│  - Assinador Criptográfico SHA-256 para Auditoria Regulatória MEC      │
└───────────────▲────────────────────────▲───────────────────▲──────────┘
                │                        │                   │
                ▼                        ▼                   ▼
┌─────────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐
│ BANCO DE DADOS (Postgres│  │ FILA DE EVENTOS      │  │ INTEGRAÇÃO LMS  │
│  - Tabelas Relacionais  │  │ (Redis + BullMQ)     │  │ (LTI 1.3 / REST)│
│  - JSONB Telemetria     │  │  - Webhook CRM       │  │  - Canvas LMS   │
│  - Logs de Auditoria    │  │  - E-mails Transac.  │  │  - Moodle       │
│  - Prontuários Virtuais │  │  - Relatórios MEC    │  │  - Blackboard   │
└─────────────────────────┘  └──────────────────────┘  └─────────────────┘
```

---

## 2. Fluxos Técnicos Detalhados Ponta a Ponta

### Fluxo 1: "Agendar Demonstração Executiva" (Lead Capture & Onboarding)

Quando um gestor acadêmico, reitor ou coordenador clica em **"Agendar Apresentação Executiva"** ou submete o formulário institucional:

#### Passo a Passo Técnico:
1. **Captura no Frontend**:
   - O componente `PilotoModal.tsx` ou `LandingView.tsx` coleta os dados do formulário (`nome`, `email`, `cargo`, `instituicao`, `alunos`, `objetivo`, `mensagem`).
   - O estado do botão muda para `formLoading = true`, desabilitando cliques duplos.
2. **Requisição HTTP**:
   - Disparo de `POST /api/demonstracoes` com cabeçalho `Content-Type: application/json`.
3. **Validação no Backend**:
   - O Express intercepta a requisição e valida:
     - Preenchimento de campos obrigatórios (`nome`, `email`, `cargo`, `instituicao`);
     - Validação de Regex de e-mail corporativo/educacional (`.edu.br`, `@faculdade...`);
     - Sanitização contra XSS e SQL Injection.
4. **Persistência no Banco de Dados**:
   - Gera um UUIDv4 (`id`) e um código de protocolo legível (`protocolo`: `SIM4-PILOTO-2026-XXXXXX`).
   - Grava o registro na tabela `demonstracoes_piloto` com `status = 'pendente'`, timestamp UTC e IP de origem.
5. **Enfileiramento Assíncrono (Job Queue)**:
   - Dispara um job `send_confirmation_email` via fila assíncrona (Redis/BullMQ) para enviar um e-mail transacional via provedor (SendGrid/Resend) com o kit de apresentação institucional e confirmação do protocolo.
   - Dispara webhook para o CRM institucional (HubSpot, Salesforce ou Pipefy) e alerta para canal interno do Slack/Teams da equipe de parcerias médicas.
6. **Resposta e Atualização de Interface**:
   - O backend retorna HTTP `201 Created` com o JSON contendo o protocolo gerado.
   - O frontend exibe a tela de sucesso renderizando o protocolo emitido e prazos de SLA.

#### Contrato de API: `POST /api/demonstracoes`
- **Request Body**:
```json
{
  "nome": "Dr. Fernando Silveira",
  "email": "fernando.silveira@medicina.edu.br",
  "cargo": "coordenador",
  "instituicao": "Faculdade de Ciências da Saúde",
  "alunos": "800-1500",
  "objetivo": "todos",
  "mensagem": "Precisamos modernizar nossas estações OSCE e integrar ao Moodle."
}
```
- **Response Body (201 Created)**:
```json
{
  "sucesso": true,
  "protocolo": "SIM4-PILOTO-2026-849201",
  "id": "e8d64188-cfb2-4d2b-b6d8-19e4871e9a3b",
  "mensagem": "Solicitação de demonstração registrada com sucesso no backend do Sim⁴.",
  "dados": {
    "nome": "Dr. Fernando Silveira",
    "email": "fernando.silveira@medicina.edu.br",
    "instituicao": "Faculdade de Ciências da Saúde",
    "prazoContatoHoras": 24
  }
}
```

---

### Fluxo 2: "Prescrever / Intervir na Janela de Choque" (Motor Farmacodinâmico)

Quando um estudante ou residente clica para administrar uma medicação no Cockpit Clínico:

#### Passo a Passo Técnico:
1. **Ação no Frontend**:
   - O usuário seleciona ou digita a intervenção (ex: `Nitroglicerina IV Contínua (Tridil)` ou `AAS 300mg + Ticagrelor 180mg`).
   - O frontend envia a ordem para o backend via `POST /api/simulacoes/{caseId}/intervencoes`.
2. **Processamento do Motor Farmacodinâmico (Backend)**:
   - O backend localiza o modelo fisiopatológico do paciente (`carlos-vasconcelos`).
   - Verifica as variáveis de estado:
     - O paciente possui IAM com supradesnivelamento de ST em parede inferior e derivações direitas (V3R/V4R) $\rightarrow$ **Ventrículo Direito isquêmico e pré-carga dependente**.
     - A administração de um vasodilatador venoso potente (Nitrato) reduz drasticamente a pré-carga de VD.
   - O motor aplica as equações diferenciais dos sinais vitais:
     $$\Delta PA_{sistolica} = -22 \text{ mmHg}, \quad \Delta PA_{diastolica} = -14 \text{ mmHg}, \quad \Delta FC = +14 \text{ bpm (taquicardia reflexa)}$$
     $$\Delta Estabilidade = -20\% \rightarrow \text{Choque Cardiogênico Induzido}$$
3. **Algoritmo Detector de Vieses Cognitivos**:
   - Detecta o padrão: medicação vasodilatadora aplicada sem verificação prévia de derivações direitas.
   - Dispara objeto `alertaVies`:
     - **Tipo**: `Ancoragem & Fechamento Prematuro`;
     - **Gravidade**: `Alta`;
     - **Orientação**: `Suspender nitrato e realizar prova de volume imediata com SF 0.9%`.
4. **Atualização da Telemetria no Cliente**:
   - O frontend recebe os novos sinais vitais e os propaga para o canvas do ECG (que ajusta a frequência e a amplitude das ondas) e para a barra de estabilidade hemodinâmica.
   - O evento é adicionado à árvore de decisão com badge de alerta.

#### Contrato de API: `POST /api/simulacoes/:caseId/intervencoes`
- **Request Body**:
```json
{
  "intervencao": "Nitroglicerina IV Contínua (Tridil)",
  "vitaisAtuais": {
    "fc": 114,
    "paSistolica": 88,
    "paDiastolica": 54,
    "spo2": 91,
    "stability": 65
  }
}
```
- **Response Body (200 OK)**:
```json
{
  "sucesso": true,
  "caseId": "carlos-vasconcelos",
  "intervencao": "Nitroglicerina IV Contínua (Tridil)",
  "novosVitais": {
    "fc": 128,
    "paSistolica": 66,
    "paDiastolica": 40,
    "spo2": 91,
    "stability": 45
  },
  "alertaVies": {
    "tipo": "Ancoragem & Fechamento Prematuro",
    "gravidade": "alta",
    "mensagem": "Nitrato administrado em paciente com IAM de VD (pré-carga dependente). Queda tensional severa!",
    "condutaCorretiva": "Suspender vasodilatador e iniciar reposição volêmica imediata com cristalóide."
  },
  "timestamp": "2026-09-25T11:21:00.000Z"
}
```

---

### Fluxo 3: "Finalizar Avaliação Prática" (Módulo OSCE Digital)

Quando o preceptor conclui a avaliação de um aluno na estação prática de habilidades:

#### Passo a Passo Técnico:
1. **Coleta de Rubrica Ponderada**:
   - O preceptor marca cada item do checklist (`1.0 = Executou`, `0.5 = Parcial`, `0.0 = Não executou`).
   - Insere as observações qualitativas do desempenho do aluno.
2. **Disparo para o Backend**:
   - O frontend envia `POST /api/osce/avaliacoes`.
3. **Cálculo de Nota & Assinatura Criptográfica**:
   - O backend calcula a somatória de pontos e a porcentagem obtida em relação à nota de corte (60%).
   - Para garantir **validade jurídica perante o MEC e impedir contestações de prova**, o backend calcula um hash `SHA-256` contendo os dados da prova:
     ```
     hash = SHA256(evaluationId + "|" + studentId + "|" + stationId + "|" + totalScore + "|" + timestamp)
     ```
4. **Sincronização com o LMS da Faculdade (LTI 1.3 / REST API)**:
   - O backend se comunica com o LMS cadastrado (Canvas, Moodle ou Blackboard) via webhook ou protocolo LTI 1.3 `Assignment and Grade Services (AGS)`.
   - O espelho da nota e o parecer pedagógico são creditados no boletim oficial do aluno sem qualquer digitação manual.

#### Contrato de API: `POST /api/osce/avaliacoes`
- **Request Body**:
```json
{
  "studentId": "20210481",
  "stationId": 3,
  "checklist": [
    { "id": "c1", "weight": 1.0, "selectedScore": 1.0 },
    { "id": "c2", "weight": 1.0, "selectedScore": 1.0 },
    { "id": "c3", "weight": 2.0, "selectedScore": 2.0 },
    { "id": "c4", "weight": 1.5, "selectedScore": 1.5 },
    { "id": "c5", "weight": 2.0, "selectedScore": 2.0 },
    { "id": "c6", "weight": 1.5, "selectedScore": 1.0 },
    { "id": "c7", "weight": 1.0, "selectedScore": 1.0 }
  ],
  "preceptorNotes": "Aluna demonstrou excelente postura ética e técnica de ECG adequada."
}
```
- **Response Body (201 Created)**:
```json
{
  "sucesso": true,
  "evaluationId": "c4b9281a-4710-40e1-87ab-18efd398a211",
  "hashAssinatura": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  "totalScore": 9.5,
  "maxScore": 10.0,
  "percentage": 95,
  "aprovado": true,
  "statusLMS": "Sincronizado via LTI 1.3 com Canvas/Moodle",
  "timestamp": "2026-09-25T11:21:30.000Z"
}
```

---

### Fluxo 4: "Exportação de Dossiê Regulatório" (Governança & MEC)

Quando a Reitoria ou Coordenador precisa de comprovação para comissões do MEC:

#### Passo a Passo Técnico:
1. **Requisição de Dados Agregados**:
   - Disparo de `GET /api/governanca/dossie-mec`.
2. **Processamento do Backend**:
   - Consulta a base histórica de simulações e calcula:
     - Aderência aos eixos curriculares das DCNs de Medicina;
     - Taxa de ocorrência e resolução de iatrogenias por turma;
     - Mapas de calor de proficiência do 1º ao 12º período;
     - Conformidade LGPD em Saúde e trilha de auditoria.
3. **Geração do Dossiê**:
   - O backend compila os relatórios em formato estruturado pronto para exportação em PDF assinado digitalmente.

---

## 3. Modelo de Entidades e Banco de Dados (Schema)

```sql
-- 1. Tabela de Solicitações de Demonstração / Leads Piloto
CREATE TABLE leads_demonstracao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocolo VARCHAR(32) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    instituicao VARCHAR(255) NOT NULL,
    alunos VARCHAR(50),
    objetivo VARCHAR(100),
    mensagem TEXT,
    status VARCHAR(50) DEFAULT 'pendente',
    ip_origem VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Casos Clínicos Fisiológicos
CREATE TABLE cenarios_clinicos (
    id VARCHAR(100) PRIMARY KEY,
    nome_paciente VARCHAR(255) NOT NULL,
    idade INT NOT NULL,
    sexo VARCHAR(20) NOT NULL,
    leito VARCHAR(50) NOT NULL,
    prioridade VARCHAR(20) NOT NULL,
    sindrome_clinica TEXT NOT NULL,
    modelo_farmacologico JSONB NOT NULL,
    vitais_iniciais JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Sessões de Simulação (Audit Trail)
CREATE TABLE sessoes_simulacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cenario_id VARCHAR(100) REFERENCES cenarios_clinicos(id),
    usuario_id UUID NOT NULL,
    tempo_total_segundos INT DEFAULT 0,
    estabilidade_final INT NOT NULL,
    vieses_detectados JSONB DEFAULT '[]'::jsonb,
    timeline_eventos JSONB DEFAULT '[]'::jsonb,
    score_dcn NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Avaliações Práticas OSCE
CREATE TABLE avaliacoes_osce (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aluno_ra VARCHAR(50) NOT NULL,
    estacao_id INT NOT NULL,
    preceptor_id UUID NOT NULL,
    rubrica_respostas JSONB NOT NULL,
    nota_final NUMERIC(4,2) NOT NULL,
    nota_maxima NUMERIC(4,2) NOT NULL,
    aprovado BOOLEAN NOT NULL,
    observacoes TEXT,
    hash_assinatura VARCHAR(64) NOT NULL, -- SHA-256 para auditoria MEC
    sincronizado_lms BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. Segurança, LGPD em Saúde & Conformidade Regulatória

1. **Criptografia Ponta a Ponta**:
   - Todo tráfego trafega sobre TLS 1.3 com HSTS ativado.
   - Dados sensíveis em repouso no banco de dados são encriptados com AES-256.
2. **Anonimização de Pacientes**:
   - Todos os pacientes são entidades virtuais geradas com rigor fisiológico; nenhum dado de prontuário de pacientes reais é trafegado ou armazenado.
3. **Trilha de Auditoria Inviolável (Audit Trail)**:
   - Cada decisão de um estudante e cada nota atribuída por um preceptor recebe carimbo de tempo (timestamp) de alta precisão e hash criptográfico, impossibilitando adulteração de notas perante comissões examinadoras e o MEC.
4. **Interoperabilidade Padrão Aberto**:
   - Protocolo 1EdTech LTI 1.3 para integração transparente com qualquer ambiente virtual de aprendizagem corporativo ou acadêmico.

---

*Documento técnico mantido pela Diretoria de Engenharia do Sim⁴ Platform.*
