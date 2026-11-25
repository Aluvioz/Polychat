# Issue #99 — evidências de implementação e estado verificado

## Escopo original preservado

A Issue #99 solicita modelar `profiles`, `conversations`, `memberships`, `messages`, `attachments`, `audit_events` e configurações.

Seu escopo original permanece:
- Implementar conforme arquitetura Supabase + Vercel e requisitos aprovados.
- Validar autorização server-side e comportamento de erro.
- Atualizar documentação e evidências pertinentes.

Os critérios de aceite originais permanecem inalterados:
- Migrations versionadas; constraints, índices e relações revisados.
- Testes relevantes automatizados ou evidência documentada.
- Revisão por PR concluída.
- Sem regressão nos fluxos relacionados.

Este arquivo registra evidências e limites. Não altera nem substitui os requerimentos de fechamento, não declara a Issue #99 concluída e não transfere responsabilidades de outras issues.

## 1. Modelagem e migrations versionadas na main

A implementação do schema físico inicial foi integrada pela [PR #165](https://github.com/Aluvioz/Polychat/pull/165), merge commit `f2618bc670282070f87a8f1dd645253c8de9990e`.

A PR #165 recebeu:
- Aprovação técnica do Tech Lead `luizme7`, incluindo as estruturas específicas de configuração.
- Aprovação SQA de `Dante-Davi`, registrada na discussão da PR em 24/11/2026.
- Registro de CI #270 e #340 como aprovados no parecer técnico da PR.

Migrations de domínio integradas:
- `supabase/migrations/202611240001_issue_99_initial_domain_schema.sql`
  - Acrescenta `profiles.username` como nullable, com índice único parcial.
  - Cria `conversations`, `memberships`, `messages`, `attachments`, `message_reads` e `security_alerts`.
  - Define chaves estrangeiras, constraints e índices.
  - Habilita RLS nas tabelas novas, sem criar policies de domínio da #101.
- `supabase/migrations/202611240002_issue_99_integrity_and_configuration.sql`
  - Inclui invariantes transacionais para impedir mensagem sem texto e sem anexo.
  - Impõe o limite de cinco anexos por mensagem.
  - Cria `detection_rules`, `attachment_user_quotas` e `attachment_storage_capacity`, conforme o inventário aprovado.
  - Não cria tabela genérica de configurações nem inventa valores iniciais.

A aprovação da PR #165 cobre o conteúdo nela revisado. Não equivale à conclusão das integrações funcionais, das policies de autorização da #101 ou da auditoria operacional da #102.

## 2. Modelo conceitual e aprovação de produto

O parecer complementar do PO de 20/11/2026 ratificou o escopo conceitual para a baseline POLY-REQ-001 v0.5, incluindo as entidades centrais, `security_alerts`, `message_reads` e o inventário delimitado de configurações.

A atualização do documento `docs/database/modelo-de-dados.md` está proposta na [PR #160](https://github.com/Aluvioz/Polychat/pull/160), que permanece aberta e em Draft na última consulta. A PR informa tratar exclusivamente da atualização documental para a baseline v0.5. A versão atualizada ainda depende de revisão e integração; esta nota não altera a PR #160 nem substitui sua revisão.

A aprovação funcional do PO não deve ser confundida com aprovação técnica do DER físico, DDL, migrations, constraints, índices, triggers ou RLS. A revisão técnica e SQA do schema físico foi registrada separadamente na PR #165.

## 3. Verificação direta do Supabase de desenvolvimento Polyford

Consulta realizada ao projeto Supabase:
- Projeto: `Polyford`.
- Project ref: `oixifpdfvrenlhvycszy`.
- Região: `sa-east-1`.
- Estado consultado: `ACTIVE_HEALTHY`.
- PostgreSQL: `17.11.0.019` (engine PostgreSQL 17).

### 3.1 Histórico remoto de migrations

A consulta ao histórico remoto retornou:

| Versão remota | Nome |
|---|---|
| `20261124191059` | `profiles_roles_and_account_status` |
| `20261124191114` | `issue_99_initial_domain_schema` |
| `20261124191131` | `issue_99_integrity_and_configuration` |
| `20261124210245` | `issue_102_audit_events` |

As duas migrations de domínio da #99 estão presentes no histórico remoto e versionadas na `main` por meio da PR #165.

**Divergência de identificadores ainda não reconciliada:** os identificadores remotos não correspondem literalmente aos prefixos dos arquivos SQL no Git:
- Profiles: arquivo `202611160001`; remoto `20261124191059`.
- Schema inicial #99: arquivo `202611240001`; remoto `20261124191114`.
- Integridade/configuração #99: arquivo `202611240002`; remoto `20261124191131`.
- Auditoria #102: arquivo `202611240003`; remoto `20261124210245`.

A diferença foi registrada, não corrigida. Não se deve reaplicar migrations já executadas nem alterar o histórico remoto sem procedimento explícito e revisão própria.

### 3.2 Tabelas, colunas, relações e RLS observadas

A consulta de leitura ao schema `public` retornou as seguintes tabelas:

| Tabela | Evidência observada |
|---|---|
| `profiles` | PK `id`, FK para `auth.users`, `role` limitado a `user`/`ti`, `is_active`, `username` nullable. |
| `conversations` | PK `id`, tipo `direct`/`group`, estado `active`/`disabled`/`closed`, referências aos perfis criador e participantes diretos. |
| `memberships` | PK `id`, FKs para conversa e perfis, datas de início/fim de participação. |
| `messages` | PK `id`, FKs para conversa, autor e responsáveis por edição/exclusão administrativa; corpo pode ser nulo conforme a regra de mensagem com anexos. |
| `attachments` | PK `id`, FK para mensagem, MIME limitado a PDF/JPEG, tamanho positivo até 10 MiB e metadados de análise. |
| `message_reads` | PK composta `(message_id, reader_profile_id)`, FK para mensagem e perfil leitor. |
| `security_alerts` | PK `id`, FK para mensagem e revisor, severidade `low`/`medium`/`high`, estado `open`/`closed`. |
| `detection_rules` | PK `id`, valor de regra não vazio. |
| `attachment_user_quotas` | PK/FK `profile_id`, quota positiva. |
| `attachment_storage_capacity` | PK `singleton_id`, capacidade positiva e singleton limitado a 1. |
| `audit_events` | PK `id`, FK do ator para `profiles`, catálogo fechado de eventos/recursos e metadados JSONB. |

A listagem detalhada confirmou RLS habilitada nas onze tabelas acima, além das chaves primárias e relações/FKs indicadas. A consulta retornou zero linhas em cada tabela no momento da verificação; isso descreve o estado observado, não é teste de fluxo de negócio.

As policies de domínio e configuração permanecem no escopo da Issue #101. A presença de RLS habilitada não significa que as policies de autorização da aplicação estejam concluídas.

### 3.3 Situação específica de audit_events

A tabela `public.audit_events` e a migration remota `issue_102_audit_events` já aparecem no Polyford. Entretanto, a implementação correspondente está na [PR #166](https://github.com/Aluvioz/Polychat/pull/166), que permanece aberta e em Draft na última consulta, vinculada à Issue #102.

A PR #166 ainda não foi integrada à `main`. Portanto, a presença da tabela no banco de desenvolvimento não deve ser apresentada como prova de que a migration de auditoria já está integrada e versionada na branch principal. Essa diferença precisa ser resolvida na sequência de integração da #102, sem duplicar a migration ou misturar o escopo das issues.

## 4. Testes, CI e limites das evidências

### Evidências disponíveis para a #99
- Aplicação das duas migrations de domínio no Supabase Polyford registrada na PR #165.
- Consulta direta ao histórico remoto confirmou os dois registros de migration de domínio.
- Consulta direta ao schema `public` confirmou as tabelas, colunas, PKs, FKs e RLS listadas nesta nota.
- A revisão SQA da PR #165 aprovou o schema físico, constraints, FKs, índices, invariantes de mensagem/anexos, estruturas de configuração e evidências de aplicação.
- O parecer técnico da PR #165 registrou CI #270 e #340 como aprovados.

### Limites que permanecem explícitos
- A verificação direta do schema é evidência de presença/estrutura no ambiente de desenvolvimento; não é, por si só, teste automatizado reproduzível no CI.
- Não se declara nesta nota que a autorização de domínio/configuração está concluída: policies e enforcement pertencem à #101.
- A gravação de mensagem composta somente por anexos depende de mensagem e anexos serem persistidos na mesma transação/RPC. A migration contém a invariância diferida, mas a integração funcional do fluxo ainda depende das issues de produto correspondentes.
- `profiles.username` permanece nullable; não foi inventado preenchimento para contas existentes.
- A presença de `audit_events` no Supabase não conclui a integração da migration na `main`, nem a implementação funcional de auditoria da #102.
- A ADR-005 permanece Proposed e a Q-025 permanece aberta para avaliação da compatibilidade operacional da stack com as restrições FORD.

## 5. Relação com outras issues — sem transferência de escopo

- **#101:** policies RLS, matriz/enforcement de autorização e testes de acesso. A RLS habilitada na modelagem não substitui essa entrega.
- **#102:** auditoria, retenção e descarte; a migration de `audit_events` está na PR #166 ainda aberta em Draft.
- **#105:** fluxos de perfis/contas e operações associadas.
- **#111:** requisitos de leitura/não lidas refletidos por `message_reads`.
- **#117:** armazenamento privado e fluxos de anexos.
- **#124:** integração dos eventos aos fluxos de negócio, coordenada com a auditoria.

Esta separação descreve dependências e limites já registrados no projeto; não altera o escopo ou os critérios de aceite da Issue #99.

## 6. Estado documental desta revisão

Esta atualização corrige o registro anterior que ainda descrevia a PR #165 como não integrada e a aprovação SQA como pendente. O estado correto consultado é: PR #165 merged, Tech Lead aprovado e SQA aprovado.

A PR #160 e a PR #166 continuam separadas, abertas e em Draft na última consulta. A divergência de identificadores do histórico remoto também continua pendente.

**Conclusão desta nota:** há evidência documentada de migrations de domínio integradas e aplicadas, schema presente no Supabase de desenvolvimento e revisão técnica/SQA aprovada para a PR #165. Isso atualiza a rastreabilidade da Issue #99, mas não declara todos os critérios originais satisfeitos nem autoriza seu fechamento.

Nenhuma descrição, critério, estado, assignee ou label da Issue #99 foi alterado.

## Complemento — cobertura de índices de FKs (25/11/2026)

O Supabase Performance Advisor identificou seis chaves estrangeiras sem índice de cobertura:
- `conversations.direct_user_b_id`;
- `memberships.added_by_profile_id`;
- `memberships.ended_by_profile_id`;
- `messages.edited_by_profile_id`;
- `messages.deleted_by_profile_id`;
- `security_alerts.reviewed_by_profile_id`.

Esta PR acrescenta a migration aditiva `202611250001_issue_99_fk_covering_indexes.sql`, contendo somente os seis índices correspondentes. A migration foi executada no Polyford dentro da transação de teste e revertida com `ROLLBACK`; a execução verificou os índices durante a transação, mas não os deixou persistidos no banco. A migration ainda aguarda revisão e integração.

### Evidências de teste e CI

- O teste SQL transacional reportado nesta PR cobriu as invariantes de conversa direta, membership, FKs, metadados de edição/exclusão, mensagem com anexos, constraints diferidas, limites de anexos, MIME/tamanho, message_reads, revisão de alertas e configurações. Os registros temporários e a DDL foram revertidos com `ROLLBACK`.
- A validação de RLS reportada nesta PR observou ausência de leitura por `anon` e `authenticated` e rejeição de `INSERT` autenticado com SQLSTATE `42501`; isso não substitui a implementação das policies nas issues responsáveis.
- Os workflows GitHub Actions associados ao commit `942c5465e90236ea6ca668a913f0cf9a6dfda787` (#332 e #402) concluíram com `success`.
- O head documental anterior `99ab9cc100dd8f5a95e922056e39a33f065c9618` não tinha workflows associados na consulta registrada. A atualização desta seção gera novo commit e exige confirmação dos checks no head resultante.
- O Preview Vercel registrado para o head anterior estava `Ready`; o novo commit precisa gerar/confirmar seu próprio Preview.

### Limites e decisão

- Os seis índices não foram aplicados persistentemente ao Supabase.
- A divergência entre os identificadores Git e o histórico remoto de migrations continua sem reconciliação byte a byte; nenhum repair, reset ou reaplicação foi executado.
- Os avisos de índices não utilizados não foram tratados como justificativa para remoção, pois as tabelas verificadas estavam vazias e não há carga representativa.
- Esta alteração não implementa policies RLS, fluxos de mensagens/anexos, auditoria/retenção ou operações de outras issues.
- A Issue #99 permanece aberta: a migration aditiva ainda requer revisão/integração e aplicação pelo procedimento autorizado, além da validação dos fluxos transacionais que dependem das issues funcionais correspondentes.

