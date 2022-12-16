import { Tag } from '../mods/tags';
import {
  Damage,
  DoTDamage,
  ElementalDamage,
  ElementalTags,
  PhysicalDamage,
  SpellDamage,
  StrikeDamage,
} from '../mods/mod-library';
import { LinkRune, RuneRarity } from './rune-definition';

export const ManaStorm: LinkRune = new LinkRune(
  'Mana Storm',
  [Tag.Strike, Tag.DamageOverTime],
  {
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

export const ElementDamageAmplification: LinkRune = new LinkRune(
  'Element DMG Amplification',
  [...ElementalTags],
  {
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

export const DoT: LinkRune = new LinkRune(
  'DoT',
  [Tag.Strike, Tag.DamageOverTime],
  {
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

export const SpellDamageIncrease: LinkRune = new LinkRune(
  'Spell DMG Increase',
  [Tag.Strike, Tag.DamageOverTime, Tag.Spell],
  {
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
