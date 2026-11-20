# Polychat

Aplicação web de comunicação interna em desenvolvimento para a FORD.

**Baseline de produto:** POLY-REQ-001 v0.4, baseada no questionário FORD v2 e nos alinhamentos consolidados em 19/11/2026.

> **Plataformas oficiais do projeto:** Supabase (serviços de backend) e Vercel (hospedagem e deploy). O uso dessas plataformas foi alinhado e integra a arquitetura oficial do Polychat. A configuração deve respeitar os requisitos da FORD, a segregação de ambientes, a proteção de dados e os controles de acesso; outros provedores/serviços externos não estão automaticamente autorizados.

## Estado atual

O repositório contém a fundação do frontend em Next.js 16, React 19, TypeScript e App Router. A interface atual é uma página institucional. Os fluxos de autenticação, conversas, grupos, mensagens, anexos, alertas e administração ainda não estão implementados de ponta a ponta.

A stack de frontend registrada na ADR-002 permanece Next.js 16 + React 19 + TypeScript, com Vercel como plataforma oficial de hospedagem/deploy e Supabase como plataforma oficial de backend. O uso de cada produto/serviço Supabase é detalhado nas ADRs específicas.

Supabase + Vercel permanecem como direção tecnológica oficial, conforme ADR-003 e alinhamento complementar do PO com Desenvolvimento. A Q-025 não trata de substituir essas plataformas nem repetir as entregas aceitas nas Issues #96/#98: limita-se a consolidar evidências específicas de configuração e integração ainda não cobertas, sem expor valores sensíveis.

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
- Supabase e Vercel são os provedores oficiais aprovados para o projeto; as responsabilidades de identidade, dados, armazenamento e hospedagem são detalhadas nas ADRs.
- Não integrar outros serviços externos que acessem ou processem dados da FORD sem aprovação explícita do projeto e validação aplicável.
- Bibliotecas e atualizações que não acessem dados da FORD podem ser utilizadas, respeitadas as políticas aplicáveis.
- Dados em trânsito e em repouso devem ser protegidos conforme os requisitos consolidados; a solução não deve ser apresentada como criptografia ponta a ponta (E2EE).
- Ambientes de desenvolvimento, homologação e produção devem permanecer isolados.
- Não trate migrations, variáveis de exemplo, testes unitários ou builds como evidência de integração ou homologação de produção.

Supabase e Vercel não são referências apenas históricas: são plataformas oficiais do Polychat. Os arquivos de exemplo e testes simulados, contudo, não comprovam por si só integração funcional, configuração de produção, segregação de ambientes ou homologação. Consulte as ADRs e a documentação das Issues #96 e #98.

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
