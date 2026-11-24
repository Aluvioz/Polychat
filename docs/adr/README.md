# ADRs — Polychat

**Data de revisão:** 24/11/2026  
**Baseline funcional:** POLY-REQ-001 v0.5 — `docs/09-baseline-requisitos-mvp.md`  
**Épico:** #77 · **Issue:** #89  
**Escopo:** arquitetura lógica sob controle da FORD, frontend, autenticação, banco de dados, autorização/RLS, realtime, storage, ambientes, deploy, segurança e auditoria.

## Como ler os status

- **Accepted:** decisão restrita e sustentada por requisito ou implementação versionada. O escopo aceito está descrito na própria ADR; não significa aprovação de produção pela FORD.
- **Proposed:** proposta técnica aguardando revisão/aprovação dos responsáveis indicados.
- **Deprecated:** decisão anteriormente registrada, retirada por conflito com requisito posterior. Não deve orientar novas implementações.
- **Rejected / Superseded:** alternativas recusadas ou substituídas por decisão posterior.

Uma ADR Proposed não deve ser implementada como decisão final sem a aprovação prevista. Uma ADR Accepted com escopo limitado não autoriza extrapolar seu escopo. Uma ADR Deprecated permanece no histórico e não representa autorização vigente.

## Inventário

| ADR | Tema | Status | Escopo do status |
|---|---|---|---|
| [ADR-001](ADR-001-arquitetura-geral.md) | Arquitetura lógica geral | Proposed | Arquitetura modular com execução e dados sob controle da FORD; topologia e componentes ainda aguardam validação técnica |
| [ADR-002](ADR-002-frontend-nextjs.md) | Frontend | Accepted | Next.js 16 + React 19 + TypeScript; React + Vite explicitamente recusado para o Polychat |
| [ADR-003](ADR-003-supabase-vercel.md) | Direção tecnológica Supabase + Vercel | Accepted | Stack adotada para o Polychat; integração, configuração e homologação seguem sujeitas às ADRs e à Q-025 |
| [ADR-004](ADR-004-autenticacao-sessoes.md) | Autenticação e sessões | Proposed | Supabase Auth é a capacidade prevista na stack adotada; integração, configuração e validação operacional permanecem pendentes |
| [ADR-005](ADR-005-dados-postgresql.md) | Banco e modelo de dados | Proposed | PostgreSQL permanece como tecnologia de dados prevista na stack Supabase; schema, integração, políticas e configuração operacional seguem pendentes |
| [ADR-006](ADR-006-autorizacao-rls.md) | Autorização e RLS | Accepted — escopo limitado | Aceite cobre somente o contrato de perfis e a migration existente; não comprova RLS de domínio nem integração funcional, que permanecem pendentes de implementação e validação |
| [ADR-007](ADR-007-realtime-mensageria.md) | Realtime e mensageria | Proposed | Capacidade prevista no ecossistema Supabase; desenho, integração, controles e evidências permanecem pendentes |
| [ADR-008](ADR-008-storage-anexos.md) | Storage e anexos | Proposed | Supabase Storage é a capacidade prevista; armazenamento privado, scanner interno FORD, autorização, integração e compatibilidade operacional precisam ser validados |
| [ADR-009](ADR-009-ambientes-deploy.md) | Ambientes e deploy | Proposed | Vercel + Supabase são a stack adotada; isolamento, regiões, secrets, promoção, rollback, backup e responsabilidades operacionais precisam de validação |
| [ADR-010](ADR-010-seguranca-auditoria-monitoramento.md) | Segurança, auditoria e monitoramento | Proposed | Deve ser reconciliada com a FORD v2, os alinhamentos de requisitos e as obrigações legais aplicáveis |

## Decisões e restrições vigentes

