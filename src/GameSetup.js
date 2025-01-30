export function GameSetup() {
  const gameModalElement = document.getElementById('game-modal');

  gameModalElement.classList.remove('hidden');

  fetch('./src/Modals/startModal.html')
    .then((res) => res.text())
    .then((html) => {
      gameModalElement.innerHTML = html;

      function StartGame() {
        console.log('hej');
        document.getElementById('game-modal').classList.add('hidden');
        document.getElementById('global-modal').classList.add('hidden');
      }

      document
        .getElementById('start-modal__start')
        .addEventListener('click', StartGame);
    })
    .catch((error) => {
      console.log(error);
    });
}
