# Modelo de dados — Polychat

- **Identificador:** POLY-DATA-001
- **Versão:** 0.5 — 26/11/2026
- **Status:** Modelo lógico conceitual com escopo funcional validado pelo PO; fotografia técnica atualizada pelas PRs #165, #168, #172, #173, #180, #181, #182 e #185; upload inicial implementado, mas ciclo de anexos incompleto; limite funcional vigente de 10 MiB (10.485.760 bytes) alinhado ao limite técnico no banco, bucket e endpoint; Issue #99 permanece aberta
- **Issue de referência:** #99 — Modelar schema PostgreSQL e migrations iniciais
- **ADR relacionada:** ADR-005 — Banco de dados e modelo de dados (**Proposed**)
- **Stack tecnológica adotada pelo projeto:** Supabase + Vercel; PostgreSQL é utilizado via Supabase, enquanto Vercel atende à hospedagem e ao deploy da aplicação

> **Importante:** este documento registra o modelo lógico conceitual do Polychat e as decisões funcionais validadas pelo PO para a baseline v0.5. Distingue regras confirmadas, implementação técnica integrada, evidências de aplicação/teste e propostas técnicas. A validação do PO não equivale à aprovação do schema físico. O estado das entregas técnicas e seus limites estão consolidados na seção 2.2; não se deve inferir, a partir do merge de uma PR ou de um teste revertido, que toda a implementação esteja aplicada, homologada ou pronta para produção.

## 1. Objetivo

Documentar as entidades, atributos candidatos, relacionamentos, regras de integridade e dependências necessárias para persistir os dados do MVP do Polychat.

O modelo serve como referência de produto e domínio para a Issue #99. Esta revisão registra decisões funcionais do PO e não equivale a uma aprovação do PO sobre estrutura física, DDL ou migrations. As implementações técnicas posteriores foram submetidas a revisões próprias e estão resumidas na seção 2.2, sem ampliar o escopo da validação funcional.

## 2. Escopo e fontes

O modelo considera:

- A Issue #99, que solicita modelar perfis, conversas, participantes, mensagens, anexos, eventos de auditoria e persistência dos controles administrativos definidos.
- A ADR-005, atualmente **Proposed**, que deve ser alinhada à stack definida para o projeto: PostgreSQL via Supabase e aplicação hospedada/deployada na Vercel.
- A baseline vigente **POLY-REQ-001 v0.5 — 20/11/2026**, os requisitos RF-001 a RF-023, as regras RN-001 a RN-025 e as decisões consolidadas da FORD v2.
- A migration existente de perfis `supabase/migrations/20261124191059_profiles_roles_and_account_status.sql`, que constitui o scaffold inicial da integração com Supabase Auth e deve ser avaliada como parte da stack do projeto.
- A Q-025, que mantém registrada a análise de compatibilidade entre a stack Supabase + Vercel definida para o projeto e a exigência de infraestrutura sob controle da FORD.

As decisões Q-003, Q-005, Q-007 a Q-012, Q-016 e Q-024 foram respondidas/alinhadas no nível funcional e não devem continuar classificadas como dúvidas de produto. As decisões adicionais de produto tomadas nesta versão estão registradas nas seções 11 e 12.

### 2.1 Convenção de status usada neste documento

| Status | Significado |
|---|---|
| **Implementado no repositório** | Existe no repositório em migration versionada. Não significa, por si só, que foi aplicado ou homologado no ambiente Supabase do projeto. |
| **Integrado à `main`** | A PR foi mesclada e seu conteúdo passou a integrar o histórico do repositório. Não comprova aplicação persistente no Supabase nem conclusão de todo o fluxo funcional. |
| **Aplicado no Polyford (evidência registrada)** | Comentários/notas da entrega registram aplicação no Supabase de desenvolvimento. É uma evidência específica daquele ambiente e não equivale à homologação da FORD ou à prontidão de produção. |
| **Testado com `ROLLBACK`** | Os cenários foram executados em transação revertida. O teste demonstra o comportamento observado, mas não deixa os dados/objetos de teste persistidos no ambiente. |
| **Confirmado** | Há requisito ou regra de negócio que sustenta a necessidade funcional da informação. |
| **Proposta técnica** | É uma solução preliminar para discussão e revisão; ainda não deve ser tratada como decisão aprovada. |
| **Pendente** | Depende de decisão de negócio, aprovação, detalhamento ou validação técnica. |
| **Fora do escopo confirmado** | Não deve ser incluído no MVP com base nas informações atuais. |

### 2.2 Estado da implementação técnica — fotografia de 26/11/2026

Esta seção registra entregas técnicas efetivamente integradas e os limites documentados nas respectivas PRs. O status de merge é distinto da aplicação persistente no banco, da integração de todos os fluxos de produto e da homologação da FORD.

