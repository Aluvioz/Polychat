# ADRs — Polychat

**Data de revisão:** 17/11/2026  
**Baseline funcional:** POLY-REQ-001 v0.2 — `docs/09-baseline-requisitos-mvp.md`  
**Épico:** #77 · **Issue:** #89  
**Escopo:** frontend, arquitetura Supabase + Vercel, autenticação, modelo de dados, autorização/RLS, realtime, storage, ambientes, deploy, segurança e auditoria.

## Como ler os status

- **Accepted:** decisão restrita e já sustentada por requisito explícito da issue ou pela implementação versionada. O escopo aceito é descrito na própria ADR; não significa aprovação formal de produção pela FORD.
- **Proposed:** proposta técnica documentada, aguardando revisão/aprovação dos responsáveis indicados.
- **Rejected / Deprecated / Superseded:** alternativas recusadas, retiradas ou substituídas; nenhum ADR está nesses estados nesta revisão.

Uma ADR Proposed não deve ser implementada como decisão final sem a aprovação prevista. Uma ADR Accepted com escopo limitado não autoriza extrapolar o escopo descrito.

## Inventário

| ADR | Tema | Status | Escopo do status |
|---|---|---|---|
| [ADR-001](ADR-001-arquitetura-geral.md) | Arquitetura lógica geral | Proposed | Topologia modular e fronteiras entre camadas aguardam Tech Lead/TI |
| [ADR-002](ADR-002-frontend-nextjs.md) | Frontend | Accepted | Stack atual do repositório: Next.js 16, React 19 e TypeScript |
| [ADR-003](ADR-003-supabase-vercel.md) | Backend e provedores | Accepted | Supabase + Vercel como direção de execução da Issue #88; não é aceite de produção |
| [ADR-004](ADR-004-autenticacao-sessoes.md) | Autenticação e sessões | Proposed | Fluxo Supabase Auth e políticas de sessão ainda não estão integrados |
| [ADR-005](ADR-005-dados-postgresql.md) | Banco e modelo de dados | Proposed | PostgreSQL é a proposta; somente `profiles` está versionada hoje |
| [ADR-006](ADR-006-autorizacao-rls.md) | Autorização e RLS | Accepted | Aceito somente para o contrato de autorização de perfis e a migration existente |
| [ADR-007](ADR-007-realtime-mensageria.md) | Realtime e mensageria | Proposed | Persistência, canais e sincronização ainda não implementados |
| [ADR-008](ADR-008-storage-anexos.md) | Storage e anexos | Proposed | Storage privado e fluxo seguro ainda não implementados |
| [ADR-009](ADR-009-ambientes-deploy.md) | Ambientes e deploy | Proposed | Separação de ambientes, segredos, promoção e recuperação precisam de validação |
| [ADR-010](ADR-010-seguranca-auditoria-monitoramento.md) | Segurança, auditoria e monitoramento | Proposed | Requer aprovação expressa de negócio, TI, Segurança e Jurídico/Privacidade |

## Decisões registradas para a Issue #89

1. A stack de frontend observada e mantida no repositório é Next.js 16 + React 19 + TypeScript (ADR-002).
2. Supabase + Vercel são a direção tecnológica exigida como referência de execução da Issue #88 (ADR-003). A integração Supabase ainda está pendente e não se declara produção homologada.
3. O contrato de autorização existente aceita apenas os perfis `user` e `ti`, obtém identidade por validação server-side, consulta estado/perfil no banco e falha fechada (ADR-006). A aceitação cobre apenas perfis; não cobre autorização de conversas, grupos ou anexos.
4. Realtime, Storage, modelo completo de dados e configuração de ambientes permanecem propostas, não funcionalidades entregues.
5. Monitoramento de conteúdo e consulta administrativa exigem governança e aprovação próprias. Não há decisão aprovada de E2EE, retenção, exportação ou bloqueio automático de mensagens (ADR-010).

## Evidências verificadas no repositório

- `package.json`, `src/app/`, `next.config.ts`: aplicação Next.js 16 / React 19 / TypeScript.
- `src/app/page.tsx`: somente página inicial de apresentação; não comprova fluxo de chat.
- `src/auth/authorization.mjs`: middleware Express-compatible que valida JWT com `supabase.auth.getUser`, lê `profiles` e restringe papéis/contas.
- `supabase/migrations/202611160001_profiles_roles_and_account_status.sql`: criação de `profiles`, RLS, leitura própria/TI e bloqueio de escrita direta de clientes.
- `tests/authorization.test.mjs`: 11 testes unitários com Supabase simulado.
- `.env.example`: placeholders de URL e anon key; sem credenciais reais.
- `README.md`: declara que a integração com Supabase ainda não foi conectada.
- `.github/workflows/ci.yml`: testes, ESLint, TypeScript e build em push para `main` e PR para `main`.

A fotografia técnica da baseline #88 foi atualizada na versão 0.3 para refletir a `main` em 17/11/2026. O CI mais recente consultado para a `main` passou, mas isso não substitui testes de integração com Supabase, RLS real, realtime, storage ou fluxos ponta a ponta.

## Aprovações e responsabilidades pendentes

| Tema | Responsável pela revisão/decisão | Evidência necessária |
|---|---|---|
| Arquitetura lógica, integração Next.js/Supabase e operação | Tech Lead + TI | Revisão técnica registrada na PR/ADR |
| Autenticação, sessões, modelo de dados e RLS de domínio | Tech Lead + Dev backend + TI | Revisão de código, migrações e testes integrados |
| Realtime e Storage | Tech Lead + Dev backend + Segurança | Prova de conceito e testes de autorização/isolamento |
| Região, jurisdição, fornecedores, ambientes, backup e recuperação | TI + Segurança + responsável contratual | Configuração homologada, responsabilidades, RPO/RTO e evidências |
| Acesso do TI ao conteúdo, monitoramento, transparência e retenção | Representante da FORD + TI + Segurança + Jurídico/Privacidade | Aprovação expressa e política institucional |
| Escopo, prioridades e rastreabilidade | Product Owner | Aceite de produto e atualização do backlog |

## Questões da baseline que continuam abertas

Manter as questões Q-001 a Q-024 de `08-glossario-e-questoes-em-aberto.md`. Para as decisões arquiteturais, são especialmente relevantes Q-002 a Q-015, Q-017, Q-020 e Q-024. A emissão destas ADRs não fecha essas questões automaticamente.

## Critérios de aceite da Issue #89

| Critério da issue | Situação documental |
|---|---|
| ADRs versionadas com contexto, decisão, consequências e status | Atendido por este conjunto de ADRs, após revisão e merge |
| Testes relevantes automatizados ou evidência documentada | Evidência parcial: 11 testes simulados de autorização e workflow CI; faltam testes de integração/RLS real e fluxos ainda não implementados |
| Revisão por PR concluída | Pendente de revisão e aprovação humana |
| Sem regressão nos fluxos relacionados | A confirmar pelos checks da PR; alteração proposta é documental, sem alteração de runtime |

## Histórico

- 16/11/2026 — PR #133 criou uma primeira versão dos ADRs, mas foi encerrada sem merge. Essa versão não integra a `main`.
- 17/11/2026 — conjunto revisado contra a baseline #88 e o conteúdo efetivo da `main`; substitui a tentativa não integrada da PR #133.

**Regra de fechamento:** a Issue #89 só deve ser fechada depois de a PR desta revisão ser aprovada e integrada, os checks passarem e as pendências de aprovação críticas permanecerem claramente replanejadas com responsáveis. A Epic #77 só deve ser fechada depois que #89 for concluída e seu checklist for atualizado.
