import { Tag } from '../mods/tags';
import { Mod, ModType } from '../mods/mod-definition';
import { ModProvider } from '../mods/mod-interfaces';

function hasAllTags(source: Tag[], tags: Tag[]): boolean {
  return tags.map(it => source.includes(it)).reduce((prev, cur) => prev && cur, true);
}

function hasAnyTags(source: Tag[], tags: Tag[]): boolean {
  return tags.map(it => source.includes(it)).reduce((prev, cur) => prev || cur, false);
}

function normalSum(mods: Mod[], fieldName: 'value' | 'min' | 'max' = 'value'): number {
  return mods.reduce((prev, cur) => prev + cur[fieldName], 0) ?? 0;
}

function normalProduct(mods: Mod[]): number {
  return mods.length ? mods.reduce((prev, cur) => prev * cur.value, 1) : 0;
}

function oneAddProduct(mods: Mod[]): number {
  return mods.reduce((prev, cur) => prev * (1 + cur.value), 1);
}

function oneSubProduct(mods: Mod[]): number {
  return mods.reduce((prev, cur) => prev * (1 - cur.value), 1);
}

export class CalculatedValue {
  public min: number;
  public max: number;

  constructor(public flat: number, public increase: number, public amplification: number, public dampening: number, public total: number) {
    this.min = 0;
    this.max = 0;
  }

  toString(): string {
    return `Total=${this.total}; Flat=${this.flat}; Increase=${this.increase}; Amplification=${this.amplification}; Dampening=${this.dampening}`;
  }
}

export class Environment implements ModProvider {
  private readonly envMods: Mod[];

  constructor(source?: Mod[]) {
    this.envMods = source ?? [];
  }

  mods(): Mod[] {
    return this.envMods;
  }

  addAll(input: Mod[]) {
    input.forEach(it => this.envMods.push(it));
  }

  add(input: Mod) {
    this.envMods.push(input);
  }

  ofCategory(category: Tag): Environment {
    const filtered = this.envMods.filter(it => it.definition.category === category);
    return new Environment(filtered);
  }

  ofTarget(target: Tag.Player | Tag.Minion | Tag.Sentry): Environment {
    const filtered = this.envMods.filter(it => it.target === target);
    return new Environment(filtered);
  }

  findWithAllTags(tags: Tag[]): Environment {
    const filtered = this.envMods.filter(it => hasAllTags(it.definition.tags, tags));
    return new Environment(filtered);
  }

  findWithAnyTags(tags: Tag[]): Environment {
    const filtered = this.envMods.filter(it => hasAnyTags(it.definition.tags, tags));
    return new Environment(filtered);
  }

  ofType(type: ModType): Environment {
    const filtered = this.envMods.filter(it => it.definition.type === type);
    return new Environment(filtered);
  }

  removeDuplicatedModsOfType(type: ModType): Environment {
    const existing = this.envMods.find(it => it.definition.type === type);
    if (existing) {
      const result = this.envMods.filter(it => it.definition.type !== type);
      result.push(existing);
      return new Environment(result);
    }
    // No change required
    return this;
  }

  /**
   * Perform flat - increase - amplify - dampen pipeline calculation for the values in the env
   * Assuming they already filtered properly
   */
  calculateValue(useMinMax = false): CalculatedValue {
    const flatMods = this.envMods.filter(it => it.definition.type === ModType.Addition);
    const increaseMods = this.envMods.filter(it => it.definition.type === ModType.Increase);
    const amplifyMods = this.envMods.filter(it => it.definition.type === ModType.Amplification);
    const dampeningMods = this.envMods.filter(it => it.definition.type === ModType.Dampening);

    const increaseValue = normalSum(increaseMods);
    const amplifyValue = oneAddProduct(amplifyMods);
    const dampeningValue = oneSubProduct(dampeningMods);

    if (useMinMax) {
      const flatMin = normalSum(flatMods, 'min');
      const flatMax = normalSum(flatMods, 'max');
      // Values should be rounded in this case
      const totalMin = Math.round(flatMin * (1 + increaseValue) * amplifyValue * dampeningValue);
      const totalMax = Math.round(flatMax * (1 + increaseValue) * amplifyValue * dampeningValue);
      const result = new CalculatedValue((flatMin + flatMax) / 2, increaseValue, amplifyValue - 1, dampeningValue - 1, (totalMin + totalMax) / 2);
      result.min = totalMin;
      result.max = totalMax;
      return result;
    } else {
      const flatValue = normalSum(flatMods);
      const total = flatValue * (1 + increaseValue) * amplifyValue * dampeningValue;
      return new CalculatedValue(flatValue, increaseValue, amplifyValue - 1, dampeningValue - 1, total);
    }
  }

  normalSum(): number {
    return normalSum(this.envMods);
  }

  diminishingSum(): number {
    return 1 - this.envMods
      .map(it => 1 - it.value)
      .reduce((prev, cur) => prev * cur, 1);
  }

  debugPrint(envName?: string): void {
    if (envName) {
      console.log(`${envName}`);
    }
    this.envMods.forEach(mod => console.log(`  # ${mod.toString()})`));
  }
}
