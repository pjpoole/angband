// effects.c, expression_base_value_f
// Expressions show up in configuration files for shape, activation, class,
// curse, monster_spell, object, trap
export enum EX {
  SPELL_POWER,
  PLAYER_LEVEL,
  DUNGEON_LEVEL,
  MAX_SIGHT,
  WEAPON_DAMAGE,
  PLAYER_HP,
  MONSTER_PERCENT_HP_GONE,
}

export const EX_HANDLERS = {
  [EX.SPELL_POWER]: effectValueSpellPower,
  [EX.PLAYER_LEVEL]: effectValuePlayerLevel,
  [EX.DUNGEON_LEVEL]: effectValueDungeonLevel,
  [EX.MAX_SIGHT]: effectValueMaxSight,
  [EX.WEAPON_DAMAGE]: effectValueWeaponDamage,
  [EX.PLAYER_HP]: effectValuePlayerHp,
  [EX.MONSTER_PERCENT_HP_GONE]: effectValueMonsterPercentHpGone,
}

// TODO: flesh out; understand expression logic
export interface Expression {
  name: string
}

function effectValueSpellPower() {}
function effectValuePlayerLevel() {}
function effectValueDungeonLevel() {}
function effectValueMaxSight() {}
function effectValueWeaponDamage() {}
function effectValuePlayerHp() {}
function effectValueMonsterPercentHpGone() {}
