# ADRs — Polychat

**Data de revisão:** 19/11/2026  
**Baseline funcional:** POLY-REQ-001 v0.4 — `docs/09-baseline-requisitos-mvp.md`  
**Épico:** #77 · **Issue:** #89  
**Escopo:** arquitetura lógica baseada na stack oficial Supabase + Vercel, sob governança da FORD: frontend, autenticação, banco de dados, autorização/RLS, realtime, storage, ambientes, deploy, segurança e auditoria.

## Como ler os status

- **Accepted:** decisão restrita e sustentada por requisito ou implementação versionada. O escopo aceito está descrito na própria ADR; não significa aprovação de produção pela FORD.
- **Proposed:** proposta técnica aguardando revisão/aprovação dos responsáveis indicados.
- **Deprecated:** decisão anteriormente registrada, retirada por conflito com requisito posterior. Não deve orientar novas implementações.
- **Rejected / Superseded:** alternativas recusadas ou substituídas por decisão posterior.

Uma ADR Proposed não deve ser implementada como decisão final sem a aprovação prevista. Uma ADR Accepted com escopo limitado não autoriza extrapolar seu escopo. Uma ADR Deprecated permanece no histórico e não representa autorização vigente.

## Inventário

| ADR | Tema | Status | Escopo do status |
|---|---|---|---|
| [ADR-001](ADR-001-arquitetura-geral.md) | Arquitetura lógica geral | Proposed | Arquitetura modular com Supabase/Vercel oficiais e governança operacional da FORD; topologia e componentes ainda aguardam validação técnica |
| [ADR-002](ADR-002-frontend-nextjs.md) | Frontend | Accepted | Next.js 16 + React 19 + TypeScript; React + Vite explicitamente recusado para o Polychat |
| [ADR-003](ADR-003-supabase-vercel.md) | Plataformas oficiais Supabase + Vercel | Accepted | Supabase (backend) e Vercel (hospedagem/deploy) são a stack oficial confirmada pelo PO |
| [ADR-004](ADR-004-autenticacao-sessoes.md) | Autenticação e sessões | Proposed | Supabase Auth é o serviço oficial de identidade; integração às rotas e validação por ambiente pendentes |
| [ADR-005](ADR-005-dados-postgresql.md) | Banco e modelo de dados | Proposed | PostgreSQL via Supabase Database; schema, migrations, RLS e backup ainda exigem validação |
| [ADR-006](ADR-006-autorizacao-rls.md) | Autorização e RLS | Accepted — escopo limitado | Aceite cobre apenas perfis; políticas RLS de domínio e integração às rotas ainda precisam ser implementadas e testadas |
| [ADR-007](ADR-007-realtime-mensageria.md) | Realtime e mensageria | Proposed | Supabase Realtime é a opção da stack oficial; prova de conceito e regras de autorização pendentes |
| [ADR-008](ADR-008-storage-anexos.md) | Storage e anexos | Proposed | Supabase Storage é a opção oficial; privacidade, scanner, URLs temporárias e revogação exigem validação |
| [ADR-009](ADR-009-ambientes-deploy.md) | Ambientes e deploy | Proposed | Vercel e Supabase oficiais; segregação, variáveis, regiões e acessos por ambiente em validação |
| [ADR-010](ADR-010-seguranca-auditoria-monitoramento.md) | Segurança, auditoria e monitoramento | Proposed | Regras funcionais consolidadas; implementação, catálogo técnico e controles na stack oficial aguardam validação |

## Decisões e restrições vigentes

1. A stack de frontend adotada é Next.js 16 + React 19 + TypeScript (ADR-002). React + Vite foi explicitamente recusado para o Polychat; não deve ser introduzido nem usado como base de migração sem ADR substitutiva aprovada.
2. Supabase e Vercel são as plataformas oficiais do Polychat, conforme decisão confirmada pelo PO e registrada na ADR-003.
3. Vercel é a plataforma oficial de hospedagem/deploy e Supabase é a plataforma oficial de backend; os serviços específicos são detalhados nas ADRs 004 a 008.
4. PostgreSQL via Supabase Database é a direção de persistência. Q-025 permanece para validar regiões, projetos, acessos, segredos e configuração real dos ambientes.
5. A autenticação deve respeitar o provisionamento exclusivo pelo TI, os identificadores e credenciais definidos pela FORD, a recuperação pelo TI e a revogação imediata de sessões na desativação de conta (ADR-004).
6. A ADR-006 permanece Accepted apenas para o módulo e a migration de perfis; não cobre as políticas RLS de domínio nem comprova integração às rotas reais.
7. Realtime, armazenamento de anexos e ambientes utilizam a stack Supabase/Vercel oficial e precisam de validação técnica conforme as ADRs 007 a 009.
8. Os requisitos funcionais de monitoramento, acesso administrativo, exportação, auditoria e retenção estão consolidados na baseline v0.4 e foram incorporados à ADR-010. Seu status permanece Proposed porque implantação, catálogo técnico, evidências de segurança e integração com infraestrutura FORD ainda precisam de revisão.

## Evidências verificadas no repositório

