/** Camada Cesium opcional para GPS de laboratório; sem credenciais no navegador.
 * Créditos: Walney Moreira Klein - walneyk@hotmail.com
 */
import * as Cesium from 'cesium';
import { normalizeGpsVehicles, isStale } from './gpsStore.js';

export function mountGpsLayer(viewer, {
  base='http://127.0.0.1:8766', intervalMs=10000, fetchImpl=fetch,
}={}) {
  if (!viewer?.entities || !viewer?.scene) throw new TypeError('Cesium viewer obrigatório');
  const source=viewer.dataSources.add(new Cesium.CustomDataSource('WMK GPS — Simulação'));
  const entities=new Map();
  let selected=null, running=false, enabled=false, timer=null, destroyed=false;
  let lastSuccess=null, lastError=null, count=0;
  const root=document.createElement('section');
  root.id='wmk-gps-panel';
  root.setAttribute('aria-label','WMK GPS — laboratório');
  root.style.cssText='position:fixed;right:16px;top:90px;width:310px;max-width:calc(100vw - 32px);z-index:10020;background:#081a18ed;color:#d7ffe6;border:1px solid #277a59;border-radius:9px;padding:12px;font:12px system-ui;box-shadow:0 10px 36px #0008';
  root.innerHTML='<div id="wmk-gps-drag" style="cursor:move;display:flex;justify-content:space-between;align-items:center;gap:8px"><strong>WMK GPS · LAB</strong><button id="wmk-gps-hide" type="button" style="background:transparent;color:#bdfbd5;border:1px solid #427b5b;border-radius:4px">—</button></div><div id="wmk-gps-content"><p><label><input type="checkbox" id="wmk-gps-enabled"> Exibir veículos simulados</label></p><p id="wmk-gps-status" role="status">Camada desativada.</p><p><button id="wmk-gps-refresh" type="button">Atualizar</button> <button id="wmk-gps-center" type="button">Centralizar frota</button></p><div id="wmk-gps-list" style="max-height:190px;overflow:auto"></div><div id="wmk-gps-details" style="border-top:1px solid #28624c;padding-top:8px;margin-top:8px">Selecione um veículo.</div><small style="display:block;margin-top:10px;color:#7fbf9d">SIMULAÇÃO · sem rastreamento real · Walney Moreira Klein</small></div>';
  document.body.append(root);
  const $=id=>root.querySelector('#'+id);
  const status=$('wmk-gps-status'), list=$('wmk-gps-list'), details=$('wmk-gps-details');
  for (const b of root.querySelectorAll('button')) b.style.cssText+=';cursor:pointer;padding:5px 8px;background:#16432f;color:#eafff1;border:1px solid #3b805d;border-radius:4px';
  let drag=null;
  $('wmk-gps-drag').addEventListener('pointerdown',e=>{
    if(e.target.closest('button'))return;
    drag={x:e.clientX,y:e.clientY,left:root.offsetLeft,top:root.offsetTop};
    root.style.left=drag.left+'px';root.style.right='auto';root.setPointerCapture(e.pointerId);
  });
  root.addEventListener('pointermove',e=>{
    if(!drag)return;
    root.style.left=Math.max(0,Math.min(innerWidth-root.offsetWidth,drag.left+e.clientX-drag.x))+'px';
    root.style.top=Math.max(0,Math.min(innerHeight-40,drag.top+e.clientY-drag.y))+'px';
  });
  root.addEventListener('pointerup',()=>{drag=null});
  $('wmk-gps-hide').onclick=()=>{
    const hidden=$('wmk-gps-content').hidden=!$('wmk-gps-content').hidden;
    $('wmk-gps-hide').textContent=hidden?'+':'—';
  };
  function focus(id) {
    selected=id;
    const item=entities.get(id);
    if(!item)return;
    const v=item.vehicle;
    details.replaceChildren();
    const info=document.createElement('div');
    info.textContent=[v.name,'ID: '+v.id,'Latitude: '+v.latitude.toFixed(6),'Longitude: '+v.longitude.toFixed(6),'Velocidade: '+(v.speedKmh??'—')+' km/h','Direção: '+(v.heading??'—')+'°','Origem: '+v.source,'Última posição: '+(v.observedAt??'—'),isStale(v)?'Sinal desatualizado':'Sinal recente'].join('\n');
    info.style.whiteSpace='pre-line';
    const follow=document.createElement('button');follow.textContent='Seguir / aproximar';follow.onclick=()=>viewer.flyTo(item.entity,{duration:1.4,offset:new Cesium.HeadingPitchRange(0,-0.7,900)});
    details.append(info,follow);
  }
  function draw(items) {
    const seen=new Set();
    for(const v of items){
      seen.add(v.id);
      const position=Cesium.Cartesian3.fromDegrees(v.longitude,v.latitude,30);
      const color=isStale(v)?Cesium.Color.ORANGE:Cesium.Color.LIME;
      let entry=entities.get(v.id);
      if(!entry){
        const entity=new Cesium.Entity({
          id:'wmk-gps:'+v.id,name:v.name,position,
          point:{pixelSize:13,color,outlineColor:Cesium.Color.BLACK,outlineWidth:2,
            heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND,disableDepthTestDistance:Number.POSITIVE_INFINITY},
          label:{text:v.name,font:'13px sans-serif',fillColor:Cesium.Color.WHITE,
            showBackground:true,backgroundColor:Cesium.Color.BLACK.withAlpha(.75),
            pixelOffset:new Cesium.Cartesian2(0,-23),disableDepthTestDistance:Number.POSITIVE_INFINITY},
        });
        source.then(ds=>{if(!destroyed&&enabled)ds.entities.add(entity)});
        entry={entity,vehicle:v};entities.set(v.id,entry);
      } else {
        entry.entity.position=position;
        entry.entity.point.color=color;
        entry.vehicle=v;
      }
    }
    for(const [id,entry] of entities)if(!seen.has(id)){
      source.then(ds=>ds.entities.remove(entry.entity));
      entities.delete(id);
    }
    list.replaceChildren();
    for(const v of items){
      const b=document.createElement('button');b.type='button';
      b.textContent=(isStale(v)?'⚠ ':'● ')+v.name+' · '+(v.speedKmh??'—')+' km/h';
      b.style.cssText='display:block;width:100%;text-align:left;padding:7px;margin:3px 0;background:#12382b;color:#d9ffe8;border:1px solid #296a4e;cursor:pointer';
      b.onclick=()=>focus(v.id);list.append(b);
    }
    if(selected&&entities.has(selected))focus(selected);
    viewer.scene.requestRender();
  }
  async function refresh(){
    if(destroyed||!enabled||running)return;
    running=true;status.textContent='Consultando GPS simulado...';
    try {
      const r=await fetchImpl(base.replace(/\/$/,'')+'/api/v1/vehicles?source=simulator',{cache:'no-store'});
      if(!r.ok)throw Error('HTTP '+r.status);
      const items=normalizeGpsVehicles(await r.json());
      if(destroyed||!enabled)return;
      draw(items);count=items.length;lastSuccess=new Date();lastError=null;
      status.textContent=count+' veículo(s) · atualização '+lastSuccess.toLocaleTimeString('pt-BR')+' · SIMULADO';
    } catch(e) {
      lastError=e.message;status.textContent='Falha na API GPS: '+lastError;
    } finally {running=false}
  }
  function toggle(value){
    enabled=Boolean(value);
    clearInterval(timer);timer=null;
    source.then(ds=>{if(!destroyed)ds.show=enabled});
    if(enabled){refresh();timer=setInterval(refresh,intervalMs)}
    else status.textContent='Camada desativada.';
  }
  $('wmk-gps-enabled').onchange=e=>toggle(e.target.checked);
  $('wmk-gps-refresh').onclick=refresh;
  $('wmk-gps-center').onclick=()=>source.then(ds=>{if(enabled&&ds.entities.values.length)viewer.flyTo(ds,{duration:1.4})});
  const onPick=event=>{
    const picked=viewer.scene.pick(event.position);
    const id=picked?.id?.id;
    if(typeof id==='string'&&id.startsWith('wmk-gps:'))focus(id.slice(8));
  };
  const handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(onPick,Cesium.ScreenSpaceEventType.LEFT_CLICK);
  source.then(ds=>{if(!destroyed)ds.show=false});
  return {refresh,toggle,getStatus:()=>({enabled,count,lastSuccess,lastError}),destroy(){
    destroyed=true;clearInterval(timer);handler.destroy();root.remove();
    source.then(ds=>viewer.dataSources.remove(ds,true));
  }};
}
