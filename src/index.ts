import { Environment } from './calculation/mod-group';
import { ModContainer } from './calculation/titles';
import {
  Damage,
  DoTDamage,
  ElementalDamage,
  ElementDamageTaken,
  GrantMentalStimulation,
  GrantSealOfPain,
  GrantShock,
  MentalStimulationEffect,
  PhysicalDamage,
  PoisonDamage,
  PoisonDamageTaken,
  PoisonPenetration,
  SealOfPainEffect,
  ShockEffect,
  WeaponAttackSpellDamage,
} from './mods/mod-library';
import { Item, Weapon } from './items/item-definition';
import {
  Breath,
  Brilliance,
  Cliff,
  Farmer,
  Flash,
  Forest,
  Gem,
  Hunter,
  Laia,
  Maggot,
  Ortemis,
  Pirate,
  Seed,
  Vacuum,
} from './zodiac/zodiac-library';
import { LinkRune } from './runes/link-rune-library';
import { RuneRarity } from './runes/rune-definition';
import { SkillRune } from './runes/skill-rune-library';
import { MonsterLevel } from './enemy/monster-data';
import { calculateForSkill } from './calculation/calculation-pipeline';

/**
 * Define ALL mods that affect damage except those coming from runes
 */
function getCharacterData(): Environment {
  const env = new Environment();

  // Title effects
  env.addAll(new ModContainer('Titles', [
    ElementalDamage.increase.of(0.27),
    Damage.increase.of(0.15),
    PhysicalDamage.increase.of(0.24),
  ]).mods());

  // Mastery bonuses
  env.addAll(new ModContainer('Mastery', [
    // We do not include local weapon buffs here till we reverse engineer weapon quality formula
    // Weapon bonuses from the mastery are added to the weapon itself and modified by the quality bonus

    // WeaponAttackSpellDamage.addition.of(25),
    // WeaponAttackSpellDamage.increase.of(0.2),
    Damage.amplification.of(0.012),
    Damage.increase.of(0.5),
  ]).mods());

  // Compendium bonuses
  env.addAll(new ModContainer('Compendium', [
    Damage.increase.of(0.24),
  ]).mods());

  // Orbs bonuses
  env.addAll(new ModContainer('Orbs', [
    PoisonDamage.addition.of(4),
  ]).mods());

  // Relic bonuses
  env.addAll(new ModContainer('Relics', [
    // Hamal passive
    PoisonDamage.addition.ofMinMax(24, 36),
    PoisonPenetration.addition.of(8),

    // Sephdar active effect
    GrantMentalStimulation.addition.of(1),
    MentalStimulationEffect.increase.of(0.2),
  ]).mods());

  // Charms
  env.addAll(new ModContainer('Charms', [
    ElementalDamage.increase.of(0.74),

    ElementalDamage.increase.of(0.79),
    Damage.increase.of(0.53), // DMG while dual wielding is not supported for now, set a generic dmg

    DoTDamage.increase.of(0.71),

    ElementalDamage.increase.of(0.58),

    DoTDamage.increase.of(0.48),

    Damage.increase.of(0.51), // DMG while dual wielding is not supported for now, set a generic dmg

    // Center + blessing effects
    ElementalDamage.increase.of(0.5),
    ElementalDamage.amplification.of(0.3),
    PoisonDamage.increase.of(0.6),
  ]).mods());

  // Items
  env.addAll(new Item([
    Damage.amplification.of(0.185),
  ], 'Amulet').mods());

  env.addAll(new Item([
    PoisonDamage.addition.ofMinMax(13, 30),
    ElementalDamage.increase.of(0.6),
  ], 'Ring 1').mods());

  env.addAll(new Item([
    PoisonDamage.addition.ofMinMax(16, 31),
    ElementalDamage.increase.of(0.65),
  ], 'Ring 2').mods());

  env.addAll(new Item([
    DoTDamage.amplification.of(0.039),
    ElementalDamage.increase.of(0.64),
    DoTDamage.increase.of(0.31),
  ], 'Gloves').mods());

  env.addAll(new Item([
    PoisonDamage.increase.of(0.51),
  ], 'Shoulders').mods());

  // Body
  // +3 Spell level gem will be counted manually

  // Weapons: Enter blue (calculated by the game) values from the tooltip until quality bonus formula is reversed
  // That's because mastery weapon damage bonuses are affected by the weapon quality bonus
  env.addAll(new Weapon([
    WeaponAttackSpellDamage.addition.ofMinMax(429, 507),
    ElementalDamage.increase.of(0.22),
    DoTDamage.amplification.of(0.13),
  ], 'Earthquake Scepter 1').mods());

  env.addAll(new Weapon([
    WeaponAttackSpellDamage.addition.ofMinMax(341, 423),
    ElementalDamage.increase.of(0.22),

    DoTDamage.amplification.of(0.13),
    PoisonDamage.addition.ofMinMax(40, 58),
    Damage.increase.of(0.4), // Damage against enemies affected by Status Effect - unsupported for now, just always count
  ], 'Earthquake Scepter 2').mods());

  // Zodiac
  env.addAll(Cliff.mods());
  env.addAll(Forest.mods());
  env.addAll(Gem.mods());
  env.addAll(Seed.mods());
  env.addAll(Brilliance.mods());
  env.addAll(Flash.mods());
  env.addAll(Breath.mods());
  env.addAll(Vacuum.mods());
  env.addAll(Ortemis.mods());
  env.addAll(Maggot.mods()); // 40% DMG if stats >= 200
  env.addAll(Hunter.mods());
  env.addAll(Farmer.mods());
  env.addAll(Pirate.mods());
  env.addAll(Laia.mods());

  return env;
}

