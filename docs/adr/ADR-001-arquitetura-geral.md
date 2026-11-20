# ADR-001 — Arquitetura lógica geral

- **Status:** Proposed
- **Data de revisão:** 19/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.4
- **Responsáveis pela decisão:** Tech Lead e TI; PO valida aderência ao escopo

## Contexto

O Polychat é uma aplicação web interna da FORD. A baseline atual contempla aproximadamente 25 usuários finais do setor técnico e 2 a 3 administradores de TI, com perfis Usuário e TI, conversas individuais e em grupo, mensagens, anexos PDF/JPEG, alertas, consulta administrativa e auditoria.

A baseline exige proteção dos dados, isolamento dos ambientes e operação sob governança da FORD. Em alinhamento complementar do PO com Desenvolvimento, **Supabase e Vercel foram confirmadas como plataformas oficiais do Polychat**: Vercel para hospedagem/deploy e Supabase como plataforma de backend. Essa decisão corrige a interpretação anterior que tratou ambas como incompatíveis e está formalizada na ADR-003.

A seleção das plataformas está definida; a Q-025 permanece restrita à validação de configurações concretas (regiões, projetos por ambiente, acessos, segredos, backups, integrações e evidências de homologação). Não se deve inferir que todos os módulos já estejam implementados ou configurados em produção.

O repositório contém Next.js 16, React 19, TypeScript, uma página institucional, um módulo isolado de autorização e uma migration de perfis vinculada ao modelo anterior. Não há implementação funcional ponta a ponta do chat nem comprovação de integração completa com os serviços Supabase/Vercel.

## Problema

Definir fronteiras de confiança, responsabilidades e componentes lógicos com uso das plataformas oficiais do projeto, sem tratar controles visuais como segurança ou confundir código existente com arquitetura implementada e homologada.

## Alternativas consideradas

1. **Arquitetura modular com plataformas oficiais:** Vercel hospeda/deploya a aplicação e Supabase fornece os serviços oficiais de backend, com contas, acessos, ambientes e dados sob governança da FORD.
2. **Serviços gerenciados oficiais do projeto:** Supabase e Vercel são a escolha aprovada para o Polychat. Outros provedores que acessem ou processem dados exigem aprovação explícita e avaliação própria.
3. **Aplicação concentrada em um único componente:** reduz configuração inicial, mas aumenta acoplamento e dificulta separar privilégios, testar fronteiras e evoluir a operação.

## Decisão proposta

Adotar arquitetura lógica modular, utilizando Vercel para hospedagem/deploy e Supabase como plataforma de backend, com separação clara de responsabilidades e configuração segura dos ambientes. A ADR permanece Proposed até revisão técnica e evidências de integração/homologação.

As responsabilidades lógicas são:

- **Apresentação:** frontend web Next.js 16 + React 19 + TypeScript, conforme ADR-002. O navegador não recebe credenciais privilegiadas nem decide permissões.
- **Camada server-side:** handlers e serviços da aplicação responsáveis por autenticação, autorização, validação de entradas, regras de negócio e operações privilegiadas.
- **Identidade e sessões:** Supabase Auth como serviço oficial de identidade, sujeito às regras de provisionamento, autorização server-side e gestão de credenciais da FORD. Regras funcionais e de credenciais seguem a baseline e a ADR-004.
- **Persistência:** PostgreSQL por meio do Supabase Database, conforme ADR-005; schema, migrations, backups, RLS e configuração por ambiente devem ser validados.
- **Autorização de dados:** verificações server-side e políticas no banco, incluindo RLS quando suportada e adequada. As permissões devem refletir os perfis Usuário e TI e as regras de participação em conversas e grupos.
- **Arquivos:** armazenamento privado por meio de Supabase Storage, conforme ADR-008, com autorização no servidor, URLs temporárias, revogação de acesso e análise antimalware antes da disponibilização.
- **Mensageria em tempo real:** Supabase Realtime como opção oficial para atualização/notificação de participantes, mantendo o banco como fonte de verdade e respeitando autorização por conversa.
- **Auditoria e monitoramento:** registros e processamento de alertas nos componentes oficiais da arquitetura, com acesso administrativo conforme a baseline e trilha auditável.
- **Operação:** ambientes de desenvolvimento, homologação e produção isolados entre os projetos/ambientes Supabase e deployments Vercel; backup, restauração, gestão de chaves e monitoramento conforme os requisitos não funcionais consolidados.

