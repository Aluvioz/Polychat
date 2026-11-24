# Governança do desenvolvimento

**Escopo:** fluxo de trabalho do repositório Polychat  
**Referência:** Issue #90 — Epic 00  
**Aplicação:** mudanças de código, testes, infraestrutura e documentação  
**Estado:** procedimento operacional documentado nesta alteração; aprovação externa ou institucional não é presumida.

Este documento formaliza critérios mínimos para preparar, implementar, revisar e integrar mudanças. Ele organiza o trabalho técnico do repositório e não altera requisitos de negócio, papéis de produto ou decisões arquiteturais das Issues #88 e #89.

## 1. Definition of Ready (DoR)

Uma issue está pronta para desenvolvimento quando os itens aplicáveis abaixo puderem ser verificados:

- [ ] Objetivo e problema estão descritos.
- [ ] Escopo e resultado esperado estão explícitos.
- [ ] Critérios de aceite são verificáveis.
- [ ] Requisitos, restrições e decisões existentes relevantes estão referenciados.
- [ ] Dependências, bloqueios e riscos conhecidos estão registrados.
- [ ] Fora de escopo e ambiguidades relevantes estão identificados; dúvidas que impeçam a implementação foram esclarecidas ou registradas como bloqueio.
- [ ] Há informação suficiente para identificar os testes ou evidências necessários.
- [ ] A issue está vinculada à Epic ou ao contexto correspondente, quando aplicável.

Não se deve inventar decisão para satisfazer o DoR. Aprovações de FORD, PO, liderança técnica ou QA/SQA só podem ser marcadas quando houver registro explícito da pessoa ou instância competente.

## 2. Definition of Done (DoD)

Uma mudança pode ser considerada concluída tecnicamente quando todos os itens aplicáveis estiverem satisfeitos:

- [ ] Implementação atende ao escopo e aos critérios de aceite.
- [ ] Testes relevantes foram adicionados ou atualizados e executados.
- [ ] ESLint, TypeScript e build passaram no CI.
- [ ] Não há regressão conhecida nos fluxos afetados; a evidência e os limites da validação estão registrados.
- [ ] Autorização e validação são aplicadas no servidor quando a mudança envolver acesso a dados ou operações protegidas.
- [ ] Documentação, exemplos e configuração foram atualizados quando impactados.
- [ ] Pull Request foi revisada e aprovada por pessoa diferente do autor.
- [ ] Checks exigidos pela política do repositório passaram.
- [ ] Issue relacionada, evidências, limitações e decisões pendentes estão rastreáveis.

DoD técnico não equivale a aceite do cliente, aprovação de produto ou homologação SQA. Esses estados permanecem separados e dependem de evidência própria.

## 3. Branches e commits

### 3.1 Branch principal

- `main` é a branch de integração e referência do estado integrado.
- Trabalho deve ocorrer em branch própria; não desenvolver diretamente em `main`.
- Uma branch deve tratar uma issue ou mudança coesa.
- Não reutilizar branch de trabalho encerrada para escopo sem relação.

### 3.2 Nomenclatura

Padrão recomendado: `<tipo>/issue-<número>-<resumo-curto>`.

Tipos usuais:
- `feat/` — funcionalidade.
- `fix/` — correção.
- `docs/` — documentação.
- `test/` — testes.
- `chore/` — manutenção e configuração.

Exemplo: `docs/issue-90-governanca`.

Branches já existentes não precisam ser renomeadas retroativamente.

### 3.3 Commits

- Usar mensagens curtas, no imperativo ou descrevendo a alteração.
- Preferir prefixos consistentes: `feat:`, `fix:`, `docs:`, `test:`, `chore:`.
- Quando útil, referenciar a issue: `docs: formaliza governança da issue #90`.
- Cada commit deve representar uma alteração lógica; evitar commits que misturem assuntos independentes.
- Não incluir segredos, tokens, credenciais, arquivos locais ou artefatos gerados indevidos.

## 4. Pull Requests e revisão

- Toda mudança destinada à `main` deve entrar por Pull Request.
- A PR deve apontar a issue relacionada, explicar contexto, alterações, validações e limitações.
- Manter PR focada e revisar o diff antes de solicitar revisão.
- O autor não aprova a própria PR.
- Exigir pelo menos uma aprovação de pessoa diferente do autor antes do merge.
- Solicitações de alteração devem ser resolvidas ou respondidas com justificativa antes da integração.
- Mudanças posteriores à aprovação que alterem materialmente o comportamento devem ser novamente revisadas.
- Não integrar PR com checks obrigatórios falhando, pendentes ou ausentes.
- Não usar aprovação formal de cliente, PO, liderança técnica ou QA/SQA como sinônimo de aprovação de código.

O template em `.github/PULL_REQUEST_TEMPLATE.md` deve ser usado para registrar o contexto, checklist, testes e vínculo com issue.

## 5. CI e checks

O workflow `.github/workflows/ci.yml` valida Pull Requests direcionadas à `main` e atualizações da `main`. O job **Lint, typecheck and build** executa:

1. Instalação de dependências.
2. Testes automatizados Node.js (`npm test`).
3. ESLint (`npm run lint`).
4. TypeScript (`npm run typecheck`).
5. Build Next.js (`npm run build`).

O check do job deve ser configurado como obrigatório nas regras de proteção da `main`, juntamente com a exigência de pelo menos uma aprovação e resolução das conversas de revisão. A documentação do workflow não cria essas regras por si só: a configuração depende de permissão administrativa no GitHub e deve ser conferida em Settings → Rules → Rulesets (ou Branch protection rules).

