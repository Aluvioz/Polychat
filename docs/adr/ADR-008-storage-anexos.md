# ADR-008 — Armazenamento privado e anexos

- **Status:** Proposed
- **Data de revisão:** 19/11/2026
- **Issues relacionadas:** #89, #115, #116 e #117
- **Baseline:** POLY-REQ-001 v0.4

## Contexto

A FORD v2 confirma anexos exclusivamente em PDF e JPEG, com limite de 10 MB por arquivo e até 5 arquivos por mensagem. O TI define limites individuais e a capacidade total de armazenamento; não existe quota por conversa. PDF protegido por senha não é aceito. JPEG deve ser selecionado da galeria, sem captura pela câmera, e os metadados EXIF/GPS devem ser removidos.

A análise antimalware deve ocorrer no fluxo controlado do Polychat, integrado ao armazenamento privado Supabase Storage, sem encaminhar arquivos a scanners/SaaS externos não aprovados. Se o scanner falhar, estiver indisponível ou retornar resultado inconclusivo, o anexo permanece bloqueado; o envio de texto continua funcionando. O TI pode liberar qualquer arquivo e também baixar anexos durante investigações. Usuários não podem contornar a análise.

Supabase é uma plataforma oficial do Polychat (ADR-003). Supabase Storage pode ser utilizado como armazenamento de anexos, desde que configurado como privado e integrado aos controles de autorização, antimalware, retenção e revogação definidos neste documento.

O repositório não comprova implementação de armazenamento privado, fluxo completo de upload/download ou integração antimalware. A política funcional do produto, entretanto, está consolidada na baseline e nos alinhamentos com Desenvolvimento.

## Problema

Armazenar, analisar e entregar anexos sem expor objetos publicamente ou permitir acesso fora das permissões da conversa. O Supabase Storage é a plataforma oficial de armazenamento; o scanner deve integrar o fluxo controlado do Polychat, sem encaminhar arquivos/metadados a fornecedores de análise adicionais não aprovados.

## Alternativas consideradas

1. **Supabase Storage:** plataforma oficial para objetos privados, com segregação de ambientes e integração server-side.
2. **Armazenamento de arquivos em infraestrutura corporativa separada:** não é a direção selecionada; qualquer mudança futura exige ADR substitutiva.
3. **Armazenamento em banco relacional:** não é a opção preferencial para bytes de arquivos; o banco deve manter metadados e vínculos necessários.
4. **Outro serviço de storage:** não aprovado para o projeto sem decisão explícita.

## Decisão proposta

Adotar **Supabase Storage** como plataforma oficial de armazenamento de anexos, com buckets privados, autorização server-side e URLs temporárias de no máximo 5 minutos. O arquivo só pode ser disponibilizado após resultado antimalware limpo ou após liberação excepcional pelo TI, autenticada e auditada. Falha/inconclusão mantém o anexo bloqueado no fluxo normal; a liberação administrativa não altera o resultado do scanner. A configuração de região e os vínculos de ambiente serão documentados conforme as evidências já existentes e Q-025.

### Regras funcionais consolidadas

- Aceitar somente PDF e JPEG.
- Limitar cada arquivo a 10 MB e cada mensagem a, no máximo, 5 arquivos.
- Aplicar quotas individuais e capacidade total configuradas pelo TI, sem limite específico por conversa.
- Rejeitar PDF protegido por senha.
- Permitir seleção de JPEG existente na galeria; a aplicação não oferece captura de foto pela câmera.
- Remover metadados EXIF, inclusive GPS/localização, antes da disponibilização.
- Validar o arquivo recebido e submetê-lo ao scanner antimalware integrado ao fluxo oficial, antes de liberar acesso ao objeto armazenado no Supabase Storage.
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

Supabase Storage é a plataforma oficial de armazenamento. A FORD mantém governança sobre contas, acessos, configurações e retenção. O scanner antimalware deve integrar o fluxo próprio do Polychat; não enviar arquivos, conteúdo, metadados ou identificadores a outros serviços externos para varredura, conversão, extração ou análise.

Bibliotecas e atualizações sem acesso a dados da FORD podem ser utilizadas conforme as regras técnicas e de segurança aplicáveis.

## Justificativa

Armazenamento privado e autorização por requisição preservam o vínculo entre arquivo, mensagem, conversa e participantes. A análise antimalware controlada pelo projeto e a indisponibilidade segura do anexo atendem às regras da FORD sem interromper a comunicação textual. A utilização do Supabase Storage não elimina a necessidade de verificar permissões, privacidade do bucket e ausência de acesso público.

## Consequências

**Positivas:**
- Consistência com a stack oficial Supabase/Vercel e com a governança de dados, acesso e configuração definida pela FORD.
- Controle de acesso por conversa e revogação após remoção de participante.
- Análise antimalware sem exposição a serviços externos.
- Regras de limite, retenção e operação coerentes com a baseline v0.4.

**Negativas e cuidados:**
- A FORD/equipe precisa administrar permissões, quotas, liberação, retenção e evidências; Desenvolvimento precisa integrar e monitorar o scanner e o fluxo de upload/download conforme os recursos e limites do Supabase Storage.
- A implementação demanda fluxo de quarentena, liberação administrativa, autorização por download e revogação efetiva.
- Testes devem cobrir falhas do scanner, acesso indevido, remoção de participante, restauração e descarte.

## Riscos

Objeto público por configuração incorreta; URL vazada; link não revogado após remoção; bypass por usuário; liberação administrativa sem auditoria; malware não detectado; scanner indisponível; arquivo corrompido ou incompatível; metadados GPS preservados; backups contendo dados já excluídos até o fim do ciclo; integração externa que acesse dados da FORD.

## Evidências e estado atual

- A baseline POLY-REQ-001 v0.4 e os documentos 01, 03, 04 e 05 registram tipos, limites, fluxo antimalware, comportamento em falha, quotas, links, retenção e poderes do TI.
- A migration e o middleware Supabase existentes não comprovam implementação de storage.
- Não foram identificados bucket privado, handlers completos de upload/download ou integração antimalware funcional na main.
- A política de anexos documenta regras e cenários; sua presença não comprova implementação nem testes de ponta a ponta.

## Pendências para Accepted

- Validar a configuração privada do Supabase Storage, região, políticas de acesso, URLs temporárias, retenção e integração antimalware (Q-025).
- Definir a integração do scanner interno, quarentena, liberação administrativa e monitoramento operacional.
- Implementar e testar autorização em upload e em cada download, revogação imediata e links temporários de até 5 minutos.
- Evidenciar remoção de EXIF/GPS e rejeição de PDF protegido por senha.
- Homologar backup, restauração, retenção e descarte no ambiente aprovado.

Os limites de arquivo, quantidade por mensagem, quotas individuais e total, ausência de quota por conversa, comportamento fail-closed, formatos, retenção, scanner interno e responsabilidades do TI são requisitos consolidados; não devem ser reabertos como pendências de produto nesta ADR.
