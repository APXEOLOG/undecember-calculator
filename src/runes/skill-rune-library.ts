import { Tag } from '../mods/tags';
import { AuraAndSealEffect, DoTDamage, PoisonDamage, ProjectileCount } from '../mods/mod-library';
import { ModBuilder } from '../mods/mod-builder';
import { RuneRarity, SkillRuneDefinition } from './rune-definition';

export class SkillRune {
  public static SealOfPain = new SkillRuneDefinition({
    name: 'Seal of Pain',
    tags: [Tag.Spell, Tag.AttackSeal, Tag.Toggle],
    rarityBonus: {
      [RuneRarity.Legendary]: [
        AuraAndSealEffect.increase.of(0.25),
      ],
    },
    forLevel: level => {
      if (level === 1) {
        return [
          DoTDamage.amplification.of(0.09),
        ];
      }
      if (level >= 30) {
        return [
          DoTDamage.amplification.of(23.5 + (level - 30) * 0.5), // 0.5 per level
        ];
      }
      return null;
    },
  });
  private static ToxicFlameMultiplier = new ModBuilder(Tag.Multiplier, [
    Tag.Multiplier,
    Tag.SkillMultiplier,
  ], 'Poison DoT');
  public static ToxicFlame: SkillRuneDefinition = new SkillRuneDefinition({
      name: 'Toxic Flame',
      tags: [Tag.Spell, Tag.DoT, Tag.Poison], // Tag.Projectile - not affected by proj damage
      rarityBonus: {
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
      forLevel: level => {
        if (level === 1) {
          return [
            PoisonDamage.addition.of(15),
            SkillRune.ToxicFlameMultiplier.addition.of(0.95),
          ];
        }
        if (level >= 30) {
          return [
            PoisonDamage.addition.of(Math.round(1500 + (level - 30) * 40.4)), // 40.4 per level
            SkillRune.ToxicFlameMultiplier.addition.of(1.55 + (level - 30) * 0.02), // 0.02 per level
          ];
        }
        return null;
      },
      apply: (skillConfiguration, environment) => {
        // SkillDamageMultiplier 26.6% Amplification per stack
        environment.add(SkillRune.ToxicFlameMultiplier.amplification.of(0.266 * (skillConfiguration.stacks ?? 1), SkillRune.ToxicFlame));
      },
    },
  );
}
