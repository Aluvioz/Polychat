# Modelo de dados — Polychat

- **Identificador:** POLY-DATA-001
- **Versão:** 0.2 — 19/11/2026
- **Status:** Proposta preliminar para revisão
- **Issue de referência:** #99 — Modelar schema PostgreSQL e migrations iniciais
- **ADR relacionada:** ADR-005 — Banco de dados e modelo de dados
- **Plataforma prevista:** PostgreSQL gerenciado pelo Supabase

> **Importante:** este documento registra o modelo lógico preliminar do Polychat. Ele separa estruturas já implementadas, necessidades confirmadas pelos requisitos e propostas técnicas ainda sujeitas à revisão. Não representa aprovação final do schema, não substitui as decisões pendentes de negócio e não autoriza, por si só, a criação ou aplicação de migrations.

## 1. Objetivo

Documentar as entidades, atributos candidatos, relacionamentos, regras de integridade e dependências necessárias para persistir os dados do MVP do Polychat.

O documento deve servir como referência comum para Product Owner, Tech Lead, desenvolvimento backend, SQA e TI durante a revisão do modelo e a preparação das migrations da Issue #99.

## 2. Escopo e fontes

O modelo considera:

- A Issue #99, que solicita modelar perfis, conversas, participantes, mensagens, anexos, eventos de auditoria e configurações.
- A ADR-005, atualmente em status Proposed, que propõe PostgreSQL no Supabase e menciona perfis, conversas, participantes, mensagens, anexos, alertas e auditoria.
- A baseline POLY-REQ-001 v0.3 e os requisitos funcionais, não funcionais e regras de negócio.
- A migration existente de perfis: **supabase/migrations/202611160001_profiles_roles_and_account_status.sql**.
- As questões em aberto Q-003, Q-005, Q-007, Q-008, Q-009, Q-010, Q-011, Q-016 e Q-024.

### 2.1 Convenção de status usada neste documento

| Status | Significado |
|---|---|
| **Implementado** | Existe no repositório em migration versionada. Não significa, por si só, que foi aplicado ou homologado em ambiente Supabase. |
| **Confirmado** | Há requisito ou regra de negócio que sustenta a necessidade funcional da informação. |
| **Proposta técnica** | É uma solução preliminar para discussão e revisão; ainda não deve ser tratada como decisão aprovada. |
| **Pendente** | Depende de decisão de negócio, aprovação, detalhamento ou validação técnica. |
| **Fora do escopo confirmado** | Não deve ser incluído no MVP com base nas informações atuais. |

## 3. Premissas e limites

1. O banco previsto para o MVP é PostgreSQL no Supabase, conforme direção técnica registrada na Issue #88 e na ADR-005 Proposed.
2. O escopo inicial é uma única organização, a FORD. Não se propõe adicionar tenant_id ou arquitetura multi-tenant sem mudança explícita de escopo.
3. Existem dois perfis de aplicação: user e ti. A relação de uma pessoa com uma conversa não cria um terceiro perfil nem um papel de autorização adicional.
4. A criação e a administração de grupos são responsabilidade do TI. Os membros incluídos podem enviar mensagens.
5. Conversas individuais e em grupo, mensagens textuais e anexos PDF/JPEG fazem parte do escopo funcional.
6. O TI pode consultar conversas para fins de segurança; a visão de produto exige que esse acesso seja registrado em auditoria.
7. A migration de profiles é a única migration de domínio identificada na baseline revisada. As demais entidades deste documento são propostas e ainda não existem como tabelas versionadas.
8. Regras pendentes não serão transformadas em restrições definitivas antes de decisão registrada.

## 4. Diagrama lógico preliminar

O diagrama apresenta os relacionamentos esperados para discussão. Ele não é um DER físico aprovado. AUTH_USERS representa a tabela mantida pelo Supabase Auth, fora do schema de domínio public.

