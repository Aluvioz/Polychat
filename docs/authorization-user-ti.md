# Autenticação, perfis e autorização — Polychat

**Baseline:** POLY-REQ-001 v0.4 (FORD v2)  
**ADRs relacionadas:** [ADR-004 — Autenticação e sessões](adr/ADR-004-autenticacao-sessoes.md), [ADR-006 — Autorização server-side e RLS](adr/ADR-006-autorizacao-rls.md), [ADR-003 — Direção tecnológica histórica](adr/ADR-003-supabase-vercel.md)  
**Issues relacionadas:** #100, #101 e #105  
**Status:** contrato funcional atualizado; implementação da arquitetura-alvo e revisão técnica ainda necessárias.

## 1. Perfis e identidades

Os únicos perfis de aplicação são:

- `user` — Usuário.
- `ti` — TI.

A role identifica a categoria de permissões, mas não comprova participação em conversa ou grupo. Membership é uma relação separada entre perfil e conversa. Não criar papéis adicionais como `admin`, `owner` ou `moderator`.

Todos os administradores TI possuem poderes equivalentes. Não há administrador principal nem aprovação de segundo administrador. Os riscos desse modelo foram avaliados pelo projeto e não são pendência de requisito.

## 2. Provisionamento e credenciais

- Somente TI cria contas, inclusive contas de administradores TI.
- O nome de usuário é único na organização, definido e alterável pelo TI.
- O TI cria a senha e a envia individualmente junto ao link de acesso.
- A recuperação de senha é realizada exclusivamente pelo TI.
- A FORD não exige troca obrigatória de senha no primeiro acesso, expiração periódica ou MFA para este MVP.
- Não existe cadastro aberto, autoinscrição, autoalteração de role ou convite externo.
- A desativação da conta pelo TI encerra imediatamente as sessões e revoga os acessos, preservando o histórico.
- A reativação é realizada pelo TI.

A aplicação não deve armazenar senha em texto puro. Os detalhes criptográficos, proteção de credenciais e gestão de chaves seguem os requisitos técnicos já alinhados com Desenvolvimento.

## 3. Contrato de autenticação e autorização

1. A autenticação e a gestão de sessões devem operar dentro da infraestrutura sob controle da FORD. Não utilizar provedor externo que acesse, armazene ou processe credenciais, identidades ou dados de sessão da organização.
2. A tecnologia de identidade definitiva depende da reconciliação arquitetural Q-025 e da ADR-004. A antiga direção Supabase Auth foi depreciada junto com a direção Supabase + Vercel na ADR-003.
3. O servidor valida a sessão/identidade e obtém o perfil e estado da conta de fonte confiável.
4. O navegador nunca é fonte confiável para `profile_id`, role, estado de conta ou membership.
5. Operações administrativas e de domínio devem ser autorizadas no servidor, com políticas no banco (RLS quando suportadas e adequadas à implementação) como defesa adicional.
6. A falha de autenticação, leitura de perfil, validação de participação ou consulta de autorização deve negar acesso por padrão.
7. Conhecer um identificador de conversa, mensagem, participante ou anexo não concede acesso.
8. A role `ti` concede apenas as operações administrativas confirmadas na baseline. A consulta TI a qualquer conversa é exceção funcional explícita e deve gerar auditoria; não torna o administrador participante da conversa.
9. A role `user` só permite abrir/ler conversas das quais a pessoa seja participante autorizada. Em grupos, o TI administra a inclusão e remoção dos membros; o Usuário não pode sair voluntariamente. A remoção revoga imediatamente o acesso a mensagens e anexos anteriores.
10. Interface ou restrição por dispositivo não substituem autorização server-side.

## 4. Operações administrativas que exigem autorização TI

A camada de autorização deve contemplar, conforme os requisitos:

- criar, alterar nome de usuário, desativar e reativar contas;
- criar, encerrar, desativar e reativar grupos;
- incluir e remover participantes;
- consultar qualquer conversa a qualquer momento, sem justificativa ou segunda aprovação;
- exportar conversas;
- editar e excluir mensagens;
- consultar, tratar e encerrar alertas;
- liberar anexos e baixar anexos durante investigações;
- consultar e gerenciar registros de auditoria;
- alterar configurações previstas.

As operações administrativas indicadas devem gerar os registros de auditoria previstos em RF-022 e RNF-004. Todos os administradores TI possuem o mesmo nível de poderes.

## 5. Comportamento de negação e falha

O contrato de resposta abaixo preserva o comportamento já exercitado no módulo isolado, sujeito à adaptação ao mecanismo de identidade e runtime definitivos:

| Situação | Resultado esperado |
|---|---|
| Ausência de sessão ou identidade não validada | HTTP 401; operação protegida não prossegue |
| Conta inexistente no cadastro, perfil ausente ou role inválida | HTTP 403; acesso negado |
| Conta desativada | HTTP 403; acesso negado e sessões revogadas |
| Usuário tenta operação reservada ao TI | HTTP 403 |
| Usuário tenta abrir conversa/grupo do qual não participa | Negado; não revelar dados do recurso |
| Falha de infraestrutura ao validar identidade/perfil/autorização | Erro genérico (ex.: HTTP 503); falha fechada |
| Usuário fornece role, estado ou membership no payload | Ignorar como fonte de autorização; obter os dados confiáveis no servidor |

Respostas não devem expor stack traces, tokens, chaves, detalhes internos do banco ou existência de conteúdo que o solicitante não está autorizado a acessar.

## 6. Evidência de implementação existente e limite

O repositório contém:

- `src/auth/authorization.mjs`, módulo Express-compatible que valida token por `supabase.auth.getUser(token)` e consulta `profiles`;
- `supabase/migrations/202611160001_profiles_roles_and_account_status.sql`, migration de perfil ligada a `auth.users`;
- `tests/authorization.test.mjs`, com 11 testes unitários usando Supabase simulado.

Esses artefatos representam a implementação legada vinculada à proposta Supabase. Não comprovam integração funcional com as rotas Next.js, autenticação completa na interface, aplicação de migration em ambiente homologado nem RLS de conversas, participantes, mensagens, anexos ou auditoria.

A direção Supabase + Vercel foi depreciada após a FORD v2. O módulo e a migration existentes devem ser adaptados ou substituídos quando a arquitetura de identidade e dados sob controle da FORD for definida. Não reutilizar o exemplo legado como arquitetura-alvo.

## 7. Dispositivos

- Usuário: celular Android/iOS, navegadores móveis atuais Chrome/Safari.
- TI: computador, navegadores atuais Chrome/Edge/Firefox.
- Tablets não são permitidos.

A restrição define compatibilidade de uso e experiência. User-agent, viewport ou emulação não são prova confiável de identidade ou role e não substituem a autorização.

## 8. Pendências técnicas remanescentes

- Definir a tecnologia de identidade e sessão dentro da infraestrutura FORD (Q-025/ADR-004).
- Substituir/adaptar o adaptador Supabase legado.
- Conectar autenticação e autorização aos handlers/rotas reais da aplicação.
- Implementar autorização de domínio e políticas do banco coerentes com a matriz #100 e o schema aprovado.
- Implementar revogação imediata de sessões e testar a desativação de contas.
- Executar testes de integração e isolamento na infraestrutura homologada.

Os requisitos de nome de usuário, criação/recuperação de senha pelo TI, ausência de MFA/troca obrigatória/expiração periódica, perfis e poderes equivalentes de TI estão consolidados e não são pendências de negócio.
