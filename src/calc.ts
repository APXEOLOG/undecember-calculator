import { Tag } from './mods/tags';
import { Damage, ElementalDamage, PhysicalDamage } from './mods/mod-library';
import { CalculatedValue, Environment } from './calculation/mod-group';
import { ToxicFlame } from './runes/skill-rune-library';
import { SkillConfiguration } from './runes/skill-configuration';
import { RuneRarity, SpecificRuneConfiguration } from './runes/rune-definition';
import { TitlesEffect } from './calculation/titles';
import { Cliff, Forest, Gem, Seed, Shade } from './zodiac/zodiac-library';
import { Effects, EffectTags } from './mods/effects';
import { Mod, ModType } from './mods/mod-definition';
import { ModProxySource } from './mods/mod-interfaces';

function printCalcValue(value: CalculatedValue) {
  console.log(``)
  console.log(` = Flat: ${ value.flat }`);
  console.log(` = Increase: ${ value.increase }`);
  console.log(` = Amplification: ${ value.amplification }`);
  console.log(` = Dampening: ${ value.dampening }`);
  console.log(` = Total: ${ value.total }`);
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

      console.log(`Effect value: ${effect}`);
      console.log(` = Effect mods:`);
      effectMods.mods().forEach(mod => console.log(`   # ${mod.toString()}`));
      console.log(` = ${effectValue.toString()}`);

      if (effectValue.total > 0) {
        console.log(` = Adjusted effects:`);
        // We should add this effect to the env
        Effects[effect].forEach(it => {
          // Copy and adjust mod strength
          const adjustedMod = it.copyAndAdjust(effectValue.total).withSource(new ModProxySource(effect));
          modsToAdd.push(adjustedMod);
          console.log(`   # ${adjustedMod.toString()}`);
        });
      }
    }
  });

  // 3. Add effect's effects into the env
  env.addAll(modsToAdd);
}

function calculateForSkill(baseEnv: Environment, skill: SpecificRuneConfiguration, config?: SkillConfiguration): number {
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

  // Prepare effects
  calculateEffects(env, skill, config);

  // 1. Calculate skill damage multiplier
  console.log(`\n==== Calculation stage: Calculating skill damage multiplier ====`);
  const multiplierMods = env.ofCategory(Tag.Multiplier).findWithAnyTags([Tag.SkillMultiplier]);
  const multiplierValue = multiplierMods.calculateValue();
  console.log(` = Multiplier mods:`);
  multiplierMods.mods().forEach(mod => console.log(`   # ${mod.toString()}`));
  console.log(` = ${multiplierValue.toString()}`);

  // 2. Calculate skill damage
  console.log(`\n==== Calculation stage: Calculating skill damage ====`);
  const damageMods = env.ofCategory(Tag.Damage).findWithAnyTags(skill.tags);
  const damageValue = damageMods.calculateValue();
  console.log(` = Damage-related mods:`);
  damageMods.mods().forEach(mod => console.log(`   # ${mod.toString()}`));
  console.log(` = ${damageValue.toString()}`);

  // 3. Calculate penetration & target resistances

  console.log(`\n==== Calculation stage: Calculating penetration ====`);

  const resistanceEffect = 1 - ((config?.targetResist ?? 0) / 100);

  console.log(`Target resistance multiplier: ${ resistanceEffect }`);


  // 3. Final result
  const final = multiplierValue.total * damageValue.total * resistanceEffect;


  return final;
}

function calcDps() {
  const titles = new TitlesEffect([
    ElementalDamage.increase.of(0.27),
    PhysicalDamage.increase.of(0.24),
    Damage.increase.of(0.05),
  ]);

  const env = new Environment();
  env.addAll(titles.mods());
  env.addAll(Cliff.mods());
  env.addAll(Forest.mods());
  env.addAll(Gem.mods());
  env.addAll(Seed.mods());
  env.addAll(Shade.mods());
  // env.addAll(ElementDamageAmplification.of(RuneRarity.Magic, 30).mods);

  console.log(`Calculating Toxic Flame DPS...`);
  const dps = calculateForSkill(env, ToxicFlame.of(RuneRarity.Legendary, 30), {
    stacks: 1,
    targetResist: 10,
  });

  console.log();
  console.log(`Resulting DPS: ${ Math.round(dps) }`);
}

calcDps();
