# 01 - Visão geral e escopo

## 1.1 Contexto do problema

A FORD pretende disponibilizar uma aplicação própria de comunicação corporativa para o setor técnico, mantendo sob sua administração as contas, os grupos, as mensagens, os anexos e o monitoramento de segurança. A motivação informada é reduzir a dependência de aplicativos externos de mensagens e manter os dados e a operação do Polychat sob controle da organização.

A aplicação deve atender inicialmente 25 usuários finais do setor técnico, além da equipe de TI da FORD, estimada em 2 a 3 administradores. Esse público representa uma parcela restrita dos aproximadamente 900 funcionários da empresa. Não há previsão de expansão no escopo atual; eventual extensão a outros níveis ou setores será avaliada após a fase inicial.

## 1.2 Propósito deste documento

Registrar a visão, as fronteiras, os atores, as premissas e as restrições do produto, servindo de referência para especificação, planejamento, desenvolvimento, testes e homologação.

Esta revisão incorpora o questionário atualizado da FORD e os alinhamentos complementares do PO com Desenvolvimento. Os limites de armazenamento, as regras e severidades dos alertas, as metas de desempenho, a proteção de credenciais, a gestão de chaves, a política detalhada de retenção, os critérios de homologação e o isolamento dos ambientes são considerados requisitos completos e alinhados; não devem ser reabertos como lacunas nesta especificação.

## 1.3 Visão do produto

Polychat é uma aplicação web de comunicação interna da FORD, com duas experiências:
- **Usuário:** interface de comunicação acessada exclusivamente por celular.
- **TI:** console administrativo acessado exclusivamente por computador.

A experiência do Usuário deve apresentar as conversas mais recentes após o login, com mensagens de texto, conversas individuais e grupos administrados pelo TI. A aplicação também deve permitir anexar arquivos JPEG e PDF, acompanhar leituras, identificar mensagens suspeitas e sincronizar mensagens após reconexão.

O console de TI concentra o gerenciamento de contas e grupos, consulta e exportação de conversas, administração de anexos, fila de alertas, configurações e auditoria.

## 1.4 Público-alvo e atores

| Ator / stakeholder | Descrição | Responsabilidades e necessidades |
|---|---|---|
| Usuário | 25 funcionários finais do setor técnico, com perfil Usuário. | Autenticar-se, conversar individualmente e em grupos dos quais participe, anexar arquivos permitidos, consultar histórico e indicadores de leitura. |
| TI | Equipe reduzida da FORD, estimada em 2 a 3 administradores, fora do total de 25 usuários finais. | Administrar contas e grupos, configurar segurança, monitorar mensagens suspeitas, consultar/exportar conversas, administrar anexos, consultar e gerenciar registros de auditoria e operar o ambiente. |
| Gestor da FORD | Fábio Silva Cerqueira, representante e gestor informado pelo cliente. | Aprovar decisões de negócio, alterações de escopo e prazo, identidade visual, orçamento, homologação funcional e Go/No-Go. |
| Product Owner | Responsável de produto do Polychat. | Consolidar necessidades da FORD, manter requisitos e rastreabilidade, priorizar backlog e validar critérios de aceite. |
| Desenvolvimento / liderança técnica | Equipe responsável pela solução. | Projetar, implementar e validar os requisitos funcionais e não funcionais alinhados. |
| TI da FORD | Equipe responsável pela infraestrutura e operação. | Administrar credenciais, segredos, ambientes, operação, recuperação e controles técnicos sob responsabilidade da FORD. |

Todos os administradores do perfil TI possuem os mesmos poderes administrativos. Não existe administrador principal nem exigência de aprovação de uma segunda pessoa para operações privilegiadas. A FORD informou que não possui uma área de Segurança da Informação separada; a responsabilidade por segurança fica com o TI. O cliente confirmou confiança na equipe de TI; os riscos relacionados a esse modelo foram considerados avaliados pelo projeto.

## 1.5 Escopo do MVP

### Incluído

