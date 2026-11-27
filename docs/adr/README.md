# ADRs — Polychat

**Data de revisão:** 26/11/2026  
**Baseline funcional:** POLY-REQ-001 v0.5 — `docs/09-baseline-requisitos-mvp.md`  
**Épico:** #77 · **Issue:** #89  
**Escopo:** arquitetura lógica sob controle da FORD, frontend, autenticação, banco de dados, autorização/RLS, realtime, storage, ambientes, deploy, segurança e auditoria.

## Como ler os status

- **Accepted:** decisão restrita e sustentada por requisito ou implementação versionada. O escopo aceito está descrito na própria ADR; não significa aprovação de produção pela FORD.
- **Proposed:** proposta técnica aguardando revisão/aprovação dos responsáveis indicados.
- **Deprecated:** decisão anteriormente aceita, retirada somente por decisão posterior formalmente aprovada e registrada em ADR substituta. O histórico e o vínculo com a decisão substituta devem ser preservados.
- **Rejected / Superseded:** alternativas recusadas ou decisões substituídas por decisão posterior formalmente aprovada.

Uma ADR Proposed não deve ser implementada como decisão final sem a aprovação prevista. Uma ADR Accepted com escopo limitado não autoriza extrapolar seu escopo. Uma ADR Deprecated permanece no histórico e não representa autorização vigente. **Uma ADR Accepted não pode ser reclassificada por inferência, conflito documental, risco ou análise de compatibilidade isolada:** a mudança exige justificativa, evidências, alternativas, avaliação de impacto, decisão das responsabilidades competentes e PR aprovada, conforme `docs/10-governanca-desenvolvimento.md`. Até a integração dessa mudança, permanece vigente o status registrado.

## Inventário

| ADR | Tema | Status | Escopo do status |
|---|---|---|---|
| [ADR-001](ADR-001-arquitetura-geral.md) | Arquitetura lógica geral | Proposed | Concordância específica do Tech Lead considerada recebida pelo PO em 26/11/2026 para componentes, fluxos, fronteiras de confiança e responsabilidades; decisão formal da TI sobre a arquitetura lógica permanece pendente |
| [ADR-002](ADR-002-frontend-nextjs.md) | Frontend | Accepted | Next.js 16 + React 19 + TypeScript; React + Vite explicitamente recusado para o Polychat |
| [ADR-003](ADR-003-supabase-vercel.md) | Direção tecnológica Supabase + Vercel | **Accepted** | Stack adotada e obrigatória; compatibilidade do modelo de utilização aprovada pela TI e FORD na Q-025 (24/11/2026) |
| [ADR-004](ADR-004-autenticacao-sessoes.md) | Autenticação e sessões | Proposed | Endpoints de login/logout/sessão e validação do perfil ativo integrados pela PR #174; testes unitários simulados; autenticação positiva com perfil real e integração uniforme dos handlers de negócio permanecem pendentes |
| [ADR-005](ADR-005-dados-postgresql.md) | Banco e modelo de dados | Proposed | PostgreSQL via Supabase Database em proposta; schema, migrations, RLS e auditoria evoluíram, mas a decisão específica desta ADR e as evidências de integração, operação e continuidade ainda exigem revisão |
| [ADR-006](ADR-006-autorizacao-rls.md) | Autorização server-side e RLS | **Accepted — escopo delimitado** | Contrato de perfis/sessões e policies RLS de domínio nas tabelas descritas na ADR; não cobre todos os handlers, Storage de objetos, Realtime ou homologação de produção |
| [ADR-007](ADR-007-realtime-mensageria.md) | Realtime e mensageria | Proposed | Compatibilidade do Supabase Realtime com a stack aprovada na Q-025; desenho específico, prova de conceito, controles e integração continuam pendentes |
| [ADR-008](ADR-008-storage-anexos.md) | Storage e anexos | Proposed | Supabase Storage é provedor nomeado e capacidade privada aprovada na Q-025; a arquitetura específica desta ADR permanece Proposed. Bucket privado e upload parcial integrados; download, revogação, scanner, quotas, EXIF/GPS, retenção e backup seguem pendentes |
| [ADR-009](ADR-009-ambientes-deploy.md) | Ambientes e deploy | **Accepted — escopo delimitado** | Compatibilidade/modelo de uso Supabase + Vercel, responsabilidades e direção de ambientes/deploy/rollback aprovados; não significa homologação integral, continuidade comprovada ou release autorizada |
| [ADR-010](ADR-010-seguranca-auditoria-monitoramento.md) | Segurança, auditoria e monitoramento | Proposed | Deve ser reconciliada com a FORD v2, os alinhamentos de requisitos e as obrigações legais aplicáveis |

## Decisões e restrições vigentes

