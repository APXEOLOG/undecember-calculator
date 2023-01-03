import { Mod } from '../mods/mod-definition';
import { Tag } from '../mods/tags';
import { SkillConfiguration } from './skill-configuration';
import { Environment } from '../calculation/mod-group';
import { ModProvider, ModSource } from '../mods/mod-interfaces';

export enum RuneRarity {
  Normal = 'Normal',
  Magic = 'Magic',
  Rare = 'Rare',
  Legendary = 'Legendary',
}

export const RuneRarityOrder = [RuneRarity.Normal, RuneRarity.Magic, RuneRarity.Rare, RuneRarity.Legendary];

export function isMoreRare(base: RuneRarity, other: RuneRarity): boolean {
  return RuneRarityOrder.indexOf(base) > RuneRarityOrder.indexOf(other);
}

export interface RuneLevelDefinition {
  [level: number]: Mod[];
}

export type RuneRarityBonus = {
  [RuneRarity.Normal]?: Mod[];
  [RuneRarity.Magic]?: Mod[];
  [RuneRarity.Rare]?: Mod[];
  [RuneRarity.Legendary]?: Mod[];
};

export interface SpecificRuneConfiguration extends ModProvider {
  definition: RuneDefinition;
  tags: Tag[];
  apply?: (skillConfiguration: SkillConfiguration, environment: Environment) => void;
}

export interface RuneDefinitionData {
  name: string;
  tags: Tag[];
  rarityBonus: RuneRarityBonus;
  apply?: (skillConfiguration: SkillConfiguration, environment: Environment) => void;
  forLevel: (level: number) => Mod[] | null;
}

export class RuneDefinition implements ModSource {
  /**
   * What is the mod target for this rune. Default is player
   */
  public target: Tag.Player | Tag.Minion | Tag.Sentry = Tag.Player;

  constructor(public data: RuneDefinitionData) {

  }

  forTarget(target: Tag.Player | Tag.Minion | Tag.Sentry = Tag.Player): RuneDefinition {
    this.target = target;
    return this;
  }

  source(): string {
    return `Rune: ${this.data.name}`;
  }

  of(rarity: RuneRarity, level: number): SpecificRuneConfiguration {
    const mods = this.data.forLevel(level);
    if (!mods) {
      throw new Error(`${this.source()} - No data for level ${level}`);
    }
    mods.forEach(it => it.source = this);
    const rarityMods: Mod[] = this.data.rarityBonus[rarity] ?? [];
    rarityMods.forEach(it => it.source = this);
    return {
      definition: this,
      tags: this.data.tags,
      mods: () => [...mods, ...rarityMods],
      apply: this.data.apply,
    }
  }

  public forLevel(level: number): RuneLevelDefinition {
    throw new Error(`No scaling formula defined for rune ${this.data.name}`);
  }
}

export class SkillRuneDefinition extends RuneDefinition {
  constructor(data: RuneDefinitionData) {
    super(data);
  }

  source(): string {
    return `Skill Rune: ${this.data.name}`;
  }
}

export class LinkRuneDefinition extends RuneDefinition {
  constructor(data: RuneDefinitionData) {
    super(data);
  }

  source(): string {
    return `Link Rune: ${this.data.name}`;
  }
}
