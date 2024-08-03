import { CreateTerrainImage } from './GenerateMap.js';

export const roadMappings = [
  160, 161, 162, 163, 164, 165, 205, 245, 246, 247, 248, 249, 250, 251, 252,
  212, 172, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 101, 61, 21,
];

export function CreateRoad(tile) {
  const tileIndex = Number(tile.id.split('-')[1]);
  tile.classList.add('terrain-road');

  const roadMappingIndex = roadMappings.indexOf(tileIndex);

  const surroundingTiles = [
    tileIndex - 1,
    tileIndex + 1,
    tileIndex - 40,
    tileIndex + 40,
  ];

  const previous = roadMappings[roadMappingIndex - 1];
  const next = roadMappings[roadMappingIndex + 1];

  const previousTileID = surroundingTiles.find((tileId) => previous === tileId);
  const nextTileID = surroundingTiles.find((tileId) => next === tileId);

  let img;

  if (!previousTileID && !nextTileID) {
    img = CreateTerrainImage('road', { road: 'horizontal' });
  } else if (
    (previousTileID && !nextTileID) ||
    (!previousTileID && nextTileID)
  ) {
    const diff = tileIndex - (previousTileID ? previousTileID : nextTileID);
    if (diff === 1 || diff === -1) {
      img = CreateTerrainImage('road', { road: 'horizontal' });
    } else if (diff === 40 || diff === -40) {
      img = CreateTerrainImage('road', { road: 'vertical' });
    }
  } else {
    const diffPrevious = tileIndex - previousTileID;
    const diffNext = nextTileID - tileIndex;
    const modify = GetRoadDirection(diffPrevious, diffNext);

    img = CreateTerrainImage('road', { road: modify });
  }

  tile.appendChild(img);
}

function GetRoadDirection(previous, next) {
  if (previous === 1) {
    if (next === 1) {
      return 'horizontal';
    }

    if (next === 40) {
      return 'left-down';
    }

    if (next === -40) {
      return 'left-up';
    }
  } else if (previous === -1) {
    if (next === -1) {
      return 'horizontal';
    }

    if (next === -40) {
      return 'right-up';
    }

    if (next === 40) {
      return 'right-down';
    }
  } else if (previous === 40) {
    // From above
    if (next === 1) {
      return 'right-up';
    }

    if (next === -1) {
      return 'left-up';
    }

    if (next === 40) {
      return 'vertical';
    }
  } else if (previous === -40) {
    // From below
    if (next === 1) {
      return 'right-down';
    }

    if (next === -1) {
      return 'left-down';
    }

    if (next === -40) {
      return 'vertical';
    }
  }
}
