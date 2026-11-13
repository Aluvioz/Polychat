# 07 - Rastreabilidade e critérios de aceitação

## 7.1 Como ler a matriz

A matriz relaciona os objetivos de produto aos requisitos funcionais e não funcionais. Os critérios de aceitação detalhados estão no próprio requisito funcional; os identificadores de critério (CA) devem ser mantidos estáveis nos testes e revisões.

## 7.2 Matriz de rastreabilidade

| Objetivo | Requisitos relacionados | Regras relacionadas | Evidência / critérios de aceite |
|---|---|---|---|
| OBJ-001 | RF-001, RF-002, RF-008, RF-009, RF-010 | RN-001, RN-002, RN-005 | CA dos requisitos de autenticação, mensagens e grupos; teste de ausência de integração externa nesta versão. |
| OBJ-002 | RF-003, RF-004, RF-005 | RN-001, RN-003 | CA de criação, desativação e bloqueio de acesso de conta inativa. |
| OBJ-003 | RF-006, RF-007 | RN-002, RN-003 | CA de criação de grupo e inclusão restrita ao TI. |
| OBJ-004 | RF-008, RF-009 | RN-004 | CA de início de conversa e envio de texto para qualquer usuário ativo. |
| OBJ-005 | RF-010 | RN-002, RN-004 | CA de acesso e envio em grupo, após confirmação do fluxo pelo cliente. |
| OBJ-006 | RF-011, RF-012, RF-013, RF-014, RF-015, RF-016, RF-017, RF-018 | RN-005 a RN-012 | Testes de anexos, restrição de dispositivos, auditoria e controles aprovados; metas técnicas aguardam definição. |
| OBJ-007 | RF-014, RF-015 | RN-009, RN-010 | CA de detecção e geração de alerta conforme conjunto de regras aprovado. |

## 7.3 Rastreabilidade dos requisitos não funcionais

| RNF | Requisitos / objetivos relacionados | Forma de verificação prevista |
|---|---|---|
| RNF-001 | RF-001 a RF-018; OBJ-006 | Revisão de arquitetura, análise de ameaças, testes de segurança; critérios e escopo pendentes. |
| RNF-002 | RF-001, RF-002, RF-003, RF-004; OBJ-002, OBJ-006 | Testes de autenticação, sessão, tentativa inválida e conta desativada; limites pendentes. |
| RNF-003 | RF-003 a RF-007; OBJ-002, OBJ-003 | Testes de autorização por perfil e tentativa de acesso direto a endpoint administrativo. |
| RNF-004 | RF-008 a RF-010; OBJ-004, OBJ-005 | Testes funcionais de envio, recebimento e histórico. |
| RNF-005 | RF-017, RF-018; OBJ-006 | Testes por matriz homologada de dispositivos e navegadores, ainda a definir. |
| RNF-006 | RF-011 a RF-013; OBJ-006 | Testes de tipo real, conteúdo, tamanho e arquivo malicioso após definição dos limites. |
| RNF-007 | RF-014, RF-015; OBJ-007 | Testes de precisão/recall ou matriz de casos positivos/negativos, após definição dos critérios de suspeição. |
| RNF-008 | RF-016; OBJ-006 | Testes de auditoria e revisão dos controles de acesso ao log. |
| RNF-009 | RF-001 a RF-018; OBJ-006 | Testes de recuperação e restauração após definição de RPO/RTO e política de backup. |
| RNF-010 | RF-008, RF-009, RF-010; OBJ-004, OBJ-005 | Teste de carga e medição de latência após definição da carga concorrente e metas. |
| RNF-011 | RF-001 a RF-018; OBJ-006 | Testes de disponibilidade e recuperação após definição de metas de serviço. |
| RNF-012 | RF-001 a RF-018; OBJ-006 | Revisão de dados coletados, consentimento/base legal/política e controles de privacidade por áreas competentes. |
| RNF-013 | Interface de Usuário e TI; OBJ-001 | Inspeção visual e testes de usabilidade; métricas e identidade visual final pendentes. |

## 7.4 Relação com diagramas UML

Nenhum diagrama UML foi escolhido para esta versão. Assim, não há associações de requisitos a diagramas aprovados. Quando os tipos forem indicados, esta matriz deverá ser atualizada com os identificadores de cada diagrama e os requisitos efetivamente representados.

## 7.5 Critério de conclusão da rastreabilidade

Antes de aprovar uma versão futura, cada requisito priorizado deverá possuir origem, objetivo relacionado, regra de negócio aplicável (quando houver), critério de aceitação verificável e caso de teste associado. Lacunas devem continuar explicitamente marcadas como pendentes.
