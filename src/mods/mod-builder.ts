import { ModDefinition, ModType } from './mod-definition';
import { Tag } from './tags';

export class ModBuilder {
  public increase: ModDefinition;
  public amplification: ModDefinition;
  public dampening: ModDefinition;
  public addition: ModDefinition;

  constructor(private category: Tag, private baseTags: Tag[], private description: string) {
    this.increase = this.definition(ModType.Increase);
    this.amplification = this.definition(ModType.Amplification);
    this.dampening = this.definition(ModType.Dampening);
    this.addition = this.definition(ModType.Addition);
  }

  private definition(type: ModType): ModDefinition {
    return new ModDefinition(this.category, type, this.baseTags, mod => this.pattern(type, mod.value));
  }

  private pattern(type: ModType, value: number): string {
    switch (type) {
      case ModType.Addition: return `+ ${value} ${this.description}`;
      case ModType.Increase: return `+ ${value * 100}% ${this.description}`;
      case ModType.Amplification: return `${value * 100}% ${this.description} Amplification`;
      case ModType.Dampening: return `${this.description} ${value * 100}% Dampening`;
      default: return `Unknown pattern for ${this.description} (${value})`;
    }
  }
}
