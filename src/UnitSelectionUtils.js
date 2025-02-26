import { GlobalState } from './GlobalState.js';
import {
  SelectedUnitEventListener,
  SelectedUnitEventListenerTouch,
} from './SelectedUnitEventListener.js';
import { SelectUnit } from './SelectUnitEventListener.js';
import { ResetPath, RemovePotentialPath } from './UnitMovementLogic.js';
export function ResetSelectedTile() {
  GlobalState.currentSelectedUnitTile = null;
  GlobalState.currentTileId = null;
  GlobalState.currentSelectedUnitElement = null;
}

export function DeselectUnit() {
  document.removeEventListener('keydown', SelectedUnitEventListener);
  document.removeEventListener('mousedown', SelectedUnitEventListenerTouch);
  GlobalState.currentSelectedUnitTile?.addEventListener(
    'mousedown',
    SelectUnit,
  );

  ResetPath();
  RemovePotentialPath();
  ResetSelectedTile();
}
