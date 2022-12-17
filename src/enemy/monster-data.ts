export const MonsterDefaultElementalResistances = 10.0;
export const MonsterElementalResistancesPerLevel = 0.45;

export function getMonsterFlatElementalResistancesForLevel(level: number): number {
  return MonsterDefaultElementalResistances + MonsterElementalResistancesPerLevel * (level - (100 - level) / 100);
}

export class MonsterData {
  public flatElementalResist: number;

  constructor(public level: number, public elementalResistEffect: number) {
    this.flatElementalResist = getMonsterFlatElementalResistancesForLevel(level);
  }

  public calculateElementalDamageMultiplierFromResists(flatResistReduction: number, percentResistReduction: number): number {
    // 1. Apply percent-based reduction
    // 2. Apply flat reduction

    // How much flat res do we ignore from % penetration
    const flatResAfterPercentReduction = this.flatElementalResist - (this.flatElementalResist * percentResistReduction);

    // Final amount of flat res
    const finalFlatRes = flatResAfterPercentReduction - flatResistReduction;

    // Calculate resistance
    const finalElemResist = this.calculateElementalResistance(finalFlatRes);

    // Convert into damage multiplier
    return 1 - (finalElemResist / 100);
  }

  public calculateElementalResistance(flatResist: number = this.flatElementalResist): number {
    return flatResist * this.elementalResistEffect;
  }

  toString(): string {
    return `Level ${this.level}; Base ElementalResistance=${this.calculateElementalResistance()}% (Flat=${this.flatElementalResist})`;
  }
}

export const MonsterLevel = {
  1: new MonsterData(1, 0.99),
  10: new MonsterData(100, 0.909),
  20: new MonsterData(100, 0.8335),
  30: new MonsterData(100, 0.769),
  40: new MonsterData(100, 0.7145),
  50: new MonsterData(100, 0.667),
  60: new MonsterData(100, 0.626),
  70: new MonsterData(100, 0.588),
  80: new MonsterData(100, 0.555),
  90: new MonsterData(100, 0.525),
  100: new MonsterData(100, 0.5),
}
