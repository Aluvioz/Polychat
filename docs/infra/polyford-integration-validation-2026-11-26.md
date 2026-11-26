# Validação de integração no Polyford — 26/11/2026

Projeto: Polyford (`oixifpdfvrenlhvycszy`)  
PostgreSQL: 17.11.0.019  
Ambiente: desenvolvimento

## Testes SQL executados no banco remoto

Os scripts versionados foram executados por meio do SQL Editor/conexão MCP. Todos os cenários que criam identidades Auth e registros de domínio estão dentro de transações com `ROLLBACK`.

| Script | Resultado observado |
|---|---|
| `supabase/tests/issue_101_rls.integration.sql` | 16/16 verificações passaram |
| `supabase/tests/issue_101_direct_conversation_creation.sql` | `direct_conversation_visible_after_membership = true` |
| `supabase/tests/issue_102_audit_retention.integration.sql` | `issue_102_audit_and_hold_tests_passed` |
| `supabase/tests/issue_102_discard_retention.integration.sql` | `issue_102_discard_hold_and_audit_tests_passed` |
| `supabase/tests/issue_115_private_bucket.integration.sql` | Concluiu sem exceção |

### Cobertura da #101

As 16 verificações confirmaram:
- isolamento por memberships e acesso às conversas/mensagens/anexos;
- isolamento de participante direto e bloqueio de histórico não autorizado;
- bloqueio de contas inativas;
- restrições de usuário comum para criar grupos/adicionar participantes;
- grupos encerrados em leitura;
- recibos de leitura;
- usuário comum sem acesso aos alertas;
- TI com leitura administrativa, criação de grupo e fechamento de alerta.

### Cobertura da #102

Os scripts confirmaram:
- usuário comum sem leitura de `audit_events` e `retention_holds`;
- escrita de evento por TI;
- rejeição de metadata com chave sensível;
- bloqueio de UPDATE/DELETE diretos;
- colocação/liberação de holds com eventos auditáveis;
- auditoria transacional de edição administrativa de mensagem e fechamento de alerta;
- bloqueio de descarte durante hold do recurso e do próprio evento;
- descarte autorizado após liberação, mantendo evento `retention_discarded`.

### Cobertura da #115

O script confirmou bucket privado `attachments`, limite 10 MiB, MIME PDF/JPEG e ausência de policies de acesso direto em `storage.objects`.

## Verificação pós-rollback

Consulta posterior aos testes confirmou:
- `auth.users`: 0;
- `profiles`: 0;
- `conversations`: 0;
- `memberships`: 0;
- `messages`: 0;
- `attachments`: 0;
- `audit_events`: 0;
- `privileged_action_audit`: 0;
- `retention_holds`: 0;
- `storage.objects`: 0.

Nenhuma identidade sintética, conversa, mensagem, evento ou objeto ficou persistido.

## Limites que continuam

- Esses scripts usam identidades sintéticas dentro de transações SQL; **não criam contas reais em Supabase Auth** e não comprovam login ponta a ponta pelo navegador.
- Os testes de #101/#102 não validam os callsites de aplicação para todos os eventos de auditoria.
- O bucket privado foi verificado, mas não foi realizado upload/download de arquivo real.
- A aplicação ainda não possui fluxo funcional de conversas/mensagens/anexos de ponta a ponta.
- O teste de autenticação da aplicação é coberto por testes unitários com fetch simulado no arquivo `tests/supabase-session.test.mjs`; não substitui credenciais de teste reais nem validação HTTP autenticada no ambiente Vercel.
- A Vercel protege os deployments com SSO; a tentativa de fetch direto ao deployment não conseguiu ultrapassar o mecanismo de autenticação. Os deployments Preview consultados estão `READY`, mas isso comprova build/deploy, não o fluxo de login.

## Conclusão

Os testes de integração SQL disponíveis para RLS e auditoria passaram no Polyford sem persistir fixtures. A configuração básica do bucket também passou na verificação. Não há base para declarar autenticação real, upload, download, mensageria ou backup/restore ponta a ponta aprovados.
