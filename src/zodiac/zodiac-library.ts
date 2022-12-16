import { ZodiacConstellation, zodiacNode } from './zodiac';
import {
  CastSpeed,
  Damage,
  DoTDamage,
  ElementalDamage,
  ElementalResists,
  Health,
  HitRate,
  Mana,
  SpellDamage,
  SpellHitRate,
} from '../mods/mod-library';


// Tier I
export const Cliff = new ZodiacConstellation('Cliff', 'I', [
  zodiacNode(SpellDamage.increase.of(0.05), Health.addition.of(13)),
  zodiacNode(SpellDamage.increase.of(0.1)),
  zodiacNode(SpellDamage.increase.of(0.1), SpellHitRate.increase.of(0.1)),
  zodiacNode(SpellDamage.increase.of(0.1)),
  zodiacNode(SpellDamage.increase.of(0.1), CastSpeed.increase.of(0.02)),
]);

export const Forest = new ZodiacConstellation('Forest', 'II', [
  zodiacNode(Damage.increase.of(0.1)),
  zodiacNode(ElementalDamage.increase.of(0.1)),
  zodiacNode(ElementalDamage.increase.of(0.1), HitRate.increase.of(0.1)),
  zodiacNode(ElementalDamage.increase.of(0.1)),
  zodiacNode(Damage.increase.of(0.2), HitRate.increase.of(0.1)),
]);

export const Gem = new ZodiacConstellation('Gem', 'III', [
  zodiacNode(SpellDamage.increase.of(0.1)),
  zodiacNode(SpellHitRate.increase.of(0.1)),
  zodiacNode(SpellDamage.increase.of(0.1), Health.addition.of(25)),
  zodiacNode(Health.increase.of(0.03)),
  zodiacNode(SpellDamage.increase.of(0.1), SpellHitRate.increase.of(0.1)),
]);

export const Seed = new ZodiacConstellation('Seed', 'IV', [
  zodiacNode(SpellDamage.increase.of(0.1)),
  zodiacNode(DoTDamage.increase.of(0.1)),
  zodiacNode(SpellDamage.increase.of(0.1), SpellHitRate.increase.of(0.1)),
  zodiacNode(DoTDamage.increase.of(0.1)),
  zodiacNode(SpellDamage.increase.of(0.1), Mana.addition.of(30)),
]);

export const Flash = new ZodiacConstellation('Flash', 'V', [
  zodiacNode(ElementalDamage.increase.of(0.1)),
  zodiacNode(ElementalResists.addition.of(2)),
  zodiacNode(ElementalDamage.increase.of(0.1), Health.addition.of(25)),
  zodiacNode(ElementalResists.addition.of(2)),
  zodiacNode(ElementalDamage.increase.of(0.1), Health.increase.of(0.03)),
]);

export const MasteryShade = new ZodiacConstellation('Shade', 'Specialization I', [
  zodiacNode(Damage.increase.of(0.15)),
]);

