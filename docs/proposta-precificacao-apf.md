# Proposta APF — dimensionamento preliminar do Polychat (versão histórica em reconciliação)

**Destinatário:** Fábio Cerqueira  
**Produto:** Polychat — aplicação web de comunicação interna da FORD  
**Repositório de referência:** [Aluvioz/Polychat](https://github.com/Aluvioz/Polychat)  
**Base da estimativa original:** fotografia da `main` em 18/11/2026 (baseline anterior à FORD v2)  
**Revisão de escopo:** 19/11/2026 — questionário FORD v2 e alinhamentos complementares  
**Natureza atual:** documento de referência metodológica e estimativa histórica; os valores da versão anterior não constituem proposta comercial vigente, preço fechado ou compromisso contratual.

> **Aviso de uso comercial e de versão:** o cálculo de 124 PF e os valores de MVP/Completo abaixo foram produzidos em 18/11/2026, antes da consolidação da FORD v2 em 19/11/2026. A baseline atual acrescentou RF-019 a RF-023, fechou decisões sobre contas, grupos, anexos, monitoramento, auditoria, retenção e infraestrutura, atualizou a UX #91/#92 e confirmou Supabase + Vercel como plataformas oficiais do projeto. Portanto, 124 PF, esforço, prazos, custos, preços e custos recorrentes antigos são **históricos e precisam ser recalculados**. Esta revisão não emite novo número de PF nem nova cotação. Consulte a seção 17 — Revisão de impacto da FORD v2.



## Estado atual após FORD v2 — 19/11/2026

- Esta proposta foi recalibrada documentalmente, mas **não possui nova contagem APF nem preço atual**.
- As seções numéricas derivadas de 18/11/2026 são referência histórica, não uma oferta comercial vigente.
- A baseline v0.4 altera funções, dados, regras e arquitetura: RF-019 a RF-023; permissões administrativas; leitura; exportação; auditoria ampliada; limites de anexos; monitoramento e retenção; infraestrutura sob controle FORD.
- Supabase Auth permanece na stack oficial; a fronteira lógica para fins de APF deve ser analisada sem presumir automaticamente classificação como AIE. Preços/planos dos serviços Supabase e Vercel devem ser revalidados na estimativa comercial atual.
- A decisão de arquitetura técnica permanece em Q-025. A nova contagem dependerá do modelo lógico POLY-DATA-001 v0.3, matriz #100 atualizada, ADRs e fluxos UX #91/#92 aceitos.
- A referência FORD de R$ 450.000,00 não é teto aprovado. Inclui implantação e exclui infraestrutura, licenças, suporte, manutenção e treinamento.

## 1. Identificação e sumário executivo

Esta proposta dimensiona o desenvolvimento do Polychat para o público inicial informado de aproximadamente 25 pessoas do setor técnico da FORD, com dois perfis de aplicação — Usuário e TI —, comunicação individual e em grupos, anexos PDF/JPEG, monitoramento de mensagens suspeitas, alertas ao TI e consulta administrativa de conversas com auditoria.

A documentação do repositório é a fonte primária. A inspeção do código confirma que a implementação funcional está em estágio inicial: há uma página institucional, middleware isolado de autorização e migration de perfis, mas não há fluxo funcional de login, chat, grupos, anexos, alertas ou consulta administrativa integrado ao App Router. A proposta considera a construção das funções de negócio previstas, sem cobrar como concluídas as partes de código que ainda não estão integradas.

### Resumo da estimativa-base histórica — 18/11/2026 (não vigente)

| Indicador | MVP — baseline funcional | Completo — baseline + hardening não funcional |
|---|---:|---:|
| Tamanho funcional preliminar | **124 PF não ajustados** | **124 PF não ajustados** |
| Esforço provável | **20,67 pessoa-mês** | **24,67 pessoa-mês** |
| Prazo indicativo | **5 meses** | **6 a 6,5 meses** |
| Custo interno estimado | **R$ 340.891,67** | **R$ 407.416,67** |
| Preço mínimo calculado | **R$ 520.806,71** | **R$ 622.442,13** |
| Preço comercial sugerido (arredondado) | **R$ 520.900,00** | **R$ 622.500,00** |
| Preço de referência a R$ 488/PF | R$ 60.512,00 | R$ 60.512,00 |

**Leitura histórica:** o valor de referência de R$ 488,00/PF foi usado exclusivamente como comparação de preço unitário de mercado. A conta histórica de 124 PF produziu R$ 60.512,00 de referência, valor que não cobria o custo interno hipotético então estimado. Essa comparação não foi recalculada para o escopo v0.4.

**Condição comercial atual da FORD:** R$ 450.000,00 é uma referência comercial global informada, não teto aprovado. Inclui implantação e exclui infraestrutura, licenças, suporte, manutenção e treinamento. Os desvios numéricos da estimativa antiga não devem ser usados como conclusão de estouro de orçamento; a comparação precisa ser refeita após a recontagem e a atualização de custos.

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
- Interface web com frontend Next.js; autenticação, backend, banco e storage utilizam Supabase; hospedagem e deploy utilizam Vercel. Configurações, regiões e segregação por ambiente devem ser validadas na Q-025.

### 2.4 Fora da fronteira / não incluído nesta proposta-base

- Aplicativos nativos Android/iOS ou desktop instalável.
- Integração com WhatsApp, Teams ou outros aplicativos externos.
- Chamadas de voz/vídeo, mensagens de áudio e gravação de áudio/vídeo.
- Captura de fotos pela aplicação.
- Formatos de anexo diferentes de PDF/JPEG.
- Convites externos, auto cadastro e uso por fornecedores/parceiros.
- Expansão para todos os setores da FORD além do público inicial.
- Edição ou exclusão de mensagens pelo Usuário. A FORD v2 permite ao TI editar/excluir mensagens a qualquer momento, com auditoria, e exportar conversas; essas funções precisam constar da contagem atualizada.
- Criptografia ponta a ponta (E2EE): não é adotada; a FORD confirmou criptografia em trânsito e em repouso, com acesso do servidor para monitoramento/administração.
- Operação 24x7, SOC, suporte presencial, compra de dispositivos, licenças corporativas e serviços jurídicos.
- Migração de dados legados em volume não identificado.

Acessibilidade, LGPD, retenção e controles corporativos obrigatórios não são dispensados por estarem incompletos na baseline. Seus critérios e responsabilidades precisam ser confirmados; trabalho adicional será estimado como requisito não funcional ou serviço separado.

## 3. Requisitos funcionais e não funcionais levantados

### 3.1 Requisitos funcionais — inventário documental

Os IDs abaixo são preservados conforme a baseline. “Confirmado” significa confirmado como necessidade/escopo na documentação; não significa implementado.

| ID | Requisito funcional | Ator | Estado na baseline | Fonte / seção |
|---|---|---|---|---|
| RF-001 | Autenticação por username e senha, provisionados pelo TI | Usuário/TI | Confirmado: username único/alterável, credencial inicial enviada individualmente, recuperação pelo TI; sem MFA/expiração/troca inicial obrigatórios | `docs/03-requisitos-funcionais.md`, §3.1 e §3.2; `docs/01-visao-geral-e-escopo.md`, §1.5 |
| RF-002 | Aplicar permissões dos perfis `user` e `ti`; poderes equivalentes entre todos TI | Sistema/TI | Confirmado; role distinta de membership, sem hierarquia TI | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-001–RN-003 |
| RF-003 | Criar contas e provisionar credenciais; definir/alterar username único | TI | Confirmado pela FORD v2 | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-003–RN-005 |
| RF-004 | Desativar/reativar contas; desativação encerra sessões e revoga acesso | TI | Confirmado pela FORD v2 | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-003 |
| RF-005 | Criar, encerrar, desativar e reativar grupos | TI | Confirmado pela FORD v2 | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-003 e RN-007 |
| RF-006 | Incluir/remover participantes; remoção revoga acesso ao histórico/anexos | TI | Confirmado pela FORD v2 | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-003 e RN-007 |
| RF-007 | Exibir conversas recentes | Usuário | Confirmado em nível conceitual | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/01-visao-geral-e-escopo.md`, §1.5 |
| RF-008 | Abrir/ler somente conversas das quais seja participante autorizado | Usuário | Regra ratificada pelo PO na Issue #100 | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/07-rastreabilidade-e-criterios-de-aceitacao.md`, §7.1 |
| RF-009 | Enviar mensagem individual | Usuário | Confirmado | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-006 |
| RF-010 | Enviar mensagem em grupo como participante incluído pelo TI | Usuário membro | Confirmado; usuário não sai voluntariamente | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-007 |
| RF-011 | Anexar PDF/JPEG até 10 MB por arquivo e 5 por mensagem | Usuário | Confirmado/alinhado; quotas individuais e capacidade total pelo TI | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-008 |
| RF-012 | Rejeitar formatos não permitidos | Sistema | Confirmado | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-008 |
| RF-013 | Selecionar JPEG da galeria, sem captura por câmera; remover EXIF/GPS | Sistema | Confirmado pela FORD v2 | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-011 |
| RF-014 | Detectar mensagens por regras/lista de termos TI, sem análise contextual/IA externa | Sistema | Confirmado/alinhado pela FORD v2 | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-012 |
| RF-015 | Alertas baixa/média/alta, com prazos de resposta definidos e revisão humana | Sistema/TI | Confirmado/alinhado; sem bloqueio automático | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-013 |
| RF-016 | TI consultar qualquer conversa a qualquer momento, sem justificativa/segunda aprovação | TI | Confirmado; consulta auditada | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-014 |
| RF-017 | Restringir perfil Usuário a celular | Sistema | Confirmado: Android/iOS com Chrome/Safari móveis atuais; tablets não permitidos | `docs/03-requisitos-funcionais.md`, §3.1–3.2; `docs/05-regras-de-negocio-e-restricoes.md`, RN-015 |
| RF-018 | Restringir perfil TI a computador | Sistema | Confirmado: computadores com Chrome/Edge/Firefox atuais; tablets não permitidos | `docs/03-requisitos-funcionais.md`, RF-018; `docs/09-baseline-requisitos-mvp.md`, v0.4 |
| RF-019 | Confirmar leitura, exibir horário de leitura e quantidade de mensagens não lidas | Sistema/Usuário | Confirmado na FORD v2 | `docs/03-requisitos-funcionais.md`, RF-019 |
| RF-020 | Permitir edição/exclusão administrativa de mensagens | TI | Confirmado; cada ação auditada | `docs/03-requisitos-funcionais.md`, RF-020 |
| RF-021 | Exportar conversas | TI | Confirmado; exportação auditada | `docs/03-requisitos-funcionais.md`, RF-021 |
| RF-022 | Registrar e gerir auditoria administrativa | Sistema/TI | Confirmado; consulta/gestão de logs somente TI | `docs/03-requisitos-funcionais.md`, RF-022; RNF-004 |
| RF-023 | Exibir aviso de monitoramento no primeiro acesso | Sistema | Confirmado | `docs/03-requisitos-funcionais.md`, RF-023 |

### 3.2 Requisitos não funcionais e restrições

| ID | Categoria | Requisito / situação | Fonte / seção |
|---|---|---|---|
| RNF-001 | Segurança e controle de acesso | Autorização server-side em todas as funções/dados; testes negativos e revisão | `docs/04-requisitos-nao-funcionais.md`, tabela RNF-001 |
| RNF-002 | Proteção de dados | Criptografia em trânsito/repouso; sem E2EE; gestão de chaves pelo servidor/TI FORD | `docs/04-requisitos-nao-funcionais.md`, RNF-002 |
| RNF-003 | Credenciais | Proteção alinhada; sem MFA/expiração periódica/troca inicial obrigatórios; recuperação pelo TI | `docs/04-requisitos-nao-funcionais.md`, RNF-003 |
| RNF-004 | Auditabilidade | Operações administrativas auditáveis; consulta de conversa pelo TI explicitamente registrada | `docs/04-requisitos-nao-funcionais.md`, RNF-004 |
| RNF-005 | Compatibilidade | Usuário Android/iOS em Chrome/Safari móveis atuais; TI computador Chrome/Edge/Firefox atuais; tablets não permitidos | `docs/04-requisitos-nao-funcionais.md`, RNF-005 |
| RNF-006 | Usabilidade | Interface simples; conversas recentes após login; telas e métricas pendentes | `docs/04-requisitos-nao-funcionais.md`, RNF-006 |
| RNF-007 | Desempenho | Metas de desempenho alinhadas com Desenvolvimento; verificar parâmetros no artefato técnico vigente, sem reabrir a premissa | `docs/04-requisitos-nao-funcionais.md`, RNF-007 |
| RNF-008 | Capacidade | 25 conexões simultâneas de usuários finais, além de administradores TI; limites alinhados | `docs/04-requisitos-nao-funcionais.md`, RNF-008 |
| RNF-009 | Disponibilidade/continuidade | 99% mensal; backups diários 12 meses; RPO 24h em desastre; RTO 24h; manutenção fora expediente e suporte comercial | `docs/04-requisitos-nao-funcionais.md`, RNF-009 |
| RNF-010 | Segurança de arquivos | PDF/JPEG, limites v0.4, scanner na infraestrutura FORD, bloqueio em falha/inconclusão e liberação TI auditada | `docs/04-requisitos-nao-funcionais.md`, RNF-010 |
| RNF-011 | Privacidade/governança | Posição da FORD registrada; aviso no primeiro acesso; regras e retenção v0.4; obrigações legais aplicáveis permanecem | `docs/04-requisitos-nao-funcionais.md`, RNF-011 |
| RNF-012 | Acessibilidade | Despriorizada na visão de produto; obrigações legais/corporativas aplicáveis permanecem | `docs/04-requisitos-nao-funcionais.md`, RNF-012 |
| RNF-013 | Arquitetura/plataforma | Supabase/Vercel oficiais; Q-025 para validar configuração, regiões e isolamento por ambiente | `docs/04-requisitos-nao-funcionais.md`, RNF-013; `docs/adr/ADR-003-supabase-vercel.md` |

**Outras regras/restrições:** somente roles `user` e `ti`; todos os TI com poderes equivalentes; grupos e participantes administrados pelo TI; usuários não saem de grupos; remoção revoga acesso ao histórico; usuários não editam/excluem mensagens; TI edita/exclui e exporta com auditoria; leitura/horário e não lidas; PDF/JPEG (10 MB, 5 por mensagem), quotas individuais e totais pelo TI; scanner interno com bloqueio em falha/inconclusão e liberação TI auditada; monitoramento por lista sem análise contextual/IA externa; severidades/prazos de alertas; auditoria e retenção; stack oficial Supabase/Vercel e governança FORD. Fonte: POLY-REQ-001 v0.4 e documentos 03 a 05.

### 3.3 Divergências e regra de precedência adotada

| Divergência / aparente conflito | Evidência | Tratamento nesta proposta |
|---|---|---|
| README informa que autenticação, conversas, grupos e anexos ainda serão implementados; código contém middleware e migration de perfis | `README.md`, seções “Estado atual” e “Supabase”; `src/auth/authorization.mjs`; `supabase/migrations/202611160001_profiles_roles_and_account_status.sql` | A documentação de requisitos prevalece para escopo. O código é reconhecido como fundação parcial, não como fluxo de negócio entregue. |
| RF-004 cita desativar, mas RN-003 e baseline incluem reativar | `docs/03-requisitos-funcionais.md`, RF-004; `docs/05-regras-de-negocio-e-restricoes.md`, RN-003; `docs/09-baseline-requisitos-mvp.md`, §4.2 | Incluída uma transação separada de reativação, por ser operação administrativa expressamente descrita na regra/baseline. Validar Q-002. |
| RF-006 enfatiza adicionar; RN-003/RN-007 e matriz #100 incluem remover participantes | `docs/05-regras-de-negocio-e-restricoes.md`, RN-003/RN-007; `docs/issue-100-matriz-autorizacao.md`, seção “Matriz de autorização” | Incluída remoção administrativa de participante. Não foram inferidos saída voluntária ou efeitos de exclusão de mensagens. |
| Supabase + Vercel aparecem como direção técnica, mas a visão v0.1 não define stack nem integrações de negócio | `docs/01-visao-geral-e-escopo.md`, §1.9; `docs/adr/ADR-003-supabase-vercel.md` | Considerados plataforma/serviços de implementação, não integração de negócio com WhatsApp/Teams. Supabase Auth foi tratado como fonte externa de identidades na hipótese AIE descrita na seção 5. |
| ADRs 001/004/005/007/008/009/010 permanecem Proposed | `docs/adr/README.md`, inventário; ADRs individuais | Propostas não foram convertidas em requisitos aprovados. O que não está aprovado fica como hipótese/pendência e não gera função adicional. |

**Funcionalidades que existem somente no código:** não foi identificada função de negócio completa sem correspondência documental. Existem detalhes técnicos implementados — validação JWT, respostas 401/403/503, bloqueio fail-closed, leitura de `profiles`, policies RLS da tabela e criação automática de perfil padrão — que são mecanismos de autorização documentados em ADR-006, não novas transações de negócio. A página inicial (`src/app/page.tsx`) contém texto promocional de capacidades futuras, mas não implementa essas capacidades.

**Artefatos PDF legados:** a árvore do repositório contém `docs/Diagrama_Casos_de_Uso.pdf`, `docs/Polychat_Requisitos_Funcionais.pdf` e `docs/Polychat_Requisitos_Nao_Funcionais.pdf`. Nesta execução, a integração de leitura retornou esses arquivos como conteúdo binário/base64, sem extração textual confiável; por isso, não foram usados como fonte independente para identificar requisitos. A contagem foi baseada nos documentos Markdown consolidados (em especial `docs/03`, `docs/04` e `docs/09`). Antes da contagem final, deve-se cotejar o conteúdo integral desses PDFs com a baseline Markdown e registrar qualquer requisito mais recente ou divergente. Esta é uma limitação explícita do levantamento preliminar.

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

Todas as quantidades DET/DER, RET/RLR e ALR da contagem original são **hipóteses de dimensionamento**. O modelo lógico foi atualizado na versão POLY-DATA-001 v0.3, mas ainda não constitui schema físico aprovado. Além disso, a FORD v2 alterou o conjunto de funções e a arquitetura de fronteira; a contagem histórica deve ser refeita. DET/RET/ALR, complexidades e funções candidatas deverão ser revistos com a documentação e os protótipos aceitos.

1. Supabase Auth é o serviço oficial de identidade do projeto (ADR-003/004). Para APF, a classificação do FD-08 como AIE depende da fronteira lógica entre a aplicação Polychat e o serviço de identidade, não apenas de o provedor ser externo. Reavaliar o grupo de dados e as funções na nova contagem; não retirar nem manter automaticamente os 5 PF históricos.
2. Perfis de aplicação são mantidos pelo Polychat em `public.profiles` e formam um ALI.
3. Conversas, memberships, mensagens, anexos, alertas e eventos de auditoria são ALIs candidatos, pois representam grupos lógicos de dados mantidos pela aplicação segundo os requisitos/Issue #99. O fato de o schema não estar implementado não impede sua identificação preliminar a partir dos requisitos; a confirmação depende da Issue #99.
4. Regras de detecção configuráveis não foram contadas como ALI separado, porque catálogo, manutenção e operações de configuração não estão especificados.
5. Envio de mensagem individual e em grupo foi contado como uma EE comum “Enviar mensagem”, com validação de destinatário/membership como regra contextual; não se duplica a mesma lógica em duas transações sem evidência de processos elementares distintos.
6. Análise automática de conteúdo foi tratada como processamento interno da EE de envio; não foi contada separadamente, pois a baseline não define uma transação autônoma iniciada/solicitada pelo usuário. A saída visível ao TI (alerta) é contada como SE.
7. A gravação do evento de auditoria é parte integrante da consulta administrativa e não foi contada novamente como EE, evitando dupla contagem.
8. A restrição por dispositivo, validações de formato, autorização e mensagens de erro são regras/controles transversais, não transações independentes.
9. Não foi aplicado fator de ajuste/VAF ao total principal. RNFs são tratados em esforço/custo separado, evitando misturar tamanho funcional e esforço não funcional.

### 4.3 Limites da estimativa

O inventário e o total de 124 PF são exclusivamente a contagem preliminar de 18/11/2026, anterior à baseline v0.4. Modelo lógico, requisitos funcionais, fronteira de autenticação e fluxos UX foram alterados/confirmados desde então. A contagem antiga não deve sustentar orçamento ou preço atuais até nova medição.

## 5. Contagem APF: funções de dados — fotografia histórica de 18/11/2026

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
| FD-08 | Identidades autenticadas — Supabase Auth | AIE (classificação preliminar; fronteira a confirmar) | 4 | 1 | Baixa | 5 (PF históricos; fronteira a reavaliar) | `docs/adr/ADR-004-autenticacao-sessoes.md`, Contexto/Decisão proposta; `docs/adr/ADR-003-supabase-vercel.md`, Supabase Auth previsto; `docs/09-baseline-requisitos-mvp.md`, RF-001 |

### 5.1 FD-08/AIE — justificativa histórica, sujeita à recontagem

O AIE FD-08 representa o conjunto de identidades/credenciais mantido pelo provedor de autenticação Supabase Auth, fora da fronteira lógica da aplicação Polychat, mas referenciado por ela para autenticar e associar perfis. A aplicação consulta a identidade validada e usa seu identificador para relacioná-la ao ALI Perfis.

**Ressalva:** Supabase Auth é a plataforma oficial de identidade, mas a classificação de FD-08 como AIE para APF continua sendo hipótese de fronteira lógica. O analista deve confirmar se existe grupo de dados reconhecível mantido pelo serviço fora da fronteira da aplicação Polychat. Não afirmar 119 PF por simples subtração: as demais funções e dados também precisam ser recontados.

### 5.2 Total das funções de dados

- ALIs: 7 × 7 PF = **49 PF**.
- AIEs: 1 × 5 PF = **5 PF**.
- Total de dados: 49 + 5 = **54 PF**.

## 6. Contagem APF: funções transacionais — fotografia histórica de 18/11/2026

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

## 7. Totalização em PF — fotografia histórica de 18/11/2026 (não vigente)

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

## 8. Esforço e cronograma — hipóteses históricas de 18/11/2026

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

## 9. Custo interno — estimativa histórica de 18/11/2026

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

## 10. Preço proposto — cálculo histórico de 18/11/2026 (não vigente)

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

**MVP — R$ 520.900,00 (124 PF)**  
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

## 11. Modelo de cobrança — simulação histórica, não oferta vigente

### 11.1 Investimento inicial de desenvolvimento

O desenvolvimento é cobrado como projeto, separado da operação recorrente:
- MVP: **R$ 520.900,00**.
- Completo: **R$ 622.500,00**.

### 11.2 Pagamento por marcos — exemplo comercial

| Marco | Percentual | MVP | Completo |
|---|---:|---:|---:|
| Assinatura e kickoff | 20% | R$ 104.180,00 | R$ 124.500,00 |
| Aprovação de requisitos, arquitetura e protótipos | 20% | R$ 104.180,00 | R$ 124.500,00 |
| Entrega de autenticação, perfis e administração | 25% | R$ 130.225,00 | R$ 155.625,00 |
| Entrega de mensageria, grupos, anexos, alertas e auditoria | 25% | R$ 130.225,00 | R$ 155.625,00 |
| Homologação, documentação e implantação | 10% | R$ 52.090,00 | R$ 62.250,00 |
| **Total** | **100%** | **R$ 520.900,00** | **R$ 622.500,00** |

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
| Implementação de monitoramento/auditoria ainda não entregue | Alta | Alto | Implementar lista de termos TI, fila/severidades/prazos, sem IA externa/bloqueio automático; auditar operações administrativas conforme v0.4 |
| Integração Supabase/Auth/RLS de domínio incompleta | Alta | Alto | Implementar por camadas; testes RLS reais e negativos; revisão independente |
| Critérios de detecção e falsos positivos indefinidos | Alta | Alto | Definir taxonomia, severidade, revisão humana e contingência antes de implementar |
| Integração de storage e scanner antimalware FORD | Alta | Alto | Implementar armazenamento e análise internos; evidenciar falha segura, liberação TI auditada e revogação de links |
| Concorrência, latência, disponibilidade, RPO/RTO não definidos | Alta | Alto | Definir SLOs e carga; teste de carga e restauração; cotar planos/infraestrutura |
| Classificação de dispositivo pode ser contornada | Média | Médio/alto | Tratar como compatibilidade/UX; autorização real sempre server-side |
| Cumprimento das regras de proteção/retention e obrigações aplicáveis | Alta | Alto | Implementar retenção sem exclusão automática, autorização TI, backups de 12 meses e descarte auditado, sem presumir dispensa legal |
| Configuração e integração Supabase/Vercel ainda sem evidência técnica completa | Alta | Alto | Validar projetos, regiões, ambientes, acessos, segredos e integrações da stack oficial (Q-025); preservar evidências das Issues #96/#98 |
| Reestimativa comercial após revisão v0.4 | Alta | Alto | Recalcular APF, esforço, preço e recorrência; R$ 450 mil é referência, não teto aprovado |

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

## 14. Condições comerciais — valores históricos, sem oferta vigente

Esta seção registra apenas as premissas de contratação usadas na simulação de 18/11/2026. Os preços, prazos, validade e cronograma abaixo não são uma oferta atual e não devem ser reutilizados como compromisso comercial depois da FORD v2.

- Valores históricos da simulação: MVP **R$ 520.900,00** e versão completa **R$ 622.500,00**; ambos dependem de recontagem APF, reestimativa de esforço/custo e revisão comercial.
- O plano atual não tem data final obrigatória: será organizado em sprints após a recontagem APF e a validação técnica dos ambientes Supabase/Vercel.
- A referência de **R$ 450.000,00** informada pela FORD inclui implantação e exclui infraestrutura, licenças, suporte, manutenção e treinamento; não é teto aprovado.
- Custos recorrentes precisam ser recalculados com a solução sob controle da FORD. As tabelas anteriores de consumo de serviços gerenciados e mensalidades são apenas simulações históricas da arquitetura antiga.
- Condições de pagamento, garantia, suporte, validade e marcos contratuais devem ser negociados novamente após a emissão da nova contagem e proposta.
- Nenhuma estimativa desta versão autoriza contratar serviços externos adicionais além das plataformas oficiais Supabase/Vercel sem aprovação explícita.

## 15. Perguntas da baseline anterior — status atualizado na v0.4

As perguntas originais abaixo são preservadas como histórico da baseline anterior. Seus estados atuais foram atualizados na tabela §17.5; as questões já respondidas ou alinhadas não devem ser reabertas como pendências de produto.

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
- Extrair/revisar o conteúdo integral dos PDFs legados de requisitos e casos de uso e compará-los à baseline Markdown; confirmar se há requisito vigente ausente ou divergente.

- Confirmar, para fins de APF, a fronteira lógica e a classificação do FD-08 associado ao Supabase Auth.
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


## 17. Revisão de impacto — baseline FORD v2 (19/11/2026)

Esta seção é o aditivo vigente para interpretar a proposta histórica acima. Em 19/11/2026 a baseline foi atualizada para POLY-REQ-001 v0.4, com base no questionário FORD v2 e nos alinhamentos do PO com Desenvolvimento.

### 17.1 Mudanças que invalidam a contagem e os valores anteriores como referência atual

| Tema | Premissa usada na estimativa de 18/11 | Decisão atual v0.4 | Impacto APF/comercial |
|---|---|---|---|
| Fonte de requisitos | Baseline anterior, predominantemente RF-001 a RF-018 | RF-001 a RF-023 e RN-001 a RN-025 consolidados | Recontar e revalidar processos elementares |
| Identidade | Supabase Auth oficial do projeto | A autenticação permanece na stack aprovada; classificação APF do serviço depende da fronteira lógica | Reavaliar FD-08/AIE; não aplicar automaticamente redução de 5 PF |
| Infraestrutura | Supabase + Vercel como plataformas oficiais | Validar configurações por ambiente, regiões, recursos e custos atuais dos planos | Recalcular custos recorrentes e operação; não reutilizar valores históricos |
| Contas | Alguns parâmetros de provisionamento/credenciais ainda abertos | TI cria contas e senha inicial, username único, recovery por TI; sem troca obrigatória/MFA/expiração periódica exigidos | Revalidar DET/RET/EE de autenticação/provisionamento |
| TI | Governança/hierarquia de administradores indefinida | Poderes iguais para todos os administradores TI; sem principal ou segunda aprovação | Reavaliar somente as funções percebidas pelo usuário; não criar hierarquia |
| Grupos | Ciclo de vida parcialmente pendente | TI cria/encerra/desativa/reativa grupos e administra membros; usuários não saem voluntariamente; remoção revoga acesso histórico | Revisar transações de grupo/membership e dados de histórico |
| Mensagens | Edição/exclusão ainda tratadas como pendentes | Usuário não edita/exclui; TI pode editar/excluir com auditoria | Incluir funções transacionais administrativas e atributos de histórico conforme análise IFPUG |
| Leitura | Recibos/contador não incluídos na primeira contagem | RF-019: confirmação/horário de leitura e quantidade de não lidas | Incluir avaliação de funções de leitura/atualização de estado |
| Exportação | Exportação não incluída | RF-021: TI exporta conversas, auditado | Validar saída externa/processo de exportação |
| Auditoria | Foco anterior em consulta TI | RF-022 e catálogo ampliado: contas/grupos/membros, consultas, alertas, downloads, liberação, exportações, edição/exclusão de mensagens, configurações | Reavaliar ALI/EE/CE/SE de auditoria e complexidade |
| Aviso de monitoramento | Não estava na contagem | RF-023: aviso no primeiro acesso | Avaliar se é função independente ou parte de autenticação/onboarding segundo CPM |
| Anexos | Limites/seleção ainda como pendência | PDF/JPEG; 10 MB; 5 por mensagem; quotas TI; PDF protegido rejeitado; JPEG galeria sem câmera; EXIF/GPS removido | Atualizar DET/regras e processos de upload/download |
| Antimalware | Scanner/limites pendentes; Storage ainda como proposta | Supabase Storage oficial; scanner integrado ao fluxo da aplicação, falha/inconclusão bloqueia e TI pode liberar com auditoria | Incluir avaliação do processo de liberação e metadados de análise |
| Monitoramento | Critérios/severidade em aberto | Lista de termos TI, inclui palavrões; sem contexto/IA externa; severidades e prazos definidos; sem bloqueio automático | Revisar alertas, manutenção de termos, revisão/encerramento; não contar controles duplicados |
| Retenção e continuidade | Regras e prazos pendentes | Sem exclusão automática enquanto sistema opera; TI autoriza exclusões; backups diários 12 meses; RPO/RTO definidos | Custos e esforço técnico/operacional devem ser atualizados; PF depende de transações realmente reconhecidas |
| UX | Wireframes em proposta sem aceite | Issues #91 e #92 aceitas como wireframes de baixa fidelidade | Usar como artefato de apoio, não como protótipo testado ou tela implementada |
| Prazo/orçamento | Data e teto orçamentário tratados como perguntas | Sem prazo final; planejamento em sprints. R$450 mil é referência, não teto, com exclusões definidas | Não manter prazos nem comparativo de “estouro” da estimativa antiga |

### 17.2 Inventário adicional de requisitos funcionais

| ID | Função/necessidade | Implicação a validar na APF |
|---|---|---|
| RF-019 | Confirmação/horário de leitura e contador de não lidas | Determinar entradas/consultas/saídas reconhecíveis e grupos de dados envolvidos |
| RF-020 | Edição e exclusão administrativa de mensagens pelo TI | Validar processos elementares distintos e histórico/auditoria |
| RF-021 | Exportação de conversas pelo TI | Validar saída externa, formato e fronteira do processo |
| RF-022 | Registro e gestão de auditoria administrativa | Reavaliar transações de gravação/consulta/gestão sem dupla contagem de auditoria embutida |
| RF-023 | Aviso de monitoramento no primeiro acesso | Validar se compõe autenticação ou configura processo elementar independente |

Além desses requisitos, reavaliar:
- gestão de lista de termos pelo TI;
- tratamento/encerramento de alertas e severidades;
- liberação administrativa de anexos;
- download de anexos pelo TI durante investigações;
- manutenção de configurações efetivamente persistentes;
- desativação/reativação de grupos e gestão de participantes conforme RF/RN atualizadas.

A inclusão nesta lista significa que o analista deve examinar o processo segundo as regras IFPUG; não significa que cada item resulte automaticamente em transação APF independente. Evitar dupla contagem de validações, auditoria embutida, notificações internas e controles transversais.

### 17.3 Arquitetura e fronteira de contagem

- Next.js permanece como frontend e Vercel é a plataforma oficial de hospedagem/deploy.
- Supabase é a plataforma oficial de backend; Auth, Database, Storage e Realtime são avaliados nas ADRs específicas e não devem ser tratados como serviços cancelados.
- PostgreSQL, identidade, storage, auditoria, monitoramento e backups usam a stack oficial Supabase/Vercel sob governança da FORD; o scanner antimalware deve permanecer integrado ao fluxo aprovado e sem serviço externo não autorizado.
- A classificação AIE/FD-08 da estimativa histórica continua como hipótese APF a validar, apesar de Supabase Auth ser a solução oficial de identidade. Reavaliar se existe arquivo lógico mantido fora da fronteira funcional Polychat dentro da própria infraestrutura FORD; a localização interna por si só não resolve a fronteira APF.
- A stack Supabase/Vercel está escolhida; Q-025 valida projetos, regiões e configurações. Recalcular os planos, limites e mensalidades atuais antes de emitir nova estimativa comercial.
- Bibliotecas/dependências que não acessem dados FORD podem ser utilizadas conforme as políticas técnicas aplicáveis.

### 17.4 UX e evidências

As Issues #91 e #92 foram encerradas após aprovação do PO/Tech Lead das jornadas e wireframes de baixa fidelidade:
- #91: jornada Usuário mobile, PR #141, review #5946859734, CI runs #13 e #83, Vercel success.
- #92: console TI desktop, PR #142, review #5946890924, CI runs #14 e #84, Vercel success.

Esses artefatos são insumos para identificar transações e DET, mas não são telas implementadas, protótipos funcionais nem evidência de testes de usabilidade. O mapa final de telas/navegação (Q-018) e os ativos exatos de marca (Q-019) continuam em refinamento.

### 17.5 Estado atualizado das questões da baseline

| Questão | Situação v0.4 | Tratamento para APF |
|---|---|---|
| Q-001 | 25 usuários finais + 2–3 TI | Considerar público correto; não reabrir |
| Q-002 | Poderes equivalentes entre TI; sem principal/segunda aprovação | Não modelar hierarquia |
| Q-003 | Regras de grupos, saída e remoção respondidas | Atualizar membership e revogação |
| Q-004 | JPEG da galeria; sem câmera; remoção EXIF/GPS | Atualizar fluxo de anexos |
| Q-005/Q-006 | username único; senha provisionada e recovery TI; sem MFA/expiração/troca obrigatória | Atualizar fronteira e fluxos de identidade |
| Q-007/Q-008 | Lista de termos e alertas com severidades/prazos definidos; sem bloqueio automático | Atualizar alertas e manutenção de regras |
| Q-009/Q-010 | Consulta TI sem justificativa; auditoria e retenção/backup definidos | Atualizar auditoria/dados |
| Q-011 | Limites e scanner interno definidos | Atualizar upload/download e dados |
| Q-012 | Dispositivos/navegadores definidos; tablets não permitidos | Atualizar requisitos de compatibilidade |
| Q-013 | Proteção de credenciais e chaves alinhadas; MFA não exigido | Não reabrir controles já alinhados |
| Q-014 | Plataformas oficiais Supabase/Vercel e governança da FORD | Q-025 para validação de ambientes e regiões |
| Q-015 | Solicitações legais tratadas pela FORD; informar quando juridicamente permitido | Registrar posição do cliente; obrigações legais permanecem |
| Q-016/Q-017 | Desempenho/capacidade e continuidade alinhados | Não reabrir requisitos já completos |
| Q-018 | Refinamento de telas/navegação ainda aberto | Revalidar transações após mapa final |
| Q-019 | Ativos oficiais de marca a obter/confirmar | Afeta UX, não necessariamente PF |
| Q-020 | Sem requisito adicional de acessibilidade informado; obrigações aplicáveis permanecem | Estimar hardening obrigatório conforme aplicável |
| Q-021 | Sem prazo final; planejamento por sprints | Não assumir prazo fixo de 5 meses |
| Q-022 | R$450.000 referência global, não teto; exclusões conhecidas | Atualizar cenário comercial |
| Q-023 | Português; sem push/browser; contador interno | Atualizar saídas/UX |
| Q-024 | Usuário não edita/exclui; TI pode editar/excluir com auditoria | Recontar processos de mensagem |
| Q-025 | Configuração técnica da stack oficial Supabase/Vercel | Bloqueia confirmação de ambientes, regiões, custos e evidências de integração |

Os grupos de requisitos técnicos já alinhados com Desenvolvimento (armazenamento, alertas, desempenho, credenciais, chaves, retenção, homologação e isolamento dos ambientes) não são pendências de produto.

### 17.6 Estado comercial e recomendação

- 124 PF, 20,67/24,67 pessoa-mês, 5/6–6,5 meses, custos internos, preços de R$520.900/R$622.500 e mensalidades das seções anteriores correspondem à fotografia de 18/11/2026. São mantidos apenas para histórico.
- Não utilizar os valores antigos em apresentação/negociação como preço vigente.
- R$450.000,00 é referência comercial global da FORD, não teto aprovado; contempla implantação e exclui infraestrutura, licenças, suporte, manutenção e treinamento.
- Não há prazo final obrigatório; o cronograma deverá ser organizado por sprints após a arquitetura e o escopo revisados.
- Custos operacionais devem ser refeitos a partir da infraestrutura sob controle FORD, sem presumir serviços SaaS externos.

### 17.7 Condições para nova emissão

1. Fechar a Q-025 após validar projetos, regiões, configurações, integrações e segregação da stack oficial Supabase/Vercel.
2. Revisar fronteira APF e grupos lógicos; definir se há AIE interno/externo ao Polychat.
3. Recalcular ALI/AIE/EE/SE/CE e DET/RET/ALR com base nos requisitos v0.4, evitando dupla contagem.
4. Considerar o modelo lógico atualizado POLY-DATA-001 v0.3 e as revisões técnicas da Issue #99.
5. Usar os wireframes #91/#92 como evidência documental, mantendo distinção entre baixa fidelidade e telas/testes realizados.
6. Atualizar esforço, cronograma, infraestrutura, implantação, licenças, suporte, manutenção, treinamento, tributos, margem e risco.
7. Submeter a nova contagem e estimativa à revisão do PO, Tech Lead, analista APF e responsáveis comerciais antes de emitir proposta.

**Conclusão desta revisão:** a proposta foi reconciliada documentalmente com a FORD v2, mas a contagem funcional e os preços históricos não foram recalculados. Ela não deve ser tratada como proposta comercial atual até a nova APF ser concluída.
