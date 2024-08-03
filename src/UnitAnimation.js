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
