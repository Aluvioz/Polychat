# Polychat

Aplicação web de comunicação interna em desenvolvimento para a FORD.

**Baseline de produto:** POLY-REQ-001 v0.4, baseada no questionário FORD v2 e nos alinhamentos consolidados em 19/11/2026.

> **Restrição obrigatória de infraestrutura:** hospedagem, armazenamento e processamento de dados devem permanecer sob controle da FORD, preferencialmente no Brasil. Nenhum serviço de terceiro pode acessar, armazenar ou processar dados da organização. Não configure provedores externos como destino de produção do Polychat.

## Estado atual

O repositório contém a fundação do frontend em Next.js 16, React 19, TypeScript e App Router. A interface atual é uma página institucional. Os fluxos de autenticação, conversas, grupos, mensagens, anexos, alertas e administração ainda não estão implementados de ponta a ponta.

A stack de frontend registrada na ADR-002 permanece Next.js 16 + React 19 + TypeScript. Isso não aprova, por si só, qualquer serviço externo de hospedagem, identidade, banco de dados ou armazenamento.

A direção anterior Supabase + Vercel foi retirada como arquitetura-alvo após a FORD v2; consulte ADR-003. A escolha e homologação da arquitetura operacional compatível com a infraestrutura FORD permanecem em reconciliação técnica (Q-025).

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
- Serviços de identidade, banco de dados, armazenamento, antimalware, auditoria, monitoramento, backup e recuperação devem operar dentro da fronteira de controle da FORD.
- Bibliotecas e atualizações que não acessem dados da FORD podem ser utilizadas, respeitadas as políticas aplicáveis.
- Dados em trânsito e em repouso devem ser protegidos conforme os requisitos consolidados; a solução não deve ser apresentada como criptografia ponta a ponta (E2EE).
- Ambientes de desenvolvimento, homologação e produção devem permanecer isolados.
- Não trate migrations, variáveis de exemplo, testes unitários ou builds como evidência de integração ou homologação de produção.

Os arquivos de exemplo e referências históricas a Supabase/Vercel não representam autorização para conectar ou usar esses serviços com dados da FORD. A arquitetura final deverá ser formalizada nas ADRs após a compatibilização com a infraestrutura da organização.

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
