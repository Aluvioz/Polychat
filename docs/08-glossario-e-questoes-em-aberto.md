# 08 - Glossário e questões em aberto

## 8.1 Glossário

| Termo | Definição neste projeto |
|---|---|
| Polychat | Aplicação web de comunicação interna proposta para a FORD. |
| FORD | Organização cliente e público organizacional do sistema. |
| Usuário | Perfil para funcionários fora da área de TI; todos os cargos corporativos não alocados em TI compartilham as mesmas permissões de aplicação. |
| TI | Perfil administrativo destinado a pessoas alocadas na área de Tecnologia da Informação. |
| Grupo | Conversa coletiva criada pelo TI e composta por contas adicionadas por ele. |
| Conversa individual | Troca de mensagens entre dois usuários. |
| Mensagem suspeita | Mensagem classificada por política automática ainda a definir; pode incluir palavrões conforme lista/regra aprovada. |
| Anexo | Arquivo enviado em conversa. Os formatos informados são PDF e JPEG. |
| RNF | Requisito não funcional; descreve qualidade, restrição ou comportamento transversal do sistema. |
| RPO | Ponto de recuperação: perda máxima de dados aceitável em um cenário de recuperação. |
| RTO | Tempo objetivo para recuperação de um serviço após interrupção. |
| Primary Key | Chave primária interna usada para identificar um registro no banco de dados; não é necessariamente o identificador de login. |
| Scrum | Framework ágil informado como contexto de trabalho da equipe. |
| UML | Linguagem de modelagem usada para representar aspectos de estrutura e comportamento do sistema. |

## 8.2 Questões em aberto

