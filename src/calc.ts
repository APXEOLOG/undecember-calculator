import { Tag } from './mods/tags';
import {
  Damage,
  ElementalDamage,
  PhysicalDamage,
  PoisonPenetration,
  WeaponAttackSpellDamage,
} from './mods/mod-library';
import { Environment } from './calculation/mod-group';
import { ToxicFlame } from './runes/skill-rune-library';
import { SkillConfiguration } from './runes/skill-configuration';
import { RuneRarity, SpecificRuneConfiguration } from './runes/rune-definition';
import { ModContainer } from './calculation/titles';
import { Breath, Cliff, Farmer, Flash, Forest, Gem, Greed, Ortemis, Seed, Shade } from './zodiac/zodiac-library';
import { Effects, EffectTags } from './mods/effects';
import { Mod, ModType } from './mods/mod-definition';
import { ModProxySource } from './mods/mod-interfaces';
import { MonsterLevel } from './enemy/monster-data';
import { ModBuilder } from './mods/mod-builder';
import { DoT, ElementDamageAmplification, ManaStorm } from './runes/link-rune-library';
import { ItemType, Weapon } from './items/item-definition';

function calculateWeaponMods(env: Environment, skill: SpecificRuneConfiguration, config?: SkillConfiguration): void {
  console.log(`\n==== Calculation stage: Calculating weapon mods ====`);
  const allWeaponDamageMods = env.ofCategory(Tag.Weapon).findWithAllTags([Tag.Damage]);
  const modsPerWeapon: { [id: string]: Environment } = { };
  const otherWeaponMods = new Environment();
  const finalWeaponEnv = new Environment();
  allWeaponDamageMods.mods().forEach(mod => {
    // @ts-ignore
    const weaponId: string | undefined = mod.source?.id;
    // @ts-ignore
    const itemType: ItemType = mod.source?.type ?? ItemType.Other;
    if (weaponId && itemType === ItemType.Weapon) {
      if (!modsPerWeapon[weaponId]) {
        modsPerWeapon[weaponId] = new Environment();
      }
      modsPerWeapon[weaponId].add(mod);
    } else {
      otherWeaponMods.add(mod);
    }
  });

  console.log(` = Additional Local Weapon Mods:`);
  otherWeaponMods.mods().forEach(mod => console.log(`   # ${ mod.toString() }`));
  const weaponCount = Object.values(modsPerWeapon).length;

  Object.values(modsPerWeapon).forEach((weaponEnv, index) => {
    const weaponFlatMod = weaponEnv.ofType(ModType.Addition).mods()[0];
    // Add additional local weapons mods into calculation
    weaponEnv.addAll(otherWeaponMods.mods());
    const weaponValue = weaponEnv.calculateValue(true);
    console.log(` = Weapon ${index+ 1}: ${weaponValue.toString()}`);
    weaponEnv.mods().forEach(mod => console.log(`   # ${ mod.toString() }`));

    // Add the final calculated flat mode into the env
    finalWeaponEnv.add(weaponFlatMod.copyAndAdjust().withMinMax(weaponValue.min, weaponValue.max));
  });

  const weaponDamageMods = finalWeaponEnv.findWithAnyTags(skill.tags);
  console.log(` = Weapon mods:`);
  let weaponDamage = weaponDamageMods.normalSum();
  weaponDamageMods.mods().forEach(mod => console.log(`   # ${ mod.toString() }`));
  if (weaponDamageMods.mods().length > 0) {
    console.log(` = Weapons count: ${ weaponCount }`);
    if (weaponCount > 1) {
      // Average weapon mods if we dual-wield
      weaponDamage = weaponDamage / weaponCount;
      // Also apply amplification due to dual wielding
      env.add(Damage.amplification.of(0.05).withSource({ source: () => 'Dual Wielding' }));
    }

    console.log(` = Total Weapon Damage: ${ weaponDamage.toString() }`);
    env.add(new ModBuilder(Tag.Damage, [
      Tag.Damage,
      ...skill.tags,
    ], 'Weapon Damage').addition.of(weaponDamage).withSource(weaponDamageMods.mods()[0].source));
  }
}

