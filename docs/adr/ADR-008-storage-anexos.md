# ADR-008 — Armazenamento privado e anexos

- **Status:** Accepted
- **Data de revisão:** 24/11/2026
- **Issues relacionadas:** #89, #115, #116 e #117
- **Baseline:** POLY-REQ-001 v0.5

## Contexto

A FORD v2 confirma anexos exclusivamente em PDF e JPEG, com limite de 10 MB por arquivo e até 5 arquivos por mensagem. O TI define limites individuais e a capacidade total de armazenamento; não existe quota por conversa. PDF protegido por senha não é aceito. JPEG deve ser selecionado da galeria, sem captura pela câmera, e os metadados EXIF/GPS devem ser removidos.

A análise antimalware deve ocorrer dentro da infraestrutura da FORD. Se o scanner falhar, estiver indisponível ou retornar resultado inconclusivo, o anexo permanece bloqueado; o envio de texto continua funcionando. O TI pode liberar qualquer arquivo e também baixar anexos durante investigações. Usuários não podem contornar a análise.

A ADR-003 mantém Supabase + Vercel como stack adotada e obrigatória. A Q-025 foi concluída em 24/11/2026 com aprovação expressa da TI e da FORD para o uso dos serviços Supabase, inclusive Supabase Storage, e da Vercel dentro dos limites e controles registrados para o Polychat. A aprovação dos provedores nomeados não autoriza compartilhar dados com outros serviços externos sem decisão específica.

O repositório não comprova implementação de armazenamento privado, fluxo completo de upload/download ou integração antimalware. A política funcional do produto, entretanto, está consolidada na baseline e nos alinhamentos com Desenvolvimento.

## Problema

Armazenar, analisar e entregar anexos em armazenamento privado, sem exposição pública nem acesso fora das permissões da conversa, utilizando os provedores nomeados e aprovados na Q-025 e sem encaminhar arquivos ou metadados a outros serviços externos.

## Alternativas consideradas

1. **Armazenamento de objetos privado sob controle da FORD:** opção preferencial a avaliar, com segregação de ambientes e integração com a aplicação server-side.
2. **Armazenamento de arquivos em infraestrutura corporativa controlada pela FORD:** alternativa a validar conforme capacidade, disponibilidade, backup e operação.
3. **Armazenamento em banco relacional:** não é a opção preferencial para bytes de arquivos; o banco deve manter metadados e vínculos necessários.
4. **Supabase Storage:** capacidade de armazenamento aprovada pela TI e pela FORD como parte da stack nomeada na ADR-003, sob configuração privada, segregação de ambientes, controle de acesso e operação definidos nesta ADR e na Q-025.

## Decisão

Adotar **Supabase Storage como capacidade de armazenamento privado de anexos** na stack Supabase + Vercel. A TI e a FORD aprovaram o uso do serviço na Q-025 em 24/11/2026, condicionado aos controles definidos nesta ADR: bucket/objetos privados, autorização server-side, segregação por ambiente, emissão controlada de links temporários, revogação de acesso, scanner antimalware interno e proteção de backups. A decisão aprova a arquitetura-alvo; não declara que a implementação funcional do Storage já esteja concluída.

### Registro de aprovação

**Aprovadores funcionais:** TI e representante da FORD.  
**Data:** 24/11/2026.  
**Referência:** Q-025 — Compatibilidade da stack Supabase + Vercel, concluída.  
**Resultado:** Supabase Storage aprovado como provedor nomeado de armazenamento privado do Polychat. A análise antimalware permanece dentro da infraestrutura e responsabilidade operacional da TI; não há autorização para scanner SaaS ou serviço externo de análise.

A aprovação é da direção arquitetural e do modelo operacional. Bucket, handlers, políticas de acesso, scanner, revogação efetiva de links e testes de ponta a ponta continuam sendo entregas de implementação e homologação nas issues correspondentes.

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

O storage, o scanner antimalware, o processamento de metadados, a emissão/revogação de links, os backups e os logs relacionados devem permanecer sob controle da FORD. Não enviar arquivos, conteúdo, metadados ou identificadores a serviços externos para varredura, conversão, extração, análise ou armazenamento.

Bibliotecas e atualizações sem acesso a dados da FORD podem ser utilizadas conforme as regras técnicas e de segurança aplicáveis.

## Justificativa

Armazenamento privado e autorização por requisição preservam o vínculo entre arquivo, mensagem, conversa e participantes. A análise antimalware interna e a indisponibilidade segura do anexo atendem às regras da FORD sem interromper a comunicação textual. A execução sob controle da organização é obrigatória diante da proibição de terceiros processarem ou armazenarem dados.

## Consequências

**Positivas:**
- Conformidade da direção de arquitetura com a stack Supabase + Vercel expressamente aprovada pela FORD na Q-025.
- Controle de acesso por conversa e revogação após remoção de participante.
- Análise antimalware sem exposição a serviços externos.
- Regras de limite, retenção e operação coerentes com a baseline v0.4.

**Negativas e cuidados:**
- TI responde pela operação e monitoramento de Storage, scanner, capacidade, disponibilidade e backups.
- A implementação demanda fluxo de quarentena, liberação administrativa, autorização por download e revogação efetiva.
- Testes devem cobrir falhas do scanner, acesso indevido, remoção de participante, restauração e descarte.

## Riscos

Objeto público por configuração incorreta; URL vazada; link não revogado após remoção; bypass por usuário; liberação administrativa sem auditoria; malware não detectado; scanner indisponível; arquivo corrompido ou incompatível; metadados GPS preservados; backups contendo dados já excluídos até o fim do ciclo; integração externa que acesse dados da FORD.

## Evidências e estado atual

- A baseline POLY-REQ-001 v0.5 e os documentos 01, 03, 04 e 05 registram tipos, limites, fluxo antimalware, comportamento em falha, quotas, links, retenção e poderes do TI.
- As migrations da #99 criam metadados de anexos e restrições no banco, mas não comprovam bucket privado, handlers de upload/download ou integração funcional com Supabase Storage.
- Não foram identificados bucket privado, handlers completos de upload/download ou integração antimalware funcional na main.
- A política de anexos documenta regras e cenários; sua presença não comprova implementação nem testes de ponta a ponta.

## Trabalho de implementação remanescente

- Configurar e implementar bucket privado e integração server-side de upload/download.
- Integrar o scanner interno, quarentena, liberação administrativa e monitoramento operacional.
- Implementar e testar autorização em upload e em cada download, revogação imediata e links temporários de até 5 minutos.
- Implementar remoção de EXIF/GPS e rejeição de PDF protegido por senha.
- Executar os testes de backup, restauração, retenção e descarte conforme plano operacional.

Essas entregas não condicionam a aprovação arquitetural da ADR-008 nem reabrem a Q-025; permanecem critérios de implementação e homologação do produto.

Os limites de arquivo, quantidade por mensagem, quotas individuais e total, ausência de quota por conversa, comportamento fail-closed, formatos, retenção, scanner interno e responsabilidades do TI são requisitos consolidados; não devem ser reabertos como pendências de produto nesta ADR.
