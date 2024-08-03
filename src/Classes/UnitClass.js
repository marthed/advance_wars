export class Unit {
  id = '';
  type = '';
  movementRange = 0;
  canMoveInTerrain = ['field', 'forest', 'mountain', 'water', 'road', 'shore'];
  tileElement = null;
  hitPoints = 100;
  directAttack = true;
  attackRange = 0;

  constructor(type) {
    this.id = GenerateUnitId();
    this.type = type;
    const {
      canMoveInTerrain,
      movementRange,
      directAttack = true,
      attackRange = 0,
    } = GetUnitLogic(type);
    this.canMoveInTerrain = canMoveInTerrain;
    this.movementRange = movementRange;
    this.directAttack = directAttack;
    this.attackRange = attackRange;
  }
}
