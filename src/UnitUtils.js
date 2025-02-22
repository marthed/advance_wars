import { GlobalState } from './GlobalState.js';
import {
  SelectedUnitEventListener,
  SelectedUnitEventListenerTouch,
} from './SelectedUnitEventListener.js';
import { SelectUnit } from './SelectUnitEventListener.js';

/* Create unit */
export function GenerateUnitId() {
  return 'unitId-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
}

export function MapDirection(id) {
  const { currentTileId } = GlobalState;
  if (currentTileId - 1 === id) {
    return 'ArrowLeft';
  }
  if (currentTileId + 1 === id) {
    return 'ArrowRight';
  }
  if (currentTileId - 40 === id) {
    return 'ArrowUp';
  }
  if (currentTileId + 40 === id) {
    return 'ArrowDown';
  }
}

export function CreateUnitElement(unit, player) {
  const element = document.createElement('div');
  element.classList.add('unit');
  element.setAttribute('player', player);

  const unitImage = CreateUnitImage(unit, player);

  const hpElement = document.createElement('span');
  hpElement.classList.add('hp');
  hpElement.style.zIndex = '2';

  const color = GlobalState.playerColors[player];
  hpElement.classList.add(`color-${color}`);

  element.appendChild(unitImage);
  element.appendChild(hpElement);

  element.id = unit.id;

  return element;
}

export function AddUnitElement(settings = {}) {
  const { currentTileId, units, playerTurn } = GlobalState;
  const terrainElement =
    settings.tile || document.getElementById(`tile-${currentTileId}`);
  const unitElement = GlobalState.currentSelectedUnitElement;
  const id = unitElement.id;

  units[playerTurn][id].tileElement = terrainElement;

  terrainElement.appendChild(unitElement);
  if (settings.canMove) {
    terrainElement.addEventListener('mousedown', SelectUnit);
  }
  if (settings.hasMoved) {
    unitElement.classList.add('hasMoved');
  }

  if (settings.flipped) {
    unitElement.querySelector('img.unit-image').classList.add('flipped-right');
  }
}

export function CreateUnitImage(unit, player) {
  const { type } = unit;
  const img = document.createElement('img');

  const color = GlobalState.playerColors[player];

  if (type === 'infantry') {
    img.src = `units/${type}_${color}.png`;
  } else if (type === 'rpg') {
    img.src = `units/infantry_${type}_${color}.png`;
  } else if (type === 'rockets') {
    img.src = `units/${type}_${color}.png`;
  } else {
    img.src = `units/${type}.png`;
  }

  img.classList.add('overlay-image');
  img.classList.add('unit-image');

  if (player === 2) {
    img.classList.add('flipped-right');
  }

  return img;
}

/* Get or manipulate unit */
export function GetUnitLogic(type = '') {
  if (type === 'infantry') {
    return {
      movementRange: 3,
      canMoveInTerrain: ['field', 'forest', 'mountain', 'road', 'shore'],
    };
  }
  if (type === 'tank') {
    return {
      movementRange: 6,
      canMoveInTerrain: ['field', 'forest', 'road', 'shore'],
    };
  }
  if (type === 'rpg') {
    return {
      movementRange: 2,
      canMoveInTerrain: ['field', 'forest', 'mountain', 'road', 'shore'],
    };
  }
  if (type === 'rockets') {
    return {
      movementRange: 6,
      canMoveInTerrain: ['field', 'forest', 'road', 'shore'],
      directAttack: false,
      attackRange: 5,
      minAttackRange: 2,
    };
  }
  if (type === 'battleship') {
    return {
      movementRange: 5,
      canMoveInTerrain: ['water'],
      directAttack: false,
      attackRange: 6,
      minAttackRange: 2,
    };
  }

  return { movementRange: 0, canMoveInTerrain: [] };
}

export function GetUnitIDFromTerrainElement(terrainElement) {
  return terrainElement.querySelector('div.unit')?.id;
}

export function GetUnitFromElement(terrainElement) {
  return terrainElement.querySelector('div.unit');
}

/* Remove */
export function RemoveUnitElement() {
  document.removeEventListener('keydown', SelectedUnitEventListener);
  document.removeEventListener('mousedown', SelectedUnitEventListenerTouch);

  const unitElement =
    GlobalState.currentSelectedUnitTile.querySelector('div.unit');

  GlobalState.currentSelectedUnitElement = unitElement;

  GlobalState.currentSelectedUnitTile.removeChild(unitElement);
}
