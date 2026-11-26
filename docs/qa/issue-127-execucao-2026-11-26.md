# Issue #127 — incremento de testes de autenticação e integração

Data: 26/11/2026. Base: main (commit 74eb0a348ca869175dc3f19b962043941460763d).
Escopo: incremento parcial; não equivale a homologação ou conclusão da issue.

## Resultados executados

- Antes: npm test, 49/49 PASS.
- Depois: npm test, 59/59 PASS, Node v24.22.3, ambiente Linux local.
- Novos casos 127-A01 a A10: entrada inválida, identidade ambígua/papel desconhecido, e-mail ausente, identidade divergente, indisponibilidade do provedor, refresh inválido, metadados não confiáveis, ausência de tokens, indisponibilidade durante validação e logout bem-sucedido.
- Os testes novos usam respostas HTTP simuladas, não contas reais.
- Runner SQL: bash -n PASS; sem configuração explícita de ambiente dedicado, bloqueio esperado com código 2.
- Testes SQL reais neste incremento: BLOCKED (psql não instalado no ambiente local; nenhum banco dedicado autorizado/configurado). Nenhuma migração, alteração ou fixture aplicada ao Supabase compartilhado.

## Reutilização dos testes existentes

O runner executa os quatro arquivos existentes das issues #101/#102, em processos separados, com ON_ERROR_STOP. A verificação de visibilidade de conversa direta agora lança exceção em caso de resultado incorreto, em vez de apenas imprimir false. Os scripts possuem transações e rollback; não devem ser executados em produção. Evidência histórica de #101 consta em docs/security/issue-101-rls-evidence.md; não constitui nova execução neste incremento.

## Reprodução

1. Em checkout do PR, execute npm test (CI principal já executa esse comando).
2. Em ambiente exclusivo de teste, já migrado e vazio de dados reais, configure PGHOST, PGDATABASE, PGUSER e autenticação segura via PGPASSFILE, além de PGSSLMODE apropriado ao ambiente. Não inclua credenciais em logs.
3. Defina POLYCHAT_TEST_DB_CONFIRM=dedicated-test e execute bash scripts/test-supabase-integration.sh.
4. Registre saída, versão de PostgreSQL, commit e ambiente. Qualquer erro é FAIL; ausência de ambiente é BLOCKED.

## Pendências

- Coordenação com Tech Lead/SQA sobre banco dedicado e reconciliação das migrations (#180).
- Execução SQL real, integração real de login com conta sintética provisionada e CI de integração isolada.
- Evidência de ausência de chave privilegiada no bundle cliente; testes de demais fluxos quando implementados.
- Revisão independente SQA. Não encerrar #127.
