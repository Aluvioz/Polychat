# 09 — Baseline consolidada de requisitos e escopo MVP

**Issue de origem:** #88 — Consolidar baseline de requisitos e escopo MVP  
**Identificador:** POLY-REQ-001  
**Versão:** 0.5 — 20/11/2026  
**Fonte primária:** Questionário de Esclarecimento de Requisitos da FORD, versão atualizada (FORD v2), recebido em 19/11/2026.  
**Fontes complementares:** alinhamentos do PO com Desenvolvimento, premissas consolidadas nos documentos 00 a 08 e decisões de negócio registradas pelo representante da FORD.  
**Estado:** baseline de produto atualizada com arquitetura da informação por perfil e paleta visual provisória Ford; ativos oficiais de logotipo permanecem pendentes em Q-019 e validação da compatibilidade operacional da stack Supabase + Vercel permanece em Q-025.

Esta versão substitui, para a especificação de produto, a baseline v0.3 baseada principalmente na visão POLYCHAT — FORD v0.1. Os identificadores existentes foram preservados; os novos requisitos funcionais foram acrescentados a partir de RF-019.

## 1. Estado, interpretação e precedência

### 1.1 Classificação da informação

- **Confirmado pela FORD:** decisão ou regra expressa no questionário atualizado.
- **Alinhado com Desenvolvimento:** parâmetro técnico/operacional considerado completo pelo PO após alinhamento com a equipe.
- **Premissa de produto:** decisão de gestão confirmada pelo PO para orientar escopo e documentação.
- **Derivado:** detalhamento necessário para tornar uma necessidade verificável, sem alterar a decisão de negócio.
- **Pendente:** questão ainda sem definição ou decisão técnica/documental que precisa ser concluída.

A classificação de um requisito como confirmado ou alinhado não significa que sua implementação, teste ou homologação estejam concluídos.

### 1.2 Precedência

1. A FORD v2 e os alinhamentos complementares registrados pelo PO em 19/11/2026 prevalecem sobre respostas e interpretações anteriores da visão v0.1.
2. As decisões de negócio atuais prevalecem sobre documentos anteriores que ainda indiquem políticas, permissões ou parâmetros diferentes.
3. Os documentos 00 a 08 desta revisão detalham a baseline e devem permanecer consistentes com este documento.
4. A Issue #88 e as ADRs elaboradas antes do alinhamento continuam sendo registros históricos/técnicos, mas não autorizam ignorar a restrição mais recente da FORD para infraestrutura e processamento de dados.
5. Não se presume que uma tecnologia atualmente presente no código esteja aprovada para produção apenas por já ter sido utilizada ou documentada.

### 1.3 Premissas de gestão já encerradas

Os seguintes grupos foram alinhados com Desenvolvimento e são considerados completos pelo PO:
- Limites de armazenamento.
- Regras e severidades dos alertas.
- Metas de desempenho.
- Proteção de credenciais.
- Gestão de chaves.
- Política detalhada de retenção.
- Critérios de homologação.
- Isolamento dos ambientes.

A confiança nos administradores TI e os riscos associados à igualdade de poderes administrativos foram avaliados pelo responsável do projeto. Não devem ser reabertos como pendências de requisito.

## 2. Baseline do MVP

### 2.1 Incluído

