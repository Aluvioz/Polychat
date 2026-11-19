# Política de detecção e classificação de conteúdo suspeito

- **Documento:** POLY-SEC-002
- **Versão:** 0.1 — preliminar
- **Data:** 19/11/2026
- **Status:** Em elaboração; sujeito à aprovação de negócio, TI, Segurança e Jurídico/Privacidade
- **Issue principal:** [#122 — Implementar detecção de conteúdo suspeito e palavrões](https://github.com/Aluvioz/Polychat/issues/122)
- **Épica:** [#86 — Segurança, monitoramento e auditoria](https://github.com/Aluvioz/Polychat/issues/86)
- **ADR relacionada:** [ADR-010 — Segurança, auditoria e monitoramento](../adr/ADR-010-seguranca-auditoria-monitoramento.md)

> **Aviso de status:** esta é uma especificação preliminar. Ela consolida requisitos existentes e propõe critérios para refinamento. Não aprova uma lista de termos, categorias, limiares, severidades, prazos, canais de alerta ou medidas disciplinares. Nenhuma proposta deste documento deve ser tratada como política institucional aprovada até a validação formal pelas áreas responsáveis da FORD.

---

## 1. Objetivo

Definir uma referência funcional e operacional para a identificação de mensagens potencialmente suspeitas no Polychat, incluindo o tratamento de palavrões conforme critérios aprovados pela FORD.

A política deve permitir que mensagens que atendam a regras aprovadas sejam sinalizadas para revisão, com contexto mínimo e rastreabilidade suficiente para compreender o motivo da sinalização. Também deve permitir que falsos positivos sejam identificados, revisados e utilizados para melhorar as regras de forma controlada.

O propósito desta funcionalidade é apoiar a segurança e a investigação autorizada. A sinalização automática não constitui, por si só, comprovação de violação, intenção indevida ou conduta irregular do remetente.

## 2. Escopo

Este documento trata de:

- categorias de conteúdo que poderão ser analisadas;
- regras de detecção e classificação;
- identificação de palavrões segundo lista aprovada;
- contexto mínimo associado a uma sinalização;
- revisão de falsos positivos;
- comportamento quando a análise falhar;
- metadados, versionamento e rastreabilidade das regras;
- relação entre detecção, alerta e investigação;
- critérios de teste e evidências;
- decisões ainda necessárias para concluir a Issue #122.

### 2.1 Fora do escopo

Este documento não define nem substitui:

- a política institucional de monitoramento, finalidade, transparência e retenção, tratada na ADR-010 e na Issue #102;
- a consulta administrativa de mensagens e conversas, tratada na Issue #121;
- a interface, fila e fluxo operacional de alertas da Issue #123;
- a trilha de auditoria de ações privilegiadas da Issue #124;
- a análise antimalware de arquivos anexados, tratada na Issue #117;
- uma política disciplinar ou de punição de funcionários;
- bloqueio automático de mensagens ou contas;
- a adoção de inteligência artificial, modelos externos ou serviços de terceiros;
- uma decisão de criptografia ponta a ponta (E2EE).

## 3. Fontes e rastreabilidade

| Fonte | O que estabelece | Limite |
|---|---|---|
| RF-014 — Analisar mensagens em busca de conteúdo suspeito | Cada mensagem submetida deve passar pela política de análise aprovada; termos/categorias e motivos devem ser definidos | Critérios de detecção e lista de termos dependem de aprovação |
| CA-014.1 | A análise deve seguir a política aprovada pela FORD | A política ainda não está aprovada |
| CA-014.2 | Palavrões entram no conjunto monitorado somente conforme lista aprovada | Não existe lista aprovada neste documento |
| CA-014.3 | Mensagem sinalizada deve ficar associada ao motivo/regra da sinalização | Formato do registro e prazo de retenção dependem de política |
| CA-014.4 | Não aplicar bloqueio ou punição automática antes de definição expressa | Qualquer mudança exige decisão específica e rastreável |
| RF-015 — Alertar o TI | Mensagens sinalizadas devem gerar alerta visível ao TI por mecanismo aprovado | Canal, severidade, prazo e fluxo estão pendentes |
| CA-015.1 a CA-015.3 | Alerta deve identificar conversa, mensagem, momento e motivo; canal e tratamento devem ser definidos | A exposição do conteúdo deve respeitar acesso administrativo aprovado |
| RN-012 — Análise de conteúdo | Há intenção confirmada de analisar mensagens, incluindo palavrões conforme critérios a aprovar | Não estabelece lista nem algoritmo |
| RN-013 — Alerta ao TI | Mensagens identificadas como suspeitas devem gerar alerta ao TI | Canal, severidade e resposta ainda não definidos |
| RNF-011 — Privacidade e governança | Monitoramento, finalidade, transparência, responsáveis, retenção e resposta legal exigem aprovação das áreas competentes | Pendente de aprovação |
| Q-007 — Detecção de mensagens suspeitas | Pergunta quais categorias/termos serão analisados e qual técnica será utilizada | Pendente — Cliente / Segurança |
| Q-008 — Resposta a alertas | Pergunta sobre severidade, responsáveis, prazo e fluxo de investigação | Pendente — Cliente / TI |
| Q-009 e Q-010 | Definem dependências de governança de consulta, auditoria e retenção | Pendente — Cliente / TI / Jurídico / Privacidade |
| ADR-010 | Discute monitoramento, consulta de conteúdo, trade-offs de privacidade e salvaguardas | Status Proposed; depende de aprovação expressa |

As fontes são mantidas sem promover recomendações a requisitos confirmados. O documento não amplia o escopo funcional para punição automática, bloqueio de mensagens ou vigilância fora das finalidades aprovadas.

## 4. Classificação das informações

São usadas três classificações:

- **Confirmado:** consta expressamente dos requisitos ou regras de negócio vigentes.
- **Proposta:** recomendação de produto ou técnica para avaliação. Não é uma decisão final.
- **Pendente:** depende de resposta ou aprovação da FORD, TI, Segurança, Jurídico/Privacidade ou responsável indicado.

A versão 0.1 deve ser entendida como material de refinamento, não como autorização para iniciar monitoramento de conteúdo em produção.

## 5. Princípios de funcionamento

### 5.1 Sinalização não é condenação

**Confirmado em relação ao escopo atual**

A detecção identifica mensagens que correspondem a regras aprovadas e pode gerar alertas para revisão. Uma sinalização isolada não comprova intenção, infração ou comportamento irregular.

**Proposta**

- Apresentar a ocorrência como “mensagem sinalizada para revisão”, e não como “violação confirmada”.
- Permitir classificação posterior como ocorrência confirmada, falso positivo ou inconclusiva, conforme fluxo aprovado.
- Evitar que a sinalização seja usada automaticamente para bloquear o envio, suspender contas ou aplicar medidas disciplinares.
- Não criar pontuação permanente de risco por funcionário nesta funcionalidade.

### 5.2 Finalidade e proporcionalidade

**Pendente de aprovação institucional**

Antes de ativar a análise, a FORD deve aprovar finalidade, categorias, público, responsáveis, transparência, acesso aos resultados e retenção. A prioridade de segurança declarada nos requisitos não elimina as obrigações aplicáveis de privacidade, proteção de dados e governança corporativa.

A análise deve limitar-se às categorias e finalidades aprovadas. Não ampliar o monitoramento para produtividade, avaliação de desempenho ou assuntos fora do escopo sem decisão e avaliação próprias.

### 5.3 Acesso restrito

**Proposta**

- O resultado da detecção deve ser acessível somente a perfis e operadores autorizados conforme a matriz de autorização e a política institucional.
- Usuários comuns não devem visualizar a fila administrativa, metadados internos da regra ou investigações de outras pessoas.
- A visualização do conteúdo da mensagem deve seguir as regras de consulta administrativa aprovadas e implementadas; o alerta não deve conceder acesso indireto ao conteúdo.
- A consulta ao conteúdo para investigação deve observar a Issue #121 e gerar os eventos de auditoria definidos para a Issue #124.

## 6. Categorias de detecção

Nenhuma lista de termos ou categorias está aprovada nesta versão. As linhas abaixo são itens para decisão, não um catálogo habilitado.

| Categoria candidata | Escopo a esclarecer | Situação |
|---|---|---|
| Palavrões | Lista explícita de termos em português e, se aplicável, em outros idiomas; tratamento de variações e expressões | Pendente — Q-007 |
| Ofensas direcionadas | Se insultos dirigidos a pessoas ou grupos serão abrangidos e como serão definidos | Pendente — Q-007 |
| Ameaças ou linguagem de risco | Se a categoria fará parte do MVP, quais critérios objetivos se aplicam e qual resposta é esperada | Pendente — Q-007 / Q-008 |
| Outras categorias | Qualquer categoria adicional deverá ter finalidade, definição e aprovação próprias | Fora do escopo até aprovação |

A inclusão de uma categoria deve especificar exemplos de correspondência e não correspondência, limites, justificativa e risco de falsos positivos. Categorias não aprovadas não devem ser ativadas por inferência da equipe técnica.

## 7. Estratégia de detecção

### 7.1 Abordagem inicial candidata

**Proposta para avaliação técnica e institucional**

Para o primeiro incremento, recomenda-se avaliar regras determinísticas e versionadas, baseadas exclusivamente em termos e padrões aprovados. Essa opção é mais simples de explicar, testar e auditar do que introduzir um modelo probabilístico antes da validação da necessidade.

A proposta não escolhe biblioteca, fornecedor nem tecnologia definitiva.

### 7.2 Regras e normalização

Caso a abordagem por lista seja aprovada, a equipe técnica deverá avaliar:

- comparação sem distinção de maiúsculas/minúsculas;
- normalização Unicode e variações de codificação;
- tratamento de acentuação e caracteres visualmente semelhantes;
- limites de palavra para evitar correspondência dentro de termos não relacionados;
- expressões compostas e variações ortográficas aprovadas;
- mensagens com URLs, código, citações ou conteúdo técnico, quando isso puder alterar o contexto;
- proteção contra regras excessivamente amplas que gerem muitos falsos positivos.

A normalização não deve remover sinais ou transformar o texto de modo que altere o sentido sem análise. O texto original da mensagem deve permanecer preservado conforme a política de armazenamento; o mecanismo de comparação deve operar sem modificar o conteúdo enviado.

### 7.3 Contexto e análise contextual

A análise contextual não está aprovada. Antes de adotá-la, seria necessário definir:

- quais sinais contextuais serão considerados;
- como será explicada a razão de uma sinalização;
- como serão testados viés, erros e falsos positivos;
- quais dados serão enviados a serviços ou modelos externos, se houver;
- requisitos de segurança, privacidade, hospedagem e retenção.

Não enviar conteúdo de mensagens a serviços externos nem introduzir IA/modelos de terceiros sem avaliação e aprovação próprias.

### 7.4 Limiares e pontuação

Não há limiar, pontuação ou severidade aprovados. Na versão 0.1, recomenda-se não criar pontuação numérica de risco sem uma necessidade demonstrada e validação de negócio e Segurança.

Se múltiplas regras forem aplicadas, cada correspondência deve ser identificada individualmente por código e versão. Um resultado composto não deve ocultar quais regras efetivamente corresponderam.

## 8. Fluxo funcional proposto

O fluxo abaixo é uma referência para discussão e não substitui o desenho técnico nem a política aprovada.

1. O usuário envia uma mensagem por uma conversa na qual está autorizado a participar.
2. O servidor valida identidade e autorização conforme as regras da aplicação.
3. A mensagem segue o fluxo normal de envio definido pelo produto.
4. O mecanismo executa as regras de detecção que estiverem aprovadas e ativas.
5. Se uma regra corresponder, o sistema registra uma ocorrência associada à mensagem, à regra e à sua versão.
6. O sistema disponibiliza um alerta à equipe de TI pelo mecanismo aprovado, sem ampliar as permissões de acesso ao conteúdo.
7. O operador autorizado revisa a ocorrência segundo o procedimento aprovado.
8. A revisão registra a classificação final e a ação realizada, quando aplicável.

### 8.1 Comportamento sem bloqueio automático

**Confirmado pelo CA-014.4**

A detecção não deve bloquear mensagens ou punir automaticamente usuários enquanto não houver definição expressa.

**Proposta a aprovar**

A detecção deve funcionar como sinalização e registro, sem atuar como mecanismo de moderação impeditiva. A falha do mecanismo de detecção não deve converter silenciosamente uma mensagem em “aprovada” nem ser apresentada como resultado limpo.

A política de continuidade deve definir se, diante de indisponibilidade, o envio prossegue e a análise fica pendente para retentativa, ou se existe outro tratamento. Até essa decisão, a equipe não deve implementar bloqueio de envio apenas por falha do detector.

## 9. Registro da ocorrência e contexto mínimo

O critério da Issue #122 exige contexto mínimo. A finalidade é permitir revisão sem duplicar desnecessariamente o conteúdo da conversa em alertas ou logs.

### 9.1 Metadados candidatos

**Proposta para avaliação**

| Campo candidato | Finalidade |
|---|---|
| Identificador único da ocorrência | Rastrear a sinalização |
| Identificador da mensagem e conversa | Localizar o conteúdo sob autorização |
| Identificador do remetente | Identificar a origem da mensagem |
| Data/hora da mensagem e da detecção | Reconstruir a sequência de eventos |
| Categoria e código da regra | Explicar o motivo da sinalização |
| Versão da regra/lista | Reproduzir e auditar a classificação |
| Trecho mínimo ou referência segura ao contexto | Permitir triagem sem replicar a mensagem integral |
| Estado da revisão | Distinguir pendente, confirmada, falso positivo ou inconclusiva |
| Identificador do revisor e data/hora da revisão | Responsabilizar a ação administrativa |
| Identificador de correlação | Relacionar logs técnicos sem expor conteúdo |

O formato final, os campos obrigatórios e o prazo de retenção dependem de Q-009 e Q-010 e da política da Issue #102.

### 9.2 Minimização de conteúdo

**Proposta**

- Não copiar a mensagem completa para notificações, e-mails ou logs técnicos por padrão.
- Usar referência à mensagem e à conversa; a visualização do conteúdo deve ocorrer somente por fluxo autorizado.
- Caso um trecho seja necessário para triagem, limitar o tamanho e a extensão ao mínimo aprovado, evitando conteúdo de mensagens anteriores não relacionadas.
- Não armazenar tokens, credenciais ou dados técnicos sensíveis junto ao evento.
- Registrar motivo e regra correspondente para que o revisor saiba por que a mensagem foi sinalizada.

A decisão de mostrar trecho, mensagem integral ou somente metadados deve ser aprovada com Segurança e Jurídico/Privacidade.

## 10. Revisão de falsos positivos

A ocorrência automática não encerra a análise. O processo precisa permitir que o revisor registre o resultado e preserve a rastreabilidade.

### 10.1 Estados candidatos

Os nomes abaixo são propostas conceituais, não schema aprovado.

| Estado candidato | Significado |
|---|---|
| pending_review | Sinalização criada e aguardando revisão |
| under_review | Operador autorizado iniciou a análise |
| confirmed | Revisor concluiu que a sinalização corresponde à regra aplicada |
| false_positive | Revisor concluiu que a regra sinalizou indevidamente |
| inconclusive | Evidência insuficiente ou contexto não permite conclusão |
| closed | Tratamento encerrado conforme procedimento aprovado |

A equipe técnica pode propor outros estados, mantendo a distinção entre resultado automático e conclusão humana.

### 10.2 Feedback e correção de regras

**Proposta**

- Registrar a classificação humana e a justificativa mínima conforme política aprovada.
- Permitir que falsos positivos sejam consultados em relatórios restritos para avaliar a qualidade das regras.
- Não alterar a lista ativa automaticamente a partir de uma única revisão.
- Fazer mudanças nas regras por processo controlado, com responsável, justificativa, revisão, testes, versão e data de vigência.
- Preservar a versão aplicada a cada ocorrência, para que uma alteração futura não reescreva o histórico.

Os indicadores, limiares aceitáveis e periodicidade de revisão precisam de aprovação. Não estabelecer meta numérica de precisão ou taxa de falsos positivos sem dados e validação.

## 11. Tratamento de alertas e investigação

O RF-015 exige alertas visíveis ao TI. A fila e o fluxo operacional pertencem à Issue #123, mas a política deve fornecer os parâmetros necessários.

| Elemento | Definição necessária | Estado |
|---|---|---|
| Destinatários e papéis habilitados | Quem pode receber e revisar alertas | Pendente — Q-008 / Q-009 |
| Canal do alerta | Dentro do aplicativo ou outro canal aprovado | Pendente — Q-008 |
| Severidade | Critérios objetivos e significado de cada nível | Pendente — Q-008 |
| Prazo de triagem | Tempo máximo para primeira análise | Pendente — Q-008 |
| Responsável pela investigação | Papel/equipe responsável e substituição | Pendente — Q-008 |
| Encerramento | Estados finais, justificativa e registro exigido | Pendente — Q-008 |
| Escalonamento | Como tratar ocorrência urgente ou sem responsável | Pendente — Q-008 |
| Acesso ao conteúdo | Como o revisor autorizado abre a mensagem e conversa | Depende da Issue #121 e da Q-009 |
| Retenção | Prazo de ocorrência, decisão e evidências | Depende da Issue #102 e da Q-010 |

A notificação não deve conter conteúdo integral da mensagem por padrão. O revisor deve acessar o conteúdo somente após autenticação e autorização conforme a política aprovada.

## 12. Privacidade, segurança e auditoria

A ativação da detecção depende de aprovação institucional sobre finalidade, transparência, acesso e retenção.

### 12.1 Salvaguardas propostas

- Restringir o acesso aos resultados aos papéis e operadores autorizados.
- Registrar criação, consulta, revisão, classificação e encerramento de ocorrências conforme a política de auditoria.
- Proteger registros contra alteração indevida e restringir sua exclusão.
- Separar a autorização para ver um alerta da autorização para consultar a conversa original.
- Minimizar conteúdo exibido e armazenado na fila.
- Definir retenção distinta para mensagens, ocorrências, logs e evidências, quando necessário.
- Avaliar acesso privilegiado e revisar permissões periodicamente.

### 12.2 Relação com criptografia

A ADR-010 registra um trade-off arquitetural: análise de conteúdo no servidor e consulta administrativa de mensagens não são compatíveis, por si só, com a promessa de E2EE estrita quando o servidor não possui acesso ao conteúdo em claro.

Este documento não decide o modelo criptográfico. Não declarar nem anunciar E2EE enquanto a arquitetura e a governança não tiverem sido definidas e aprovadas.

### 12.3 Limites de finalidade

A detecção não deve ser usada automaticamente para:

- bloquear ou apagar mensagens;
- suspender ou desativar contas;
- aplicar advertências ou sanções;
- criar ranking de funcionários;
- inferir intenção ou culpa a partir de uma palavra isolada;
- ampliar monitoramento para finalidades não aprovadas.

Qualquer mudança nessas regras exige requisito, justificativa, avaliação de impacto e aprovação formal antes da implementação.

## 13. Cenários de teste e evidências

Os casos abaixo são cenários de especificação. A lista definitiva e os resultados esperados dependem das categorias e termos aprovados. Testes devem usar mensagens sintéticas ou conjuntos de teste aprovados, sem expor conversas reais desnecessariamente.

| ID | Cenário | Resultado esperado |
|---|---|---|
| DET-01 | Mensagem sem correspondência com regra ativa | Nenhuma ocorrência é criada |
| DET-02 | Mensagem contém termo explicitamente aprovado em contexto de correspondência | Ocorrência criada com categoria, regra e versão |
| DET-03 | Variação de caixa/acentuação aprovada | Resultado consistente com a normalização definida |
| DET-04 | Termo parecido, mas fora dos limites de palavra aprovados | Não sinalizar indevidamente |
| DET-05 | Palavra que pode ser legítima dependendo do contexto | Seguir regra aprovada; permitir classificação de falso positivo |
| DET-06 | Mensagem citando ou discutindo um termo monitorado em contexto legítimo | Resultado conforme exemplos de inclusão/exclusão aprovados |
| DET-07 | Duas ou mais regras correspondem à mesma mensagem | Registrar todas as regras relevantes sem duplicidade indevida de ocorrência |
| DET-08 | Regra/lista tem nova versão | Novas mensagens usam a versão ativa; ocorrências antigas preservam a versão original |
| DET-09 | Revisor classifica ocorrência como falso positivo | Resultado e revisor ficam registrados; regra não muda automaticamente |
| DET-10 | Usuário comum tenta acessar fila ou ocorrência administrativa | Acesso negado server-side |
| DET-11 | Operador tenta abrir a conversa sem autorização aplicável | Acesso negado; alerta não concede permissão |
| DET-12 | Notificação de alerta é gerada | Mostra metadados mínimos e não replica a mensagem integral por padrão |
| DET-13 | Detector fica indisponível ou retorna erro | Não registrar falsamente como análise limpa; tratamento segue política aprovada |
| DET-14 | Auditoria da revisão é inspecionada | Ações, ator, momento e resultado estão rastreáveis conforme política aprovada |

### 13.1 Conjunto de teste

Antes do aceite, o time deve montar um conjunto controlado com:

- exemplos positivos para cada categoria e regra aprovada;
- exemplos negativos de palavras semelhantes que não devem corresponder;
- exemplos ambíguos para revisão humana;
- variações de caixa, acentuação, Unicode e pontuação, se aplicáveis;
- exemplos de citações, mensagens técnicas e URLs, quando relevantes;
- versões de teste identificadas e aprovadas.

A seleção dos exemplos não deve incluir dados pessoais ou mensagens reais de funcionários sem autorização e necessidade demonstradas.

### 13.2 Evidências de qualidade

A equipe deve registrar:

- versão do conjunto de teste e das regras;
- cenários executados e resultados;
- ocorrências indevidas e falsos negativos identificados;
- revisão dos falsos positivos;
- limitações conhecidas;
- aprovação funcional e de Segurança;
- resultados de CI e revisão por PR.

Não afirmar que o detector é preciso ou confiável apenas porque os testes unitários passaram; a avaliação depende de conjunto representativo e critérios previamente aprovados.

## 14. Decisões pendentes e responsáveis sugeridos

| ID | Decisão | Responsável sugerido | Impacto |
|---|---|---|---|
| D-122-01 | Aprovar finalidade, transparência e escopo do monitoramento | Representante da FORD / Jurídico / Privacidade / Segurança | ADR-010, RNF-011 |
| D-122-02 | Definir categorias de conteúdo que serão analisadas | FORD / Segurança | Q-007, RF-014 |
| D-122-03 | Fornecer e aprovar a lista de palavrões/termos e suas variações | FORD / Segurança | CA-014.2 |
| D-122-04 | Definir se o MVP usará lista determinística, expressões ou análise contextual | Segurança / Tech Lead / FORD | Q-007 |
| D-122-05 | Definir normalização e tratamento de contexto, citações e falsos positivos | Segurança / Tech Lead / Produto | RF-014, Issue #122 |
| D-122-06 | Definir limiares ou regras de classificação, se necessários | FORD / Segurança / Tech Lead | Q-007 |
| D-122-07 | Definir destinatários, canal, severidade e prazo de alerta | TI / FORD | Q-008, RF-015, Issue #123 |
| D-122-08 | Definir responsáveis, procedimento de investigação e encerramento | TI / FORD | Q-008, Issue #123 |
| D-122-09 | Definir dados de contexto exibidos e retidos | TI / Segurança / Jurídico / Privacidade | Q-009, Q-010, Issue #102 |
| D-122-10 | Aprovar comportamento diante de indisponibilidade do detector | TI / Segurança / Tech Lead | Issue #122 |
| D-122-11 | Aprovar auditoria e acesso às mensagens durante a investigação | TI / Segurança / Jurídico / Privacidade | Issues #121 e #124 |
| D-122-12 | Definir critérios de qualidade e revisão periódica das regras | FORD / Segurança / PO | Issue #122 |

## 15. Critérios de aceite da Issue #122 — rastreabilidade

Os critérios originais da Issue #122 são preservados. Esta tabela especifica as evidências esperadas e não declara nenhum critério concluído.

| Critério original | Evidência esperada | Situação na versão 0.1 |
|---|---|---|
| Mensagens sinalizadas com contexto mínimo; falsos positivos revisáveis | Registro com regra/versão e contexto mínimo aprovado; fluxo de revisão e classificação de falsos positivos | Parcial: modelo e cenários documentados; política e fluxo precisam de aprovação |
| Testes relevantes automatizados ou evidência documentada | Execução dos cenários DET-01 a DET-14 com conjunto de teste aprovado | Pendente: cenários propostos; não há evidência de execução |
| Revisão por PR concluída | Revisão técnica, funcional, segurança e aprovação da PR | Pendente |
| Sem regressão nos fluxos relacionados | CI e testes dos fluxos de envio, alertas, autorização e auditoria aplicáveis | Pendente |

## 16. Dependências e impactos

| Issue / artefato | Relação com este documento |
|---|---|
| #86 — Segurança, monitoramento e auditoria | Épica que reúne controles de detecção, consulta, alertas e auditoria |
| ADR-010 — Segurança, auditoria e monitoramento | Referência arquitetural e de governança; permanece Proposed |
| #102 — Estratégia de auditoria e retenção | Define retenção e salvaguardas dos registros e ocorrências |
| #121 — Consulta administrativa de mensagens | Implementa o acesso autorizado ao conteúdo durante a investigação |
| #123 — Alertas e fila de revisão TI | Implementa apresentação, estado e tratamento das ocorrências |
| #124 — Trilha de auditoria de ações privilegiadas | Registra operações administrativas e eventos de investigação conforme política |
| #117 — Limites, retenção e proteção antimalware | Trata arquivos anexados; não se confunde com detecção de conteúdo textual |
| #100 e #101 — Matriz de autorização e RLS | Fundamentam o controle de acesso a recursos e dados |

## 17. Condições para evolução deste documento

A versão 0.1 pode orientar refinamento, discussão e preparação dos testes. Ela não autoriza:

- ativar monitoramento em produção antes das aprovações necessárias;
- inventar ou ativar uma lista de termos não aprovada;
- aplicar limiares ou severidades sem definição;
- bloquear mensagens, punir usuários ou desativar contas automaticamente;
- disponibilizar conteúdo de conversa a partir de um alerta sem autorização própria;
- enviar mensagens a serviços externos ou modelos de IA sem avaliação e aprovação;
- manter conteúdo ou ocorrências por prazo indefinido;
- declarar a Issue #122 concluída.

A versão 0.2 deverá incorporar decisões formalmente aprovadas para D-122-01 a D-122-12, incluindo a lista de regras e exemplos positivos/negativos. Uma versão posterior deverá incorporar evidências de implementação, resultados de teste, revisão de falsos positivos e homologação.

## 18. Histórico de versões

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/11/2026 | Consolida requisitos existentes, propõe modelo de detecção e revisão, registra cenários de teste, dependências e decisões pendentes. Não representa política aprovada nem evidência de implementação. |
