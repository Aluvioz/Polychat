# 03 - Requisitos funcionais

Os requisitos abaixo foram separados por necessidade. As prioridades são preliminares. **Alta (provisória)** indica que o comportamento foi apresentado como parte central do produto, não que exista prazo ou aprovação formal.

## 3.1 Catálogo resumido

| ID | Requisito | Ator / origem | Prioridade preliminar | Estado |
|---|---|---|---|---|
| RF-001 | Autenticação por usuário e senha | Usuário; TI | Alta (provisória) | Confirmado / detalhamento derivado |
| RF-002 | Aplicar permissões conforme os dois perfis | Sistema; TI | Alta (provisória) | Confirmado / detalhamento derivado |
| RF-003 | Criar e provisionar contas | TI | Alta (provisória) | Confirmado; detalhes a validar |
| RF-004 | Desativar contas | TI | Alta (provisória) | Confirmado |
| RF-005 | Criar grupos de conversa | TI | Alta (provisória) | Confirmado |
| RF-006 | Adicionar usuários a grupos | TI | Alta (provisória) | Confirmado |
| RF-007 | Exibir conversas recentes | Usuário | Alta (provisória) | Confirmado em nível conceitual |
| RF-008 | Abrir e ler conversas | Usuário | Alta (provisória) | Derivado |
| RF-009 | Enviar mensagem individual | Usuário | Alta (provisória) | Confirmado |
| RF-010 | Enviar mensagem em grupo | Usuário participante | Alta (provisória) | Derivado; validar com cliente |
| RF-011 | Anexar arquivos PDF e JPEG | Usuário | Alta (provisória) | Confirmado; limites pendentes |
| RF-012 | Rejeitar formatos não permitidos | Sistema | Alta (provisória) | Confirmado |
| RF-013 | Não oferecer captura/gravação de mídia | Sistema | Alta (provisória) | Confirmado, com ambiguidade sobre câmera/JPEG |
| RF-014 | Analisar mensagens em busca de conteúdo suspeito | Sistema | Alta (provisória) | Intenção confirmada; regras pendentes |
| RF-015 | Alertar o TI sobre mensagens sinalizadas | Sistema; TI | Alta (provisória) | Confirmado em intenção; canal pendente |
| RF-016 | Consultar qualquer conversa como TI | TI | Alta (provisória) | Confirmado; salvaguardas pendentes |
| RF-017 | Restringir perfil Usuário a celular | Sistema | Alta (provisória) | Confirmado; critério técnico pendente |
| RF-018 | Restringir perfil TI a computador | Sistema | Alta (provisória) | Confirmado; critério técnico pendente |

## 3.2 Especificação e critérios de aceitação

### RF-001 - Autenticação por usuário e senha

**Descrição:** Autenticação por usuário e senha. **Ator/origem:** Usuário; TI. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-004; RN-009. **Estado:** Confirmado / detalhamento derivado.

**Critérios de aceitação:**

- CA-001.1 - Uma conta ativa com identificador e senha válidos consegue iniciar sessão.
- CA-001.2 - Credenciais inválidas não concedem acesso e exibem uma mensagem de falha.
- CA-001.3 - Conta desativada não consegue iniciar sessão, mesmo com senha correta.
- CA-001.4 - Após autenticação, o sistema direciona a pessoa ao ambiente correspondente ao perfil atribuído.

### RF-002 - Aplicar permissões conforme os dois perfis

**Descrição:** Aplicar permissões conforme os dois perfis. **Ator/origem:** Sistema; TI. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-001; RN-002; RN-003. **Estado:** Confirmado / detalhamento derivado.

**Critérios de aceitação:**

- CA-002.1 - O sistema reconhece somente os perfis Usuário e TI.
- CA-002.2 - Uma conta Usuário não acessa funções administrativas do TI.
- CA-002.3 - Uma conta TI acessa as funções administrativas autorizadas ao perfil.
- CA-002.4 - Dois usuários comuns com cargos corporativos diferentes possuem o mesmo conjunto de permissões da aplicação.

### RF-003 - Criar e provisionar contas

**Descrição:** Criar e provisionar contas. **Ator/origem:** TI. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-003; RN-004; RN-005. **Estado:** Confirmado; detalhes a validar.

**Critérios de aceitação:**

- CA-003.1 - Uma conta só pode ser criada a partir da área administrativa do TI.
- CA-003.2 - Ao criar conta, o TI define um identificador, uma credencial inicial e um dos dois perfis permitidos.
- CA-003.3 - O sistema impede identificadores duplicados.
- CA-003.4 - O usuário não encontra fluxo de auto cadastro nem de convite.
- CA-003.5 - O link de acesso e a credencial são entregues individualmente por processo definido pela FORD; o canal ainda precisa ser validado.

### RF-004 - Desativar contas

**Descrição:** Desativar contas. **Ator/origem:** TI. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-003; RN-004. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-004.1 - O TI consegue desativar uma conta existente.
- CA-004.2 - Após a desativação, a conta não consegue iniciar nova sessão.
- CA-004.3 - A desativação não concede ao usuário a capacidade de reativar a própria conta.

