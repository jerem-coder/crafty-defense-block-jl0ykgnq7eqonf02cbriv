export interface GridPoint {
  x: number;
  y: number;
}
export type TowerType = 'ARROW_SPITTER' | 'TNT_CANNON' | 'ICE_SLINGER';
export interface Tower {
  id: string;
  type: TowerType;
  position: GridPoint;
  level: number;
  range: number;
  damage: number;
  fireRate: number; // shots per second
  cooldown: number; // time until next shot
  targetId?: string;
}
export interface SlowEffect {
  intensity: number; // e.g., 0.5 for 50% slow
  duration: number; // in seconds
}
export type EnemyType = 'GOBLIN' | 'OGRE';
export interface Enemy {
  id:string;
  type: EnemyType;
  position: GridPoint;
  health: number;
  maxHealth: number;
  speed: number; // grid units per second
  pathIndex: number;
  reward: number;
  slowEffect?: SlowEffect;
}
export interface Projectile {
  id: string;
  position: GridPoint;
  targetId: string;
  damage: number;
  speed: number; // grid units per second
  towerType: TowerType;
  slow?: SlowEffect;
  splashRadius?: number;
}
export interface Explosion {
  id: string;
  position: GridPoint;
  radius: number;
  duration: number; // current lifetime
  maxDuration: number;
}
export type GameStatus = 'READY' | 'PLAYING' | 'PAUSED' | 'WAVE_CLEARED' | 'GAME_OVER' | 'VICTORY';
export interface GameState {
  gameStatus: GameStatus;
  health: number;
  blocks: number; // currency
  wave: number;
  towers: Map<string, Tower>;
  enemies: Map<string, Enemy>;
  projectiles: Map<string, Projectile>;
  explosions: Explosion[];
  selectedTowerType: TowerType | null;
  selectedGridTowerId: string | null;
  mousePosition: GridPoint;
}
export interface GameActions {
  initGame: () => void;
  placeTower: (position: GridPoint) => void;
  selectTowerType: (towerType: TowerType | null) => void;
  selectGridTower: (towerId: string | null) => void;
  upgradeSelectedTower: () => void;
  sellSelectedTower: () => void;
  startNextWave: () => void;
  togglePause: () => void;
  update: (deltaTime: number) => void; // Main game loop update function
  setMousePosition: (position: GridPoint) => void;
  resetGame: () => void;
}
export type GameStore = GameState & { actions: GameActions };