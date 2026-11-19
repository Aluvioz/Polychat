# 03 - Requisitos funcionais

Este catálogo consolida as funcionalidades do MVP conforme o questionário atualizado da FORD e os alinhamentos complementares do PO com Desenvolvimento. Os identificadores RF-001 a RF-018 foram preservados. Novas capacidades foram acrescentadas a partir de RF-019, sem renumerar requisitos existentes.

A prioridade **Alta** indica que a funcionalidade faz parte do escopo inicial aprovado. O estado **Confirmado** representa decisão de produto; não afirma, por si só, que a funcionalidade esteja implementada ou homologada.

## 3.1 Catálogo resumido

| ID | Requisito | Ator / origem | Prioridade | Estado |
|---|---|---|---|---|
| RF-001 | Autenticar por nome de usuário e senha | Usuário; TI | Alta | Confirmado |
| RF-002 | Aplicar permissões dos perfis Usuário e TI | Sistema; TI | Alta | Confirmado |
| RF-003 | Criar e provisionar contas | TI | Alta | Confirmado |
| RF-004 | Desativar e reativar contas, revogando sessões | TI | Alta | Confirmado |
| RF-005 | Criar, encerrar, desativar e reativar grupos | TI | Alta | Confirmado |
| RF-006 | Incluir e remover participantes de grupos | TI | Alta | Confirmado |
| RF-007 | Exibir conversas recentes | Usuário | Alta | Confirmado |
| RF-008 | Abrir, ler e consultar histórico de conversas | Usuário | Alta | Confirmado |
| RF-009 | Enviar mensagens individuais e sincronizar após reconexão | Usuário | Alta | Confirmado |
| RF-010 | Enviar mensagens em grupos | Usuário participante | Alta | Confirmado |
| RF-011 | Anexar, disponibilizar e baixar arquivos PDF/JPEG | Usuário; TI | Alta | Confirmado |
| RF-012 | Validar formatos, limites e condições de anexos | Sistema | Alta | Confirmado |
| RF-013 | Permitir seleção de JPEG existente sem captura/gravação de mídia e remover metadados | Sistema | Alta | Confirmado |
| RF-014 | Detectar automaticamente mensagens suspeitas por regras | Sistema; TI | Alta | Confirmado |
| RF-015 | Gerar e administrar alertas de mensagens suspeitas | Sistema; TI | Alta | Confirmado |
| RF-016 | Consultar qualquer conversa pelo console TI | TI | Alta | Confirmado |
| RF-017 | Restringir o perfil Usuário a celular | Sistema | Alta | Confirmado |
| RF-018 | Restringir o perfil TI a computador | Sistema | Alta | Confirmado |
| RF-019 | Registrar e exibir confirmação de leitura e mensagens não lidas | Usuário; Sistema | Alta | Confirmado |
| RF-020 | Permitir edição e exclusão administrativa de mensagens | TI | Alta | Confirmado |
| RF-021 | Exportar conversas pelo console TI | TI | Alta | Confirmado |
| RF-022 | Registrar, consultar e gerenciar auditoria administrativa | Sistema; TI | Alta | Confirmado |
| RF-023 | Exibir aviso de monitoramento no primeiro acesso | Sistema; Usuário | Alta | Confirmado |

## 3.2 Especificação e critérios de aceitação

### RF-001 — Autenticar por nome de usuário e senha

**Descrição:** permitir autenticação individual por nome de usuário definido pelo TI e senha criada pelo TI. O identificador é único na organização e pode ser alterado somente pelo TI. **Ator:** Usuário; TI. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-001.1 — Uma conta ativa com nome de usuário e senha válidos consegue iniciar sessão.
- CA-001.2 — Credenciais inválidas não concedem acesso e apresentam mensagem de falha.
- CA-001.3 — Conta desativada não consegue iniciar nova sessão.
- CA-001.4 — Após autenticação, o sistema direciona a pessoa ao ambiente correspondente ao perfil.
- CA-001.5 — O sistema impede a criação de nomes de usuário duplicados na organização.
- CA-001.6 — Somente TI pode alterar o nome de usuário.
- CA-001.7 — Não é exigida troca obrigatória de senha no primeiro acesso, expiração periódica de senha ou MFA pela decisão registrada da FORD.

