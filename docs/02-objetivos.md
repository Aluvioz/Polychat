# 02 - Objetivos do produto

Os objetivos abaixo consolidam as necessidades registradas no questionário atualizado da FORD e nos alinhamentos complementares do PO com Desenvolvimento. A situação indica o estado da decisão de produto; não deve ser confundida com comprovação de implementação.

| ID | Objetivo | Resultado esperado | Situação |
|---|---|---|---|
| OBJ-001 | Disponibilizar um canal próprio de comunicação corporativa para uso interno da FORD. | Os 25 usuários finais do setor técnico utilizam o Polychat em arquitetura com Supabase e Vercel como plataformas oficiais, com dados, acessos e operação governados pela FORD. | Alinhamento complementar do PO com Desenvolvimento; stack oficial confirmada. |
| OBJ-002 | Permitir comunicação individual entre usuários ativos. | Um usuário ativo consegue iniciar conversas, enviar mensagens de texto, consultar histórico paginado e acompanhar estados básicos de leitura. | Confirmado pela FORD. |
| OBJ-003 | Permitir comunicação em grupos administrados pelo TI. | O TI cria, encerra, desativa e reativa grupos, administra participantes e revoga imediatamente o acesso de integrantes removidos às mensagens e anexos anteriores. | Confirmado pela FORD. |
| OBJ-004 | Centralizar a administração do aplicativo no perfil TI. | TI administra contas, credenciais, grupos, participantes, configurações, consultas e exportações de conversas, anexos de investigação, alertas e registros de auditoria. Todos os administradores TI possuem os mesmos poderes. | Confirmado pela FORD; poderes administrativos considerados avaliados pelo projeto. |
| OBJ-005 | Monitorar mensagens e anexos para apoiar a segurança da comunicação. | Mensagens suspeitas são identificadas por regras definidas pelo TI e geram alertas classificados por severidade; anexos são analisados antes da disponibilização, respeitando as exceções administrativas definidas pela FORD. | Confirmado pela FORD; regras e operação dos alertas alinhadas com Desenvolvimento. |
| OBJ-006 | Restringir o ambiente de acesso conforme o perfil. | Usuários acessam somente por celular Android/iOS; TI acessa somente por computador, nos navegadores homologados. | Confirmado pela FORD; critérios de homologação alinhados. |
| OBJ-007 | Entregar experiência simples e alinhada à identidade visual FORD. | O Usuário visualiza conversas recentes após autenticação; o console TI oferece áreas administrativas; interface em português, azul e branco, com logo da FORD. | Direção visual e funcional confirmada; códigos exatos de cores dependem dos ativos de marca fornecidos. |

## Relações com requisitos

- OBJ-001 depende de RF-001 a RF-006, RF-009 a RF-018, RNF-001, RNF-002 e RNF-013.
- OBJ-002 depende de RF-007 a RF-010, RF-019, RNF-005 e RNF-007.
- OBJ-003 depende de RF-005, RF-006 e RF-010, além de controles de autorização e revogação de acesso.
- OBJ-004 depende de RF-002 a RF-006, RF-016, RF-020, RF-021 e RF-022.
- OBJ-005 depende de RF-011 a RF-015 e RF-022, além de RNF-002, RNF-004 e RNF-010.
- OBJ-006 depende de RF-017, RF-018 e RNF-005.
- OBJ-007 depende de RF-007, RF-015, RF-019, RF-023 e RNF-006.

## Premissas de escopo associadas

- O público inicial é de 25 usuários finais do setor técnico, além de aproximadamente 2 a 3 administradores TI.
- Não há expansão prevista no escopo atual; a extensão para outros setores será avaliada após a fase inicial.
- O lançamento será único, após homologação; não haverá grupo piloto.
- Os objetivos não representam declaração de que as funcionalidades já estejam implementadas ou homologadas.
- Metas de desempenho, proteção de credenciais, gestão de chaves, retenção detalhada, homologação e isolamento dos ambientes são consideradas definidas nos alinhamentos complementares com Desenvolvimento.
