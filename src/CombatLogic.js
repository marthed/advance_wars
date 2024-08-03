/* Combat Logic */
import { GlobalState } from './GlobalState.js';
import { GetTerrainType } from './Terrain/Utils.js';
import { PlaySound, PlaySounds } from './Audio.js';
import { GetUnitFromElement } from './UnitUtils.js';
import { ResetSelectedTile } from './UnitSelectionUtils.js';

export function TerrainBonus(terrainType) {
  if (terrainType === 'field') {
    return 1.25;
  }
  if (terrainType === 'forest') {
    return 1.5;
  }
  if (terrainType === 'mountain') {
    return 2;
  }
  if (terrainType === 'water') {
    return 1;
  }
  if (terrainType === 'road') {
    return 1;
  }
  if (terrainType === 'shore') {
    return 1;
  }
}

export function UnitDeath(unit, player) {
  const unitElement = unit.tileElement.querySelector('div.unit');

  unit.tileElement.removeChild(unitElement);

  delete GlobalState.units[player][unit.id];

  // TODO: Do some animation
}

export function SetHitPoints(unit) {
  const unitElement = unit.tileElement.querySelector('div.unit');
  const hp = unitElement.querySelector('span.hp');

  const hitPoints = Math.round(Number(unit.hitPoints));

  if (hitPoints === 100) {
    hp.innerHTML = String(hitPoints);
  } else if (hitPoints > 9) {
    hp.innerHTML = String(hitPoints).substring(0, 2);
  } else {
    hp.innerHTML = String(hitPoints);
  }
}