- Aplicação web de comunicação corporativa para uso interno da FORD.
- 25 usuários finais do setor técnico, além de aproximadamente 2 a 3 administradores TI.
- Perfis de aplicação Usuário e TI.
- Criação de contas exclusivamente pelo TI, incluindo contas TI.
- Identificador de acesso como nome de usuário definido pelo TI, único na organização e alterável pelo TI a qualquer momento.
- Senhas criadas pelo TI e entregues individualmente junto ao link de acesso; sem obrigatoriedade de troca no primeiro acesso e sem expiração periódica.
- Recuperação de senha realizada exclusivamente pelo TI.
- Desativação e reativação de contas pelo TI, com revogação imediata de sessões e preservação do histórico.
- Conversas individuais e em grupos criados e administrados pelo TI.
- Inclusão e remoção de participantes pelo TI; a remoção revoga imediatamente o acesso do participante às mensagens e aos anexos anteriores do grupo.
- Mensagens de texto, sem edição ou exclusão pelo Usuário.
- Edição e exclusão de mensagens pelo TI, a qualquer momento, com registro em auditoria.
- Confirmação de leitura, horário de leitura e quantidade de mensagens não lidas.
- Histórico sem limite temporal próprio, sujeito à política de retenção definida para o projeto, com carregamento paginado das mensagens mais recentes primeiro.
- Sincronização em tempo real e recuperação automática das mensagens pendentes após desconexão normal, sem perda de mensagens confirmadas pelo servidor.
- Anexos exclusivamente JPEG e PDF, com até 10 MB por arquivo e até 5 arquivos por mensagem.
- Seleção de JPEG já existente na galeria do celular, sem captura de foto, gravação de vídeo ou áudio pelo aplicativo.
- Remoção de metadados de imagens, incluindo localização GPS.
- Análise antimalware de anexos antes da disponibilização; anexos permanecem bloqueados quando o scanner está indisponível ou o resultado é inconclusivo.
- Possibilidade de liberação administrativa de qualquer arquivo pelo TI, conforme decisão expressa da FORD; usuários não podem contornar a análise.
- Links temporários com validade máxima de 5 minutos e revogação imediata quando o acesso do participante for removido.
- Detecção automática de mensagens suspeitas, incluindo palavrões, por regras/lista de termos mantida pelo TI, sem análise contextual e sem IA de terceiros.
- Fila administrativa de alertas com severidades baixa, média e alta e prazos de resposta definidos.
- Consulta de qualquer conversa pelo TI a qualquer momento, sem justificativa ou autorização prévia de outra pessoa.
- Exportação de conversas pelo TI a qualquer momento, com registro em auditoria.
- Aviso de monitoramento apresentado aos funcionários no primeiro acesso.
- Auditoria de operações administrativas e de segurança conforme o catálogo estabelecido pela FORD.
- Criptografia em trânsito e em repouso, sem criptografia ponta a ponta; o servidor pode acessar o conteúdo para as funções de monitoramento e administração previstas.
- Acesso do Usuário somente por celular e do TI somente por computador.
- Interface exclusivamente em português, com identidade visual FORD em azul e branco e utilização do logo da FORD.
- Indicador de mensagens não lidas dentro do aplicativo; sem notificações push ou notificações do navegador.

### Fora do escopo inicial

- Expansão imediata para os setores operacional e estratégico ou para os demais funcionários da FORD.
- Uso por fornecedores, parceiros, prestadores ou público externo.
- Cadastro aberto, autoinscrição ou convite de usuários por Usuários comuns.
- Aplicativos nativos instaláveis para Android, iOS ou desktop; o produto contratado é uma aplicação web.
- Chamadas de voz/vídeo, mensagens de áudio, gravação de áudio/vídeo e captura de fotos pelo aplicativo.
- Formatos de anexos diferentes de JPEG e PDF.
- Notificações push e notificações do navegador.
- Integrações com outros aplicativos ou serviços de comunicação externos.

## 1.6 Regras centrais de negócio

### Contas e autenticação

- Somente TI cria contas, inclusive contas com perfil TI.
- Todos os TIs possuem os mesmos poderes administrativos.
- O identificador é um nome de usuário único na organização, definido e alterável somente pelo TI.
- A senha é criada pelo TI, enviada individualmente e não precisa ser trocada no primeiro acesso.
- Não existe expiração periódica de senha nem MFA exigido pela FORD.
- Recuperação de senha, reativação e desativação são operações exclusivas do TI.
- Desativação encerra imediatamente as sessões e revoga os acessos; o histórico é preservado.

### Conversas, grupos e mensagens

- Usuários não podem sair voluntariamente de grupos.
- Somente TI cria, encerra, desativa e reativa grupos, além de incluir e remover integrantes.
- A remoção de integrante bloqueia imediatamente o acesso às mensagens e anexos anteriores daquele grupo.
- Usuários não editam nem excluem mensagens.
- TI pode consultar qualquer conversa, sem justificativa ou autorização prévia, e pode exportar conversas.
- TI pode alterar ou excluir mensagens a qualquer momento; as operações administrativas previstas devem ser registradas em auditoria.
- Mensagens confirmadas pelo servidor são persistidas; a reconexão normal recupera automaticamente as mensagens pendentes.

