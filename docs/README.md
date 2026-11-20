# Polychat — Baseline de requisitos (POLY-REQ-001)

**Status:** baseline POLY-REQ-001 v0.4, atualizada em 19/11/2026 com base no questionário FORD v2 e nos alinhamentos complementares do PO com Desenvolvimento. A confirmação de requisitos não equivale a comprovação de implementação, teste ou homologação. A restrição de infraestrutura sob controle da FORD prevalece sobre ADRs e configurações tecnológicas anteriores incompatíveis.

## Navegação

1. [Controle do documento](00-controle-do-documento.md)
2. [Visão geral e escopo](01-visao-geral-e-escopo.md)
3. [Objetivos](02-objetivos.md)
4. [Requisitos funcionais](03-requisitos-funcionais.md)
5. [Requisitos não funcionais](04-requisitos-nao-funcionais.md)
6. [Regras de negócio e restrições](05-regras-de-negocio-e-restricoes.md)
7. [Diagramas UML](06-diagramas-uml.md)
8. [Rastreabilidade e critérios de aceitação](07-rastreabilidade-e-criterios-de-aceitacao.md)
9. [Glossário e questões em aberto](08-glossario-e-questoes-em-aberto.md)
10. [Baseline consolidada e rastreabilidade da Issue #88](09-baseline-requisitos-mvp.md)
11. [Índice de decisões arquiteturais (ADRs) — Issue #89](adr/README.md)
12. [Matriz de autorização e RLS — Issue #100](issue-100-matriz-autorizacao.md)
13. [Política de anexos e proteção antimalware — Issue #117](storage/politica-anexos-e-antimalware.md)

## Infraestrutura e deploy

- [Auditoria de ambientes Supabase e Vercel — Issue #96](infra/issue-96-auditoria-ambientes.md)
- [Auditoria de Preview, produção e rollback — Issue #98](infra/issue-98-deploy-preview-production-rollback.md)
- [Runbook de smoke test e rollback de aplicação — Issue #98](infra/issue-98-smoke-test-rollback-runbook.md)

## Como interpretar esta versão

- **Confirmado:** informação declarada pelo cliente ou restrição explicitamente registrada em issue aprovada.
- **Derivado:** detalhamento necessário para tornar uma informação verificável; requer validação quando indicado.
- **Recomendação:** controle sugerido pela equipe para discussão, não aprovado pelo cliente.
- **Pendente:** informação ainda não fornecida ou decisão ainda não tomada.

Identificadores `OBJ`, `RF`, `RNF`, `RN` e `CA` são únicos nesta linha de base e devem ser preservados em revisões posteriores. Não reutilize identificadores removidos.

## Aviso sobre diagramas

A documentação não cria nem seleciona diagramas UML nesta versão, pois o tipo de diagrama deve ser escolhido expressamente pela pessoa responsável pelo prompt. A seção 06 registra os arquivos de diagramas já existentes em `docs/`, sem declará-los aprovados ou atualizados.

## Decisões arquiteturais

O índice em `adr/README.md` registra o estado e a rastreabilidade das decisões da Issue #89. A presença de uma ADR não significa, por si só, que a decisão foi aprovada pela FORD ou que a implementação está concluída. Consulte o status e as condições de aprovação de cada ADR.


## Atualização arquitetural — 19/11/2026

A FORD v2 estabelece que hospedagem, armazenamento e processamento de dados devem permanecer sob controle da FORD, preferencialmente no Brasil, sem terceiros acessando, armazenando ou processando dados da organização. A direção anterior Supabase + Vercel foi depreciada na ADR-003. Consulte a [baseline v0.4](09-baseline-requisitos-mvp.md), [índice de ADRs](adr/README.md) e a Q-025.

As Issues #96 e #98 permanecem encerradas conforme aceites do responsável/Tech Lead sobre seus escopos operacionais originais. Seus documentos preservam a evidência histórica e registram que esses aceites não constituem autorização vigente para serviços externos processarem dados da FORD após a FORD v2.


## Dados, autorização e estimativa

- [Modelo lógico de dados — POLY-DATA-001](database/modelo-de-dados.md)
- [Matriz de autorização e RLS — Issue #100](issue-100-matriz-autorizacao.md)
- [Contrato de autenticação e autorização Usuário/TI](authorization-user-ti.md)
- [Política de anexos e antimalware — POLY-STO-001](storage/politica-anexos-e-antimalware.md)
- [Proposta de dimensionamento e precificação por APF](proposta-precificacao-apf.md)

## UX

- [Jornada do Usuário mobile — Issue #91](ux/issue-91-jornada-mobile.md)
- [Console TI desktop — Issue #92](ux/issue-92-console-ti-desktop.md)
