import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeGpsVehicles,isStale} from './gpsStore.js';
const sample={schemaVersion:'1.0',items:[
  {id:'CAR-01',name:'Carro',source:'wmk-simulator',simulated:true,position:{latitude:-22.28,longitude:-42.53,speedKmh:40,heading:90,timestamp:'2026-11-06T12:00:00Z'}},
  {id:'BAD',position:{latitude:900,longitude:0}},
]};
test('normaliza veículos e elimina coordenadas inválidas',()=>{
  const list=normalizeGpsVehicles(sample);
  assert.equal(list.length,1);
  assert.equal(list[0].id,'CAR-01');
  assert.equal(list[0].speedKmh,40);
  assert.equal(list[0].simulated,true);
});
test('rejeita contrato inesperado',()=>{
  assert.throws(()=>normalizeGpsVehicles({items:[]}),TypeError);
});
test('identifica sinal desatualizado',()=>{
  const v=normalizeGpsVehicles(sample)[0];
  assert.equal(isStale(v,Date.parse('2026-11-06T12:00:30Z')),false);
  assert.equal(isStale(v,Date.parse('2026-11-06T12:03:00Z')),true);
});
