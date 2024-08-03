export function SetupTerrain() {
  GlobalState.terrain.htmlMap = document.getElementById('map');
  GlobalState.terrain.waterTiles = [];

  const terrain = GetSavedTerrain();
  if (terrain) {
    GenerateSavedTerrain(terrain);
  } else {
    const size = 20 * 40;
    GenerateNewTerrain(size);
  }
}