/**
 * Everything related to the runes
 */
function getRuneSetup(): Environment {
  const env = new Environment();

  // Add all support runes for the main skill into env
  env.addAll(LinkRune.ElementDamageAmplification.of(RuneRarity.Rare, 30).mods());
  env.addAll(LinkRune.DoT.of(RuneRarity.Rare, 32).mods());
  env.addAll(LinkRune.ManaStorm.of(RuneRarity.Legendary, 34).mods());
  env.addAll(LinkRune.PoisonPenetration.of(RuneRarity.Rare, 31).mods());
  env.addAll(LinkRune.AdditionalPoisonDamage.of(RuneRarity.Legendary, 31).mods());
  env.addAll(LinkRune.DMGAcceleration.of(RuneRarity.Legendary, 33).mods());

  // Seals are not yet supported, we will pre-calc seal effect here
  env.addAll(new ModContainer('Skill Rune: Seal of Pain', [
    GrantSealOfPain.addition.of(1), // Baseline value is hardcoded in the effect definition
    SealOfPainEffect.increase.of(0.25), // From legendary rune
  ]).mods());

  // Illusion Axe setup to proc status effects
  env.addAll(new ModContainer('Skill Rune: Illusion Axe', [
    GrantShock.addition.of(1),
    ShockEffect.increase.of(0.1), // Shock has 10% increased effect by default for some reason. I wasn't able to determne the source
    ShockEffect.increase.of(0.25), // From Link Rune: Status Effect Enhancement (lvl 30)
    ShockEffect.increase.of(0.1), // From Link Rune: Status Effect Enhancement (Legendary)
    // There are other effects here but the do not directly affect our damage
  ]).mods());

  // Weaken element totem
  env.addAll(new ModContainer('Skill Rune: Weaken Element Totem', [
    ElementDamageTaken.increase.of(0.144 * (1.08)),
  ]).mods());

  // Poison Area debuff
  env.addAll(new ModContainer('Skill Rune: Poison Area', [
    PoisonDamageTaken.increase.of(0.2),
  ]).mods());

  // Release Element
  env.addAll(new ModContainer('Skill Rune: Release Element', [
    ElementalDamage.amplification.of(0.295 * (1 + (0.1 + 0.17))),
  ]).mods());

  return env;
}

function main() {
  const env = new Environment();
  env.addAll(getCharacterData().mods());
  env.addAll(getRuneSetup().mods());

  env.addAll(new ModContainer('Toxic Flame Awakening [Verity]', [
    DoTDamage.increase.of(0.27),
  ]).mods());

  const rune = SkillRune.ToxicFlame.of(RuneRarity.Legendary, 36);

  const damage = calculateForSkill(env, rune, {
    enemy: MonsterLevel['100'],
    stacks: 5,
  });

  console.log();
  console.log(`Final calculated single tick damage: ${ damage }`);
}

main();