- Aplicação web de comunicação interna para a FORD.
- Público inicial de 25 usuários finais do setor técnico, além de aproximadamente 2 a 3 administradores TI.
- Dois perfis de aplicação: Usuário e TI.
- Contas criadas exclusivamente pelo TI, inclusive as contas administrativas.
- Nome de usuário único na organização, definido e alterável pelo TI a qualquer momento.
- Senha criada pelo TI e enviada individualmente com o link de acesso; sem troca obrigatória no primeiro acesso, expiração periódica ou MFA exigido pela FORD.
- Recuperação de senha exclusivamente pelo TI.
- Desativação e reativação de contas pelo TI; desativação encerra imediatamente sessões e revoga acessos, preservando o histórico.
- Conversas individuais e grupos criados e administrados pelo TI.
- Entrada e remoção de participantes realizadas pelo TI; usuários não podem sair voluntariamente dos grupos.
- Revogação imediata do acesso de participante removido às mensagens e anexos anteriores do grupo.
- Mensagens de texto, sem edição ou exclusão pelo Usuário comum.
- Edição e exclusão de mensagens pelo TI a qualquer momento, com registro de auditoria.
- Confirmação de leitura, horário de leitura e quantidade de mensagens não lidas.
- Histórico paginado, começando pelas mensagens mais recentes, sujeito à política de retenção.
- Sincronização em tempo real e recuperação automática após desconexão normal, sem perda de mensagens confirmadas pelo servidor.
- Anexos exclusivamente JPEG e PDF, com até 10 MB por arquivo e até 5 arquivos por mensagem.
- Limites individuais de armazenamento e capacidade total definidos pelo TI; sem limite específico por conversa.
- Seleção de JPEG existente na galeria do celular, sem captura de fotos ou gravação de áudio/vídeo pela aplicação.
- Remoção de metadados das imagens, incluindo localização GPS.
- Análise antimalware antes da disponibilização. Falha, indisponibilidade ou resultado inconclusivo mantém o anexo bloqueado; mensagens de texto continuam funcionando.
- PDF protegido por senha não é aceito.
- Liberação administrativa de qualquer arquivo pelo TI conforme decisão expressa da FORD; usuários não podem contornar a análise.
- Links temporários com validade máxima de 5 minutos e revogação imediata quando o acesso do participante é removido.
- Download de anexos pelo TI durante investigações, com registro em auditoria.
- Detecção de mensagens suspeitas por regras e lista de termos mantida pelo TI, incluindo palavrões; sem análise contextual ou IA de terceiros.
- Conteúdo de mensagens e anexos não pode ser enviado a serviços externos para análise.
- Fila de alertas no console TI, com severidade baixa, média e alta e prazos de resposta definidos.
- Encerramento de alertas pelo TI sem justificativa obrigatória.
- Consulta de qualquer conversa pelo TI a qualquer momento, sem justificativa ou autorização prévia de outra pessoa.
- Exportação de conversas pelo TI a qualquer momento, com registro em auditoria.
- Aviso de monitoramento no primeiro acesso do funcionário.
- Auditoria das operações administrativas e de segurança conforme catálogo definido pela FORD.
- Criptografia em trânsito e em repouso, sem criptografia ponta a ponta (E2EE); o servidor mantém acesso ao conteúdo para monitoramento e administração.
- Usuário acessa somente por celular Android/iOS; TI acessa somente por computador.
- Interface exclusivamente em português, com paleta Ford provisória: Ford Blue `#00095B`, Ford Twilight `#00142E`, Ford Skyview `#066FEF`, branco `#FFFFFF` e neutros `#F0F0F0`/`#0F0F0F`. Aplicar o Ford Oval somente a partir de arquivo oficial autorizado.
- Indicador de mensagens não lidas dentro do aplicativo; sem notificações push ou notificações do navegador.
- Hospedagem e infraestrutura sob controle da FORD, preferencialmente no Brasil; nenhum terceiro pode acessar, armazenar ou processar dados da organização.

### 2.2 Fora do escopo inicial

- Expansão para setores operacional e estratégico ou para todos os aproximadamente 900 funcionários da FORD.
- Uso por fornecedores, parceiros, prestadores ou público externo.
- Cadastro aberto, autoinscrição, convite ou criação de contas por Usuários comuns.
- Aplicativos nativos instaláveis Android/iOS ou desktop; o produto contratado é uma aplicação web.
- Chamadas de voz/vídeo, mensagens de áudio, gravação de áudio/vídeo e captura de fotos pela aplicação.
- Compartilhamento de formatos diferentes de PDF e JPEG.
- Notificações push e notificações do navegador.
- Integrações com outros aplicativos ou serviços externos de comunicação.
- Serviços externos que acessem, armazenem ou processem dados da FORD.

### 2.3 Público e capacidade

- 25 usuários finais do setor técnico.
- Aproximadamente 2 a 3 administradores TI adicionais.
- Até 25 conexões simultâneas de usuários finais, além dos administradores TI.
- Volume esperado de mensagens e anexos baixo/ocasional.
- Não há expansão prevista nesta versão.

