import React, { useMemo } from 'react';
import { useGameStore } from '@/store/game-store';
import { GRID_WIDTH, GRID_HEIGHT, TILE_SIZE, ENEMY_PATH, TOWER_STATS } from '@/lib/game-constants';
import { cn } from '@/lib/utils';
const TowerSprite = ({ type }: { type: string }) => {
  if (type === 'ARROW_SPITTER') {
    return <path d="M24 4 L12 20 L24 16 L36 20 Z" fill="#8B4513" stroke="#000" strokeWidth="2" />;
  }
  if (type === 'TNT_CANNON') {
    return <rect x="14" y="14" width="20" height="20" fill="#8B4513" stroke="#000" strokeWidth="2" />;
  }
  if (type === 'ICE_SLINGER') {
    return <path d="M24 10 L16 24 L24 38 L32 24 Z" fill="#A0E9FF" stroke="#000" strokeWidth="2" />;
  }
  return null;
};
const EnemySprite = ({ type }: { type: string }) => {
  if (type === 'GOBLIN') {
    return <circle cx="24" cy="24" r="12" fill="#2E8B57" stroke="#000" strokeWidth="2" />;
  }
  if (type === 'OGRE') {
    return <rect x="12" y="12" width="24" height="24" fill="#708090" stroke="#000" strokeWidth="2" />;
  }
  return null;
};
const ProjectileSprite = ({ type }: { type: string }) => {
  if (type === 'ARROW_SPITTER') {
    return <path d="M0 0 L10 5 L0 10 Z" fill="#CD853F" />;
  }
  if (type === 'TNT_CANNON') {
    return <circle cx="5" cy="5" r="5" fill="#333" />;
  }
  if (type === 'ICE_SLINGER') {
    return <circle cx="5" cy="5" r="5" fill="#A0E9FF" stroke="#FFF" strokeWidth="1" />;
  }
  return null;
};
export const GameRenderer = React.memo(() => {
  const towersMap = useGameStore(state => state.towers);
  const enemiesMap = useGameStore(state => state.enemies);
  const projectilesMap = useGameStore(state => state.projectiles);
  const explosions = useGameStore(state => state.explosions);
  const selectedTowerType = useGameStore(state => state.selectedTowerType);
  const towers = useMemo(() => Array.from(towersMap.values()), [towersMap]);
  const enemies = useMemo(() => Array.from(enemiesMap.values()), [enemiesMap]);
  const projectiles = useMemo(() => Array.from(projectilesMap.values()), [projectilesMap]);
  const mousePosition = useGameStore(state => state.mousePosition);
  const selectedGridTowerId = useGameStore(state => state.selectedGridTowerId);
  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = 1; i < GRID_WIDTH; i++) {
      lines.push(<line key={`v${i}`} x1={i * TILE_SIZE} y1="0" x2={i * TILE_SIZE} y2={GRID_HEIGHT * TILE_SIZE} stroke="rgba(0,0,0,0.1)" />);
    }
    for (let i = 1; i < GRID_HEIGHT; i++) {
      lines.push(<line key={`h${i}`} x1="0" y1={i * TILE_SIZE} x2={GRID_WIDTH * TILE_SIZE} y2={i * TILE_SIZE} stroke="rgba(0,0,0,0.1)" />);
    }
    return lines;
  }, []);
  const pathTiles = useMemo(() => {
    return ENEMY_PATH.map((p, i) => (
      <rect key={`path-${i}`} x={p.x * TILE_SIZE} y={p.y * TILE_SIZE} width={TILE_SIZE} height={TILE_SIZE} fill="#A0522D" />
    ));
  }, []);
  return (
    <svg
      width={GRID_WIDTH * TILE_SIZE}
      height={GRID_HEIGHT * TILE_SIZE}
      className="bg-grass-light"
      style={{ imageRendering: 'pixelated' }}
    >
      <defs>
        <pattern id="grass-pattern" x="0" y="0" width={TILE_SIZE * 2} height={TILE_SIZE * 2} patternUnits="userSpaceOnUse">
          <rect width={TILE_SIZE} height={TILE_SIZE} fill="var(--grass-dark)" />
          <rect x={TILE_SIZE} width={TILE_SIZE} height={TILE_SIZE} fill="var(--grass-light)" />
          <rect y={TILE_SIZE} width={TILE_SIZE} height={TILE_SIZE} fill="var(--grass-light)" />
          <rect x={TILE_SIZE} y={TILE_SIZE} width={TILE_SIZE} height={TILE_SIZE} fill="var(--grass-dark)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grass-pattern)" />
      {pathTiles}
      {gridLines}
      {/* Render Towers */}
      {towers.map(tower => (
        <g key={tower.id} transform={`translate(${tower.position.x * TILE_SIZE}, ${tower.position.y * TILE_SIZE})`}>
          {selectedGridTowerId === tower.id && (
            <circle cx={TILE_SIZE / 2} cy={TILE_SIZE / 2} r={tower.range * TILE_SIZE} fill="rgba(255, 255, 255, 0.2)" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
          )}
          <TowerSprite type={tower.type} />
        </g>
      ))}
      {/* Render Tower Placement Preview */}
      {selectedTowerType && mousePosition.x !== -1 && (
        <g transform={`translate(${mousePosition.x * TILE_SIZE}, ${mousePosition.y * TILE_SIZE})`} opacity="0.5">
          <circle cx={TILE_SIZE / 2} cy={TILE_SIZE / 2} r={TOWER_STATS[selectedTowerType].upgrades[0].range * TILE_SIZE} fill="rgba(255, 255, 255, 0.3)" />
          <TowerSprite type={selectedTowerType} />
        </g>
      )}
      {/* Render Enemies */}
      {enemies.map(enemy => (
        <g key={enemy.id} transform={`translate(${(enemy.position.x) * TILE_SIZE}, ${(enemy.position.y) * TILE_SIZE})`}>
          <EnemySprite type={enemy.type} />
          {enemy.slowEffect && enemy.slowEffect.duration > 0 && (
            <rect x="12" y="12" width="24" height="24" fill="rgba(0, 191, 255, 0.5)" />
          )}
          <rect x="12" y="4" width="24" height="4" fill="#555" />
          <rect x="12" y="4" width={24 * (enemy.health / enemy.maxHealth)} height="4" fill="#FF0000" />
        </g>
      ))}
      {/* Render Projectiles */}
      {projectiles.map(proj => (
        <g key={proj.id} transform={`translate(${proj.position.x * TILE_SIZE}, ${proj.position.y * TILE_SIZE})`}>
          <ProjectileSprite type={proj.towerType} />
        </g>
      ))}
      {/* Render Explosions */}
      {explosions.map(exp => {
        const progress = exp.duration / exp.maxDuration;
        return (
          <circle
            key={exp.id}
            cx={(exp.position.x + 0.5) * TILE_SIZE}
            cy={(exp.position.y + 0.5) * TILE_SIZE}
            r={progress * exp.radius * TILE_SIZE}
            fill="rgba(255, 165, 0, 0.7)"
            opacity={1 - progress}
          />
        );
      })}
    </svg>
  );
});