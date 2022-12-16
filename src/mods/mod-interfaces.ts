import { Mod } from './mod-definition';

export interface ModSource {
  source(): string;
}

export interface ModProvider {
  mods(): Mod[];
}

export class ModProxySource implements ModSource {
  constructor(public proxyName: string, public proxy?: ModSource) {
  }

  source(): string {
    return this.proxyName + (this.proxy ? ` (from ${this.proxy?.source()})` : '');
  }
}
