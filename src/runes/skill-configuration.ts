import { MonsterData } from '../enemy/monster-data';

export interface SkillConfiguration {
  enemy: MonsterData;
  silent?: boolean;
  stacks?: number;
}
