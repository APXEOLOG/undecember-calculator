import { Mod } from './mods/mod-definition';
import { ModProvider, ModSource } from './mods/mod-interfaces';

export class Item implements ModSource, ModProvider {
  constructor(public name: string, public allMods: Mod[]) {
  }

  source(): string {
    return `Item: ${this.name}`;
  }

  mods(): Mod[] {
    return this.allMods;
  }
}

