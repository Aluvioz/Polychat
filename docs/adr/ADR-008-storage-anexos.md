# ADR-008 — Armazenamento privado e anexos

- **Status:** Proposed
- **Data de revisão:** 26/11/2026
- **Issues relacionadas:** #89, #115, #116 e #117
- **Baseline:** POLY-REQ-001 v0.5

## Contexto

A FORD v2 confirma anexos exclusivamente em PDF e JPEG, com limite de 10 MB por arquivo e até 5 arquivos por mensagem. O TI define limites individuais e a capacidade total de armazenamento; não existe quota por conversa. PDF protegido por senha não é aceito. JPEG deve ser selecionado da galeria, sem captura pela câmera, e os metadados EXIF/GPS devem ser removidos.

A análise antimalware deve ocorrer dentro da infraestrutura da FORD. Se o scanner falhar, estiver indisponível ou retornar resultado inconclusivo, o anexo permanece bloqueado; o envio de texto continua funcionando. O TI pode liberar qualquer arquivo e também baixar anexos durante investigações. Usuários não podem contornar a análise.

A ADR-003 mantém Supabase + Vercel como stack adotada e obrigatória, e Supabase Storage é o componente de armazenamento previsto nessa plataforma. Esta ADR detalha a proposta de armazenamento privado, os controles de acesso e a integração com anexos. A Q-025 registra a avaliação da configuração e das condições operacionais da stack; não reabre a escolha do Supabase Storage nem declara sua integração ou homologação concluída.

O repositório não comprova implementação de armazenamento privado, fluxo completo de upload/download ou integração antimalware. A política funcional do produto, entretanto, está consolidada na baseline e nos alinhamentos com Desenvolvimento.

## Problema

Armazenar, analisar e entregar anexos por meio do Supabase Storage previsto na stack adotada, sem expor objetos publicamente e sem permitir acesso fora das permissões da conversa; a integração antimalware deve seguir os requisitos funcionais e as responsabilidades estabelecidas.

## Alternativas consideradas

1. **Supabase Storage com objetos privados:** componente de armazenamento previsto na plataforma Supabase adotada. É a direção considerada nesta proposta, com configuração de buckets privados, autorização server-side, segregação de ambientes e integração com o fluxo de anexos.
2. **Armazenamento autogerenciado em infraestrutura corporativa:** não é a direção selecionada nesta stack. Só deve ser considerado mediante necessidade demonstrada, avaliação de impacto e decisão formal de mudança arquitetural.
3. **Armazenamento em banco relacional:** não é a opção preferencial para bytes de arquivos; o banco deve manter metadados e vínculos necessários.
4. **Outro serviço de armazenamento fora da stack adotada:** não selecionado. Sua inclusão dependeria de justificativa, avaliação e decisão formal; não decorre de uma proibição genérica aos serviços gerenciados.

## Decisão proposta

Utilizar **Supabase Storage como componente previsto para o armazenamento privado de anexos** na stack adotada pela ADR-003. A solução deve manter objetos privados, autorização server-side por conversa e participante, revogação de acesso e integração com o fluxo antimalware definido na baseline. Esta ADR permanece Proposed: buckets, políticas, links, backups, integração do scanner, controles e evidências devem ser detalhados e revisados por Tech Lead e TI; a Q-025 registra as condições operacionais da configuração. Esta proposta não declara integração concluída nem homologação de produção.

### Regras funcionais consolidadas

- Aceitar somente PDF e JPEG.
- Limitar cada arquivo a 10 MB e cada mensagem a, no máximo, 5 arquivos.
- Aplicar quotas individuais e capacidade total configuradas pelo TI, sem limite específico por conversa.
- Rejeitar PDF protegido por senha.
- Permitir seleção de JPEG existente na galeria; a aplicação não oferece captura de foto pela câmera.
- Remover metadados EXIF, inclusive GPS/localização, antes da disponibilização.
- Validar o arquivo recebido e submetê-lo ao scanner antimalware executado na infraestrutura da FORD.
- Manter o anexo indisponível até resultado favorável da análise. Falha, indisponibilidade, timeout ou resultado inconclusivo não equivalem a arquivo seguro e mantêm o anexo bloqueado.
- A indisponibilidade do scanner não bloqueia o envio de mensagens de texto.
- O TI pode liberar qualquer arquivo por ação administrativa. A ação deve ser autenticada e registrada em auditoria; usuários comuns não podem executar bypass ou alterar o estado da análise.
- O TI pode baixar anexos durante investigações, com registro de auditoria.
- O acesso deve ser privado e condicionado à autorização vigente do usuário para a conversa e o anexo.
- Links temporários podem ter validade máxima de 5 minutos. A remoção de participante deve revogar imediatamente seu acesso, inclusive por links previamente emitidos; o tempo máximo do link não substitui a verificação de autorização/revogação.
- Não utilizar URLs públicas permanentes nem expor o caminho físico do objeto.

