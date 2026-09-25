# Sim⁴ Med Ed — Como Funciona a Plataforma

> **A infraestrutura definitiva de Simulação Médica & Avaliação Prática para o ensino superior de saúde.**  
> Alinhada às Diretrizes Curriculares Nacionais (DCNs) de Medicina e aos critérios de avaliação regulatória do MEC / CAEM / ABEM.

---

## 1. Visão Geral e Proposta de Valor

O **Sim⁴** é uma plataforma concebida para superar a limitação dos chatbots de texto convencionais e modelos genéricos de IA, que apenas reagem a perguntas com respostas estáticas e gabaritadas.

Na prática médica real, o paciente não espera indefinidamente: **ele deteriora fisiologicamente**. Se o médico demorar para agir ou prescrever uma droga inadequada, a pressão arterial despenca, o ritmo eletrocardiográfico se desestabiliza e a janela de sobrevida se fecha.

O Sim⁴ introduz um **ecossistema de simulação clínica integral com motor hemodinâmico autêntico**, interligando:
1. **Pacientes Virtuais com resposta contínua em tempo real**;
2. **Avaliação Prática Estruturada (OSCE) 100% digital**, sem pranchetas de papel;
3. **Debriefing Metacognitivo Automatizado** para rastreio de vieses clínicos (ancoragem, fechamento prematuro);
4. **Painel de Governança Acadêmica para Reitorias e Avaliadores do MEC**.

---

## 2. O Método Sim⁴ em Quatro Vetores

A base pedagógica do Sim⁴ estrutura-se em um ciclo virtuoso fechado de deliberação médica:

```
    ┌──────────────┐         ┌──────────────┐
    │  01. SIMULE  │ ──────> │  02. DECIDA  │
    └──────────────┘         └──────────────┘
           ▲                        │
           │                        ▼
    ┌──────────────┐         ┌──────────────┐
    │  04. EVOLUA  │ <────── │  03. REFLITA │
    └──────────────┘         └──────────────┘
```

### 01. SIMULE (Realismo Fisiológico & Farmacodinâmico)
- **Pacientes dinâmicos**: Cada caso possui histórico clínico, expressão vocal, sintomas que evoluem com o passar dos minutos e variáveis biológicas interconectadas.
- **Farmacodinâmica Autêntica**: A infusão de drogas recalcula instantaneamente os parâmetros vitais (Frequência Cardíaca, Pressão Arterial Sistólica/Diastólica, SpO2 e Frequência Respiratória).
- **Sem respostas pré-enlatadas**: O paciente reage ao tom da anamnese e responde conforme seu estado de consciência e oxigenação cerebral.

### 02. DECIDA (Janelas Críticas & Pressão Temporal)
- **Janelas críticas autênticas**: No infarto com supradesnivelamento de ST (SCA), a meta de tempo porta-eletro é < 10 minutos e a porta-balão é < 90 minutos.
- **Custos e Consequências Diagnósticas**: Solicitar exames desnecessários consome tempo e recursos; intervenções sem exame físico minucioso podem induzir colapso hemodinâmico.

### 03. REFLITA (Debriefing Metacognitivo & Detecção de Vieses)
- **Mapeamento de Heurísticas Enviesadas**:
  - *Viés de Ancoragem*: Fixar-se no sintoma principal sem investigar causas secundárias (ex.: tratar dor epigástrica apenas como gastrite e negligenciar infarto inferior).
  - *Fechamento Prematuro*: Concluir o raciocínio diagnóstico antes de verificar achados de segurança (ex.: prescrever nitratos sem checar derivações direitas V3R/V4R).
  - *Viés de Representatividade*: Enquadrar apresentações atípicas em moldes comuns sem confirmação.
- **Relatório pós-atendimento**: Análise imediata de cada conduta tomada minuto a minuto, pontuando os acertos e as iatrogenias para discussão em tutorial ou tutoria docente.

### 04. EVOLUA (Telemetria Longitudinal & Conformidade DCN)
- **Matriz por Coorte e por Aluno**: Medição contínua da curva de aprendizado do 1º ao 12º período da faculdade de Medicina.
- **Evidências para o MEC**: Laudos de proficiência prontos para apresentação em visitas in loco das comissões do MEC (Conceito 5).