function calculateEffects(env: Environment, skill: SpecificRuneConfiguration, config?: SkillConfiguration): void {
  console.log(`\n==== Calculation stage: Calculating effects ====`);
  const modsToAdd: Mod[] = [];

  // 1. Find all effect-related mods for the skill target
  const effects = env.ofCategory(Tag.Effect).ofTarget(skill.definition.target);

  // 2. Calculate each effect separately
  EffectTags.forEach(effect => {
    // Find effect mods and remove duplicated added sources
    const effectMods = effects.findWithAnyTags([effect]).removeDuplicatedModsOfType(ModType.Addition);

    if (effectMods.mods().length > 0) {
      const effectValue = effectMods.calculateValue();

      console.log(`Effect value: ${ effect }`);
      console.log(` = Effect mods:`);
      effectMods.mods().forEach(mod => console.log(`   # ${ mod.toString() }`));
      console.log(` = ${ effectValue.toString() }`);

      if (effectValue.total > 0) {
        console.log(` = Adjusted effects:`);
        // We should add this effect to the env
        Effects[effect].forEach(it => {
          // Copy and adjust mod strength
          const adjustedMod = it.copyAndAdjust(effectValue.total).withSource(new ModProxySource(effect));
          modsToAdd.push(adjustedMod);
          console.log(`   # ${ adjustedMod.toString() }`);
        });
      }
    }
  });

  // 3. Add effect's effects into the env
  env.addAll(modsToAdd);
}

/**
 * TODO: Multi damage types support
 */
function calculateForSkill(baseEnv: Environment, skill: SpecificRuneConfiguration, config: SkillConfiguration): number {
  const env = new Environment();

  // -- Prepare environment

  // 1. Add all base mods we already have from other sources
  env.addAll(baseEnv.mods());

  // 2. Add skill's mods
  env.addAll(skill.mods());

  // 3. Apply config if present
  if (config && skill.apply) {
    skill.apply(config, env);
  }

  // -- Start calculation

  // Calculate weapon mods
  calculateWeaponMods(env, skill, config);

  // Prepare effects
  calculateEffects(env, skill, config);

  // 1. Calculate skill damage multiplier
  console.log(`\n==== Calculation stage: Calculating skill damage multiplier ====`);
  const multiplierMods = env.ofCategory(Tag.Multiplier).findWithAnyTags([Tag.SkillMultiplier]);
  const multiplierValue = multiplierMods.calculateValue();
  console.log(` = Multiplier mods:`);
  multiplierMods.mods().forEach(mod => console.log(`   # ${ mod.toString() }`));
  console.log(` = ${ multiplierValue.toString() }`);

  // 2. Calculate skill damage
  console.log(`\n==== Calculation stage: Calculating skill damage ====`);
  const damageMods = env.ofCategory(Tag.Damage).findWithAnyTags(skill.tags);
  const damageValue = damageMods.calculateValue();
  console.log(` = Damage-related mods:`);
  damageMods.mods().forEach(mod => console.log(`   # ${ mod.toString() }`));
  console.log(` = ${ damageValue.toString() }`);
  const totalBeforePenetration = multiplierValue.total * damageValue.total;
  console.log(` = Single instance of damage before calculating resistances & penetration: ${ Math.round(totalBeforePenetration) }`);

  // 3. Calculate penetration & target resistances
  console.log(`\n==== Calculation stage: Calculating resistances & penetration ====`);
  const flatPenetrationMods = env.ofCategory(Tag.Penetration).findWithAnyTags(skill.tags).ofType(ModType.Addition);
  const flatPenetrationValue = flatPenetrationMods.normalSum();
  console.log(` = Flat penetration mods:`);
  flatPenetrationMods.mods().forEach(mod => console.log(`   # ${ mod.toString() }`));
  console.log(` = Flat penetration: ${ flatPenetrationValue }`);

  const percentPenetrationMods = env.ofCategory(Tag.Penetration).findWithAnyTags(skill.tags).ofType(ModType.Increase);
  const percentPenetrationValue = percentPenetrationMods.diminishingSum();
  console.log(` = Percent penetration mods:`);
  percentPenetrationMods.mods().forEach(mod => console.log(`   # ${ mod.toString() }`));
  console.log(` = Percent penetration: ${ percentPenetrationValue }`);

  console.log(` = Enemy resistance: ${ config.enemy.toString() }`);
  const resistanceEffect = config.enemy.calculateElementalDamageMultiplierFromResists(flatPenetrationValue, percentPenetrationValue);
  console.log(` = Elemental damage multiplier: ${ resistanceEffect }`);

  // 3. Final result
  const final = multiplierValue.total * damageValue.total * resistanceEffect;


  return final;
}

