# ADR-009 — Ambientes, configuração e deploy

- **Status:** Proposed
- **Data:** 17/11/2026
- **Issue:** #89

## Contexto

O README define Vercel como destino de deploy e orienta a branch `main` como produção. O workflow `.github/workflows/ci.yml` executa testes, ESLint, TypeScript e build em push para `main` e pull requests destinadas à `main`. O arquivo `.env.example` contém placeholders públicos para URL e anon key do Supabase, sem credenciais reais. A configuração efetiva de ambientes e projetos Supabase não está documentada nem comprovada no repositório.

A governança de desenvolvimento determina PR, revisão independente e CI; também registra que regras administrativas de proteção da branch precisam ser verificadas no GitHub e não são presumidas apenas pela documentação.

## Problema

Evitar mistura de dados e segredos entre desenvolvimento, homologação e produção e estabelecer promoção segura de mudanças.

## Alternativas consideradas

1. Projetos/ambientes isolados por estágio na Vercel e no Supabase.
2. Um único projeto compartilhado por todos os estágios.
3. Hospedagem corporativa alternativa com pipeline próprio.

## Decisão proposta

Adotar como padrão-alvo ambientes separados de desenvolvimento, homologação e produção, com recursos Supabase e variáveis Vercel isolados por ambiente. Desenvolvimento e homologação devem usar dados sintéticos ou minimizados; dados reais só podem ser usados em produção após aprovações aplicáveis.

Segredos privilegiados devem permanecer em secret manager/variáveis server-side, nunca em commit, bundle de cliente, log ou variável `NEXT_PUBLIC_*`. A anon key pública não substitui RLS e não deve ser confundida com service-role key. Migrations devem ser versionadas e revisadas. Deploy para produção deve ocorrer por fluxo controlado após revisão, checks e aprovação de release. Backup, restauração, RPO e RTO precisam ser definidos e testados.

Esta ADR é uma proposta de governança de ambientes; não afirma que três ambientes estejam configurados hoje, que branch protection esteja ativada ou que rollback/restore tenham sido testados.

## Justificativa

Isolamento reduz risco de vazamento e erro humano. Pipeline e revisão deixam evidência rastreável das alterações.

## Consequências

**Positivas:** menor contaminação de dados; rastreabilidade; promoção controlada; melhor recuperação.

**Negativas:** custo e manutenção de ambientes separados; mais gestão de segredos e migrações.

## Evidências atuais

- `README.md`: instruções de deploy Vercel e configuração Supabase ainda pendente.
- `.env.example`: placeholders, sem valores reais.
- `.github/workflows/ci.yml`: workflow automatizado em `main` e PRs.
- A execução CI mais recente consultada para a `main` concluiu com sucesso; isso valida o pipeline executado, não a configuração de todos os ambientes.
- `docs/10-governanca-desenvolvimento.md`: exige PR e revisão por pessoa diferente do autor e não presume regras de branch protection configuradas.

## Pendências para Accepted

TI deve informar projetos e regiões, variáveis por ambiente, usuários/serviços autorizados, gestão de segredos, processo de backup/restore, RPO/RTO, janela de manutenção, critérios de release e rollback (Q-014 e Q-017). Tech Lead e SQA devem revisar pipeline e critérios.
