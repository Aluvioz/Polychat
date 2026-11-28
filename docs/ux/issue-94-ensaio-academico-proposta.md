# Issue #94 — proposta de ensaio interno por papéis (FORD hipotética)

Atualizado em 26/11/2026. **ACEITO PELO PO COMO EVIDÊNCIA INTERNA LIMITADA; REAVALIAÇÃO SQA PENDENTE; NÃO EXECUTADO.**
Referências: plano v0.3 na main (#152), protótipo #164 no commit 843d574583b50bdd6b1a32f56e54d7714ec1d0f0, kit de registros e proposta metodológica nesta branch.

## Objetivo e distinção obrigatória

A FORD é tratada exclusivamente como contexto fictício neste ensaio interno. A proposta é realizar uma simulação limitada das jornadas com voluntários em papéis fictícios, para verificar a clareza do roteiro, a neutralidade das instruções e a preparação do facilitador. Os voluntários não serão apresentados como funcionários ou representantes FORD nem como a amostra de usuários efetivos definida no plano v0.3. O ensaio não é pesquisa institucional, aceite de cliente, teste de integração ou homologação.

O PO aceitou formalmente o ensaio interno por papéis em review de 26/11/2026, exclusivamente como evidência complementar limitada. O SQA ainda deve reavaliar independentemente a proposta e seus controles; este registro não presume sua aprovação. A simulação não substitui nem altera a amostra ou os procedimentos do plano v0.3. Não envolver funcionários FORD, não usar dados corporativos ou credenciais reais e não gravar sem autorização e consentimento específicos.

## Organização proposta (a confirmar pelo grupo)

| Ensaio | Papel fictício | Instrumento | Duração proposta | Estado |
|---|---|---|---|---|
| EA-U-01 | Técnico de manutenção que usa celular para comunicação cotidiana, sem privilégios TI | Wireframes #91, plano v0.3 | 45–60 min | NÃO AGENDADO / NÃO EXECUTADO |
| EA-TI-01 | Administrador de TI que gere contas, grupos, consultas e alertas | Wireframes #92, plano v0.3 | 45–60 min | NÃO AGENDADO / NÃO EXECUTADO |

Papéis não são identidades. Esses dois ensaios iniciais não substituem a amostra do plano (5–8 P-U, 2–3 P-TI) nem constituem resultados representativos. Qualquer alteração de amostra ou procedimento exige decisão explícita dos responsáveis e registro de suas limitações.

Funções propostas: Matheus prepara instrumentos e facilita; outro colega observa e registra; um colega voluntário por ensaio interpreta o papel; PO/SQA avaliam o protocolo e as evidências. Designações, datas e consentimento: pendentes, sem atribuir compromisso a ninguém.

## Checklist antes de executar

- [x] PO: aceite limitado do ensaio interno por papéis registrado em review de 26/11/2026.
- [ ] SQA: reavaliar independentemente o ensaio e os controles antes de tratá-lo como evidência aceita na validação.
- [ ] Confirmar instrumento e sequência conforme decisão metodológica: wireframes estáticos primeiro; protótipo clicável somente como complemento opcional, sujeito à manifestação do SQA.
- [ ] Selecionar voluntários e observador; comunicar caráter fictício e limitado; obter consentimento informado para participação e forma de registro. Não gravar; qualquer gravação exigiria autorização e consentimento específicos.
- [ ] Congelar commits/versões e ambiente; usar apenas nomes, grupos, mensagens e anexos fictícios já existentes, sem credenciais reais nem dados FORD.
- [ ] Definir acesso restrito e armazenamento controlado das anotações; divulgar somente síntese anonimizada e autorizada.
- [ ] Abrir ficha em branco do kit, sem resultados pré-preenchidos.

## Cartões de tarefa para o facilitador (ler um por vez)

Usar as formulações integrais do plano v0.3, sem ensinar o caminho. Estes cartões são índice de preparação, não um novo roteiro.
| Perfil | Código | Tema |
|---|---|---|
| Usuário | U-01 | Acesso pelo celular |
| Usuário | U-02 | Localizar conversa recente |
| Usuário | U-03 | Iniciar conversa individual |
| Usuário | U-04 | Encontrar grupo e mensagens |
| Usuário | U-05 | Escrever mensagem e compreender feedback |
| Usuário | U-06 | Anexar PDF/JPEG |
| Usuário | U-07 | Arquivo inválido/falha e recuperação |
| Usuário | U-08 | Sessão expirada/desconexão |
| TI | T-01 | Acesso e navegação |
| TI | T-02 | Localizar conta e ações |
| TI | T-03 | Criar grupo e incluir participantes |
| TI | T-04 | Consulta administrativa com auditoria |
| TI | T-05 | Revisão de alerta |
| TI | T-06 | Configurações |

Perguntas neutras: "O que você faria agora?", "O que espera que aconteça?", "O que lhe causou dúvida?". Não sugerir local de clique. Se autorizado o clicável complementar, concluir e registrar primeiro a fase estática; identificar separadamente cada instrumento, ajuda e desvio.

## Ficha de execução interna (em branco)

| Campo | Registro |
|---|---|
| Ensaio / papel | PENDENTE |
| Data, duração, dispositivo, navegador | PENDENTE |
| Instrumento e versão/commit | PENDENTE |
| Consentimento / responsável pelo registro | PENDENTE |
| Tarefas / resultado sem ajuda, com ajuda, não concluída, N/A | NÃO EXECUTADAS |
| Observações factuais / interpretação separada | NÃO REGISTRADAS |
| Severidade S1–S4 e proposta de ajuste | NÃO AVALIADAS |
| Prints autorizados, antes/depois e condição reproduzível | NÃO CAPTURADOS |
| Parecer PO/SQA e limites | PENDENTE |

## Encerramento

Separar resultados por perfil; usar o kit para achados e triagem, evidências identificadas por tarefa e versão, reteste após ajustes, parecer independente. Caso o grupo não execute, registrar a indisponibilidade e permanecer sem resultados. Não preencher métricas, depoimentos ou achados fictícios como se fossem observações. O aceite do PO para esta simulação é limitado e não equivale à aprovação SQA, à execução do ensaio, à autorização institucional da FORD ou ao encerramento da Issue #94.
