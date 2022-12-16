import { Tag } from './mods/tags';
import { Damage, ElementalDamage, PhysicalDamage } from './mods/mod-library';
import { CalculatedValue, Environment } from './calculation/mod-group';
import { ToxicFlame } from './runes/skill-rune-library';
import { SkillConfiguration } from './runes/skill-configuration';
import { RuneRarity, SpecificRuneConfiguration } from './runes/rune-definition';
import { TitlesEffect } from './calculation/titles';
import { Cliff, Forest, Gem, MasteryShade, Seed } from './zodiac/zodiac-library';

function printCalcValue(value: CalculatedValue) {
  console.log(` = Flat: ${ value.flat }`);
  console.log(` = Increase: ${ value.increase }`);
  console.log(` = Amplification: ${ value.amplification }`);
  console.log(` = Dampening: ${ value.dampening }`);
  console.log(` = Total: ${ value.total }`);
  console.log();
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

  // 1. Calculate skill damage multiplier
  const multiplierMods = env.ofCategory(Tag.Multiplier).findWithAnyTags([Tag.SkillMultiplier]);
  const multiplierValue = multiplierMods.calculateValue();
  multiplierMods.debugPrint(`Multiplier: ${ multiplierValue.total }`);
  printCalcValue(multiplierValue);

  // 2. Calculate skill damage
  const damageMods = env.ofCategory(Tag.Damage).findWithAnyTags(skill.tags);
  const damageValue = damageMods.calculateValue();
  damageMods.debugPrint(`Damage: ${ damageValue.total }`);
  printCalcValue(damageValue);

  // 3. Calculate penetration & target resistances

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
  env.addAll(MasteryShade.mods());
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
