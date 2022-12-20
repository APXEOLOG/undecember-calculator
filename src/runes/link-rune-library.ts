import { Tag } from '../mods/tags';
import {
  Damage,
  DoTDamage,
  ElementalDamage,
  ElementalTags,
  PhysicalDamage, PoisonDamage, PoisonPenetration,
  SpellDamage,
  StrikeDamage,
} from '../mods/mod-library';
import { LinkRuneDefinition, RuneRarity } from './rune-definition';

export class LinkRune {
  static ManaStorm: LinkRuneDefinition = new LinkRuneDefinition(
    'Mana Storm',
    [Tag.Strike, Tag.DoT],
    {
      [RuneRarity.Normal]: [],
      [RuneRarity.Magic]: [],
      [RuneRarity.Rare]: [],
      [RuneRarity.Legendary]: [
        StrikeDamage.amplification.of(0.08),
        DoTDamage.amplification.of(0.06),
      ],
    },
    {
      1: [
        StrikeDamage.amplification.of(0.14),
        DoTDamage.amplification.of(0.1),
        Damage.increase.of(0.06),
      ],
      30: [
        StrikeDamage.amplification.of(0.29), // 0.07 per level
        DoTDamage.amplification.of(0.235), // 0.07 per level
        Damage.increase.of(0.06),
      ],
      31: [
        StrikeDamage.amplification.of(0.297),
        DoTDamage.amplification.of(0.242),
        Damage.increase.of(0.06),
      ],
      32: [
        StrikeDamage.amplification.of(0.304),
        DoTDamage.amplification.of(0.249),
        Damage.increase.of(0.06),
      ],
      33: [
        StrikeDamage.amplification.of(0.311),
        DoTDamage.amplification.of(0.256),
        Damage.increase.of(0.06),
      ],
      34: [
        StrikeDamage.amplification.of(0.318),
        DoTDamage.amplification.of(0.263),
        Damage.increase.of(0.06),
      ],
    },
  );

  static ElementDamageAmplification: LinkRuneDefinition = new LinkRuneDefinition(
    'Element DMG Amplification',
    [...ElementalTags],
    {
      [RuneRarity.Normal]: [],
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
    {
      1: [
        ElementalDamage.amplification.of(0.05), // +0.007 per level
      ],
      30: [
        ElementalDamage.amplification.of(0.26),
      ],
      31: [
        ElementalDamage.amplification.of(0.267),
      ],
      32: [
        ElementalDamage.amplification.of(0.274),
      ],
      33: [
        ElementalDamage.amplification.of(0.281),
      ],
      34: [
        ElementalDamage.amplification.of(0.288),
      ],
    },
  );

  static DoT: LinkRuneDefinition = new LinkRuneDefinition(
    'DoT',
    [Tag.Strike, Tag.DoT],
    {
      [RuneRarity.Normal]: [],
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
    {
      1: [
        DoTDamage.amplification.of(0.2),
        StrikeDamage.dampening.of(0.5),
      ],
      30: [
        DoTDamage.amplification.of(0.38), // +0.009 per level
        StrikeDamage.dampening.of(0.5),
      ],
      31: [
        DoTDamage.amplification.of(0.389),
        StrikeDamage.dampening.of(0.5),
      ],
      32: [
        DoTDamage.amplification.of(0.398),
        StrikeDamage.dampening.of(0.5),
      ],
      33: [
        DoTDamage.amplification.of(0.407),
        StrikeDamage.dampening.of(0.5),
      ],
      34: [
        DoTDamage.amplification.of(0.416),
        StrikeDamage.dampening.of(0.5),
      ],
    },
  );

  static SpellDamageIncrease: LinkRuneDefinition = new LinkRuneDefinition(
    'Spell DMG Increase',
    [Tag.Strike, Tag.DoT, Tag.Spell],
    {
      [RuneRarity.Normal]: [],
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
    {
      1: [
        SpellDamage.increase.of(0.2),
      ],
      30: [
        SpellDamage.increase.of(1.04),
      ],
      31: [
        SpellDamage.increase.of(1.092),
      ],
      32: [
        SpellDamage.increase.of(1.144),
      ],
      33: [
        SpellDamage.increase.of(1.196),
      ],
      34: [
        SpellDamage.increase.of(1.284),
      ],
    },
  );

  static PoisonPenetration: LinkRuneDefinition = new LinkRuneDefinition(
    'Poison Penetration',
    [Tag.Poison],
    {
      [RuneRarity.Normal]: [],
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
    {
      1: [
        PoisonDamage.increase.of(0.1),
        PoisonPenetration.addition.of(8),
      ],
      30: [
        PoisonDamage.increase.of(0.52),
        PoisonPenetration.addition.of(20),
      ],
      31: [
        PoisonDamage.increase.of(0.54),
        PoisonPenetration.addition.of(21),
      ],
      32: [
        PoisonDamage.increase.of(0.56),
        PoisonPenetration.addition.of(21),
      ],
      33: [
        PoisonDamage.increase.of(0.58),
        PoisonPenetration.addition.of(22),
      ],
      34: [
        PoisonDamage.increase.of(0.6),
        PoisonPenetration.addition.of(22),
      ],
    },
  );

  static AdditionalPoisonDamage: LinkRuneDefinition = new LinkRuneDefinition(
    'Additional Poison DMG',
    [Tag.Poison],
    {
      [RuneRarity.Normal]: [],
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
    {
      1: [
        PoisonDamage.addition.ofMinMax(23, 33),
      ],
      30: [
        PoisonDamage.addition.ofMinMax(80, 147),
      ],
      31: [
        PoisonDamage.addition.ofMinMax(82, 152),
      ],
      32: [
        PoisonDamage.addition.ofMinMax(85, 156),
      ],
      33: [
        PoisonDamage.addition.ofMinMax(87, 160),
      ],
      34: [
        PoisonDamage.addition.ofMinMax(90, 165),
      ],
    },
  );
}