1. A stack de frontend adotada é Next.js 16 + React 19 + TypeScript (ADR-002). React + Vite foi explicitamente recusado para o Polychat; não deve ser introduzido nem usado como base de migração sem ADR substitutiva aprovada.
2. A ADR-003 mantém Supabase + Vercel como stack adotada. A FORD v2 estabelece requisitos de controle da infraestrutura, localização e tratamento de dados; a Q-025 deve avaliar e documentar como a configuração e o modelo de utilização da stack atendem a esses requisitos, sem depreciar ou substituir a decisão por inferência.
3. A stack do projeto combina Next.js com Vercel e Supabase, conforme ADR-002 e ADR-003. A adoção tecnológica não equivale à homologação de produção: cada serviço e fluxo de dados deve ser configurado e validado conforme os requisitos da FORD e a Q-025.
4. PostgreSQL é a tecnologia de dados prevista na stack Supabase e detalhada na ADR-005. Modelo, políticas, configuração, localização, acessos e evidências de implantação permanecem sujeitos à revisão técnica e à Q-025.
5. A autenticação prevista por meio do Supabase Auth deve respeitar o provisionamento exclusivo pelo TI, os identificadores e credenciais definidos pela FORD, a recuperação pelo TI e a revogação imediata de sessões na desativação de conta (ADR-004).
6. A ADR-006 permanece Accepted apenas no escopo do contrato de autorização de perfis e da migration existente. Esse aceite não comprova integração funcional nem cobre autorização de conversas, grupos, mensagens ou anexos; a RLS de domínio precisa ser implementada e testada.
7. Realtime, armazenamento de anexos e ambientes devem seguir as ADRs 007 a 009 no contexto da stack adotada. Integração, privacidade, localização dos dados, acesso de terceiros e controles operacionais devem ser validados pela Q-025.
8. Os requisitos funcionais de monitoramento, acesso administrativo, exportação, auditoria e retenção estão consolidados na baseline v0.5. A ADR-010 deve refletir essas decisões e o posicionamento informado pela FORD, sem afastar obrigações legais aplicáveis.

## Evidências verificadas no repositório

- `package.json`, `src/app/`, `next.config.ts`: aplicação Next.js 16 / React 19 / TypeScript.
- `src/app/page.tsx`: página inicial institucional; não comprova fluxos completos de chat.
- `src/auth/authorization.mjs`: middleware Express-compatible com dependência de cliente Supabase e validação de token.
- `supabase/migrations/202611160001_profiles_roles_and_account_status.sql`: migration versionada de `profiles` e RLS no Supabase; permanece como scaffold e não comprova integração ao runtime, policies de domínio ou aplicação/homologação em ambiente real.
- `tests/authorization.test.mjs`: testes unitários com Supabase simulado; não comprovam integração com provedor ou infraestrutura de produção.
- `.env.example`: placeholders de configuração Supabase, sem credenciais reais; não comprovam configuração do cliente nem integração funcional.
- `README.md` e arquivos de configuração registram a direção de uso da stack adotada; a presença dessas referências não comprova integração real, conformidade operacional nem homologação de produção.
- `.github/workflows/ci.yml`: testes, ESLint, TypeScript e build em push para `main` e PR para `main`.

A existência de código, migrations, variáveis de exemplo ou sucesso no CI não comprova integração com infraestrutura FORD, aplicação de migrations em ambiente homologado, RLS completa, realtime, storage, antimalware ou fluxos ponta a ponta.

## Aprovações e responsabilidades pendentes

| Tema | Responsável pela revisão/decisão | Evidência necessária |
|---|---|---|
| Arquitetura e compatibilidade operacional da stack | Tech Lead + TI | Configuração Vercel/Supabase, fluxos, fronteiras, localização de dados, acessos e responsabilidades documentados na Q-025/ADRs |
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
- **Q-025:** avaliação técnica e documentação da compatibilidade da stack adotada Supabase + Vercel com os requisitos da FORD para infraestrutura, localização, acesso, armazenamento, processamento e responsabilidades operacionais. Não autoriza substituir a stack por inferência.

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
- **19/11/2026** — baseline atualizada para POLY-REQ-001 v0.4 após a FORD v2; ADR-003 foi temporariamente classificada como Deprecated sob interpretação de incompatibilidade da stack com os requisitos de infraestrutura.
- **24/11/2026** — ADR-003 foi revisada e voltou ao status Accepted, preservando Supabase + Vercel como stack adotada; Q-025 permanece aberta para validação documentada de compatibilidade, configuração e operação.

**Regra de fechamento:** a Issue #89 só deve ser fechada depois de as ADRs aplicáveis serem revisadas e aprovadas pelos responsáveis, a arquitetura compatível com a FORD ser formalizada, a PR desta revisão ser aprovada e integrada e os checks passarem. A Epic #77 só deve ser fechada depois que #89 for concluída e seu checklist for atualizado.
