# ADR-003 — Backend e infraestrutura

- **Número:** ADR-003
- **Status:** Proposed
- **Data:** 16/11/2026

## Contexto
O sistema processa credenciais, conversas internas, anexos e auditoria. Backlog/PRs antigos citam Supabase e Vercel, mas não existe evidência de aprovação final. PR #132 descreve uso de Supabase Auth/PostgreSQL/RLS para perfis e JWT, porém a migration ainda precisa de homologação e integração às rotas está pendente. O Preview Vercel associado foi reportado com erro.

## Problema
Escolher backend e infraestrutura com segurança, manutenção, disponibilidade e controle operacional adequados, sem confundir protótipo ou código parcial com arquitetura aprovada.

## Requisitos relacionados
RF-001–RF-020; RNF-001–RNF-023; Q-013–Q-017, Q-025, Q-026, Q-030, Q-032.

## Alternativas consideradas
1. Supabase gerenciado (Auth, PostgreSQL, Storage/Realtime): reduz trabalho operacional; requer revisão rigorosa de RLS, privilégios, região, backups, logs, suboperadores e limites de acesso.
2. Backend próprio (ex.: API Node/TypeScript ou equivalente) com PostgreSQL e storage gerenciado/privado: maior controle de regras; maior responsabilidade de operação, patching, escalabilidade e disponibilidade.
3. Infraestrutura corporativa/on-premises ou cloud privada: maior controle organizacional e integração com políticas internas; maior custo/complexidade operacional e necessidade de equipe habilitada.
4. Vercel para frontend/API: fluxo de deploy conveniente, mas avaliar execução, região, logs, segredos, acesso de suporte, custos e compatibilidade com backend escolhido.

## Decisão proposta
Separar a escolha do backend da escolha de hospedagem. Supabase é candidato plausível para acelerar MVP se RLS, Auth, chaves, região, auditoria e backup forem validados em homologação. API própria pode ser necessária para operações privilegiadas e governança. Vercel não é decisão aprovada; comparar com hospedagem corporativa/cloud que satisfaça controles. Não persistir credenciais em frontend nem expor service-role keys.

## Justificativa
A decisão deve considerar modelo de ameaça e capacidade operacional, não apenas velocidade ou orçamento. Um BaaS pode reduzir operação, mas não terceiriza responsabilidade de segurança ou LGPD.

## Consequências
**Positivas:** opções explicitadas e fornecedores substituíveis por contratos. **Negativas:** possível duplicação entre API e BaaS; mais validação prévia.

## Riscos
RLS incompleta; segredo privilegiado exposto; lock-in; região inadequada; logs/backup insuficientes; falha de deploy (incluindo configuração de Root Directory e detecção de framework).

## Questões pendentes
Fornecedor, região, jurisdição, SLA, suboperadores, plano de suporte, custos recorrentes, plano de saída, RPO/RTO, responsabilidades de incidentes e validação da migration #132.

## Referências
POLY-REQ-001 v0.3; Issues #79, #80, #82, #84, #86; PR #132; Q-014, Q-017, Q-030; ADR-001, ADR-009.
