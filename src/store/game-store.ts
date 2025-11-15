import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import {
  GameStore, GameState, Tower, Enemy, Projectile, GridPoint, TowerType, Explosion
} from '@/lib/game-types';
import {
  INITIAL_HEALTH, INITIAL_BLOCKS, TOWER_STATS, ENEMY_PATH, WAVES, ENEMY_STATS, MAX_WAVES
} from '@/lib/game-constants';
const getInitialState = (): GameState => ({
  gameStatus: 'READY',
  health: INITIAL_HEALTH,
  blocks: INITIAL_BLOCKS,
  wave: 0,
  towers: new Map(),
  enemies: new Map(),
  projectiles: new Map(),
  explosions: [],
  selectedTowerType: null,
  selectedGridTowerId: null,
  mousePosition: { x: -1, y: -1 },
});
export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    ...getInitialState(),
    actions: {
      initGame: () => set(getInitialState()),
      placeTower: (position: GridPoint) => {
        const { selectedTowerType, blocks, towers } = get();
        if (!selectedTowerType) return;
        const stats = TOWER_STATS[selectedTowerType];
        if (blocks < stats.cost) return;
        const isOccupied = Array.from(towers.values()).some(t => t.position.x === position.x && t.position.y === position.y);
        const isPath = ENEMY_PATH.some(p => p.x === position.x && p.y === position.y);
        if (isOccupied || isPath) return;
        const upgradeInfo = stats.upgrades[0];
        const newTower: Tower = {
          id: uuidv4(),
          type: selectedTowerType,
          position,
          level: 1,
          damage: upgradeInfo.damage,
          range: upgradeInfo.range,
          fireRate: upgradeInfo.fireRate,
          cooldown: 0,
        };
        set(state => {
          state.towers.set(newTower.id, newTower);
          state.blocks -= stats.cost;
          state.selectedTowerType = null;
        });
      },
      selectTowerType: (towerType) => set({ selectedTowerType: towerType, selectedGridTowerId: null }),
      selectGridTower: (towerId) => set({ selectedGridTowerId: towerId, selectedTowerType: null }),
      upgradeSelectedTower: () => {
        const { selectedGridTowerId, towers, blocks } = get();
        if (!selectedGridTowerId) return;
        const tower = towers.get(selectedGridTowerId);
        if (!tower) return;
        const stats = TOWER_STATS[tower.type];
        if (tower.level >= stats.upgrades.length) return;
        const nextUpgrade = stats.upgrades[tower.level];
        if (blocks < nextUpgrade.cost) return;
        set(state => {
          const t = state.towers.get(selectedGridTowerId);
          if (t) {
            t.level++;
            const currentUpgrade = stats.upgrades[t.level - 1];
            t.damage = currentUpgrade.damage;
            t.range = currentUpgrade.range;
            t.fireRate = currentUpgrade.fireRate;
            state.blocks -= nextUpgrade.cost;
          }
        });
      },
      sellSelectedTower: () => {
        const { selectedGridTowerId, towers } = get();
        if (!selectedGridTowerId) return;
        const tower = towers.get(selectedGridTowerId);
        if (!tower) return;
        const stats = TOWER_STATS[tower.type];
        let refund = stats.cost * 0.7;
        for (let i = 1; i < tower.level; i++) {
          refund += stats.upgrades[i].cost * 0.7;
        }
        set(state => {
          state.towers.delete(selectedGridTowerId);
          state.blocks += Math.floor(refund);
          state.selectedGridTowerId = null;
        });
      },
      startNextWave: () => {
        const { wave, gameStatus } = get();
        if (gameStatus === 'PLAYING' || wave >= MAX_WAVES) return;
        set(state => {
          state.wave++;
          state.gameStatus = 'PLAYING';
        });
        const waveData = WAVES[get().wave - 1];
        let spawnDelay = 0;
        waveData.forEach(group => {
          for (let i = 0; i < group.count; i++) {
            setTimeout(() => {
              const stats = ENEMY_STATS[group.type];
              const newEnemy: Enemy = {
                id: uuidv4(),
                type: group.type,
                position: { ...ENEMY_PATH[0] },
                health: stats.health,
                maxHealth: stats.health,
                speed: stats.speed,
                pathIndex: 0,
                reward: stats.reward,
              };
              set(state => {
                state.enemies.set(newEnemy.id, newEnemy);
              });
            }, spawnDelay);
            spawnDelay += 500;
          }
        });
      },
      togglePause: () => {
        const { gameStatus } = get();
        if (gameStatus === 'PLAYING') {
          set({ gameStatus: 'PAUSED' });
        } else if (gameStatus === 'PAUSED') {
          set({ gameStatus: 'PLAYING' });
        }
      },
      update: (deltaTime) => {
        if (get().gameStatus !== 'PLAYING') return;
        set(state => {
          // Update towers
          state.towers.forEach(tower => {
            tower.cooldown = Math.max(0, tower.cooldown - deltaTime);
            if (tower.cooldown === 0) {
              let target: Enemy | undefined;
              let minDistance = Infinity;
              get().enemies.forEach(enemy => {
                const dx = enemy.position.x - tower.position.x;
                const dy = enemy.position.y - tower.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= tower.range && distance < minDistance) {
                  minDistance = distance;
                  target = enemy;
                }
              });
              if (target) {
                tower.targetId = target.id;
                tower.cooldown = 1 / tower.fireRate;
                const towerStats = TOWER_STATS[tower.type].upgrades[tower.level - 1];
                const newProjectile: Projectile = {
                  id: uuidv4(),
                  position: { ...tower.position },
                  targetId: target.id,
                  damage: tower.damage,
                  speed: 10,
                  towerType: tower.type,
                  slow: towerStats.slow ? { ...towerStats.slow } : undefined,
                  splashRadius: towerStats.splashRadius,
                };
                state.projectiles.set(newProjectile.id, newProjectile);
              }
            }
          });
          // Update projectiles
          state.projectiles.forEach(proj => {
            const target = state.enemies.get(proj.targetId);
            if (!target) {
              state.projectiles.delete(proj.id);
              return;
            }
            const dx = target.position.x - proj.position.x;
            const dy = target.position.y - proj.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 0.2) {
              if (proj.splashRadius) {
                // Splash damage
                state.explosions.push({
                  id: uuidv4(),
                  position: target.position,
                  radius: proj.splashRadius,
                  duration: 0,
                  maxDuration: 0.5,
                });
                state.enemies.forEach(enemy => {
                  const dxSplash = enemy.position.x - target.position.x;
                  const dySplash = enemy.position.y - target.position.y;
                  const distSplash = Math.sqrt(dxSplash * dxSplash + dySplash * dySplash);
                  if (distSplash <= proj.splashRadius) {
                    enemy.health -= proj.damage;
                  }
                });
              } else {
                // Single target damage
                target.health -= proj.damage;
                if (proj.slow) {
                  target.slowEffect = { ...proj.slow };
                }
              }
              state.enemies.forEach(enemy => {
                if (enemy.health <= 0) {
                  state.blocks += enemy.reward;
                  state.enemies.delete(enemy.id);
                }
              });
              state.projectiles.delete(proj.id);
            } else {
              proj.position.x += (dx / distance) * proj.speed * deltaTime;
              proj.position.y += (dy / distance) * proj.speed * deltaTime;
            }
          });
          // Update enemies
          state.enemies.forEach(enemy => {
            if (enemy.slowEffect) {
              enemy.slowEffect.duration -= deltaTime;
              if (enemy.slowEffect.duration <= 0) {
                enemy.slowEffect = undefined;
              }
            }
            const currentSpeed = enemy.slowEffect ? enemy.speed * (1 - enemy.slowEffect.intensity) : enemy.speed;
            const nextPointIndex = enemy.pathIndex + 1;
            if (nextPointIndex >= ENEMY_PATH.length) {
              state.health--;
              state.enemies.delete(enemy.id);
              return;
            }
            const nextPoint = ENEMY_PATH[nextPointIndex];
            const dx = nextPoint.x - enemy.position.x;
            const dy = nextPoint.y - enemy.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const moveDistance = currentSpeed * deltaTime;
            if (distance < moveDistance) {
              enemy.position = { ...nextPoint };
              enemy.pathIndex = nextPointIndex;
            } else {
              enemy.position.x += (dx / distance) * moveDistance;
              enemy.position.y += (dy / distance) * moveDistance;
            }
          });
          // Update explosions
          state.explosions = state.explosions.filter(exp => {
            exp.duration += deltaTime;
            return exp.duration < exp.maxDuration;
          });
        });
        // Check win/loss conditions after all updates
        const { health, enemies, wave } = get();
        if (health <= 0) {
          set({ gameStatus: 'GAME_OVER' });
        } else if (enemies.size === 0 && wave > 0 && get().gameStatus === 'PLAYING') {
          if (wave === MAX_WAVES) {
            set({ gameStatus: 'VICTORY' });
          } else {
            set({ gameStatus: 'WAVE_CLEARED' });
          }
        }
      },
      setMousePosition: (position) => set({ mousePosition: position }),
      resetGame: () => {
        set(getInitialState());
      }
    },
  })),
);
// Export actions and selectors for convenience
export const useGameActions = () => useGameStore((state) => state.actions);