**Estado de configuração administrativa:** esta alteração não declara que proteção, aprovação obrigatória ou required status checks foram ativados. Só considerar esses controles efetivos após verificar a regra ativa aplicada à `main`.

## 6. Testes e evidências de regressão

- Cada mudança deve identificar os testes proporcionais ao risco e ao comportamento alterado.
- Correções devem incluir teste de regressão quando houver comportamento reproduzível.
- Testes unitários e de integração devem ser executados no CI quando fizerem parte da suíte do projeto.
- Build e lint aprovados demonstram validação estática e de compilação, não comprovam por si só ausência de regressões funcionais.
- Testes com serviços simulados não comprovam integração com serviços hospedados, políticas RLS reais ou comportamento ponta a ponta.
- Quando um fluxo ainda não existe, registrar essa limitação em vez de afirmar que foi testado.
- A PR deve apresentar os links dos checks e resumir o que foi e o que não foi validado.

A suíte atualmente existente cobre a camada de autorização com Supabase simulado. Ela não comprova fluxos de conversas, grupos, anexos, RLS de domínio ou integração real com Vercel/Supabase.

## 7. Comunicação e rastreabilidade

- A issue é o registro do objetivo, escopo, critérios de aceite, bloqueios e decisão de conclusão.
- A Pull Request é o registro da implementação, revisão, checks, testes e evidências.
- Mudanças de escopo ou decisões técnicas devem ser registradas na issue/PR e, quando arquiteturais, no processo de ADR existente.
- O autor comunica a abertura da PR na issue relacionada, com link e resumo da validação.
- A conclusão deve registrar o que foi entregue, o que permaneceu pendente e os links de evidência.
- Não registrar aprovação, comunicação, teste ou homologação que não tenha ocorrido.

## 8. Governança de decisões arquiteturais

As decisões arquiteturais registradas em ADRs Accepted permanecem vigentes até que uma decisão posterior seja formalmente aprovada e registrada. Uma divergência entre documentos, uma restrição de requisito, uma preocupação técnica ou uma análise de compatibilidade não altera, por si só, o status de uma ADR.

**É vedado classificar uma decisão Accepted como Deprecated, Rejected ou Superseded por inferência.** A alteração ou retirada de uma decisão exige proposta explícita, avaliação de impacto e aprovação pelas responsabilidades competentes, registrada em ADR e integrada por Pull Request.

Toda proposta de alteração deve conter, no mínimo:

- Identificação da ADR vigente e descrição precisa da decisão que se pretende alterar, com motivo e evidências verificáveis.
- Requisitos, restrições, riscos e incompatibilidades concretas que fundamentam a proposta; separar fatos demonstrados de hipóteses.
- Alternativas avaliadas, incluindo manutenção da decisão atual, mitigação/configuração e substituição, com vantagens, limitações e justificativa da opção recomendada.
- Avaliação de impacto sobre escopo e comportamento do produto, requisitos e compromissos com a FORD, dados e migração, segurança/privacidade/acessos, integrações, operação e continuidade (disponibilidade, backup, RPO/RTO e rollback), custos/contratos, cronograma/recursos, testes/homologação e documentação/backlog.
- Plano de transição e reversão, dependências, riscos residuais, responsáveis, evidências e critérios para validar a decisão proposta.
- Registro explícito de quem decidiu, papéis consultados, data, aprovação e relação entre a ADR anterior e a nova decisão.

A decisão requer manifestação do **Product Owner** quando afetar direção, escopo ou compromissos do produto; revisão do **Tech Lead** quanto à viabilidade e aos impactos técnicos; e participação da **TI/representação competente da FORD** quando houver impacto sobre infraestrutura, dados, segurança, privacidade ou operação institucional. O **SQA** avalia rastreabilidade, testabilidade, riscos e evidências, mas sua revisão não substitui a decisão de produto ou a aprovação institucional aplicável.

Somente após as aprovações necessárias e a integração da PR a ADR anterior poderá receber status Deprecated/Superseded, com referência à decisão substituta e histórico preservado. Até lá, a decisão vigente continua sendo a referência; incompatibilidades devem ser registradas como risco, bloqueio ou questão em aberto, sem reclassificação unilateral.

**Aplicação à ADR-003:** Supabase + Vercel permanece como stack adotada e obrigatória, conforme ADR-003 — Accepted, revisada em 24/11/2026. A Q-025 deve avaliar compatibilidade, configuração, modelo de uso, responsabilidades e evidências frente às restrições da FORD. Um resultado de incompatibilidade deve ser encaminhado para decisão formal com avaliação de impacto; a Q-025 não autoriza substituir ou depreciar a stack por inferência.

## 9. Limites e responsabilidades

Este procedimento formaliza o fluxo técnico e a governança de mudanças do repositório. Não designa pessoas para papéis ainda não definidos, não substitui aprovações da FORD e não resolve decisões pendentes da baseline de requisitos ou dos ADRs. Quando houver conflito, a divergência deve ser registrada e encaminhada às responsabilidades competentes; não se deve alterar unilateralmente o status de decisão Accepted.

## 10. Referências

- [Issue #77 — Epic 00](https://github.com/Aluvioz/Polychat/issues/77)
- [Issue #88 — Baseline de requisitos](https://github.com/Aluvioz/Polychat/issues/88)
- [Issue #89 — ADRs arquiteturais](https://github.com/Aluvioz/Polychat/issues/89)
- [Issue #90 — Governança do desenvolvimento](https://github.com/Aluvioz/Polychat/issues/90)
- [README do projeto](../README.md)
- [Workflow de CI](../.github/workflows/ci.yml)
- [Template de Pull Request](../.github/PULL_REQUEST_TEMPLATE.md)
