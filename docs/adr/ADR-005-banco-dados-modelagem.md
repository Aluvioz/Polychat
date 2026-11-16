# ADR-005 — Banco de dados e modelagem

- **Número:** ADR-005
- **Status:** Proposed
- **Data:** 16/11/2026

## Contexto
O MVP é exclusivo da FORD e não requer multi-tenancy. Deve suportar contas, dois perfis, conversas individuais/grupos, participantes, mensagens, anexos, alertas e auditoria. Consultas administrativas e retenção precisam de trilha própria.

## Problema
Definir modelo consistente, auditável e com integridade referencial sem introduzir isolamento multi-tenant desnecessário.

## Requisitos relacionados
RF-005–RF-020; RNF-009–RNF-023; RN-021, RN-022, RN-026; Q-009, Q-010, Q-025–Q-029.

## Alternativas consideradas
1. PostgreSQL relacional: integridade, transações, consultas e RLS; adequado a relações de mensagens/participantes.
2. Banco documental: flexibilidade de esquema, mas exige cuidado extra com consistência entre conversas, membros, mensagens e auditoria.
3. Multi-tenant com tenant_id e políticas de isolamento: não agrega valor ao escopo exclusivo FORD e amplia complexidade.

## Decisão proposta
Usar modelo relacional (PostgreSQL como candidato) e uma única organização lógica FORD, sem abstração multi-tenant no MVP. Entidades mínimas: users/profiles; roles (enum ou catálogo restrito TI/USER); conversations (DIRECT/GROUP); conversation_members; messages; attachments; alerts; admin_audit_events; security_events. Chaves internas imutáveis; login separado do ID. Mensagens e eventos devem ter timestamps server-side e identificadores estáveis. Integridade e autorização devem impedir membros não autorizados de ler/escrever. Alterações de role/status somente por backend administrativo confiável.

## Justificativa
O domínio é altamente relacional e exige consistência de participação, autoria, ordenação e auditoria. PostgreSQL é compatível com proposta Supabase existente sem tornar o fornecedor obrigatório.

## Consequências
**Positivas:** transações e constraints; consultas auditáveis; RLS possível. **Negativas:** exige desenho de índices, particionamento/arquivamento futuro e política clara de exclusão.

## Riscos
Políticas RLS permissivas; consultas privilegiadas sem trilha; deleção em cascata destruindo evidência; migrações sem revisão; logs contendo conteúdo excessivo.

## Questões pendentes
Identificador de login; mensagens editáveis/excluíveis; retenção; regras de grupos; tamanho/volume; quem pode administrar contas TI; campos pessoais mínimos e base legal.

## Referências
POLY-REQ-001 v0.3; RF-005–RF-020; Q-002, Q-003, Q-005, Q-009, Q-010, Q-024–Q-029; ADR-006, ADR-007 e ADR-010.
