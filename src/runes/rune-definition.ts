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

export interface RuneLevelDefinition {
  [level: number]: Mod[];
}

export type RuneRarityBonus = {
  [key in RuneRarity]: Mod[];
};

export interface SpecificRuneConfiguration extends ModProvider {
  definition: RuneDefinition;
  tags: Tag[];
  apply?: (skillConfiguration: SkillConfiguration, environment: Environment) => void;
}

export class RuneDefinition implements ModSource {
  /**
   * What is the mod target for this rune. Default is player
   */
  public target: Tag.Player | Tag.Minion | Tag.Sentry = Tag.Player;

  constructor(public name: string, public tags: Tag[], public rarityBonus: RuneRarityBonus, public levels: RuneLevelDefinition, public apply?: (skillConfiguration: SkillConfiguration, environment: Environment) => void) {
    this.rarityBonus.Magic.forEach(it => it.source = this);
    this.rarityBonus.Rare.forEach(it => it.source = this);
    this.rarityBonus.Legendary.forEach(it => it.source = this);
    for (let level in this.levels) {
      this.levels[level].forEach(it => it.source = this);
    }
  }

  forTarget(target: Tag.Player | Tag.Minion | Tag.Sentry = Tag.Player): RuneDefinition {
    this.target = target;
    return this;
  }

  source(): string {
    return `Rune: ${this.name}`;
  }

  of(rarity: RuneRarity, level: number): SpecificRuneConfiguration {
    if (!this.levels[level]) {
      throw new Error(`${this.source()} - No data for level ${level}`);
    }
    return {
      definition: this,
      tags: this.tags,
      mods: () => [...this.levels[level], ...this.rarityBonus[rarity]],
      apply: this.apply,
    }
  }
}

export class SkillRune extends RuneDefinition {
  constructor(name: string, tags: Tag[], rarityBonus: RuneRarityBonus, levels: RuneLevelDefinition, apply?: (skillConfiguration: SkillConfiguration, environment: Environment) => void) {
    super(name, tags, rarityBonus, levels, apply);
  }

  source(): string {
    return `Skill Rune: ${this.name}`;
  }
}

export class LinkRune extends RuneDefinition {
  constructor(name: string, tags: Tag[], rarityBonus: RuneRarityBonus, levels: RuneLevelDefinition, apply?: (skillConfiguration: SkillConfiguration, environment: Environment) => void) {
    super(name, tags, rarityBonus, levels, apply);
  }

  source(): string {
    return `Link Rune: ${this.name}`;
  }
}
