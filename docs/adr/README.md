# ADRs — Polychat

**Data de revisão:** 24/11/2026  
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
| [ADR-001](ADR-001-arquitetura-geral.md) | Arquitetura lógica geral | Proposed | Arquitetura modular; a compatibilidade da stack e do modelo de operação foi aprovada na Q-025; detalhamento de componentes permanece no escopo desta ADR |
| [ADR-002](ADR-002-frontend-nextjs.md) | Frontend | Accepted | Next.js 16 + React 19 + TypeScript; React + Vite explicitamente recusado para o Polychat |
| [ADR-003](ADR-003-supabase-vercel.md) | Direção tecnológica Supabase + Vercel | **Accepted** | Stack adotada e obrigatória; compatibilidade do modelo de utilização aprovada pela TI e FORD na Q-025 (24/11/2026) |
| [ADR-004](ADR-004-autenticacao-sessoes.md) | Autenticação e sessões | Proposed | Endpoints de login/logout/sessão e validação do perfil ativo integrados pela PR #174; testes unitários simulados; autenticação positiva com perfil real e integração uniforme dos handlers de negócio permanecem pendentes |
| [ADR-005](ADR-005-dados-postgresql.md) | Banco e modelo de dados | **Accepted** | PostgreSQL no Supabase aprovado na Q-025; policies RLS #101 e auditoria/retenção #102 integradas/testadas em desenvolvimento; handlers restantes, Storage e backup/restore pendentes |
| [ADR-006](ADR-006-autorizacao-rls.md) | Autorização e RLS | Accepted — escopo de desenvolvimento | Perfis/sessões e policies RLS de domínio implementados/testados em Polyford pelas PRs #172/#174; não equivale à integração completa dos handlers ou homologação de produção |
| [ADR-007](ADR-007-realtime-mensageria.md) | Realtime e mensageria | Proposed | Compatibilidade do Supabase Realtime com a stack aprovada na Q-025; desenho específico, prova de conceito, controles e integração continuam pendentes |
| [ADR-008](ADR-008-storage-anexos.md) | Storage e anexos | **Accepted** | Supabase Storage aprovado como capacidade de armazenamento privado; bucket, handlers, scanner e autorização seguem como entregas de implementação |
| [ADR-009](ADR-009-ambientes-deploy.md) | Ambientes e deploy | **Accepted** | Ambientes, segregação, deploy, secrets, rollback e responsabilidades aprovados na Q-025; execução dos testes por release permanece aplicável |
| [ADR-010](ADR-010-seguranca-auditoria-monitoramento.md) | Segurança, auditoria e monitoramento | Proposed | Deve ser reconciliada com a FORD v2, os alinhamentos de requisitos e as obrigações legais aplicáveis |

## Decisões e restrições vigentes

1. A stack de frontend adotada é Next.js 16 + React 19 + TypeScript (ADR-002). React + Vite foi explicitamente recusado para o Polychat; não deve ser introduzido nem usado como base de migração sem ADR substitutiva aprovada.
2. A ADR-003 — Accepted define Supabase + Vercel como stack adotada e obrigatória. A Q-025 foi concluída em 24/11/2026, com aprovação da TI e da FORD para o modelo de utilização e para os provedores nomeados. Outros terceiros continuam sujeitos a aprovação específica.
3. Next.js permanece como frontend registrado na ADR-002. A compatibilidade e o modelo de utilização de Supabase + Vercel foram aprovados na Q-025; detalhes de integração e execução por serviço permanecem nas ADRs específicas. A aprovação não equivale à homologação funcional de produção nem permite inferir a conclusão de testes.
4. PostgreSQL é a tecnologia relacional adotada na ADR-005, no contexto da plataforma Supabase aprovada na Q-025. Policies de domínio #101 e controles de auditoria/retenção #102 estão integrados/testados em desenvolvimento; handlers restantes, Storage e continuidade seguem pendentes.
5. A autenticação deve respeitar o provisionamento exclusivo pelo TI, os identificadores e credenciais definidos pela FORD, a recuperação pelo TI e a revogação imediata de sessões na desativação de conta (ADR-004), com configuração e validação na stack adotada.
6. A ADR-006 permanece Accepted: além do contrato de perfis/sessões, policies RLS de domínio foram integradas e testadas pela #101 em Polyford. O aceite não equivale à integração uniforme de todos os handlers nem à homologação de produção; não contradiz a ADR-003.
7. Realtime, armazenamento de anexos e ambientes seguem em definição nas ADRs 007 a 009. As alternativas e configurações devem considerar a stack adotada e os requisitos de controle da FORD; eventual substituição exige o processo formal de mudança arquitetural.
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

A existência de código, migrations, testes em Polyford ou sucesso no CI não comprova homologação de produção, integração ponta a ponta de todos os handlers, realtime, Storage, antimalware, backup/restore ou callsites completos de auditoria.

