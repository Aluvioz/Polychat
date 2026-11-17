# 09 — Baseline consolidada de requisitos e escopo MVP

**Issue:** #88 — Consolidar baseline de requisitos e escopo MVP  
**Identificador:** POLY-REQ-001  
**Versão:** 0.2 — 16/11/2026  
**Fonte primária:** POLYCHAT — FORD: Documento de Visão do Produto e Plano Inicial de Desenvolvimento, versão 0.1, confirmado pelo solicitante como referência aprovada para este trabalho.  
**Escopo técnico desta issue:** Supabase + Vercel, autorização server-side, comportamento de erro, documentação, evidências, rastreabilidade e ausência de regressão.

## 1. Estado e interpretação

- **Confirmado:** informação expressa na visão v0.1 ou decisão explícita do solicitante.
- **Derivado:** detalhamento operacional para tornar um comportamento verificável; não é nova decisão de negócio.
- **Recomendação:** controle sugerido tecnicamente, sem aprovação específica.
- **Pendente:** falta parâmetro, política ou decisão.

A confirmação da visão v0.1 pelo solicitante autoriza seu uso como referência aprovada neste trabalho. Não equivale à assinatura formal do representante da FORD, nem comprova aprovação formal do PO, liderança técnica, arquitetura detalhada ou SQA.

## 2. Baseline do MVP

### 2.1 Incluído

- Aplicação web de comunicação interna exclusiva da FORD.
- Público inicial de aproximadamente **25 pessoas do setor técnico**, em uma organização de aproximadamente 900 funcionários.
- Exatamente dois perfis de autorização: **Usuário** e **TI**.
- Usuário representa funcionários fora de TI, sem distinção de cargo corporativo; essa definição não amplia automaticamente o público inicial de 25 pessoas.
- TI é responsável central por contas, credenciais iniciais, ciclo de vida, grupos, participantes, configurações e políticas de segurança, alertas e investigação, conforme a visão.
- Autenticação por credenciais individuais criadas pelo TI e entregues individualmente com o link da aplicação.
- Mensagens individuais entre usuários ativos autorizados, sem hierarquia por cargo.
- Grupos criados e administrados pelo TI; membros incluídos podem enviar mensagens.
- Mensagens textuais e anexos PDF/JPEG, com validação do conteúdo real.
- Monitoramento automático de mensagens suspeitas, incluindo palavras ofensivas/palavrões segundo critérios ainda a definir; alerta ao TI e investigação posterior.
- Consulta de conversas individuais e em grupo pelo TI para segurança; o acesso deve ser registrado em auditoria.
- Perfil Usuário em smartphone; perfil TI em computador.
- Interface simples e familiar, identidade visual Ford azul e branco.
- Segurança priorizada sobre velocidade e privacidade individual no contexto corporativo, sem afastar governança ou obrigações legais.
- Orçamento informado: **R$ 450.000,00**, como referência inicial; composição e natureza financeira pendentes.

### 2.2 Fora do escopo inicial

Conforme seção 8 da visão v0.1:

- Aplicativos nativos Android/iOS e aplicativos desktop instaláveis.
- Integrações com WhatsApp, Teams ou outras ferramentas/aplicativos externos.
- Chamadas de voz/vídeo, mensagens de áudio e gravação de vídeos.
- Captura de fotos pelo aplicativo.
- Compartilhamento de formatos diferentes de PDF e JPEG.
- Convites para usuários externos e cadastro autônomo.
- Administração por usuários comuns.
- Expansão para os setores operacional e estratégico na primeira versão.
- Uso do perfil Usuário em computador e do perfil TI em smartphone.

## 3. Decisões e restrições

