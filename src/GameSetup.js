import { PlaySound } from './Audio.js';

export function GameSetup() {
  const gameModalElement = document.getElementById('game-modal');

  gameModalElement.classList.remove('hidden');

  const parser = new DOMParser();

  let startModalElement;
  let instructionsElement;

  fetch('./src/Modals/instructions.html')
    .then((res) => res.text())
    .then((html) => {
      instructionsElement = parser
        .parseFromString(html, 'text/html')
        .getElementById('instructions');

      function GoBack() {
        console.log('Go Back');
        if (startModalElement) {
          gameModalElement.appendChild(startModalElement);
          gameModalElement.removeChild(instructionsElement);
        }
      }

      const image = instructionsElement.querySelector('img');

      image.addEventListener('click', GoBack);
    });

  fetch('./src/Modals/startModal.html')
    .then((res) => res.text())
    .then((html) => {
      startModalElement = parser
        .parseFromString(html, 'text/html')
        .getElementById('start-modal');

      gameModalElement.appendChild(startModalElement);

      function StartGame() {
        PlaySound('start_game');
        document.getElementById('header-bar').classList.remove('none');
        document.getElementById('game-modal').classList.add('hidden');
        document.getElementById('global-modal').classList.add('hidden');
      }

      function ShowInstructions() {
        gameModalElement.appendChild(instructionsElement);
        gameModalElement.removeChild(startModalElement);
        //gameModalElement.innerHTML = instructionsElement.body.innerHTML;
      }

      document
        .getElementById('start-modal__start')
        .addEventListener('click', StartGame);

      document
        .getElementById('start-modal__instructions')
        .addEventListener('click', ShowInstructions);
    })
    .catch((error) => {
      console.log(error);
    });
}
