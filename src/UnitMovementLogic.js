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

export function AddPotentialPath(tiles) {
  GlobalState.potentialPath = tiles;

  tiles.forEach((tile) => {
    tile.tileElement
      .querySelector('.movement-range')
      .classList.add('movement-range__highlighted');
  });
}

export function RemovePotentialPath() {
  GlobalState.potentialPath.forEach((tile) => {
    tile.tileElement
      .querySelector('.movement-range')
      .classList.remove('movement-range__highlighted');
  });
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

const TerrainReduction = {
  tank: {
    forest: 2,
  },
  infantry: {
    mountain: 1,
  },
  rpg: {
    mountain: 1,
  },
  rockets: {
    field: 1,
    forest: 3,
    shore: 2,
  },
  battleship: {},
};

export function GetCurrentUnitMovementReduction(terrainElement) {
  const { currentSelectedUnitElement, playerTurn } = GlobalState;

  const currentUnit =
    GlobalState.units[playerTurn][currentSelectedUnitElement.id];

  const terrainType = GetTerrainType(terrainElement);

  const movementReduction = TerrainReduction[currentUnit.type][terrainType];

  return movementReduction ? Number(movementReduction) : 0;
}

export function ReachedMovementRange() {
  const { currentSelectedUnitElement, path, playerTurn } = GlobalState;

  const currentUnit =
    GlobalState.units[playerTurn][currentSelectedUnitElement.id];

  const terrainInPath = path.map((tileData) =>
    GetTerrainType(tileData.element),
  );

  const containsMountain = terrainInPath.some((t) => t === 'mountain');
  const containsForest = terrainInPath.some((t) => t === 'forest');
  const containsField = terrainInPath.some((t) => t === 'field');
  const containsShore = terrainInPath.some((t) => t === 'shore');

  const reduceField =
    (containsField && TerrainReduction[currentUnit.type]['field']) || 0;
  const reduceForest =
    (containsForest && TerrainReduction[currentUnit.type]['forest']) || 0;
  const reduceMountain =
    (containsMountain && TerrainReduction[currentUnit.type]['mountain']) || 0;
  const reduceShore =
    (containsShore && TerrainReduction[currentUnit.type]['shore']) || 0;

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

export function ClickToConfirmMovement(targetTile) {
  const { path, units, playerTurn, currentSelectedUnitElement } = GlobalState;

  const lastTileInPath = path[path.length - 1];

  const targetTileId = targetTile.id.split('-')[1];

  const unit = units[playerTurn][currentSelectedUnitElement.id];

  if (path.length < 2 && unit.directAttack) {
    return false;
  }

  if (targetTileId === lastTileInPath.id) {
    return true;
  }
  return false;
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

function CanReachTarget(parent, movements, maxMovement, target) {
  if (movements >= maxMovement) {
    return false;
  }
  const { tileId, direction } = parent;

  const up = direction !== 'down' ? tileId + -40 : null;
  const upChildTile = up ? document.getElementById(`tile-${up}`) : null;

  if (up === target) {
    return true;
  }

  const down = direction !== 'up' ? tileId + 40 : null;
  const downChildTile = down ? document.getElementById(`tile-${down}`) : null;

  if (down === target) {
    return true;
  }

  const right = direction !== 'left' ? tileId + 1 : null;
  const rightChildTile = right
    ? document.getElementById(`tile-${right}`)
    : null;

  if (right === target) {
    return true;
  }

  const left = direction !== 'right' ? tileId - 1 : null;
  const leftChildTile = left ? document.getElementById(`tile-${left}`) : null;

  if (left === target) {
    return true;
  }

  const childTiles = [
    { tileElement: upChildTile, direction: 'up', tileId: up },
    { tileElement: downChildTile, direction: 'down', tileId: down },
    { tileElement: leftChildTile, direction: 'left', tileId: left },
    { tileElement: rightChildTile, direction: 'right', tileId: right },
  ].filter(
    ({ tileElement }) =>
      tileElement &&
      CanMoveInTerrain(tileElement) &&
      !EnemyUnitBlocking(tileElement),
  );

  const [u, d, l, r] = childTiles;

  const uMove = u
    ? movements + GetCurrentUnitMovementReduction(u.tileElement) + 1
    : movements + 1;
  const dMove = d
    ? movements + GetCurrentUnitMovementReduction(d.tileElement) + 1
    : movements + 1;
  const lMove = l
    ? movements + GetCurrentUnitMovementReduction(l.tileElement) + 1
    : movements + 1;
  const rMove = r
    ? movements + GetCurrentUnitMovementReduction(r.tileElement) + 1
    : movements + 1;

  return (
    (u ? CanReachTarget(u, uMove, maxMovement, target) : false) ||
    (d ? CanReachTarget(d, dMove, maxMovement, target) : false) ||
    (l ? CanReachTarget(l, lMove, maxMovement, target) : false) ||
    (r ? CanReachTarget(r, rMove, maxMovement, target) : false)
  );
}

function BuildTree(parent, movements, maxMovement, target) {
  if (movements >= maxMovement) {
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

  const terrainReduction = children.map((child) =>
    GetCurrentUnitMovementReduction(child.tileElement),
  );

  return {
    ...parent,
    children: children
      .map((child, index) =>
        BuildTree(
          child,
          movements + 1 + terrainReduction[index],
          maxMovement,
          target,
        ),
      )
      .filter((child) => child),
  };
}

export function TileIsReachable(tileElement) {
  const { potentialPath } = GlobalState;

  return potentialPath.find((tile) => {
    return tile.tileElement === tileElement;
  });
}

export function AllPotentialPaths() {
  const {
    playerTurn,
    currentSelectedUnitTile,
    currentSelectedUnitElement,
    units,
  } = GlobalState;

  const unit = units[playerTurn][currentSelectedUnitElement.id];

  const potentialMovementTiles = PotentialMovementTiles();

  const unitTileId = GetTileId(currentSelectedUnitTile);

  const root = {
    children: [],
    tileElement: document.getElementById(`tile-${unitTileId}`),
    tileId: unitTileId,
    direction: null,
  };

  const allReachableTiles = potentialMovementTiles.filter((potentialTile) =>
    CanReachTarget(
      root,
      0,
      unit.movementRange,
      GetTileId(potentialTile.tileElement),
    ),
  );

  return allReachableTiles;
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

function CanMoveToTile(tileElement) {
  if (!tileElement) {
    return false;
  }

  if (!CanMoveInTerrain(tileElement)) {
    return false;
  }
  if (TileIsOccupied(tileElement)) {
    return false;
  }
  return true;
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

        const upTile = document.getElementById(`tile-${up}`);
        const downTile = document.getElementById(`tile-${down}`);

        if (CanMoveToTile(upTile)) {
          surroundingTiles.push({ id: up });
        }
        if (CanMoveToTile(downTile)) {
          surroundingTiles.push({ id: down });
        }
      }

      const rowTiles = movementRange - i;

      for (let j = 1; j < rowTiles + 1; j++) {
        if (i === 0) {
          const left = unitTileId - j;
          const right = unitTileId + j;

          const leftTile = document.getElementById(`tile-${left}`);
          const rightTile = document.getElementById(`tile-${right}`);

          if (CanMoveToTile(leftTile)) {
            surroundingTiles.push({ id: left });
          }
          if (CanMoveToTile(rightTile)) {
            surroundingTiles.push({ id: right });
          }
        } else {
          const upLeft = up - j;
          const upRight = up + j;

          const downLeft = down - j;
          const downRight = down + j;

          const upLeftTile = document.getElementById('tile-' + upLeft);
          const upRightTile = document.getElementById('tile-' + upRight);
          const downLeftTile = document.getElementById('tile-' + downLeft);
          const downRightTile = document.getElementById('tile-' + downRight);

          if (CanMoveToTile(upLeftTile)) {
            surroundingTiles.push({ id: upLeft });
          }
          if (CanMoveToTile(upRightTile)) {
            surroundingTiles.push({
              id: upRight,
            });
          }
          if (CanMoveToTile(downLeftTile)) {
            surroundingTiles.push({
              id: downLeft,
            });
          }
          if (CanMoveToTile(downRightTile)) {
            surroundingTiles.push({
              id: downRight,
            });
          }
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
