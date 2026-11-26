# Polyford — avaliação de backup, restauração e ambientes

Data da verificação: 26/11/2026  
Supabase project: `oixifpdfvrenlhvycszy` (Polyford, desenvolvimento)  
Vercel project: `polyford`

## 1. Requisito vigente

A baseline FORD v2 registrada na Issue #130 exige:
- backup diário do banco e dos anexos;
- retenção de 12 meses;
- RPO de até 24 horas em desastre/falha de infraestrutura;
- RTO de até 24 horas;
- teste de restauração e evidência operacional.

Esta avaliação não altera os parâmetros de produto.

## 2. Estado comprovado em 26/11/2026

### Supabase

- Projeto `Polyford`: `ACTIVE_HEALTHY`, PostgreSQL 17.11.0.019, região `sa-east-1`.
- Organização Supabase `Polychat`: plano `Free`.
- Bucket `attachments`: privado, 10 MiB por objeto, MIME PDF/JPEG.
- Bucket sem objetos na consulta; ainda não há arquivos para backup.
- O projeto Free não dispõe de backups automáticos diários do serviço. A documentação oficial do Supabase orienta projetos Free a exportarem os dados regularmente com `supabase db dump` e manterem cópias off-site.
- Backups do banco Supabase não incluem os objetos enviados pela Storage API. A recuperação dos anexos exige estratégia separada para os objetos e seus metadados.

Referências oficiais:
- https://supabase.com/docs/guides/platform/backups
- https://supabase.com/docs/guides/storage/buckets/fundamentals

### Vercel

- Projeto `polyford`, framework Next.js.
- Há deployment de produção associado à `main`, commit `3329ffbc0cfd5a17ad3f22081a96dfc344d62c98`, estado `READY`.
- O deployment mais recente consultado é de branch Preview; não deve ser confundido com o deployment de produção.
- Variáveis Supabase configuradas para Production, Preview e Development: URL pública, publishable key, secret key e `SUPABASE_ACCESS_TOKEN`.
- `SUPABASE_ACCESS_TOKEN` é sensível e não foi encontrado em referências do código da `main` nem em `.env.example`. Sua necessidade operacional e menor privilégio devem ser revisados pela equipe; esta avaliação não removeu nem rotacionou credenciais.
- O workflow GitHub Actions versionado executa testes, lint, typecheck, build e smoke test; não há etapa de backup/restauração nesse workflow.
- Os valores secretos de Vercel não foram lidos nem registrados.

## 3. Lacunas objetivas

| Controle | Estado |
|---|---|
| Backup automático diário do banco pelo plano Supabase atual | Não disponível no plano Free |
| Exportação lógica diária externa do banco | Não configurada/evidenciada |
| Cópia externa dos objetos Storage | Não configurada/evidenciada |
| Retenção de 365 dias | Não configurada/evidenciada |
| Criptografia e localização do destino off-site aprovadas pela FORD | Pendente de definição/homologação |
| Monitoramento de sucesso/idade das cópias | Não configurado/evidenciado |
| Restauração isolada de banco | Não testada nesta revisão |
| Restauração de objetos e conferência com metadados | Não testada; bucket sem objetos |
| RPO <= 24h | Não demonstrado |
| RTO <= 24h | Não demonstrado |

**Conclusão:** a exigência de continuidade não está atendida nem comprovada no ambiente atual. O estado `ACTIVE_HEALTHY` do banco e um deployment `READY` não são evidência de backup ou restauração.

## 4. Plano técnico necessário — sem escolher fornecedor por inferência

1. TI/FORD deve aprovar o destino off-site, região/localização, controle de acesso, criptografia, retenção imutável ou protegida contra exclusão e responsabilidade operacional, considerando Q-025.
2. Configurar exportação diária do banco em ambiente de execução controlado, usando credencial de menor privilégio adequada e sem expor segredos em logs ou no bundle cliente.
3. Configurar cópia diária dos objetos do bucket privado para o destino off-site; registrar identificador do objeto, checksum, tamanho, MIME e referência de origem para permitir consistência entre banco e Storage.
4. Aplicar retenção de 365 dias, com ciclo de descarte aprovado e trilha auditável.
5. Monitorar horário da última cópia bem-sucedida, duração, tamanho, checksum, falhas e alertas; escalar falha antes de exceder 24 horas.
6. Executar teste de restauração em ambiente isolado, sem sobrescrever Polyford ou produção. Restaurar banco e objetos, verificar relações/consistência, medir o ponto de recuperação e o tempo total.
7. Repetir o ensaio periodicamente e após mudanças relevantes no mecanismo de backup; registrar executor, data, cópia, ponto restaurado, duração, falhas e reteste.

A migração para plano pago Supabase poderia habilitar backups automáticos do banco, mas a retenção padrão documentada é inferior a 12 meses e não cobre objetos Storage. Portanto, upgrade isolado não satisfaz o requisito integral.

## 5. Bloqueios para execução real

Não foi configurado destino externo porque não há fornecedor/localização aprovado pela FORD, credenciais de destino, política de retenção técnica nem autorização de custo registrados no contexto consultado. Não foi executado restore porque não existe cópia comprovada a restaurar. Não foi criado workflow agendado que pudesse produzir cópias sem destino e credenciais aprovados.

## 6. Resultado

- Estado Supabase e Vercel consultado e registrado.
- Lacuna de backups automáticos no plano Free identificada.
- Separação entre backup de banco e backup de objetos Storage documentada.
- RPO/RTO e restauração permanecem **não comprovados**.
- Issue #130 permanece aberta e sem declaração de prontidão para release.


## 7. Evidências técnicas verificáveis — complemento SQA (26/11/2026)

As consultas e os resultados sanitizados que sustentam as informações desta avaliação foram registrados em [polyford-backup-readiness-evidence-2026-11-26.md](polyford-backup-readiness-evidence-2026-11-26.md). O complemento contém:
- plano e identificação do projeto Supabase;
- consulta SQL e resultado do bucket `attachments`, incluindo contagem de objetos e policies;
- nomes e targets das variáveis Vercel, coletados sem descriptografar valores;
- identificação, target, estado, branch e commit do deployment de produção;
- escopo da verificação do workflow/CI e limite da conclusão sobre ausência de rotina de backup/restore.

O documento de evidências não contém valores secretos. As consultas foram somente leitura e não modificaram Supabase ou Vercel.
