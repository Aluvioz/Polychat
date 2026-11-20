# Issue #100 — Matriz de autorização e políticas RLS

- **Issue:** [#100 — Definir matriz de autorização e políticas RLS](https://github.com/Aluvioz/Polychat/issues/100)
- **Epic:** [#80 — Modelo de dados, autorização e RLS](https://github.com/Aluvioz/Polychat/issues/80)
- **Baseline de produto:** POLY-REQ-001 **v0.5**, de 20/11/2026 — `docs/09-baseline-requisitos-mvp.md`
- **Fontes funcionais:** RF-001 a RF-023; RN-001 a RN-025; decisões consolidadas da FORD v2; Q-001 a Q-025.
- **Referências técnicas:** [ADR-006 — Autorização e RLS](adr/ADR-006-autorizacao-rls.md), Issues #99, #101, #102 e #105.
- **Estado do parecer do PO:** **APROVADA NO ESCOPO FUNCIONAL** para a baseline v0.5, conforme parecer registrado na Issue #100 em 20/11/2026.
- **Limites da aprovação:** não equivale a aprovação técnica de arquitetura/implementação, aceite de Segurança/Privacidade, homologação institucional da FORD ou aprovação independente do SQA.
- **Data desta revisão:** 20/11/2026.

> Esta matriz registra quem pode executar cada operação e sob quais condições de produto. A aprovação funcional do PO não comprova que os controles estejam implementados. A modelagem física pertence à #99; a implementação e os testes de enforcement/RLS de domínio pertencem à #101; a implementação de auditoria e retenção pertence à #102. A stack tecnológica adotada pelo projeto é Supabase + Vercel. A compatibilidade dessa stack com as restrições de infraestrutura e tratamento de dados registradas pela FORD deve ser tratada explicitamente na Q-025, sem classificar Supabase/Vercel como arquitetura descartada.

## 1. Como interpretar a matriz

- **Permitido — regra confirmada:** a operação é autorizada para o ator e nas condições descritas por requisito/regra aprovada.
- **Negado — regra confirmada:** a operação é proibida para o ator ou viola condição funcional de acesso.
- **Implementação pendente:** a regra de produto está definida, mas ainda depende de schema, controle server-side, política de banco/Storage ou integração.
- **Dependência técnica:** detalhe de estrutura, mecanismo ou evidência que deve ser resolvido pela equipe técnica, sem reabrir uma decisão de produto já confirmada.
- **Fora do escopo desta matriz:** decisão ou implementação atribuída a outra issue. Não significa que a regra funcional esteja indefinida.

A matriz separa três elementos que não podem ser confundidos:

1. **Identidade autenticada:** identidade validada no servidor pelo Supabase Auth, conforme a stack definida para o projeto. Identificadores, credenciais e estado de conta enviados pelo cliente não são fontes confiáveis de autorização.
2. **Perfil (role):** um dos dois perfis de aplicação: `user` (Usuário) ou `ti` (TI). Todos os administradores TI têm poderes administrativos equivalentes; não há administrador principal ou segunda aprovação.
3. **Participação (membership):** vínculo efetivo da pessoa com uma conversa ou grupo. A role, por si só, não torna um Usuário participante. A exceção é o acesso administrativo expressamente concedido ao TI para consulta de qualquer conversa, com auditoria.

## 2. Fontes e decisões funcionais consideradas

| Fonte | Regra utilizada nesta matriz |
|---|---|
| POLY-REQ-001 v0.5 | Baseline vigente de produto, consolidada a partir da FORD v2 e alinhamentos complementares do PO |
| RF-001 a RF-023 | Requisitos funcionais e critérios CA-xxx.n, inclusive membership, consulta TI, anexos, alertas, auditoria, dispositivos e edição/exclusão administrativa |
| RN-001 a RN-025 | Regras de negócio vigentes, incluindo poderes equivalentes do TI, gestão de grupos, monitoramento, retenção e soberania dos dados |
| Q-001 a Q-024 | Histórico de decisões; questões resolvidas permanecem registradas e não devem ser reabertas como pendências |
| Q-025 | Avaliar a compatibilidade entre a stack definida para o projeto (Supabase + Vercel) e as restrições da FORD relativas a hospedagem, armazenamento e processamento de dados; não descartar a stack por inferência |
| POLY-UX-DEC-001 | Catálogo de telas e configurações administrativas restritas, associado à decisão Q-018 |
| ADR-006 | Referência técnica para autenticação de perfis e RLS com Supabase; detalhes de integração e implantação permanecem sujeitos à revisão técnica |
| Issue #99 | Modelagem do schema necessário às relações de conversas, memberships, mensagens, anexos e auditoria |
| Issue #101 | Implementação de enforcement server-side, políticas de acesso/RLS de domínio e testes de isolamento |
| Issue #102 | Implementação dos eventos de auditoria, proteção, acesso e retenção |
| Issue #105 | Integração de autenticação, perfis e estado de conta |

### 2.1 Decisões de produto ratificadas pelo PO

As regras abaixo estão resolvidas na baseline v0.5 e nas respostas da FORD v2. Não são pendências de levantamento:

- Existem somente os perfis `user` e `ti`; todos os TIs possuem poderes equivalentes.
- TI cria, altera, desativa e reativa contas Usuário e TI. Não há auto cadastro nem convite externo.
- Usuário ativo pode iniciar conversa individual com qualquer outro Usuário ativo.
- Usuário só pode abrir/ler conversas individuais e grupos dos quais participa. Não participante não obtém acesso por URL, API ou conhecimento de identificador.
- Somente TI cria, encerra, desativa e reativa grupos e inclui/remove participantes. Usuário não pode entrar ou sair voluntariamente de grupo.
- A remoção de participante revoga imediatamente o acesso às mensagens e anexos anteriores do grupo e aos links de download já emitidos.
- Usuários comuns enviam mensagens, mas não editam nem excluem mensagens. TI pode editar e excluir mensagens a qualquer momento; essas operações são auditadas.
- Qualquer TI pode consultar e exportar qualquer conversa, a qualquer momento, sem justificativa ou autorização prévia de outra pessoa. Consultas e exportações geram auditoria.
- TI pode consultar e gerenciar registros de auditoria; Usuários comuns não podem consultá-los, alterá-los ou excluí-los.
- Anexos aceitos são PDF e JPEG, até 10 MB por arquivo e cinco arquivos por mensagem. Limites individuais e capacidade total são administrados pelo TI; não há limite por conversa. PDF protegido por senha é recusado.
- A análise antimalware ocorre dentro da infraestrutura da FORD. Falha, indisponibilidade ou resultado inconclusivo mantém o anexo bloqueado. TI pode liberar excepcionalmente arquivo bloqueado, em ação autenticada e auditada.
- A detecção de mensagens suspeitas utiliza regras/lista de termos mantida pelo TI, sem análise contextual ou IA de terceiros. Alertas possuem severidade baixa, média ou alta e prazos definidos; a sinalização não bloqueia automaticamente mensagens ou contas.
- Os funcionários recebem aviso de monitoramento no primeiro acesso.
- As restrições de dispositivos são definidas: Usuário em celular Android/iOS com Chrome/Safari móveis atuais; TI em computador com Chrome/Edge/Firefox atuais; tablets não são permitidos.
- As configurações do TI limitam-se aos controles definidos de lista/regras de detecção e quotas individuais/capacidade de anexos. Não há autorização genérica para administrar configurações arbitrárias.
- Não há exclusão automática de dados operacionais enquanto o sistema operar. Exclusões são autorizadas pelo TI; backups diários são retidos por 12 meses e o descarte das cópias ao fim do ciclo é evidenciado em auditoria.

## 3. Matriz de autorização

**Nota:** “Permitido — regra confirmada” é uma decisão funcional, não uma afirmação de que a operação já esteja disponível em produção.

| Entidade | Operação | Ator | Condição / regra funcional | Resultado | Dependência de implementação / evidência | Rastreabilidade |
|---|---|---|---|---|---|---|
| Conta | Criar/provisionar conta Usuário ou TI | TI | Somente TI cria contas; sem auto cadastro ou convite externo | Permitido | Fluxo privilegiado server-side e persistência conforme arquitetura aprovada | RF-001, RF-003; RN-003 a RN-005 |
| Conta | Alterar identificador, credenciais ou dados administrativos permitidos | TI | Nome de usuário é único e pode ser alterado pelo TI; recuperação de senha é exclusiva do TI | Permitido | Validar unicidade, sessão e proteção de credenciais; detalhes técnicos fora desta matriz | RF-001, RF-003; RN-005 |
| Conta | Criar, alterar ou desativar outra conta TI | TI | Todos os TIs têm poderes iguais; não há administrador principal nem segunda aprovação | Permitido | Operação autenticada e auditada; não criar hierarquia | RF-002, RF-003; Q-002; RN-003 |
| Conta | Desativar/reativar conta e revogar sessões | TI | Desativação encerra sessões e revoga acessos imediatamente; histórico é preservado | Permitido | Enforcement no servidor e preservação de dados históricos | RF-004; CA-004.1 a CA-004.6 |
| Conta | Autocadastrar-se ou convidar pessoa externa | Usuário | Não existe auto cadastro, convite ou público externo no escopo inicial | Negado | Bloqueio no fluxo de criação e no servidor | RF-003; RN-004; RN-009 |
| Conta / perfil | Alterar role ou estado por payload ou escrita direta do cliente | Usuário ou TI | Cliente não é fonte confiável de role/status | Negado | Proteção server-side e no banco; não confiar em campos enviados pelo cliente | RF-002; Supabase Auth/RLS e ADR-006 |
| Sessão | Prosseguir sem identidade válida, com sessão expirada ou conta inativa | Qualquer identidade | Identidade deve ser validada no servidor e conta deve estar ativa | Negado | Autenticação/estado centralizados; comportamento fail-closed | RF-001, RF-004; RN-005 |
| Conversa individual | Iniciar conversa com outro Usuário ativo | Usuário ativo | Não há distinção por cargo corporativo entre usuários comuns | Permitido | Validar situação ativa do remetente/destinatário e persistir vínculo | RF-009; RN-006 |
| Conversa individual | Abrir/ler histórico | Usuário participante | Só pode acessar conversas das quais participa | Permitido | Verificar membership no servidor e na camada de dados; schema em #99 e enforcement em #101 | RF-008; CA-008.1 a CA-008.5 |
| Conversa individual ou grupo | Consultar conversa | TI | Qualquer TI pode consultar qualquer conversa, mesmo sem ser participante e sem justificativa prévia | Permitido | Endpoint/consulta administrativa autenticada; gerar auditoria obrigatória | RF-016; CA-016.1 a CA-016.4; RN-014 |
| Conversa | Abrir/ler por Usuário não participante, inclusive por URL/API/ID conhecido | Usuário não participante | Conhecer o identificador não concede autorização | Negado | Negação server-side e política de dados; teste negativo em #101 | RF-008; CA-008.4; RF-010; CA-010.3 |
| Conversa | Exportar conversa individual ou em grupo | TI | Qualquer TI pode exportar sem justificativa ou aprovação prévia; a ação é auditada | Permitido | Fluxo administrativo autenticado; registrar evento em #102 | RF-021; CA-021.1 a CA-021.4; RN-014 |
| Conversa | Exportar conversa | Usuário | Exportação administrativa não é função do perfil Usuário | Negado | Não expor endpoint/função administrativa ao Usuário | RF-021; CA-021.4 |
| Grupo | Criar, encerrar, desativar ou reativar | TI | Ciclo de vida de grupos é administrado exclusivamente pelo TI | Permitido | Operações privilegiadas e auditadas; schema em #99, enforcement em #101 e auditoria em #102 | RF-005; RN-007 |
| Grupo / membership | Incluir ou remover participante | TI | Somente TI administra participantes; inclusão exige conta ativa | Permitido | Registrar histórico da participação e aplicar revogação de acesso | RF-006; RN-007 |
| Grupo / membership | Entrar por convite/auto inclusão ou sair voluntariamente | Usuário | Usuários não podem adicionar a si mesmos nem sair voluntariamente | Negado | Negação no servidor e nos fluxos de aplicação | RF-006; CA-006.3 e CA-006.4; Q-003 |
| Grupo / membership | Ler/enviar mensagens | Usuário membro ativo | Membro incluído pelo TI pode acessar o grupo enquanto mantiver participação autorizada | Permitido | Conferir membership vigente em cada operação protegida | RF-008, RF-010; CA-010.1 e CA-010.2 |
| Grupo / membership | Ler/enviar mensagens | Usuário não membro ou removido | Não membro não lê nem envia; removido perde acesso ao histórico e anexos anteriores imediatamente | Negado | Revogação efetiva em consultas, API, dados e downloads | RF-006, RF-010; CA-006.5, CA-006.6 e CA-010.5 |
| Mensagem | Enviar mensagem individual | Usuário ativo participante | Conversa com outro Usuário ativo; autoria derivada da identidade autenticada | Permitido | Validar sessão, conta, conversa e persistência | RF-009; RN-006 |
| Mensagem | Enviar mensagem em grupo | Usuário membro ativo | Membership deve estar vigente | Permitido | Validar membership no servidor e na camada de dados | RF-010; CA-010.1 |
| Mensagem | Enviar mensagem em grupo | Usuário não membro | Não participante não pode enviar nem ler | Negado | Teste negativo em #101 | RF-010; CA-010.3 |
| Mensagem | Editar ou excluir mensagem | Usuário comum | Usuários comuns não podem editar nem excluir mensagens enviadas | Negado | Bloquear operações de alteração/exclusão no servidor e na camada de dados | RF-020; CA-020.1 e CA-020.2 |
| Mensagem | Editar ou excluir mensagem | TI | TI pode alterar ou excluir mensagens a qualquer momento; operações são auditadas | Permitido | Ação administrativa autenticada; trilha de auditoria em #102 | RF-020; CA-020.3 a CA-020.5; RN-014 |
| Mensagem / leitura | Registrar leitura, exibir horário e total de não lidas | Usuário; Sistema | O sistema registra leitura e exibe estado/quantidade conforme RF-019 | Permitido | Detalhamento de granularidade e persistência no schema #99 e implementação técnica; não alterar regra observável do RF-019 | RF-019; CA-019.1 a CA-019.4 |
| Anexo | Enviar/anexar PDF ou JPEG | Usuário em conversa autorizada | Até 10 MB por arquivo, até cinco por mensagem; quotas individuais e capacidade total definidas pelo TI; PDF protegido por senha é recusado | Permitido, sujeito a validação | Validar conteúdo real, limites, quota e scanner dentro da infraestrutura da FORD | RF-011, RF-012; RN-008; Q-011 |
| Anexo | Ler/baixar anexo | Participante autorizado | A autorização depende da participação vigente e da conversa; cada download exige autorização vigente | Permitido | Supabase Storage em bucket privado, com autorização verificada no servidor e sem URL pública permanente; validar compatibilidade com Q-014/Q-025 | RF-011; CA-011.9 e CA-011.12 |
| Anexo | Baixar anexo para investigação | TI | TI pode baixar anexos durante investigação; a ação gera auditoria | Permitido | Fluxo administrativo autenticado e auditado | RF-011; CA-011.11; RN-003 |
| Anexo | Liberar arquivo bloqueado pelo scanner | TI | TI pode excepcionalmente liberar qualquer arquivo; ação autenticada e auditada | Permitido, como exceção administrativa | Implementar controle restrito e evento de auditoria; Usuário não pode contornar o scanner | RF-011, RF-012; Q-011; baseline v0.5 |
| Anexo | Disponibilizar arquivo sem resultado antimalware favorável ou com scanner indisponível/inconclusivo | Sistema | Falha, indisponibilidade ou resultado inconclusivo mantém o anexo bloqueado; texto continua funcionando | Negado para disponibilização automática | Fail-closed dentro da infraestrutura da FORD | RF-011; CA-011.6 a CA-011.8; RN-008 |
| Anexo | Acessar por ID/link sem autorização ou após remoção de participante | Usuário sem direito / removido | Link já emitido deve ser revogado imediatamente ao perder acesso | Negado | Revogação server-side, inclusive de links existentes; demonstrar em #101 e entrega de anexos | RF-006; CA-006.5/CA-006.6; RF-011; CA-011.10 |
| Monitoramento | Analisar mensagem por lista de termos/regras | Sistema | Lista mantida pelo TI; inclui termos definidos; sem análise contextual ou IA de terceiros; dados não saem da infraestrutura FORD | Permitido conforme regra | Motor de regras interno; sem envio de conteúdo a serviço externo | RF-014; RN-012; Q-007 |
| Alertas | Visualizar, investigar e encerrar alerta | TI | Fila administrativa; severidade baixa/média/alta; prazos: alta até 1 hora, média até 1 dia útil, baixa até 3 dias úteis; sem justificativa obrigatória para encerrar | Permitido | Operações autenticadas e auditadas; fluxo técnico e evidência em entregas relacionadas | RF-015; CA-015.1 a CA-015.9; Q-008 |
| Alertas | Bloquear automaticamente mensagem ou conta pela sinalização | Sistema | Sinalização gera alerta, mas não bloqueia automaticamente mensagens ou contas | Negado | Não implementar punição/bloqueio automático por detecção | RF-014, RF-015; CA-015.9; Q-008 |
| Auditoria | Registrar operações administrativas e de segurança | Sistema | Eventos previstos incluem login administrativo, gestão de contas/grupos/membros, consulta/exportação, alertas, anexos, configurações e edição/exclusão de mensagens | Obrigatório | Gravação confiável e protegida; implementação em #102 | RF-016, RF-020, RF-021, RF-022; RN-014 |
| Auditoria | Consultar/gerenciar registros | TI | Consulta e gerenciamento de auditoria são funções administrativas do TI | Permitido | Controle de acesso e integridade em #102 | RF-022; CA-022.9 |
| Auditoria | Consultar, alterar ou excluir registros | Usuário comum | Usuário não pode consultar, alterar ou excluir registros de auditoria | Negado | Negar no servidor e na camada de dados | RF-022; CA-022.10 |
| Dados / retenção | Excluir automaticamente mensagens, anexos, alertas ou logs durante operação normal | Sistema | Não há exclusão automática enquanto o sistema operar | Negado | Implementar política alinhada à RN-021 e evidência em #102 | RN-021; RF-022; CA-022.11 |
| Dados / retenção | Autorizar exclusão ou preservação em investigação | TI | TI autoriza exclusões e decide preservação em investigação; backups diários por 12 meses, com descarte evidenciado | Permitido | Fluxo e mecanismo de retenção/descarte em #102; não definir prazo técnico alternativo | RN-021; RNF-004; RNF-009 |
| Configurações | Manter lista/regras de detecção e limites individuais/capacidade de anexos | TI | Configurações restritas ao inventário confirmado; não há permissão genérica para qualquer parâmetro | Permitido, dentro do catálogo | Operações explícitas e auditadas; não criar endpoint administrativo genérico | RF-014, RF-015; Q-018; POLY-UX-DEC-001 |
| Dispositivo | Acessar como Usuário por computador/tablet ou navegador não homologado | Usuário | Usuário usa celular Android/iOS com Chrome/Safari móveis atuais; tablets não permitidos | Negado | Bloqueio aplicado também às operações protegidas, não apenas à interface | RF-017; RN-015 |
| Dispositivo | Acessar console TI por celular/tablet ou navegador não homologado | TI | TI usa computador com Chrome, Edge ou Firefox atuais; tablets não permitidos | Negado | Bloqueio aplicado também às operações administrativas | RF-018; RN-015 |

## 4. Regras transversais de autorização e segurança

1. **Identidade validada no servidor:** toda operação protegida deve derivar a identidade da sessão validada pelo Supabase Auth; nunca confiar em identidade, role ou status enviados pelo cliente.
2. **Role não substitui membership:** o perfil `ti` autoriza as operações administrativas expressas; o perfil `user` não concede acesso a conversa sem participação.
3. **Acesso TI é exceção explícita:** TI consulta/exporta qualquer conversa sem justificativa prévia; toda consulta/exportação deve gerar auditoria.
4. **Membership deve estar vigente:** operações de Usuário dependem de participação autorizada e de conta ativa. A remoção revoga imediatamente acesso ao histórico e anexos do grupo.
5. **Privilégio mínimo:** somente operações descritas nesta matriz são autorizadas. Não derivar permissões administrativas genéricas de uma responsabilidade ampla.
6. **Falha fechada:** falhas de autenticação, perfil, consulta de autorização ou verificação de membership não concedem acesso.
7. **IDs e links não são autorização:** conhecer identificadores ou possuir link anteriormente emitido não substitui a verificação de autorização vigente.
8. **Frontend não é enforcement:** ocultar telas ou botões não substitui autorização no servidor e na camada de persistência/armazenamento.
9. **Auditoria:** consultas, exportações e demais ações administrativas especificadas devem gerar eventos protegidos, sem registrar credenciais, tokens ou segredos.
10. **Restrições de dados da FORD:** a baseline registra exigências de controle de hospedagem e vedação a terceiros no acesso, armazenamento ou processamento. Essas exigências precisam ser conciliadas na Q-025 com a stack Supabase + Vercel definida para o projeto. Até essa compatibilização, não declarar conformidade institucional nem substituir a stack por outra sem decisão expressa.
11. **Sem bypass genérico:** operações privilegiadas devem ser explícitas, autenticadas e auditadas. Esta matriz não autoriza chave privilegiada no cliente nem bypass irrestrito de controles.

## 5. Evidências e limites do estado técnico observado

A inspeção anterior do repositório identificou artefatos de autenticação/perfil e testes unitários baseados em simulação, mas não evidência suficiente de enforcement real para todo o domínio de conversas. A presença de código, migration ou teste simulado não deve ser descrita como RLS de domínio implementada ou homologada.

| Área | Evidência conhecida | Limite da evidência |
|---|---|---|
| Perfis e estado de conta | Há migration Supabase versionada para `profiles` e role `user/ti` | Evidencia scaffold existente na stack do projeto; ainda não comprova integração completa nem homologação dos fluxos |
| Middleware de autorização | Existe implementação isolada e testes unitários | Não comprova integração com todos os handlers/rotas reais |
| Conversas, grupos e memberships | Issue #99 aberta para modelagem | Não há comprovação de schema final ou enforcement de domínio |
| Mensagens, anexos e auditoria | Dependem das entregas de domínio e issues relacionadas | Não declarar policies, Storage, auditoria ou retenção implementados sem evidência |
| Testes de autorização | Foram documentados 11 testes unitários com provedor simulado | Não equivalem a testes de banco/RLS real, integração, revogação de links ou isolamento de domínio |

**Nota arquitetural:** Supabase + Vercel é a stack tecnológica adotada pelo projeto e deve permanecer como referência de implementação. A FORD v2 também registra restrições sobre hospedagem e processamento de dados por terceiros. A compatibilidade entre essas determinações permanece para análise na Q-025; essa pendência não transforma Supabase/Vercel em tecnologias obsoletas nem autoriza sua substituição implícita.

## 6. Casos positivos e negativos para validação

Os resultados abaixo já estão definidos pelas regras de produto. “Implementação pendente” significa que o caso pode ser especificado, mas sua execução depende das issues técnicas correspondentes.

| ID | Cenário | Resultado esperado | Situação |
|---|---|---|---|
| AUTH-01 | Usuário ativo lê conversa individual da qual participa | Permitido | Regra confirmada; schema/enforcement em #99/#101 |
| AUTH-02 | Usuário ativo lê grupo do qual é membro vigente | Permitido | Regra confirmada; schema/enforcement em #99/#101 |
| AUTH-03 | Usuário tenta abrir conversa/grupo do qual não participa | Negado, inclusive por URL/API/ID conhecido | Regra confirmada; teste de domínio em #101 |
| AUTH-04 | Usuário removido tenta ler mensagens ou anexos anteriores do grupo | Negado imediatamente | Regra confirmada; revogação em #101 e entregas de anexos |
| AUTH-05 | Usuário não membro tenta enviar mensagem ao grupo | Negado | Regra confirmada; teste de domínio em #101 |
| AUTH-06 | Membro ativo envia mensagem ao grupo | Permitido | Regra confirmada; implementação em #101 |
| AUTH-07 | Usuário ativo inicia conversa com outro Usuário ativo | Permitido | Regra confirmada; implementação de domínio |
| AUTH-08 | Usuário tenta enviar mensagem com conta inativa/sessão revogada | Negado | Regra confirmada; integração de conta/servidor |
| AUTH-09 | Qualquer TI consulta conversa da qual não participa | Permitido e auditado | Regra confirmada; enforcement em #101 e evento em #102 |
| AUTH-10 | TI exporta conversa sem justificativa prévia | Permitido e auditado | Regra confirmada; implementação em entrega administrativa/#102 |
| AUTH-11 | Usuário tenta consultar ou exportar conversa por função administrativa | Negado | Regra confirmada; enforcement em #101 |
| AUTH-12 | TI cria, desativa ou reativa conta Usuário ou TI | Permitido; ação auditada quando prevista no catálogo | Regra confirmada; fluxo de contas/#105 e auditoria/#102 |
| AUTH-13 | Usuário tenta autocadastro, convite ou criação de conta | Negado | Regra confirmada |
| AUTH-14 | TI cria/encerra/desativa/reativa grupo ou gerencia participantes | Permitido; ação auditada | Regra confirmada; schema/#99, enforcement/#101, auditoria/#102 |
| AUTH-15 | Usuário tenta adicionar participante ou sair voluntariamente do grupo | Negado | Regra confirmada |
| AUTH-16 | Usuário tenta editar ou excluir mensagem enviada | Negado | Regra confirmada; enforcement em #101 |
| AUTH-17 | TI edita ou exclui mensagem | Permitido e auditado | Regra confirmada; implementação/auditoria nas issues correspondentes |
| AUTH-18 | Usuário autorizado baixa anexo de conversa à qual ainda tem acesso | Permitido após validação e scanner favorável | Regra confirmada; implementação de Storage/anexos |
| AUTH-19 | Participante removido tenta usar link de download anteriormente emitido | Negado imediatamente | Regra confirmada; revogação efetiva deve ser demonstrada |
| AUTH-20 | Arquivo é disponibilizado com scanner indisponível ou resultado inconclusivo | Não disponibilizar automaticamente | Regra confirmada; fluxo fail-closed |
| AUTH-21 | TI baixa anexo durante investigação ou libera arquivo bloqueado | Permitido em fluxo administrativo autenticado e auditado | Regra confirmada; implementação de anexos/auditoria |
| AUTH-22 | Mensagem é sinalizada por regra/lista de termos | Gerar alerta; não bloquear automaticamente mensagem/conta | Regra confirmada |
| AUTH-23 | TI visualiza/investiga/encerra alerta sem justificativa obrigatória | Permitido; registrar operações conforme catálogo de auditoria | Regra confirmada; implementação de alertas/auditoria |
| AUTH-24 | Usuário tenta ler/alterar/excluir registros de auditoria | Negado | Regra confirmada; implementação em #102 |
| AUTH-25 | TI consulta/gerencia registros de auditoria | Permitido | Regra confirmada; implementação em #102 |
| AUTH-26 | Sistema exclui automaticamente mensagens/anexos/logs durante operação normal | Não permitido | Regra confirmada; política detalhada e execução em #102 |
| AUTH-27 | Usuário ou TI altera role/status por payload controlado pelo cliente | Negado | Regra confirmada; teste de integração |
| AUTH-28 | Perfil usa dispositivo não permitido para sua função | Negado | Regra confirmada; enforcement técnico em rotas/operações protegidas |

## 7. Dependências, impactos e responsáveis

| Dependência | O que falta | Responsável | Relação com a #100 |
|---|---|---|---|
| Modelagem do domínio (#99) | Estruturar conversas, memberships, mensagens, anexos e entidades necessárias à auditoria/configurações | Tech Lead / Dev | A matriz define o comportamento; não escolhe schema físico |
| Enforcement e RLS de domínio (#101) | Implementar autorização server-side e políticas de persistência/armazenamento; provar isolamento positivo e negativo | Tech Lead / Dev; validação SQA | Execução posterior à matriz/schema; não é aceite documental da #100 |
| Auditoria e retenção (#102) | Implementar catálogo de eventos, acesso restrito, proteção e ciclo de retenção | Dev; validação SQA; parâmetros institucionais conforme baseline | A matriz identifica operações auditáveis; #102 implementa |
| Integração de perfis/contas (#105) | Completar fluxo real de autenticação, provisionamento, desativação e revogação de sessões | Responsáveis da #105; Tech Lead / Dev | A matriz define a regra funcional, sem presumir a integração |
| Compatibilização arquitetural (Q-025) | Avaliar a compatibilidade da stack obrigatória Supabase + Vercel com as restrições registradas pela FORD, preservando a stack como direção do projeto | Tech Lead / Desenvolvimento / TI da FORD | Impede que uma exigência seja descartada por inferência e registra o conflito a resolver |
| Revisão independente da matriz | Verificar rastreabilidade, cobertura de cenários e consistência com RF-001 a RF-023 | SQA | Critério pendente para conclusão formal da #100 |

## 8. Decisões fora do escopo de aprovação desta matriz

Esta aprovação funcional não:

- substitui a stack definida para o projeto (Supabase + Vercel) por outro fornecedor ou arquitetura; os detalhes de configuração, integração, segurança e implantação permanecem sob responsabilidade técnica, com a compatibilidade da Q-025 explicitamente registrada;
- aprova SQL, schema físico, triggers, funções privilegiadas, grants ou implementação de RLS;
- declara implementação, integração, teste real ou homologação concluídos;
- substitui o parecer independente de SQA;
- substitui aprovações institucionais de Segurança, Privacidade, Jurídico ou da FORD;
- altera a política de retenção definida na RN-021 nem transfere sua implementação da #102 para a #100;
- cria papéis, permissões ou configurações que não estejam expressamente previstas na baseline v0.5.

## 9. Encaminhamento para a Issue #101

A equipe técnica pode utilizar esta matriz, após a revisão técnica pertinente, para preparar a implementação da #101. Antes de concluir policies e testes de domínio, deve:

1. utilizar o schema revisado da #99;
2. mapear cada operação a uma entidade/recurso real e à regra positiva/negativa correspondente;
3. aplicar autorização server-side e controles na camada de persistência/armazenamento usando a stack Supabase + Vercel, registrando separadamente a compatibilidade com as restrições da FORD em Q-025;
4. testar participante, não participante, participante removido, conta inativa, Usuário, TI e tentativa de acesso por identificador conhecido;
5. demonstrar revogação imediata de acesso a mensagens/anexos e links após remoção;
6. comprovar que falha de autenticação/autorização e falha do scanner não concedem acesso;
7. registrar evidências reproduzíveis sem expor credenciais, tokens ou dados sensíveis.

Não utilizar permissões permissivas ou bypass genérico para contornar lacuna de schema/implementação. A regra funcional já aprovada não deve ser reaberta como dúvida de produto; dúvidas sobre desenho, modelagem ou enforcement devem ser encaminhadas à equipe técnica.

## 10. Situação da entrega da Issue #100

| Critério da #100 | Estado em 20/11/2026 |
|---|---|
| Matriz funcional alinhada à baseline POLY-REQ-001 v0.5, com operações permitidas/negadas e rastreabilidade | **Atualizada nesta revisão documental; integração na `main` depende da PR** |
| Parecer e aprovação funcional do PO registrados | **Concluído** — parecer atualizado e aprovação limitada ao escopo funcional |
| Casos positivos e negativos definidos conforme regras confirmadas | **Concluído em nível de especificação** — execução dos testes reais permanece fora desta issue/#101 |
| Revisão independente do SQA | **Pendente** |
| Revisão técnica da PR e checks aplicáveis | **Pendente até conclusão da PR** |
| RLS de domínio e testes reais de isolamento | **Escopo da #101; não marcar como concluído na #100** |
| Implementação de auditoria/retenção | **Escopo da #102; não marcar como concluído na #100** |

**Regra de encerramento:** manter a #100 aberta até que a matriz revisada seja integrada por PR, o SQA registre seu parecer independente, a revisão técnica/checks da entrega documental estejam concluídos e eventuais apontamentos desta revisão sejam tratados. A implementação de RLS/domínio e de auditoria/retenção deve ser acompanhada nas Issues #101 e #102, sem duplicar seus critérios na #100.