---

## 3. Arquitetura dos Quatro Módulos Integrados

### Módulo 1: Cockpit Clínico & Pacientes Virtuais de Alta Fidelidade
- **Traçado de ECG em Tempo Real (Canvas Dinâmico)**:
  - Onda eletrocardiográfica calculada em 25 mm/s (ritmo sinusal, taquicardia sinusal, supra-ST, bradicardia, etc.).
- **Monitor Multiparamétrico de Leito**:
  - `FC (bpm)` com alerta de taqui/bradiarritmia;
  - `PA (mmHg)` com indicação de Pressão Arterial Média (PAM);
  - `SpO2 (%)` sensível à oxigenoterapia;
  - `FR (irpm)` e padrão respiratório.
- **Diálogo Semiológico Ativo**:
  - Perguntas livres e estruturadas ao paciente;
  - Respostas em áudio/texto refletindo dor, ansiedade ou agonia respiratória.
- **Armário Farmacológico & Ordem Médica**:
  - Administração de medicações com doses, vias e horários parametrizados;
  - Resposta hemodinâmica imediata na tela.

### Módulo 2: Sistema de Avaliação Prática Estruturada (OSCE Digital)
- **Eliminação de Pranchetas de Papel**:
  - O preceptor/docente avalia o aluno em tempo real através de rubricas digitais parametrizadas no tablet ou computador.
- **Checklists Ponderados**:
  - Critérios categorizados (Comunicação, Anamnese, Exames, Conduta, Segurança);
  - Escala de pontuação: *Executou Integralmente (100%)*, *Parcialmente (50%)* ou *Não Executou (0%)*.
- **Controle de Circuito de Estações**:
  - Cronômetro sincronizado de estação (ex.: 10 minutos por rodízio);
  - Tabulação automática da nota final e espelho de prova gerado sem erro de digitação.

### Módulo 3: Motor de Debriefing Cognitivo & Segurança do Paciente
- Desmonta a cadeia decisória do futuro médico.
- Compara a sequência realizada com as diretrizes das sociedades médicas (SBC, AHA, SBP, SBPT, AMIB).
- Aponta exatamente em que minuto e segundo ocorreu uma oportunidade de melhoria ou conduta de exceção.

### Módulo 4: Painel de Governança para Reitorias & Avaliação MEC
- **Matriz de Competências por Semestre**:
  - Ciclo Básico (1º ao 4º período): Semiotécnica e bioética;
  - Ciclo Clínico (5º ao 8º período): Raciocínio sindrômico e farmacologia;
  - Internato Médico (9º ao 12º período): Urgência, emergência, UTI e cirurgia.
- **Índice de Prontidão Médica**:
  - Percentual de segurança clínica dos formandos antes da entrada no internato ou na residência médica.
- **Exportação com 1 Clique**:
  - Geração de dossiê PDF com assinatura digital para auditorias do Ministério da Educação.

---

## 4. Exemplos de Cenários Clínicos Nativos

### Caso 1: Carlos E. Vasconcelos, 58 anos
- **Cenário**: Sala de Choque / Emergência Cardiológica.
- **Apresentação**: Dor precordial constritiva irradiando para mandíbula e membro superior esquerdo, sudorese profusa e hipotensão.
- **Achado Crítico**: ECG de 12 derivações com supradesnivelamento de ST em DII, DIII e aVF (parede inferior) associado a supra em derivações direitas (V3R/V4R), caracterizando **Infarto com acometimento de Ventrículo Direito**.
- **Dinâmica Fisiológica**:
  - Se o estudante prescrever vasodilatador (Nitroglicerina IV ou Isordil), a pré-carga de VD é zerada e a PA cai drasticamente (ex.: para 88/54 mmHg), disparando o **Viés de Ancoragem / Fechamento Prematuro**.
  - A conduta corretiva exige **suspensão imediata do nitrato** e **expansão volêmica rápida com SF 0.9%** para restaurar a pressão de perfusão.

