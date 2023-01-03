import { Tag } from '../mods/tags';
import { Damage, TargetDamageTaken } from '../mods/mod-library';
import { Environment } from './mod-group';
import { SkillConfiguration } from '../runes/skill-configuration';
import { SpecificRuneConfiguration } from '../runes/rune-definition';
import { Effects, EffectTags } from '../mods/effects';
import { Mod, ModType } from '../mods/mod-definition';
import { ModProxySource } from '../mods/mod-interfaces';
import { ModBuilder } from '../mods/mod-builder';
import { ItemType } from '../items/item-definition';

function calculateWeaponMods(env: Environment, skill: SpecificRuneConfiguration, config?: SkillConfiguration): void {
  console.log(`\n==== Calculation stage: Calculating weapon mods ====`);
  const allWeaponDamageMods = env.ofCategory(Tag.Weapon).findWithAllTags([Tag.Damage]);
  const modsPerWeapon: { [id: string]: Environment } = {};
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
    console.log(` = Weapon ${ index + 1 }: ${ weaponValue.toString() }`);
    weaponEnv.mods().forEach(mod => console.log(`   # ${ mod.toString() }`));

    // Add the final calculated flat mode into the env
    finalWeaponEnv.add(weaponFlatMod.copyAndAdjust().withMinMax(weaponValue.min, weaponValue.max));
  });

  const weaponDamageMods = finalWeaponEnv.findWithAnyTags(skill.tags);
  console.log(` = Weapon mods:`);
  let weaponDamage = weaponDamageMods.normalSumMinMax();
  weaponDamageMods.mods().forEach(mod => console.log(`   # ${ mod.toString() }`));
  if (weaponDamageMods.mods().length > 0) {
    console.log(` = Weapons count: ${ weaponCount }`);
    if (weaponCount > 1) {
      // Average weapon mods if we dual-wield
      weaponDamage.min /= weaponCount;
      weaponDamage.max /= weaponCount;
      // Also apply amplification due to dual wielding
      env.add(Damage.amplification.of(0.05).withSource({ source: () => 'Dual Wielding' }));
    }

    const totalWeaponDamageMod = new ModBuilder(Tag.Damage, [
      Tag.Damage,
      ...skill.tags,
    ], 'Weapon Damage').addition.ofMinMax(weaponDamage.min, weaponDamage.max).withSource(weaponDamageMods.mods()[0].source);

    console.log(` = Total Weapon Damage: ${ totalWeaponDamageMod.toString() }`);
    env.add(totalWeaponDamageMod);
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
 * Calculate single instance of damage
 */
export function calculateForSkill(baseEnv: Environment, skill: SpecificRuneConfiguration, config: SkillConfiguration): number {
  const env = new Environment();

  env.add(TargetDamageTaken.addition.of(1)); // Monster always receive full damage by default

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
  const multiplierMods = env.ofCategory(Tag.Multiplier).findWithAnyTags([Tag.SkillMultiplier, ...skill.tags]);
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

  console.log(`\n==== Calculation stage: Monster increased damage taken ====`);
  const damageTakenMods = env.ofCategory(Tag.TargetDamageTaken).findWithAnyTags(skill.tags);
  const damageTakenValue = damageTakenMods.calculateValue();
  console.log(` = Damage taken mods:`);
  damageTakenMods.mods().forEach(mod => console.log(`   # ${ mod.toString() }`));
  console.log(` = ${ damageTakenValue.toString() }`);

  // Final result
  const final = multiplierValue.total * damageValue.total * resistanceEffect * damageTakenValue.total;

  return final;
}
