# ADRs — Polychat

**Data de revisão:** 19/11/2026  
**Baseline funcional:** POLY-REQ-001 v0.4 — `docs/09-baseline-requisitos-mvp.md`  
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
| [ADR-003](ADR-003-supabase-vercel.md) | Direção histórica Supabase + Vercel | Deprecated | Decisão da Issue #88 retirada após a FORD v2; não é arquitetura-alvo |
| [ADR-004](ADR-004-autenticacao-sessoes.md) | Autenticação e sessões | Proposed | Requisitos funcionais consolidados; mecanismo de identidade deve operar sob controle da FORD |
| [ADR-005](ADR-005-dados-postgresql.md) | Banco e modelo de dados | Proposed | PostgreSQL permanece como tecnologia proposta, sem hospedagem Supabase ou serviço externo |
| [ADR-006](ADR-006-autorizacao-rls.md) | Autorização e RLS | Accepted — escopo legado limitado | Aceite cobre apenas o módulo e a migration de perfis vinculados ao Supabase; precisa ser adaptado/revalidado para a arquitetura FORD |
| [ADR-007](ADR-007-realtime-mensageria.md) | Realtime e mensageria | Proposed | Proposta anterior dependente de Supabase; precisa ser reconciliada com processamento interno à infraestrutura FORD |
| [ADR-008](ADR-008-storage-anexos.md) | Storage e anexos | Proposed | Storage deve permanecer sob controle da FORD; proposta anterior de Supabase Storage não é opção vigente |
| [ADR-009](ADR-009-ambientes-deploy.md) | Ambientes e deploy | Proposed | Vercel/Supabase não são destinos-alvo; ambientes e promoção devem ser definidos na infraestrutura FORD |
| [ADR-010](ADR-010-seguranca-auditoria-monitoramento.md) | Segurança, auditoria e monitoramento | Proposed | Regras funcionais consolidadas na FORD v2; implementação, catálogo técnico e controles na infraestrutura FORD aguardam validação |

## Decisões e restrições vigentes

1. A stack de frontend adotada é Next.js 16 + React 19 + TypeScript (ADR-002). React + Vite foi explicitamente recusado para o Polychat; não deve ser introduzido nem usado como base de migração sem ADR substitutiva aprovada.
2. A FORD v2 exige infraestrutura sob controle da FORD, preferencialmente no Brasil, sem terceiro acessando, armazenando ou processando dados da organização. A decisão anterior Supabase + Vercel foi depreciada na ADR-003.
3. O framework Next.js permanece válido como stack de frontend; isso não autoriza hospedagem Vercel nem uso de Supabase Auth, Database, Storage ou Realtime para dados da FORD.
4. PostgreSQL é a tecnologia de banco relacional proposta na ADR-005, desde que a instância e sua operação permaneçam sob controle da FORD. A escolha técnica e a homologação da implantação continuam dependentes da Q-025.
5. A autenticação deve respeitar o provisionamento exclusivo pelo TI, os identificadores e credenciais definidos pela FORD, a recuperação pelo TI e a revogação imediata de sessões na desativação de conta (ADR-004).
6. A ADR-006 permanece Accepted somente para o módulo e a migration legados que implementam autorização de perfis vinculados ao Supabase. Esse aceite não aprova o Supabase como provedor-alvo nem cobre os recursos de domínio do Polychat.
7. Realtime, armazenamento de anexos e ambientes precisam ser redesenhados ou validados para execução dentro da fronteira de controle da FORD (ADRs 007 a 009).
8. Os requisitos funcionais de monitoramento, acesso administrativo, exportação, auditoria e retenção estão consolidados na baseline v0.4 e foram incorporados à ADR-010. Seu status permanece Proposed porque implantação, catálogo técnico, evidências de segurança e integração com infraestrutura FORD ainda precisam de revisão.

## Evidências verificadas no repositório

- `package.json`, `src/app/`, `next.config.ts`: aplicação Next.js 16 / React 19 / TypeScript.
- `src/app/page.tsx`: página inicial institucional; não comprova fluxos completos de chat.
- `src/auth/authorization.mjs`: middleware Express-compatible com dependência de cliente Supabase e validação de token.
- `supabase/migrations/202611160001_profiles_roles_and_account_status.sql`: migration de `profiles` e RLS vinculada à arquitetura anterior.
- `tests/authorization.test.mjs`: testes unitários com Supabase simulado; não comprovam integração com provedor ou infraestrutura de produção.
- `.env.example`: placeholders históricos de Supabase, sem credenciais reais.
- `README.md`: atualizado para registrar a restrição de infraestrutura FORD e remover instruções de deploy Vercel/configuração Supabase como destino do produto.
- `.github/workflows/ci.yml`: testes, ESLint, TypeScript e build em push para `main` e PR para `main`.

A existência de código, migrations, variáveis de exemplo ou sucesso no CI não comprova integração com infraestrutura FORD, aplicação de migrations em ambiente homologado, RLS completa, realtime, storage, antimalware ou fluxos ponta a ponta.

## Aprovações e responsabilidades pendentes

| Tema | Responsável pela revisão/decisão | Evidência necessária |
|---|---|---|
| Arquitetura lógica e infraestrutura compatível com a FORD | Tech Lead + TI | Solução técnica selecionada, fronteiras e responsabilidades registradas na ADR |
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
- **Q-025:** reconciliação técnica da arquitetura com a exigência de infraestrutura sob controle da FORD, sem terceiro acessando, armazenando ou processando dados.

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
- **19/11/2026** — baseline atualizada para POLY-REQ-001 v0.4 após a FORD v2; README e ADRs 001, 003, 004 e 005 revisados para refletir a restrição de infraestrutura sob controle da FORD. ADR-003 passou a Deprecated.
- **19/11/2026** — ADR-008, ADR-009, ADR-010, modelo de dados, matriz #100, política de anexos, documentação de autorização e proposta APF reconciliados com a FORD v2 na branch `docs/ford-v2-governance-reconciliation`; os arquivos permanecem sujeitos à revisão por PR.

**Regra de fechamento:** a Issue #89 só deve ser fechada depois de as ADRs aplicáveis serem revisadas e aprovadas pelos responsáveis, a arquitetura compatível com a FORD ser formalizada, a PR desta revisão ser aprovada e integrada e os checks passarem. A Epic #77 só deve ser fechada depois que #89 for concluída e seu checklist for atualizado.
