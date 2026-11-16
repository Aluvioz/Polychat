# 07 - Rastreabilidade e critérios de aceitação

## 7.1 Matriz objetivo - requisitos - verificação

| Objetivo | Requisitos funcionais | Requisitos não funcionais | Critérios de aceitação | Diagramas UML |
|---|---|---|---|---|
| OBJ-001 | RF-001; RF-003; RF-004 | RNF-001; RNF-002; RNF-003; RNF-014; RNF-020 | CA-001.x; CA-003.x; CA-004.x | Pendente de seleção |
| OBJ-002 | RF-007; RF-008; RF-009 | RNF-001; RNF-006; RNF-007 | CA-007.x a CA-009.x | Pendente de seleção |
| OBJ-003 | RF-005; RF-006; RF-010 | RNF-001; RNF-006 | CA-005.x; CA-006.x; CA-010.x | Pendente de seleção |
| OBJ-004 | RF-002; RF-003; RF-004; RF-005; RF-006; RF-016; RF-019; RF-020 | RNF-001; RNF-004; RNF-011; RNF-018 | CA-002.x a CA-006.x; CA-016.x; CA-019.x; CA-020.x | Pendente de seleção |
| OBJ-005 | RF-014; RF-015; RF-016; RF-020 | RNF-002; RNF-004; RNF-011; RNF-014 a RNF-020; RNF-022; RNF-023 | CA-014.x; CA-015.x; CA-016.x; CA-020.x | Pendente de seleção |
| OBJ-006 | RF-017; RF-018 | RNF-001; RNF-005; RNF-021 | CA-017.x; CA-018.x | Pendente de seleção |
| OBJ-007 | RF-007; RF-008 | RNF-006 | CA-007.x; CA-008.x | Pendente de seleção |


## 7.2 Catálogo de critérios de aceitação

Os critérios individuais estão registrados ao final de cada requisito no documento [03 - Requisitos funcionais](03-requisitos-funcionais.md). Os identificadores `CA-xxx.n` devem ser usados em casos de teste e evidências de aceite. Nesta versão os critérios foram numerados dentro de cada RF (por exemplo, `CA-001.1`).

## 7.3 Matriz de verificação adicional

| Requisito | Evidência mínima esperada |
|---|---|
| RF-016 / RNF-018 | Teste de consulta por TI e log íntegro com operador, alvo, horário e justificativa; teste negativo para Usuário. |
| RF-017 / RF-018 / RNF-021 | Testes de bloqueio nos perfis/dispositivos homologados; tentativa de contorno registrada; mensagem literal validada para Usuário em computador. |
| RF-019 / RNF-019 | Teste de inclusão e remoção de membro e bloqueio subsequente de leitura/escrita; teste de acesso indevido ao anexo. |
| RNF-014 | Política de tratamento de dados e monitoramento revisada por jurídico/privacidade e responsável da FORD. |
| RNF-015 / RNF-016 | ADR aprovada sobre criptografia, acesso TI, análise server-side e gestão de chaves. |
| RNF-022 | Casos de teste de palavrões/conteúdo suspeito, falsos positivos/negativos, revisão humana e alerta ao TI. |
| RNF-023 | Evidência de backup/restauração, retenção e exclusão conforme política aprovada. |

## 7.4 Fluxo de validação recomendado

1. Cliente revisa e aprova os objetivos e as regras de negócio.
2. PO valida prioridade e escopo de cada RF/RNF.
3. Líder técnico avalia viabilidade e converte RNFs pendentes em decisões verificáveis.
4. QA deriva casos de teste positivos, negativos, de segurança, compatibilidade e carga.
5. Stakeholders aprovam os critérios antes de declarar a linha de base pronta para desenvolvimento.
6. Após a seleção dos diagramas, atualizar a coluna de rastreabilidade e verificar cobertura.

## 7.5 Critérios de qualidade da linha de base

- Cada requisito tem identificador único, ator/origem, prioridade preliminar, regras relacionadas e critérios observáveis quando há informação suficiente.
- Requisitos com parâmetros ausentes são explicitamente marcados como incompletos ou pendentes.
- A rastreabilidade liga objetivos, requisitos e critérios; a ligação com diagramas permanece pendente.
- Nenhum requisito deve ser considerado aprovado sem validação do cliente e dos responsáveis de produto/técnicos.


## 7.6 Matriz detalhada e resultado da revisão SQA

A rastreabilidade detalhada requisito → critério → método de validação → resultado da revisão documental foi separada no documento [10 - Matriz de rastreabilidade e checklist SQA](10-matriz-e-checklist-sqa.md). O resultado `PASS` nessa matriz confirma apenas a qualidade documental do requisito para derivação de testes; não comprova conformidade de software implementado. Itens dependentes de decisões do cliente ou evidência técnica permanecem `BLOCKED`.
