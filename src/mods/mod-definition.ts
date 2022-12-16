import { Tag } from './tags';
import { ModProvider, ModSource } from './mod-interfaces';
import { ModBuilder } from './mod-builder';

export enum ModType {
  Addition,
  Increase,
  Amplification,
  Dampening,
  Composite,
}

export class Mod implements ModProvider {
  public source: ModSource | undefined;
  public value: number = 0;
  public min: number = 0;
  public max: number = 0;
  /**
   * Target of the mod application. Applied to player by default
   */
  public target: Tag.Player | Tag.Minion | Tag.Sentry = Tag.Player;

  constructor(public definition: ModDefinition) {
  }

  public withSource(source?: ModSource): Mod {
    this.source = source;
    return this;
  }

  public withTarget(target: Tag.Player | Tag.Minion | Tag.Sentry): Mod {
    this.target = target;
    return this;
  }

  public withValue(value: number): Mod {
    this.value = value;
    return this;
  }

  public withMinMax(min: number, max: number): Mod {
    this.min = min;
    this.max = max;
    this.value = (min + max) / 2;
    return this;
  }

  mods(): Mod[] {
    return [this];
  }

  public copyAndAdjust(multiplier = 1.0): Mod {
    const result = new Mod(this.definition);
    result.min = this.min * multiplier;
    result.max = this.max * multiplier;
    result.value = this.value * multiplier;
    result.target = this.target;
    return result;
  }

  toString(): string {
    return(`${this.definition.pattern(this)} (from ${this.source?.source()})`);
  }
}

export class ModDefinition {
  constructor(public category: Tag, public type: ModType, public tags: Tag[], public pattern: (mod: Mod) => string, private builder: ModBuilder) {

  }

  of(value: number, source?: ModSource): Mod {
    return new Mod(this).withValue(value).withSource(source).withTarget(this.builder.target);
  }

  ofMinMax(min: number, max: number, source?: ModSource): Mod {
    return new Mod(this).withMinMax(min, max).withSource(source).withTarget(this.builder.target);
  }
}


