/** Normalização isolada de posições Traccar para a camada WMK. */
export function normalizeTraccarPosition(position, device = null) {
  if (!position || !Number.isFinite(position.latitude) || !Number.isFinite(position.longitude)) {
    throw new TypeError('Posição Traccar inválida: latitude/longitude ausentes');
  }
  if (Math.abs(position.latitude) > 90 || Math.abs(position.longitude) > 180) {
    throw new RangeError('Coordenadas fora do intervalo geográfico');
  }
  const speedKnots = Number.isFinite(position.speed) ? position.speed : null;
  return Object.freeze({
    id: `traccar:${position.deviceId}:${position.id ?? 'latest'}`,
    deviceId: position.deviceId,
    deviceName: device?.name ?? `Dispositivo ${position.deviceId}`,
    source: 'traccar',
    simulated: false,
    observedAt: position.fixTime ?? position.deviceTime ?? null,
    receivedAt: position.serverTime ?? null,
    latitude: position.latitude,
    longitude: position.longitude,
    altitudeMeters: Number.isFinite(position.altitude) ? position.altitude : null,
    speedKmh: speedKnots === null ? null : Math.round(speedKnots * 1.852 * 100) / 100,
    courseDegrees: Number.isFinite(position.course) ? position.course : null,
    valid: position.valid === true,
    attributes: position.attributes ?? {},
  });
}

export function normalizeTraccarPositions(positions, devices = []) {
  const devicesById = new Map(devices.map((device) => [device.id, device]));
  return positions.map((position) => normalizeTraccarPosition(position, devicesById.get(position.deviceId)));
}
