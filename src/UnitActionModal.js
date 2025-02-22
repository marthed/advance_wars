import { GlobalState } from './GlobalState.js';
import { GetTileId } from './Terrain/Utils.js';
import {
  GetUnitFromElement,
  AddUnitElement,
  MapDirection,
} from './UnitUtils.js';
import { Attack } from './CombatLogic.js';
import { ResetSelectedTile } from './UnitSelectionUtils.js';

export function PreAttack() {
  RemoveUnitActionModalEvents();
  CloseUnitActionModal();
  Attack();
  //RemoveUnitElement();
  if (GlobalState.currentSelectedUnitElement) {
    AddUnitElement({
      hasMoved: true,
      canMove: false,
      flipped: GlobalState.playerTurn === 2,
    });
  }

  ResetSelectedTile();
}

function NoAttack() {
  RemoveUnitActionModalEvents();
  CloseUnitActionModal();
  //RemoveUnitElement();
  AddUnitElement({
    hasMoved: true,
    canMove: false,
    flipped: GlobalState.playerTurn === 2,
  });
  ResetSelectedTile();
}
let currentIndex = 0;
let actions = [];

const UnitActionModalEventListener = ({ key, shiftKey }) => {
  if (key === 'ArrowRight' || key === 'Tab') {
    event.preventDefault();
    currentIndex = (currentIndex + 1) % 2;
    actions[currentIndex].focus();
  } else if (key === 'ArrowLeft' || (key === 'Tab' && shiftKey)) {
    event.preventDefault();
    currentIndex = (currentIndex - 1 + 2) % 2;
    actions[currentIndex].focus();
  } else if (key === 'Escape') {
    CloseUnitActionModal();
    SelectTargetEnemy();
  } else if (key === 'Enter') {
    actions[currentIndex].click();
  }
};

export function OpenUnitActionModal() {
  const { currentTileId } = GlobalState;
  const currentTile = document.getElementById(`tile-${currentTileId}`);

  document.getElementById('map').style.overflow = 'hidden';

  const modal = document.getElementById('unit-action-modal');
  modal.classList.remove('hidden');

  const rect = currentTile.getBoundingClientRect();
  modal.style.left = rect.left + 50 + 'px';
  modal.style.top = rect.top + 50 + 'px';

  actions = modal.querySelectorAll('div.unit-action-modal__option');

  const [attack, noAttack] = actions;

  attack.focus();

  attack.addEventListener('click', PreAttack);
  noAttack.addEventListener('click', NoAttack);

  document.addEventListener('keydown', UnitActionModalEventListener);
}

export function RemoveUnitActionModalEvents() {
  document.removeEventListener('keydown', UnitActionModalEventListener);

  const modal = document.getElementById('unit-action-modal');

  const actions = modal.querySelectorAll('div.unit-action-modal__option');

  const attack = actions[0];
  const noAttack = actions[1];

  attack.removeEventListener('click', Attack);
  noAttack.removeEventListener('click', NoAttack);
}

export function CloseUnitActionModal() {
  RemoveUnitActionModalEvents();
  ResetTargetEnemy();

  const modal = document.getElementById('unit-action-modal');
  modal.classList.add('hidden');
}

export function ResetTargetEnemy() {
  const { adjacentEnemyTiles } = GlobalState;

  adjacentEnemyTiles.forEach(({ tileElement }) => {
    tileElement
      .querySelector('.path')
      .classList.remove('path__highlighted--attack'); // Change to image later
  });
}

export function HandleSelectRangedTarget(command) {
  const { adjacentEnemyTiles, targetEnemyUnitTile } = GlobalState;

  const currentEnemyTileId = adjacentEnemyTiles.find(
    ({ tileElement }) =>
      GetTileId(tileElement) === GetTileId(targetEnemyUnitTile),
  );

  const index = adjacentEnemyTiles.indexOf(currentEnemyTileId);

  if (command === 'ArrowRight') {
    const nextIndex = index + 1 === adjacentEnemyTiles.length ? 0 : index + 1;
    return adjacentEnemyTiles[nextIndex];
  }
  if (command === 'ArrowLeft') {
    const nextIndex = index - 1 < 0 ? adjacentEnemyTiles.length - 1 : index - 1;
    return adjacentEnemyTiles[nextIndex];
  }
  if (command === 'ArrowDown') {
    const nextIndex = index - 1 < 0 ? adjacentEnemyTiles.length - 1 : index - 1;
    return adjacentEnemyTiles[nextIndex];
  }
  if (command === 'ArrowUp') {
    const nextIndex = index + 1 === adjacentEnemyTiles.length ? 0 : index + 1;
    return adjacentEnemyTiles[nextIndex];
  }
  return targetEnemyUnitTile;
}

