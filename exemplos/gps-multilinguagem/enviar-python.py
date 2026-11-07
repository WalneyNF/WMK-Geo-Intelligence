"""WMK GPS: Python 3, biblioteca padrão, sem dependências externas."""
import json, os, sys, urllib.request, urllib.error
base=os.environ.get('WMK_GPS_URL','http://127.0.0.1:8770').rstrip('/')
key=os.environ.get('WMK_BRIDGE_WRITE_KEY')
if not key: sys.exit('Configure WMK_BRIDGE_WRITE_KEY no ambiente.')
payload={'id':'WMK-PYTHON-001','latitude':-22.2806,'longitude':-42.5321,'simulated':True}
req=urllib.request.Request(base+'/api/v1/external/positions',
 data=json.dumps(payload).encode('utf-8'),
 headers={'Content-Type':'application/json','X-WMK-API-Key':key},method='POST')
try:
 with urllib.request.urlopen(req,timeout=8) as resp:
  print('HTTP',resp.status,resp.read().decode())
  sys.exit(0 if resp.status==202 else 1)
except urllib.error.HTTPError as e:
 print('HTTP',e.code,e.read().decode(),file=sys.stderr);sys.exit(1)
except urllib.error.URLError as e:
 print('Falha de rede:',e.reason,file=sys.stderr);sys.exit(1)
