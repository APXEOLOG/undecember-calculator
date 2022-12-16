import { ModBuilder } from './mod-builder';
import { Tag } from './tags';

/**
 * Damage
 */

export const ElementalTags = [Tag.Fire, Tag.Cold, Tag.Lightning, Tag.Poison];
const DirectDamageTags = [Tag.Attack, Tag.Spell, Tag.DamageOverTime, Tag.Elemental, ...ElementalTags]

export const AttackDamage = new ModBuilder(Tag.Damage, [Tag.Damage, Tag.Attack], 'DMG upon Attack');
export const SpellDamage = new ModBuilder(Tag.Damage, [Tag.Damage, Tag.Spell], 'DMG upon Spell');
export const StrikeDamage = new ModBuilder(Tag.Damage, [Tag.Damage, Tag.Strike], 'Strike DMG');
export const DoTDamage = new ModBuilder(Tag.Damage, [Tag.Damage, Tag.DamageOverTime], 'DoT');
export const ElementalDamage = new ModBuilder(Tag.Damage, [Tag.Damage, Tag.Elemental, ...ElementalTags], 'Element DMG');
export const PoisonDamage = new ModBuilder(Tag.Damage, [Tag.Damage, Tag.Poison], 'Poison DMG');
export const FireDamage = new ModBuilder(Tag.Damage, [Tag.Damage, Tag.Fire], 'Fire DMG');
export const ColdDamage = new ModBuilder(Tag.Damage, [Tag.Damage, Tag.Cold], 'Cold DMG');
export const LightningDamage = new ModBuilder(Tag.Damage, [Tag.Damage, Tag.Lightning], 'Lightning DMG');
export const PhysicalDamage = new ModBuilder(Tag.Damage, [Tag.Damage, Tag.Physical], 'Physical DMG');
export const Damage = new ModBuilder(Tag.Damage, [Tag.Damage, ...DirectDamageTags], 'DMG');

/**
 * Multiplier
 */
export const SkillDamageMultiplier = new ModBuilder(Tag.Multiplier, [Tag.Multiplier], 'Multiplier');

/**
 * Hit Rate
 */

export const HitRate = new ModBuilder(Tag.HitRate, [Tag.HitRate, Tag.Attack, Tag.Spell], 'Hit Rate');
export const AttackHitRate = new ModBuilder(Tag.HitRate, [Tag.HitRate, Tag.Attack], 'Attack Hit Rate');
export const SpellHitRate = new ModBuilder(Tag.HitRate, [Tag.HitRate, Tag.Spell], 'Spell Hit Rate');

/**
 * Penetration
 */

export const ElementalPenetration = new ModBuilder(Tag.Penetration, [Tag.Penetration, Tag.Elemental, Tag.Fire, Tag.Cold, Tag.Lightning, Tag.Poison], 'Element Penetration');
export const FirePenetration = new ModBuilder(Tag.Penetration, [Tag.Penetration, Tag.Fire], 'Fire Penetration');
export const ColdPenetration = new ModBuilder(Tag.Penetration, [Tag.Penetration, Tag.Cold], 'Cold Penetration');
export const LightningPenetration = new ModBuilder(Tag.Penetration, [Tag.Penetration, Tag.Lightning], 'Lightning Penetration');
export const PoisonPenetration = new ModBuilder(Tag.Penetration, [Tag.Penetration, Tag.Poison], 'Poison Penetration');
export const ArmorPenetration = new ModBuilder(Tag.Penetration, [Tag.Penetration, Tag.Physical], 'Armor Penetration');

/**
 * Speed
 */

export const CastSpeed = new ModBuilder(Tag.Speed, [Tag.Speed, Tag.Spell], 'Cast Speed');
export const AttackSpeed = new ModBuilder(Tag.Speed, [Tag.Speed, Tag.Attack], 'Attack Speed');
export const MovementSpeed = new ModBuilder(Tag.Speed, [Tag.Speed, Tag.Movement], 'Movement Speed');

/**
 * Base Stats and Defences
 */

export const Health = new ModBuilder(Tag.Stats, [Tag.Health], 'HP');
export const Mana = new ModBuilder(Tag.Stats, [Tag.Mana], 'Mana');

export const ElementalResists = new ModBuilder(Tag.Stats, [Tag.Elemental, Tag.Resistance], 'Element Resist');

/**
 * Other
 */
export const ProjectileCount = new ModBuilder(Tag.Special, [Tag.Special, Tag.Projectile], 'Projectile Count')
