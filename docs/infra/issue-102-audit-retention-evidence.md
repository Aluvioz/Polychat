# Issue #102 — auditoria, retenção e evidências operacionais

**Estado desta entrega:** implementação parcial em PR Draft. Este documento separa código versionado, testes escritos, integração ainda ausente e controles operacionais não comprovados.

## 1. Auditoria inicial e matriz de estado

| Item | Estado encontrado | Evidência | Ação nesta entrega |
|---|---|---|---|
| Modelo de dados da #99 | PR #160 aberta em Draft; modelo conceitual v0.3 na branch da PR | Parecer do PO de 20/11/2026 | Utilizado como referência funcional, sem presumir aprovação de DDL |
| Tabelas e relações | `main` contém somente a migration de `profiles`; PR #165 propõe o núcleo de domínio | Migrations `202611160001`, `202611240001` e `202611240002` nas branches de trabalho | PR #165 complementada com integridade de mensagens/anexos e inventário mínimo de configurações |
| `audit_events` | Criada no Polyford; migration remota `issue_102_audit_events` aplicada | Histórico remoto `20261124210245`; tabela consultada em 24/11/2026 | Estrutura, RLS, policies, ACL, triggers e catálogo verificados; INSERT positivo TI ainda pendente |
| Autorização da auditoria | Não havia tabela nem policy específica | Migration desta PR; `is_active_ti()` existente na migration de profiles | SELECT/INSERT apenas para TI ativo autenticado; sem UPDATE/DELETE |
| Integridade dos registros | Não havia proteção específica de auditoria | Migration desta PR | Trigger append-only para UPDATE/DELETE/TRUNCATE; limites de owner/superuser documentados |
| Retenção | Regras funcionais definidas; nenhuma rotina operacional de descarte observada | Issue #102, modelo v0.3 seção 9 | Nenhum job de exclusão automática criado; descarte autorizado ainda requer fluxo operacional |
| Backup e restauração | Projeto Polyford `ACTIVE_HEALTHY`; plano e configuração de backup não verificados | `get_project`, consultas SQL e documentação oficial Supabase | Nenhuma configuração alterada; sem evidência de backup de anexos/12 meses ou restore |
| Testes | Testes unitários e script SQL de integração disponíveis | `tests/audit-events.test.mjs` e `tests/sql/issue-102-audit-events.integration.sql` | Script SQL executado em Polyford; INSERT positivo TI pendente por ausência de identidade de teste |

## 2. Catálogo persistido

A migration `202611240003_issue_102_audit_events.sql` cria `public.audit_events` com:

- `actor_profile_id`: FK restritiva para `profiles`.
- `event_type`: catálogo fechado de eventos da Issue #102.
- `resource_type` e `resource_id`: identificação do recurso afetado.
- `occurred_at`: timestamp atribuído pelo banco no trigger de inserção.
- `outcome`: resultado da operação.
- `metadata`: objeto JSONB mínimo, sem campos de credenciais/conteúdo proibidos.

Eventos persistidos no catálogo:

1. `admin_login`
2. `account_created`
3. `account_updated`
4. `account_deactivated`
5. `account_reactivated`
6. `group_created`
7. `group_closed`
8. `group_activated`
9. `group_deactivated`
10. `participant_added`
11. `participant_removed`
12. `conversation_viewed`
13. `alert_reviewed`
14. `alert_closed`
15. `attachment_downloaded`
16. `attachment_released`
17. `conversation_exported`
18. `message_admin_edited`
19. `message_admin_deleted`
20. `configuration_changed`
21. `retention_discarded`

`retention_discarded` representa a exigência expressa da Issue #102 de registrar o descarte autorizado; não cria uma nova funcionalidade de produto.

Consultas, exportações e encerramento de alertas não exigem justificativa. O writer não exige campo `reason`.

## 3. Acesso e integridade

A migration foi aplicada ao projeto Supabase Polyford. As consultas SQL e o script `tests/sql/issue-102-audit-events.integration.sql` executados em 24/11/2026 confirmaram:

- RLS habilitada em `public.audit_events` e exatamente duas policies: SELECT e INSERT para `authenticated`, condicionadas a TI ativo. A policy de INSERT também exige `actor_profile_id = auth.uid()`.
- ACL: `anon` sem SELECT/INSERT; `authenticated` com SELECT/INSERT e sem UPDATE/DELETE/TRUNCATE. O owner `postgres` mantém privilégios administrativos; esse papel está fora da fronteira de proteção da aplicação.
- Três triggers instalados: validação de ator/metadados no INSERT, bloqueio de UPDATE/DELETE e bloqueio de TRUNCATE.
- Catálogo fechado com os 21 tipos de evento.
- O script SQL executou em transação revertida: INSERT sem identidade TI foi rejeitado; tentativas de UPDATE, DELETE e TRUNCATE como `authenticated` também foram rejeitadas.
- A validação recursiva detectou uma chave sensível aninhada e aceitou metadados seguros.