## 3. Decisões e restrições consolidadas

| ID | Decisão / restrição | Estado | Referência atual |
|---|---|---|---|
| D-001 | Somente perfis Usuário e TI. | Confirmado | RN-001; RF-002 |
| D-002 | 25 usuários finais do setor técnico, além de 2 a 3 administradores TI. | Confirmado | RN-018; OBJ-001 |
| D-003 | Todos os administradores TI possuem os mesmos poderes; não há administrador principal nem aprovação de segundo administrador. | Confirmado; riscos avaliados pelo projeto | RN-003; RF-002 |
| D-004 | TI cria e administra contas, inclusive contas TI; não há auto cadastro. | Confirmado | RN-003 a RN-005; RF-003 |
| D-005 | Nome de usuário único, definido e alterável pelo TI; senha criada e entregue individualmente pelo TI. | Confirmado | RN-005; RF-001; RF-003 |
| D-006 | Sem troca obrigatória no primeiro acesso, expiração periódica ou MFA exigido pela FORD; recuperação pelo TI. | Confirmado | RN-005; RF-001; RNF-003 |
| D-007 | TI desativa/reativa contas e a desativação revoga sessões imediatamente, preservando histórico. | Confirmado | RF-004; RN-003 |
| D-008 | TI cria, encerra, desativa, reativa grupos e administra participantes; usuário não sai voluntariamente. | Confirmado | RN-007; RF-005; RF-006 |
| D-009 | Participante removido perde imediatamente acesso às mensagens e anexos anteriores; links devem ser revogados. | Confirmado | RN-007; RF-006; RF-011 |
| D-010 | Usuário não edita nem exclui mensagens; TI pode editar/excluir a qualquer momento com auditoria. | Confirmado | RN-014; RF-020; RF-022 |
| D-011 | TI consulta qualquer conversa e exporta conversas a qualquer momento, sem justificativa ou autorização prévia de outra pessoa; ações são auditadas. | Confirmado | RN-014; RF-016; RF-021; RF-022 |
| D-012 | Confirmação/horário de leitura e contador de mensagens não lidas. | Confirmado | RF-019 |
| D-013 | Mensagens confirmadas são persistidas e recuperadas após reconexão normal; RPO de 24h aplica-se somente a desastre/falha de infraestrutura. | Confirmado | RN-023; RF-009; RF-010; RNF-009 |
| D-014 | Anexos PDF/JPEG; 10 MB por arquivo; até 5 por mensagem; quotas individual e total administradas pelo TI. | Confirmado/alinhado | RN-008; RF-011; RF-012; RNF-010 |
| D-015 | Scanner antimalware na infraestrutura FORD; falha/inconclusão mantém anexo bloqueado; TI pode liberar arquivo. | Confirmado | RN-008; RF-011; RF-012; RNF-010 |
| D-016 | Sem captura de foto ou gravação; JPEG selecionado da galeria; remoção de metadados GPS. | Confirmado | RN-011; RF-013 |
| D-017 | Detecção por regras/lista de termos do TI, incluindo palavrões; sem análise contextual ou IA de terceiros. | Confirmado/alinhado | RN-012; RF-014 |
| D-018 | Alertas baixa/média/alta; prazos alta até 1h, média 1 dia útil, baixa 3 dias úteis; TI analisa e encerra sem justificativa. | Confirmado/alinhado | RN-013; RF-015 |
| D-019 | Aviso de monitoramento no primeiro acesso. | Confirmado | RN-025; RF-023 |
| D-020 | Criptografia em trânsito e em repouso; sem E2EE; chaves administradas pelo servidor sob responsabilidade do TI. | Confirmado/alinhado | RN-016; RNF-002 |
| D-021 | Retenção sem exclusão automática enquanto o sistema operar; TI autoriza exclusões e preservação em investigação; backups por 12 meses com descarte registrado. | Alinhado com Desenvolvimento | RN-021; RNF-004; RNF-009 |
| D-022 | Infraestrutura sob controle da FORD, preferencialmente no Brasil; nenhum terceiro acessa, armazena ou processa dados. | Confirmado | RN-022; RNF-013 |
| D-023 | Disponibilidade 99% mensal; RPO 24h em desastre; RTO 24h; backups diários por 12 meses; manutenção fora do horário comercial; suporte em horário comercial. | Confirmado/alinhado | RN-023; RNF-009 |
| D-024 | Usuário em Android/iOS, Chrome/Safari móveis atuais; TI em computador, Chrome/Edge/Firefox atuais; tablets não permitidos. | Confirmado/alinhado | RN-015; RF-017; RF-018; RNF-005 |
| D-025 | Interface em português, paleta Ford provisória (`#00095B`, `#00142E`, `#066FEF`, branco e neutros) e uso do Ford Oval somente com arquivo oficial autorizado; sem push/browser notification. | Direção cromática provisória definida pelo PO em 20/11/2026; arquivo oficial do logo pendente em Q-019 | RN-010; RN-019; RF-023; RNF-006; POLY-UX-DEC-001 |
| D-026 | Lançamento único após homologação, sem piloto; aceite escrito e Go/No-Go do gestor. | Confirmado/alinhado | RN-024; RF-001 a RF-023; RNF-001 a RNF-013 |
| D-027 | R$ 450.000,00 como referência comercial global, incluindo implantação e excluindo infraestrutura, licenças, suporte, manutenção e treinamento. | Condição informada; não é teto aprovado | RN-020 |
| D-028 | Sem data limite definida; prazo será combinado por planejamento de sprints. | Confirmado | RN-024; Q-021 |
| D-029 | Segurança é prioridade sobre velocidade; posicionamento do cliente sobre privacidade/LGPD não afasta obrigações legais. | Posicionamento registrado | RN-016; RN-025; RNF-011 |
| D-030 | Arquitetura da informação: Usuário mobile com Conversas recentes como área principal; TI desktop com Dashboard, Usuários, Grupos, Consulta, Alertas, Auditoria e Configurações restritas aos controles definidos. | Decisão de produto do PO em 20/11/2026 | Q-018; POLY-UX-DEC-001 |
| D-031 | Identidade visual provisória baseada na família cromática Ford: Ford Blue `#00095B`, Ford Twilight `#00142E`, Ford Skyview `#066FEF`, branco e neutros; logotipo oficial condicionado a arquivo autorizado. | Paleta provisória definida pelo PO em 20/11/2026; ativos oficiais pendentes | Q-019; RNF-006; POLY-UX-DEC-001 |

