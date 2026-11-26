# 09 — Baseline consolidada de requisitos e escopo MVP

**Issue de origem:** #88 — Consolidar baseline de requisitos e escopo MVP  
**Identificador:** POLY-REQ-001  
**Versão:** 0.5 — 20/11/2026 (baseline funcional; revisão documental de consistência em 26/11/2026)  
**Fonte primária:** Questionário de Esclarecimento de Requisitos da FORD, versão atualizada (FORD v2), recebido em 19/11/2026.  
**Fontes complementares:** alinhamentos do PO com Desenvolvimento, premissas consolidadas nos documentos 00 a 08 e decisões de negócio registradas pelo representante da FORD.  
**Estado:** baseline de produto v0.5, mantida sem alteração dos requisitos funcionais. Q-018 está resolvida; Q-019 mantém pendência apenas dos ativos oficiais de marca; Q-025 foi concluída em 24/11/2026 com aprovação da TI e da FORD para a compatibilidade e o modelo de utilização dos provedores nomeados Supabase + Vercel, inclusive Storage, dentro dos limites e responsabilidades registrados. A implementação do produto permanece parcial e não equivale a homologação ou autorização de release.

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
4. A Issue #88 e as ADRs elaboradas antes do alinhamento permanecem como registros históricos/técnicos. A decisão vigente está registrada na ADR-003 — Accepted e na conclusão da Q-025 em 24/11/2026, que aprovou a compatibilidade e o modelo de utilização dos provedores nomeados Supabase + Vercel, inclusive Storage, dentro dos limites e responsabilidades documentados.
5. A aprovação da Q-025 não autoriza automaticamente provedores ou serviços adicionais, nem comprova implementação funcional, execução de controles por componente, continuidade, homologação de produção ou release. Não se presume que uma tecnologia esteja homologada apenas por estar presente no código.

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
| RNF-013 | Infraestrutura, soberania de dados e isolamento dos ambientes | Restrição FORD confirmada; compatibilidade/modelo de utilização dos provedores nomeados Supabase + Vercel aprovados na Q-025 dentro dos limites registrados; segregação, controles e operação por ambiente ainda exigem evidências próprias |

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

### 5.1 Restrição de infraestrutura e decisão arquitetural vigente

A FORD v2 estabelece que hospedagem e infraestrutura devem permanecer sob controle da FORD, preferencialmente no Brasil, e que nenhum serviço de terceiro pode acessar, armazenar ou processar dados da organização. Bibliotecas e atualizações sem acesso aos dados são permitidas. Essa restrição permanece como requisito do cliente e não foi revogada.

A decisão arquitetural vigente está registrada na **ADR-003 — Accepted**: Supabase + Vercel permanece como stack tecnológica adotada e obrigatória do Polychat. A **Q-025 foi concluída em 24/11/2026**, com aprovação da TI e da FORD para a compatibilidade e o modelo de utilização dos provedores nomeados, inclusive Storage, dentro dos limites e responsabilidades registrados na decisão e na Issue #130.

A conclusão da Q-025 resolve a avaliação de compatibilidade e do modelo de utilização no escopo aprovado. Não equivale a autorização genérica para incluir outros provedores ou serviços, nem comprova que cada módulo esteja integrado, que todos os controles estejam implementados, que a continuidade esteja operacional ou que o produto esteja homologado para produção.

A aplicação da decisão exige manter rastreabilidade e segregação das seguintes responsabilidades:
- Tecnologia e framework de aplicação.
- Hospedagem e execução do frontend/backend.
- Banco de dados.
- Autenticação e gestão de sessões.
- Armazenamento e disponibilização de anexos.
- Antimalware e análise de conteúdo.
- Segredos e gestão de chaves.
- Monitoramento, auditoria, backup e recuperação.
- Ambientes de desenvolvimento, homologação/Preview e produção.

