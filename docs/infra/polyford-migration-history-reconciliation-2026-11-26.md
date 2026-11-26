# Reconciliação do histórico de migrations — Polyford

Data da consulta: 26/11/2026  
Projeto: Polyford (`oixifpdfvrenlhvycszy`)  
Ambiente: desenvolvimento

## Estado remoto observado

O histórico remoto contém 18 migrations após a aplicação da migration privada de anexos da #115. Esta PR reconcilia as 17 versões anteriores; a versão `20261126131156_issue_115_private_attachment_bucket` está versionada separadamente na PR #181. A correspondência integral local/remota será obtida quando ambas as PRs forem integradas. As versões e nomes foram consultados diretamente no histórico remoto do projeto.

## Alterações locais desta PR

- Renomeia os arquivos de profiles, schema inicial #99, integridade #99, auditoria privilegiada #124 e índices #99 para usar exatamente as versões registradas no banco remoto.
- Remove a colisão entre os dois arquivos que usavam o prefixo `202611250001`.
- Adiciona `20261124210245_issue_102_audit_events.sql` como arquivo de ledger sem DDL. Essa versão foi aplicada no remoto por uma branch da PR #166, não merged. O conteúdo original não está na `main`; não foi reconstruído. A migration canônica `20261125232432_issue_102_audit_retention_controls.sql` cria `audit_events` com `CREATE TABLE IF NOT EXISTS` e é responsável por reproduzir a tabela em instalação limpa.

## Segurança e limites

- Esta branch contém 17 arquivos para 17 versões históricas anteriores à migration de Storage. A única versão remota ainda ausente nesta branch é `20261126131156`, coberta pela PR #181; não se trata de uma versão sem arquivo no conjunto combinado das duas PRs.

- Nenhum registro do histórico remoto foi removido, reparado ou reescrito.
- Nenhuma migration histórica foi reaplicada.
- Não foram executados `db reset`, `migration repair` ou `db push`.
- O conteúdo SQL dos cinco arquivos renomeados foi preservado integralmente; apenas o caminho do arquivo mudou.
- O arquivo de ledger vazio não pretende reproduzir o DDL histórico não disponível. A sequência de instalação limpa depende da migration canônica posterior de #102.

## Validação exigida antes do merge

1. Conferir `supabase migration list` em clone limpo e confirmar correspondência das versões locais/remotas.
2. Executar `supabase db reset` somente em banco local descartável e confirmar que todas as migrations da `main` constroem o schema completo.
3. Comparar o schema local resultante com as definições esperadas e executar os testes SQL versionados.
4. Não executar reset no projeto Polyford remoto.

## Estado do Supabase consultado

- Projeto: `ACTIVE_HEALTHY`, PostgreSQL 17.11.0.019, região `sa-east-1`.
- Os seis índices da migration `20261125233227` foram encontrados em `pg_indexes`.
- As tabelas de domínio consultadas estavam sem registros.
- Esta PR trata apenas da reconciliação do histórico Git; não altera o schema remoto.
