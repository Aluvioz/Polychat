# 09 — Baseline consolidada de requisitos e escopo MVP

**Issue de origem:** #88 — Consolidar baseline de requisitos e escopo MVP  
**Identificador:** POLY-REQ-001  
**Versão:** 0.5 — 20/11/2026  
**Fonte primária:** Questionário de Esclarecimento de Requisitos da FORD, versão atualizada (FORD v2), recebido em 19/11/2026.  
**Fontes complementares:** alinhamentos do PO com Desenvolvimento, premissas consolidadas nos documentos 00 a 08 e decisões de negócio registradas pelo representante da FORD.  
**Estado:** baseline de produto atualizada com arquitetura da informação por perfil e paleta visual provisória Ford; ativos oficiais de logotipo permanecem pendentes em Q-019. A compatibilidade da stack Supabase + Vercel foi aprovada pela TI e pela FORD na Q-025, concluída em 24/11/2026.

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
- Anexos exclusivamente JPEG e PDF, com até 10 MiB (10.485.760 bytes) por arquivo e até 5 arquivos por mensagem, conforme retificação funcional do PO em 26/11/2026.
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
- Hospedagem e infraestrutura sob controle operacional aprovado pela FORD, preferencialmente no Brasil. Supabase e Vercel são provedores nomeados e expressamente aprovados na Q-025; outros terceiros não podem acessar, armazenar ou processar dados da organização sem aprovação específica.

### 2.2 Fora do escopo inicial

- Expansão para setores operacional e estratégico ou para todos os aproximadamente 900 funcionários da FORD.
- Uso por fornecedores, parceiros, prestadores ou público externo.
- Cadastro aberto, autoinscrição, convite ou criação de contas por Usuários comuns.
- Aplicativos nativos instaláveis Android/iOS ou desktop; o produto contratado é uma aplicação web.
- Chamadas de voz/vídeo, mensagens de áudio, gravação de áudio/vídeo e captura de fotos pela aplicação.
- Compartilhamento de formatos diferentes de PDF e JPEG.
- Notificações push e notificações do navegador.
- Integrações com outros aplicativos ou serviços externos de comunicação.
- Serviços externos adicionais, além dos provedores nomeados Supabase e Vercel e dos usos expressamente aprovados na Q-025, que acessem, armazenem ou processem dados da FORD sem aprovação específica.

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
| D-014 | Anexos PDF/JPEG; 10 MiB (10.485.760 bytes) por arquivo; até 5 por mensagem; quotas individual e total administradas pelo TI. | Confirmado/alinhado; limite retificado pelo PO em 26/11/2026 | RN-008; RF-011; RF-012; RNF-010 |
| D-015 | Scanner antimalware na infraestrutura FORD; falha/inconclusão mantém anexo bloqueado; TI pode liberar arquivo. | Confirmado | RN-008; RF-011; RF-012; RNF-010 |
| D-016 | Sem captura de foto ou gravação; JPEG selecionado da galeria; remoção de metadados GPS. | Confirmado | RN-011; RF-013 |
| D-017 | Detecção por regras/lista de termos do TI, incluindo palavrões; sem análise contextual ou IA de terceiros. | Confirmado/alinhado | RN-012; RF-014 |
| D-018 | Alertas baixa/média/alta; prazos alta até 1h, média 1 dia útil, baixa 3 dias úteis; TI analisa e encerra sem justificativa. | Confirmado/alinhado | RN-013; RF-015 |
| D-019 | Aviso de monitoramento no primeiro acesso. | Confirmado | RN-025; RF-023 |
| D-020 | Criptografia em trânsito e em repouso; sem E2EE; chaves administradas pelo servidor sob responsabilidade do TI. | Confirmado/alinhado | RN-016; RNF-002 |
| D-021 | Retenção sem exclusão automática enquanto o sistema operar; TI autoriza exclusões e preservação em investigação; backups por 12 meses com descarte registrado. | Alinhado com Desenvolvimento | RN-021; RNF-004; RNF-009 |
| D-022 | Infraestrutura e dados sob controle operacional aprovado pela FORD; Supabase e Vercel são provedores nomeados aprovados na Q-025; outros terceiros dependem de aprovação específica. | Confirmado e aprovado | RN-022; RNF-013; Q-025 |
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
| RNF-013 | Infraestrutura, soberania de dados e isolamento dos ambientes | Requisitos confirmados; modelo Supabase + Vercel aprovado na Q-025 em 24/11/2026 |

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

