import { Mod, ModProvider, ModSource } from '../mods/mod-definition';

export class ZodiacConstellation implements ModSource, ModProvider {
  constructor(public name: string, public tier: string, public nodes: ZodiacNode[]) {
    nodes.forEach(node => {
      node.mods.forEach(it => it.source = this);
    });
  }
  source(): string {
    return `Zodiac ${this.tier}: ${this.name}`;
  }

  mods(): Mod[] {
    return this.nodes.map(it => it.mods).flat();
  }
}

export interface ZodiacNode {
  mods: Mod[];
}

export function zodiacNode(...mods: Mod[]): ZodiacNode {
  return {
    mods,
  }
}
