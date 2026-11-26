# ADR-001 — Arquitetura lógica geral

- **Status:** Proposed
- **Data de revisão:** 26/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.5
- **Responsáveis pela decisão:** Tech Lead e TI; PO valida aderência ao escopo

## Contexto

O Polychat é uma aplicação web interna da FORD. A baseline v0.5 contempla aproximadamente 25 usuários finais do setor técnico e 2 a 3 administradores de TI, com perfis Usuário e TI, conversas individuais e em grupo, mensagens, anexos PDF/JPEG, alertas, consulta administrativa e auditoria.

A FORD v2 estabelece que hospedagem e infraestrutura devem permanecer sob controle da FORD, preferencialmente no Brasil, e que nenhum serviço de terceiro pode acessar, armazenar ou processar dados da organização. Bibliotecas e atualizações sem acesso aos dados são permitidas.

A ADR-003, com status **Accepted**, mantém Supabase + Vercel como stack tecnológica adotada e obrigatória. A Q-025 foi concluída em 24/11/2026, com aprovação da TI e da FORD para a compatibilidade e o modelo de utilização dos provedores nomeados, inclusive Storage, dentro dos limites e responsabilidades registrados. Essa aprovação não substitui as evidências de implementação, integração, segurança por componente, continuidade, homologação ou release. Qualquer evidência posterior de uso fora dos limites aprovados ou de incompatibilidade concreta não mitigável deve ser encaminhada ao PO e às responsabilidades competentes da FORD para decisão formal e avaliação de impacto.

O estado atual do repositório é de **implementação parcial por componentes**, não de produto funcional ponta a ponta. Já existem entregas integradas de sessão/autorização, schema de domínio, políticas RLS, auditoria genérica, base de auditoria privilegiada e fundação/upload privado de anexos. Esses componentes têm limites de escopo e não comprovam, isoladamente, que todos os fluxos do MVP estejam integrados ou homologados.

## Problema

Definir fronteiras de confiança, responsabilidades e componentes lógicos para a stack oficial do projeto, sem tratar controles visuais como segurança, sem interpretar a decisão de stack como comprovação automática de compatibilidade com todos os requisitos da FORD e sem confundir entregas parciais com arquitetura funcional e homologada.

## Alternativas consideradas

1. **Arquitetura modular sobre a stack oficial:** Vercel para hospedagem/deploy da aplicação e Supabase como plataforma de backend, separando apresentação, serviços server-side, identidade, persistência, autorização, arquivos, mensageria, auditoria e operação.
2. **Aplicação concentrada em um único componente:** reduz a configuração inicial, mas aumenta acoplamento e dificulta separar privilégios, testar fronteiras de confiança e evoluir os componentes.
3. **Introdução de provedores ou serviços externos adicionais:** não faz parte da direção aprovada. Qualquer serviço adicional que acesse, armazene ou processe dados da FORD exige avaliação e aprovação explícitas, além de compatibilidade com os requisitos aplicáveis.

## Decisão proposta

Adotar uma arquitetura lógica modular, utilizando Vercel para hospedagem/deploy e Supabase como plataforma de backend, conforme a ADR-003. As responsabilidades e integrações específicas permanecem detalhadas nas ADRs 002 a 010.

Esta ADR permanece **Proposed** até a revisão técnica da arquitetura pela Tech Lead e TI e a validação dos limites e integrações descritos neste documento. A conclusão da Q-025 registra a aprovação do modelo de utilização Supabase + Vercel dentro dos limites acordados, mas não equivale a homologação de produção nem à conclusão de todos os componentes.

As responsabilidades lógicas são:

