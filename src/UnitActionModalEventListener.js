import {
  CloseUnitActionModal,
  SelectTargetEnemy,
  PreAttack,
} from './UnitActionModal.js';

export function UnitActionModalEvents(event) {
  const { key } = event;
  if (key === 'Escape') {
    CloseUnitActionModal();
    SelectTargetEnemy();
  }

  if (key === 'Enter') {
    PreAttack();
  }
}
