import { GlobalState } from './GlobalState.js';
import { SelectedUnitEventListener } from './SelectedUnitEventListener.js';
import { SelectUnit } from './SelectUnitEventListener.js';
import { ResetPath } from './UnitMovementLogic.js';
export function ResetSelectedTile() {
  GlobalState.currentSelectedUnitTile = null;
  GlobalState.currentTileId = null;
  GlobalState.currentSelectedUnitElement = null;
}

export function DeselectUnit() {
  document.removeEventListener('keydown', SelectedUnitEventListener);
  GlobalState.currentSelectedUnitTile?.addEventListener(
    'mousedown',
    SelectUnit,
  );

  ResetPath();
  ResetSelectedTile();
}
