# Visualização da galeria — Issue #93

**Endereço previsto na prévia de branch da Vercel:** https://polyford-git-docs-ponde-issue-93-design-system-polychat1.vercel.app/design-system/issue-93-galeria.html

O endereço acima depende do deployment da branch `docs/ponde-issue-93-design-system` estar disponível e de o visitante ter acesso ao projeto na Vercel, se houver proteção ativa.

Esta pasta `public/design-system/` contém **cópias exatas** dos arquivos de demonstração, para o Next.js servi-los como arquivos estáticos:
- `issue-93-galeria.html` — galeria HTML
- `issue-93-design-tokens.css` — estilos usados pela galeria

No endereço da prévia, os arquivos são esperados em:
- `/design-system/issue-93-galeria.html`
- `/design-system/issue-93-design-tokens.css`

**Diagnóstico:** links `github.com/.../blob/...html` mostram o código-fonte, não renderizam a página; os arquivos anteriores estavam em `docs/ux/`, que não é um diretório público servido pelo Next.js. A publicação em `public/` resolve o caminho de entrega da galeria sem alterar o app.

**Limite da verificação:** publicação de arquivos no PR verificada pelo GitHub. A conta conectada não tinha autorização Vercel para o team `polychat1` na hora do teste; por isso **não houve confirmação de resposta HTTP 200 ou teste visual em navegador**. O autor/revisor deve abrir o link e verificar a renderização.

**Não é homologação:** a galeria contém controles estáticos; testes de acessibilidade (Tab, Shift+Tab, zoom 200%/400%, leitor de tela, contraste não textual e múltiplos dispositivos) e validação dos ativos oficiais da Ford seguem pendentes. PR #143 permanece Draft até que as evidências sejam registradas.
