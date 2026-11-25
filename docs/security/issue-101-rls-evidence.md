# Issue #101 — evidências de autorização e RLS

Data da validação: 25/11/2026  
Ambiente: Polyford / Supabase de desenvolvimento  
PostgreSQL: 17.11.0.019

## Escopo implementado

A migration aplica autorização no banco sem alterar a matriz aprovada nem criar papéis além de `Usuário` e `TI`.

- `conversations`: leitura por TI ou participante ativo; criação de conversa direta por um dos dois usuários ativos; criação de grupo somente por TI; edição administrativa somente por TI.
- `memberships`: usuário pode criar membership apenas para os dois participantes de sua própria conversa direta; inclusão/encerramento de memberships de grupo fica com TI; leitura de membership próprio ou TI.
- `messages`: leitura por participante ativo ou TI; envio somente pelo próprio perfil em conversa ativa; edição e exclusão lógica somente por TI.
- `attachments`: leitura acompanha a autorização da mensagem/conversa; inclusão limitada ao autor da mensagem em conversa ativa; atualização de metadados de análise somente por TI.
- `message_reads`: leitura pelo leitor, pelo autor da mensagem ou por TI; inclusão somente para o próprio perfil.
- `security_alerts`: leitura e encerramento somente por TI.
- `detection_rules`, `attachment_user_quotas`, `attachment_storage_capacity`: acesso de cliente somente por TI.
- `profiles`: privilégio de cliente restrito a SELECT; privilégios residuais de TRUNCATE/TRIGGER/REFERENCES foram removidos.
- `audit_events`: política TI existente foi preservada; a implementação funcional pertence à Issue #102.
- `privileged_action_audit`: não foi alterada; permanece sem acesso direto pelo cliente, conforme a responsabilidade da Issue #124.

As funções auxiliares ficam no schema `private`, com `search_path` vazio, e não dependem de políticas permissivas para contornar RLS.

## Testes executados

O arquivo `supabase/tests/issue_101_rls.integration.sql` foi executado no projeto de desenvolvimento. O resultado final foi `issue_101_rls_persisted_policy_tests_passed`. Todos os dados e identidades sintéticas foram revertidos com `ROLLBACK`.

Cenários cobertos:
- participante ativo lê conversas, mensagens, anexos e memberships permitidos;
- usuário não participante não lê conversas/mensagens alheias;
- conta inativa não obtém acesso mesmo com membership;
- conversa encerrada não aceita novas mensagens e fica invisível a usuários comuns;
- usuário comum não cria grupos, não adiciona participantes a grupos, não edita mensagens e não lê alertas;
- usuário pode registrar leitura de mensagem própria/autorizada; autor da mensagem pode consultar o recibo;
- TI consulta conversas encerradas, encerra alerta e cria grupo;
- criação de conversa direta usa UUID gerado pelo cliente e criação dos dois memberships em transação subsequente.

O fluxo de criação direta também foi executado isoladamente com UUID fornecido pelo cliente; o teste retornou `direct_conversation_visible_after_membership=true`. O teste separado está em `supabase/tests/issue_101_direct_conversation_creation.sql`.

## Migrations aplicadas no Supabase

- `20261125231700_issue_101_domain_rls`
- `20261125232036_issue_101_profile_privilege_hardening`
- `20261125232106_issue_101_direct_conversation_ids`

Os arquivos correspondentes estão versionados em `supabase/migrations/` nesta branch.

## Limites e coordenação

- A RLS não substitui as políticas de Storage; a criação de buckets e as regras dos objetos permanecem na Issue #117.
- Eventos de ações privilegiadas permanecem sob responsabilidade da Issue #124; esta Issue não cria uma segunda trilha para essas mesmas ações.
- Eventos de auditoria genérica e retenção permanecem na Issue #102.
- A validação de operações de escrita de anexos depende da implementação de Storage e dos fluxos da Issue #117.
- O Security Advisor ainda pode apontar a tabela `privileged_action_audit` sem policy; ela não recebe grants ao cliente e deve continuar server-only. A função `public.is_active_ti()` permanece executável por `authenticated` porque é usada nas policies existentes; não foi movida para não alterar policies pertencentes a outras issues.

## Sincronização de migrations

O histórico remoto contém versões anteriores `20261124191059`, `20261124191114`, `20261124191131`, `20261124210245` e `20261125222249`, enquanto arquivos anteriores do repositório usam identificadores `202611240001` e `202611240002`. Esta PR registra suas novas versões, mas não declara a sincronização histórica completa nem executa `db push`, repair ou reset.

## Estado

Implementação e validação transacional entregues nesta branch. A Issue #101 permanece aberta até revisão SQA/Tech Lead e aprovação da PR. Nenhum merge foi realizado.
