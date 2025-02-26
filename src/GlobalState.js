export let GlobalState = {
  path: [], // TileData for current unit path
  potentialPath: [],
  currentTileId: null, // number
  currentSelectedUnitTile: null, // element
  currentSelectedUnitElement: null,
  adjacentEnemyTiles: [],
  targetEnemyUnitTile: null,
  units: { 1: {}, 2: {}, 3: {}, 4: {} },
  turn: 1,
  playerTurn: 1,
  numberOfPlayers: 2,
  playerColors: { 1: 'green', 2: 'red', 3: 'blue', 4: 'yellow' },
  terrain: {
    htmlMap: null,
    waterTiles: [],
  },
  animation: {},
  volume: 1,
};

window.GlobalState = GlobalState;
