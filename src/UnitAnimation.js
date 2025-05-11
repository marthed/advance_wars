/* Unit Animation */
import { GlobalState } from './GlobalState.js';

export async function AnimateCurrentUnitMovement() {
  const { currentSelectedUnitElement, animation, units, playerTurn } =
    GlobalState;
  const { path } = animation;

  const { type } = units[playerTurn][currentSelectedUnitElement.id];

  if (type === 'infantry' || type === 'rpg') {
    return Promise.resolve();
  }

  const translations = path.reduce((acc, tileData, index) => {
    const nextTileData = path[index + 1];

    if (!nextTileData) {
      return acc;
    }

    const last = acc[acc.length - 1];

    const prevTranslation = last
      ? last.keyframes[1].transform
      : 'translate(0, 0)';
    const prevX = last ? last.position.x : 0;
    const prevY = last ? last.position.y : 0;

    const currentTileRect = tileData.element.getBoundingClientRect();
    const nextTileRect = nextTileData.element.getBoundingClientRect();

    const X = nextTileRect.left - currentTileRect.left + prevX;
    const Y = nextTileRect.top - currentTileRect.top + prevY;

    return [
      ...acc,
      {
        keyframes: [
          { transform: prevTranslation },
          { transform: `translate(${X}px, ${Y}px)` },
        ],
        options: { duration: 1000 / path.length, easing: 'linear' },
        position: { x: X, y: Y },
      },
    ];
  }, []);

  return RunAnimations(currentSelectedUnitElement, translations);
}

export async function RunAnimations(element, animations) {
  for (const animation of animations) {
    await element.animate(animation.keyframes, animation.options).finished;
  }
}

export async function AnimateExplosion(targetElement) {
  const explosionElement = document.getElementById('explosion');
  explosionElement.style.display = 'block';

  const rect = targetElement.getBoundingClientRect();

  explosionElement.style.left = rect.left + window.scrollX + 'px';
  explosionElement.style.top = rect.top + window.screenY + 'px';

  const frameWidth = 43;
  const frameHeight = 32;
  const columns = 3;
  const totalFrames = 12;
  let currentFrame = 0;

  const frameTime = async function () {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, 40);
    });
  };

  for (let i = 0; i < totalFrames; i++) {
    await frameTime();
    const col = currentFrame % columns;
    const row = Math.floor(currentFrame / columns);
    //console.log('frame: ' + currentFrame + '  col: ' + col + ' row: ' + row);

    const x = -col * frameWidth;
    const y = -row * frameHeight;

    explosionElement.style.backgroundPosition = `${x}px ${y}px`;

    currentFrame++;
  }
  explosionElement.style.display = 'none';
}