| ID | Decisão / restrição | Estado | Fonte |
|---|---|---|---|
| D-001 | Somente perfis Usuário e TI. | Confirmado | Visão v0.1, seção 4 |
| D-002 | Usuário abrange funcionários fora de TI, sem diferença por cargo. | Confirmado | Visão v0.1, seção 4.1 |
| D-003 | TI centraliza administração de contas, credenciais, grupos, participantes, segurança, alertas e investigação. | Confirmado | Visão v0.1, seção 4.2 |
| D-004 | Público inicial de aproximadamente 25 pessoas do setor técnico; não ampliar automaticamente para os 900 funcionários. | Confirmado | Visão v0.1, seção 3.1 |
| D-005 | Aplicação web, uso interno FORD e link distribuído pelo TI. | Confirmado | Visão v0.1, seções 1 e 3 |
| D-006 | Usuário em smartphone; TI em computador. | Confirmado | Visão v0.1, seção 3.2 |
| D-007 | Mensagens individuais e em grupos; membros adicionados pelo TI podem enviar mensagens. | Confirmado | Visão v0.1, seções 4.1 e 5 |
| D-008 | Anexos PDF/JPEG e validação do conteúdo real. | Confirmado | Visão v0.1, seção 5, RF-06 |
| D-009 | Análise de mensagens suspeitas, alerta ao TI e investigação posterior. | Intenção confirmada; critérios pendentes | Visão v0.1, seções 4.2 e 5, RF-07 |
| D-010 | TI consulta qualquer conversa para segurança e o acesso deve ser auditado. | Confirmado; governança complementar pendente | Visão v0.1, seção 5, RF-08 |
| D-011 | Identidade visual Ford azul e branco. | Direção confirmada; manual/ativos pendentes | Visão v0.1, seção 6, RNF-07 |
| D-012 | Segurança prevalece sobre velocidade e privacidade individual no ambiente corporativo. | Prioridade confirmada; controles e governança pendentes | Visão v0.1, seções 7 e 7.1 |
| D-013 | Sem integrações externas de comunicação na primeira versão. | Confirmado | Visão v0.1, RNF-08 e seção 8 |
| D-014 | R$ 450.000,00 como referência financeira inicial. | Valor informado confirmado; composição pendente | Visão v0.1, seção 10 |
| D-015 | Supabase + Vercel como arquitetura de referência para execução da Issue #88. | Restrição explícita da issue; detalhes não constituem ADR aprovada | Issue #88, Escopo |

## 4. Inventário e rastreabilidade

Os identificadores existentes foram preservados. Os documentos 02 a 08 mantêm os critérios CA e os detalhes por requisito.

### 4.1 Objetivos

| ID | Objetivo | Fonte v0.1 | Requisitos |
|---|---|---|---|
| OBJ-001 | Comunicação corporativa própria FORD | Seções 1 e 2 | RF-001, RF-003, RF-004; RNF-001..003 |
| OBJ-002 | Comunicação direta entre usuários ativos | Seções 1, 4.1 e 5 | RF-008, RF-009 |
| OBJ-003 | Comunicação em grupos geridos pelo TI | Seções 4.1, 4.2 e 5 | RF-005, RF-006, RF-010 |
| OBJ-004 | Administração centralizada no TI | Seção 4.2 | RF-002..006, RF-016 |
| OBJ-005 | Monitoramento e identificação de mensagens suspeitas | Seções 2.2 e 5 | RF-014..016; RNF-004, RNF-011 |
| OBJ-006 | Restrição por perfil/dispositivo | Seção 3.2 | RF-017, RF-018; RNF-005 |
| OBJ-007 | Experiência simples e identidade visual Ford | Seções 1 e 6 | RF-007, RF-008; RNF-006 |

### 4.2 Requisitos funcionais

| ID | Requisito | Fonte v0.1 | Estado consolidado |
|---|---|---|---|
| RF-001 | Autenticação por usuário e senha | 3.2, 4.1, 5 RF-01 | Confirmado; identificador e políticas de senha pendentes |
| RF-002 | Permissões dos dois perfis | 4 | Confirmado; autorização server-side exigida pela Issue #88 |
| RF-003 | Criar/provisionar contas | 4.2, 5 RF-02 | Confirmado; detalhes pendentes |
| RF-004 | Desativar/reativar contas e revogar sessões | 4.2, 5 RF-02 | Confirmado; política operacional pendente |
| RF-005 | Criar grupos | 4.2, 5 RF-04 | Confirmado |
| RF-006 | Adicionar/remover participantes | 4.2, 5 RF-04 | Confirmado |
| RF-007 | Exibir conversas recentes | 5 RF-09 | Confirmado em nível funcional |
| RF-008 | Abrir e ler conversas | 5 RF-09 e fluxo de comunicação | Derivado necessário; limitado a participantes |
| RF-009 | Enviar mensagem individual | 1, 4.1, 5 RF-03/05 | Confirmado |
| RF-010 | Enviar mensagem em grupo | 4.1 | Confirmado; ciclo de vida adicional pendente |
| RF-011 | Anexar PDF/JPEG | 4.1, 5 RF-06 | Confirmado; limites pendentes |
| RF-012 | Rejeitar formatos não permitidos | 5 RF-06 e seção 8 | Confirmado |
| RF-013 | Não oferecer captura/gravação de mídia | 3.2 e seção 8 | Confirmado; seleção de JPEG existente versus câmera pendente |
| RF-014 | Analisar mensagens suspeitas | 2.2, 4.2, 5 RF-07 | Intenção confirmada; regras e falsos positivos pendentes |
| RF-015 | Alertar TI | 4.2, 5 RF-07 | Intenção confirmada; canal/severidade/fluxo pendentes |
| RF-016 | TI consultar qualquer conversa | 4.2, 5 RF-08 | Confirmado; acesso deve ser auditado |
| RF-017 | Restringir Usuário a celular | 3.2 e seção 8 | Confirmado; detecção e exceções pendentes |
| RF-018 | Restringir TI a computador | 3.2 e seção 8 | Confirmado; detecção e exceções pendentes |