1. A stack de frontend adotada é Next.js 16 + React 19 + TypeScript (ADR-002). React + Vite foi explicitamente recusado para o Polychat; não deve ser introduzido nem usado como base de migração sem ADR substitutiva aprovada.
2. A ADR-003 — Accepted define Supabase + Vercel como stack adotada e obrigatória. A Q-025 foi concluída em 24/11/2026, com aprovação da TI e da FORD para o modelo de utilização e para os provedores nomeados. Outros terceiros continuam sujeitos a aprovação específica.
3. Next.js permanece como frontend registrado na ADR-002. A compatibilidade e o modelo de utilização de Supabase + Vercel foram aprovados na Q-025; detalhes de integração e execução por serviço permanecem nas ADRs específicas. A aprovação não equivale à homologação funcional de produção nem permite inferir a conclusão de testes.
4. **Banco de dados:** PostgreSQL via Supabase Database é a tecnologia relacional utilizada no contexto da stack aprovada. A ADR-005 permanece Proposed para revisão da decisão técnica específica e das evidências de integração, operação e continuidade; isso não reabre a Q-025 nem altera a ADR-003.
5. A autenticação deve respeitar o provisionamento exclusivo pelo TI, os identificadores e credenciais definidos pela FORD, a recuperação pelo TI e a revogação imediata de sessões na desativação de conta (ADR-004), com configuração e validação na stack adotada.
6. **Autorização e RLS:** a ADR-006 está Accepted — escopo delimitado para o contrato de perfis/sessões e as policies RLS de domínio descritas nela. O aceite não equivale à integração uniforme de todos os handlers nem à homologação de produção; não contradiz a ADR-003.
7. **Realtime, Storage e ambientes:** ADR-007 permanece Proposed; ADR-008 permanece Proposed, embora a Q-025 tenha aprovado Supabase Storage como provedor nomeado/capacidade privada — essa autorização não constitui aceite desta ADR nem comprova o ciclo completo de anexos; ADR-009 está Accepted — escopo delimitado para compatibilidade/modelo de uso, ambientes, deploy, rollback e responsabilidades. A implementação e as evidências remanescentes não alteram a conclusão da Q-025.
8. Os requisitos funcionais de monitoramento, acesso administrativo, exportação, auditoria e retenção estão consolidados na baseline v0.5. A ADR-010 deve refletir essas decisões e o posicionamento informado pela FORD, sem afastar obrigações legais aplicáveis.

## Evidências verificadas no repositório

- `package.json`, `src/app/`, `next.config.ts`: aplicação Next.js 16 / React 19 / TypeScript.
- `src/app/page.tsx`: página inicial institucional; não comprova fluxos completos de chat.
- Endpoints `src/app/api/auth/login/route.ts`, `logout/route.ts`, `session/route.ts` e `src/auth/supabase-session.mjs`: autenticação/sessões com validação de perfil ativo; testes unitários usam Supabase simulado e não comprovam login positivo com usuário real.
- Migrations #101 integradas pela PR #172 e `supabase/tests/issue_101_rls.integration.sql`: 16/16 cenários aprovados em Polyford, além do teste de criação de conversa direta.
- Migrations/testes #102 integrados pela PR #173: `audit_events`, holds e descarte controlado de eventos em transações revertidas.
- Migration `202611250001_issue_124_privileged_audit.sql` e `src/audit/privileged-audit.mjs`: infraestrutura server-only integrada pela PR #170; callsites de negócio ainda pendentes.
- `.env.example`: placeholders de configuração Supabase, sem credenciais reais; não comprovam configuração do cliente nem integração funcional.
- `README.md` e arquivos de configuração registram a direção de uso da stack adotada; a presença dessas referências não comprova integração real, conformidade operacional nem homologação de produção.
- `.github/workflows/ci.yml`: testes, ESLint, TypeScript e build em push para `main` e PR para `main`.

A existência de código, migrations, testes em Polyford ou sucesso no CI não comprova homologação de produção nem integração ponta a ponta de todos os handlers. No Storage, há evidência de bucket privado e upload server-side parcial, mas ainda não há upload/download real comprovado no Polyford, integração antimalware, fluxo completo de anexos ou backup/restore dos objetos. Realtime, callsites completos de auditoria e demais controles operacionais também dependem das evidências previstas nas respectivas issues.

## Aprovações e responsabilidades pendentes

| Tema | Responsável pela revisão/decisão | Evidência necessária |
|---|---|---|
| Arquitetura lógica geral (ADR-001) | Tech Lead + TI; PO valida aderência ao escopo | A concordância específica do Tech Lead é considerada recebida pelo PO em 26/11/2026, nos limites registrados na ADR-001. **Pendente:** decisão formal da TI sobre a arquitetura modular, componentes, fluxos, fronteiras de confiança e responsabilidades. A compatibilidade/modelo de uso Supabase + Vercel já foi aprovado na Q-025 (24/11/2026) e registrado na ADR-003; não deve ser reaberto ou repetido. |
| Autenticação e sessões | Tech Lead + Dev backend + TI | Implementação e testes integrados no ambiente sob controle da FORD |
| Banco de dados e autorização/RLS de domínio | Tech Lead + Dev backend + TI | Migrations, políticas e testes de isolamento no ambiente homologado |
| Realtime e mensageria (ADR-007 — Proposed) | Tech Lead + Desenvolvimento + TI | Desenho específico, prova de conceito, validação de canais/policies, revogação e testes de integração antes do aceite da ADR |
| Storage e anexos (ADR-008 — Proposed)
| Ambientes, backup, restauração e operação (ADR-009 — Accepted — escopo delimitado)
| Aderência ao escopo, prioridades e rastreabilidade | Product Owner | Aceite de produto e atualização da documentação/backlog |