## 4. Inventário e rastreabilidade

### 4.1 Objetivos do produto

| ID | Objetivo | Requisitos relacionados |
|---|---|---|
| OBJ-001 | Canal próprio de comunicação corporativa sob controle da FORD | RF-001 a RF-006; RF-009 a RF-018; RF-020 a RF-023; RNF-001 a RNF-005; RNF-007 a RNF-013 |
| OBJ-002 | Comunicação individual entre usuários ativos | RF-007; RF-008; RF-009; RF-019; RNF-001; RNF-006; RNF-007; RNF-009 |
| OBJ-003 | Comunicação em grupos administrados pelo TI | RF-005; RF-006; RF-010; RF-019; RNF-001; RNF-004; RNF-006; RNF-009 |
| OBJ-004 | Administração centralizada no TI | RF-002 a RF-006; RF-016; RF-020; RF-021; RF-022; RNF-001 a RNF-004; RNF-011 |
| OBJ-005 | Monitoramento, alertas e investigação | RF-011 a RF-016; RF-020 a RF-023; RNF-002; RNF-004; RNF-009; RNF-010; RNF-011; RNF-013 |
| OBJ-006 | Restrição de acesso por perfil e dispositivo | RF-002; RF-017; RF-018; RNF-001; RNF-005 |
| OBJ-007 | Experiência simples e identidade visual FORD | RF-007; RF-008; RF-015; RF-019; RF-023; RNF-005; RNF-006 |

### 4.2 Requisitos funcionais