### 4.3 Requisitos não funcionais

| ID | Categoria | Fonte v0.1 | Estado consolidado |
|---|---|---|---|
| RNF-001 | Segurança | 2.2, 7, 14 | Direção confirmada; critérios verificáveis pendentes |
| RNF-002 | Integridade/proteção de dados | 2.2, 7 | Necessidade confirmada; controles específicos pendentes |
| RNF-003 | Confidencialidade | 2.2, 7 | Necessidade confirmada; controles específicos pendentes |
| RNF-004 | Auditoria | 7.1 e RF-08 | Requisito confirmado; campos, integridade e retenção pendentes |
| RNF-005 | Compatibilidade por dispositivo | 3.2 | Direção confirmada; matriz de SO/navegador/tablet pendente |
| RNF-006 | Usabilidade | 1 e 6 | Direção confirmada; métricas/telas pendentes |
| RNF-007 | Desempenho/prioridade | 5 e 14 | Segurança prevalece; metas quantitativas pendentes |
| RNF-008 | Capacidade | 3.1 | Público inicial de 25; concorrência/volume pendentes |
| RNF-009 | Continuidade | 7 e 13 | Backup, RPO, RTO e disponibilidade pendentes |
| RNF-010 | Segurança de arquivos | 5 RF-06 e 7 | PDF/JPEG confirmados; antimalware/limites ainda sem especificação |
| RNF-011 | Governança/privacidade | 7.1 | Política de monitoramento, transparência, responsáveis, limitação de uso e retenção pendente |
| RNF-012 | Acessibilidade | Não especificada como requisito funcional | Despriorizada pelo solicitante; obrigações legais/corporativas aplicáveis não são dispensadas |
| RNF-013 | Tecnologia/arquitetura | Issue #88 e visão v0.1 seção 13 | Supabase + Vercel é restrição da issue; integração/configuração pendentes |

### 4.4 Regras de negócio

Preservar RN-001..RN-020 em 05. Correções de estado consolidadas:

- RN-003: catálogo de responsabilidades administrativas do TI confirmado na seção 4.2 da visão.
- RN-007: envio por membros de grupos confirmado; saída voluntária, remoção de mensagens e encerramento ainda pendentes.
- RN-014: consulta de conversas e registro em auditoria confirmados; governança complementar pendente.
- RN-016: prioridade de segurança sobre velocidade e privacidade individual confirmada, sem afastar obrigações legais.
- RN-018: 25 pessoas do setor técnico são o público inicial; a definição ampla do perfil Usuário não expande esse público.
- RN-020: valor R$ 450.000,00 informado; natureza e composição pendentes.

## 5. Arquitetura e implementação observadas

### 5.1 Restrição da Issue #88

O documento de visão v0.1 não escolhe stack, banco ou hospedagem. A Issue #88 determina Supabase + Vercel como arquitetura de referência para sua execução. Isso é uma restrição da issue, não uma ADR detalhada aprovada pelo cliente.

### 5.2 Estado do repositório inspecionado

- A branch principal main contém documentação, diagramas e workflow; não foi encontrado package.json, aplicação Next.js, rotas Vercel ou runtime integrado ao Supabase.
- A camada de autorização e migration Supabase foram localizadas em branch de implementação separada e estão presentes nesta branch de trabalho: src/auth/authorization.mjs, supabase/migrations/202611160001_profiles_roles_and_account_status.sql, tests/authorization.test.mjs e docs/authorization-user-ti.md.
- O middleware valida token com supabase.auth.getUser(token), lê role/estado em public.profiles, aceita somente user e ti, bloqueia conta inativa e falha fechada quando consulta de perfil falha.
- requireRole restringe handlers depois da autenticação.
- A migration cria profiles, habilita RLS, restringe leitura ao próprio perfil ou TI ativo e revoga escrita direta de anon/authenticated. Operações privilegiadas precisam ocorrer em contexto confiável no servidor.
- O módulo é compatível com middleware Express-style, mas não está conectado a rotas reais de uma aplicação Vercel/Next.js.
- A service-role key nunca pode ser exposta ao browser, em variável NEXT_PUBLIC_*, bundle cliente ou logs. A configuração real de deployment/segredos não foi observada.
- Não foram localizadas políticas RLS de domínio para mensagens, grupos ou anexos.

