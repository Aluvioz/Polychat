import os, subprocess, tempfile, pathlib
runner=str(pathlib.Path(__file__).resolve().parent / 'test-supabase-integration.sh')
with tempfile.TemporaryDirectory() as d:
 p=pathlib.Path(d)
 fake=p/'psql'
 fake.write_text("""#!/usr/bin/env python3
import os,sys,pathlib
args=sys.argv[1:]
guard=sys.stdin.read()
assert '--set=ON_ERROR_STOP=1' in args
assert '--file=-' in args
assert args.index('--file=-') < next(i for i,x in enumerate(args) if x.startswith('--file=/'))
assert 'pg_catalog.shobj_description' in guard and 'current_database()' in guard and 'session_user' in guard
assert '\\\\if :dedicated_ok' in guard and "RAISE EXCEPTION 'BLOCKED:" in guard
with open(os.environ['TRACE'],'a') as f: f.write('guard\\n')
if os.environ['MODE']=='reject': sys.exit(3)
with open(os.environ['TRACE'],'a') as f: f.write('fixture\\n')
""")
 fake.chmod(0o755)
 trace=p/'trace'
 base={'PATH':d+':'+os.environ['PATH'],'TRACE':str(trace),'MODE':'accept','POLYCHAT_TEST_DB_CONFIRM':'dedicated-test','POLYCHAT_TEST_DB_ID':'12345678-1234-1234-1234-123456789abc','PGHOST':'test.example','PGDATABASE':'postgres','PGUSER':'postgres'}
 def run(name, overrides, expected, calls):
  trace.write_text('')
  result=subprocess.run(['bash',runner],env={**base,**overrides},capture_output=True,text=True)
  assert result.returncode==expected,(name,result.returncode,result.stdout,result.stderr)
  assert trace.read_text().splitlines()==calls,(name,trace.read_text())
  print('PASS:',name)
 run('confirmation missing',{'POLYCHAT_TEST_DB_CONFIRM':''},2,[])
 run('marker missing',{'POLYCHAT_TEST_DB_ID':''},2,[])
 run('marker malformed',{'POLYCHAT_TEST_DB_ID':'wrong'},2,[])
 run('multiple hosts rejected',{'PGHOST':'test,production'},2,[])
 run('conninfo rejected',{'PGDATABASE':'host=production'},2,[])
 run('PGHOSTADDR override rejected',{'PGHOSTADDR':'192.0.2.1'},2,[])
 run('PGSERVICE rejected',{'PGSERVICE':'production'},2,[])
 run('PGOPTIONS rejected',{'PGOPTIONS':'-c role=postgres'},2,[])
 run('mock identity rejected: no fixture',{'MODE':'reject'},3,['guard'])
 run('mock identity accepted: guard before each fixture',{},0,['guard','fixture']*4)
