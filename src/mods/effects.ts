import { ArmorPenetration, CastSpeed, ElementalPenetration, MainElementDamage, SpellDamage } from './mod-library';
import { ModSource } from './mod-interfaces';
import { Tag } from './tags';
import { Mod } from './mod-definition';

export const EffectTags = [Tag.Overpower, Tag.Knowledge];

export class EffectSource implements ModSource {
  constructor(private effect: Tag) {

  }

  source(): string {
    return `Effect: ${this.effect}`;
  }
}

// @ts-ignore
export const Effects: { [key in Tag]: Mod[] } = {
  [Tag.Overpower]: [
    MainElementDamage.addition.ofMinMax(25, 45, new EffectSource(Tag.Overpower)),
    ArmorPenetration.increase.of(0.05, new EffectSource(Tag.Overpower)),
    ElementalPenetration.increase.of(0.05, new EffectSource(Tag.Overpower)),
  ],
  [Tag.Knowledge]: [
    CastSpeed.increase.of(0.1),
    SpellDamage.increase.of(0.5),
  ],
}