**Conclusão: alinhamento parcial, não concluído.** A camada isolada de autorização e migration são coerentes com Supabase e validação server-side. A aplicação Vercel e a integração a rotas/handlers não existem na branch principal examinada. Não declarar arquitetura de ponta a ponta implementada até existir integração executável e testes no runtime real.

## 6. Autorização server-side e comportamento de erro

Comportamentos a validar e preservar:

- Token ausente, inválido ou expirado: HTTP 401; handler protegido não executa.
- Perfil ausente, role desconhecida ou conta inativa: HTTP 403; handler não executa.
- Falha ao consultar autenticação/perfil ou exceção de infraestrutura: falhar fechado, sem conceder acesso.
- Usuário em rota exclusiva TI: HTTP 403.
- Falha interna: resposta genérica, sem stack trace, token, chave, mensagem interna ou detalhe de banco.
- Identidade, role e estado não podem ser aceitos de body/query/header controlados pelo cliente; devem vir do token validado e do banco.
- Executar autenticação antes de requireRole em todas as rotas protegidas.
- Middleware não substitui RLS nas tabelas de domínio nem validação de participação em conversas/grupos.

## 7. Testes e evidências

Os testes existentes em tests/authorization.test.mjs cobrem usuário ativo, token ausente, sessão inválida, conta inativa, falha de consulta, role desconhecida, acesso TI e bloqueio de usuário em rota TI.

Comando previsto:

~~~bash
node --test tests/*.test.mjs
~~~

Execução local com Node.js v22.16.0: 11 testes automatizados aprovados (11 pass, 0 fail), via `node --test tests/*.test.mjs`. Os testes usam Supabase simulado; não comprovam integração com Supabase hospedado, políticas RLS reais, Vercel ou regressão de fluxos de mensagens/anexos ainda não encontrados no repositório.

## 8. Questões sem decisão

Manter Q-001..Q-024 em 08. Permanecem relevantes:

- Q-001/Q-002: composição das 25 pessoas e governança para criação/alteração de contas TI.
- Q-003: saída voluntária, remoção de mensagens e encerramento de grupos (envio por membros já está confirmado).
- Q-004: anexar JPEG existente sem habilitar captura pela câmera.
- Q-005/Q-006: identificador de login, entrega, expiração, primeiro acesso e recuperação de senha.
- Q-007/Q-008: regra/lista de suspeição, falsos positivos, severidade, canal e ação após alerta.
- Q-009/Q-010: governança da consulta TI, transparência, retenção, exclusão e descarte.
- Q-011: tamanho/quantidade de anexos, armazenamento e antimalware.
- Q-012: SO/navegadores, tablets, emulação e modo desktop.
- Q-013/Q-014: modelo de ameaças, criptografia, chaves, infraestrutura, backup e responsáveis.
- Q-015: solicitações legais.
- Q-016/Q-017: carga, desempenho, disponibilidade, RPO e RTO.
- Q-018/Q-019: mapa de telas e ativos oficiais Ford.
- Q-020: requisitos legais/corporativos de acessibilidade aplicáveis.
- Q-021/Q-022: cronograma e composição/natureza do orçamento.
- Q-023/Q-024: idioma/notificações e edição/exclusão de mensagens.

Nenhuma lacuna foi preenchida por suposição.

## 9. Registro de mudanças e impactos

| Alteração | Fonte/motivo | Impacto em requisitos | Impacto em implementação/testes |
|---|---|---|---|
| Baseline consolidada v0.2 | Visão v0.1 confirmada pelo solicitante | Nenhum ID removido/renumerado | Revisão documental |
| RF-010 e OBJ-003 classificados como confirmados | Visão v0.1, seção 4.1 | Corrige estado; preserva CA-010.x | Exige teste de membro/não membro |
| RNF-004/RN-014 registram auditoria como requisito confirmado | Visão v0.1, seção 7.1 e RF-08 | Corrige estado | Trilha e política de retenção ainda não evidenciadas |
| Público inicial esclarecido | Visão v0.1, seção 3.1 | Evita ampliação indevida do MVP | Provisionamento deve respeitar elegibilidade aprovada |
| Supabase + Vercel registrados como restrição da issue | Issue #88 | RNF-013 explicita a origem | Integração Vercel/Next.js ainda ausente |
| Lacunas de autorização e domínio registradas | Inspeção de árvore/código | Sem novos requisitos | Faltam integração real, RLS de domínio e testes de ponta a ponta |

## 10. Revisão

Esta baseline é material para revisão técnica e de produto. A aprovação formal da PR, a validação do representante da FORD e a integração da autorização ao runtime Vercel não são declaradas concluídas por este documento.
