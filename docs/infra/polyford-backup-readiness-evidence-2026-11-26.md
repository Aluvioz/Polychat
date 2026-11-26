# Evidências técnicas — backup e recuperação do Polyford

**Data da coleta:** 26/11/2026  
**Finalidade:** responder ao apontamento SQA da PR #182.  
**Escopo:** leitura de metadados/configuração e consultas somente leitura. Nenhum segredo foi descriptografado ou registrado; nenhum recurso foi alterado.

## 1. Supabase — organização e projeto

Consultas realizadas pela integração Supabase:

- Organização: `Polychat` (`hxxubdxlmyqbfurgztjb`).
- Plano retornado pelo endpoint de organização: `free` (`tier_free`).
- Projeto: `Polyford` (`oixifpdfvrenlhvycszy`).
- Estado: `ACTIVE_HEALTHY`.
- Região: `sa-east-1`.
- PostgreSQL: `17.11.0.019` (engine 17).

A evidência do plano é o campo `plan=free` retornado pela consulta da organização; o estado saudável do projeto não é tratado como evidência de backup.

## 2. Supabase Storage — bucket attachments

Consulta SQL somente leitura executada no projeto `oixifpdfvrenlhvycszy`:

```sql
select
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  (
    select count(*)
    from storage.objects o
    where o.bucket_id = b.id
  ) as object_count
from storage.buckets b
where id = 'attachments';
```

Resultado observado:

| Campo | Resultado |
|---|---|
| id / name | `attachments` |
| public | `false` |
| file_size_limit | `10485760` bytes (10 MiB) |
| allowed_mime_types | `application/pdf`, `image/jpeg` |
| object_count | `0` |

Consulta adicional de políticas:

```sql
select count(*) as policy_count
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects';
```

Resultado: `policy_count = 0` no momento da coleta. A consulta contabiliza as policies da tabela `storage.objects`; não afirma nada além desse escopo.

## 3. Vercel — projeto e variáveis

Projeto consultado: `polyford` (`prj_HocjZ4Z35s7R2qGHMHMFvg2LyKbY`), framework `nextjs`.

A listagem de variáveis foi feita com descriptografia desabilitada (`decrypt=false`). Foram retornados os seguintes nomes e alvos:

| Variável | Classificação retornada | Targets |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | plain | production, preview, development |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | encrypted | production, preview, development |
| `SUPABASE_SECRET_KEY` | sensitive / secret | production, preview, development |
| `SUPABASE_ACCESS_TOKEN` | sensitive / secret | production, preview, development |

Os valores das variáveis secretas não foram solicitados/descriptografados, copiados ou incluídos nesta evidência. A existência/configuração de uma variável não comprova, por si só, que seu uso seja necessário ou de menor privilégio; essa revisão permanece com TI/Tech Lead.

## 4. Deployment de produção

Consulta de deployments filtrada por `target=production` para o projeto `polyford`. O deployment de produção mais recente retornado na coleta foi:

- Deployment ID: `dpl_52KGAm3n4ndu46mUS1qA4Fcu8kPi`.
- URL: [polyford-77y20gd3f-polychat1.vercel.app](https://polyford-77y20gd3f-polychat1.vercel.app).
- Target: `production`.
- Estado: `READY`.
- Branch: `main`.
- Commit: `3329ffbc0cfd5a17ad3f22081a96dfc344d62c98`.
- Mensagem do commit: merge da PR #170 (auditoria privilegiada).

O deployment Preview associado à PR #182 não foi confundido com produção. Um deployment `READY` confirma o estado de publicação reportado pela Vercel, não backup, restore ou prontidão operacional.

## 5. Workflow e ausência de rotina de backup

Foram inspecionadas as execuções de CI do commit atualizado da PR #182:

- [CI — run 45862298339](https://github.com/Aluvioz/Polychat/actions/runs/45862298339): job `build`; passos observados: checkout e scripts de build/validação.
- [CI — run 45862298557](https://github.com/Aluvioz/Polychat/actions/runs/45862298557): job `Lint, typecheck and build`; passos observados: instalação de dependências, testes automatizados, ESLint, TypeScript, build Next.js e smoke test.

Ambas as execuções terminaram com sucesso. Nos passos dos jobs consultados não há etapa de exportação/backup do banco, cópia de objetos Storage, retenção, verificação de cópia ou restauração. A documentação do repositório também descreve o CI como testes, lint, typecheck e build.

Conclusão limitada à evidência consultada: **as execuções/workflows de CI inspecionados não demonstram uma rotina automatizada de backup/restore**. Isso não prova que nenhum processo externo, manual ou administrado por outro sistema exista; não foi feita essa afirmação.

## 6. Limites e reprodutibilidade

- As consultas Supabase foram somente leitura.
- A listagem Vercel usou `decrypt=false`; nenhum valor secreto foi revelado.
- Nenhuma variável, deployment, bucket, policy, objeto, migration ou dado foi alterado.
- Não foi configurado fornecedor/destino de backup.
- Não foi executado restore.
- Não foram produzidas cópias de banco ou Storage.
- RPO, RTO e retenção de 365 dias continuam não comprovados.

Esta evidência complementa a avaliação de backup/restore da PR #182; não altera critérios da Issue #130 e não declara a continuidade atendida.
