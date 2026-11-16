# ADR-009 — Ambientes, hospedagem e deploy

- **Número:** ADR-009
- **Status:** Proposed
- **Data:** 16/11/2026

## Contexto
É necessário separar desenvolvimento, homologação e produção. Supabase/Vercel aparecem em propostas e PRs, mas não há evidência de aprovação nem de aplicação validada em ambiente de homologação. Um Preview Vercel recente falhou; não foi identificada configuração Next.js no repositório da baseline documental.

## Problema
Definir ciclo seguro de entrega, gestão de segredos, backups e recuperação sem assumir fornecedor ou confundir Preview com produção.

## Requisitos relacionados
RNF-014–RNF-023; Q-014, Q-017, Q-029, Q-030; ADR-003.

## Alternativas consideradas
1. Vercel + Supabase: fluxo de preview/deploy integrado; exige verificar compatibilidade do projeto, root directory, runtime, regiões, secrets, logs e contratos.
2. Cloud corporativa com CI/CD e serviços gerenciados: maior alinhamento a políticas da empresa, exige desenho/operação.
3. On-premises: controle local, maior responsabilidade por disponibilidade, patching, backup e capacidade.

## Decisão proposta
Manter três ambientes isolados, com projetos/contas/bancos/storage e credenciais separados. Desenvolvimento usa dados sintéticos; homologação usa dados fictícios ou minimizados; produção contém dados reais e acesso restrito. Segredos em vault/secret manager, nunca no repositório, bundle ou logs. Deploy por CI com revisão obrigatória, testes, análise de dependências, migrations versionadas e rollback testado. Produção exige aprovação manual, trilha de quem implantou e artefato imutável. Backups criptografados, cópias isoladas e testes periódicos de restauração. Definir RPO/RTO com cliente. Nenhum provedor (Vercel, Supabase ou outro) é selecionado nesta ADR.

## Justificativa
Separação reduz impacto de vazamento e erro humano; aprovação de produção e restauração testada protegem integridade e continuidade.

## Consequências
**Positivas:** promoção controlada e evidência de release. **Negativas:** custo de ambientes, pipeline e manutenção.

## Riscos
Segredos copiados entre ambientes; dados reais em Preview; migrations destrutivas; backups não restauráveis; deploy supply-chain comprometido; região/transferência internacional inadequada.

## Questões pendentes
Provedor, região, jurisdição, acesso de suporte, SLA, custo operacional, RPO/RTO, frequência de backup, retenção, plano de continuidade e causa exata da falha Vercel Preview.

## Referências
POLY-REQ-001 v0.3; RNF-014–RNF-023; Q-014, Q-017, Q-029, Q-030; ADR-003 e ADR-010.