| ID | Tema | Pergunta para validação | Por que importa | Responsável sugerido |
|---|---|---|---|---|
| Q-001 | Público inicial | As 25 pessoas citadas incluem os administradores de TI ou são 25 usuários finais além da equipe de TI? | Afeta criação de contas, dimensionamento e testes de carga. | Cliente / TI |
| Q-002 | Perfis e administração | Quem pode criar, alterar ou desativar contas que tenham o perfil TI? Existe administrador principal ou todos os profissionais de TI têm poderes iguais? | Evita circularidade e define controle de privilégios. | Cliente / TI |
| Q-003 | Mensagens em grupo | Usuários adicionados a um grupo podem enviar mensagens? Podem sair, remover mensagens ou solicitar remoção? | Define RF-010 e ciclo de vida do grupo. | Cliente |
| Q-004 | JPEG e câmera | JPEG será anexado apenas a partir de arquivos existentes ou o usuário pode abrir a câmera do celular? O bloqueio de “tirar fotos” deve impedir também a seleção de fotos recentes? | Há ambiguidade entre permitir JPEG e não permitir tirar fotos. | Cliente / UX |
| Q-005 | Identificador de login | O nome de usuário será e-mail institucional, matrícula, login escolhido pelo TI ou outro identificador? “Primary Key” é um identificador interno do banco e não define, por si só, a credencial apresentada ao usuário. | Afeta autenticação, unicidade e provisionamento. | Cliente / TI |
| Q-006 | Senha inicial e recuperação | Como a senha será entregue? Será temporária, expirará, deverá ser trocada no primeiro acesso? Como ocorrerá redefinição sem auto cadastro? | A entrega individual foi informada, mas canal e ciclo de vida não. | Cliente / TI / Segurança |
| Q-007 | Detecção de mensagens suspeitas | Quais termos/categorias serão monitorados? Basta uma lista de palavras, haverá análise contextual ou modelo automático? Palavrões sempre geram alerta? | Sem regra aprovada não é possível testar detecção ou controlar falsos positivos. | Cliente / Segurança |
| Q-008 | Resposta a alertas | O alerta apenas informa o TI ou bloqueia mensagem/conta? Qual severidade, prazo, responsável e fluxo de investigação? | Define consequência da sinalização. | Cliente / TI |
| Q-009 | Acesso do TI às conversas | Qual equipe/cargos de TI podem consultar qualquer conversa? É necessário motivo? A consulta fica registrada? Há notificação ao funcionário? Pode haver exportação? | Acesso irrestrito é sensível e precisa de governança. | Cliente / TI / Jurídico / Privacidade |
| Q-010 | Retenção e exclusão | Por quanto tempo mensagens, anexos, alertas e logs serão mantidos? Quem pode excluir? Mensagens apagadas continuam acessíveis ao TI? | Afeta armazenamento, auditoria e privacidade. | Cliente / Jurídico / TI |
| Q-011 | Arquivos | Qual tamanho máximo por PDF/JPEG? Há limite por usuário, conversa ou armazenamento total? Como tratar arquivos maliciosos? | Afeta arquitetura, custos e critérios de aceite. | Cliente / TI |
| Q-012 | Dispositivos | Quais sistemas operacionais e navegadores devem ser homologados? Tablets são considerados celular ou computador? Como tratar modo desktop, emuladores e telas dobráveis? | Afeta RF-017/RF-018 e RNF-005. | Cliente / TI |
| Q-013 | Segurança técnica | Quais controles são obrigatórios (por exemplo, MFA, criptografia, gestão de chaves, logs, teste de invasão, hospedagem, segregação de ambientes)? Qual modelo de ameaças deve ser considerado? | “Segurança máxima” precisa virar controles concretos e verificáveis. | Cliente / Segurança / Líder técnico |
| Q-014 | Infraestrutura e jurisdição | A solução será hospedada em infraestrutura própria ou em nuvem? Quem administra servidores, banco de dados, chaves, backups e acesso de fornecedores? | A aplicação própria ainda depende da infraestrutura escolhida. | Cliente / TI |
| Q-015 | Solicitações legais | O cliente espera ser notificado sobre solicitações legais a fornecedores ou autoridades? Qual expectativa é juridicamente possível e contratualmente suportada? | A aplicação própria não garante imunidade a ordens dirigidas à FORD ou a provedores. | Cliente / Jurídico |
| Q-016 | Carga e desempenho | Quantas sessões simultâneas, mensagens por minuto e anexos por dia devem ser suportados? Qual latência máxima aceitável, mantendo a prioridade de segurança? | 25 pessoas cadastradas não define concorrência nem metas de desempenho. | Cliente / TI |
| Q-017 | Disponibilidade e recuperação | Qual disponibilidade esperada, janela de manutenção, RPO e RTO? | Necessário para dimensionar continuidade e backup. | Cliente / TI |
| Q-018 | Fluxo e páginas | Além do login, lista de conversas, tela de conversa e funções administrativas, quais páginas são obrigatórias? Há perfil de configurações, alertas ou detalhes de grupo? | O fluxo geral foi descrito, mas o mapa de telas não. | Cliente / UX |
| Q-019 | Identidade visual | A FORD fornecerá manual de marca, logo, paleta oficial, tipografia e regras de uso? | Azul e branco são orientações, não especificação visual completa. | Cliente / Comunicação / UX |
| Q-020 | Acessibilidade | Apesar de não ser prioridade declarada, existem requisitos corporativos ou legais que devem ser respeitados? Quais públicos e recursos precisam ser considerados? | A ausência de pedido não define dispensa de obrigações aplicáveis. | Cliente / Jurídico / UX |
| Q-021 | Prazo e concorrência | Existe data limite, evento, concorrente ou marco de negócio que condicione a entrega? | Não foi informada resposta para prazo/concorrência. | Cliente / PO |
| Q-022 | Orçamento | R$ 450.000,00 é teto aprovado, estimativa ou orçamento total? Inclui infraestrutura, licenças, suporte, manutenção e operação? | O valor foi informado sem composição ou status de aprovação. | Cliente / Financeiro |
| Q-023 | Idioma e notificações | A interface será somente em português? Haverá notificação no próprio aplicativo, push ou outro mecanismo? | Não foram descritos idioma nem notificações fora do alerta de segurança. | Cliente / UX / TI |
| Q-024 | Edição e exclusão de mensagens | Usuários podem editar ou apagar mensagens? Mensagens apagadas continuam disponíveis para auditoria do TI? | O ciclo de vida da mensagem não foi especificado. | Cliente / TI |

## 8.3 Decisões e premissas que não devem ser tratadas como aprovadas

- Não está definido se a plataforma será hospedada em infraestrutura própria ou em nuvem.
- Não está definido que o sistema terá criptografia ponta a ponta; isso pode entrar em conflito com a consulta administrativa de mensagens e precisa ser arquiteturalmente analisado.
- Não está definido que os TIs poderão alterar, apagar ou exportar conversas; foi informado apenas que poderão consultá-las.
- Não está definido que mensagens suspeitas serão bloqueadas. A necessidade confirmada é gerar alertas ao TI.
- Não está definido nenhum prazo de entrega, cronograma, concorrência ou data de lançamento.
- O orçamento de R$ 450.000,00 foi informado, mas não há composição nem confirmação de aprovação.
- Não está definida a lista de sistemas operacionais ou navegadores homologados.
- Não foram selecionados tipos de diagrama UML para a nova especificação.
