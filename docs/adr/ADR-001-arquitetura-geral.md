# ADR-001 — Arquitetura geral

- **Número:** ADR-001
- **Status:** Proposed
- **Data:** 16/11/2026

## Contexto
Polychat é aplicação WEB interna exclusiva da FORD. MVP com 25 funcionários do setor técnico, perfis TI/Usuário, mensagens individuais e grupos geridos por TI, PDF/JPEG, alertas de conteúdo suspeito e consulta de conversas por TI. POLY-REQ-001 v0.3 é a baseline funcional de referência, mas mantém decisões técnicas e de governança em aberto.

## Problema
Separar responsabilidades e fronteiras de confiança sem acoplar o produto a fornecedor ainda não aprovado; garantir que autenticação, autorização, dados, arquivos, auditoria e análise não dependam de controles visuais do frontend.

## Requisitos relacionados
OBJ-001/002; RF-001–RF-020; RNF-001–RNF-023; RN-021–RN-026; Q-009, Q-013–Q-017, Q-025–Q-032.

## Alternativas consideradas
1. Aplicação modular: frontend web, API/backend, banco relacional, storage privado, serviço de análise assíncrona e trilha de auditoria.
2. Backend-as-a-Service com frontend hospedado (ex.: Supabase + Vercel): acelera entrega, mas transfere parte da confiança a políticas, serviços gerenciados e configuração do provedor.
3. Aplicação monolítica com banco e arquivos locais: operação inicialmente simples, mas escala, disponibilidade, backup e isolamento operacional ficam sob responsabilidade integral da equipe.

## Decisão proposta
Adotar arquitetura lógica modular, com contratos explícitos: (a) interface responsiva; (b) camada de autenticação; (c) API com autorização server-side; (d) domínio de conversas/grupos; (e) persistência relacional; (f) storage privado de anexos; (g) worker de análise; (h) auditoria/observabilidade. O provedor e o framework permanecem em aberto e são decididos nas ADRs 002, 003 e 009. Todas as operações sensíveis falham de forma fechada (fail-closed).

## Justificativa
A separação reduz acoplamento e permite testar controles críticos isoladamente. BaaS pode implementar partes desses componentes, mas não elimina a obrigação de revisar políticas, privilégios, logs, localização de dados e recuperação.

## Consequências
**Positivas:** limites verificáveis, evolução independente, rastreabilidade e menor dependência de UI para segurança. **Negativas:** mais interfaces e configuração; maior custo inicial de integração e testes.

## Riscos
Configuração incorreta entre serviços; excesso de privilégio; dependência de fornecedor; observabilidade insuficiente; complexidade superior à necessária para 25 usuários.

## Questões pendentes
Aprovar modelo de hospedagem, região/jurisdição, disponibilidade, RPO/RTO, volumes/concor­rência, responsabilidades operacionais e limites de acesso de fornecedores.

## Referências
POLY-REQ-001 v0.3; Issues #79, #80, #82, #84, #86; ADR-002 a ADR-010; Q-013–Q-017 e Q-030.