function calcDps() {
  const titles = new ModContainer('Titles', [
    PhysicalDamage.increase.of(0.24),
    ElementalDamage.increase.of(0.27),
    Damage.increase.of(0.05),

    ElementalDamage.increase.of(0.16),
    PoisonPenetration.addition.of(10),
  ]);

  const mastery = new ModContainer('Mastery', [
    WeaponAttackSpellDamage.addition.of(25),
    WeaponAttackSpellDamage.increase.of(0.2),
  ]);

  const items = new ModContainer('Items', [
    /*ElementalDamage.increase.of(0.29),
    ElementalPenetration.increase.of(0.15),
c
    ElementalDamage.increase.of(0.29),
    ElementalPenetration.increase.of(0.08),*/

    /*WeaponAttackSpellDamage.addition.ofMinMax(145, 162),
    ElementalDamage.increase.of(0.22),*/

    /*
    WeaponAttackDamage.addition.ofMinMax(15, 35),*/

    // WeaponAttackDamage.amplification.ofMinMax(15, 35),

    /*WeaponAttackSpellDamage.addition.ofMinMax(299, 382),
    ElementalDamage.increase.of(0.22),
    PoisonDamage.addition.ofMinMax(47, 70),
    DoTDamage.amplification.of(0.089),

    WeaponAttackSpellDamage.addition.ofMinMax(271, 346),
    ElementalDamage.increase.of(0.22),
    PoisonDamage.addition.ofMinMax(83, 121),
    DoTDamage.amplification.of(0.03),*/
  ]);

  const env = new Environment();
  env.addAll(titles.mods());

  env.addAll(new Weapon([
    WeaponAttackSpellDamage.addition.ofMinMax(144, 172),
    WeaponAttackSpellDamage.increase.of(0.45),
    ElementalDamage.increase.of(0.22),
  ]).mods());
  env.addAll(new Weapon([
    WeaponAttackSpellDamage.addition.ofMinMax(145, 162),
    ElementalDamage.increase.of(0.22),
  ]).mods());
  env.addAll(mastery.mods());

  env.addAll(items.mods());
  env.addAll(Cliff.mods());
  env.addAll(Forest.mods());
  env.addAll(Gem.mods());
  env.addAll(Seed.mods());
  env.addAll(Shade.mods());
  env.addAll(Flash.mods());
  env.addAll(Breath.mods());
  env.addAll(Greed.mods());
  env.addAll(Ortemis.mods());
  env.addAll(Farmer.mods());
  // env.add(ElementalDamage.increase.of(0.29));
  env.addAll(ElementDamageAmplification.of(RuneRarity.Magic, 32).mods());
  env.addAll(DoT.of(RuneRarity.Magic, 33).mods());
  env.addAll(ManaStorm.of(RuneRarity.Legendary, 34).mods());

  const rune = ToxicFlame.of(RuneRarity.Legendary, 30);
  //const rune = ToxicFlame.of(RuneRarity.Normal, 1);

  console.log(`Calculating Toxic Flame DPS...`);
  /*const dps5 = calculateForSkill(env, rune, {
    enemy: MonsterLevel['1'],
    stacks: 5,
    targetResist: 10,
    silent: true,
  });*/

  const dps = calculateForSkill(env, rune, {
    enemy: MonsterLevel['100'],
    stacks: 1,
  });


  /// 43057

  console.log();
  console.log(`Resulting DPS: ${ Math.round(dps) }`);
  //console.log(`Resulting DPS 5 stacks: ${ Math.round(dps5) }`);
}

calcDps();