Os identificadores RF-001 a RF-018 foram preservados da baseline anterior. RF-019 a RF-023 foram adicionados nesta revisão para representar requisitos explicitamente definidos no questionário atualizado.

| ID | Requisito | Estado |
|---|---|---|
| RF-001 | Autenticar por nome de usuário e senha | Confirmado |
| RF-002 | Aplicar permissões dos perfis Usuário e TI, com poderes iguais entre administradores TI | Confirmado |
| RF-003 | Criar e provisionar contas exclusivamente pelo TI | Confirmado |
| RF-004 | Desativar e reativar contas, com revogação imediata de sessões | Confirmado |
| RF-005 | Criar, encerrar, desativar e reativar grupos pelo TI | Confirmado |
| RF-006 | Incluir e remover participantes pelo TI, com revogação imediata de acesso | Confirmado |
| RF-007 | Exibir conversas recentes | Confirmado |
| RF-008 | Abrir, ler e consultar histórico paginado | Confirmado |
| RF-009 | Enviar mensagens individuais e sincronizar após reconexão | Confirmado |
| RF-010 | Enviar mensagens em grupos | Confirmado |
| RF-011 | Anexar, disponibilizar e baixar PDF/JPEG | Confirmado |
| RF-012 | Validar formatos, limites e condições dos anexos | Confirmado |
| RF-013 | Selecionar JPEG existente sem captura/gravação e remover metadados | Confirmado |
| RF-014 | Detectar mensagens suspeitas por regras | Confirmado |
| RF-015 | Gerar e administrar alertas de mensagens suspeitas | Confirmado |
| RF-016 | Consultar qualquer conversa pelo console TI | Confirmado |
| RF-017 | Restringir perfil Usuário a celular | Confirmado |
| RF-018 | Restringir perfil TI a computador | Confirmado |
| RF-019 | Registrar/exibir confirmação de leitura e mensagens não lidas | Confirmado |
| RF-020 | Permitir edição e exclusão administrativa de mensagens | Confirmado |
| RF-021 | Exportar conversas pelo console TI | Confirmado |
| RF-022 | Registrar, consultar e gerenciar auditoria administrativa | Confirmado |
| RF-023 | Exibir aviso de monitoramento no primeiro acesso | Confirmado |

A descrição detalhada e os critérios de aceitação estão em [03 — Requisitos funcionais](03-requisitos-funcionais.md).

### 4.3 Requisitos não funcionais

| ID | Categoria | Estado consolidado |
|---|---|---|
| RNF-001 | Segurança e controle de acesso por perfil | Confirmado; alinhamento técnico |
| RNF-002 | Proteção de dados, criptografia em trânsito/repouso e gestão de chaves | Confirmado; alinhamento técnico |
| RNF-003 | Proteção de credenciais e sessões | Confirmado; alinhamento técnico |
| RNF-004 | Auditabilidade, catálogo de eventos, acesso e retenção | Confirmado; alinhamento técnico |
| RNF-005 | Compatibilidade e restrição por dispositivo | Confirmado; homologação alinhada |
| RNF-006 | Usabilidade, idioma e identidade visual | Navegação e paleta provisória definidas; arquivo oficial do logotipo ainda pendente em Q-019 |
| RNF-007 | Desempenho | Metas alinhadas com Desenvolvimento |
| RNF-008 | Capacidade inicial e armazenamento | Limites alinhados com Desenvolvimento |
| RNF-009 | Disponibilidade, continuidade, backup, RPO/RTO | Confirmado/alinhado |
| RNF-010 | Segurança de anexos e antimalware | Confirmado/alinhado |
| RNF-011 | Monitoramento e tratamento de dados | Regras operacionais registradas; obrigações legais aplicáveis permanecem |
| RNF-012 | Acessibilidade | Não há requisito adicional informado pela FORD; obrigações aplicáveis permanecem |
| RNF-013 | Infraestrutura, soberania de dados e isolamento dos ambientes | Restrição FORD confirmada; arquitetura técnica a reconciliar |

A descrição completa está em [04 — Requisitos não funcionais](04-requisitos-nao-funcionais.md).

### 4.4 Regras de negócio

