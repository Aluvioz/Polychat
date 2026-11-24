# Issue #125 — Modelo de ameaças e plano de mitigação

**Projeto:** Polychat — aplicação de comunicação interna da FORD  
**Issue:** [#125 — Executar threat modeling e hardening de segurança](https://github.com/Aluvioz/Polychat/issues/125)  
**Épica:** #86 — Segurança, monitoramento e auditoria  
**Identificador:** POLY-SEC-001  
**Versão:** 0.9 — 24/11/2026  
**Status:** modelo preliminar; plano consolidado proposto pelo PO, pendente de validação das prioridades, responsabilidades funcionais, marcos e evidências pelo Tech Lead, TI e SQA  
**Classificação:** documento interno de trabalho — não contém segredos nem dados reais de usuários

> **Aviso de governança:** este documento é análise documental preliminar. Não é pentest, auditoria independente, certificação ou declaração de controles integrados e homologados. As migrations da Issue #99 introduzem implementação parcial do schema e de invariantes no banco de dados, mas os fluxos funcionais ponta a ponta e as políticas de autorização de domínio ainda não estão integrados e validados. Os artefatos isolados da aplicação não comprovam integração completa. A confiança e os poderes equivalentes dos administradores TI, bem como os riscos associados a esse modelo, já foram avaliados pelo responsável do projeto e não devem ser reabertos como pendência de produto.

---

## 1. Objetivo

Identificar ameaças relevantes ao Polychat, registrar ativos e fronteiras de confiança, avaliar impactos potenciais, recomendar controles e definir evidências necessárias para reduzir os riscos.

A análise cobre especialmente os pontos definidos na Issue #125:

- abuso de funcionalidades e de privilégios;
- exposição ou alteração indevida de informações;
- autenticação, sessão e ciclo de vida de contas;
- XSS e CSRF;
- upload e download de arquivos;
- autorização server-side e RLS;
- rate limiting e abuso de recursos;
- proteção de secrets e credenciais;
- auditoria, monitoramento e resposta a incidentes.

O objetivo de produto é tornar os riscos visíveis e permitir decisões responsáveis. O objetivo técnico é transformar cada risco priorizado em controles verificáveis, testes e evidências.

## 2. Status e interpretação

Os termos abaixo devem ser usados para não confundir intenção, proposta, implementação e homologação.

| Termo | Significado |
|---|---|
| **Confirmado** | Consta de requisito ou decisão registrada como referência do produto. |
| **Observado no repositório** | Foi identificado em arquivo, migration, teste ou configuração versionada na revisão consultada. Não comprova funcionamento em ambiente hospedado. |
| **Proposto** | Controle recomendado para avaliação; precisa de revisão e aprovação dos responsáveis antes de ser tratado como decisão final. |
| **Pendente** | Depende de informação, decisão, implementação ou evidência ainda não disponível. |
| **Bloqueado** | Não pode ser validado de forma confiável enquanto uma dependência ou decisão não for resolvida. |
| **Aceito formalmente** | Risco residual assumido por autoridade institucional competente, com justificativa, escopo, prazo, condições e aprovador registrados. Nenhum risco recebe esse status nesta versão. |

### 2.1 Limites da avaliação

Esta versão é uma análise documental e preliminar. Ela não inclui:

- teste de intrusão ou exploração ativa;
- varredura autenticada de infraestrutura;
- a compatibilidade da configuração e do modelo de utilização Supabase + Vercel foi aprovada na Q-025 em 24/11/2026. A aprovação não substitui a implementação nem a execução de testes de integração, RLS, Storage ou continuidade;
- inspeção de secrets reais ou variáveis de ambiente protegidas;
- teste de segurança em produção;
- homologação de produção e teste automatizado/reproduzível de integração SQL no CI. As notas da Issue #99 documentam a aplicação e inspeção das migrations no projeto Supabase de desenvolvimento Polyford (`sa-east-1`), mas essa evidência não representa homologação de produção;
- validação jurídica ou avaliação de impacto de privacidade.

A ausência de evidência no repositório não prova que um controle inexista em todos os ambientes; significa que ele não pode ser considerado comprovado por esta análise.

## 3. Fontes e artefatos relacionados

| Fonte | Utilização e limite |
|---|---|
| [Baseline POLY-REQ-001 — Issue #88](../09-baseline-requisitos-mvp.md) | Baseline v0.5, RF-001 a RF-023, RNF-001 a RNF-013 e fotografia técnica reconciliada com as migrations parciais de schema/integridade da Issue #99; fluxos funcionais e policies de domínio permanecem pendentes. |
| [Requisitos funcionais](../03-requisitos-funcionais.md) | RF-001 a RF-023, incluindo autenticação, mensagens, leitura, administração, exportação, auditoria e aviso de monitoramento. |
| [Requisitos não funcionais](../04-requisitos-nao-funcionais.md) | RNF-001 a RNF-013; parâmetros principais já alinhados. Implementação, testes e evidências seguem pendentes. |
| [Questões em aberto](../08-glossario-e-questoes-em-aberto.md) | Q-018 está resolvida; Q-019 tem paleta provisória definida, restando ativos/regras oficiais somente para uso institucional/produção; Q-025 foi concluída em 24/11/2026 com aprovação da TI e da FORD para a compatibilidade da stack Supabase + Vercel. Q-001 a Q-017 e Q-020 a Q-024 foram respondidas/alinhadas. |
| [Índice de ADRs](../adr/README.md) | Situação de aprovação das decisões arquiteturais. |
| [ADR-003 — Supabase + Vercel](../adr/ADR-003-supabase-vercel.md) | Stack tecnológica adotada (Accepted); a compatibilidade do modelo de utilização foi aprovada pela TI e pela FORD na Q-025. A aprovação não equivale à implementação integral dos fluxos ou à homologação funcional de cada release. |
| [ADR-004 — Autenticação e sessões](../adr/ADR-004-autenticacao-sessoes.md) | Proposta de fluxo de autenticação; permanece Proposed. |
| [ADR-006 — Autorização e RLS](../adr/ADR-006-autorizacao-rls.md) | Contrato e direção de autorização documentados; políticas RLS de domínio e integração funcional ainda não implementadas. |
| [ADR-008 — Storage e anexos](../adr/ADR-008-storage-anexos.md) | Direção de armazenamento privado com Supabase Storage aprovada (Accepted); bucket, handlers, scanner e autorização permanecem entregas de implementação. |
| [ADR-010 — Segurança, auditoria e monitoramento](../adr/ADR-010-seguranca-auditoria-monitoramento.md) | Trade-offs de monitoramento, consulta administrativa, auditoria e criptografia; permanece Proposed. |
| [Matriz de autorização — Issue #100](../issue-100-matriz-autorizacao.md) | Regras de negócio validadas pelo PO; revisão independente SQA e enforcement de domínio permanecem pendentes. Não reabrir poderes iguais de TI. |
| [Modelo de dados — Issue #99](https://github.com/Aluvioz/Polychat/pull/149) | PR #149 mantém o modelo documental; as migrations físicas de domínio foram incorporadas à main pela PR #165. O schema e algumas invariantes já estão versionados, mas policies RLS de domínio e integração funcional permanecem na #101 e nas issues correspondentes. |
| [Notas de implementação da Issue #99](../database/issue-99-implementation-notes.md) | Registram aplicação e inspeção do schema no projeto Supabase de desenvolvimento Polyford (`sa-east-1`); não equivalem a homologação de produção nem a teste SQL reproduzível no CI. |
| [Política de anexos — Issue #117](https://github.com/Aluvioz/Polychat/pull/150) | PR #150 integrada à main; regras de PDF/JPEG, limites, scanner interno, bloqueio em falha e liberação TI estão definidas. A migration #99 persiste parte dos limites no banco; upload, Storage privado, scanner e fluxo funcional continuam pendentes. |
| [Política de conteúdo suspeito — Issue #122](https://github.com/Aluvioz/Polychat/pull/151) | PR #151 em revisão documental; regras/lista TI incluindo palavrões, ausência de análise contextual/IA, fila, severidades, prazos e encerramento sem justificativa já definidos na FORD v2. |
| [Issue #101](https://github.com/Aluvioz/Polychat/issues/101) | Implementação de RLS e testes de isolamento de domínio. |
| [Issue #102](https://github.com/Aluvioz/Polychat/issues/102) | Estratégia de auditoria, retenção, acesso e proteção contra alteração. |
| [Issue #105](https://github.com/Aluvioz/Polychat/issues/105) | Integração de autenticação/perfis e bloqueio de contas. |
| [Issue #117](https://github.com/Aluvioz/Polychat/issues/117) | Limites, retenção e proteção antimalware de anexos. |
| [Issue #122](https://github.com/Aluvioz/Polychat/issues/122) | Detecção de conteúdo suspeito e falsos positivos. |
| [Issue #126](https://github.com/Aluvioz/Polychat/issues/126) | Plano de testes e rastreabilidade requisito–caso. |
| [Issue #129](https://github.com/Aluvioz/Polychat/issues/129) | Homologação de dispositivos/navegadores, acessibilidade e regressão. |
| [Issue #130](https://github.com/Aluvioz/Polychat/issues/130) | Prontidão de release, operação, continuidade, suporte e resposta a incidentes. |

**Regra de precedência:** este documento não altera requisitos nem aprova propostas presentes em ADRs ou PRs em Draft. Em caso de divergência, prevalecem requisitos e decisões formalmente aprovados pelos responsáveis competentes.

## 4. Contexto do sistema e fotografia técnica

### 4.1 Escopo funcional relevante para segurança

A baseline do produto registra:

- aplicação web interna da FORD;
- público inicial aproximado de 25 pessoas do setor técnico;
- dois perfis de aplicação: Usuário (`user`) e TI (`ti`);
- contas individuais provisionadas pelo TI, sem auto cadastro;
- conversas individuais e grupos administrados pelo TI;
- mensagens textuais e anexos PDF/JPEG;
- análise de mensagens por lista/regras mantidas pelo TI, incluindo palavrões, e fila de alertas com severidades/prazos definidos; implementação pendente;
- consulta de conversas pelo TI para segurança, com registro obrigatório de auditoria;
- perfil Usuário em smartphone e perfil TI em computador.

O tamanho da população inicial não reduz a criticidade dos ativos. Mensagens, credenciais, anexos e privilégios administrativos continuam exigindo controles adequados.

### 4.2 Estado observado na `main`

A fotografia do repositório registra implementação parcial de banco de dados, mas não representa integração funcional ponta a ponta. A sincronização com a `main` incorporou as migrations da Issue #99 pela PR #165:

- Next.js 16, React 19, TypeScript e App Router estão presentes.
- Existe um módulo de autorização isolado (`src/auth/authorization.mjs`), sem integração com handlers/rotas reais; deve ser tratado como scaffold, não como autenticação integrada ao produto.
- O módulo de autorização é Express-compatible e não foi identificado como integrado a handlers/rotas reais do App Router.
- Não há cliente/SDK Supabase integrado aos fluxos de aplicação observados. Supabase + Vercel permanece como stack adotada na ADR-003, com compatibilidade do modelo operacional aprovada na Q-025; a integração funcional continua pendente.
- A migration `202611240001_issue_99_initial_domain_schema.sql` adiciona `profiles.username` e cria `conversations`, `memberships`, `messages`, `attachments`, `message_reads` e `security_alerts`, com FKs, índices e restrições de integridade. Na tabela `attachments`, o campo `size_bytes` tem limite superior de 10.485.760 bytes (10 MiB).
- Essa migration habilita RLS nas tabelas de domínio criadas, mas não define policies de autorização para essas tabelas. A implementação das policies e os testes de isolamento permanecem no escopo da Issue #101.
- A migration `202611240002_issue_99_integrity_and_configuration.sql` implementa triggers de integridade: uma mensagem deve conter texto não vazio ou ao menos um anexo, e uma mensagem não pode exceder cinco anexos.
- A segunda migration cria `detection_rules`, `attachment_user_quotas` e `attachment_storage_capacity`. As tabelas de quota/capacidade não recebem valores padrão ou registros semeados; a existência da estrutura não comprova configuração efetiva nem enforcement integrado das quotas. As tabelas de configuração também têm RLS habilitada e acesso revogado de `public`, `anon` e `authenticated`.
- As migrations não criam nem comprovam bucket privado, upload/download, integração com scanner antimalware, handlers de mensagens/anexos ou fluxos de interface. Esses componentes continuam pendentes nas respectivas issues.
- As notas `docs/database/issue-99-implementation-notes.md` registram a aplicação das duas migrations no projeto Supabase de desenvolvimento Polyford, região `sa-east-1`, estado observado `ACTIVE_HEALTHY` e PostgreSQL `17.11.0.019`; também registram o histórico remoto e a consulta que confirmou as tabelas. Essa é evidência documental de aplicação no ambiente de desenvolvimento, não homologação de produção nem teste automatizado de integração SQL reproduzível no CI.
- Existem testes unitários de um módulo isolado com dependências Supabase simuladas; são evidência restrita desse scaffold e não testam rotas reais, policies RLS de domínio ou integração funcional da stack adotada.
- O workflow CI executa testes, ESLint, verificação TypeScript e build.

**Conclusão da fotografia:** o schema de domínio e algumas invariantes de banco foram implementados e aplicados em desenvolvimento. Entretanto, os fluxos funcionais da aplicação, as policies de autorização de domínio, a integração com Storage/scanner e a homologação operacional não estão concluídos. A adoção da stack não equivale à homologação de produção.

### 4.3 Visão de contexto e fronteiras de confiança

O fluxo abaixo representa a arquitetura de referência a avaliar. Elementos identificados como pendentes ou propostos não devem ser interpretados como integrações já implementadas.

~~~mermaid
flowchart LR
    U["Usuário / TI"] -->|HTTPS| B["Navegador / dispositivo"]
    B -->|HTTPS| V["Next.js na Vercel — stack adotada; modelo de utilização aprovado na Q-025; integração funcional conforme issues"]
    V -->|Identidade| A["Supabase Auth — capacidade prevista na stack adotada; integração pendente (ADR-004)"]
    V -->|Consultas autorizadas| P["Supabase PostgreSQL — schema de domínio da #99 versionado; RLS habilitada sem policies de domínio; integração pendente (ADR-005/006)"]
    V -->|Upload e download autorizados| S["Supabase Storage privado — direção aprovada na ADR-008; fluxo e integração pendentes"]
    P -->|Metadados e persistência| D["Dados de domínio"]
    V -->|Eventos de auditoria| L["Trilha de auditoria proposta"]
    V -->|Detecção de mensagem| M["Mecanismo de análise proposto"]
    M -->|Ocorrência / alerta| Q["Fila de revisão TI proposta"]
    CI["GitHub Actions / dependências"] -->|Build e deploy| V
    K["Gerenciamento de secrets da plataforma"] -->|Segredos server-side| V
~~~

**Fronteiras que exigem validação:**

1. dispositivo/navegador → aplicação web;
2. camada cliente → handlers e serviços server-side;
3. aplicação → Supabase Auth, previsto na stack adotada e aprovado no modelo de uso da Q-025; integração com o runtime permanece pendente;
4. aplicação → Supabase PostgreSQL; o schema e a habilitação de RLS estão versionados, mas as policies de autorização de domínio e a integração funcional ainda não foram implementadas;
5. aplicação → Supabase Storage privado, cuja integração e controles permanecem pendentes;
6. serviços de análise/antimalware → aplicação, caso terceiros venham a ser contratados;
7. pipeline de CI/CD → artefato implantado;
8. administradores e operadores privilegiados → dados, logs, secrets e ambientes.

Cada fronteira precisa de autenticação apropriada, autorização, validação de entrada, tratamento de falha, logging seguro e testes. A camada visual não é uma fronteira de segurança suficiente.

## 5. Ativos, classificação e objetivos de proteção

A classificação abaixo é preliminar e deve ser revisada pelo Tech Lead, SQA e TI, responsável operacional por segurança na FORD. Obrigações legais aplicáveis permanecem sob responsabilidade institucional da FORD.

| ID | Ativo | Classificação preliminar | Objetivos de proteção | Consequência de comprometimento |
|---|---|---|---|---|
| A-01 | Credenciais, tokens e sessões | Restrito | Confidencialidade e integridade | Tomada de conta, impersonação e acesso indevido |
| A-02 | Perfis, roles e estado das contas | Restrito | Integridade e disponibilidade | Elevação de privilégio, bloqueio indevido ou acesso persistente |
| A-03 | Mensagens e histórico de conversas | Confidencial/Restrito | Confidencialidade, integridade e disponibilidade | Exposição de comunicação corporativa, fraude ou perda de histórico |
| A-04 | Conversas, grupos e memberships | Restrito | Integridade e confidencialidade | Acesso cruzado, inclusão indevida ou remoção não autorizada |
| A-05 | Anexos PDF/JPEG e metadados | Confidencial/Restrito | Confidencialidade, integridade e disponibilidade | Malware, vazamento de documentos ou indisponibilidade |
| A-06 | Eventos de auditoria e evidências | Restrito | Integridade, autenticidade e disponibilidade | Impossibilidade de responsabilização ou ocultação de ações |
| A-07 | Alertas e ocorrências de conteúdo suspeito | Restrito | Confidencialidade, integridade e finalidade | Exposição desnecessária, falso positivo ou uso indevido |
| A-08 | Chaves, tokens e variáveis de ambiente | Segredo operacional | Confidencialidade e integridade | Comprometimento de banco, storage, deploy ou serviços |
| A-09 | Código-fonte, dependências e workflow CI/CD | Interno/Restrito | Integridade e disponibilidade | Inserção de código malicioso ou comprometimento de releases |
| A-10 | Configuração de ambientes e infraestrutura | Restrito | Confidencialidade, integridade e disponibilidade | Acesso indevido, indisponibilidade ou exposição de dados |
| A-11 | Backups e cópias de recuperação | Restrito | Confidencialidade, integridade e disponibilidade | Exposição persistente ou perda de dados |
| A-12 | Identidade visual e conteúdo público do aplicativo | Interno | Integridade e disponibilidade | Phishing, falsificação de interface ou dano reputacional |

**Princípio:** IDs, nomes de arquivo, URLs ou identificadores conhecidos não devem funcionar como mecanismo de autorização.

## 6. Atores, fontes de ameaça e capacidades

| Ator/fonte | Motivação ou circunstância | Capacidades consideradas |
|---|---|---|
| Usuário comum malicioso ou negligente | Acesso além da própria necessidade, tentativa de abuso ou erro operacional | Manipular parâmetros, alterar requisições, compartilhar links, enviar arquivos e tentar acessar recursos alheios |
| Conta Usuário comprometida | Roubo de credencial, sessão ou dispositivo | Agir com os privilégios da conta comprometida |
| Conta TI comprometida | Phishing, senha reutilizada, malware ou sessão roubada | Tentar executar operações administrativas e consultar dados conforme as permissões da conta |
| Operador interno privilegiado malicioso ou negligente | Curiosidade, abuso de poder ou falha processual | Consultar conteúdo, acessar logs ou usar ferramentas administrativas |
| Atacante externo | Obter acesso, dados, capacidade computacional ou interromper o serviço | Ataques web, tentativa de credenciais, manipulação de requisições e exploração de dependências |
| Arquivo ou conteúdo malicioso | Explorar parser, navegador, armazenamento ou serviço de análise | Arquivo disfarçado, polyglot, payload malicioso, conteúdo excessivo ou malformado |
| Dependência/fornecedor comprometido | Comprometimento de pacote, pipeline ou serviço terceirizado | Inserção de código, exposição de dados ou indisponibilidade |
| Falha operacional | Configuração incorreta, indisponibilidade, erro de deploy ou backup | Exposição acidental, perda de logs/dados ou interrupção do serviço |

A análise considera ameaças internas e externas. Não pressupõe que TI seja adversário por padrão; considera que qualquer conta ou operador pode ser comprometido ou agir fora da finalidade autorizada.

## 7. Método de análise e priorização

A análise utiliza STRIDE para organizar as ameaças:

| Categoria | Pergunta de segurança | Exemplos no Polychat |
|---|---|---|
| **S — Spoofing (falsificação de identidade)** | Alguém pode se passar por outro usuário, operador ou serviço? | Token roubado, sessão sequestrada, serviço falso |
| **T — Tampering (adulteração)** | Alguém pode alterar dados, parâmetros, arquivos ou código sem autorização? | Alterar role, autor da mensagem, membership ou conteúdo de anexo |
| **R — Repudiation (repúdio)** | Uma ação relevante pode ser negada ou não comprovada? | Consulta TI sem trilha confiável, log alterável |
| **I — Information Disclosure (exposição)** | Dados podem ser lidos por quem não tem autorização? | IDOR, bucket público, logs com dados, secrets expostos |
| **D — Denial of Service (negação de serviço)** | O serviço ou recurso pode ficar indisponível por abuso ou falha? | Força bruta, upload massivo, payloads grandes, dependência indisponível |
| **E — Elevation of Privilege (elevação de privilégio)** | Um ator pode obter privilégios além dos concedidos? | Bypass server-side, RLS permissiva, uso indevido de service role |

### 7.1 Escala qualitativa

A avaliação de probabilidade e impacto ainda depende de arquitetura detalhada, exposição real, configuração e evidências. Por isso, esta versão não atribui pontuações numéricas artificiais.

| Dimensão | Baixa | Média | Alta | Crítica |
|---|---|---|---|---|
| Impacto | Efeito localizado e reversível | Impacto limitado a parte dos usuários/dados | Compromete dados corporativos, operação relevante ou várias contas | Compromete credenciais privilegiadas, ampla confidencialidade/integridade ou controle do ambiente |
| Probabilidade | Condições difíceis e controles comprovados | Requer condições específicas | Vetor plausível e exposição relevante | Vetor plausível com exposição ampla ou controle essencial ausente/não comprovado |
| Prioridade preliminar | P3 | P2 | P1 | P0 |

**Interpretação de prioridade:**

- **P0 — crítica:** precisa de tratamento prioritário e evidência antes de liberar o componente afetado.
- **P1 — alta:** precisa de plano de mitigação e responsável; bloqueia aceite do fluxo quando compromete segurança essencial.
- **P2 — média:** precisa de controle planejado, prazo e monitoramento.
- **P3 — baixa:** acompanhar e revisar conforme mudanças de escopo/arquitetura.

As prioridades são preliminares e baseadas no impacto potencial e na ausência de evidência de implementação. Tech Lead, SQA e TI (responsável operacional por segurança) devem revisar probabilidade, prioridade e classificação final.

## 8. Registro de ameaças STRIDE

Os registros abaixo descrevem cenários de ameaça, não vulnerabilidades exploradas. “Controle existente” refere-se somente ao que foi observado em código/documentação. “Controle proposto” ainda depende de implementação e validação.

### 8.1 Spoofing — falsificação de identidade

| ID | Cenário de ameaça | Ativo / impacto | Controles existentes observados | Mitigação proposta | Prioridade inicial / responsável |
|---|---|---|---|---|---|
| THR-001 | Atacante utiliza credenciais/sessão comprometidas de Usuário para agir como a vítima. | A-01, A-03; exposição e fraude. | Há apenas scaffold isolado de autorização e testes simulados; não há login/sessão integrado ao produto. | Implementar o mecanismo de identidade definido na arquitetura aprovada, executado sob controle da FORD; proteger credenciais e sessões conforme RNF-003; revogar acesso quando conta for desativada; auditar eventos aplicáveis e testar sessão inválida/expirada. Não incluir MFA, troca inicial ou expiração periódica como requisito, pois a FORD não os exige. | P1 — Desenvolvimento / TI; #103/#105/#125 |
| THR-002 | Conta TI comprometida é usada por atacante para executar operações administrativas legítimas da role. | A-01, A-02, A-03, A-06; impacto potencial elevado por privilégio. | O modelo de produto prevê poderes iguais para administradores TI; ainda não há autenticação funcional integrada. A confiança e os riscos dos poderes administrativos já foram avaliados pela FORD/projeto. | Proteger credenciais e sessões conforme requisitos alinhados; garantir contas individuais, desativação/revogação e auditoria das ações. Não criar hierarquia, administrador principal, segunda aprovação ou MFA obrigatório. | P1 — Desenvolvimento / TI; #103/#104/#105/#124 |
| THR-003 | Atacante se passa por usuário/serviço em chamadas entre navegador, aplicação e provedor por validação incompleta de origem ou token. | A-01, A-02; impersonação e acesso não autorizado. | ADR-006 descreve validação server-side para perfis; integração completa não comprovada. | Validar identidade em cada operação server-side; não aceitar identidade/role do body, query ou estado de UI; validar emissor/audiência/expiração conforme contrato do provedor; proteger comunicação com TLS. | P1 — Tech Lead e desenvolvimento; #105, #125 |

### 8.2 Tampering — adulteração

| ID | Cenário de ameaça | Ativo / impacto | Controles existentes observados | Mitigação proposta | Prioridade inicial / responsável |
|---|---|---|---|---|---|
| THR-004 | Usuário altera role, estado ou identificador de ator no payload para elevar privilégios ou se passar por outra pessoa. | A-02, A-03, A-04; elevação e fraude. | Migration de `profiles` revoga escrita direta e protege role/status; 11 testes do middleware são simulados. | Obter identidade e role de fonte confiável server-side; proteger operações privilegiadas; testar alteração por payload, API e acesso direto ao banco; auditar operações administrativas. | P0 — Tech Lead, backend e SQA; #100, #101, #105 |
| THR-005 | Usuário altera conversation_id, membership ou message_id para inserir-se em grupo ou ler/escrever em conversa alheia. | A-03, A-04; exposição, adulteração e fraude. | As migrations da #99 habilitam RLS em conversations, memberships, messages e attachments, mas não criam policies de autorização de domínio; a matriz #100 descreve as regras, ainda sem enforcement correspondente. | Validar membership em toda leitura/escrita; implementar policies RLS por tabela/operação; usar identidade autenticada como autor; negar por padrão e testar IDOR/UUID conhecido. | P0 — Tech Lead, backend, SQA; #99, #100, #101 |
| THR-006 | Payload de mensagem ou campo de metadados é alterado para executar conteúdo ativo ou modificar registros. | A-03, A-04, A-06; XSS, adulteração e exposição. | Não há fluxo de mensagem de produto identificado na fotografia técnica. | Validar esquema/tamanho no servidor; tratar conteúdo como dado não confiável; escapar na saída conforme contexto; não construir HTML executável; restringir operações de edição/exclusão até regra aprovada. | P1 — Tech Lead e frontend/backend; #125, #126 |
| THR-007 | Arquivo usa extensão/MIME permitido, mas possui conteúdo malformado, disfarçado ou malicioso. | A-05; exploração de parser, malware ou exposição. | Requisitos de validação real e política do scanner interno estão definidos; não há upload/storage/scanner implementados no produto. | Validar assinatura/estrutura e limites; manter o objeto privado; integrar scanner interno da FORD ao fluxo oficial; falha/inconclusão mantém bloqueado; TI pode liberar excepcionalmente por ação autenticada e auditada, sem alterar o resultado do scan. | P1 — Desenvolvimento / TI; #115/#116/#117/#125 |
| THR-008 | Dependência, pacote ou pipeline é adulterado para inserir código malicioso no build/deploy. | A-09, A-10, A-08; comprometimento de release e secrets. | CI executa testes, lint, typecheck e build; isso não comprova integridade de toda a cadeia de suprimentos. | Revisar dependências e lockfile; monitorar vulnerabilidades; restringir permissões de workflow; fixar actions/dependências conforme política; revisar mudanças de workflow; proteger branch e aprovações. | P1 — Tech Lead e responsáveis CI/CD; #125 e governança de repositório |

### 8.3 Repudiation — repúdio e falta de rastreabilidade

| ID | Cenário de ameaça | Ativo / impacto | Controles existentes observados | Mitigação proposta | Prioridade inicial / responsável |
|---|---|---|---|---|---|
| THR-009 | Consulta administrativa não gera registro íntegro/atribuível, impedindo reconstruir a ação. | A-03, A-06; perda de rastreabilidade. | A regra de auditoria obrigatória está definida; a trilha funcional ainda não foi implementada. | Registrar operador, ação, recurso e momento; proteger integridade e acesso dos eventos; aplicar retenção já definida na baseline; não exigir justificativa para consulta, mas registrar toda consulta. | P0 — Desenvolvimento / TI; #102/#121/#124 |
| THR-010 | Eventos/logs podem ser apagados ou alterados por operador ou processo comprometido. | A-06, A-10; ocultação de abuso e perda de evidência. | Não foi identificada trilha funcional de conteúdo/ações administrativas na main. | Projetar armazenamento com escrita restrita, proteção contra alteração e separação de funções; monitorar acesso aos logs; definir retenção e descarte; testar integridade e acesso. | P1 — TI e Tech Lead; #102, #124 |
| THR-011 | A equipe declara um controle como aplicado ou testado sem evidência de ambiente, versão ou resultado. | A-06, A-09; falsa confiança e aceite indevido. | Baseline e plano #126 distinguem evidência existente de teste executado. | Associar a verificação documental DOC-01: conferir commit/build/release, ambiente/configuração, data, executor, pré-condições, passos, resultado esperado/observado e artefato verificável. Quando faltar campo obrigatório ou artefato, registrar a afirmação como não comprovada; declaração verbal isolada não constitui evidência. | P1 — SQA, PO e Tech Lead; #125, #126, #129; DOC-01 |

### 8.4 Information Disclosure — exposição de informações

| ID | Cenário de ameaça | Ativo / impacto | Controles existentes observados | Mitigação proposta | Prioridade inicial / responsável |
|---|---|---|---|---|---|
| THR-012 | Usuário acessa conversa ou mensagem de terceiros por URL direta, API ou ID conhecido (IDOR/BOLA). | A-03, A-04; exposição de conversas corporativas. | As migrations da #99 habilitam RLS nas tabelas de domínio, mas não definem policies que validem membership por objeto; a integração de autorização server-side também não está evidenciada. | Aplicar autorização por objeto em cada operação; validar membership server-side e implementar policies RLS por tabela/operação; não confiar em UUID; respostas não devem revelar existência/conteúdo; executar testes negativos de isolamento entre usuários. | P0 — Tech Lead, backend, SQA; #99, #100, #101 |
| THR-013 | Anexo é acessado diretamente por bucket público, caminho previsível ou URL assinada compartilhada. | A-05; vazamento de documentos. | ADR-008 propõe Storage privado; não há bucket nem fluxo de Storage identificado na main. | Buckets/objetos privados; autorização antes de emitir URL; validade curta aprovada; caminhos aleatórios; impedir listagem pública; testar acesso com/sem permissão, inclusive após remoção de membership. | P1 — Tech Lead e TI; #117, #115, #116, #101 |
| THR-014 | Secret, service-role key, token ou credencial aparece em bundle cliente, log, repositório ou artefato de CI. | A-01, A-08, A-10; controle potencial de banco/storage/ambiente. | `.env.example` contém placeholders; ADRs registram a proibição de expor service-role; nenhum secret real foi inspecionado nesta análise. | Manter secrets em gerenciador apropriado; nunca usar `NEXT_PUBLIC_*` para secrets; revisar bundles, logs, histórico e workflows; rotacionar segredos expostos; restringir acesso e auditar leitura. | P0 — Tech Lead e TI; #125, #98 |
| THR-015 | Logs, alertas ou evidências armazenam conteúdo integral de mensagens, dados pessoais ou tokens além do necessário. | A-03, A-06, A-07; exposição secundária e retenção excessiva. | ADR-010 e PR #151 propõem minimização; políticas finais continuam pendentes. | Definir esquema mínimo; mascarar segredos; restringir acesso; separar logs técnicos de conteúdo; estabelecer retenção; revisar amostras de logs e alertas. | P1 — TI e Desenvolvimento; #102, #122; regras de acesso/retention já definidas na baseline |
| THR-016 | Alertas de conteúdo suspeito permitem acesso indevido à mensagem original ou expõem conteúdo em notificação. | A-03, A-07; divulgação e uso fora da finalidade. | PR #151 propõe contexto mínimo; a política de acesso e os fluxos não estão aprovados. | Separar permissão de ver alerta da permissão de consultar conversa; usar metadados mínimos; exigir autenticação/autorização no acesso; auditar consulta; proibir conteúdo integral em notificação por padrão até aprovação. | P1 — TI e Desenvolvimento; #122, #123, #121, #102 |
| THR-017 | Conteúdo enviado por usuário é renderizado sem escaping e executa script no contexto de outro usuário (XSS armazenado/refletido). | A-03, A-04, A-01; roubo de sessão, ação indevida e exposição. | Não há interface de chat implementada identificada na fotografia técnica; nenhum teste XSS de produto foi comprovado. | Usar renderização segura por padrão; evitar HTML não confiável; sanitizar somente quando houver necessidade validada; configurar CSP como defesa em profundidade; proteger cookies; testar payloads de XSS em mensagem, nome de grupo e nome de arquivo. | P1 — Frontend, Tech Lead e SQA; #125, #126 |
| THR-018 | Serviço adicional não aprovado recebe conteúdo de mensagem/anexo. | A-03, A-05, A-07; exposição a terceiro não autorizado. | Supabase e Vercel são os provedores nomeados aprovados na Q-025. Não há aprovação geral para outros fornecedores ou subprocessadores. | Utilizar somente os componentes previstos na stack aprovada e os serviços adicionais expressamente autorizados; manter o scanner interno da FORD e não encaminhar conteúdo a IA externa ou scanner SaaS não aprovado. | P1 — TI / Desenvolvimento; RN-022, #117/#122, Q-025 |

### 8.5 Denial of Service — negação de serviço

| ID | Cenário de ameaça | Ativo / impacto | Controles existentes observados | Mitigação proposta | Prioridade inicial / responsável |
|---|---|---|---|---|---|
| THR-019 | Atacante automatiza tentativas de login ou recuperação para adivinhar credenciais, bloquear contas ou consumir recursos. | A-01, A-02, A-10; indisponibilidade e comprometimento de contas. | Não há política de rate limiting/autenticação integrada evidenciada na baseline. | Definir limites por conta/IP/dispositivo e janela; proteção contra credential stuffing; respostas que não revelem existência de conta; alertas e procedimento de bloqueio/recuperação; testar limites. | P1 — TI e Tech Lead; #105, #125 |
| THR-020 | Upload repetitivo, arquivos gigantes, payloads comprimidos ou requisições caras esgotam CPU, memória, armazenamento ou quotas. | A-05, A-10; indisponibilidade e custo inesperado. | A migration #99 limita `attachments.size_bytes` a 10.485.760 bytes e um trigger impede mais de cinco anexos por mensagem. Também cria `attachment_user_quotas` e `attachment_storage_capacity`, mas não semeia valores nem implementa enforcement integrado das quotas. Os fluxos de upload/Storage/scanner não estão integrados. | Aplicar os limites de tamanho e quantidade em todo o fluxo; configurar e aplicar quotas individuais e globais com valores definidos pelo TI; controlar concorrência, tempo de processamento e consumo do scanner; monitorar uso e alertar; testar rejeição de arquivos excessivos e esgotamento de quota. | P1 — TI e backend; #117, #125 |
| THR-021 | Indisponibilidade de Auth, banco, Storage, scanner ou provedor impede operações ou causa falha permissiva. | A-01, A-03, A-05, A-10; indisponibilidade ou liberação indevida. | Middleware isolado falha fechada nos testes simulados; não comprova comportamento de toda a arquitetura integrada. | Definir timeouts, circuit breakers e retentativas controladas; falhar fechado em autorização e análise antimalware; preservar integridade; comunicar erro sem detalhe sensível; testar falha de cada dependência. | P1 — Tech Lead, backend e TI; #98, #105, #117, #125 |
| THR-022 | Ausência de limites técnicos em consultas, canais realtime ou endpoints permite consumo abusivo. | A-03, A-10; indisponibilidade e custo. | Metas funcionais/capacidade foram alinhadas; a implementação e a medição de carga ainda não começaram. | Implementar controles adequados à capacidade definida: até 25 conexões simultâneas de usuários finais além de TI; paginar consultas e testar carga/latência contra metas técnicas alinhadas. | P2 — Desenvolvimento / TI; ADR-007, RN-023 |

### 8.6 Elevation of Privilege — elevação de privilégio

| ID | Cenário de ameaça | Ativo / impacto | Controles existentes observados | Mitigação proposta | Prioridade inicial / responsável |
|---|---|---|---|---|---|
| THR-023 | Endpoint/handler esquece de exigir autenticação ou autorização, permitindo operação sem o middleware esperado. | A-02, A-03, A-04, A-05; acesso indevido. | Módulo isolado oferece middleware; integração uniforme em handlers reais não foi evidenciada. | Inventariar rotas/ações; aplicar autenticação e autorização como padrão; testes automatizados para rota sem token, role indevida e erro; revisão de PR focada em autorização. | P0 — Tech Lead e backend; #105, #125, #126 |
| THR-024 | Policies RLS ausentes, permissivas ou inconsistentes permitem que cliente leia/edite dados de outro usuário. | A-02, A-03, A-04, A-05, A-06; exposição e adulteração. | As migrations #99 habilitam RLS nas tabelas de domínio (conversations, memberships, messages, attachments, message_reads e security_alerts), mas não criam policies de domínio. As tabelas de configuração também recebem RLS e revogação de acesso de public/anon/authenticated; isso não substitui a matriz de autorização das entidades de negócio. | Implementar policies por tabela/operação conforme a matriz #100; revisar grants mínimos e funções privilegiadas; testar leitura/escrita com usuários, não membros e TI no Supabase PostgreSQL integrado em ambiente isolado, verificando acesso permitido e negado e ausência de bypass indevido. | P0 — Tech Lead, backend, TI e SQA; #99, #100, #101 |
| THR-025 | Uso indevido de service role ou função privilegiada ignora RLS e permite acesso amplo. | A-02 a A-08; comprometimento amplo. | ADR-006 proíbe expor service-role; função `is_active_ti()` existente tem escopo limitado e cuidados documentados. | Preferir operações com privilégios mínimos; manter service role somente server-side; restringir grants/owners; revisar SECURITY DEFINER, search_path e execução; auditar operações privilegiadas e testar abuso. | P0 — Tech Lead e TI; #101, #125 |
| THR-026 | XSS ou CSRF induz usuário autenticado a executar ação sem intenção, inclusive ação administrativa. | A-01, A-02, A-03, A-04; uso indevido da sessão. | Não há fluxo funcional de chat/admin integrado identificado; política de cookies/sessão ainda pendente. | Para CSRF, identificar se a autenticação usa cookies enviados automaticamente; aplicar SameSite, token anti-CSRF e validação Origin/Referer conforme arquitetura; operações mutáveis não devem usar GET; para XSS aplicar controles de saída/CSP. | P1 — Tech Lead, frontend/backend e SQA; ADR-004, #105, #125 |
| THR-027 | Permissão de role/membership implementada incorretamente concede a Usuário função reservada ao TI ou acesso a conversa alheia. | A-02, A-03, A-04; elevação indevida e exposição. | Matriz #100 define a separação `user`/`ti` e membership; enforcement ainda não foi implementado. | Testar somente dois perfis, com todos os administradores TI equivalentes; verificar operações exclusivas TI e membership por conversa. Não introduzir administrador principal, hierarquia ou segunda aprovação. | P0 — Desenvolvimento / SQA; #100/#101 |

### 8.7 Backup, restauração e integridade — ameaça transversal

| ID | Cenário de ameaça | Ativo / impacto | Controles existentes observados | Mitigação proposta | Prioridade inicial / responsável |
|---|---|---|---|---|---|
| THR-028 | Backups podem não ser produzidos, estar incompletos/corrompidos, ser expostos a acesso indevido ou não permitir restauração confiável quando necessários. | A-11, A-03, A-05, A-06; exposição de cópias, perda de histórico e indisponibilidade prolongada. | A baseline define backup diário de banco/anexos por 12 meses e objetivos RPO/RTO de 24h. A Q-025 aprovou o modelo de operação e os parâmetros; configuração efetiva, execução periódica, integridade e ensaios de restauração são acompanhados na Issue #130 e nos critérios de release. | Validar escopo e frequência das cópias, proteção de acesso, confidencialidade e integridade; monitorar falhas; verificar integridade; executar restauração controlada em ambiente autorizado e medir os resultados contra RPO/RTO de 24h. Registrar configuração, responsável, data, resultado e artefatos. Preservar retenção e parâmetros já definidos, sem alterá-los por inferência. | P1 — TI / Tech Lead / SQA; #98, #130, Q-025; SEC-18 |

## 9. Mapeamento STRIDE por componente

Esta matriz resume onde cada categoria precisa ser tratada. Ela complementa, não substitui, o registro de ameaças.

| Componente | S | T | R | I | D | E |
|---|---|---|---|---|---|---|
| Auth / sessão | Roubo e falsificação de sessão | Alteração de estado/role | Login e revogação sem prova | Exposição de tokens | Força bruta | Elevação por falha de validação |
| API / server-side | Identidade forjada | Parâmetros e payloads adulterados | Ações sem trilha | Resposta excessiva | Abuso de endpoint | Handler sem autorização |
| PostgreSQL / RLS | Identidade/role inconsistente | Alteração de registros | Auditoria adulterável | Leitura cruzada | Consultas abusivas | Policy permissiva / bypass |
| Conversas / grupos | Conta comprometida | Membership/mensagem adulterada | Envio/consulta negável | IDOR e vazamento | Flood de mensagens | Inclusão/acesso administrativo indevido |
| Storage / anexos | Usuário forjado no upload | Arquivo disfarçado | Upload/download sem rastreio | Objeto/URL exposto | Upload excessivo | Download sem autorização |
| Backup / recuperação | Acesso indevido à cópia | Alteração/corrupção da cópia | Restauração sem rastreio | Cópia exposta | Cópia ausente/inrestaurável | Acesso privilegiado indevido |
| Auditoria / alertas | Operador falso | Evento alterado | Ação não atribuível | Conteúdo excessivo | Fila abusada | Acesso indevido a eventos |
| CI/CD / secrets | Workflow/identidade comprometido | Código/dependência adulterada | Release sem autoria | Secrets expostos | Pipeline interrompido | Deploy com privilégio excessivo |

## 10. Controles transversais e requisitos mínimos de segurança

Os controles abaixo são recomendações para avaliação técnica. A aprovação final depende dos responsáveis competentes e das ADRs aplicáveis.

### 10.1 Identidade e sessão

- Validar token no servidor com o provedor de identidade; nunca confiar em token decodificado sem validação criptográfica/semântica apropriada.
- Derivar identidade, papel e estado de fontes confiáveis.
- Implementar proteção de credenciais e ciclo de sessão conforme baseline: TI provisiona/reset; sem MFA, sem troca obrigatória no primeiro acesso e sem expiração periódica; desativação revoga sessões.
- Bloquear operações quando conta estiver inativa, sessão inválida ou serviço de validação falhar.
- Proteger cookies/sessões com atributos adequados à arquitetura, sem persistir tokens em locais acessíveis a scripts quando evitável.
- Monitorar tentativas de login e eventos anômalos.

**Dependências:** ADR-004, Issues #103/#104/#105; sem dependência de decisão Q-005/Q-006.

### 10.2 Autorização server-side e RLS

- Aplicar autorização em cada operação e recurso, não apenas na navegação.
- Usar role para funções administrativas explicitamente aprovadas; usar membership para acesso às conversas.
- Aplicar políticas RLS específicas por tabela e operação.
- Não inferir autorização a partir de ID conhecido, UI escondida, origem do cliente ou nome de rota.
- Manter service-role key fora do browser, bundles, variáveis públicas e logs.
- Revisar funções SECURITY DEFINER, owner, grants, search_path e objetos qualificados.
- Manter comportamento fail closed para falha de autenticação, autorização ou membership.

**Dependências:** ADR-006 (escopo restrito), #99, #100, #101.

### 10.3 XSS, CSRF e entradas não confiáveis

- Tratar conteúdo de mensagem, nome de grupo, nome de arquivo, metadados e parâmetros como entrada não confiável.
- Escapar valores conforme o contexto de saída; evitar renderização direta de HTML fornecido pelo usuário.
- Caso exista necessidade de rich text, definir formato permitido, sanitizador mantido e testes específicos antes de habilitar.
- Avaliar Content Security Policy como defesa em profundidade, evitando tratá-la como substituta de escaping.
- Avaliar CSRF conforme o mecanismo de sessão: se cookies forem enviados automaticamente, aplicar proteção anti-CSRF e validação de origem; operações de alteração não devem usar GET.
- Definir limites de tamanho e estrutura para todos os payloads.

**Dependências:** ADR-004, #105, #125, #126.

### 10.4 Upload, armazenamento e download

- Aceitar somente PDF/JPEG, conforme requisito funcional.
- Validar conteúdo real, assinatura, estrutura e tamanho no servidor; não confiar somente em extensão ou MIME declarado.
- Manter arquivos em quarentena até que as verificações obrigatórias sejam concluídas.
- Não disponibilizar arquivos quando scanner falhar, retornar resultado inconclusivo ou não puder analisá-los, conforme política a ser aprovada.
- Manter bucket/objetos privados; autorizar cada download.
- Emitir URLs temporárias somente após autorização e com validade tecnicamente aprovada.
- Definir quotas, limites, retenção, descarte, EXIF, PDFs protegidos e operação de antimalware.

**Dependências:** ADR-008 Accepted como direção arquitetural; #115/#116/#117 para implementação e evidências. Q-004/Q-010/Q-011 estão resolvidas.

### 10.5 Secrets e cadeia de suprimentos

- Centralizar secrets em mecanismos próprios da plataforma, com escopo mínimo.
- Separar secrets por ambiente e restringir quem pode ler/alterar.
- Nunca commitar arquivos de secrets reais.
- Rotacionar credenciais quando houver suspeita de exposição.
- Revisar permissões de CI/CD, branch protection, actions e dependências.
- Manter lockfile e processo reprodutível de instalação.
- Fazer revisão de vulnerabilidades de dependências e registrar exceções com prazo.
- Não imprimir variáveis, tokens ou headers sensíveis em logs.

**Dependências:** Tech Lead/TI, pipeline CI/CD, #125 e governança de ambientes.

### 10.6 Rate limiting e proteção contra abuso

- Definir limites por operação sensível: login, recuperação, envio, criação de grupos, alertas, upload e consultas administrativas.
- Escolher dimensão e janela de limite considerando contas, IP, dispositivo e comportamento, evitando depender de uma única dimensão.
- Evitar respostas que permitam enumeração de contas.
- Definir bloqueio temporário, retentativa, escalonamento e canal de suporte sem permitir negação de serviço por atacante contra terceiros.
- Monitorar consumo de banco, Storage, scanner, conexões e execução serverless.
- Dimensionar limites com base em carga e capacidade aprovadas, não em números arbitrários.

**Dependências:** Q-006, Q-011, Q-016, TI e Tech Lead.

### 10.7 Auditoria, privacidade e finalidade

- Registrar consulta administrativa de conversa, conforme RF-016.
- Separar autorização para visualizar alerta da autorização para abrir a conversa.
- Registrar ações privilegiadas em trilha confiável e protegida contra alteração.
- Implementar eventos de auditoria e aplicar acesso/retenção definidos na baseline; justificativa não é exigida para consulta TI.
- Minimizar conteúdo em alertas e logs.
- Não implementar exportação em massa, punição automática ou bloqueio não aprovado.
- Não ativar análise de mensagens em produção antes de aprovação da finalidade, categorias e fluxo.

**Dependências:** ADR-010 Proposed para revisão técnica; #102/#121/#122/#123/#124. Q-007 a Q-010 e Q-015 estão resolvidas no nível de requisito.

## 11. Plano de mitigação priorizado

As prioridades são iniciais e precisam de revisão por Tech Lead, TI (responsável operacional por segurança na FORD) e SQA. “Dependência” indica onde a implementação ou evidência deverá ocorrer; não significa que o controle já foi entregue.

| Prioridade | Ação de mitigação | Ameaças | Responsável primário | Dependências / evidência esperada |
|---|---|---|---|---|
| P0 | Integrar autenticação e autorização a todos os handlers/rotas reais; validar sessão e conta no servidor | THR-001, 003, 023 | Tech Lead / backend | #105; revisão de código e testes em rotas reais |
| P0 | Aprovar e implementar RLS de domínio para conversas, memberships, mensagens e anexos; testar isolamento | THR-004, 005, 012, 024 | Tech Lead / backend / TI | #99, #100, #101; testes no Supabase PostgreSQL integrado, após configuração e implementação das policies |
| P0 | Manter secrets privilegiados exclusivamente server-side; revisar acesso, bundles e workflows e validar o uso de funções privilegiadas | THR-014, 025 | Tech Lead / TI | Revisão de ambiente, artefato de build, CI, grants/owners e funções privilegiadas; SEC-11 e SEC-20 |
| P0 | Implementar trilha de auditoria para consulta TI e ações privilegiadas conforme baseline | THR-009, 010, 027 | TI / backend / SQA | #102, #121, #124; teste de evento e integridade |
| P1 | Implementar autenticação, proteção de sessão, recuperação pelo TI, revogação e rate limiting | THR-001, 002, 019 | Desenvolvimento / TI | ADR-004, #103/#104/#105; requisitos de credenciais já definidos; testes |
| P1 | Implementar validação segura de conteúdo, armazenamento privado, scanner interno e controle de download | THR-007, 013, 020 | Backend / TI | #115, #116, #117; testes STO e evidências de Storage privado |
| P1 | Prevenir XSS/CSRF e testar dados não confiáveis em todos os pontos de renderização/ações | THR-006, 017, 026 | Frontend / backend / SQA | #125, #126; testes negativos e revisão de headers/cookies |
| P1 | Implementar detecção por lista TI, minimização, fila e acesso a alertas | THR-015, 016, 018 | TI / backend / SQA | #122, #123; regras e prazos já definidos; testes DET e SEC-19 |
| P1 | Proteger CI/CD e dependências; restringir permissões e revisar cadeia de suprimentos | THR-008, 014 | Tech Lead / responsáveis CI | Revisão de workflow, lockfile, permissões e processo de atualização |
| P1 | Definir tratamento de indisponibilidade de Auth, banco, Storage e scanner; testar fail closed | THR-021 | Tech Lead / TI | ADRs pertinentes; testes de falha e recuperação |
| P2 | Definir limites de uso, capacidade e proteção de endpoints/realtime | THR-022 | Tech Lead / TI | Q-016 e ADR-007; teste de carga e métricas |
| P2 | Consolidar evidências específicas de região/configuração, continuidade e backup/restauração, incluindo RPO/RTO | THR-018, 021, 028 | FORD / TI / Tech Lead / SQA | Q-025, #98/#130 e SEC-18; não reabrir requisitos já alinhados nem aceites #96/#98 |

## 12. Plano de testes e evidências

Os testes e verificações abaixo são cenários necessários ou recomendados. Não foram executados por este documento. A especificação detalhada de casos deve ser mantida no plano da Issue #126 e a execução de homologação/regressão deve ser registrada na Issue #129.

| ID | Teste ou evidência | Ameaças relacionadas | Tipo | Condição para execução |
|---|---|---|---|---|
| SEC-01 | Token ausente, inválido, expirado, conta inativa e perfil inexistente | THR-001, 003, 023 | Unitário / Integração | Auth integrado e ambiente de teste |
| SEC-02 | Tentativa de alterar role/status/actor pelo cliente | THR-004 | Integração / TI | Fluxo real de perfil e operações administrativas; este caso cobre adulteração originada no cliente, não o uso de service role/funções privilegiadas |
| SEC-03 | Usuário comum tenta acessar rota/ação exclusiva de TI | THR-002, 023, 027 | E2E / TI | Rotas reais implementadas |
| SEC-04 | IDOR: trocar IDs de conversa, mensagem e grupo | THR-005, 012 | Integração / Segurança | Schema e RLS de domínio implementados |
| SEC-05 | Testes de RLS com usuários distintos, TI e não membros | THR-005, 012, 024 | Integração / Segurança | #99/#101 concluídas no ambiente de teste |
| SEC-06 | XSS em mensagem, nome de grupo e nome de arquivo | THR-006, 017 | Segurança / E2E | Interfaces correspondentes implementadas |
| SEC-07 | CSRF em operações mutáveis conforme mecanismo de sessão | THR-026 | Segurança | Decisão de cookies/sessão na ADR-004 |
| SEC-08 | Upload de extensão permitida com conteúdo divergente/corrompido | THR-007 | Unitário / Integração | Pipeline de anexos e regras da #117 |
| SEC-09 | Scanner indisponível, inconclusivo ou com resultado malicioso de teste | THR-007, 021 | Integração | Scanner e política de falha aprovados |
| SEC-10 | Acesso direto a bucket/objeto e reutilização de URL expirada | THR-013 | Segurança | Storage implementado em ambiente isolado |
| SEC-11 | Inspeção de bundle, logs, workflow e repositório por exposição de secrets/credenciais | THR-014 | TI / CI | Ferramentas e escopo autorizados |
| SEC-12 | Teste de rate limiting em login, recuperação, envio e upload | THR-019, 020, 022 | Integração / Desempenho | Limites aprovados e ambiente de teste |
| SEC-13 | Falha de Auth, DB, Storage, scanner e logging | THR-021, 009 | Integração / Resiliência | Ambiente com falhas controladas |
| SEC-14 | Operador TI consulta conversa e evento de auditoria é criado e protegido | THR-009, 010, 027 | Integração / Segurança | #102/#121/#124 e governança aprovadas |
| SEC-15 | Operador não autorizado tenta acessar alerta/conversa original | THR-016, 027 | E2E / Segurança | Políticas de alerta e autorização aprovadas |
| SEC-16 | Revisão de dependências e permissões de CI/CD | THR-008 | Revisão técnica / CI | Lockfile e workflows disponíveis |
| SEC-17 | Teste de carga em operações críticas e realtime | THR-020, 022 | Desempenho | Metas de carga aprovadas em Q-016 |
| SEC-18 | Verificação de backup/restauração, integridade, confidencialidade e acesso às cópias | THR-028 | Continuidade / TI | Backup configurado e disponível para ensaio autorizado; ambiente isolado; medir resultado contra RPO/RTO já aprovados |
| SEC-19 | Verificação de minimização de conteúdo em logs, alertas e evidências; conferir se somente dados necessários são registrados, sem conteúdo integral de mensagens, dados pessoais desnecessários ou tokens | THR-015 | Segurança / TI / SQA | Logging e alertas implementados em ambiente autorizado; usar mensagens e dados sintéticos e inspecionar amostras sanitizadas |
| SEC-20 | Verificação de service role e funções privilegiadas: uso exclusivamente server-side, permissões/grants mínimos, escopo de execução, SECURITY DEFINER/search_path/owners quando aplicáveis e impossibilidade de invocação não autorizada ou bypass indevido de RLS | THR-025 | Segurança / Integração / TI | Backend e funções integrados, RLS ativa e ambiente isolado; executar com identidades autorizadas e não autorizadas, sem expor secrets reais |
| DOC-01 | Revisão documental das afirmações de controle implementado/testado e da completude/rastreabilidade das evidências | THR-011 | Verificação documental / SQA | PR, relatório ou evidência disponível para revisão; conferir commit/build/release, ambiente/configuração, data, executor, pré-condições, passos, resultado esperado/observado e artefato verificável. Campo ou artefato ausente implica status não comprovado |

### 12.1 Registro obrigatório por execução

Cada evidência deve identificar:

- ID do teste e ameaça relacionada;
- commit/build/release testada;
- ambiente e configuração relevante;
- data e responsável;
- pré-condições e massa de dados sintética;
- passos e resultado esperado;
- resultado observado;
- status (aprovado, reprovado, bloqueado ou não executado);
- link do relatório/log/captura sanitizada;
- defeito ou risco associado.

Não registrar tokens, cookies, senhas, secrets, conteúdo real de conversas ou dados pessoais desnecessários nas evidências.

### 12.2 Condições de segurança para teste

- Testes ofensivos devem ocorrer somente em ambiente explicitamente autorizado.
- Não executar exploração destrutiva, varredura não autorizada ou teste de carga em produção.
- Amostras antimalware devem ser controladas e apropriadas a ambiente isolado; não utilizar malware real em produção.
- Usar contas e conteúdo sintéticos.
- Preservar logs necessários à investigação sem ampliar a coleta de conteúdo.

## 13. Riscos residuais e processo de aceitação

Risco residual é o risco que permanece depois de controles implementados e evidenciados. O fato de existir um plano de mitigação não reduz automaticamente o risco.

### 13.1 Regras para aceitação

1. O risco deve estar descrito com ativo, cenário, impacto, probabilidade, controles e evidências.
2. A mitigação deve ter sido implementada ou a razão para não implementá-la deve estar registrada.
3. Deve existir responsável pelo risco e autoridade com competência para aceitá-lo em nome da organização.
4. A aceitação deve registrar justificativa, escopo, prazo de validade, condições, medidas compensatórias e gatilhos de reavaliação.
5. Risco relacionado a dados pessoais, monitoramento, consulta de mensagens, retenção ou transferência de dados exige participação das áreas institucionais competentes, incluindo Jurídico/Privacidade quando aplicável.
6. O PO pode registrar impacto de produto e recomendar priorização, mas não pode aceitar sozinho risco técnico crítico, risco jurídico ou risco institucional fora de sua alçada.
7. Risco crítico ou alto que comprometa confidencialidade, integridade ou autorização essencial não deve ser liberado para produção sem decisão formal da autoridade competente e controles compensatórios aprovados.

### 13.2 Modelo de registro de aceitação

| Campo | Informação a registrar |
|---|---|
| ID do risco | THR-xxx |
| Descrição / ativo afetado | Cenário de ameaça e ativo |
| Risco inerente | Impacto e probabilidade antes dos controles |
| Controles implementados | Evidência vinculada a commit/ambiente |
| Risco residual | Impacto e probabilidade após os controles |
| Justificativa | Por que o risco permanece e por que a solução é aceitável |
| Medidas compensatórias | Controles adicionais e monitoramento |
| Proprietário do risco | Área/pessoa que responde pelo risco |
| Autoridade aprovadora | Responsável institucional com delegação para aceitar |
| Validade | Prazo, revisão e data de expiração |
| Condições de reabertura | Incidente, alteração de arquitetura, aumento de exposição ou vencimento |
| Registro formal | Link para aprovação/documento institucional |

**Estado desta versão:** nenhum risco residual possui aceitação formal registrada. A classificação deve ser revisada depois da validação técnica e das decisões institucionais.

## 14. Decisões ainda abertas

As respostas de produto da FORD v2 foram consolidadas em `docs/08-glossario-e-questoes-em-aberto.md`. As perguntas abaixo não devem ser reabertas como pendências. Permanecem abertas somente as seguintes questões:

| ID | Tema em aberto | Impacto no threat model |
|---|---|---|
| Q-019 | Recebimento dos ativos oficiais de identidade visual | Impacto limitado à interface e risco de falsificação visual |

Q-018 e Q-025 estão concluídas; Q-001 a Q-017 e Q-020 a Q-024 foram respondidas/alinhadas. A implementação dos controles continua pendente nos seus respectivos escopos, mas isso não transforma os requisitos em perguntas abertas.

### 14.1 Limites que não devem ser decididos por inferência

- Não declarar criptografia ponta a ponta (E2EE) enquanto o modelo técnico e a consulta/análise server-side não forem compatibilizados e aprovados.
- Não ativar monitoramento antes de implementar e testar as regras definidas, a fila TI, a auditoria e o aviso de primeiro acesso; não exigir nova decisão de produto para finalidade/categorias já estabelecidas.
- Não implementar bloqueio ou punição automática por mensagem suspeita sem requisito e aprovação expressos.
- Não reduzir nem ampliar por inferência os poderes definidos: TI pode consultar/exportar conversas e editar/excluir mensagens, com auditoria; todos os administradores TI possuem poderes iguais.
- Não inventar controles adicionais, como MFA obrigatório, hierarquia de TI ou segunda aprovação. Aplicar os limites já definidos: anexos 10 MB/5 por mensagem, retenção e backups 12 meses, disponibilidade 99%, RPO/RTO 24h.
- Não considerar a presença de middleware ou migration como prova de autorização de domínio.
- Não usar o navegador ou a interface como único enforcement de segurança.
- Não permitir que um alerta conceda automaticamente acesso ao conteúdo original.
- Não aprovar exceção de scanner, RLS ou auditoria por conveniência de implementação.

## 15. Responsabilidades

| Papel | Responsabilidade |
|---|---|
| PO | Manter rastreabilidade com produto, priorizar riscos de negócio, esclarecer escopo, coordenar decisões e registrar aceite funcional dentro de sua alçada. Não aceitar sozinho risco técnico/jurídico/institucional. |
| Tech Lead | Validar arquitetura, fronteiras de confiança, vetores técnicos, mitigação, estratégia de secrets, CI/CD e revisão de código. |
| TI (responsável por segurança na FORD) | Responder pela operação dos controles de segurança, ambientes, acesso, chaves, auditoria e recuperação; coordenar evidências com Tech Lead e SQA. |
| TI / Operação | Definir operação de contas privilegiadas, infraestrutura, ambientes, secrets, recuperação e resposta a incidentes. |
| Desenvolvimento | Implementar controles, corrigir defeitos, manter testes e produzir evidências reprodutíveis. |
| SQA | Revisar rastreabilidade, casos, resultados, regressão e independência das evidências. |
| FORD (responsabilidade institucional) | Tratar solicitações legais dirigidas à FORD e assegurar o cumprimento das obrigações aplicáveis; Jurídico não foi definido como frente de trabalho do projeto. |
| Representante autorizado da FORD | Aprovar decisões institucionais e aceitar riscos residuais quando possuir delegação formal para isso. |

## 16. Critérios de aceite da Issue #125

Os critérios originais da Issue #125 são preservados. A tabela abaixo detalha a evidência esperada e não declara conclusão.

| Critério original | Evidência necessária | Estado nesta versão |
|---|---|---|
| Threat model e mitigação priorizada; riscos residuais aceitos formalmente | Modelo revisado por Tech Lead, TI (segurança operacional) e SQA; plano com responsáveis; riscos residuais formalmente aceitos pela autoridade competente | **Parcial:** modelo preliminar produzido; revisão, plano validado e aceitação formal pendentes |
| Testes relevantes automatizados ou evidência documentada | Testes SEC-01..SEC-20 e verificação DOC-01 aplicáveis, executados ou com evidência justificada e vinculados a commit e ambiente | **Pendente:** casos e verificações especificados; esta versão não os executa |
| Revisão por PR concluída | PR revisada/aprovada por Tech Lead e SQA, com participação da TI como responsável operacional por segurança e checks concluídos | **Pendente** |
| Sem regressão nos fluxos relacionados | CI e testes de regressão dos fluxos efetivamente implementados | **Pendente:** dependerá da implementação e da Issue #129 |

### 16.1 Condições para considerar o threat model revisado

- [ ] Tech Lead revisou arquitetura, fronteiras de confiança, ameaças, severidade e mitigação.
- [ ] TI, como responsável operacional por segurança na FORD, e Tech Lead revisaram STRIDE, riscos e controles propostos.
- [ ] TI confirmou o contexto operacional, ambientes, secrets, acesso e recuperação.
- [ ] A matriz #100 e o modelo #99 foram revisados e alinhados com os riscos de domínio.
- [x] As decisões Q-002, Q-005, Q-006, Q-009, Q-010, Q-013, Q-014 e Q-015 foram respondidas/alinhadas e estão registradas na baseline v0.5.
- [ ] As políticas #117 e #122 foram reconciliadas com a FORD v2 e revisadas por TI/Tech Lead/SQA conforme necessário.
- [ ] Cada risco P0/P1 tem tratamento, responsável, dependência e evidência esperada.
- [ ] Riscos residuais estão formalmente aceitos, transferidos ou mantidos como impeditivos; nenhum permanece implícito.
- [ ] Testes SEC-01 a SEC-20 aplicáveis, DOC-01 e regressão foram executados e evidenciados.
- [ ] A PR recebeu revisão independente e os checks aplicáveis passaram.

## 17. Plano de evolução do documento

| Versão | Quando atualizar | Conteúdo esperado |
|---|---|---|
| **0.1 — preliminar** | Primeira publicação | Ativos, contexto, STRIDE, ameaças candidatas, prioridades iniciais, mitigações e decisões pendentes |
| **0.2 — revisada tecnicamente** | Após revisão Tech Lead, TI e SQA | Arquitetura validada, fronteiras confirmadas, probabilidade/impacto revisados e ações priorizadas |
| **0.3 — alinhada à FORD v2** | Versão histórica, publicada após revisão da baseline e das decisões respondidas | Atualizou riscos, papéis, medidas e dependências sem reabrir regras de produto |
| **0.4 — alinhada à Q-025** | Versão histórica | Registrou a interpretação temporária de que Supabase + Vercel estava Deprecated; essa classificação foi revertida pela ADR-003 em 24/11/2026 |
| **0.5 — stack e baseline reconciliadas** | 24/11/2026 | Alinha referências à ADR-003 Accepted e à stack Supabase + Vercel, atualiza Q-025 e baseline para v0.5 e mantém explícitos os limites de integração, configuração e homologação |
| **0.6 — adequação documental ao SQA** | 24/11/2026 | Associa THR-011 à DOC-01, cria THR-028 para backup/restauração, separa SEC-19 para minimização de logs/alertas e SEC-20 para service role/funções privilegiadas; não executa testes nem declara controles implementados |
| **0.7 — plano consolidado de tratamento** | 24/11/2026 | Consolida, sob autoria do PO, os riscos PRD-001 a PRD-010 em matriz de tratamento com ameaças relacionadas quando aplicável, triagem preliminar, responsáveis funcionais propostos, marcos, dependências e evidências; validação por Tech Lead, TI e SQA e execução permanecem pendentes |
| **1.0 — baseline de segurança** | Após implementação e testes dos controles prioritários | Evidências por ameaça, estado de mitigação, risco residual e aprovação dos responsáveis |

Qualquer mudança relevante de arquitetura, autenticação, RLS, Storage, monitoramento, consulta administrativa ou fornecedor deve provocar revisão do modelo.

## 18. Parecer do PO

A versão 0.7 mantém a base preliminar de ameaças alinhada à baseline POLY-REQ-001 v0.5 e à stack adotada na ADR-003, e acrescenta uma proposta consolidada de tratamento dos riscos de produto, sem substituir o plano técnico da seção 11. Ela identifica riscos técnicos que não podem ser considerados mitigados apenas porque existem requisitos, ADRs ou artefatos de scaffold. A direção tecnológica está definida; integração funcional, configuração operacional e evidências de compatibilidade com os requisitos da FORD permanecem pendentes na Q-025 e nas ADRs específicas.

O maior cuidado de produto é não confundir a capacidade administrativa prevista para TI com autorização irrestrita, nem confundir monitoramento de segurança com permissão para tratamento indiscriminado de mensagens. A consulta de conversas e exportação pelo TI, edição/exclusão administrativa, alerta e auditoria seguem as regras da FORD v2; anexos exigem validação, scanner interno e proteção antes da disponibilização.

Os principais riscos técnicos permanecem como trabalho de implementação e evidência: autorização/RLS de domínio, integração de autenticação, proteção de secrets, auditoria de ações privilegiadas e pipeline de anexos ainda não implementados. Isso não significa que os respectivos requisitos ou decisões estejam em aberto.

**Decisão do PO:** favorável à continuidade do threat model preliminar, sem declarar implementação, homologação ou aceitação de risco residual. Na versão 0.6, os quatro apontamentos documentais do SQA foram tratados: THR-011 possui a verificação DOC-01; SEC-18 foi vinculado à nova ameaça THR-028; THR-015 possui verificação específica SEC-19, mantendo SEC-11 restrito a secrets; e THR-025 possui verificação específica SEC-20, mantendo SEC-02 restrito à adulteração pelo cliente. Os casos permanecem planejados, sem execução ou comprovação de controles nesta atualização. A TI é responsável operacional por segurança no projeto; não se cria um workstream separado de Segurança/Jurídico/Privacidade. A Issue #125 deve permanecer aberta até revisão técnica/institucional, mitigação priorizada, testes e evidências, revisão por PR e formalização das decisões de risco.

### 18.1 Revisão de riscos sob a perspectiva do produto — parecer do PO (19/11/2026)

A estrutura STRIDE e os cenários constituem uma base para revisão técnica. Contudo, STRIDE não substitui a avaliação de risco do produto. Para o PO, além da possibilidade técnica de exploração, é necessário registrar como o evento afetaria funcionários, confiança, continuidade do trabalho, governança, adoção e compromissos assumidos pela FORD.

A tabela abaixo complementa THR-001 a THR-028. As prioridades representam triagem preliminar do produto; não são cálculo final de probabilidade, severidade técnica ou risco residual. Tech Lead e SQA revisam os aspectos técnicos; TI representa a responsabilidade operacional de segurança informada pela FORD. O modelo de poderes administrativos iguais já foi avaliado e não constitui pendência.

| ID | Risco de produto | Consequência para o produto/negócio | Prioridade preliminar do PO | Tratamento/decisão necessária | Responsáveis e rastreabilidade |
|---|---|---|---|---|---|
| PRD-001 | Comprometimento de uma conta TI permite executar operações com os poderes administrativos previstos | Acesso a conteúdo e ações administrativas por atacante que controla a conta | P1 — risco técnico de credencial/sessão; não reabre a legitimidade dos poderes TI | Proteger credenciais/sessões, manter contas individuais, revogar acesso quando desativadas e auditar ações. Não criar administrador principal, segunda aprovação ou restrição de poderes já avaliados pela FORD | TI / Desenvolvimento; #103/#104/#105/#124, THR-002/014/027 |
| PRD-002 | Regra/lista de detecção configurada incorretamente gera falsos positivos ou deixa de sinalizar termos previstos | Alertas indevidos ou ausência de sinalização; impacto na confiança e na investigação | P1 — validar configuração e testes antes de ativar em produção | TI mantém lista/regras, incluindo palavrões; usar casos positivos/negativos sintéticos, versionar configuração e permitir revisão humana. Sem análise contextual, IA externa, bloqueio automático ou punição automática | TI / Desenvolvimento / SQA; #122/#123, RN-012/RN-013 |
| PRD-003 | Falha de autorização permitir leitura, escrita ou administração de conversas alheias | Vazamento de informações, adulteração de comunicações e quebra da confiança no canal institucional | P0 — bloqueia o fluxo afetado | Exigir autorização server-side por operação e objeto, separação entre role e membership, RLS de domínio real e testes negativos com usuários, não membros e TI em ambiente integrado | Tech Lead / Backend / SQA / TI; #99/#100/#101/#105, THR-004/005/012/023/024/025 |
| PRD-004 | Anexo legítimo ficar bloqueado por erro/indisponibilidade do scanner ou arquivo malicioso ser liberado indevidamente | O primeiro caso interrompe uma atividade legítima; o segundo pode expor usuários e documentos a dano. O fail-closed protege contra liberação insegura, mas cria risco de indisponibilidade funcional | P1 — tratamento obrigatório antes da homologação do fluxo | Preservar fail-closed validado pelo PO; diferenciar estados pendente, rejeitado e erro; informar ao usuário sem atribuir culpa; definir retentativa, prazo, suporte/escalonamento e evidência de análise. Nunca liberar automaticamente por conveniência | Backend / TI / UX; #115/#116/#117, Q-011, THR-007/013/020/021 |
| PRD-005 | Falha ao executar retenção e descarte conforme política já definida | Dados podem permanecer indevidamente em cópias ou ser eliminados antes do ciclo previsto | P1 — implementação/evidência operacional pendente | Implementar retenção sem exclusão automática enquanto sistema operar; backups diários por 12 meses; exclusões autorizadas pelo TI e descarte das cópias ao fim do ciclo, com auditoria. Não reabrir decisão de produto | Desenvolvimento / TI; RN-021, #102/#130 |
| PRD-006 | Conta desativada mantém sessão/token utilizável | Pessoa inativa consegue continuar acessando operações protegidas | P0 — bloqueia o fluxo de conta se revogação não for comprovada | Implementar revogação imediata de sessões no ato de desativação e negar operações server-side; testar tokens/sessões existentes. Regras de provisionamento e recuperação já definidas | Desenvolvimento / TI; RN-003/RF-004, #103/#104/#105 |
| PRD-007 | Falha de backup/restore ou de operação impede cumprir os parâmetros já definidos | Perda de histórico ou indisponibilidade além do objetivo aprovado | P1 — implementação/ensaio e evidência ainda pendentes | Implementar backup diário de banco/anexos por 12 meses, medir restauração contra RPO 24h/RTO 24h e disponibilidade mensal de 99%; manter manutenção fora do horário comercial com aviso e suporte em horário comercial | TI / Desenvolvimento / SQA; RN-023, #98/#130, THR-028, SEC-18 |
| PRD-008 | Usuário acessa por dispositivo/perfil não autorizado ou há ampliação indevida do público | Acesso incompatível com o escopo inicial e risco de capacidade/homologação | P1 — validar restrições de perfil e dispositivo antes do lançamento único | Manter 25 usuários finais do setor técnico e aproximadamente 2–3 TI; Usuário em Android/iOS com Chrome/Safari móveis atuais; TI em computador com Chrome/Edge/Firefox atuais; tablets não permitidos. Não haverá piloto de lançamento. | PO / Desenvolvimento / TI / SQA; RN-015/RN-023/RN-024, #106/#129 |
| PRD-009 | Conteúdo é encaminhado a serviço adicional não aprovado | Exposição de mensagens/anexos a terceiros não autorizados | P1 — não integrar serviço adicional sem aprovação explícita | Supabase + Vercel permanece como stack adotada; a Q-025 deve documentar a compatibilidade operacional da configuração com os requisitos da FORD. O scanner é interno da FORD. Não encaminhar conteúdo a fornecedores adicionais, IA externa ou scanner SaaS não aprovado | TI / Desenvolvimento; RN-022, #117/#122, Q-025, ADR-003/008/010 |
| PRD-010 | Usuários não entenderem falhas, bloqueios, alertas ou canal de suporte | Repetição de tentativas, perda de trabalho, procura de canais não oficiais e baixa confiança no produto | P1 — resolver nos fluxos e no plano de operação | Definir mensagens de erro e estados compreensíveis, orientação de recuperação/reenvio, canal de suporte e comunicação de incidentes; não exibir detalhes técnicos ou dados sensíveis | PO / UX / TI / Operação / SQA; #91/#92/#117/#126/#129/#130, THR-019/020/021 |

#### Decisões de produto e critérios de liberação

1. **Privilégio e confiança:** acesso administrativo precisa ser limitado à finalidade aprovada e rastreável. Um alerta não concede, por si só, permissão para abrir a conversa original.
2. **Monitoramento justo:** sinalização não é conclusão de culpa. Falso positivo deve poder ser revisto, com decisão humana registrada e sem punição automática não aprovada.
3. **Falha segura com experiência clara:** o sistema deve proteger dados mesmo que isso mantenha temporariamente um anexo indisponível; o usuário precisa saber o estado e como proceder, sem promessa de prazo que não exista.
4. **Ciclo de vida coerente:** desativar conta, remover acesso e encerrar vínculo devem refletir-se nas sessões e operações protegidas, não apenas no status visual da interface.
5. **Continuidade verificável:** backup, rollback e recuperação só podem ser apresentados como proteção disponível após teste e evidência no ambiente relevante.
6. **Limites do MVP:** o lançamento será único, após homologação, para os 25 usuários finais, além de aproximadamente 2–3 administradores TI; não há grupo piloto de produto. A separação Usuário-mobile/TI-desktop e os dispositivos definidos pela FORD devem ser respeitados.
7. **Transparência:** o produto não deve prometer impedir screenshots, fotos externas ou outras capturas feitas fora do controle do aplicativo. A Epic #86 já ressalva essa limitação; comunicações e critérios de aceite devem permanecer coerentes.

#### Condições de aceite do PO

- [x] Riscos técnicos e principais ativos/fronteiras estão identificados em nível preliminar.
- [x] Impactos de produto e consequências para funcionários/organização foram acrescentados como camada complementar.
- [x] Decisões fora da alçada do PO foram atribuídas às áreas responsáveis, sem presumir aprovação.
- [x] O documento diferencia plano de mitigação, controle implementado, evidência de teste e aceitação de risco residual.
- [ ] Tech Lead, TI e SQA confirmam a arquitetura, completude técnica, classificação e priorização final.
- [ ] TI/Operação valida capacidade, ciclo de vida, continuidade, recuperação e resposta a incidentes.
- [ ] A implementação aplica as regras já aprovadas de consulta, monitoramento, retenção e fornecedores; obrigações legais aplicáveis permanecem sob responsabilidade da FORD.
- [ ] Tech Lead, TI e SQA validam a matriz preliminar da seção 18.2 e completam responsáveis, prazos de execução e evidências; bloqueios de go-live são refletidos no checklist de release.
- [ ] Testes SEC-01 a SEC-20 aplicáveis e a verificação DOC-01 são executados e registrados; pentest/auditoria independente, quando exigidos, são tratados como entregáveis próprios.
- [ ] Aceitações residuais são formalizadas pela autoridade competente, sem aceite presumido pelo PO.

**Parecer do PO (19/11/2026):** a análise STRIDE é adequada como base preliminar. As decisões de produto da FORD v2, inclusive confiança e poderes equivalentes dos administradores TI, são consideradas resolvidas. Isso não equivale à implementação dos controles, aprovação técnica final ou homologação. A Issue #125 permanece aberta para revisão técnica, priorização de mitigação, implementação e evidências de teste; não para reabrir requisitos já respondidos.


## 18.2 Plano consolidado de tratamento e mitigação dos riscos

Esta matriz consolida, em nível de produto, os riscos PRD-001 a PRD-010 já registrados na seção 18.1 e os conecta ao registro STRIDE da seção 8 quando existe correspondência direta. Ela complementa o plano técnico de mitigação da seção 11; não o substitui nem cria controles, requisitos ou decisões de arquitetura novos.

**Autoria e estado:** o PO organizou esta proposta documental. A consolidação não significa que Tech Lead, TI ou SQA tenham validado a classificação técnica, assumido formalmente as responsabilidades ou aprovado os prazos. As prioridades P0/P1 são triagem preliminar de impacto de produto, não níveis finais de severidade técnica, probabilidade ou risco residual. Os responsáveis abaixo são funções-alvo, não atribuições individuais confirmadas. Não são definidos prazos de calendário sem estimativa e compromisso das funções executoras.

### Marcos de execução

| Marco | Significado |
|---|---|
| **M0 — preparação** | Antes de iniciar a implementação do fluxo: validar requisito, arquitetura, critérios, dependências e desenho dos testes. |
| **M1 — implementação** | Durante a construção do fluxo: implementar o controle, instrumentar auditoria e preparar testes automatizados. |
| **M2 — pré-homologação** | Antes da homologação e do go-live único: executar testes integrados, regressão, verificações operacionais e reunir evidências reproduzíveis. |
| **M3 — operação** | Após a entrada em operação: monitorar, executar rotinas recorrentes, revisar evidências e tratar desvios/incidentes. |

### Matriz consolidada

| Risco de produto / ameaças relacionadas | Prioridade preliminar do PO e impacto | Tratamento proposto | Responsáveis funcionais propostos | Marco | Dependências e evidências esperadas | Situação |
|---|---|---|---|---|---|---|
| **PRD-001 — Comprometimento de conta TI.** THR-002, THR-014 e THR-027. | **P1.** Uma conta comprometida pode permitir ações administrativas e acesso a conteúdo conforme os poderes previstos. | Proteger credenciais e sessões; manter contas individuais; revogar acesso quando a conta for desativada; registrar e auditar ações privilegiadas. Preservar os poderes equivalentes de TI já definidos, sem criar administrador principal, hierarquia, segunda aprovação ou MFA obrigatório. | TI e Desenvolvimento; Tech Lead valida a solução técnica; SQA revisa testes e evidências. | M0, M1 e M2. | #103, #104, #105 e #124. Evidências: testes de autenticação e sessão, desativação/revogação, atribuição individual de ações e integridade dos eventos de auditoria. | Proposta PO; validação e execução pendentes. |
| **PRD-002 — Falso positivo ou falso negativo na detecção.** Não há ameaça STRIDE exclusiva para a qualidade das regras nesta versão; há interfaces com THR-015 e THR-016 quanto à minimização e ao acesso aos alertas. | **P1.** Alertas indevidos ou ausência de sinalização podem prejudicar a confiança e a investigação. | Manter a lista/regras sob responsabilidade de TI, incluindo palavrões; versionar alterações; preparar conjunto de casos sintéticos positivos e negativos; permitir revisão humana de ocorrências. Não introduzir análise contextual, IA externa, bloqueio automático ou punição automática. | TI define e mantém as regras; Desenvolvimento implementa a avaliação e a fila; SQA valida cobertura e resultados; PO verifica aderência à regra de produto. | M0, M1 e M2. | #122 e #123; RN-012 e RN-013. Evidências: versão da lista, histórico de alterações, casos positivos/negativos, resultados esperados/observados e fluxo de revisão humana. | Proposta PO; validação e execução pendentes. |
| **PRD-003 — Falha de autorização sobre conversas.** THR-004, THR-005, THR-012, THR-023, THR-024 e THR-025. | **P0.** Pode expor, adulterar ou permitir administração indevida de comunicações corporativas; bloqueia os fluxos afetados. | Exigir autorização server-side por operação e objeto; separar role de membership; aplicar RLS específica por tabela/operação; negar por padrão; validar identidade e membership sem confiar em IDs, UI ou payload do cliente; revisar uso de funções privilegiadas. | Tech Lead e Backend; SQA valida testes de isolamento; TI participa da avaliação operacional e de acesso. | M0 antes do desenho final, M1 durante implementação e M2 antes da homologação. | #99, #100, #101 e #105. Evidências: policies aplicadas no ambiente integrado, testes negativos com usuário, não membro e TI conforme matriz, testes de IDOR/BOLA e revisão de grants/funções privilegiadas. | Proposta PO; validação e execução pendentes. |
| **PRD-004 — Bloqueio indevido ou liberação insegura de anexos.** THR-007, THR-013, THR-020 e THR-021. | **P1.** A falha pode interromper atividade legítima ou expor usuários e documentos a conteúdo malicioso. | Implementar validação real de PDF/JPEG, limites e armazenamento privado; manter arquivo bloqueado/quarentenado até a conclusão do scanner interno da FORD; falha ou resultado inconclusivo não libera o arquivo; oferecer estados compreensíveis, retentativa e escalonamento; eventual liberação excepcional por TI deve ser autenticada e auditada. | Backend e TI; UX trata estados e mensagens; Tech Lead valida arquitetura; SQA verifica cenários. | M0 para o fluxo e estados, M1 para integração e M2 para testes completos. | #115, #116 e #117; Q-011. Evidências: testes de arquivo válido/inválido, scanner aprovado/reprovado/indisponível/inconclusivo, acesso privado, revogação após remoção de membership e registro de liberação excepcional. | Proposta PO; validação e execução pendentes. |
| **PRD-005 — Retenção e descarte fora da política.** Sem ameaça STRIDE exclusiva para a retenção geral nesta versão; o componente de cópias se relaciona a THR-028. | **P1.** Dados podem permanecer além do ciclo definido ou ser eliminados antes do período previsto. | Implementar a política já definida: não executar exclusão automática de dados enquanto o sistema operar; manter backups diários de banco e anexos por 12 meses; exclusões autorizadas pelo TI; descartar cópias ao final do ciclo aplicável, com rastreabilidade. Não alterar os parâmetros por inferência. | Desenvolvimento e TI; SQA verifica trilha e resultados; Tech Lead revisa solução. | M0 para especificação, M1 para implementação e M2/M3 para comprovação operacional e rotina. | #102 e #130; RN-021. Evidências: configuração de retenção, trilha de exclusões autorizadas, política aplicada às cópias e registros verificáveis do ciclo de descarte. | Proposta PO; validação e execução pendentes. |
| **PRD-006 — Sessão permanece válida após desativação da conta.** THR-001, THR-003 e THR-023. | **P0.** Uma pessoa inativa pode continuar executando operações protegidas; bloqueia o fluxo de ciclo de vida de conta. | Revogar imediatamente as sessões no ato da desativação e negar operações server-side subsequentes, inclusive quando houver token ou sessão previamente emitidos. Preservar as regras já definidas de provisionamento e recuperação pelo TI. | Desenvolvimento; TI valida procedimento operacional; Tech Lead revisa arquitetura; SQA testa cenários. | M0 para contrato de revogação, M1 para implementação e M2 para testes integrados. | RF-004, RNF-003 e #103, #104 e #105. Evidências: teste com sessão ativa antes da desativação, tentativa posterior de uso, verificação de negação em cada operação protegida e registro do evento. | Proposta PO; validação e execução pendentes. |
| **PRD-007 — Backup ou restauração não atende aos objetivos.** THR-021 e THR-028; SEC-18. | **P1.** Pode haver perda de histórico ou indisponibilidade além dos objetivos aprovados. | Configurar e comprovar backups diários de banco e anexos por 12 meses; proteger acesso e integridade das cópias; monitorar falhas; executar restauração controlada e medir resultados contra RPO 24h e RTO 24h. Preservar disponibilidade mensal de 99% e demais parâmetros da baseline. | TI e Desenvolvimento; Tech Lead valida desenho e configuração; SQA acompanha ensaio e evidência. | M1 para configuração e M2 para ensaio antes da homologação; M3 para rotina recorrente. | RN-023, #98, #130 e Q-025; THR-028/SEC-18. Evidências: configuração, histórico de execução, verificação de integridade, relatório de restauração com data/ambiente/executor/duração e comparação com RPO/RTO. | Proposta PO; validação e execução pendentes. |
| **PRD-008 — Uso fora do escopo de perfil/dispositivo.** Não há ameaça STRIDE específica para compatibilidade de dispositivos; THR-022 cobre capacidade/abuso, não substituindo a validação de compatibilidade. | **P1.** Ampliação indevida do público ou uso por perfil/dispositivo não homologado pode comprometer o escopo e a experiência do MVP. | Preservar o público inicial de 25 usuários finais do setor técnico e aproximadamente 2–3 administradores TI; Usuário em Android/iOS com Chrome/Safari móveis atuais; TI em computador com Chrome/Edge/Firefox atuais; tablets não permitidos. Manter lançamento único após homologação, sem piloto de produto. | PO confirma o escopo; Desenvolvimento implementa restrições aplicáveis; TI valida contexto operacional; SQA executa compatibilidade e regressão. | M0 para escopo e matriz de compatibilidade, M1 para implementação e M2 para homologação. | RN-015, RN-023, RN-024, #106 e #129. Evidências: matriz de dispositivos/navegadores, testes por perfil e dispositivo, registro de incompatibilidades e validação de acesso conforme escopo. | Proposta PO; validação e execução pendentes. |
| **PRD-009 — Encaminhamento de conteúdo a serviço não aprovado.** THR-018. | **P1.** Mensagens e anexos podem ser expostos a terceiro sem autorização. | Manter Supabase + Vercel como stack adotada na ADR-003; validar na Q-025 a configuração real, hospedagem/localização, armazenamento, processamento, fluxo de dados, acessos, isolamento de ambientes e responsabilidades. Manter o scanner interno da FORD; não integrar serviços adicionais, IA externa ou scanner SaaS sem aprovação explícita. | TI e Desenvolvimento; Tech Lead reúne e valida evidência técnica; TI avalia aspectos operacionais; SQA verifica rastreabilidade. | M0 para desenho/fluxo de dados, M1 para configuração e integração, M2 antes da homologação. | Q-025, ADR-003, ADR-008, ADR-010, RN-022, #117 e #122. Evidências: arquitetura e fluxo de dados atualizados, configuração dos ambientes, permissões, regiões/locais aplicáveis, serviços utilizados e confirmação de que não há encaminhamento não aprovado. | Proposta PO; evidências e validação da Q-025 pendentes. |
| **PRD-010 — Falhas, bloqueios e suporte pouco compreensíveis.** THR-019, THR-020 e THR-021 como interfaces técnicas de falha/indisponibilidade; o risco de clareza e suporte é complementar. | **P1.** Usuários podem repetir tentativas, perder trabalho, buscar canais não oficiais ou perder confiança no produto. | Definir mensagens e estados compreensíveis para falha, bloqueio e alerta; orientar recuperação/reenvio quando permitido; definir canal de suporte, escalonamento e comunicação de incidentes; não expor detalhes técnicos, dados sensíveis ou prometer prazo inexistente. | PO e UX; TI/Operação define suporte e comunicação; Desenvolvimento implementa; SQA valida fluxos e mensagens. | M0 para conteúdo e operação, M1 para implementação e M2/M3 para validação e operação. | #91, #92, #117, #126, #129 e #130. Evidências: catálogo de mensagens/estados, testes de usabilidade dos cenários de falha, procedimento de suporte/escalonamento e registro de teste de comunicação. | Proposta PO; validação e execução pendentes. |

### Organização por frentes de trabalho

Para coordenar a execução sem duplicar riscos ou criar novas issues, os itens acima podem ser acompanhados em cinco frentes:

1. **Autenticação, sessão e autorização:** PRD-001, PRD-003 e PRD-006. Abrange identidade, privilégios, membership, RLS e revogação.
2. **Detecção, anexos e serviços externos:** PRD-002, PRD-004 e PRD-009. Abrange regras de detecção, scanner interno, fluxo privado de arquivos e limites de integração.
3. **Retenção e continuidade:** PRD-005 e PRD-007. Abrange ciclo de retenção/descarte, backup, restauração e objetivos de continuidade.
4. **Governança e acesso privilegiado:** PRD-001 como risco transversal, sem criar uma segunda linha para o mesmo risco. Abrange rastreabilidade das ações, revisão de evidências e limites de autoridade.
5. **Escopo de uso, experiência e suporte:** PRD-008 e PRD-010. Abrange compatibilidade, público/dispositivos permitidos, estados de erro e operação de suporte.

### Validação e encerramento do tratamento

- **PO:** mantém a priorização de impacto de produto, a rastreabilidade com a baseline e a coordenação da matriz. A autoria do plano não equivale à aprovação técnica ou à aceitação de risco residual.
- **Tech Lead:** valida arquitetura, correspondência das ameaças, viabilidade e suficiência dos controles, dependências e marcos técnicos.
- **TI:** valida a operacionalização dos controles sob sua responsabilidade, incluindo acesso, ambientes, secrets, auditoria, backup, recuperação e suporte. A validação operacional do modelo de ameaças já registrada para esta PR não deve ser confundida com a validação de evidências específicas da Q-025.
- **SQA:** valida rastreabilidade, cobertura dos casos, independência e suficiência das evidências e resultados de regressão.
- **Autoridade institucional competente:** decide sobre aceitação formal de risco residual quando aplicável. O PO não assume esse risco em nome da FORD.

Um risco só deve ser marcado como tratado após implementação no escopo aplicável, evidência verificável vinculada a versão/ambiente, revisão dos responsáveis e registro do risco residual. Quando o controle não puder ser implementado ou comprovado, o item permanece pendente ou bloqueador conforme impacto; não deve ser convertido em “concluído” por decisão documental. Prazos de calendário e compromissos individuais deverão ser definidos após a validação das funções responsáveis e a decomposição do trabalho.


---

## Histórico de versões

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/11/2026 | Primeira análise documental STRIDE, inventário de ativos, fronteiras de confiança, registro preliminar de ameaças, plano de mitigação, testes e decisões pendentes. Não representa pentest, aprovação de segurança ou aceite de risco. |
| 0.2 | 19/11/2026 | Inclui revisão de risco sob perspectiva de produto, impactos em confiança/uso/continuidade, prioridades de triagem e atualização das referências às políticas #117/#122 v0.2. Não representa aprovação técnica ou aceitação de risco residual. |
| 0.3 | 19/11/2026 | Reconciliou o modelo preliminar com as respostas da FORD v2 e atualizou papéis, riscos e dependências; não aprovou arquitetura nem controles. |
| 0.4 | 20/11/2026 | Versão histórica que tratou temporariamente a ADR-003 como Deprecated; classificação posteriormente revertida pela decisão Accepted de 24/11/2026. |
| 0.5 | 24/11/2026 | Alinha referências à ADR-003 Accepted e à stack Supabase + Vercel, atualiza Q-025 e baseline para v0.5 e mantém explícitos os limites de integração, configuração e homologação. |
| 0.6 | 24/11/2026 | Atende aos quatro apontamentos documentais do SQA com DOC-01, THR-028, SEC-19 e SEC-20; mantém os testes planejados e não declara controles implementados ou evidências executadas. |
| 0.7 | 24/11/2026 | Consolida o plano de tratamento dos riscos de produto PRD-001 a PRD-010, com prioridades preliminares, responsáveis funcionais propostos, marcos, dependências e evidências esperadas; não declara validação técnica, implementação ou execução de testes. |
| 0.8 | 24/11/2026 | Reconcilia a fotografia técnica com as migrations de schema/integridade da Issue #99 e a evidência documental de aplicação em desenvolvimento; corrige THR-005, THR-012, THR-020 e THR-024, distinguindo RLS habilitada de policies de domínio implementadas; não declara integração funcional ou homologação. |
| 0.9 | 24/11/2026 | Registra a aprovação da compatibilidade do modelo de utilização Supabase + Vercel pela TI e pela FORD na Q-025; atualiza as referências a ADR-005, ADR-008 e ADR-009, mantendo separadas a aprovação arquitetural e a implementação/teste dos controles. |