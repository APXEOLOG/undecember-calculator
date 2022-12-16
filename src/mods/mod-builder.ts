import { ModDefinition, ModType } from './mod-definition';
import { Tag } from './tags';

export class ModBuilder {
  public increase: ModDefinition;
  public amplification: ModDefinition;
  public dampening: ModDefinition;
  public addition: ModDefinition;

  /**
   * Target of the mod application. Applied to player by default
   */
  public target: Tag.Player | Tag.Minion | Tag.Sentry = Tag.Player;

  constructor(private category: Tag, private baseTags: Tag[], private description: string) {
    this.increase = this.definition(ModType.Increase, this);
    this.amplification = this.definition(ModType.Amplification, this);
    this.dampening = this.definition(ModType.Dampening, this);
    this.addition = this.definition(ModType.Addition, this);
  }

  forTarget(target: Tag.Player | Tag.Minion | Tag.Sentry): ModBuilder {
    this.target = target;
    return this;
  }

  private definition(type: ModType, builder: ModBuilder): ModDefinition {
    return new ModDefinition(this.category, type, this.baseTags, mod => this.pattern(type, mod.value), builder);
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
