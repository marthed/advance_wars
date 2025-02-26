import { GlobalState } from './GlobalState.js';
import {
  SelectedUnitEventListener,
  SelectedUnitEventListenerTouch,
} from './SelectedUnitEventListener.js';
import {
  ResetPath,
  AddTileData,
  AddPotentialPath,
  PotentialMovementTiles,
  RemovePotentialPath,
} from './UnitMovementLogic.js';
import { GetTileId } from './Terrain/Utils.js';
import { ResetSelectedTile } from './UnitSelectionUtils.js';
export const SelectUnit = (event) => {
  const { target } = event;
  const { currentSelectedUnitTile } = GlobalState;

  if (currentSelectedUnitTile) {
    console.log('Remove eventlisteners');
    document.removeEventListener('keydown', SelectedUnitEventListener);
    document.removeEventListener('mousedown', SelectedUnitEventListenerTouch);

    GlobalState.currentSelectedUnitTile.addEventListener(
      'mousedown',
      SelectUnit,
    );

    ResetPath();
    RemovePotentialPath();
    ResetSelectedTile();
  }

  GlobalState.currentSelectedUnitTile = target;
  GlobalState.currentSelectedUnitElement = target.querySelector('div.unit');
  GlobalState.currentTileId = GetTileId(target);

  target.removeEventListener('mousedown', SelectUnit);

  const tileData = AddTileData(target, 'start');
  GlobalState.path.push(tileData);

  const potentialMovementTiles = PotentialMovementTiles();
  console.log('add potential path');
  AddPotentialPath(potentialMovementTiles);

  GlobalState.currentSelectedUnitTile
    .querySelector('.path')
    .classList.add('path__highlighted');

  document.addEventListener('keydown', SelectedUnitEventListener);

  setTimeout(() => {
    document.addEventListener('mousedown', SelectedUnitEventListenerTouch);
  }, 0);
};
