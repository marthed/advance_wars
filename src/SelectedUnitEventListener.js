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
} from './UnitMovementLogic.js';
import { AnimateCurrentUnitMovement } from './UnitAnimation.js';
import { AddUnitElement, RemoveUnitElement } from './UnitUtils.js';
import { AdjacentEnemyUnits, SelectTargetEnemy } from './UnitActionModal.js';
import { ResetSelectedTile, DeselectUnit } from './UnitSelectionUtils.js';
import { PlayMovementSound } from './Audio.js';

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
