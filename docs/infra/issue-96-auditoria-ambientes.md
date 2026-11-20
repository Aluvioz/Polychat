# Issue #96 — Auditoria de ambientes Supabase e Vercel

**Data da auditoria original:** 17/11/2026  
**Data do aditivo:** 19/11/2026  
**Base inspecionada na auditoria original:** `main`  
**Estado atual do registro:** a Issue #96 foi encerrada como concluída em 17/11/2026, após aceite documental da PR #145 e confirmação expressa do responsável/Tech Lead sobre a conclusão das configurações e validações operacionais descritas na issue. Este documento preserva o retrato da auditoria original e acrescenta o registro posterior de encerramento na seção 11; a confirmação do responsável não deve ser confundida com uma nova auditoria administrativa independente de cada configuração.

## 1. Escopo e critérios originais

Issue #96 — Configurar ambientes Supabase e Vercel.

Critérios de aceite consultados diretamente na issue. A lista abaixo preserva o estado registrado durante a auditoria original, antes do comentário posterior de encerramento:

- [ ] Ambientes segregados; secrets fora do código; acessos mínimos.
- [ ] Testes relevantes automatizados ou evidência documentada.
- [ ] Revisão por PR concluída.
- [ ] Sem regressão nos fluxos relacionados.

**Nota temporal:** os checkboxes acima são um retrato histórico da auditoria de 17/11/2026 e não representam o status final da issue. Na sequência, o responsável/Tech Lead confirmou a conclusão dos itens da issue e autorizou seu encerramento; consulte a seção 11.

## 2. Resultado resumido

**Nota temporal:** a tabela abaixo registra as evidências e limitações observadas na auditoria original em 17/11/2026. Ela não deve ser lida isoladamente como uma lista de bloqueios ainda abertos após o encerramento autorizado pelo responsável/Tech Lead, registrado na seção 11.

| Ambiente lógico | Supabase | Vercel | Situação observada na auditoria original |
|---|---|---|---|
| Desenvolvimento | Projeto Polyford, confirmado pelo responsável como ambiente de desenvolvimento | Projeto `polyford`; Preview da PR #145 observado como `Ready` | Projeto Supabase identificado e finalidade confirmada; detalhes administrativos do Vercel não auditados integralmente |
| Preview/homologação | Projeto específico não identificado na consulta original; Polyford é desenvolvimento | Preview Vercel da PR #145 observado como `Ready`; não equivale por si só a homologação formal | Evidência parcial no retrato de 17/11 |
| Produção | Projeto específico não identificado na consulta original | Branch `main` indicada na documentação; deployment e domínio não auditados integralmente naquela execução | Limites da auditoria original, posteriormente complementados pelo aceite do responsável/Tech Lead |

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

**Identidade e finalidade:** o responsável confirmou explicitamente que Polyford é o projeto Supabase oficial do Polychat e que sua finalidade é **desenvolvimento**; o nome diferente é intencional. A consulta atual também encontrou somente esse projeto na organização acessível.

**Limite de segregação:** o projeto de desenvolvimento está identificado. Não há evidência suficiente nesta auditoria para identificar os projetos Supabase de homologação/preview e produção, caso existam. A existência de um único projeto listado não prova que não existam outros projetos fora do escopo de acesso desta integração.

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

- ADR-003: Supabase + Vercel são as plataformas oficiais do Polychat. Esta auditoria preserva a evidência de configuração e registra os limites de inspeção administrativa disponíveis na execução.
- ADR-009: **Proposed**. Vercel e Supabase são a stack oficial; a documentação registra a necessidade de validação dos projetos, regiões, domínios, variáveis e segregação por ambiente.
- ADR-006: o aceite cobre somente o contrato de autorização de perfis e a migration existente; não autoriza extrapolação para outros domínios nem comprova a RLS de domínio.

O aceite da Issue #96 atesta a conclusão de seu escopo operacional original. Supabase e Vercel são as plataformas oficiais do Polychat, conforme ADR-003; serviços adicionais que acessem ou processem dados continuam sujeitos a aprovação explícita. As limitações desta auditoria referem-se à granularidade das evidências documentais, não à autorização das plataformas oficiais.

## 7. Validações e evidências

**Nota temporal:** os resultados a seguir descrevem as verificações da auditoria original e são complementados pelo registro posterior de encerramento na seção 11.

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
| CI da PR #145 | Aprovado | Dois workflow runs `CI` associados ao HEAD `6808625b5c486b52fa95caa922637276f8497235` concluíram com `success` ([run 44183081305](https://github.com/Aluvioz/Polychat/actions/runs/44183081305), [run 44183081247](https://github.com/Aluvioz/Polychat/actions/runs/44183081247)); isso valida os workflows executados, não testes de integração hospedada |
| Revisão independente da PR #145 | Aprovada | Review `APPROVED` registrada antes da integração da PR à `main` em 17/11/2026 |
| Encerramento da Issue #96 | Concluído | Responsável/Tech Lead confirmou a conclusão operacional e autorizou o encerramento em 17/11/2026; ver seção 11 |
| Testes de integração Supabase/Vercel | Não executados | Não há associação de ambiente Supabase por estágio confirmada |
| Migrations | Não aplicável nesta issue | Nenhuma migration foi aplicada |
| Regressão funcional | Não executada independentemente nesta auditoria documental | A auditoria não exercitou fluxos hospedados; no encerramento, o responsável/Tech Lead atestou a conclusão das validações operacionais previstas na issue |

