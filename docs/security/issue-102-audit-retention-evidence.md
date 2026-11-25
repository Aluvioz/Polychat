# Issue #102 — evidências de auditoria e retenção

Data: 25/11/2026  
Ambiente consultado: Polyford / Supabase de desenvolvimento  
PostgreSQL: 17.11.0.019

## Implementação desta branch

Esta entrega foi reconstruída a partir do schema observado no Supabase e dos requisitos aprovados da Issue #102. Não foram consultados, copiados ou alterados arquivos, commits ou comentários da PR #166.

### Trilha de auditoria genérica

- Mantém `audit_events` com catálogo de eventos, ator, recurso, horário, resultado e metadata JSON.
- Restringe leitura e escrita de eventos ao operador TI ativo; o ator gravado precisa corresponder a `auth.uid()`.
- Impede metadata com chaves de conteúdo de mensagem/conversa, senha, token, segredo, cookie ou credencial.
- Mantém eventos append-only: UPDATE/DELETE/TRUNCATE diretos são rejeitados.
- Registra em trigger a edição/exclusão lógica administrativa de mensagens e o fechamento de alertas, na mesma transação da mutação.
- O módulo `src/audit/audit-events.mjs` oferece escrita explícita para eventos que dependem de callsites de aplicação, usando JWT do usuário e chave anon; nunca aceita service-role.

### Preservação de investigações e descarte autorizado

- Cria `retention_holds`, com recurso, ator TI, horário de colocação e liberação.
- Somente TI ativo pode consultar, criar ou liberar holds; não há privilégio de DELETE.
- Um índice único parcial impede dois holds ativos para o mesmo recurso.
- Colocação e liberação do hold geram eventos auditáveis próprios.
- A função `public.discard_audit_event(uuid)` permite somente a TI ativa solicitar descarte de um evento, grava `retention_discarded` e bloqueia descarte quando o evento ou o recurso subjacente possui hold ativo.
- Eventos de controle de retenção não podem ser descartados.

A função de descarte foi implantada, mas **não foi invocada nesta validação**, pois executa exclusão física de um registro de auditoria. Nenhum evento real foi apagado.

### Ajuste após teste

A migration inicial criou triggers para `detection_rules` e `attachment_user_quotas`. A validação de atribuição do ator nesses triggers não passou; por isso, a migration seguinte os removeu. O estado final não declara auditoria automática de mudanças de configuração. O writer explícito existe, mas os handlers de configuração ainda precisam chamá-lo.

## Migrations no Supabase

- `20261125232432_issue_102_audit_retention_controls`
- `20261125232535_issue_102_remove_unverified_config_triggers`
- `20261125232700_issue_102_preserve_held_resource_audit_events`

Os arquivos correspondentes estão versionados em `supabase/migrations/` nesta branch. A migration inicial cria `audit_events` com `CREATE TABLE IF NOT EXISTS`, para que a estrutura seja reproduzível a partir da branch principal, sem depender da PR #166.

## Testes executados

O arquivo `supabase/tests/issue_102_audit_retention.integration.sql` foi executado no ambiente de desenvolvimento. Resultado: `issue_102_audit_and_hold_tests_passed`. A transação foi revertida.

Cenários comprovados:
- usuário comum não lê `audit_events` nem `retention_holds`;
- TI registra evento permitido;
- metadata com chave sensível é rejeitada;
- UPDATE direto em evento de auditoria é rejeitado;
- TI cria e libera hold;
- hold colocado e liberado geram eventos;
- edição administrativa de mensagem gera `message_admin_edited`;
- fechamento de alerta gera `alert_closed`.

Não foram criados usuários, holds ou eventos persistentes pelos testes.

## Limites e dependências

- `conversation_viewed`, `conversation_exported`, `attachment_downloaded` e `attachment_released` exigem callsites nos fluxos de aplicação; não foram inventados handlers que não existem no projeto.
- Alterações de configuração têm evento catalogado e writer explícito, mas não possuem callsites validados nesta entrega.
- Eventos de conta, login administrativo, grupos e memberships continuam coordenados com a Issue #124; esta branch não duplica a tabela `privileged_action_audit` nem seus fluxos.
- Eventos de anexos e descarte do objeto físico dependem da Issue #117; o projeto consultado ainda não possui bucket de Storage.
- O descarte controlado implementado nesta branch atua somente sobre registros de `audit_events`. Não declara descarte físico de mensagens, anexos, alertas ou registros privilegiados; esses fluxos precisam respeitar #117 e #124.
- O requisito aprovado de backup diário por 12 meses e RPO/RTO de até 24 horas não foi comprovado nem configurado por esta entrega. A integração disponível não expõe configuração de backup, restauração ou evidência de RPO/RTO. É necessária comprovação do plano/configuração do provedor e teste de restore.
- A divergência histórica de migrations permanece: o remoto contém versões anteriores que não correspondem aos identificadores antigos versionados no repositório. Não foi executado repair, reset ou `db push`.

## Estado

A trilha transacional de mensagens/alertas, o registro de holds e o writer explícito foram implementados e testados. A retenção completa, os callsites de leitura/anexos/configuração e a evidência de backup/restore ainda não estão concluídos. A Issue #102 permanece aberta, sem declaração de aprovação ou fechamento, aguardando CI, SQA e Tech Lead.
