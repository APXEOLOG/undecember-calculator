import { ZodiacConstellation, zodiacNode } from './zodiac';
import {
  AccelerationEffect,
  CastSpeed,
  Damage,
  DisableCritical,
  DoTAcceleration,
  DoTDamage,
  DoTMultiplier,
  ElementalDamage,
  ElementalPenetration,
  ElementalResists,
  GrantAcceleration,
  GrantKnowledge,
  GrantOverpower,
  Health,
  HitRate,
  KnowledgeEffect,
  Mana,
  OverpowerEffect,
  PoisonDamage,
  PoisonPenetration,
  SpellDamage,
  SpellHitRate,
  StrikeDamage,
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
  // zodiacNode(DoTDamage.increase.of(0.1)), Taken AOE instead
  zodiacNode(SpellDamage.increase.of(0.1), Mana.addition.of(30)),
]);

export const Flash = new ZodiacConstellation('Flash', 'V', [
  zodiacNode(ElementalDamage.increase.of(0.1)),
  zodiacNode(ElementalResists.addition.of(2)),
  zodiacNode(ElementalDamage.increase.of(0.1), Health.addition.of(25)),
  zodiacNode(ElementalResists.addition.of(2)),
  zodiacNode(ElementalDamage.increase.of(0.1), Health.increase.of(0.03)),
]);

export const Breath = new ZodiacConstellation('Breath', 'VI', [
  zodiacNode(ElementalDamage.increase.of(0.1)),
  zodiacNode(PoisonDamage.increase.of(0.1)),
  zodiacNode(PoisonDamage.increase.of(0.1), HitRate.increase.of(0.1)),
  zodiacNode(HitRate.increase.of(0.1)),
  zodiacNode(PoisonPenetration.increase.of(0.08)),
]);

export const Ortemis = new ZodiacConstellation('Ortemis', 'VII', [
  zodiacNode(Damage.increase.of(0.09)),
]);

export const Farmer = new ZodiacConstellation('Farmer', 'VIII', [
  zodiacNode(Damage.increase.of(0.09)),
]);

export const Hunter = new ZodiacConstellation('Hunter', 'VIII', [
  zodiacNode(Damage.increase.of(0.09)),
]);

export const Maggot = new ZodiacConstellation('Maggot', 'VII', [
  zodiacNode(Damage.increase.of(0.4)),
]);

export const Laia = new ZodiacConstellation('Laia', 'VIII', [
  // All cluster is for dual wielding, but it's not supported for now
  zodiacNode(Damage.increase.of(0.1)),
  zodiacNode(ElementalDamage.increase.of(0.3)),
  zodiacNode(Damage.increase.of(0.3)),
  zodiacNode(Damage.increase.of(0.1)),
  zodiacNode(Damage.increase.of(0.15)),
]);

export const Brilliance = new ZodiacConstellation('Brilliance', 'Specialization I', [
  zodiacNode(ElementalDamage.increase.of(0.15)),
  zodiacNode(AccelerationEffect.increase.of(0.1)),
  zodiacNode(GrantAcceleration.addition.of(1)),
  zodiacNode(ElementalDamage.increase.of(0.15)),
  zodiacNode(ElementalPenetration.increase.of(0.1)),
  zodiacNode(DoTDamage.increase.of(0.15)),
  zodiacNode(DoTDamage.amplification.of(0.06)),
]);

export const Vacuum = new ZodiacConstellation('Vacuum', 'Specialization II', [
  zodiacNode(ElementalDamage.increase.of(0.15)),
  zodiacNode(DoTDamage.increase.of(0.15)),
  zodiacNode(DoTMultiplier.addition.of(0.08)), // While this is presented as increase type of value we should normally define it as addition (at least for now)
  zodiacNode(DoTDamage.increase.of(0.15)),
  zodiacNode(DoTDamage.amplification.of(0.1), StrikeDamage.dampening.of(0.05)),
  zodiacNode(KnowledgeEffect.increase.of(0.2)),
  zodiacNode(GrantKnowledge.addition.of(1)),
]);

export const Pirate = new ZodiacConstellation('Pirate', 'Specialization III', [
  zodiacNode(ElementalDamage.amplification.of(0.15)), // And mana cost
  zodiacNode(ElementalDamage.increase.of(0.15)),
  zodiacNode(DoTMultiplier.addition.of(0.1)),

  zodiacNode(ElementalDamage.increase.of(0.15)),
  zodiacNode(Damage.amplification.of(0.1)), // Against crowd controlled

  zodiacNode(ElementalDamage.increase.of(0.15)),
  zodiacNode(Damage.amplification.of(0.1)), // Against debuffed
]);

export const Shade = new ZodiacConstellation('Shade', 'Specialization I', [
  zodiacNode(Damage.increase.of(0.15)),
  zodiacNode(OverpowerEffect.increase.of(0.3)),
  zodiacNode(GrantOverpower.addition.of(1)),
  zodiacNode(OverpowerEffect.increase.of(0.3)),
  zodiacNode(DoTDamage.increase.of(0.15)),
  zodiacNode(DoTDamage.increase.of(0.3)),
  zodiacNode(DoTDamage.increase.of(0.15)),
]);

export const Greed = new ZodiacConstellation('Greed', 'Specialization II', [
  zodiacNode(Damage.increase.of(0.15)),
  zodiacNode(DoTDamage.increase.of(0.15)),
  zodiacNode(DoTAcceleration.increase.of(0.08)),
  zodiacNode(DoTDamage.increase.of(0.15)),
  zodiacNode(DoTDamage.amplification.of(0.1), StrikeDamage.dampening.of(0.05)),
  zodiacNode(DoTDamage.increase.of(0.15)),
  zodiacNode(StrikeDamage.amplification.of(0.2), DisableCritical.addition.of(1)),
]);


