import { Tag } from '../mods/tags';
import { DoTDamage, PoisonDamage, ProjectileCount } from '../mods/mod-library';
import { ModBuilder } from '../mods/mod-builder';
import { RuneRarity, SkillRune } from './rune-definition';

const ToxicFlameMultiplier = new ModBuilder(Tag.Multiplier, [Tag.Multiplier, Tag.SkillMultiplier], 'Poison DoT');
export const ToxicFlame: SkillRune = new SkillRune(
  'Toxic Flame',
  [Tag.Spell, Tag.DamageOverTime, Tag.Poison], // Tag.Projectile - not affected by proj damage
  {
    [RuneRarity.Magic]: [
      DoTDamage.increase.of(0.2),
    ],
    [RuneRarity.Rare]: [
      DoTDamage.increase.of(0.6),
      ProjectileCount.addition.of(2),
    ],
    [RuneRarity.Legendary]: [
      DoTDamage.increase.of(1.0),
      ProjectileCount.addition.of(2),
    ],
  },
  {
    1: [
      PoisonDamage.addition.of(15),
      ToxicFlameMultiplier.addition.of(0.95),
    ],
    30: [
      PoisonDamage.addition.of(1500),
      ToxicFlameMultiplier.addition.of(1.55),
    ],
  },
  (skillConfiguration, environment) => {
    // SkillDamageMultiplier 26.6% Amplification per stack
    environment.add(ToxicFlameMultiplier.amplification.of(0.266 * (skillConfiguration.stacks ?? 1), ToxicFlame));
  },
);
