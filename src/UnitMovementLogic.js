import { GlobalState } from './GlobalState.js';
import { GetTerrainType } from './Terrain/Utils.js';
import { TileData } from './Classes/TileDataClass.js';
import { GetUnitIDFromTerrainElement } from './UnitUtils.js';

export function AddTileData(elem, command) {
  const id = elem.id.split('-')[1];
  const terrain = window
    .getComputedStyle(elem, null)
    .getPropertyValue('background-color');
  const tileData = new TileData(id, terrain, elem, command);
  return tileData;
}
export function CanMoveInTerrain(terrainElement) {
  const id = GetUnitIDFromTerrainElement(GlobalState.currentSelectedUnitTile);

  const unit = GlobalState.units[GlobalState.playerTurn][id];

  if (!unit) {
    console.log(`No unit found for ${id}`);
    return false;
  }
  const terrain = Array.from(terrainElement.classList).find(
    (c) => c.split('-')[0] === 'terrain',
  );

  if (!terrain) {
    console.log(`Not a terrain: ${terrain}`);
    return false;
  }

  const canMove = !!unit.canMoveInTerrain.find(
    (t) => t === terrain.split('-')[1],
  );

  return canMove;
}

export function IsUndoMove(key) {
  const { path } = GlobalState;

  const lastTile = path[path.length - 1];

  switch (key) {
    case 'ArrowUp':
      return lastTile.command === 'ArrowDown';
    case 'ArrowDown':
      return lastTile.command === 'ArrowUp';
    case 'ArrowLeft':
      return lastTile.command === 'ArrowRight';
    case 'ArrowRight':
      return lastTile.command === 'ArrowLeft';
    default:
      return false;
  }
}

export function UndoMove(elem) {
  const { path } = GlobalState;

  const lastTile = path[path.length - 1];

  document
    .getElementById(`tile-${lastTile.id}`)
    .querySelector('.path')
    .classList.remove('path__highlighted');

  GlobalState.path.pop();
  GlobalState.currentTileId = Number(elem.id.split('-')[1]);
}

export function AlreadyMovedOnTile(nextTileNumber) {
  const { path } = GlobalState;

  return !!path.find((tileData) => Number(tileData.id) === nextTileNumber);
}

export function TileIsOccupied(elem) {
  const selectedUnitId = GlobalState.currentSelectedUnitElement.id;

  const idOnTile = GetUnitIDFromTerrainElement(elem);

  return idOnTile && idOnTile !== selectedUnitId;
}

export function AddPath(key, nextTileElem) {
  GlobalState.currentTileId = Number(nextTileElem.id.split('-')[1]);
  const tileData = AddTileData(nextTileElem, key);
  GlobalState.path.push(tileData);

  nextTileElem.querySelector('.path').classList.add('path__highlighted');
}

export function SetPathForAnimation() {
  const { path } = GlobalState;
  GlobalState.animation.path = [...path];
}

export function ResetPath() {
  GlobalState.path.forEach((tile) => {
    tile.element.querySelector('.path').classList.remove('path__highlighted');
    //tile.element.style.backgroundColor = tile.terrainColor;
  });
  GlobalState.path = [];
}

export function ReachedMovementRange() {
  const { currentSelectedUnitElement, path, playerTurn } = GlobalState;

  const currentUnit =
    GlobalState.units[playerTurn][currentSelectedUnitElement.id];

  const terrainInPath = path.map((tileData) =>
    GetTerrainType(tileData.element),
  );

  let reduceField = 0;
  let reduceForest = 0;
  let reduceMountain = 0;
  let reduceShore = 0;

  const containsMountain = terrainInPath.some((t) => t === 'mountain');
  const containsForest = terrainInPath.some((t) => t === 'forest');
  const containsField = terrainInPath.some((t) => t === 'field');
  const containsShore = terrainInPath.some((t) => t === 'shore');

  if (currentUnit.type === 'tank') {
    reduceField = containsField ? 0 : 0;
    reduceForest = containsForest ? 2 : 0;
    reduceMountain = containsMountain ? 0 : 0;
  } else if (currentUnit.type === 'infantry') {
    reduceField = containsField ? 0 : 0;
    reduceForest = containsForest ? 0 : 0;
    reduceMountain = containsMountain ? 1 : 0;
  } else if (currentUnit.type === 'rpg') {
    reduceField = containsField ? 0 : 0;
    reduceForest = containsForest ? 0 : 0;
    reduceMountain = containsMountain ? 1 : 0;
  } else if (currentUnit.type === 'rockets') {
    reduceField = containsField ? 1 : 0;
    reduceForest = containsForest ? 3 : 0;
    reduceMountain = containsMountain ? 1 : 0;
    reduceShore = containsShore ? 2 : 0;
  }

  const reduction =
    Number(reduceField) +
    Number(reduceForest) +
    Number(reduceMountain) +
    Number(reduceShore);

  return path.length >= currentUnit.movementRange + 1 - reduction;
}

export function GetNextTileNumber(key) {
  const currentTileId = Number(
    GlobalState.currentTileId ||
      GlobalState.currentSelectedUnitTile.id.split('-')[1],
  );

  switch (key) {
    case 'ArrowUp':
      return currentTileId - 40;
    case 'ArrowDown':
      return currentTileId + 40;
    case 'ArrowLeft':
      return currentTileId - 1;
    case 'ArrowRight':
      return currentTileId + 1;
    default:
      -1;
  }
}

export function EnemyUnitBlocking(nextTile) {
  const unitElement = nextTile.querySelector('div.unit');

  if (!unitElement) {
    return false;
  }

  const player = unitElement.getAttribute('player');

  if (Number(player) === Number(GlobalState.playerTurn)) {
    return false;
  }

  return true;
}

export function CheckRangeAttack() {
  const { currentSelectedUnitElement, playerTurn, path } = GlobalState;

  if (!currentSelectedUnitElement) {
    return false;
  }

  if (path.length > 1) {
    return false;
  }

  const unit = GlobalState.units[playerTurn][currentSelectedUnitElement.id];

  if (!unit.directAttack) {
    return true;
  }
}