Operações sensíveis devem negar por padrão e falhar fechadas. Criptografia em trânsito e em repouso é obrigatória; a solução não deve ser descrita como E2EE, pois o servidor precisa acessar o conteúdo para as funções administrativas e de monitoramento definidas pela FORD.

Supabase e Vercel são as plataformas externas explicitamente aprovadas para o projeto. A inclusão de qualquer outro fornecedor ou suboperador que acesse, armazene ou processe dados depende de aprovação explícita e avaliação de segurança/privacidade. A configuração das plataformas oficiais deve respeitar os controles definidos pela FORD.

## Justificativa

A modularidade mantém responsabilidades testáveis e reduz a confiança no cliente. O uso das plataformas oficialmente alinhadas evita uma migração indevida de stack e permite concentrar a validação nos controles de configuração, isolamento, acesso, armazenamento, auditoria e recuperação.

A seleção das configurações específicas das plataformas oficiais deve considerar governança das contas, regiões, acesso, segurança, continuidade e capacidade de homologação, sem introduzir serviços adicionais não aprovados.

## Consequências

**Positivas:**
- Adoção consistente das plataformas oficiais Supabase e Vercel.
- Fronteiras claras entre apresentação, regras, identidade, dados e operação.
- Decisões técnicas rastreáveis e passíveis de validação por componente.
- Decisões técnicas rastreáveis e passíveis de substituição por componente.

**Negativas e cuidados:**
- Responsabilidade da FORD/equipe pela governança dos projetos, identidades, acessos, configurações, políticas, backup/restore e operação da aplicação.
- Dependência dos recursos e limites operacionais oferecidos pelos planos oficiais Supabase/Vercel, que devem ser considerados no dimensionamento e na continuidade.
- Integração e testes de segurança precisam ocorrer no ambiente operacional real.

## Riscos

Configuração incorreta de autorização; credenciais privilegiadas expostas; RLS incompleta; acesso indevido a anexos; falha no antimalware; perda de histórico; publicação de eventos antes da persistência; segregação inadequada de ambientes; dependência externa que passe a acessar ou processar dados.

## Evidências e estado atual

A `main` contém Next.js 16/React 19/TypeScript, página institucional, o módulo `src/auth/authorization.mjs` e uma migration de perfis vinculada ao Supabase. Não foram encontradas rotas funcionais de chat, serviços de domínio, armazenamento de anexos, canais realtime ou trilha de auditoria funcional.

A existência desses artefatos comprova apenas uma fundação parcial; não demonstra integração funcional completa, configuração de ambientes ou homologação de produção. Supabase e Vercel são plataformas oficiais, conforme alinhamento registrado nesta ADR e na ADR-003.

## Pendências para Accepted

- Validar as configurações efetivas dos projetos Supabase e deployments Vercel, incluindo regiões, acessos, segredos e segregação de ambientes (Q-025).
- Revisão do Tech Lead e TI sobre componentes, fronteiras server-side, identidade, banco, armazenamento, antimalware, auditoria, continuidade e operação.
- Registrar na ADR a solução técnica selecionada, os responsáveis pela aprovação, a data, as evidências de viabilidade e os limites do aceite.

Os parâmetros funcionais e grupos de requisitos técnicos já alinhados com Desenvolvimento permanecem consolidados nos documentos de requisitos; não são reabertos por esta revisão arquitetural.