### Anexos

- Somente JPEG e PDF são aceitos; PDF protegido por senha não é aceito.
- Limite de 10 MB por arquivo e até 5 arquivos por mensagem.
- Limites por usuário e capacidade total são definidos pelo TI; não há limite específico por conversa.
- O envio é bloqueado quando um limite é excedido, com informação do motivo ao usuário.
- Todo arquivo passa por análise antimalware antes de ser disponibilizado.
- Indisponibilidade ou resultado inconclusivo do scanner mantém o anexo bloqueado; mensagens de texto continuam funcionando.
- TI pode liberar qualquer arquivo a qualquer momento; Usuários não podem contornar a análise.
- Links temporários duram no máximo 5 minutos, mas devem ser revogados imediatamente quando o acesso do participante é removido.
- TI pode baixar anexos durante investigações, com registro em auditoria.

### Monitoramento e alertas

- Mensagens suspeitas, incluindo palavrões definidos em lista mantida pelo TI, são detectadas automaticamente por regras.
- Não há análise contextual nem uso de IA de terceiros.
- Conteúdo de mensagens e anexos não pode ser enviado a serviços externos.
- Os alertas aparecem em fila administrativa no console do TI.
- A equipe de TI analisa os alertas; o encerramento não exige justificativa.
- Prazos por severidade: alta, imediatamente e em até 1 hora; média, até 1 dia útil; baixa, até 3 dias úteis.
- O questionário não definiu bloqueio automático de mensagens como consequência da detecção; a função confirmada é alertar o TI.

### Auditoria, criptografia e dados

- Ações administrativas auditadas incluem login administrativo, criação e alteração de usuários, desativação e reativação de contas, criação e encerramento de grupos, inclusão e remoção de participantes, consulta de conversas, consulta de alertas, download de anexos e alteração de configurações.
- Somente TI consulta e gerencia os registros de auditoria. Usuários não podem alterá-los ou excluí-los.
- Registros administrativos e de auditoria não possuem exclusão automática; permanecem enquanto o sistema operar, conforme política detalhada alinhada com Desenvolvimento.
- Mensagens, anexos, alertas, logs de auditoria e registros administrativos não possuem exclusão automática e são mantidos enquanto o sistema operar. Somente TI autoriza exclusões e decide quando preservar ou excluir dados em investigações.
- Após exclusão autorizada, os dados também devem desaparecer dos backups ao término do ciclo de retenção das cópias. Backups possuem retenção de 12 meses; o descarte é comprovado por registro de auditoria emitido pelo TI.
- Criptografia em trânsito e em repouso; sem E2EE. As chaves são administradas pelo servidor sob responsabilidade do TI da FORD.
- O aviso de monitoramento é apresentado no primeiro acesso.
- A FORD definiu o TI como canal operacional para solicitações de acesso, correção ou exclusão de dados. Solicitações legais dirigidas à FORD ou a fornecedores de infraestrutura são tratadas pela própria FORD, que espera ser informada quando isso for juridicamente permitido. O cliente informou não possuir política corporativa específica de privacidade para este programa, não prever participação do Jurídico e não considerar privacidade/LGPD prioridade do projeto. Essas respostas são registradas como posicionamento do cliente, sem significar dispensa de obrigações legais aplicáveis.

## 1.7 Infraestrutura, operação e restrições tecnológicas

A infraestrutura deve permanecer sob controle da FORD, preferencialmente em território brasileiro. Nenhum serviço de terceiro pode acessar, armazenar ou processar dados da FORD. Bibliotecas de código e atualizações de software que não acessem dados são permitidas.

Hospedagem, banco de dados, autenticação, armazenamento de anexos, antimalware, monitoramento, segredos e operação devem respeitar essa fronteira. Os ambientes de desenvolvimento, homologação e produção devem permanecer isolados conforme alinhamento concluído com Desenvolvimento.

A stack de aplicação existente no repositório não deve ser confundida com autorização para utilizar serviços gerenciados externos. A arquitetura e os documentos de decisão técnica precisam refletir a restrição de controle da FORD antes de qualquer declaração de aderência operacional.

## 1.8 Operação, disponibilidade e recuperação

