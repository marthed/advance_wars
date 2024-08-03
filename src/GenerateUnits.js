function GenerateUnits() {
  document
    .getElementById('stats-player')
    .classList.add(`color-${GlobalState.playerColors[GlobalState.playerTurn]}`);

  startPositionsPlayer1.forEach(({ tile, unit }) => {
    const terrainElement = document.getElementById(`tile-${tile}`);
    //const unitImage = CreateUnitImage(unit, 1);
    const unitElement = CreateUnitElement(unit, 1);

    terrainElement.appendChild(unitElement);
    unit.tileElement = terrainElement;
    SetHitPoints(unit);

    GlobalState.units[1][unit.id] = unit;

    terrainElement.addEventListener('mousedown', SelectUnit);
    unit.tileElement = terrainElement;
  });

  startPositionsPlayer2.forEach(({ tile, unit }) => {
    const terrainElement = document.getElementById(`tile-${tile}`);
    const unitElement = CreateUnitElement(unit, 2);

    terrainElement.appendChild(unitElement);
    unit.tileElement = terrainElement;
    SetHitPoints(unit);

    GlobalState.units[2][unit.id] = unit;
    unit.tileElement = terrainElement;
  });
}