- `package.json`, `src/app/`, `next.config.ts`: aplicação Next.js 16 / React 19 / TypeScript.
- `src/app/page.tsx`: página inicial institucional; não comprova fluxos completos de chat.
- `src/auth/authorization.mjs`: middleware Express-compatible com dependência de cliente Supabase e validação de token.
- `supabase/migrations/202611160001_profiles_roles_and_account_status.sql`: migration de `profiles` e RLS vinculada à arquitetura anterior.
- `tests/authorization.test.mjs`: testes unitários com Supabase simulado; não comprovam integração com provedor ou infraestrutura de produção.
- `.env.example`: placeholders históricos de Supabase, sem credenciais reais.
- `README.md`: registra Supabase e Vercel como plataformas oficiais e documenta a necessidade de validar a integração funcional por ambiente.
- `.github/workflows/ci.yml`: testes, ESLint, TypeScript e build em push para `main` e PR para `main`.

A existência de código, migrations, variáveis de exemplo ou sucesso no CI não comprova integração completa com Supabase/Vercel, aplicação de migrations em todos os ambientes, RLS de domínio, realtime, storage, antimalware ou fluxos ponta a ponta.

## Aprovações e responsabilidades pendentes

| Tema | Responsável pela revisão/decisão | Evidência necessária |
|---|---|---|
| Arquitetura lógica e infraestrutura compatível com a FORD | Tech Lead + TI | Solução técnica selecionada, fronteiras e responsabilidades registradas na ADR |
| Autenticação e sessões | Tech Lead + Dev backend + TI | Implementação e testes integrados nos ambientes oficiais Supabase/Vercel |
| Banco de dados e autorização/RLS de domínio | Tech Lead + Dev backend + TI | Migrations, políticas e testes de isolamento no ambiente homologado |
| Realtime, storage e antimalware | Tech Lead + Dev backend + TI | Prova de conceito e testes de acesso, revogação e falha segura |
| Ambientes, backup, restauração e operação | TI + Tech Lead | Ambientes isolados, configuração homologada e evidências de recuperação |
| Aderência ao escopo, prioridades e rastreabilidade | Product Owner | Aceite de produto e atualização da documentação/backlog |

A FORD informou seu posicionamento institucional sobre privacidade e o papel de TI no tratamento de solicitações. Esse posicionamento deve ser documentado como informação do cliente; não elimina obrigações legais aplicáveis nem autoriza presumir aprovação jurídica inexistente.

## Questões da baseline que continuam abertas

Manter as questões atualizadas em `08-glossario-e-questoes-em-aberto.md`. Permanecem abertas:

- **Q-018:** refinamento interno do mapa de telas, navegação e wireframes pelo PO/UX.
- **Q-019:** obtenção/validação dos ativos oficiais da identidade visual FORD, caso ainda não estejam disponíveis.
- **Q-025:** validação técnica da configuração da stack oficial Supabase/Vercel (projetos, regiões, ambientes, acessos, segredos, integrações e evidências).

Os grupos de requisitos já alinhados com Desenvolvimento — armazenamento, alertas, desempenho, credenciais, chaves, retenção, homologação e isolamento de ambientes — não são pendências. A confiança nos administradores TI e a igualdade de seus poderes também não devem ser reabertas como pendência de requisito.

## Critérios de aceite da Issue #89

| Critério da issue | Situação documental |
|---|---|
| ADRs versionadas com contexto, decisão, consequências e status | Estrutura documentada; decisões específicas ainda aguardam revisões indicadas |
| Testes relevantes automatizados ou evidência documentada | Evidência parcial: testes unitários simulados de autorização e workflow CI; faltam integrações com a arquitetura-alvo |
| Revisão por PR concluída | Pendente de revisão e aprovação humana |
| Sem regressão nos fluxos relacionados | A confirmar pelos checks da PR; as alterações desta rodada são documentais |

## Histórico

- **16/11/2026** — PR #133 criou uma primeira versão dos ADRs, encerrada sem merge; aquela versão não integra a `main`.
- **17/11/2026** — conjunto inicial revisado contra a baseline então vigente e o conteúdo da `main`.
- **19/11/2026** — ADR-002 e seu índice atualizados para registrar a recusa de React + Vite e alinhar a stack de frontend.
- **19/11/2026** — revisão documental inicial marcou incorretamente Supabase/Vercel como Deprecated; o PO confirmou que ambas são plataformas oficiais e alinhadas, e esta ADR-003 foi restaurada como Accepted.
- **19/11/2026** — ADR-008, ADR-009, ADR-010, modelo de dados, matriz #100, política de anexos, documentação de autorização e proposta APF reconciliados com a FORD v2 na branch `docs/ford-v2-governance-reconciliation`; os arquivos permanecem sujeitos à revisão por PR.

**Regra de fechamento:** a Issue #89 só deve ser fechada depois de as ADRs aplicáveis serem revisadas e aprovadas pelos responsáveis, a arquitetura compatível com a FORD ser formalizada, a PR desta revisão ser aprovada e integrada e os checks passarem. A Epic #77 só deve ser fechada depois que #89 for concluída e seu checklist for atualizado.
