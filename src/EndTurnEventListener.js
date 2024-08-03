import { GlobalState } from './GlobalState.js';
import { SelectUnit } from './SelectUnitEventListener.js';
import { DeselectUnit } from './UnitSelectionUtils.js';
function EndTurn() {
  const { playerTurn, numberOfPlayers, units } = GlobalState;

  DeselectUnit();

  // Remove event listeners for the current player's units
  Object.keys(units[playerTurn]).forEach((id) => {
    units[playerTurn][id].tileElement.removeEventListener(
      'mousedown',
      SelectUnit,
    );
    const movedUnit =
      units[playerTurn][id].tileElement.querySelector('.hasMoved');

    if (movedUnit) {
      movedUnit.classList.remove('hasMoved');
    }
  });

  const previousPlayer = GlobalState.playerTurn;

  // Update the player turn
  if (playerTurn === numberOfPlayers) {
    GlobalState.turn++;
    GlobalState.playerTurn = 1;
  } else {
    GlobalState.playerTurn++;
  }

  // Update the stats display
  document.getElementById('stats-day').innerHTML = 'DAY ' + GlobalState.turn;
  document.getElementById('stats-player').innerHTML =
    'PLAYER ' + GlobalState.playerTurn;

  const previousColor = GlobalState.playerColors[previousPlayer];
  const newColor = GlobalState.playerColors[GlobalState.playerTurn];

  document
    .getElementById('stats-player')
    .classList.remove(`color-${previousColor}`);
  document.getElementById('stats-player').classList.add(`color-${newColor}`);

  // Add event listeners for the new player's units
  Object.keys(units[GlobalState.playerTurn]).forEach((id) => {
    units[GlobalState.playerTurn][id].tileElement.addEventListener(
      'mousedown',
      SelectUnit,
    );
  });
}

export function SetupEndTurnEventListener() {
  document.getElementById('end-turn').addEventListener('click', EndTurn);
}