As regras RN-001 a RN-020 foram revisadas sem renumeração. Foram acrescentadas RN-021 a RN-025 para registrar retenção, infraestrutura, operação, homologação e tratamento de solicitações.

- RN-001 a RN-005: perfis, permissões, administração, provisionamento e credenciais.
- RN-006 a RN-010: conversas individuais, grupos, anexos, uso interno e experiência.
- RN-011 a RN-015: captura de mídia, monitoramento, alertas, consulta/exportação e dispositivos.
- RN-016 a RN-020: prioridades, integrações, público, identidade visual e referência comercial.
- RN-021 a RN-025: retenção/exclusão, infraestrutura, continuidade, homologação e monitoramento/solicitações.

A descrição completa está em [05 — Regras de negócio e restrições](05-regras-de-negocio-e-restricoes.md).

## 5. Arquitetura e implementação observadas

### 5.1 Requisitos de infraestrutura e compatibilidade da stack adotada

A FORD v2 estabelece que hospedagem e infraestrutura devem permanecer sob controle da FORD, preferencialmente no Brasil, e que nenhum serviço de terceiro pode acessar, armazenar ou processar dados da organização. Bibliotecas e atualizações sem acesso aos dados são permitidas.

Essa regra permanece um requisito do cliente e deve orientar a configuração e a operação do ambiente. A ADR-003 — Accepted mantém Supabase + Vercel como stack tecnológica adotada e obrigatória do Polychat. A Q-025 deve avaliar e documentar, com evidências, como o modelo de utilização e a configuração dessa stack atendem aos requisitos da FORD, incluindo controle de hospedagem, localização e fluxo dos dados, acesso de terceiros, armazenamento, processamento, isolamento dos ambientes, segredos, backup e responsabilidades. A existência da decisão Accepted não equivale à homologação de produção nem comprova, isoladamente, a conformidade de cada serviço ou fluxo de dados. A análise não altera nem substitui a decisão arquitetural por inferência; uma incompatibilidade concreta não mitigável deve ser encaminhada ao PO e aos responsáveis da FORD para decisão formal e avaliação de impacto.

A decisão de arquitetura deve separar:
- Tecnologia e framework de aplicação.
- Hospedagem e execução do frontend/backend.
- Banco de dados.
- Autenticação e gestão de sessões.
- Armazenamento de anexos.
- Antimalware e análise de conteúdo.
- Segredos e gestão de chaves.
- Monitoramento, auditoria, backup e recuperação.
- Ambientes de desenvolvimento, homologação e produção.

A avaliação deve considerar a fronteira de controle da FORD, a localização dos dados, os fluxos de acesso/armazenamento/processamento, suboperadores, isolamento dos ambientes, segredos, backup e responsabilidades. A Q-025 e as ADRs técnicas devem registrar a configuração adotada, os controles e as evidências; esta baseline não declara a conformidade operacional como concluída.

### 5.2 Fotografia técnica do repositório

Snapshot documental consultado na branch main em 19/11/2026:

- O repositório contém aplicação Next.js 16 com React 19, TypeScript e App Router, além de instruções e integração de deploy historicamente orientadas à Vercel.
- O README ainda descreve Vercel como destino de hospedagem/deploy e Supabase como backend planejado, declarando que a integração Supabase ainda não foi conectada.
- A interface principal é uma página institucional. Não foram encontradas telas completas de login, conversas, mensagens, grupos, anexos ou console administrativo.
- O módulo src/auth/authorization.mjs contém middleware Express-compatible que recebe um cliente Supabase server-side, valida token por supabase.auth.getUser(token), consulta profiles, aceita user e ti, bloqueia perfil ausente/desconhecido e conta inativa, e falha fechada.
- O middleware não está conectado a handlers/rotas reais do App Router.
- A migration supabase/migrations/202611160001_profiles_roles_and_account_status.sql cria public.profiles, habilita RLS, permite leitura do próprio perfil ou por TI ativo, revoga escrita direta de anon/authenticated, protege alterações de papel/status e cria perfil padrão user.
- A migration versionada não comprova aplicação ou homologação em ambiente hospedado.
- Não foram encontradas migrations/políticas RLS de domínio para conversas, participantes, mensagens, anexos ou auditoria.
- O arquivo .env.example contém placeholders públicos para URL e anon key; não há credenciais reais versionadas.
- O package.json consultado não incluía SDK Supabase nas dependências.
- O workflow CI executa testes automatizados, ESLint, TypeScript e build em atualizações da main e em Pull Requests direcionadas à main.