### Caso 2: Dra. Mariana Costa, 34 anos
- **Cenário**: Pronto-Atendimento Adulto / Emergência Respiratória.
- **Apresentação**: Crise de Asma Aguda Grave Refratária com fala monossilábica e tiragem intercostal.
- **Dinâmica Fisiológica**:
  - A administração precoce de broncodilatadores (Fenoterol + Ipratrópio) e corticoide sistêmico estabiliza a SpO2.
  - Uma tentativa incorreta de sedação (ex.: Midazolam por agitação psicomotora decorrente de hipóxia) precipita parada respiratória iminente por fadiga diafragmática.

---

## 5. Funcionamento Técnico das Ações & Chamadas ao Backend

Sob o ponto de vista de engenharia de software, a plataforma opera de forma integrada entre o frontend SPA (React) e os serviços de backend (Node.js/Express e microserviços fisiológicos):

### 5.1. Ação: "Agendar Demonstração Executiva" (Piloto 2026)
- **Gatilho de Interface**: O usuário clica em *"Agendar Demonstração Executiva"* na Hero, na Navbar ou preenche o formulário institucional da landing page.
- **Chamada HTTP**: O frontend efetua uma requisição `POST /api/demonstracoes` com o payload JSON contendo os dados institucionais (`nome`, `email`, `cargo`, `instituicao`, `alunos`, `objetivo`, `mensagem`).
- **Processamento no Backend**:
  1. **Validação**: Validação estrita de schema (Zod/Joi) e verificação do padrão de e-mail institucional;
  2. **Geração de Protocolo**: Gera um identificador único UUIDv4 e um protocolo legível no formato `SIM4-PILOTO-2026-XXXXXX`;
  3. **Persistência**: Grava o lead na tabela `leads_demonstracao` com status `pendente`, timestamp UTC e endereço IP de auditoria;
  4. **Fila de Disparo (Job Queue)**: Envia evento assíncrono para fila Redis/BullMQ:
     - Envio de e-mail transacional de confirmação ao solicitante (via Resend/SendGrid);
     - Disparo de webhook para o CRM institucional (HubSpot/Salesforce);
     - Alerta no canal de novos leads corporativos do Slack/Teams da diretoria médica;
  5. **Resposta**: O backend devolve HTTP `201 Created` com o protocolo emitido.
- **Retorno Visual**: O formulário exibe tela de confirmação contendo o número oficial do protocolo gerado.

### 5.2. Ação: "Prescrever / Intervir na Janela de Choque"
- **Gatilho de Interface**: O estudante seleciona uma droga no armário farmacológico ou digita uma conduta no cockpit.
- **Chamada HTTP / WebSocket**: Disparo de `POST /api/simulacoes/{caseId}/intervencoes`.
- **Processamento no Backend**:
  1. O **Motor Farmacodinâmico** do backend calcula os deltas de sinais vitais ($\Delta FC$, $\Delta PA$, $\Delta SpO_2$, $\Delta FR$) baseado nas características fisiopatológicas do paciente virtual;
  2. O **Detector de Vieses Metacognitivos** analisa a adequação da conduta segundo as diretrizes clínicas (ex.: se o aluno aplicou nitrato em paciente com IAM de ventrículo direito sem checar derivações direitas, detecta *Viés de Ancoragem / Fechamento Prematuro*);
  3. Atualiza o estado da sessão de simulação e armazena na trilha de auditoria;
  4. Retorna os novos valores de sinais vitais e o alerta de viés.
- **Retorno Visual**: O monitor atualiza instantaneamente as leituras numéricas, a curva animada do ECG recalcula a amplitude e frequência, e a barra de estabilidade hemodinâmica reflete a melhora ou deterioração do paciente.

### 5.3. Ação: "Finalizar Avaliação Prática" (Módulo OSCE)
- **Gatilho de Interface**: O preceptor avalia os itens da rubrica e clica em *"Finalizar Avaliação & Salvar Espelho"*.
- **Chamada HTTP**: Disparo de `POST /api/osce/avaliacoes`.
- **Processamento no Backend**:
  1. O backend computa a pontuação ponderada de cada competência e o aproveitamento percentual frente à nota de corte;
  2. **Assinatura Criptográfica**: Gera um hash inviolável `SHA-256` (`evaluationId|studentId|stationId|totalScore|timestamp`) para conformidade jurídica perante o MEC;
  3. **Integração LMS**: Dispara a sincronização via protocolo LTI 1.3 / REST API com o ambiente virtual de aprendizagem da universidade (Canvas, Moodle ou Blackboard);
  4. O espelho de prova e o feedback qualitativo são gravados no boletim do estudante.