export function SelectTargetEnemy() {
  const { adjacentEnemyTiles } = GlobalState;

  document.getElementById('map').style.overflow = 'hidden';

  const firstEnemy = adjacentEnemyTiles[0];
  firstEnemy.tileElement
    .querySelector('.path')
    .classList.add('path__highlighted--attack');

  GlobalState.targetEnemyUnitTile = firstEnemy.tileElement;

  if (adjacentEnemyTiles.length > 1) {
    document.addEventListener('keydown', ChangeTargetEnemy);
  } else {
    OpenUnitActionModal();
  }
}

export function ChangeTargetEnemy() {
  const { key } = event;
  const { adjacentEnemyTiles, currentSelectedUnitElement, units, playerTurn } =
    GlobalState;

  const unit = units[playerTurn][currentSelectedUnitElement.id];
  const actions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  if (unit.directAttack === false) {
    if (actions.find((command) => command === key)) {
      const enemyTile = HandleSelectRangedTarget(key);

      if (enemyTile) {
        ResetTargetEnemy();

        enemyTile.tileElement
          .querySelector('.path')
          .classList.add('path__highlighted--attack'); // Change to image later

        GlobalState.targetEnemyUnitTile = enemyTile.tileElement;
      }
    }
  } else {
    if (actions.find((command) => command === key)) {
      const enemyTile = adjacentEnemyTiles.find(
        (tile) => tile.direction === key,
      );

      if (enemyTile) {
        ResetTargetEnemy();

        enemyTile.tileElement
          .querySelector('.path')
          .classList.add('path__highlighted--attack'); // Change to image later

        GlobalState.targetEnemyUnitTile = enemyTile.tileElement;
      }
    }
  }

  if (key === 'Enter') {
    document.removeEventListener('keydown', ChangeTargetEnemy);
    OpenUnitActionModal();
    return;
  }

  if (key === 'Escape') {
    document.removeEventListener('keydown', ChangeTargetEnemy);

    adjacentEnemyTiles.forEach(({ tileElement }) => {
      tileElement
        .querySelector('.path')
        .classList.remove('path__highlighted--attack'); // Change to image later
    });

    AddUnitElement({
      tile: GlobalState.currentSelectedUnitTile,
      flipped: GlobalState.playerTurn === 2,
      hasMoved: false,
      canMove: true,
    });

    ResetSelectedTile();
  }
}

export function AdjacentEnemyUnits(options = {}) {
  const { currentTileId, playerTurn, currentSelectedUnitElement, units } =
    GlobalState;

  const unit = units[playerTurn][currentSelectedUnitElement.id];

  let surroundingTiles = [];

  if (unit.attackRange && !options.range) {
    return false;
  }

  if (unit.attackRange) {
    const attackRange = unit.attackRange;

    for (let i = attackRange; i > -1; i--) {
      let up;
      let down;

      if (i !== 0) {
        up = currentTileId + -40 * i;
        down = currentTileId + 40 * i;
        surroundingTiles.push(up);
        surroundingTiles.push(down);

        // const upElem = document.getElementById('tile-' + up);
        // AddPath('ArrowUp', upElem);

        // const downElem = document.getElementById('tile-' + down);
        // AddPath('ArrowUp', downElem);
      }

      const rowTiles = attackRange - i;

      for (let j = 1; j < rowTiles + 1; j++) {
        if (i === 0) {
          const left = currentTileId - j;
          const right = currentTileId + j;
          surroundingTiles.push(left);
          surroundingTiles.push(right);
          // AddPath('ArrowUp', document.getElementById('tile-' + left));
          // AddPath('ArrowUp', document.getElementById('tile-' + right));
        } else {
          const upLeft = up - j;
          const upRight = up + j;

          const downLeft = down - j;
          const downRight = down + j;

          // AddPath('ArrowUp', document.getElementById('tile-' + upLeft));
          // AddPath('ArrowUp', document.getElementById('tile-' + upRight));
          // AddPath('ArrowUp', document.getElementById('tile-' + downLeft));
          // AddPath(
          //   'ArrowUp',
          //   document.getElementById('tile-' + downRight)
          // );

          surroundingTiles.push(upLeft);
          surroundingTiles.push(upRight);
          surroundingTiles.push(downLeft);
          surroundingTiles.push(downRight);
        }
      }
    }
  } else {
    surroundingTiles = [
      currentTileId - 1,
      currentTileId + 1,
      currentTileId - 40,
      currentTileId + 40,
    ];
  }

  surroundingTiles = surroundingTiles
    .map((id) => ({
      tileElement: document.getElementById(`tile-${id}`),
      direction: options.range ? null : MapDirection(id),
    }))
    .filter((tile) => !!tile.tileElement);

  const enemyTiles = surroundingTiles.filter(({ tileElement }) => {
    const unit = GetUnitFromElement(tileElement);
    if (unit) {
      if (Number(unit.getAttribute('player')) !== playerTurn) {
        return true;
      }
      return false;
    }
    return false;
  });

  if (!enemyTiles.length) {
    return false;
  }

  GlobalState.adjacentEnemyTiles = enemyTiles;

  return true;
}
