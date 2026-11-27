# ADR-006 — Autorização server-side e RLS

- **Status:** Accepted — escopo delimitado
- **Data da decisão original:** 17/11/2026
- **Data de revisão documental:** 26/11/2026
- **Issue:** #89 · **Implementações relacionadas:** #101 e #105
- **Baseline:** POLY-REQ-001 v0.5

## Escopo do aceite

A decisão Accepted estabelece RBAC estrito com os papéis `user` e `ti`, validação de identidade/estado no servidor e RLS no banco como camadas complementares. O escopo originalmente aceito em 17/11/2026 abrangia a regra de perfis e a proteção de `profiles`. Esta revisão registra as implementações posteriores que ampliaram a aplicação prática do mesmo modelo:

- **PR #172 / Issue #101:** políticas RLS de domínio para conversas, memberships, mensagens, anexos (metadados), leituras, alertas e tabelas de configuração. A PR foi integrada após correções solicitadas na revisão SQA e aprovação do Tech Lead.
- **PR #175 / Issue #105:** adaptador de autorização integrado ao Next.js App Router e à rota de consulta de sessão, com aprovação do Tech Lead e CI concluído.

O aceite é limitado aos mecanismos, tabelas e fluxos descritos nesta ADR. Não significa que todos os handlers de produto estejam implementados e protegidos, que o Storage tenha políticas próprias de objeto, que Realtime revogue assinaturas ativas ou que o ambiente de produção esteja homologado.

## Contexto

A baseline prevê dois perfis: Usuário e TI. O servidor deve validar a identidade autenticada, consultar papel e estado em fonte confiável e negar acesso quando a conta estiver ausente, inativa ou possuir papel inválido. A autorização não pode depender de elementos fornecidos pelo cliente, como body, query, filtros, identificadores ou metadados.

A ADR-003 mantém Supabase + Vercel como stack adotada e obrigatória. As policies RLS são aplicadas no PostgreSQL/Supabase Database; a autenticação e a validação de sessão utilizam Supabase Auth. A Q-025 foi concluída em 24/11/2026, com aprovação da TI/FORD para o modelo de utilização e compatibilidade dos provedores nomeados, dentro dos limites e responsabilidades registrados. Essa aprovação não substitui a verificação dos privilégios, credenciais e políticas efetivamente aplicados em cada componente.

## Problema

Impedir que o cliente escolha seu próprio papel, contorne permissões alterando a interface ou acesse dados de outras contas/conversas. O controle deve existir no servidor e no banco, sem conceder privilégios pela simples posse de um identificador ou pela escolha de um canal/filtro.

## Alternativas consideradas

1. **Controle apenas na interface:** rejeitado, pois esconder ou desabilitar componentes não protege endpoints nem dados no banco.
2. **RBAC validado no servidor e complementado por RLS:** adotado para os papéis `user` e `ti`, com validação de identidade, perfil e permissões em cada camada aplicável.
3. **Modelo ABAC mais amplo:** não selecionado; não foram definidos atributos e regras adicionais que justifiquem sua introdução no MVP.

## Decisão

Manter RBAC estrito com os papéis `user` e `ti`, combinando autorização server-side com políticas RLS específicas por recurso.

### 1. Regras server-side de identidade e perfil

- O servidor valida o JWT por Supabase Auth.
- Papel e estado são lidos de `public.profiles`; body, query, headers arbitrários ou metadados do cliente não são fontes de autorização.
- Somente os papéis `user` e `ti` são aceitos.
- Conta ausente, perfil ausente, papel desconhecido ou conta inativa não recebe autorização.
- Falha de infraestrutura ou consulta retorna erro genérico e não concede acesso.
- A autorização por rota verifica o papel permitido somente depois da autenticação.
- Alterações de papel/estado exigem contexto confiável no servidor; chaves privilegiadas nunca são entregues ao browser.

O repositório mantém o middleware Express-compatible em `src/auth/authorization.mjs`, com `requireAuthenticatedUser` e `requireRole`. O adaptador `src/auth/next-authorization.mjs` reutiliza a validação de sessão por cookies e permite restringir as roles aceitas pelo handler do Next.js. Os handlers devem invocar a autorização apropriada antes de executar operações protegidas; a existência dos módulos não protege automaticamente uma rota que não os utiliza.

### 2. Políticas RLS e privilégios de perfil

- `profiles`: leitura limitada ao próprio perfil ou TI ativo, conforme a policy aplicável.
- Escrita direta de clientes sobre campos privilegiados do perfil é revogada; privilégios residuais de `TRUNCATE`, `TRIGGER` e `REFERENCES` foram removidos.
- Papel e estado da conta não podem ser definidos pelo próprio usuário por meio de escrita direta.

