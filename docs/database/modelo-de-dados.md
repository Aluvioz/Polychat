# Modelo de dados — Polychat

- **Identificador:** POLY-DATA-001
- **Versão:** 0.3 — 20/11/2026
- **Status:** Modelo lógico conceitual com escopo funcional validado pelo PO; schema físico, DDL e migrations não aprovados
- **Issue de referência:** #99 — Modelar schema PostgreSQL e migrations iniciais
- **ADR relacionada:** ADR-005 — Banco de dados e modelo de dados (**Proposed**)
- **Stack definida para o projeto:** Supabase + Vercel, conforme orientação recebida em aula; PostgreSQL é utilizado via Supabase, enquanto Vercel atende à hospedagem/deploy da aplicação

> **Importante:** este documento registra o modelo lógico conceitual do Polychat e as decisões funcionais validadas pelo PO para a baseline v0.5. Distingue regras confirmadas, evidências legadas e propostas técnicas. Não representa aprovação do schema físico, não aprova tecnologia de autenticação/armazenamento nem autoriza, por si só, a criação ou aplicação de migrations.

## 1. Objetivo

Documentar as entidades, atributos candidatos, relacionamentos, regras de integridade e dependências necessárias para persistir os dados do MVP do Polychat.

O modelo serve como referência de produto e domínio para a Issue #99. Esta revisão registra decisões funcionais do PO; não aprova a estrutura física nem antecipa a implementação de migrations.

## 2. Escopo e fontes

O modelo considera:

- A Issue #99, que solicita modelar perfis, conversas, participantes, mensagens, anexos, eventos de auditoria e persistência dos controles administrativos definidos.
- A ADR-005, atualmente **Proposed**, que deve ser alinhada à stack definida para o projeto: PostgreSQL via Supabase e aplicação hospedada/deployada na Vercel.
- A baseline vigente **POLY-REQ-001 v0.5 — 20/11/2026**, os requisitos RF-001 a RF-023, as regras RN-001 a RN-025 e as decisões consolidadas da FORD v2.
- A migration existente de perfis `supabase/migrations/202611160001_profiles_roles_and_account_status.sql`, que constitui o scaffold inicial da integração com Supabase Auth e deve ser avaliada como parte da stack do projeto.
- A Q-025, que mantém registrada a análise de compatibilidade entre a stack Supabase + Vercel definida para o projeto e a exigência de infraestrutura sob controle da FORD.

As decisões Q-003, Q-005, Q-007 a Q-012, Q-016 e Q-024 foram respondidas/alinhadas no nível funcional e não devem continuar classificadas como dúvidas de produto. As decisões adicionais de produto tomadas nesta versão estão registradas nas seções 11 e 12.

### 2.1 Convenção de status usada neste documento

| Status | Significado |
|---|---|
| **Implementado no repositório** | Existe no repositório em migration versionada. Não significa, por si só, que foi aplicado ou homologado no ambiente Supabase do projeto. |
| **Confirmado** | Há requisito ou regra de negócio que sustenta a necessidade funcional da informação. |
| **Proposta técnica** | É uma solução preliminar para discussão e revisão; ainda não deve ser tratada como decisão aprovada. |
| **Pendente** | Depende de decisão de negócio, aprovação, detalhamento ou validação técnica. |
| **Fora do escopo confirmado** | Não deve ser incluído no MVP com base nas informações atuais. |

## 3. Premissas e limites

1. A stack definida para o projeto é Supabase + Vercel: Supabase fornece PostgreSQL e os serviços backend previstos (como Auth, Storage e RLS), enquanto Vercel hospeda/deploya a aplicação. Os detalhes de configuração e implantação devem ser revisados tecnicamente; a compatibilidade com as restrições da FORD é acompanhada na Q-025.
2. O escopo inicial é uma única organização, a FORD. Não adicionar `tenant_id` ou arquitetura multi-tenant sem mudança explícita de escopo.
3. Existem somente dois perfis de aplicação: `user` e `ti`. Participação em conversa é um vínculo de domínio, não um terceiro perfil.
4. Somente TI administra contas, grupos e participantes conforme RF-003 a RF-006. Usuários não entram nem saem voluntariamente de grupos.
5. Conversas individuais e em grupo, mensagens com texto e/ou anexos, confirmação de leitura e contagem de não lidas fazem parte do escopo funcional.
6. Cada par de usuários possui uma única conversa individual; uma nova iniciação pelo mesmo par reutiliza a conversa existente.
7. A remoção de participante encerra seu período de participação e revoga imediatamente o acesso ao histórico e anexos anteriores. Uma reinclusão cria novo período e não restaura acesso às mensagens anteriores à nova inclusão.
8. Em grupos desativados, os participantes atuais mantêm acesso somente de leitura ao histórico; em grupos encerrados, o histórico fica disponível apenas para consulta administrativa do TI até eventual reativação.
9. TI pode consultar e exportar qualquer conversa sem justificativa ou aprovação prévia de outra pessoa; essas operações são auditadas.
10. Mensagens, anexos, alertas e registros administrativos não sofrem exclusão automática enquanto o sistema operar. Exclusões dependem de autorização do TI e respeitam a retenção e o ciclo de backups definidos na baseline.
11. O catálogo de configurações persistentes do TI está delimitado à lista/regras de detecção e às quotas individuais/capacidade total de anexos. Não criar tabela genérica de configurações sem necessidade demonstrada.
12. O documento valida significado e regras funcionais. Tipos SQL, normalização, chaves, constraints, índices, FKs, RLS, estratégia física e migrations permanecem fora desta aprovação do PO.

## 4. Diagrama lógico preliminar

O diagrama representa relações conceituais de domínio, não um DER físico aprovado. A identidade autenticada é fornecida pelo Supabase Auth, integrado à camada de perfis do Polychat.

