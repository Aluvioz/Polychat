# 05 - Regras de negócio e restrições

Este documento consolida as regras de negócio da FORD conforme o questionário atualizado (FORD v2) e os alinhamentos complementares do PO com Desenvolvimento. Os estados indicam a situação da decisão, não a situação de implementação.

## 5.1 Catálogo de regras de negócio

| ID | Regra | Estado | Requisitos relacionados |
|---|---|---|---|
| RN-001 | **Perfis da aplicação.** Existem somente dois perfis: Usuário e TI. | Confirmado pela FORD | RF-002 |
| RN-002 | **Permissões dos usuários comuns.** Os 25 usuários finais pertencem ao setor técnico e utilizam o perfil Usuário. Diferenças de cargo corporativo não criam permissões diferentes dentro do perfil. | Confirmado pela FORD | RF-002; RNF-001 |
| RN-003 | **Administração pelo TI.** TI administra contas Usuário e TI, identificadores e credenciais, ciclo de vida de contas, grupos, participantes, configurações de segurança, mensagens suspeitas, alertas, consultas e exportações de conversas, anexos de investigação e registros de auditoria. Todos os administradores TI possuem os mesmos poderes; não há administrador principal nem aprovação de segundo administrador. | Confirmado pela FORD; riscos do modelo considerados avaliados pelo projeto | RF-002 a RF-006; RF-014 a RF-022 |
| RN-004 | **Provisionamento de contas.** Somente TI cria contas. Não há auto cadastro, convite ou criação de conta por Usuário comum. A regra também se aplica às contas com perfil TI. | Confirmado pela FORD | RF-001; RF-003 |
| RN-005 | **Identificador e credenciais.** TI define nome de usuário único na organização, podendo alterá-lo a qualquer momento. TI cria a senha e a envia individualmente junto com o link de acesso. Não há troca obrigatória no primeiro acesso, expiração periódica ou MFA exigido pela FORD. Recuperação de senha é feita exclusivamente pelo TI. | Confirmado pela FORD; proteção técnica de credenciais alinhada com Desenvolvimento | RF-001; RF-003; RF-004; RNF-003 |
| RN-006 | **Mensagens individuais.** Usuário ativo pode iniciar conversa com qualquer outro usuário ativo, sem distinção por cargo corporativo. | Confirmado pela FORD | RF-008; RF-009 |
| RN-007 | **Grupos.** Somente TI cria, encerra, desativa e reativa grupos e inclui ou remove participantes. Usuários não podem sair voluntariamente de grupos. Membros incluídos pelo TI podem enviar mensagens. A remoção de participante revoga imediatamente o acesso às mensagens e anexos anteriores do grupo. | Confirmado pela FORD | RF-005; RF-006; RF-010 |
| RN-008 | **Anexos.** Somente PDF e JPEG são aceitos. Cada arquivo pode ter até 10 MB e cada mensagem pode conter até 5 arquivos. Limites individuais de armazenamento e capacidade total são definidos pelo TI; não existe limite específico por conversa. PDF protegido por senha não é aceito. O envio acima dos limites é bloqueado e o motivo é informado ao usuário. | Confirmado pela FORD; limites e operação alinhados com Desenvolvimento | RF-011; RF-012; RNF-010 |
| RN-009 | **Uso interno.** O Polychat destina-se ao público interno da FORD no escopo inicial. Fornecedores, parceiros, prestadores e público externo não integram o público inicial. | Confirmado pela FORD | OBJ-001; RF-001; RF-009 |
| RN-010 | **Experiência principal.** Após autenticação, a interface do Usuário apresenta conversas recentes. O histórico é consultado por paginação, começando pelas mensagens mais recentes. A interface é exclusivamente em português. | Confirmado pela FORD | RF-007; RF-008; RF-019; RNF-006 |
| RN-011 | **Captura e gravação de mídia.** A aplicação não oferece captura de foto, gravação de áudio ou gravação de vídeo. Usuários podem selecionar JPEG já existente na galeria do celular. Metadados das imagens, incluindo localização GPS, são removidos. | Confirmado pela FORD | RF-011; RF-013; RNF-010 |
| RN-012 | **Análise de conteúdo.** Mensagens são analisadas automaticamente por regras e lista de termos suspeitos, mantida pelo TI, incluindo palavrões. Não há análise contextual nem uso de IA de terceiros. O conteúdo é processado pelos componentes das plataformas oficiais Supabase/Vercel e pelo scanner interno integrado ao fluxo de anexos; não pode ser encaminhado a outros serviços externos de análise não aprovados. | Confirmado pela FORD; regras alinhadas com Desenvolvimento | RF-014; RNF-002; RNF-011 |
| RN-013 | **Alertas ao TI.** Mensagens sinalizadas geram alertas na fila administrativa do console TI, classificados como baixa, média ou alta severidade. TI analisa os alertas e pode encerrá-los sem justificativa obrigatória. Os prazos de resposta são: alta, imediatamente e em até 1 hora; média, até 1 dia útil; baixa, até 3 dias úteis. A sinalização não implica bloqueio automático da mensagem. | Confirmado pela FORD; severidades e prazos alinhados com Desenvolvimento | RF-015; RF-022; RNF-004 |
| RN-014 | **Consulta, exportação e administração de conversas.** Qualquer administrador TI pode consultar qualquer conversa a qualquer momento, sem justificativa ou autorização prévia de outra pessoa. TI também pode exportar conversas, alterar mensagens ou excluí-las a qualquer momento. Usuários comuns não podem editar ou excluir mensagens. Consultas, exportações, alterações e exclusões administrativas são registradas em auditoria. | Confirmado pela FORD; confiança nos administradores considerada avaliada pelo projeto | RF-016; RF-020; RF-021; RF-022 |
| RN-015 | **Dispositivo por perfil.** Usuário acessa somente por celular Android ou iOS, utilizando Chrome ou Safari móvel atuais. TI acessa somente por computador, utilizando Chrome, Edge ou Firefox atuais. Tablets não são permitidos. Usuário que tentar acessar por computador recebe a mensagem “só pode ser usado em celular”. | Confirmado pela FORD; critérios de homologação alinhados com Desenvolvimento | RF-017; RF-018; RNF-005 |
| RN-016 | **Prioridade de segurança.** A FORD estabelece segurança como prioridade em relação à velocidade e declara que privacidade individual não é prioridade do programa inicial. Essa orientação não representa dispensa de obrigações legais aplicáveis ao tratamento de dados. | Posicionamento do cliente registrado; obrigações legais não são afastadas | RNF-001; RNF-002; RNF-007; RNF-011 |
| RN-017 | **Integrações.** Não haverá integração com outros aplicativos ou serviços externos de comunicação no escopo inicial. Bibliotecas e atualizações de software que não acessem, armazenem ou processem dados da FORD podem ser utilizadas, conforme os controles técnicos aplicáveis. | Confirmado pela FORD | OBJ-001; RNF-013 |
| RN-018 | **Público inicial.** O lançamento contempla 25 usuários finais do setor técnico, além de aproximadamente 2 a 3 administradores TI. Não há expansão prevista para outros setores nesta fase. | Confirmado pela FORD | OBJ-001; RNF-008 |
| RN-019 | **Identidade visual.** A interface utiliza azul e branco e o logo da FORD, seguindo a identidade visual da organização. | Direção confirmada; códigos exatos e ativos oficiais dependem do material de marca | OBJ-007; RNF-006 |
| RN-020 | **Referência comercial.** R$ 450.000,00 é referência comercial global. Inclui implantação, mas não inclui infraestrutura, licenças, suporte, manutenção ou treinamento. Custos recorrentes ficam sob responsabilidade da FORD. O valor não foi declarado como teto orçamentário aprovado. | Condições comerciais informadas; não equivalem a orçamento total aprovado | - |
| RN-021 | **Retenção e exclusão de dados.** Mensagens, anexos, alertas, logs de auditoria e registros administrativos não possuem exclusão automática enquanto o sistema operar. Somente TI autoriza exclusões e decide quando preservar ou excluir dados em investigações. Backups diários são retidos por 12 meses. Após exclusão autorizada, os dados devem desaparecer dos backups ao término do ciclo de retenção das cópias; a evidência de descarte é registrada em auditoria. | Política detalhada alinhada com Desenvolvimento e considerada completa pelo PO | RF-022; RNF-004; RNF-009; RNF-011 |
| RN-022 | **Plataformas e governança da infraestrutura.** Supabase e Vercel são as plataformas oficiais do Polychat, conforme alinhamento do PO com Desenvolvimento. A FORD mantém a governança de contas, acessos, configurações e ambientes; regiões de dados/execução devem ser verificadas, preferencialmente com adequação ao Brasil. Outros serviços externos exigem aprovação explícita antes de acessar ou processar dados. | Stack oficial confirmada; configuração técnica por ambiente sujeita à validação | RNF-002; RNF-013 |
| RN-023 | **Operação e continuidade.** A capacidade inicial é de até 25 conexões simultâneas de usuários finais, além dos administradores TI. Disponibilidade mensal de 99%, RPO de até 24 horas em desastre/falha de infraestrutura, RTO de até 24 horas, backups diários de banco e anexos com retenção de 12 meses, manutenção programada fora do horário comercial com aviso prévio e suporte em horário comercial. Operação e recuperação são responsabilidade do TI da FORD. | Confirmado pela FORD e alinhado com Desenvolvimento | RNF-007; RNF-008; RNF-009 |
| RN-024 | **Homologação e lançamento.** Não haverá grupo piloto. O lançamento será único para os 25 usuários finais, após homologação. Fábio Silva Cerqueira conduz a homologação funcional com representantes do TI; o aceite é formalizado por escrito. O gestor autoriza o Go/No-Go. Falhas de segurança, autenticação, permissão ou perda de mensagens impedem o lançamento. | Confirmado pela FORD; critérios de homologação alinhados com Desenvolvimento | RNF-001; RNF-005; RNF-009; RNF-010 |
| RN-025 | **Monitoramento e solicitações.** Os funcionários recebem aviso de monitoramento no primeiro acesso. O TI é o canal operacional para solicitações de acesso, correção ou exclusão de dados. Solicitações legais dirigidas à FORD ou a fornecedores de infraestrutura são tratadas pela própria FORD, que espera ser informada quando isso for juridicamente permitido. A ausência de política corporativa específica de privacidade ou de participação do Jurídico é registrada como posicionamento do cliente, sem afastar a legislação aplicável. | Confirmado como processo declarado pela FORD; conformidade legal não é dispensada | RF-023; RNF-011 |

