import { Mod } from '../mods/mod-definition';
import { ModProvider, ModSource } from '../mods/mod-interfaces';

export class ModContainer implements ModSource, ModProvider {
  constructor(public name: string, private allMods: Mod[]) {
    allMods.forEach(it => it.source = this);
  }

  mods(): Mod[] {
    return this.allMods;
  }

  source(): string {
    return this.name;
  }
}
