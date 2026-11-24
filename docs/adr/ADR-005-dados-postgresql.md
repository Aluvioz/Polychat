# ADR-005 — Banco de dados e modelo de dados

- **Status:** Proposed
- **Data de revisão:** 24/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.5

## Contexto

O Polychat precisa persistir perfis e contas, conversas individuais e em grupo, participantes, mensagens, anexos, alertas e eventos de auditoria. O produto atende uma única organização (FORD); a baseline não prevê operação multi-tenant.

A ADR-003 estabelece Supabase + Vercel como stack adotada e obrigatória. A FORD v2 mantém requisitos sobre controle de hospedagem, armazenamento e processamento; a compatibilidade da configuração e do modelo de uso do Supabase Database com esses requisitos deve ser avaliada na Q-025. Uma preocupação ou incompatibilidade identificada deve ser registrada e encaminhada para decisão formal, sem retirar ou depreciar a ADR-003 por inferência.

PostgreSQL permanece como tecnologia relacional proposta para o banco, desde que sua instância e operação estejam na infraestrutura sob controle da FORD. A escolha do ambiente operacional e a compatibilização técnica fazem parte da Q-025.

O único esquema de domínio atualmente versionado é `public.profiles`, em migration vinculada ao Supabase. Não foram encontradas migrations para conversas, participantes, mensagens, anexos, alertas ou auditoria.

## Problema

Definir a persistência de dados relacionais no contexto da stack adotada, preservando integridade referencial, rastreabilidade e isolamento de acesso, sem confundir o esquema parcial existente com o modelo de domínio completo.

## Alternativas consideradas

1. **PostgreSQL em infraestrutura sob controle da FORD:** tecnologia relacional proposta, sujeita à validação de operação, compatibilidade e homologação.
2. **Outro banco relacional operado sob controle da FORD:** alternativa possível caso a infraestrutura e os padrões corporativos indiquem tecnologia diferente.
3. **Banco de dados gerenciado externamente/SaaS:** não permitido para dados da FORD quando o terceiro puder acessar, armazenar ou processar essas informações.
4. **Banco documental:** não selecionado nesta proposta, pois as relações entre conversas, participantes, autoria, mensagens e auditoria exigem integridade relacional.

## Decisão proposta

Manter **PostgreSQL como tecnologia de banco relacional proposta no contexto da plataforma Supabase adotada pela ADR-003**. A configuração da instância, backups, administração, monitoramento, recuperação, acessos e responsabilidades devem ser detalhados e avaliados na Q-025 frente aos requisitos da FORD. Esta ADR não autoriza trocar a stack nem declara a implantação homologada.

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
- O esquema parcial vinculado ao Supabase deverá ser revisado e ampliado para cobrir o domínio, mantendo rastreabilidade e compatibilidade com a stack adotada.

## Riscos

Modelo de domínio incompleto; políticas de acesso permissivas; perda de histórico; exclusões em cascata incompatíveis; divergência entre autorização da aplicação e do banco; backup sem restauração testada; exposição de dados em logs; acesso administrativo sem auditoria.

## Evidências atuais

- `supabase/migrations/202611160001_profiles_roles_and_account_status.sql` cria `profiles`, limita os papéis a `user` e `ti`, define estado da conta e habilita RLS. A migration é um artefato versionado, não comprovação de aplicação em infraestrutura FORD.
- Não há migrations versionadas para conversas, participantes, mensagens, anexos, alertas ou eventos de auditoria.
- A baseline POLY-REQ-001 v0.4 consolida as regras de acesso, leitura, retenção, auditoria, exclusão e continuidade.

## Pendências para Accepted

- Confirmar com Tech Lead e TI a configuração do PostgreSQL/Supabase Database na stack adotada e demonstrar sua compatibilidade com os requisitos da FORD na Q-025.
- Revisar o modelo físico, migrations, índices, políticas de autorização e estratégia de backup/restore no ambiente de homologação.
- Registrar a decisão técnica, aprovadores e evidências de teste.

Os parâmetros de armazenamento, retenção, desempenho, backup, RPO/RTO, gestão de chaves e isolamento dos ambientes já alinhados com Desenvolvimento são requisitos consolidados; não são reabertos como pendências de produto por esta ADR.