## Aprovações e responsabilidades pendentes

| Tema | Responsável pela revisão/decisão | Evidência necessária |
|---|---|---|
| Arquitetura lógica geral (ADR-001) | Tech Lead + TI; PO valida aderência ao escopo | Revisão e decisão formal da arquitetura modular, dos componentes, das fronteiras de confiança e das responsabilidades. A compatibilidade e o modelo de utilização Supabase + Vercel já foram aprovados na Q-025 (24/11/2026) e registrados na ADR-003; essa aprovação não está pendente nem precisa ser repetida. |
| Autenticação e sessões | Tech Lead + Dev backend + TI | Implementação e testes integrados no ambiente sob controle da FORD |
| Banco de dados e autorização/RLS de domínio | Tech Lead + Dev backend + TI | Migrations, políticas e testes de isolamento no ambiente homologado |
| Realtime, storage e antimalware | Tech Lead + Dev backend + TI | Prova de conceito e testes de acesso, revogação e falha segura |
| Ambientes, backup, restauração e operação | TI + Tech Lead | Ambientes isolados, configuração homologada e evidências de recuperação |
| Aderência ao escopo, prioridades e rastreabilidade | Product Owner | Aceite de produto e atualização da documentação/backlog |

A FORD informou seu posicionamento institucional sobre privacidade e o papel de TI no tratamento de solicitações. Esse posicionamento deve ser documentado como informação do cliente; não elimina obrigações legais aplicáveis nem autoriza presumir aprovação jurídica inexistente.

## Questões da baseline que continuam abertas

Manter as questões atualizadas em `08-glossario-e-questoes-em-aberto.md`. Permanecem abertas:

- **Q-018:** refinamento interno do mapa de telas, navegação e wireframes pelo PO/UX.
- **Q-019:** obtenção/validação dos ativos oficiais da identidade visual FORD, caso ainda não estejam disponíveis.
- **Q-025 — concluída em 24/11/2026:** compatibilidade do modelo de utilização Supabase + Vercel aprovada pela TI e pela FORD. A aprovação cobre provedores nomeados, ambientes, dados, Storage, segredos, continuidade e responsabilidades; não substitui a implementação e os testes dos controles nas respectivas issues.

Os grupos de requisitos já alinhados com Desenvolvimento — armazenamento, alertas, desempenho, credenciais, chaves, retenção, homologação e isolamento de ambientes — não são pendências. A confiança nos administradores TI e a igualdade de seus poderes também não devem ser reabertas como pendência de requisito.

## Critérios de aceite da Issue #89

| Critério da issue | Situação documental |
|---|---|
| ADRs versionadas com contexto, decisão, consequências e status | Estrutura documentada; decisões específicas ainda aguardam revisões indicadas |
| Testes relevantes automatizados ou evidência documentada | Evidência parcial: testes unitários simulados de autorização e workflow CI; faltam integrações reais com Supabase, validação operacional da configuração Vercel/Supabase e testes de domínio |
| Revisão por PR concluída | Pendente de revisão e aprovação humana |
| Sem regressão nos fluxos relacionados | A confirmar pelos checks da PR; as alterações desta rodada são documentais |

## Histórico

- **16/11/2026** — PR #133 criou uma primeira versão dos ADRs, encerrada sem merge; aquela versão não integra a `main`.
- **17/11/2026** — conjunto inicial revisado contra a baseline então vigente e o conteúdo da `main`.
- **19/11/2026** — ADR-002 e seu índice atualizados para registrar a recusa de React + Vite e alinhar a stack de frontend.
- **19/11/2026** — a revisão documental interpretou a FORD v2 como incompatibilidade com Supabase + Vercel e alterou ADR-003 para Deprecated, sem registrar neste índice uma decisão formal de substituição e respectiva avaliação de impacto.
- **20/11/2026** — a baseline POLY-REQ-001 v0.5 e as Issues #100/#102 reafirmaram a stack Supabase + Vercel como referência adotada; Q-025 permaneceu como avaliação de compatibilidade.
- **24/11/2026** — ADR-003 revisada para Accepted, preservando Supabase + Vercel como stack adotada; Q-025 concluída com aprovação da TI e da FORD. ADR-005, ADR-008 e ADR-009 foram aceitas nos respectivos escopos de dados, Storage e operação de ambientes.

**Regra de fechamento:** a Issue #89 só deve ser fechada depois de as ADRs aplicáveis serem revisadas e aprovadas pelos responsáveis, a arquitetura compatível com a FORD ser formalizada, a PR desta revisão ser aprovada e integrada e os checks passarem. A Epic #77 só deve ser fechada depois que #89 for concluída e seu checklist for atualizado.