- Até 25 conexões simultâneas de usuários finais, além dos administradores TI.
- Disponibilidade exigida de 99% ao mês.
- Manutenção programada fora do horário comercial, com aviso prévio aos usuários.
- RPO de até 24 horas em desastre ou falha de infraestrutura; esse parâmetro não se aplica à reconexão normal do usuário.
- RTO de até 24 horas.
- Backups diários de banco de dados e anexos, com retenção de 12 meses.
- Operação e recuperação dos ambientes sob responsabilidade do TI da FORD.
- Incidentes devem acionar a equipe de TI da FORD e o gestor responsável.
- Suporte em horário comercial.
- Metas quantitativas de desempenho e demais parâmetros operacionais foram alinhados entre PO e Desenvolvimento e são considerados completos nesta especificação.

## 1.9 Dispositivos, UX e identidade visual

- Usuários finais: celulares Android e iOS, utilizando navegadores móveis atuais Chrome e Safari.
- TI: computadores, utilizando navegadores atuais Chrome, Edge e Firefox.
- Tablets não são permitidos: Usuário somente em celular e TI somente em computador.
- Usuários que tentarem acessar por computador devem receber a mensagem “só pode ser usado em celular”.
- TI não pode utilizar o console administrativo por celular.
- Interface exclusivamente em português.
- A tela inicial após autenticação apresenta as conversas mais recentes.
- O console TI possui painel de alertas, gestão de usuários, gestão de grupos, configurações de segurança e painel de auditoria.
- Identidade visual em azul e branco, com logo da FORD; códigos exatos das cores devem seguir a identidade visual fornecida/aprovada pela FORD.
- A FORD não definiu requisitos adicionais de acessibilidade para o produto; obrigações legais aplicáveis não são afastadas por essa decisão.

## 1.10 Homologação e aceite

Não haverá grupo piloto. O lançamento será único para os 25 usuários finais do setor técnico, após homologação.

- Responsável pela homologação funcional: Fábio Silva Cerqueira, gestor da FORD.
- Participantes dos testes: gestor da FORD e representantes do TI.
- O aceite será formalizado por escrito.
- Os critérios de homologação de segurança, restrição por dispositivo, anexos, alertas e auditoria foram alinhados com Desenvolvimento e são considerados completos.
- Falhas de segurança, autenticação, permissão ou perda de mensagens impedem o lançamento.
- O gestor da FORD autoriza o Go/No-Go.
- A aceitação de riscos residuais é formalizada por escrito pelo TI, autoridade administrativa do sistema.
- São considerados inaceitáveis, segundo a FORD, o acesso de terceiros às conversas sem conhecimento da organização e o vazamento de mensagens.

## 1.11 Prazo, orçamento e contratação

- Não há data limite definida para disponibilização; o prazo será combinado conforme o planejamento das sprints.
- Não há marco corporativo condicionando o lançamento.
- O valor de R$ 450.000,00 é referência comercial, não declarado como teto orçamentário aprovado.
- A referência inclui implantação, mas não inclui infraestrutura, licenças, suporte, manutenção ou treinamento.
- Custos recorrentes após a entrega ficam sob responsabilidade da FORD.
- O valor foi declarado global, sem impostos ou despesas adicionais a considerar separadamente.
- O gestor da FORD aprova o orçamento e alterações de escopo e prazo.

## 1.12 Limites e premissas de conformidade

O questionário registra que a FORD não prevê participação do Jurídico e não considera a LGPD prioridade no programa inicial. Também define monitoramento das conversas, aviso aos funcionários no primeiro acesso e tramitação de solicitações de dados pelo TI.

Essas respostas descrevem o processo e o posicionamento informados pelo cliente. Não constituem declaração de inaplicabilidade de legislação, nem eliminam direitos ou obrigações impostos por normas aplicáveis. A especificação não substitui análise jurídica independente quando necessária.

## 1.13 Dependências e decisões ainda não fechadas

Os seguintes itens permanecem para complementação, sem reabrir os requisitos já concluídos com Desenvolvimento:

- Data limite de disponibilização, caso venha a ser estabelecida.
- Códigos exatos das cores e ativos oficiais da identidade visual FORD, a partir do material de marca disponível.
- Eventuais evoluções de escopo após o lançamento inicial, especialmente expansão para outros setores.
- Detalhes de produto que não tenham sido definidos no questionário ou nos alinhamentos já concluídos devem ser tratados pelo processo normal de decisão do PO, sem reabrir as oito frentes técnicas consideradas completas.

