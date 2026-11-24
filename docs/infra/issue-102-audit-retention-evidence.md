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
| Testes | Existem testes unitários do módulo de autorização; não havia testes de auditoria | `tests/authorization.test.mjs` | Novos testes unitários escritos; integração PostgreSQL/Supabase permanece pendente |

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

A migration:

- Habilita RLS em `audit_events`.
- Permite SELECT somente quando `public.is_active_ti()` é verdadeiro.
- Permite INSERT somente para o operador autenticado cujo `actor_profile_id` corresponde a `auth.uid()` e que é TI ativo.
- Não concede UPDATE ou DELETE aos papéis da API.
- Usa trigger para rejeitar UPDATE, DELETE e TRUNCATE.
- Sobrescreve `occurred_at` com o relógio do banco.
- Rejeita chaves de metadados sensíveis também em objetos JSON aninhados.

**Limite de integridade:** o mecanismo impede mutações pelos papéis de aplicação cobertos, mas não torna a tabela absolutamente imutável contra owner/superuser, alteração de schema, remoção de trigger ou intervenção administrativa no banco. A proteção efetiva depende também da segregação de privilégios operacionais e do controle de acesso ao projeto.

O acesso à tabela via Data API depende da configuração de exposição de schemas do projeto. A migration não altera essa configuração.

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

### 7.1 Limitações verificadas

- O projeto Supabase `Polyford` retornou status `INACTIVE` na consulta desta execução. Não foi reativado.
- O plano contratado e as configurações atuais de backup não foram confirmados.
- A documentação oficial do Supabase informa que backups diários automáticos são oferecidos nos planos Pro, Team e Enterprise, com janelas documentadas de 7, 14 e até 30 dias, respectivamente. Isso não comprova retenção de 12 meses.
- A documentação oficial também informa que objetos do Storage API não são incluídos nos backups do banco. Portanto, o backup dos metadados não cobre os anexos binários.
- Não há destino de backup de 12 meses aprovado/documentado nesta execução.
- A ADR-005 continua Proposed e a Q-025 permanece aberta para compatibilidade operacional. A ADR-008 também permanece Proposed para Storage.
- Nenhuma configuração de backup, Storage, retenção ou infraestrutura foi alterada.

Referência oficial: [Supabase — Database Backups](https://supabase.com/docs/guides/platform/backups).

### 7.2 Evidências ainda necessárias

| Evidência | Estado |
|---|---|
| Plano Supabase e janela real de backups | Não verificado |
| Backup diário do banco habilitado | Não verificado |
| Backup diário dos objetos anexos | Não configurado/comprovado |
| Retenção de 12 meses | Não configurada/comprovada |
| Processo de descarte de cópias após o ciclo | Não implementado/comprovado |
| Backup identificado por data/ambiente | Pendente |
| Restauração controlada em ambiente isolado | Não executada |
| Integridade pós-restauração | Não testada |
| Medição de RPO | Não executada |
| Medição de RTO | Não executada |

Não foi executada restauração, nem alteração destrutiva no ambiente. O projeto está ativo, mas isso não comprova que backups estejam habilitados ou que um restore tenha sido testado. A validação exige plano/backup acessível e ambiente isolado de restauração.

## 8. Testes e evidências

Foi adicionado `tests/audit-events.test.mjs`, cobrindo:

- Catálogo de eventos.
- Registro com operador TI validado.
- Timestamp gerado no banco, não pelo cliente.
- Ausência de justificativa obrigatória nos três eventos definidos pelo PO.
- Rejeição de ator ausente, inativo ou não TI.
- Rejeição de evento/recurso inválido.
- Rejeição de chaves sensíveis em metadados aninhados.
- Falha fechada quando o INSERT falha ou lança exceção.

Esses testes são unitários com cliente Supabase simulado. Não comprovam RLS, triggers, privilégios, integração real ou backup.

**CI executado:** workflow [run 45407475573](https://github.com/Aluvioz/Polychat/actions/runs/45407475573) concluiu com sucesso no commit `c7823b5093bf0b37b3ece65d0656853bac8cfc7b`. O log registra 32 testes aprovados (32 pass, 0 fail), ESLint, TypeScript, build Next.js e smoke test HTTP da página inicial aprovados. Isso valida o código Node/Next incluído no workflow, não as migrations SQL, RLS, triggers, integração hospedada ou backups.

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
| Catálogo persistido e validado | Migration e catálogo versionados; aplicação e validação PostgreSQL pendentes |
| Campos/metadados sem credenciais/conteúdo desnecessário | Proteções no writer e trigger implementadas; testes reais pendentes |
| Acesso exclusivo TI | Policy RLS versionada; teste Supabase real pendente |
| Integridade e impossibilidade de alteração/exclusão por usuário comum | Grants/policies/triggers versionados; teste real pendente |
| Retenção e descarte autorizado/auditado | Parcial; sem rotina de descarte e fluxo de autorização integrado |
| Backup diário DB+anexos, 12 meses, restore RPO/RTO | Não atendido; dependência operacional e ambiente INACTIVE |
| Integração real Supabase/Vercel, testes, SQA/Tech Lead e evidências por ambiente | Não atendido; runtime ainda sem handlers funcionais e projeto Supabase INACTIVE |

## 11. Limites da entrega

- Nenhuma issue foi fechada ou alterada.
- Nenhum critério original foi modificado.
- Nenhuma issue atribuída a outra pessoa foi alterada.
- Nenhuma ADR foi modificada.
- Nenhum ambiente foi reativado ou configurado.
- Nenhum backup/restore foi simulado como evidência.
- PRs permanecem abertas para revisão do Tech Lead e SQA.
