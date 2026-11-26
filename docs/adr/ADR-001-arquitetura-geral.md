# ADR-001 — Arquitetura lógica geral

- **Status:** Proposed
- **Data de revisão:** 26/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.5
- **Responsáveis pela decisão:** Tech Lead e TI; PO valida aderência ao escopo

## Contexto

O Polychat é uma aplicação web interna da FORD. A baseline atual contempla aproximadamente 25 usuários finais do setor técnico e 2 a 3 administradores de TI, com perfis Usuário e TI, conversas individuais e em grupo, mensagens, anexos PDF/JPEG, alertas, consulta administrativa e auditoria.

A FORD v2 consolida requisitos relativos ao controle, à localização, ao acesso, à proteção e à operação dos dados da organização. Esses requisitos devem ser atendidos por meio da configuração e dos controles dos componentes utilizados pelo Polychat. Não devem ser interpretados como proibição genérica de serviços gerenciados, pois a ADR-003 — Accepted estabelece Supabase + Vercel como stack adotada e obrigatória. A avaliação da configuração, do modelo de utilização, das responsabilidades e das evidências permanece registrada na Q-025.

A ADR-003, revisada em 24/11/2026, mantém Supabase + Vercel como stack adotada e obrigatória. A arquitetura lógica deve, portanto, utilizar essa stack como referência, detalhando os componentes e suas responsabilidades nas ADRs específicas. A Q-025 registra a avaliação da configuração e dos controles operacionais frente aos requisitos da FORD; não reabre a escolha tecnológica. Qualquer proposta de substituição continua sujeita ao processo formal de mudança arquitetural em `docs/10-governanca-desenvolvimento.md`.

O repositório contém Next.js 16, React 19, TypeScript, uma página institucional, um módulo isolado de autorização e uma migration de perfis vinculada ao modelo anterior. Não há implementação funcional ponta a ponta do chat nem comprovação de integração com infraestrutura FORD.

## Problema

Definir fronteiras de confiança, responsabilidades e componentes lógicos coerentes com a stack Supabase + Vercel adotada, sem confundir a decisão tecnológica com integração implementada, controles testados ou arquitetura homologada.

## Alternativas consideradas

1. **Arquitetura modular integrada à stack adotada — Supabase + Vercel:** distribui apresentação, execução server-side, identidade, persistência, armazenamento e operação entre componentes com responsabilidades explícitas. É a direção tecnológica estabelecida pela ADR-003.
2. **Arquitetura modular com componentes autogerenciados ou outra plataforma:** não é a direção adotada nesta ADR. Só deve ser considerada mediante evidência concreta de incompatibilidade não mitigável e processo formal de mudança arquitetural; não decorre automaticamente dos requisitos da FORD.
3. **Aplicação concentrada em um único componente:** reduz configuração inicial, mas aumenta acoplamento e dificulta separar privilégios, testar fronteiras e evoluir a operação.

## Decisão proposta

Adotar uma arquitetura lógica modular integrada à stack Supabase + Vercel definida na ADR-003 — Accepted. Esta ADR permanece Proposed até a revisão técnica dos componentes, das responsabilidades e dos controles pelos responsáveis indicados. A Q-025 documenta a avaliação da configuração e do modelo de utilização da stack frente aos requisitos da FORD, sem reabrir a escolha tecnológica nem declarar homologação de produção.

As responsabilidades lógicas são:

- **Apresentação:** frontend web Next.js 16 + React 19 + TypeScript, conforme ADR-002. O navegador não recebe credenciais privilegiadas nem decide permissões.
- **Camada server-side:** handlers e serviços da aplicação responsáveis por autenticação, autorização, validação de entradas, regras de negócio e operações privilegiadas.
- **Identidade e sessões:** Supabase Auth é o componente de autenticação previsto na plataforma Supabase adotada. O desenho da integração, os controles de sessão e o provisionamento pelo TI são detalhados na ADR-004 — Proposed; sua configuração e evidências operacionais são acompanhadas na Q-025.
- **Persistência:** PostgreSQL é a tecnologia relacional prevista no contexto do Supabase Database adotado. A modelagem lógica e física, a configuração, os controles de acesso, backup e recuperação são detalhados na ADR-005 — Proposed e avaliados operacionalmente na Q-025.
- **Autorização de dados:** verificações server-side e políticas no banco, incluindo RLS quando suportada e adequada. As permissões devem refletir os perfis Usuário e TI e as regras de participação em conversas e grupos.
- **Arquivos:** Supabase Storage é o componente de armazenamento previsto na stack adotada. A solução deve utilizar armazenamento privado, autorização server-side, controle de acesso por conversa e revogação efetiva. A integração do scanner antimalware deve observar o requisito funcional de execução na infraestrutura da FORD e ser detalhada na ADR-008 — Proposed.
- **Mensageria em tempo real:** Supabase Realtime é a tecnologia prevista para avaliação no contexto da stack adotada, conforme ADR-007 — Proposed. O banco permanece a fonte de verdade; canais, autorização e garantias de entrega devem ser detalhados na ADR específica.
- **Auditoria e monitoramento:** registros, consultas e processamento de alertas devem seguir a baseline, com acesso administrativo restrito e trilha auditável. Os componentes, a configuração e as responsabilidades devem ser detalhados nas entregas técnicas pertinentes, sem presumir implementação concluída.
- **Operação:** ambientes de desenvolvimento, homologação e produção devem ser isolados na stack Supabase + Vercel. A configuração dos ambientes, deploy, gestão de segredos, backup, restauração e monitoramento é detalhada na ADR-009 — Proposed e avaliada na Q-025.

