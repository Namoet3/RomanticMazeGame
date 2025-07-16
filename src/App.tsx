
import React, { useEffect } from 'react';
import { GameState } from '../types';
import { useGameController } from './hooks/useGameController';
import StartScreen from './components/StartScreen';
import LevelTransitionScreen from './components/LevelTransitionScreen';
import HUD from './components/HUD';
import MazeDisplay from './components/MazeDisplay';
import QuestionModal from './components/QuestionModal';
import FeedbackPopup from './components/FeedbackPopup';
import SurpriseEffect from './components/SurpriseEffect';
import LastStandEffect from './components/LastStandEffect';
import GameOverScreen from './components/GameOverScreen';
import CreditsScreen from './components/CreditsScreen';
import PlayerChoiceModal from './components/PlayerChoiceModal';
import AiCoachModal from './components/AiCoachModal';
import DreamWeaverModal from './components/DreamWeaverModal';
import DamageFlashScreen from './components/DamageFlashScreen';
import RealityGlitchEffect from './components/RealityGlitchEffect';
import PauseScreen from './components/PauseScreen'; 
import { DREAM_WEAVER_ACTIVATION_KEY, SOUND_UI_CLICK } from '../constants';

const App = (): JSX.Element | null => {
  const {
    gameState, currentLevel, playerState, mazeGrid, lostWhispers, giftBoxes,
    portalKeyOnMap, activeQuestion, levelBriefing, feedbackMessage, surpriseActive,
    isLastStandAnimating, heartCluePath, sparkles, animatingGiftBoxPosition,
    loveBoomerang, sootheAnimations, confettiParticles,
    playerChoiceOptions, playerChoicePrompt,
    aiCoachMessage, isAiCoachLoading, isAiCoachModalOpen,
    dreamEssenceItems, isDreamWeaverModalOpen, isDreamWeaverLoading,
    heartLossAnimData,
    damageFlashTrigger,
    jumpScareEffect,
    realityGlitchTriggerKey,
    totalElapsedTime, 
    elapsedTimeForHUD, 
    startGame, 
    resetGame, handlePlayerMove, handleSootheAction, handleAimAndShoot,
    handleAnswerSubmit, handlePlayerPowerUpChoice,
    handleCloseAiCoachModal,
    handleActivateDreamWeaver, handleCloseDreamWeaverModal,
    setGameState, handleResumeGame, handleReturnToMainMenu, 
    playSound,
  } = useGameController();

  const handlePauseGame = () => {
    if (gameState === GameState.PLAYING) {
      playSound(SOUND_UI_CLICK);
      setGameState(GameState.GAME_PAUSED);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ')) return;

      if (gameState === GameState.PLAYING) {
        if (e.key === 'w' || e.key === 'W') handlePlayerMove(0, -1);
        else if (e.key === 's' || e.key === 'S') handlePlayerMove(0, 1);
        else if (e.key === 'a' || e.key === 'A') handlePlayerMove(-1, 0);
        else if (e.key === 'd' || e.key === 'D') handlePlayerMove(1, 0);
        else if (e.key === 'ArrowUp') handleAimAndShoot('up');
        else if (e.key === 'ArrowDown') handleAimAndShoot('down');
        else if (e.key === 'ArrowLeft') handleAimAndShoot('left');
        else if (e.key === 'ArrowRight') handleAimAndShoot('right');
        else if (e.key === ' ') handleSootheAction();
        else if (e.key.toLowerCase() === DREAM_WEAVER_ACTIVATION_KEY) handleActivateDreamWeaver();
        else if (e.key === 'Escape') { 
          handlePauseGame(); 
        }
      } else if (gameState === GameState.START_SCREEN && e.key === 'Enter') {
        startGame(); 
      } else if ((gameState === GameState.GAME_OVER || gameState === GameState.CREDITS) && e.key === 'Enter') {
        resetGame(); 
      } else if (gameState === GameState.GAME_PAUSED && e.key === 'Escape') {
         handleResumeGame(); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handlePlayerMove, handleSootheAction, handleAimAndShoot, startGame, resetGame, handleActivateDreamWeaver, handlePauseGame, handleResumeGame]);

  const gameScreenContent = (
    <div className="flex flex-col items-center justify-center min-h-screen p-1 sm:p-2">
      <HUD
        playerState={playerState}
        currentLevel={currentLevel}
        isLastStandAnimating={isLastStandAnimating}
        heartLossAnimData={heartLossAnimData}
        onPauseGame={handlePauseGame}
        elapsedTimeForHUD={elapsedTimeForHUD} 
      />
      <div className="my-2 sm:my-3">
        <MazeDisplay
          mazeGrid={mazeGrid}
          playerState={playerState}
          lostWhispers={lostWhispers}
          giftBoxes={giftBoxes}
          portalKeyOnMap={portalKeyOnMap}
          heartCluePath={heartCluePath}
          currentLevel={currentLevel}
          isLastStandAnimating={isLastStandAnimating}
          sparkles={sparkles}
          animatingGiftBoxPosition={animatingGiftBoxPosition}
          loveBoomerang={loveBoomerang}
          sootheAnimations={sootheAnimations}
          confettiParticles={confettiParticles}
          dreamEssenceItems={dreamEssenceItems}
          jumpScareEffect={jumpScareEffect}
          realityGlitchTriggerKey={realityGlitchTriggerKey}
        />
      </div>
      {damageFlashTrigger && <DamageFlashScreen trigger={damageFlashTrigger} />}
      {feedbackMessage && <FeedbackPopup feedbackMessage={feedbackMessage} />}
      {surpriseActive && <SurpriseEffect />}
      {isLastStandAnimating && <LastStandEffect />}
      {isAiCoachModalOpen && (
        <AiCoachModal
          isOpen={isAiCoachModalOpen}
          isLoading={isAiCoachLoading}
          message={aiCoachMessage}
          onClose={handleCloseAiCoachModal} 
        />
      )}
      {isDreamWeaverModalOpen && (
        <DreamWeaverModal
          isOpen={isDreamWeaverModalOpen}
          isLoading={isDreamWeaverLoading}
          onClose={handleCloseDreamWeaverModal} 
        />
      )}
      {realityGlitchTriggerKey && <RealityGlitchEffect key={realityGlitchTriggerKey} />}
    </div>
  );

  if (gameState === GameState.START_SCREEN) {
    return <StartScreen onStartGame={startGame} />; 
  } else if (gameState === GameState.LEVEL_TRANSITION) {
    return <LevelTransitionScreen currentLevel={currentLevel} levelBriefing={levelBriefing} />;
  } else if (gameState === GameState.GAME_PAUSED) { 
    return <PauseScreen onResumeGame={handleResumeGame} onReturnToMainMenu={handleReturnToMainMenu} playSound={playSound} />;
  } else if (gameState === GameState.GAME_OVER) {
    return <GameOverScreen onRestart={resetGame} />; 
  } else if (gameState === GameState.CREDITS) {
    return <CreditsScreen playerState={playerState} onRestart={resetGame} totalElapsedTime={totalElapsedTime} />; 
  } else if (
    gameState === GameState.PLAYING ||
    gameState === GameState.PAUSED_QUESTION ||
    gameState === GameState.PAUSED_PLAYER_CHOICE
  ) {
    let activePlayModalOverlay = null;
    if (gameState === GameState.PAUSED_QUESTION && activeQuestion) {
      activePlayModalOverlay = <QuestionModal activeQuestion={activeQuestion} onAnswerSubmit={handleAnswerSubmit} playSound={playSound} />;
    } else if (gameState === GameState.PAUSED_PLAYER_CHOICE && playerChoiceOptions && playerChoicePrompt) {
      activePlayModalOverlay = <PlayerChoiceModal prompt={playerChoicePrompt} options={playerChoiceOptions} onChoice={handlePlayerPowerUpChoice} playSound={playSound}/>;
    }
    return (
      <>
        {gameScreenContent}
        {activePlayModalOverlay}
      </>
    );
  } else {
    console.error("App.tsx: Reached end of render logic with unhandled gameState:", gameState);
    return null;
  }
};

export default App;
