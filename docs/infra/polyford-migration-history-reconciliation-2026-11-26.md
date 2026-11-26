# Reconciliação do histórico de migrations — Polyford

Data da consulta: 26/11/2026  
Projeto: Polyford (`oixifpdfvrenlhvycszy`)  
Ambiente: desenvolvimento

## Estado consolidado após as PRs #180 e #181

A reconciliação foi integrada pela [PR #180](https://github.com/Aluvioz/Polychat/pull/180), e a migration de Storage privado foi integrada separadamente pela [PR #181](https://github.com/Aluvioz/Polychat/pull/181). Após essas integrações, a `main` contém 18 arquivos SQL em `supabase/migrations/`, incluindo a migration `20261126131156_issue_115_private_attachment_bucket.sql`.

A consulta direta ao histórico remoto do Polyford registrou 18 versões correspondentes à sequência consolidada. As 17 versões anteriores à migration de Storage foram reconciliadas pela #180; a versão `20261126131156` foi entregue pela #181.

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
| `20261126131156` | `issue_115_private_attachment_bucket` |

## Alterações integradas pela PR #180

- Alinhou os cinco nomes locais aos identificadores remotos exatos, preservando integralmente o conteúdo SQL.
- Removeu a colisão entre os arquivos que usavam o prefixo `202611250001`.
- Adicionou `20261124210245_issue_102_audit_events.sql` como arquivo de ledger sem DDL. Essa versão foi aplicada historicamente no remoto por uma branch da PR #166, não merged; seu SQL original não foi reconstruído.
- A definição completa e reproduzível de `audit_events` permanece na migration canônica `20261125232432_issue_102_audit_retention_controls.sql`, que usa `CREATE TABLE IF NOT EXISTS`.

## Migration de Storage integrada pela PR #181

A versão `20261126131156_issue_115_private_attachment_bucket` provisiona o bucket `attachments` no Supabase Polyford de desenvolvimento:
- `public = false`;
- limite por objeto de 10.485.760 bytes (10 MiB);
- MIME permitido: `application/pdf` e `image/jpeg`;
- nenhuma policy de acesso direto foi criada em `storage.objects`;
- a consulta registrada encontrou zero objetos no bucket no momento da coleta.

A PR #185 integrou posteriormente o endpoint inicial server-side de upload, sem concluir download, links temporários, scanner/quarentena, quotas, descarte físico ou backup de objetos.

## Validação de instalação limpa

A instalação limpa combinada foi executada com sucesso no workflow da PR #180 — [execução #45856604234](https://github.com/Aluvioz/Polychat/actions/runs/45856604234):
- preparação de 18 arquivos de migration;
- inicialização de projeto Supabase local isolado;
- aplicação das 18 migrations em PostgreSQL descartável;
- conferência de `supabase migration list --local` com resultado **18/18**;
- encerramento da stack local ao final do job.

Essa execução comprova a instalação limpa local daquela sequência combinada; não altera nem comprova alteração do histórico remoto.

### Reexecução na PR #160

Na PR #160, o workflow de repetição [#45899085733](https://github.com/Aluvioz/Polychat/actions/runs/45899085733) falhou ao executar `supabase/setup-cli@v1` com `version: latest`: a ação não conseguiu resolver a release da CLI devido a `rate limit exceeded`. A falha ocorreu antes da inicialização da CLI, da criação do ambiente descartável e da aplicação de migrations. A etapa de limpeza também falhou porque o workspace ainda não existia após a etapa de preparação ser ignorada.

Portanto, essa execução não demonstra defeito nas migrations. A equipe de Desenvolvimento deve estabilizar a instalação da CLI (por exemplo, fixando uma versão testada em vez de resolver `latest`) e tornar a limpeza condicional à existência do workspace; em seguida, deve repetir o job e registrar resultado verde com 18/18. A ação `supabase/setup-cli@v1` documenta também o input opcional `github-token`, justamente para resolver `latest` sem depender do limite não autenticado. A equipe pode utilizá-lo com `${{ github.token }}` ou, alternativamente, fixar uma versão validada da CLI.

## Segurança e limites das operações remotas

- Não houve `db push`, `migration repair` nem reset no Polyford remoto durante a reconciliação.
- A instalação limpa com `supabase db reset --local` ocorreu somente em PostgreSQL local descartável no workflow.
- Nenhum registro do histórico remoto foi removido, reparado ou reescrito.
- Nenhuma migration histórica foi reaplicada no projeto remoto.
- O arquivo de ledger não pretende reconstruir o DDL histórico indisponível de `20261124210245`; a migration canônica de #102 mantém a criação reproduzível.

## Estado do Supabase consultado

- Projeto: `ACTIVE_HEALTHY`, PostgreSQL 17.11.0.019, região `sa-east-1`.
- Os seis índices da migration `20261125233227` foram encontrados em `pg_indexes`.
- As tabelas de domínio consultadas estavam sem registros no momento da verificação.
- A consulta sobre o bucket `attachments` encontrou-o privado, com allowlist PDF/JPEG, limite de 10 MiB e zero objetos na coleta.
- Esta documentação registra evidência de desenvolvimento; não declara homologação da FORD, backup/restore comprovados ou prontidão de produção.
