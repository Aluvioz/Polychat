# Issue #98 — Auditoria de deploy Preview, produção e rollback

**Data da auditoria:** 18/11/2026  
**Base inspecionada:** `main` — `3e749397ff535d81fb3bfb055a127120515752e2`  
**Branch desta documentação:** `docs/issue-98-deploy-rollback-audit`  
**Estado atual:** Issue #98 encerrada como concluída em 19/11/2026, com base em confirmação expressa do Tech Lead sobre validação do deployment hospedado, smoke tests, ensaio de rollback, produção/domínio/HTTPS e fluxos relacionados. O corpo principal abaixo preserva a auditoria de 18/11/2026, quando esses itens ainda não tinham evidência disponível nesta sessão. A atestação posterior não equivale a nova auditoria administrativa independente.

## 1. Objetivo, escopo e critérios originais

Issue #98 — Estabelecer deploy preview, produção e rollback.

### Objetivo

Configurar Vercel preview/prod, domínio/HTTPS e procedimento de rollback.

### Escopo

- Implementar conforme arquitetura Supabase + Vercel e requisitos aprovados.
- Validar autorização server-side e comportamento de erro.
- Atualizar documentação e evidências pertinentes.

### Critérios de aceite originais

- [ ] Deploy documentado; smoke test e rollback ensaiados.
- [ ] Testes relevantes automatizados ou evidência documentada
- [ ] Revisão por PR concluída
- [ ] Sem regressão nos fluxos relacionados

Esta auditoria preserva os critérios consultados diretamente na issue. Não os amplia nem altera a issue.

## 2. Classificação das evidências

Este documento diferencia:

- **Comprovado no repositório/GitHub:** observado diretamente na branch, API ou checks.
- **Confirmado pelo responsável:** informação registrada anteriormente como confirmação explícita.
- **Observado em integração externa:** evento/status retornado por integração, sem equivaler a auditoria administrativa completa.
- **Não verificado:** não há evidência suficiente ou acesso ao painel correspondente.
- **Pendente:** depende de acesso, execução controlada ou decisão/aprovação.

## 3. Estado inicial do repositório

### 3.1 Stack e configuração

Na `main` consultada:

- Next.js `^16.0.0`, React/React DOM `^19.2.0` e TypeScript `^5.9.3` em `package.json`.
- `next.config.ts` existe e desativa `poweredByHeader`; não contém configuração específica de ambiente.
- O projeto usa App Router em `src/app/`.
- O README descreve a página atual como institucional e declara que autenticação, conversas, grupos e anexos ainda não estão implementados.
- `vercel.json` não existe na raiz da `main`.
- `.env.example` contém somente placeholders vazios para `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `.gitignore` ignora `.env*`, exceto `.env.example`, e ignora `.vercel`.
- O README documenta como procedimento esperado importar `Aluvioz/Polychat` na Vercel, usar Next.js, Root Directory `./` e branch de produção `main`. Essa instrução não comprova a configuração administrativa efetiva.

Evidências: [package.json](../../package.json), [next.config.ts](../../next.config.ts), [README.md](../../README.md), [\.env.example](../../.env.example) e [\.gitignore](../../.gitignore).

### 3.2 CI e branch principal

O workflow versionado `.github/workflows/ci.yml` executa em push para `main` e em Pull Requests destinadas a `main`:

1. `npm test`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run build`
5. Inicializa o build com `npm run start` e valida HTTP 200/HTML esperado na rota `/` (smoke test local do artefato).