**Conclusão técnica do snapshot:** existe fundação parcial de frontend e autorização de perfis, mas não há arquitetura funcional ponta a ponta implementada. Supabase + Vercel permanece como stack adotada conforme ADR-003; ainda precisam ser concluídas integração funcional, configuração operacional, validação dos controles e evidências de compatibilidade com os requisitos da FORD na Q-025 e nas ADRs específicas. A adoção da stack não equivale à homologação de produção.

### 5.3 Limites da evidência técnica

- A existência de código, migration ou variável de exemplo não comprova integração com serviço hospedado.
- O middleware isolado e os testes simulados não comprovam autorização integrada às rotas reais do produto.
- A RLS existente cobre profiles; não comprova isolamento de conversas, memberships, mensagens, anexos ou auditoria.
- Build, lint e testes unitários não comprovam fluxos funcionais, homologação de infraestrutura ou atendimento às metas operacionais.
- A aplicação não deve ser considerada pronta para produção até que a arquitetura compatível com a FORD esteja formalizada, implementada e homologada.

## 6. Autorização e comportamento de erro

O contrato existente no módulo isolado de autorização e coberto por testes simulados é:

- Token ausente: HTTP 401; operação protegida não prossegue.
- Token inválido/expirado ou identidade não retornada pelo provedor: HTTP 401.
- Perfil ausente, papel diferente de user/ti ou conta inativa: HTTP 403.
- Falha ao consultar perfil ou exceção de infraestrutura: HTTP 503 genérico e falha fechada.
- Rota restrita a TI chamada por Usuário: HTTP 403, desde que a autenticação anteceda a verificação de papel.
- Identidade, papel e estado são obtidos de fonte confiável no servidor, não de body/query fornecidos pelo cliente.
- Respostas não devem revelar stack trace, tokens, chaves ou mensagens internas do banco.

**Limitação:** esses comportamentos foram observados em módulo isolado e testes com serviço simulado. Ainda não comprovam integração com o runtime definitivo escolhido para a infraestrutura FORD.

## 7. Testes e evidências

A suíte de autorização existente contém 11 testes com Supabase simulado: usuário ativo, ausência de token, sessão inválida, conta inativa, falha de consulta, papel desconhecido, acesso TI, bloqueio de Usuário em rota TI, perfil ausente, exceção do provedor e rota TI sem autenticação.

Comandos locais disponíveis no projeto:
- npm test
- npm run lint
- npm run typecheck
- npm run build

