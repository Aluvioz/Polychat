# Polychat — Baseline de requisitos (POLY-REQ-001)

**Status:** baseline POLY-REQ-001 v0.5, atualizada em 20/11/2026 com decisões de produto para arquitetura da informação (Q-018) e identidade visual provisória Ford (Q-019). A confirmação de requisitos não equivale a comprovação de implementação, teste ou homologação. Supabase + Vercel permanece como stack adotada na ADR-003; a Q-025 documenta sua compatibilidade operacional com os requisitos de infraestrutura da FORD, sem substituição por inferência.

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
14. [Decisões de produto Q-018 e Q-019 — arquitetura da informação e identidade visual provisória](ux/decisoes-produto-q018-q019.md)
15. [Modelo de ameaças e mitigação — Issue #125](security/issue-125-modelo-de-ameacas.md)

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

A ADR-003 mantém Supabase + Vercel como stack tecnológica adotada e obrigatória do Polychat. A FORD v2 estabelece requisitos de controle da infraestrutura, localização e tratamento de dados; a Q-025 deve documentar a compatibilidade da configuração e do modelo de utilização da stack com esses requisitos, incluindo evidências e responsabilidades. A adoção não equivale à homologação de produção, e a stack não deve ser substituída por inferência. Consulte a [baseline v0.5](09-baseline-requisitos-mvp.md), [índice de ADRs](adr/README.md), [ADR-003](adr/ADR-003-supabase-vercel.md) e a Q-025.

As Issues #96 e #98 permanecem encerradas conforme aceites do responsável/Tech Lead sobre seus escopos operacionais originais. Seus documentos preservam a evidência histórica; esses aceites não substituem a análise de compatibilidade e homologação operacional da configuração Supabase + Vercel na Q-025.
