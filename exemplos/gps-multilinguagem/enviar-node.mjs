// WMK GPS: Node.js 18+ | exemplo local, posições fictícias
const url = process.env.WMK_GPS_URL || 'http://127.0.0.1:8770';
const chave = process.env.WMK_BRIDGE_WRITE_KEY;
if (!chave) { console.error('Configure WMK_BRIDGE_WRITE_KEY no ambiente.'); process.exit(2); }
const dados = {id:'WMK-NODE-001',latitude:-22.2805,longitude:-42.5320,simulated:true};
try {
 const r=await fetch(new URL('/api/v1/external/positions',url),{
  method:'POST',headers:{'Content-Type':'application/json','X-WMK-API-Key':chave},
  body:JSON.stringify(dados)});
 console.log('HTTP',r.status,await r.text());
 if(r.status!==202)process.exitCode=1;
} catch(e){console.error('Falha de rede:',e.message);process.exitCode=1;}
