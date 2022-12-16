import { Tag } from './tags';

export interface ModSource {
  source(): string;
}

export interface ModProvider {
  mods(): Mod[];
}

export enum ModType {
  Addition,
  Increase,
  Amplification,
  Dampening,
}

export class Mod implements ModProvider {
  public source: ModSource | undefined;
  public value: number = 0;

  constructor(public definition: ModDefinition) {
  }

  public withSource(source?: ModSource): Mod {
    this.source = source;
    return this;
  }

  public withValue(value: number): Mod {
    this.value = value;
    return this;
  }

  mods(): Mod[] {
    return [this];
  }
}

export class ModDefinition {
  constructor(public category: Tag, public type: ModType, public tags: Tag[], public pattern: (mod: Mod) => string) {

  }

  of(value: number, source?: ModSource): Mod {
    return new Mod(this).withValue(value).withSource(source);
  }
}