## 8. Pendências e confirmações registradas na auditoria original (17/11/2026)

Os itens abaixo preservam as limitações identificadas no momento da inspeção. **Eles não devem ser interpretados automaticamente como pendências ainda abertas da Issue #96:** no comentário posterior de encerramento, o responsável/Tech Lead declarou concluídas as configurações e validações operacionais descritas na issue e considerou resolvidas, para o escopo da #96, as pendências apontadas na auditoria. A decisão está registrada na seção 11.

1. **Segregação Supabase:** na auditoria original, Polyford estava confirmado como desenvolvimento, mas os projetos/conexões específicos de homologação e produção não haviam sido identificados no material inspecionado. O encerramento posterior registra a confirmação do responsável de que as configurações e validações operacionais da issue foram concluídas; este aditivo não inventa project refs ou configurações que não constam do registro documental. Essas atividades não devem ser reabertas apenas por falta de reprodução de valores sensíveis nesta auditoria.
2. **Vercel:** a auditoria original observou um Preview Deployment `Ready` e registrou a confirmação do responsável de que o Vercel estava funcionando. O encerramento posterior ratificou a conclusão das validações operacionais no escopo da issue; não se afirma que tenha ocorrido nova inspeção administrativa independente neste aditivo.
3. **Secrets e Variables do GitHub:** a auditoria original não teve acesso administrativo aos valores/escopos externos. O responsável declarou as pendências da issue resolvidas no encerramento. Este documento não publica valores secretos nem transforma a confirmação em inventário independente de secrets ou permissões.
4. **ADR-009:** permanece `Proposed` no índice e no próprio arquivo da ADR consultados nesta atualização. A ADR trata de decisões arquiteturais e operacionais mais amplas que a Issue #96. O encerramento da #96 não altera automaticamente o status da ADR; acompanhar sua revisão no contexto da Issue #89 e das atividades relacionadas, incluindo a #98.
5. **Revisão da PR #145:** resolvida. A PR recebeu review `APPROVED` e foi integrada à `main` em 17/11/2026. A aprovação foi restrita à documentação e a revisão independente está registrada na própria PR.

## 9. Limites respeitados na auditoria original

Os limites abaixo descrevem as ações da auditoria original; não restringem a atualização documental por aditivo realizada em 19/11/2026.

- Nenhum projeto Supabase foi criado, renomeado, pausado ou modificado.
- Nenhum domínio, branch de produção ou configuração Vercel foi alterado; a operação do Vercel foi aceita com base na confirmação do responsável.
- Nenhuma variável, secret ou credencial foi criada, substituída ou exibida.
- Nenhuma migration foi aplicada.
- Nenhuma issue diferente da #96 foi modificada ou encerrada.
- Deploy, rollback, RLS de domínio e testes de integração não foram declarados concluídos.

## 10. Status da Issue #96

**Concluída e encerrada em 17/11/2026.** A PR #145 foi aprovada por revisão independente e integrada à `main`. No comentário de encerramento, o responsável/Tech Lead declarou que as configurações e validações operacionais dos ambientes Supabase e Vercel descritas na issue estavam concluídas, que as pendências registradas na auditoria eram consideradas resolvidas conforme essa confirmação e autorizou o encerramento da issue como concluída.

A conclusão da #96 está sustentada pelo aceite documental da PR #145 e pela confirmação expressa do responsável/Tech Lead. A auditoria técnica original não foi reexecutada integralmente depois desse comentário; por isso, os limites históricos de observação permanecem registrados neste documento, sem serem apresentados como bloqueios abertos da issue encerrada.

O status `Proposed` da ADR-009 permanece independente e deve ser acompanhado no contexto da Issue #89 e das issues operacionais relacionadas. A conclusão da #96 não representa, por si só, homologação completa do produto nem autorização geral para release em produção.

## 11. Aditivo de encerramento e aceite posterior

