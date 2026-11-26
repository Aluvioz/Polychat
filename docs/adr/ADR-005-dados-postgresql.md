# ADR-005 — Banco de dados e modelo de dados

- **Status:** Proposed
- **Data de revisão:** 26/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.5

## Contexto

O Polychat precisa persistir perfis e contas, conversas individuais e em grupo, participantes, mensagens, anexos, recibos de leitura, alertas, configurações e eventos de auditoria. O produto atende uma única organização (FORD); a baseline não prevê operação multi-tenant.

A ADR-003 estabelece Supabase + Vercel como stack adotada e obrigatória. PostgreSQL por meio do Supabase Database é a tecnologia relacional utilizada no projeto. A FORD v2 mantém requisitos sobre controle de hospedagem, armazenamento, processamento e acesso; a compatibilidade da configuração e do modelo de uso do Supabase Database com esses requisitos precisa ser avaliada na Q-025. Uma preocupação ou incompatibilidade identificada deve ser registrada e encaminhada para decisão formal, sem retirar ou depreciar a ADR-003 por inferência.

O ambiente de desenvolvimento Polyford foi consultado com estado `ACTIVE_HEALTHY`, PostgreSQL `17.11.0.019` e região `sa-east-1`. Essa evidência se refere ao projeto de desenvolvimento e não comprova, por si só, arquitetura homologada de produção, controle operacional pela FORD ou compatibilidade integral com a FORD v2.

O schema evoluiu desde a migration inicial de perfis. As PRs #165, #172, #173 e #170 adicionaram modelagem relacional de domínio, políticas de autorização, trilha genérica de auditoria e uma trilha independente de auditoria privilegiada. O histórico local de migrations foi reconciliado com os identificadores observados no Polyford pela PR #180, sem executar repair, reset ou `db push` no ambiente remoto.

## Problema

Definir a persistência relacional no contexto da stack adotada, preservando integridade referencial, transações, rastreabilidade, retenção e isolamento de acesso, sem confundir schema implementado com fluxos funcionais completos, nem evidências de desenvolvimento com homologação operacional.

## Alternativas consideradas

1. **PostgreSQL por meio do Supabase Database:** tecnologia relacional adotada para o projeto, sujeita à validação de configuração, acesso, operação, compatibilidade e continuidade na Q-025.
2. **Outro banco relacional:** não faz parte da direção vigente; qualquer substituição exige processo formal de mudança arquitetural e decisão explícita, não bastando uma preocupação isolada de compatibilidade.
3. **Banco documental:** não selecionado, pois as relações entre contas, conversas, participantes, autoria, mensagens, anexos e auditoria exigem integridade relacional.
4. **Persistência multi-tenant:** não prevista na baseline atual; não acrescentar particionamento lógico ou isolamento por organização sem novo requisito aprovado.

## Decisão proposta

Manter **PostgreSQL por meio do Supabase Database** como tecnologia relacional no contexto da plataforma Supabase adotada pela ADR-003. O modelo de domínio, as migrations, os índices, as políticas de acesso, os controles de retenção e as estratégias de backup/recuperação devem permanecer versionados e rastreáveis.

A configuração da instância, a administração, os acessos, o monitoramento, o backup, a restauração e as responsabilidades devem ser avaliados na Q-025 frente aos requisitos da FORD. Esta ADR permanece **Proposed**; não declara homologação de produção nem autoriza mudança da stack.

### Modelo de domínio implementado e versionado

O schema versionado contempla:

- **`profiles`:** perfil associado a `auth.users`, com identidade estável, papel restrito a `user`/ `ti`, estado `is_active` e username. `profiles.username` permanece nullable até existir preenchimento confiável para as contas existentes.
- **`conversations`:** identificação da conversa, tipo individual/grupo, estado e referências necessárias à gestão.
- **`memberships`:** vínculo entre perfil e conversa, com ciclo de participação e encerramento por `ended_at`.
- **`messages`:** conversa, autoria, conteúdo, datas e metadados de edição/exclusão administrativa.
- **`attachments`:** metadados do arquivo e vínculo à mensagem, incluindo referência de armazenamento, MIME, tamanho e informações do fluxo de análise. Os bytes do arquivo ficam no Storage privado; a tabela relacional não substitui o controle do objeto.
- **`message_reads`:** registro de leitura por mensagem, leitor e instante `read_at`.
- **`security_alerts`:** ocorrências associadas a mensagens, com severidade, estado e tratamento administrativo.
- **Configurações específicas:** `detection_rules`, `attachment_user_quotas` e `attachment_storage_capacity`, sem tabela genérica de configuração nem valores padrão inventados.
- **Auditoria genérica:** `audit_events` registra catálogo de eventos, ator, recurso, instante, resultado e metadados. `retention_holds` preserva eventos/recursos sob investigação e a função controlada de descarte registra `retention_discarded`.
- **Auditoria privilegiada:** `privileged_action_audit` é uma trilha separada, server-only, para eventos administrativos e privilegiados. Não deve ser fundida com `audit_events` nem receber acesso direto de papéis de cliente.