### RF-002 — Aplicar permissões dos perfis Usuário e TI

**Descrição:** aplicar os dois perfis de aplicação, sem hierarquia adicional de privilégios entre administradores TI. **Ator:** Sistema; TI. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-002.1 — O sistema reconhece somente os perfis Usuário e TI.
- CA-002.2 — Uma conta Usuário não acessa funções administrativas do TI.
- CA-002.3 — Uma conta TI possui as permissões administrativas do perfil.
- CA-002.4 — Todos os administradores TI possuem os mesmos poderes.
- CA-002.5 — Qualquer TI pode criar, alterar ou desativar outra conta TI, sem exigência de aprovação de segunda pessoa.
- CA-002.6 — Diferenças de cargo corporativo entre usuários comuns não criam permissões diferentes no aplicativo.

### RF-003 — Criar e provisionar contas

**Descrição:** permitir que TI crie contas Usuário e TI, defina nome de usuário e senha inicial e envie as credenciais individualmente com o link de acesso. **Ator:** TI. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-003.1 — Somente TI consegue criar contas pelo console administrativo.
- CA-003.2 — Na criação, TI define nome de usuário único, senha inicial e perfil Usuário ou TI.
- CA-003.3 — O sistema impede nomes de usuário duplicados.
- CA-003.4 — Não existe auto cadastro, convite ou criação de conta por Usuário comum.
- CA-003.5 — O TI envia individualmente a cada pessoa as credenciais iniciais e o link de acesso.
- CA-003.6 — A senha inicial não é temporária e não exige troca obrigatória no primeiro acesso.

### RF-004 — Desativar e reativar contas, revogando sessões

**Descrição:** permitir ao TI desativar e reativar contas. A desativação deve encerrar imediatamente sessões abertas e revogar todos os acessos, preservando o histórico. **Ator:** TI. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-004.1 — TI consegue desativar uma conta existente.
- CA-004.2 — Desligamento, afastamento, suspeita de comprometimento, violação de segurança ou decisão do TI podem motivar a desativação.
- CA-004.3 — Após a desativação, novas autenticações e operações protegidas são negadas.
- CA-004.4 — Sessões já abertas são encerradas e acessos são revogados imediatamente.
- CA-004.5 — TI consegue reativar uma conta.
- CA-004.6 — A desativação não exclui o histórico de mensagens; o histórico permanece disponível para consulta administrativa conforme as regras de retenção.

### RF-005 — Criar, encerrar, desativar e reativar grupos

**Descrição:** permitir que somente TI administre o ciclo de vida dos grupos. **Ator:** TI. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-005.1 — TI consegue criar grupo e informar sua identificação/nome.
- CA-005.2 — Usuário comum não consegue criar grupos.
- CA-005.3 — Somente TI consegue encerrar ou desativar um grupo.
- CA-005.4 — Somente TI consegue reativar um grupo encerrado/desativado.
- CA-005.5 — O encerramento preserva o histórico para consulta administrativa do TI.

### RF-006 — Incluir e remover participantes de grupos

**Descrição:** permitir que TI inclua e remova participantes. Usuário não pode entrar ou sair voluntariamente de grupos. A remoção revoga imediatamente o acesso do participante às mensagens e anexos anteriores do grupo. **Ator:** TI. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-006.1 — TI consegue incluir conta ativa em grupo existente.
- CA-006.2 — TI consegue remover participante de grupo.
- CA-006.3 — Usuário não consegue adicionar participantes por convite ou auto inclusão.
- CA-006.4 — Usuário não consegue sair voluntariamente de grupo.
- CA-006.5 — Após remoção, o participante perde imediatamente acesso às mensagens e aos anexos anteriores do grupo.
- CA-006.6 — Links de download já emitidos para o participante removido são revogados imediatamente, sem aguardar o prazo máximo de expiração.

