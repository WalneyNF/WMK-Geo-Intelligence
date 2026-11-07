// WMK GPS: exemplo de leitura de duas fontes distintas. Nenhuma chave no navegador.
'use strict';
const status=document.getElementById('status');
if(typeof L==='undefined'){status.textContent='Leaflet indisponível: confira acesso à internet/CDN.';}
else {
 const map=L.map('map').setView([-22.281,-42.532],13);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
   maxZoom:19,attribution:'© OpenStreetMap contributors'
 }).addTo(map);
 const pontos=L.layerGroup().addTo(map);
 let ativo=false, primeiro=true;
 function valido(lat,lon){return typeof lat==='number'&&Number.isFinite(lat)&&Math.abs(lat)<=90&&typeof lon==='number'&&Number.isFinite(lon)&&Math.abs(lon)<=180;}
 function marcador(p,cor){if(!valido(p.lat,p.lon))return false;
   const m=L.circleMarker([p.lat,p.lon],{radius:8,color:cor,fillOpacity:.8}).addTo(pontos);
   const caixa=document.createElement('div');
   for(const [k,v] of Object.entries({Nome:p.name,Origem:p.source,Horário:p.time??'não informado'})){
     const linha=document.createElement('div');linha.textContent=k+': '+String(v);caixa.append(linha);
   }
   m.bindPopup(caixa);return true;
 }
 async function ler(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}
 async function atualizar(){
  if(ativo)return;ativo=true;
  try{
   const [sim,ext]=await Promise.allSettled([
    ler('http://127.0.0.1:8766/api/v1/vehicles?source=simulator'),
    ler('http://127.0.0.1:8770/api/v1/external/positions')]);
   pontos.clearLayers();let count=0;const msgs=[];
   if(sim.status==='fulfilled'&&Array.isArray(sim.value.items)){
    for(const v of sim.value.items){const p=v.position;if(p&&marcador({lat:p.latitude,lon:p.longitude,name:v.name??v.id,source:'Simulador',time:p.timestamp},'#32dd85'))count++;}
    msgs.push('Simulador: '+sim.value.items.length+' veículos');
   }else msgs.push('Simulador indisponível: '+(sim.reason?.message??'formato inválido'));
   if(ext.status==='fulfilled'&&Array.isArray(ext.value.items)){
    const ultimos=new Map();for(const e of ext.value.items)if(e.id)ultimos.set(e.id,e);
    for(const e of ultimos.values())if(marcador({lat:e.latitude,lon:e.longitude,name:e.id,source:'Externa (simulada)',time:e.timestamp},'#3b9dff'))count++;
    msgs.push('Externos: '+ultimos.size+' IDs');
   }else msgs.push('Externa indisponível: '+(ext.reason?.message??'formato inválido'));
   status.textContent=msgs.join(' | ')+' | Marcadores: '+count+' | Consulta: '+new Date().toLocaleTimeString('pt-BR');
   if(primeiro&&count){const bounds=pontos.getBounds();if(bounds.isValid())map.fitBounds(bounds.pad(.25));primeiro=false;}
  }finally{ativo=false;}
 }
 document.getElementById('atualizar').addEventListener('click',atualizar);
 setInterval(()=>{if(document.getElementById('auto').checked)atualizar();},10000);
 atualizar().catch(e=>{status.textContent='Erro inesperado: '+e.message;});
}
