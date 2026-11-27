# Issue #99 — evidências de implementação e estado verificado

## Escopo original preservado

A Issue #99 solicita modelar `profiles`, `conversations`, `memberships`, `messages`, `attachments`, `audit_events` e configurações.

Seu escopo original permanece:
- Implementar conforme arquitetura Supabase + Vercel e requisitos aprovados.
- Validar autorização server-side e comportamento de erro.
- Atualizar documentação e evidências pertinentes.

Os critérios de aceite originais permanecem inalterados:
- Migrations versionadas; constraints, índices e relações revisados.
- Testes relevantes automatizados ou evidência documentada.
- Revisão por PR concluída.
- Sem regressão nos fluxos relacionados.

Este arquivo registra evidências e limites. Não altera nem substitui os requerimentos de fechamento, não declara a Issue #99 concluída e não transfere responsabilidades de outras issues.

## 1. Modelagem e migrations versionadas na main

A implementação do schema físico inicial foi integrada pela [PR #165](https://github.com/Aluvioz/Polychat/pull/165), merge commit `f2618bc670282070f87a8f1dd645253c8de9990e`.

A PR #165 recebeu:
- Aprovação técnica do Tech Lead `luizme7`, incluindo as estruturas específicas de configuração.
- Aprovação SQA de `Dante-Davi`, registrada na discussão da PR em 24/11/2026.
- Registro de CI #270 e #340 como aprovados no parecer técnico da PR.

Migrations de domínio integradas:
- `supabase/migrations/202611240001_issue_99_initial_domain_schema.sql`
  - Acrescenta `profiles.username` como nullable, com índice único parcial.
  - Cria `conversations`, `memberships`, `messages`, `attachments`, `message_reads` e `security_alerts`.
  - Define chaves estrangeiras, constraints e índices.
  - Habilita RLS nas tabelas novas, sem criar policies de domínio da #101.
- `supabase/migrations/202611240002_issue_99_integrity_and_configuration.sql`
  - Inclui invariantes transacionais para impedir mensagem sem texto e sem anexo.
  - Impõe o limite de cinco anexos por mensagem.
  - Cria `detection_rules`, `attachment_user_quotas` e `attachment_storage_capacity`, conforme o inventário aprovado.
  - Não cria tabela genérica de configurações nem inventa valores iniciais.

A aprovação da PR #165 cobre o conteúdo nela revisado. Não equivale à conclusão das integrações funcionais, das policies de autorização da #101 ou da auditoria operacional da #102.

## 2. Modelo conceitual e aprovação de produto

O parecer complementar do PO de 20/11/2026 ratificou o escopo conceitual para a baseline POLY-REQ-001 v0.5, incluindo as entidades centrais, `security_alerts`, `message_reads` e o inventário delimitado de configurações.

A atualização do documento `docs/database/modelo-de-dados.md` foi integrada pela [PR #160](https://github.com/Aluvioz/Polychat/pull/160), mesclada em 26/11/2026 após aprovação do Tech Lead. A PR trata exclusivamente da atualização documental para a baseline v0.5. Essa integração confirma a documentação conceitual na main, mas não equivale à aprovação do schema físico, DDL ou migrations.

A aprovação funcional do PO não deve ser confundida com aprovação técnica do DER físico, DDL, migrations, constraints, índices, triggers ou RLS. A revisão técnica e SQA do schema físico foi registrada separadamente na PR #165.

## 3. Verificação direta do Supabase de desenvolvimento Polyford

Consulta realizada ao projeto Supabase:
- Projeto: `Polyford`.
- Project ref: `oixifpdfvrenlhvycszy`.
- Região: `sa-east-1`.
- Estado consultado: `ACTIVE_HEALTHY`.
- PostgreSQL: `17.11.0.019` (engine PostgreSQL 17).

### 3.1 Histórico remoto de migrations — reconciliado em 26/11/2026

A consulta inicial abaixo registrou as 17 versões remotas existentes antes da aplicação da migration de Storage da #115. Trata-se de uma fotografia histórica, complementada pela atualização pós-merge logo após a tabela:

| Versão remota | Nome |
|---|---|
| `20261124191059` | `profiles_roles_and_account_status` |
| `20261124191114` | `issue_99_initial_domain_schema` |
| `20261124191131` | `issue_99_integrity_and_configuration` |
| `20261124210245` | `issue_102_audit_events` |
| `20261125222249` | `issue_124_privileged_audit` |
| `20261125231700` | `issue_101_domain_rls` |
| `20261125232036` | `issue_101_profile_privilege_hardening` |
| `20261125232106` | `issue_101_direct_conversation_ids` |
| `20261125232432` | `issue_102_audit_retention_controls` |
| `20261125232535` | `issue_102_remove_unverified_config_triggers` |
| `20261125232700` | `issue_102_preserve_held_resource_audit_events` |
| `20261125233102` | `issue_102_discard_audit_event_invoker` |
| `20261125233227` | `issue_99_fk_covering_indexes` |
| `20261125233344` | `issue_102_serialize_retention_discard` |
| `20261125233603` | `issue_102_lock_event_and_resource_holds` |
| `20261125233806` | `issue_102_audit_index_and_policy_tuning` |
| `20261125234105` | `issue_101_hide_ti_check_definer` |

A PR #180 foi integrada à `main` e alinhou os cinco nomes locais que tinham prefixos diferentes aos identificadores remotos exatos, preservando integralmente o conteúdo SQL. Também removeu a colisão local em que as migrations #124 e #99 usavam o mesmo prefixo `202611250001`.

A versão remota `20261124210245` foi aplicada historicamente por uma branch da PR #166, que não foi merged. Seu conteúdo SQL original não está disponível na `main`. Para que o histórico local possa representar a versão remota sem reaplicar DDL, foi adicionado um arquivo de ledger sem operações SQL nessa versão. A definição canônica e reproduzível de `audit_events` está em `20261125232432_issue_102_audit_retention_controls.sql`, que usa `CREATE TABLE IF NOT EXISTS` e constrói a estrutura completa em instalação limpa.

Nenhum `db push`, `migration repair` ou reset foi executado no Polyford remoto. A reconciliação dos arquivos não alterou o histórico remoto nem reaplicou migrations já executadas. Separadamente, a instalação limpa foi validada somente em PostgreSQL local descartável pelo workflow bem-sucedido da PR #180; a validação local não deve ser confundida com uma operação no ambiente remoto.
 
### 3.2 Tabelas, colunas, relações e RLS observadas

A consulta de leitura ao schema `public` retornou as seguintes tabelas:

| Tabela | Evidência observada |
|---|---|
| `profiles` | PK `id`, FK para `auth.users`, `role` limitado a `user`/`ti`, `is_active`, `username` nullable. |
| `conversations` | PK `id`, tipo `direct`/`group`, estado `active`/`disabled`/`closed`, referências aos perfis criador e participantes diretos. |
| `memberships` | PK `id`, FKs para conversa e perfis, datas de início/fim de participação. |
| `messages` | PK `id`, FKs para conversa, autor e responsáveis por edição/exclusão administrativa; corpo pode ser nulo conforme a regra de mensagem com anexos. |
| `attachments` | PK `id`, FK para mensagem, MIME limitado a PDF/JPEG, tamanho positivo até 10 MiB e metadados de análise. |
| `message_reads` | PK composta `(message_id, reader_profile_id)`, FK para mensagem e perfil leitor. |
| `security_alerts` | PK `id`, FK para mensagem e revisor, severidade `low`/`medium`/`high`, estado `open`/`closed`. |
| `detection_rules` | PK `id`, valor de regra não vazio. |
| `attachment_user_quotas` | PK/FK `profile_id`, quota positiva. |
| `attachment_storage_capacity` | PK `singleton_id`, capacidade positiva e singleton limitado a 1. |
| `audit_events` | PK `id`, FK do ator para `profiles`, catálogo fechado de eventos/recursos e metadados JSONB. |

A listagem detalhada confirmou RLS habilitada nas onze tabelas acima, além das chaves primárias e relações/FKs indicadas. A consulta retornou zero linhas em cada tabela no momento da verificação; isso descreve o estado observado, não é teste de fluxo de negócio.

As policies de domínio e configuração foram integradas posteriormente pela PR #172, no escopo da Issue #101. A RLS habilitada e as policies aprovadas não significam que todos os handlers e fluxos funcionais da aplicação estejam concluídos.

### 3.3 Situação específica de audit_events

A tabela `public.audit_events` e a versão remota histórica `20261124210245` permanecem no Polyford. A PR #166 foi encerrada sem merge; por isso, seu conteúdo SQL original não foi incorporado à `main`. A definição completa e reproduzível de `audit_events` está versionada na migration `20261125232432_issue_102_audit_retention_controls.sql`, com criação idempotente. A branch de reconciliação adiciona um arquivo de ledger sem DDL para representar a versão histórica remota, sem duplicar a criação da tabela.

## 4. Testes, CI e limites das evidências

### Evidências disponíveis para a #99
- Aplicação das duas migrations de domínio no Supabase Polyford registrada na PR #165.
- Consulta direta ao histórico remoto confirmou os dois registros de migration de domínio.
- Consulta direta ao schema `public` confirmou as tabelas, colunas, PKs, FKs e RLS listadas nesta nota.
- A revisão SQA da PR #165 aprovou o schema físico, constraints, FKs, índices, invariantes de mensagem/anexos, estruturas de configuração e evidências de aplicação.
- O parecer técnico da PR #165 registrou CI #270 e #340 como aprovados.

### Limites que permanecem explícitos
- A verificação direta do schema é evidência de presença/estrutura no ambiente de desenvolvimento; não é, por si só, teste automatizado reproduzível no CI.
- Não se declara nesta nota que a autorização de domínio/configuração está concluída: policies e enforcement pertencem à #101.
- A gravação de mensagem composta somente por anexos depende de mensagem e anexos serem persistidos na mesma transação/RPC. A migration contém a invariância diferida, mas a integração funcional do fluxo ainda depende das issues de produto correspondentes.
- `profiles.username` permanece nullable; não foi inventado preenchimento para contas existentes.
- A estrutura de `audit_events` está reproduzível a partir da migration integrada de retenção; isso não conclui os callsites funcionais de auditoria que permanecem no escopo da #102.
- A ADR-005 permanece Proposed e a Q-025 permanece aberta para avaliação da compatibilidade operacional da stack com as restrições FORD.

## 5. Relação com outras issues — sem transferência de escopo

- **#101:** policies RLS, matriz/enforcement de autorização e testes de acesso. A PR #172 integrou policies RLS e hardening de privilégios; a evidência registra 16/16 cenários aprovados. Não reabrir como pendência a implementação básica de policies, mas manter a validação dos handlers e fluxos reais que dependem delas.
- **#102:** auditoria, retenção e descarte; a definição canônica de `audit_events` está na migration integrada `20261125232432`; a versão remota histórica da PR #166 é representada por arquivo de ledger sem DDL.
- **#105:** fluxos de perfis/contas e operações associadas.
- **#111:** requisitos de leitura/não lidas refletidos por `message_reads`.
- **#117:** armazenamento privado e fluxos de anexos.
- **#124:** integração dos eventos aos fluxos de negócio, coordenada com a auditoria.

Esta separação descreve dependências e limites já registrados no projeto; não altera o escopo ou os critérios de aceite da Issue #99.

## 6. Estado documental desta revisão

Esta atualização corrige o registro anterior que ainda descrevia a PR #165 como não integrada e a aprovação SQA como pendente. O estado correto consultado é: PR #165 merged, Tech Lead aprovado e SQA aprovado.

A PR #160 foi mesclada em 26/11/2026; o modelo conceitual v0.5 está integrado à main. A PR #166 foi encerrada sem merge; a versão remota histórica é representada na sequência local por arquivo de ledger sem DDL, enquanto a definição canônica permanece na migration integrada de #102. A PR #180 já foi integrada e a migration do bucket da PR #181 também está na `main`.

**Conclusão desta nota:** há evidência documentada de migrations de domínio integradas e aplicadas, schema presente no Supabase de desenvolvimento e revisão técnica/SQA aprovada para a PR #165. Isso atualiza a rastreabilidade da Issue #99, mas não declara todos os critérios originais satisfeitos nem autoriza seu fechamento.

Nenhuma descrição, critério, estado, assignee ou label da Issue #99 foi alterado.

## Complemento — cobertura de índices de FKs e verificação persistente (26/11/2026)

A PR #168 foi integrada à `main` e adicionou a migration aditiva dos seis índices de cobertura. A verificação direta em 26/11/2026 consultou `pg_indexes` no projeto Polyford e confirmou que os seis índices estão **persistidos**:

| Tabela | Coluna | Índice observado |
|---|---|---|
| `conversations` | `direct_user_b_id` | `conversations_direct_user_b_idx` |
| `memberships` | `added_by_profile_id` | `memberships_added_by_profile_idx` |
| `memberships` | `ended_by_profile_id` | `memberships_ended_by_profile_idx` |
| `messages` | `edited_by_profile_id` | `messages_edited_by_profile_idx` |
| `messages` | `deleted_by_profile_id` | `messages_deleted_by_profile_idx` |
| `security_alerts` | `reviewed_by_profile_id` | `security_alerts_reviewed_by_profile_idx` |

A consulta de histórico remoto confirma a versão `20261125233227 — issue_99_fk_covering_indexes`. Portanto, a afirmação anterior de que os índices não estavam persistidos descrevia o teste transacional com ROLLBACK, não o estado atual consultado. A documentação é atualizada para distinguir essas duas evidências históricas.

O banco permanece sem linhas nas tabelas de domínio no momento da consulta. Por isso, a presença física dos índices está comprovada, mas não há carga de produção para avaliar seletividade ou ganho de desempenho. Os avisos de índice não utilizado não justificam remoção.

A Issue #99 continua sem declaração de fechamento nesta nota. A validação de estrutura e índices não substitui a validação dos fluxos funcionais de mensagens/anexos e as responsabilidades das issues relacionadas.


## 7. Atualização pós-merge das PRs #172, #173, #180, #181 e #185 — 26/11/2026

Esta seção complementa as fotografias históricas acima; não reescreve o que foi observado nas datas originais nem altera a Issue #99.

### 7.1 Sequência consolidada

Após a integração das PRs #180 e #181, a `main` contém 18 arquivos de migration, correspondentes às 18 versões remotas consultadas no Polyford de desenvolvimento. A migration `20261126131156_issue_115_private_attachment_bucket.sql` completa a sequência local com a fundação de Storage privado.

A instalação limpa combinada foi executada com sucesso no workflow da PR #180 — [execução #45856604234](https://github.com/Aluvioz/Polychat/actions/runs/45856604234) — em PostgreSQL local descartável: 18 migrations aplicadas e 18/18 entradas em `supabase migration list --local`. Essa execução não realizou `db push`, `migration repair` nem reset no Polyford remoto.

Registro histórico: o workflow de repetição da PR #160 [#45899085733](https://github.com/Aluvioz/Polychat/actions/runs/45899085733) falhou no setup de `supabase/setup-cli@v1` (`rate limit exceeded`) antes de inicializar o ambiente ou aplicar migrations. Esse resultado não representou falha de migration e foi superado pela validação posterior da PR #180, que executou instalação limpa das 18 migrations em PostgreSQL local descartável, com 18/18 entradas confirmadas. Não há execução pendente decorrente daquele erro.

### 7.2 Atualização da RLS e auditoria

A PR #172 integrou as policies RLS de domínio e configuração, hardening de privilégios e funções auxiliares no schema `private`. A evidência `docs/security/issue-101-rls-evidence.md` registra os testes transacionais de isolamento aprovados (16/16), com dados sintéticos revertidos. A RLS habilitada na migration inicial da #99 não deve ser descrita como ausência de policies após a integração da #172.

A PR #173 integrou a estrutura de auditoria e controles de retenção. Permanecem call-sites pendentes para eventos de consulta/exportação, anexos e alterações de configuração, bem como os limites operacionais de backup/restore documentados na PR #182.

### 7.3 Atualização de Storage e ciclo de anexos

A PR #181 integrou o bucket privado `attachments`, allowlist PDF/JPEG e limite de 10.485.760 bytes. A PR #185 integrou o upload inicial server-side. O documento `docs/storage/politica-anexos-e-antimalware.md` deve refletir POLY-STO-001 v0.3, que consolida as decisões de 10 MiB, até cinco arquivos por mensagem, seleção de JPEG da galeria, remoção de EXIF/GPS, recusa de PDF protegido por senha e liberação excepcional do TI autenticada/auditada.

A fundação atual não conclui download, links temporários/revogação, scanner/quarentena, quotas, descarte físico, backup de objetos nem a transação única de criação da mensagem com anexos. A Issue #99 não absorve essas entregas de outras frentes.

**Conclusão atualizada:** existe evidência de schema inicial, índices, RLS, auditoria/controles de retenção, histórico reconciliado, bucket privado e endpoint inicial de upload, cada um revisado dentro de seu escopo. Isso não declara a Issue #99 integralmente concluída, não autoriza seu fechamento e não transfere para ela o ciclo completo de anexos, as políticas operacionais de backup/restore ou a homologação da FORD.