## 5.2 Restrições explícitas do produto

- Somente os perfis Usuário e TI.
- Criação de contas e administração do sistema exclusivamente pelo TI.
- Público inicial de 25 usuários finais do setor técnico, além de 2 a 3 administradores TI.
- Aplicação web; Usuário somente em celular e TI somente em computador.
- Somente mensagens de texto e anexos PDF/JPEG.
- Proibidas chamadas, captura de fotos, gravação de áudio e gravação de vídeo.
- Sem notificações push ou notificações do navegador.
- Sem auto cadastro, convites ou acesso de fornecedores e público externo.
- Sem integração com outros aplicativos de comunicação.
- Supabase e Vercel são plataformas oficiais; não adicionar serviços externos de processamento, armazenamento ou análise sem aprovação explícita do projeto.
- Segurança prevalece sobre velocidade, sem afastar obrigações legais aplicáveis.

## 5.3 Regras de retenção e operação

- Não há exclusão automática dos dados operacionais enquanto o sistema estiver em operação.
- TI pode autorizar exclusões e determinar preservação durante investigações.
- Backups diários de banco e anexos são mantidos por 12 meses.
- Dados excluídos devem expirar das cópias de backup ao término do ciclo de retenção aplicável.
- O descarte deve possuir evidência registrada em auditoria.
- O RPO de 24 horas aplica-se a desastre ou falha de infraestrutura; não autoriza perda de mensagens confirmadas durante desconexão normal.
- Mensagens confirmadas pelo servidor devem ser recuperadas após reconexão normal.

