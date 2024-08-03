import { SetupTerrain } from './src/Terrain/SetupTerrain.js';
import { GenerateUnits } from './src/GenerateUnits.js';
import { SetupEndTurnEventListener } from './src/EndTurnEventListener.js';

SetupTerrain();

GenerateUnits();

SetupEndTurnEventListener();
