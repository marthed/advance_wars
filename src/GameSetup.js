import { PlaySound } from './Audio.js';

export function GameSetup() {
  const gameModalElement = document.getElementById('game-modal');

  gameModalElement.classList.remove('hidden');

  let startModalElement;
  let instructionsElement;

  fetch('./src/Modals/instructions.html')
    .then((res) => res.text())
    .then((html) => {
      instructionsElement = html;
    });

  fetch('./src/Modals/startModal.html')
    .then((res) => res.text())
    .then((html) => {
      gameModalElement.innerHTML = html;

      function StartGame() {
        PlaySound('start_game');
        document.getElementById('game-modal').classList.add('hidden');
        document.getElementById('global-modal').classList.add('hidden');
      }

      function ShowInstructions() {
        gameModalElement.innerHTML = instructionsElement;
      }

      document
        .getElementById('start-modal__start')
        .addEventListener('click', StartGame);

      document
        .getElementById('start-modal__instructions')
        .addEventListener('click', ShowInstructions);

      startModalElement = html;
    })
    .catch((error) => {
      console.log(error);
    });
}