### 3. Políticas RLS dos recursos de domínio — Issue #101

As policies integradas pela PR #172 aplicam as regras abaixo, sem criar novos papéis nem alterar a matriz de negócio:

- **`conversations`:** leitura por TI ou participante ativo autorizado; criação de conversa direta restrita aos dois participantes ativos; criação/gestão de grupos e alterações administrativas sob TI.
- **`memberships`:** leitura de membership próprio ou por TI; usuário só pode criar membership correspondente à própria conversa direta nos limites definidos pela policy; inclusão/encerramento de memberships de grupo fica com TI.
- **`messages`:** leitura por participante autorizado ou TI; envio pelo próprio perfil em conversa ativa; edição e exclusão lógica administrativa somente por TI.
- **`attachments` (metadados):** leitura acompanha a autorização da mensagem/conversa; inclusão limitada ao autor autorizado da mensagem; alteração de metadados do fluxo de análise somente por TI.
- **`message_reads`:** leitura pelo leitor autorizado, autor da mensagem ou TI, e criação de recibo somente para o próprio perfil.
- **`security_alerts`:** leitura e encerramento sob TI.
- **Tabelas de configuração** (`detection_rules`, `attachment_user_quotas` e `attachment_storage_capacity`): acesso de cliente somente por TI.
- **Funções auxiliares:** implementações de verificação ficam no schema `private`, com `search_path` vazio. A verificação de TI foi movida para `private.is_active_ti()`; o wrapper público é `SECURITY INVOKER`.

As verificações de membership consideram identidade ativa, participação vigente (`ended_at IS NULL`) e estado da conversa. A política de domínio não concede acesso a uma conversa encerrada nem a um usuário removido.

### 4. Separação de responsabilidades

- A PR #172 não altera `audit_events` nem `privileged_action_audit`. A trilha genérica e retenção permanecem na Issue #102; a auditoria privilegiada permanece na Issue #124.
- RLS sobre a tabela `attachments` protege metadados e vínculos. Não substitui políticas de objeto do Storage. O bucket privado não concede acesso direto a `anon`/`authenticated`; upload e operações privilegiadas são mediados por servidor. Download, URL temporária, verificação antimalware, quarentena/liberação e revogação de acesso continuam nos escopos #116/#117.
- As policies RLS de `public.messages` não substituem políticas de autorização de canais Realtime. A revogação de assinaturas já abertas permanece objeto específico da ADR-007.
- A camada server-side e RLS devem permanecer complementares: uma requisição protegida pela aplicação ainda deve respeitar as policies do banco; a policy do banco não dispensa autenticação e autorização apropriadas no handler.

### 5. Uso de credenciais privilegiadas

Credenciais administrativas, incluindo `SUPABASE_SECRET_KEY` ou qualquer chave de serviço equivalente, devem permanecer exclusivamente no servidor, nunca em variáveis `NEXT_PUBLIC_`, bundles, código cliente ou logs. Operações que as utilizem devem limitar escopo, finalidade e metadados.

A revisão do Tech Lead na PR #172 registrou expressamente que o SQA não conseguiu certificar, no escopo daquela PR, a ausência de `service_role` no frontend. Essa ressalva permanece como verificação de segurança pendente e não deve ser omitida ou considerada resolvida apenas porque a PR foi integrada.

## Justificativa

A validação server-side reduz a dependência da interface e impede que o cliente escolha papel ou estado. RLS fornece uma segunda fronteira de controle no banco e limita o impacto de um endpoint ou cliente mal implementado. A combinação de papel, estado da conta, estado da conversa e membership vigente alinha a autorização com as regras de negócio da FORD.

A separação entre recursos de domínio, objetos Storage, eventos de auditoria e canais Realtime evita atribuir a uma policy mais cobertura do que ela realmente oferece.

## Consequências

**Positivas:**
- Regra centralizada e testável para os papéis Usuário e TI.
- Falha fechada quando identidade, perfil ou consulta não podem ser validados.
- Isolamento por participante e estado da conversa aplicado no banco.
- Proteção em profundidade por autorização server-side e RLS.
- Separação explícita entre domínio, auditoria, Storage e Realtime.

**Negativas e cuidados:**
- Cada handler de negócio deve invocar a autorização adequada e respeitar o RLS; omitir o adaptador pode deixar a rota sem a proteção server-side esperada.
- Policies, funções auxiliares e grants precisam ser revisados com cada migration.
- A autorização de Storage e Realtime possui superfícies próprias e não é resolvida apenas pela RLS das tabelas de domínio.
- O uso de credenciais privilegiadas exige revisão do código servidor, das variáveis de ambiente e dos artefatos de frontend.

