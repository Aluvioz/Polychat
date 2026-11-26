# ADR-007 — Mensageria e atualizações em tempo real

- **Status:** Proposed
- **Data de revisão:** 25/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.5
- **Dependências:** ADR-003; ADR-005; ADR-006; Q-025; Issues #99, #100, #101, #109, #110, #113 e #114

## Contexto

O MVP contempla conversas individuais e em grupo. Mensagens confirmadas pelo servidor devem ser persistidas, disponibilizadas somente a participantes autorizados e recuperadas após reconexão normal, sem perda. A confirmação de leitura e o indicador de mensagens não lidas também integram o escopo funcional aprovado.

A ADR-003 mantém Supabase + Vercel como stack adotada. Esta ADR trata exclusivamente do desenho de mensageria e notificação dentro dessa stack; não reabre nem substitui a decisão tecnológica.

A Q-025 trata da compatibilidade da stack Supabase + Vercel com os requisitos de infraestrutura da FORD. Essa decisão de stack delimita o contexto desta ADR, mas não aprova automaticamente o Supabase Realtime nem sua modalidade de transporte (Postgres Changes ou Broadcast), não comprova sua configuração e não dispensa a prova de conceito, a validação das políticas, a revogação imediata e os testes descritos aqui. A decisão de stack da Q-025 e a decisão específica de mensageria desta ADR têm objetos distintos.

### Estado atual do modelo de dados — Issue #99 / PR #165

A migration `supabase/migrations/202611240001_issue_99_initial_domain_schema.sql`, integrada pela PR #165, já cria as estruturas de domínio relevantes:

- `public.conversations`: conversas individuais e em grupo, com estado.
- `public.memberships`: participação por conversa, com histórico de entrada e encerramento por `ended_at`.
- `public.messages`: conteúdo, autoria, instante de criação e metadados de edição/exclusão administrativa.
- `public.message_reads`: registro de leitura por mensagem, leitor e instante `read_at`.
- `public.attachments`: metadados e referência de armazenamento dos anexos.
- `public.security_alerts`: ocorrências associadas às mensagens.

A migration complementar `202611240002_issue_99_integrity_and_configuration.sql` acrescenta invariantes transacionais, incluindo o limite de cinco anexos por mensagem e a exigência de texto não vazio ou ao menos um anexo. A existência dessas tabelas e invariantes comprova a modelagem versionada, não a implementação dos fluxos de chat nem a publicação de eventos Realtime.

### Estado atual da autorização — Issue #101 / PR #172

A migration `supabase/migrations/20261125231700_issue_101_domain_rls.sql`, integrada pela PR #172, acrescenta políticas de autorização para os recursos de domínio.

Em particular:

- `private.is_current_conversation_member(conversation_id)` considera a identidade ativa e uma membership vigente, isto é, com `ended_at IS NULL`.
- `private.can_read_conversation(conversation_id)` permite a consulta pelo TI ou por participante atual de conversa não encerrada.
- `private.can_send_to_conversation(conversation_id)` exige participante atual e conversa ativa.
- As políticas de `messages`, `attachments` e `message_reads` reutilizam as verificações de autorização da conversa e do perfil.
- O TI mantém os poderes administrativos definidos na baseline, sem introdução de hierarquia ou aprovação adicional.

O registro `docs/security/issue-101-rls-evidence.md` informa que 16 cenários de integração SQL foram executados no ambiente Polyford e passaram. Essa evidência cobre as situações ali descritas, mas não comprova o comportamento de uma assinatura Realtime já estabelecida depois do encerramento de uma membership.

### Limite conhecido da autorização Realtime

As políticas RLS de `public.messages` protegem consultas e eventos de banco conforme o contexto de autorização aplicado pelo Supabase. Elas não devem ser tratadas, isoladamente, como prova de revogação imediata de toda conexão Realtime já aberta.