export async function Attack() {
  const {
    currentSelectedUnitElement,
    targetEnemyUnitTile,
    playerTurn,
    currentTileId,
  } = GlobalState;

  const enemyElement = GetUnitFromElement(targetEnemyUnitTile);

  const attackUnit =
    GlobalState.units[playerTurn][currentSelectedUnitElement.id];

  const enemyPlayer = enemyElement.getAttribute('player');

  const defenceUnit = GlobalState.units[enemyPlayer][enemyElement.id];

  const attackTerrain = GetTerrainType(
    document.getElementById(`tile-${currentTileId}`),
  );
  const defenceTerrain = GetTerrainType(targetEnemyUnitTile);

  if (attackUnit.type === 'infantry') {
    if (defenceUnit.type === 'infantry') {
      PlaySounds([{ type: 'infantry_fire', delay: 0 }]);
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 50,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 50,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'rpg') {
      PlaySounds([{ type: 'infantry_fire', delay: 0 }]);
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 50,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 50,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'tank') {
      PlaySounds([{ type: 'infantry_fire', delay: 0 }]);
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 10,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 80,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'battleship') {
      PlaySounds([{ type: 'infantry_fire', delay: 0 }]);
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 1,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 0,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'rockets') {
      PlaySounds([{ type: 'infantry_fire', delay: 0 }]);
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 50,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 0,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
  }

  if (attackUnit.type === 'rpg') {
    if (defenceUnit.type === 'infantry') {
      PlaySounds([{ type: 'infantry_fire', delay: 0 }]);
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 50,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 50,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'rpg') {
      PlaySounds([{ type: 'infantry_fire', delay: 0 }]);
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 50,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 50,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'tank') {
      PlaySounds([{ type: 'rpg_fire', delay: 0 }]);
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 80,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 40,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'battleship') {
      PlaySounds([{ type: 'rpg_fire', delay: 0 }]);
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 20,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 0,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'rockets') {
      PlaySounds([{ type: 'rpg_fire', delay: 0 }]);
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 70,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 0,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
  }

  if (attackUnit.type === 'tank') {
    if (defenceUnit.type === 'infantry') {
      PlaySounds([{ type: 'tank_fire', delay: 0 }]);
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 80,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 10,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'rpg') {
      PlaySounds([{ type: 'tank_fire', delay: 0 }]);
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 80,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 70,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'tank') {
      PlaySounds([{ type: 'tank_fire', delay: 0 }]);
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 60,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 50,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'battleship') {
      PlaySounds([{ type: 'tank_fire', delay: 0 }]);
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 20,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 0,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'rockets') {
      PlaySounds([{ type: 'tank_fire', delay: 0 }]);
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 80,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 0,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
  }

  if (attackUnit.type === 'battleship') {
    PlaySound('battleship_fire');
    if (defenceUnit.type === 'infantry') {
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 80,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 0,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'rpg') {
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 80,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 0,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'tank') {
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 60,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 0,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'battleship') {
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 50,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 0,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
    if (defenceUnit.type === 'rockets') {
      CalculateHitPoints(
        {
          attackUnit,
          attackerStength: 70,
          attackTerrain,
          player: playerTurn,
        },
        {
          defenceUnit,
          defenderStength: 0,
          defenceTerrain,
          player: enemyPlayer,
        },
      );
    }
  }

  if (attackUnit.type === 'rockets') {
    const impactDelay = 1000;
    PlaySounds([
      { type: 'rockets_fire_1', delay: 0 },
      { type: 'rockets_fire_2', delay: impactDelay },
    ]);
    if (defenceUnit.type === 'infantry') {
      await Delay(
        () =>
          CalculateHitPoints(
            {
              attackUnit,
              attackerStength: 80,
              attackTerrain,
              player: playerTurn,
            },
            {
              defenceUnit,
              defenderStength: 0,
              defenceTerrain,
              player: enemyPlayer,
            },
          ),
        impactDelay,
      );
    }
    if (defenceUnit.type === 'rpg') {
      await Delay(
        () =>
          CalculateHitPoints(
            {
              attackUnit,
              attackerStength: 80,
              attackTerrain,
              player: playerTurn,
            },
            {
              defenceUnit,
              defenderStength: 0,
              defenceTerrain,
              player: enemyPlayer,
            },
          ),
        impactDelay,
      );
    }
    if (defenceUnit.type === 'tank') {
      await Delay(
        () =>
          CalculateHitPoints(
            {
              attackUnit,
              attackerStength: 60,
              attackTerrain,
              player: playerTurn,
            },
            {
              defenceUnit,
              defenderStength: 0,
              defenceTerrain,
              player: enemyPlayer,
            },
          ),
        impactDelay,
      );
    }
    if (defenceUnit.type === 'battleship') {
      await Delay(
        () =>
          CalculateHitPoints(
            {
              attackUnit,
              attackerStength: 30,
              attackTerrain,
              player: playerTurn,
            },
            {
              defenceUnit,
              defenderStength: 0,
              defenceTerrain,
              player: enemyPlayer,
            },
          ),
        impactDelay,
      );
    }
    if (defenceUnit.type === 'rockets') {
      await Delay(
        () =>
          CalculateHitPoints(
            {
              attackUnit,
              attackerStength: 50,
              attackTerrain,
              player: playerTurn,
            },
            {
              defenceUnit,
              defenderStength: 0,
              defenceTerrain,
              player: enemyPlayer,
            },
          ),
        impactDelay,
      );
    }
  }

  if (attackUnit.hitPoints < 1) {
    ResetSelectedTile();
    UnitDeath(attackUnit, playerTurn);
  } else {
    SetHitPoints(attackUnit);
  }

  if (defenceUnit.hitPoints < 1) {
    UnitDeath(defenceUnit, enemyElement.getAttribute('player'));
  } else {
    SetHitPoints(defenceUnit);
  }
}

export async function Delay(func, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      func();
      resolve();
    }, delay || 0);
  });
}

export function CalculateHitPoints(a, d) {
  const { attackUnit, attackerStength, attackTerrain } = a;
  const { defenceUnit, defenderStength, defenceTerrain } = d;

  const attackerDamage = attackerStength * (attackUnit.hitPoints / 100);
  const attackerDamageAfterTerrain =
    attackerDamage / TerrainBonus(defenceTerrain);

  GlobalState.units[d.player][defenceUnit.id].hitPoints =
    defenceUnit.hitPoints - attackerDamageAfterTerrain;

  if (defenceUnit.hitPoints > 0) {
    const defenderDamage = defenderStength * (defenceUnit.hitPoints / 100);

    const defenderDamageAfterTerrain =
      defenderDamage / TerrainBonus(attackTerrain);

    GlobalState.units[a.player][attackUnit.id].hitPoints =
      attackUnit.hitPoints - defenderDamageAfterTerrain;
  }
}
