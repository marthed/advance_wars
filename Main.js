import { SetupTerrain } from './src/Terrain/SetupTerrain.js';
import { GenerateUnits } from './src/GenerateUnits.js';
import { SetupEndTurnEventListener } from './src/EndTurnEventListener.js';
import { GameSetup } from './src/GameSetup.js';

GameSetup();

SetupTerrain();

GenerateUnits();

SetupEndTurnEventListener();
