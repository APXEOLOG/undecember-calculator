import { Mod } from '../mods/mod-definition';
import { ModProvider, ModSource } from '../mods/mod-interfaces';

export class TitlesEffect implements ModSource, ModProvider {
  constructor(private allMods: Mod[]) {
    allMods.forEach(it => it.source = this);
  }

  mods(): Mod[] {
    return this.allMods;
  }

  source(): string {
    return `Titles`;
  }
}