### RF-007 — Exibir conversas recentes

**Descrição:** apresentar ao Usuário a lista das conversas mais recentes após a autenticação. **Ator:** Usuário. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-007.1 — Após autenticar, Usuário vê as conversas das quais participa.
- CA-007.2 — As conversas mais recentes aparecem primeiro, de acordo com a atividade de mensagem.
- CA-007.3 — Uma conta sem conversas apresenta estado vazio compreensível.
- CA-007.4 — A lista exibe a quantidade de mensagens não lidas por conversa.

### RF-008 — Abrir, ler e consultar histórico de conversas

**Descrição:** permitir ao Usuário abrir conversas individuais e grupos dos quais participa e consultar o histórico paginado, começando pelas mensagens mais recentes. **Ator:** Usuário. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-008.1 — Usuário consegue abrir conversa individual ou grupo do qual participa.
- CA-008.2 — Usuário consegue consultar as mensagens disponíveis na conversa, conforme a política de retenção.
- CA-008.3 — O histórico é carregado por paginação, começando pelas mensagens e conversas mais recentes.
- CA-008.4 — Usuário que não participa de uma conversa não consegue abri-la por URL direta ou chamada de API.
- CA-008.5 — O histórico não possui prazo de consulta próprio além da política de retenção definida para o produto.

### RF-009 — Enviar mensagens individuais e sincronizar após reconexão

**Descrição:** permitir envio de mensagens individuais em tempo real e recuperação automática de mensagens pendentes após desconexão normal. Mensagens confirmadas pelo servidor devem ser persistidas. **Ator:** Usuário. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-009.1 — Usuário ativo consegue iniciar conversa individual com outro usuário ativo.
- CA-009.2 — Mensagem enviada com sucesso aparece na conversa do remetente e fica disponível ao destinatário.
- CA-009.3 — Mensagens confirmadas pelo servidor são gravadas de forma persistente.
- CA-009.4 — Após desconexão normal, o aplicativo sincroniza automaticamente as mensagens pendentes ao reconectar, sem perda.
- CA-009.5 — O sistema não apresenta como confirmada uma mensagem que não recebeu confirmação de persistência do servidor.
- CA-009.6 — Conta desativada ou sessão expirada não consegue enviar mensagens.

### RF-010 — Enviar mensagens em grupos

**Descrição:** permitir que membros incluídos pelo TI enviem mensagens aos grupos dos quais participam. **Ator:** Usuário participante. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-010.1 — Membro ativo de grupo consegue enviar mensagem ao grupo.
- CA-010.2 — Mensagem fica disponível aos participantes autorizados.
- CA-010.3 — Conta que não pertence ao grupo não consegue enviar nem ler mensagens do grupo.
- CA-010.4 — Mensagens confirmadas pelo servidor são persistidas e recuperadas após reconexão normal.
- CA-010.5 — Usuário removido não consegue consultar mensagens ou anexos anteriores do grupo.

### RF-011 — Anexar, disponibilizar e baixar arquivos PDF/JPEG

