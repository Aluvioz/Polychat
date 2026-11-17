# Issue #96 — Auditoria de ambientes Supabase e Vercel

**Data da auditoria:** 17/11/2026  
**Base inspecionada:** `main`  
**Estado:** parcial; projeto Supabase oficial confirmado pelo responsável; projeto Vercel e Preview Deployment da PR #145 observados pelo evento automático do Vercel; finalidade do projeto Supabase por estágio e configuração detalhada dos ambientes ainda não documentadas.

## 1. Escopo e critérios originais

Issue #96 — Configurar ambientes Supabase e Vercel.

Critérios de aceite consultados diretamente na issue:

- [ ] Ambientes segregados; secrets fora do código; acessos mínimos.
- [ ] Testes relevantes automatizados ou evidência documentada.
- [ ] Revisão por PR concluída.
- [ ] Sem regressão nos fluxos relacionados.

Esta auditoria não altera nem amplia os critérios da issue.

## 2. Resultado resumido

| Ambiente lógico | Vercel | Supabase | Situação |
|---|---|---|---|
| Desenvolvimento | Não identificado | Projeto oficial Polyford, estágio não especificado | Pendente |
| Preview/homologação | Preview da PR #145 observado como `Ready` | Projeto Supabase associado ao preview não comprovado | Parcial |
| Produção | Branch `main` indicada pela documentação; deployment de produção não auditado nesta execução | Projeto oficial Polyford, estágio não especificado | Pendente |

A evidência automática do Vercel confirma um Preview Deployment `Ready` para a PR #145, mas não demonstra por si só a segregação de dados entre os estágios nem identifica qual projeto Supabase está conectado a cada deployment.

## 3. Supabase

A integração Supabase disponível para consulta retornou:

| Campo | Valor observado |
|---|---|
| Organização | Polychat |
| Organização ID | `hxxubdxlmyqbfurgztjb` |
| Projeto | Polyford |
| Project Reference ID | `oixifpdfvrenlhvycszy` |
| Região | `sa-east-1` |
| Estado observado | `ACTIVE_HEALTHY` |
| Criação | 13/11/2026 |

**Identidade:** o responsável confirmou explicitamente que Polyford é o projeto Supabase oficial do Polychat; o nome diferente é intencional. A consulta atual também encontrou somente esse projeto na organização acessível.

**Limite de segregação:** não há evidência suficiente para classificá-lo como desenvolvimento, preview/homologação ou produção, nem para concluir que os três estágios estejam segregados por projetos Supabase distintos. A existência de um único projeto listado não prova que não existam outros projetos fora do escopo de acesso desta integração.

Não foram consultados dados de negócio nem executadas operações de escrita. Nenhuma migration foi aplicada.

## 4. Vercel

A integração Vercel não está disponível para inspeção administrativa direta nesta execução. Entretanto, um comentário automático do `vercel[bot]` na PR #145 confirmou o projeto Vercel `polyford` e um Preview Deployment com estado **Ready** para a branch `docs/issue-96-environments-audit`, com URL `https://polyford-git-docs-issue-96-environments-audit-polychat1.vercel.app`. O repositório também declara `https://polyford.vercel.app` como homepage. Isso comprova a geração do preview desta PR, não a configuração completa de produção.

Permanecem **não verificados**:

- organização/equipe e projeto proprietário;
- repositório Git conectado;
- branch de produção;
- Preview Deployments e Production Deployments;
- domínios e HTTPS;
- variáveis por ambiente e seus estados de existência;
- configurações de build e deploy;
- integração efetiva com projetos Supabase.

O README contém instruções esperadas para importar o repositório, usar Next.js, Root Directory `./` e branch de produção `main`. Essas instruções documentais não comprovam detalhes internos da configuração. O responsável também confirmou que o Vercel está funcionando perfeitamente. Não foi realizada nem é proposta qualquer alteração no Vercel.

## 5. Repositório e GitHub

Arquivos inspecionados em `main`:

- `README.md`: informa Next.js 16, React 19 e TypeScript; declara que a integração Supabase ainda não foi conectada; apresenta instruções de configuração Vercel como procedimento esperado.
- `package.json`: dependências de Next.js/React; não contém SDK Supabase. Scripts disponíveis: `test`, `lint`, `typecheck` e `build`.
- `.env.example`: contém somente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`, vazias, sem credenciais.
- `.gitignore`: ignora `.env*` e mantém exceção para `.env.example`; também ignora `.vercel`.
- `.github/workflows/ci.yml`: executa testes, ESLint, TypeScript e build em push para `main` e PR direcionada à `main`.
- `src/auth/authorization.mjs`: exige que o cliente Supabase passado ao middleware seja server-side e alerta para nunca expor service-role no browser; o módulo recebe o cliente por injeção e não instancia o SDK.
- `next.config.ts`: não apresenta configuração de ambiente específica.

Não foi possível verificar, por esta integração, os nomes/status de GitHub Actions Secrets e Variables, os ambientes configurados no GitHub ou as regras administrativas efetivamente aplicadas à branch `main`. A documentação de governança informa que branch protection e required checks não devem ser presumidos apenas pela existência do workflow.

### 5.1 Inventário de variáveis observado

| Nome | Evidência | Classificação | Estado |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.example` | Pública, destinada ao cliente | Placeholder vazio; configuração efetiva não verificada |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.example` | Chave pública/anon | Placeholder vazio; configuração efetiva não verificada |

O inventário acima registra apenas os nomes presentes no arquivo de exemplo. Não comprova que essas variáveis sejam consumidas pelo runtime atual ou estejam cadastradas na Vercel/GitHub.

Nenhuma variável administrativa/service-role foi encontrada no arquivo de exemplo. A ausência no exemplo não comprova a inexistência de segredos em gerenciadores externos.

## 6. Decisões arquiteturais aplicáveis

A documentação consultada estabelece:

- ADR-003: Supabase + Vercel como direção tecnológica exigida pela Issue #88, sem homologação de produção.
- ADR-009: **Proposed**. Propõe ambientes separados, isolamento de variáveis e segredos e promoção controlada, mas aguarda confirmação de projetos, regiões, acessos, gestão de segredos, backup/restore, RPO/RTO e processo de release.
- ADR-006: aceita somente o contrato de autorização de perfis e a migration existente; não autoriza extrapolação para outros domínios.

Como ADR-009 permanece Proposed, esta auditoria não converte suas propostas em decisões definitivas nem cria três projetos Supabase por presunção.

## 7. Validações e evidências

| Verificação | Resultado | Observação |
|---|---|---|
| Consulta à Issue #96 | Validado | Objetivo, escopo e critérios lidos diretamente no GitHub |
| Consulta à Epic 02 (#79) e issues #97/#98 | Validado | Limites de responsabilidade confirmados |
| Organização/projeto Supabase acessíveis | Validado | Organização e projeto listados; identidade oficial confirmada pelo responsável; ambiente lógico não especificado |
| Estado/ região do projeto encontrado | Validado | Metadados retornados pela API Supabase |
| Preview Vercel da PR #145 | Validado | Evento automático do `vercel[bot]` registra deployment `Ready` e URL de Preview |
| Operação do Vercel | Confirmado pelo responsável | Responsável informa funcionamento perfeito; produção e configuração interna não auditadas integralmente |
| Variáveis Vercel/GitHub | Não validado | Valores e inventário completo externos não acessíveis |
| Proteção da branch e required checks | Não validado | Exige consulta administrativa ao GitHub |
| Proteção local de arquivos .env | Validado documentalmente | Regra presente em `.gitignore`; não equivale a auditoria histórica de todos os commits |
| Segredos fora do código | Parcial | Exemplo não contém segredos; secrets externos e histórico completo não auditados |
| CI da PR #145 | Aprovado na consulta | Dois workflow runs `CI` associados ao commit `6df34ab1...` concluíram com `success`; isso valida os workflows executados, não testes de integração hospedada |
| Testes de integração Supabase/Vercel | Não executados | Não há associação de ambiente Supabase por estágio confirmada |
| Migrations | Não aplicável nesta issue | Nenhuma migration foi aplicada |
| Regressão funcional | Não validada | Esta alteração é documental; fluxos hospedados não foram exercitados |

## 8. Pendências e confirmações necessárias

1. **Segregação Supabase:** Polyford é o projeto oficial, mas a finalidade por estágio e a existência de projetos adicionais não foram documentadas. A aprovação global do Tech Lead foi informada pelo responsável nesta conversa; a atribuição concreta de cada projeto a desenvolvimento, preview/homologação e produção ainda precisa constar de evidência operacional para ser auditável.
2. **Vercel:** há evidência de Preview Deployment `Ready` para esta PR. Organização, branch de produção efetiva, domínios, variáveis por escopo e ligação Supabase de cada estágio não foram auditados administrativamente. Não houve alteração no Vercel.
3. **Secrets e Variables do GitHub:** verificar nomes, escopos e permissões no GitHub UI sem revelar valores. A integração utilizada não oferece leitura das famílias de endpoints de secrets/variables.
4. **ADR-009:** a aprovação global do Tech Lead foi informada pelo responsável, mas a ADR enumera decisões operacionais específicas (projetos/regiões, identidades autorizadas, backup/restore, RPO/RTO, janela de manutenção, release e rollback). Não vou marcar a ADR como `Accepted` sem registrar essas definições concretas e a evidência da aprovação.
5. **Revisão:** PR #145 ainda não tem reviews registradas. É necessária revisão independente por pessoa diferente do autor antes do merge.

## 9. Limites respeitados

- Nenhum projeto Supabase foi criado, renomeado, pausado ou modificado.
- Nenhum domínio, branch de produção ou configuração Vercel foi alterado; a operação do Vercel foi aceita com base na confirmação do responsável.
- Nenhuma variável, secret ou credencial foi criada, substituída ou exibida.
- Nenhuma migration foi aplicada.
- Nenhuma issue diferente da #96 foi modificada ou encerrada.
- Deploy, rollback, RLS de domínio e testes de integração não foram declarados concluídos.

## 10. Status da Issue #96

**Parcialmente concluída.** Polyford foi confirmado como projeto Supabase oficial; o projeto Vercel `polyford` e um Preview Deployment `Ready` para a PR #145 foram observados; dois workflows CI associados ao commit atual concluíram com sucesso. Permanecem sem evidência suficiente a segregação Supabase por estágio, a auditoria administrativa de secrets/variables e permissões, as definições operacionais específicas da ADR-009 e a revisão independente da PR. A Issue #96 não deve ser fechada até que seus critérios originais sejam atendidos e revisados.
