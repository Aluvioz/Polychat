# Polychat

Aplicação web de comunicação interna em desenvolvimento para a FORD.

**Baseline de produto:** POLY-REQ-001 v0.5, baseada no questionário FORD v2 e nos alinhamentos consolidados em 20/11/2026. A direção tecnológica Supabase + Vercel permanece adotada e obrigatória, conforme ADR-003 — Accepted (revisão de 24/11/2026).

 > **Requisitos de infraestrutura da FORD:** hospedagem, armazenamento e processamento de dados devem atender às restrições de controle, localização, acesso e operação registradas na baseline. A configuração e o modelo de uso da stack adotada Supabase + Vercel devem ser avaliados na Q-025 antes da homologação de produção; essa avaliação não altera nem substitui a ADR-003 por inferência.

## Estado atual

O repositório contém a fundação do frontend em Next.js 16, React 19, TypeScript e App Router. A interface atual é uma página institucional. Os fluxos de autenticação, conversas, grupos, mensagens, anexos, alertas e administração ainda não estão implementados de ponta a ponta.

A stack de frontend registrada na ADR-002 permanece Next.js 16 + React 19 + TypeScript. A direção tecnológica de plataforma, hospedagem e backend é Supabase + Vercel, conforme ADR-003 — Accepted; os detalhes de configuração e homologação são tratados nas ADRs específicas e na Q-025.

Supabase + Vercel não foi retirada como arquitetura-alvo: permanece como stack adotada e obrigatória na ADR-003. A Q-025 deve verificar a compatibilidade da configuração, do fluxo de dados, dos acessos e das responsabilidades com os requisitos da FORD, sem autorizar substituição implícita.

## Requisitos de desenvolvimento

- Node.js 20.9 ou superior (recomendado Node.js 22).
- npm.

## Executar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

A execução local serve para desenvolvimento da aplicação. Não utilize dados reais da FORD em serviços externos ou ambientes que não estejam sob controle autorizado da organização.

## Validação

```bash
npm test
npm run lint
npm run typecheck
npm run format:check
npm run build
```

Para aplicar a formatação configurada ao repositório:

```bash
npm run format
```

O GitHub Actions executa testes automatizados, lint, verificação de tipos e build em atualizações da `main` e em Pull Requests direcionadas à `main`. A verificação de formatação está disponível localmente por `npm run format:check`; sua inclusão obrigatória no CI depende da normalização dos arquivos existentes e da validação do resultado.

## Diretrizes de arquitetura e segurança

- O frontend não é uma fronteira de segurança: autenticação, autorização e operações privilegiadas devem ser validadas no servidor.
- Serviços de identidade, banco de dados, armazenamento, antimalware, auditoria, monitoramento, backup e recuperação devem atender aos requisitos de controle da FORD; a configuração dos serviços da stack adotada e as evidências de compatibilidade devem ser registradas na Q-025.
- Bibliotecas e atualizações que não acessem dados da FORD podem ser utilizadas, respeitadas as políticas aplicáveis.
- Dados em trânsito e em repouso devem ser protegidos conforme os requisitos consolidados; a solução não deve ser apresentada como criptografia ponta a ponta (E2EE).
- Ambientes de desenvolvimento, homologação e produção devem permanecer isolados.
- Não trate migrations, variáveis de exemplo, testes unitários ou builds como evidência de integração ou homologação de produção.

A ADR-003 formaliza Supabase + Vercel como stack adotada e obrigatória. Arquivos de exemplo, migrations, variáveis e previews não comprovam integração funcional, conformidade ou homologação de produção. A Q-025 deve registrar a configuração, os controles, as responsabilidades e as evidências de compatibilidade com os requisitos da FORD; seus resultados não substituem a decisão de arquitetura. Consulte também a [governança de decisões arquiteturais](docs/10-governanca-desenvolvimento.md#8-governanca-de-decisoes-arquiteturais).

## Documentação do produto

- [Controle do documento](docs/00-controle-do-documento.md)
- [Visão geral e escopo](docs/01-visao-geral-e-escopo.md)
- [Objetivos do produto](docs/02-objetivos.md)
- [Requisitos funcionais](docs/03-requisitos-funcionais.md)
- [Requisitos não funcionais](docs/04-requisitos-nao-funcionais.md)
- [Regras de negócio e restrições](docs/05-regras-de-negocio-e-restricoes.md)
- [Rastreabilidade e critérios de aceitação](docs/07-rastreabilidade-e-criterios-de-aceitacao.md)
- [Glossário e questões em aberto](docs/08-glossario-e-questoes-em-aberto.md)
- [Baseline do MVP](docs/09-baseline-requisitos-mvp.md)
- [Governança do desenvolvimento](docs/10-governanca-desenvolvimento.md)
- [Índice das decisões arquiteturais (ADRs)](docs/adr/README.md)