A FORD informou seu posicionamento institucional sobre privacidade e o papel de TI no tratamento de solicitações. Esse posicionamento deve ser documentado como informação do cliente; não elimina obrigações legais aplicáveis nem autoriza presumir aprovação jurídica inexistente.

## Questões da baseline e estados residuais

Manter as questões atualizadas em `08-glossario-e-questoes-em-aberto.md`. **Q-018 e Q-025 estão resolvidas/concluídas e não devem aparecer como pendências abertas.** O único item desta relação que permanece parcialmente aberto é Q-019:

- **Q-018 — resolvida em 20/11/2026:** catálogo de páginas, navegação primária, fluxos entre áreas e limites por perfil definidos em `docs/ux/decisoes-produto-q018-q019.md`. Detalhes de layout, componentes, protótipo, usabilidade, acessibilidade e implementação continuam nos respectivos trabalhos de UX, SQA e Desenvolvimento, sem reabrir a decisão de produto.
- **Q-019 — parcialmente aberta:** direção cromática provisória definida; resta receber/validar os ativos oficiais autorizados da identidade visual FORD, sobretudo o arquivo do Ford Oval e eventuais regras oficiais de aplicação/tipografia.
- **Q-025 — concluída em 24/11/2026:** TI e FORD aprovaram a compatibilidade do modelo de utilização Supabase + Vercel e dos provedores nomeados nos limites registrados. A aprovação não comprova execução de backups, restauração, testes de continuidade ou homologação de produção; esses itens permanecem nas issues operacionais correspondentes.

Os grupos de requisitos já alinhados com Desenvolvimento — armazenamento, alertas, desempenho, credenciais, chaves, retenção, homologação e isolamento de ambientes — não são pendências. A confiança nos administradores TI e a igualdade de seus poderes também não devem ser reabertas como pendência de requisito.

## Critérios de aceite da Issue #89

| Critério da issue | Situação documental |
|---|---|
| ADRs versionadas com contexto, decisão, consequências e status | Estrutura documentada; decisões específicas ainda aguardam revisões indicadas |
| Testes relevantes automatizados ou evidência documentada | Evidência parcial: testes em Polyford para RLS/auditoria e verificação de bucket privado; testes unitários simulados de autenticação e de validação de arquivos; faltam login real, upload/download de anexos ponta a ponta, antimalware, continuidade e outros testes de domínio/integração |
| Revisão por PR concluída | Pendente de revisão e aprovação humana |
| Sem regressão nos fluxos relacionados | A confirmar pelos checks da PR; as alterações desta rodada são documentais |

## Histórico

- **16/11/2026** — PR #133 criou uma primeira versão dos ADRs, encerrada sem merge; aquela versão não integra a `main`.
- **17/11/2026** — conjunto inicial revisado contra a baseline então vigente e o conteúdo da `main`.
- **19/11/2026** — ADR-002 e seu índice atualizados para registrar a recusa de React + Vite e alinhar a stack de frontend.
- **19/11/2026** — a revisão documental interpretou a FORD v2 como incompatibilidade com Supabase + Vercel e alterou ADR-003 para Deprecated, sem registrar neste índice uma decisão formal de substituição e respectiva avaliação de impacto.
- **20/11/2026** — a baseline POLY-REQ-001 v0.5 e as Issues #100/#102 reafirmaram a stack Supabase + Vercel como referência adotada; Q-025 permaneceu como avaliação de compatibilidade.
- **24/11/2026** — ADR-003 revisada para Accepted, preservando Supabase + Vercel como stack adotada; Q-025 concluída com aprovação da TI e da FORD para o modelo de utilização dos provedores nomeados, inclusive Storage. Essa aprovação da stack/provedores não equivale ao aceite das ADRs específicas 005 e 008; a ADR-009 registra o aceite delimitado de ambientes, deploy, rollback e responsabilidades.
- **26/11/2026** — índice harmonizado: ADR-005 e ADR-008 Proposed; ADR-006 Accepted — escopo delimitado; ADR-009 Accepted — escopo delimitado; Q-018 resolvida, Q-019 parcialmente aberta e Q-025 concluída. Na ADR-001, o PO registra a concordância específica do Tech Lead como recebida para a arquitetura lógica, sem criar evento formal `APPROVED`; a decisão específica da TI permanece pendente.

**Regra de fechamento:** a Issue #89 só deve ser fechada depois de as ADRs aplicáveis serem revisadas e aprovadas pelos responsáveis, a arquitetura compatível com a FORD ser formalizada, a PR desta revisão ser aprovada e integrada e os checks passarem. A Epic #77 só deve ser fechada depois que #89 for concluída e seu checklist for atualizado.
