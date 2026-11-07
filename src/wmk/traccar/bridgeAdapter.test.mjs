import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchBridgeVehicles, normalizeBridgeVehicle } from './bridgeAdapter.js';

test('normaliza resposta do Geo Bridge 0.1', () => {
  const v = normalizeBridgeVehicle({ id: '12', deviceId: 12, name: 'Carro',
    source: 'traccar', position: { latitude: -22.28, longitude: -42.53,
      speedKmh: 42, heading: 90, timestamp: '2026-11-06T12:00:00Z', valid: true } });
  assert.equal(v.id, '12');
  assert.equal(v.speedKmh, 42);
  assert.equal(v.latitude, -22.28);
  assert.equal(v.heading, 90);
});

test('aceita dispositivo sem ultima posicao', () => {
  const v = normalizeBridgeVehicle({ id: 7, name: 'Sem GPS', position: null });
  assert.equal(v.id, '7');
  assert.equal(v.latitude, null);
});

test('rejeita coordenadas invalidas', () => {
  assert.throws(() => normalizeBridgeVehicle({ id: '1', position: { latitude: 91, longitude: 0 } }), RangeError);
});

test('usa contrato real e nao exige simulator', async () => {
  let requested;
  const items = await fetchBridgeVehicles({ base: 'http://127.0.0.1:8768',
    fetchImpl: async (url) => {
      requested = url;
      return { ok: true, json: async () => ({ schemaVersion: '1.0',
        items: [{ id: '2', name: 'Teste', position: null }] }) };
    },
  });
  assert.equal(requested, 'http://127.0.0.1:8768/api/v1/vehicles');
  assert.equal(items[0].name, 'Teste');
});

test('trata erro de autenticacao/configuracao da fonte', async () => {
  await assert.rejects(() => fetchBridgeVehicles({ fetchImpl: async () => ({ ok: false, status: 503 }) }), /HTTP 503/);
});

test('rejeita formato inesperado', async () => {
  await assert.rejects(() => fetchBridgeVehicles({ fetchImpl: async () => ({
    ok: true, json: async () => ({ devices: [] }),
  }) }), /Contrato/);
});
