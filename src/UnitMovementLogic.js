import { GlobalState } from './GlobalState.js';
import { GetTerrainType, GetTileId } from './Terrain/Utils.js';
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

export function ResetPathFromTouch() {
  const paths = GlobalState.path.slice(1);

  paths.forEach((tile) => {
    tile.element.querySelector('.path').classList.remove('path__highlighted');
    //tile.element.style.backgroundColor = tile.terrainColor;
  });
  GlobalState.path = GlobalState.path.slice(0, 1);
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

export function TileInMovementRange(targetTile, potentialTiles) {
  return potentialTiles.find((tile) => {
    const id = GetTileId(tile.tileElement);
    return id === GetTileId(targetTile);
  });
}

function GetShortestRoute(paths = []) {
  let shortestPath = paths[0];

  paths.forEach((path) => {
    if (path.length < shortestPath.length) {
      shortestPath = path;
    }
  });
  return shortestPath;
}

function AddParentsToTargetPath(child, acc = []) {
  if (!child) {
    return acc;
  }

  const { tileElement, direction } = child;

  return AddParentsToTargetPath(child.parent, [
    { tileElement, direction },
    ...acc,
  ]);
}

function CreatePathToTarget(tree) {
  let paths = [];
  function ExtractPaths(child) {
    if (child.target) {
      const path = AddParentsToTargetPath(child);
      paths.push(path);
      return;
    }
    if (!child.children || child.children.length < 1) {
      return;
    }

    child.children.forEach((c) => ExtractPaths(c));
  }

  ExtractPaths(tree);
  return paths;
}

function BuildTree(parent, movements, maxMovement, target) {
  if (movements === maxMovement) {
    return null;
  }

  const { tileId, direction } = parent;

  const up = direction !== 'down' ? tileId + -40 : null;
  const down = direction !== 'up' ? tileId + 40 : null;
  const right = direction !== 'left' ? tileId + 1 : null;
  const left = direction !== 'right' ? tileId - 1 : null;

  const upChild = up
    ? {
        children: [],
        tileElement: document.getElementById(`tile-${up}`),
        tileId: up,
        direction: 'up',
        parent,
      }
    : null;

  if (up === target) {
    return { ...parent, children: [{ ...upChild, target: true }] };
  }

  const downChild = down
    ? {
        children: [],
        tileElement: document.getElementById(`tile-${down}`),
        tileId: down,
        direction: 'down',
        parent,
      }
    : null;

  if (down === target) {
    return { ...parent, children: [{ ...downChild, target: true }] };
  }

  const rightChild = right
    ? {
        children: [],
        tileElement: document.getElementById(`tile-${right}`),
        tileId: right,
        direction: 'right',
        parent,
      }
    : null;

  if (right === target) {
    return { ...parent, children: [{ ...rightChild, target: true }] };
  }

  const leftChild = left
    ? {
        children: [],
        tileElement: document.getElementById(`tile-${left}`),
        tileId: left,
        direction: 'left',
        parent,
      }
    : null;

  if (left === target) {
    return {
      ...parent,
      children: [{ ...leftChild, target: true }],
    };
  }

  const children = [upChild, downChild, leftChild, rightChild].filter(
    (child) =>
      child &&
      child.tileElement &&
      CanMoveInTerrain(child.tileElement) &&
      !EnemyUnitBlocking(child.tileElement),
  );

  return {
    ...parent,
    children: children
      .map((child) => BuildTree(child, movements + 1, maxMovement, target))
      .filter((child) => child),
  };
}

export function GeneratePath(target) {
  const {
    playerTurn,
    currentSelectedUnitTile,
    currentSelectedUnitElement,
    units,
  } = GlobalState;

  const unitTileId = GetTileId(currentSelectedUnitTile);

  const unit = units[playerTurn][currentSelectedUnitElement.id];

  const root = {
    children: [],
    tileElement: document.getElementById(`tile-${unitTileId}`),
    tileId: unitTileId,
    direction: null,
    parent: null,
  };

  const tree = BuildTree(root, 0, unit.movementRange, GetTileId(target));

  const pathsToTarget = CreatePathToTarget(tree);
  const shortestPath = GetShortestRoute(pathsToTarget);
  shortestPath.slice(1).forEach((path) => {
    AddPath(path.direction, path.tileElement);
  });
}

export function PotentialMovementTiles() {
  const {
    playerTurn,
    currentSelectedUnitElement,
    currentSelectedUnitTile,
    units,
  } = GlobalState;

  const unitTileId = GetTileId(currentSelectedUnitTile);

  const unit = units[playerTurn][currentSelectedUnitElement.id];

  let surroundingTiles = [];

  if (unit.movementRange) {
    const { movementRange } = unit;

    for (let i = movementRange; i > -1; i--) {
      let up;
      let down;

      if (i !== 0) {
        up = unitTileId + -40 * i;
        down = unitTileId + 40 * i;
        surroundingTiles.push({ id: up });
        surroundingTiles.push({ id: down });

        // const upElem = document.getElementById('tile-' + up);
        // if (upElem) {
        //   AddPath('ArrowUp', upElem);
        // }

        // const downElem = document.getElementById('tile-' + down);
        // if (downElem) {
        //   AddPath('ArrowUp', downElem);
        // }
      }

      const rowTiles = movementRange - i;

      for (let j = 1; j < rowTiles + 1; j++) {
        if (i === 0) {
          const left = unitTileId - j;
          const right = unitTileId + j;
          surroundingTiles.push({ id: left });
          surroundingTiles.push({ id: right });

          // const leftElem = document.getElementById('tile-' + left);
          // if (leftElem) {
          //   AddPath('ArrowUp', leftElem);
          // }
          // const rightElem = document.getElementById('tile-' + right);
          // if (rightElem) {
          //   AddPath('ArrowUp', rightElem);
          // }
        } else {
          const upLeft = up - j;
          const upRight = up + j;

          const downLeft = down - j;
          const downRight = down + j;

          // const upLeftElem = document.getElementById('tile-' + upLeft);
          // const upRightElem = document.getElementById('tile-' + upRight);
          // const downLeftElem = document.getElementById('tile-' + downLeft);
          // const downRightElem = document.getElementById('tile-' + downRight);

          // if (upLeftElem) {
          //   AddPath('ArrowUp', upLeftElem);
          // }
          // if (upRightElem) {
          //   AddPath('ArrowUp', upRightElem);
          // }
          // if (downLeftElem) {
          //   AddPath('ArrowUp', downLeftElem);
          // }
          // if (downRightElem) {
          //   AddPath('ArrowUp', downRightElem);
          // }

          surroundingTiles.push({ id: upLeft });
          surroundingTiles.push({
            id: upRight,
          });
          surroundingTiles.push({
            id: downLeft,
          });
          surroundingTiles.push({
            id: downRight,
          });
        }
      }
    }
  }

  surroundingTiles = surroundingTiles
    .map(({ id }) => ({
      tileElement: document.getElementById(`tile-${id}`),
    }))
    .filter((tile) => !!tile.tileElement);

  return surroundingTiles;
}