A FORD v2 estabelece requisitos de controle de hospedagem, armazenamento e processamento, com preferência por localização no Brasil. A Q-025 formalizou a aprovação de Supabase e Vercel como provedores nomeados da stack do Polychat. Outros serviços de terceiros não estão autorizados a acessar, armazenar ou processar dados sem aprovação específica. Bibliotecas e atualizações sem acesso aos dados permanecem permitidas.

A ADR-003 — Accepted mantém Supabase + Vercel como stack tecnológica adotada e obrigatória do Polychat. Em 24/11/2026, a TI e a FORD aprovaram na Q-025 o modelo de utilização e a compatibilidade operacional da stack, incluindo hospedagem/execução, localização e fluxo dos dados, acesso de terceiros, armazenamento, processamento, isolamento dos ambientes, segredos, backup e responsabilidades. Supabase e Vercel ficam aprovados como provedores nomeados; qualquer outro fornecedor depende de aprovação específica. A aprovação da arquitetura não substitui a execução dos controles e testes das issues de implementação nem o Go/No-Go de cada release.

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

A compatibilidade e o modelo de uso foram aprovados na Q-025. A operação permanece sujeita aos controles e responsabilidades registrados nas ADRs 003, 005, 008 e 009. A aprovação não declara que todos os fluxos funcionais, policies RLS, buckets, scanner, backups/restauração ou testes estejam implementados; essas entregas permanecem nas issues correspondentes.

### 5.2 Fotografia técnica do repositório

Snapshot técnico reconciliado com a `main`, considerando as integrações das PRs #170, #172, #173, #174, #175, #181 e #185, a reconciliação do histórico de migrations da #180 e as verificações registradas em 26/11/2026:

