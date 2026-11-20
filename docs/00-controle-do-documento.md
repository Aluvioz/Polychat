# 00 - Identificação e controle do documento

## Identificação

| Campo | Valor |
|---|---|
| Projeto | Polychat |
| Cliente / organização | FORD |
| Identificador | POLY-REQ-001 |
| Título | Documento de Especificação de Requisitos do Polychat |
| Versão | 0.4 |
| Data da revisão | 19/11/2026 |
| Status | Revisado com base no Questionário de Esclarecimento de Requisitos da FORD (versão atualizada recebida em 19/11/2026) e nos alinhamentos complementares do PO com Desenvolvimento. Referência vigente para a baseline de requisitos de produto e documentos correlatos. |
| Contexto acadêmico | Equipe de graduação da UNIFACS; projeto da UC Projeto e Engenharia de Software (conforme README do repositório) |
| Responsável de produto (PO) | Papel exercido no projeto; identificação nominal não registrada neste documento |
| Responsável técnico | Equipe de desenvolvimento; identificação nominal não registrada neste documento |
| Representante da FORD | Fábio Silva Cerqueira — Gestor da FORD |
| Fonte das necessidades | Questionário FORD atualizado e alinhamentos registrados pelo PO com Desenvolvimento |
| Repositório de destino | [Aluvioz/Polychat](https://github.com/Aluvioz/Polychat), branch `main` |

## Histórico de alterações

| Versão | Data | Autor | Descrição |
|---|---|---|---|
| 0.1 | 13/11/2026 | Equipe de requisitos | Primeira consolidação das informações disponíveis; lacunas, riscos e diagramas pendentes registrados. |
| 0.2 | 16/11/2026 | Consolidação da Issue #88 | Baseline confrontada com a visão POLYCHAT — FORD v0.1; registrados requisitos, rastreabilidade, arquitetura de referência da issue e evidências técnicas disponíveis naquele momento. |
| 0.3 | 19/11/2026 | Product Owner | Atualização inicial após o questionário FORD v2 e os alinhamentos complementares. |
| 0.4 | 19/11/2026 | Product Owner | Correção e consolidação da baseline: confirmação de Supabase e Vercel como plataformas oficiais; harmonização da infraestrutura, operação, segurança, retenção, anexos, homologação e rastreabilidade. |

## Referência e precedência

A versão 0.4 substitui, para fins de especificação dos requisitos de produto, as interpretações anteriores baseadas exclusivamente na visão POLYCHAT — FORD v0.1 e atualiza a versão 0.3.

A fonte atual é composta por:
- Questionário de Esclarecimento de Requisitos da FORD v2, recebido em 19/11/2026.
- Alinhamentos complementares do PO com a equipe de Desenvolvimento, considerados concluídos para limites de armazenamento, regras e severidade dos alertas, metas de desempenho, proteção de credenciais, gestão de chaves, política detalhada de retenção, critérios de homologação e isolamento dos ambientes.
- Premissas de produto confirmadas pelo PO nesta revisão, inclusive o entendimento de que os administradores de TI da FORD são de extrema confiança e que os riscos ligados aos poderes administrativos já foram avaliados no âmbito do projeto.

Em caso de divergência entre documentos anteriores e esta revisão, prevalecem as decisões mais recentes consolidadas nesta versão, sem apagar o histórico das versões anteriores. Supabase e Vercel são as plataformas oficiais do projeto, conforme alinhamento complementar do PO com Desenvolvimento; Q-025 não reabre essa escolha.

## Validação e responsabilidades

| Papel | Responsável / referência | Situação registrada |
|---|---|---|
| Representante do cliente FORD | Fábio Silva Cerqueira — Gestor da FORD | Respostas e decisões de negócio registradas no questionário atualizado |
| Product Owner | PO do Polychat | Consolidação dos requisitos e das premissas complementares em 19/11/2026 |
| Desenvolvimento / liderança técnica | Equipe de Desenvolvimento | Oito grupos de requisitos técnicos e operacionais considerados alinhados e completos pelo PO |
| TI / infraestrutura FORD | Equipe de TI da FORD | Responsável pela administração e operação conforme as decisões do cliente |
| Homologação / aceite | Fábio Silva Cerqueira, com representantes do TI | Aceite formal por escrito e decisão Go/No-Go conforme questionário |
| Jurídico / Privacidade | Sem participação prevista pela FORD no alinhamento | A ausência de participação interna não representa dispensa de obrigações legais aplicáveis |

Este controle registra a origem e a consolidação das decisões. Não declara assinatura, homologação de produção, execução de testes ou aprovação de PR que não estejam comprovadas por suas respectivas evidências.

## Convenções e estado da informação

- **Confirmado pela FORD:** resposta expressa no questionário atualizado.
- **Alinhado com Desenvolvimento:** requisito técnico/operacional considerado completo pelo PO após alinhamento com a equipe.
- **Premissa de produto:** decisão de gestão explicitamente confirmada pelo PO para orientar a documentação.
- **Derivado:** detalhamento necessário para tornar um comportamento verificável, sem alterar a decisão de negócio.
- **Pendente:** decisão realmente não fornecida ou não concluída. Não usar esta classificação para reabrir os oito grupos de requisitos já alinhados com Desenvolvimento.

As prioridades e estados descritos nos documentos 00 a 04 devem ser interpretados conforme esta convenção. Os alinhamentos técnicos são considerados completos mesmo quando seus parâmetros detalhados estejam registrados em artefatos técnicos próprios, e não repetidos integralmente nesta especificação.

## Limites de conformidade

As respostas da FORD sobre monitoramento, privacidade e participação de áreas internas são registradas como decisões e premissas do cliente. A especificação não interpreta essas respostas como declaração de inaplicabilidade de leis ou como dispensa de obrigações legais. A implementação e a operação devem observar as normas aplicáveis ao tratamento de dados.

## Documentos relacionados

- [Índice da documentação](README.md)
- [Visão geral e escopo](01-visao-geral-e-escopo.md)
- [Objetivos do produto](02-objetivos.md)
- [Requisitos funcionais](03-requisitos-funcionais.md)
- [Requisitos não funcionais](04-requisitos-nao-funcionais.md)
- [Regras de negócio e restrições](05-regras-de-negocio-e-restricoes.md)
- [Diagramas UML](06-diagramas-uml.md)
- [Rastreabilidade e critérios de aceitação](07-rastreabilidade-e-criterios-de-aceitacao.md)
- [Glossário e questões em aberto](08-glossario-e-questoes-em-aberto.md)
- [Baseline consolidada do MVP](09-baseline-requisitos-mvp.md)
