# ADR-003 — Plataformas oficiais Supabase + Vercel

- **Status:** Accepted
- **Data da decisão original:** 17/11/2026
- **Data da confirmação/revisão:** 19/11/2026
- **Issue de origem:** #89 · **Referência de produto:** #88
- **Baseline:** POLY-REQ-001 v0.4 e alinhamento complementar do PO com Desenvolvimento

## Contexto

A Issue #88 e as decisões anteriores do projeto registram Supabase + Vercel como direção tecnológica do MVP. A Issue #96 trata da configuração dos ambientes Supabase e Vercel; a Issue #98 trata de deploy Preview/Production e rollback pela Vercel. Ambas foram encerradas conforme seus critérios originais.

Na reconciliação documental de 19/11/2026, a direção foi indevidamente classificada como depreciada, sob uma interpretação de que a restrição de infraestrutura da FORD proibiria o uso dessas plataformas. O PO esclareceu que **Supabase e Vercel são oficiais do projeto e que essa escolha foi alinhada**. Esta ADR corrige aquela interpretação.

## Decisão

**Manter Supabase + Vercel como plataformas oficiais e arquitetura-alvo do Polychat.**

- **Vercel:** hospedagem e deploy da aplicação Next.js, incluindo os fluxos de Preview e Production e o processo de rollback.
- **Supabase:** plataforma de backend do Polychat. Auth, PostgreSQL Database, Storage e Realtime são avaliados e especificados nas ADRs 004 a 008, conforme a responsabilidade de cada componente.
- **Next.js:** permanece como framework da aplicação, conforme ADR-002.

A aprovação das plataformas não significa que todas as integrações, módulos, ambientes ou fluxos estejam implementados e homologados. Cada uso deve ter evidência técnica correspondente.

## Compatibilização com os requisitos da FORD

O uso de Supabase e Vercel é uma decisão explícita do projeto, confirmada pelo PO após alinhamento com Desenvolvimento. A restrição contra fornecedores não aprovados deve ser interpretada como vedação à inclusão de outros serviços externos sem aprovação, e não como proibição das duas plataformas oficiais.

A configuração dos serviços oficiais deve observar:
- segregação entre desenvolvimento, homologação/preview e produção;
- controle de acesso aos projetos, organizações e deployments;
- proteção de credenciais e segredos, sem versioná-los no repositório;
- escolha e validação das regiões de dados e execução aplicáveis;
- proteção em trânsito e em repouso, políticas RLS e armazenamento privado;
- backups, restauração, retenção e auditoria conforme os requisitos do produto;
- ausência de integração com serviços não aprovados para análise de conteúdo, antimalware ou processamento de dados.

## Justificativa

A decisão preserva a arquitetura e o trabalho já alinhados no projeto, mantém continuidade com as Issues #88, #96 e #98 e evita uma migração de plataforma que não foi solicitada nem aprovada. Os requisitos de segurança devem ser implementados por configuração, desenho de acesso e evidências verificáveis nos serviços oficiais.

## Consequências

**Positivas:**
- Stack de plataforma estável e coerente com a direção de desenvolvimento aprovada.
- Continuidade das configurações e dos artefatos existentes.
- Clareza sobre os serviços oficiais e a necessidade de evidências de integração.

**Cuidados:**
- A aprovação da plataforma não substitui auditoria de configuração, avaliação de região, RLS, backups ou homologação.
- A equipe deve evitar serviços externos adicionais que processem dados sem aprovação explícita.
- Integrações e fluxos que ainda estejam apenas simulados ou documentados continuam pendentes de implementação.

## Evidências atuais e limites

- Issue #88: registra a arquitetura Supabase + Vercel como direção de implementação.
- Issue #96: registra a configuração de ambientes Supabase e Vercel; o relatório de auditoria documenta quais ambientes foram efetivamente identificados e os limites de acesso à configuração administrativa.
- Issue #98: registra deploy Preview/Production e rollback pela Vercel; o runbook preserva os limites dos testes executados.
- O repositório contém migration de perfis ligada ao Supabase e middleware de autorização que utiliza cliente Supabase.
- Testes com Supabase simulado não comprovam integração real; build e Preview Ready não comprovam homologação funcional de produção.

## Pendências de validação

- Confirmar a matriz de projetos Supabase e ambientes Vercel (Development, Preview/Homologação e Production).
- Confirmar regiões, domínios, deployments, variáveis e segredos por ambiente sem divulgar valores sensíveis.
- Validar integração real do Auth, Database, Storage e Realtime conforme as ADRs específicas.
- Executar testes de autorização/RLS, isolamento de ambientes, backup/restore, smoke test e rollback conforme o plano técnico.

Essas validações são detalhamento técnico da stack aprovada; não são uma decisão pendente sobre substituir Supabase ou Vercel.

## Histórico da decisão

- **17/11/2026:** Supabase + Vercel registrados como direção Accepted, com base na Issue #88.
- **19/11/2026:** a revisão documental da FORD v2 marcou indevidamente as plataformas como Deprecated.
- **19/11/2026:** o PO esclareceu que Supabase e Vercel são oficiais do projeto e que a escolha foi alinhada; esta revisão restaura o status Accepted e corrige as referências documentais.
