# Issue #96 — Auditoria de ambientes Supabase e Vercel

**Data da auditoria:** 17/11/2026  
**Base inspecionada:** `main`  
**Estado:** parcial; identidade do projeto Supabase confirmada pelo responsável; operação do Vercel confirmada pelo responsável; segregação e configuração detalhada dos ambientes ainda não documentadas.

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
| Desenvolvimento | Não verificado | Não associado | Pendente |
| Preview/homologação | Não verificado | Não associado | Pendente |
| Produção | Não verificado | Não associado | Pendente |

Nenhum ambiente lógico foi associado a um projeto ou deployment sem evidência suficiente.

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

**Limite de identificação:** o projeto Polyford pertence à organização denominada Polychat, mas não foi encontrada documentação que declare sua finalidade como desenvolvimento, preview/homologação ou produção do repositório Aluvioz/Polychat. A semelhança/associação nominal não é suficiente para atribuir-lhe um ambiente.

Não foram consultados dados de negócio nem executadas operações de escrita. Nenhuma migration foi aplicada. A associação do projeto permanece bloqueada até confirmação explícita do responsável pelo ambiente.

## 4. Vercel

Não foi possível consultar a conta/projeto Vercel por uma integração autenticada nesta execução. Portanto, os itens abaixo permanecem **não verificados**:

- organização/equipe e projeto proprietário;
- repositório Git conectado;
- branch de produção;
- Preview Deployments e Production Deployments;
- domínios e HTTPS;
- variáveis por ambiente e seus estados de existência;
- configurações de build e deploy;
- integração efetiva com projetos Supabase.

O README contém instruções esperadas para importar o repositório, usar Next.js, Root Directory `./` e branch de produção `main`. Essas instruções documentais não comprovam detalhes internos da configuração. A confirmação do responsável prevalece quanto ao funcionamento operacional informado; não se propõe alteração no Vercel.

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
| Operação do Vercel | Confirmado pelo responsável | Plataforma informada como funcionando perfeitamente; detalhes internos não auditados independentemente |
| Variáveis Vercel/GitHub | Não validado | Valores e estados externos não acessíveis |
| Proteção da branch e required checks | Não validado | Exige consulta administrativa ao GitHub |
| Proteção local de arquivos .env | Validado documentalmente | Regra presente em `.gitignore`; não equivale a auditoria histórica de todos os commits |
| Segredos fora do código | Parcial | Exemplo não contém segredos; secrets externos e histórico completo não auditados |
| Testes de integração Supabase/Vercel | Não executados | Não há ambiente associado confirmado |
| Migrations | Não aplicável nesta issue | Nenhuma migration foi aplicada |
| Regressão funcional | Não validada | Esta alteração é documental; fluxos hospedados não foram exercitados |

## 8. Pendências e confirmações necessárias

1. **Identidade/finalidade do projeto Supabase Polyford:** confirmar se o projeto `oixifpdfvrenlhvycszy` pertence ao Polychat e, em caso afirmativo, qual ambiente lógico representa. Informar também se existem outros projetos Supabase oficiais.
2. **Acesso Vercel:** disponibilizar integração autenticada ou evidências administrativas do projeto, equipe, repositório conectado, branch de produção, previews, domínios e variáveis por escopo.
3. **Secrets e Variables do GitHub:** verificar nomes e escopos sem revelar valores; confirmar ambientes e permissões de leitura necessários aos workflows.
4. **Decisões de ambiente pendentes na ADR-009:** TI/Tech Lead devem confirmar projetos/regiões, acessos, gestão de segredos e requisitos operacionais antes de qualquer associação ou configuração definitiva.
5. **Revisão:** PR desta documentação deve receber revisão independente e checks aplicáveis antes de integração.

## 9. Limites respeitados

- Nenhum projeto Supabase foi criado, renomeado, pausado ou modificado.
- Nenhum domínio, branch de produção ou configuração Vercel foi alterado; a operação do Vercel foi aceita com base na confirmação do responsável.
- Nenhuma variável, secret ou credencial foi criada, substituída ou exibida.
- Nenhuma migration foi aplicada.
- Nenhuma issue diferente da #96 foi modificada ou encerrada.
- Deploy, rollback, RLS de domínio e testes de integração não foram declarados concluídos.

## 10. Status da Issue #96

**Parcialmente concluída.** A identidade do projeto Supabase Polyford foi confirmada pelo responsável, e o funcionamento do Vercel também foi confirmado pelo responsável. Permanecem pendentes a documentação da finalidade/segregação lógica dos ambientes, a verificação de secrets e permissões no GitHub e as decisões operacionais ainda abertas na ADR-009. A issue não deve ser fechada até que seus critérios originais sejam atendidos e revisados.
