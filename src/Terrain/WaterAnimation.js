/* Water animation */
const { waterTiles } = GlobalState.terrain;

const WaterAnimation = {
  numberOfTilesPerInterval: waterTiles.length,
  max: waterTiles.length - 1,
  min: 0,
  paths: ['water.png', 'water_1.png', 'water_2.png', 'water_3.png'],
};

setInterval(() => {
  const { numberOfTilesPerInterval, max, min, paths } = WaterAnimation;

  for (let i = 0; i < numberOfTilesPerInterval; i++) {
    const index = Math.floor(Math.random() * (max - min + 1)) + min;
    const image = Math.floor(Math.random() * (3 - 0 + 1)) + 0;

    waterTiles[index].src = `terrain/${paths[image]}`;
  }
}, 2000);
