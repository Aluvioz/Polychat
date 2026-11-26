# Encaminhamento técnico ao Desenvolvimento — PR #160 e continuidade do modelo de dados

- **Documento:** POLY-DEV-HANDOFF-001
- **Data:** 26/11/2026
- **Origem:** Product Owner
- **Status:** Preparação para encaminhamento; não constitui aceite técnico, solicitação de revisão SQA ou aprovação do Tech Lead
- **Referências centrais:** [PR #160](https://github.com/Aluvioz/Polychat/pull/160), [POLY-DATA-001 v0.5](../database/modelo-de-dados.md), [POLY-STO-001 v0.3](../storage/politica-anexos-e-antimalware.md)

## 1. Objetivo do encaminhamento

Solicitar ao Desenvolvimento a estabilização do workflow de instalação limpa associado à PR #160 e a continuidade técnica do modelo de dados e do ciclo de anexos, respeitando as decisões funcionais consolidadas pelo PO e as entregas já integradas.

A PR #160 continua limitada ao arquivo `docs/database/modelo-de-dados.md`. Este documento e as harmonizações correlatas ficam em entrega documental separada, para não ampliar nem alterar o escopo da PR #160.

## 2. Bloqueio imediato — workflow da PR #160

**Evidência observada:** a execução [#45899085733](https://github.com/Aluvioz/Polychat/actions/runs/45899085733) do workflow `Supabase clean migration install`, no commit `c858c2dafaae0c6bf8a59b42b20301b965d98790`, falhou na etapa `supabase/setup-cli@v1`, configurada com `version: latest`, com a mensagem `Failed to resolve latest Supabase CLI release: rate limit exceeded`.

A falha ocorreu antes da inicialização da CLI, da criação do ambiente PostgreSQL descartável e da aplicação das migrations. As etapas de preparação, instalação e conferência foram ignoradas. A limpeza secundária falhou porque o diretório de trabalho não havia sido criado.

**Interpretação:** o log não comprova erro no SQL nem incompatibilidade do projeto remoto Supabase. Não houve tentativa de aplicar migrations nesta execução.

**Solicitação ao Desenvolvimento:**

1. Corrigir a resolução de `latest` usando o input documentado `github-token: ${{ github.token }}` em `supabase/setup-cli@v1`, ou fixar uma versão conhecida e compatível da CLI. A primeira opção é diretamente suportada pela action v1 e endereça a limitação de chamadas não autenticadas observada no log.
2. Tornar a limpeza segura quando o workspace descartável não tiver sido criado; a etapa não deve falhar apenas porque a preparação anterior foi interrompida.
3. Reexecutar o workflow no head atualizado da PR #160.
4. Registrar evidência de que as 18 migrations são aplicadas em PostgreSQL local descartável e que `supabase migration list --local` retorna **18/18**.
5. Preservar a separação entre teste local e ambiente remoto: não executar `db push`, `migration repair`, reset ou reaplicação de migrations no Polyford para corrigir esse check.

**Evidência anterior positiva:** a instalação limpa combinada já passou na execução [#45856604234](https://github.com/Aluvioz/Polychat/actions/runs/45856604234), associada à PR #180: 18 migrations aplicadas localmente e 18/18 entradas verificadas. A repetição da PR #160 deve voltar a ficar verde; a falha atual é de setup da CLI, não uma reprovação dessa sequência SQL.

## 3. Fotografia técnica que deve orientar a continuidade

As seguintes entregas já estão integradas e devem ser tratadas como base existente, sem solicitar sua reconstrução:

| Entrega | Estado registrado |
|---|---|
| PR #165 — schema inicial da #99 | Schema de domínio inicial integrado; revisão SQA e Tech Lead concluída no escopo da PR |
| PR #168 — índices de FKs | Seis índices integrados e persistência confirmada no Polyford de desenvolvimento |
| PR #172 — RLS e hardening | Policies RLS e hardening integrados; evidência registra 16/16 cenários transacionais aprovados |
| PR #173 — auditoria/retenção | Estrutura e controles centrais integrados; call-sites específicos ainda pendentes |
| PR #180 — reconciliação de migrations | Integrada; sequência local alinhada |
| PR #181 — Storage privado | Bucket `attachments` provisionado no Polyford, privado, PDF/JPEG, 10 MiB |
| PR #185 — upload inicial | Endpoint server-side inicial integrado; não representa ciclo completo de anexos |

A sequência atual contém 18 arquivos locais de migrations e 18 versões remotas correspondentes, segundo as evidências documentadas. A instalação limpa local 18/18 foi aprovada em execução anterior; a execução atual da PR #160 precisa repetir a verificação após a estabilização da CLI.

## 4. Continuidade técnica — anexos e integração com mensagens

A política funcional vigente está consolidada em POLY-STO-001 v0.3 e POLY-DATA-001 v0.5. O Desenvolvimento deve propor e implementar a solução técnica sem reabrir decisões de produto:

- Formatos permitidos: PDF e JPEG.
- Limite inclusivo por arquivo: **10 MiB (10.485.760 bytes)**.
- Máximo de **cinco arquivos por mensagem**.
- Quotas individuais e capacidade total administradas pelo TI; sem quota por conversa.
- JPEG selecionado da galeria; remoção de EXIF/GPS.
- PDF protegido por senha recusado.
- Antimalware executado na infraestrutura da FORD; falha, timeout ou resultado inconclusivo mantêm o arquivo bloqueado (*fail closed*), sem impedir envio de mensagens textuais.
- Liberação excepcional pelo TI somente por ação autenticada e auditada, preservando o resultado original do scanner.
- Download condicionado à autorização vigente, com links temporários de até cinco minutos e revogação de acesso após remoção de participante.

**Itens técnicos ainda sem evidência de conclusão ponta a ponta:**

1. Download autorizado e emissão de links temporários, com verificação de membership/role no servidor e revogação efetiva.
2. Integração do scanner interno da FORD, quarentena, estados e tratamento seguro de falha/inconclusão.
3. Validação de PDF protegido por senha e remoção efetiva de EXIF/GPS.
4. Aplicação de quotas individuais e capacidade total configuradas pelo TI.
5. Fluxo transacional/coordenado para criação da mensagem e persistência dos anexos, preservando a regra de que mensagem pode conter somente anexos válidos, mas nunca ficar vazia.
6. Exclusão física controlada dos objetos, retenção e trilha de auditoria associada.
7. Backup e restauração dos objetos Storage, coordenados com a estratégia de backup/restore de banco; as evidências da PR #182 não demonstram backup diário, off-site, retenção de 365 dias ou restore com RPO/RTO de até 24 horas.

O detalhamento técnico, a decomposição em entregas e a ordem de implementação devem ser propostos pelo Desenvolvimento e validados pelo Tech Lead/SQA conforme suas responsabilidades. Dependências de infraestrutura, Segurança, TI e aprovação institucional devem ser explicitadas, não presumidas como resolvidas pela equipe de implementação.

## 5. Limites e decisões que devem ser preservados

- Stack definida do projeto: **Supabase + Vercel**. A ADR-003 Accepted não deve ser reclassificada nem substituída por inferência.
- Q-025 permanece aberta para avaliar a compatibilidade da configuração e do modelo de uso com as restrições da FORD; não declarar a questão resolvida sem evidências e decisão formal.
- ADR-005 e ADR-008 permanecem **Proposed** até revisão/decisão arquitetural própria.
- O aceite funcional do PO sobre POLY-DATA-001 v0.5 e POLY-STO-001 v0.3 não aprova schema físico, DDL, RLS, funções privilegiadas, migrations, desenho do scanner, infraestrutura ou homologação.
- Não tratar o bucket privado ou o endpoint inicial de upload como ciclo de anexos concluído.
- Não executar ações destrutivas/remotas no Supabase como parte da correção do workflow.
- Este encaminhamento não altera critérios, estado, assignees, labels ou comentários de issues.

## 6. Critérios para retorno ao PO

O Desenvolvimento deve devolver:

- link para a execução verde do workflow no head revisado da PR #160;
- versão da CLI fixada/validada e justificativa técnica da escolha;
- confirmação de 18/18 migrations aplicadas em ambiente local descartável;
- lista das entregas técnicas pendentes de anexos e integração com mensagens, com dependências e evidências esperadas;
- indicação explícita de quais itens exigem decisão de Tech Lead, SQA, TI, Segurança ou FORD.

Após o retorno técnico, o PO poderá seguir com o fluxo de revisão da PR #160: SQA e, posteriormente, Tech Lead. A solicitação técnica aqui descrita não substitui essas revisões.
