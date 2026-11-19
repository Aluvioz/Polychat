# Issue #125 — Modelo de ameaças e plano de mitigação

**Projeto:** Polychat — aplicação de comunicação interna da FORD  
**Issue:** [#125 — Executar threat modeling e hardening de segurança](https://github.com/Aluvioz/Polychat/issues/125)  
**Épica:** #86 — Segurança, monitoramento e auditoria  
**Identificador:** POLY-SEC-001  
**Versão:** 0.1 — 19/11/2026  
**Status:** preliminar; sujeito à revisão do Tech Lead, Segurança, TI, SQA e áreas institucionais competentes  
**Classificação:** documento interno de trabalho — não contém segredos nem dados reais de usuários

> **Aviso de governança:** este documento é uma primeira análise de ameaças baseada nos requisitos, ADRs, issues e estado do repositório consultados. Ele não é laudo de pentest, auditoria independente, certificação, aprovação formal de arquitetura ou declaração de que os controles propostos já estejam implementados. A classificação dos riscos é preliminar. Nenhum risco residual está aceito por este documento.

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
- revisão de configuração administrativa dos projetos Supabase ou Vercel;
- inspeção de secrets reais ou variáveis de ambiente protegidas;
- teste de segurança em produção;
- confirmação de aplicação de migrations em ambiente Supabase hospedado;
- validação jurídica ou avaliação de impacto de privacidade.

A ausência de evidência no repositório não prova que um controle inexista em todos os ambientes; significa que ele não pode ser considerado comprovado por esta análise.

## 3. Fontes e artefatos relacionados

| Fonte | Utilização e limite |
|---|---|
| [Baseline POLY-REQ-001 — Issue #88](../09-baseline-requisitos-mvp.md) | Escopo do MVP, RF/RNF, decisões e fotografia técnica observada em 17/11/2026. |
| [Requisitos funcionais](../03-requisitos-funcionais.md) | RF-001 a RF-018, incluindo autenticação, permissões, conversas, grupos, anexos, alertas e consulta pelo TI. |
| [Requisitos não funcionais](../04-requisitos-nao-funcionais.md) | RNF-001 a RNF-013; vários controles e parâmetros ainda estão pendentes. |
| [Questões em aberto](../08-glossario-e-questoes-em-aberto.md) | Q-002 a Q-015 e Q-017, especialmente governança, dados, monitoramento e infraestrutura. |
| [Índice de ADRs](../adr/README.md) | Situação de aprovação das decisões arquiteturais. |
| [ADR-004 — Autenticação e sessões](../adr/ADR-004-autenticacao-sessoes.md) | Proposta de fluxo de autenticação; permanece Proposed. |
| [ADR-006 — Autorização e RLS](../adr/ADR-006-autorizacao-rls.md) | Accepted somente para o contrato de perfis e a migration de `profiles`; não cobre recursos de chat. |
| [ADR-008 — Storage e anexos](../adr/ADR-008-storage-anexos.md) | Proposta de armazenamento privado e fluxo de validação; permanece Proposed. |
| [ADR-010 — Segurança, auditoria e monitoramento](../adr/ADR-010-seguranca-auditoria-monitoramento.md) | Trade-offs de monitoramento, consulta administrativa, auditoria e criptografia; permanece Proposed. |
| [Matriz de autorização — Issue #100](../issue-100-matriz-autorizacao.md) | Regras, operações permitidas/negadas e lacunas de autorização. Aprovação de negócio/segurança e enforcement de domínio continuam pendentes. |
| [Modelo de dados — Issue #99](https://github.com/Aluvioz/Polychat/pull/149) | Proposta preliminar para perfis, conversas, memberships, mensagens, anexos e auditoria; PR em Draft e não integrada à main na data desta versão. |
| [Política de anexos — Issue #117](https://github.com/Aluvioz/Polychat/pull/150) | Proposta preliminar de validação, storage e antimalware; PR em Draft e não integrada à main. |
| [Política de conteúdo suspeito — Issue #122](https://github.com/Aluvioz/Polychat/pull/151) | Proposta preliminar de detecção, contexto e falsos positivos; PR em Draft e não integrada à main. |
| [Issue #101](https://github.com/Aluvioz/Polychat/issues/101) | Implementação de RLS e testes de isolamento de domínio. |
| [Issue #102](https://github.com/Aluvioz/Polychat/issues/102) | Estratégia de auditoria, retenção, acesso e proteção contra alteração. |
| [Issue #105](https://github.com/Aluvioz/Polychat/issues/105) | Integração de autenticação/perfis e bloqueio de contas. |
| [Issue #117](https://github.com/Aluvioz/Polychat/issues/117) | Limites, retenção e proteção antimalware de anexos. |
| [Issue #122](https://github.com/Aluvioz/Polychat/issues/122) | Detecção de conteúdo suspeito e falsos positivos. |
| [Issue #126](https://github.com/Aluvioz/Polychat/issues/126) | Plano de testes e rastreabilidade requisito–caso. |
| [Issue #129](https://github.com/Aluvioz/Polychat/issues/129) | Homologação, acessibilidade e regressão. |

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
- análise de mensagens suspeitas e alerta ao TI, com regras ainda pendentes;
- consulta de conversas pelo TI para segurança, com registro obrigatório de auditoria;
- perfil Usuário em smartphone e perfil TI em computador.

O tamanho da população inicial não reduz a criticidade dos ativos. Mensagens, credenciais, anexos e privilégios administrativos continuam exigindo controles adequados.

### 4.2 Estado observado na `main`

A baseline #88 registra a fotografia técnica do repositório em 17/11/2026:

- Next.js 16, React 19, TypeScript e App Router estão presentes.
- Existe o módulo isolado `src/auth/authorization.mjs`, que valida token por `supabase.auth.getUser(token)`, carrega perfil e estado e aceita os papéis `user` e `ti`.
- O módulo de autorização é Express-compatible e não foi identificado como integrado a handlers/rotas reais do App Router.
- O repositório não demonstrava configuração funcional completa do cliente Supabase nem SDK Supabase nas dependências consultadas.
- Existe a migration `supabase/migrations/202611160001_profiles_roles_and_account_status.sql`, que cria `public.profiles`, habilita RLS, permite leitura do próprio perfil ou por TI ativo, revoga escrita direta de clientes e protege alterações de papel/status.
- A migration versionada não comprova que foi aplicada em projeto Supabase hospedado.
- Não foram identificadas migrations/policies de domínio para conversas, memberships, mensagens, anexos ou auditoria.
- A baseline registra 11 testes unitários de autorização com Supabase simulado, mas eles não comprovam RLS real, isolamento de domínio ou integração hospedada.
- O workflow CI executa testes, ESLint, verificação TypeScript e build.

**Conclusão da fotografia:** há uma fundação parcial de autorização para perfis, mas não há evidência documental suficiente para declarar o fluxo completo de autenticação, chat, RLS de domínio, Storage, auditoria e monitoramento implementado e homologado.

### 4.3 Visão de contexto e fronteiras de confiança

O fluxo abaixo representa a arquitetura de referência a avaliar. Elementos identificados como pendentes ou propostos não devem ser interpretados como integrações já implementadas.

~~~mermaid
flowchart LR
    U["Usuário / TI"] -->|HTTPS| B["Navegador / dispositivo"]
    B -->|HTTPS| V["Next.js / camada server-side na Vercel"]
    V -->|Validação de identidade| A["Supabase Auth"]
    V -->|Consultas autorizadas| P["PostgreSQL / RLS"]
    V -->|Upload e download autorizados| S["Storage privado proposto"]
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
3. aplicação → Supabase Auth;
4. aplicação → PostgreSQL e políticas RLS;
5. aplicação → Storage;
6. serviços de análise/antimalware → aplicação, caso terceiros venham a ser contratados;
7. pipeline de CI/CD → artefato implantado;
8. administradores e operadores privilegiados → dados, logs, secrets e ambientes.

Cada fronteira precisa de autenticação apropriada, autorização, validação de entrada, tratamento de falha, logging seguro e testes. A camada visual não é uma fronteira de segurança suficiente.

## 5. Ativos, classificação e objetivos de proteção

A classificação abaixo é preliminar e deve ser validada por Segurança, TI e Jurídico/Privacidade conforme as políticas institucionais da FORD.

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

As prioridades deste documento são preliminares e baseadas no impacto potencial e na falta de evidência de controle integral. Tech Lead e Segurança devem validar probabilidade, prioridade e classificação final.

## 8. Registro de ameaças STRIDE

Os registros abaixo descrevem cenários de ameaça, não vulnerabilidades exploradas. “Controle existente” refere-se somente ao que foi observado em código/documentação. “Controle proposto” ainda depende de implementação e validação.

### 8.1 Spoofing — falsificação de identidade

| ID | Cenário de ameaça | Ativo / impacto | Controles existentes observados | Mitigação proposta | Prioridade inicial / responsável |
|---|---|---|---|---|---|
| THR-001 | Atacante utiliza credenciais ou sessão roubada de Usuário para ler/enviar conteúdo como a vítima. | A-01, A-03; exposição e fraude. | Middleware isolado valida token via provedor e bloqueia token ausente/inválido nos testes simulados. Não há fluxo completo de sessão integrado à aplicação evidenciado. | Integrar Auth ao runtime; definir política de senha, MFA, expiração, refresh, logout, revogação e recuperação; proteger cookies/sessões; registrar eventos relevantes; monitorar tentativas anômalas. | P1 — TI, Segurança e Tech Lead; Q-005/Q-006, #105, #125 |
| THR-002 | Conta TI comprometida é usada para executar operações privilegiadas ou consultar conversas. | A-01, A-02, A-03, A-06; exposição ampla e abuso administrativo. | Perfil TI existe no contrato de autorização; não há evidência de MFA ou fluxo privilegiado integrado/homologado. | Exigir autenticação reforçada conforme política; limitar operadores; revisar contas privilegiadas; controlar sessões; criar alertas e auditoria para operações críticas; estabelecer resposta à conta TI comprometida. | P0 — TI, Segurança e FORD; Q-002/Q-009, #102, #105 |
| THR-003 | Atacante se passa por usuário/serviço em chamadas entre navegador, aplicação e provedor por validação incompleta de origem ou token. | A-01, A-02; impersonação e acesso não autorizado. | ADR-006 descreve validação server-side para perfis; integração completa não comprovada. | Validar identidade em cada operação server-side; não aceitar identidade/role do body, query ou estado de UI; validar emissor/audiência/expiração conforme contrato do provedor; proteger comunicação com TLS. | P1 — Tech Lead e desenvolvimento; #105, #125 |

### 8.2 Tampering — adulteração

| ID | Cenário de ameaça | Ativo / impacto | Controles existentes observados | Mitigação proposta | Prioridade inicial / responsável |
|---|---|---|---|---|---|
| THR-004 | Usuário altera role, estado ou identificador de ator no payload para elevar privilégios ou se passar por outra pessoa. | A-02, A-03, A-04; elevação e fraude. | Migration de `profiles` revoga escrita direta e protege role/status; 11 testes do middleware são simulados. | Obter identidade e role de fonte confiável server-side; proteger operações privilegiadas; testar alteração por payload, API e acesso direto ao banco; auditar operações administrativas. | P0 — Tech Lead, backend e SQA; #100, #101, #105 |
| THR-005 | Usuário altera conversation_id, membership ou message_id para inserir-se em grupo ou ler/escrever em conversa alheia. | A-03, A-04; exposição, adulteração e fraude. | Matriz #100 descreve regras; não há RLS de domínio identificada na main. | Validar membership em toda leitura/escrita; aplicar RLS por tabela/operação; usar identidade autenticada como autor; negar por padrão e testar IDOR/UUID conhecido. | P0 — Tech Lead, backend, SQA; #99, #100, #101 |
| THR-006 | Payload de mensagem ou campo de metadados é alterado para executar conteúdo ativo ou modificar registros. | A-03, A-04, A-06; XSS, adulteração e exposição. | Não há fluxo de mensagem de produto identificado na fotografia técnica. | Validar esquema/tamanho no servidor; tratar conteúdo como dado não confiável; escapar na saída conforme contexto; não construir HTML executável; restringir operações de edição/exclusão até regra aprovada. | P1 — Tech Lead e frontend/backend; #125, #126 |
| THR-007 | Arquivo recebe extensão/MIME permitido, mas o conteúdo real é diferente, malformado ou poliglota. | A-05; exploração de parser, malware ou exposição. | RF-011/RF-012 exigem PDF/JPEG e validação do conteúdo real; ADR-008 e PR #150 são propostas. | Validar assinatura e estrutura; limitar tamanho; quarentena; scanner; processar em ambiente isolado; verificar objeto analisado antes da liberação; manter fail closed para análise inconclusiva conforme política aprovada. | P1 — Segurança, backend e TI; #117, #125, Q-011 |
| THR-008 | Dependência, pacote ou pipeline é adulterado para inserir código malicioso no build/deploy. | A-09, A-10, A-08; comprometimento de release e secrets. | CI executa testes, lint, typecheck e build; isso não comprova integridade de toda a cadeia de suprimentos. | Revisar dependências e lockfile; monitorar vulnerabilidades; restringir permissões de workflow; fixar actions/dependências conforme política; revisar mudanças de workflow; proteger branch e aprovações. | P1 — Tech Lead e responsáveis CI/CD; #125 e governança de repositório |

### 8.3 Repudiation — repúdio e falta de rastreabilidade

| ID | Cenário de ameaça | Ativo / impacto | Controles existentes observados | Mitigação proposta | Prioridade inicial / responsável |
|---|---|---|---|---|---|
| THR-009 | Operador TI consulta conversa e nega a ação porque não há registro íntegro, completo e atribuível. | A-03, A-06; impossibilidade de investigação e responsabilização. | RF-016 confirma que consulta TI deve gerar auditoria; a baseline não registra implementação funcional da trilha. | Registrar operador, instante e conversa consultada em contexto confiável; definir campos, finalidade, justificativa se aprovada, integridade, acesso, retenção e monitoramento; testar falha de auditoria. | P0 — TI, Segurança, Jurídico/Privacidade e backend; #102, #121, #124, Q-009/Q-010 |
| THR-010 | Eventos/logs podem ser apagados ou alterados por operador ou processo comprometido. | A-06, A-10; ocultação de abuso e perda de evidência. | Não foi identificada trilha funcional de conteúdo/ações administrativas na main. | Projetar armazenamento com escrita restrita, proteção contra alteração e separação de funções; monitorar acesso aos logs; definir retenção e descarte; testar integridade e acesso. | P1 — Segurança, TI e Tech Lead; #102, #124 |
| THR-011 | A equipe declara um controle como aplicado ou testado sem evidência de ambiente, versão ou resultado. | A-06, A-09; falsa confiança e aceite indevido. | Baseline e plano #126 distinguem evidência existente de teste executado. | Cada evidência deve apontar para commit, ambiente, data, executor, pré-condições, resultado e artefato; SQA deve revisar; não aceitar afirmação verbal como evidência única. | P1 — SQA, PO e Tech Lead; #125, #126, #129 |

### 8.4 Information Disclosure — exposição de informações

| ID | Cenário de ameaça | Ativo / impacto | Controles existentes observados | Mitigação proposta | Prioridade inicial / responsável |
|---|---|---|---|---|---|
| THR-012 | Usuário acessa conversa ou mensagem de terceiros por URL direta, API ou ID conhecido (IDOR/BOLA). | A-03, A-04; exposição de conversas corporativas. | RF-008 e matriz #100 reconhecem a restrição; não há RLS de domínio comprovada. | Aplicar autorização por objeto em cada operação; validar membership server-side e RLS; não confiar em UUID; respostas não devem revelar existência/conteúdo; testes negativos de isolamento entre usuários. | P0 — Tech Lead, backend, SQA; #99, #100, #101 |
| THR-013 | Anexo é acessado diretamente por bucket público, caminho previsível ou URL assinada compartilhada. | A-05; vazamento de documentos. | ADR-008 propõe Storage privado; não há bucket nem fluxo de Storage identificado na main. | Buckets/objetos privados; autorização antes de emitir URL; validade curta aprovada; caminhos aleatórios; impedir listagem pública; testar acesso com/sem permissão, inclusive após remoção de membership. | P1 — Tech Lead, Segurança e TI; #117, #115, #116, #101 |
| THR-014 | Secret, service-role key, token ou credencial aparece em bundle cliente, log, repositório ou artefato de CI. | A-01, A-08, A-10; controle potencial de banco/storage/ambiente. | `.env.example` contém placeholders; ADRs registram a proibição de expor service-role; nenhum secret real foi inspecionado nesta análise. | Manter secrets em gerenciador apropriado; nunca usar `NEXT_PUBLIC_*` para secrets; revisar bundles, logs, histórico e workflows; rotacionar segredos expostos; restringir acesso e auditar leitura. | P0 — Tech Lead, TI e Segurança; #125, #98 |
| THR-015 | Logs, alertas ou evidências armazenam conteúdo integral de mensagens, dados pessoais ou tokens além do necessário. | A-03, A-06, A-07; exposição secundária e retenção excessiva. | ADR-010 e PR #151 propõem minimização; políticas finais continuam pendentes. | Definir esquema mínimo; mascarar segredos; restringir acesso; separar logs técnicos de conteúdo; estabelecer retenção; revisar amostras de logs e alertas. | P1 — Segurança, TI, Jurídico/Privacidade; #102, #122, Q-009/Q-010 |
| THR-016 | Alertas de conteúdo suspeito permitem acesso indevido à mensagem original ou expõem conteúdo em notificação. | A-03, A-07; divulgação e uso fora da finalidade. | PR #151 propõe contexto mínimo; a política de acesso e os fluxos não estão aprovados. | Separar permissão de ver alerta da permissão de consultar conversa; usar metadados mínimos; exigir autenticação/autorização no acesso; auditar consulta; proibir conteúdo integral em notificação por padrão até aprovação. | P1 — Segurança, TI e Jurídico/Privacidade; #122, #123, #121, #102 |
| THR-017 | Conteúdo enviado por usuário é renderizado sem escaping e executa script no contexto de outro usuário (XSS armazenado/refletido). | A-03, A-04, A-01; roubo de sessão, ação indevida e exposição. | Não há interface de chat implementada identificada na fotografia técnica; nenhum teste XSS de produto foi comprovado. | Usar renderização segura por padrão; evitar HTML não confiável; sanitizar somente quando houver necessidade validada; configurar CSP como defesa em profundidade; proteger cookies; testar payloads de XSS em mensagem, nome de grupo e nome de arquivo. | P1 — Frontend, Tech Lead e SQA; #125, #126 |
| THR-018 | Serviço externo de análise recebe conteúdo de mensagem/anexo sem avaliação de finalidade, região, suboperador ou transferência. | A-03, A-05, A-07; exposição a terceiros e risco contratual/regulatório. | ADR-010 e documentos #117/#122 deixam fornecedor e envio externo pendentes. | Não enviar dados a serviço/modelo externo antes de avaliação de Segurança, TI, Jurídico/Privacidade e contrato; minimizar/pseudonimizar quando aplicável; registrar região, suboperadores, finalidade e retenção. | P1 — FORD, Segurança, TI e Jurídico/Privacidade; Q-013/Q-014/Q-015, #117, #122 |

### 8.5 Denial of Service — negação de serviço

| ID | Cenário de ameaça | Ativo / impacto | Controles existentes observados | Mitigação proposta | Prioridade inicial / responsável |
|---|---|---|---|---|---|
| THR-019 | Atacante automatiza tentativas de login ou recuperação para adivinhar credenciais, bloquear contas ou consumir recursos. | A-01, A-02, A-10; indisponibilidade e comprometimento de contas. | Não há política de rate limiting/autenticação integrada evidenciada na baseline. | Definir limites por conta/IP/dispositivo e janela; proteção contra credential stuffing; respostas que não revelem existência de conta; alertas e procedimento de bloqueio/recuperação; testar limites. | P1 — TI, Segurança e Tech Lead; Q-006, #105, #125 |
| THR-020 | Upload repetitivo, arquivos gigantes, payloads comprimidos ou requisições caras esgotam CPU, memória, armazenamento ou quotas. | A-05, A-10; indisponibilidade e custo inesperado. | Limites e quotas não foram definidos; PR #150 registra parâmetros pendentes. | Definir limites máximos e quotas; validar antes de armazenamento; limitar concorrência e tempo de processamento; isolar scanner; monitorar consumo e alertar; definir política de rejeição/retentativa. | P1 — TI, Segurança, backend; #117, #125, Q-011 |
| THR-021 | Indisponibilidade de Auth, banco, Storage, scanner ou provedor impede operações ou causa falha permissiva. | A-01, A-03, A-05, A-10; indisponibilidade ou liberação indevida. | Middleware isolado falha fechada nos testes simulados; não comprova comportamento de toda a arquitetura integrada. | Definir timeouts, circuit breakers e retentativas controladas; falhar fechado em autorização e análise antimalware; preservar integridade; comunicar erro sem detalhe sensível; testar falha de cada dependência. | P1 — Tech Lead, backend e TI; #98, #105, #117, #125 |
| THR-022 | Ausência de limites em consultas, realtime ou endpoints permite consumo abusivo de conexões e recursos. | A-03, A-10; indisponibilidade e custo. | Não há meta de carga/concorrência definida; realtime ainda é proposta. | Definir quotas, paginação, rate limit por operação, limites de conexões/canais e observabilidade; executar testes de carga com perfil aprovado. | P2 — Tech Lead e TI; ADR-007, Q-016 |

### 8.6 Elevation of Privilege — elevação de privilégio

| ID | Cenário de ameaça | Ativo / impacto | Controles existentes observados | Mitigação proposta | Prioridade inicial / responsável |
|---|---|---|---|---|---|
| THR-023 | Endpoint/handler esquece de exigir autenticação ou autorização, permitindo operação sem o middleware esperado. | A-02, A-03, A-04, A-05; acesso indevido. | Módulo isolado oferece middleware; integração uniforme em handlers reais não foi evidenciada. | Inventariar rotas/ações; aplicar autenticação e autorização como padrão; testes automatizados para rota sem token, role indevida e erro; revisão de PR focada em autorização. | P0 — Tech Lead e backend; #105, #125, #126 |
| THR-024 | Policies RLS ausentes, permissivas ou inconsistentes permitem que cliente leia/edite dados de outro usuário. | A-02, A-03, A-04, A-05, A-06; exposição e adulteração. | RLS observada somente em `profiles`; nenhuma policy de domínio foi identificada na baseline. | Definir schema revisado; política por tabela e operação; grants mínimos; testes em PostgreSQL/Supabase real com atores diferentes; verificar ausência de bypass genérico e revisar funções privilegiadas. | P0 — Tech Lead, backend, TI e SQA; #99, #100, #101 |
| THR-025 | Uso indevido de service role ou função privilegiada ignora RLS e permite acesso amplo. | A-02 a A-08; comprometimento amplo. | ADR-006 proíbe expor service-role; função `is_active_ti()` existente tem escopo limitado e cuidados documentados. | Preferir operações com privilégios mínimos; manter service role somente server-side; restringir grants/owners; revisar SECURITY DEFINER, search_path e execução; auditar operações privilegiadas e testar abuso. | P0 — Tech Lead, Segurança e TI; #101, #125 |
| THR-026 | XSS ou CSRF induz usuário autenticado a executar ação sem intenção, inclusive ação administrativa. | A-01, A-02, A-03, A-04; uso indevido da sessão. | Não há fluxo funcional de chat/admin integrado identificado; política de cookies/sessão ainda pendente. | Para CSRF, identificar se a autenticação usa cookies enviados automaticamente; aplicar SameSite, token anti-CSRF e validação Origin/Referer conforme arquitetura; operações mutáveis não devem usar GET; para XSS aplicar controles de saída/CSP. | P1 — Tech Lead, frontend/backend e SQA; ADR-004, #105, #125 |
| THR-027 | Operador obtém permissão de consulta ou gestão de contas além da função aprovada, por role genérica ou ausência de separação de funções. | A-02, A-03, A-06, A-07; abuso de privilégio e violação de finalidade. | A matriz #100 registra operações específicas; hierarquia e governança de TI permanecem pendentes em Q-002/Q-009. | Não criar role administrativa genérica; enumerar ações; aplicar menor privilégio; restringir consulta TI segundo política aprovada; revisar acessos e auditar ações; testar separação de funções. | P1 — FORD, TI, Segurança e PO; #100, #102, Q-002/Q-009 |

## 9. Mapeamento STRIDE por componente

Esta matriz resume onde cada categoria precisa ser tratada. Ela complementa, não substitui, o registro de ameaças.

| Componente | S | T | R | I | D | E |
|---|---|---|---|---|---|---|
| Auth / sessão | Roubo e falsificação de sessão | Alteração de estado/role | Login e revogação sem prova | Exposição de tokens | Força bruta | Elevação por falha de validação |
| API / server-side | Identidade forjada | Parâmetros e payloads adulterados | Ações sem trilha | Resposta excessiva | Abuso de endpoint | Handler sem autorização |
| PostgreSQL / RLS | Identidade/role inconsistente | Alteração de registros | Auditoria adulterável | Leitura cruzada | Consultas abusivas | Policy permissiva / bypass |
| Conversas / grupos | Conta comprometida | Membership/mensagem adulterada | Envio/consulta negável | IDOR e vazamento | Flood de mensagens | Inclusão/acesso administrativo indevido |
| Storage / anexos | Usuário forjado no upload | Arquivo disfarçado | Upload/download sem rastreio | Objeto/URL exposto | Upload excessivo | Download sem autorização |
| Auditoria / alertas | Operador falso | Evento alterado | Ação não atribuível | Conteúdo excessivo | Fila abusada | Acesso indevido a eventos |
| CI/CD / secrets | Workflow/identidade comprometido | Código/dependência adulterada | Release sem autoria | Secrets expostos | Pipeline interrompido | Deploy com privilégio excessivo |

## 10. Controles transversais e requisitos mínimos de segurança

Os controles abaixo são recomendações para avaliação técnica. A aprovação final depende dos responsáveis competentes e das ADRs aplicáveis.

### 10.1 Identidade e sessão

- Validar token no servidor com o provedor de identidade; nunca confiar em token decodificado sem validação criptográfica/semântica apropriada.
- Derivar identidade, papel e estado de fontes confiáveis.
- Definir senha, MFA, primeiro acesso, recuperação, expiração, refresh, logout e revogação.
- Bloquear operações quando conta estiver inativa, sessão inválida ou serviço de validação falhar.
- Proteger cookies/sessões com atributos adequados à arquitetura, sem persistir tokens em locais acessíveis a scripts quando evitável.
- Monitorar tentativas de login e eventos anômalos.

**Dependências:** ADR-004, Q-005/Q-006, Issue #105.

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

**Dependências:** ADR-008 Proposed, #115, #116, #117, Q-004, Q-010, Q-011.

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
- Definir campos, acesso, retenção, descarte, justificativa e transparência com as áreas competentes.
- Minimizar conteúdo em alertas e logs.
- Não implementar exportação em massa, punição automática ou bloqueio não aprovado.
- Não ativar análise de mensagens em produção antes de aprovação da finalidade, categorias e fluxo.

**Dependências:** ADR-010 Proposed, #102, #121, #122, #123, #124, Q-007 a Q-010, Q-015.

## 11. Plano de mitigação priorizado

As prioridades são iniciais e precisam de revisão por Tech Lead e Segurança. “Dependência” indica onde a implementação, decisão ou evidência deverá ocorrer; não significa que o controle já foi entregue.

| Prioridade | Ação de mitigação | Ameaças | Responsável primário | Dependências / evidência esperada |
|---|---|---|---|---|
| P0 | Integrar autenticação e autorização a todos os handlers/rotas reais; validar sessão e conta no servidor | THR-001, 003, 023 | Tech Lead / backend | #105; revisão de código e testes em rotas reais |
| P0 | Aprovar e implementar RLS de domínio para conversas, memberships, mensagens e anexos; testar isolamento | THR-004, 005, 012, 024 | Tech Lead / backend / TI | #99, #100, #101; testes PostgreSQL/Supabase real |
| P0 | Manter secrets privilegiados exclusivamente server-side; revisar acesso, bundles e workflows | THR-014, 025 | Tech Lead / TI / Segurança | Revisão de ambiente, artefato de build, CI e procedimento de rotação |
| P0 | Definir governança e implementar auditoria obrigatória para consulta TI | THR-009, 010, 027 | TI / Segurança / backend | #102, #121, #124, Q-009/Q-010; teste de evento e integridade |
| P1 | Definir política de senha, MFA, sessões, recuperação, revogação e rate limiting | THR-001, 002, 019 | TI / Segurança | ADR-004, #105, Q-005/Q-006; política aprovada e testes |
| P1 | Implementar validação segura de conteúdo, quarentena, scanner e controle de download | THR-007, 013, 020 | Backend / Segurança / TI | #117, #115, #116, Q-011; testes STO e evidências de Storage privado |
| P1 | Prevenir XSS/CSRF e testar dados não confiáveis em todos os pontos de renderização/ações | THR-006, 017, 026 | Frontend / backend / SQA | #125, #126; testes negativos e revisão de headers/cookies |
| P1 | Definir e implementar controles de conteúdo suspeito, minimização e acesso a alertas | THR-015, 016, 018 | Segurança / TI / backend | #122, #123, Q-007/Q-008; aprovação institucional e testes DET |
| P1 | Proteger CI/CD e dependências; restringir permissões e revisar cadeia de suprimentos | THR-008, 014 | Tech Lead / responsáveis CI | Revisão de workflow, lockfile, permissões e processo de atualização |
| P1 | Definir tratamento de indisponibilidade de Auth, banco, Storage e scanner; testar fail closed | THR-021 | Tech Lead / TI | ADRs pertinentes; testes de falha e recuperação |
| P2 | Definir limites de uso, capacidade e proteção de endpoints/realtime | THR-022 | Tech Lead / TI | Q-016 e ADR-007; teste de carga e métricas |
| P2 | Aprovar região, suboperadores, responsabilidades, backups, RPO/RTO e processo de resposta | THR-018, 021 | FORD / TI / Segurança / Jurídico | Q-014/Q-015/Q-017, #98 e plano operacional |

## 12. Plano de testes e evidências

Os testes abaixo são cenários necessários ou recomendados. Não foram executados por este documento. A especificação detalhada de casos deve ser mantida no plano da Issue #126 e a execução de homologação/regressão deve ser registrada na Issue #129.

| ID | Teste ou evidência | Ameaças relacionadas | Tipo | Condição para execução |
|---|---|---|---|---|
| SEC-01 | Token ausente, inválido, expirado, conta inativa e perfil inexistente | THR-001, 003, 023 | Unitário / Integração | Auth integrado e ambiente de teste |
| SEC-02 | Tentativa de alterar role/status/actor pelo cliente | THR-004, 025 | Integração / Segurança | Fluxo real de perfil e operações administrativas |
| SEC-03 | Usuário comum tenta acessar rota/ação exclusiva de TI | THR-002, 023, 027 | E2E / Segurança | Rotas reais implementadas |
| SEC-04 | IDOR: trocar IDs de conversa, mensagem e grupo | THR-005, 012 | Integração / Segurança | Schema e RLS de domínio implementados |
| SEC-05 | Testes de RLS com usuários distintos, TI e não membros | THR-005, 012, 024 | Integração / Segurança | #99/#101 concluídas no ambiente de teste |
| SEC-06 | XSS em mensagem, nome de grupo e nome de arquivo | THR-006, 017 | Segurança / E2E | Interfaces correspondentes implementadas |
| SEC-07 | CSRF em operações mutáveis conforme mecanismo de sessão | THR-026 | Segurança | Decisão de cookies/sessão na ADR-004 |
| SEC-08 | Upload de extensão permitida com conteúdo divergente/corrompido | THR-007 | Unitário / Integração | Pipeline de anexos e regras da #117 |
| SEC-09 | Scanner indisponível, inconclusivo ou com resultado malicioso de teste | THR-007, 021 | Integração | Scanner e política de falha aprovados |
| SEC-10 | Acesso direto a bucket/objeto e reutilização de URL expirada | THR-013 | Segurança | Storage implementado em ambiente isolado |
| SEC-11 | Inspeção de bundle, logs, workflow e repositório por exposição de secrets | THR-014, 015 | Segurança / CI | Ferramentas e escopo autorizados |
| SEC-12 | Teste de rate limiting em login, recuperação, envio e upload | THR-019, 020, 022 | Integração / Desempenho | Limites aprovados e ambiente de teste |
| SEC-13 | Falha de Auth, DB, Storage, scanner e logging | THR-021, 009 | Integração / Resiliência | Ambiente com falhas controladas |
| SEC-14 | Operador TI consulta conversa e evento de auditoria é criado e protegido | THR-009, 010, 027 | Integração / Segurança | #102/#121/#124 e governança aprovadas |
| SEC-15 | Operador não autorizado tenta acessar alerta/conversa original | THR-016, 027 | E2E / Segurança | Políticas de alerta e autorização aprovadas |
| SEC-16 | Revisão de dependências e permissões de CI/CD | THR-008 | Revisão técnica / CI | Lockfile e workflows disponíveis |
| SEC-17 | Teste de carga em operações críticas e realtime | THR-020, 022 | Desempenho | Metas de carga aprovadas em Q-016 |
| SEC-18 | Verificação de backup/restauração, integridade e acesso às cópias | THR-018, 021 | Continuidade / Segurança | RPO/RTO, backup e ambiente aprovados |

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

**Estado da versão 0.1:** nenhum risco residual possui aceitação formal registrada. A classificação deve ser revisada depois da validação técnica e das decisões institucionais.

## 14. Decisões de negócio e governança pendentes

O PO deve coordenar a obtenção das decisões abaixo, mas a aprovação pertence às áreas competentes.

| Questão | Decisão necessária | Responsável pela decisão | Impacto no threat model |
|---|---|---|---|
| Q-002 | Quem pode criar/alterar/desativar contas TI? Existe administrador principal? | FORD / TI / Segurança | Limite de privilégio e risco de abuso interno |
| Q-005 | Qual identificador será usado para login? | FORD / TI | Identidade, provisionamento e prevenção de enumeração |
| Q-006 | Como será a senha inicial, primeiro acesso, recuperação e expiração? | TI / Segurança | Roubo de credenciais, recuperação indevida e sessão |
| Q-007 | Quais termos/categorias serão monitorados? | FORD / Segurança / Jurídico/Privacidade | Monitoramento, falso positivo e finalidade |
| Q-008 | Qual fluxo de alerta, severidade, prazo e resposta? | FORD / TI / Segurança | Abuso de alerta, exposição de conteúdo e tratamento |
| Q-009 | Quem pode consultar conversas, com quais condições, justificativa e transparência? | FORD / TI / Segurança / Jurídico/Privacidade | Abuso de privilégio e privacidade |
| Q-010 | Quais prazos de retenção e descarte para mensagens, anexos, alertas, logs e backups? | FORD / TI / Jurídico/Privacidade | Exposição persistente e descarte indevido |
| Q-011 | Quais limites de anexos e tratamento de arquivos suspeitos? | FORD / TI / Segurança | Upload abusivo, malware e custo |
| Q-013 | Quais controles técnicos são obrigatórios (MFA, criptografia, chaves, logs, pentest etc.)? | Segurança / TI / Tech Lead / FORD | Baseline técnica e critérios de aceite |
| Q-014 | Quais regiões, ambientes, fornecedores, acessos e responsabilidades operacionais? | TI / Segurança / responsável contratual | Jurisdição, suboperadores, secrets e continuidade |
| Q-015 | Como tratar solicitações legais dirigidas à FORD ou fornecedores? | Jurídico / Privacidade / FORD | Acesso, preservação, notificação e resposta |
| Q-016 | Qual carga concorrente, volume e latência esperados? | FORD / TI / Tech Lead | Rate limiting, capacidade e disponibilidade |
| Q-017 | Quais metas de disponibilidade, janela de manutenção, RPO e RTO? | FORD / TI | Continuidade, backup e recuperação |

### 14.1 Limites que não devem ser decididos por inferência

- Não declarar criptografia ponta a ponta (E2EE) enquanto o modelo técnico e a consulta/análise server-side não forem compatibilizados e aprovados.
- Não ativar monitoramento de mensagens em produção sem aprovação de finalidade, transparência, categorias e processo.
- Não implementar bloqueio ou punição automática por mensagem suspeita sem requisito e aprovação expressos.
- Não ampliar os poderes do TI para exportar, editar ou excluir conversas quando o requisito confirmado é consulta com auditoria.
- Não fixar prazo de retenção, limite de upload, rate limit, MFA obrigatório ou timeout numérico sem decisão/aprovação.
- Não considerar a presença de middleware ou migration como prova de autorização de domínio.
- Não usar o navegador ou a interface como único enforcement de segurança.
- Não permitir que um alerta conceda automaticamente acesso ao conteúdo original.
- Não aprovar exceção de scanner, RLS ou auditoria por conveniência de implementação.

## 15. Responsabilidades

| Papel | Responsabilidade |
|---|---|
| PO | Manter rastreabilidade com produto, priorizar riscos de negócio, esclarecer escopo, coordenar decisões e registrar aceite funcional dentro de sua alçada. Não aceitar sozinho risco técnico/jurídico/institucional. |
| Tech Lead | Validar arquitetura, fronteiras de confiança, vetores técnicos, mitigação, estratégia de secrets, CI/CD e revisão de código. |
| Segurança | Revisar STRIDE, severidade, controles, testes ofensivos autorizados, risco residual e monitoramento. |
| TI / Operação | Definir operação de contas privilegiadas, infraestrutura, ambientes, secrets, recuperação e resposta a incidentes. |
| Desenvolvimento | Implementar controles, corrigir defeitos, manter testes e produzir evidências reprodutíveis. |
| SQA | Revisar rastreabilidade, casos, resultados, regressão e independência das evidências. |
| Jurídico / Privacidade | Avaliar finalidade, transparência, tratamento de dados, retenção, solicitações legais e obrigações aplicáveis. |
| Representante autorizado da FORD | Aprovar decisões institucionais e aceitar riscos residuais quando possuir delegação formal para isso. |

## 16. Critérios de aceite da Issue #125

Os critérios originais da Issue #125 são preservados. A tabela abaixo detalha a evidência esperada e não declara conclusão.

| Critério original | Evidência necessária | Estado nesta versão |
|---|---|---|
| Threat model e mitigação priorizada; riscos residuais aceitos formalmente | Modelo revisado por Tech Lead/Security; plano com responsáveis; riscos residuais formalmente aceitos pela autoridade competente | **Parcial:** modelo preliminar produzido; revisão, plano validado e aceitação formal pendentes |
| Testes relevantes automatizados ou evidência documentada | Testes SEC-01..SEC-18 executados ou evidência justificada, vinculados a commit e ambiente | **Pendente:** cenários especificados; esta versão não executa testes |
| Revisão por PR concluída | PR revisada/aprovada por Tech Lead e Segurança/SQA, com checks concluídos | **Pendente** |
| Sem regressão nos fluxos relacionados | CI e testes de regressão dos fluxos efetivamente implementados | **Pendente:** dependerá da implementação e da Issue #129 |

### 16.1 Condições para considerar o threat model revisado

- [ ] Tech Lead revisou arquitetura, fronteiras de confiança, ameaças, severidade e mitigação.
- [ ] Segurança revisou STRIDE, riscos P0/P1, controles propostos e plano de teste.
- [ ] TI confirmou o contexto operacional, ambientes, secrets, acesso e recuperação.
- [ ] A matriz #100 e o modelo #99 foram revisados e alinhados com os riscos de domínio.
- [ ] As decisões Q-002, Q-005, Q-006, Q-009, Q-010, Q-013, Q-014 e Q-015 foram decididas ou formalmente registradas com responsável e prazo.
- [ ] As políticas #117 e #122 foram revisadas com Segurança e áreas institucionais competentes.
- [ ] Cada risco P0/P1 tem tratamento, responsável, dependência e evidência esperada.
- [ ] Riscos residuais estão formalmente aceitos, transferidos ou mantidos como impeditivos; nenhum permanece implícito.
- [ ] Testes relevantes e regressão foram executados e evidenciados.
- [ ] A PR recebeu revisão independente e os checks aplicáveis passaram.

## 17. Plano de evolução do documento

| Versão | Quando atualizar | Conteúdo esperado |
|---|---|---|
| **0.1 — preliminar** | Primeira publicação | Ativos, contexto, STRIDE, ameaças candidatas, prioridades iniciais, mitigações e decisões pendentes |
| **0.2 — revisada tecnicamente** | Após revisão Tech Lead e Segurança | Arquitetura validada, fronteiras confirmadas, probabilidade/impacto revisados e ações priorizadas |
| **0.3 — governança** | Após decisões FORD/TI/Jurídico/Privacidade | Políticas aprovadas, proprietários de risco e registros formais de aceitação ou bloqueio |
| **1.0 — baseline de segurança** | Após implementação e testes dos controles prioritários | Evidências por ameaça, estado de mitigação, risco residual e aprovação dos responsáveis |

Qualquer mudança relevante de arquitetura, autenticação, RLS, Storage, monitoramento, consulta administrativa ou fornecedor deve provocar revisão do modelo.

## 18. Parecer do PO

A versão 0.1 é uma base adequada para iniciar a revisão integrada de ameaças do Polychat. Ela identifica riscos graves que não podem ser considerados mitigados apenas porque existem requisitos, ADRs ou código parcial.

O maior cuidado de produto é não confundir a capacidade administrativa prevista para TI com autorização irrestrita, nem confundir monitoramento de segurança com permissão para tratamento indiscriminado de mensagens. A consulta de conversas exige auditoria; a análise de conteúdo exige finalidade, transparência e regras aprovadas; anexos exigem validação e proteção antes da disponibilização.

Os riscos técnicos mais prioritários nesta fotografia são: autorização/RLS de domínio ainda não comprovada; integração de autenticação ainda incompleta; exposição potencial por secrets e funções privilegiadas; consulta administrativa sem trilha funcional comprovada; e pipeline de anexos ainda não implementado.

**Decisão do PO:** favorável à continuidade da análise com esta versão preliminar. Não aprovo arquitetura, controles de segurança, políticas de privacidade nem aceitação de riscos residuais por meio deste parecer. A Issue #125 deve permanecer aberta até revisão técnica/institucional, mitigação priorizada, testes e evidências, revisão por PR e formalização das decisões de risco.

---

## Histórico de versões

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/11/2026 | Primeira análise documental STRIDE, inventário de ativos, fronteiras de confiança, registro preliminar de ameaças, plano de mitigação, testes e decisões pendentes. Não representa pentest, aprovação de segurança ou aceite de risco. |
