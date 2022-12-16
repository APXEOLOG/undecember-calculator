import { Tag } from '../mods/tags';
import { Mod, ModProvider, ModType } from '../mods/mod-definition';

function hasAllTags(source: Tag[], tags: Tag[]): boolean {
  return tags.map(it => source.includes(it)).reduce((prev, cur) => prev && cur, true);
}

function hasAnyTags(source: Tag[], tags: Tag[]): boolean {
  return tags.map(it => source.includes(it)).reduce((prev, cur) => prev || cur, false);
}

function normalSum(mods: Mod[]): number {
  return mods.reduce((prev, cur) => prev + cur.value, 0) ?? 0;
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

export interface CalculatedValue {
  flat: number,
  increase: number;
  amplification: number;
  dampening: number;
  total: number;
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

  /**
   * Perform flat - increase - amplify - dampen pipeline calculation for the values in the env
   * Assuming they already filtered properly
   */
  calculateValue(): CalculatedValue {
    const flatMods = this.envMods.filter(it => it.definition.type === ModType.Addition);
    const increaseMods = this.envMods.filter(it => it.definition.type === ModType.Increase);
    const amplifyMods = this.envMods.filter(it => it.definition.type === ModType.Amplification);
    const dampeningMods = this.envMods.filter(it => it.definition.type === ModType.Dampening);

    const flatValue = normalSum(flatMods);
    const increaseValue = normalSum(increaseMods);
    const amplifyValue = oneAddProduct(amplifyMods);
    const dampeningValue = oneSubProduct(dampeningMods);

    return {
      flat: flatValue,
      increase: increaseValue,
      amplification: amplifyValue - 1,
      dampening: dampeningValue - 1,
      total: flatValue * (1 + increaseValue) * amplifyValue * dampeningValue,
    };
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
    this.envMods.forEach(mod => console.log(`  ${mod.definition.pattern(mod)} (from ${mod.source?.source()})`));
    console.log();
  }
}
