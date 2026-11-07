import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeTraccarPosition, normalizeTraccarPositions } from './normalize.js';

test('normaliza GPS e converte nós em km/h', () => {
  const result = normalizeTraccarPosition({ id: 7, deviceId: 12, latitude: -22.28, longitude: -42.53, speed: 10, valid: true }, { id: 12, name: 'WMK 001' });
  assert.equal(result.speedKmh, 18.52);
  assert.equal(result.deviceName, 'WMK 001');
  assert.equal(result.simulated, false);
  assert.equal(result.source, 'traccar');
});

test('rejeita coordenadas inválidas', () => {
  assert.throws(() => normalizeTraccarPosition({ latitude: 91, longitude: 0 }), RangeError);
  assert.throws(() => normalizeTraccarPosition({ latitude: '0', longitude: 0 }), TypeError);
});

test('associa dispositivos e não altera posições originais', () => {
  const input = [{ deviceId: 2, latitude: 0, longitude: 0 }];
  const result = normalizeTraccarPositions(input, [{ id: 2, name: 'Teste' }]);
  assert.equal(result[0].deviceName, 'Teste');
  assert.equal(input[0].source, undefined);
});