A documentação do Supabase informa que as políticas de acesso do cliente Realtime são armazenadas em cache durante a conexão. A autorização é calculada quando o cliente conecta/assina um canal e pode ser atualizada quando um novo JWT é enviado. Se uma linha utilizada pela política for removida enquanto o cliente permanece conectado, o cliente pode continuar recebendo mensagens até a expiração do JWT ou o envio de um novo JWT. A documentação apresenta essa observação na seção de autorização Realtime e também descreve o uso de Postgres Changes com RLS.

Consequentemente, a remoção de uma membership no banco, embora impeça novas operações protegidas após a reavaliação de acesso, não comprova por si só que uma assinatura já aberta deixou imediatamente de receber eventos. O comportamento precisa ser tratado explicitamente no desenho e comprovado por teste.

## Problema

Definir o mecanismo de notificação de mensagens e atualização de conversas sem:

- confundir a entrega de um evento com a confirmação de persistência;
- permitir que o cliente escolha sua própria autorização por meio do nome do canal, filtros ou identificadores enviados;
- expor mensagens a participantes removidos ou a usuários sem participação vigente;
- perder mensagens confirmadas durante desconexões ou falhas temporárias do transporte;
- contrariar os requisitos já aprovados de leitura, edição/exclusão administrativa, retenção e auditoria.

## Requisitos funcionais e decisões já consolidados

Esta ADR não reabre decisões de produto já registradas:

- **RF-009 / RF-010:** envio de mensagens individuais e em grupo; mensagens confirmadas pelo servidor são persistidas e recuperadas após reconexão normal.
- **CA-009.5:** o sistema não apresenta como confirmada uma mensagem que ainda não recebeu confirmação de persistência do servidor.
- **RF-019:** registrar a leitura, apresentar o horário em que a mensagem foi lida e exibir a quantidade de mensagens não lidas por conversa. A tabela `message_reads` já oferece a estrutura de persistência do recibo.
- **Q-003 / RN-007:** somente TI administra grupos e participantes; a remoção de participante revoga imediatamente o acesso às mensagens e anexos anteriores do grupo.
- **Q-024 / RN-014 / RF-020:** Usuários comuns não editam nem excluem mensagens; TI pode fazê-lo, com auditoria.

Q-003 e Q-024 estão resolvidas no nível de produto. RF-019 também está confirmado. Permanecem pendentes nesta ADR apenas o desenho técnico, a integração e a comprovação dos comportamentos de mensageria.

## Alternativas consideradas

1. **Polling periódico:** consultar periodicamente o histórico persistido. É simples e usa a autorização das consultas, mas pode aumentar consultas e latência e não representa a direção preferencial para atualização em tempo real.
2. **Supabase Realtime — Postgres Changes:** receber alterações das tabelas publicadas, com autorização baseada nas políticas RLS da tabela de origem. Requer configurar a publicação `supabase_realtime`, selecionar eventos/colunas e validar o comportamento de autorização e revogação em conexão ativa.
3. **Supabase Realtime — Broadcast em canais privados:** publicar eventos específicos por conversa. Requer políticas próprias em `realtime.messages`, canais privados e desativação do acesso público. As políticas de `public.messages` não substituem as políticas do canal.
4. **Transporte próprio, como Server-Sent Events ou WebSocket:** alternativa possível, mas exigiria implementar e operar uma camada adicional de conexões e distribuição de eventos.

A escolha entre Postgres Changes e Broadcast permanece pendente de prova de conceito. Não há requisito aprovado para presença de usuários, indicador de digitação ou outros estados transitórios; esses recursos não devem ser acrescentados por inferência.

## Decisão proposta

Manter o Supabase Realtime como tecnologia preferencial para notificação em tempo real, dentro da stack Supabase + Vercel, condicionado à prova de conceito, à validação das políticas e à aprovação técnica. A modalidade específica de transporte permanece em avaliação.

Independentemente da modalidade escolhida, o desenho deverá cumprir os seguintes princípios:

1. **Banco como fonte da verdade:** mensagens, recibos de leitura e alterações administrativas devem ser persistidos nas tabelas de domínio. Um evento Realtime é uma notificação da mudança, não substitui a leitura autorizada do registro persistido.
2. **Persistência antes da notificação:** o evento de mensagem só pode ser disponibilizado após a confirmação do commit da gravação. Falha na publicação não pode desfazer nem ocultar uma mensagem já confirmada; a reconexão deve recuperar o registro pelo histórico persistido.
3. **Autorização por conversa:** identidade, estado da conta, participação vigente e estado da conversa devem ser verificados no servidor/banco. Nome de canal, filtro, tópico, ID de conversa ou payload fornecido pelo cliente não constituem autorização.
4. **Escopo mínimo de eventos:** o cliente deve receber somente eventos necessários às conversas que pode acessar. Quando viável, o evento deve carregar apenas os identificadores e metadados necessários para buscar o registro com autorização; não deve expor dados de outras conversas.
5. **Canais privados:** se Broadcast ou Presence forem utilizados, exigir canais privados, desabilitar o acesso público nas configurações Realtime e implementar políticas próprias de leitura/publicação em `realtime.messages`, verificando usuário e conversa. Não reutilizar como se fossem equivalentes as políticas existentes em `public.messages`.
6. **Revogação imediata:** o encerramento da membership deve impedir imediatamente que o participante removido receba novos eventos ou recupere mensagens/anexos da conversa. Como o Supabase mantém cache de autorização durante a conexão, a implementação deverá invalidar a assinatura/conexão ativa ou executar mecanismo de revalidação efetiva do contexto de autorização no momento da remoção. Aguardar apenas a expiração normal do JWT não atende ao requisito da FORD.
7. **Reconexão e consistência:** após reconectar, o cliente deve buscar mensagens persistidas a partir de cursor/identificador confiável, tolerar duplicatas e reordenação e reconciliar o estado local com o banco. Eventos perdidos durante a desconexão não podem resultar em perda de mensagens confirmadas.
8. **Confirmação de leitura:** a leitura deve ser registrada em `public.message_reads`, com leitor e `read_at`, respeitando as políticas RLS da Issue #101. O indicador de não lidas deve ser derivado de dados persistidos e sincronizado sem conceder acesso adicional.
9. **Edição e exclusão administrativa:** alterações feitas pelo TI devem respeitar as operações autorizadas, preservar a auditoria e atualizar as conversas dos participantes que ainda tenham acesso. O recebimento de um evento não concede ao Usuário permissão para editar ou excluir mensagens.

## Justificativa

A modelagem #99 fornece persistência e histórico, e a RLS #101 fornece a base de autorização por perfil, conversa e membership vigente. O Realtime deve complementar essa arquitetura, não criar uma segunda fonte de verdade nem uma fronteira de autorização paralela e mais permissiva.

A exigência de revogação imediata torna insuficiente depender somente da reavaliação de RLS em novas consultas ou da expiração natural do token. A implementação precisa tratar conexões já estabelecidas e comprovar o resultado com testes específicos.

## Consequências

**Positivas:**

- Reaproveitamento do modelo de dados e da autorização já integrados pelas Issues #99 e #101.
- Separação entre persistência, autorização e transporte de notificações.
- Recuperação pelo histórico persistido após reconexão.
- Rastreabilidade dos recibos de leitura e das operações administrativas.

**Negativas e cuidados:**

- A autorização de canais Broadcast/Presence exige políticas específicas no schema `realtime`.
- O cache de autorização do Realtime exige mecanismo adicional para cumprir a revogação imediata.
- A modalidade escolhida precisa ser testada no ambiente Polyford e depois no ambiente de homologação.
- Publicação, reconexão, deduplicação e ordenação aumentam a complexidade de integração e observabilidade.

## Riscos