### Retenção, descarte e backup

- Anexos não sofrem exclusão automática enquanto o sistema estiver em operação.
- Exclusão depende de autorização do TI, observadas investigações e preservação administrativa.
- Backups são diários e retidos por 12 meses.
- Após uma exclusão autorizada, o dado deixa as cópias de backup ao final do ciclo de retenção definido; o descarte deve ser registrado em auditoria.
- Metadados e eventos de auditoria seguem as regras de retenção consolidadas nos requisitos.

### Fronteira de processamento

O armazenamento de objetos é previsto no Supabase Storage, com configuração privada e controles de acesso apropriados. O scanner antimalware deve executar na infraestrutura da FORD, conforme requisito funcional consolidado. A integração deve limitar o tráfego aos componentes necessários para o fluxo autorizado; não encaminhar arquivos, conteúdo ou metadados a serviços adicionais de varredura, conversão, extração ou análise que não tenham sido avaliados e aprovados.

Bibliotecas e atualizações sem acesso a dados da FORD podem ser utilizadas conforme as regras técnicas e de segurança aplicáveis.

## Justificativa

O Supabase Storage, configurado para manter objetos privados, permite integrar os anexos ao restante da stack adotada e aplicar autorização por requisição, preservando o vínculo entre arquivo, mensagem, conversa e participantes. A análise antimalware na infraestrutura da FORD e o comportamento fail-closed mantêm as regras funcionais sem interromper a comunicação textual.

## Consequências

**Positivas:**
- Utilização do componente Supabase Storage previsto na stack adotada, com configuração privada e controles de acesso sujeitos à revisão técnica e à avaliação operacional da Q-025.
- Controle de acesso por conversa e revogação após remoção de participante.
- Integração do scanner antimalware executado na infraestrutura da FORD, sem encaminhamento do conteúdo a serviços adicionais não aprovados.
- Regras de limite, retenção e operação coerentes com a baseline v0.5.

**Negativas e cuidados:**
- A equipe precisa configurar e monitorar políticas de acesso, capacidade, disponibilidade, backup e integração entre Supabase Storage e o scanner antimalware operado na infraestrutura da FORD, respeitando as responsabilidades do serviço gerenciado.
- A implementação demanda fluxo de quarentena, liberação administrativa, autorização por download e revogação efetiva.
- Testes devem cobrir falhas do scanner, acesso indevido, remoção de participante, restauração e descarte.

## Riscos

Objeto público por configuração incorreta; URL vazada; link não revogado após remoção; bypass por usuário; liberação administrativa sem auditoria; malware não detectado; scanner indisponível; arquivo corrompido ou incompatível; metadados GPS preservados; backups contendo dados já excluídos até o fim do ciclo; integração adicional não aprovada com acesso a dados ou anexos da FORD.

## Evidências e estado atual

- A baseline POLY-REQ-001 v0.5 e os documentos 01, 03, 04 e 05 registram tipos, limites, fluxo antimalware, comportamento em falha, quotas, links, retenção e poderes do TI.
- A migration e o middleware Supabase existentes não comprovam implementação de armazenamento de anexos nem integração funcional com Supabase Storage.
- Não foram identificados bucket privado, handlers completos de upload/download ou integração antimalware funcional na main.
- A política de anexos documenta regras e cenários; sua presença não comprova implementação nem testes de ponta a ponta.

## Pendências para Accepted

- Detalhar e validar a configuração privada do Supabase Storage na stack adotada, incluindo buckets, políticas de acesso, links temporários, segregação de ambientes, backup e integração com autorização server-side; registrar evidências operacionais pertinentes na Q-025.
- Definir a integração do scanner interno, quarentena, liberação administrativa e monitoramento operacional.
- Implementar e testar autorização em upload e em cada download, revogação imediata e links temporários de até 5 minutos.
- Evidenciar remoção de EXIF/GPS e rejeição de PDF protegido por senha.
- Homologar backup, restauração, retenção e descarte no ambiente aprovado.

Os limites de arquivo, quantidade por mensagem, quotas individuais e total, ausência de quota por conversa, comportamento fail-closed, formatos, retenção, scanner interno e responsabilidades do TI são requisitos consolidados; não devem ser reabertos como pendências de produto nesta ADR.