**Descrição:** permitir envio e acesso autorizado a anexos PDF/JPEG, com análise antimalware e regras de acesso. **Ator:** Usuário; TI. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-011.1 — Usuário consegue anexar PDF ou JPEG a conversa autorizada.
- CA-011.2 — Cada arquivo possui tamanho máximo de 10 MB.
- CA-011.3 — Uma mensagem aceita até 5 arquivos.
- CA-011.4 — Limite individual de armazenamento é definido pelo TI; capacidade total também é definida pelo TI conforme a infraestrutura; não há limite específico por conversa.
- CA-011.5 — Envio que ultrapasse um limite é bloqueado e informa o motivo ao usuário.
- CA-011.6 — Todo arquivo passa por análise antimalware antes de ser disponibilizado.
- CA-011.7 — Scanner indisponível, resultado inconclusivo ou impossibilidade de análise mantém o anexo bloqueado; mensagens de texto continuam funcionando.
- CA-011.8 — TI pode liberar arquivo suspeito a qualquer momento; Usuário não possui mecanismo para contornar a análise.
- CA-011.9 — Link temporário de download possui validade máxima de 5 minutos.
- CA-011.10 — Link já emitido é revogado imediatamente quando o participante perde acesso ao grupo.
- CA-011.11 — TI pode baixar anexos durante investigações, com registro em auditoria.
- CA-011.12 — Cada download exige autorização vigente, exceto o fluxo administrativo de TI previsto pela FORD.

### RF-012 — Validar formatos, limites e condições de anexos

**Descrição:** aceitar somente JPEG e PDF, aplicando as condições de validação e armazenamento definidas. **Ator:** Sistema. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-012.1 — Arquivos diferentes de PDF e JPEG são recusados.
- CA-012.2 — A validação considera o tipo real do arquivo, não apenas extensão ou nome.
- CA-012.3 — PDF protegido por senha não é aceito.
- CA-012.4 — Arquivos que ultrapassem tamanho, quantidade ou quotas aplicáveis são bloqueados.
- CA-012.5 — O arquivo não é disponibilizado enquanto a análise obrigatória não apresentar resultado favorável, ressalvada a liberação administrativa pelo TI expressamente prevista.
- CA-012.6 — A indisponibilidade do scanner não bloqueia o envio de mensagens de texto.

### RF-013 — Selecionar JPEG existente sem captura/gravação e remover metadados

**Descrição:** permitir selecionar imagens JPEG existentes no dispositivo, sem oferecer captura de fotos ou gravação de áudio/vídeo, removendo metadados das imagens. **Ator:** Sistema; Usuário. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-013.1 — Usuário consegue selecionar imagens JPEG já existentes na galeria do celular.
- CA-013.2 — A aplicação não oferece função de tirar fotos.
- CA-013.3 — A aplicação não oferece gravação de vídeo ou áudio.
- CA-013.4 — Metadados das imagens, incluindo localização GPS, são removidos antes da disponibilização.

### RF-014 — Detectar automaticamente mensagens suspeitas por regras

**Descrição:** analisar mensagens com regras automáticas e lista de termos suspeitos mantida pelo TI, incluindo palavrões. Não há análise contextual nem uso de IA de terceiros. **Ator:** Sistema; TI. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-014.1 — Mensagens são verificadas conforme a lista e as regras configuradas pelo TI.
- CA-014.2 — A detecção inclui os termos suspeitos definidos e mantidos pelo TI.
- CA-014.3 — A análise não depende de inteligência artificial de terceiros.
- CA-014.4 — Não é realizada análise contextual no escopo inicial.
- CA-014.5 — Conteúdo de mensagens e anexos não é enviado a serviços externos para análise.
- CA-014.6 — Mensagem identificada como suspeita gera sinalização para o fluxo de alertas.

### RF-015 — Gerar e administrar alertas de mensagens suspeitas

**Descrição:** disponibilizar alertas em fila administrativa do console TI, classificados em baixa, média e alta severidade. **Ator:** Sistema; TI. **Estado:** Confirmado; regras e metas operacionais alinhadas com Desenvolvimento.

**Critérios de aceitação:**