## 5.4 Premissas de gestão do projeto

- Os limites de armazenamento, regras e severidades dos alertas, metas de desempenho, proteção de credenciais, gestão de chaves, política detalhada de retenção, critérios de homologação e isolamento dos ambientes foram alinhados com Desenvolvimento e são considerados completos pelo PO.
- Os administradores TI são considerados profissionais de extrema confiança. A concentração de poderes administrativos e os riscos correspondentes foram avaliados pelo responsável do projeto e não devem ser reabertos como pendências de requisito.
- A classificação como confirmado ou alinhado indica decisão; não constitui evidência de implementação ou homologação técnica.
- As respostas do cliente relativas à privacidade e à LGPD não são tratadas como dispensa de obrigações legais aplicáveis.

## 5.5 Recomendações e decisões não incorporadas como regra

- O repositório deve manter rastreabilidade entre estas regras, os requisitos funcionais/não funcionais, as decisões arquiteturais e os critérios de teste.
- A arquitetura deve manter Supabase e Vercel como plataformas oficiais e validar os controles de região, acesso, segregação, segredos, backups e processamento por ambiente. A inclusão de qualquer outro fornecedor que acesse dados exige aprovação explícita.
- A identidade visual deve utilizar os arquivos oficiais da FORD fornecidos para o projeto.
- Não introduzir requisitos, permissões ou exceções adicionais por inferência.
