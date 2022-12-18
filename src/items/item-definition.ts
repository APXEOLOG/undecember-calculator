import { Mod } from '../mods/mod-definition';
import { ModProvider, ModSource } from '../mods/mod-interfaces';
import { randomUUID } from 'crypto';

export enum ItemType {
  Weapon,
  Other,
}

export class Item implements ModSource, ModProvider {
  public type: ItemType = ItemType.Other;
  public id: string = randomUUID();

  constructor(private allMods: Mod[], public name?: string) {
    allMods.forEach(mod => mod.source = this);
  }

  source(): string {
    return this.name ? `Item: ${this.name}` : 'Item';
  }

  mods(): Mod[] {
    return this.allMods;
  }
}

export class Weapon extends Item {
  constructor(allMods: Mod[], name?: string) {
    super(allMods, name);
    this.type = ItemType.Weapon;
  }
}
