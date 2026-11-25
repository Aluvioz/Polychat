# Issue #99 — registro de implementação e lacunas

## Auditoria do estado inicial

- A Issue #99 solicita modelar profiles, conversations, memberships, messages, attachments, audit_events e configurações.
- A PR #160 está aberta em Draft e contém a versão 0.3 de `docs/database/modelo-de-dados.md`. O parecer do PO valida o escopo funcional conceitual, mas não aprova DDL, schema físico, migrations ou RLS.
- A migration existente `202611160001_profiles_roles_and_account_status.sql` cria `profiles`, integra `auth.users`, limita `role` a `user`/ `ti`, mantém `is_active` e ativa RLS.
- Na `main`, foi identificada somente essa migration em `supabase/migrations`.
- A ADR-005 permanece Proposed e a Q-025 continua aberta para compatibilidade operacional da stack Supabase + Vercel com as restrições FORD.

## Implementado nesta branch

### Migration `202611240001_issue_99_initial_domain_schema.sql`

- Acrescenta `profiles.username` nullable com índice único parcial, sem inferir usernames para contas existentes.
- Cria `conversations`, com tipos `direct`/ `group`, estados documentados e par canônico para unicidade de conversa individual.
- Cria `memberships`, preservando períodos e impedindo dois períodos vigentes por perfil/conversa.
- Cria `messages`, com autoria, ordenação temporal e metadados de edição/exclusão administrativa.
- Cria `attachments`, com referência privada, nome original, MIME PDF/JPEG, limite de 10 MiB e metadados de análise.
- Cria `message_reads` por mensagem/leitor/instante.
- Cria `security_alerts` com regra, severidade e estado/revisão.
- Define FKs restritivas para preservar histórico e índices para as relações/consultas modeladas.
- Habilita RLS nas tabelas novas sem policies de domínio; enforcement pertence à #101.

### Migration `202611240002_issue_99_integrity_and_configuration.sql`

- Trigger diferido valida no commit que cada mensagem tenha texto não vazio ou ao menos um anexo.
- Trigger serializa inserções/alterações por mensagem e impede mais de cinco anexos, conforme o modelo v0.3 e a Issue #117.
- Cria `detection_rules`, `attachment_user_quotas` e `attachment_storage_capacity`, cobrindo somente o inventário aprovado pelo PO.
- Não cria tabela genérica `configs`, não semeia regras/quota/capacidade e não inventa valores padrão.
- Habilita RLS e revoga acesso de `anon`/`authenticated` às tabelas de configuração; policies e exposição pertencem à #101.

As estruturas específicas `detection_rules`, `attachment_user_quotas` e `attachment_storage_capacity` foram revisadas e aprovadas pelo Tech Lead `luizme7` como parte da baseline inicial do schema, conforme registrado nos comentários da PR. A aprovação não substitui a implementação de autorização/exposição, que permanece no escopo da Issue #101.

## Pendências e limites restantes

### Issue #102 — auditoria e retenção

A estrutura `audit_events`, seu catálogo, controles append-only e writer são tratados na PR separada #166, aberta contra `main`. Recomenda-se integrar a PR #166 após a PR #165 para preservar a sequência das migrations. A Issue #99 não deve ser considerada concluída apenas pela existência das migrations de domínio.

### Username de perfis existentes

A coluna permanece nullable. Para torná-la obrigatória, é necessária estratégia confiável de preenchimento para contas preexistentes antes de adicionar NOT NULL.

### Integração das invariantes transacionais

A constraint trigger diferida exige que a criação de mensagem somente com anexos e os respectivos metadados ocorra na mesma transação. O fluxo precisa usar operação server-side transacional (por exemplo, RPC); chamadas REST separadas não satisfazem essa atomicidade. A integração funcional ainda depende dos fluxos de mensagens/anexos.

### Autorização e integração das configurações

As tabelas de configuração permanecem sem policies e sem concessão de acesso aos papéis da API. A Issue #101 deve definir e testar o enforcement. Serviços/telas de configuração e consumo das regras permanecem nas issues funcionais correspondentes.

### Ambiente e validação SQL

As duas migrations desta PR foram aplicadas no projeto Supabase de desenvolvimento **Polyford** (`oixifpdfvrenlhvycszy`), localizado em `sa-east-1`. Na verificação mais recente, o projeto estava em estado `ACTIVE_HEALTHY`, com PostgreSQL `17.11.0.019`.

