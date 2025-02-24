import { GlobalState } from './GlobalState.js';
import {
  GetNextTileNumber,
  IsUndoMove,
  UndoMove,
  AlreadyMovedOnTile,
  EnemyUnitBlocking,
  CanMoveInTerrain,
  ReachedMovementRange,
  AddPath,
  TileIsOccupied,
  CheckRangeAttack,
  SetPathForAnimation,
  ResetPath,
  ResetPathFromTouch,
  PotentialMovementTiles,
  TileInMovementRange,
  GeneratePath,
  ClickToConfirmMovement,
} from './UnitMovementLogic.js';
import { AnimateCurrentUnitMovement } from './UnitAnimation.js';
import { AddUnitElement, RemoveUnitElement } from './UnitUtils.js';
import { AdjacentEnemyUnits, SelectTargetEnemy } from './UnitActionModal.js';
import { ResetSelectedTile, DeselectUnit } from './UnitSelectionUtils.js';
import { PlayMovementSound } from './Audio.js';

export const SelectedUnitEventListenerTouch = async (event) => {
  event.preventDefault();
  event.stopPropagation();

  const targetTileId = event.target.id.split('-')[1];

  if (!targetTileId) {
    console.log('Tile id was not selected');
    ResetPathFromTouch();
    DeselectUnit();
    return;
  }

  if (ClickToConfirmMovement(event.target)) {
    const currentTile = document.getElementById(
      `tile-${GlobalState.currentTileId}`,
    );

    document.removeEventListener('keydown', SelectedUnitEventListener);
    document.removeEventListener('mousedown', SelectedUnitEventListenerTouch);

    if (TileIsOccupied(currentTile)) {
      return;
    }

    if (CheckRangeAttack()) {
      ResetPath();

      if (AdjacentEnemyUnits({ range: true })) {
        AddUnitElement({
          hasMoved: false,
          flipped: GlobalState.playerTurn === 2,
        });
        SelectTargetEnemy();
      } else {
        AddUnitElement({
          hasMoved: true,
          flipped: GlobalState.playerTurn === 2,
        });
        ResetSelectedTile();
      }
      return;
    }
    SetPathForAnimation();
    ResetPath();
    PlayMovementSound();
    await AnimateCurrentUnitMovement();
    RemoveUnitElement();

    if (AdjacentEnemyUnits()) {
      AddUnitElement({
        hasMoved: false,
        flipped: GlobalState.playerTurn === 2,
      });
      SelectTargetEnemy();
    } else {
      AddUnitElement({
        hasMoved: true,
        flipped: GlobalState.playerTurn === 2,
      });
      ResetSelectedTile();
    }

    return;
  }

  ResetPathFromTouch();

  // Kolla om rutan har terrain type som funkar för unit
  if (!CanMoveInTerrain(event.target)) {
    console.log('Cant move to this terrain');
    ResetPathFromTouch();
    DeselectUnit();
    return;
  }

  // Kolla om rutan redan är occuperad
  if (TileIsOccupied(event.target)) {
    console.log('Cant move to tile, it is occupied');
    ResetPathFromTouch();
    DeselectUnit();
    return;
  }

  const potentialMovementTiles = PotentialMovementTiles();

  //Kolla om inom movement range
  if (!TileInMovementRange(event.target, potentialMovementTiles)) {
    console.log('Tile not in movement range of this unity');
    ResetPathFromTouch();
    DeselectUnit();
    return;
  }

  GeneratePath(event.target);
};

export const SelectedUnitEventListener = async (event) => {
  const { key } = event;
  event.preventDefault();
  event.stopPropagation();

  if (
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].find(
      (command) => command === key,
    )
  ) {
    const nextTileNumber = GetNextTileNumber(key);
    const nextTileElem = document.getElementById(`tile-${nextTileNumber}`);

    if (!nextTileElem) {
      return;
    }

    if (IsUndoMove(key, nextTileNumber)) {
      UndoMove(nextTileElem);
      return;
    }

    if (AlreadyMovedOnTile(nextTileNumber)) {
      return;
    }

    if (EnemyUnitBlocking(nextTileElem)) {
      return;
    }

    if (!CanMoveInTerrain(nextTileElem)) {
      return;
    }

    if (ReachedMovementRange()) {
      return;
    }

    AddPath(key, nextTileElem);

    return;
  }

  if (key === 'Enter') {
    const currentTile = document.getElementById(
      `tile-${GlobalState.currentTileId}`,
    );

    document.removeEventListener('keydown', SelectedUnitEventListener);
    document.removeEventListener('mousedown', SelectedUnitEventListenerTouch);

    if (TileIsOccupied(currentTile)) {
      return;
    }

    if (CheckRangeAttack()) {
      ResetPath();

      if (AdjacentEnemyUnits({ range: true })) {
        AddUnitElement({
          hasMoved: false,
          flipped: GlobalState.playerTurn === 2,
        });
        SelectTargetEnemy();
      } else {
        AddUnitElement({
          hasMoved: true,
          flipped: GlobalState.playerTurn === 2,
        });
        ResetSelectedTile();
      }
      return;
    }
    SetPathForAnimation();
    ResetPath();
    PlayMovementSound();
    await AnimateCurrentUnitMovement();
    RemoveUnitElement();

    if (AdjacentEnemyUnits()) {
      AddUnitElement({
        hasMoved: false,
        flipped: GlobalState.playerTurn === 2,
      });
      SelectTargetEnemy();
    } else {
      AddUnitElement({
        hasMoved: true,
        flipped: GlobalState.playerTurn === 2,
      });
      ResetSelectedTile();
    }

    return;
  } else {
    DeselectUnit();
  }

  if (key === 'Escape') {
    DeselectUnit();
    return;
  }
};