- O repositório contém aplicação Next.js 16, React 19, TypeScript e App Router. Existem endpoints de login, logout e validação de sessão, com cookies HttpOnly e verificação do perfil atual no Supabase Auth.
- O helper `src/auth/supabase-session.mjs` consulta o perfil, aceita somente `user` e `ti`, bloqueia perfil inativo/ausente e tenta revogar a sessão. A PR #174 alinhou as chaves publishable/secret às variáveis presentes na Vercel; a chave secreta permanece server-side. A PR #175 integrou o adaptador `authorizeNextRequest` ao App Router e à rota `GET /api/auth/session`. Os testes do adaptador são automatizados, mas usam dependências simuladas; não houve login positivo com usuário real no Polyford nem comprovação de autorização uniforme em todos os handlers de negócio.
- As migrations da #99 criam `profiles.username`, `conversations`, `memberships`, `messages`, `attachments`, `message_reads`, `security_alerts` e estruturas de configuração. Incluem FKs, índices, limite técnico de 10 MiB por anexo e máximo de cinco anexos por mensagem. A reconciliação do histórico da #180 e o workflow de instalação limpa verificaram a aplicação das 18 migrations em PostgreSQL local descartável; isso não substitui a validação dos fluxos de negócio em ambiente homologado.
- A PR #172 implementou e integrou policies RLS para domínio/configuração e hardening de grants. O teste `supabase/tests/issue_101_rls.integration.sql` passou em 16/16 cenários no Polyford; o teste de criação de conversa direta também passou, com rollback de dados/identidades sintéticos. O isolamento está comprovado para os cenários executados em desenvolvimento, não como homologação de produção nem como cobertura de todos os handlers.
- A PR #173 implementou e integrou `audit_events`, `retention_holds`, controles append-only e descarte de eventos com hold, além de triggers para auditar edição/exclusão lógica administrativa de mensagens e fechamento de alertas. Testes de integração em transações revertidas registraram sucesso. Não comprova retenção de mensagens/anexos, backup/restore ou callsites para todas as operações.
- A PR #170 implementou `privileged_action_audit`, catálogo, writer server-side e pesquisa restrita a TI ativo. A verificação de ACL e sanitização foi registrada; não havia perfil TI ativo no ambiente para comprovar uma gravação positiva com ator real. Os handlers/callsites de contas, grupos e consultas sensíveis ainda não estão integrados. A Issue #124 permanece aberta.
- **Storage privado — PR #181:** foi provisionado o bucket `attachments` no Supabase Storage com `public=false`, limite por objeto de 10.485.760 bytes (10 MiB) e MIME permitido para PDF/JPEG. A verificação no Polyford confirmou ausência de policies de acesso direto em `storage.objects`; havia zero objetos no bucket. O teste SQL do bucket concluiu sem exceção. Essa entrega comprova a configuração privada, não upload ou download funcional.
- **Upload parcial — PR #185:** foi integrado o endpoint server-side `POST /api/attachments/upload`. A rota valida sessão pelos cookies HTTP-only, consulta a mensagem com o JWT do usuário e permite o envio somente ao remetente. Valida extensão, MIME declarado e assinatura binária PDF/JPEG, aplica 10 MiB, grava metadados sob RLS e tenta remover o objeto caso o registro do metadado falhe. Há testes unitários de validação; não houve upload/download real de arquivo no Polyford. A validação de assinatura não é parser estrutural completo nem análise antimalware, e a rota não implementa download nem emite URL pública/temporária.
- As quotas `attachment_user_quotas` e `attachment_storage_capacity` continuam sem valores semeados nem enforcement integrado de consumo por usuário/capacidade global.
- Scanner antimalware interno, quarentena, validação estrutural profunda, rejeição de PDF protegido por senha, remoção de EXIF/GPS, download autorizado, links temporários/revogação, fluxo transacional completo de mensagem/anexo e backup/restauração de objetos permanecem pendentes nas issues correspondentes.
- A retificação funcional do PO em 26/11/2026, registrada no POLY-STO-001 v0.3, seção 16.2, esclareceu o limite em **10 MiB (10.485.760 bytes)** por arquivo, com até cinco anexos por mensagem. A expressão histórica “10 MB” da baseline v0.5 não deve ser interpretada como 10.000.000 bytes. Bucket #181 e endpoint #185 aplicam o limite esclarecido de 10 MiB; permanecem pendentes os testes de fronteira e a comprovação do fluxo real, não uma decisão de produto sobre a unidade.
- Os fluxos completos de conversas, grupos, mensagens, anexos e console administrativo ainda não estão integrados ponta a ponta. A presença dos módulos de autenticação, auditoria, bucket e endpoint parcial de upload não comprova que todos os eventos estejam sendo emitidos por operações reais nem que a jornada de anexos esteja concluída.
- Evidências: `docs/security/issue-101-rls-evidence.md`, `docs/security/issue-102-audit-retention-evidence.md`, `docs/issue-124-auditoria-privilegiada.md`, `docs/infra/polyford-integration-validation-2026-11-26.md`, `docs/infra/polyford-backup-restore-assessment-2026-11-26.md`, `docs/storage/issue-115-private-storage-evidence.md` e `docs/storage/issue-115-upload-implementation.md`. CI/Preview positivos não substituem testes integrados restantes, verificações SEC/DOC ou homologação de produção.

**Conclusão técnica do snapshot:** a `main` contém autenticação/sessões em nível de endpoints, adaptador de autorização na rota de sessão, RLS de domínio testada em desenvolvimento, auditoria/retenção de eventos, infraestrutura de auditoria privilegiada, bucket privado no Supabase Storage e endpoint parcial de upload server-side. Permanecem pendentes a integração uniforme dos handlers de negócio, callsites de auditoria, fluxo completo de anexos (incluindo download, scanner e quotas), backup/restore e homologação ponta a ponta.

### 5.3 Limites da evidência técnica

- A existência de código, migration ou variável de exemplo não comprova integração de todos os fluxos com serviço hospedado.
- Os testes unitários de autenticação usam dependências simuladas; não houve login positivo com usuário real no projeto Supabase consultado.
- Os testes da #101 comprovam policies RLS nos cenários executados no Polyford; não substituem testes em todos os handlers reais, em ambiente homologado ou em produção.
- As verificações da #102 comprovam controles de auditoria/holds no escopo dos testes executados, não backup/restore, retenção física de mensagens/anexos ou instrumentação de todas as operações.
- Os testes da #124 não comprovam gravação positiva com ator TI real nem integração de callsites de negócio.
- A verificação da #181 comprova bucket privado e configuração do Storage, mas o bucket estava sem objetos; os testes unitários da #185 comprovam apenas os casos de validação de entrada. Não houve upload/download real no Polyford, análise antimalware nem homologação do fluxo de anexos.
- Build, lint, testes unitários e checks de CI não comprovam fluxos funcionais completos, homologação de infraestrutura ou atendimento às metas operacionais.
- A aplicação não deve ser considerada pronta para produção até que os fluxos e controles aplicáveis estejam integrados, testados e homologados.


