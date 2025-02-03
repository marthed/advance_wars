import { GlobalState } from './GlobalState.js';

export function GameIsOver() {
  const player1Units = GlobalState.units[1];
  const player2Units = GlobalState.units[2];

  if (!Object.keys(player1Units).length) {
    return true;
  }

  if (!Object.keys(player2Units).length) {
    return true;
  }

  return false;
}

export function GameOver() {
  const player1Units = GlobalState.units[1];
  // const player2Units = GlobalState.units[2];

  const globalModalElement = document.getElementById('global-modal');
  const gameModalElement = document.getElementById('game-modal');

  fetch('./src/Modals/gameoverModal.html')
    .then((res) => res.text())
    .then((html) => {
      const parser = new DOMParser();

      document.getElementById('header-bar').classList.add('none');

      const gameOverModalElement = parser.parseFromString(html, 'text/html');
      const imgElement = gameOverModalElement.querySelector('img');

      if (Object.keys(player1Units).length) {
        imgElement.src = 'media/green_victory.png';
      } else {
        imgElement.src = 'media/red_victory.png';
      }

      gameModalElement.innerHTML = gameOverModalElement.body.innerHTML;

      gameModalElement.classList.remove('hidden');
      globalModalElement.classList.remove('hidden');
    })
    .catch((error) => {
      console.log(error);
    });
}
