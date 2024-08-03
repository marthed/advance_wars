/* Generate Map */

export function GetSavedTerrain() {
  const item = window.localStorage.getItem('terrain');

  if (item) {
    const savedTerrain = item.split(',');
    return savedTerrain;
  }
}
export function GenerateSavedTerrain(savedTerrain = []) {
  const serializableTerrainMap = [];

  for (let i = 0; i < savedTerrain.length; i++) {
    const element = document.createElement('div');
    element.classList.add('grid-item');
    element.id = 'tile-' + i;

    const roadIndex = roadMappings.find((tileIndex) => tileIndex === i);

    if (roadIndex) {
      CreateRoad(element);
      serializableTerrainMap.push('road');
    } else {
      element.classList.add(`terrain-${savedTerrain[i]}`);
      const img = CreateTerrainImage(savedTerrain[i]);
      element.appendChild(img);

      if (savedTerrain[i] === 'water') {
        GlobalState.terrain.waterTiles.push(img);
      }
    }

    const path = document.createElement('div');
    path.classList.add('path');

    element.appendChild(path);

    GlobalState.terrain.htmlMap.appendChild(element);
  }
}
export function GenerateNewTerrain(size) {
  const serializableTerrainMap = [];

  for (let i = 0; i < size; i++) {
    const element = document.createElement('div');
    element.classList.add('grid-item');
    element.id = 'tile-' + i;

    const roadIndex = roadMappings.find((tileIndex) => tileIndex === i);
    if (roadIndex) {
      CreateRoad(element);
      serializableTerrainMap.push('road');
    } else {
      if (i < size / 2) {
        if (Math.random() < 0.2) {
          element.classList.add('terrain-forest');
          const img = CreateTerrainImage('forest');
          element.appendChild(img);
          serializableTerrainMap.push('forest');
        } else if (Math.random() < 0.1) {
          element.classList.add('terrain-mountain');
          const img = CreateTerrainImage('mountain');
          element.appendChild(img);
          serializableTerrainMap.push('mountain');
        } else {
          element.classList.add('terrain-field');
          const img = CreateTerrainImage('field');
          element.appendChild(img);
          serializableTerrainMap.push('field');
        }
      } else if (i < 440) {
        element.classList.add('terrain-shore');
        const img = CreateTerrainImage('shore');
        element.appendChild(img);
        serializableTerrainMap.push('shore');
      } else {
        element.classList.add('terrain-water');
        const img = CreateTerrainImage('water');
        element.appendChild(img);
        GlobalState.terrain.waterTiles.push(img);
        serializableTerrainMap.push('water');
      }
    }

    const path = document.createElement('div');
    path.classList.add('path');

    element.appendChild(path);

    GlobalState.terrain.htmlMap.appendChild(element);
  }
  window.localStorage.setItem('terrain', serializableTerrainMap);
}

/* Terrain Generation */
export function CreateTerrainImage(terrainType, config = {}) {
  const img = document.createElement('img');
  img.classList.add('terrain-image');

  if (terrainType === 'road') {
    const { road } = config;

    if (road === 'horizontal') {
      img.src = 'terrain/road_straight.png';
    } else if (road === 'vertical') {
      img.src = 'terrain/road_straight.png';
      img.classList.add(`road--${road}`);
    } else if (road === 'right-up') {
      img.src = 'terrain/road_curved.png';
      img.classList.add(`road--${road}`);
    } else if (road === 'left-up') {
      img.src = 'terrain/road_curved.png';
      img.classList.add(`road--${road}`);
    } else if (road === 'right-down') {
      img.src = 'terrain/road_curved.png';
      img.classList.add(`road--${road}`);
    } else if (road === 'left-down') {
      img.src = 'terrain/road_curved.png';
      img.classList.add(`road--${road}`);
    } else {
      img.src = 'terrain/road_straight.png';
    }

    return img;
  }

  img.src = `terrain/${terrainType}.png`;

  return img;
}
