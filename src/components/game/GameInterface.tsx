import React from 'react';
import { useGameStore, useGameActions } from '@/store/game-store';
import { TOWER_STATS, MAX_WAVES } from '@/lib/game-constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Coins, Zap, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tower } from '@/lib/game-types';
const StatDisplay = ({ icon, value, label }: { icon: React.ReactNode, value: number | string, label: string }) => (
  <div className="flex items-center gap-2 bg-stone-800 p-2 rounded-md border border-stone-600">
    <div className="text-yellow-400">{icon}</div>
    <div className="flex flex-col">
      <span className="font-pixel text-lg text-white">{value}</span>
      <span className="text-xs text-stone-400">{label}</span>
    </div>
  </div>
);
const TowerCard = ({ towerType, onSelect, isSelected, canAfford }: { towerType: keyof typeof TOWER_STATS, onSelect: () => void, isSelected: boolean, canAfford: boolean }) => {
  const stats = TOWER_STATS[towerType];
  return (
    <Card
      onClick={onSelect}
      className={cn(
        "bg-stone-700 border-stone-600 text-white cursor-pointer transition-all duration-200 hover:border-yellow-400 hover:-translate-y-1",
        isSelected && "border-yellow-500 ring-2 ring-yellow-500",
        !canAfford && "opacity-50 cursor-not-allowed"
      )}
    >
      <CardHeader>
        <CardTitle className="font-pixel text-base">{stats.name}</CardTitle>
        <CardDescription className="text-stone-400 flex items-center gap-1">
          <Coins className="w-4 h-4 text-yellow-500" /> {stats.cost}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-xs text-stone-300 space-y-1">
        <p>Damage: {stats.upgrades[0].damage}</p>
        <p>Range: {stats.upgrades[0].range}</p>
        <p>Rate: {stats.upgrades[0].fireRate}/s</p>
      </CardContent>
    </Card>
  );
};
const SelectedTowerPanel = ({ tower }: { tower: Tower }) => {
  const { upgradeSelectedTower, sellSelectedTower } = useGameActions();
  const blocks = useGameStore(state => state.blocks);
  const stats = TOWER_STATS[tower.type];
  const nextUpgrade = tower.level < stats.upgrades.length ? stats.upgrades[tower.level] : null;
  const canAffordUpgrade = nextUpgrade && blocks >= nextUpgrade.cost;
  let refund = stats.cost * 0.7;
  for (let i = 1; i < tower.level; i++) {
    refund += stats.upgrades[i].cost * 0.7;
  }
  return (
    <div className="space-y-4">
      <h3 className="font-pixel text-lg text-yellow-400">{stats.name} (Lvl {tower.level})</h3>
      <div className="text-sm space-y-1 text-stone-300">
        <p>Damage: {tower.damage}</p>
        <p>Range: {tower.range}</p>
        <p>Fire Rate: {tower.fireRate}/s</p>
      </div>
      {nextUpgrade ? (
        <Button
          onClick={upgradeSelectedTower}
          disabled={!canAffordUpgrade}
          className="w-full font-pixel bg-green-600 hover:bg-green-700 text-white"
        >
          Upgrade ({nextUpgrade.cost} <Coins className="inline w-4 h-4" />)
        </Button>
      ) : (
        <p className="text-center font-pixel text-green-400">Max Level</p>
      )}
      <Button onClick={sellSelectedTower} className="w-full font-pixel bg-red-600 hover:bg-red-700 text-white">
        Sell ({Math.floor(refund)} <Coins className="inline w-4 h-4" />)
      </Button>
    </div>
  );
};
export const GameInterface = () => {
  const health = useGameStore(state => state.health);
  const blocks = useGameStore(state => state.blocks);
  const wave = useGameStore(state => state.wave);
  const gameStatus = useGameStore(state => state.gameStatus);
  const selectedTowerType = useGameStore(state => state.selectedTowerType);
  const selectedGridTowerId = useGameStore(state => state.selectedGridTowerId);
  const towers = useGameStore(state => state.towers);
  const { startNextWave, selectTowerType, togglePause } = useGameActions();
  const selectedTower = selectedGridTowerId ? towers.get(selectedGridTowerId) : null;
  const getWaveButtonText = () => {
    switch (gameStatus) {
      case 'PLAYING':
        return 'Wave in Progress';
      case 'PAUSED':
        return 'Game Paused';
      case 'READY':
      case 'WAVE_CLEARED':
        return 'Start Next Wave';
      default:
        return '...';
    }
  };
  return (
    <div className="w-full h-full bg-ui-panel-bg text-white p-4 flex flex-col gap-4 border-l-4 border-stone-800">
      <h1 className="font-pixel text-3xl text-center text-yellow-400 drop-shadow-[2px_2px_0_rgba(0,0,0,0.7)]">Crafty Defense</h1>
      <div className="grid grid-cols-3 gap-2">
        <StatDisplay icon={<Heart />} value={health} label="Health" />
        <StatDisplay icon={<Coins />} value={blocks} label="Blocks" />
        <StatDisplay icon={<Zap />} value={`${wave}/${MAX_WAVES}`} label="Wave" />
      </div>
      <div className="flex-grow bg-stone-800/50 p-4 rounded-lg border border-stone-600 overflow-y-auto">
        {selectedTower ? (
          <SelectedTowerPanel tower={selectedTower} />
        ) : (
          <div className="space-y-4">
            <h2 className="font-pixel text-xl text-yellow-400">Build Towers</h2>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(TOWER_STATS) as (keyof typeof TOWER_STATS)[]).map(type => (
                <TowerCard
                  key={type}
                  towerType={type}
                  onSelect={() => selectTowerType(type)}
                  isSelected={selectedTowerType === type}
                  canAfford={blocks >= TOWER_STATS[type].cost}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={startNextWave}
          disabled={gameStatus === 'PLAYING' || gameStatus === 'PAUSED'}
          className="flex-grow py-6 font-pixel text-xl bg-green-700 hover:bg-green-800 border-b-4 border-green-900 active:border-b-0 active:translate-y-1 transition-all duration-150"
        >
          {getWaveButtonText()}
        </Button>
        <Button
          onClick={togglePause}
          disabled={gameStatus !== 'PLAYING' && gameStatus !== 'PAUSED'}
          className="py-6 px-4 font-pixel text-xl bg-blue-600 hover:bg-blue-700 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all duration-150"
        >
          {gameStatus === 'PLAYING' ? <Pause /> : <Play />}
        </Button>
      </div>
    </div>
  );
};