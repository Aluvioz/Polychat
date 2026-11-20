# Política de detecção e classificação de conteúdo suspeito

- **Documento:** POLY-SEC-002
- **Versão:** 0.3 — reconciliada com a FORD v2
- **Data:** 19/11/2026
- **Status:** requisitos funcionais e operacionais alinhados à FORD v2; implementação funcional ainda não iniciada; permanecem pendentes configuração inicial da lista pelo TI, detalhamento técnico e evidências de teste
- **Issue principal:** [#122 — Implementar detecção de conteúdo suspeito e palavrões](https://github.com/Aluvioz/Polychat/issues/122)
- **Épica:** [#86 — Segurança, monitoramento e auditoria](https://github.com/Aluvioz/Polychat/issues/86)
- **ADR relacionada:** [ADR-010 — Segurança, auditoria e monitoramento](../adr/ADR-010-seguranca-auditoria-monitoramento.md)

> **Aviso de status:** este documento registra o comportamento de produto definido pela FORD v2. A lista concreta de termos é mantida/configurada pelo TI na operação; sua configuração e versionamento ainda dependem da implementação. Esta especificação não autoriza análise contextual, IA de terceiros, bloqueio automático ou medidas disciplinares.

---

## 1. Objetivo

Registrar o comportamento funcional definido pela FORD para detectar mensagens por regras e lista de termos administrada pelo TI, incluindo palavrões, e gerar alertas para revisão na fila administrativa.

A política deve permitir que mensagens que atendam a regras aprovadas sejam sinalizadas para revisão, com contexto mínimo e rastreabilidade suficiente para compreender o motivo da sinalização. Também deve permitir que falsos positivos sejam identificados, revisados e utilizados para melhorar as regras de forma controlada.

O propósito desta funcionalidade é apoiar a segurança e a investigação autorizada. A sinalização automática não constitui, por si só, comprovação de violação, intenção indevida ou conduta irregular do remetente.

## 2. Escopo

Este documento trata de:

- regras/lista de termos administrada pelo TI, incluindo palavrões;
- regras de detecção e classificação;
- detecção por correspondência com os termos/regras cadastrados pelo TI;
- contexto mínimo associado a uma sinalização;
- revisão de falsos positivos;
- comportamento quando a análise falhar;
- metadados, versionamento e rastreabilidade das regras;
- relação entre detecção, alerta e investigação;
- critérios de teste e evidências;
- evidências técnicas e testes necessários para concluir a implementação da Issue #122.

### 2.1 Fora do escopo

Este documento não define nem substitui:

- a implementação física da auditoria e retenção (Issues #102 e #124), cujas regras de produto já estão consolidadas na baseline;
- a consulta administrativa de mensagens e conversas, tratada na Issue #121;
- a interface, fila e fluxo operacional de alertas da Issue #123;
- a trilha de auditoria de ações privilegiadas da Issue #124;
- a análise antimalware de arquivos anexados, tratada na Issue #117;
- uma política disciplinar ou de punição de funcionários;
- bloqueio automático de mensagens ou contas;
- a adoção de IA, análise contextual ou serviços de terceiros para análise de conteúdo, que não fazem parte do escopo aprovado;
- uma decisão de criptografia ponta a ponta (E2EE).

## 3. Fontes e rastreabilidade

| Fonte | O que estabelece | Limite |
|---|---|---|
| RF-014 — Detectar mensagens suspeitas por regras | Verificar mensagens conforme lista/regras mantidas pelo TI, incluindo palavrões; sem análise contextual ou IA externa | Requisito confirmado; implementação e configuração inicial da lista pendentes |
| CA-014.1 | A detecção deve aplicar as regras/lista vigentes mantidas pelo TI | Requisito confirmado; teste de integração pendente |
| CA-014.2 | Palavrões fazem parte do conjunto monitorado por meio da lista mantida pelo TI | Requisito confirmado; configuração concreta da lista é operacional do TI |
| CA-014.3 | Ocorrência deve registrar o motivo/regra correspondente e os dados necessários à auditoria | Regra funcional confirmada; implementação dos registros pendente (#102/#124) |
| CA-014.4 | Não aplicar bloqueio ou punição automática antes de definição expressa | Qualquer mudança exige decisão específica e rastreável |
| RF-015 — Alertar o TI | Mensagens sinalizadas geram alerta na fila administrativa do console TI | Canal e comportamento definidos; implementação pendente (#123) |
| CA-015.1 a CA-015.3 | Alerta deve identificar a ocorrência, mensagem/conversa, momento, motivo e severidade; TI revisa e pode encerrar sem justificativa obrigatória | Requisito confirmado; UI e fluxo técnico pendentes |
| RN-012 — Análise de conteúdo | Detecção por regras/lista de termos mantida pelo TI, incluindo palavrões; sem análise contextual ou IA de terceiros | Confirmado pela FORD v2 |
| RN-013 — Alerta ao TI | Fila administrativa; alta até 1 hora, média até 1 dia útil e baixa até 3 dias úteis; TI pode encerrar sem justificativa obrigatória | Confirmado pela FORD v2 |
| RNF-011 — Privacidade e governança | Aviso no primeiro acesso, acesso e retenção conforme baseline; posicionamento da FORD registrado sem dispensar obrigações legais | Requisitos consolidados; implementação/evidência pendente |
| Q-007 — Detecção de mensagens suspeitas | Respondida: regras/lista de termos mantida pelo TI, incluindo palavrões; sem análise contextual/IA de terceiros | Resolvida pela FORD v2 |
| Q-008 — Resposta a alertas | Respondida: fila TI; alta imediata/até 1h, média até 1 dia útil, baixa até 3 dias úteis; encerramento sem justificativa obrigatória | Resolvida pela FORD v2 |
| Q-009 e Q-010 | Regras de consulta, auditoria e retenção foram consolidadas na FORD v2 e alinhadas com Desenvolvimento | Resolvidas no nível de requisito; implementação/auditoria técnica permanece pendente |
| ADR-010 | Define a decisão de segurança/monitoramento; status Proposed para revisão técnica/arquitetural, não por ausência de resposta às Q-007 a Q-010 | Detalhamento e implementação técnicos pendentes |

As fontes são mantidas sem promover recomendações a requisitos confirmados. O documento não amplia o escopo funcional para punição automática, bloqueio de mensagens ou vigilância fora das finalidades aprovadas.

## 4. Classificação das informações

São usadas três classificações:

- **Confirmado:** consta expressamente dos requisitos ou regras de negócio vigentes.
- **Proposta:** recomendação de produto ou técnica para avaliação. Não é uma decisão final.
- **Pendente:** depende de implementação, configuração operacional ou evidência técnica ainda não concluída. Não reclassificar requisito respondido como pergunta aberta.

Esta especificação define o comportamento de produto, mas não comprova implementação. A implementação funcional do Polychat ainda não começou; detecção, alertas e auditoria permanecem por desenvolver.

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

**Regra de produto confirmada; operação sob responsabilidade do TI**

A análise deve respeitar a finalidade de segurança e o aviso de monitoramento no primeiro acesso já definidos pela FORD. Não ampliar o monitoramento para produtividade, avaliação de desempenho ou finalidades diferentes. As obrigações legais aplicáveis permanecem válidas, independentemente do posicionamento operacional informado pelo cliente.

A análise deve limitar-se às regras/lista de termos mantida pelo TI, incluindo palavrões. Não ampliar o monitoramento para produtividade, avaliação de desempenho ou categorias adicionais não previstas na baseline.

### 5.3 Acesso restrito

**Proposta**

- O resultado da detecção deve ser acessível somente a perfis e operadores autorizados conforme a matriz de autorização e a política institucional.
- Usuários comuns não devem visualizar a fila administrativa, metadados internos da regra ou investigações de outras pessoas.
- A visualização do conteúdo da mensagem deve seguir as regras de consulta administrativa aprovadas e implementadas; o alerta não deve conceder acesso indireto ao conteúdo.
- A consulta ao conteúdo para investigação deve observar a Issue #121 e gerar os eventos de auditoria definidos para a Issue #124.

## 6. Escopo de detecção

A detecção inicial utiliza regras e lista de termos administrada pelo TI, incluindo palavrões. Não há análise contextual, classificação semântica, IA de terceiros ou categorias adicionais implícitas. O conteúdo concreto da lista é uma configuração operacional sob responsabilidade do TI; sua existência/configuração no ambiente dependerá da implementação.

A inclusão de uma categoria deve especificar exemplos de correspondência e não correspondência, limites, justificativa e risco de falsos positivos. Categorias não aprovadas não devem ser ativadas por inferência da equipe técnica.

## 7. Estratégia de detecção

### 7.1 Abordagem definida

A estratégia de produto é determinística: aplicar regras e lista de termos administrada pelo TI. A implementação pode utilizar comparação literal/padrões simples e versionados, mas não deve introduzir análise contextual, modelo probabilístico ou IA externa. Escolhas de biblioteca e implementação permanecem técnicas, sem alterar a regra de negócio.

### 7.2 Regras e normalização

Na implementação da lista, a equipe técnica deve avaliar:

- comparação sem distinção de maiúsculas/minúsculas;
- normalização Unicode e variações de codificação;
- tratamento de acentuação e caracteres visualmente semelhantes;
- limites de palavra para evitar correspondência dentro de termos não relacionados;
- expressões compostas e variações ortográficas aprovadas;
- mensagens com URLs, código, citações ou conteúdo técnico, quando isso puder alterar o contexto;
- proteção contra regras excessivamente amplas que gerem muitos falsos positivos.

A normalização não deve remover sinais ou transformar o texto de modo que altere o sentido sem análise. O texto original da mensagem deve permanecer preservado conforme a política de armazenamento; o mecanismo de comparação deve operar sem modificar o conteúdo enviado.

### 7.3 Contexto e análise contextual

A análise contextual não faz parte do escopo aprovado e não deve ser implementada. Não enviar conteúdo de mensagens a serviços adicionais, modelos externos ou IA. Supabase e Vercel permanecem as plataformas oficiais do projeto; a restrição se aplica a serviços adicionais não aprovados.

### 7.4 Limiares e pontuação

Não foi definida pontuação numérica de risco para mensagens. As severidades baixa, média e alta referem-se ao alerta administrativo e devem seguir os critérios operacionais da FORD; não devem ser confundidas com uma nota probabilística do conteúdo.

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

**Regra de implementação**

A detecção funciona como sinalização e registro, sem atuar como mecanismo de moderação impeditiva. A indisponibilidade do detector não pode ser apresentada como resultado limpo, nem justificar bloqueio automático da mensagem. O fluxo técnico deve registrar falha/pendência e permitir tratamento operacional seguro, preservando o envio de texto conforme as regras de produto. A estratégia concreta de retentativa/recuperação é detalhe técnico a especificar e testar, não uma pergunta de produto.

## 9. Registro da ocorrência e contexto mínimo

O critério da Issue #122 exige contexto mínimo. A finalidade é permitir revisão sem duplicar desnecessariamente o conteúdo da conversa em alertas ou logs.

### 9.1 Metadados candidatos

**Diretriz de implementação, sem alterar os requisitos confirmados**

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

Os campos físicos e a implementação dependem do modelo de dados e da Issue #102. Os requisitos de auditoria e retenção já estão consolidados na baseline v0.4; não são pendências de Q-009/Q-010.

### 9.2 Minimização de conteúdo

**Proposta**

- Não copiar a mensagem completa para notificações, e-mails ou logs técnicos por padrão.
- Usar referência à mensagem e à conversa; a visualização do conteúdo deve ocorrer somente por fluxo autorizado.
- Caso um trecho seja necessário para triagem, limitar o tamanho e a extensão ao mínimo aprovado, evitando conteúdo de mensagens anteriores não relacionadas.
- Não armazenar tokens, credenciais ou dados técnicos sensíveis junto ao evento.
- Registrar motivo e regra correspondente para que o revisor saiba por que a mensagem foi sinalizada.

A consulta ao conteúdo pelo TI segue a regra já definida: qualquer administrador TI pode consultar qualquer conversa a qualquer momento, sem justificativa ou segunda aprovação. O alerta não cria autorização nova nem restringe esse acesso; a consulta e a revisão devem gerar os registros de auditoria previstos.

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

- Permitir que TI revise e encerre o alerta sem exigir justificativa. O sistema pode registrar operador, horário e estado para fins de auditoria.
- Permitir que falsos positivos sejam consultados em relatórios restritos para avaliar a qualidade das regras.
- Não alterar a lista ativa automaticamente a partir de uma única revisão.
- Fazer mudanças nas regras por processo controlado, com responsável, justificativa, revisão, testes, versão e data de vigência.
- Preservar a versão aplicada a cada ocorrência, para que uma alteração futura não reescreva o histórico.

Os indicadores, limiares aceitáveis e periodicidade de revisão precisam de aprovação. Não estabelecer meta numérica de precisão ou taxa de falsos positivos sem dados e validação.

## 11. Tratamento de alertas e investigação

O RF-015 exige alertas visíveis ao TI. A fila e o fluxo operacional pertencem à Issue #123, mas a política deve fornecer os parâmetros necessários.

| Elemento | Regra definida | Estado |
|---|---|---|
| Destinatário | Equipe de TI, por fila administrativa no console | Confirmado |
| Canal | Fila de alertas do console TI | Confirmado; UI ainda não implementada |
| Severidade | Baixa, média e alta | Confirmado |
| Prazo de resposta | Alta: imediatamente e até 1 hora; média: até 1 dia útil; baixa: até 3 dias úteis | Confirmado |
| Revisão/encerramento | TI revisa e pode encerrar sem justificativa obrigatória | Confirmado |
| Consulta da conversa | TI pode consultar qualquer conversa a qualquer momento, sem justificativa ou segunda aprovação; consulta é auditada | Confirmado |
| Retenção/auditoria | Conforme regras da baseline v0.4 e Issue #102 | Requisito confirmado; implementação pendente |

A notificação não deve conter conteúdo integral da mensagem por padrão. O revisor deve acessar o conteúdo somente após autenticação e autorização conforme a política aprovada.

## 12. Privacidade, segurança e auditoria

A operação deve apresentar o aviso de monitoramento no primeiro acesso (RF-023) e respeitar os controles de acesso e retenção definidos pela FORD. A implementação desses controles e sua evidência permanecem pendentes.

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

## 13.3 Decisões de produto consolidadas — FORD v2

As regras abaixo são requisitos confirmados, não propostas aguardando nova aprovação:

1. **Finalidade:** analisar mensagens com regras/lista de termos mantida pelo TI, incluindo palavrões, para sinalização e revisão de segurança. Não usar para avaliação de produtividade ou finalidades distintas.
2. **Escopo:** lista/regras de termos administradas pelo TI. A configuração concreta dos primeiros termos é atividade operacional de TI; não ampliar por inferência para análise contextual, IA, ameaças ou outras categorias.
3. **Resultado automático:** quando uma regra ativa corresponder, registrar ocorrência com motivo, identificador/versão da regra e gerar alerta na fila do console TI. A ocorrência é sinalização, não confirmação de violação.
4. **Revisão humana:** TI revisa e pode encerrar o alerta sem justificativa obrigatória. Registrar operador, momento e estado para auditoria.
5. **Sem punição/bloqueio automático:** a detecção não bloqueia mensagens, não edita/apaga conteúdo, não suspende contas e não aplica sanções.
6. **Acesso:** o alerta é visível ao TI. TI pode consultar qualquer conversa a qualquer momento, sem justificativa ou segunda aprovação; essa consulta gera auditoria.
7. **Minimização:** alertas e logs usam referência segura e metadados mínimos; não replicar mensagem integral em notificações/logs por padrão.
8. **Plataformas:** Supabase e Vercel são as plataformas oficiais do Polychat. Não encaminhar conteúdo a IA, modelo, scanner SaaS ou serviço adicional não aprovado. O antimalware de anexos é scanner interno da FORD.

### Trabalho técnico/operacional ainda necessário

A implementação funcional do Polychat ainda não começou. Permanecem como trabalho a implementar e evidenciar:

- configurar e versionar a lista inicial de termos sob responsabilidade do TI;
- implementar comparação determinística, normalização e testes positivos/negativos, sem análise contextual;
- implementar fila de alertas TI com severidades baixa/média/alta e prazos: alta imediatamente/até 1 hora; média até 1 dia útil; baixa até 3 dias úteis;
- implementar revisão/encerramento sem justificativa obrigatória;
- persistir ocorrência e eventos de auditoria conforme baseline v0.4;
- definir tecnicamente o tratamento de indisponibilidade do detector, sem apresentar falha como resultado limpo nem bloquear automaticamente o envio;
- implementar, integrar e testar os fluxos no runtime real das plataformas oficiais.

A FORD já definiu finalidade, acesso administrativo, auditoria e retenção. O posicionamento institucional sobre ausência de frente de Jurídico/Privacidade não afasta obrigações legais aplicáveis, mas não cria uma etapa de aprovação por uma equipe que o cliente informou não integrar ao projeto.

**Resultado:** requisitos funcionais e operacionais alinhados à FORD v2. A Issue #122 permanece aberta porque a implementação, a integração, os testes e as evidências ainda não começaram.

---

## 14. Atividades de implementação e responsáveis

| ID | Atividade | Responsável | Referência/resultado esperado |
|---|---|---|---|
| D-122-01 | Exibir aviso de monitoramento no primeiro acesso | Desenvolvimento / TI | RF-023 |
| D-122-02 | Implementar detecção determinística por lista/regras mantidas pelo TI, incluindo palavrões | Desenvolvimento / TI | RF-014; Q-007 resolvida |
| D-122-03 | Configurar a lista inicial e mecanismo de manutenção/versionamento pelo TI | TI / Desenvolvimento | RF-014 |
| D-122-04 | Implementar processamento sem análise contextual ou IA de terceiros | Desenvolvimento / Tech Lead | RF-014 |
| D-122-05 | Implementar normalização e casos positivos/negativos sem análise contextual | Desenvolvimento / SQA | Testes DET |
| D-122-06 | Registrar a regra correspondente e classificar o alerta conforme severidades já definidas em RN-013 | Desenvolvimento / TI | RF-014/RF-015 |
| D-122-07 | Implementar fila TI e prazos baixa/média/alta | Desenvolvimento / TI | RF-015; Q-008 resolvida |
| D-122-08 | Implementar revisão/encerramento por TI sem justificativa obrigatória e auditar ações | Desenvolvimento / TI | #123/#124 |
| D-122-09 | Persistir metadados mínimos da ocorrência e aplicar auditoria/retenção da baseline v0.4 | Desenvolvimento / TI | #102; Q-009/Q-010 resolvidas |
| D-122-10 | Definir e testar contingência técnica do detector sem bloqueio automático | Desenvolvimento / TI / Tech Lead | Testes DET |
| D-122-11 | Integrar consulta ao conteúdo e registro de auditoria conforme regras existentes | Desenvolvimento / TI | #121/#124 |
| D-122-12 | Definir métricas técnicas e procedimento de manutenção/versionamento da lista | TI / Desenvolvimento / SQA | Issue #122 |

---

## 15. Critérios de aceite da Issue #122 — rastreabilidade

Os critérios originais da Issue #122 são preservados. Esta tabela especifica as evidências esperadas e não declara nenhum critério concluído. A implementação funcional ainda não começou.

| Critério original | Evidência esperada | Situação na versão 0.3 |
|---|---|---|
| Mensagens sinalizadas com contexto mínimo; falsos positivos revisáveis | Registro com regra/versão e contexto mínimo; fluxo de revisão pelo TI e classificação de falsos positivos | Requisitos definidos; implementação e testes ainda não começaram |
| Testes relevantes automatizados ou evidência documentada | Execução dos cenários DET-01 a DET-14 com conjunto de teste aprovado | Pendente: cenários propostos; não há evidência de execução |
| Revisão por PR concluída | Revisão técnica, funcional e SQA, com participação de TI como responsável operacional por segurança | Pendente |
| Sem regressão nos fluxos relacionados | CI e testes dos fluxos de envio, alertas, autorização e auditoria aplicáveis | Pendente |

## 16. Dependências e impactos

| Issue / artefato | Relação com este documento |
|---|---|
| #86 — Segurança, monitoramento e auditoria | Épica que reúne controles de detecção, consulta, alertas e auditoria |
| ADR-010 — Segurança, auditoria e monitoramento | Referência arquitetural para revisão técnica; permanece Proposed enquanto o detalhamento técnico estiver pendente |
| #102 — Estratégia de auditoria e retenção | Define retenção e salvaguardas dos registros e ocorrências |
| #121 — Consulta administrativa de mensagens | Implementa o acesso autorizado ao conteúdo durante a investigação |
| #123 — Alertas e fila de revisão TI | Implementa apresentação, estado e tratamento das ocorrências |
| #124 — Trilha de auditoria de ações privilegiadas | Registra operações administrativas e eventos de investigação conforme política |
| #117 — Limites, retenção e proteção antimalware | Trata arquivos anexados; não se confunde com detecção de conteúdo textual |
| #100 e #101 — Matriz de autorização e RLS | Fundamentam o controle de acesso a recursos e dados |

## 17. Critérios para implementação e ativação

A especificação funcional está alinhada à FORD v2. Antes de considerar a Issue #122 concluída ou ativar o mecanismo no ambiente de produção, devem existir evidências de que:

- a lista inicial de termos, incluindo palavrões, foi configurada pelo TI e possui controle de versão/manutenção;
- a implementação aplica regras determinísticas, sem análise contextual ou IA de terceiros;
- os testes cobrem correspondências positivas, negativas, variações e falsos positivos, sem alterar o conteúdo original da mensagem;
- a ocorrência registra a regra/motivo e os metadados necessários;
- a fila TI apresenta severidade baixa/média/alta e os prazos de resposta definidos na RN-013;
- TI consegue revisar e encerrar alertas sem justificativa obrigatória, com trilha de auditoria;
- nenhuma mensagem é bloqueada ou punida automaticamente pela detecção;
- falhas do detector são registradas e tratadas tecnicamente sem serem apresentadas como resultado limpo nem provocar bloqueio automático de mensagens;
- o fluxo está integrado ao runtime real da stack oficial Supabase/Vercel e passa por revisão técnica/SQA.

Esses critérios são evidências de implementação e qualidade, não decisões de negócio ainda pendentes. Q-007 a Q-010 estão resolvidas no nível de requisito.

## 18. Histórico de versões

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/11/2026 | Consolida requisitos existentes, propõe modelo de detecção e revisão, registra cenários de teste, dependências e decisões pendentes. Não representa política aprovada nem evidência de implementação. |
| 0.2 | 19/11/2026 | Registra validação inicial do PO. Foi superada pela reconciliação com FORD v2 nesta versão 0.3. |
| 0.3 | 20/11/2026 | Reconcilia regras de detecção, lista TI, palavrões, ausência de análise contextual/IA, fila TI, severidades/prazos, encerramento sem justificativa e critérios de implementação com a FORD v2; registra que a implementação funcional ainda não começou. |