| Entrega | Conteúdo integrado | Revisão e evidência registrada | Limites que permanecem |
|---|---|---|---|
| **PR #165 — schema inicial da #99** | Migrations do schema inicial para `conversations`, `memberships`, `messages`, `attachments`, `message_reads`, `security_alerts` e estruturas específicas de configuração; FKs, constraints, triggers e RLS habilitada nas tabelas novas. | Mesclada em 24/11/2026. A aplicação no Supabase de desenvolvimento Polyford e a verificação das tabelas/triggers foram registradas na PR. Tech Lead aprovou e SQA emitiu parecer favorável dentro do escopo da entrega. | `profiles.username` permanece nullable até haver estratégia confiável de preenchimento. A invariante de mensagem com texto/anexo é protegida no commit, mas o fluxo server-side/RPC que grava mensagem e anexos conjuntamente ainda precisa ser integrado. A auditoria genérica ficou para #102; as policies RLS foram entregues separadamente em #172. A restrição física de `attachments.size_bytes` aplica o limite funcional vigente de 10 MiB (10.485.760 bytes), conforme retificação da seção 5.5; não há ajuste de limite pendente. |
| **PR #168 — cobertura de índices de FKs** | Migration aditiva versionada com seis índices de cobertura para FKs de `conversations`, `memberships`, `messages` e `security_alerts`. | Mesclada em 25/11/2026. Tech Lead e SQA aprovaram a migration e a atualização documental; CI e Preview foram registrados como aprovados no head revisado. | O teste transacional descrito originalmente na PR criou/verificou os índices e terminou com `ROLLBACK`; naquela etapa, não houve persistência. A verificação posterior de 26/11, registrada em `docs/database/issue-99-implementation-notes.md`, confirmou a versão remota `20261125233227` e os seis índices presentes em `pg_indexes` no Polyford. Assim, os seis índices estão atualmente persistidos nesse ambiente de desenvolvimento. A presença física não comprova ganho de desempenho sob carga representativa. |
| **PR #172 — autorização e RLS da #101** | Policies RLS para conversas, memberships, mensagens, anexos, leituras, alertas e tabelas de configuração; restrições de grants por tabela/coluna e funções auxiliares no schema `private`. | Mesclada em 26/11/2026. Evidências registram 16/16 cenários de RLS aprovados e teste separado de criação de conversa direta, ambos com `ROLLBACK`; SQA emitiu parecer favorável após correções, Tech Lead aprovou e os workflows CI passaram. | O SQA não certificou a ausência de `service_role` no frontend. O bucket e o upload server-side foram entregues separadamente pelas PRs #181 e #185; download, signed URLs, scanner, quotas e ciclo completo permanecem pendentes. A reconciliação dos nomes de migrations foi tratada posteriormente pela #180, sem alteração do histórico remoto. |
| **PR #173 — auditoria e retenção da #102** | Estrutura `audit_events`, catálogo de eventos, controles TI-only, proteção de metadata, comportamento append-only para alterações diretas, `retention_holds`, descarte controlado e auditoria transacional de edição/exclusão lógica administrativa de mensagens e fechamento de alertas. Inclui writer explícito autenticado com JWT de usuário e chave publishable. | Mesclada em 26/11/2026. Testes SQL de auditoria/holds e descarte, executados com `ROLLBACK`, e testes unitários do writer foram registrados; SQA emitiu parecer favorável após correção do dollar quoting, Tech Lead aprovou e os workflows CI passaram. | Ainda faltam call-sites para visualização/exportação de conversas, download/liberação de anexos e alterações de configuração. Backup diário por 12 meses, restauração e evidência de RPO/RTO de até 24h não foram comprovados/configurados; a PR #182 documentou essas lacunas. Storage e descarte físico de anexos permanecem na #117; auditoria privilegiada de contas/grupos/memberships permanece na #124. |
| **PR #180 — reconciliação do histórico de migrations** | Alinha cinco nomes locais aos identificadores remotos, remove colisão de prefixo e representa a versão histórica `20261124210245` por ledger sem DDL; a definição reproduzível de `audit_events` permanece na migration canônica posterior. | Mesclada após a coordenação com a #181. SQA e Tech Lead aprovaram; instalação limpa combinada em PostgreSQL local descartável aplicou 18 migrations e `supabase migration list --local` confirmou 18/18; workflow dedicado e CI passaram. | A validação foi local e descartável. Não houve `db push`, `migration repair` ou reset no Supabase remoto. O DDL original da versão histórica da PR #166 não foi reconstruído; a migration canônica posterior fornece a estrutura reproduzível. |
| **PR #182 — evidências de backup e recuperação** | Registra evidências sanitizadas sobre plano/estado Supabase, bucket Storage, ambientes Vercel e escopo dos workflows CI quanto a backup/restore. | Mesclada em 26/11/2026; SQA e Tech Lead emitiram pareceres favoráveis no escopo documental; dois workflows CI concluíram com sucesso. | Não implementa backup nem restauração. O plano Free não fornece backup diário automático do banco; não há destino externo/off-site, retenção de 365 dias ou teste de restore comprovados; RPO/RTO permanecem não demonstrados. A Issue #130 continua aberta. |
| **PR #185 — upload privado PDF/JPEG da #115** | Endpoint server-side `POST /api/attachments/upload`; sessão via cookies HTTP-only; leitura da mensagem com JWT do usuário/RLS e conferência de autoria; upload no bucket privado usando segredo somente no servidor; validação de extensão, MIME e marcadores binários; gravação de metadados com JWT do usuário e remoção compensatória do objeto se o registro falhar. | Mesclada em 26/11/2026. SQA e Tech Lead aprovaram o escopo; testes automatizados, ESLint, TypeScript, build, smoke test e workflows CI foram registrados como sucesso. | O endpoint aplica 10 MiB (10.485.760 bytes), em conformidade com o limite funcional retificado na seção 5.5. Não implementa download/signed URLs, scanner/quarentena, quotas, backup de objetos nem integração transacional da criação de mensagem com anexos. A consulta de evidência da #182 encontrou o bucket sem objetos; não se deve declarar upload real ponta a ponta homologado. O deployment Vercel da PR teve bloqueio por limite diário de implantações, separado do CI aprovado. |

**Evidência de Storage — PR #181 / Issue #115:** a PR #181 provisionou no Polyford o bucket privado `attachments`, com MIME PDF/JPEG e `file_size_limit = 10.485.760` bytes (10 MiB), sem policies de acesso direto em `storage.objects`. Após a correção do teste de allowlist para igualdade exata, o SQA emitiu parecer favorável e o Tech Lead aprovou a entrega. A PR #181, isoladamente, tratou somente do bucket; o endpoint inicial de upload foi entregue separadamente pela PR #185. O limite do bucket coincide com o limite físico de `attachments`, com o limite aplicado pelo endpoint e com a regra funcional vigente de 10 MiB (10.485.760 bytes); não há divergência de limite entre esses componentes.

**Evidência de continuidade — PR #182 / Issue #130:** a avaliação confirmou que a organização Supabase consultada estava no plano Free, sem backup diário automático do banco fornecido pelo plano; o bucket `attachments` estava sem objetos na coleta; os workflows CI inspecionados não demonstravam rotina automatizada de backup/restore; não havia destino externo/off-site configurado ou evidenciado, retenção de 365 dias nem teste de restauração. RPO/RTO de até 24h permanecem não demonstrados. SQA e Tech Lead aprovaram a documentação e as evidências no escopo documental, sem declarar backup/restore implementados ou homologados. A Issue #130 permanece aberta.

**Situação consolidada:** o schema de domínio inicial, as policies RLS, o núcleo de auditoria/retention controls, o bucket privado, a reconciliação dos identificadores locais de migrations, as evidências documentais de backup/restore e o endpoint inicial de upload possuem entregas integradas na `main`, cada qual com revisão restrita ao seu escopo. As Issues #101 e #102 foram encerradas após suas respectivas integrações; as Issues #115 e #117 permanecem abertas para concluir o ciclo de anexos, e a Issue #130 permanece aberta para continuidade/recuperação. A Issue #99 permanece aberta; não se declara conclusão integral do modelo, do ciclo de anexos, da retenção operacional, do backup/restore ou da homologação da FORD.

A PR #180 reconciliou os nomes locais das migrations com as versões remotas identificadas e removeu a colisão de prefixo. A instalação limpa combinada com a migration da #181 aplicou 18 migrations em PostgreSQL local descartável, com 18/18 entradas em `supabase migration list --local`. Essa validação não alterou nem comprova alteração do histórico remoto do Polyford: não houve `db push`, `migration repair` ou reset remoto. O ledger sem DDL da versão histórica `20261124210245` não reconstrói o SQL não disponível da PR #166; a migration canônica posterior de retenção permanece responsável pela criação reproduzível de `audit_events`.

### 2.3 Documentação correlata a harmonizar em entregas separadas

A revisão cruzada identificou documentos de apoio cujo conteúdo ainda representa fotografias históricas anteriores a entregas já integradas. Eles não foram alterados nesta PR, que permanece restrita a `modelo-de-dados.md`:

