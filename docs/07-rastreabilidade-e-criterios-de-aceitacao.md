# 07 - Rastreabilidade e critérios de aceitação

Este documento relaciona objetivos, requisitos funcionais, requisitos não funcionais e critérios de aceitação da baseline POLY-REQ-001 v0.3, revisada com base na FORD v2 e nos alinhamentos do PO com Desenvolvimento.

A rastreabilidade demonstra a origem e a cobertura documental dos requisitos. Não comprova, por si só, implementação, execução de testes ou homologação.

## 7.1 Matriz objetivo — requisitos — verificação

| Objetivo | Requisitos funcionais | Requisitos não funcionais | Critérios de aceitação | Diagramas UML |
|---|---|---|---|---|
| OBJ-001 — Canal corporativo próprio sob controle da FORD | RF-001 a RF-006; RF-009 a RF-018; RF-020 a RF-023 | RNF-001 a RNF-005; RNF-007 a RNF-013 | CA-001.x a CA-006.x; CA-009.x a CA-018.x; CA-020.x a CA-023.x | Pendente de seleção |
| OBJ-002 — Comunicação individual entre usuários | RF-007; RF-008; RF-009; RF-019 | RNF-001; RNF-006; RNF-007; RNF-009 | CA-007.x a CA-009.x; CA-019.x | Pendente de seleção |
| OBJ-003 — Comunicação em grupos administrados pelo TI | RF-005; RF-006; RF-010; RF-019 | RNF-001; RNF-004; RNF-006; RNF-009 | CA-005.x; CA-006.x; CA-010.x; CA-019.x | Pendente de seleção |
| OBJ-004 — Administração centralizada no TI | RF-002 a RF-006; RF-016; RF-020; RF-021; RF-022 | RNF-001; RNF-002; RNF-003; RNF-004; RNF-011 | CA-002.x a CA-006.x; CA-016.x; CA-020.x; CA-021.x; CA-022.x | Pendente de seleção |
| OBJ-005 — Monitoramento, alertas e investigação | RF-011 a RF-016; RF-020 a RF-023 | RNF-002; RNF-004; RNF-009; RNF-010; RNF-011; RNF-013 | CA-011.x a CA-016.x; CA-020.x a CA-023.x | Pendente de seleção |
| OBJ-006 — Restrição de acesso por perfil e dispositivo | RF-017; RF-018; RF-002 | RNF-001; RNF-005 | CA-002.x; CA-017.x; CA-018.x | Pendente de seleção |
| OBJ-007 — Experiência simples e identidade visual FORD | RF-007; RF-008; RF-015; RF-019; RF-023 | RNF-005; RNF-006 | CA-007.x; CA-008.x; CA-015.x; CA-019.x; CA-023.x | Pendente de seleção |

## 7.2 Matriz de cobertura dos requisitos funcionais

Os critérios individuais estão especificados em [03 — Requisitos funcionais](03-requisitos-funcionais.md). A tabela indica o conjunto mínimo de critérios que deve ser vinculado a casos de teste e evidências.

| Requisito | Critérios de aceitação | Verificação principal |
|---|---|---|
| RF-001 — Autenticação | CA-001.1 a CA-001.7 | Login válido/inválido, unicidade e alteração do identificador pelo TI; política de senha acordada |
| RF-002 — Perfis e permissões | CA-002.1 a CA-002.6 | Testes positivos/negativos de Usuário e TI, inclusive igualdade de poderes TI |
| RF-003 — Provisionamento | CA-003.1 a CA-003.6 | Criação de contas Usuário/TI e bloqueio de auto cadastro |
| RF-004 — Ciclo de vida de contas | CA-004.1 a CA-004.6 | Desativação, reativação, revogação de sessões e preservação do histórico |
| RF-005 — Ciclo de vida de grupos | CA-005.1 a CA-005.5 | Criar, encerrar, desativar e reativar grupo |
| RF-006 — Participantes | CA-006.1 a CA-006.6 | Inclusão/remoção, bloqueio de saída voluntária e revogação imediata de acesso/links |
| RF-007 — Conversas recentes | CA-007.1 a CA-007.4 | Ordenação de conversas e quantidade de mensagens não lidas |
| RF-008 — Leitura e histórico | CA-008.1 a CA-008.5 | Acesso por participante, negação a não participante, paginação e retenção |
| RF-009 — Mensagem individual e reconexão | CA-009.1 a CA-009.6 | Envio, persistência, estado de confirmação e sincronização após desconexão |
| RF-010 — Mensagem em grupo | CA-010.1 a CA-010.5 | Envio por membro, negação a não membro e revogação após remoção |
| RF-011 — Anexos | CA-011.1 a CA-011.12 | PDF/JPEG, tamanho, quantidade, quotas, antimalware, download e liberação TI |
| RF-012 — Validação de anexos | CA-012.1 a CA-012.6 | Formato real, PDF protegido, limite e bloqueio por falha de scanner |
| RF-013 — JPEG e metadados | CA-013.1 a CA-013.4 | Seleção da galeria, ausência de captura e remoção de metadados |
| RF-014 — Detecção | CA-014.1 a CA-014.6 | Lista de termos, regras, ausência de análise contextual/IA de terceiros |
| RF-015 — Alertas | CA-015.1 a CA-015.9 | Fila TI, severidades, prazos e encerramento sem justificativa |
| RF-016 — Consulta administrativa | CA-016.1 a CA-016.5 | Consulta por TI sem justificativa/segunda autorização e aviso no primeiro acesso |
| RF-017 — Usuário em celular | CA-017.1 a CA-017.6 | Android/iOS, Chrome/Safari móvel, bloqueio de computador e tablet |
| RF-018 — TI em computador | CA-018.1 a CA-018.5 | Chrome/Edge/Firefox desktop, bloqueio de celular e tablet |
| RF-019 — Leitura e não lidas | CA-019.1 a CA-019.4 | Registro/horário de leitura e contagem por conversa |
| RF-020 — Edição/exclusão de mensagens | CA-020.1 a CA-020.5 | Negação para Usuário, permissão para TI e trilha de auditoria |
| RF-021 — Exportação | CA-021.1 a CA-021.4 | Exportação por TI, sem justificativa/segunda aprovação, com auditoria |
| RF-022 — Auditoria administrativa | CA-022.1 a CA-022.11 | Eventos, acesso exclusivo TI, gerenciamento e política de retenção |
| RF-023 — Aviso de monitoramento | CA-023.1 a CA-023.3 | Exibição do aviso no primeiro acesso |