~~~mermaid
erDiagram
    AUTH_USERS ||--|| PROFILES : "identidade"
    PROFILES ||--o{ CONVERSATIONS : "cria"
    CONVERSATIONS ||--o{ MEMBERSHIPS : "possui"
    PROFILES ||--o{ MEMBERSHIPS : "participa"
    CONVERSATIONS ||--o{ MESSAGES : "contem"
    PROFILES ||--o{ MESSAGES : "envia"
    MESSAGES ||--o{ ATTACHMENTS : "pode_conter"
    PROFILES ||--o{ AUDIT_EVENTS : "executa"
    CONVERSATIONS o|--o{ AUDIT_EVENTS : "pode_ser_alvo"
    MESSAGES ||--o{ SECURITY_ALERTS : "pode_gerar"
~~~

### 4.1 Leitura do diagrama

- Um registro de profiles corresponde à identidade de uma conta em auth.users.
- Uma conversa é individual ou em grupo.
- memberships associa perfis às conversas; é a relação que permite identificar participantes.
- Uma conversa pode conter várias mensagens; cada mensagem possui um autor.
- Uma mensagem pode possuir zero ou mais anexos. A quantidade máxima ainda precisa ser definida.
- Eventos de auditoria registram ações relevantes. A consulta administrativa de uma conversa deve gerar um evento associado ao operador e à conversa consultada.
- security_alerts aparece como entidade candidata, sujeita à decisão de escopo descrita na seção 12.
- A entidade de configurações ainda não aparece no DER porque o inventário de configurações persistentes não foi definido.

## 5. Entidades e dicionário de dados preliminar

Os tipos SQL abaixo são sugestões iniciais compatíveis com PostgreSQL. A revisão técnica poderá ajustar nomes e tipos, desde que preserve os requisitos e registre a decisão.

### 5.1 profiles — perfis e estado das contas

**Status:** Implementado parcialmente.

**Finalidade:** armazenar o perfil funcional e o estado da conta associada a uma identidade do Supabase Auth.

A migration existente define:

| Campo | Tipo atual | Obrigatório | Regra / observação | Status |
|---|---|---:|---|---|
| id | uuid | Sim | PK e FK para auth.users(id), com ON DELETE CASCADE na migration atual. | Implementado |
| role | text | Sim | Default user; CHECK limitado a user e ti. | Implementado |
| is_active | boolean | Sim | Default true; indica se a conta está ativa. | Implementado |
| created_at | timestamptz | Sim | Default now(). | Implementado |
| updated_at | timestamptz | Sim | Default now(); atualizado pelo trigger existente. | Implementado |

**Regras conhecidas:**

- O perfil aceita somente user e ti.
- A migration cria perfil padrão user quando uma identidade é criada em auth.users.
- A leitura de profiles está protegida por RLS; o usuário pode ler o próprio perfil e TI ativo pode consultar perfis conforme a policy existente.
- A escrita direta por anon e authenticated é revogada na migration.
- Alterações privilegiadas de papel e estado devem ocorrer por operação confiável no servidor.
- profiles.id é identificador interno vinculado ao Supabase Auth. Não deve ser confundido com o identificador que a pessoa digitará no login.

**Pontos de revisão:**

- Q-005 ainda define o identificador de login (e-mail institucional, matrícula, login próprio ou outro). Não adicionar campo de login por suposição.
- A migration atual usa ON DELETE CASCADE na relação com auth.users. Como o produto exige desativação de contas e pode precisar preservar histórico, o comportamento de exclusão física deve ser revisado à luz de Q-010 antes de qualquer processo de remoção definitiva.
- Dados de nome, matrícula, departamento ou outros atributos pessoais não devem ser adicionados sem necessidade e fonte de dados confirmadas.

### 5.2 conversations — conversas individuais e em grupo

**Status:** Proposta técnica. Não há migration identificada.

**Finalidade:** representar a unidade de comunicação que agrupa participantes e mensagens.

| Campo candidato | Tipo sugerido | Obrigatório | Regra / observação | Status |
|---|---|---:|---|---|
| id | uuid | Sim | Chave primária. | Proposta técnica |
| kind | text | Sim | Valores candidatos: direct e group, protegidos por CHECK. | Derivado dos requisitos |
| name | text | Não | Nome/identificação do grupo; aplicável quando kind = group. O RF-005 prevê identificação/nome do grupo. | Requisito confirmado; modelagem proposta |
| created_by_profile_id | uuid | Sim | FK para profiles.id; autor da criação. Para grupos, a operação deve respeitar a administração pelo TI. | Proposta técnica |
| created_at | timestamptz | Sim | Data de criação, default now(). | Proposta técnica |
| updated_at | timestamptz | Sim | Data de atualização; finalidade exata a validar. | Proposta técnica |

**Regras funcionais relacionadas:**

- Deve ser possível distinguir conversa individual de conversa em grupo.
- A criação de grupos é restrita ao TI.
- Uma conversa individual é entre dois usuários, conforme RF-009.
- Não participantes não podem ler nem enviar mensagens em uma conversa.
- O TI possui acesso administrativo de consulta conforme RF-016; esse acesso não deve depender de o TI ser membro da conversa.

**Decisões pendentes:**

- Se uma conversa individual entre o mesmo par de usuários deve ser única ou se podem existir conversas distintas entre o mesmo par.
- Como o sistema tratará encerramento, arquivamento ou desativação de grupos (Q-003).
- Se a conversa terá estado persistente e quais valores esse estado poderá assumir.
- Se conversas individuais também poderão ser encerradas ou ocultadas.

Não criar status, archived_at ou regra de unicidade entre pares como decisão definitiva antes dessas validações.

### 5.3 memberships — participação em conversas

**Status:** Proposta técnica. Não há migration identificada.

**Finalidade:** relacionar perfis às conversas e permitir verificar quem pode ler e enviar mensagens.

| Campo candidato | Tipo sugerido | Obrigatório | Regra / observação | Status |
|---|---|---:|---|---|
| id | uuid | Sim | Chave primária própria, para permitir histórico de períodos de participação caso isso seja aprovado. | Proposta técnica |
| conversation_id | uuid | Sim | FK para conversations.id. | Proposta técnica |
| profile_id | uuid | Sim | FK para profiles.id. | Proposta técnica |
| added_by_profile_id | uuid | Não | FK para profiles.id; indica quem incluiu o participante. | Proposta técnica |
| joined_at | timestamptz | Sim | Momento de entrada na conversa. | Proposta técnica |
| last_read_at | timestamptz | Não | Cursor candidato da última leitura do perfil naquela conversa, para apoiar a contagem de não lidas da Issue #111. A abordagem final deve ser validada tecnicamente. | Proposta técnica; rastreada à #111 |
| ended_at | timestamptz | Não | Momento de encerramento da participação, se aplicável. | Pendente de Q-003 |
| ended_by_profile_id | uuid | Não | FK para profiles.id; responsável pelo encerramento, se aplicável. | Pendente de Q-003 |

**Regras funcionais relacionadas:**

- Um perfil pode participar de várias conversas.
- Uma conversa pode ter vários participantes.
- Para grupos, o TI administra a inclusão e remoção de participantes.
- Uma conta inativa não deve participar de novas operações de envio.
- O envio e a leitura por usuários comuns devem verificar participação autorizada no servidor e no banco.

**Decisões pendentes:**

- Se o usuário pode sair voluntariamente de um grupo.
- Se um participante removido pode ser incluído novamente e como preservar o histórico de participação.
- Como distinguir saída voluntária, remoção pelo TI e encerramento do grupo (Q-003).
- Se a remoção deve encerrar a participação sem apagar mensagens anteriores.
- Se uma conversa individual sempre deve ter exatamente dois participantes ativos.
- A Issue #111 exige contagem de mensagens não lidas e marcação básica de leitura. O modelo deve permitir registrar o estado de leitura por participante/conversa; `last_read_at` é apenas uma alternativa candidata. Tech Lead/backend devem validar se ela atende aos cenários e à ordenação do histórico ou se será necessário outro cursor/estrutura. Não presumir recibos individuais por mensagem sem requisito adicional.

**Índices candidatos:** índice para localizar as conversas de um perfil (profile_id, conversation_id) e índice para listar participantes de uma conversa (conversation_id, profile_id). Se for aprovado o histórico de participações, revisar a unicidade para impedir mais de uma participação ativa do mesmo perfil na mesma conversa.

Não criar um papel como admin, owner ou moderator em memberships neste momento. A baseline define somente os perfis de aplicação user e ti; a administração de grupos pelo TI deve ser aplicada por autorização, não por um terceiro perfil implícito de participante.

### 5.4 messages — mensagens

**Status:** Proposta técnica. Não há migration identificada.

**Finalidade:** armazenar o conteúdo textual enviado em uma conversa e sua autoria.

| Campo candidato | Tipo sugerido | Obrigatório | Regra / observação | Status |
|---|---|---:|---|---|
| id | uuid | Sim | Chave primária. | Proposta técnica |
| conversation_id | uuid | Sim | FK para conversations.id. | Proposta técnica |
| sender_profile_id | uuid | Sim | FK para profiles.id; autor da mensagem. | Proposta técnica |
| body | text | A validar | Conteúdo textual. Definir se pode ser vazio quando a mensagem possuir apenas anexo. | Pendente de regra |
| created_at | timestamptz | Sim | Data/hora de criação, default now(). | Proposta técnica |

**Regras funcionais relacionadas:**

- A mensagem pertence a uma única conversa.
- Uma mensagem possui um único autor.
- O autor deve ser uma conta ativa e autorizada a enviar na conversa no momento da operação.
- Mensagens em grupo ficam disponíveis aos participantes autorizados.
- Usuários externos à conversa não podem ler nem enviar mensagens.
- A consulta administrativa pelo TI deve obedecer à governança definida para RF-016 e produzir evento de auditoria.

**Decisões pendentes:**

- Edição e exclusão de mensagens (Q-024).
- Se será necessário preservar versões anteriores de mensagens.
- Se mensagens podem conter somente anexos, sem texto.
- Regras de ordenação, paginação e eventual idempotência de envio.
- Estados de entrega/leitura, caso façam parte do escopo aprovado; não foram incluídos como atributos obrigatórios nesta versão porque precisam de rastreabilidade explícita a requisito.

edited_at, deleted_at, deleted_by_profile_id e tabelas de histórico são candidatos para discussão, não campos aprovados.

**Índice candidato:** (conversation_id, created_at) para paginação e ordenação das mensagens; avaliar índice adicional por autor conforme consultas reais e volume esperado (Q-016).

### 5.5 attachments — metadados dos anexos

**Status:** Proposta técnica. Não há migration identificada.

**Finalidade:** registrar os metadados e a localização dos arquivos anexados às mensagens. O conteúdo binário deve ser tratado pelo serviço de armazenamento privado previsto na ADR-008, não armazenado diretamente como coluna binária no PostgreSQL sem decisão arquitetural.

| Campo candidato | Tipo sugerido | Obrigatório | Regra / observação | Status |
|---|---|---:|---|---|
| id | uuid | Sim | Chave primária. | Proposta técnica |
| message_id | uuid | Sim | FK para messages.id. | Proposta técnica |
| storage_path | text | Sim | Caminho/chave do objeto no storage privado; não deve ser URL pública permanente. | Proposta técnica |
| original_filename | text | Sim | Nome apresentado pelo usuário; tratar como dado não confiável. | Proposta técnica |
| mime_type | text | Sim | Valores permitidos a validar: application/pdf e image/jpeg. | Derivado dos requisitos |
| size_bytes | bigint | Sim | Tamanho real do objeto em bytes. | Proposta técnica |
| created_at | timestamptz | Sim | Data/hora do registro. | Proposta técnica |

**Regras funcionais relacionadas:**

- Formatos permitidos: PDF e JPEG.
- Validar conteúdo real do arquivo, não apenas extensão ou MIME declarado pelo cliente.
- O download deve exigir autorização para a mensagem/conversa correspondente.
- A localização do objeto não deve permitir acesso público irrestrito.
- O anexo precisa manter vínculo com a mensagem que o compartilha.

**Decisões pendentes:**

- Tamanho máximo, quotas e quantidade de arquivos (Q-011).
- Política de retenção e exclusão (Q-010).
- Antimalware, estados de varredura e comportamento em caso de falha (Q-011 e ADR-008).
- Confirmação sobre JPEG de arquivos existentes versus captura pela câmera (Q-004).
- Limites de nomes, checksum e necessidade de metadados adicionais.

Não definir scan_status nem liberar o download de arquivo não verificado como comportamento final antes da decisão de segurança e da ADR-008.

### 5.6 audit_events — eventos de auditoria

**Status:** Necessidade funcional confirmada; estrutura e política propostas e pendentes de definição na Issue #102.

**Finalidade:** registrar operações relevantes para responsabilização e investigação. A consulta administrativa do TI a conversas precisa gerar registro, conforme RF-016 e RN-014.

| Campo candidato | Tipo sugerido | Obrigatório | Regra / observação | Status |
|---|---|---:|---|---|
| id | uuid | Sim | Chave primária. | Proposta técnica |
| actor_profile_id | uuid | A validar | FK para profiles.id; deve identificar o operador em consulta administrativa. Para eventos automáticos, a necessidade de ator nulo deve ser definida. | Requisito parcial confirmado |
| event_type | text | Sim | Tipo do evento, por exemplo conversation.admin_view; catálogo a aprovar. | Pendente de #102 |
| conversation_id | uuid | Condicional | FK para conversations.id quando o evento estiver relacionado à consulta de uma conversa. | Proposta técnica |
| resource_type | text | Não | Tipo genérico do recurso alvo, se necessário. | Proposta técnica |
| resource_id | uuid | Não | Identificador do recurso alvo. Se usado de forma polimórfica, não terá FK simples; avaliar alternativa. | Pendente de desenho |
| occurred_at | timestamptz | Sim | Momento do evento, preferencialmente gerado no servidor/banco. | Proposta técnica |
| reason | text | A validar | Justificativa do acesso, caso a política aprovada a exija. | Pendente de Q-009 |
| metadata | jsonb | Não | Metadados estritamente necessários; nunca incluir segredos, tokens ou conteúdo excessivo. | Proposta técnica |

**Regras funcionais e de segurança:**

- Toda consulta administrativa de conversa deve ser rastreável ao operador e ao alvo consultado.
- O registro deve ser realizado em contexto confiável, não depender de um evento enviado livremente pelo navegador.
- O evento não deve armazenar senha, token, chave secreta ou cópia integral do conteúdo da conversa.
- Recomenda-se um padrão append-only para eventos de auditoria; mecanismo de proteção contra alteração, acesso aos registros e retenção precisam ser definidos na #102.
- O desenho final deve considerar como registrar eventos administrativos sem permitir que uma falha da operação de auditoria resulte em acesso administrativo sem rastreabilidade.

**Decisões pendentes:**

- Campos obrigatórios, justificativa, identificação de operador e conteúdo mínimo (Q-009).
- Tipos de evento e operações que serão auditadas.
- Retenção, descarte, acesso e proteção contra alteração (Q-010 e #102).
- Se o registro de eventos será genérico, específico por recurso ou híbrido.

Esta entidade não deve ser considerada concluída apenas por existir uma tabela. A política da Issue #102 precisa ser aprovada e os controles devem ser testados.

### 5.7 security_alerts — alertas de conteúdo suspeito

**Status:** Entidade candidata; escopo em aberto entre ADR-005, Issue #99 e Issue #122.

**Finalidade proposta:** relacionar uma mensagem sinalizada a uma ocorrência que o TI possa revisar.

Possíveis atributos para discussão: id, message_id, referência à regra de detecção, classificação, severidade, momento da sinalização, situação do alerta, responsável pela análise e momento da revisão.

**Não definir ainda** catálogo de regras, limiares, severidade, estados, dados de contexto ou bloqueio de mensagens. Esses pontos dependem de Q-007 e Q-008 e do trabalho da Issue #122.

A necessidade funcional de análise e alerta está registrada em RF-014 e RF-015. A inclusão física desta tabela na entrega da #99 depende da resolução de escopo indicada na seção 12.

### 5.8 Configurações persistentes — entidade ainda não definida

**Status:** Necessidade mencionada na Issue #99; inventário não especificado.

A Issue #99 menciona configurações, enquanto a ADR-005 cita alertas no conjunto mínimo de entidades e não descreve uma tabela de configurações.

Antes de criar uma tabela genérica configs, é necessário listar quais configurações serão persistidas no banco, quem pode alterá-las, quais valores possuem histórico e quais são apenas variáveis de ambiente ou parâmetros de deploy.

Não armazenar segredos, tokens, chaves de serviço ou credenciais em uma tabela genérica de configurações. Segredos operacionais devem permanecer no mecanismo de gerenciamento de segredos da plataforma.

## 6. Relacionamentos e cardinalidades

| Origem | Relação | Destino | Cardinalidade esperada | Observação |
|---|---|---|---|---|
| auth.users | identidade de | profiles | 1:1 | Relação implementada pela FK de profiles.id. |
| profiles | cria | conversations | 1:N | Autor de criação; permissões dependem do tipo de conversa. |
| conversations | possui | memberships | 1:N | Uma conversa reúne seus participantes. |
| profiles | participa por | memberships | 1:N | Um perfil pode participar de várias conversas. |
| conversations | contém | messages | 1:N | Cada mensagem pertence a uma conversa. |
| profiles | envia | messages | 1:N | Cada mensagem possui um autor. |
| messages | pode conter | attachments | 1:N | Quantidade máxima ainda não definida. |
| profiles | executa | audit_events | 1:N | Eventos administrativos devem identificar o operador. |
| conversations | pode ser alvo de | audit_events | 1:N | Necessário para registrar consulta administrativa de conversa. |
| messages | pode gerar | security_alerts | 1:N | Relação candidata; depende de #122 e decisão de escopo. |

### 6.1 Invariantes funcionais a preservar

- Uma mensagem não pode existir sem conversa e autor.
- Um anexo não pode existir sem mensagem associada.
- Usuário comum só pode ler e escrever em conversas das quais seja participante autorizado.
- Uma mensagem em grupo só pode ser enviada por participante ativo e autorizado.
- Uma conta inativa não pode executar operações de envio.
- A consulta administrativa de conversa pelo TI é uma exceção de leitura prevista no requisito e deve gerar auditoria; não transforma o TI em participante da conversa.
- Grupos são criados e administrados pelo TI.
- Conversa individual deverá representar comunicação entre dois usuários; a regra de unicidade por par ainda precisa de decisão.
- O histórico de mensagens, anexos e eventos não deve ser eliminado automaticamente por exclusão de um participante sem política aprovada.

## 7. Constraints, integridade e índices candidatos

Os itens desta seção são recomendações para revisão técnica, não DDL aprovado.

### 7.1 Chaves e referências

- Usar UUID como candidato a chave primária para novas entidades, alinhado à chave já utilizada por Supabase Auth.
- Definir FKs entre mensagens, conversas, participantes, anexos, perfis e eventos auditáveis.
- Revisar as ações ON DELETE de cada FK. Não propagar exclusões em cascata por mensagens, anexos ou auditoria sem aprovação de retenção.
- Considerar desativação lógica de contas por profiles.is_active como mecanismo normal de bloqueio, separando-a de exclusão física da identidade.

### 7.2 Restrições candidatas

| Entidade | Restrição candidata | Finalidade |
|---|---|---|
| profiles | CHECK role IN (user, ti) | Já implementada. |
| conversations | CHECK kind IN (direct, group) | Impedir tipo inválido de conversa. |
| memberships | FK para conversa e perfil | Impedir participação órfã. |
| memberships | Unicidade de participação ativa por conversa/perfil, possivelmente por índice parcial | Evitar duplicidade de membro ativo; depende do ciclo de vida Q-003. |
| messages | FKs para conversa e autor | Preservar autoria e conversa de origem. |
| attachments | CHECK de MIME permitido e tamanho positivo | Validar metadados; validação do conteúdo real ocorre fora da constraint. |
| audit_events | evento de consulta administrativa exige operador e conversa alvo | Assegurar rastreabilidade mínima do RF-016. |

### 7.3 Índices candidatos

- memberships(profile_id, conversation_id) para listar conversas de um usuário.
- memberships(conversation_id, profile_id) para listar participantes e validar participação.
- messages(conversation_id, created_at) para paginação de mensagens por conversa.
- attachments(message_id) para recuperar anexos de uma mensagem.
- audit_events(actor_profile_id, occurred_at) para consulta de eventos por operador e período.
- audit_events(conversation_id, occurred_at) para trilha de acesso administrativo por conversa.
- Índices adicionais devem ser justificados pelas consultas reais e pela estimativa de carga da Q-016.

A revisão deve considerar seletividade, ordenação, custo de escrita e necessidade de índices compostos. Não criar índices indiscriminadamente.

## 8. Segurança, RLS e acesso aos dados

A ADR-006 foi aceita somente para o contrato de autorização de perfis e a migration existente. Ela não aprova políticas de RLS para conversas, participantes, mensagens, anexos ou auditoria.

Princípios para a implementação futura:

1. Autenticar a identidade no servidor, sem confiar em profile_id, papel ou estado informados pelo cliente.
2. Aplicar autorização server-side nas operações e complementar com políticas RLS no PostgreSQL.
3. Validar participação na conversa para leitura e envio por usuários comuns.
4. Restringir criação, inclusão e remoção administrativa de participantes de grupos ao TI autorizado.
5. Permitir consulta administrativa de conversa somente conforme RF-016 e a governança aprovada, sempre com registro de auditoria.
6. Não expor a service-role key ao browser, bundles, variáveis NEXT_PUBLIC_* ou logs.
7. Proteger os objetos do storage e autorizar cada download com base no acesso à mensagem/conversa.
8. Negar acesso por padrão quando identidade, participação ou regra de autorização não puder ser validada.

A matriz da Issue #100 e sua aprovação independente pelo SQA devem ser respeitadas. A implementação das políticas de domínio e dos testes de isolamento pertence também à Issue #101. Este documento não antecipa a aprovação dessas políticas.

## 9. Retenção, exclusão e histórico

A retenção ainda não pode ser implementada com regras definitivas. As decisões de Q-010 e Q-024 afetam diretamente o comportamento do banco.

Até que haja aprovação:

- Não definir exclusão em cascata de conversas, mensagens, anexos ou auditoria como comportamento de negócio.
- Não presumir que excluir uma conta significa apagar seu histórico.
- Não presumir que mensagens editadas ou apagadas deixam de existir para fins de auditoria.
- Não definir prazo de retenção por conveniência técnica.
- Preservar a distinção entre desativação de conta, remoção de participante, encerramento de conversa e exclusão definitiva de dados.

A política final deve ser documentada na Issue #102 e refletida nas migrations, constraints, rotinas de descarte e testes.

## 10. Rastreabilidade com requisitos e issues

| Elemento do modelo | Requisitos / regras | Issues e decisões relacionadas |
|---|---|---|
| profiles | RF-001 a RF-004; RN-001 a RN-005 | #99, #103, #104, #105; ADR-004 e ADR-006 |
| conversations | RF-005, RF-007 a RF-010; RN-006, RN-007, RN-010 | #99, #107, #109, #110, #111; Q-003 |
| memberships | RF-005, RF-006, RF-008, RF-010; RN-007; contagem não lida/marcação básica de leitura | #99, #100, #101, #111, #112, #113; Q-003 |
| messages | RF-008 a RF-010; RN-006, RN-007; origem temporal para leitura e ordenação | #99, #109, #110, #111; Q-024; ADR-007 |
| attachments | RF-011 a RF-013; RN-008, RN-011; RNF-010 | #99, #114, #115, #116, #117; Q-004, Q-010, Q-011; ADR-008 |
| audit_events | RF-016; RN-014; RNF-004 e RNF-011 | #99, #102, #121, #124; Q-009, Q-010; ADR-010 |
| security_alerts | RF-014, RF-015; RN-012, RN-013 | #122, #123; Q-007, Q-008; ADR-010 |
| Configurações | RN-003 e responsabilidades administrativas | #99; inventário ainda precisa ser esclarecido |

## 11. Decisões pendentes que impactam diretamente o modelo

| Questão | Decisão necessária | Impacto |
|---|---|---|
| Q-003 | Saída voluntária, remoção de membros, reentrada e encerramento de grupos. | Campos de vigência e histórico em memberships e estado de conversations. |
| Q-005 | Identificador utilizado no login. | Dados de identificação e unicidade; não confundir com PK. |
| Q-007 | Regras, termos e categorias de conteúdo suspeito. | Estrutura e referência das ocorrências de alerta. |
| Q-008 | Severidade, fluxo de investigação e eventual ação após alerta. | Estados e campos de security_alerts. |
| Q-009 | Governança da consulta administrativa, justificativa, transparência e campos auditáveis. | Estrutura e eventos de audit_events. |
| Q-010 | Retenção e exclusão de mensagens, anexos, alertas e logs. | FKs, exclusões, histórico, descarte e integridade. |
| Q-011 | Limites, quotas e verificação antimalware de anexos. | Constraints, metadados, políticas de storage e fluxo de liberação. |
| Q-016 | Concorrência, volume e desempenho esperados. | Índices, paginação, particionamento futuro e dimensionamento. |
| Q-024 | Edição e exclusão de mensagens. | Campos de edição, exclusão lógica e histórico de versões. |

## 12. Decisão de escopo funcional do PO e alinhamento com ADR-005

Existe uma diferença entre os artefatos de governança:

- **Issue #99:** cita profiles, conversations, memberships, messages, attachments, audit_events e configurações.
- **ADR-005 (Proposed):** menciona perfis, conversas, participantes, mensagens, anexos, alertas e auditoria.

**Decisão do PO — 19/11/2026, validação do escopo funcional conceitual:**

1. **Núcleo de dados confirmado:** profiles, conversations, memberships, messages, attachments e audit_events representam as necessidades funcionais essenciais do MVP descritas nos requisitos.
2. **Alertas também fazem parte do domínio do produto:** a análise de mensagens suspeitas e a geração de alertas para revisão do TI estão previstas em RF-014/RF-015. Portanto, `security_alerts` deve permanecer no modelo lógico como entidade relacionada às Issues #122/#123. Seus atributos finais, estados e regras dependem das decisões Q-007/Q-008 e da revisão técnica; esta validação não aprova DDL nem política de alertas.
3. **Configurações permanecem no escopo funcional do console TI, mas sem tabela genérica aprovada:** a funcionalidade administrativa de configurar parâmetros está indicada na visão do produto. Contudo, não há inventário dos parâmetros persistentes, seus tipos, responsáveis, regras de alteração ou necessidade de histórico. Não criar uma tabela genérica `configs` por suposição. O inventário deve ser produzido e validado com PO/TI; os itens que precisarem ser persistidos devem ser incorporados ao modelo antes das migrations correspondentes. Se forem apenas variáveis de ambiente ou segredos operacionais, devem ficar fora de uma tabela de configurações de negócio.
4. **Organização e autorização:** o escopo inicial continua sendo uma única organização (FORD), sem `tenant_id` ou multi-tenancy adicional. A aplicação mantém somente os perfis `user` e `ti`; não criar um terceiro papel de participante, proprietário ou moderador em `memberships`.
5. **Preservação do histórico:** desativação de conta ou encerramento de participação não deve ser interpretado automaticamente como exclusão das mensagens, anexos ou eventos de auditoria relacionados. Exclusão física, retenção e descarte dependem de Q-010 e das aprovações institucionais aplicáveis.
6. **Anexos:** o banco deve manter metadados e vínculo com a mensagem; o conteúdo binário permanece no armazenamento privado previsto, sujeito à revisão da ADR-008 e às regras de anexos.
7. **Leitura e não lidas:** a Issue #111 faz parte do backlog do produto e exige contagem de mensagens não lidas e marcação básica de leitura. O modelo deve suportar estado de leitura por participante/conversa. `memberships.last_read_at` é uma opção preliminar, não decisão técnica aprovada; Tech Lead/backend devem validar sua suficiência e os impactos em paginação, ordenação e Realtime.

Esta decisão valida o **significado e o limite funcional** das entidades. Não aprova normalização, tipos SQL, constraints, índices, FKs, RLS, cascatas, particionamento, migrações ou a ADR-005; esses itens permanecem sob revisão do Tech Lead, backend, TI, Segurança e SQA conforme aplicável.

**Pendência que permanece na Issue #99:** documentar o inventário de configurações antes de declarar completo o escopo de persistência e antes de encerrar a issue. A ADR-005 deve ser harmonizada com essa delimitação por seus responsáveis técnicos, sem alterar seu status Proposed por esta validação de produto.

## 13. Plano de validação do modelo

Antes de criar migrations das entidades novas:

- [x] PO valida o escopo funcional conceitual das seis entidades centrais e de `security_alerts`; configurações persistentes permanecem condicionadas ao inventário descrito na seção 12.
- [ ] Tech Lead revisa normalização, chaves, cardinalidades, índices e estratégia de exclusão.
- [ ] Desenvolvimento backend valida viabilidade do modelo com Supabase/PostgreSQL e necessidades das consultas.
- [ ] TI valida os fluxos administrativos, participantes e consulta de conversas.
- [ ] Segurança/Privacidade e responsáveis de negócio esclarecem Q-009 e Q-010.
- [ ] Decisões pendentes que não impedem a estrutura inicial são registradas com responsável e dependência.
- [ ] A matriz da #100 é considerada; o modelo não cria permissões além das decisões aprovadas.
- [ ] O SQA revisa rastreabilidade e cenários positivos/negativos aplicáveis.
- [ ] O modelo lógico é aprovado por PR antes da implementação das migrations.

## 14. Critérios para considerar o documento pronto para orientar migrations

- [ ] As entidades e seus limites de responsabilidade estão aprovados.
- [ ] O DER e as cardinalidades foram revisados.
- [ ] Os campos obrigatórios e opcionais estão definidos ou explicitamente marcados como pendentes.
- [ ] Chaves, FKs, unicidade, CHECKs e comportamento de exclusão foram revisados.
- [ ] As regras de participação e autoria são compatíveis com a matriz de autorização.
- [ ] A consulta administrativa e a trilha de auditoria atendem ao requisito RF-016 e à política aprovada na #102.
- [ ] As questões de retenção e exclusão não são contraditas pelo modelo.
- [ ] A divergência entre configurações e alertas foi resolvida na Issue #99 e na ADR-005.
- [ ] Tech Lead, desenvolvimento backend, PO e SQA registraram suas revisões conforme suas responsabilidades.

## 15. Histórico de revisões

| Versão | Data | Alteração | Estado |
|---|---|---|---|
| 0.1 | 18/11/2026 | Primeira proposta do modelo lógico, dicionário preliminar, relacionamentos, rastreabilidade e registro das decisões pendentes. | Em revisão |
| 0.2 | 19/11/2026 | Registra validação do PO sobre o escopo funcional das entidades, inclui `security_alerts` no domínio lógico e delimita configurações persistentes como dependentes de inventário; não aprova schema físico ou migrations. | Aprovado pelo PO quanto ao escopo funcional; revisão técnica pendente |

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
- Q-003, Q-005, Q-007, Q-008, Q-009, Q-010, Q-011, Q-016 e Q-024.