O histórico remoto de migrations contém os seguintes registros correspondentes às migrations de domínio desta PR:

- `20261124191114` — `issue_99_initial_domain_schema`
- `20261124191131` — `issue_99_integrity_and_configuration`

O histórico também contém a migration de baseline de perfis (`20261124191059`, `profiles_roles_and_account_status`) e, posteriormente, a migration de auditoria da Issue #102 aplicada no contexto da PR #166 (`20261124210245`, `issue_102_audit_events`).

**Observação de rastreabilidade:** as versões registradas pelo histórico remoto são os identificadores gerados no ambiente e não repetem literalmente os prefixos dos arquivos SQL versionados no Git. Essa diferença de identificadores deve ser considerada ao reconciliar o histórico de migrations; não significa que as migrations de domínio estejam ausentes do ambiente.

A consulta ao schema `public` confirmou as tabelas de domínio/configuração previstas pelas migrations desta PR: `conversations`, `memberships`, `messages`, `attachments`, `message_reads`, `security_alerts`, `detection_rules`, `attachment_user_quotas` e `attachment_storage_capacity`. A tabela `profiles` já existia na baseline. A RLS está habilitada nas tabelas criadas pela modelagem; as policies de domínio e configuração continuam atribuídas à Issue #101.

A aplicação e a inspeção do schema no Polyford comprovam a presença das migrations e estruturas no ambiente de desenvolvimento. **Não equivalem a um teste automatizado de integração SQL/PostgreSQL reproduzível no CI.** A integração server-side/RPC para criação atômica de mensagem e anexos continua pendente dos fluxos de produto correspondentes.

A Q-025 e a ADR-005 Proposed continuam sendo referências pendentes para a homologação operacional da stack.

## Validação

No commit documental `f46b7f64e5105c8ba7bd97e4c31fa2e9a20057c4`, os dois workflows CI associados concluíram com sucesso:

- CI run [#286](https://github.com/Aluvioz/Polychat/actions/runs/45489032173) — `success`.
- CI run [#356](https://github.com/Aluvioz/Polychat/actions/runs/45489032376) — `success`.

O status do Preview Vercel também retornou `success`. Esses resultados validam os checks de aplicação/build configurados, mas não substituem testes automatizados de integração SQL, RLS ou dos fluxos transacionais no Supabase.

No head então atual da PR, `ee031af1fd00c9f515a3669ba9337a89f914eca3`, os dois workflows CI também concluíram com sucesso:

- CI run [#359](https://github.com/Aluvioz/Polychat/actions/runs/45495416188) — `success`.
- CI run [#289](https://github.com/Aluvioz/Polychat/actions/runs/45495416126) — `success`.

O Preview Vercel associado a esse head também retornou `success`.

A revisão do Tech Lead `luizme7` está registrada como **APPROVED** para a baseline inicial do schema, incluindo as três estruturas específicas de configuração, com as ressalvas descritas nesta nota. A confirmação formal final do SQA permanece pendente.


## Auditoria complementar — 25/11/2026

Esta seção registra uma nova consulta ao GitHub e ao projeto Supabase Polyford. Ela complementa as evidências anteriores sem alterar a Issue #99 ou seus critérios originais.

### Estado atual consultado

- Issue #99: **OPEN**, com título, corpo, critérios de aceite, assignees e labels preservados.
- `main` consultada no commit `f2618bc670282070f87a8f1dd645253c8de9990e`.
- PR #165: **MERGED** no commit `f2618bc670282070f87a8f1dd645253c8de9990e`; aprovação do Tech Lead registrada e comentário posterior de Dante-Davi declara a PR **APROVADA sob a perspectiva do SQA**, limitada ao conteúdo e às responsabilidades daquela PR. As ressalvas funcionais e de integração continuam registradas.
- PR #160: **OPEN / DRAFT**; contém o modelo conceitual v0.3, sem aprovação técnica final registrada. Não foi alterada.
- PR #166: **OPEN / DRAFT**; migration e writer de auditoria estão no branch da PR, não na `main`. O histórico da PR registra parecer SQA **NÃO APROVADO** e revisão do Tech Lead sem APPROVE final. Não foi alterada.
- PR #167: **OPEN / DRAFT**; atualização documental anterior da #99. Não foi encerrada nem modificada nesta execução, pois ainda aguarda validação e não foi comprovadamente substituída por PR integrada.

### Migrations: correspondência e limites de comprovação

O histórico remoto atual do Polyford contém:

| Arquivo/prefixo Git | Versão remota | Nome remoto | Resultado da comparação |
|---|---:|---|---|
| `202611160001_profiles_roles_and_account_status.sql` | `20261124191059` | `profiles_roles_and_account_status` | Nome compatível; estrutura atual de `profiles` contém a baseline e a coluna `username` acrescentada pela migration #99. Não há hash/SQL original no histórico remoto para comprovar igualdade byte a byte. |
| `202611240001_issue_99_initial_domain_schema.sql` | `20261124191114` | `issue_99_initial_domain_schema` | Nome compatível; tabelas, colunas, PKs, FKs, constraints, índices e RLS observados correspondem semanticamente à migration versionada. Igualdade byte a byte não é comprovável pelo histórico remoto disponível. |
| `202611240002_issue_99_integrity_and_configuration.sql` | `20261124191131` | `issue_99_integrity_and_configuration` | Nome compatível; tabelas de configuração, triggers e constraints de integridade observados correspondem semanticamente à migration versionada. Igualdade byte a byte não é comprovável pelo histórico remoto disponível. |
| `202611240003_issue_102_audit_events.sql` | `20261124210245` | `issue_102_audit_events` | Nome compatível; a migration existe no branch da PR #166 e a estrutura de auditoria está no Polyford. O arquivo não existe na `main`; sua integração Git permanece pendente. Igualdade byte a byte não é comprovável pelo histórico remoto disponível. |

**Conclusão de reconciliação:** os quatro pares têm correspondência de nome e o schema atual confirma a presença semântica das alterações descritas para #99 e #102. O Supabase não expõe, pelo histórico consultado, o conteúdo/hash de cada migration aplicada. Portanto, não declaro equivalência criptográfica/byte a byte nem reconciliação do identificador temporal. Nenhum `db push`, reset, repair ou reaplicação foi executado.

### Schema, integridade, índices e RLS observados

A consulta ao projeto `oixifpdfvrenlhvycszy` confirmou as 11 tabelas revisadas: `profiles`, `conversations`, `memberships`, `messages`, `attachments`, `message_reads`, `security_alerts`, `detection_rules`, `attachment_user_quotas`, `attachment_storage_capacity` e `audit_events`. Todas estavam vazias na consulta; não foram criados registros de teste persistentes.

Foram inspecionadas PKs, FKs, CHECK constraints, índices, triggers, RLS e policies. As invariantes observadas incluem:
- Par canônico e único para conversas individuais;
- Um único período vigente de membership por perfil/conversa;
- Consistência dos metadados de edição/exclusão;
- Mensagem com texto não vazio ou ao menos um anexo, validada por constraint trigger diferida;
- Até cinco anexos por mensagem, com serialização por advisory transaction lock;
- MIME limitado a PDF/JPEG e tamanho entre 1 byte e 10 MiB;
- Estruturas específicas para regras de detecção, quota individual e capacidade total, sem tabela genérica de configuração.

O Security Advisor identificou RLS habilitada sem policies em nove tabelas de domínio/configuração. Isso mantém essas tabelas sem acesso por policy e corresponde ao limite de autorização atribuído às Issues #100/#101; não foram criadas policies nesta execução. As duas policies de `audit_events` e a policy de leitura de `profiles` foram observadas separadamente.

O Security Advisor também apontou três funções `SECURITY DEFINER` da baseline de perfis executáveis por `anon` e `authenticated` (`create_default_profile`, `is_active_ti` e `prevent_client_profile_privilege_changes`). Essas funções pertencem à migration de perfis/#105 e não foram modificadas dentro da #99; o achado fica registrado para tratamento no escopo responsável.

### Índices de FKs: correção preparada nesta branch

O Performance Advisor apontou seis FKs sem índice de cobertura:
- `conversations.direct_user_b_id`;
- `memberships.added_by_profile_id`;
- `memberships.ended_by_profile_id`;
- `messages.edited_by_profile_id`;
- `messages.deleted_by_profile_id`;
- `security_alerts.reviewed_by_profile_id`.

Foi acrescentada nesta branch a migration aditiva `202611250001_issue_99_fk_covering_indexes.sql`, criando somente os seis índices correspondentes. A DDL foi executada em transação no Polyford e revertida com `ROLLBACK`: sintaxe/execução confirmadas, sem alteração persistente do schema e sem nova entrada no histórico remoto. A migration ainda **não foi aplicada** ao banco; sua aplicação depende da revisão/integração Git e da reconciliação operacional do histórico.

Os avisos de índices existentes não utilizados foram mantidos como observação, não como motivo para removê-los: as tabelas consultadas estavam vazias e não há carga representativa para justificar remoção.

### Testes e CI consultados

- Um bloco SQL de asserções de catálogo foi executado no Polyford e passou: presença das 11 tabelas, RLS nas tabelas revisadas, triggers de integridade de mensagens/anexos e CHECK constraints de MIME/tamanho.
- A DDL dos seis índices foi executada em transação e revertida com sucesso.
- Foi executado um teste SQL comportamental no Polyford em uma única transação revertida (ROLLBACK), usando duas identidades temporárias em auth.users. O trigger criou os perfis correspondentes e todos os dados de teste foram revertidos; a consulta posterior confirmou zero usuários e zero registros de teste remanescentes.
- O teste transacional passou para: par canônico/único de conversa direta; rejeição de par direto inválido; unicidade do período vigente de membership e reinclusão em novo período; consistência dos metadados de edição/exclusão; mensagem somente com anexo válido na mesma transação; rejeição de mensagem vazia sem anexo; MIME e limite de 10 MiB; limite de cinco anexos; consistência de revisão de alertas; constraints das três estruturas de configuração.
- A migration aditiva dos seis índices foi executada no mesmo teste e os seis índices foram encontrados durante a transação. O ROLLBACK removeu todos: consulta posterior confirmou zero índices de teste persistidos.
- Autorização observada no banco: anon e authenticated retornaram zero mensagens nas tabelas com RLS e sem policies de domínio; um INSERT como authenticated foi rejeitado pelo PostgreSQL com SQLSTATE 42501 (violação de RLS). Não foram criadas policies nem alteradas permissões.
- Os testes automatizados existentes da aplicação foram executados pelo CI do commit da PR 942c5465e90236ea6ca668a913f0cf9a6dfda787: workflow #332, job Lint, typecheck and build, incluindo testes automatizados, ESLint, TypeScript, build Next.js e smoke test, concluiu com success; workflow #402, job build, também concluiu com success. O Preview Vercel da PR ficou Ready.
- A árvore tests/ não contém teste SQL de integração específico da modelagem #99; a validação SQL acima foi executada diretamente no Polyford e revertida integralmente.

### Limites entre Issues

- **#100/#101:** matriz de autorização e implementação/teste de policies de domínio/configuração; não foram inventadas policies.
- **#102:** catálogo, persistência e controles de auditoria estão na PR #166, ainda não integrada à `main`; não foram duplicados aqui.
- **#117:** Storage privado, ciclo de anexos e backup de anexos; nenhuma bucket ou policy foi criada nesta execução.
- **#124:** integração de eventos aos fluxos de negócio e atomicidade mutação + auditoria; não foram adicionados call sites nem duplicada responsabilidade.
- A integração server-side/RPC para criar mensagem e anexos na mesma transação continua pendente dos fluxos de aplicação correspondentes.

### Pendências e decisão de fechamento

1. Revisar e integrar a migration aditiva de índices desta branch; somente depois, planejar sua aplicação no ambiente conforme a reconciliação aprovada do histórico.
2. Comprovar a sequência e a equivalência exata das migrations remotas por procedimento operacional autorizado; o histórico remoto disponível não fornece conteúdo/hash para comparação.
3. Implementar e testar as policies sob #100/#101.
4. Integrar a gravação transacional de mensagem/anexos nos fluxos da aplicação.
5. Aguardar a integração e validação formal da PR #166/#102, sem antecipar sua responsabilidade.
6. Obter revisão formal do SQA e concluir a revisão por PR conforme os critérios originais.

**Conclusão:** a modelagem base da #99 está presente na `main` e no Polyford, e os checks de aplicação/build atuais passaram. Ainda assim, a Issue #99 não atende integralmente aos critérios originais de fechamento: falta teste automatizado/reproduzível de integração SQL e regressão dos fluxos, a migration aditiva de índices ainda aguarda revisão/aplicação, a integração transacional de mensagens/anexos permanece pendente e a revisão SQA final não foi comprovada. A Issue #99 deve permanecer aberta.