**Validação positiva pendente:** as consultas retornaram zero linhas em `auth.users`, `public.profiles` e `public.audit_events`. Não existe identidade TI de teste no projeto. Assim, não foi possível realizar INSERT positivo com identidade TI autenticada. Não criei usuário fictício nem inseri dados permanentes para simular essa evidência.

**Histórico de migrations:** o histórico remoto registra `issue_102_audit_events` na versão `20261124210245`, enquanto o arquivo versionado na PR usa o prefixo `202611240003`. A migration está aplicada, mas a divergência de identificadores entre Git e histórico remoto permanece sem reconciliação; não declaro o histórico alinhado.

## 4. Serviço de registro e falha segura

Foi criado `src/audit/audit-events.mjs` como ponto de integração para handlers server-side.

Contrato:

- O ator deve vir do contexto `req.authUser` preenchido pelo middleware de autenticação existente, nunca de body/query.
- Exige role `ti` e conta ativa no contexto validado.
- Mapeia cada evento para o tipo de recurso correspondente.
- Rejeita metadados com chaves sensíveis.
- Não aceita timestamp fornecido pela aplicação.
- Lança `AuditWriteError` se a persistência falhar; o chamador deve aguardar o resultado e não retornar sucesso ao operador.

**Limite transacional:** o helper usa uma chamada de INSERT separada. Isso, isoladamente, não torna a mutação principal e o evento atômicos. Operações administrativas que alteram dados devem executar a mutação e o registro de auditoria na mesma transação/RPC antes de confirmar sucesso. Esse acoplamento ainda não foi implementado porque o repositório não contém handlers/serviços funcionais para contas, grupos, conversas, alertas, anexos, exportações ou mensagens.

## 5. Sobreposição com a Issue #124 e dependências

A Issue #124 — “Implementar trilha de auditoria de ações privilegiadas” — também cobre login administrativo, gestão de contas/grupos, consultas e alterações sensíveis e está atribuída a Dante-Davi.

Para evitar duplicação ou apropriação do trabalho atribuído a outra pessoa:

- Esta PR fornece a persistência comum, catálogo, controles de banco e writer reutilizável previstos na #102.
- Não cria handlers ou call sites duplicados para as ações administrativas da #124.
- A integração dos eventos em cada fluxo deve ser coordenada com a #124 e revisada pelo Tech Lead para definir um único ponto de emissão por operação.

Outras dependências observadas:

- **#100/#101:** matriz e enforcement de autorização de domínio. A policy específica de auditoria desta PR não substitui a RLS das demais tabelas.
- **#105:** integração funcional de perfis/contas; o middleware atual ainda não está conectado a handlers reais do App Router.
- **#115/#116/#117:** upload, download, Storage, liberação excepcional e backup de anexos. A #117 está atribuída a Berthed.
- **#122/#123:** detecção de conteúdo e fila de alertas; esta PR não implementa o motor de detecção nem a fila.
- **#124:** integração dos eventos privilegiados, conforme descrito acima.

## 6. Retenção

A regra funcional da Issue #102 é não excluir automaticamente mensagens, anexos, alertas, auditoria e registros administrativos enquanto o sistema operar. TI autoriza exclusões e decide preservação durante investigações.

Nesta entrega:

- Nenhum job de expiração ou exclusão automática foi criado.
- `audit_events` não permite UPDATE/DELETE/TRUNCATE pelos papéis de aplicação.
- FKs da modelagem #99 usam `ON DELETE RESTRICT` para evitar cascatas de histórico.
- O evento `retention_discarded` está disponível para registrar descarte autorizado.
- Ainda não existe fluxo server-side transacional de autorização, preservação de investigação, exclusão de registros de domínio e emissão do respectivo evento.
- Também não existe rotina operacional que remova cópias de backup ao final dos 12 meses.

Portanto, a política está parcialmente sustentada por schema, mas não está integralmente aplicada.

## 7. Backup e recuperação — estado real

A Issue #102 exige backups diários de banco e anexos, retenção por 12 meses, descarte de dados excluídos ao final do ciclo e RPO/RTO de até 24 horas.

### 7.1 Estado observado no Polyford

- O projeto `Polyford` está `ACTIVE_HEALTHY` na consulta de 24/11/2026, com PostgreSQL 17.11.0.019.
- O plano contratado e as configurações de backup não foram confirmados pelas ferramentas disponíveis nesta execução.
- A consulta SQL retornou zero buckets em `storage.buckets`. Portanto, não há bucket de anexos criado no projeto consultado. A Issue #117, responsável pelo armazenamento privado e backup de anexos, está atribuída a Berthed.
- Nenhuma configuração de backup, Storage ou retenção foi alterada; nenhum backup ou restore foi executado.

### 7.2 Limites da plataforma e evidências pendentes