## 7.3 Matriz de cobertura dos requisitos não funcionais

| Requisito | Evidência / verificação |
|---|---|
| RNF-001 — Controle de acesso | Testes de autorização por perfil, operação, URL/API e políticas de banco |
| RNF-002 — Proteção de dados | Revisão de arquitetura, criptografia em trânsito/repouso, gestão de chaves e fronteira de processamento FORD |
| RNF-003 — Credenciais e sessões | Testes de armazenamento/transmissão, provisionamento, redefinição, sessão e revogação |
| RNF-004 — Auditoria | Testes do catálogo de eventos, consulta/gerenciamento TI, integridade e retenção |
| RNF-005 — Compatibilidade | Matriz de homologação de sistemas operacionais, navegadores e restrições de dispositivo |
| RNF-006 — Usabilidade | Testes de tarefas, telas, português e identidade visual |
| RNF-007 — Desempenho | Testes com metas e carga constantes do alinhamento técnico aprovado |
| RNF-008 — Capacidade | Teste de até 25 conexões simultâneas de usuários finais, além do TI, e limites de armazenamento alinhados |
| RNF-009 — Continuidade | Testes de disponibilidade, backup, restauração, RPO, RTO, retenção de backups e sincronização após reconexão |
| RNF-010 — Segurança de anexos | Testes de formato, tamanho, quantidade, quotas, antimalware, falhas, liberação TI, links e metadados |
| RNF-011 — Monitoramento e dados | Teste do aviso no primeiro acesso, permissões, registros e fluxo operacional de solicitações; observar legislação aplicável |
| RNF-012 — Acessibilidade | Verificação de obrigações legais/corporativas aplicáveis; não há requisito adicional informado pela FORD |
| RNF-013 — Infraestrutura e ambientes | Evidência de hospedagem sob controle FORD, ausência de terceiro processando dados e isolamento de desenvolvimento/homologação/produção |

## 7.4 Fluxo de validação e aceite

1. PO mantém objetivos, regras de negócio, requisitos e rastreabilidade consistentes com a FORD v2.
2. Desenvolvimento utiliza os parâmetros técnicos já alinhados para implementar os requisitos sem reabrir as oito frentes declaradas completas.
3. QA/SQA deriva e executa casos positivos, negativos, de segurança, compatibilidade, carga, continuidade e integração conforme os critérios aprovados.
4. Evidências de execução são vinculadas aos critérios CA-xxx.n e aos requisitos correspondentes.
5. A homologação funcional é conduzida por Fábio Silva Cerqueira com representantes do TI da FORD.
6. O aceite é formalizado por escrito. O gestor da FORD decide o Go/No-Go.
7. Falhas de segurança, autenticação, permissão ou perda de mensagens impedem o lançamento.
8. Riscos residuais são formalizados pelo TI conforme a governança definida pela FORD; essa formalização não substitui os critérios de bloqueio de lançamento.

## 7.5 Critérios de qualidade da baseline

- Cada requisito possui identificador estável, ator/origem, estado e critérios observáveis.
- Os identificadores OBJ-001..007, RF-001..023, RNF-001..013, RN-001..025 e CA-xxx.n são preservados.
- Os oito grupos de requisitos alinhados com Desenvolvimento são tratados como completos, não como pendências.
- A origem das decisões é o questionário atualizado FORD v2 e os alinhamentos complementares registrados pelo PO em 19/11/2026.
- A rastreabilidade documental não deve ser interpretada como evidência de implementação ou teste executado.
- A seleção e aprovação de diagramas UML permanece fora do escopo desta matriz até haver indicação expressa dos tipos e aprovação dos artefatos.
- Requisitos legais aplicáveis não são dispensados pelas decisões de escopo do cliente.

## 7.6 Referências

- [00 — Controle do documento](00-controle-do-documento.md)
- [01 — Visão geral e escopo](01-visao-geral-e-escopo.md)
- [02 — Objetivos do produto](02-objetivos.md)
- [03 — Requisitos funcionais](03-requisitos-funcionais.md)
- [04 — Requisitos não funcionais](04-requisitos-nao-funcionais.md)
- [05 — Regras de negócio e restrições](05-regras-de-negocio-e-restricoes.md)
- [08 — Glossário e questões em aberto](08-glossario-e-questoes-em-aberto.md)
- [09 — Baseline consolidada do MVP](09-baseline-requisitos-mvp.md)
