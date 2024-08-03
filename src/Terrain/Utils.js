export function GetTerrainType(terrainElement) {
  const terrain = Array.from(terrainElement.classList)
    .find((c) => c.split('-')[0] === 'terrain')
    .split('-')[1];

  return terrain;
}

export function GetTileId(terrainElement) {
  return Number(terrainElement.id.split('-')[1]);
}