Para o commit de baseline `3e749397ff535d81fb3bfb055a127120515752e2`, o workflow `CI` concluiu com sucesso no run [44193728427](https://github.com/Aluvioz/Polychat/actions/runs/44193728427). Os passos de testes, ESLint, TypeScript e build aparecem como `completed/success`.

O status do Vercel para o mesmo commit também retornou `success`, com descrição `Deployment has completed` e [link do deployment no painel Vercel](https://vercel.com/polychat1/polyford/7TzpZd9yG55PPcmgd86nBkNAHjeu). O status não informa, no dado acessível, se o deployment foi classificado como Production nem expõe domínio associado.

A consulta à API da branch `main` retornou `protected: false`, proteção desativada e nenhum required status check configurado. Portanto, a exigência de revisão/CI descrita em `docs/10-governanca-desenvolvimento.md` não está comprovada como enforcement administrativo da branch. Esta auditoria não altera regras de branch protection.

Evidências: [ci.yml](../../.github/workflows/ci.yml), [run CI da main](https://github.com/Aluvioz/Polychat/actions/runs/44193728427), [commit de baseline](https://github.com/Aluvioz/Polychat/commit/3e749397ff535d81fb3bfb055a127120515752e2) e [governança](../10-governanca-desenvolvimento.md).

## 4. Preview e produção na Vercel

### 4.1 Preview

Foram observados eventos automáticos do `vercel[bot]`:

| PR | Contexto | Projeto | Estado observado | URL Preview |
|---|---|---|---|---|
| [#145](https://github.com/Aluvioz/Polychat/pull/145) | Auditoria da Issue #96; PR posteriormente integrada | `polyford` | `Ready` no evento registrado | [Preview #145](https://polyford-git-docs-issue-96-environments-audit-polychat1.vercel.app) |
| [#147](https://github.com/Aluvioz/Polychat/pull/147) | Trabalho da Issue #95; PR aberta como Draft na consulta | `polyford` | `Ready` no evento registrado em 18/11/2026 | [Preview #147](https://polyford-git-chore-issue-95-project-tooling-polychat1.vercel.app) |
| [#148](https://github.com/Aluvioz/Polychat/pull/148) | Esta auditoria da Issue #98 | `polyford` | `Ready` no evento registrado em 18/11/2026 | [Preview #148](https://polyford-git-docs-issue-98-deploy-rollback-audit-polychat1.vercel.app) |

A evidência da PR #147 demonstra que a integração Git/Vercel gerou um Preview Deployment para aquela PR. Ela não demonstra, por si só, a associação ao projeto Supabase correto, a homologação funcional ou o comportamento de produção.

### 4.2 Produção

O commit da `main` tem status Vercel `success` e descrição `Deployment has completed`. Isso comprova que o Vercel reportou a conclusão de um deployment associado ao commit, mas os dados disponíveis nesta auditoria não identificam o tipo do deployment, a branch de produção efetiva, o domínio publicado ou a configuração de variáveis utilizada.

A documentação da Issue #96 registra `https://polyford.vercel.app` como homepage declarada do projeto; a associação atual desse hostname ao projeto e ao ambiente de produção não foi verificada administrativamente.

**Limite de acesso:** não há integração administrativa Vercel disponível nesta execução. Não foram consultados painel de deployments, configurações do projeto, Git integration, Production Branch, Environment Variables ou histórico de deployments.

## 5. Domínio e HTTPS

| Item | Estado | Evidência/limite |
|---|---|---|
| Hostname declarado no README de auditoria anterior | `polyford.vercel.app` | Registrado na auditoria da Issue #96; associação atual não revalidada |
| Domínio institucional/customizado | Não verificado | Nenhum domínio institucional foi presumido |
| Associação de domínio ao projeto Vercel | Não verificada | Painel administrativo não acessível |
| Ambiente associado ao domínio | Não verificado | Não inferido a partir do nome do hostname |
| DNS | Não verificado | Sem consulta administrativa ao provedor/DNS |
| HTTPS/certificado | Não verificado | Não foi possível obter evidência de certificado no painel ou resposta HTTP confiável |

Foram tentadas requisições HTTP GET para o hostname declarado e para os Previews das PRs #147 e #148 a partir do ambiente desta auditoria. Ambas falharam antes de estabelecer conexão, por falha de resolução DNS no ambiente de execução. Isso **não** demonstra indisponibilidade do site nem falha do DNS público; significa apenas que o smoke test HTTP não pôde ser concluído a partir desta sessão.

Não foram alterados DNS, domínio, certificado ou roteamento.

## 6. Supabase e variáveis por ambiente

A integração Supabase retornou um projeto acessível:

| Campo | Valor observado |
|---|---|
| Projeto | `Polyford` |
| Project reference | `oixifpdfvrenlhvycszy` |
| Região | `sa-east-1` |
| Estado | `ACTIVE_HEALTHY` |

A documentação da Issue #96 registra a confirmação explícita do responsável de que `Polyford` é o projeto oficial de **desenvolvimento** do Polychat. A listagem acessível nesta execução retornou esse projeto; isso não prova a inexistência de outros projetos fora do escopo de acesso da integração.

Não foi identificada evidência de projeto Supabase específico para Preview/homologação ou produção, nem associação de projetos Supabase aos deployments Vercel.

O repositório não contém SDK Supabase nas dependências de `package.json`; o README declara a integração pendente; e `.env.example` contém placeholders vazios. Não foram lidos valores de secrets nem alteradas variáveis. Os nomes e escopos de variáveis cadastradas no painel Vercel/GitHub não foram verificados.

Nenhum projeto, migration, dado, chave ou configuração Supabase foi alterado.

## 7. Autorização server-side e comportamento de erro

Foi inspecionado `src/auth/authorization.mjs`. O módulo:

- recebe um cliente Supabase por injeção e exige que ele seja server-side;
- valida token com `supabase.auth.getUser`;
- consulta `profiles` para obter role e estado da conta;
- permite somente roles `user` e `ti`;
- retorna 401 para ausência/sessão inválida, 403 para perfil/conta sem autorização e 503 para falha de validação/consulta;
- falha fechada e não devolve detalhes internos da exceção.

O módulo é descrito no código como middleware compatível com Express. A inspeção do App Router e do README não encontrou evidência de integração desse middleware com handlers/rotas reais do Next.js ou de criação do cliente Supabase para o runtime da aplicação.

O arquivo `tests/authorization.test.mjs` contém 11 testes unitários com Supabase simulado. Eles cobrem autenticação, role, conta inativa, perfil ausente e falhas. Não comprovam integração real com Supabase hospedado, RLS real, sessão/cookies do Next.js ou fluxos de conversas/mensagens/anexos.

A página atual `src/app/page.tsx` é institucional e informa que a autenticação ainda será implementada. Portanto, não foi possível executar smoke test de login, conversas ou operações autenticadas; esses fluxos não foram comprovados como implementados nesta baseline.

Evidências: [middleware de autorização](../../src/auth/authorization.mjs), [testes](../../tests/authorization.test.mjs), [página inicial](../../src/app/page.tsx) e [README](../../README.md).

## 8. Rollback

A inspeção do README, da ADR-009 e dos documentos de infraestrutura não encontrou procedimento operacional de rollback Vercel já aprovado e ensaiado.

A ADR-009 permanece **Proposed** e registra que critérios de release/rollback, backup/restore, RPO e RTO ainda dependem de definições operacionais. Não há evidência nesta auditoria que identifique:

- deployment de produção anterior escolhido e validado como rollback target;
- mecanismo de rollback habilitado e procedimento confirmado no painel Vercel;
- responsável operacional formalmente autorizado a aprovar rollback;
- ensaio controlado concluído;
- resultado observado ou evidência de recuperação;
- procedimento de restauração de banco de dados.

**Ensaio:** não realizado. O painel Vercel não está acessível por integração administrativa nesta execução e não foi identificado ambiente seguro/isolado nem autorização específica para executar um ensaio. Não foi provocado incidente ou indisponibilidade de produção.

Rollback de aplicação não equivale à restauração de banco de dados. Nenhuma afirmação de reversão de migrations/dados, backup, restore, RPO ou RTO é feita.

Para concluir o ensaio, o responsável operacional/Tech Lead precisa indicar o ambiente seguro, deployment válido de referência, mecanismo efetivamente disponível e autorização do exercício. O ensaio deve ser registrado após execução real, não por simulação documental. O procedimento proposto está em [runbook de smoke test e rollback](issue-98-smoke-test-rollback-runbook.md) e aguarda aprovação.

## 9. Testes, smoke tests e regressão

| Validação | Resultado | Evidência/limite |
|---|---|---|
| `npm test` | Sucesso no CI da baseline | Run [44193728427](https://github.com/Aluvioz/Polychat/actions/runs/44193728427), passo `Run automated tests` |
| `npm run lint` | Sucesso no CI da baseline | Mesmo run, passo `Run ESLint` |
| `npm run typecheck` | Sucesso no CI da baseline | Mesmo run, passo `Check TypeScript` |
| `npm run build` | Sucesso no CI da baseline | Mesmo run, passo `Build Next.js application` |
| CI da PR #148 no HEAD `15931d6579337288d0762e3ea6afd0dadf7a3306` | Sucesso | Run [44395417631](https://github.com/Aluvioz/Polychat/actions/runs/44395417631): testes, lint, typecheck e build concluídos com sucesso |
| Preview Vercel | `Ready` observado para PRs #145 e #147 | Eventos automáticos do Vercel; não equivalem a teste funcional |
| Vercel no commit `main` | Status `success`, `Deployment has completed` | [Status do commit](https://github.com/Aluvioz/Polychat/commit/3e749397ff535d81fb3bfb055a127120515752e2) |
| Smoke test local do build Next.js | Sucesso | Step `Smoke test built Next.js application` do run [44396627884](https://github.com/Aluvioz/Polychat/actions/runs/44396627884), no commit `7c5579d72f6ae0558786766856d40dc8c0fbb10e`; valida somente a rota institucional `/` no runner |
| Smoke test HTTP hospedado | Não concluído | Falha de resolução DNS no ambiente desta auditoria; sem resposta HTTP |
| Smoke test autenticado/funcional | Não executado | Autenticação/fluxos de produto não comprovados como integrados ao App Router |
| Integração Supabase hospedada | Não testada | Projeto de desenvolvimento existe, mas runtime do app não está conectado comprovadamente |
| Ensaio de rollback | Não executado | Sem painel, target e autorização/ambiente de ensaio comprovados |
| Regressão funcional de produção | Não verificada | CI cobre testes/build existentes; não substitui smoke/regressão funcional |

Os comandos npm não foram executados localmente nesta sessão. O run [44396627884](https://github.com/Aluvioz/Polychat/actions/runs/44396627884) concluiu com sucesso no commit `7c5579d72f6ae0558786766856d40dc8c0fbb10e`, incluindo testes, lint, typecheck, build e smoke test local. Esses resultados são execuções do GitHub Actions, não execução local nem validação de deployment hospedado.

## 10. Pendências operacionais identificadas na auditoria de 18/11/2026

1. **Vercel/TI:** fornecer evidência do painel do projeto `polyford` para Production Branch, deployment de produção atual, commit, domínio(s), ambiente de cada domínio e estado HTTPS/certificado. Não compartilhar valores de secrets.
2. **Vercel/TI:** confirmar nomes e escopos das variáveis por ambiente (Development, Preview e Production), sem revelar valores, e a associação de cada deployment ao projeto Supabase correspondente.
3. **Supabase/TI:** identificar formalmente os projetos de Preview/homologação e produção, se existentes, e confirmar suas associações. `Polyford` permanece identificado como desenvolvimento.
4. **Tech Lead/TI:** aprovar o ambiente seguro, deployment válido de referência e responsável para o ensaio de rollback; registrar o mecanismo confirmado no painel e executar o exercício controlado.
5. **Tech Lead/Dev:** concluir a integração Supabase com o runtime Next.js e fornecer rotas/fluxos implementados para smoke tests reais; não usar testes simulados como substitutos de integração.
6. **Tech Lead/SQA:** revisar esta PR e confirmar os checks do commit mais recente.
7. **Governança GitHub:** a branch `main` foi observada sem proteção e sem required checks. A ativação de regras administrativas não foi realizada por esta Issue #98 e requer decisão/ação administrativa separada.

## 11. Alterações realizadas por esta entrega

- Esta PR adiciona este documento de auditoria, um runbook proposto de smoke test/rollback, seus links no índice `docs/README.md` e um step de smoke test local do build no workflow `.github/workflows/ci.yml`.
- O novo step testa apenas a rota institucional atual no runner do GitHub Actions; não é smoke test de Preview/Production nem valida integração Supabase.
- Não altera a Issue #98, ADRs, configuração administrativa Vercel/Supabase, secrets, variáveis, DNS, certificados, banco, migrations ou código de runtime.
- Não declara deploy de produção, smoke test funcional ou rollback ensaiado.
- Não marca critérios de aceite como concluídos.

## 12. Situação dos critérios originais da Issue #98 — auditoria de 18/11/2026

**Nota temporal:** os estados abaixo refletem somente a auditoria documental de 18/11/2026. O aceite final e o encerramento da issue em 19/11/2026 estão registrados na seção 13 e prevalecem para o estado final da issue.

| Critério original | Estado nesta auditoria | Justificativa |
|---|---|---|
| Deploy documentado; smoke test e rollback ensaiados. | **Pendente** | Há documentação de evidências parciais de deploy; smoke test HTTP não concluiu e rollback não foi ensaiado |
| Testes relevantes automatizados ou evidência documentada | **Parcial** | CI da baseline passou nos quatro comandos; testes existentes usam Supabase simulado e não cobrem integração/fluxos hospedados |
| Revisão por PR concluída | **Pendente** | Esta PR precisa de revisão independente |
| Sem regressão nos fluxos relacionados | **Não verificado** | CI passou, mas não houve smoke/regressão funcional em ambiente hospedado |

**Conclusão da auditoria de 18/11/2026:** naquele momento, a Issue #98 estava parcialmente atendida com os limites de evidência descritos neste relatório. A situação foi posteriormente atualizada pelo aceite do Tech Lead e encerramento da issue em 19/11/2026; consultar a seção 13. O resultado histórico não deve ser confundido com o status final de gestão.


## 13. Aditivo — aceite do Tech Lead e compatibilização com a FORD v2

**Data do aceite/encerramento:** 19/11/2026  
**Issue:** [#98 — Estabelecer deploy preview, produção e rollback](https://github.com/Aluvioz/Polychat/issues/98)  
**Comentário final:** [aceite e encerramento pelo Tech Lead](https://github.com/Aluvioz/Polychat/issues/98#issuecomment-7013655363)

### 13.1 Registro do aceite

O comentário final registrado na Issue #98 informa expressamente que o Tech Lead confirmou a execução dos itens que ainda apareciam como pendentes na auditoria:

- validação do deployment hospedado;
- ensaio de rollback;
- verificações de produção, domínio e HTTPS;
- revisão dos fluxos relacionados.

Com base nessa atestação, a Issue #98 foi aceita e encerrada como **Completed** em 19/11/2026. O aceite registra confirmação técnica responsável para o escopo da issue.

### 13.2 Relação com a auditoria de 18/11

As seções 1 a 12 preservam o estado observado na auditoria de 18/11/2026. Naquela data, o acesso disponível não permitiu comprovar diretamente o deployment de produção, o domínio/HTTPS ou o ensaio de rollback. O comentário posterior do Tech Lead atualiza o estado de gestão da issue e atesta que esses itens foram executados.

Este aditivo não inventa deployment IDs, commit de produção, hostname institucional, horário do ensaio, deployment usado como rollback target, logs ou screenshots que não constam no comentário. A ressalva do próprio aceite determina que as evidências detalhadas permaneçam acessíveis e atualizadas.

### 13.3 Critérios de aceite — estado final da Issue #98

| Critério original | Estado final da issue | Base e limite |
|---|---|---|
| Deploy documentado; smoke test e rollback ensaiados | **Concluído por atestação do Tech Lead** | O comentário confirma deployment hospedado, smoke tests e ensaio de rollback; os detalhes granulares devem permanecer acessíveis |
| Testes relevantes automatizados ou evidência documentada | **Concluído no escopo aceito** | CI e evidências da auditoria, complementados pela confirmação do responsável; não equivale a nova execução independente nesta revisão |
| Revisão por PR concluída | **Concluído conforme aceite da issue** | O comentário final registra o aceite e encerramento; a auditoria atual não reexecutou a revisão da PR |
| Sem regressão nos fluxos relacionados | **Concluído por confirmação do Tech Lead** | A confirmação menciona revisão dos fluxos relacionados; não se declara uma nova rodada independente de testes nesta atualização |

### 13.4 Limites do encerramento

O encerramento:
- preserva o estado **Closed/Completed** da Issue #98;
- atesta a conclusão das atividades abrangidas pela issue segundo o Tech Lead;
- não equivale a uma auditoria administrativa independente dos painéis Vercel/Supabase;
- não comprova, por si só, os detalhes granulares do ensaio se eles não estiverem anexados/identificados no registro;
- não aprova automaticamente a ADR-009;
- não substitui a homologação funcional do produto completo nem o Go/No-Go de lançamento.

### 13.5 Compatibilização com a FORD v2

A FORD v2 estabelece que infraestrutura, hospedagem, armazenamento e processamento de dados devem permanecer sob controle da FORD, sem terceiros acessando, armazenando ou processando dados da organização. A direção Supabase + Vercel usada no escopo operacional original foi depreciada na ADR-003.

Assim, as configurações e ensaios Supabase/Vercel atestados pela Issue #98 permanecem como **evidência histórica de execução e conclusão técnica do escopo original**. Não devem ser interpretados como autorização vigente para processar dados reais da FORD nesses serviços após a FORD v2.

O comentário de encerramento não declara se dados reais da FORD foram ou não inseridos nesses serviços. Este documento também não determina essa condição. A arquitetura operacional substituta e a forma de transição permanecem na Q-025 e na ADR-009.

### 13.6 Encaminhamento

- Manter a Issue #98 encerrada; não reabri-la apenas pela atualização da restrição arquitetural.
- Preservar os registros e artefatos do deployment e do ensaio de rollback, conforme solicitado no comentário de aceite.
- Não promover Supabase/Vercel como arquitetura-alvo para dados da FORD.
- Revalidar smoke test, deploy, domínio/HTTPS, rollback e recuperação quando a arquitetura sob controle da FORD estiver selecionada e homologada.