**Data do aditivo:** 19/11/2026  
**Evento registrado:** encerramento autorizado em 17/11/2026  
**Issue:** [#96 — Configurar ambientes Supabase e Vercel](https://github.com/Aluvioz/Polychat/issues/96)  
**Pull Request:** [#145 — Auditoria de ambientes](https://github.com/Aluvioz/Polychat/pull/145)

### 11.1 Registro formal do encerramento

Após a revisão documental da PR #145, o responsável/Tech Lead registrou na Issue #96:

> Encerramento autorizado pelo responsável/Tech Lead do Polychat, que atesta que as configurações e validações operacionais dos ambientes Supabase e Vercel descritas nesta issue já foram concluídas. A auditoria documental da PR #145 foi revisada e aprovada; as pendências registradas na auditoria são consideradas resolvidas conforme confirmação do responsável. Issue encerrada como concluída.

[Consultar comentário de encerramento](https://github.com/Aluvioz/Polychat/issues/96#issuecomment-6963142263).

A issue foi encerrada como concluída em **17/11/2026**. Os quatro critérios de aceite aparecem marcados como concluídos no registro final da issue.

### 11.2 Evidências de revisão e CI

- A PR #145 recebeu revisão independente com resultado **APPROVED**, com aprovação restrita à qualidade e precisão do documento de auditoria.
- A PR #145 foi integrada à `main` em **17/11/2026**.
- Dois workflows `CI` associados ao HEAD `6808625b5c486b52fa95caa922637276f8497235` concluíram com sucesso: [run 44183081305](https://github.com/Aluvioz/Polychat/actions/runs/44183081305) e [run 44183081247](https://github.com/Aluvioz/Polychat/actions/runs/44183081247).
- O evento automático da Vercel para a PR #145 registrou Preview Deployment como **Ready**. Esse sinal é evidência do preview daquela PR, não uma auditoria independente de cada configuração administrativa.

### 11.3 Alcance e limites do aceite

O encerramento registra uma confirmação expressa do responsável/Tech Lead de que os itens operacionais abrangidos pela Issue #96 estavam concluídos. Essa confirmação resolve, para fins de gestão e estado da issue, as pendências que o responsável declarou resolvidas.

Este registro **não** significa que:
- a auditoria original tenha sido refeita com acesso administrativo completo após o encerramento;
- project refs, domínios, variáveis ou permissões não expostos no relatório tenham sido inventariados neste documento;
- a ADR-009 tenha mudado de `Proposed` para `Accepted`;
- as demais decisões de arquitetura, segurança, backup, RPO/RTO, release ou rollback fora do escopo da #96 estejam aprovadas;
- o produto inteiro tenha sido homologado ou esteja automaticamente liberado para produção.

### 11.4 Encaminhamento documental

- Manter a Issue #96 encerrada; não reabri-la apenas para refletir esta atualização de histórico.
- Considerar a PR #145 como a entrega documental originalmente aceita.
- Manter as decisões mais amplas da ADR-009 no fluxo da Issue #89 e das issues operacionais pertinentes, especialmente a #98.
- Atualizar este relatório por aditivo, preservando as observações e limitações históricas da auditoria de 17/11/2026.


## 12. Aditivo — compatibilização com a FORD v2

**Data:** 19/11/2026  
**Fonte:** baseline POLY-REQ-001 v0.4 e ADRs revisadas após o questionário FORD v2.

### 12.1 Preservação do encerramento

A Issue #96 permanece **encerrada como concluída**. O comentário final do responsável/Tech Lead ([encerramento da #96](https://github.com/Aluvioz/Polychat/issues/96#issuecomment-6963142263)) atesta que as configurações e validações operacionais dos ambientes Supabase e Vercel abrangidas pela issue foram concluídas e autoriza seu fechamento. A confirmação resolve o escopo de gestão da issue conforme a autoridade do responsável.

A tabela e as limitações das seções anteriores são o retrato da auditoria original. A inversão das colunas Supabase/Vercel foi corrigida nesta revisão; não se inventaram project refs, nomes de secrets, domínios ou detalhes administrativos não disponíveis no registro.

### 12.2 Efeito da FORD v2 sobre a arquitetura anterior

Supabase e Vercel são as plataformas oficiais do Polychat, conforme ADR-003 e alinhamento complementar do PO com Desenvolvimento. A configuração dessas plataformas foi o objeto da Issue #96; seu encerramento deve ser preservado como evidência de execução e aceite do escopo original.

A auditoria documental distingue a confirmação do responsável/Tech Lead sobre a conclusão das configurações e validações operacionais daquilo que foi inspecionado diretamente nesta execução. O uso oficial das plataformas não elimina a necessidade de validar projetos, regiões, acessos, variáveis, domínios e segregação por ambiente, conforme Q-025.

### 12.3 Limites de evidência

- O responsável/Tech Lead atestou a conclusão operacional da issue; a auditoria documental original não foi refeita com acesso administrativo completo a todos os painéis após o encerramento.
- A confirmação do responsável não fornece, neste relatório, inventário independente de todos os projetos, domínios, variáveis ou permissões.
- Não se afirma que dados reais da FORD tenham sido armazenados ou processados nesses serviços; a presença ou ausência desses dados não foi determinada por este aditivo.
- Não se altera o status da Issue #96 nem se declara a ADR-009 aprovada.

### 12.4 Encaminhamento

Manter a Issue #96 fechada e seu aceite preservado. Tratar a validação final da configuração da stack oficial como parte da Q-025 e do fluxo técnico subsequente, sem reabrir a issue histórica apenas para refletir a correção documental.