### Integridade e regras de persistência

- Chaves internas devem ser estáveis; relações de autoria e participação devem ser verificadas no servidor e no banco.
- O modelo permite mensagem com texto ou somente anexos, mas exige pelo menos uma das duas formas de conteúdo. A invariância é validada de forma diferida para permitir a gravação coordenada de mensagem/anexos dentro da mesma transação.
- Cada mensagem pode possuir no máximo cinco anexos.
- O schema limita o tamanho registrado por anexo a 10 MiB e restringe os tipos aos formatos aprovados PDF/JPEG.
- `profiles.username` não é preenchido artificialmente; seu valor permanece nullable até existir dado confiável.
- Chaves estrangeiras, constraints e índices devem acompanhar as relações e consultas previstas; migrations posteriores não devem criar estruturas genéricas ou defaults sem requisito e decisão técnica.
- O histórico e as linhas de auditoria têm controles específicos de retenção e descarte. Não introduzir deleções em cascata ou expiração automática que contrariem a política aprovada pela FORD.

A autorização de leitura/escrita é definida na ADR-006 e nas policies da Issue #101. A existência de RLS habilitada não significa, isoladamente, que cada tabela esteja protegida por policies corretas; testes de isolamento e grants precisam acompanhar as migrations.

### Auditoria e separação de responsabilidades

A persistência de auditoria é dividida por finalidade:

- `audit_events` e `retention_holds` atendem à trilha genérica, preservação de investigação e descarte controlado da Issue #102.
- `privileged_action_audit` atende à base independente de ações privilegiadas da Issue #124, com escrita/pesquisa no servidor e sem acesso direto por `anon` ou `authenticated`.
- A implementação de tabelas, funções e writers não comprova que todos os handlers reais estejam instrumentados. Call sites de consulta de conversas, downloads/liberações de anexos, alterações de configuração, contas e grupos ainda dependem de seus fluxos e issues correspondentes.

### Retenção, backup e continuidade

- Mensagens, anexos, alertas, logs de auditoria e registros administrativos não sofrem exclusão automática enquanto o sistema operar, conforme as regras funcionais consolidadas.
- Exclusões dependem de autorização do TI; dados podem ser preservados durante investigações por meio dos controles de retenção aplicáveis.
- Backups diários devem ser mantidos por 12 meses. Após exclusão autorizada, os dados deixam as cópias ao final do ciclo definido, com descarte registrado em auditoria.
- A disponibilidade, o RPO, o RTO, a recuperação e a gestão de chaves devem respeitar os parâmetros já consolidados na baseline e nos requisitos não funcionais.
- A presença das migrations e o estado saudável do banco de desenvolvimento não comprovam backup diário, retenção de 12 meses ou teste de restauração. Essas evidências continuam no escopo operacional da Issue #130.

## Justificativa

O domínio é composto por relações explícitas entre contas, conversas, participantes, mensagens, anexos, recibos e registros administrativos. PostgreSQL oferece integridade referencial e transações adequadas a essas relações. O Supabase Database fornece o mecanismo relacional dentro da stack adotada pela ADR-003.

A separação entre tabelas de domínio, políticas RLS e trilhas de auditoria mantém a responsabilidade de cada controle verificável. O registro das migrations e das evidências por ambiente permite rastrear alterações sem afirmar que a presença do schema equivale à conclusão dos fluxos de produto ou da operação.

## Consequências

**Positivas:**
- Integridade referencial e transações para o domínio de comunicação.
- Schema relacional explícito e evolutivo, alinhado à baseline v0.5.
- Separação entre dados de domínio, auditoria genérica e auditoria privilegiada.
- Possibilidade de aplicar controle de acesso no servidor e no próprio banco.
- Migrations versionadas e histórico reconciliado, com instalação limpa reproduzível.

**Negativas e cuidados:**
- A FORD/equipe precisa governar projetos, identidades, papéis, permissões, políticas, migrations e dados; a operação da infraestrutura gerenciada segue o serviço contratado e deve ser compatibilizada na Q-025.
- Migrations, índices, RLS, grants, backup/restore e recuperação precisam ser validados no ambiente homologado.
- O fluxo transacional de criação de mensagem com anexos precisa ser integrado pela aplicação; a constraint de banco não cria, sozinha, o handler/RPC de produto.
- A existência de duas trilhas de auditoria exige manter limites e call sites sem duplicar eventos nem omitir operações.
- O modelo conceitual da documentação e o schema físico devem permanecer rastreáveis e reconciliados nas revisões da Issue #99.

