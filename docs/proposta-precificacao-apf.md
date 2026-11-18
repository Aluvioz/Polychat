# Proposta comercial — dimensionamento e precificação do Polychat por APF

**Destinatário:** Fábio Cerqueira  
**Produto:** Polychat — aplicação web de comunicação interna da FORD  
**Repositório de referência:** [Aluvioz/Polychat](https://github.com/Aluvioz/Polychat)  
**Base documental analisada:** branch `main`, fotografia consultada em 18/11/2026  
**Data da proposta:** 18/11/2026  
**Natureza:** estimativa preliminar rastreável; sujeita às validações e pendências deste documento.

> **Aviso de uso comercial:** os números abaixo formam uma proposta preliminar defensável, não uma medição final certificada. O catálogo de dados e os limites funcionais ainda não foram aprovados integralmente pelo cliente; DET/RET/ALR foram estimados a partir da baseline e estão explicitamente identificados como hipóteses. A contagem deve ser revalidada com o modelo de dados e os protótipos aprovados antes da contratação por preço fechado.

## 1. Identificação e sumário executivo

Esta proposta dimensiona o desenvolvimento do Polychat para o público inicial informado de aproximadamente 25 pessoas do setor técnico da FORD, com dois perfis de aplicação — Usuário e TI —, comunicação individual e em grupos, anexos PDF/JPEG, monitoramento de mensagens suspeitas, alertas ao TI e consulta administrativa de conversas com auditoria.

A documentação do repositório é a fonte primária. A inspeção do código confirma que a implementação funcional está em estágio inicial: há uma página institucional, middleware isolado de autorização e migration de perfis, mas não há fluxo funcional de login, chat, grupos, anexos, alertas ou consulta administrativa integrado ao App Router. A proposta considera a construção das funções de negócio previstas, sem cobrar como concluídas as partes de código que ainda não estão integradas.

### Resumo da estimativa-base

| Indicador | MVP — baseline funcional | Completo — baseline + hardening não funcional |
|---|---:|---:|
| Tamanho funcional preliminar | **124 PF não ajustados** | **124 PF não ajustados** |
| Esforço provável | **20,67 pessoa-mês** | **24,67 pessoa-mês** |
| Prazo indicativo | **5 meses** | **6 a 6,5 meses** |
| Custo interno estimado | **R$ 340.891,67** | **R$ 407.416,67** |
| Preço mínimo calculado | **R$ 520.806,71** | **R$ 622.442,13** |
| Preço comercial sugerido (arredondado) | **R$ 520.900,00** | **R$ 622.500,00** |
| Preço de referência a R$ 488/PF | R$ 60.512,00 | R$ 60.512,00 |

**Leitura executiva:** o valor de referência de R$ 488,00/PF é tratado exclusivamente como preço unitário de mercado informado para comparação. Aplicado aos 124 PF, produz R$ 60.512,00 e não cobre o custo interno hipotético estimado. O preço proposto decorre da triangulação de custo, tributos, margem e reserva de risco, e não da multiplicação automática dos PF por uma taxa de custo.

**Orçamento registrado na baseline:** R$ 450.000,00, mas a documentação não esclarece se é teto aprovado nem quais itens inclui. O preço preliminar do MVP excede essa referência em R$ 70.806,71; a versão completa excede em R$ 172.442,13. A natureza do orçamento deve ser confirmada antes da negociação.

## 2. Escopo e fronteira da aplicação

### 2.1 Propósito da contagem

- **Tipo:** contagem de projeto de desenvolvimento.
- **Propósito:** estimar o tamanho funcional a entregar a partir dos requisitos documentados e servir de base rastreável para esforço, custo e preço.
- **Aplicação:** Polychat, aplicação web de comunicação interna da FORD.
- **Fronteira:** interface e serviços de negócio Polychat, incluindo as funções que a aplicação entrega aos perfis Usuário e TI. A fronteira é funcional, percebida pelos usuários, e não coincide automaticamente com limites de repositório, framework ou infraestrutura.
- **Unidade:** pontos de função não ajustados (PFNA), com pesos IFPUG.
- **Data-base:** 18/11/2026.

### 2.2 Perfis e usuários

| Perfil / ator | Funções relevantes |
|---|---|
| Usuário | Autenticar-se; visualizar conversas recentes; abrir/ler conversas das quais participa; iniciar/enviar mensagens individuais; enviar mensagens em grupos dos quais seja membro; anexar PDF/JPEG. |
| TI | Provisionar, desativar e reativar contas; criar grupos; adicionar/remover participantes; visualizar alertas e investigar mensagens sinalizadas; consultar conversas individuais e de grupo, com auditoria. |
| Sistema | Validar credenciais e autorização; validar anexos; analisar mensagens conforme política aprovada; gerar alertas e registros de auditoria. |

A visão limita o público inicial a aproximadamente 25 pessoas do setor técnico. Não se presume expansão automática aos cerca de 900 funcionários da organização.

### 2.3 Dentro da fronteira

- Autenticação e sessão da aplicação, com dois perfis.
- Provisionamento, desativação e reativação de contas pelo TI.
- Criação de grupos e gestão administrativa de participantes.
- Lista de conversas recentes e leitura de conversas individuais/em grupo.
- Envio de mensagens individuais e em grupo.
- Upload e acesso a anexos PDF/JPEG.
- Análise de conteúdo conforme política que a FORD aprovar.
- Alertas ao TI e consulta administrativa de conversas.
- Registro de auditoria das consultas administrativas.
- Regras de acesso por perfil e restrição de experiência por tipo de dispositivo.
- Interface web e integração técnica de referência Supabase + Vercel, sem pressupor que já estejam integralmente configuradas.

### 2.4 Fora da fronteira / não incluído nesta proposta-base

- Aplicativos nativos Android/iOS ou desktop instalável.
- Integração com WhatsApp, Teams ou outros aplicativos externos.
- Chamadas de voz/vídeo, mensagens de áudio e gravação de áudio/vídeo.
- Captura de fotos pela aplicação.
- Formatos de anexo diferentes de PDF/JPEG.
- Convites externos, auto cadastro e uso por fornecedores/parceiros.
- Expansão para todos os setores da FORD além do público inicial.
- Exportação em massa, edição ou exclusão de mensagens pelo TI/Usuário.
- Criptografia ponta a ponta (E2EE): não está aprovada e conflita com análise server-side e consulta administrativa previstas.
- Operação 24x7, SOC, suporte presencial, compra de dispositivos, licenças corporativas e serviços jurídicos.
- Migração de dados legados em volume não identificado.

Acessibilidade, LGPD, retenção e controles corporativos obrigatórios não são dispensados por estarem incompletos na baseline. Seus critérios e responsabilidades precisam ser confirmados; trabalho adicional será estimado como requisito não funcional ou serviço separado.

## 3. Requisitos funcionais e não funcionais levantados

### 3.1 Requisitos funcionais — inventário documental

Os IDs abaixo são preservados conforme a baseline. “Confirmado” significa confirmado como necessidade/escopo na documentação; não significa implementado.

| ID | Requisito funcional | Ator | Estado na baseline | Fonte / seção |
|---|---|---|---|---|
| RF-001 | Autenticação por usuário e senha | Usuário/TI | Confirmado; detalhes derivados | `docs/03-requisitos-funcionais.md`, §3.1 e §3.2; `docs/01-visao-geral-e-escopo.md`, §1.5 |
| RF-002 | Aplicar permissões conforme os dois perfis | Sistema/TI | Confirmado; detalhamento derivado | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-001–RN-003 |
| RF-003 | Criar e provisionar contas | TI | Confirmado; parâmetros pendentes | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-003–RN-005 |
| RF-004 | Desativar contas | TI | Confirmado; baseline também prevê reativação em RN-003 | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-003 |
| RF-005 | Criar grupos de conversa | TI | Confirmado | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-003 e RN-007 |
| RF-006 | Adicionar usuários a grupos | TI | Confirmado; remoção administrativa também confirmada em RN-003/RN-007 | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-003 e RN-007 |
| RF-007 | Exibir conversas recentes | Usuário | Confirmado em nível conceitual | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/01-visao-geral-e-escopo.md`, §1.5 |
| RF-008 | Abrir e ler conversas | Usuário | Derivado; necessário para o fluxo, sujeito à validação | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/07-rastreabilidade-e-criterios-de-aceitacao.md`, §7.1 |
| RF-009 | Enviar mensagem individual | Usuário | Confirmado | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-006 |
| RF-010 | Enviar mensagem em grupo | Usuário membro | Confirmado; ciclo de vida adicional pendente | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-007 |
| RF-011 | Anexar arquivos PDF e JPEG | Usuário | Confirmado; limites pendentes | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-008 |
| RF-012 | Rejeitar formatos não permitidos | Sistema | Confirmado | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-008 |
| RF-013 | Não oferecer captura/gravação de mídia | Sistema | Confirmado; ambiguidade câmera/JPEG | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-011 |
| RF-014 | Analisar mensagens em busca de conteúdo suspeito | Sistema | Intenção confirmada; critérios pendentes | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-012 |
| RF-015 | Alertar o TI sobre mensagens sinalizadas | Sistema/TI | Intenção confirmada; canal/severidade pendentes | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-013 |
| RF-016 | TI consultar qualquer conversa | TI | Confirmado; acesso deve ser auditado | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-014 |
| RF-017 | Restringir perfil Usuário a celular | Sistema | Confirmado; critério técnico pendente | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-015 |
| RF-018 | Restringir perfil TI a computador | Sistema | Confirmado; critério técnico pendente | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-015 |

### 3.2 Requisitos não funcionais e restrições

| ID | Categoria | Requisito / situação | Fonte / seção |
|---|---|---|---|
| RNF-001 | Segurança e controle de acesso | Autorização server-side em todas as funções/dados; testes negativos e revisão | `docs/04-requisitos-nao-funcionais.md`, tabela RNF-001 |
| RNF-002 | Proteção de dados | Proteger credenciais, mensagens, anexos e sessões em trânsito/repouso; algoritmos e chaves pendentes | `docs/04-requisitos-nao-funcionais.md`, RNF-002 |
| RNF-003 | Credenciais | Não armazenar/transmitir senha em texto puro; MFA, recuperação e sessão pendentes | `docs/04-requisitos-nao-funcionais.md`, RNF-003 |
| RNF-004 | Auditabilidade | Operações administrativas auditáveis; consulta de conversa pelo TI explicitamente registrada | `docs/04-requisitos-nao-funcionais.md`, RNF-004 |
| RNF-005 | Compatibilidade | Usuário em celular e TI em computador; SO/navegadores/tablets pendentes | `docs/04-requisitos-nao-funcionais.md`, RNF-005 |
| RNF-006 | Usabilidade | Interface simples; conversas recentes após login; telas e métricas pendentes | `docs/04-requisitos-nao-funcionais.md`, RNF-006 |
| RNF-007 | Desempenho | Segurança prevalece sobre velocidade; latência e metas não definidas | `docs/04-requisitos-nao-funcionais.md`, RNF-007 |
| RNF-008 | Capacidade | Público inicial 25 pessoas; concorrência e volumes pendentes | `docs/04-requisitos-nao-funcionais.md`, RNF-008 |
| RNF-009 | Disponibilidade/continuidade | Disponibilidade, backup, RPO/RTO e recuperação pendentes | `docs/04-requisitos-nao-funcionais.md`, RNF-009 |
| RNF-010 | Segurança de arquivos | Somente PDF/JPEG, validação do conteúdo real e avaliação antimalware | `docs/04-requisitos-nao-funcionais.md`, RNF-010 |
| RNF-011 | Privacidade/governança | Política de monitoramento, acesso TI, transparência, retenção, descarte e solicitações legais pendentes | `docs/04-requisitos-nao-funcionais.md`, RNF-011 |
| RNF-012 | Acessibilidade | Despriorizada na visão de produto; obrigações legais/corporativas aplicáveis permanecem | `docs/04-requisitos-nao-funcionais.md`, RNF-012 |
| RNF-013 | Arquitetura/plataforma | Supabase + Vercel é direção técnica da Issue #88; integração/configuração não concluídas | `docs/04-requisitos-nao-funcionais.md`, RNF-013; `docs/adr/ADR-003-supabase-vercel.md` |

**Outras regras/restrições:** dois perfis (RN-001); administração pelo TI (RN-003); sem auto cadastro (RN-004); mensagens individuais (RN-006); grupos administrados pelo TI (RN-007); formatos PDF/JPEG (RN-008); uso exclusivo interno (RN-009); sem captura/gravação (RN-011); análise e alertas (RN-012/RN-013); consulta TI com auditoria (RN-014); restrição de dispositivo (RN-015); sem integrações externas de comunicação (RN-017); público inicial (RN-018); identidade Ford azul/branco (RN-019); orçamento de R$ 450.000,00 sem composição (RN-020). Fonte: `docs/05-regras-de-negocio-e-restricoes.md`, tabela RN-001–RN-020.

### 3.3 Divergências e regra de precedência adotada

| Divergência / aparente conflito | Evidência | Tratamento nesta proposta |
|---|---|---|
| README informa que autenticação, conversas, grupos e anexos ainda serão implementados; código contém middleware e migration de perfis | `README.md`, seções “Estado atual” e “Supabase”; `src/auth/authorization.mjs`; `supabase/migrations/202611160001_profiles_roles_and_account_status.sql` | A documentação de requisitos prevalece para escopo. O código é reconhecido como fundação parcial, não como fluxo de negócio entregue. |
| RF-004 cita desativar, mas RN-003 e baseline incluem reativar | `docs/03-requisitos-funcionais.md`, RF-004; `docs/05-regras-de-negocio-e-restricoes.md`, RN-003; `docs/09-baseline-requisitos-mvp.md`, §4.2 | Incluída uma transação separada de reativação, por ser operação administrativa expressamente descrita na regra/baseline. Validar Q-002. |
| RF-006 enfatiza adicionar; RN-003/RN-007 e matriz #100 incluem remover participantes | `docs/05-regras-de-negocio-e-restricoes.md`, RN-003/RN-007; `docs/issue-100-matriz-autorizacao.md`, seção “Matriz de autorização” | Incluída remoção administrativa de participante. Não foram inferidos saída voluntária ou efeitos de exclusão de mensagens. |
| Supabase + Vercel aparecem como direção técnica, mas a visão v0.1 não define stack nem integrações de negócio | `docs/01-visao-geral-e-escopo.md`, §1.9; `docs/adr/ADR-003-supabase-vercel.md` | Considerados plataforma/serviços de implementação, não integração de negócio com WhatsApp/Teams. Supabase Auth foi tratado como fonte externa de identidades na hipótese AIE descrita na seção 5. |
| ADRs 001/004/005/007/008/009/010 permanecem Proposed | `docs/adr/README.md`, inventário; ADRs individuais | Propostas não foram convertidas em requisitos aprovados. O que não está aprovado fica como hipótese/pendência e não gera função adicional. |

**Funcionalidades que existem somente no código:** não foi identificada função de negócio completa sem correspondência documental. Existem detalhes técnicos implementados — validação JWT, respostas 401/403/503, bloqueio fail-closed, leitura de `profiles`, policies RLS da tabela e criação automática de perfil padrão — que são mecanismos de autorização documentados em ADR-006, não novas transações de negócio. A página inicial (`src/app/page.tsx`) contém texto promocional de capacidades futuras, mas não implementa essas capacidades.

**Documentos de UX:** `docs/ux/issue-91-jornada-mobile.md` e `docs/ux/issue-92-console-ti-desktop.md` são propostas de jornada/wireframe, não telas implementadas nem aceite formal de produto. Não foram usados para inventar transações. `docs/06-diagramas-uml.md` cataloga diagramas sem declará-los aprovados. A documentação de governança em `docs/10-governanca-desenvolvimento.md` rege PR/revisão/CI, mas não adiciona funções de negócio.

## 4. Método de estimativa e premissas

### 4.1 Método

A contagem usa o método IFPUG de Análise de Pontos de Função, alinhado à ISO/IEC 20926:2009. São identificadas funções de dados — ALI (Arquivo Lógico Interno/ILF) e AIE (Arquivo de Interface Externa/EIF) — e funções transacionais — EE (Entrada Externa/EI), SE (Saída Externa/EO) e CE (Consulta Externa/EQ). A complexidade decorre de DET/DER, RET/RLR e ALR/FTR.

Pesos utilizados:

| Tipo | Baixa | Média | Alta |
|---|---:|---:|---:|
| ALI / ILF | 7 | 10 | 15 |
| AIE / EIF | 5 | 7 | 10 |
| EE / EI | 3 | 4 | 6 |
| SE / EO | 4 | 5 | 7 |
| CE / EQ | 3 | 4 | 6 |

### 4.2 Premissas de contagem

Todas as quantidades DET/DER, RET/RLR e ALR abaixo são **hipóteses de dimensionamento**, pois a Issue #99 (schema) ainda está aberta e o modelo de dados completo não existe na `main`. A contagem assume um grupo de dados lógico por entidade e um RET por grupo de dados, em complexidade baixa. A modelagem aprovada poderá alterar DET/RET e complexidade.

1. Uma identidade autenticada é mantida pelo Supabase Auth, fora da fronteira funcional Polychat, e referenciada pela aplicação. Por isso, foi incluído provisoriamente um AIE de identidades. Se o contrato de medição definir Supabase Auth como parte da fronteira da solução, retirar esse AIE (−5 PF).
2. Perfis de aplicação são mantidos pelo Polychat em `public.profiles` e formam um ALI.
3. Conversas, memberships, mensagens, anexos, alertas e eventos de auditoria são ALIs candidatos, pois representam grupos lógicos de dados mantidos pela aplicação segundo os requisitos/Issue #99. O fato de o schema não estar implementado não impede sua identificação preliminar a partir dos requisitos; a confirmação depende da Issue #99.
4. Regras de detecção configuráveis não foram contadas como ALI separado, porque catálogo, manutenção e operações de configuração não estão especificados.
5. Envio de mensagem individual e em grupo foi contado como uma EE comum “Enviar mensagem”, com validação de destinatário/membership como regra contextual; não se duplica a mesma lógica em duas transações sem evidência de processos elementares distintos.
6. Análise automática de conteúdo foi tratada como processamento interno da EE de envio; não foi contada separadamente, pois a baseline não define uma transação autônoma iniciada/solicitada pelo usuário. A saída visível ao TI (alerta) é contada como SE.
7. A gravação do evento de auditoria é parte integrante da consulta administrativa e não foi contada novamente como EE, evitando dupla contagem.
8. A restrição por dispositivo, validações de formato, autorização e mensagens de erro são regras/controles transversais, não transações independentes.
9. Não foi aplicado fator de ajuste/VAF ao total principal. RNFs são tratados em esforço/custo separado, evitando misturar tamanho funcional e esforço não funcional.

### 4.3 Limites da estimativa

O inventário é uma contagem de requisitos, não uma inspeção de todas as telas futuras. Faltam modelo de dados aprovado, protótipos aceitos, fluxos completos, política de alertas, regras de retenção e matriz de dispositivos. O total de 124 PF deve ser lido como baseline preliminar para negociação, com faixa de sensibilidade na seção 12.

## 5. Contagem APF: funções de dados

**DER** é usado aqui como equivalente prático a DET (tipo de dado elementar reconhecido pelo usuário); **RLR** corresponde a RET (subgrupo de dados reconhecível). Para AIE, o grupo é mantido fora da fronteira e referenciado pela aplicação.

| ID | Nome lógico | Tipo | DER/DET (hip.) | RLR/RET (hip.) | Complexidade | PF | Evidência |
|---|---|---|---:|---:|---|---:|---|
| FD-01 | Perfis de aplicação | ALI | 5 | 1 | Baixa | 7 | `docs/03-requisitos-funcionais.md`, RF-001–RF-004; `docs/05-regras-de-negocio-e-restricoes.md`, RN-001–RN-005; migration `supabase/migrations/202611160001_profiles_roles_and_account_status.sql` |
| FD-02 | Conversas individuais e em grupo | ALI | 8 | 1 | Baixa | 7 | `docs/03-requisitos-funcionais.md`, RF-005, RF-007–RF-010; `docs/09-baseline-requisitos-mvp.md`, §4.2; Issue #99 citada em `docs/issue-100-matriz-autorizacao.md`, §2 |
| FD-03 | Participações/memberships | ALI | 5 | 1 | Baixa | 7 | `docs/03-requisitos-funcionais.md`, RF-006, RF-008 e RF-010; `docs/05-regras-de-negocio-e-restricoes.md`, RN-007; `docs/issue-100-matriz-autorizacao.md`, §1 e §3 |
| FD-04 | Mensagens | ALI | 6 | 1 | Baixa | 7 | `docs/03-requisitos-funcionais.md`, RF-009, RF-010 e §3.3; `docs/adr/ADR-007-realtime-mensageria.md`, Contexto |
| FD-05 | Metadados de anexos | ALI | 8 | 1 | Baixa | 7 | `docs/03-requisitos-funcionais.md`, RF-011–RF-013; `docs/adr/ADR-008-storage-anexos.md`, Contexto |
| FD-06 | Alertas de mensagens sinalizadas | ALI | 8 | 1 | Baixa | 7 | `docs/03-requisitos-funcionais.md`, RF-014/RF-015; `docs/05-regras-de-negocio-e-restricoes.md`, RN-012/RN-013 |
| FD-07 | Eventos de auditoria | ALI | 7 | 1 | Baixa | 7 | `docs/03-requisitos-funcionais.md`, RF-016/CA-016.4; `docs/04-requisitos-nao-funcionais.md`, RNF-004; `docs/adr/ADR-010-seguranca-auditoria-monitoramento.md` |
| FD-08 | Identidades autenticadas | AIE | 4 | 1 | Baixa | 5 | `docs/adr/ADR-004-autenticacao-sessoes.md`, Contexto/Decisão proposta; `docs/adr/ADR-003-supabase-vercel.md`, Supabase Auth previsto; `docs/09-baseline-requisitos-mvp.md`, RF-001 |

### 5.1 Justificativa do AIE

O AIE FD-08 representa o conjunto de identidades/credenciais mantido pelo provedor de autenticação Supabase Auth, fora da fronteira lógica da aplicação Polychat, mas referenciado por ela para autenticar e associar perfis. A aplicação consulta a identidade validada e usa seu identificador para relacioná-la ao ALI Perfis.

**Ressalva:** a ADR-004 ainda está Proposed e o SDK/integração real não está no código. O AIE é uma hipótese coerente com a fronteira adotada, não evidência de integração entregue. Caso o cliente/analista considere o serviço de autenticação parte interna da solução contratada, ou não reconheça o grupo de dados externo como arquivo lógico referenciado, o AIE deve ser retirado e a contagem cai para **119 PF**.

### 5.2 Total das funções de dados

- ALIs: 7 × 7 PF = **49 PF**.
- AIEs: 1 × 5 PF = **5 PF**.
- Total de dados: 49 + 5 = **54 PF**.

## 6. Contagem APF: funções transacionais

**ALR** corresponde a ALR/FTR (Arquivo Lógico Referenciado/File Type Referenced). DET/DER são os campos reconhecidos pelo usuário que atravessam a fronteira. As quantidades abaixo são hipóteses e deverão ser revistas com os fluxos/protótipos e schema aprovados.

### 6.1 Entradas Externas (EE)

| ID | Processo elementar | Perfil | DER/DET (hip.) | ALR/FTR (hip.) | Complexidade | PF | Evidência |
|---|---|---|---:|---:|---|---:|---|
| EE-01 | Autenticar e iniciar sessão | Usuário/TI | 3 | 2 | Média | 4 | `docs/03-requisitos-funcionais.md`, RF-001/CA-001.1–001.4; `docs/adr/ADR-004-autenticacao-sessoes.md` |
| EE-02 | Provisionar conta e credencial inicial | TI | 5 | 2 | Média | 4 | `docs/03-requisitos-funcionais.md`, RF-003/CA-003.1–003.5; `docs/05-regras-de-negocio-e-restricoes.md`, RN-003–RN-005 |
| EE-03 | Desativar conta | TI | 3 | 2 | Média | 4 | `docs/03-requisitos-funcionais.md`, RF-004/CA-004.1–004.3; RN-003 |
| EE-04 | Reativar conta | TI | 3 | 2 | Média | 4 | `docs/05-regras-de-negocio-e-restricoes.md`, RN-003; `docs/09-baseline-requisitos-mvp.md`, §4.2/RF-004 |
| EE-05 | Criar grupo | TI | 3 | 1 | Baixa | 3 | `docs/03-requisitos-funcionais.md`, RF-005/CA-005.1–005.3 |
| EE-06 | Adicionar participante a grupo | TI | 3 | 3 | Alta | 6 | `docs/03-requisitos-funcionais.md`, RF-006/CA-006.1–006.3; RN-007 |
| EE-07 | Remover participante de grupo | TI | 3 | 3 | Alta | 6 | `docs/05-regras-de-negocio-e-restricoes.md`, RN-003/RN-007; `docs/issue-100-matriz-autorizacao.md`, seção 3 |
| EE-08 | Enviar mensagem (individual ou grupo) | Usuário | 5 | 4 | Alta | 6 | `docs/03-requisitos-funcionais.md`, RF-009/RF-010 e §3.3; `docs/05-regras-de-negocio-e-restricoes.md`, RN-006/RN-007 |
| EE-09 | Anexar arquivo PDF/JPEG à mensagem | Usuário | 6 | 3 | Média | 4 | `docs/03-requisitos-funcionais.md`, RF-011/RF-012; `docs/adr/ADR-008-storage-anexos.md` |

**Subtotal EE:** 4 + 4 + 4 + 4 + 3 + 6 + 6 + 6 + 4 = **41 PF**.

A inclusão e remoção de participantes são processos distintos porque alteram a relação de membership em sentidos diferentes e têm resultados reconhecíveis pelo TI. Não foi contada saída voluntária do usuário, pois Q-003 permanece aberta. Desativar e reativar contas também foram separadas por serem ações administrativas distintas, embora o documento de RF detalhe mais explicitamente a desativação.

### 6.2 Saídas Externas (SE)

| ID | Processo elementar | Perfil | DER/DET (hip.) | ALR/FTR (hip.) | Complexidade | PF | Evidência |
|---|---|---|---:|---:|---|---:|---|
| SE-01 | Gerar alerta ao TI para mensagem sinalizada | Sistema/TI | 7 | 3 | Média | 5 | `docs/03-requisitos-funcionais.md`, RF-014/RF-015 e CA-015.1–015.3; `docs/05-regras-de-negocio-e-restricoes.md`, RN-012/RN-013 |

**Subtotal SE:** **5 PF**. A análise da mensagem é processamento interno do envio; a saída de alerta tem significado funcional próprio e é contada uma vez.

### 6.3 Consultas Externas (CE)

| ID | Processo elementar | Perfil | DER/DET (hip.) | ALR/FTR (hip.) | Complexidade | PF | Evidência |
|---|---|---|---:|---:|---|---:|---|
| CE-01 | Listar conversas recentes | Usuário | 5 | 3 | Média | 4 | `docs/03-requisitos-funcionais.md`, RF-007/CA-007.1–007.3 |
| CE-02 | Abrir e ler mensagens de conversa autorizada | Usuário | 8 | 3 | Média | 4 | `docs/03-requisitos-funcionais.md`, RF-008/CA-008.1–008.3 |
| CE-03 | Consultar conversa individual ou grupo como TI | TI | 8 | 4 | Alta | 6 | `docs/03-requisitos-funcionais.md`, RF-016/CA-016.1–016.4; `docs/05-regras-de-negocio-e-restricoes.md`, RN-014 |
| CE-04 | Consultar alertas de mensagens sinalizadas | TI | 6 | 2 | Média | 4 | `docs/03-requisitos-funcionais.md`, RF-015; `docs/05-regras-de-negocio-e-restricoes.md`, RN-003/RN-013 |
| CE-05 | Acessar/baixar anexo autorizado | Usuário participante/TI | 5 | 4 | Alta | 6 | `docs/03-requisitos-funcionais.md`, RF-011/CA-011.2; `docs/adr/ADR-008-storage-anexos.md` |

**Subtotal CE:** 4 + 4 + 6 + 4 + 6 = **24 PF**.

### 6.4 Itens deliberadamente não contados como transações

- A gravação de auditoria é disparada como parte de CE-03; não é uma segunda EE independente.
- A análise automática é parte do envio da mensagem; somente a saída de alerta é uma SE separada.
- Regras de autorização, validação de formato e bloqueio por dispositivo são controles das transações, não funções transacionais autônomas.
- Não foram contadas consultas de busca de usuários, listagens administrativas, configurações de políticas, exportações ou relatórios que não tenham especificação funcional suficiente.
- Status de entrega/leitura, presença, digitação, notificações push, edição/exclusão e saída voluntária de grupos não estão definidos e não foram contados.

## 7. Totalização em PF

### 7.1 Matriz tipo × complexidade

| Tipo | Baixa | Média | Alta | Total PF |
|---|---:|---:|---:|---:|
| ALI | 7 × 7 = 49 | 0 | 0 | 49 |
| AIE | 1 × 5 = 5 | 0 | 0 | 5 |
| EE | 1 × 3 = 3 | 5 × 4 = 20 | 3 × 6 = 18 | 41 |
| SE | 0 | 1 × 5 = 5 | 0 | 5 |
| CE | 0 | 3 × 4 = 12 | 2 × 6 = 12 | 24 |
| **Total** | **57** | **37** | **30** | **124** |

Conferência: funções de dados = 49 + 5 = **54 PF**; funções transacionais = EE 41 + SE 5 + CE 24 = **70 PF**; total não ajustado = 54 + 70 = **124 PF**. A distribuição por complexidade também fecha: 57 + 37 + 30 = **124 PF**.

### 7.2 Total por tipo

| Tipo | Quantidade de funções | PF |
|---|---:|---:|
| ALI | 7 | 49 |
| AIE | 1 | 5 |
| EE | 9 | 41 |
| SE | 1 | 5 |
| CE | 5 | 24 |
| **Total** | **23** | **124** |

A quantidade de funções (23) e a soma de PF (124) reconciliam com as tabelas detalhadas. A contagem permanece preliminar porque as complexidades dependem da confirmação dos DET/RET/ALR hipotéticos e da fronteira do AIE.

### 7.3 PF por módulo — base comercial provisória

| Módulo | Composição funcional | PF | Referência a R$ 488/PF |
|---|---|---:|---:|
| Identidade e administração de contas | Perfis (7) + identidades externas (5) + autenticar (4) + provisionar (4) + desativar (4) + reativar (4) | 28 | R$ 13.664,00 |
| Grupos e participantes | Conversas (7) + memberships (7) + criar grupo (3) + adicionar (6) + remover (6) | 29 | R$ 14.152,00 |
| Mensageria | Mensagens (7) + enviar (6) + listar recentes (4) + ler conversa (4) | 21 | R$ 10.248,00 |
| Anexos | Metadados de anexos (7) + anexar (4) + acessar/baixar (6) | 17 | R$ 8.296,00 |
| Segurança, alertas e auditoria | Alertas (7) + auditoria (7) + gerar alerta (5) + consultar alertas (4) + consulta TI (6) | 29 | R$ 14.152,00 |
| **Total** |  | **124** | **R$ 60.512,00** |

### 7.4 Fator de ajuste

O total principal é **PF não ajustado**. Não se aplica VAF/fator de ajuste ao preço-base. Como sensibilidade, o AIE de identidades pode ser removido se a fronteira aprovada incluir o serviço de autenticação: 124 − 5 = **119 PF**. A variação é de −4,03%. Os requisitos não funcionais serão estimados separadamente, sem aplicar um fator arbitrário aos PF.

## 8. Esforço e cronograma

A fórmula solicitada é:

`Esforço (pessoa	ext{-}mês) = PF ÷ produtividade (PF por pessoa	ext{-}mês)`

A produtividade não é universal. Os valores abaixo são **hipóteses de planejamento**, não benchmarks comprovados da equipe Polychat. Critério: produto web com integrações gerenciadas, escopo de segurança relevante, baseline incompleta, necessidade de modelar domínio, construir fluxos e testar autorização/isolamento. A faixa representa equipe experiente com produtividade diferente conforme incerteza e retrabalho.

### 8.1 Cenários de esforço

| Cenário | Produtividade hipotética | Cálculo | Esforço |
|---|---:|---:|---:|
| Otimista | 8 PF/pessoa-mês | 124 ÷ 8 | 15,50 pessoa-mês |
| Provável | 6 PF/pessoa-mês | 124 ÷ 6 | 20,67 pessoa-mês |
| Conservador | 4 PF/pessoa-mês | 124 ÷ 4 | 31,00 pessoa-mês |

### 8.2 Equipe de referência — cenário provável

| Perfil | Alocação hipotética (PM) | Custo mensal carregado hipotético | Custo direto |
|---|---:|---:|---:|
| PO / Analista de negócio | 2,50 | R$ 12.000,00 | R$ 30.000,00 |
| UX/UI | 1,50 | R$ 10.000,00 | R$ 15.000,00 |
| Desenvolvimento frontend | 5,00 | R$ 14.000,00 | R$ 70.000,00 |
| Desenvolvimento backend | 6,00 | R$ 15.000,00 | R$ 90.000,00 |
| QA / testes | 3,50 | R$ 11.000,00 | R$ 38.500,00 |
| DevOps / Segurança | 2,17 | R$ 16.000,00 | R$ 34.666,67 |
| **Total** | **20,67** |  | **R$ 278.166,67** |

Os valores por pessoa-mês são hipóteses de custo total carregado, incluindo remuneração, benefícios e encargos. A soma de pessoa-mês é esforço total; não significa 20,67 meses corridos.

### 8.3 Cronograma indicativo

| Fase | Meses (hipótese) | Entregas principais |
|---|---|---|
| Descoberta, fechamento de requisitos e arquitetura | 1 | Aprovação do modelo de dados, fluxos, ameaças, política de alertas e critérios RNF |
| Fundação, autenticação e administração | 1–2 | Auth integrado, perfis, provisionamento, ciclo de vida das contas, autorização |
| Grupos, conversas e mensageria | 2–3 | Conversas, memberships, mensagens, histórico, sincronização e testes de isolamento |
| Anexos, alertas e consulta TI | 3–4 | PDF/JPEG, validação, alertas, consulta administrativa e trilha de auditoria |
| Testes integrados, homologação e implantação | 5 | Regressão, segurança, aceite, documentação e implantação assistida |

**Prazo provável:** aproximadamente 5 meses corridos com equipe média próxima de 4 a 5 pessoas, respeitando dependências e aprovações do cliente. O cenário otimista pode aproximar-se de 3–4 meses com decisões rápidas e baixa retrabalho; o conservador pode chegar a 7–8 meses. Prazo não é calculado dividindo pessoa-mês por um número de pessoas sem considerar paralelismo, dependências, aprovações e disponibilidade do cliente.

## 9. Custo interno

### 9.1 Custo direto de pessoal

No cenário provável, o custo direto estimado é **R$ 278.166,67**, conforme composição por perfil da seção 8.2. Não há duplicação de custos: cada pessoa-mês é alocada a um perfil e a taxa mensal já inclui remuneração, benefícios e encargos.

### 9.2 Custos indiretos

| Item | Premissa hipotética | Valor |
|---|---|---:|
| Gestão e atividades não faturáveis | 15% do custo direto de pessoal | R$ 41.725,00 |
| Ferramentas e licenças de desenvolvimento | Provisão do projeto | R$ 6.000,00 |
| Infraestrutura de desenvolvimento, homologação e testes | Provisão do projeto | R$ 10.000,00 |
| Preparação de implantação e suporte inicial | Provisão do projeto | R$ 5.000,00 |
| **Total indireto** |  | **R$ 62.725,00** |

QA está contabilizado uma única vez como pessoal direto; o item de infraestrutura cobre ambientes/ferramentas e não repete horas de QA.

### 9.3 Custo interno total

- Pessoal direto: R$ 278.166,67
- Indiretos: R$ 62.725,00
- **Custo interno provável: R$ 340.891,67**
- **Custo interno por PF: R$ 340.891,67 ÷ 124 = R$ 2.749,13/PF**

### 9.4 Custo por cenário de esforço

Para comparar os cenários, usa-se a taxa média de pessoal direto do cenário provável (R$ 278.166,67 ÷ 20,6667 PM ≈ R$ 13.459,68/PM), indiretos de gestão de 15% e provisão fixa de R$ 21.000,00 para ferramentas, infraestrutura e implantação. São hipóteses constantes para comparação.

| Cenário | Esforço | Custo interno estimado |
|---|---:|---:|
| Otimista | 15,50 PM | R$ 260.919,00 |
| Provável | 20,67 PM | R$ 340.891,67 |
| Conservador | 31,00 PM | R$ 500.837,50 |

## 10. Preço proposto — detalhamento e triangulação

### 10.1 Preço de referência de mercado

O valor informado de **R$ 488,00/PF** é preço de referência, não custo de produção.

| Módulo | PF | Preço de referência |
|---|---:|---:|
| Identidade e administração de contas | 28 | R$ 13.664,00 |
| Grupos e participantes | 29 | R$ 14.152,00 |
| Mensageria | 21 | R$ 10.248,00 |
| Anexos | 17 | R$ 8.296,00 |
| Segurança, alertas e auditoria | 29 | R$ 14.152,00 |
| **Total** | **124** | **R$ 60.512,00** |

### 10.2 Triangulação: custo + tributos + margem + risco

Premissas comerciais hipotéticas:
- Tributos efetivos: **8% do preço de venda**. A alíquota real depende do regime tributário, CNAE, município e composição contratual; validar com contador.
- Margem desejada: **20% do preço de venda**.
- Reserva para riscos: **10% do custo interno**.
- Custo interno: **R$ 340.891,67**.

Cálculo:
1. Reserva de risco = R$ 340.891,67 × 10% = **R$ 34.089,17**.
2. Base a recuperar = R$ 340.891,67 + R$ 34.089,17 = **R$ 374.980,84**.
3. Parcela disponível após tributos e margem = 100% − 8% − 20% = **72%**.
4. Preço mínimo = R$ 374.980,84 ÷ 0,72 = **R$ 520.806,72**.
5. Preço comercial sugerido, arredondado para cima = **R$ 520.900,00**, preservando o piso calculado.

### 10.3 Comparação com R$ 488/PF

- Preço de referência total: **R$ 60.512,00**.
- Custo interno estimado: **R$ 340.891,67**.
- Custo interno por PF: **R$ 2.749,13**.
- Diferença entre custo por PF e referência: R$ 2.749,13 − R$ 488,00 = **R$ 2.261,13/PF**.
- Resultado antes de tributos e reserva, se vendido a R$ 488/PF: R$ 60.512,00 − R$ 340.891,67 = **−R$ 280.379,67**.
- Tributos hipotéticos sobre R$ 60.512,00: R$ 4.840,96.
- Resultado após tributos, antes de qualquer reserva: **−R$ 285.220,63**.
- Margem implícita sobre receita bruta: −R$ 285.220,63 ÷ R$ 60.512,00 = **−471,37%**.

**Conclusão:** R$ 488,00/PF não cobre o projeto sob as premissas atuais. O valor só poderia ser praticado com redução drástica do escopo/esforço, subsídio, reutilização muito maior ou estrutura de custo diferente, devidamente comprovada. Não é defensável tratá-lo como custo por PF.

### 10.4 MVP × versão completa

**MVP — R$ 520.800,00 (124 PF)**  
Inclui todas as funções da baseline confirmada em uma primeira entrega operacional: autenticação, dois perfis, contas, grupos, mensagens, anexos, alerta básico ao TI, consulta administrativa auditada e controles essenciais de segurança. Não significa “protótipo” sem controles essenciais. Pressupõe política de monitoramento mínima aprovada, limites de arquivo e dispositivos definidos e homologação funcional.

**Versão completa — R$ 622.500,00 (124 PF + 4,0 PM de hardening não funcional)**  
Mantém os mesmos 124 PF funcionais. O acréscimo hipotético de 4,0 PM cobre aprofundamento de segurança, revisão independente/testes especializados, observabilidade, testes de carga e recuperação, hardening de auditoria/retention, acessibilidade aplicável e operação assistida ampliada. Esses itens não acrescentam PF enquanto forem atributos/controles não funcionais; se a validação identificar novas transações ou arquivos lógicos, a contagem será atualizada.

Cálculo incremental da versão completa:
- 1,0 PM DevOps/Segurança × R$ 16.000 = R$ 16.000
- 1,5 PM QA × R$ 11.000 = R$ 16.500
- 0,5 PM PO/BA × R$ 12.000 = R$ 6.000
- 1,0 PM Backend × R$ 15.000 = R$ 15.000
- Acréscimo de pessoal: **R$ 53.500**
- Custo direto total: R$ 278.166,67 + R$ 53.500 = **R$ 331.666,67**
- Indiretos: 15% do direto (R$ 49.750) + R$ 6.000 ferramentas + R$ 15.000 infraestrutura/testes + R$ 5.000 implantação = **R$ 75.750**
- Custo interno completo: **R$ 407.416,67**
- Reserva 10%: R$ 40.741,67
- Preço mínimo: (R$ 407.416,67 + R$ 40.741,67) ÷ 0,72 = **R$ 622.442,14**
- Preço comercial sugerido: **R$ 622.500,00**.

### 10.5 Valor percebido, concorrência e condições de preço

O valor percebido está associado ao controle interno de contas, grupos e acesso às conversas, à gestão centralizada pelo TI e à rastreabilidade de consultas administrativas. A comparação competitiva deve considerar custo total de propriedade, governança, suporte, segurança e dependência de fornecedores, não apenas preço/PF. A baseline registra a intenção de reduzir dependência de mensageiros externos, mas não contém pesquisa de concorrência nem cotações comparáveis; portanto, não se afirma vantagem quantitativa de preço sobre WhatsApp, Teams ou outros produtos.

O orçamento de R$ 450.000,00 registrado em RN-020 é referência sem composição confirmada. O MVP proposto excede-o em R$ 70.800,00 (aprox. 15,73%); a versão completa excede-o em R$ 172.500,00 (aprox. 38,33%). Caso seja teto rígido, será necessário priorizar entregas e revisar escopo com o cliente, sem remover controles legais/de segurança por inferência.

## 11. Modelo de cobrança e condições de pagamento

### 11.1 Investimento inicial de desenvolvimento

O desenvolvimento é cobrado como projeto, separado da operação recorrente:
- MVP: **R$ 520.900,00**.
- Completo: **R$ 622.500,00**.

### 11.2 Pagamento por marcos — exemplo comercial

| Marco | Percentual | MVP | Completo |
|---|---:|---:|---:|
| Assinatura e kickoff | 20% | R$ 104.180,00 | R$ 124.500,00 |
| Aprovação de requisitos, arquitetura e protótipos | 20% | R$ 104.160,00 | R$ 124.500,00 |
| Entrega de autenticação, perfis e administração | 25% | R$ 130.225,00 | R$ 155.625,00 |
| Entrega de mensageria, grupos, anexos, alertas e auditoria | 25% | R$ 130.200,00 | R$ 155.625,00 |
| Homologação, documentação e implantação | 10% | R$ 52.090,00 | R$ 62.250,00 |
| **Total** | **100%** | **R$ 520.800,00** | **R$ 622.500,00** |

Os marcos serão faturados após evidência de entrega e aceite do respectivo marco, com prazo de pagamento contratual a definir. Valores não incluem serviços de terceiros cujo consumo seja variável e contratado diretamente pela FORD.

### 11.3 Custos recorrentes — operação, manutenção e suporte

Os custos recorrentes não estão incluídos no investimento inicial. Estimativa mensal hipotética para um único cliente empresarial:

| Item recorrente | MVP | Completo |
|---|---:|---:|
| Infraestrutura/serviços gerenciados (provisão) | R$ 2.500,00 | R$ 3.500,00 |
| Suporte (0,5 PM × R$ 13.459,68) | R$ 6.729,84 | R$ 6.729,84 |
| Manutenção evolutiva/corretiva (0,25 PM MVP; 0,5 PM completo) | R$ 3.364,92 | R$ 6.729,84 |
| **Custo recorrente mensal estimado** | **R$ 12.594,76** | **R$ 16.959,68** |

**Mensalidade ilustrativa com recuperação do investimento:** hipótese de 1 cliente (FORD), recuperação do desenvolvimento em 24 meses e churn contratual de 0% durante o prazo mínimo:
- MVP: R$ 12.594,76 + (R$ 520.900,00 ÷ 24) = **R$ 34.299,00/mês**.
- Completo: R$ 16.959,68 + (R$ 622.500,00 ÷ 24) = **R$ 42.897,18/mês**.

Sensibilidade de churn: se for adotado churn hipotético de 2% ao mês e a parcela de recuperação precisar ser protegida por gross-up simples, dividir apenas a parcela de recuperação por 0,98:
- MVP: R$ 12.594,76 + (R$ 21.704,17 ÷ 0,98) ≈ **R$ 34.741,87/mês**.
- Completo: R$ 16.959,68 + (R$ 25.937,50 ÷ 0,98) ≈ **R$ 43.426,52/mês**.

Essas mensalidades são simulações, não oferta vinculante. Devem ser recalculadas após cotação real de planos, região, volume de armazenamento/tráfego, retenção, disponibilidade, janela de suporte, SLA e regime tributário. Se o cliente pagar o desenvolvimento integralmente no início, a mensalidade recorrente deve excluir a parcela de recuperação do investimento.

## 12. Riscos, incertezas e sensibilidade

### 12.1 Matriz de riscos

Probabilidade e impacto são avaliações qualitativas hipotéticas.

| Risco | Probabilidade | Impacto | Mitigação / resposta |
|---|---|---|---|
| Schema e fronteira de dados ainda não aprovados (#99) | Alta | Alto | Workshop de dados; confirmar ALI/AIE, DET/RET e relacionamentos antes da baseline final |
| Políticas de monitoramento e consulta TI sem aprovação de negócio/jurídico (#100/#102, Q-007–Q-010) | Alta | Muito alto | Aprovação expressa da FORD, TI, Segurança e Jurídico/Privacidade; registrar finalidade, transparência e retenção |
| Integração Supabase/Auth/RLS de domínio incompleta | Alta | Alto | Implementar por camadas; testes RLS reais e negativos; revisão independente |
| Critérios de detecção e falsos positivos indefinidos | Alta | Alto | Definir taxonomia, severidade, revisão humana e contingência antes de implementar |
| Limites de anexos e scanner antimalware indefinidos | Média | Alto | Fixar tamanho, quota, formatos, quarentena e comportamento em falha do scanner |
| Concorrência, latência, disponibilidade, RPO/RTO não definidos | Alta | Alto | Definir SLOs e carga; teste de carga e restauração; cotar planos/infraestrutura |
| Classificação de dispositivo pode ser contornada | Média | Médio/alto | Tratar como compatibilidade/UX; autorização real sempre server-side |
| Privacidade e retenção de dados pessoais não aprovadas | Alta | Muito alto | Avaliação jurídica/privacidade, transparência, minimização e política de descarte |
| Dependência de provedores Supabase/Vercel | Média | Alto | Contratos, região, backup, portabilidade, plano de saída e monitoramento |
| Orçamento de R$ 450 mil pode ser teto | Média | Alto | Confirmar composição; negociar fases e recontar qualquer redução funcional |

### 12.2 Sensibilidade do tamanho e produtividade

Com produtividade provável de 6 PF/PM, a variação de PF altera o esforço linearmente. A tabela combina variação de tamanho e três produtividades hipotéticas:

| PF hipotéticos | −20% | −10% | Base | +10% | +20% |
|---|---:|---:|---:|---:|---:|
| PF | 99,2 | 111,6 | 124,0 | 136,4 | 148,8 |
| Esforço a 8 PF/PM | 12,40 | 13,95 | 15,50 | 17,05 | 18,60 |
| Esforço a 6 PF/PM | 16,53 | 18,60 | 20,67 | 22,73 | 24,80 |
| Esforço a 4 PF/PM | 24,80 | 27,90 | 31,00 | 34,10 | 37,20 |

Sensibilidade do preço de referência a R$ 488/PF:
- −20% PF: 99,2 × R$ 488 = **R$ 48.409,60**.
- −10% PF: 111,6 × R$ 488 = **R$ 54.460,80**.
- Base: 124 × R$ 488 = **R$ 60.512,00**.
- +10% PF: 136,4 × R$ 488 = **R$ 66.563,20**.
- +20% PF: 148,8 × R$ 488 = **R$ 72.614,40**.

Sensibilidade de produtividade no tamanho-base:
- +20% produtividade (7,2 PF/PM): 124 ÷ 7,2 = **17,22 PM**.
- +10% produtividade (6,6 PF/PM): 124 ÷ 6,6 = **18,79 PM**.
- Base (6 PF/PM): **20,67 PM**.
- −10% produtividade (5,4 PF/PM): 124 ÷ 5,4 = **22,96 PM**.
- −20% produtividade (4,8 PF/PM): 124 ÷ 4,8 = **25,83 PM**.

A produtividade afeta esforço, prazo e custo, mas não altera PF. O tamanho muda somente quando funções/requisitos ou a classificação de fronteira mudarem.

### 12.3 Mudanças de escopo e cobrança por PF

1. Toda solicitação nova será registrada em change request e vinculada ao requisito afetado.
2. O analista identificará se a mudança cria, altera ou exclui ALI/AIE/EE/SE/CE, seguindo as regras de projeto de melhoria do IFPUG quando aplicáveis.
3. Mudança em DET/RET/ALR será reavaliada; não se presume que cada campo/tela equivale a PF.
4. A contagem incremental será revisada e aprovada por cliente e fornecedor antes do desenvolvimento.
5. O preço incremental poderá usar preço unitário negociado por PF, acrescido de esforço não funcional/implantação quando aplicável. Não se aplicará automaticamente R$ 488/PF como custo.
6. Correção de defeito dentro do escopo aceito não é mudança de escopo; requisito novo, regra nova ou alteração de comportamento aceito é mudança.
7. Exclusões de funções serão descontadas apenas após análise de impacto e recontagem, incluindo dependências e custos já incorridos.

## 13. Critérios de aceite

O aceite deverá ser demonstrado por evidências verificáveis, no mínimo:

- Autenticação de conta ativa; negação de credencial inválida, sessão inválida e conta desativada.
- Aplicação dos perfis Usuário e TI; bloqueio de operações administrativas para Usuário.
- Provisionamento, desativação e reativação por TI, sem auto cadastro.
- Criação de grupo e inclusão/remoção administrativa de participantes.
- Usuário visualiza apenas conversas autorizadas; leitura por URL direta/API sem autorização é negada.
- Envio e leitura de mensagens individuais e em grupo conforme participação; falhas não indicam envio/entrega falsamente.
- Upload, validação e acesso de PDF/JPEG; outros formatos são rejeitados.
- Análise de mensagem segundo regras aprovadas; alerta identificável ao TI; sem bloqueio automático não aprovado.
- Consulta administrativa de conversa pelo TI gera registro de auditoria com os campos aprovados.
- Restrições de dispositivo testadas na matriz de SO/navegadores aprovada, sem tratar user-agent/viewport como autorização.
- Testes automatizados, lint, typecheck e build aprovados no CI; testes de integração/RLS/Storage no ambiente homologado.
- Testes de segurança e desempenho compatíveis com metas aprovadas; backup/restore conforme RPO/RTO definidos.
- Documentação operacional, matriz de acesso, instruções de implantação e evidências de homologação entregues.

O aceite técnico da equipe não substitui aceite formal da FORD, aprovação de privacidade/jurídico ou homologação de segurança.

## 14. Condições comerciais e validade da proposta

- Valores são estimativas hipotéticas em reais, sujeitos à confirmação de tributos, custos de provedores e escopo final.
- Preço MVP sugerido: **R$ 520.900,00**; preço completo sugerido: **R$ 622.500,00**.
- Prazo-base: 5 meses para MVP; 6 a 6,5 meses para versão completa, contados após kickoff, acesso aos ambientes e aprovação dos requisitos bloqueadores.
- Pagamentos conforme marcos da seção 11.2.
- Custos recorrentes, consumo de provedores, licenças e serviços externos são separados do desenvolvimento.
- Garantia corretiva pós-aceite e janela de suporte devem ser definidas no contrato; manutenção evolutiva não está incluída no preço inicial.
- Mudanças de escopo seguem o processo da seção 12.3.
- **Validade comercial sugerida: 30 dias corridos**, como hipótese, a partir da emissão/entrega desta proposta. Após esse período, revisar taxas, impostos, disponibilidade de equipe e custos de terceiros.
- Início condicionado à assinatura, indicação dos responsáveis, liberação dos ambientes e resolução das pendências críticas.

## 15. Pendências a esclarecer antes da contagem final

As perguntas abaixo devem ser respondidas antes de transformar esta estimativa em preço fechado. A lista preserva as questões da baseline.

| ID | Pergunta objetiva | Impacto |
|---|---|---|
| Q-001 | As 25 pessoas incluem administradores TI ou são 25 usuários finais além do TI? | Capacidade e provisionamento |
| Q-002 | Quem pode criar/alterar/desativar contas TI? Há administrador principal? | Fronteira de autorização e transações |
| Q-003 | Usuário pode sair do grupo? Quais regras para remover membros, apagar mensagens e encerrar grupos? | EE e regras de membership |
| Q-004 | JPEG será selecionado apenas de arquivos existentes ou poderá abrir câmera/galeria? | Fluxo de anexos e UX |
| Q-005 | Qual identificador será usado no login (e-mail, matrícula ou outro)? | Auth/AIE e dados |
| Q-006 | Como serão entregues senha inicial, primeiro acesso, expiração e recuperação? | Auth e segurança |
| Q-007 | Quais termos/categorias serão monitorados? Lista fixa ou análise contextual? | Alertas, dados e processamento |
| Q-008 | O alerta apenas informa o TI? Qual severidade, prazo e fluxo de investigação? | Saídas e estados |
| Q-009 | Quem do TI pode consultar conversas, quando exige justificativa e quais campos de auditoria/transparência? | AIE/ALI de auditoria, RNF e risco |
| Q-010 | Qual retenção/descarte para mensagens, anexos, alertas, logs e backups? | Dados, operação e custos |
| Q-011 | Qual tamanho máximo, quantidade e quota de PDF/JPEG? Qual scanner antimalware? | Anexos e infraestrutura |
| Q-012 | Quais SO/navegadores/dispositivos? Tablets e modo desktop entram em qual perfil? | Compatibilidade e teste |
| Q-013 | Quais controles de segurança obrigatórios, MFA, chaves, pentest e modelo de ameaças? | Hardening, custo e risco |
| Q-014 | Quais projetos/regiões Supabase/Vercel, responsáveis, segredos, backup e acessos? | Operação e custo recorrente |
| Q-015 | Qual expectativa contratual para solicitações legais e notificação? | Jurídico/privacidade |
| Q-016 | Quantas sessões simultâneas, mensagens/minuto e anexos/dia? Qual latência aceitável? | Desempenho e escala |
| Q-017 | Qual disponibilidade, janela de manutenção, RPO e RTO? | Infraestrutura e SLA |
| Q-018 | Quais telas/páginas obrigatórias além de login, conversas, alertas e administração? | Transações e UX |
| Q-019 | A FORD fornecerá manual de marca, logo, paleta e tipografia oficiais? | Design e aceite |
| Q-020 | Quais critérios de acessibilidade legais/corporativos devem ser cumpridos? | RNF e hardening |
| Q-021 | Há data limite, evento ou marco de negócio? | Cronograma |
| Q-022 | R$ 450.000,00 é teto aprovado? Inclui implantação, infraestrutura, suporte e manutenção? | Negociação e modelo financeiro |
| Q-023 | A interface será somente em português? Haverá notificações fora do painel? | UX e transações |
| Q-024 | Usuários podem editar/apagar mensagens? Mensagens apagadas permanecem em auditoria? | Dados, transações e retenção |

### Pendências específicas de APF

- Aprovar fronteira de Supabase Auth e confirmar ou retirar o AIE FD-08.
- Aprovar o modelo de dados da Issue #99 e identificar DET/RET reais por ALI/AIE.
- Validar cada processo elementar com protótipos e fluxos aprovados.
- Resolver as classificações de complexidade e os totais da matriz antes de emitir a contagem final assinada.
- Confirmar se reativação de contas e remoção de membros estão no escopo efetivo do contrato.
- Definir se a contagem contratual será apenas de desenvolvimento inicial ou incluirá funções de conversão/migração (não estimadas aqui).

## 16. Anexos

### 16.1 Matriz de rastreabilidade requisito → função → PF

| Requisito | Função APF relacionada | PF preliminar | Observação |
|---|---|---:|---|
| RF-001 | EE-01 + FD-08/FD-01 | 16 (4+5+7 atribuídos ao conjunto de dados compartilhado) | Não somar PF de arquivos novamente em cada requisito; dados são contados uma vez |
| RF-002 | Regra de autorização transversal; não cria transação própria | 0 incremental | Controle de acesso embutido nos processos |
| RF-003 | EE-02 + FD-01/FD-08 | 4 incremental | Provisionamento |
| RF-004 | EE-03 + EE-04 + FD-01 | 8 incremental | Reativação vem de RN-003/baseline |
| RF-005 | EE-05 + FD-02 | 3 incremental | Criação de grupo |
| RF-006 | EE-06 + EE-07 + FD-03 | 12 incremental | Adicionar/remover participante |
| RF-007 | CE-01 + FD-02/FD-03 | 4 incremental | Listagem recente |
| RF-008 | CE-02 + FD-02/FD-03/FD-04 | 4 incremental | Derivado e sujeito à validação |
| RF-009/RF-010 | EE-08 + FD-04 | 6 incremental | Um processo comum de envio |
| RF-011/RF-012 | EE-09 + CE-05 + FD-05 | 10 incremental | Upload e acesso; validação de tipo é regra |
| RF-014/RF-015 | SE-01 + CE-04 + FD-06 | 9 incremental | Análise interna; alerta/consulta de alertas |
| RF-016 | CE-03 + FD-07 | 6 incremental | Consulta gera auditoria integrada |
| RF-017/RF-018 | Regras transversais | 0 incremental | Restrição de dispositivo e testes |
| RNF-001 a RNF-013 | Fora da APF funcional, exceto quando alterarem processo | 0 PF adicional | Tratados em esforço, custo e risco |

**Nota de rastreabilidade:** os PF dos ALI/AIE são contados uma única vez no total da aplicação. A coluna “PF preliminar” por requisito mostra somente a função transacional incremental quando indicada; os arquivos referenciados são compartilhados e não devem ser somados novamente por requisito.

### 16.2 Glossário

| Sigla/termo | Significado |
|---|---|
| APF / FPA | Análise de Pontos de Função / Function Point Analysis |
| IFPUG | International Function Point Users Group |
| PF / PFNA | Ponto de Função / Ponto de Função Não Ajustado |
| ALI / ILF | Arquivo Lógico Interno |
| AIE / EIF | Arquivo de Interface Externa |
| EE / EI | Entrada Externa |
| SE / EO | Saída Externa |
| CE / EQ | Consulta Externa |
| DER / DET | Dado Elementar Referenciado / Data Element Type |
| RLR / RET | Registro Lógico Referenciado / Record Element Type |
| ALR / FTR | Arquivo Lógico Referenciado / File Type Referenced |
| RNF | Requisito não funcional |
| RLS | Row Level Security |
| RPO | Recovery Point Objective |
| RTO | Recovery Time Objective |
| MVP | Minimum Viable Product |
| E2EE | End-to-End Encryption / criptografia ponta a ponta |
| PM | Pessoa-mês |

### 16.3 Referências metodológicas e bibliográficas

1. **IFPUG — Counting Practices Manual (CPM), edição vigente disponibilizada pelo IFPUG.** Referência para definições, regras de identificação, complexidade e pesos de ALI/AIE/EE/SE/CE. A página oficial consultada disponibiliza o release mais recente do CPM; a edição exata deverá ser registrada no termo de contagem final: https://ifpug.org/certification/cfps-cfpp
2. **ISO/IEC 20926:2009.** *Software and systems engineering — Software measurement — IFPUG functional size measurement method*. Edição 2, publicada em 2009 e confirmada como vigente pela ISO em 2024: https://www.iso.org/standard/51717.html
3. **Boehm, Barry W. (1981).** *Software Engineering Economics*. Prentice-Hall. Referência histórica do COCOMO 81 e de princípios de economia/estimativa de software.
4. **Boehm, Barry W.; Abts, Chris; Brown, A. Winsor; Chulani, Sunita; Clark, Bradford K.; Horowitz, Ellis; Madachy, Ray; Reifer, Donald; Steece, Bert (2000).** *Software Cost Estimation with COCOMO II*. Prentice Hall. Referência para COCOMO II e seus submodelos.
5. **Hüller, Keylha Santana; Hüller, Dênis Ricardo; Gomes, Jorge Henrique Coelho; Santos, Vivianni Marques Leite dos (2021).** “Análise de Ponto de Função: estudo de caso para valoração de custos no desenvolvimento de um sistema computacional em NITs”. *Navus: Revista de Gestão e Tecnologia*, v. 11, p. 1–18. DOI: https://doi.org/10.22279/navus.2021.v11.p01-18.1469

### 16.4 COCOMO II — decisão de não aplicar

Não foi realizada estimativa COCOMO II. Embora a referência de Boehm seja pertinente, faltam entradas calibradas e adequadas: submodelo selecionado (Applications Composition, Early Design ou Post-Architecture), tamanho em KSLOC ou pontos de objeto conforme submodelo, scale factors, effort multipliers, calibração organizacional e dados históricos da equipe. **PF não foi inserido automaticamente na equação COCOMO II.** Uma comparação futura exigirá conversão tecnicamente justificada e parâmetros calibrados; sem isso, o resultado produziria falsa precisão.

---

## Registro de autoverificação

| Verificação solicitada | Estado |
|---|---|
| Escopo e tamanho estimado | Incluídos; tamanho preliminar sujeito à reconciliação final da matriz |
| Método e premissas | Incluídos; DET/RET/ALR e produtividade rotulados como hipóteses |
| Itens incluídos e excluídos | Incluídos |
| Riscos e incertezas | Incluídos com probabilidade, impacto e mitigação |
| Modelo de cobrança | Investimento inicial e recorrência separados |
| Critérios de aceite | Incluídos |
| Condições comerciais e validade | Incluídas; validade hipotética de 30 dias |
| Cadeia tamanho → esforço → custo → preço | Apresentada separadamente |
| Referência de R$ 488/PF tratada como preço | Sim; não usada como custo |
| Mudanças de escopo | Processo incremental de recontagem e cobrança incluído |

**Condição para emissão final:** corrigir/reconciliar a matriz de complexidade e os subtotais de transações com um analista APF, confirmar a fronteira do AIE e aprovar o modelo de dados da Issue #99. Até lá, 124 PF e os valores associados são referência provisória para discussão, não compromisso fechado.