O workflow GitHub Actions executa essas etapas. A execução consultada para a main em 17/11/2026 concluiu com sucesso: [GitHub Actions run #44115773963](https://github.com/Aluvioz/Polychat/actions/runs/44115773963).

Essas evidências não comprovam integração com infraestrutura FORD, aplicação de migrations em ambiente homologado, RLS de domínio, autenticação pela interface, mensageria realtime, storage, antimalware, auditoria funcional ou homologação dos critérios completos.

## 8. Questões e decisões restantes

As questões históricas Q-001 a Q-024 foram preservadas e atualizadas em [08 — Glossário e questões em aberto](08-glossario-e-questoes-em-aberto.md). Permanecem abertas somente:

- Q-018 — Resolvida pelo PO em 20/11/2026; arquitetura da informação e catálogo de telas registrados em `docs/ux/decisoes-produto-q018-q019.md`.
- Q-019 — Paleta cromática provisória definida pelo PO em 20/11/2026; permanece pendente somente a confirmação/entrega do arquivo oficial autorizado do Ford Oval e eventuais regras específicas de aplicação.
- Q-025 — Avaliação da compatibilidade da configuração e do modelo de uso da stack Supabase + Vercel, adotada na ADR-003 — Accepted, com os requisitos da FORD sobre controle de hospedagem, armazenamento, processamento, localização, acesso e operação; registrar controles, responsabilidades, evidências, limitações e riscos residuais, sem substituir a stack por inferência.

Os oito grupos de requisitos alinhados com Desenvolvimento não são pendências. A confiança nos administradores TI e os riscos do modelo administrativo também não são pendências.

## 9. Registro de mudanças e impactos

| Alteração | Fonte/motivo | Impacto em requisitos | Impacto em implementação/testes |
|---|---|---|---|
| Baseline atualizada para v0.4 | Questionário FORD v2 e alinhamentos complementares do PO em 19/11/2026 | Atualiza a fonte de verdade de produto | Demais documentos e ADRs devem ser alinhados |
| Público inicial esclarecido | FORD v2 | 25 usuários finais mais 2 a 3 administradores TI | Provisionamento e testes devem considerar o público correto |
| Igualdade de poderes do TI | FORD v2 e avaliação do responsável do projeto | Consolida RN-003 e RF-002 | Matriz de autorização deve refletir poderes equivalentes |
| Credenciais e contas atualizadas | FORD v2 | Atualiza RF-001, RF-003 e RF-004 | Fluxos de provisionamento, alteração de identificador, recuperação e revogação |
| Grupos e participantes | FORD v2 | Atualiza RF-005 e RF-006 | Testes de encerramento, reativação, remoção e revogação |
| Mensagens e leitura | FORD v2 | Atualiza RF-009, RF-010 e cria RF-019/RF-020 | Implementar leitura, edição/exclusão administrativa e sincronização |
| Exportação e aviso | FORD v2 | Cria RF-021 e RF-023 | Implementar exportação auditada e aviso no primeiro acesso |
| Auditoria ampliada | FORD v2 | Atualiza RF-022 e RNF-004 | Auditar também exportação e edição/exclusão administrativa |
| Anexos e antimalware | FORD v2 e alinhamento com Desenvolvimento | Atualiza RF-011 a RF-013 e RNF-010 | Limites, scanner local, liberação TI, links e metadados |
| Monitoramento e severidades | FORD v2 e alinhamento com Desenvolvimento | Atualiza RF-014/RF-015 | Lista de regras, fila, prazos e fluxo TI |
| Retenção e continuidade | FORD v2 e alinhamento com Desenvolvimento | Atualiza RN-021/RN-023 e RNF-009 | Backups, exclusão, expiração de cópias e evidências |
| Infraestrutura FORD | FORD v2 | Atualiza RN-022 e RNF-013 | Documentar a configuração e as evidências de compatibilidade da stack Supabase + Vercel adotada, conforme ADR-003/Q-025, sem substituição por inferência |
| Direção tecnológica reafirmada | ADR-003 revisada em 24/11/2026 | Supabase + Vercel permanece como stack adotada | Q-025 documenta a compatibilidade operacional e as evidências; não substitui a stack por inferência |
| Questões em aberto | Respostas do questionário e alinhamento do PO | Q-001 a Q-024 reclassificadas; Q-025 criado | Mantém somente refinamento de UX, insumos de marca e avaliação técnica de compatibilidade/configuração da stack adotada |

## 10. Referências e documentos relacionados

- [00 — Controle do documento](00-controle-do-documento.md)
- [01 — Visão geral e escopo](01-visao-geral-e-escopo.md)
- [02 — Objetivos do produto](02-objetivos.md)
- [03 — Requisitos funcionais](03-requisitos-funcionais.md)
- [04 — Requisitos não funcionais](04-requisitos-nao-funcionais.md)
- [05 — Regras de negócio e restrições](05-regras-de-negocio-e-restricoes.md)
- [07 — Rastreabilidade e critérios de aceitação](07-rastreabilidade-e-criterios-de-aceitacao.md)
- [08 — Glossário e questões em aberto](08-glossario-e-questoes-em-aberto.md)
- [Índice de ADRs](adr/README.md)
- [Matriz de autorização e RLS](issue-100-matriz-autorizacao.md)
- [Modelo de dados](database/modelo-de-dados.md)
- [Política de anexos e antimalware](storage/politica-anexos-e-antimalware.md)