~~~mermaid
erDiagram
    PROFILES ||--o{ CONVERSATIONS : "cria"
    CONVERSATIONS ||--o{ MEMBERSHIPS : "possui periodos de participacao"
    PROFILES ||--o{ MEMBERSHIPS : "participa"
    CONVERSATIONS ||--o{ MESSAGES : "contem"
    PROFILES ||--o{ MESSAGES : "envia"
    MESSAGES ||--o{ ATTACHMENTS : "pode_conter"
    MESSAGES ||--o{ MESSAGE_READS : "recebe_confirmacoes"
    PROFILES ||--o{ MESSAGE_READS : "registra_leitura"
    PROFILES ||--o{ AUDIT_EVENTS : "executa"
    CONVERSATIONS o|--o{ AUDIT_EVENTS : "pode_ser_alvo"
    MESSAGES ||--o{ SECURITY_ALERTS : "pode_gerar"
~~~

### 4.1 Leitura do diagrama

- `profiles` representa a conta funcional do Polychat, vinculada à identidade autenticada pelo Supabase Auth.
- Uma conversa é individual (`direct`) ou em grupo (`group`).
- Cada par de usuários possui uma única conversa individual; a conversa é reutilizada em novas iniciações pelo mesmo par.
- `memberships` registra períodos de participação. Uma remoção encerra o período vigente; uma reinclusão cria um novo período sem restaurar acesso ao histórico anterior à nova entrada.
- Uma conversa contém mensagens. Cada mensagem possui um autor e deve conter texto não vazio, pelo menos um anexo válido ou ambos.
- `message_reads` representa conceitualmente a confirmação por mensagem e por leitor, com o instante em que a mensagem foi marcada como lida. Em grupos, o autor da mensagem pode consultar quais participantes a leram e em qual horário.
- Uma mensagem pode conter até cinco anexos PDF/JPEG. Limite individual de armazenamento e capacidade total são administrados pelo TI.
- `audit_events` registra operações administrativas previstas nos requisitos, incluindo consultas, exportações, alterações/exclusões de mensagens e ações sobre anexos e configurações.
- `security_alerts` registra ocorrências geradas por regras determinísticas de detecção e encaminhadas à fila de revisão do TI.
- A configuração persistente limita-se às regras/lista de detecção e às quotas individuais e totais de anexos. A forma física de persistência será definida tecnicamente; não se presume uma tabela genérica `configs`.

## 5. Entidades e dicionário de dados preliminar

Os nomes e atributos a seguir descrevem necessidades de domínio e candidatos de modelagem. Tipos SQL, normalização, constraints, FKs e estrutura física continuam sujeitos à definição técnica e não são aprovados por este parecer do PO.

### 5.1 profiles — perfis e estado das contas

**Necessidade funcional:** confirmada. A migration existente é um artefato legado/parcial, não a arquitetura-alvo aprovada.

**Finalidade:** representar a conta funcional do Polychat, seu identificador de acesso e seu perfil/estado, associada à identidade autenticada pelo Supabase Auth.

| Campo conceitual | Obrigatório | Regra funcional | Situação |
|---|---:|---|---|
| id | Sim | Identificador interno estável da conta. Não deve depender de um serviço externo como decisão de produto. | Necessidade confirmada; tipo/geração técnica a definir |
| username | Sim | Nome de usuário único na organização, definido e alterável exclusivamente pelo TI. | RF-001/RN-005 confirmados |
| role | Sim | Somente `user` ou `ti`. Todos os TIs possuem poderes equivalentes. | Confirmado |
| is_active | Sim | Conta inativa não autentica nem executa operações protegidas; desativação revoga sessões e acessos imediatamente. | Confirmado |
| created_at / updated_at | Sim | Datas de criação e atualização administrativa. | Necessidade de rastreabilidade; detalhe técnico |

**Regras conhecidas:**

- Somente TI cria e administra contas Usuário e TI; não há auto cadastro ou convite externo.
- O nome de usuário é único e pode ser alterado pelo TI. A forma de comparação/normalização para unicidade é detalhe técnico, sem alterar a regra de unicidade.
- O perfil possui somente `user` e `ti`; não criar papel de proprietário, administrador principal ou moderador.
- Credenciais não devem ser duplicadas em uma tabela genérica de perfil. A autenticação e a recuperação de senha devem utilizar os fluxos definidos para o Supabase Auth, com controles administrativos do perfil TI conforme os requisitos.
- Desativação é bloqueio lógico e revoga sessões, mas não apaga histórico de mensagens, anexos ou auditoria.
- Dados pessoais adicionais, como matrícula ou departamento, não devem ser adicionados sem requisito e fonte confirmados.

**Evidência existente:** a migration `202611160001_profiles_roles_and_account_status.sql` vincula `profiles.id` a `auth.users(id)` com `ON DELETE CASCADE` e inclui RLS específica de perfis. Ela constitui o scaffold inicial de integração com Supabase Auth; sua revisão técnica deve preservar o histórico de domínio, evitando exclusão em cascata de conversas, mensagens, anexos ou auditoria.

### 5.2 conversations — conversas individuais e em grupo

**Necessidade funcional:** confirmada. Não há migration de domínio identificada.

| Campo conceitual | Obrigatório | Regra funcional | Situação |
|---|---:|---|---|
| id | Sim | Identificador estável da conversa. | Proposta técnica |
| kind | Sim | `direct` ou `group`. | Derivado dos requisitos |
| name | Condicional | Identificação/nome de grupo; não se aplica à conversa individual. | RF-005 |
| created_by_profile_id | Sim | Autor da criação; grupos são criados somente pelo TI. | Proposta técnica alinhada |
| status | Sim para grupo | Grupo ativo, desativado ou encerrado. | Estados funcionais definidos nesta versão; representação física a definir |
| created_at / updated_at | Sim | Instantes de criação/atualização. | Proposta técnica |

**Regras funcionais de conversa individual:**

- Uma conversa individual corresponde a exatamente um par de usuários.
- Deve existir no máximo uma conversa individual por par, independentemente de quem iniciou o primeiro contato.
- Quando qualquer participante iniciar novamente uma conversa com o mesmo par, o sistema reutiliza a conversa já existente; não cria um segundo histórico paralelo.
- A ordenação canônica do par e a restrição física de unicidade são decisões de implementação, não DDL aprovado pelo PO.

**Regras funcionais de grupos:**

- Somente TI cria, encerra, desativa e reativa grupos e administra participantes.
- **Ativo:** participantes com membership vigente podem consultar o histórico e enviar mensagens.
- **Desativado:** não permite envio de novas mensagens; participantes com membership vigente continuam podendo consultar o histórico em modo de leitura. TI pode reativar o grupo.
- **Encerrado:** não permite envio nem consulta por Usuários; o histórico permanece preservado e disponível ao TI para consulta administrativa. TI pode reativar o grupo conforme RF-005; na reativação, somente memberships ainda vigentes recuperam acesso.
- Remover um participante é uma ação distinta de desativar/encerrar o grupo e encerra o período de participação daquela pessoa.
- Conversas individuais não recebem funções de arquivamento/encerramento pelo Usuário nesta definição de MVP.

### 5.3 memberships — períodos de participação em conversas

**Necessidade funcional:** confirmada. Não há migration identificada.

| Campo conceitual | Obrigatório | Regra funcional | Situação |
|---|---:|---|---|
| id | Sim | Identifica um período de participação. | Proposta técnica |
| conversation_id | Sim | Conversa à qual o período pertence. | Proposta técnica |
| profile_id | Sim | Conta participante. | Proposta técnica |
| added_by_profile_id | Para grupos | TI que incluiu o participante. | RF-006 |
| joined_at | Sim | Início do período de participação. | Regra confirmada |
| ended_at | Quando removido | Instante em que TI removeu o participante e encerrou aquele período. | Regra confirmada |
| ended_by_profile_id | Quando removido | Identifica o TI responsável pela remoção. | Regra confirmada |
| last_read_at | Não | Cursor técnico possível para apoio à contagem de não lidas; não substitui as confirmações individuais por mensagem. | Alternativa técnica, não decisão de DDL |

**Regras funcionais:**

- Um perfil pode participar de várias conversas; uma conversa pode possuir vários participantes, exceto conversa individual, que corresponde a um par.
- Em grupos, somente TI inclui/remove participantes. Usuários não se auto incluem nem saem voluntariamente.
- Remoção encerra o período vigente e revoga imediatamente acesso às mensagens e anexos anteriores, inclusive links já emitidos.
- **Reinclusão após remoção:** TI pode adicionar novamente a mesma conta. A reinclusão inicia um novo período de membership; não reabre nem prolonga o período anterior.
- Após a reinclusão, a pessoa acessa somente mensagens e anexos criados a partir do novo `joined_at`. Mensagens e anexos anteriores à nova inclusão, inclusive os vistos em período anterior de participação, continuam inacessíveis a essa pessoa.
- A remoção não apaga mensagens, anexos ou eventos de auditoria do domínio.
- A desativação de conta bloqueia operações protegidas independentemente da existência de membership.
- Encerrar/desativar um grupo não apaga nem encerra automaticamente o histórico de membership; a autorização efetiva também considera o estado do grupo.

### 5.4 messages — mensagens

**Necessidade funcional:** confirmada. Não há migration identificada.

| Campo conceitual | Obrigatório | Regra funcional | Situação |
|---|---:|---|---|
| id | Sim | Identificador da mensagem. | Proposta técnica |
| conversation_id | Sim | Conversa à qual pertence. | Proposta técnica |
| sender_profile_id | Sim | Autor autenticado e autorizado no momento do envio. | Regra confirmada |
| body | Condicional | Texto da mensagem; pode ser vazio/nulo somente quando houver pelo menos um anexo válido. | Decisão de produto nesta versão |
| created_at | Sim | Instante de criação confirmado pelo servidor. | Regra confirmada |
| edited_at / edited_by_profile_id | Quando editada pelo TI | Identificação temporal da edição administrativa. | Necessidade de auditoria; estrutura física a definir |
| deleted_at / deleted_by_profile_id | Quando excluída pelo TI | Identificação temporal da exclusão administrativa. | Necessidade de auditoria; estrutura física a definir |

**Regras funcionais:**

- Toda mensagem pertence a uma única conversa e possui um autor.
- Uma mensagem válida contém texto não vazio, um ou mais anexos válidos, ou ambos. Mensagem sem texto e sem anexo não é permitida.
- O limite de anexos por mensagem é cinco.
- O autor deve possuir conta ativa e autorização vigente para enviar naquela conversa.
- Mensagens em grupo ficam disponíveis conforme membership e estado do grupo.
- Usuários comuns não podem editar nem excluir mensagens.
- TI pode editar e excluir mensagens a qualquer momento; operações devem gerar auditoria com operador, instante, ação e recurso afetado.
- Não foi exigida pela baseline uma tabela de versões completas do conteúdo anterior. Não criar histórico de versões como requisito funcional adicional; o detalhe de preservação do registro de alteração/exclusão deve respeitar a trilha de auditoria e a retenção definidas.
- A ordenação/paginação utiliza o instante de criação e critérios técnicos consistentes, sem alterar a experiência definida em RF-008/RF-009.

### 5.5 attachments — metadados dos anexos

**Necessidade funcional:** confirmada. Não há migration de domínio identificada.

| Campo conceitual | Obrigatório | Regra funcional | Situação |
|---|---:|---|---|
| id | Sim | Identificador do anexo. | Proposta técnica |
| message_id | Sim | Mensagem à qual o anexo pertence. | Regra confirmada |
| storage_reference | Sim | Referência ao objeto armazenado em bucket privado do Supabase Storage; não é URL pública. | Proposta técnica |
| original_filename | Sim | Nome recebido, tratado como dado não confiável. | Proposta técnica |
| mime_type / size_bytes | Sim | Tipo real e tamanho efetivo do arquivo. | Regras confirmadas |
| scan_status / scan_result / scanned_at | Necessidade funcional | Estado e evidência da análise antimalware. | Necessidade confirmada; estrutura a definir |
| created_at | Sim | Instante de registro. | Proposta técnica |

**Regras funcionais:**

- Formatos aceitos: somente PDF e JPEG.
- Tamanho máximo: 10 MB por arquivo; até cinco arquivos por mensagem.
- O TI administra limites individuais de armazenamento e capacidade total. Não existe quota específica por conversa.
- PDF protegido por senha é recusado.
- A validação considera o conteúdo real, não apenas a extensão ou o MIME informado pelo cliente.
- A análise antimalware ocorre dentro da infraestrutura da FORD, antes da disponibilização.
- Scanner indisponível, falha ou resultado inconclusivo mantém o anexo bloqueado; mensagens de texto continuam funcionando.
- TI pode liberar excepcionalmente qualquer arquivo bloqueado por ação autenticada e auditada. Usuários não podem contornar o scanner.
- Download exige autorização vigente sobre a conversa/mensagem. Links temporários possuem validade máxima de cinco minutos.
- A remoção de participante revoga imediatamente links já emitidos e o acesso a anexos anteriores.
- TI pode baixar anexos durante investigações, com registro em auditoria.
- Não há exclusão automática de anexos enquanto o sistema operar; exclusões seguem autorização do TI e a política de retenção.

### 5.6 audit_events — eventos de auditoria

**Necessidade funcional:** confirmada; estrutura técnica detalhada vinculada à #102.

**Finalidade:** registrar as operações administrativas e de segurança definidas na baseline, permitindo identificar operador, instante, ação, recurso afetado e resultado/metadados necessários.

| Campo conceitual | Obrigatório | Regra funcional | Situação |
|---|---:|---|---|
| id | Sim | Identificador do evento. | Proposta técnica |
| actor_profile_id | Conforme evento | Identifica o operador TI quando a ação é administrativa; eventos automáticos podem exigir tratamento próprio. | Regra confirmada |
| event_type | Sim | Catálogo de ação auditada. | Catálogo definido funcionalmente; persistência em #102 |
| resource_type / resource_id | Conforme evento | Recurso afetado, como conta, conversa, grupo, mensagem, anexo, alerta ou configuração. | Necessidade confirmada |
| occurred_at | Sim | Instante confiável do evento. | Regra confirmada |
| outcome / metadata | Conforme evento | Resultado e metadados necessários, sem segredos ou conteúdo integral desnecessário. | Regra confirmada |
| reason | Não obrigatório | Não exigir justificativa para consulta/exportação de conversas nem encerramento de alerta. | Q-009/Q-008 resolvidas |

**Eventos que devem ser rastreáveis:**

- Login administrativo.
- Criação, alteração, desativação e reativação de contas.
- Criação, encerramento, ativação e desativação de grupos.
- Inclusão e remoção de participantes.
- Consulta e exportação de conversas.
- Revisão e encerramento de alertas.
- Download e liberação excepcional de anexos.
- Edição e exclusão administrativa de mensagens.
- Alterações das configurações permitidas.

**Regras funcionais:**

- Consultas e exportações de conversas por TI são permitidas sem justificativa, mas sempre auditadas.
- Encerramento de alerta não exige justificativa obrigatória.
- Somente TI consulta e gerencia registros de auditoria; Usuários comuns não podem ler, alterar ou excluir esses registros.
- Eventos não devem armazenar senhas, tokens, chaves secretas ou cópia integral do conteúdo das conversas por padrão.
- Mensagens, anexos, alertas e eventos de auditoria não sofrem exclusão automática enquanto o sistema operar. Exclusões autorizadas e descarte das cópias de backup devem gerar evidência de auditoria.
- Integridade, proteção contra alteração, acesso e retenção detalhados pertencem à implementação da #102; esta seção registra o conteúdo funcional necessário.

### 5.7 security_alerts — alertas de conteúdo suspeito

**Necessidade funcional:** confirmada por RF-014/RF-015 e pelas decisões Q-007/Q-008.

**Finalidade:** persistir ocorrência associada a mensagem sinalizada por regra determinística e permitir sua revisão pelo TI.

| Campo conceitual | Obrigatório | Regra funcional | Situação |
|---|---:|---|---|
| id | Sim | Identificador da ocorrência/alerta. | Proposta técnica |
| message_id | Sim | Mensagem que originou a ocorrência. | Regra confirmada |
| rule_reference | Sim | Identifica a regra/termo que gerou a sinalização. | Necessidade confirmada |
| detected_at | Sim | Instante de detecção. | Necessidade confirmada |
| severity | Sim | Baixa, média ou alta. | Regra confirmada |
| status | Sim | Aberto ou encerrado após revisão do TI. | Regra funcional derivada |
| reviewed_by_profile_id / reviewed_at | Quando encerrado | Identifica o TI e o instante da revisão/encerramento. | Necessidade de rastreabilidade |

**Regras funcionais:**

- Detecção automática determinística por lista de termos/regras mantida pelo TI, incluindo palavrões.
- Não há análise contextual nem uso de IA/serviço externo para analisar conteúdo.
- O conteúdo não pode ser enviado a terceiros para análise.
- Severidade e prazo: alta — imediatamente e em até uma hora; média — até um dia útil; baixa — até três dias úteis.
- TI analisa e pode encerrar alertas sem justificativa obrigatória.
- Sinalização gera alerta; não bloqueia automaticamente mensagem, usuário ou conta e não aplica punição automática.
- Falha do detector não pode ser apresentada como resultado limpo. O comportamento técnico de falha deve preservar a regra de produto sem introduzir bloqueio/punição automática.

### 5.8 Configurações persistentes — inventário funcional definido

**Status:** inventário funcional delimitado pelo PO conforme RF-014/RF-015, Q-018 e POLY-UX-DEC-001. A estrutura física de persistência não está aprovada.

| Configuração | Quem administra | Regra funcional | Observação para o modelo |
|---|---|---|---|
| Lista de termos/regras de detecção | TI | Mantém a lista/regras aplicadas pelo mecanismo determinístico, incluindo palavrões. | Persistir regras operacionais necessárias; alterações devem gerar auditoria. |
| Limite individual de armazenamento de anexos | TI | Define a quota individual por conta. | Parâmetro administrável; alteração auditada. |
| Capacidade total de armazenamento de anexos | TI | Define a capacidade total disponível. | Parâmetro administrável; alteração auditada. |

Não fazem parte desse inventário: segredos, tokens, credenciais, endpoints de infraestrutura, chaves de serviço ou parâmetros arbitrários de deploy. Limite de 10 MB por arquivo e máximo de cinco anexos por mensagem são regras fixas do produto, não parâmetros genéricos de configuração.

**Decisão do PO:** o inventário de configurações necessário ao escopo funcional da #99 está definido. Não é necessário manter a questão de produto aberta nem criar uma tabela genérica `configs` por conveniência. A estrutura de persistência, versionamento técnico e separação das entidades é matéria de implementação.

### 5.9 message_reads — confirmações de leitura por mensagem

**Necessidade funcional:** confirmada por RF-019. A granularidade funcional para grupos é definida nesta versão; a estrutura física permanece técnica.

| Campo conceitual | Obrigatório | Regra funcional | Situação |
|---|---:|---|---|
| message_id | Sim | Mensagem marcada como lida. | Regra confirmada |
| reader_profile_id | Sim | Participante que leu a mensagem. | Regra confirmada |
| read_at | Sim | Instante em que o sistema registrou a leitura. | Regra confirmada |

**Regras funcionais:**

- A leitura é registrada por mensagem e por participante, não apenas por conversa.
- Em conversa individual, o remetente pode visualizar o instante em que o destinatário leu sua mensagem.
- Em grupos, o remetente pode visualizar quais participantes leram cada mensagem enviada por ele e o horário registrado para cada leitura.
- A confirmação de leitura de uma mensagem não concede acesso à conversa nem substitui a autorização por membership.
- A lista de conversas apresenta o total de mensagens não lidas por conversa, conforme RF-007.
- `memberships.last_read_at` pode ser mantido como cursor auxiliar para contagem/consulta eficiente, mas sozinho não representa a confirmação individual por mensagem e não substitui o registro conceitual acima.
- O gatilho técnico exato para marcar uma mensagem como lida deve respeitar RF-019 e as regras de mensageria, sem modificar a visibilidade funcional definida.

## 6. Relacionamentos e cardinalidades

| Origem | Relação | Destino | Cardinalidade esperada | Observação funcional |
|---|---|---|---|---|
| profiles | cria | conversations | 1:N | Grupos são criados pelo TI; conversas individuais são iniciadas por um dos dois participantes. |
| conversations | possui | memberships | 1:N | Cada período de participação é representado separadamente. |
| profiles | participa por | memberships | 1:N | Um perfil pode participar de várias conversas e ter períodos distintos de participação no mesmo grupo. |
| conversations | contém | messages | 1:N | Mensagens pertencem a uma conversa. |
| profiles | envia | messages | 1:N | Cada mensagem possui um autor autorizado. |
| messages | pode conter | attachments | 1:0..5 | Mensagem pode ter texto, anexos ou ambos; no máximo cinco anexos. |
| messages | possui | message_reads | 1:N | Uma confirmação por mensagem e participante leitor. |
| profiles | registra | message_reads | 1:N | Um participante pode registrar leitura de muitas mensagens. |
| profiles | executa | audit_events | 1:N | Eventos administrativos identificam o operador quando aplicável. |
| conversations | pode ser alvo de | audit_events | 1:N | Consultas e exportações administrativas devem ser rastreáveis. |
| messages | pode gerar | security_alerts | 1:N | Uma mensagem pode gerar ocorrência(s) conforme regras determinísticas. |

### 6.1 Invariantes funcionais a preservar

- Uma mensagem não existe sem conversa e autor.
- Uma mensagem válida possui texto não vazio, pelo menos um anexo válido ou ambos; mensagem completamente vazia é inválida.
- Um anexo pertence a uma mensagem; o total por mensagem não ultrapassa cinco.
- Uma conversa individual possui exatamente dois participantes e é única por par de usuários.
- Uma mensagem em grupo só pode ser enviada por participante com membership vigente e conta ativa.
- Usuário removido perde imediatamente acesso ao histórico e anexos anteriores, inclusive após reinclusão em novo período.
- Grupo desativado é somente leitura para membros vigentes; grupo encerrado fica disponível somente para consulta administrativa do TI até eventual reativação.
- O acesso administrativo do TI a qualquer conversa não transforma o TI em participante e gera auditoria.
- Confirmações de leitura são por mensagem e participante; o autor visualiza a leitura de suas próprias mensagens.
- Desativação de conta, remoção de participante ou encerramento de grupo não apagam automaticamente mensagens, anexos ou eventos de auditoria.
- Exclusões administrativas de mensagens são realizadas somente pelo TI e geram evento de auditoria.

## 7. Constraints, integridade e índices candidatos

Os itens desta seção expressam invariantes funcionais e candidatos a restrições. Não constituem DDL aprovado.

### 7.1 Chaves e referências

- Novas entidades necessitam de identificadores internos estáveis; UUID é compatível com a stack Supabase/PostgreSQL e deve ser avaliado como padrão técnico, inclusive quanto à relação com os identificadores do Supabase Auth.
- Definir FKs entre perfis, conversas, períodos de participação, mensagens, anexos, confirmações de leitura, alertas e auditoria.
- Revisar ações `ON DELETE` de cada FK. Exclusão física de identidade/perfil não pode apagar em cascata conversas, mensagens, anexos, alertas ou auditoria.
- Desativação lógica de conta é o mecanismo funcional para revogar acessos e preservar histórico; não confundir com exclusão física.
- A relação de identidade deve ser integrada ao Supabase Auth, preservando a separação entre autenticação e perfil funcional.

### 7.2 Restrições candidatas

| Entidade | Restrição/invariante | Finalidade |
|---|---|---|
| profiles | Username único na organização; role limitada a `user` e `ti` | Cumprir RF-001/RF-002 e evitar duplicidade de login |
| conversations | `kind` limitado a `direct` e `group` | Impedir tipo inválido |
| conversations | No máximo uma conversa `direct` por par canônico de perfis | Reutilizar a conversa existente para o mesmo par |
| conversations | Estados de grupo coerentes com ativo, desativado e encerrado | Impedir envio/leitura fora das condições definidas |
| memberships | FKs para conversa e perfil; períodos separados após cada inclusão | Preservar histórico de participação |
| memberships | No máximo um período vigente por perfil/conversa | Evitar participação ativa duplicada |
| messages | FKs para conversa e autor | Preservar origem e autoria |
| messages | Texto não vazio ou ao menos um anexo válido | Impedir mensagem sem conteúdo |
| attachments | MIME PDF/JPEG, tamanho até 10 MB e até cinco por mensagem | Aplicar limites funcionais; quota individual/total é adicional |
| message_reads | Unicidade por mensagem e leitor; instante de leitura obrigatório | Representar confirmação individual por mensagem |
| audit_events | Eventos administrativos exigem operador/recurso/instante conforme tipo de evento | Assegurar rastreabilidade |
| security_alerts | Severidade baixa/média/alta e vínculo à mensagem/regra | Preservar ocorrência e fluxo de revisão |

### 7.3 Índices candidatos

- `memberships(profile_id, conversation_id)` para localizar conversas de um perfil.
- `memberships(conversation_id, profile_id)` para listar participantes e validar participação.
- Chave/índice que permita localizar a conversa individual pelo par canônico de usuários.
- `messages(conversation_id, created_at)` para paginação e ordenação.
- `attachments(message_id)` para recuperar anexos de uma mensagem.
- `message_reads(message_id, reader_profile_id)` para consultar recibos de leitura.
- `audit_events(actor_profile_id, occurred_at)` e `audit_events(conversation_id, occurred_at)` para trilhas de auditoria.
- `security_alerts(status, severity, detected_at)` como candidato para fila TI.

Seletividade, ordenação, custo de escrita e índices compostos devem ser avaliados com as consultas reais e o volume inicial previsto. Não criar índices indiscriminadamente.

## 8. Segurança, identidade e acesso aos dados

A autenticação do Polychat utiliza Supabase Auth; os dados relacionais utilizam PostgreSQL no Supabase e os arquivos podem utilizar Supabase Storage privado. A aplicação é hospedada/deployada na Vercel. Configuração, RLS e integração precisam ser revisadas tecnicamente e evidenciadas nos ambientes previstos.

Princípios funcionais que o modelo deve suportar:

1. Identidade e conta ativa são verificadas no servidor; não confiar em `profile_id`, role, estado ou membership enviados pelo cliente.
2. Role e membership são conceitos diferentes. `ti` permite somente operações administrativas definidas; `user` depende de membership vigente para acessar conversas.
3. Usuário só lê conversas das quais participa; TI pode consultar qualquer conversa em função administrativa, com auditoria.
4. Remoção encerra o período de participação e revoga imediatamente acesso a mensagens, anexos e links anteriores. A reinclusão não restaura acesso ao histórico anterior à nova entrada.
5. Estado do grupo é considerado em todas as operações: desativado permite somente leitura aos membros vigentes; encerrado restringe a consulta a TI até eventual reativação.
6. Download de anexo exige autorização vigente; link conhecido não substitui autorização e links emitidos devem ser revogados imediatamente após perda de acesso.
7. Operações administrativas de TI e alterações de configurações previstas geram eventos de auditoria.
8. Falha na identificação, verificação de conta, membership ou autorização não concede acesso.
9. Nenhum segredo, token ou chave privilegiada pode ser exposto ao cliente. A exigência da FORD de não permitir acesso/processamento por terceiros deve ser conciliada com o uso de Supabase + Vercel na Q-025; não declarar conformidade antes dessa análise.

Os detalhes de configuração do Supabase Auth, PostgreSQL/RLS, Storage privado, integração server-side e deploy na Vercel permanecem decisões de implementação e evidência técnica das issues correspondentes. A stack está definida para o projeto; a Q-025 acompanha sua compatibilidade com as restrições registradas pela FORD. Esta seção não declara controles em funcionamento.

## 9. Retenção, exclusão e histórico

As regras funcionais de retenção e exclusão estão definidas na baseline POLY-REQ-001 v0.5 e na RN-021; não permanecem como pergunta de produto em aberto.

- Mensagens, anexos, alertas, logs de auditoria e registros administrativos não possuem exclusão automática enquanto o sistema operar.
- TI autoriza exclusões e decide quando preservar dados durante investigações.
- Backups diários de banco e anexos são retidos por 12 meses.
- Após exclusão autorizada, os dados deixam as cópias de backup ao final do ciclo de retenção aplicável; o descarte deve ser evidenciado em auditoria.
- Desativar conta revoga sessões/acessos, mas preserva o histórico.
- Remover participante encerra acesso daquela pessoa; não apaga mensagens/anexos da conversa.
- Reincluir participante não restaura acesso ao conteúdo anterior à nova inclusão.
- Desativar grupo impede novos envios, mas mantém histórico em modo de leitura para membros vigentes.
- Encerrar grupo restringe a consulta de Usuários e preserva o histórico para consulta administrativa do TI. A reativação pelo TI restaura o acesso somente para memberships vigentes.
- Edição e exclusão de mensagens pelo TI são operações administrativas auditadas. O requisito não determina uma tabela de versões completas do conteúdo anterior.

A implementação dos mecanismos de retenção, descarte, backups e integridade permanece no escopo da #102. O modelo não deve introduzir cascatas, exclusões ou expirações que contradigam as regras acima.

## 10. Rastreabilidade com requisitos e issues

| Elemento do modelo | Requisitos / regras | Issues e decisões relacionadas |
|---|---|---|
| profiles | RF-001 a RF-004; RN-001 a RN-005 | #99, #103, #104, #105; ADR-004; Q-005 |
| conversations | RF-005, RF-007 a RF-010; RN-006, RN-007, RN-010 | #99, #107, #109, #110; decisões de unicidade e ciclo de vida nesta versão |
| memberships | RF-005, RF-006, RF-008, RF-010; RN-007 | #99, #100, #101; decisões de remoção/reentrada nesta versão |
| messages | RF-008 a RF-010, RF-019, RF-020; RN-006, RN-007, RN-014 | #99, #109, #110, #111; ADR-007; mensagem com anexo e recibos de leitura |
| message_reads | RF-007, RF-019 | #99, #111, #112, #113; recibo por mensagem e leitor definido nesta versão |
| attachments | RF-011 a RF-013; RN-008, RN-011; RNF-010 | #99, #114, #115, #116, #117; Q-004/Q-011 respondidas; ADR-008 |
| audit_events | RF-016, RF-020, RF-021, RF-022; RN-014, RN-021; RNF-004 e RNF-011 | #99, #102, #121, #124; Q-009/Q-010 respondidas; ADR-010 |
| security_alerts | RF-014, RF-015; RN-012, RN-013 | #99, #122, #123; Q-007/Q-008 respondidas; ADR-010 |
| Configurações TI | RF-014/RF-015; RN-003; Q-018 | #99; lista/regras de detecção e quotas de anexos inventariadas nesta versão |

## 11. Decisões de produto consolidadas nesta versão

As questões históricas Q-003, Q-005, Q-007, Q-008, Q-009, Q-010, Q-011, Q-016 e Q-024 foram respondidas/alinhadas na baseline v0.5. As lacunas complementares necessárias para o modelo conceitual foram decididas pelo PO em 20/11/2026:

| Tema | Decisão funcional | Reflexo conceitual no modelo |
|---|---|---|
| Conversa individual por par | Existe uma única conversa individual por par de usuários; nova iniciação reutiliza a conversa existente. | Unicidade por par em `conversations`; exatamente dois participantes. |
| Mensagem somente com anexo | Permitida, desde que exista ao menos um anexo válido. Mensagem vazia, sem texto e sem anexo, não é permitida. | `body` é condicional; mensagem exige texto não vazio ou anexo. |
| Leitura em grupos | Confirmação por mensagem e por participante. O autor visualiza quais participantes leram sua mensagem e o horário de cada leitura. | Relação conceitual `message_reads` por mensagem/leitor/instante; `last_read_at` pode ser cursor auxiliar, não substituto. |
| Reinclusão após remoção | TI pode reincluir a pessoa. A reinclusão inicia novo período; acesso fica limitado às mensagens/anexos criados a partir da nova entrada. | Histórico de períodos em `memberships`; novo vínculo não reabre o anterior. |
| Grupo desativado | Impede novos envios; participantes vigentes mantêm consulta ao histórico em modo de leitura. TI pode reativar. | Estado desativado separado de encerrado. |
| Grupo encerrado | Usuários deixam de consultar/enviar; histórico permanece disponível ao TI. TI pode reativar conforme RF-005. | Estado encerrado com preservação histórica; acesso de Usuário só retorna após reativação e se membership estiver vigente. |
| Configurações persistentes | Inventário limitado à lista/regras de detecção e às quotas individuais/capacidade total de anexos. | Necessidade de persistência identificada sem impor tabela genérica `configs`. |

As decisões acima são decisões de produto quanto ao comportamento esperado. Elas não definem como implementar unicidade, períodos, confirmações de leitura, estados, constraints ou persistência.

### 11.1 Dependência arquitetural que permanece fora da decisão de produto

A Q-025 continua aberta para documentar e tratar a compatibilidade entre a stack definida para o projeto (Supabase + Vercel) e as restrições da FORD relativas a hospedagem, armazenamento e processamento de dados por terceiros. A stack não deve ser considerada obsoleta ou substituída por inferência; a análise deve registrar os impactos, riscos e encaminhamentos sem alterar as regras funcionais aprovadas.

## 12. Parecer do Product Owner — 20/11/2026

**Resultado: escopo funcional conceitual validado e atualizado para a baseline POLY-REQ-001 v0.5.**

O PO ratifica como núcleo do modelo as entidades `profiles`, `conversations`, `memberships`, `messages`, `attachments` e `audit_events`; confirma `security_alerts` como entidade do domínio e `message_reads` como necessidade conceitual para cumprir RF-019. O inventário funcional de configurações também está delimitado nesta versão.

### Decisões ratificadas

1. **Organização e perfis:** organização única FORD, sem multi-tenancy; apenas perfis `user` e `ti`.
2. **Identidade e contas:** nome de usuário único definido/alterado pelo TI; desativação revoga acesso e preserva histórico. A identidade é autenticada pelo Supabase Auth; a integração com `profiles` deve respeitar os papéis `user` e `ti`.
3. **Conversas individuais:** uma conversa por par de usuários, reutilizada em novas iniciações.
4. **Participação em grupos:** somente TI inclui/remove; não há saída voluntária; remoção revoga acesso imediatamente; reinclusão cria novo período e não restaura acesso às mensagens anteriores.
5. **Ciclo de vida dos grupos:** grupos desativados ficam em modo somente leitura para participantes vigentes; grupos encerrados ficam disponíveis apenas ao TI até eventual reativação.
6. **Mensagens:** pode haver texto, anexo(s) ou ambos, mas não mensagem vazia; TI pode editar/excluir e as ações são auditadas; usuários comuns não editam/excluem.
7. **Leitura:** confirmação por mensagem e participante, com horário; em grupos, o autor pode ver quais participantes leram suas próprias mensagens e quando. Contagem de não lidas segue RF-007/RF-019.
8. **Anexos:** PDF/JPEG, até 10 MB por arquivo, até cinco arquivos por mensagem, quotas individuais e capacidade total administradas pelo TI, sem quota por conversa; antimalware interno à FORD, bloqueio em falha/inconclusão e liberação excepcional autenticada/auditada pelo TI.
9. **Alertas:** detecção determinística por lista/regras mantidas pelo TI, severidades e prazos definidos; sem bloqueio ou punição automática.
10. **Auditoria e retenção:** consultas/exportações/ações administrativas auditadas; sem justificativa obrigatória para consulta/exportação/encerramento de alerta; retenção e backups conforme RN-021.
11. **Configurações:** inventário restrito à lista/regras de detecção e às quotas individuais/capacidade total de anexos; sem tabela genérica aprovada por inferência.

### Limites explícitos desta validação

Esta aprovação é exclusivamente de produto/negócio e não aprova:

- normalização, DER físico, tipos SQL, PKs, FKs, constraints, índices ou particionamento;
- estrutura física de `message_reads`, `memberships`, `security_alerts` ou configurações;
- policies RLS, triggers, funções privilegiadas, grants ou comportamento físico de cascatas;
- desenho físico e operacional detalhado de Supabase Auth, PostgreSQL/RLS, Supabase Storage, Realtime, integração server-side e deploy na Vercel;
- criação/aplicação de migrations ou homologação em ambiente da FORD.

A stack do projeto é Supabase + Vercel, conforme orientação recebida em aula. A ADR-005 continua com status Proposed e deve ser alinhada a essa direção técnica pelos responsáveis; a Q-025 permanece para tratar a compatibilidade com as restrições registradas pela FORD. A migration Supabase existente é o scaffold inicial da solução, não um artefato a ser descartado.

**Conclusão do PO:** o escopo funcional conceitual do modelo está validado para a baseline v0.5 e as lacunas de produto listadas na seção 11 estão decididas. A Issue #99 continua aberta; este parecer não declara schema físico, migrations ou implementação concluídos.

## 13. Registro das atividades de produto nesta versão

- [x] PO ratifica o núcleo conceitual: `profiles`, `conversations`, `memberships`, `messages`, `attachments` e `audit_events`.
- [x] PO confirma `security_alerts` no domínio e a necessidade conceitual de `message_reads` para RF-019.
- [x] PO delimita o inventário funcional de configurações persistentes: regras/lista de detecção, quota individual e capacidade total de anexos.
- [x] PO decide unicidade de conversa individual por par de usuários.
- [x] PO decide a regra de mensagens compostas somente por anexos.
- [x] PO decide a granularidade e visibilidade das confirmações de leitura em grupos.
- [x] PO decide o comportamento de reinclusão de participante removido.
- [x] PO decide os efeitos funcionais de grupo desativado e encerrado.
- [x] PO atualiza o parecer funcional para a baseline POLY-REQ-001 v0.5.

Esta seção registra exclusivamente as decisões de produto concluídas. Não constitui encaminhamento, solicitação ou registro de revisão técnica/SQA e não marca como concluída nenhuma entrega de schema físico ou migration.

## 14. Limites do documento para uso em implementação

O modelo desta versão está validado somente no significado e nas regras funcionais de domínio. Ainda não é um schema físico aprovado nem uma autorização para criar/aplicar migrations.

A futura estrutura física deve preservar, sem alterar as decisões de produto:

- unicidade da conversa individual por par;
- histórico de períodos de membership e revogação/reentrada sem recuperação do histórico anterior;
- estado de grupos ativo, desativado e encerrado;
- validação de que a mensagem possui texto ou pelo menos um anexo;
- limites de anexos e quotas definidas pelo TI;
- confirmação de leitura por mensagem/participante;
- catálogo e rastreabilidade dos eventos administrativos;
- ocorrência de alertas com regras, severidade e revisão;
- retenção e preservação histórica previstas na RN-021;
- persistência somente das configurações identificadas no inventário;
- identidade, armazenamento e processamento de acordo com a stack definida (Supabase + Vercel), com os impactos frente às restrições da FORD tratados explicitamente na Q-025.

Qualquer escolha de tabela, campo, tipo, constraint, índice, FK, estratégia de autenticação, armazenamento, RLS ou migration permanece uma decisão de implementação. Uma solução física poderá variar desde que preserve os requisitos e não contradiga o parecer funcional do PO.

## 15. Histórico de revisões

| Versão | Data | Alteração | Estado |
|---|---|---|---|
| 0.1 | 18/11/2026 | Primeira proposta do modelo lógico, dicionário preliminar, relacionamentos, rastreabilidade e registro das decisões pendentes. | Proposta inicial |
| 0.2 | 19/11/2026 | Valida o escopo funcional das entidades centrais, inclui `security_alerts` e delimita configurações persistentes como dependentes de inventário. | Escopo conceitual validado pelo PO |
| 0.3 | 20/11/2026 | Atualiza a baseline para v0.5; alinha o modelo conceitual à stack Supabase + Vercel definida para o projeto; atualiza decisões de grupos, memberships, mensagens, anexos, auditoria, alertas e configurações; define unicidade de conversas individuais, mensagens só com anexo e leitura por mensagem/participante. | Escopo funcional conceitual validado pelo PO; schema físico e migrations não aprovados |

## 16. Referências internas

- Issue #99 — Modelar schema PostgreSQL e migrations iniciais.
- Issue #100 — Definir matriz de autorização e políticas RLS.
- Issue #101 — Implementar RLS e testes de isolamento.
- Issue #102 — Definir estratégia de auditoria e retenção de dados.
- Issue #122 — Implementar detecção de conteúdo suspeito e palavrões.
- ADR-005 — Banco de dados e modelo de dados.
- ADR-006 — Autorização server-side e RLS.
- ADR-008 — Storage e anexos.
- ADR-010 — Segurança, auditoria e monitoramento.
- POLY-REQ-001 — Baseline consolidada de requisitos e escopo MVP.
- POLY-REQ-001 v0.5; RF-001 a RF-023; RN-001 a RN-025; Q-003, Q-005, Q-007, Q-008, Q-009, Q-010, Q-011, Q-016, Q-018, Q-024 e Q-025.
