/* Audio */
import { GlobalState } from './GlobalState.js';
export function GetSoundFileUrl(type) {
  const baseUrl = 'audio/';

  switch (type) {
    case 'infantry_walk':
      return baseUrl + 'infantry_walk.wav';
    case 'infantry_fire':
      return baseUrl + 'infantry_fire.wav';
    case 'rockets_fire_1':
      return baseUrl + 'rockets_fire_1.wav';
    case 'rockets_fire_2':
      return baseUrl + 'rockets_fire_2.wav';
    case 'rpg_fire':
      return baseUrl + 'rpg_fire.wav';
    case 'tank_fire':
      return baseUrl + 'tank_fire.wav';
    case 'tank_move':
      return baseUrl + 'tank_move_short.wav';
    case 'vechicle_move':
      return baseUrl + 'vechicle_move.wav';
    case 'battleship_fire':
      return baseUrl + 'battleship_fire.wav';
    case 'battleship_move':
      return baseUrl + 'battleship_move.wav';
    case 'start_game':
      return baseUrl + 'startgame.mp3';
    case 'menu_button':
      return baseUrl + 'menu_1.wav';
    case 'confirm':
      return baseUrl + 'confirm.wav';
    default:
      return '';
  }
}

export function Mute() {
  GlobalState.volume = 0;
}

export function PlaySound(type) {
  const player = new Audio();

  player.src = GetSoundFileUrl(type);
  player.volume = GlobalState.volume;

  player.load();
  player.play();
}

export function PlaySounds(soundArray) {
  if (soundArray.length) {
    soundArray.forEach((sound) => {
      setTimeout(() => {
        const player = new Audio();
        player.src = GetSoundFileUrl(sound.type);
        player.volume = GlobalState.volume;
        player.load();

        player.play();
      }, sound.delay || 0);
    });
  }
}

export function PlayMovementSound() {
  const { currentSelectedUnitElement, playerTurn, units } = GlobalState;

  const unit = units[playerTurn][currentSelectedUnitElement.id];

  if (unit.type === 'infantry') {
    PlaySound('infantry_walk');
  } else if (unit.type === 'rpg') {
    PlaySound('infantry_walk');
  } else if (unit.type === 'tank') {
    PlaySound('tank_move');
  } else if (unit.type === 'rockets') {
    PlaySound('vechicle_move');
  } else if (unit.type === 'battleship') {
    PlaySound('battleship_move');
  }
}
