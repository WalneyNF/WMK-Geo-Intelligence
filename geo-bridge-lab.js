
import {fetchBridgeVehicles} from '/src/wmk/traccar/bridgeAdapter.js';
const el=id=>document.getElementById(id);
const status=(s,ok=false)=>{el('status').textContent=s;el('status').className=ok?'ok':'warn'};
let busy=false;
async function check(){
try{const base=el('base').value.trim().replace(/\/$/,'');const r=await fetch(base+'/api/v1/capabilities');if(!r.ok)throw Error('HTTP '+r.status);const data=await r.json();status('Bridge conectado. Fonte Traccar configurada: '+(data.traccarConfigured?'SIM':'NÃO')+'. API '+data.schemaVersion,true)}
catch(e){status('Não foi possível consultar o Bridge: '+e.message)}}
async function refresh(){
if(busy)return;busy=true;try{const base=el('base').value.trim();const items=await fetchBridgeVehicles({base});el('count').textContent='('+items.length+')';const tbody=el('rows');tbody.replaceChildren();const svg=el('plot');svg.querySelectorAll('circle,title').forEach(x=>x.remove());for(const v of items){const tr=document.createElement('tr');for(const value of [v.name,v.latitude??'Sem posição',v.longitude??'Sem posição',v.speedKmh==null?'—':v.speedKmh+' km/h',v.observedAt??'—']){const td=document.createElement('td');td.textContent=String(value);tr.append(td)}tbody.append(tr);if(v.latitude!=null&&v.longitude!=null){const circle=document.createElementNS('http://www.w3.org/2000/svg','circle');circle.setAttribute('cx',String((v.longitude+180)/360*1000));circle.setAttribute('cy',String((90-v.latitude)/180*300));circle.setAttribute('r','6');circle.setAttribute('fill','#6cf0a5');const title=document.createElementNS('http://www.w3.org/2000/svg','title');title.textContent=v.name;circle.append(title);svg.append(circle)}}if(!items.length)tbody.innerHTML='<tr><td colspan="5">Nenhum dispositivo retornado.</td></tr>';status('Consulta concluída. '+items.length+' dispositivo(s). Atualização: '+new Date().toLocaleTimeString('pt-BR'),true)}
catch(e){status('Falha na consulta de veículos: '+e.message+'. Verifique credenciais do Tracker no Bridge.')}
finally{busy=false}}
el('test').addEventListener('click',check);el('refresh').addEventListener('click',refresh);setInterval(()=>{if(el('auto').checked)refresh()},10000);check();