- **Apresentação:** frontend web Next.js 16 + React 19 + TypeScript, conforme ADR-002. O navegador não recebe credenciais privilegiadas nem decide permissões.
- **Hospedagem e deploy:** Vercel, como plataforma oficial para hospedagem/deploy da aplicação. Ambientes, domínios, permissões, variáveis e segredos devem respeitar a segregação e a governança definidas pela FORD.
- **Camada server-side:** handlers e serviços da aplicação responsáveis por validar sessões, autorizar operações, validar entradas, aplicar regras de negócio e executar operações privilegiadas. Credenciais secretas permanecem exclusivamente no servidor.
- **Identidade e sessões:** Supabase Auth como serviço oficial de identidade, com perfis e estado de conta mantidos em `profiles`. O repositório contém serviços de login/validação/logout de sessão e uma rota `GET /api/auth/session` integrada ao Next.js App Router, com cookies HttpOnly e renovação de sessão. Essa entrega não comprova a conclusão de todos os fluxos administrativos de ciclo de vida de contas nem de todos os handlers de negócio.
- **Persistência:** PostgreSQL por meio do Supabase Database. O schema versionado contempla `profiles`, `conversations`, `memberships`, `messages`, `attachments`, `message_reads`, `security_alerts` e tabelas específicas de configuração, conforme ADR-005. Migrations e evidências de aplicação devem permanecer rastreáveis por ambiente.
- **Autorização de dados:** validações server-side combinadas com políticas RLS no banco. As políticas de domínio devem verificar identidade ativa, papel, estado da conversa e participação vigente. O cliente não pode escolher sua própria autorização por parâmetros, filtros ou identificadores.
- **Arquivos:** Supabase Storage com bucket privado e operações mediadas por servidor confiável. A fundação do bucket privado e o endpoint server-side de upload PDF/JPEG estão integrados; download autorizado, URLs temporárias, scanner antimalware, quarentena/liberação, quotas, validação de PDF protegido, remoção EXIF/GPS e backup dos objetos continuam nos escopos específicos de #116, #117 e #130.
- **Mensageria em tempo real:** Supabase Realtime permanece como opção a validar na ADR-007. O banco é a fonte de verdade; a publicação de eventos não substitui persistência nem autorização. Canais, subscriptions, revogação em conexões ativas, reconexão e consistência ainda precisam de prova de conceito e validação técnica.
- **Auditoria e monitoramento:** a arquitetura separa a trilha genérica de eventos (`audit_events`), os registros de ações privilegiadas e os mecanismos de monitoramento/alertas. A base de auditoria genérica, retenção investigativa e descarte controlado foi integrada; a base independente de auditoria privilegiada também foi integrada. Call sites e cobertura de eventos permanecem pendentes nos fluxos administrativos e de consulta, conforme Issues #102 e #124 e ADR-010.
- **Operação e continuidade:** ambientes de desenvolvimento, homologação/Preview e produção devem permanecer segregados entre projetos Supabase e deployments Vercel. Os aceites das Issues #96 e #98 devem ser preservados em seus escopos originais. A compatibilidade e o modelo de utilização dos provedores foram aprovados na Q-025, dentro dos limites registrados; backup/restore, retenção de 12 meses e comprovação de RPO/RTO permanecem sujeitos às evidências operacionais da Issue #130.

Operações sensíveis devem negar por padrão e falhar fechadas. Criptografia em trânsito e em repouso é obrigatória; a solução não deve ser descrita como E2EE, pois o servidor precisa acessar o conteúdo para as funções administrativas e de monitoramento definidas pela FORD.

Supabase e Vercel são as plataformas oficialmente adotadas pelo projeto, e a Q-025 registrou a aprovação da TI e da FORD para o modelo de utilização dos provedores nomeados, dentro dos limites e responsabilidades definidos. Essa aprovação não homologa automaticamente cada integração, controle funcional ou operação de produção. A inclusão de qualquer fornecedor ou suboperador adicional que acesse, armazene ou processe dados depende de aprovação explícita e avaliação de segurança/privacidade.

## Justificativa

A modularidade mantém responsabilidades testáveis, reduz a confiança no cliente e permite validar separadamente identidade, autorização, persistência, arquivos, mensageria, auditoria e operação.

A adoção consistente de Supabase + Vercel preserva a direção tecnológica definida na ADR-003 e evita introduzir migração de stack sem decisão formal. Ao mesmo tempo, a separação entre decisão de plataforma, implementação dos componentes e homologação operacional impede que a existência de código, migrations ou ambientes seja tratada como prova de atendimento integral aos requisitos da FORD.

## Consequências

**Positivas:**
- Direção tecnológica única e coerente com a ADR-003.
- Fronteiras claras entre apresentação, regras, identidade, dados, autorização e operação.
- Componentes e controles passíveis de validação isolada e rastreável.
- Preservação dos aceites e das evidências já obtidas sem extrapolar seus escopos.

**Negativas e cuidados:**
- Dependência dos recursos, limites e condições operacionais dos planos Supabase/Vercel, a considerar na avaliação de continuidade e compatibilidade.
- Necessidade de governança rigorosa de projetos, identidades, acessos, segredos, políticas e ambientes pela FORD.
- A implementação ainda exige integração de fluxos de negócio, mensageria, download e análise de anexos, auditoria de eventos administrativos e validação operacional.
- A adoção da stack não elimina a necessidade de evidenciar backup/restore, retenção, disponibilidade, RPO/RTO e compatibilidade com os requisitos de infraestrutura.

## Riscos

Configuração incorreta de autorização; credenciais privilegiadas expostas; RLS incompleta ou permissiva; acesso indevido a anexos; falha ou ausência do antimalware; revogação incompleta após remoção de participante; evento realtime publicado antes da persistência; perda ou duplicação aparente de mensagens após desconexão; cobertura incompleta da auditoria; mistura de dados entre ambientes; dependência de serviço externo não aprovado; backup ou restauração insuficientes; incompatibilidade não resolvida entre configuração/modelo de uso da stack e requisitos da FORD.