## Limite explícito do aceite

O aceite cobre o contrato de RBAC User/TI, a validação server-side de identidade/perfil, a proteção de `profiles` e as policies de domínio listadas nesta ADR, nos limites das implementações integradas e testadas pelas PRs #172 e #175.

O aceite não comprova:

- que todas as rotas e operações do produto já existam ou estejam protegidas;
- cobertura completa dos fluxos de gestão de contas, grupos e auditoria privilegiada;
- políticas de acesso a objetos Storage ou download autorizado;
- revogação imediata de assinaturas Realtime já abertas;
- ausência certificada de `service_role` em todo o frontend;
- execução de todos os controles operacionais, homologação de produção ou cumprimento de backup/restore. A compatibilidade e o modelo de utilização dos provedores Supabase + Vercel já foram aprovados pela TI e pela FORD na Q-025; este aceite delimitado não comprova, por si só, a execução integral desses controles.

## Evidências e testes

- **Implementação original de perfis:** `src/auth/authorization.mjs` e migration de `profiles`, com validação de JWT, papel/estado e falha fechada.
- **PR #172 / Issue #101:** migration `20261125231700_issue_101_domain_rls.sql` e migrations complementares de hardening, UUID de conversa direta e isolamento da função de verificação de TI. PR merged em 26/11/2026.
- **Revisão da PR #172:** o SQA identificou inicialmente alterações de grants em `audit_events`, fora do escopo declarado. A correção removeu tais alterações da PR #172 e manteve a responsabilidade na #102. O Tech Lead aprovou após a correção, registrando a ressalva sobre a certificação da ausência de `service_role` no frontend.
- **Testes SQL de RLS:** `supabase/tests/issue_101_rls.integration.sql` — 16/16 cenários passaram no Polyford, com identidades e dados sintéticos revertidos por `ROLLBACK`.
- **Criação de conversa direta:** `supabase/tests/issue_101_direct_conversation_creation.sql` — teste separado confirmou visibilidade após a criação dos memberships, com transação revertida.
- **Evidência detalhada:** `docs/security/issue-101-rls-evidence.md` descreve políticas, migrations, cenários e limites do ambiente.
- **PR #175 / Issue #105:** adaptador `authorizeNextRequest` integrado a `GET /api/auth/session`, com cookies HttpOnly, renovação de sessão, tratamento de falhas e restrição de roles. PR merged em 26/11/2026 e aprovada pelo Tech Lead.
- **Testes do adaptador:** `tests/next-authorization.test.mjs` cobre sessão válida/inválida, acesso exclusivo de TI, perfil TI, falha fechada e roles desconhecidas. A PR #175 reportou 55 testes, ESLint, TypeScript, build e smoke test aprovados no head revisado.
- **Auditoria e Storage:** PRs #170/#173 e #181/#185 implementam componentes próprios, mas não ampliam automaticamente o escopo RLS desta ADR.

Os testes SQL e as revisões citadas comprovam os cenários e os commits revisados. Não equivalem a teste de revogação Realtime, homologação de Storage completo, auditoria de todos os handlers ou certificação de todo o frontend.

## Próximas validações e limites operacionais

- Executar e registrar verificação específica de segurança para comprovar que nenhuma chave `service_role`/secreta é incorporada ao frontend ou exposta em artefatos públicos; manter a ressalva do parecer técnico até evidência conclusiva.
- Conferir que cada handler de negócio existente e futuro chama o adaptador/middleware necessário antes da operação, com testes positivos e negativos.
- Manter testes RLS no CI e repetir no ambiente homologado, incluindo usuário não participante, perfil inativo, conversa encerrada e remoção de membership.
- Validar separadamente autorização de objeto Storage, download e revogação conforme #116/#117.
- Validar separadamente autorização de canal, cache e revogação de assinatura ativa conforme ADR-007.
- Conferir, com TI e Tech Lead, que a configuração, os privilégios e o uso de credenciais Supabase + Vercel permanecem dentro dos limites e responsabilidades aprovados na Q-025, sem reabrir a avaliação de compatibilidade concluída.

O status Accepted permanece restrito ao escopo explicitado nesta ADR. Qualquer mudança nos papéis, matriz de autorização, mecanismo de segurança ou extensão de privilégio exige revisão própria e aprovação formal, sem reabrir decisões de produto já consolidadas.
