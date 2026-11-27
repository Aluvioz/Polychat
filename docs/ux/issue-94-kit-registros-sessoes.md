# Issue #94 — Kit de registro para sessões e achados (MODELOS EM BRANCO)

**Estado:** somente formulários e roteiro de apoio. **Nenhuma sessão, observação ou achado real foi registrado neste arquivo.**  
**Referência metodológica aprovada:** PR #152, plano de validação UX v0.3 integrado à `main`. O PO registrou em 26/11/2026 parecer favorável ao protótipo clicável como complemento opcional, mantendo os wireframes como instrumento principal. A manifestação independente do SQA sobre esse protocolo ainda está pendente; consultar a [decisão metodológica](./issue-94-decisao-metodologica-proposta.md).  
**Protótipo opcional para revisão prévia:** [navegação exploratória v0.1](./issue-94-prototipo-v01.md).

> Distinguir a simulação interna por papéis de qualquer pesquisa institucional com a FORD. O PO aceitou a simulação interna como evidência complementar limitada, com voluntariedade, consentimento, dados fictícios e controles de registro; a reavaliação independente do SQA permanece pendente. Não recrutar funcionários FORD, usar dados corporativos ou iniciar pesquisa institucional sem autorização formal específica. Guardar registros brutos somente em local autorizado e publicar apenas sínteses anonimizadas e aprovadas.

## 0. Gates por tipo de atividade

### 0.1 Simulação interna por papéis — evidência limitada

| Condição | Registro | Situação |
|---|---|---|
| Aceite do PO para simulação interna por papéis | Review da PR #164, 26/11/2026 | **REGISTRADO** |
| Manifestação independente do SQA sobre protocolo e controles | Review SQA da PR #164 | **PENDENTE** |
| Voluntários e observador designados | Definir antes da execução | PENDENTE |
| Informação sobre caráter fictício e consentimento para participação/registro | Preparar e registrar antes da execução | PENDENTE |
| Armazenamento controlado e acesso restrito às anotações | Definir antes da execução | PENDENTE |
| Versões/commits exatos dos wireframes e do protótipo | Congelar antes da execução | PENDENTE |

Esta simulação pode produzir somente evidência interna limitada sobre clareza do roteiro, neutralidade das instruções e preparação do facilitador. Não representa pesquisa com usuários reais, não substitui a amostra do plano v0.3 e não autoriza gravação por padrão. O uso do protótipo clicável como complemento deve respeitar o protocolo da decisão metodológica e a reavaliação independente do SQA.

### 0.2 Pesquisa institucional com funcionários ou dados FORD

| Condição | Registro institucional/documento de referência | Situação |
|---|---|---|
| Autorização formal de recrutamento e sessões pela FORD | A definir formalmente | PENDENTE |
| Responsável por recrutamento | A definir | PENDENTE |
| Responsável pela custódia dos registros | A definir | PENDENTE |
| Local/ferramenta aprovado para armazenamento | A definir | PENDENTE |
| Perfis autorizados a acessar evidências | A definir | PENDENTE |
| Prazo/critério de retenção | A definir | PENDENTE |
| Texto de consentimento e política de gravação | A definir | PENDENTE |
| Versão do roteiro e protótipo congelada | A definir | PENDENTE |

**Não convidar funcionários FORD nem iniciar pesquisa institucional enquanto qualquer condição deste gate estiver pendente.** O aceite do PO para a simulação interna não supre a autorização institucional da FORD.

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
| Instrumento/fase | Wireframe estático (principal) / protótipo clicável (complementar, se admitido pelo SQA) |
| Versão do protótipo / commit / URL usada | Pendente |
| Versão do wireframe e roteiro da PR #152 | Pendente |
| Ordem dos instrumentos e desvios | Pendente |
| Navegador e versão / dispositivo | Pendente |
| Facilitador/observador (referência institucional, não publicar dados desnecessários) | Pendente |
| Registro/consentimento autorizado | Pendente |
| Gravação autorizada? (se aplicável) | Pendente |
| Interrupções ou desvios | Pendente |

**Uma linha por tarefa e por instrumento/fase:**

| ID tarefa | Instrumento/fase | Resultado (sem ajuda/com ajuda/não concluída/N/A) | Ação/erro observável | Hesitação e ajuda | Feedback compreendido? | Facilidade 1–7 | Evidência autorizada |
|---|---|---|---|---|---|---|---|
| U-01 ou T-01 | Wireframe estático (principal) | NÃO EXECUTADA | — | — | — | — | — |
| U-01 ou T-01 | Protótipo clicável (complementar, se admitido) | NÃO EXECUTADA | — | — | — | — | — |

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

Ao concluir uma simulação interna autorizada nos limites definidos, criar síntese identificada como evidência interna limitada, com voluntários e consentimento documentados, sem alegar participação da FORD ou representatividade. Para pesquisa com funcionários FORD, cumprir integralmente o gate institucional. Em qualquer rodada, separar resultados por instrumento, consolidar problemas e encaminhar mudanças ao PO e SQA. Não marcar a Issue #94 como aceita antes do cumprimento de seus próprios critérios.

## 5. Condições de fechamento e rastreabilidade

O encerramento da **rodada** segue a seção 12.2 do plano v0.3 da PR #152: registrar sessões efetivamente feitas e tentativas/ausências, versões e tarefas, achados e limitações, com sínteses por perfil. O encerramento da **issue #94** requer também protótipos melhorados conforme achados e pareceres formais. A rodada pode terminar sem alcançar o alvo inicial de pessoas se a indisponibilidade e seus efeitos estiverem documentados; não alegar representatividade indevida.

Separar requisitos e testes de implementação (#126/#129) da pesquisa de usabilidade. Nunca registrar êxito funcional de servidor com base em clique no protótipo.
