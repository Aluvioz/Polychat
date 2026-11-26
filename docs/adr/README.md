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
| [ADR-001](ADR-001-arquitetura-geral.md) | Arquitetura lógica geral | Proposed | Arquitetura modular; compatibilização dos componentes e da configuração com os requisitos da FORD ainda depende de validação técnica/Q-025 |
| [ADR-002](ADR-002-frontend-nextjs.md) | Frontend | Accepted | Next.js 16 + React 19 + TypeScript; React + Vite explicitamente recusado para o Polychat |
| [ADR-003](ADR-003-supabase-vercel.md) | Direção tecnológica Supabase + Vercel | **Accepted** | Stack adotada e obrigatória; configuração, compatibilidade e homologação operacional permanecem sujeitas à Q-025 |
| [ADR-004](ADR-004-autenticacao-sessoes.md) | Autenticação e sessões | Proposed | Proposta específica de uso do Supabase Auth; desenho, configuração, integração e controles aguardam revisão técnica e avaliação operacional na Q-025 |
| [ADR-005](ADR-005-dados-postgresql.md) | Banco e modelo de dados | Proposed | PostgreSQL no contexto da plataforma Supabase adotada; modelo, configuração, controles e operação aguardam validação técnica |
| [ADR-006](ADR-006-autorizacao-rls.md) | Autorização e RLS | Accepted — escopo limitado | Aceite cobre o módulo e a migration de perfis; não cobre RLS de domínio nem comprova integração/homologação de produção |
| [ADR-007](ADR-007-realtime-mensageria.md) | Realtime e mensageria | Proposed | Supabase Realtime é alternativa em avaliação dentro da stack adotada; prova de conceito, controles e compatibilidade ainda pendentes |
| [ADR-008](ADR-008-storage-anexos.md) | Storage e anexos | Proposed | Proposta de armazenamento privado com Supabase Storage; configuração, controles de acesso/antimalware e condições operacionais aguardam revisão técnica e avaliação na Q-025 |
| [ADR-009](ADR-009-ambientes-deploy.md) | Ambientes e deploy | Proposed | Configuração de ambientes e deploy na stack Supabase + Vercel adotada; isolamento, controles e homologação permanecem pendentes |
| [ADR-010](ADR-010-seguranca-auditoria-monitoramento.md) | Segurança, auditoria e monitoramento | Proposed | Deve ser reconciliada com a FORD v2, os alinhamentos de requisitos e as obrigações legais aplicáveis |

## Decisões e restrições vigentes

1. A stack de frontend adotada é Next.js 16 + React 19 + TypeScript (ADR-002). React + Vite foi explicitamente recusado para o Polychat; não deve ser introduzido nem usado como base de migração sem ADR substitutiva aprovada.
2. A ADR-003 — Accepted define Supabase + Vercel como stack adotada e obrigatória. As exigências da FORD v2 sobre controle de hospedagem, armazenamento, processamento, localização e acesso continuam válidas e devem ser avaliadas na configuração/modelo de uso pela Q-025; uma tensão ou incompatibilidade identificada não altera automaticamente o status da ADR-003.
3. Next.js permanece como frontend registrado na ADR-002. Os serviços Supabase e a plataforma Vercel devem ser detalhados e configurados conforme as ADRs pertinentes e a Q-025; não presumir homologação de produção nem tratar esses componentes como proibidos ou depreciados sem decisão formal.
4. PostgreSQL é a tecnologia relacional considerada na ADR-005 no contexto da plataforma Supabase adotada. A configuração, os controles, a operação e a evidência de compatibilidade com os requisitos da FORD continuam dependentes da Q-025.
5. A autenticação deve respeitar o provisionamento exclusivo pelo TI, os identificadores e credenciais definidos pela FORD, a recuperação pelo TI e a revogação imediata de sessões na desativação de conta (ADR-004), com configuração e validação na stack adotada.
6. A ADR-006 permanece Accepted no escopo do módulo e da migration de perfis vinculados ao Supabase. Esse aceite não cobre os recursos de domínio do Polychat nem comprova integração/homologação de produção; não contradiz a adoção da plataforma estabelecida pela ADR-003.
7. Realtime, armazenamento de anexos e ambientes seguem em definição nas ADRs 007 a 009. As alternativas e configurações devem considerar a stack adotada e os requisitos de controle da FORD; eventual substituição exige o processo formal de mudança arquitetural.
8. Os requisitos funcionais de monitoramento, acesso administrativo, exportação, auditoria e retenção estão consolidados na baseline v0.5. A ADR-010 precisa refletir essas decisões e o posicionamento informado pela FORD, sem afastar obrigações legais aplicáveis.

## Evidências verificadas no repositório

- `package.json`, `src/app/`, `next.config.ts`: aplicação Next.js 16 / React 19 / TypeScript.
- `src/app/page.tsx`: página inicial institucional; não comprova fluxos completos de chat.
- `src/auth/authorization.mjs`: middleware Express-compatible com dependência de cliente Supabase e validação de token.
- `supabase/migrations/202611160001_profiles_roles_and_account_status.sql`: migration de `profiles` e RLS vinculada à arquitetura anterior.
- `tests/authorization.test.mjs`: testes unitários com Supabase simulado; não comprovam integração com provedor ou infraestrutura de produção.
- `.env.example`: placeholders históricos de Supabase, sem credenciais reais.
- `README.md`: registra Supabase + Vercel como stack adotada e obrigatória conforme ADR-003 — Accepted, mantendo a avaliação da configuração e do modelo de uso na Q-025 e sem declarar homologação de produção.
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

- **Q-019:** direção cromática provisória definida pelo PO; permanece pendente somente a obtenção/validação do arquivo oficial autorizado do Ford Oval e de eventuais regras corporativas específicas de aplicação/tipografia.
- **Q-025:** avaliação técnica da compatibilidade e configuração da stack Supabase + Vercel adotada frente às exigências de controle de infraestrutura, hospedagem, armazenamento, processamento, localização, acesso e operação da FORD; não autoriza substituição por inferência.

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
- **19/11/2026** — a revisão documental interpretou a FORD v2 como incompatibilidade com Supabase + Vercel e alterou ADR-003 para Deprecated, sem registrar neste índice uma decisão formal de substituição e respectiva avaliação de impacto.
- **20/11/2026** — a baseline POLY-REQ-001 v0.5 e as Issues #100/#102 reafirmaram a stack Supabase + Vercel como referência adotada; Q-025 permaneceu como avaliação de compatibilidade.
- **24/11/2026** — ADR-003 revisada para Accepted, com orientação explícita de que Q-025 não autoriza substituição por inferência; este índice e documentos dependentes foram alinhados à decisão vigente.

**Regra de fechamento:** a Issue #89 só deve ser fechada depois de as ADRs aplicáveis serem revisadas e aprovadas pelos responsáveis, a arquitetura compatível com a FORD ser formalizada, a PR desta revisão ser aprovada e integrada e os checks passarem. A Epic #77 só deve ser fechada depois que #89 for concluída e seu checklist for atualizado.
