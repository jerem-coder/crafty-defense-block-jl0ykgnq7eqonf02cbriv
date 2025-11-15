import { TowerType, EnemyType, SlowEffect } from './game-types';
export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 15;
export const TILE_SIZE = 48; // pixels
export const INITIAL_HEALTH = 20;
export const INITIAL_BLOCKS = 1000;
export const MAX_WAVES = 10;
export const ENEMY_PATH: { x: number; y: number }[] = [
  { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 2, y: 6 },
  { x: 2, y: 5 }, { x: 2, y: 4 }, { x: 2, y: 3 }, { x: 3, y: 3 },
  { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 },
  { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 },
  { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 6, y: 11 }, { x: 7, y: 11 },
  { x: 8, y: 11 }, { x: 9, y: 11 }, { x: 10, y: 11 }, { x: 10, y: 10 },
  { x: 10, y: 9 }, { x: 10, y: 8 }, { x: 10, y: 7 }, { x: 10, y: 6 },
  { x: 10, y: 5 }, { x: 10, y: 4 }, { x: 10, y: 3 }, { x: 10, y: 2 },
  { x: 11, y: 2 }, { x: 12, y: 2 }, { x: 13, y: 2 }, { x: 14, y: 2 },
  { x: 15, y: 2 }, { x: 16, y: 2 }, { x: 17, y: 2 }, { x: 17, y: 3 },
  { x: 17, y: 4 }, { x: 17, y: 5 }, { x: 17, y: 6 }, { x: 17, y: 7 },
  { x: 17, y: 8 }, { x: 17, y: 9 }, { x: 17, y: 10 }, { x: 17, y: 11 },
  { x: 17, y: 12 }, { x: 18, y: 12 }, { x: 19, y: 12 },
];
type TowerUpgrade = { cost: number; damage: number; range: number; fireRate: number; slow?: SlowEffect; splashRadius?: number };
export const TOWER_STATS: Record<TowerType, {
  name: string;
  cost: number;
  upgrades: TowerUpgrade[];
}> = {
  ARROW_SPITTER: {
    name: 'Arrow Spitter',
    cost: 50,
    upgrades: [
      { cost: 0, damage: 10, range: 3, fireRate: 2 },
      { cost: 30, damage: 15, range: 3.5, fireRate: 2.5 },
      { cost: 50, damage: 25, range: 4, fireRate: 3 },
    ],
  },
  TNT_CANNON: {
    name: 'TNT Cannon',
    cost: 120,
    upgrades: [
      { cost: 0, damage: 30, range: 2.5, fireRate: 0.5, splashRadius: 1.5 },
      { cost: 80, damage: 50, range: 3, fireRate: 0.75, splashRadius: 1.7 },
      { cost: 150, damage: 80, range: 3.5, fireRate: 1, splashRadius: 2.0 },
    ],
  },
  ICE_SLINGER: {
    name: 'Ice Slinger',
    cost: 80,
    upgrades: [
      { cost: 0, damage: 5, range: 2.8, fireRate: 1, slow: { intensity: 0.3, duration: 1.5 } },
      { cost: 60, damage: 10, range: 3.2, fireRate: 1.2, slow: { intensity: 0.4, duration: 2 } },
      { cost: 100, damage: 15, range: 3.6, fireRate: 1.5, slow: { intensity: 0.5, duration: 2.5 } },
    ],
  },
};
export const ENEMY_STATS: Record<EnemyType, {
  health: number;
  speed: number;
  reward: number;
}> = {
  GOBLIN: { health: 100, speed: 2, reward: 5 },
  OGRE: { health: 300, speed: 1, reward: 15 },
};
export const WAVES: { type: EnemyType; count: number }[][] = [
  [{ type: 'GOBLIN', count: 5 }],
  [{ type: 'GOBLIN', count: 10 }],
  [{ type: 'GOBLIN', count: 15 }, { type: 'OGRE', count: 2 }],
  [{ type: 'GOBLIN', count: 10 }, { type: 'OGRE', count: 5 }],
  [{ type: 'OGRE', count: 10 }],
  [{ type: 'GOBLIN', count: 30 }],
  [{ type: 'GOBLIN', count: 20 }, { type: 'OGRE', count: 10 }],
  [{ type: 'OGRE', count: 20 }],
  [{ type: 'GOBLIN', count: 50 }, { type: 'OGRE', count: 15 }],
  [{ type: 'GOBLIN', count: 30 }, { type: 'OGRE', count: 30 }],
];