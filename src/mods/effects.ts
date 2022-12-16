import { Mod, ModSource } from './mod-definition';

export class Effect implements ModSource {
  constructor(public name: string, public mods: Mod[], public parentSource?: ModSource) {
  }

  source(): string {
    return this.parentSource?.source() ?? '';
  }
}

export const Overpower = new Effect('Overpower', [

]);