Operações sensíveis devem negar por padrão e falhar fechadas. Criptografia em trânsito e em repouso é obrigatória; a solução não deve ser descrita como E2EE, pois o servidor precisa acessar o conteúdo para as funções administrativas e de monitoramento definidas pela FORD.

Serviços ou integrações adicionais que não façam parte da stack adotada não devem ser incorporados automaticamente: sua necessidade, acesso a dados e responsabilidades devem ser avaliados e aprovados antes do uso. Essa regra não constitui proibição genérica aos serviços gerenciados que integram a stack Supabase + Vercel definida na ADR-003.

## Justificativa

A modularidade mantém responsabilidades testáveis, reduz a confiança no cliente e permite aplicar controles específicos em cada componente da stack adotada. A configuração dos serviços, a proteção dos dados, o acesso administrativo e a operação devem ser evidenciados conforme a Q-025 e as ADRs específicas.

A configuração dos componentes específicos deve considerar os requisitos de controle, localização, acesso, segurança, continuidade e operação da FORD. A inclusão de serviços fora da stack adotada exige avaliação e decisão formal, sem converter esse cuidado em proibição genérica aos serviços Supabase + Vercel.

## Consequências

**Positivas:**
- Alinhamento dos componentes e controles da stack adotada aos requisitos de infraestrutura, proteção e operação da FORD.
- Fronteiras claras entre apresentação, regras, identidade, dados e operação.
- Separação clara de responsabilidades entre as plataformas adotadas e os componentes e controles sob responsabilidade do projeto/FORD.
- Decisões técnicas rastreáveis e passíveis de substituição por componente.

**Negativas e cuidados:**
- Maior responsabilidade da FORD/equipe sobre operação, disponibilidade, atualização e recuperação.
- Necessidade de comprovar capacidade de infraestrutura, observabilidade, backup/restore e suporte.
- Integração e testes de segurança precisam ocorrer no ambiente operacional real.

## Riscos

Configuração incorreta de autorização; credenciais privilegiadas expostas; RLS incompleta; acesso indevido a anexos; falha no antimalware; perda de histórico; publicação de eventos antes da persistência; segregação inadequada de ambientes; dependência externa que passe a acessar ou processar dados.

## Evidências e estado atual

A `main` contém Next.js 16/React 19/TypeScript, página institucional, o módulo `src/auth/authorization.mjs` e uma migration de perfis vinculada ao Supabase. Não foram encontradas rotas funcionais de chat, serviços de domínio, armazenamento de anexos, canais realtime ou trilha de auditoria funcional.

A existência desses artefatos não comprova integração funcional nem homologação de produção. A stack Supabase + Vercel permanece adotada conforme ADR-003; a configuração, o fluxo dos dados, os acessos, as responsabilidades e a compatibilidade com os requisitos da FORD devem ser evidenciados na Q-025. A análise não altera o status da ADR-003 por si só.

## Pendências para Accepted

- Detalhar e validar, na Q-025 e nas ADRs específicas, a configuração dos componentes da stack Supabase + Vercel, as fronteiras de dados, os controles, as responsabilidades e as evidências operacionais.
- Revisão do Tech Lead e TI sobre componentes, fronteiras server-side, identidade, banco, armazenamento, antimalware, auditoria, continuidade e operação.
- Registrar na ADR a solução técnica selecionada, os responsáveis pela aprovação, a data, as evidências de viabilidade e os limites do aceite.

Os parâmetros funcionais e grupos de requisitos técnicos já alinhados com Desenvolvimento permanecem consolidados nos documentos de requisitos; não são reabertos por esta revisão arquitetural.