## 6. Autorização e comportamento de erro

Os endpoints de login, logout e sessão usam Supabase Auth e o perfil atual para validar a identidade e o estado da conta. A rota de sessão rejeita perfil ausente/inativo e tenta revogar a sessão; falhas de configuração/provedor retornam erro genérico e falham fechadas. A chave secreta é utilizada exclusivamente server-side.

- Credenciais ausentes/inválidas: resposta genérica de autenticação; não revela se o usuário existe.
- Sessão ausente/inválida/expirada: HTTP 401 e limpeza dos cookies locais.
- Perfil ausente, papel diferente de `user`/`ti` ou conta inativa: sessão rejeitada; a rotina tenta revogar a sessão no provedor.
- Falha de configuração/provedor: HTTP 503 genérico e falha fechada.
- Cookies: HttpOnly, SameSite=Lax e Secure em produção.
- Identidade, papel e estado são obtidos no servidor; não aceitar esses valores de body/query/UI.
- Testes do helper são unitários com Supabase simulado; a configuração Vercel foi conferida sem leitura de valores secretos. O projeto consultado não possuía usuário/perfil real para login positivo.

**Limitação:** os endpoints de autenticação existem, mas não comprovam autorização uniforme de todos os handlers de negócio, integração completa do chat nem homologação de produção.
## 7. Testes e evidências

As evidências automatizadas e de desenvolvimento atualmente registradas incluem:
- Testes unitários de autenticação/sessão com Supabase simulado, incluindo perfil ativo/inativo, token inválido, refresh, logout, revogação e falha fechada.
- Teste SQL da #101 com 16/16 cenários RLS aprovados em Polyford e teste adicional de criação de conversa direta; dados e identidades sintéticas foram revertidos.
- Testes SQL da #102 para auditoria, holds e descarte controlado de eventos, em transações revertidas.
- Testes unitários e verificações de ACL/sanitização da infraestrutura de auditoria privilegiada da #124.
- Teste SQL da #115 para configuração do bucket privado, sem exceção, e testes unitários da #185 para validação de extensão/MIME/assinatura e rejeição de arquivos inválidos; não houve upload/download real no Polyford.
- Workflows GitHub Actions associados às PRs #170, #172, #173 e #174 concluíram com sucesso, conforme os respectivos registros.

Comandos locais disponíveis no projeto:
- npm test
- npm run lint
- npm run typecheck
- npm run build

Essas evidências comprovam apenas os escopos e ambientes indicados. Não comprovam login positivo com usuário real, todos os handlers de negócio, Storage/scanner, backup/restore, realtime, homologação de produção ou cobertura integral dos critérios de aceite.
## 8. Questões e decisões restantes

As questões históricas Q-001 a Q-024 foram preservadas e atualizadas em [08 — Glossário e questões em aberto](08-glossario-e-questoes-em-aberto.md). Permanecem abertas somente:

- Q-018 — Resolvida pelo PO em 20/11/2026; arquitetura da informação e catálogo de telas registrados em `docs/ux/decisoes-produto-q018-q019.md`.
- Q-019 — Paleta cromática provisória definida pelo PO em 20/11/2026; permanece pendente somente a confirmação/entrega do arquivo oficial autorizado do Ford Oval e eventuais regras específicas de aplicação.
- Q-025 — Concluída em 24/11/2026: compatibilidade da stack Supabase + Vercel aprovada pela TI e pela FORD, com provedores nomeados, controles, responsabilidades e limites de utilização registrados; sem substituição da stack por inferência.

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
| Infraestrutura FORD | FORD v2 / Q-025 | Atualiza RN-022 e RNF-013 | Compatibilidade e modelo de uso Supabase + Vercel aprovados pela TI e pela FORD em 24/11/2026 |
| Direção tecnológica reafirmada | ADR-003 revisada em 24/11/2026 | Supabase + Vercel permanece como stack adotada e aprovada | Q-025 concluída; provedores nomeados e modelo de utilização aprovados |
| Questões em aberto | Respostas do questionário e alinhamento do PO | Q-001 a Q-024 reclassificadas; Q-025 concluída | Permanece Q-019 para obtenção de ativos oficiais de marca; Q-025 não é mais pendência |

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