## Riscos

Modelo de domínio incompleto; migrations locais divergentes do histórico remoto; políticas RLS permissivas ou grants excessivos; divergência entre autorização da aplicação e do banco; mensagens/anexos gravados parcialmente; perda de histórico; deleções em cascata incompatíveis; eventos de auditoria sem call sites; duplicidade ou ausência de auditoria privilegiada; backup sem restauração testada; exposição de dados em logs; configuração ou processamento incompatível com a FORD v2.

## Evidências atuais

- **PR #165 / Issue #99:** migrations de domínio criam `conversations`, `memberships`, `messages`, `attachments`, `message_reads` e `security_alerts`, adicionam `profiles.username` nullable, constraints, FKs, índices e tabelas específicas de configuração. A PR foi integrada em 24/11/2026. As evidências de ambiente estão em `docs/database/issue-99-implementation-notes.md`.
- **Ambiente Polyford:** a consulta registrada nas evidências apontou projeto de desenvolvimento `Polyford`, região `sa-east-1`, estado `ACTIVE_HEALTHY` e PostgreSQL `17.11.0.019`. A consulta de schema confirmou as tabelas, relações e RLS habilitada no ambiente consultado.
- **PR #172 / Issue #101:** policies RLS de domínio foram integradas para conversas, memberships, mensagens, anexos, leituras, alertas e configurações. A revisão SQA apontou inicialmente alterações indevidas nos grants de `audit_events`; a separação foi corrigida antes do merge. O Tech Lead aprovou a entrega e os testes registrados cobriram 16/16 cenários SQL, além do teste separado de criação de conversa direta.
- **PR #173 / Issue #102:** estrutura de `audit_events`, controles append-only, `retention_holds`, descarte controlado e writer explícito foram integrados. Testes SQL de auditoria/retention e descarte passaram com transações revertidas. Permanecem sem call sites validados eventos de visualização/exportação de conversas, download/liberação de anexos e alterações de configuração.
- **PR #170 / Issue #124:** `privileged_action_audit`, catálogo, writer e pesquisa server-side foram integrados. Testes unitários e verificações remotas documentadas comprovaram a restrição de acesso ao cliente; a cobertura dos handlers reais e a validação de ator TI ativo em gravação real ainda não foram concluídas.
- **PR #180 — reconciliação de migrations:** os identificadores locais foram alinhados às versões observadas no histórico remoto, a colisão de prefixos foi removida e a versão histórica de `audit_events` foi representada por ledger sem DDL. A instalação limpa em PostgreSQL local descartável aplicou 18 migrations e confirmou 18/18 entradas locais no banco de teste. Não foram executados `migration repair`, `db reset` ou `db push` no projeto remoto; a PR declara que não alterou schema ou dados remotos.
- **Limites da instalação limpa:** o resultado 18/18 demonstra reprodutibilidade da sequência local no banco descartável. Não substitui a verificação do ambiente remoto, testes de integração completos, homologação ou validação de recuperação.
- **Q-025 e continuidade:** a compatibilidade da configuração/modelo de uso da stack com a FORD permanece em avaliação; backup diário, retenção de 12 meses, restauração e evidência de RPO/RTO não estão comprovados como capacidade operacional concluída.

As evidências acima comprovam componentes e testes em seus ambientes e escopos descritos. Não comprovam homologação de produção, cobertura integral do MVP ou compatibilidade operacional completa com a FORD.

## Pendências para Accepted

- Concluir a avaliação da configuração e do modelo de uso do Supabase Database frente aos requisitos de infraestrutura, localização, acesso e processamento da FORD na Q-025, registrando evidências, responsabilidades, limitações e riscos residuais.
- Validar com Tech Lead e TI a topologia dos ambientes, permissões administrativas, gestão de credenciais, políticas e operação do banco.
- Manter a rastreabilidade entre modelo conceitual, schema físico, migrations, constraints, índices e documentação de implementação da Issue #99.
- Integrar e testar a persistência transacional dos fluxos de mensagem/anexos e os call sites de auditoria que dependem de handlers ainda pendentes.
- Homologar backup diário, retenção de 12 meses, restauração de banco e objetos, e metas de RPO/RTO conforme a Issue #130.
- Registrar a decisão técnica, os aprovadores e as evidências de teste no ambiente de homologação.

Os requisitos de armazenamento, retenção, desempenho, backup, RPO/RTO, gestão de chaves e isolamento dos ambientes já alinhados com Desenvolvimento são premissas consolidadas; não são reabertos como pendências de produto por esta ADR.
