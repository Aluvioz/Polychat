# ADR-003 — Supabase + Vercel como direção tecnológica

- **Status:** Accepted
- **Escopo do aceite:** direção de execução definida pela Issue #88; não equivale a homologação de produção, contrato ou aprovação formal da FORD.
- **Data:** 17/11/2026
- **Issue:** #89 · **Referência:** #88

## Contexto

A baseline POLY-REQ-001 v0.2 registra que a Issue #88 determina **Supabase + Vercel** como arquitetura de referência para sua execução. O README descreve Vercel como destino de hospedagem/deploy e Supabase como backend planejado. O repositório contém variáveis de exemplo do Supabase, uma migration de perfis e um middleware preparado para receber um cliente Supabase server-side.

A integração real com o projeto Supabase ainda é declarada como pendente no README. Não há credenciais reais no repositório e não há comprovação de que a migration foi aplicada em um projeto hospedado.

## Problema

Registrar a direção de tecnologia acordada para o trabalho sem declarar concluídas integrações, ambientes, contratos ou controles operacionais que ainda não foram verificados.

## Alternativas consideradas

1. Supabase como backend gerenciado e Vercel para deploy da aplicação web.
2. Backend e banco operados integralmente pela equipe.
3. Infraestrutura corporativa ou cloud privada, conforme padrões internos da FORD.

## Decisão

Manter **Supabase + Vercel** como direção tecnológica do MVP, em conformidade com a restrição de escopo da Issue #88:

- **Vercel:** hospedagem e deploy da aplicação Next.js.
- **Supabase:** plataforma backend prevista para Auth, PostgreSQL, RLS, Realtime e Storage, cada recurso sujeito às decisões e condições das ADRs correspondentes.

O aceite desta ADR confirma a direção de execução do projeto, não a autorização para produção. Região, jurisdição, suboperadores, contrato, custo, SLA, configuração de segurança, backup, acesso de suporte e responsabilidades operacionais precisam de revisão por TI e responsáveis da FORD antes de uso com dados reais.

## Justificativa

A decisão respeita o escopo registrado na Issue #88 e permite manter a implementação alinhada ao stack existente. A adoção de serviços gerenciados reduz parte da operação de infraestrutura, mas não elimina a necessidade de configuração e governança próprias.

## Consequências

**Positivas:** direção uniforme para desenvolvimento; integração de deploy; redução de infraestrutura própria.

**Negativas:** dependência de fornecedores; custos e limites de planos; risco de lock-in; necessidade de revisar localização, acesso de suporte, logs, backups e segurança.

## Evidências e limites atuais

- `README.md`: descreve Vercel e declara integração Supabase pendente.
- `.env.example`: contém apenas placeholders `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `supabase/migrations/202611160001_profiles_roles_and_account_status.sql`: migration versionada, sem evidência de aplicação hospedada.
- `src/auth/authorization.mjs`: espera cliente Supabase server-side injetado; não cria nem configura esse cliente.
- `package.json`: não inclui SDK Supabase nas dependências atuais.

## Pendências fora do escopo do aceite

TI deve validar região/jurisdição, contratos, suboperadores, políticas internas, custos recorrentes, níveis de serviço, acesso de suporte, backup/restore, portabilidade e plano de saída (Q-013, Q-014, Q-017 e Q-022).
