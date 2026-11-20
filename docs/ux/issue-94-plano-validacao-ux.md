# Plano de validação de UX com usuários representativos — Issue #94

> **Versão:** 0.1 — plano proposto, ainda não executado  
> **Data:** 19/11/2026  
> **Status:** plano aprovado pelo PO em 19/11/2026 para organização e preparação das sessões; execução e resultados pendentes  
> **Issue:** [#94 — Prototipar e validar UX com usuários representativos](https://github.com/Aluvioz/Polychat/issues/94)  
> **Epic:** [#78](https://github.com/Aluvioz/Polychat/issues/78)  
> **Artefatos de referência:** [Issue #91 — Usuário mobile](https://github.com/Aluvioz/Polychat/issues/91) e [Issue #92 — Console TI desktop](https://github.com/Aluvioz/Polychat/issues/92)

## 1. Objetivo executivo

Estabelecer um método verificável para avaliar se as jornadas prioritárias do Polychat são compreensíveis, localizáveis e executáveis pelos perfis que utilizarão o produto, identificando obstáculos antes da implementação ou homologação.

A validação deverá produzir evidências observáveis — tarefas, dificuldades, dúvidas, erros, comentários e decisões — e convertê-las em achados priorizados. Os resultados deverão orientar a revisão dos protótipos das Issues #91 e #92, sem transformar decisões de negócio ainda pendentes em requisitos aprovados.

**Este arquivo é um plano. Não comprova que sessões foram realizadas, que usuários participaram, que protótipos foram aprovados ou que o produto foi homologado.** Todas as evidências de execução deverão ser adicionadas após as sessões.

## 2. Contexto, baseline e limites

### 2.1 Baseline disponível

| Referência | Material disponível | Uso na validação |
|---|---|---|
| [#91 — Jornada mobile](https://github.com/Aluvioz/Polychat/issues/91) | Fluxos e wireframes de baixa fidelidade para o perfil Usuário, incluindo login, conversas, grupos, anexos e estados alternativos | Base da trilha de avaliação do Usuário mobile |
| [#92 — Console TI desktop](https://github.com/Aluvioz/Polychat/issues/92) | Fluxos e wireframes de baixa fidelidade para dashboard, contas, grupos, consulta/auditoria, alertas e configurações | Base da trilha de avaliação do perfil TI |
| [#93 — Design System](https://github.com/Aluvioz/Polychat/issues/93) | Proposta de design system v0.1, ainda sujeita a aprovações e validações | Referência visual provisória; não tratar cores, marca, componentes ou acessibilidade como homologados |
| [#129 — Homologação, acessibilidade e regressão](https://github.com/Aluvioz/Polychat/issues/129) | Atividade posterior de homologação e testes | Complementa, mas não é substituída, pelas sessões de usabilidade |
| [#126 — Plano de testes e rastreabilidade](https://github.com/Aluvioz/Polychat/issues/126) | Planejamento de testes e matriz requisito-caso | Deve concentrar a cobertura técnica e a rastreabilidade de testes de software |

Os protótipos das Issues #91 e #92 foram aceitos como baseline documental de baixa fidelidade. Esse aceite não significa que sejam interfaces implementadas, protótipos funcionais, nem que tenham passado por teste de usabilidade.

### 2.2 Público-alvo e decisão do PO

A descrição original da Issue #94 utiliza a expressão “público técnico”, enquanto as jornadas aprovadas nas Issues #91 e #92 representam dois perfis distintos. Após alinhamento presencial, o PO valida que a pesquisa contemple **os dois perfis**, em trilhas separadas:

1. **P-U — Usuário mobile:** participantes que representem os usuários finais do público inicial previsto para o Polychat.
2. **P-TI — TI desktop:** profissionais de TI que efetivamente utilizarão o console nas atividades administrativas previstas.

Os participantes não devem ser misturados, e os resultados devem ser analisados separadamente por perfil. A decisão não amplia automaticamente o público inicial para os aproximadamente 900 funcionários da FORD.

**Validação presencial do PO — 19/11/2026:** o PO confirma o público-alvo dos dois perfis, o dimensionamento qualitativo proposto e a realização de sessões-piloto como pré-teste do roteiro de pesquisa. Essas sessões-piloto são atividades de usabilidade e não constituem piloto de lançamento do produto. A FORD definiu lançamento único após homologação, sem grupo piloto de produto.

A confirmação do PO resolve a ambiguidade de escopo da pesquisa #94. Ela não altera por si só os números da baseline geral nem substitui a observância dos procedimentos institucionais acordados para convite, consentimento e tratamento das evidências.

### 2.3 Fora do escopo destas sessões

- Homologar segurança, autorização server-side, RLS, autenticação real ou isolamento de dados.
- Comprovar funcionamento de envio, entrega, upload, sincronização ou modo offline em produção.
- Redefinir políticas de consulta de conversas, retenção, alertas ou administração: essas regras já foram definidas na FORD v2 e devem ser representadas corretamente nos protótipos.
- Homologar a identidade visual oficial da FORD ou declarar conformidade de acessibilidade.
- Substituir testes funcionais, automatizados, integração, E2E, segurança, regressão ou homologação da Issue #129.

Achados que indiquem possível exposição de dados, autorização inadequada ou risco de segurança deverão ser registrados e encaminhados à liderança técnica/SQA para avaliação própria. Uma observação em protótipo não comprova nem descarta uma vulnerabilidade real.

## 3. Objetivos e perguntas de pesquisa

A pesquisa deverá responder, no mínimo, às perguntas a seguir.

| Objetivo | Pergunta que a sessão deve responder |
|---|---|
| Compreensão | A pessoa entende para que serve a tela e qual é o próximo passo? |
| Encontrabilidade | Consegue localizar conversas, contatos, grupos ou funções administrativas? |
| Execução | Consegue percorrer a jornada proposta sem instruções do facilitador? |
| Feedback | Entende o resultado de uma ação, inclusive erro, cancelamento e estado vazio? |
| Recuperação | Consegue reconhecer um problema e identificar uma alternativa adequada? |
| Confiança | Entende quando uma ação é crítica, o que será alterado e quando precisa confirmar? |
| Consistência | Reconhece padrões semelhantes entre telas e estados do mesmo perfil? |
| Linguagem | Os rótulos, mensagens e instruções são compreensíveis para o público do perfil? |

A pesquisa é formativa: seu propósito principal é encontrar problemas e melhorar a solução, não produzir uma declaração estatística de satisfação ou representatividade de toda a população da FORD.

## 4. Método de validação

### 4.1 Abordagem

Executar sessões individuais, moderadas e baseadas em tarefas, utilizando o recurso de *think aloud* (a pessoa verbaliza o que espera, procura e entende enquanto percorre o protótipo).

Como os materiais de referência são wireframes e fluxos de baixa fidelidade, a atividade será uma **avaliação guiada de protótipo estático**: a pessoa deverá apontar, descrever ou indicar no Miro o que faria e o que espera que aconteça. Não simular cliques funcionais inexistentes nem induzir a pessoa a acreditar que a operação foi executada.

### 4.2 Duração e formato propostos

| Etapa | Duração sugerida | Atividade |
|---|---:|---|
| Abertura | 5 min | Explicar objetivo, consentimento, anonimização e dinâmica |
| Contexto | 5–10 min | Entender o papel, a experiência relevante e as expectativas da pessoa |
| Tarefas | 25–35 min | Percorrer tarefas do perfil, sem ensinar a solução |
| Avaliação final | 5–10 min | Recolher percepção, dúvidas, confiança e sugestões |
| Encerramento | 3–5 min | Agradecer, explicar próximos passos e conferir autorização de uso das evidências |

**Duração total estimada:** 45 a 60 minutos por participante. Trata-se de uma referência de planejamento, ajustável após o piloto.

### 4.3 Piloto

Realizar inicialmente 1 ou 2 sessões-piloto por perfil, caso ambos sejam confirmados. O piloto deve verificar se as tarefas são compreensíveis, se os protótipos permitem observar o comportamento pretendido e se o roteiro não induz respostas.

As sessões-piloto também devem ser registradas. Se houver alteração relevante no roteiro ou no protótipo após o piloto, identificar a versão utilizada em cada sessão e avaliar se as observações continuam comparáveis.

## 5. Participantes e recrutamento

### 5.1 Segmentos

| Segmento | Perfil desejado | Critério de seleção |
|---|---|---|
| P-U — Usuário mobile | Funcionário que utilizará o aplicativo para comunicação individual e em grupos | Representar o papel de usuário final, sem privilégios administrativos |
| P-TI — TI desktop | Profissional que utilizará o console para atividades administrativas autorizadas | Representar as responsabilidades reais de administração, suporte ou operação previstas para o produto |

Não selecionar apenas pessoas da equipe que desenhou os protótipos ou que já conheçam seus fluxos. Pessoas internas podem participar quando representarem efetivamente o perfil, mas a familiaridade com o projeto deve ser registrada.

### 5.2 Tamanho recomendado da amostra

Para uma rodada qualitativa formativa, recomenda-se **5 a 8 participantes por perfil** confirmado, em sessões individuais. Se os dois perfis forem validados, a referência será de 10 a 16 participantes no total, além das sessões-piloto, conforme disponibilidade e autorização.

Essa quantidade é uma recomendação operacional para identificar problemas recorrentes e não representa amostra estatisticamente representativa da organização. Se o recrutamento não atingir a quantidade prevista, documentar a limitação e não generalizar os resultados.

### 5.3 Critérios de recrutamento

- Participantes devem corresponder ao papel que efetivamente utilizará a jornada avaliada.
- Buscar diversidade razoável de experiência com aplicativos de comunicação, familiaridade digital e rotinas de trabalho.
- Não recrutar subordinados diretos do facilitador quando isso puder inibir críticas.
- Não exigir que participantes conheçam previamente o Polychat.
- Não incluir pessoas sem relação com o perfil apenas para completar a quantidade.
- Registrar código anônimo, perfil e características estritamente necessárias à interpretação; não registrar matrícula, credenciais ou dados pessoais desnecessários.

### 5.4 Preparação e consentimento

Antes da sessão, informar objetivo, duração, atividade, forma de registro, acesso às anotações e possibilidade de interromper a participação. Gravação de áudio ou vídeo só poderá ocorrer mediante autorização explícita e conforme as regras institucionais aplicáveis.

Utilizar nomes, conversas, contas, grupos e arquivos fictícios. Não solicitar senha real, não usar conversas de trabalho reais e não capturar informações corporativas confidenciais. Armazenar evidências em local autorizado, com acesso restrito e prazo de retenção definido pelo responsável institucional.

## 6. Roteiro de tarefas — Usuário mobile (P-U)

As tarefas abaixo devem ser executadas com os materiais da Issue #91. O facilitador deve ler o contexto, entregar uma tarefa por vez e observar a navegação. Não explicar onde clicar ou qual tela escolher.

| ID | Cenário apresentado ao participante | O que observar |
|---|---|---|
| U-01 | “Você precisa acessar o Polychat pelo celular. Mostre como começaria.” | Identificação da entrada, compreensão dos campos e expectativa de autenticação |
| U-02 | “Você entrou no aplicativo e precisa localizar uma conversa recente.” | Leitura da lista, hierarquia, busca e reconhecimento de uma conversa |
| U-03 | “Você precisa iniciar uma conversa individual com um colega ativo.” | Encontrabilidade do contato, compreensão da ação e clareza do fluxo |
| U-04 | “Você precisa encontrar um grupo do qual participa e entender onde consultar as mensagens.” | Identificação do grupo, contexto e compreensão dos limites de participação |
| U-05 | “Você precisa escrever uma mensagem e entender como saberá se o envio foi concluído.” | Localização do campo, ação de envio e compreensão do feedback/status |
| U-06 | “Você precisa anexar um documento PDF ou uma imagem JPEG.” | Encontrabilidade da função, entendimento dos formatos permitidos e feedback esperado |
| U-07 | “Agora considere que o arquivo escolhido não é permitido ou que o envio falhou. O que você faria?” | Distinção entre arquivo inválido e falha de upload; capacidade de recuperação |
| U-08 | “A sessão expirou ou você ficou sem conexão. O que a tela informa e qual seria seu próximo passo?” | Compreensão do estado, expectativa de recuperação e ausência de promessas enganosas de envio |

Tarefas U-05 a U-08 devem ser tratadas como avaliação de compreensão do fluxo e dos estados desenhados, e não como comprovação do funcionamento real de mensagens, anexos, sessão ou modo offline. A política offline, limites de anexos e regras de câmera permanecem sujeitos às decisões registradas nas questões em aberto do projeto.

## 7. Roteiro de tarefas — TI desktop (P-TI)

As tarefas abaixo devem ser executadas com os materiais da Issue #92. A validação deve distinguir o que é apenas proposta de interface do que já possui regra de negócio aprovada.

| ID | Cenário apresentado ao participante | O que observar |
|---|---|---|
| T-01 | “Você precisa acessar o console e localizar a área que usaria para iniciar seu trabalho.” | Compreensão do acesso e da navegação do dashboard |
| T-02 | “Você precisa localizar uma conta e entender quais informações e ações estão disponíveis.” | Encontrabilidade, leitura da tabela, clareza de ações e distinção entre consultar e alterar |
| T-03 | “Você precisa criar um grupo e incluir participantes ativos.” | Compreensão do fluxo, seleção de participantes, validações e confirmação |
| T-04 | “Você recebeu uma solicitação de consulta administrativa. Mostre onde procuraria as informações e o que precisaria compreender antes de prosseguir.” | Entendimento da navegação e dos controles de governança apresentados |
| T-05 | “Você precisa revisar um alerta e entender qual encaminhamento está disponível.” | Compreensão do contexto, revisão humana e distinção entre alerta e ação administrativa |
| T-06 | “Você precisa localizar as configurações disponíveis e entender o que poderia alterar.” | Clareza da navegação, escopo e confirmação de alterações críticas |

**Limites obrigatórios para a trilha TI:**

- Em T-04, avaliar a compreensão da jornada de consulta administrativa já definida: TI pode consultar qualquer conversa a qualquer momento, sem justificativa ou segunda aprovação, com registro de auditoria. A sessão testa somente a compreensão do protótipo; não comprova implementação.
- Em T-05, avaliar se o participante compreende a fila TI, as severidades baixa/média/alta e os prazos definidos (alta: imediatamente/até 1 hora; média: até 1 dia útil; baixa: até 3 dias úteis). Não representar bloqueio automático; TI pode encerrar o alerta sem justificativa obrigatória.
- Em T-06, não tratar como catálogo aprovado os parâmetros ilustrativos de configurações. O catálogo real precisa de decisão do PO/TI.
- Não executar operações administrativas reais durante a sessão. Utilizar apenas cenário fictício e protótipo estático.

## 8. Condução da sessão

### 8.1 Orientações ao facilitador

- Ler o cenário sem sugerir telas, botões ou caminhos.
- Perguntar “O que você espera que aconteça agora?” em vez de “Você entendeu?”.
- Permitir silêncio e tempo para observação; não completar a tarefa pela pessoa.
- Se houver bloqueio, registrar o ponto e só depois perguntar o que a pessoa esperava encontrar.
- Distinguir erro do participante, ambiguidade do protótipo, falta de informação e regra de negócio não definida.
- Não defender o desenho nem corrigir a pessoa durante a execução.
- Não prometer funcionalidades ou comportamentos que ainda não foram aprovados.

### 8.2 Perguntas de encerramento

1. Qual parte foi mais fácil? Por quê?
2. Em que momento você teve dúvida ou não soube como continuar?
3. Houve alguma mensagem ou rótulo que poderia ser interpretado de outra maneira?
4. Em quais ações você gostaria de receber confirmação ou explicação adicional?
5. Você confiaria que a ação foi concluída? O que na interface levou a essa percepção?
6. O que deveria ser corrigido antes de disponibilizar essa experiência?

## 9. Métricas e critérios de observação

Por se tratar de avaliação qualitativa de wireframes de baixa fidelidade, as métricas devem apoiar a interpretação, não criar uma falsa precisão estatística.

### 9.1 Registro por tarefa

| Métrica | Definição |
|---|---|
| Resultado | Concluída sem ajuda; concluída com ajuda; não concluída; não aplicável |
| Erros observados | Ação equivocada, interpretação incorreta ou tentativa sem resultado esperado |
| Ajuda necessária | Intervenção do facilitador e motivo |
| Dúvidas/hesitações | Ponto em que a pessoa não sabe como prosseguir ou verbaliza incerteza |
| Compreensão do feedback | Interpreta corretamente sucesso, erro, estado vazio ou ação pendente? |
| Facilidade percebida | Pergunta pós-tarefa em escala de 1 a 7, em que 1 = muito difícil e 7 = muito fácil |
| Comentário | Observação ou frase relevante, anonimizada e contextualizada |

Tempo de execução pode ser anotado como indicador exploratório, mas não deve ser comparado a metas de produto enquanto a interação não for funcional e não houver condições equivalentes de sessão. Não utilizar SUS como indicador de usabilidade do sistema com wireframes estáticos; eventual questionário padronizado deverá ser avaliado após a existência de um protótipo interativo adequado.

### 9.2 Escala de severidade dos achados

| Nível | Classificação | Critério |
|---|---|---|
| S1 | Crítico | Impede uma jornada essencial, induz a uma ação potencialmente danosa ou gera entendimento de exposição/alteração indevida de informação. Encaminhar imediatamente ao PO e à liderança técnica/SQA; risco de segurança exige avaliação própria. |
| S2 | Alto | Impede ou compromete fortemente uma tarefa prioritária, sem alternativa clara, ou exige ajuda recorrente. |
| S3 | Médio | Causa dificuldade, erro recuperável, retrabalho ou dúvida relevante, mas há caminho alternativo compreensível. |
| S4 | Baixo | Problema de clareza, consistência, texto ou apresentação com impacto limitado na conclusão da tarefa. |

A severidade deve considerar impacto na tarefa, criticidade da jornada, possibilidade de recuperação e risco percebido. Frequência nas sessões é evidência de recorrência observada, mas não deve ser extrapolada para toda a organização.

### 9.3 Priorização

- **Prioridade imediata:** achado S1; interromper a avaliação do fluxo afetado quando necessário e escalar.
- **Prioridade alta:** achado S2 em jornada essencial ou repetido em diferentes participantes.
- **Prioridade planejada:** achado S3 ou S4, priorizado pelo impacto e custo de correção.
- **Aguardando decisão:** achado cuja solução depende de política, requisito ou decisão institucional ainda pendente. Não desenhar uma regra por conta própria para “resolver” a observação.

## 10. Evidências e entregáveis obrigatórios

Após a execução, produzir ou atualizar os seguintes registros:

| Entregável | Conteúdo mínimo |
|---|---|
| Registro das sessões | Código anônimo do participante, perfil, data, facilitador, versão do protótipo e status da sessão |
| Log de tarefas | Resultado, erros, hesitações, ajuda recebida, facilidade percebida e observações |
| Registro de achados | ID único, descrição objetiva, contexto, severidade, prioridade, evidência e recomendação |
| Síntese por perfil | Padrões encontrados separadamente para Usuário mobile e TI desktop |
| Backlog de melhorias | Itens priorizados, responsável proposto, dependências e relação com os requisitos |
| Histórico do protótipo | Versão anterior, alterações feitas em resposta aos achados e justificativa |
| Parecer de validação | Decisões do PO, ressalvas, pontos aceitos, rejeitados ou adiados e responsáveis |

Não publicar nomes, credenciais, imagens de tela com dados pessoais ou transcrições identificáveis. Utilizar identificadores como P-U01 e P-TI01.

### 10.1 Modelo de registro de achado

Copiar e preencher uma linha por problema observado:

| Campo | Preenchimento |
|---|---|
| ID | UX-94-001 |
| Perfil / sessão | P-U ou P-TI; código anônimo |
| Tarefa | U-01 a U-08 ou T-01 a T-06 |
| Evidência | Comportamento observado, sem interpretação antecipada |
| Expectativa da pessoa | O que ela esperava encontrar ou que acontecesse |
| Impacto | Efeito na conclusão, confiança ou compreensão da tarefa |
| Severidade / prioridade | S1–S4 e prioridade atribuída |
| Origem provável | Conteúdo, navegação, hierarquia, feedback, regra pendente ou outro |
| Recomendação | Alteração sugerida, sem presumir regra de negócio |
| Rastreabilidade | RF/RN/CA ou questão em aberto relacionada |
| Responsável / situação | Responsável pela análise e estado do tratamento |

### 10.2 Modelo de registro de sessão

| Campo | Preenchimento |
|---|---|
| Código anônimo | P-U01 / P-TI01 |
| Perfil | Usuário mobile / TI desktop |
| Data e facilitador | Preencher após a sessão |
| Protótipo e versão | Link e identificação da versão utilizada |
| Tarefas realizadas | IDs das tarefas executadas |
| Interrupções/desvios | Motivo e impacto na interpretação |
| Evidências autorizadas | Anotações e gravações somente quando autorizadas |
| Observações gerais | Síntese sem dados pessoais |

## 11. Análise, tratamento e atualização dos protótipos

Após as sessões:

1. Consolidar as observações por perfil, preservando diferenças entre Usuário e TI.
2. Separar fatos observados, interpretação do pesquisador e recomendação de solução.
3. Agrupar achados semelhantes sem apagar evidências individuais.
4. Atribuir severidade e prioridade; encaminhar imediatamente riscos críticos.
5. Relacionar cada achado aos requisitos, critérios de aceitação ou questões em aberto aplicáveis.
6. Submeter propostas de correção ao PO e à liderança técnica; decisões de negócio precisam do responsável institucional.
7. Atualizar os protótipos das Issues #91 e/ou #92 e identificar a versão revisada.
8. Reavaliar tarefas afetadas quando uma mudança alterar significativamente a navegação, linguagem ou comportamento esperado.
9. Registrar formalmente o parecer de aprovação, aprovação condicionada ou rejeição.

O protótipo atualizado deverá manter histórico mínimo do que mudou, por que mudou, qual evidência motivou a mudança e quem aprovou. “Protótipo atualizado” não equivale a “funcionalidade implementada”.

## 12. Governança, responsabilidades e decisões

| Papel | Responsabilidade |
|---|---|
| PO | Aprovar objetivos, perfis, escopo, prioridades, decisões de produto e parecer final |
| UI/UX | Preparar protótipos e roteiro, conduzir ou apoiar sessões, consolidar observações e propor melhorias |
| SQA | Avaliar qualidade das evidências, rastreabilidade, consistência dos critérios e encaminhamento de defeitos |
| Tech Lead | Avaliar viabilidade, impactos técnicos e riscos; separar proposta de UX de comportamento implementado |
| Representantes FORD / áreas responsáveis | Validar público, políticas, linguagem institucional e decisões de negócio sob sua responsabilidade |
| Facilitador / observador | Executar o roteiro de forma neutra, registrar fatos e preservar anonimato |

Antes do recrutamento, o PO deve registrar a decisão sobre público-alvo, quantidade de participantes, autorização institucional e responsáveis pelas sessões. A participação de representantes FORD e o uso de ambientes ou dados institucionais dependem de autorização prévia.

## 13. Critérios de aceite da Issue #94

A Issue #94 somente deverá ser considerada concluída quando houver evidência para todos os critérios abaixo:

- [x] **Público representativo definido:** perfis P-U e P-TI e critérios de recrutamento aprovados pelo PO em 19/11/2026, após alinhamento presencial; trilhas e resultados separados.
- [ ] **Sessões realizadas e registradas:** sessões por perfil planejado, com participantes anônimos, versão do protótipo, tarefas e limitações registradas.
- [ ] **Achados priorizados:** problemas, dúvidas e observações documentados, com severidade e prioridade justificadas.
- [ ] **Protótipos atualizados:** mudanças pertinentes aplicadas às jornadas #91/#92, com histórico e rastreabilidade.
- [ ] **Aprovação registrada:** parecer formal do PO e revisão técnica pertinente sobre a versão atualizada; decisões institucionais encaminhadas aos responsáveis.
- [ ] **Testes/evidências pertinentes documentados:** resultados das sessões e encaminhamentos registrados; testes funcionais, segurança e acessibilidade permanecem vinculados às atividades próprias.
- [ ] **Revisão por PR concluída:** documentação e artefatos alterados revisados.
- [ ] **Sem regressão nos fluxos relacionados:** mudanças avaliadas por QA/SQA conforme a estratégia de testes, com evidência registrada; sessão de usabilidade isolada não comprova ausência de regressão.

Não marcar os critérios como concluídos com base apenas neste plano, na existência dos wireframes ou no agendamento de sessões.

## 14. Dependências e relação com outras issues

| Issue / decisão | Relação com a #94 |
|---|---|
| #91 — Jornada Usuário mobile | Fornece o protótipo-base para a trilha P-U |
| #92 — Console TI desktop | Fornece o protótipo-base para a trilha P-TI |
| #93 — Design System | Visual ainda provisório; alterações de identidade e acessibilidade não devem ser consideradas homologadas |
| #126 — Plano de testes e rastreabilidade | Deve organizar a cobertura de testes de software e sua ligação aos requisitos |
| #129 — Homologação, acessibilidade e regressão | Deve executar a homologação e os testes técnicos pertinentes após implementação |
| Q-018 | Refinamento interno de arquitetura da informação, telas e navegação pelo PO/UX; regras de negócio já estão definidas | 
| Q-019 | Obtenção dos arquivos oficiais de marca (logo, manual e códigos exatos) | 
| Q-025 | Consolidação de evidências técnicas Supabase/Vercel; não interfere nas regras a avaliar nas sessões de usabilidade | 
| Q-003, Q-007, Q-008, Q-009, Q-010, Q-012 e Q-020 | Resolvidas pela FORD v2; não são questões abertas da pesquisa. Usar as regras vigentes nos cenários e avaliar somente compreensão da interface |

## 15. Checklist de preparação

- [x] Confirmar o significado de “público técnico” e os perfis que serão testados — decisão do PO registrada em 19/11/2026.
- [x] Aprovar objetivo, escopo, quantidade de participantes e critérios de seleção — validação presencial do PO em 19/11/2026.
- [x] Confirmar as premissas de autorização institucional para recrutamento e realização das sessões — discutidas presencialmente; observar os procedimentos e consentimentos aplicáveis antes da coleta.
- [ ] Preparar convite, consentimento e orientação de privacidade.
- [ ] Confirmar que todos os cenários usam dados fictícios.
- [ ] Identificar versões dos protótipos #91 e #92 e conferir se estão acessíveis.
- [ ] Identificar apenas os pontos que continuam em aberto (Q-018 e Q-019) e separar limitações do wireframe de regras de negócio já confirmadas.
- [ ] Preparar roteiro, planilha/log de tarefas e modelo de achados.
- [ ] Definir facilitador, observador, local/ferramenta e armazenamento autorizado.
- [ ] Realizar sessão-piloto de usabilidade (pré-teste do roteiro), ajustar o instrumento se necessário e registrar a versão. Esta atividade não é piloto de lançamento do produto.
- [ ] Após a coleta, consolidar evidências, priorizar achados e atualizar protótipos.

---

**Parecer do PO — 19/11/2026:** plano de trabalho v0.1 **APROVADO pelo PO** para organizar sessões de usabilidade com os perfis Usuário mobile e TI desktop. A aprovação autoriza sessões de pesquisa, inclusive sessões-piloto para validar o roteiro; não autoriza piloto de lançamento nem altera a regra de lançamento único após homologação. Não declara sessões realizadas, achados obtidos, protótipos atualizados ou experiência final aprovada. Utilizar dados fictícios/anônimos e seguir os procedimentos institucionais aplicáveis ao recrutamento e registro.

A Issue #94 permanece aberta até que as sessões sejam realizadas, os achados priorizados, os protótipos atualizados quando necessário e as evidências/revisões previstas nos critérios de aceite sejam apresentadas. A implementação funcional do Polychat ainda não começou; os materiais #91/#92 são wireframes de baixa fidelidade e não podem ser apresentados como telas implementadas ou protótipo funcional.
