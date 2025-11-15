import React, { useEffect, useRef } from 'react';
import { GameRenderer } from '@/components/game/GameRenderer';
import { GameInterface } from '@/components/game/GameInterface';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useGameStore, useGameActions } from '@/store/game-store';
import { TILE_SIZE } from '@/lib/game-constants';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PanelRightOpen } from 'lucide-react';
export function HomePage() {
  useGameLoop();
  const { initGame, placeTower, setMousePosition, selectGridTower } = useGameActions();
  const gameStatus = useGameStore(state => state.gameStatus);
  const selectedTowerType = useGameStore(state => state.selectedTowerType);
  const gameBoardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  useEffect(() => {
    initGame();
  }, [initGame]);
  const handleBoardClick = (e: React.MouseEvent) => {
    if (gameBoardRef.current) {
      const rect = gameBoardRef.current.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
      const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
      if (selectedTowerType) {
        placeTower({ x, y });
      } else {
        const towers = useGameStore.getState().towers;
        const clickedTower = Array.from(towers.values()).find(t => t.position.x === x && t.position.y === y);
        if (clickedTower) {
          selectGridTower(clickedTower.id);
        } else {
          selectGridTower(null);
        }
      }
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameBoardRef.current && selectedTowerType) {
      const rect = gameBoardRef.current.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
      const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
      setMousePosition({ x, y });
    }
  };
  const handleMouseLeave = () => {
    setMousePosition({ x: -1, y: -1 });
  };
  const GameDialog = ({ title, description, buttonText }: { title: string, description: string, buttonText: string }) => (
    <AlertDialog open={gameStatus === 'GAME_OVER' || gameStatus === 'VICTORY'}>
      <AlertDialogContent className="font-pixel bg-stone-800 border-stone-600 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-yellow-400 text-2xl">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-stone-300">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={initGame} className="bg-green-600 hover:bg-green-700">{buttonText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  const gameInterfacePanel = <GameInterface />;
  return (
    <div className="w-screen h-screen bg-stone-900 flex flex-col md:flex-row items-center justify-center overflow-hidden font-sans">
      <div
        ref={gameBoardRef}
        className="relative"
        onClick={handleBoardClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: selectedTowerType ? 'copy' : 'default' }}
      >
        <GameRenderer />
      </div>
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button className="absolute bottom-4 right-4 z-10" size="icon">
              <PanelRightOpen />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh] p-0 border-t-4 border-stone-800">
            {gameInterfacePanel}
          </SheetContent>
        </Sheet>
      ) : (
        <div className="w-[350px] h-full flex-shrink-0">
          {gameInterfacePanel}
        </div>
      )}
      {gameStatus === 'GAME_OVER' && <GameDialog title="Game Over!" description="The monsters have breached your defenses." buttonText="Try Again" />}
      {gameStatus === 'VICTORY' && <GameDialog title="Victory!" description="You have successfully defended your base!" buttonText="Play Again" />}
    </div>
  );
}