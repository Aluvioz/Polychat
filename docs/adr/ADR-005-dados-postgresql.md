# ADR-005 — Banco de dados e modelo de dados

- **Status:** Proposed
- **Data:** 17/11/2026
- **Issue:** #89

## Contexto

A direção tecnológica da Issue #88 é Supabase + Vercel; o componente de dados do Supabase é PostgreSQL. O único esquema de domínio atualmente versionado é `public.profiles`, associado a `auth.users`, com papel e estado da conta. Não foram encontradas migrations para conversas, membros, mensagens, anexos, alertas ou auditoria.

## Problema

Definir persistência com integridade referencial e isolamento de acesso, evitando declarar um modelo de domínio não especificado nem criar tabelas antes de resolver regras de produto pendentes.

## Alternativas consideradas

1. PostgreSQL relacional.
2. Banco documental.
3. Modelo multi-tenant genérico.

## Decisão proposta

Adotar PostgreSQL gerenciado pelo Supabase como banco relacional previsto para o MVP. O escopo atual é uma única organização (FORD); não introduzir multi-tenancy sem mudança explícita de escopo.

O modelo de domínio deverá ser detalhado e revisado antes de criar migrations para, no mínimo, perfis/contas, conversas, participantes, mensagens, anexos, alertas e eventos de auditoria. Chaves internas devem ser estáveis; o identificador de login não deve ser confundido com a chave primária. Relações de participação e autoria precisam ser verificadas no servidor e protegidas por RLS.

O esquema `profiles` existente é evidência de implementação parcial, não aprovação do modelo completo. Regras de edição/exclusão de mensagens, saída/remoção de grupos, retenção e identificação de login continuam pendentes.

## Justificativa

O domínio de conversas, membros e mensagens é relacional e se beneficia de constraints e transações. PostgreSQL está alinhado ao backend Supabase previsto.

## Consequências

**Positivas:** integridade referencial, consultas relacionais, transações e suporte a RLS.

**Negativas:** exige migrations revisadas, índices, política de retenção, observabilidade e cuidado com deleções em cascata.

## Riscos

Modelo incompleto; RLS permissiva; perda de histórico; excesso de dados pessoais; migrations destrutivas; consultas administrativas não auditadas.

## Evidências atuais

A migration `202611160001_profiles_roles_and_account_status.sql` cria `profiles`, limita os papéis a `user` e `ti`, define `is_active`, habilita RLS e restringe escrita direta de clientes. Não há tabelas de domínio de chat.

## Pendências para Accepted

Revisar diagrama/modelo de dados, normalização, relações, índices, retenção, exclusão, cardinalidade/carga (Q-003, Q-005, Q-010, Q-016 e Q-024) com Tech Lead, Dev backend, TI e PO.