### RF-005 - Criar grupos de conversa

**Descrição:** Criar grupos de conversa. **Ator/origem:** TI. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-003; RN-007. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-005.1 - O TI consegue criar um grupo e informar ao menos sua identificação/nome.
- CA-005.2 - Um usuário comum não consegue criar grupos.
- CA-005.3 - O grupo criado fica disponível para administração de participantes pelo TI.

### RF-006 - Adicionar usuários a grupos

**Descrição:** Adicionar usuários a grupos. **Ator/origem:** TI. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-003; RN-007. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-006.1 - O TI consegue incluir uma conta ativa em um grupo existente.
- CA-006.2 - Um usuário comum não consegue adicionar participantes por convite ou auto inclusão.
- CA-006.3 - Uma conta desativada não pode ser adicionada como participante ativo.

### RF-007 - Exibir conversas recentes

**Descrição:** Exibir conversas recentes. **Ator/origem:** Usuário. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-010. **Estado:** Confirmado em nível conceitual.

**Critérios de aceitação:**

- CA-007.1 - Após autenticar, um usuário vê a lista de conversas das quais participa.
- CA-007.2 - A lista apresenta as conversas mais recentes antes das mais antigas, segundo atividade de mensagem.
- CA-007.3 - Uma conta sem conversas apresenta um estado vazio compreensível.

### RF-008 - Abrir e ler conversas

**Descrição:** Abrir e ler conversas. **Ator/origem:** Usuário. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-006; RN-010. **Estado:** Derivado.

**Critérios de aceitação:**

- CA-008.1 - O usuário consegue abrir uma conversa individual ou de grupo da qual seja participante.
- CA-008.2 - O usuário consegue visualizar as mensagens disponíveis naquela conversa.
- CA-008.3 - Um usuário que não participa de uma conversa não consegue abri-la por acesso direto a uma URL.

### RF-009 - Enviar mensagem individual

**Descrição:** Enviar mensagem individual. **Ator/origem:** Usuário. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-006; RN-009. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-009.1 - Um usuário ativo consegue iniciar uma conversa individual com qualquer outro usuário ativo.
- CA-009.2 - Uma mensagem enviada com sucesso aparece na conversa do remetente e fica disponível ao destinatário.
- CA-009.3 - O sistema impede o envio por conta desativada ou sessão expirada.
- CA-009.4 - A tentativa de conversar com conta inexistente ou desativada recebe tratamento de erro sem criar uma conversa válida.

### RF-010 - Enviar mensagem em grupo

**Descrição:** Enviar mensagem em grupo. **Ator/origem:** Usuário participante. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-006; RN-007. **Estado:** Derivado; validar com cliente.

**Critérios de aceitação:**

- CA-010.1 - Um membro ativo de um grupo consegue enviar mensagem ao grupo.
- CA-010.2 - A mensagem fica visível aos participantes autorizados do grupo.
- CA-010.3 - Uma conta que não pertence ao grupo não consegue enviar nem ler mensagens do grupo.

### RF-011 - Anexar arquivos PDF e JPEG

**Descrição:** Anexar arquivos PDF e JPEG. **Ator/origem:** Usuário. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-008. **Estado:** Confirmado; limites pendentes.

**Critérios de aceitação:**

- CA-011.1 - O usuário consegue anexar arquivos PDF e JPEG a uma conversa autorizada.
- CA-011.2 - O destinatário consegue identificar e acessar o anexo disponibilizado.
- CA-011.3 - O sistema rejeita extensão ou tipo de conteúdo não permitido.
- CA-011.4 - O limite de tamanho deve ser aplicado quando for definido pelo cliente; até lá o requisito não está completamente testável.

### RF-012 - Rejeitar formatos não permitidos

**Descrição:** Rejeitar formatos não permitidos. **Ator/origem:** Sistema. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-008; RN-011. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-012.1 - Arquivos que não sejam PDF ou JPEG são recusados.
- CA-012.2 - Tentativas de anexar áudio, vídeo ou outros formatos não resultam em arquivo acessível na conversa.
- CA-012.3 - A interface informa que o formato não é aceito.

### RF-013 - Não oferecer captura/gravação de mídia

**Descrição:** Não oferecer captura/gravação de mídia. **Ator/origem:** Sistema. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-011. **Estado:** Confirmado, com ambiguidade sobre câmera/JPEG.

**Critérios de aceitação:**

- CA-013.1 - A aplicação não oferece controles próprios para gravar áudio ou vídeo.
- CA-013.2 - A aplicação não oferece controle próprio para tirar foto.
- CA-013.3 - O fluxo de anexar JPEG deve ser validado para esclarecer se arquivos existentes podem ser selecionados e se a câmera do dispositivo deve ser bloqueada.

### RF-014 - Analisar mensagens em busca de conteúdo suspeito

