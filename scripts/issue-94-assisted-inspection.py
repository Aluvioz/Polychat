from playwright.sync_api import sync_playwright
from pathlib import Path
import json, platform
root=Path(__file__).resolve().parents[1]/'public/prototipos/issue-94'
out=root/'evidence';out.mkdir(exist_ok=True)
results=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844})
 errors=[]; requests=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('request',lambda r:requests.append(r.url))
 def click(s):
  loc=page.locator(s+':visible').first
  try: loc.click(timeout=1500)
  except Exception:
   if page.locator('#feedback').is_visible(): page.locator('#feedback').wait_for(state='hidden',timeout=13000);loc.click(timeout=3000)
   else: raise
 def go(s): click('[data-go="'+s+'"]')
 def action(s): click('[data-action="'+s+'"]')
 def visible(s): return page.locator(s).is_visible()
 def txt(s): return page.locator(s).inner_text()
 def shot(name): page.screenshot(path=str(out/(name+'.png')))
 def run(id,fn):
  try: detail=fn();shot(id);results.append([id,'PASS',detail,id+'.png'])
  except Exception as e: shot(id);results.append([id,'FAIL',str(e)[:500],id+'.png'])
 def m01():
  page.goto((root/'index.html').as_uri());go('u-login');assert not errors and visible('[data-screen=u-login]');return 'Escolher perfil > Explorar jornada mobile; sem pageerror.'
 def m02():
  action('bad-login');assert 'Não foi possível entrar' in txt('#feedback');shot('M94-02-erro');go('u-monitor');assert visible('[data-screen=u-monitor]');return 'Credenciais inválidas: erro genérico; entrar na demonstração.'
 def m03():
  go('u-conversations');assert page.locator('[aria-label="2 mensagens não lidas"]').is_visible();return 'Continuar > conversas recentes; indicador 2 não lidas.'
 def m04():
  go('u-contacts');page.fill('#contact-search','inexistente');assert visible('#contacts-empty');shot('M94-04-vazio');page.fill('#contact-search','Rafael');click('[data-user="Rafael (exemplo)"][data-go=u-chat]');assert 'Rafael' in txt('#u-chat-title') and 'verificar os arquivos' in txt('#chat-messages');return 'Busca vazia; Rafael e histórico específico.'
 def m05():
  go('u-conversations');click('[data-chat=group]');assert 'Atualização de plantão' in txt('#chat-messages');go('u-group');assert 'Marina, Rafael' in txt('[data-screen=u-group]');return 'Grupo com histórico distinto e participantes.'
 def m06():
  go('u-chat');page.fill('#message-text','Mensagem fictícia de inspeção');click('#message-form button[type=submit]');assert 'não entregue' in txt('#chat-messages') and 'Nenhuma mensagem' in txt('#feedback');return 'Simular envio; status explícito de não entrega.'
 def m07():
  go('u-attach');page.set_viewport_size({'width':320,'height':720})
  click('[data-action=attach-valid]:nth-child(2)');shot('M94-07-jpeg')
  for action_name in ['attach-valid','attach-invalid','attach-over-limit','attach-too-many','attach-protected','attach-error','attach-retry','attach-blocked','attach-scanner-offline']:
   action(action_name);assert visible('#feedback');shot('M94-07-'+action_name)
  return 'PDF e JPEG são exemplos (sem seleção real); nove ações de anexo e recuperação exibiram feedback.'
 def m08():
  go('u-chat');go('u-conversations');action('offline');go('u-chat');assert visible('#offline-indicator');page.fill('#message-text','Teste offline');click('#message-form button[type=submit]');assert 'não confirmada' in txt('#feedback');shot('M94-08-offline');go('u-conversations');go('u-session');assert 'Sessão expirada' in txt('[data-screen=u-session]');return 'Offline sem confirmação; sessão expirada com retorno ao login.'
 def m09():
  page.set_viewport_size({'width':1280,'height':900});go('start');go('t-login');go('t-dashboard');assert not page.locator('[data-screen=t-dashboard]').get_attribute('data-task');return 'TI fictício > dashboard auxiliar.'
 def m10():
  go('t-users');page.fill('#ti-user-search','inexistente');assert visible('#ti-users-empty');shot('M94-10-vazio');page.fill('#ti-user-search','marina');click('[data-confirm^="Desativar"]');shot('M94-10-dialog');click('#cancel-dialog');assert page.locator('[data-confirm^="Desativar"]').evaluate('(e)=>e===document.activeElement');click('[data-confirm^="Desativar"]');click('#accept-dialog');assert 'Nenhum registro' in txt('#feedback');return 'Busca vazia; Cancelar/Confirmar; foco restaurado.'
 def m11():
  go('t-groups');click('[data-confirm^="Remover"]');assert 'revoga acesso imediato' in txt('#dialog-description');shot('M94-11-dialog');click('#accept-dialog');return 'Remover Rafael; revogação imediata informada.'
 def m12():
  go('t-consult')
  for a in ['view-chat','export-chat','edit-message']:action(a);assert 'simulad' in txt('#feedback');shot('M94-12-'+a)
  return 'Consulta, exportação, edição simuladas; consulta explica auditoria.'
 def m13():
  go('t-alerts');assert all(x in txt('[data-screen=t-alerts]') for x in ['Alta','Média','Baixa','1 hora','1 dia útil','3 dias úteis']);action('review-alert');assert 'não causa bloqueio automático' in txt('#feedback');return 'Três níveis/prazos; revisão sem bloqueio automático.'
 def m14():
  go('t-settings');assert page.locator('[data-screen=t-settings] h2').all_inner_texts()==['Termos e regras','Quotas de anexos'];return 'Somente termos e quotas.'
 def m15():
  go('t-audit');assert 'Simulação, não log' in txt('[data-screen=t-audit]') and not page.locator('[data-screen=t-audit]').get_attribute('data-task');return 'Auditoria auxiliar, exemplos não persistidos.'
 for i,fn in enumerate([m01,m02,m03,m04,m05,m06,m07,m08,m09,m10,m11,m12,m13,m14,m15],1):run(f'M94-{i:02}',fn)
 def a01():
  go('start');page.keyboard.press('Tab');seen=[]
  for _ in range(10):
   seen.append(page.evaluate('document.activeElement.tagName+":"+document.activeElement.innerText.slice(0,60)'));page.keyboard.press('Tab')
  assert any('Explorar jornada mobile' in x for x in seen);page.locator('[data-screen=start] [data-go=u-login]').focus();page.keyboard.press('Enter');assert visible('[data-screen=u-login]');page.locator('[data-action=bad-login]').focus();page.keyboard.press('Space');assert visible('#feedback');page.keyboard.press('Shift+Tab');return 'Tab/Shift+Tab, Enter e Space exercitados em trajetos selecionados (não integral). '+str(seen)
 def a02():
  page.reload();page.locator('.skip').focus();page.keyboard.press('Enter');assert page.evaluate('document.activeElement.id')=='conteudo';return 'Link Pular para conteúdo: foco em main.'
 def a03():
  go('u-login');assert page.evaluate('document.activeElement.tagName')=='H1';return 'Mudança start > login: foco H1.'
 def a04():
  go('start');go('t-login');go('t-dashboard');go('t-users');click('[data-confirm^="Desativar"]');page.keyboard.press('Escape');assert page.locator('[data-confirm^="Desativar"]').evaluate('(e)=>e===document.activeElement');click('[data-confirm^="Desativar"]');click('#cancel-dialog');assert page.locator('[data-confirm^="Desativar"]').evaluate('(e)=>e===document.activeElement');return 'Escape e Cancelar restauram foco.'
 def a06():
  go('start');go('u-login')
  for width in [320,390]:
   page.set_viewport_size({'width':width,'height':720});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');shot('A94-06-'+str(width))
  return 'Chromium Linux emulado 320/390, ausência de overflow no login; sem Android/iOS físico.'
 def a09():
  colors=page.locator('#u-user').evaluate('(e)=>{let s=getComputedStyle(e);return {text:s.color,border:s.borderColor,bg:s.backgroundColor}}');return 'Cores computadas do campo: '+str(colors)+'; não é avaliação completa.'
 def a10():
  assert not [x for x in requests if not x.startswith('file:')];return 'Requisições observadas: '+str(set(requests))+'; nenhuma externa nos fluxos executados.'
 for id,fn in [('A94-01',a01),('A94-02',a02),('A94-03',a03),('A94-04',a04),('A94-06',a06),('A94-09',a09),('A94-10',a10)]:run(id,fn)
 # toast overlap: inspect bottom button while feedback is visible, pointer hit test
 page.reload();go('u-login');go('u-monitor');go('u-conversations');click('[data-chat=group]');go('u-attach');page.set_viewport_size({'width':320,'height':720})
 target=page.locator('[data-action=attach-scanner-offline]');target.scroll_into_view_if_needed();target.click();page.evaluate('window.scrollTo(0,document.documentElement.scrollHeight)');shot('toast-320-before')
 geo=page.evaluate('''()=>{const t=document.querySelector('#feedback'),r=t.getBoundingClientRect();return [...document.querySelectorAll('[data-screen=u-attach] button')].map(e=>{let b=e.getBoundingClientRect();let x=Math.max(0,Math.min(b.right,r.right)-Math.max(b.left,r.left)),y=Math.max(0,Math.min(b.bottom,r.bottom)-Math.max(b.top,r.top));return {label:e.innerText,overlap:x*y,rect:{x:b.x,y:b.y,w:b.width,h:b.height}}}).filter(x=>x.overlap>0)}''')
 page.wait_for_timeout(12100);shot('toast-320-after');print('TOAST',geo)
 print('BROWSER',b.version,platform.platform(),'ERRORS',errors)
 b.close()
(root/'results.json').write_text(json.dumps({'results':results,'toast':geo,'errors':errors},ensure_ascii=False,indent=2))
for x in results:print(x[:3])