- CA-015.1 — Mensagem sinalizada gera alerta visível na fila administrativa do TI.
- CA-015.2 — O alerta apresenta as informações e a classificação previstas nas regras alinhadas com Desenvolvimento.
- CA-015.3 — A severidade é uma das três categorias: baixa, média ou alta.
- CA-015.4 — Prazo para alta: atendimento imediato, em até 1 hora.
- CA-015.5 — Prazo para média: até 1 dia útil.
- CA-015.6 — Prazo para baixa: até 3 dias úteis.
- CA-015.7 — A equipe de TI é responsável pela análise.
- CA-015.8 — TI pode encerrar alertas a qualquer momento, sem justificativa obrigatória.
- CA-015.9 — A detecção gera alerta; não se presume bloqueio automático de mensagens ou contas.

### RF-016 — Consultar qualquer conversa pelo console TI

**Descrição:** permitir que qualquer administrador TI consulte qualquer conversa individual ou em grupo, a qualquer momento, sem justificativa e sem autorização prévia de outro responsável. Os funcionários recebem aviso de monitoramento no primeiro acesso. **Ator:** TI. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-016.1 — Conta TI consegue consultar qualquer conversa individual ou em grupo, mesmo sem ser participante.
- CA-016.2 — Conta Usuário não acessa a função administrativa de consulta.
- CA-016.3 — A consulta não exige justificativa nem autorização prévia de outro responsável.
- CA-016.4 — Toda consulta administrativa gera registro de auditoria.
- CA-016.5 — O aviso de monitoramento é exibido ao funcionário no primeiro acesso.

### RF-017 — Restringir perfil Usuário a celular

**Descrição:** permitir uso do perfil Usuário somente em celulares Android e iOS, nos navegadores móveis homologados Chrome e Safari. **Ator:** Sistema. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-017.1 — Usuário em computador não consegue utilizar as funções do aplicativo.
- CA-017.2 — O bloqueio em computador apresenta a mensagem “só pode ser usado em celular”.
- CA-017.3 — Usuário utiliza celular Android ou iOS.
- CA-017.4 — Tablets não são permitidos.
- CA-017.5 — Os navegadores móveis homologados são Chrome e Safari atuais.
- CA-017.6 — A restrição é aplicada às rotas e operações protegidas, não apenas à interface.

### RF-018 — Restringir perfil TI a computador

**Descrição:** permitir uso do console TI somente em computador, nos navegadores homologados Chrome, Edge e Firefox. **Ator:** Sistema. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-018.1 — Conta TI em celular não consegue utilizar o console administrativo.
- CA-018.2 — O console TI é utilizado em computador.
- CA-018.3 — Tablets não são permitidos.
- CA-018.4 — Os navegadores de computador homologados são Chrome, Edge e Firefox atuais.
- CA-018.5 — A restrição é aplicada às operações administrativas, não apenas à interface.

### RF-019 — Registrar e exibir confirmação de leitura e mensagens não lidas

**Descrição:** apresentar confirmação simples de leitura, horário em que a mensagem foi lida e quantidade de mensagens não lidas na lista de conversas. **Ator:** Usuário; Sistema. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-019.1 — O sistema registra a leitura de uma mensagem.
- CA-019.2 — O usuário consegue visualizar quando a mensagem foi lida.
- CA-019.3 — A lista de conversas apresenta a quantidade de mensagens não lidas.
- CA-019.4 — O estado de leitura é atualizado de acordo com as regras técnicas alinhadas para a mensageria.

### RF-020 — Permitir edição e exclusão administrativa de mensagens

**Descrição:** permitir que TI altere ou exclua mensagens a qualquer momento. Usuários comuns não podem editar ou excluir mensagens enviadas. As operações do TI são registradas em auditoria. **Ator:** TI; Sistema. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-020.1 — Usuário comum não consegue editar mensagens enviadas.
- CA-020.2 — Usuário comum não consegue excluir mensagens.
- CA-020.3 — TI consegue alterar mensagens a qualquer momento.
- CA-020.4 — TI consegue excluir mensagens a qualquer momento.
- CA-020.5 — Alterações e exclusões administrativas são registradas em auditoria.

### RF-021 — Exportar conversas pelo console TI

