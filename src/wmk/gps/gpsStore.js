/** WMK GPS Layer - estado independente e validado.
 * Walney Moreira Klein - walneyk@hotmail.com
 */
export function normalizeGpsVehicles(payload) {
  if (!payload || payload.schemaVersion !== '1.0' || !Array.isArray(payload.items))
    throw new TypeError('Contrato GPS inválido');
  const result = new Map();
  for (const raw of payload.items) {
    if (!raw || !['string','number'].includes(typeof raw.id)) continue;
    const p = raw.position;
    if (!p || !Number.isFinite(p.latitude) || !Number.isFinite(p.longitude) ||
        Math.abs(p.latitude)>90 || Math.abs(p.longitude)>180) continue;
    const id = String(raw.id);
    result.set(id, Object.freeze({
      id, name: String(raw.name ?? id), source: String(raw.source ?? 'unknown'),
      simulated: raw.simulated === true, latitude:p.latitude, longitude:p.longitude,
      speedKmh:Number.isFinite(p.speedKmh)?p.speedKmh:null,
      heading:Number.isFinite(p.heading)?p.heading:null,
      observedAt:typeof p.timestamp==='string'?p.timestamp:null,
    }));
  }
  return [...result.values()];
}
export function isStale(vehicle, now=Date.now(), thresholdMs=60000) {
  const ts=Date.parse(vehicle.observedAt ?? '');
  return !Number.isFinite(ts) || now-ts>thresholdMs || ts-now>thresholdMs;
}