- Entrega de evento a participante removido devido a autorização armazenada em cache.
- Vazamento entre conversas por canal público, tópico previsível sem política adequada ou filtro tratado indevidamente como autorização.
- Evento publicado antes do commit ou com conteúdo não autorizado.
- Perda aparente de mensagens quando a publicação falha ou a conexão cai.
- Duplicação ou reordenação de mensagens durante retry/reconexão.
- Divergência entre recibos de leitura persistidos e indicadores exibidos.
- Tratamento incorreto de eventos de edição/exclusão administrativa.
- Exposição de dados por políticas ou configurações Realtime permissivas.

## Evidências atuais

- **Issue #99 / PR #165:** migrations de domínio criam `conversations`, `memberships`, `messages`, `attachments`, `message_reads` e `security_alerts`; as invariantes de conteúdo e quantidade de anexos também estão versionadas.
- **Issue #101 / PR #172:** migration de RLS implementa verificações de perfil ativo, membership vigente, estado da conversa e autorização de leitura/envio; a evidência registra 16 cenários SQL aprovados no Polyford.
- **Limite dos testes #101:** os cenários existentes não comprovam a remoção de um participante durante uma assinatura Realtime ativa nem a interrupção de eventos nessa conexão.
- **Realtime ainda não implementado:** na `main` consultada não foram encontrados canais, subscriptions, integração cliente Realtime, configuração versionada da publicação `supabase_realtime` ou políticas específicas de canal em `realtime.messages`.
- **Dependências de implementação:** Issues #109 e #110 tratam envio/persistência e histórico/realtime; #113 trata gestão de integrantes e membership; #114 trata chat de grupo com histórico e realtime.

Essas evidências distinguem a estrutura e a autorização já integradas da funcionalidade de mensageria que ainda precisa ser implementada e homologada.

## Pendências para Accepted

1. Realizar prova de conceito comparando Postgres Changes e Broadcast privado, com critérios de segurança, revogação, latência, volume, reconexão e esforço operacional.
2. Definir formalmente a modalidade e o desenho dos canais, incluindo publicação/tabelas/eventos necessários, payload mínimo e configuração de privacidade.
3. Definir e implementar a invalidação imediata de uma assinatura ativa quando a TI encerra uma membership; não aceitar expiração normal do JWT como único mecanismo.
4. Na Issue #113, testar encerramento de membership e negar novas consultas de mensagens e anexos com a mesma identidade.
5. Nas Issues #110 e #114, manter uma assinatura real ativa, remover o participante e comprovar que ele deixa de receber eventos imediatamente; testar também que os membros restantes continuam recebendo.
6. Testar envio somente após persistência, recuperação por cursor, duplicidade, reordenação, falha de publicação, reconexão e sincronização de `message_reads`.
7. Executar testes de integração no Polyford, automatizar os cenários reproduzíveis e registrar evidências, limites e resultados.
8. Obter revisão do Tech Lead e SQA sobre desenho, políticas, revogação, rastreabilidade e suficiência dos testes; envolver TI na validação operacional aplicável.

A decisão geral da stack Supabase + Vercel registrada na ADR-003 não substitui estas validações específicas do serviço Realtime. O status desta ADR permanece **Proposed** até que as pendências técnicas sejam resolvidas e revisadas.

## Referências

- [Baseline POLY-REQ-001 v0.5](../09-baseline-requisitos-mvp.md)
- [Requisitos funcionais — RF-009, RF-010 e RF-019](../03-requisitos-funcionais.md)
- [Regras de negócio — RN-007 e RN-014](../05-regras-de-negocio-e-restricoes.md)
- [Glossário e questões — Q-003 e Q-024](../08-glossario-e-questoes-em-aberto.md)
- [Glossário e questões — Q-025 (compatibilidade da stack)](../08-glossario-e-questoes-em-aberto.md)
- [ADR-003 — Supabase + Vercel](ADR-003-supabase-vercel.md)
- [ADR-006 — Autorização server-side e RLS](ADR-006-autorizacao-rls.md)
- [Evidências da Issue #101](../security/issue-101-rls-evidence.md)
- [Supabase — Realtime Authorization](https://supabase.com/docs/guides/realtime/authorization)
- [Supabase — Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes)
