import { Tag } from '../mods/tags';
import {
  Damage,
  DoTAcceleration,
  DoTDamage,
  ElementalDamage,
  ElementTags,
  PhysicalDamage,
  PoisonDamage,
  PoisonPenetration,
  SpellDamage,
  StrikeDamage,
} from '../mods/mod-library';
import { LinkRuneDefinition, RuneRarity } from './rune-definition';

export class LinkRune {
  static ManaStorm: LinkRuneDefinition = new LinkRuneDefinition({
      name: 'Mana Storm',
      tags: [Tag.Strike, Tag.DoT],
      rarityBonus: {
        [RuneRarity.Legendary]: [
          StrikeDamage.amplification.of(0.08),
          DoTDamage.amplification.of(0.06),
        ],
      },
      forLevel: level => {
        if (level === 1) {
          return [
            StrikeDamage.amplification.of(0.14),
            DoTDamage.amplification.of(0.1),
            Damage.increase.of(0.06),
          ];
        }
        if (level >= 30) {
          return [
            StrikeDamage.amplification.of(0.29 + (level - 30) * 0.007), // 0.007 per level
            DoTDamage.amplification.of(0.235 + (level - 30) * 0.007), // 0.007 per level
            Damage.increase.of(0.06),
          ];
        }
        return null;
      },
    },
  );

  static ElementDamageAmplification: LinkRuneDefinition = new LinkRuneDefinition({
      name: 'Element DMG Amplification',
      tags: [...ElementTags],
      rarityBonus: {
        [RuneRarity.Magic]: [
          PhysicalDamage.dampening.of(1),
        ],
        [RuneRarity.Rare]: [
          PhysicalDamage.dampening.of(1),
          ElementalDamage.increase.of(0.2),
        ],
        [RuneRarity.Legendary]: [
          PhysicalDamage.dampening.of(0.5),
          ElementalDamage.increase.of(0.5),
        ],
      },
      forLevel: level => {
        if (level === 1) {
          return [
            ElementalDamage.amplification.of(0.05),
          ];
        }
        if (level >= 30) {
          return [
            ElementalDamage.amplification.of(0.26 + (level - 30) * 0.007), // 0.007 per level
          ];
        }
        return null;
      },
    },
  );

  static DoT: LinkRuneDefinition = new LinkRuneDefinition({
      name: 'DoT',
      tags: [Tag.Strike, Tag.DoT],
      rarityBonus: {
        [RuneRarity.Magic]: [
          DoTDamage.increase.of(0.15),
        ],
        [RuneRarity.Rare]: [
          DoTDamage.increase.of(0.3),
        ],
        [RuneRarity.Legendary]: [
          DoTDamage.increase.of(0.5),
        ],
      },
      forLevel: level => {
        if (level === 1) {
          return [
            DoTDamage.amplification.of(0.2),
            StrikeDamage.dampening.of(0.5),
          ];
        }
        if (level >= 30) {
          return [
            DoTDamage.amplification.of(0.38 + (level - 30) * 0.009), // +0.009 per level
            StrikeDamage.dampening.of(0.5),
          ];
        }
        return null;
      },
    },
  );

  static SpellDamageIncrease: LinkRuneDefinition = new LinkRuneDefinition({
      name: 'Spell DMG Increase',
      tags: [Tag.Strike, Tag.DoT, Tag.Spell],
      rarityBonus: {
        [RuneRarity.Magic]: [
          SpellDamage.increase.of(0.2),
        ],
        [RuneRarity.Rare]: [
          SpellDamage.increase.of(0.4),
        ],
        [RuneRarity.Legendary]: [
          SpellDamage.increase.of(0.6),
        ],
      },
      forLevel: level => {
        if (level === 1) {
          return [
            SpellDamage.increase.of(0.2),
          ];
        }
        if (level >= 30) {
          return [
            SpellDamage.increase.of(1.04 + (level - 30) * 0.052), // + 0.052 per level
          ];
        }
        return null;
      },
    },
  );

  static PoisonPenetration: LinkRuneDefinition = new LinkRuneDefinition({
      name: 'Poison Penetration',
      tags: [Tag.Poison],
      rarityBonus: {
        [RuneRarity.Magic]: [
          PoisonPenetration.addition.of(3),
        ],
        [RuneRarity.Rare]: [
          PoisonPenetration.addition.of(6),
        ],
        [RuneRarity.Legendary]: [
          PoisonPenetration.addition.of(9),
        ],
      },
      forLevel: level => {
        if (level === 1) {
          return [
            PoisonDamage.increase.of(0.1),
            PoisonPenetration.addition.of(8),
          ];
        }
        if (level >= 30) {
          return [
            PoisonDamage.increase.of(0.52 + (level - 30) * 0.02), // + 0.02 per level
            PoisonPenetration.addition.of(Math.round(20 + (level - 30) * 0.5)), // +1 per 2 levels (guess we can code is +0.5 for now)
          ];
        }
        return null;
      },
    },
  );

  static AdditionalPoisonDamage: LinkRuneDefinition = new LinkRuneDefinition({
      name: 'Additional Poison DMG',
      tags: [Tag.Poison],
      rarityBonus: {
        [RuneRarity.Magic]: [
          PoisonDamage.addition.ofMinMax(16, 24),
        ],
        [RuneRarity.Rare]: [
          PoisonDamage.addition.ofMinMax(32, 48),
        ],
        [RuneRarity.Legendary]: [
          PoisonDamage.addition.ofMinMax(32, 48),
          PoisonDamage.amplification.of(0.05),
        ],
      },
      forLevel: level => {
        if (level === 1) {
          return [
            PoisonDamage.addition.ofMinMax(23, 33),
          ];
        }
        if (level >= 30) {
          return [
            PoisonDamage.addition.ofMinMax(Math.round(80 + (level - 30) * 2.4), Math.round(147.1 + (level - 30) * 4.4)), // 2.4 per level | 4.4 per level (not exactly)
          ];
        }
        return null;
      },
    },
  );

  static DMGAcceleration: LinkRuneDefinition = new LinkRuneDefinition({
      name: 'DMG Acceleration',
      tags: [Tag.Strike, Tag.DoT],
      rarityBonus: {
        [RuneRarity.Legendary]: [
          DoTDamage.increase.of(0.5),
        ],
      },
      forLevel: level => {
        if (level === 1) {
          return [
            DoTAcceleration.increase.of(0.1),
          ];
        }
        if (level >= 30) {
          return [
            DoTAcceleration.increase.of(Math.round(0.39 + (level - 30) * 0.05)), // 0.05 per level
          ];
        }
        return null;
      },
    },
  );
}