---

> 📖 **Para uma documentação aprofundada de esquemas de banco de dados, diagramas de sequência e contratos de API, consulte o documento [ARQUITETURA_TECNICA.md](./ARQUITETURA_TECNICA.md).**

---

## 6. Como Executar a Aplicação Localmente

A plataforma foi desenvolvida utilizando **React 19 + TypeScript + Tailwind CSS v4 + Vite**.

### Requisitos:
- Node.js versão 18 ou superior.
- Gerenciador de pacotes npm ou yarn.

### Passo a passo:
```bash
# 1. Clonar o repositório
git clone <URL_DO_REPOSITORIO>
cd <PASTA_DO_REPOSITORIO>

# 2. Instalar as dependências
npm install

# 3. Executar o ambiente de desenvolvimento
npm run dev

# 4. Acessar a plataforma
# O servidor estará disponível em: http://localhost:3000 (ou porta indicada no terminal)

# 5. Compilar a versão de produção
npm run build
```

---

## 6. Estrutura de Arquivos do Projeto

```
├── COMO_FUNCIONA.md               # Este manual detalhado de funcionamento da plataforma
├── README.md                      # Apresentação do repositório no GitHub
├── index.html                     # Ponto de entrada HTML com fontes Newsreader e Inter
├── metadata.json                  # Metadados oficiais do applet
├── package.json                   # Dependências e scripts de execução
├── tsconfig.json                  # Configurações TypeScript
├── vite.config.ts                 # Configuração do Vite e Tailwind CSS
└── src/
    ├── App.tsx                    # Componente raiz com roteador e controle de estado
    ├── main.tsx                   # Bootstrap do React 19
    ├── index.css                  # Estilos globais Tailwind v4 e animações de ECG
    ├── types.ts                   # Interfaces TypeScript (Sinais Vitais, Casos, Rubricas)
    ├── data/
    │   └── clinicalCases.ts       # Base de dados de cenários clínicos de alta fidelidade
    └── components/
        ├── BrandLogo.tsx          # Logotipo institucional Sim⁴ com fallback SVG
        ├── Navbar.tsx             # Barra de navegação responsiva com troca de telas
        ├── InteractiveCockpit.tsx # Cockpit interativo com telemetria e motor hemodinâmico
        ├── EcgMonitorWave.tsx     # Canvas animado de traçado eletrocardiográfico
        ├── LandingView.tsx        # Tela principal institucional executiva
        ├── PilotoModal.tsx        # Modal de candidatura e agendamento do Piloto 2026
        ├── LoginModal.tsx         # Modal de autenticação para Docentes e Alunos
        └── Screens/
            ├── SimulationWorkbench.tsx # Simulador em tela cheia com exames e condutas
            ├── OsceStationScreen.tsx   # Módulo OSCE com checklists e notas de banca
            ├── GovernanceDashboard.tsx # Painel para Reitorias e comissões do MEC
            └── AcademicPortalView.tsx  # Portal do aluno e preceptor clínico
```

---

## 7. Conformidade e Segurança dos Dados (LGPD em Saúde)

- **Criptografia e Rastreabilidade**: Cada conduta executada recebe assinatura temporal inviolável, assegurando a validade jurídica das avaliações práticas.
- **Anonimização**: Cenários baseados em pacientes virtuais construídos de acordo com evidências clínicas reais, sem exposição de prontuários de pacientes reais.
- **Interoperabilidade**: Compatível com protocolos LTI 1.3 e webhooks para integração direta com **Canvas LMS**, **Moodle** e **Blackboard**.

---

*© 2026 Sim⁴ Platform. Todos os direitos reservados. Plataforma de Simulação Clínica Integral para Educação Médica.*
