# Prompt histórico — Issue #88: Consolidar baseline de requisitos e escopo MVP

> **Status:** prompt preservado como registro da execução original da Issue #88, concluída em 17/11/2026. Foi elaborado com base na visão POLYCHAT — FORD v0.1 e não deve ser reutilizado como instrução vigente para novas alterações após o questionário FORD v2. A baseline vigente é POLY-REQ-001 v0.4 (arquivo `docs/09-baseline-requisitos-mvp.md`).
>
> **Uso histórico:** referência para compreender o escopo original e a execução da Issue #88; não é autorização para reabrir a issue ou substituir os alinhamentos posteriores.
>
> **Issue:** https://github.com/Aluvioz/Polychat/issues/88  
> **Repositório:** `Aluvioz/Polychat`

## Prompt

Atue como engenheiro de software sênior, analista de requisitos e responsável pela qualidade da entrega no projeto Polychat — FORD.

Sua tarefa é executar a **Issue #88 — Consolidar baseline de requisitos e escopo MVP**, respeitando estritamente o objetivo, o escopo e os critérios de aceite descritos abaixo. Não altere o conteúdo, o título, os responsáveis, os labels ou o estado da Issue #88. O trabalho deve ocorrer nos arquivos do repositório e, quando aplicável, no código e nos testes.

### 1. Referência obrigatória da issue

**Objetivo**

Inventariar requisitos, decisões, restrições e fora de escopo; eliminar ambiguidades.

**Escopo**

- Implementar conforme arquitetura Supabase + Vercel e requisitos aprovados.
- Validar autorização server-side e comportamento de erro.
- Atualizar documentação e evidências pertinentes.

**Critérios de aceite**

- Documento aprovado; requisitos identificados e rastreáveis; mudanças com impacto registrado.
- Testes relevantes automatizados ou evidência documentada.
- Revisão por PR concluída.
- Sem regressão nos fluxos relacionados.

**Epic pai:** Epic 00.

Esses itens definem os limites da tarefa. Não crie novos objetivos, etapas obrigatórias, funcionalidades ou critérios de aceite que não decorram diretamente deles.

### 2. Fontes de informação — registro histórico

**Fonte histórica da execução original:** o documento POLYCHAT — FORD: Documento de Visão do Produto e Plano Inicial de Desenvolvimento, versão 0.1, foi utilizado na elaboração original deste prompt. Para qualquer revisão atual do produto, a fonte vigente é o questionário FORD v2 e a baseline POLY-REQ-001 v0.4; as decisões posteriores sobre Supabase e Vercel estão registradas na ADR-003 Accepted.

Consulte também a documentação já existente no repositório, especialmente:

- `docs/00-controle-do-documento.md`
- `docs/01-visao-geral-e-escopo.md`
- `docs/02-objetivos.md`
- `docs/03-requisitos-funcionais.md`
- `docs/04-requisitos-nao-funcionais.md`
- `docs/05-regras-de-negocio-e-restricoes.md`
- `docs/07-rastreabilidade-e-criterios-de-aceitacao.md`
- `docs/08-glossario-e-questoes-em-aberto.md`

Antes de editar, leia os arquivos relevantes e examine a implementação atual. Não presuma que a documentação existente está completa, atualizada ou coerente com o documento de referência.

Se houver divergência entre o documento confirmado pelo solicitante e a documentação já versionada, registre a divergência e sua localização. Não resolva conflitos inventando uma decisão nem altere silenciosamente o requisito de origem. Não transforme recomendações, deduções técnicas ou questões sem resposta em requisitos aprovados.

### 3. Trabalho a executar

#### 3.1 Inventário e consolidação

- Identifique os requisitos, decisões, restrições e itens fora de escopo presentes nas fontes autorizadas.
- Preserve os identificadores existentes de requisitos quando forem válidos e consistentes.
- Garanta que cada requisito inventariado possa ser localizado na fonte correspondente.
- Elimine ambiguidades somente quando a resposta estiver sustentada pelo documento confirmado ou por uma decisão já registrada.
- Quando não houver informação suficiente, registre a questão como não resolvida, indicando exatamente o que falta e sem preencher a lacuna por suposição.
- Registre o impacto de mudanças identificadas sobre requisitos, documentação, implementação e testes relacionados.

