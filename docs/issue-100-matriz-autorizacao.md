# Issue #100 — Matriz de autorização e políticas RLS

- **Issue:** [#100 — Definir matriz de autorização e políticas RLS](https://github.com/Aluvioz/Polychat/issues/100)
- **Epic:** [#80 — Modelo de dados, autorização e RLS](https://github.com/Aluvioz/Polychat/issues/80)
- **Baseline:** POLY-REQ-001, `docs/09-baseline-requisitos-mvp.md`
- **ADRs:** [índice](adr/README.md), especialmente [ADR-006 — Autorização server-side e RLS](adr/ADR-006-autorizacao-rls.md)
- **Estado deste documento:** matriz técnica preliminar e rastreável; **aprovação de negócio/segurança pendente**.
- **Data da auditoria:** 17/11/2026

> Este documento não altera os critérios, o objetivo ou o escopo da Issue #100. Não aprova decisões pendentes, não substitui a Issue #99 (schema), não implementa a Issue #101 (RLS de domínio) e não define retenção (Issue #102).

## 1. Como interpretar a matriz

Os estados abaixo preservam a classificação da baseline e das ADRs:

- **Permitido — confirmado:** a operação e o ator estão expressamente previstos em requisito/regra confirmada. A indicação não afirma que a operação já esteja implementada.
- **Negado — confirmado:** a baseline proíbe expressamente a operação ou a evidência implementada já a bloqueia dentro do escopo descrito.
- **Pendente:** falta decisão, parâmetro, modelo de dados ou aprovação. Não implementar a permissão por inferência.
- **Implementado:** usado exclusivamente para descrever evidência técnica observada no repositório; não equivale a homologação em Supabase hospedado.

A distinção entre **identidade**, **role** e **membership** é obrigatória:

1. **Identidade autenticada:** usuário cuja identidade foi validada pelo Supabase Auth no servidor. O identificador de identidade vem de `auth.uid()`/usuário validado, nunca do body, query ou metadados controlados pelo cliente.
2. **Role:** um dos dois perfis de aplicação documentados: `user` (Usuário) ou `ti` (TI). Role não prova participação em uma conversa.
3. **Membership:** relação de uma identidade com uma conversa/grupo. A participação é distinta da role e precisa ser sustentada pelo schema e pelas regras aprovadas. Não há tabela/policy de domínio disponível na `main` para validar essa relação hoje.

## 2. Fontes e limites aprovados

| Fonte | Conteúdo utilizável nesta matriz | Limite |
|---|---|---|
| POLY-REQ-001 v0.3 — `docs/09-baseline-requisitos-mvp.md` | Dois perfis; provisionamento pelo TI; conversas individuais; grupos; mensagens; anexos; consulta TI; autorização server-side e fotografia técnica | A baseline distingue confirmado, derivado, recomendação e pendente; não promover os últimos três a decisão aprovada |
| RF-001 a RF-018 — `docs/03-requisitos-funcionais.md` | Operações funcionais e critérios CA-xxx.n | RF-008 é derivado; detalhes de ciclo de vida, monitoramento e dispositivo continuam incompletos |
| RN-001 a RN-020 — `docs/05-regras-de-negocio-e-restricoes.md` | Papéis e responsabilidades gerais, provisionamento, conversas, grupos e anexos | RN-003 confirma catálogo de responsabilidades do TI, mas parâmetros e governança de cada operação podem continuar pendentes |
| Q-001 a Q-024 — `docs/08-glossario-e-questoes-em-aberto.md` | Lacunas e responsáveis sugeridos | Perguntas não são permissões nem decisões |
| ADR-006 — `docs/adr/ADR-006-autorizacao-rls.md` | Contrato Accepted de autenticação/autorização de perfis e RLS de `profiles` | Não cobre recursos de chat/domínio |
| ADR-004, ADR-005 e ADR-010 | Estado Proposed de autenticação/sessões, modelo de dados e segurança/auditoria/monitoramento | Não implementar suas propostas como decisões finais |
| Issue #99 | Modelagem de `profiles`, `conversations`, `memberships`, `messages`, `attachments`, `audit_events` e configurações | Aberta; schema completo não pode ser presumido |
| Issue #101 | Implementação de RLS e testes de isolamento | Aberta; implementação de domínio pertence a essa issue |
| Issue #102 | Eventos auditáveis, campos, retenção, acesso e proteção | Aberta; esta matriz não define retenção |
| Issue #105 | Perfis User/TI e bloqueio de contas | Aberta; não antecipar sua implementação integral |

## 3. Matriz de autorização

**Importante:** “Permitido — confirmado” identifica uma regra funcional da baseline. Até existir implementação e teste apropriados, não representa acesso efetivamente concedido em produção.

| Entidade | Operação | Ator | Condição documentada | Resultado | Enforcement / camada | Evidência |
|---|---|---|---|---|---|---|
| `profiles` | Ler o próprio perfil | Identidade autenticada (`user` ou `ti`) | `profiles.id` corresponde à identidade autenticada | Permitido — implementado na migration | RLS PostgreSQL; `id = auth.uid()` | ADR-006; migration `202611160001_profiles_roles_and_account_status.sql` |
| `profiles` | Ler perfis de outras contas | TI | Role `ti` e conta ativa, verificados pela função `is_active_ti()` | Permitido — implementado na migration | RLS PostgreSQL; função SQL `SECURITY DEFINER` com `search_path` vazio | ADR-006; migration citada |
| `profiles` | Ler perfil de terceiros | Usuário (`user`) | Não é o próprio perfil e não satisfaz a condição de TI ativo | Negado — implementado pela policy atual | RLS PostgreSQL | ADR-006; policy `profiles_select_self_or_ti` |
| `profiles` | Inserir, atualizar ou excluir diretamente | Cliente `anon` ou `authenticated` | Escrita direta revogada; role/status não podem ser alterados pelo cliente | Negado — implementado no escopo atual | Grants PostgreSQL e trigger de proteção de role/status | ADR-006; migration citada |
| Conta / `profiles` | Autenticar e prosseguir em rota protegida | Identidade sem token ou com token inválido/expirado | Token deve ser validado por `supabase.auth.getUser(token)` | Negado | Middleware server-side existente; HTTP 401 | ADR-006; `src/auth/authorization.mjs`; testes existentes |
| Conta / `profiles` | Prosseguir em rota protegida | Conta sem perfil, role desconhecida ou inativa | Perfil deve existir, role deve ser `user` ou `ti`, `is_active = true` | Negado | Middleware server-side existente; HTTP 403 | ADR-006; `src/auth/authorization.mjs`; testes existentes |
| Conta / `profiles` | Prosseguir quando a validação de perfil falhar | Qualquer identidade | Falha de infraestrutura/consulta não pode conceder acesso | Negado (fail closed) | Middleware server-side existente; erro genérico HTTP 503 | ADR-006; `src/auth/authorization.mjs`; testes existentes |
| Conta | Criar/provisionar conta | TI | Criação centralizada pelo TI; sem auto cadastro ou convite externo | Permitido — confirmado em nível funcional; detalhes pendentes | Operação privilegiada server-side; mecanismo concreto pendente de ADR-004/Issue #105 | RF-003; RN-003 a RN-005; Q-002, Q-005 e Q-006 |
| Conta | Desativar/reativar conta | TI | Responsabilidade administrativa confirmada; parâmetros operacionais pendentes | Permitido — confirmado em nível funcional; implementação/fluxo pendente | Operação privilegiada server-side; sessão e propagação do bloqueio precisam validação | RF-004; RN-003; Issue #105 |
| Conta com role TI | Criar, alterar ou desativar conta TI | TI | Não há definição sobre administrador principal ou igualdade de poderes entre pessoas de TI | Pendente | Não implementar hierarquia nem autoelevação; aprovação de Cliente/TI necessária | Q-002; ADR-006 não define hierarquia |
| Role de perfil | Alterar a própria role ou status pelo cliente | Usuário ou TI | Cliente não é fonte confiável de role/status | Negado — confirmado e protegido na migration atual | Grants, trigger e operações confiáveis no servidor | ADR-006; migration citada |
| Conversa individual | Iniciar conversa com outro usuário ativo | Usuário (`user`) | Destinatário deve ser usuário ativo; sem distinção por cargo corporativo | Permitido — confirmado | Autorização server-side; validação de estado e regras no banco/RLS quando schema existir | RN-006; RF-009 |
| Conversa individual | Abrir/ler conversa | Usuário | RF-008 é requisito derivado; baseline limita a participantes, mas o modelo de membership e sua regra ainda dependem da #99 e validação | Pendente para enforcement; não liberar por ID conhecido | Server-side + RLS de domínio; condição de membership precisa ser formalizada e implementada | RF-008; seção 6 da baseline; Issue #99/#101 |
| Conversa individual ou em grupo | Consultar qualquer conversa | TI | RF-016 confirma consulta administrativa mesmo sem ser participante; o acesso deve gerar auditoria | Permitido — confirmado funcionalmente; salvaguardas complementares pendentes | Autorização server-side por role; auditoria obrigatória; RLS/fluxo de domínio depende de #99/#101 e governança de #102 | RF-016 / CA-016.1–CA-016.4; RN-014; Q-009/Q-010 |
| Conversa | Consultar conversa por usuário sem autorização | Usuário não participante ou identidade sem direito de acesso | Acesso a conversa sem autorização deve ser negado inclusive por URL direta/API | Negado — princípio funcional confirmado; regra positiva de membership precisa ser fechada | Server-side + RLS; não confiar em ocultação de interface | RF-008; seção 3.3 de RF; Issue #101 |
| Grupo | Criar grupo | TI | Criação centralizada no TI | Permitido — confirmado | Operação server-side privilegiada; RLS específica depende do schema e da #101 | RF-005; RN-003; RN-007 |
| Grupo | Adicionar/remover participantes | TI | TI administra participantes; ciclo de vida complementar não está totalmente definido | Permitido — confirmado para administração de participantes; sem extrapolar efeitos colaterais | Server-side + RLS específica; schema de membership depende da #99 | RF-006; RN-007; Q-003 |
| Grupo | Enviar mensagem | Usuário membro incluído pelo TI | A identidade deve corresponder a membro incluído no grupo | Permitido — confirmado | Server-side + verificação de membership no banco/RLS; implementação depende de #99/#101 | RF-010; RN-007 |
| Grupo | Enviar mensagem | Usuário não membro | A regra confirmada concede envio aos membros incluídos; acesso não autorizado deve ser negado | Negado | Server-side + RLS; teste negativo depende de schema/testes da #101 | RF-010; RN-007; seção 3.3 de RF |
| Grupo | Sair voluntariamente, apagar mensagens ou encerrar/desativar grupo | Usuário ou TI | Regras não definidas | Pendente | Não implementar nem inferir efeitos de membership | Q-003; RN-007 |
| Mensagem | Enviar mensagem individual | Usuário | Conversa individual com usuário ativo; regra RN-006 | Permitido — confirmado em nível funcional | Server-side + RLS; autoria deve derivar da identidade autenticada, não de campo do cliente | RF-009; RN-006 |
| Mensagem | Enviar mensagem em grupo | Usuário membro | Membership incluído pelo TI | Permitido — confirmado em nível funcional | Server-side + RLS; autoria e membership precisam ser validados | RF-010; RN-007 |
| Mensagem | Alterar ou excluir mensagem | Usuário ou TI | Ciclo de vida de mensagens não definido | Pendente | Não criar permissões de update/delete | Q-003; Q-024 |
| Anexo | Anexar PDF/JPEG | Usuário | Formatos confirmados; limites e fluxo de armazenamento pendentes | Permitido — confirmado em nível funcional; autorização de objeto pendente | Server-side + Storage privado/RLS, se aprovado; ADR-008 está Proposed | RF-011/RF-012; RN-008; Q-011; ADR-008 |
| Anexo | Ler/baixar anexo | Usuário participante ou TI | A regra de leitura de objeto, escopo de URL e acesso administrativo não está formalizada | Pendente | Não emitir URL pública nem presumir política de bucket; decisão e schema de Storage pendentes | RF-011; Q-009/Q-011; ADR-008 |
| Anexo | Acessar anexo por identificador conhecido sem autorização | Qualquer ator não autorizado | Acesso a dados protegidos não pode depender de segredo do identificador | Negado como requisito de segurança; implementação pendente | RLS/Storage policy e validação server-side | RF-008; ADR-008 Proposed; Issue #101 |
| Auditoria | Registrar consulta administrativa de conversa | Sistema, em nome da identidade TI que consultou | Cada consulta deve gerar registro com identidade do operador e momento | Obrigatório — confirmado; estrutura e implementação pendentes | Server-side confiável; gravação protegida; modelagem e demais campos dependem de #99/#102 | RF-016; CA-016.4; RN-014; RNF-004 |
| Auditoria | Ler, alterar, excluir ou definir retenção de eventos | Usuário ou TI | Papéis, campos, integridade, acesso e retenção não foram definidos na #100 | Pendente; retenção fora do escopo | Issue #102; não criar regra nesta issue | Q-009/Q-010; ADR-010 Proposed; Issue #102 |
| Alertas | Visualizar alertas e investigar mensagens sinalizadas | TI | Responsabilidade funcional do TI confirmada; política, severidade e fluxo pendentes | Permitido em nível de responsabilidade; regra de acesso e enforcement pendentes | Server-side; definição de auditoria/monitoramento depende de aprovação | RN-003; RF-014/RF-015; Q-007/Q-008; ADR-010 |
| Configurações de segurança | Administrar políticas/configurações | TI | Responsabilidade geral confirmada; catálogo e granularidade de cada configuração pendentes | Pendente por operação específica | Não criar endpoint ou permissão genérica; requer catálogo aprovado | RN-003; Q-002/Q-013/Q-018 |
| Interface / dispositivo | Usar perfil em dispositivo incompatível | Usuário ou TI | Usuário em celular; TI em computador; critério técnico e exceções pendentes | Restrição funcional confirmada; enforcement técnico pendente | Validação server-side quando proteger operação; detecção de dispositivo não é prova confiável de identidade/role | RF-017/RF-018; RN-015; Q-012 |

## 4. Regras transversais de segurança

Estas regras são limites já sustentados pela ADR-006, baseline e requisitos; não criam novos papéis:

1. **Identidade confiável:** obter a identidade de sessão validada no servidor/Supabase Auth. Nunca aceitar `user_id`, role ou membership enviados pelo cliente como fonte de autorização.
2. **Role não é membership:** `ti` permite operações administrativas explicitamente descritas; não torna uma conta participante de todas as conversas. O acesso TI a qualquer conversa é uma exceção funcional expressa em RF-016 e deve gerar auditoria.
3. **Membership não é role:** ser membro de um grupo autoriza somente as ações funcionais confirmadas para membros, atualmente envio de mensagens. Não implica administração de grupo, gestão de contas ou acesso a outros grupos.
4. **Menor privilégio:** conceder somente as operações expressamente sustentadas por RF/RN e ADR Accepted. Ausência de regra positiva não autoriza acesso.
5. **Falha fechada:** erro de Auth, perfil, consulta ou verificação de autorização não pode resultar em concessão.
6. **IDs não são autorização:** conhecer UUID/ID de conversa, mensagem ou anexo não concede acesso.
7. **Frontend não é enforcement:** ocultar botões ou bloquear telas não substitui verificação server-side e RLS.
8. **Service role:** nunca expor chave service-role em browser, bundle, variável `NEXT_PUBLIC_*` ou logs. O mecanismo de operações privilegiadas deve ser server-side e restrito ao necessário; não há autorização nesta matriz para criar um bypass genérico de RLS.
9. **Erros:** manter respostas genéricas e não revelar existência de conversas, mensagens, perfis, tokens, chaves, stack traces ou erros internos a atores sem autorização.
10. **SECURITY DEFINER:** a função existente `public.is_active_ti()` usa `SECURITY DEFINER` e `search_path = ''`. Qualquer nova função desse tipo exige revisão explícita de owner, grants, objetos totalmente qualificados, search_path, superfície de execução e testes; esta issue não cria novas funções privilegiadas.

## 5. Inventário de enforcement observado na `main`

| Componente | Estado observado | O que efetivamente comprova | O que não comprova |
|---|---|---|---|
| `src/auth/authorization.mjs` | Existe | Middleware Express-compatible valida JWT com `getUser`, consulta `profiles`, aceita `user/ti`, bloqueia perfil/conta inválidos e falha fechada | Não comprova integração com handlers reais do Next.js; não verifica membership de domínio |
| `public.profiles` | Migration versionada | Relação com `auth.users`, role `user/ti`, `is_active`, timestamps | Não comprova migration aplicada em projeto Supabase hospedado |
| RLS de `profiles` | Existe na migration | SELECT do próprio perfil ou por TI ativo; escrita direta de clientes revogada | Não protege conversas, grupos, mensagens, anexos ou auditoria |
| `public.is_active_ti()` | Existe na migration | Verificação de role TI ativo para policy de leitura de perfis | Não é uma política geral para todos os recursos; não autoriza ações não descritas |
| `prevent_client_profile_privilege_changes()` | Existe na migration | Impede mudança de role/status em update executado como `authenticated` | Não define fluxo completo de provisionamento administrativo |
| `create_default_profile()` | Existe na migration | Cria perfil padrão `user` para novo `auth.users` | Não define como TI provisiona contas ou como uma conta TI é promovida |
| RLS de conversas/memberships/mensagens/anexos/auditoria | Não encontrada na `main` | Nenhuma autorização de domínio comprovada | Não criar nem presumir policies |
| Testes `tests/authorization.test.mjs` | 11 testes existentes | Testes unitários do middleware com Supabase simulado | Não testam PostgreSQL/RLS real, isolamento de domínio ou Storage |
| Integração Supabase no App Router | Não encontrada como integração funcional na baseline | A página inicial é institucional; o README declara integração Supabase pendente | Não afirmar autenticação ou rotas protegidas em produção |

### 5.1 Observação sobre a migration de `profiles`

Arquivo: `supabase/migrations/202611160001_profiles_roles_and_account_status.sql`.

- RLS é habilitada em `public.profiles`.
- Policy de SELECT permite `id = auth.uid()` ou `public.is_active_ti()`.
- Grants revogam INSERT/UPDATE/DELETE de `anon` e `authenticated`; SELECT é concedido a `authenticated`.
- A função `is_active_ti()` é `SECURITY DEFINER`, usa `search_path = ''`, qualifica `public.profiles` e tem execução revogada de `public` e concedida a `authenticated`.
- Trigger de proteção de privilégios e trigger de perfil padrão também são `SECURITY DEFINER`; não devem ser generalizados sem revisão.
- A existência do arquivo versionado não é evidência de aplicação/homologação em Supabase hospedado.

## 6. Casos positivos e negativos para validação

Os casos abaixo são derivados das regras e identificados pelo estado de prontidão. “Definido” significa que há regra de negócio suficiente para especificar o resultado; “bloqueado” significa que o teste de domínio depende de schema, implementação ou decisão ainda ausentes.

| ID | Cenário | Resultado esperado sustentado | Estado do caso |
|---|---|---|---|
| AUTH-01 | Identidade autenticada lê seu próprio `profiles` | Permitido | Definido; coberto pela policy existente, mas não há evidência de teste RLS hospedado |
| AUTH-02 | TI ativo lê `profiles` de outras contas | Permitido | Definido na migration; teste de banco real pendente |
| AUTH-03 | Usuário tenta ler `profiles` de terceiro | Negado | Definido na policy existente; teste de banco real pendente |
| AUTH-04 | Cliente tenta inserir/alterar/excluir perfil diretamente | Negado | Definido por grants/trigger; teste de banco real pendente |
| AUTH-05 | Requisição sem token ou token inválido | HTTP 401; não prosseguir | Implementado e coberto por testes simulados |
| AUTH-06 | Perfil ausente, role desconhecida ou conta inativa | HTTP 403; não prosseguir | Implementado e coberto por testes simulados |
| AUTH-07 | Falha de consulta/infraestrutura durante validação | Erro genérico HTTP 503; não prosseguir | Implementado e coberto por testes simulados |
| AUTH-08 | Usuário chama rota restrita a TI após autenticação | HTTP 403 | Middleware isolado testado; integração em rota real pendente |
| AUTH-09 | Usuário inicia conversa individual com outro usuário ativo | Permitido | Regra definida; implementação/schema pendentes |
| AUTH-10 | Usuário tenta abrir conversa da qual não participa | Negado | Resultado negativo sustentado; regra positiva de membership e teste dependem de #99/#101 |
| AUTH-11 | TI consulta conversa sem ser participante | Permitido e gera evento de auditoria com identidade e momento | Permissão funcional definida; governança complementar e implementação pendentes |
| AUTH-12 | Usuário tenta usar consulta administrativa TI | Negado | Regra definida por RF-016; enforcement de domínio/endpoint pendente |
| AUTH-13 | TI cria grupo e administra participantes | Permitido | Regra funcional definida; schema/enforcement pendentes |
| AUTH-14 | Membro incluído pelo TI envia mensagem ao grupo | Permitido | Regra definida; schema/enforcement pendentes |
| AUTH-15 | Não membro tenta enviar mensagem ao grupo | Negado | Regra negativa sustentada; teste depende de #99/#101 |
| AUTH-16 | Usuário altera role/status no payload ou por escrita direta | Negado; role/status não vêm do cliente | Proteção de perfil existente; testes de integração pendentes |
| AUTH-17 | Ator sem privilégio tenta operar recurso administrativo | Negado | Definido somente para operações TI com ator explicitado; cada endpoint depende de implementação |
| AUTH-18 | Ator acessa mensagem/anexo por ID conhecido sem direito | Negado | Princípio de acesso não autorizado definido; teste de domínio depende de #99/#101 e Storage |
| AUTH-19 | Usuário tenta sair voluntariamente de grupo ou apagar mensagem | Sem resultado definido | Bloqueado por Q-003/Q-024; não criar teste com resultado inventado |
| AUTH-20 | Cliente tenta ler/alterar/excluir eventos de auditoria ou definir retenção | Sem resultado definido nesta issue | Bloqueado por #102; não antecipar política |

### 6.1 Evidência de testes já existente

A baseline #88 e ADR-006 registram 11 testes unitários em `tests/authorization.test.mjs`, usando Supabase simulado. Os cenários cobertos são: usuário ativo; ausência de token; sessão inválida; conta inativa; falha de consulta; role desconhecida; acesso TI; bloqueio de usuário em rota TI; perfil ausente; exceção do provedor; rota TI sem autenticação.

Esses testes são evidência existente no repositório, não execução realizada por este documento. Não foram encontrados testes de RLS real, isolamento entre usuários/conversas ou Storage. Não se declara teste novo, execução local, execução hospedada ou aprovação que não tenha ocorrido.

## 7. Lacunas, impactos e responsáveis

| Lacuna / decisão | Evidência | Impacto na matriz | Risco de presumir | Responsável indicado na documentação | Próxima ação |
|---|---|---|---|---|---|
| Quem pode criar/alterar/desativar contas TI; se há administrador principal | Q-002 | Não é possível definir hierarquia, delegação ou autoalteração de TI | Elevação indevida de privilégio ou bloqueio circular | Cliente / TI | Aprovar formalmente a regra de gestão de contas TI |
| Schema de conversas e memberships ainda em #99 | Issue #99 aberta; ADR-005 Proposed | Não é possível escrever/verificar condição de membership no banco | Acesso cruzado ou regra incompatível com o modelo final | Tech Lead + Dev backend + TI | Concluir/revisar #99 antes de implementar RLS de domínio |
| Leitura de conversas por participantes e semântica de membership | RF-008 derivado; Q-003 | O limite positivo de leitura precisa ser validado junto ao modelo | Conceder acesso por mera role ou negar indevidamente participante | Product Owner / Cliente / TI; Tech Lead para desenho | Confirmar regra de participação e ciclo de vida |
| Governança da consulta TI a conversas | RF-016 confirma consulta/auditoria; Q-009 | A permissão funcional existe, mas cargos autorizados, justificativa, transparência e salvaguardas não estão fechados | Acesso excessivo, uso indevido e ausência de responsabilização | Representante FORD + TI + Segurança + Jurídico/Privacidade | Aprovar governança; tratar campos e retenção em #102 |
| Política de auditoria, integridade e retenção | Q-009/Q-010; #102 aberta; ADR-010 Proposed | É obrigatório registrar consulta, mas não se define aqui modelo completo, leitura, proteção ou prazo | Perda de rastreabilidade ou retenção não autorizada | TI + Segurança + Jurídico/Privacidade | Definir e implementar em #102 |
| RLS de domínio e testes de isolamento | #101 aberta | Não há enforcement comprovado para conversas, grupos, mensagens ou anexos | Exposição por acesso direto/API/IDs | Tech Lead + Dev backend + TI | Implementar em #101 somente após matriz e schema aprovados |
| Regras de Storage e acesso a anexos | ADR-008 Proposed; Q-011 | Não é possível autorizar download, URL, bucket, limites ou acesso TI | Exposição pública de arquivos ou bypass de autorização | Tech Lead + Dev backend + Segurança; TI/Cliente para limites | Aprovar estratégia de Storage e validar com #99/#101 |
| Perfis/estado e integração real de Auth | #105 aberta; ADR-004 Proposed | Middleware isolado existe, mas fluxo de sessão/handlers reais não está integrado | Divergência entre sessão, perfil e autorização | Responsáveis da #105; Tech Lead + Dev backend + TI | Concluir trabalho próprio de #105 sem presumir que a #100 o executou |
| Regras de alertas e investigação | Q-007/Q-008; ADR-010 Proposed | Não se define escopo de leitura, severidade ou ações automáticas | Bloqueio/punição ou acesso não aprovado | Cliente + TI + Segurança | Aprovar regras antes de políticas/rotas de alertas |
| Catálogo de configurações TI | Q-013/Q-018 | “Administrar configurações” não pode virar permissão genérica | Privilégio excessivo por endpoint amplo | Cliente / TI / Segurança | Enumerar configurações e ações autorizadas |

## 8. Decisões que esta issue não toma

Permanecem fora da decisão desta matriz:

- Criar roles adicionais, hierarquia de TI ou administrador principal.
- Definir poderes de TI sobre outras contas TI sem aprovação de Q-002.
- Definir regras de saída voluntária, remoção de mensagens ou encerramento de grupos (Q-003).
- Definir edição/exclusão de mensagens (Q-024).
- Definir justificativa obrigatória, retenção, descarte, exportação ou campos completos de auditoria (Q-009/Q-010; #102).
- Definir Storage público/privado, URLs assinadas, limites de arquivos ou antimalware (Q-011; ADR-008 Proposed).
- Definir critérios, severidade ou bloqueio automático de mensagens suspeitas (Q-007/Q-008; ADR-010 Proposed).
- Tratar detecção de dispositivo como prova de identidade ou privilégio (Q-012).
- Declarar aplicação de migrations, RLS ou integração Supabase hospedada sem evidência.

## 9. Encaminhamento para a Issue #101

A #101 pode iniciar sua preparação técnica usando as regras **confirmadas** desta matriz, mas não deve implementar políticas de domínio até que:

1. O schema efetivo da #99 esteja disponível e revisado.
2. A matriz tenha aprovação registrada pelos responsáveis competentes; em especial, a regra de membership/leitura e governança do acesso TI.
3. Cada policy esteja associada a uma tabela/ação real e a uma regra positiva/negativa identificada.
4. O desenho de funções privilegiadas, grants e uso de service role tenha revisão específica.
5. Os testes distingam identidade autenticada, role, membership, conta ativa/inativa e tentativa de acesso por ID conhecido.

A #101 não deve usar policies permissivas para contornar lacunas. Onde a regra permanecer pendente, a operação deve permanecer sem liberação até decisão.

## 10. Situação desta entrega em relação à Issue #100

| Critério original da Issue #100 | Estado observado após auditoria/documentação |
|---|---|
| Matriz aprovada; acesso mínimo; casos positivos e negativos definidos | **Parcial.** Matriz rastreável e casos definidos quando há regra aprovada; aprovação formal ainda pendente e casos dependentes de decisões/schema estão marcados |
| Testes relevantes automatizados ou evidência documentada | **Parcial.** Evidência dos 11 testes simulados existentes documentada; não há teste RLS real/domínio e este documento não declara execução nova |
| Revisão por PR concluída | **Não executado.** Depende da PR, revisão independente e checks |
| Sem regressão nos fluxos relacionados | **Não verificado nesta alteração.** A matriz é documental; CI da PR deve ser executado e revisado |

**Regra de encerramento:** não fechar a Issue #100 até que a matriz receba a aprovação necessária, os casos de teste estejam definidos com resultados sustentados, a PR seja revisada/aprovada, os checks exigidos passem e as limitações sejam aceitas/replanejadas sem alterar o escopo original.