**Descrição:** permitir que TI exporte conversas a qualquer momento. **Ator:** TI. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-021.1 — TI consegue exportar conversas individuais e de grupo.
- CA-021.2 — A exportação não exige justificativa ou autorização prévia de outra pessoa.
- CA-021.3 — A operação de exportação gera registro de auditoria.
- CA-021.4 — Usuários comuns não possuem função de exportação administrativa.

### RF-022 — Registrar, consultar e gerenciar auditoria administrativa

**Descrição:** registrar operações administrativas e de segurança; permitir consulta e gerenciamento dos registros somente pelo TI. Usuários não podem consultar, alterar ou excluir registros. **Ator:** Sistema; TI. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-022.1 — Gerar registros para login administrativo.
- CA-022.2 — Gerar registros para criação e alteração de usuários.
- CA-022.3 — Gerar registros para desativação e reativação de contas.
- CA-022.4 — Gerar registros para criação e encerramento de grupos.
- CA-022.5 — Gerar registros para inclusão e remoção de participantes.
- CA-022.6 — Gerar registros para consulta de conversas e consulta de alertas.
- CA-022.7 — Gerar registros para download de anexos e alteração de configurações.
- CA-022.8 — Somente TI consegue consultar e gerenciar registros de auditoria.
- CA-022.9 — Usuários não conseguem alterar ou excluir registros de auditoria.
- CA-022.10 — Os registros não possuem exclusão automática e são mantidos enquanto o sistema operar, conforme a política de retenção alinhada.

### RF-023 — Exibir aviso de monitoramento no primeiro acesso

**Descrição:** informar aos funcionários, no primeiro acesso, que as conversas podem ser monitoradas pela FORD. **Ator:** Sistema; Usuário. **Estado:** Confirmado.

**Critérios de aceitação:**

- CA-023.1 — O aviso de monitoramento é apresentado no primeiro acesso do funcionário.
- CA-023.2 — O texto informa que as conversas podem ser monitoradas.
- CA-023.3 — A apresentação do aviso não depende de notificações push ou do navegador.

## 3.3 Regras transversais e tratamento de erros

- **Credenciais inválidas, conta desativada ou sessão expirada:** negar a operação protegida e apresentar mensagem de falha sem revelar dados internos.
- **Destinatário inexistente ou desativado:** não criar conversa válida e informar indisponibilidade.
- **Formato não permitido ou PDF protegido por senha:** rejeitar o arquivo e informar os formatos/condições aceitos.
- **Limite de anexo excedido:** bloquear envio e informar o motivo.
- **Scanner indisponível, erro ou resultado inconclusivo:** manter anexos bloqueados; mensagens de texto continuam disponíveis.
- **Falha de envio ou conexão:** não indicar como entregue mensagem sem confirmação persistente do servidor; após reconexão normal, recuperar mensagens pendentes automaticamente.
- **Participante removido:** negar imediatamente novos acessos às mensagens e anexos anteriores e revogar links já emitidos.
- **Consulta administrativa:** permitir ao TI conforme RF-016 e registrar o evento de auditoria.
- **Dispositivo incompatível:** bloquear o acesso do perfil e apresentar a mensagem específica definida para Usuário em computador.
- **Falha na auditoria:** o comportamento operacional deve seguir o tratamento técnico definido no alinhamento com Desenvolvimento, sem inventar um fluxo de contingência nesta especificação.

## 3.4 Escopo e homologação funcional

Os requisitos funcionais deste documento compõem o escopo do MVP. A homologação ocorrerá antes do lançamento único aos 25 usuários finais, sem grupo piloto.

O aceite funcional será conduzido por Fábio Silva Cerqueira, com representantes do TI da FORD, e formalizado por escrito. Falhas de segurança, autenticação, permissão ou perda de mensagens impedem o lançamento. Os critérios detalhados de homologação estão alinhados com Desenvolvimento e devem ser utilizados como base dos casos de teste e evidências.

