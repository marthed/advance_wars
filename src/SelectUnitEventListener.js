/* Game Interactive Logic */
const SelectUnit = (event) => {
  const { target } = event;
  const { currentSelectedUnitTile, path, currentTileId } = GlobalState;

  if (currentSelectedUnitTile) {
    document.removeEventListener('keydown', SelectedUnitEventListener);
    GlobalState.currentSelectedUnitTile.addEventListener(
      'mousedown',
      SelectUnit
    );

    ResetPath();
    ResetSelectedTile();
  }

  GlobalState.currentSelectedUnitTile = target;
  GlobalState.currentSelectedUnitElement = target.querySelector('div.unit');
  GlobalState.currentTileId = GetTileId(target);

  target.removeEventListener('mousedown', SelectUnit);

  const tileData = AddTileData(target, 'start');
  GlobalState.path.push(tileData);

  GlobalState.currentSelectedUnitTile
    .querySelector('.path')
    .classList.add('path__highlighted');

  document.addEventListener('keydown', SelectedUnitEventListener);
};