Qualquer ampliação do modelo de utilização aprovado, inclusão de serviço adicional com acesso a dados ou evidência concreta de incompatibilidade deve ser submetida à governança e às responsabilidades competentes da FORD, com avaliação de impacto e decisão formal. A Q-025 não deve permanecer classificada como questão aberta nem ser reaberta por inferência.

### 5.2 Fotografia técnica do repositório

Snapshot documental consultado na branch `main` em **26/11/2026**. A fotografia registra implementação parcial por componentes; não declara que o MVP esteja funcional ponta a ponta.

- **Frontend e hospedagem:** o repositório utiliza Next.js 16, React 19, TypeScript e App Router, com Vercel como plataforma oficial de hospedagem/deploy conforme ADR-002 e ADR-003. A existência da aplicação e da infraestrutura não comprova que todas as telas e jornadas do MVP estejam concluídas.
- **Autenticação e sessão — PR #175 / Issue #105:** estão integrados o serviço de sessão Supabase Auth, login por nome de usuário, validação/renovação de sessão e logout, com rotas Next.js e cookies HTTP-only. O adaptador de autorização Next.js está integrado à rota de consulta de sessão. Os fluxos administrativos completos de criação/alteração de contas e recuperação de credenciais pelo TI permanecem pendentes.
- **Modelo de dados — PR #165 / Issue #99:** migrations versionadas contemplam `profiles`, `conversations`, `memberships`, `messages`, `attachments`, `message_reads`, `security_alerts` e tabelas de configuração, com constraints, relações e índices. A aplicação/inspeção registrada no Polyford refere-se ao ambiente de desenvolvimento, não à homologação de produção.
- **Reconciliação de migrations — PR #180:** os identificadores locais foram alinhados ao histórico remoto. A instalação limpa de 18 migrations foi executada em PostgreSQL local descartável. Não foram executados `migration repair`, `db reset` ou `db push` no projeto remoto; esse teste demonstra reprodutibilidade local, não restauração nem homologação de produção.
- **Autorização e RLS — PR #172 / Issue #101:** foram integradas policies de domínio para conversas, memberships, mensagens, metadados de anexos, leituras, alertas e tabelas de configuração. A evidência da PR registra 16/16 cenários SQL e um teste separado de criação de conversa direta, em transações revertidas. A cobertura RLS não substitui autorização dos objetos do Storage nem dos canais Realtime.
- **Ressalva de credenciais privilegiadas:** a revisão do Tech Lead na PR #172 registrou que o SQA não conseguiu certificar, no escopo daquela PR, a ausência de `service_role` no frontend. Essa verificação de segurança permanece pendente e não deve ser considerada resolvida apenas pelo merge.
- **Auditoria genérica — PR #173 / Issue #102:** foram integrados `audit_events`, controles append-only, `retention_holds`, descarte controlado e writer. Permanecem sem call sites validados eventos de visualização/exportação de conversas, download/liberação de anexos e alterações de configuração.
- **Auditoria privilegiada — PR #170 / Issue #124:** foram integrados `privileged_action_audit`, catálogo, writer e pesquisa server-side. A Issue #124 permanece aberta porque a instrumentação dos handlers reais e a integração dos eventos ainda precisam ser concluídas.
- **Storage e upload — PRs #181 e #185 / Issue #115:** a PR #181 provisionou o bucket `attachments` como privado, com allowlist MIME PDF/JPEG e limite técnico de 10 MiB; a verificação registrada não encontrou policies de acesso direto em `storage.objects`. A PR #185 integrou `POST /api/attachments/upload`, validação de sessão, verificação da mensagem/remetente, upload server-side, validação de extensão/MIME/assinatura binária e gravação de metadados, com remoção do objeto caso o registro falhe. Foram adicionados 10 casos unitários de validação.
- **Limites ainda ausentes de anexos:** a implementação de upload não entrega download autorizado/URL temporária, scanner antimalware, quarentena/liberação, quotas aplicadas, rejeição de PDF protegido por senha, remoção EXIF/GPS, revogação imediata após remoção de membership ou backup/restore de objetos. As Issues #115, #116 e #117 permanecem abertas para os critérios remanescentes.
- **Interpretação do limite de anexos:** a baseline mantém, sem alteração, a expressão original **10 MB** por arquivo. A retificação do PO de 26/11/2026, registrada em `POLY-DATA-001 v0.5`, seção 11.2 (PR #160), esclarece que, no contexto do Polychat, essa expressão corresponde a **10 MiB (10.485.760 bytes)** por arquivo, até cinco por mensagem. A constraint do banco, o bucket privado e o endpoint inicial das PRs #181/#185 estão alinhados a esse valor, confirmado por inspeção somente de leitura no Polyford em 26/11/2026. A decisão sobre a unidade está resolvida; a conclusão do ciclo de anexos e a homologação ponta a ponta permanecem pendentes.
- **Mensageria/Realtime:** não há evidência de canais/subscriptions Supabase Realtime, modalidade de transporte aprovada, autorização de canais ou revogação de assinaturas ativas. Schema e RLS de domínio já existem, mas não constituem implementação de Realtime. As Issues #109, #110, #113 e #114 permanecem abertas.
- **Segurança e monitoramento:** as regras de produto de detecção, severidade e tratamento de alertas estão definidas; a implementação de detecção/fila e a integração de eventos aos handlers permanecem pendentes nas Issues #122 e #123 e na ADR-010.
- **Ambientes e deploy:** os escopos das Issues #96 e #98 foram encerrados e seus aceites devem ser preservados nos limites originais. Esses aceites não representam homologação integral, comprovação de continuidade ou autorização de lançamento.
- **CI:** há workflow GitHub Actions para testes, ESLint, TypeScript e build. A existência do workflow não comprova branch protection, required checks nem homologação de produção.

**Conclusão técnica do snapshot:** a stack Supabase + Vercel está adotada e seu modelo de utilização foi aprovado na Q-025 dentro dos limites registrados. O repositório contém implementação parcial integrada de sessão/autorização, schema, RLS, auditoria e Storage/upload. Realtime, integração ponta a ponta, fluxos completos de anexos, detecção/fila de alertas, cobertura integral de auditoria e validação operacional ainda não estão concluídos.

### 5.3 Limites da evidência técnica

- A existência de código, migration, workflow, configuração ou variável de exemplo não comprova, isoladamente, integração ponta a ponta nem homologação de produção.
- A aprovação da Q-025 comprova a compatibilidade e o modelo de utilização dos provedores nomeados no escopo e nos limites registrados; não substitui testes, integração, verificação de controles por componente ou evidências de operação.
- Os testes SQL de RLS comprovam os cenários executados no ambiente descrito, mas não demonstram proteção automática de handlers que não invoquem a autorização nem autorização de objetos Storage ou canais Realtime.
- Os testes unitários de validação de anexos não equivalem a parser completo de PDF/JPEG, scanner antimalware, teste de download ou validação de todo o ciclo de anexos.
- A instalação limpa de migrations em PostgreSQL local descartável comprova a sequência local testada, não a restauração de backup, a integridade de produção ou homologação de ambiente.
- As entregas de auditoria comprovam estruturas e writers nos escopos implementados; não comprovam cobertura de todos os eventos e handlers administrativos.
- A unidade da expressão original “10 MB” foi esclarecida pelo PO como **10 MiB (10.485.760 bytes)** em `POLY-DATA-001 v0.5`, seção 11.2 (PR #160). A constraint do banco, o bucket e o endpoint inicial estão alinhados ao valor retificado; isso não comprova, por si só, a conclusão ou homologação ponta a ponta do ciclo de anexos.
- A existência de workflow de CI não comprova branch protection, required checks ou aprovação de release.
- A aplicação não deve ser considerada pronta para produção até que os fluxos da baseline estejam implementados, testados, revisados e homologados, com evidências de continuidade e Go/No-Go.

## 6. Autorização e comportamento de erro

O contrato de autorização utiliza validação server-side combinada com RLS no PostgreSQL/Supabase Database. Os papéis válidos são `user` e `ti`; identidade, papel e estado da conta devem ser obtidos de fonte confiável, nunca de body, query, filtros ou metadados fornecidos pelo cliente.

### Contrato funcional

- Token ausente, inválido ou expirado: a requisição protegida não prossegue e retorna falha de autenticação.
- Perfil ausente, papel diferente de `user`/`ti` ou conta inativa: a requisição não recebe autorização.
- Falha ao consultar perfil, validar sessão ou consultar dependência necessária: falha fechada, sem concessão de acesso.
- Rota restrita a TI chamada por Usuário: negar acesso.
- Respostas não devem revelar stack trace, tokens, chaves ou mensagens internas do banco.
- Toda rota ou handler protegido deve invocar o adaptador/middleware de autorização adequado antes de executar a operação.

### Implementação e cobertura observadas

- `src/auth/supabase-session.mjs` implementa login por username, validação de access token, refresh, reconsulta de perfil/estado, revogação e logout.
- As rotas `POST /api/auth/login`, `GET /api/auth/session` e `POST /api/auth/logout` integram os fluxos de autenticação no Next.js App Router.
- `src/auth/authorization.mjs` mantém funções de autenticação/autorização server-side; `src/auth/next-authorization.mjs` integra o adaptador ao App Router.
- As policies RLS de domínio integradas pela PR #172 cobrem conversas, memberships, mensagens, metadados de anexos, leituras, alertas e tabelas de configuração.
- A evidência da PR #172 registra 16/16 cenários SQL aprovados no Polyford e um teste separado de criação de conversa direta, com transações revertidas.
- A PR #175 integrou o adaptador à rota `GET /api/auth/session`; seus registros reportam testes unitários e verificações de lint, TypeScript, build e smoke test aprovados no head revisado.

### Limites conhecidos

- Os mecanismos disponíveis não protegem automaticamente handlers que não os invoquem.
- O aceite de RLS não cobre objetos do Storage, autorização de download ou canais Realtime.
- A revogação de membership precisa ser aplicada nos handlers e nos fluxos persistentes/Realtime correspondentes.
- A revisão do Tech Lead na PR #172 registrou que o SQA não conseguiu certificar, no escopo daquela PR, a ausência de `service_role` no frontend. Essa verificação permanece necessária até haver evidência conclusiva.
- A integração de sessão não significa que o ciclo administrativo completo de criação, alteração e recuperação de contas esteja concluído.

## 7. Testes e evidências

As evidências abaixo distinguem teste especificado, teste executado e escopo efetivamente comprovado. Nenhum resultado isolado equivale à homologação completa do MVP.

- **Sessão e autorização Next.js — PR #175 / Issue #105:** foram adicionados testes para sessão válida/inválida, restrição de TI, perfil TI, falha fechada e papéis desconhecidos. A PR registra 55 testes, ESLint, TypeScript, build e smoke test aprovados no head revisado.
- **RLS de domínio — PR #172 / Issue #101:** `supabase/tests/issue_101_rls.integration.sql` registrou 16/16 cenários aprovados no Polyford, usando identidades/dados sintéticos e transações revertidas. O teste `supabase/tests/issue_101_direct_conversation_creation.sql` validou separadamente a criação/visibilidade de conversa direta.
- **Auditoria genérica — PR #173 / Issue #102:** testes SQL registraram os cenários de auditoria, retenção e descarte controlado com transações revertidas. A cobertura dos call sites de todos os eventos administrativos não está concluída.
- **Auditoria privilegiada — PR #170 / Issue #124:** existem testes unitários e verificações da estrutura/writer/pesquisa server-side; os handlers reais e a cobertura completa de eventos privilegiados permanecem pendentes.
- **Migrations — PR #180:** instalação limpa aplicou 18 migrations em PostgreSQL local descartável, sem executar `migration repair`, `db reset` ou `db push` remoto. O resultado 18/18 comprova reprodutibilidade local da sequência testada, não restore ou homologação de produção.
- **Storage — PR #181:** verificação SQL confirmou bucket `attachments` privado, limite de 10 MiB, allowlist MIME PDF/JPEG e ausência de policies de acesso direto em `storage.objects`; na verificação registrada não havia objetos armazenados.
- **Upload — PR #185:** foram adicionados 10 casos unitários para validação de extensão, MIME, assinatura binária e tamanho de arquivos. A validação não é parser completo nem scanner antimalware. A PR não implementa download, URLs temporárias, quotas, PDF protegido por senha, EXIF/GPS ou backup de objetos.
- **CI:** o workflow GitHub Actions executa testes, ESLint, TypeScript e build. Os checks devem ser verificados no head atualizado da PR correspondente; a existência do workflow ou a aprovação de um commit anterior não comprova o estado de outro head.

As evidências demonstram os cenários e os ambientes descritos, dentro dos limites de cada entrega. Ainda são necessários testes integrados/E2E de jornadas completas, validação de Storage e Realtime, verificação de credenciais privilegiadas no frontend, testes de segurança, desempenho, compatibilidade e continuidade, além de homologação funcional e aceite formal.

## 8. Questões e decisões restantes

As questões históricas Q-001 a Q-025 são preservadas no [08 — Glossário e questões em aberto](08-glossario-e-questoes-em-aberto.md). No nível de levantamento de requisitos, permanece aberta somente a confirmação dos ativos oficiais de marca em Q-019. Q-018 foi resolvida pelo PO e Q-025 foi concluída em 24/11/2026.

- **Q-018 — Resolvida:** arquitetura da informação e catálogo de telas registrados em `docs/ux/decisoes-produto-q018-q019.md`.
- **Q-019 — Parcialmente concluída:** paleta cromática provisória definida pelo PO em 20/11/2026; permanece pendente somente a confirmação/entrega do arquivo oficial autorizado do Ford Oval e eventuais regras específicas de aplicação.
- **Q-025 — Resolvida em 24/11/2026:** TI e FORD aprovaram a compatibilidade e o modelo de utilização dos provedores nomeados Supabase + Vercel, inclusive Storage, dentro dos limites e responsabilidades registrados. Não deve permanecer como questão aberta nem ser utilizada para reabrir a ADR-003.

As pendências de implementação, testes, segurança, Storage, Realtime, operação, continuidade e release permanecem nas Issues e ADRs técnicas correspondentes. Elas não reabrem definições de produto já respondidas nem a avaliação de compatibilidade concluída na Q-025.

Os grupos de requisitos alinhados com Desenvolvimento não são pendências de definição de produto. A confiança nos administradores TI e os riscos do modelo administrativo também não são pendências.

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
| Infraestrutura FORD | FORD v2 | Atualiza RN-022 e RNF-013 | Requer revisão de arquitetura/ADRs e da antiga direção Supabase/Vercel |
| Questões em aberto | Respostas do questionário e alinhamento do PO | Q-001 a Q-024 reclassificadas; Q-025 criada e concluída em 24/11/2026 | Mantém somente a pendência de ativos oficiais de marca em Q-019; questões técnicas continuam nas Issues/ADRs próprias |
| Revisão documental de consistência da v0.5 | Decisão da Q-025, ADR-003 Accepted e PRs integradas até 26/11/2026 | Atualiza o status da Q-025 e a fotografia técnica por componentes, sem alterar requisitos de produto nem incrementar a versão da baseline | ADRs e Issues devem manter o mesmo estado decisório e as respectivas pendências de implementação/validação |

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
