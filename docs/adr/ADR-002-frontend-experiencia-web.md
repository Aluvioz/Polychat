# ADR-002 — Frontend e experiência WEB

- **Número:** ADR-002
- **Status:** Proposed
- **Data:** 16/11/2026

## Contexto
Usuários comuns devem acessar somente por celular; TI somente por computador. O produto é web, com identidade azul/branca baseada na FORD. O usuário em computador deve receber exatamente: “só pode ser usado em celular”. O repositório não apresentou `package.json` nem `vite.config.ts` na branch antiga inspecionada; portanto, não há base para declarar framework implantado.

## Problema
Escolher estratégia de frontend e aplicar restrições de experiência sem confiar em detecção de dispositivo como controle de autorização.

## Requisitos relacionados
RF-017, RF-018; RNF-005; RN-021, RN-025; Q-012, Q-018, Q-019, Q-020, Q-031.

## Alternativas consideradas
1. React + TypeScript + Vite: SPA com ecossistema amplo e build explícito; exige definir API, roteamento, sessão e hospedagem.
2. Next.js: oferece renderização híbrida e rotas integradas; adiciona convenções/runtime e não foi detectado como aplicação configurada.
3. HTML/CSS/JS ou outro framework leve: menor estrutura inicial, porém maior decisão manual sobre componentes, acessibilidade e organização.

## Decisão proposta
Adotar frontend responsivo e componentizado, com TypeScript recomendado. React + Vite é candidato preferencial para avaliação por simplicidade de SPA interna, mas não está aprovado nem deve ser instalado apenas para sanar erro de Preview. Next.js não é requisito. O frontend deve apresentar a mensagem literal para usuário comum em viewport/modo classificado como desktop e bloquear a interface de TI em contexto móvel, conforme política validada. A autorização real deve sempre ser aplicada no backend por perfil e estado da conta. Identificação de dispositivo/viewport/user-agent é apenas regra de UX e sinal de risco, nunca prova de identidade.

## Justificativa
A SPA atende fluxos autenticados e experiência mobile-first sem exigir SSR por padrão. A escolha final depende de protótipo, manutenção da equipe, integração com backend e requisitos de implantação.

## Consequências
**Positivas:** experiência diferenciada por perfil, interface consistente e menor superfície de dependências se mantida enxuta. **Negativas:** responsividade e compatibilidade exigem testes em dispositivos reais; detecção de desktop/mobile é contornável.

## Riscos
Spoofing de user-agent, viewport e emulação; exposição de dados se APIs confiarem no frontend; uso indevido de marca FORD sem manual oficial; acessibilidade insuficiente.

## Questões pendentes
Matriz de navegadores/SO homologados; tratamento de tablets, dobráveis e modo desktop; design system/logotipo oficial; requisitos de acessibilidade; escolha final do framework e política de UX para TI em celular.

## Referências
POLY-REQ-001 v0.3; RN-025; Q-012, Q-018–Q-020, Q-031; ADR-001 e ADR-006.
