# 00 - Identificação e controle do documento

## Identificação

| Campo | Valor |
|---|---|
| Projeto | Polychat |
| Cliente / organização | FORD |
| Identificador | POLY-REQ-001 |
| Título | Documento de Especificação de Requisitos do Polychat |
| Versão | 0.5 (minuta revisada por SQA com conferência do documento de visão v0.1) |
| Data | 16/11/2026 |
| Status | Minuta consolidada com decisões do levantamento de 16/11/2026; aprovação formal do cliente/PO e validações pendentes |
| Contexto acadêmico | Equipe de graduação da UNIFACS; projeto da UC Projeto e Engenharia de Software (conforme README do repositório) |
| Responsável de produto (PO) | A definir pela equipe |
| Responsável técnico | A definir pela equipe |
| Representante aprovador do cliente | A identificar pela FORD |
| Fonte das necessidades | Informações de levantamento registradas nos capítulos de requisitos; distinção entre confirmado, derivado, recomendação e pendente |
| Repositório de destino | [Aluvioz/Polychat](https://github.com/Aluvioz/Polychat), branch main |

## Histórico de alterações

| Versão | Data | Autor | Descrição |
|---|---|---|---|
| 0.1 | 13/11/2026 | Equipe de requisitos (responsáveis nominais a definir) | Primeira consolidação das informações disponíveis; lacunas, riscos e diagramas pendentes registrados. |
| 0.2 | 13/11/2026 | Preparação documental para revisão da issue #88 | Adicionada baseline proposta do MVP, rastreabilidade com épicos/issues, conflitos de escopo, critérios de aprovação e controle de mudanças. Não representa aprovação do cliente. |
| 0.3 | 16/11/2026 | Atualização da issue #88 com decisões adicionais do cliente | Consolidada a FORD como única organização, os dois perfis, o público inicial de 25 pessoas do setor técnico, regras de dispositivos, mensagens/anexos, administração, monitoramento, LGPD, riscos criptográficos, critérios de aceitação e novas questões técnicas. Continua sem aprovação formal. |
| 0.4 | 16/11/2026 | Revisão documental SQA da Issue #88 | Harmonizados estados e escopos dos RNFs, critérios de grupos e perfis, rastreabilidade por requisito, critérios CV-RNF, checklist SQA e registro explícito dos bloqueios. Nenhuma decisão técnica ou aprovação de stakeholder foi presumida. |
| 0.5 | 16/11/2026 | Conferência SQA com o Documento de Visão e Plano Inicial v0.1 | Acrescentados requisitos verificáveis de integridade, confidencialidade, desempenho adequado e identidade visual; incorporados equipe e etapas iniciais como contexto de planejamento; atualizada matriz e checklist SQA. Decisões e métricas ausentes permanecem pendentes. |

## Validação e aprovação

| Papel | Nome | Decisão | Data | Observações |
|---|---|---|---|---|
| Representante do cliente FORD | A definir | Pendente | - | Validar escopo, regras, monitoramento e riscos. |
| Product Owner | A definir | Pendente | - | Validar prioridades e critérios de aceitação. |
| Líder técnico | A definir | Pendente | - | Validar viabilidade e alinhamento com ADRs. |
| QA / responsável por testes | A definir | Pendente | - | Validar testabilidade e plano de verificação. |

## Convenções e estado da informação

- **Confirmado:** foi informado expressamente no levantamento.
- **Derivado:** detalhamento operacional proposto para tornar uma necessidade verificável; deve ser confirmado.
- **Proposta para MVP:** organização recomendada do primeiro incremento, ainda sujeita à aprovação.
- **Recomendação:** sugestão de controle ou prática, sem aprovação registrada.
- **Pendente:** dado ou decisão ausente.

As prioridades indicadas nos requisitos são propostas preliminares, não compromissos de cronograma. A versão 0.5 revisa consistência, rastreabilidade e testabilidade documental da baseline v0.3. Continua sendo minuta: não declara aprovação do cliente, PO, jurídico/privacidade, liderança técnica ou QA. O resultado e os bloqueios estão registrados em [10 - Matriz e checklist SQA](10-matriz-e-checklist-sqa.md).

## Documentos relacionados

- [Índice da documentação](README.md)
- [Visão geral e escopo](01-visao-geral-e-escopo.md)
- [Objetivos](02-objetivos.md)
- [Requisitos funcionais](03-requisitos-funcionais.md)
- [Requisitos não funcionais](04-requisitos-nao-funcionais.md)
- [Regras de negócio e restrições](05-regras-de-negocio-e-restricoes.md)
- [Diagramas UML](06-diagramas-uml.md)
- [Rastreabilidade e critérios de aceitação](07-rastreabilidade-e-criterios-de-aceitacao.md)
- [Glossário e questões em aberto](08-glossario-e-questoes-em-aberto.md)
- [Baseline do MVP e rastreabilidade com o backlog](09-baseline-mvp-e-rastreabilidade-backlog.md)
- [Matriz de rastreabilidade e checklist SQA](10-matriz-e-checklist-sqa.md)
