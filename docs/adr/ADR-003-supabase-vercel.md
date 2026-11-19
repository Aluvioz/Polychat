# ADR-003 — Direção tecnológica histórica: Supabase + Vercel

- **Status:** Deprecated
- **Data da decisão original:** 17/11/2026
- **Data da revisão:** 19/11/2026
- **Issue de origem:** #89 · **Referência original:** #88
- **Substituição de requisito:** POLY-REQ-001 v0.4 / FORD v2
- **Escopo:** registro histórico da direção tecnológica anteriormente aceita; não constitui arquitetura-alvo vigente.

## Contexto

A versão anterior desta ADR registrou Supabase + Vercel como direção de execução do MVP, com base na Issue #88. A decisão havia sido marcada como Accepted para aquela direção e não representava homologação de produção.

Em 19/11/2026, a FORD v2 consolidou uma restrição incompatível com essa direção: hospedagem e infraestrutura devem permanecer sob controle da FORD, preferencialmente no Brasil, e nenhum serviço de terceiro pode acessar, armazenar ou processar dados da organização.

A baseline POLY-REQ-001 v0.4 determina que as respostas e decisões atuais da FORD prevalecem sobre premissas tecnológicas anteriores incompatíveis. Portanto, o aceite histórico de Supabase + Vercel não pode ser utilizado como autorização para produção nem como decisão vigente de arquitetura.

## Problema

Registrar a retirada formal da direção anterior sem apagar seu histórico, sem confundir a presença de artefatos no repositório com aprovação do cliente e sem antecipar uma nova escolha de fornecedor ou plataforma antes da revisão de arquitetura.

## Decisão

**Retirar Supabase + Vercel como arquitetura-alvo do Polychat.** O status Accepted anterior fica depreciado a partir da revisão da FORD v2.

Consequências diretas:

- **Vercel:** não deve ser considerada destino de hospedagem ou execução do Polychat com dados da FORD.
- **Supabase Auth:** não deve ser adotado como provedor de identidade/sessões para dados e identidades da FORD.
- **Supabase Database:** não deve ser utilizado como banco hospedado para dados da FORD.
- **Supabase Storage:** não deve armazenar anexos ou outros dados da FORD.
- **Supabase Realtime e serviços associados:** não devem processar conteúdo, metadados ou eventos da organização.

A restrição não impede o uso do framework Next.js ou de bibliotecas de software que não acessem dados da FORD. A stack de frontend permanece conforme ADR-002, mas deverá ser executada em ambiente sob controle da FORD.

A arquitetura operacional substituta ainda não está selecionada nesta ADR. A proposta é manter os componentes de aplicação, identidade, persistência, arquivos, antimalware, auditoria, monitoramento, backups e operação dentro da infraestrutura controlada pela FORD, conforme avaliação e decisão a registrar na ADR-001 e nas ADRs específicas. A reconciliação técnica permanece identificada pela Q-025.

## Justificativa

A decisão atual da FORD é requisito de produto e infraestrutura, não preferência técnica. Manter provedores externos que possam acessar, armazenar ou processar dados contrariaria diretamente essa restrição. O histórico da Issue #88 não se sobrepõe ao questionário atualizado.

## Consequências

**Positivas:**
- Alinha a direção de arquitetura ao requisito vigente da FORD.
- Evita presumir autorização de uso de SaaS externo para dados corporativos.
- Preserva Next.js como framework sem obrigar permanência do backend anterior.
- Torna explícita a necessidade de selecionar e homologar infraestrutura compatível.

**Negativas e impactos:**
- A integração Supabase anteriormente prevista não pode ser tratada como caminho de implementação.
- As migrations, o middleware, as variáveis de ambiente e as ADRs que dependem de Supabase precisam ser reavaliados.
- A hospedagem e operação deixam de ser presumidas como responsabilidade da Vercel; será necessário validar capacidade e responsabilidades operacionais na infraestrutura FORD.
- A tecnologia substituta e seu plano de migração ainda não foram definidos.

## Evidências e limites atuais

- `README.md` anteriormente descrevia Vercel como destino de deploy e Supabase como backend planejado; foi atualizado para refletir a restrição FORD v2.
- `.env.example` contém placeholders históricos de Supabase, não credenciais reais nem prova de integração.
- `supabase/migrations/202611160001_profiles_roles_and_account_status.sql` é uma migration versionada vinculada ao modelo anterior; sua existência não comprova aplicação hospedada ou autorização de uso futuro.
- `src/auth/authorization.mjs` depende de cliente Supabase fornecido externamente e não configura, por si só, uma solução de identidade definitiva.
- A baseline v0.4 estabelece a infraestrutura sob controle FORD como requisito confirmado.

## Orientação de transição

1. Não criar novas integrações ou ambientes produtivos Supabase/Vercel para o Polychat.
2. Não inserir credenciais desses serviços nem dados reais da FORD em tais plataformas.
3. Preservar os artefatos versionados como histórico até que uma revisão técnica determine sua adaptação, substituição ou remoção.
4. Revisar as ADRs de autenticação, dados, autorização, realtime, storage e ambientes para remover dependências incompatíveis.
5. Registrar a arquitetura operacional substituta após a validação de TI e Tech Lead, mantendo a rastreabilidade com Q-025.

## Histórico da decisão

- **17/11/2026:** direção Supabase + Vercel registrada como Accepted com base na Issue #88, sem equivaler a homologação de produção.
- **19/11/2026:** direção depreciada após a FORD v2 estabelecer que nenhum terceiro pode acessar, armazenar ou processar dados da organização.
