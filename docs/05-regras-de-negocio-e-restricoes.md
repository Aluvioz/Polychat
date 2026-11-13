# 05 - Regras de negócio e restrições

As regras representam decisões de negócio conhecidas. A coluna Estado diferencia a informação direta de questões ainda abertas.

| ID | Regra | Estado | Requisitos relacionados |
|---|---|---|---|
| RN-001 | **Perfis da aplicação.** Existem somente dois perfis no produto: Usuário e TI. | Confirmado | RF-002 |
| RN-002 | **Permissões dos usuários comuns.** Todo funcionário fora da área de TI utiliza o perfil Usuário; não há diferença de permissão por cargo corporativo. | Confirmado | RF-002 |
| RN-003 | **Administração pelo TI.** O perfil TI é responsável pelas funções administrativas definidas para o sistema, incluindo contas, grupos, segurança e consulta de conversas. | Confirmado em princípio; catálogo completo de operações pendente | RF-002 a RF-006; RF-014 a RF-016 |
| RN-004 | **Provisionamento de contas.** A criação de conta é realizada pelo TI. Não há convite nem auto cadastro de usuário. | Confirmado | RF-001; RF-003 |
| RN-005 | **Credencial e entrega.** O TI cria usuário e senha e entrega individualmente ao destinatário junto com o link da aplicação. O formato do identificador e o canal de entrega não foram definidos. | Processo geral confirmado; detalhes pendentes | RF-001; RF-003; RNF-003 |
| RN-006 | **Mensagens individuais.** Um usuário pode iniciar conversa com qualquer outro usuário ativo, sem depender do cargo corporativo. | Confirmado | RF-009 |
| RN-007 | **Grupos.** O TI cria grupos e adiciona pessoas. Regras de envio, saída, remoção e encerramento de grupo não foram especificadas. | Criação e inclusão confirmadas; restante pendente | RF-005; RF-006; RF-010 |
| RN-008 | **Tipos de arquivo.** Os anexos permitidos são PDF e JPEG. Limite por arquivo, tamanho total e quantidade não foram informados. | Formatos confirmados; limites pendentes | RF-011; RF-012; RNF-010 |
| RN-009 | **Uso interno.** O Polychat destina-se exclusivamente à FORD na primeira versão; fornecedores e agentes externos estão fora do público informado. | Confirmado | RF-001; RF-009 |
| RN-010 | **Interface principal.** A experiência deve ser simples e fluida, exibindo conversas recentes após o login, em estilo familiar a mensageiros. | Direção confirmada; detalhes de UX pendentes | RF-007; RF-008; RNF-006 |
| RN-011 | **Captura e gravação.** A aplicação não deve oferecer captura de foto nem gravação de áudio/vídeo. A forma de permitir JPEG sem acesso à câmera precisa ser esclarecida. | Intenção confirmada; ambiguidade registrada | RF-011 a RF-013 |
| RN-012 | **Análise de conteúdo.** Mensagens devem ser verificadas automaticamente para identificar conteúdo suspeito, incluindo palavrões conforme critérios a aprovar. | Intenção confirmada; critérios pendentes | RF-014; RNF-002 |
| RN-013 | **Alerta ao TI.** Mensagens identificadas como suspeitas devem gerar alerta ao TI. Canal, severidade e fluxo de resposta não foram definidos. | Intenção confirmada; operação pendente | RF-015 |
| RN-014 | **Consulta administrativa de conversas.** O TI pode consultar qualquer conversa, individual ou em grupo. Escopo temporal, justificativa, registro, exportação e transparência não foram definidos. | Acesso confirmado; salvaguardas pendentes | RF-016; RNF-004; RNF-011 |
| RN-015 | **Dispositivo por perfil.** Usuário utiliza celular; TI utiliza computador. Sistemas operacionais, navegadores, tablets e detecção de dispositivo ainda precisam ser definidos. | Confirmado em nível de intenção | RF-017; RF-018; RNF-005 |
| RN-016 | **Prioridade de qualidade.** Segurança deve ter prioridade sobre velocidade nas decisões de produto e implementação. | Confirmado; métricas pendentes | RNF-001 a RNF-003; RNF-007 |
| RN-017 | **Integrações.** Não haverá integração com outros aplicativos ou funções externas nesta versão. | Confirmado | OBJ-001 |
| RN-018 | **Público inicial.** O público inicial informado é de 25 pessoas do nível técnico, em uma organização de aproximadamente 900 funcionários. A composição por perfil e a carga simultânea ainda não foram informadas. | População inicial confirmada; composição pendente | OBJ-006; RNF-008 |
| RN-019 | **Identidade visual.** A interface deve seguir a identidade visual da Ford, utilizando azul e branco. Os códigos oficiais, tipografia e ativos de marca devem ser fornecidos/aprovados. | Direção confirmada; especificação visual pendente | OBJ-007; RNF-006 |
| RN-020 | **Orçamento.** Foi informado o valor de R$ 450.000,00. Não foi confirmado se é teto, estimativa, valor aprovado ou se inclui infraestrutura/operação. | Valor informado; natureza pendente | - |

## Restrições explícitas

- Somente dois perfis de aplicação: Usuário e TI.
- Administração centralizada no TI; não oferecer cadastro aberto ou convites.
- Público inicial exclusivo da FORD; não incluir fornecedores ou agentes externos.
- Mensagens e anexos PDF/JPEG; não oferecer chamadas ou gravações de áudio/vídeo.
- Usuário em celular; TI em computador.
- Nenhuma integração com aplicativos externos no escopo informado.
- Segurança priorizada em relação à velocidade.

## Recomendações sujeitas a aprovação

- Registrar toda consulta de conversa e ação administrativa realizada pelo TI.
- Usar credenciais iniciais temporárias, entrega por canal aprovado e troca no primeiro acesso.
- Proteger conteúdo em trânsito e em armazenamento; validar arquitetura por análise de ameaças e testes independentes.
- Aplicar validação de conteúdo real dos anexos e verificação antimalware.
- Definir política de retenção e descarte de mensagens, arquivos, alertas e registros de auditoria.
- Não interpretar a existência de servidor/aplicação própria como garantia de imunidade a solicitações legais dirigidas à FORD ou a prestadores de infraestrutura.
