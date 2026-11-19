# ADR-005 — Banco de dados e modelo de dados

- **Status:** Proposed
- **Data de revisão:** 19/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.4

## Contexto

O Polychat precisa persistir perfis e contas, conversas individuais e em grupo, participantes, mensagens, anexos, alertas e eventos de auditoria. O produto atende uma única organização (FORD); a baseline não prevê operação multi-tenant.

A FORD v2 determina que hospedagem e infraestrutura permaneçam sob controle da FORD e que nenhum serviço de terceiro acesse, armazene ou processe dados da organização. A decisão anterior por PostgreSQL gerenciado pelo Supabase não pode ser mantida como escolha de hospedagem ou serviço de banco (ADR-003).

PostgreSQL permanece como tecnologia relacional proposta para o banco, desde que sua instância e operação estejam na infraestrutura sob controle da FORD. A escolha do ambiente operacional e a compatibilização técnica fazem parte da Q-025.

O único esquema de domínio atualmente versionado é `public.profiles`, em migration vinculada ao Supabase. Não foram encontradas migrations para conversas, participantes, mensagens, anexos, alertas ou auditoria.

## Problema

Definir uma direção de persistência que preserve integridade referencial, rastreabilidade e isolamento de acesso, sem adotar um banco hospedado por terceiro nem confundir o esquema parcial existente com o modelo de domínio completo.

## Alternativas consideradas

1. **PostgreSQL em infraestrutura sob controle da FORD:** tecnologia relacional proposta, sujeita à validação de operação, compatibilidade e homologação.
2. **Outro banco relacional operado sob controle da FORD:** alternativa possível caso a infraestrutura e os padrões corporativos indiquem tecnologia diferente.
3. **Banco de dados gerenciado externamente/SaaS:** não permitido para dados da FORD quando o terceiro puder acessar, armazenar ou processar essas informações.
4. **Banco documental:** não selecionado nesta proposta, pois as relações entre conversas, participantes, autoria, mensagens e auditoria exigem integridade relacional.

## Decisão proposta

Manter **PostgreSQL como tecnologia de banco relacional proposta**, sem vincular a escolha ao Supabase ou a qualquer serviço externo. A instância, seus backups, administração, monitoramento e recuperação devem permanecer sob controle da FORD.

O modelo lógico deve contemplar, no mínimo:

- **Contas e perfis:** identidade interna estável, nome de usuário único e papel/estado da conta. O nome de usuário não deve ser confundido com a chave primária interna.
- **Conversas:** identificação e tipo de conversa individual ou em grupo.
- **Participantes:** vínculo entre conta e conversa, com controle do ciclo de participação.
- **Mensagens:** autoria, conteúdo, conversa, registro temporal e dados necessários à confirmação de leitura e contador de não lidas.
- **Anexos:** metadados, localização de armazenamento privado, tipo, tamanho, estado da análise antimalware e controle de acesso.
- **Alertas:** regra que originou o alerta, severidade, estado e tratamento pelo TI.
- **Auditoria:** operador, ação, objeto afetado e instante do evento, incluindo consultas administrativas, exportações, downloads e operações administrativas de mensagens.

As operações e relações devem preservar as regras da baseline: Usuários não editam ou excluem mensagens; TI pode editar/excluir com auditoria; participantes removidos perdem imediatamente acesso às mensagens e anexos do grupo; mensagens confirmadas pelo servidor são persistidas e recuperáveis após reconexão normal.

### Integridade, autorização e retenção

- Chaves internas devem ser estáveis; relações de autoria e participação devem ser verificadas no servidor.
- O acesso às linhas deve aplicar autorização server-side e políticas no banco, incluindo RLS quando suportada e adequada à implantação escolhida.
- Não confiar em identificadores de usuário, papel ou participação enviados pelo cliente sem validação.
- Mensagens, anexos, alertas, logs de auditoria e registros administrativos não sofrem exclusão automática enquanto o sistema operar.
- Exclusões dependem de autorização do TI; dados podem ser preservados durante investigações conforme decisão administrativa.
- Backups diários são retidos por 12 meses. Após exclusão autorizada, os dados deixam as cópias de backup ao final do ciclo definido, com descarte registrado em auditoria.
- A operação deve cumprir os parâmetros de disponibilidade, RPO, RTO, recuperação e gestão de chaves já consolidados nos requisitos não funcionais.

Não introduzir deleções em cascata ou expiração automática que contrariem a política de retenção e revogação de acesso definida pela FORD.

## Justificativa

O domínio é composto por relações explícitas entre contas, conversas, participantes, mensagens, anexos e registros administrativos. Um banco relacional oferece integridade referencial e transações adequadas a essas relações. A operação sob controle da FORD atende à restrição de infraestrutura, independentemente do fornecedor de software utilizado para o mecanismo de banco.

## Consequências

**Positivas:**
- Integridade referencial e transações para o domínio de comunicação.
- Independência de um serviço externo específico de banco de dados.
- Possibilidade de aplicar controle de acesso no servidor e no próprio banco.
- Rastreabilidade de operações administrativas e regras de retenção.

**Negativas e cuidados:**
- A FORD/equipe precisará operar, monitorar, atualizar, proteger e recuperar a instância.
- Migrations, índices, backup/restore e testes de autorização precisam ser validados no ambiente homologado.
- O esquema parcial vinculado ao Supabase precisará ser adaptado ou substituído.

## Riscos

Modelo de domínio incompleto; políticas de acesso permissivas; perda de histórico; exclusões em cascata incompatíveis; divergência entre autorização da aplicação e do banco; backup sem restauração testada; exposição de dados em logs; acesso administrativo sem auditoria.

## Evidências atuais

- `supabase/migrations/202611160001_profiles_roles_and_account_status.sql` cria `profiles`, limita os papéis a `user` e `ti`, define estado da conta e habilita RLS. A migration é um artefato versionado, não comprovação de aplicação em infraestrutura FORD.
- Não há migrations versionadas para conversas, participantes, mensagens, anexos, alertas ou eventos de auditoria.
- A baseline POLY-REQ-001 v0.4 consolida as regras de acesso, leitura, retenção, auditoria, exclusão e continuidade.

## Pendências para Accepted

- Confirmar com Tech Lead e TI que PostgreSQL é compatível com a infraestrutura disponibilizada e aprovada pela FORD (Q-025).
- Revisar o modelo físico, migrations, índices, políticas de autorização e estratégia de backup/restore no ambiente de homologação.
- Registrar a decisão técnica, aprovadores e evidências de teste.

Os parâmetros de armazenamento, retenção, desempenho, backup, RPO/RTO, gestão de chaves e isolamento dos ambientes já alinhados com Desenvolvimento são requisitos consolidados; não são reabertos como pendências de produto por esta ADR.