A documentação oficial do Supabase informa que backups automáticos diários estão disponíveis nos planos Pro, Team e Enterprise, com janelas de 7, 14 e até 30 dias, respectivamente. Isso não comprova retenção de 12 meses. A mesma documentação informa que objetos do Storage API não entram nos backups do banco; o backup de metadados não cobre os anexos binários. Referência: [Supabase — Database Backups](https://supabase.com/docs/guides/platform/backups).

| Evidência exigida | Estado verificado |
|---|---|
| Plano e janela real de backup do Polyford | Não verificados |
| Backup diário do banco habilitado e executado | Não comprovado |
| Bucket e backup diário dos anexos | Zero buckets encontrados; não configurado/comprovado |
| Retenção de 12 meses | Não configurada/comprovada |
| Descarte de cópias após o ciclo | Não implementado/comprovado |
| Restauração controlada em ambiente isolado | Não executada |
| Integridade pós-restauração | Não testada |
| Medição de RPO | Não executada |
| Medição de RTO | Não executada |

O projeto estar ativo não comprova que backups estejam habilitados. Não foi feita restauração destrutiva nem foi criada infraestrutura de backup sem decisão operacional aprovada. ADR-005 permanece Proposed, Q-025 aberta e ADR-008 Proposed para Storage.

## 8. Testes e evidências

`tests/audit-events.test.mjs` contém testes unitários com cliente Supabase simulado. Eles cobrem catálogo, ator TI, timestamp do banco, metadados, validações e falha fechada; não substituem a validação do PostgreSQL real.

O script `tests/sql/issue-102-audit-events.integration.sql` foi ampliado para verificar, em transação revertida, RLS, policies, triggers, grants, catálogo, metadados e tentativas negativas de INSERT, UPDATE, DELETE e TRUNCATE como role `authenticated`. O script foi executado contra Polyford em 24/11/2026 e concluiu sem erro. O teste positivo de INSERT TI continua pendente porque o projeto não possui usuários nem perfis.

**CI:** os workflows #354 e #284 concluíram com `success` no head anterior `94423d26026fdc2f3a1285db2c6bb40be913f5c1`. Esses resultados não são atribuídos aos commits posteriores que atualizaram o teste SQL e este documento; os checks do head mais recente precisam ser consultados separadamente. O Preview Ready não comprova RLS, autenticação TI, integração funcional, backup ou restore.

**Limites de implementação:** a árvore `src/app` contém `layout.tsx` e `page.tsx`, sem handlers em `src/app/api`. `src/audit` contém o writer reutilizável, mas não há call sites em operações administrativas. A Issue #124, que cobre ações privilegiadas, permanece aberta e atribuída a Dante-Davi. Não criei handlers de produto nem dupliquei o trabalho dessa issue.

## 9. Estado das ADRs e governança

- ADR-003 registra Supabase + Vercel como stack vigente/Accepted.
- ADR-005 permanece Proposed e contém pontos de compatibilidade operacional ainda não harmonizados.
- ADR-008 permanece Proposed.
- ADR-010 permanece Proposed e registra aprovações institucionais de Segurança/Privacidade ainda pendentes.
- Q-025 permanece aberta.

Esta PR não altera ADRs, baseline, issues, ambientes, secrets, variáveis, políticas de branch ou configurações de backup.

## 10. Critérios de aceite — situação nesta entrega

| Critério original da #102 | Situação |
|---|---|
| Catálogo persistido e validado | Migration aplicada em Polyford; catálogo de 21 eventos conferido; INSERT positivo TI ainda pendente |
| Campos/metadados sem credenciais/conteúdo desnecessário | Validação recursiva e teste de metadados executados |
| Acesso exclusivo TI e negação a usuários comuns | Policies/ACL verificadas; INSERT sem identidade TI rejeitado; identidade TI real inexistente no projeto |
| Integridade e impossibilidade de alteração/exclusão por usuário comum | UPDATE/DELETE/TRUNCATE tentados como `authenticated` e rejeitados; triggers instalados; owner/superuser fora da fronteira |
| Política de retenção e descarte autorizado/auditado | Parcial; não existe fluxo integrado de autorização, preservação de investigação, descarte e evento atômico |
| Backups diários DB+anexos, 12 meses, restore RPO/RTO | Não comprovado; zero buckets Storage, plano/configuração não confirmados, sem restore/RPO/RTO medidos |
| Integração real Supabase/Vercel, testes, SQA/Tech Lead e evidências | Parcial; migration e SQL test executados; faltam handler/call sites, atomicidade, operação de retenção/backup e aprovações |

## 11. Limites da entrega

- Nenhuma issue foi fechada ou alterada.
- Nenhum critério original foi modificado.
- Nenhuma issue atribuída a outra pessoa foi alterada.
- Nenhuma ADR foi modificada.
- Polyford já estava `ACTIVE_HEALTHY` na consulta; não foi reativado.
- Nenhuma configuração de backup/Storage foi alterada.
- O script SQL de integração foi executado dentro de transação com `ROLLBACK`; não deixou registros de auditoria nem alterações de dados.
- Nenhum backup/restore foi simulado como evidência.
- A PR permanece Draft/Open para revisão do SQA e Tech Lead.
