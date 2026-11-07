/**
 * Adaptador opcional da API WMK Geo Bridge 0.1.
 * Independente de Cesium, da UI e do WMK GPS Tracker.
 * Creditos: Walney Moreira Klein - walneyk@hotmail.com
 */
const DEFAULT_BASE = 'http://127.0.0.1:8768';

export function normalizeBridgeVehicle(vehicle) {
  if (!vehicle || (typeof vehicle.id !== 'string' && typeof vehicle.id !== 'number')) {
    throw new TypeError('Veiculo invalido');
  }
  const p = vehicle.position;
  if (p != null && (!Number.isFinite(p.latitude) || !Number.isFinite(p.longitude) ||
    Math.abs(p.latitude) > 90 || Math.abs(p.longitude) > 180)) {
    throw new RangeError('Coordenadas invalidas');
  }
  return Object.freeze({
    id: String(vehicle.id),
    deviceId: vehicle.deviceId ?? null,
    name: vehicle.name ?? 'Dispositivo',
    source: vehicle.source ?? 'traccar',
    simulated: vehicle.simulated ?? null,
    latitude: p?.latitude ?? null,
    longitude: p?.longitude ?? null,
    speedKmh: p?.speedKmh ?? null,
    heading: p?.heading ?? null,
    observedAt: p?.timestamp ?? null,
    valid: p?.valid ?? null,
  });
}

/**
 * Consulta somente a API Bridge 0.1; nunca envia credenciais do Traccar.
 * A fonte e autenticacao sao configuradas no servidor Bridge.
 */
export async function fetchBridgeVehicles({
  base = DEFAULT_BASE, fetchImpl = fetch, signal,
} = {}) {
  const url = new URL('/api/v1/vehicles', base);
  const response = await fetchImpl(url.toString(), { signal });
  if (!response.ok) throw new Error('WMK Geo Bridge HTTP ' + response.status);
  const data = await response.json();
  if (data.schemaVersion !== '1.0' || !Array.isArray(data.items)) {
    throw new TypeError('Contrato WMK Geo Bridge inesperado');
  }
  return data.items.map(normalizeBridgeVehicle);
}