## Evidências e estado atual

As evidências abaixo refletem entregas integradas à `main` até 26/11/2026. Indicam implementação parcial e não equivalem à homologação integral do MVP.

- **Frontend e stack:** aplicação Next.js 16, React 19 e TypeScript; Vercel permanece como plataforma oficial de hospedagem/deploy, conforme ADR-002 e ADR-003.
- **Identidade e sessão — PR #175 / Issue #105:** adaptador de autorização integrado ao Next.js App Router e à rota `GET /api/auth/session`; validação de sessão e perfil, cookies HttpOnly, renovação de tokens e falha fechada. A entrega não cria handlers inexistentes para todos os fluxos de negócio.
- **Modelo de dados — PR #165 / Issue #99:** migrations criam as tabelas de conversas, memberships, mensagens, anexos, leituras, alertas e configurações específicas. A modelagem física e os limites de evidência estão documentados em `docs/database/issue-99-implementation-notes.md`.
- **Autorização/RLS — PR #172 / Issue #101:** políticas de domínio para conversas, memberships, mensagens, anexos, leituras, alertas e configurações; a evidência registra 16 cenários SQL aprovados no Polyford. Isso não comprova autorização Realtime em conexões já abertas.
- **Auditoria — PR #173 / Issue #102:** trilha genérica `audit_events`, controles append-only, `retention_holds`, descarte controlado e auditoria transacional de edição/exclusão administrativa de mensagens e fechamento de alertas. Permanecem sem call sites validados eventos de visualização/exportação de conversas, download/liberação de anexos e alterações de configuração.
- **Auditoria privilegiada — PR #170 / Issue #124:** tabela, writer e base independente para ações privilegiadas foram integrados. A Issue #124 permanece aberta porque handlers reais ainda precisam ser instrumentados; a base não representa cobertura funcional completa.
- **Storage e upload — PRs #181 e #185 / Issue #115:** bucket `attachments` privado, limite de 10 MiB e MIME PDF/JPEG; endpoint server-side de upload com sessão, verificação da mensagem/remetente, validação de extensão/MIME/assinatura e registro de metadados. Não foram implementados nessa entrega download/URL assinada, antimalware, quotas, PDF protegido, EXIF/GPS ou backup dos objetos.
- **Mensageria:** a ADR-007, revisada em 26/11/2026, registra que o schema e a RLS de domínio já existem, mas não há canais/subscriptions Supabase Realtime, política de canal nem prova de conceito de revogação em conexão ativa.
- **Ambientes e deploy:** as Issues #96 e #98 foram encerradas com aceite dos respectivos escopos operacionais. Esses aceites não equivalem a homologação integral de todos os fluxos do produto ou a auditoria independente de todas as configurações.
- **Continuidade:** a Issue #130 permanece aberta. Backup diário com retenção de 12 meses, restauração e evidência de RPO/RTO de até 24 horas não estão comprovados como capacidade operacional concluída.
- **Compatibilidade FORD:** Q-025 foi concluída em 24/11/2026, com aprovação da TI e da FORD para a compatibilidade e o modelo de utilização dos provedores nomeados, dentro dos limites e responsabilidades registrados. A Issue #130 permanece aberta para evidências de continuidade, backup/restore, operação e release.

A existência dessas entregas, migrations, testes, configurações ou previews não comprova, isoladamente, integração ponta a ponta, cobertura completa de requisitos, homologação de produção ou execução integral dos controles operacionais acordados com a FORD.

## Pendências para Accepted

- Revisar com Tech Lead e TI a manutenção da arquitetura e das configurações dentro do modelo de utilização aprovado na Q-025, registrando alterações relevantes e evidências técnicas sem reabrir a compatibilidade já aprovada.
- Obter revisão técnica da Tech Lead e TI sobre componentes, fronteiras server-side, identidade, persistência, RLS, armazenamento, antimalware, Realtime, auditoria, continuidade e operação.
- Validar os limites e integrações ainda pendentes indicados nas ADRs específicas, sem reabrir decisões funcionais já consolidadas e sem declarar integração ou homologação sem evidências.
- Registrar a solução arquitetural revisada, os responsáveis pela aprovação, a data, as evidências de viabilidade e os limites explícitos do aceite.

Os parâmetros funcionais e grupos de requisitos técnicos já alinhados com Desenvolvimento permanecem consolidados na baseline POLY-REQ-001 v0.5 e nos documentos relacionados; não são reabertos como pendências de produto por esta revisão arquitetural.