#### 3.2 Arquitetura Supabase + Vercel

- Considere Supabase + Vercel como a arquitetura indicada no escopo da Issue #88.
- Examine a implementação existente e verifique se ela está alinhada a essa arquitetura e aos requisitos aprovados.
- Não substitua tecnologias, introduza serviços ou redesenhe a arquitetura por preferência pessoal.
- Se encontrar incompatibilidade ou decisão técnica que exija aprovação, documente o fato, o impacto e a decisão necessária; não a apresente como aprovada.

#### 3.3 Autorização server-side e comportamento de erro

- Examine os fluxos existentes que dependem de autenticação e autorização.
- Verifique se as decisões de autorização relevantes são aplicadas no servidor, e não apenas escondidas ou bloqueadas na interface.
- Verifique se erros relevantes são tratados de forma consistente, sem expor informações internas ou permitir que uma falha seja interpretada como autorização.
- Implemente correções somente quando forem necessárias para atender aos requisitos confirmados e ao escopo da issue.
- Adicione ou ajuste testes automatizados pertinentes e registre evidências para os comportamentos que não puderem ser automatizados.

#### 3.4 Documentação e evidências

- Atualize a documentação existente em vez de criar documentos duplicados sem necessidade.
- Organize os requisitos de modo que seja possível rastrear cada item até sua fonte e, quando aplicável, até a implementação e os testes correspondentes.
- Registre decisões, restrições, itens fora de escopo e mudanças com impacto identificado.
- Diferencie claramente conteúdo confirmado, derivação técnica, recomendação e informação ainda não resolvida.
- Mantenha consistência entre os documentos relacionados e os artefatos efetivamente implementados.

### 4. Limites e cuidados

- Não modifique a Issue #88 no GitHub.
- Não altere issues relacionadas nem encerre a issue.
- Não amplie o MVP com funcionalidades não descritas nas fontes aprovadas.
- Não invente requisitos, regras de negócio, decisões arquiteturais, políticas ou critérios de aceite.
- Não considere uma funcionalidade concluída apenas porque existe uma tela ou componente visual; verifique o comportamento real pertinente ao escopo.
- Não remova comportamento existente sem demonstrar sua incompatibilidade com os requisitos confirmados e registrar o impacto.
- Evite refatorações ou mudanças fora do escopo que não sejam necessárias para concluir esta issue.
- Preserve os padrões, convenções e estrutura já adotados pelo repositório.
- Não declare testes, revisões ou aprovações que não tenham sido efetivamente executados.

### 5. Validação da entrega

Antes de concluir:

1. Execute os testes relevantes para os fluxos afetados.
2. Registre os comandos executados e seus resultados.
3. Verifique se a documentação está coerente com os requisitos inventariados e com o comportamento implementado.
4. Confirme que os requisitos estão identificados e rastreáveis.
5. Registre as mudanças e seus impactos.
6. Verifique se não houve regressão nos fluxos relacionados.
7. Prepare as alterações em branch e Pull Request para revisão; não declare a revisão concluída antes de ela ocorrer.

### 6. Resultado esperado

Entregue:

- Baseline documental consolidada, com requisitos, decisões, restrições e fora de escopo inventariados.
- Rastreabilidade entre requisitos e suas fontes e, quando aplicável, implementação e testes.
- Registro das ambiguidades que permanecerem sem resposta, sem decisões inventadas.
- Correções necessárias, dentro do escopo, para alinhamento à arquitetura Supabase + Vercel e validação de autorização server-side e comportamento de erro.
- Testes automatizados relevantes e/ou evidências documentadas.
- Registro das mudanças e de seus impactos.
- Pull Request preparado para revisão.

Ao final, apresente um resumo objetivo contendo: arquivos alterados, requisitos/documentos consolidados, ajustes de implementação realizados, testes executados e resultados, evidências produzidas, pendências que dependem de decisão e link do Pull Request.

**A Issue #88 deve permanecer exatamente como está.**