| Documento | Divergência / cuidado identificado | Tratamento recomendado fora desta PR |
|---|---|---|
| `docs/adr/ADR-005-dados-postgresql.md` | O contexto e as evidências ainda afirmam que somente `profiles` está versionada e que não existem migrations de domínio, embora as PRs #165, #168, #172 e #173 estejam integradas. | Atualizar contexto e fotografia técnica com as entregas atuais; preservar o status **Proposed** até revisão/decisão arquitetural própria. |
| `docs/adr/ADR-008-storage-anexos.md` | A evidência ainda afirma que nenhum bucket privado foi identificado, mas a PR #181 provisionou `attachments` privado no Polyford. | Registrar o provisionamento limitado da fundação de Storage, o limite atual de 10 MiB e os fluxos ainda ausentes; preservar o status **Proposed**. |
| `docs/storage/politica-anexos-e-antimalware.md` (POLY-STO-001 / Issue #117) | A política ainda classifica como pendentes o tamanho máximo e a quantidade por mensagem; mantém Q-004, o tratamento de PDF protegido por senha e decisões de EXIF/GPS como pendentes; o parecer da seção 16 exclui tamanho/quantidade da validação do PO. Também não reflete integralmente a decisão de liberação excepcional pelo TI autenticada e auditada. Isso diverge das decisões funcionais consolidadas neste modelo: PDF/JPEG, até 10 MiB (10.485.760 bytes) por arquivo, até cinco arquivos por mensagem, JPEG existente da galeria sem captura, remoção de EXIF/GPS, recusa de PDF protegido por senha e ausência de quota por conversa. | Harmonizar em entrega documental separada: atualizar fontes e parecer do PO; registrar tamanho e quantidade como definidos; retirar Q-004 e os itens de produto já decididos da lista de pendências; refletir a liberação excepcional pelo TI somente mediante ação autenticada e auditada. Preservar como pendentes os valores operacionais das quotas individuais/capacidade total, scanner interno, tratamento técnico de quarentena/falhas, descarte físico, aprovações institucionais e evidências de implementação/homologação. |
| `docs/database/issue-99-implementation-notes.md` | A nota contém a fotografia das 17 versões remotas anteriores ao Storage, mas mantém trechos que descrevem a reconciliação como branch/etapa pré-merge e não consolida de forma única o estado pós-merge das PRs #180/#181/#185. | Harmonizar a nota em entrega separada: registrar as 18 migrations da sequência combinada, a instalação limpa 18/18, o estado pós-merge da reconciliação e a implementação inicial do upload pela #185, sem afirmar alteração do histórico remoto. |
| `docs/issue-100-matriz-autorizacao.md` | O documento registra auditoria de 17/11/2026 e afirma que RLS de conversas, memberships, mensagens e anexos não foi encontrada; essa afirmação é histórica após a integração da PR #172. | Preservar a data da auditoria original, acrescentar atualização datada após #172 e vincular `docs/security/issue-101-rls-evidence.md`; não reescrever a fotografia histórica como se fosse contemporânea. |
| `docs/infra/polyford-migration-history-reconciliation-2026-11-26.md` | O relatório conserva trechos de planejamento/validação “antes do merge”, embora as PRs #180 e #181 já estejam integradas e a instalação limpa combinada tenha sido executada. | Atualizar em entrega documental separada para distinguir a sequência de validação pré-merge do estado pós-merge, mantendo explícito que nenhuma alteração foi feita ao histórico remoto. |

A direção Supabase + Vercel da ADR-003 permanece **Accepted**. A Q-025 continua aberta para a demonstração da compatibilidade da configuração e do modelo de uso com as restrições da FORD v2; não se deve confundir aceite da stack com homologação operacional ou encerrar Q-025 por inferência.

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
12. O documento valida significado e regras funcionais. Tipos SQL, normalização, chaves, constraints, índices, FKs, RLS, estratégia física e migrations permanecem fora desta aprovação do PO. As entregas físicas posteriormente integradas e suas revisões técnicas/SQA são registradas separadamente na seção 2.2.

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
- `audit_events` registra operações administrativas por ator TI ativo e referência polimórfica (`resource_type`/`resource_id`). Os registros de edição/exclusão lógica de mensagens, fechamento de alertas e controles de retenção possuem geração transacional integrada; consulta/exportação de conversas, ações de anexos e alterações de configuração ainda dependem de call-sites. A tabela não possui FK direta para conversas.
- `security_alerts` registra ocorrências geradas por regras determinísticas de detecção e encaminhadas à fila de revisão do TI.
- A configuração persistente limita-se às regras/lista de detecção e às quotas individuais e totais de anexos. A forma física de persistência será definida tecnicamente; não se presume uma tabela genérica `configs`.

## 5. Entidades e dicionário de dados preliminar

Os nomes e atributos a seguir descrevem necessidades de domínio e candidatos de modelagem. Tipos SQL, normalização, constraints, FKs e estrutura física continuam sujeitos à definição técnica e não são aprovados por este parecer do PO.

### 5.1 profiles — perfis e estado das contas

**Necessidade funcional:** confirmada. A migration `supabase/migrations/20261124191059_profiles_roles_and_account_status.sql` integra o scaffold inicial da solução com Supabase Auth. Ela não deve ser classificada como artefato legado ou descartável por inferência; sua evolução física deve ser avaliada tecnicamente, preservando os requisitos funcionais e o histórico do domínio.

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

**Evidência existente:** a migration `20261124191059_profiles_roles_and_account_status.sql` vincula `profiles.id` a `auth.users(id)` com `ON DELETE CASCADE` e inclui RLS específica de perfis. Ela constitui o scaffold inicial de integração com Supabase Auth; sua revisão técnica deve preservar o histórico de domínio, evitando exclusão em cascata de conversas, mensagens, anexos ou auditoria.

### 5.2 conversations — conversas individuais e em grupo

**Necessidade funcional:** confirmada. A estrutura física `public.conversations` foi criada pela migration da PR #165, integrada à `main` e reportada como aplicada no Supabase de desenvolvimento Polyford. As policies de domínio/RLS correspondentes foram integradas pela PR #172.

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

**Necessidade funcional:** confirmada. A estrutura física `public.memberships` foi criada pela migration da PR #165, integrada à `main` e reportada como aplicada no Supabase de desenvolvimento Polyford. As policies de domínio/RLS correspondentes foram integradas pela PR #172.

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

**Necessidade funcional:** confirmada. A estrutura física `public.messages` foi criada pela migration da PR #165, integrada à `main` e reportada como aplicada no Supabase de desenvolvimento Polyford. As invariantes de conteúdo/anexos são verificadas no commit da transação; a integração server-side/RPC para efetuar a gravação conjunta de mensagem e anexos permanece uma pendência de fluxo. As policies de domínio/RLS foram integradas pela PR #172.

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

**Necessidade funcional:** confirmada. A estrutura física `public.attachments` para metadados e referência de armazenamento foi criada pela migration da PR #165, integrada à `main` e reportada como aplicada no Supabase de desenvolvimento Polyford. A PR #181 provisionou o bucket privado `attachments`, com allowlist PDF/JPEG, limite de 10 MiB por objeto e nenhuma policy de acesso direto em `storage.objects`. A PR #185 adicionou o endpoint inicial server-side `POST /api/attachments/upload`: valida sessão por cookies HTTP-only; consulta a mensagem com JWT do usuário/RLS e exige que o usuário autenticado seja o remetente; valida extensão, MIME e marcadores binários PDF/JPEG; envia ao bucket usando `SUPABASE_SECRET_KEY` somente no servidor; e grava os metadados com JWT do usuário, removendo compensatoriamente o objeto se o registro falhar. Essa entrega não implementa download, signed URLs, scanner/quarentena, quotas, descarte físico ou o fluxo transacional de criação da mensagem com anexos. A consulta da PR #182 encontrou o bucket sem objetos, portanto o merge do endpoint e seus testes não equivalem à homologação de upload real ponta a ponta no Polyford. As policies RLS da tabela de metadados foram integradas pela PR #172.

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
- Tamanho máximo funcional: **10 MiB (10.485.760 bytes)** por arquivo; até cinco arquivos por mensagem.
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

**Retificação da unidade — decisão vigente do PO (26/11/2026):** a expressão originalmente aprovada “até 10 MB por arquivo” deve ser interpretada, no contexto do Polychat, como limite de **10 MiB (10.485.760 bytes)**. A interpretação decimal de 10.000.000 bytes registrada em complemento anterior foi equivocada e fica substituída por esta retificação. `10 MB` (decimal) e `10 MiB` não são unidades equivalentes; para requisitos, implementação e testes, deve prevalecer o valor expresso em bytes: **10.485.760**.

**Conformidade do limite técnico confirmada em 26/11/2026:** a migration da PR #165 define `attachments.size_bytes <= 10.485.760`; a PR #181 configura `storage.buckets.file_size_limit = 10.485.760`; e o endpoint da PR #185 utiliza `MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024`. Os três componentes aplicam o limite funcional corrigido de **10 MiB (10.485.760 bytes)**. A inspeção somente de leitura no projeto Supabase Polyford também confirmou a constraint remota `public.attachments.size_bytes <= 10.485.760` e o bucket privado `attachments` com `file_size_limit = 10.485.760` e allowlist PDF/JPEG. Não há divergência de limite entre a regra funcional corrigida e a configuração verificada. Permanecem pendentes as demais etapas do ciclo de anexos, indicadas nas Issues #115/#117; esta retificação documental não modifica migrations, código ou configuração remota.

### 5.6 audit_events — eventos de auditoria

**Status:** estrutura física `public.audit_events` integrada pela PR #173, com revisão favorável do SQA e aprovação do Tech Lead dentro do escopo da entrega. Esta implementação concretiza parte da necessidade conceitual da #99 e da estratégia da #102; não significa que todos os eventos previstos já tenham call-sites na aplicação nem que toda a retenção operacional esteja concluída.

**Finalidade:** registrar ações administrativas e de segurança com identificação do operador, tipo de evento, recurso associado, instante, resultado e metadados mínimos. A tabela não armazena cópia integral de mensagens/conversas nem credenciais, tokens ou segredos.

#### Estrutura física integrada

| Campo | Obrigatório | Estrutura/regra implementada |
|---|---:|---|
| `id` | Sim | UUID, chave primária, gerado por `gen_random_uuid()` quando omitido. |
| `actor_profile_id` | Sim | UUID com FK para `profiles(id)` e `ON DELETE RESTRICT`. Deve corresponder a `auth.uid()` e a um operador TI ativo; o ator não é opcional para eventos automáticos. |
| `event_type` | Sim | Texto restrito ao catálogo permitido pela migration #173. O tipo deve corresponder ao tipo de recurso aceito. |
| `resource_type` | Sim | Texto restrito aos tipos `session`, `account`, `group`, `membership`, `conversation`, `alert`, `attachment`, `message`, `configuration` e `retention`. |
| `resource_id` | Condicional | UUID do recurso; obrigatório para todos os eventos, exceto `admin_login`, que admite `NULL`. É uma referência polimórfica, não uma FK genérica para cada tabela de domínio. |
| `occurred_at` | Sim | `timestamptz`, preenchido pelo banco; o trigger de inserção define o instante com `clock_timestamp()`. |
| `outcome` | Sim | Texto não vazio. A migration valida que o valor não seja vazio após `btrim`; não define uma enumeração funcional de resultados. |
| `metadata` | Sim | `jsonb`, padrão `{}`, obrigatoriamente objeto JSON. A validação recursiva rejeita chaves que indiquem conteúdo de mensagem/conversa, senha, token, segredo, credencial, cookie ou chave sensível. |

Não existe coluna física `conversation_id` nem campo `reason` em `audit_events`. A justificativa não é requisito obrigatório para consulta/exportação de conversa ou encerramento de alerta, conforme decisões de produto. O vínculo com o recurso é representado pelo par `resource_type`/`resource_id`; por isso, não se deve modelar uma FK direta de `conversations` para `audit_events`.

#### Catálogo de eventos

A migration e o writer explícito restringem os eventos a este catálogo e ao tipo de recurso correspondente:

| Grupo | `event_type` | `resource_type` |
|---|---|---|
| Sessão | `admin_login` | `session` |
| Conta | `account_created`, `account_updated`, `account_deactivated`, `account_reactivated` | `account` |
| Grupo | `group_created`, `group_closed`, `group_activated`, `group_deactivated` | `group` |
| Participação | `participant_added`, `participant_removed` | `membership` |
| Conversa | `conversation_viewed`, `conversation_exported` | `conversation` |
| Alerta | `alert_reviewed`, `alert_closed` | `alert` |
| Anexo | `attachment_downloaded`, `attachment_released` | `attachment` |
| Mensagem | `message_admin_edited`, `message_admin_deleted` | `message` |
| Configuração | `configuration_changed` | `configuration` |
| Retenção | `retention_discarded`, `retention_hold_placed`, `retention_hold_released` | `retention` |

#### Eventos efetivamente cobertos pela implementação integrada

- **Com triggers transacionais:** `message_admin_edited` e `message_admin_deleted`, gerados na edição/exclusão lógica administrativa de mensagens; `alert_closed`, gerado no fechamento de alerta. Os eventos são gravados na mesma transação da mutação correspondente.
- **Com controles de retenção:** `retention_hold_placed` e `retention_hold_released`, gerados quando um hold é criado/liberado; `retention_discarded`, registrado pela função de descarte controlado antes da remoção autorizada de um registro de `audit_events`.
- **Writer explícito:** `src/audit/audit-events.mjs` valida o evento e o par tipo/recurso, exige access token do usuário, usa a chave publishable e envia a operação com o JWT do chamador. Não aceita nem utiliza `service_role`.
- **Proteção da trilha:** leitura e escrita são restritas ao TI ativo; o ator gravado deve ser o usuário autenticado. Alterações diretas `UPDATE`, `DELETE` e `TRUNCATE` são rejeitadas; a remoção de um evento só ocorre pelo fluxo controlado de retenção. Eventos de controle de retenção não podem ser descartados.
- **Proteção de investigação:** `retention_holds` permite proteger o próprio evento ou o recurso subjacente. O descarte verifica ambos, registra `retention_discarded` e não remove conteúdo de mensagens, anexos, alertas ou registros de auditoria privilegiada.

#### Call-sites e responsabilidades ainda pendentes

- `conversation_viewed` e `conversation_exported`: catalogados, mas dependem de call-sites nos fluxos de consulta/exportação de conversas.
- `attachment_downloaded` e `attachment_released`: catalogados, mas dependem dos fluxos de download/liberação; Storage, buckets, políticas de objeto e descarte físico continuam na Issue #117.
- `configuration_changed`: catalogado e suportado pelo writer, mas sem call-sites validados. Os triggers inicialmente criados para configurações foram removidos pela migration subsequente porque a atribuição do ator não passou na validação; portanto, não declarar auditoria automática de mudanças de configuração.
- `alert_reviewed`: consta do catálogo; a PR #173 comprova o trigger de `alert_closed`, não um call-site independente para `alert_reviewed`.
- Eventos de login, conta, grupo e membership permanecem coordenados com a Issue #124 e a auditoria privilegiada correspondente. A PR #173 não duplica nem substitui `privileged_action_audit`.

**Limite de retenção:** o descarte controlado implementado nesta entrega cobre somente registros de `audit_events`. Backup diário por 12 meses, restauração e evidência de RPO/RTO de até 24 horas não foram configurados ou comprovados pela PR #173. A implementação não declara a retenção operacional integral do Polychat concluída.

**Evidências da entrega:** testes SQL de auditoria/holds e descarte foram executados com `ROLLBACK`; testes unitários do writer foram incluídos no CI. Os testes demonstram os cenários executados, mas não deixaram dados de teste persistidos. A aprovação SQA e do Tech Lead é restrita ao escopo da PR #173.

### 5.7 security_alerts — alertas de conteúdo suspeito

**Necessidade funcional:** confirmada por RF-014/RF-015 e pelas decisões Q-007/Q-008. A tabela física `public.security_alerts` foi criada pela PR #165 e suas policies de domínio/RLS foram integradas pela PR #172.

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

**Status:** inventário funcional delimitado pelo PO conforme RF-014/RF-015, Q-018 e POLY-UX-DEC-001. A PR #165 criou as estruturas específicas `detection_rules`, `attachment_user_quotas` e `attachment_storage_capacity`, aprovadas pelo Tech Lead dentro daquele escopo; as respectivas policies de autorização foram integradas pela PR #172. Não foi criada tabela genérica `configs`.

| Configuração | Quem administra | Regra funcional | Observação para o modelo |
|---|---|---|---|
| Lista de termos/regras de detecção | TI | Mantém a lista/regras aplicadas pelo mecanismo determinístico, incluindo palavrões. | Persistir regras operacionais necessárias; alterações devem gerar auditoria. |
| Limite individual de armazenamento de anexos | TI | Define a quota individual por conta. | Parâmetro administrável; alteração auditada. |
| Capacidade total de armazenamento de anexos | TI | Define a capacidade total disponível. | Parâmetro administrável; alteração auditada. |

Não fazem parte desse inventário: segredos, tokens, credenciais, endpoints de infraestrutura, chaves de serviço ou parâmetros arbitrários de deploy. Limite de 10 MiB (10.485.760 bytes) por arquivo e máximo de cinco anexos por mensagem são regras fixas do produto, não parâmetros genéricos de configuração.

**Decisão do PO:** o inventário de configurações necessário ao escopo funcional da #99 está definido. Não é necessário manter a questão de produto aberta nem criar uma tabela genérica `configs` por conveniência. A estrutura de persistência, versionamento técnico e separação das entidades é matéria de implementação.

### 5.9 message_reads — confirmações de leitura por mensagem

**Necessidade funcional:** confirmada por RF-019. A granularidade funcional para grupos é definida nesta versão; a tabela física `public.message_reads` foi criada pela PR #165 e suas policies de domínio/RLS foram integradas pela PR #172.

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
| profiles | executa | audit_events | 1:N | Cada evento exige `actor_profile_id` vinculado a um perfil TI ativo; a FK física usa `ON DELETE RESTRICT`. |
| conversations | recurso referenciado por | audit_events | Referência polimórfica, sem FK | Quando `resource_type='conversation'`, `resource_id` identifica a conversa; não há coluna `conversation_id` nem FK direta. Os call-sites de consulta/exportação ainda estão pendentes. |
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
| attachments | MIME PDF/JPEG, tamanho até 10 MiB (10.485.760 bytes) e até cinco por mensagem | Aplicar limites funcionais; quota individual/total é adicional |
| message_reads | Unicidade por mensagem e leitor; instante de leitura obrigatório | Representar confirmação individual por mensagem |
| audit_events | `actor_profile_id` obrigatório, FK para `profiles` com `ON DELETE RESTRICT`, ator igual a `auth.uid()` e TI ativo; `event_type`/`resource_type` compatíveis; `resource_id` obrigatório exceto em `admin_login`; `occurred_at` gerado pelo banco; `outcome` não vazio; `metadata` objeto JSON sem chaves sensíveis; append-only com descarte controlado | Assegurar atribuição, integridade e proteção da trilha de auditoria |
| security_alerts | Severidade baixa/média/alta e vínculo à mensagem/regra | Preservar ocorrência e fluxo de revisão |

### 7.3 Índices candidatos

- `memberships(profile_id, conversation_id)` para localizar conversas de um perfil.
- `memberships(conversation_id, profile_id)` para listar participantes e validar participação.
- Chave/índice que permita localizar a conversa individual pelo par canônico de usuários.
- `messages(conversation_id, created_at)` para paginação e ordenação.
- `attachments(message_id)` para recuperar anexos de uma mensagem.
- `message_reads(message_id, reader_profile_id)` para consultar recibos de leitura.
- Índices integrados pela #102: `audit_events(actor_profile_id, occurred_at DESC)` e `audit_events(resource_type, resource_id, occurred_at DESC)`. Não existe coluna `conversation_id`; consultas por recurso usam o índice polimórfico.
- `security_alerts(status, severity, detected_at)` como candidato para fila TI.

Seletividade, ordenação, custo de escrita e índices compostos devem ser avaliados com as consultas reais e o volume inicial previsto. Não criar índices indiscriminadamente.

A migration aditiva da PR #168 versiona seis índices de cobertura de FKs (em `conversations`, `memberships`, `messages` e `security_alerts`). O teste originalmente relatado na PR criou e verificou os índices dentro de transação revertida com `ROLLBACK`, não demonstrando persistência naquela etapa. Posteriormente, a nota `docs/database/issue-99-implementation-notes.md` registrou consulta direta de 26/11 ao histórico remoto e a `pg_indexes`, confirmando a versão `20261125233227` e os seis índices persistidos no Polyford. A fotografia atual, portanto, é de índices presentes no ambiente de desenvolvimento; a execução com carga representativa e os efeitos de desempenho não foram demonstrados.

## 8. Segurança, identidade e acesso aos dados

A autenticação do Polychat utiliza Supabase Auth; os dados relacionais utilizam PostgreSQL no Supabase e os arquivos podem utilizar armazenamento privado. A aplicação é hospedada/deployada na Vercel. A stack está definida para o projeto; sua configuração e compatibilidade com as restrições da FORD continuam sujeitas às evidências e à análise registrada na Q-025.

### 8.1 Princípios funcionais

1. Identidade e conta ativa são verificadas no servidor; não confiar em profile_id, role, estado ou membership enviados pelo cliente.
2. Role e membership são conceitos diferentes. ti permite somente operações administrativas definidas; user depende de membership vigente para acessar conversas.
3. Usuário só lê conversas das quais participa; TI pode consultar qualquer conversa em função administrativa, com auditoria.
4. Remoção encerra o período de participação e revoga imediatamente acesso a mensagens, anexos e links anteriores. A reinclusão não restaura acesso ao histórico anterior à nova entrada.
5. Estado do grupo é considerado em todas as operações: desativado permite somente leitura aos membros vigentes; encerrado restringe a consulta a TI até eventual reativação.
6. Download de anexo exige autorização vigente; link conhecido não substitui autorização e links emitidos devem ser revogados imediatamente após perda de acesso.
7. Operações administrativas de TI e alterações de configurações previstas geram eventos de auditoria.
8. Falha na identificação, verificação de conta, membership ou autorização não concede acesso.
9. Nenhum segredo, token ou chave privilegiada pode ser exposto ao cliente. A exigência da FORD de não permitir acesso/processamento por terceiros deve ser conciliada com o uso de Supabase + Vercel na Q-025; não declarar conformidade antes dessa análise.

### 8.2 Evidência técnica integrada — PR #172

A PR #172 implementou e integrou à main as policies RLS e os controles de privilégios da Issue #101. O escopo abrange:

- conversations: leitura por TI ou participante ativo; criação de conversa direta por um dos dois usuários ativos; criação de grupo e edição administrativa somente por TI;
- memberships: leitura limitada ao próprio vínculo ou TI; criação de vínculos de conversa direta conforme as regras implementadas; inclusão e encerramento de memberships de grupo reservados ao TI;
- messages: leitura por participante ativo ou TI; envio pelo próprio perfil em conversa ativa; edição e exclusão lógica reservadas ao TI;
- attachments: leitura vinculada à autorização da mensagem/conversa; inclusão limitada ao autor da mensagem em conversa ativa; atualização de metadados de análise por TI;
- message_reads: leitura pelo leitor, autor da mensagem ou TI; registro de leitura pelo próprio perfil;
- security_alerts: leitura e encerramento por TI;
- detection_rules, attachment_user_quotas e attachment_storage_capacity: acesso do cliente restrito a TI;
- profiles: privilégio de cliente restrito a SELECT, com remoção de privilégios residuais de TRUNCATE, TRIGGER e REFERENCES.

As funções auxiliares de autorização foram colocadas no schema private, com search_path vazio. A verificação de TI utiliza private.is_active_ti(); o wrapper público é SECURITY INVOKER. A migration final da PR #172 não altera audit_events, cuja responsabilidade ficou na Issue #102/PR #173, nem concede acesso direto do cliente a privileged_action_audit, mantida sob responsabilidade da #124.

**Evidências e revisão:** os testes da Issue #101 registraram 16/16 cenários de RLS aprovados e um teste separado de criação de conversa direta com resultado positivo. As execuções ocorreram no Supabase de desenvolvimento Polyford e terminaram com ROLLBACK. Após a correção do apontamento do SQA sobre privilégios em audit_events, o SQA emitiu parecer favorável e o Tech Lead aprovou a PR #172; os workflows CI do head revisado foram concluídos com sucesso. A Issue #101 foi encerrada após a integração.

**Limites que permanecem:**

- O parecer SQA declarou expressamente que não certificou a ausência de service_role no frontend. Essa verificação continua necessária na revisão de segurança/integração pertinente; não se deve inferi-la da aprovação da PR #172.
- A PR #181 provisionou o bucket privado `attachments` e registrou zero policies de acesso direto em `storage.objects`. A ausência de policies diretas é intencional: o acesso deve ser mediado por operações server-side confiáveis. A PR #185 implementou o endpoint inicial de upload: valida a sessão por cookies HTTP-only, consulta a mensagem com JWT do usuário e RLS, exige correspondência entre o remetente e o usuário autenticado, usa a chave secreta `SUPABASE_SECRET_KEY` somente no servidor para o upload e grava os metadados com JWT do usuário. O handler valida extensão/MIME e marcadores binários PDF/JPEG e remove o objeto se a gravação do metadado falhar. Essa entrega não implementa download, signed URLs, revogação de links, scanner antimalware, quotas ou descarte físico; tampouco comprova upload real ponta a ponta no Polyford, cujo bucket estava sem objetos na coleta da PR #182. Não tratar a criação de policies permissivas de acesso direto como correção dessas pendências.
- A auditoria privilegiada de contas, grupos e memberships permanece na Issue #124; não deve ser duplicada por esta seção.
- A reconciliação dos identificadores locais de migrations foi entregue separadamente pela PR #180: os nomes locais foram alinhados às versões remotas conhecidas e a instalação limpa conjunta de 18 migrations passou em PostgreSQL local descartável. Isso não alterou o histórico remoto do Polyford; não executar `repair`, `reset` ou `db push` no ambiente remoto por inferência.
- A Q-025 permanece aberta para avaliar a compatibilidade da stack Supabase + Vercel com as restrições da FORD. A integração das policies no repositório e os testes no ambiente de desenvolvimento não equivalem à homologação da FORD ou à certificação de segurança em produção.

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

### 9.1 Evidência técnica integrada — PR #173

A PR #173 implementou e integrou à main o núcleo de auditoria genérica e controles de retenção da Issue #102:

- audit_events mantém catálogo de eventos, ator, recurso, horário, resultado e metadata JSON. A escrita exige TI ativo e correspondência entre o ator e auth.uid(); a metadata é validada para rejeitar chaves relacionadas a conteúdo de mensagens/conversas e a dados sensíveis, como senhas, tokens, segredos, cookies e credenciais.
- A trilha é append-only para operações diretas: UPDATE, DELETE e TRUNCATE comuns são rejeitados.
- retention_holds permite que TI ativo coloque e libere holds; há proteção contra dois holds ativos para o mesmo recurso. A colocação e a liberação geram eventos de auditoria próprios.
- O descarte controlado de um registro de audit_events ocorre por public.discard_audit_event(uuid), SECURITY INVOKER, com verificação de TI ativo, proteção por hold sobre o evento ou recurso referenciado e registro de retention_discarded. A policy de DELETE exige os marcadores transacionais definidos pela função; eventos de controle de retenção não podem ser descartados.
- A serialização entre alteração de holds e descarte utiliza advisory locks transacionais, conforme a correção validada na entrega.

Os testes de auditoria, holds e descarte foram executados no Supabase de desenvolvimento e terminaram com ROLLBACK. Os resultados registrados demonstram bloqueio por holds, liberação e descarte auditado sem apagar registros reais durante os testes. O writer explícito de aplicação utiliza JWT do usuário e chave publishable; não aceita service-role.

**Eventos com geração integrada nesta entrega:** edição administrativa de mensagem (message_admin_edited), exclusão lógica administrativa de mensagem (message_admin_deleted), fechamento de alerta (alert_closed), colocação/liberação de holds (retention_hold_placed e retention_hold_released) e descarte controlado (retention_discarded).

**Eventos catalogados que ainda dependem de call-sites nos fluxos de aplicação:**

- conversation_viewed e conversation_exported;
- attachment_downloaded e attachment_released;
- configuration_changed — o evento e o writer existem, mas os handlers de configuração ainda precisam chamá-lo. Os triggers iniciais de configuração foram removidos após a validação de atribuição do ator não passar.

Eventos de login, contas, grupos e memberships permanecem coordenados com a Issue #124 e sua trilha privileged_action_audit. A PR #173 não substitui nem duplica essa responsabilidade.

### 9.2 Limites da implementação e da retenção operacional

- O descarte autorizado implementado nesta entrega atua somente sobre registros de audit_events. Não representa exclusão física ou descarte de mensagens, anexos, alertas ou registros de privileged_action_audit; esses fluxos dependem das regras próprias e das Issues #117 e #124.
- A PR #181 e `docs/storage/issue-115-private-storage-evidence.md` registram o provisionamento do bucket privado `attachments`. A PR #185 acrescentou o endpoint inicial de upload server-side, mas a consulta de evidência da PR #182 encontrou zero objetos no bucket; não há comprovação de upload real ponta a ponta, download/signed URLs, scanner integrado, quotas ou descarte físico. O ciclo de vida de anexos continua incompleto e as Issues #115 e #117 permanecem abertas.
- O requisito funcional de backups diários de banco e anexos com retenção de 12 meses permanece válido. A PR #182 documentou, com evidências sanitizadas e revisão SQA/Tech Lead favorável no escopo documental, que o plano Supabase Free consultado não fornece backups automáticos diários do banco, que cópias do banco não abrangem os objetos do Storage e que não havia destino externo/off-site, retenção de 365 dias ou teste de restauração configurados/evidenciados. RPO/RTO de até 24 horas permanecem não demonstrados. É necessária uma solução de backup externo/off-site aprovada pela FORD que cubra banco e objetos, retenha 365 dias e tenha testes de restauração documentados.
- A aprovação do SQA e do Tech Lead na PR #173 é restrita ao escopo implementado. A Issue #102 foi encerrada após a integração, mas o encerramento não significa que os call-sites, Storage, descarte físico, backups ou restauração estejam concluídos.
- A PR #180 reconciliou os nomes/versões locais e validou a instalação limpa de 18 migrations em banco local descartável, sem alterar o histórico remoto. Nenhuma aprovação desta entrega autoriza executar `migration repair`, `db reset` ou `db push` no Polyford remoto por inferência.

A implementação técnica dos mecanismos de retenção não altera nem reduz as regras funcionais aprovadas acima. O modelo não deve introduzir cascatas, exclusões ou expirações que contradigam essas regras.

## 10. Rastreabilidade com requisitos e issues

| Elemento do modelo | Requisitos / regras | Issues e decisões relacionadas |
|---|---|---|
| profiles | RF-001, RF-002, RF-003, RF-004; RN-001, RN-002, RN-003, RN-004, RN-005 | #99, #103, #104, #105; ADR-004; Q-005 |
| conversations | RF-005, RF-007 a RF-010; RN-006, RN-007, RN-010 | #99, #107, #109, #110; PR #165 (schema) e PR #172 (policies RLS); decisões de unicidade e ciclo de vida nesta versão |
| memberships | RF-005, RF-006, RF-008, RF-010; RN-007 | #99, #100, #101, #124; PR #165 (schema), PR #172 (RLS) e instrumentação privilegiada coordenada com #124; decisões de remoção/reentrada nesta versão |
| messages | RF-008 a RF-010, RF-019, RF-020; RN-006, RN-007, RN-014 | #99, #109, #110, #111; PR #165 (schema), PR #172 (RLS) e PR #173 (auditoria das ações administrativas de edição/exclusão lógica); ADR-007; mensagem com anexo e recibos de leitura |
| message_reads | RF-007, RF-019 | #99, #111, #112, #113; recibo por mensagem e leitor definido nesta versão |
| attachments | RF-011, RF-012, RF-013; RN-008, RN-011; RNF-010 | #99, #114, #115, #116, #117; PR #165 (metadados/constraint), PR #172 (RLS), PR #181 (bucket privado de 10 MiB) e PR #185 (upload server-side inicial também limitado a 10 MiB); limite funcional de 10 MiB (10.485.760 bytes) alinhado no banco, bucket e upload inicial; demais etapas do ciclo de anexos pendentes em #115/#117; Q-004/Q-011 respondidas; ADR-008 |
| audit_events | RF-016, RF-020, RF-021, RF-022; RN-014, RN-021; RNF-004 e RNF-011 | #99, #102, #121, #124; PR #173 (trilha genérica e controles de retenção); auditoria privilegiada e call-sites de contas/grupos/memberships permanecem coordenados com #124; Q-009/Q-010 respondidas; ADR-010 |
| security_alerts | RF-014, RF-015; RN-012, RN-013 | #99, #122, #123; Q-007/Q-008 respondidas; ADR-010 |
| Configurações TI | RF-014/RF-015; RN-003; Q-018 | #99, #101, #102, #122; PR #165 (estruturas específicas), PR #172 (RLS) e PR #173 (writer de auditoria; call-sites de configuração ainda pendentes) |
| Autorização e RLS de domínio | Regras de acesso por perfil, participação vigente e estado da conversa | #100, #101; PR #172; ADR-006 |
| Segurança, identidade e infraestrutura transversal | RF-001 a RF-004; RN-001 a RN-005, RN-016, RN-022; RNF-001, RNF-002, RNF-003, RNF-013 | #99, #100, #103, #105; ADR-003 (**Accepted**), ADR-004, ADR-005, ADR-006; Q-025; autenticação, proteção de dados, gestão de sessão e fronteira de infraestrutura são restrições transversais, não novas entidades por inferência |
| Continuidade, capacidade e retenção operacional | RF-009, RF-010, RF-022; RN-018, RN-021, RN-023; RNF-004, RNF-007, RNF-008, RNF-009, RNF-011 | #99, #102, #117, #124, #130; PR #182 e seção 9; evidências documentais confirmam lacunas atuais de backup/restore; destino externo, retenção de 365 dias, restauração, RPO/RTO e capacidade seguem sem implementação/homologação |
| Dispositivo, interface e aviso de monitoramento | RF-017, RF-018, RF-023; RN-015, RN-025; RNF-005, RNF-006, RNF-012 | POLY-UX-DEC-001 e critérios de homologação; requisitos de apresentação/restrição de dispositivo não justificam tabela de domínio sem necessidade de persistência definida; RF-023 exige apresentação do aviso no primeiro acesso, sem requisito explícito de tabela de aceite nesta baseline |
| Escopo organizacional, integrações e governança do lançamento | RN-009, RN-017, RN-019, RN-020, RN-024 | POLY-REQ-001 v0.5, docs/01-visao-geral-e-escopo.md, POLY-UX-DEC-001, Q-018 e Q-019; restrições de público, ausência de integração com outros comunicadores, identidade visual, referência comercial e processo Go/No-Go não criam entidades persistentes neste modelo |

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

### 11.2 Retificação do limite de anexos — decisão corrigida do PO em 26/11/2026

O parecer original de 20/11/2026 confirmou a regra de produto como “até 10 MB por arquivo”, sem explicitar a base numérica da unidade. O complemento de 26/11/2026 interpretou essa expressão como 10.000.000 bytes (MB decimal), mas essa interpretação foi um equívoco do PO e fica expressamente substituída por esta retificação.

A decisão funcional correta é permitir arquivos de até **10 MiB (10.485.760 bytes)**, por arquivo, mantendo o máximo de cinco anexos por mensagem. Essa interpretação corresponde ao limite já adotado na constraint de `public.attachments`, no bucket privado `attachments` e no endpoint inicial de upload da PR #185, além de ter sido confirmada por inspeção somente de leitura no projeto Supabase Polyford em 26/11/2026.

Esta retificação corrige a interpretação da unidade, sem alterar formatos permitidos, quantidade de anexos por mensagem ou regras de quota, e não modifica a baseline `POLY-REQ-001 v0.5`. Ela não equivale à aprovação do schema físico, de migrations, de configuração operacional ou da conclusão do ciclo de anexos.

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
8. **Anexos:** PDF/JPEG, até 10 MB por arquivo (unidade esclarecida pela retificação do PO em 26/11/2026: 10 MiB/10.485.760 bytes; prevalece a seção 11.2), até cinco arquivos por mensagem, quotas individuais e capacidade total administradas pelo TI, sem quota por conversa; antimalware interno à FORD, bloqueio em falha/inconclusão e liberação excepcional autenticada/auditada pelo TI.
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

A stack tecnológica adotada pelo projeto é Supabase + Vercel. A ADR-005 continua com status Proposed e deve ser alinhada a essa direção técnica pelos responsáveis; a Q-025 permanece para tratar a compatibilidade com as restrições registradas pela FORD. A migration Supabase existente é o scaffold inicial da solução, não um artefato a ser descartado.

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
- [x] PO retifica em 26/11/2026 a interpretação decimal anterior de 10 MB, define o limite vigente como 10 MiB (10.485.760 bytes) e confirma o alinhamento com a constraint, o bucket e o endpoint por inspeção somente de leitura no Polyford.
- [x] PO atualiza a fotografia do modelo em 26/11/2026 para refletir as PRs #180, #181, #182 e #185, preservando os limites da reconciliação local, do upload inicial e das evidências de backup/restore.

Esta seção registra exclusivamente as decisões de produto concluídas. Não constitui encaminhamento, solicitação ou registro de revisão técnica/SQA e não marca como concluída nenhuma entrega de schema físico ou migration.

## 14. Limites do documento para uso em implementação

O modelo desta versão continua sendo um registro conceitual validado pelo PO; não constitui, por si só, um DER físico aprovado pelo PO nem uma homologação operacional. Parte da estrutura física já foi implementada, revisada e integrada pelas PRs registradas na seção 2.2. Essa implementação técnica não amplia retroativamente o escopo da aprovação funcional do PO.

A estrutura física já integrada e os incrementos técnicos ainda pendentes devem preservar, sem alterar as decisões de produto:

- unicidade da conversa individual por par;
- histórico de períodos de membership e revogação/reentrada sem recuperação do histórico anterior;
- estado de grupos ativo, desativado e encerrado;
- validação de que a mensagem possui texto ou pelo menos um anexo;
- limite funcional de anexos de 10 MiB (10.485.760 bytes), quantidade máxima de cinco por mensagem e quotas definidas pelo TI; constraint do banco, bucket e endpoint estão alinhados ao limite funcional vigente;
- confirmação de leitura por mensagem/participante;
- catálogo e rastreabilidade dos eventos administrativos;
- ocorrência de alertas com regras, severidade e revisão;
- retenção e preservação histórica previstas na RN-021;
- persistência somente das configurações identificadas no inventário;
- identidade, armazenamento e processamento de acordo com a stack definida (Supabase + Vercel), com os impactos frente às restrições da FORD tratados explicitamente na Q-025.

Para aspectos ainda não definidos ou que dependam de evolução, qualquer escolha de tabela, campo, tipo, constraint, índice, FK, estratégia de autenticação, armazenamento, RLS ou migration continua sendo decisão de implementação. As entregas já integradas estão delimitadas na seção 2.2; novos ajustes poderão variar desde que preservem os requisitos e não contradigam o parecer funcional do PO.

## 15. Histórico de revisões

| Versão | Data | Alteração | Estado |
|---|---|---|---|
| 0.1 | 18/11/2026 | Primeira proposta do modelo lógico, dicionário preliminar, relacionamentos, rastreabilidade e registro das decisões pendentes. | Proposta inicial |
| 0.2 | 19/11/2026 | Valida o escopo funcional das entidades centrais, inclui `security_alerts` e delimita configurações persistentes como dependentes de inventário. | Escopo conceitual validado pelo PO |
| 0.3 | 20/11/2026 | Atualiza a baseline para v0.5; alinha o modelo conceitual à stack Supabase + Vercel definida para o projeto; atualiza decisões de grupos, memberships, mensagens, anexos, auditoria, alertas e configurações; define unicidade de conversas individuais, mensagens só com anexo e leitura por mensagem/participante. | Escopo funcional conceitual validado pelo PO; schema físico e migrations não aprovados |
| 0.4 | 26/11/2026 | Atualiza a rastreabilidade das PRs #165, #168, #172, #173 e #181; registra evidências de RLS, auditoria, retenção e bucket privado; acrescenta complemento do PO sobre a interpretação então adotada de 10 MB decimais (10.000.000 bytes), sem alterar a data nem o conteúdo essencial do parecer original de 20/11; registra o desvio físico então identificado. Esse entendimento e a divergência de limite foram posteriormente retificados pelo PO em 26/11/2026, conforme seção 11.2. | Escopo funcional conceitual validado pelo PO; fluxos de anexos permanecem pendentes em #115/#117; a divergência de limite registrada nesta revisão foi posteriormente retificada em 26/11/2026 |
| 0.5 | 26/11/2026 | Atualiza a fotografia técnica após as PRs #180, #181, #182 e #185; registra reconciliação local das migrations com instalação limpa 18/18, avaliação documental de backup/restore e upload server-side inicial; registra a divergência de 10 MiB em relação à interpretação decimal então adotada, posteriormente retificada pelo PO em 26/11/2026 conforme seção 11.2; preserva o parecer original do PO de 20/11. | Escopo funcional conceitual validado pelo PO; ciclo de anexos e continuidade/recuperação permanecem pendentes; a divergência de limite então registrada foi posteriormente retificada em 26/11/2026 |

## 16. Referências internas

### Issues relacionadas

- Issue #99 — Modelar schema PostgreSQL e migrations iniciais.
- Issue #100 — Definir matriz de autorização e políticas RLS.
- Issue #101 — Implementar RLS e testes de isolamento.
- Issue #102 — Definir estratégia de auditoria e retenção de dados.
- Issue #115 — Implementar upload privado de PDF/JPEG.
- Issue #117 — Implementar limites de anexos e proteção antimalware.
- Issue #122 — Implementar detecção de conteúdo suspeito e palavrões.
- Issue #124 — Implementar trilha de auditoria de ações privilegiadas.
- Issue #130 — Implementar plano de release, operação, backup e recuperação.

### Pull requests utilizadas como evidência de implementação

- PR #165 — schema inicial de domínio da Issue #99.
- PR #168 — cobertura de índices de chaves estrangeiras.
- PR #172 — autorização e isolamento RLS da Issue #101.
- PR #173 — trilha de auditoria genérica e controles de retenção da Issue #102.
- PR #180 — reconciliação dos nomes/versões locais das migrations e instalação limpa combinada 18/18 em ambiente local descartável.
- PR #181 — provisionamento do bucket privado `attachments` da Issue #115; limite provisionado de 10 MiB.
- PR #182 — evidências documentais de backup/restore e lacunas da Issue #130.
- PR #185 — endpoint server-side inicial de upload privado PDF/JPEG da Issue #115; limite de 10 MiB (10.485.760 bytes), alinhado ao limite funcional vigente.
- PR #160 — atualização documental do modelo lógico e das decisões de produto da Issue #99; permanece aberta e em Draft enquanto aguarda as revisões correspondentes.

### ADRs, baseline e decisões

- ADR-003 — Direção tecnológica Supabase + Vercel (**Accepted**).
- ADR-005 — Banco de dados e modelo de dados.
- ADR-006 — Autorização server-side e RLS.
- ADR-008 — Storage e anexos.
- ADR-010 — Segurança, auditoria e monitoramento.
- POLY-REQ-001 — Baseline consolidada de requisitos e escopo MVP.
- POLY-REQ-001 v0.5; RF-001 a RF-023; RN-001 a RN-025; Q-003, Q-005, Q-007, Q-008, Q-009, Q-010, Q-011, Q-016, Q-018, Q-024 e Q-025.