**Descrição:** Analisar mensagens em busca de conteúdo suspeito. **Ator/origem:** Sistema. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-012; RN-013. **Estado:** Intenção confirmada; regras pendentes.

**Critérios de aceitação:**

- CA-014.1 - Cada mensagem submetida passa pela política de análise aprovada pela FORD.
- CA-014.2 - O conjunto de termos/categorias suspeitas inclui palavrões somente conforme lista aprovada.
- CA-014.3 - A mensagem sinalizada fica associada ao motivo/regra que gerou a sinalização.
- CA-014.4 - Nenhuma regra de bloqueio ou punição automática é aplicada até ser expressamente definida.

### RF-015 - Alertar o TI sobre mensagens sinalizadas

**Descrição:** Alertar o TI sobre mensagens sinalizadas. **Ator/origem:** Sistema; TI. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-012; RN-013. **Estado:** Confirmado em intenção; canal pendente.

**Critérios de aceitação:**

- CA-015.1 - Uma mensagem sinalizada gera um alerta visível ao TI no mecanismo aprovado.
- CA-015.2 - O alerta identifica a conversa, a mensagem, o momento e o motivo da sinalização, respeitando o acesso administrativo aprovado.
- CA-015.3 - O canal, prazo máximo e fluxo de tratamento dos alertas são definidos antes do aceite final.

### RF-016 - Consultar qualquer conversa como TI

**Descrição:** Consultar qualquer conversa como TI. **Ator/origem:** TI. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-003; RN-013; RN-014. **Estado:** Confirmado; salvaguardas pendentes.

**Critérios de aceitação:**

- CA-016.1 - Uma conta TI autorizada consegue consultar conversas individuais e de grupo, mesmo sem ser participante.
- CA-016.2 - Uma conta Usuário não consegue usar a função de consulta administrativa.
- CA-016.3 - O sistema não deve alterar mensagens apenas pelo ato de consulta.
- CA-016.4 - Registro de quem consultou, quando e por qual motivo é recomendado e depende de aprovação do cliente.

### RF-017 - Restringir perfil Usuário a celular

**Descrição:** Restringir perfil Usuário a celular. **Ator/origem:** Sistema. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-015. **Estado:** Confirmado; critério técnico pendente.

**Critérios de aceitação:**

- CA-017.1 - Uma conta Usuário em ambiente classificado como computador não consegue utilizar as funções da aplicação.
- CA-017.2 - A tela bloqueada apresenta a mensagem exata: “só pode ser usado em celular”.
- CA-017.3 - O bloqueio não pode depender apenas de ocultar componentes visuais; as rotas e operações devem continuar protegidas.

### RF-018 - Restringir perfil TI a computador

**Descrição:** Restringir perfil TI a computador. **Ator/origem:** Sistema. **Prioridade:** Alta (provisória). **Regras relacionadas:** RN-015. **Estado:** Confirmado; critério técnico pendente.

**Critérios de aceitação:**

- CA-018.1 - Uma conta TI em ambiente classificado como celular não consegue utilizar as funções administrativas.
- CA-018.2 - O bloqueio é aplicado também às operações administrativas, não apenas à interface.
- CA-018.3 - A definição de tablet, tela dobrável, modo desktop e emulação deve ser validada.

## 3.3 Fluxos alternativos e tratamento de erros transversais

- **Credenciais inválidas, conta desativada ou sessão expirada:** negar a operação protegida, não criar sessão/registro indevido e apresentar mensagem compreensível sem revelar dados sensíveis da conta. A redação final da mensagem deve ser definida no UX.
- **Destinatário inexistente/desativado:** não criar conversa válida; informar indisponibilidade do destinatário sem expor detalhes internos da conta.
- **Formato não permitido:** rejeitar o arquivo antes de disponibilizá-lo aos participantes e informar os formatos aceitos (PDF e JPEG).
- **Falha de envio ou conexão:** preservar o texto em edição quando tecnicamente viável, informar que o envio não foi confirmado e evitar indicar falsamente que a mensagem foi entregue. A política de repetição/duplicidade deve ser definida no projeto técnico.
- **Acesso a grupo ou conversa sem autorização:** negar a leitura e a escrita, inclusive por URL direta ou chamada de API.
- **Falha da análise automática:** política de contingência pendente. O cliente deve decidir se a mensagem fica retida, é enviada com alerta de falha ou se o envio é temporariamente bloqueado.

## 3.4 Pontos que impedem o aceite final

- Distribuição das 25 pessoas entre Usuário e TI; se os 25 incluem administradores.
- Confirmação de que usuários podem escrever em grupos e se existem outros controles de participação.
- Definição de como anexar JPEG sem habilitar captura pela câmera.
- Política de senha inicial, redefinição e canal de entrega.
- Definição da lista/regras de suspeição, falsos positivos, severidade, notificação e ação após alerta.
- Definição do critério de classificação de celular/computador e tratamento de tablets.
- Política de mensagens editadas/excluídas, histórico e retenção.
