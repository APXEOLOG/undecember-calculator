import { Tag } from './mods/tags';
import {
  Damage,
  DoTDamage,
  DoTMultiplier,
  ElementalDamage, GrantKnowledge, KnowledgeEffect,
  PoisonDamage,
  WeaponAttackSpellDamage,
} from './mods/mod-library';
import { Environment } from './calculation/mod-group';
import { SkillConfiguration } from './runes/skill-configuration';
import { RuneRarity, SpecificRuneConfiguration } from './runes/rune-definition';
import { ModContainer } from './calculation/titles';
import {
  Breath,
  Brilliance,
  Cliff, Farmer,
  Flash,
  Forest,
  Gem,
  Hunter,
  Ortemis,
  Pirate,
  Seed,
  Vacuum,
} from './zodiac/zodiac-library';
import { Effects, EffectTags } from './mods/effects';
import { Mod, ModType } from './mods/mod-definition';
import { ModProxySource } from './mods/mod-interfaces';
import { MonsterLevel } from './enemy/monster-data';
import { ModBuilder } from './mods/mod-builder';
import { LinkRune } from './runes/link-rune-library';
import { ItemType, Weapon } from './items/item-definition';
import { SkillRune } from './runes/skill-rune-library';

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

  // 3. Final result
  const final = multiplierValue.total * damageValue.total * resistanceEffect;


  return final;
}

function calcDps(additionalMods?: ModContainer): number {
  const titles = new ModContainer('Titles', [
    ElementalDamage.increase.of(0.27),
    Damage.increase.of(0.05),
  ]);

  const charms = new ModContainer('Charms', [
    ElementalDamage.increase.of(0.71),
    DoTDamage.increase.of(0.74),
    ElementalDamage.increase.of(0.77),
    DoTDamage.increase.of(0.73),
    DoTDamage.increase.of(0.71),
    ElementalDamage.increase.of(0.6),
  ]);

  const mastery = new ModContainer('Mastery', [
    // Do not include local weapon buffs here till we reverse weapon quality formula
    WeaponAttackSpellDamage.addition.of(25),
    WeaponAttackSpellDamage.increase.of(0.2),
  ]);

  const items = new ModContainer('Items', [
    // Amulet
    ElementalDamage.increase.of(0.44),
    PoisonDamage.addition.ofMinMax(27, 41),

    // Ring 1
    ElementalDamage.increase.of(0.34),
    ElementalDamage.increase.of(0.34),

    // Ring 2
    ElementalDamage.increase.of(0.34),
  ]);

  const env = new Environment();
  env.addAll(titles.mods());

  env.addAll(new Weapon([
    WeaponAttackSpellDamage.addition.ofMinMax(138, 181),
    ElementalDamage.increase.of(0.22),
  ], 'Scepter 1').mods());

  // env.addAll(new Weapon([
  //   WeaponAttackSpellDamage.addition.ofMinMax(330, 415),
  //   /*WeaponAttackSpellDamage.addition.ofMinMax(141, 186),
  //   WeaponAttackSpellDamage.increase.of(0.55),*/
  //
  //
  //   ElementalDamage.increase.of(0.22),
  //   PoisonDamage.addition.ofMinMax(35, 47),
  //   DoTDamage.amplification.of(0.11),
  // ], 'Scepter 1').mods());

  // env.addAll(new Weapon([
  //   WeaponAttackSpellDamage.addition.ofMinMax(350, 434),
  //
  //   /*WeaponAttackSpellDamage.addition.ofMinMax(134, 168),
  //   WeaponAttackSpellDamage.addition.ofMinMax(23, 35),
  //   WeaponAttackSpellDamage.increase.of(0.48),*/
  //
  //   ElementalDamage.increase.of(0.22),
  //   PoisonDamage.addition.ofMinMax(83, 121),
  //   DoTDamage.amplification.of(0.03),
  // ], 'Scepter 2').mods());

  if (additionalMods) {
    env.addAll(additionalMods.mods());
  }

  env.addAll(mastery.mods());
  env.addAll(items.mods());
  env.addAll(charms.mods());
  env.addAll(Cliff.mods());
  env.addAll(Forest.mods());
  env.addAll(Gem.mods());
  env.addAll(Seed.mods());
  env.addAll(Brilliance.mods());

  env.addAll(Flash.mods());
  env.addAll(Breath.mods());
  env.addAll(Vacuum.mods());
  env.addAll(Ortemis.mods());
  env.addAll(Hunter.mods());
  env.addAll(Farmer.mods());
  env.addAll(Pirate.mods());

  env.addAll(LinkRune.ElementDamageAmplification.of(RuneRarity.Magic, 32).mods());
  env.addAll(LinkRune.DoT.of(RuneRarity.Magic, 31).mods());
  env.addAll(LinkRune.ManaStorm.of(RuneRarity.Legendary, 34).mods());
  env.addAll(LinkRune.SpellDamageIncrease.of(RuneRarity.Normal, 30).mods());
  env.addAll(LinkRune.PoisonPenetration.of(RuneRarity.Magic, 33).mods());
  env.addAll(LinkRune.AdditionalPoisonDamage.of(RuneRarity.Normal, 31).mods());

  const rune = SkillRune.ToxicFlame.of(RuneRarity.Legendary, 30);
  //const rune = ToxicFlame.of(RuneRarity.Normal, 1);

  console.log(`Calculating Toxic Flame Damage...`);
  /*const dps5 = calculateForSkill(env, rune, {
    enemy: MonsterLevel['1'],
    stacks: 5,
    targetResist: 10,
    silent: true,
  });*/

  const dps = calculateForSkill(env, rune, {
    enemy: MonsterLevel['100'],
    stacks: 5,
  });


  /// 43057

  console.log();
  console.log(`Resulting Tick Damage: ${ Math.round(dps) }`);
  //console.log(`Resulting DPS 5 stacks: ${ Math.round(dps5) }`);
  return dps;
}

function simulate() {
  const scenarios: ModContainer[] = [
    new ModContainer('Scenario: Multi path', [
      DoTDamage.increase.of(0.15),
      DoTMultiplier.addition.of(0.08),
      DoTDamage.increase.of(0.15),
      DoTDamage.amplification.of(0.1),
    ]),
    new ModContainer('Scenario: Knowledge path', [
      KnowledgeEffect.increase.of(0.2),
      GrantKnowledge.addition.of(1),
      KnowledgeEffect.increase.of(0.2),
      DoTDamage.amplification.of(0.15),
    ]),
  ];


  const defaultDps = calcDps();
  const scenarioResults = scenarios.map(it => ({
    name: it.name,
    dps: calcDps(it),
  }));

  console.log(`Default DPS: ${defaultDps}`);
  scenarioResults.forEach(result => {
    const improvement = (((result.dps / defaultDps) - 1) * 100).toFixed(1);
    console.log(`${result.name}: +${improvement}%  (${result.dps})`);
  });
}

calcDps();
