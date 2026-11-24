# Issue #94 — Kit de registro para sessões e achados (MODELOS EM BRANCO)

**Estado:** somente formulários e roteiro de apoio. **Nenhuma sessão, observação ou achado real foi registrado neste arquivo.**  
**Referência metodológica aprovada:** PR #152, plano de validação UX v0.3 integrado à `main`. A [proposta de uso complementar clicável](./issue-94-decisao-metodologica-proposta.md) permanece sem decisão do PO/SQA.  
**Protótipo opcional para revisão prévia:** [navegação exploratória v0.1](./issue-94-prototipo-v01.md).

> Não utilizar este kit para iniciar recrutamento ou coletar dados sem autorização institucional e responsável definidos. Guardar registros brutos no local autorizado pela FORD, não automaticamente no GitHub. Publicar somente sínteses anonimizadas e aprovadas.

## 0. Gate obrigatório — preencher antes de qualquer convite

| Condição | Registro institucional/documento de referência | Situação |
|---|---|---|
| Autorização formal de recrutamento e sessões pela FORD | A definir formalmente | PENDENTE |
| Responsável por recrutamento | A definir | PENDENTE |
| Facilitador e observador | A definir | PENDENTE |
| Responsável pela custódia dos registros | A definir | PENDENTE |
| Local/ferramenta aprovado para armazenamento | A definir | PENDENTE |
| Perfis autorizados a acessar evidências | A definir | PENDENTE |
| Prazo/critério de retenção | A definir | PENDENTE |
| Texto de consentimento e política de gravação | A definir | PENDENTE |
| Versão do roteiro e protótipo congelada | A definir | PENDENTE |
| Decisão escrita PO/SQA sobre usar o protótipo clicável apenas como complemento aos wireframes estáticos | [Proposta pendente](./issue-94-decisao-metodologica-proposta.md); a baseline atual é a pesquisa estática da PR #152 | PENDENTE |

**Se houver qualquer pendência, não recrutar nem executar sessão.** O escopo e a amostra foram validados pelo PO, mas isso não substitui estas condições.

## 1. Abertura neutra sugerida (rascunho, requer aprovação)

> Estamos avaliando a clareza das telas e dos textos de um protótipo de comunicação interna, não seu desempenho. As telas usam dados fictícios e nenhuma operação é real. Gostaríamos que você explicasse o que espera encontrar ao tentar realizar algumas tarefas. Você pode interromper a qualquer momento. A forma de registro, armazenamento e uso das observações será explicada segundo as regras aprovadas antes de começarmos. Não digite credenciais reais, nem compartilhe informações confidenciais.

**Nota:** este texto é um rascunho de abertura e **não substitui o termo institucional de consentimento**. Gravação somente com autorização separada; sem autorização, usar anotações permitidas e anonimizadas.

## 2. Modelo de ficha individual — COPIAR APÓS AUTORIZAÇÃO

| Campo | Valor |
|---|---|
| Código anônimo | P-U__ ou P-TI__ |
| Perfil | P-U / P-TI |
| Sessão | Pré-teste / sessão regular |
| Data e horário | Pendente |
| Local e modalidade autorizados | Pendente |
| Versão do protótipo / commit / URL usada | Pendente |
| Versão do roteiro da PR #152 | Pendente |
| Navegador e versão / dispositivo | Pendente |
| Facilitador/observador (referência institucional, não publicar dados desnecessários) | Pendente |
| Registro/consentimento autorizado | Pendente |
| Gravação autorizada? (se aplicável) | Pendente |
| Interrupções ou desvios | Pendente |

**Uma linha por tarefa executada:**

| ID tarefa | Resultado (sem ajuda/com ajuda/não concluída/N/A) | Ação/erro observável | Hesitação e ajuda | Feedback compreendido? | Facilidade 1–7 | Evidência autorizada |
|---|---|---|---|---|---|---|
| U-01 ou T-01 | NÃO EXECUTADA | — | — | — | — | — |

Códigos do plano: U-01 a U-08 e T-01 a T-06. As perguntas devem ser neutras e por tarefa, sem induzir "o botão correto". Tempo, quando anotado, é exploratório e não métrica de aceite funcional.

## 3. Modelo de registro de achados — somente quando existirem

| Campo | Preenchimento esperado |
|---|---|
| ID | UX-94-001 |
| Sessão e perfil anonimizados | P-U__ ou P-TI__ |
| Versão do protótipo / roteiro | Preencher com versões reais |
| ID da tarefa | U-__ / T-__ |
| Evidência factual | O que a pessoa de fato fez ou disse |
| Expectativa declarada | O que esperava que acontecesse |
| Interpretação separada da observação | Hipótese do pesquisador |
| Impacto para a tarefa | Bloqueio, dúvida, retrabalho, risco percebido |
| Severidade | S1 crítico, S2 alto, S3 médio, S4 baixo |
| Prioridade | Imediata, alta, planejada, aguardando decisão |
| Rastreabilidade | Issue, RF, RN ou critério aplicável |
| Recomendação | Proposta, sem inventar nova política |
| Responsável/decisão | A preencher após triagem |
| Estado e versão após ajuste | Pendente até alteração real |
| Evidência de reavaliação | Pendente até novo teste real |

**S1:** escalonar imediatamente ao PO, SQA e liderança técnica; indício de segurança exige avaliação técnica própria. **S2:** forte bloqueio de tarefa. **S3:** dúvida ou retrabalho recuperável. **S4:** ajuste menor de clareza/consistência. Frequência entre participantes não representa taxa populacional.

## 4. Síntese de rodada — NÃO PREENCHIDA

| Elemento | P-U mobile | P-TI desktop |
|---|---|---|
| Participantes efetivos | Não houve coleta | Não houve coleta |
| Tarefas executadas | Não houve coleta | Não houve coleta |
| Achados S1–S4 | Não registrados | Não registrados |
| Limitações e recusas | A registrar | A registrar |
| Mudanças propostas | A derivar de achados | A derivar de achados |
| Versões antes/depois | A registrar | A registrar |
| Reavaliação | Pendente | Pendente |
| Parecer PO / SQA | Pendente | Pendente |

Ao concluir uma rodada autorizada, criar uma síntese por perfil, consolidar problemas, registrar severidade e encaminhar as mudanças ao PO e SQA. Não marcar a issue #94 como aceita antes de sessões, alterações justificadas, revisão por PR e verificação de regressão.

## 5. Condições de fechamento e rastreabilidade

O encerramento da **rodada** segue a seção 12.2 do plano v0.3 da PR #152: registrar sessões efetivamente feitas e tentativas/ausências, versões e tarefas, achados e limitações, com sínteses por perfil. O encerramento da **issue #94** requer também protótipos melhorados conforme achados e pareceres formais. A rodada pode terminar sem alcançar o alvo inicial de pessoas se a indisponibilidade e seus efeitos estiverem documentados; não alegar representatividade indevida.

Separar requisitos e testes de implementação (#126/#129) da pesquisa de usabilidade. Nunca registrar êxito funcional de servidor com base em clique no protótipo.
