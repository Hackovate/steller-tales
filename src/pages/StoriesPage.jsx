import React, { useState, useEffect } from "react";
import { BsCoin } from 'react-icons/bs';
import StarsBackground from "../components/StarsBackground";
import CharacterCard from "../components/CharacterCard";
import { CHARACTERS } from "../data/stories";
import { useLanguage } from "../context/LanguageContext";

// Local storage helpers
const getUnlockState = () => {
  const state = localStorage.getItem("characterUnlocks");
  return state ? JSON.parse(state) : { farmer: true };
};

const setUnlockState = (state) => {
  localStorage.setItem("characterUnlocks", JSON.stringify(state));
};

const getQuizScores = () => {
  const scores = localStorage.getItem("quizScores");
  return scores ? JSON.parse(scores) : {};
};

const setQuizScores = (scores) => {
  localStorage.setItem("quizScores", JSON.stringify(scores));
};

const StoriesPage = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const { t } = useLanguage();
  const [questionStates, setQuestionStates] = useState([]);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [swipeStart, setSwipeStart] = useState(null);
  const [swipeStartY, setSwipeStartY] = useState(null);
  const [unlockState, setUnlockStateState] = useState(getUnlockState());
  const [quizScores, setQuizScoresState] = useState(getQuizScores());
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [userCoins, setUserCoins] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [characterToUnlock, setCharacterToUnlock] = useState(null);

  // Load user coins from localStorage
  useEffect(() => {
    const coins = parseInt(localStorage.getItem('userCoins') || '0');
    setUserCoins(coins);
  }, [showCompletionPopup, quizCompleted]);

  // Hide BottomNavigation when story viewer or quiz is open
  useEffect(() => {
    if (selectedCharacter || showQuiz) {
      document.body.classList.add('hide-bottom-nav');
    } else {
      document.body.classList.remove('hide-bottom-nav');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('hide-bottom-nav');
    };
  }, [selectedCharacter, showQuiz]);

  // Keyboard navigation for story pages
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedCharacter || showQuiz) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (pageNumber > 0) {
            setPageNumber(pageNumber - 1);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (pageNumber < selectedCharacter.images.length - 1) {
            setPageNumber(pageNumber + 1);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setSelectedCharacter(null);
          setPageNumber(0);
          setShowCompletionPopup(false);
          break;
        default:
          break;
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCharacter, showQuiz, pageNumber]);

  // Show completion popup with delay when reaching last page
  useEffect(() => {
    if (selectedCharacter && pageNumber === selectedCharacter.images.length - 1) {
      // Give user 2 seconds to read the last page before showing popup
      const timer = setTimeout(() => {
        setShowCompletionPopup(true);
      }, 8000);

      return () => clearTimeout(timer);
    } else {
      setShowCompletionPopup(false);
    }
  }, [selectedCharacter, pageNumber]);

  // Select character or show unlock modal for locked ones
  const handleCharacterClick = (character) => {
    if (unlockState[character.id]) {
      // Character is unlocked, open story
      setSelectedCharacter(character);
      setPageNumber(0);
      setShowCompletionPopup(false);
    } else {
      // Character is locked, show unlock modal
      setCharacterToUnlock(character);
      setShowUnlockModal(true);
    }
  };

  // Unlock character with coins
  const handleUnlockWithCoins = () => {
    const UNLOCK_COST = 50;
    const currentCoins = parseInt(localStorage.getItem('userCoins') || '0');
    
    if (currentCoins < UNLOCK_COST) {
      alert(`Not enough coins! You need ${UNLOCK_COST} coins to unlock. You have ${currentCoins} coins.\n\nEarn coins by completing quizzes! 🎯`);
      return;
    }

    // Deduct coins
    const newTotal = currentCoins - UNLOCK_COST;
    localStorage.setItem('userCoins', String(newTotal));
    setUserCoins(newTotal);

    // Unlock the character
    const newUnlockState = { ...unlockState, [characterToUnlock.id]: true };
    setUnlockState(newUnlockState);
    setUnlockStateState(newUnlockState);

    // Mark as unlocked via coins (for tracking)
    localStorage.setItem(`character_${characterToUnlock.id}_unlockedWithCoins`, 'true');

    // Close modal and open story
    setShowUnlockModal(false);
    setSelectedCharacter(characterToUnlock);
    setCharacterToUnlock(null);
    setPageNumber(0);
  };

  // Complete story → show quiz
  const handleStoryComplete = () => {
    setShowQuiz(true);
    // Initialize question states
    const questions = selectedCharacter?.quizQuestions || [];
    setQuestionStates(questions.map(() => ({
      answered: false,
      selectedAnswer: null,
      isCorrect: false,
      coinsEarned: 0
    })));
    setTotalCoinsEarned(0);
    setQuizCompleted(false);
  };

  // Handle answer selection with immediate feedback
  const handleQuizAnswer = (qIdx, optIdx) => {
    const questions = selectedCharacter?.quizQuestions || [];
    const question = questions[qIdx];
    const isCorrect = optIdx === question.answer;
    const coinsEarned = isCorrect ? 20 : 0;

    // Update question state
    const newStates = [...questionStates];
    newStates[qIdx] = {
      answered: true,
      selectedAnswer: optIdx,
      isCorrect,
      coinsEarned
    };
    setQuestionStates(newStates);

    // Update total coins
    setTotalCoinsEarned(prev => prev + coinsEarned);
  };

  // Complete quiz and save progress
  const handleQuizComplete = () => {
    const totalCoins = questionStates.reduce((sum, state) => sum + state.coinsEarned, 0);
    
    // Check if this is the first time completing this quiz
    const wasAlreadyCompleted = localStorage.getItem(`quiz_${selectedCharacter.id}_completed`) === 'true';
    
    // Add coins and unlock next character ONLY on first completion
    let unlockedNext = false;
    if (!wasAlreadyCompleted) {
      // Add coins to user's total (only on first attempt)
      const currentCoins = parseInt(localStorage.getItem('userCoins') || '0');
      const newTotal = currentCoins + totalCoins;
      localStorage.setItem('userCoins', String(newTotal));

      // Find the character with depth = currentDepth + 1
      const currentDepth = selectedCharacter.depth;
      const nextChar = CHARACTERS.find((c) => c.depth === currentDepth + 1);
      
      if (nextChar) {
        const newUnlockState = { ...unlockState, [nextChar.id]: true };
        setUnlockState(newUnlockState);
        setUnlockStateState(newUnlockState);
        unlockedNext = true;
      }
    }

    // Save quiz completion and track if new unlock happened
    const newScores = { ...quizScores, [selectedCharacter.id]: totalCoins };
    setQuizScores(newScores);
    setQuizScoresState(newScores);
    
    localStorage.setItem(`quiz_${selectedCharacter.id}_score`, String(totalCoins));
    localStorage.setItem(`quiz_${selectedCharacter.id}_completed`, 'true');
    localStorage.setItem(`quiz_${selectedCharacter.id}_newUnlock`, String(unlockedNext));

    setQuizCompleted(true);
  };

  // Close quiz and return to story selection
  const handleCloseQuiz = () => {
    setSelectedCharacter(null);
    setShowQuiz(false);
    setQuestionStates([]);
    setTotalCoinsEarned(0);
    setQuizCompleted(false);
    setShowCompletionPopup(false);
  };

  // Touch swipe for mobile
  const handleTouchStart = (e) => {
    setSwipeStart(e.touches[0].clientX);
    setSwipeStartY(e.touches[0].clientY);
  };
  const handleTouchEnd = (e) => {
    if (swipeStart === null || swipeStartY === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - swipeStart;
    const deltaY = endY - swipeStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX < 0 && pageNumber < selectedCharacter.images.length - 1) {
        setPageNumber(pageNumber + 1);
      } else if (deltaX > 0 && pageNumber > 0) {
        setPageNumber(pageNumber - 1);
      }
    }
    setSwipeStart(null);
    setSwipeStartY(null);
  };

  return (
    <div className="mobile-container relative pb-32 md:pb-24">
      <StarsBackground />
      <div className="relative z-10 pt-6">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="mb-4">
            <span className="text-6xl inline-block hover:scale-110 transition-all cursor-pointer animate-float">
              📖
            </span>
          </div>
          <h1 className="text-3xl font-bold text-accent-orange mb-3 tracking-wide">
            {t('storiesHeaderTitle')}
          </h1>
          <p className="text-text-light text-base leading-relaxed">
            {t('storiesHeaderSubtitle')}
          </p>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 px-3">
          {CHARACTERS.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              unlocked={!!unlockState[character.id]}
              completed={!!quizScores[character.id]}
              onClick={handleCharacterClick}
            />
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="bg-gradient-to-br from-accent-purple/20 via-accent-blue/15 to-accent-cyan/20 backdrop-blur-md rounded-3xl p-6 border border-accent-purple/30 text-center shadow-lg mx-1 mb-20">
          <div className="mb-3">
            <span className="text-5xl inline-block animate-bounce-gentle">🚀</span>
          </div>
          <h3 className="text-xl font-bold text-accent-yellow mb-3">
            {t('comingSoonMoreStories')}
          </h3>
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedCharacter && !showQuiz && selectedCharacter.images.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4">
          {/* Decorative Space Elements */}
          <div className="absolute top-4 left-4 text-3xl animate-twinkle">⭐</div>
          <div className="absolute top-10 right-4 text-3xl animate-float">🚀</div>
          <div className="absolute bottom-28 left-4 text-2xl animate-bounce-gentle">🛸</div>
          <div className="absolute bottom-4 right-4 text-3xl animate-twinkle">🌟</div>
          <div className="absolute hidden md:block md:top-1/4 right-8 text-2xl animate-float-icon">👽</div>
          
          {/* Story Container */}
          <div className="relative w-full h-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4 py-6 overflow-hidden">
            {/* Header with Character - Themed pill */}
            <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-10">
              <div className="rounded-full px-5 py-3 bg-gradient-to-r from-accent-purple/95 to-accent-blue/95 backdrop-blur-md border-2 border-accent-orange shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl bg-white/10 rounded-full w-8 h-8 flex items-center justify-center shadow-inner animate-wiggle">
                    {selectedCharacter.emoji}
                  </span>
                  <span className="text-white font-bold text-sm md:text-base tracking-wide">
                    {selectedCharacter.name}'s Story
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button - Above Image Container */}
            <button
              onClick={() => {
                setSelectedCharacter(null);
                setPageNumber(0);
                setShowCompletionPopup(false);
              }}
              className="absolute  top-40 md:top-20 right-2 md:right-60 z-10 bg-red-500 active:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200 active:scale-95 shadow-lg leading-none"
              aria-label={t('closeStory')}
            >
              ×
            </button>

            {/* Main Story Image - Touch Optimized */}
            <div className="relative w-full h-[60vh] md:h-[65vh] flex items-center justify-center mt-16 mb-6">
              {/* Image with Touch Handler */}
              <div
                className="relative inline-block max-w-full max-h-full rounded-2xl border-4 border-accent-orange shadow-2xl"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={selectedCharacter.images[pageNumber]}
                  alt={`${selectedCharacter.name} story page ${pageNumber + 1}`}
                  className="block max-w-full md:max-h-[65vh] max-h-[60vh] h-auto w-auto rounded-2xl object-contain"
                />
                
                {/* Tap Instruction */}
                {pageNumber === 0 && (
                  <div className="absolute bottom-3  left-4 transform -translate-x-1/2 bg-accent-orange/90 backdrop-blur-sm w-full text-white  py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold animate-bounce-gentle shadow-lg max-w-[calc(100%-2rem)] text-center">
                    {t('tapSwipeHint')}
                  </div>
                )}
                
                {/* Story Complete Badge */}
                {pageNumber === selectedCharacter.images.length - 1 && (
                  <div className="absolute -top-6 md:top-3 left-1/2 transform -translate-x-1/2 bg-green-500/90 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-bold animate-pulse shadow-lg  w-48 md:max-w-[calc(100%-2rem)] text-center">
                    {t('storyComplete')}
                  </div>
                )}
              </div>
            </div>

            {/* Page Indicators (Dots) - Touch Friendly */}
            <div className="absolute bottom-24 md:bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2.5 bg-black/60 backdrop-blur-md px-4 py-3 rounded-full shadow-xl max-w-[calc(100%-2rem)]">
              {selectedCharacter.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPageNumber(index)}
                  className={`transition-all duration-300 rounded-full active:scale-110 ${
                    index === pageNumber
                      ? 'w-10 h-3.5 bg-gradient-to-r from-accent-orange to-accent-yellow shadow-lg'
                      : 'w-3.5 h-3.5 bg-gray-400 active:bg-gray-300'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>

            {/* Page Number - Themed pill */}
            <div className="absolute bottom-12 md:bottom-4 left-1/2 -translate-x-1/2">
              <div className="rounded-full px-5 py-2 bg-gradient-to-r from-accent-purple/95 to-accent-blue/95 backdrop-blur-md text-white text-xs md:text-sm font-bold shadow-lg border border-white/10">
                {t('pageXofY', { current: pageNumber + 1, total: selectedCharacter.images.length })}
              </div>
            </div>

            {/* Take Quiz Button - Shows on last page (placed above pagination) */}
            {pageNumber === selectedCharacter.images.length - 1 && !showCompletionPopup && (
              <button
                onClick={() => setShowCompletionPopup(true)}
                className="absolute bottom-36 md:bottom-24 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-400 to-green-600 active:from-green-500 active:to-green-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 shadow-xl flex items-center gap-1"
              >
                <span className="text-lg">🎯</span>
                {t('takeQuizNow')}
                <span className="text-lg">✨</span>
              </button>
            )}

            {/* Complete Story Popup - Redesigned UI */}
            {pageNumber === selectedCharacter.images.length - 1 && showCompletionPopup && (
              <div className="absolute inset-0 flex items-center justify-center z-20 px-6 pb-24">
                {/* Semi-transparent backdrop */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => {}} />
                
                {/* Popup Card (new) */}
                <div className="relative max-w-[400px] w-full animate-in zoom-in duration-500">
                  <div className="rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-white/15">
                    <div className="relative p-6 text-center bg-[radial-gradient(120%_120%_at_0%_0%,rgba(148,63,231,0.95)_0%,rgba(59,130,246,0.9)_45%,rgba(16,185,129,0.85)_100%)]">
                      <div className="absolute -top-3 -right-3 text-3xl animate-twinkle">⭐</div>
                      <div className="absolute -bottom-3 -left-3 text-2xl animate-float">🌟</div>
                      <div className="text-5xl mb-2">🎉</div>
                      <div className="text-white text-2xl font-extrabold tracking-wide">{t('storyComplete')}</div>
                      <div className="text-accent-yellow text-sm font-semibold mt-1">{t('greatJobKeepLearning')}</div>
                    </div>
                    <div className="p-5 bg-space-card/90 backdrop-blur-xl">
                      {localStorage.getItem(`quiz_${selectedCharacter.id}_completed`) === 'true' ? (
                        <div className="rounded-2xl border border-white/15 bg-white/5 p-4 mb-4">
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">🔄</span>
                            <div>
                              <p className="text-white text-sm font-bold mb-1">{t('practiceMakesPerfect')}</p>
                              <p className="text-white/85 text-xs leading-relaxed">{t('practiceRetakeInfo')}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-white/15 bg-white/5 p-4 mb-4">
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">🔓</span>
                            <div>
                              <p className="text-white text-sm font-bold mb-1">{t('unlockNextStory')}</p>
                          <p className="text-white/85 text-xs leading-relaxed">{t('unlockNextStoryInfo')}</p>
                          </div>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={handleStoryComplete}
                        className={`w-full rounded-xl py-4 font-extrabold text-base shadow-xl transition-all duration-200 mb-2 flex items-center justify-center gap-2 ${
                          localStorage.getItem(`quiz_${selectedCharacter.id}_completed`) === 'true'
                            ? 'bg-gradient-to-r from-blue-400 to-blue-600 active:from-blue-500 active:to-blue-700 text-white active:scale-95'
                            : 'bg-gradient-to-r from-green-400 to-green-600 active:from-green-500 active:to-green-700 text-white active:scale-95'
                        }`}
                      >
                        {localStorage.getItem(`quiz_${selectedCharacter.id}_completed`) === 'true' ? (
                          <>
                            <span className="text-2xl">📝</span>
                            {t('practiceQuiz')}
                          </>
                        ) : (
                          <>
                            <span className="text-2xl">🎯</span>
                            {t('takeQuizUnlock')}
                            <span className="text-2xl">✨</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCharacter(null);
                          setPageNumber(0);
                          setShowCompletionPopup(false);
                        }}
                        className="w-full text-white/80 text-sm font-semibold py-2"
                      >
                        {t('maybeLater')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

           
          </div>
        </div>
      )}

      {/* Quiz Modal - Mobile Optimized */}
      {showQuiz && selectedCharacter && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/85 z-[60] p-4">
          {/* Decorative Elements */}
          <div className="absolute top-6 left-4 text-2xl animate-twinkle">🌟</div>
          <div className="absolute top-6 right-4 text-2xl animate-float">🚀</div>
          <div className="absolute bottom-6 left-4 text-2xl animate-bounce-gentle">⭐</div>
          <div className="absolute bottom-6 right-4 text-2xl animate-twinkle">✨</div>
          
          <div className="relative bg-gradient-to-br from-space-card/95 via-space-blue/95 to-accent-purple/20 backdrop-blur-xl p-0 rounded-3xl w-full max-w-[430px] shadow-2xl border-4 border-accent-orange/50 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-4 pb-3 bg-black/40 backdrop-blur-md border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl rounded-full bg-white/10 w-9 h-9 flex items-center justify-center shadow-inner">
                    {selectedCharacter?.emoji}
                  </span>
                  <div className="leading-tight">
                    <h3 className="text-lg font-extrabold text-accent-orange">
                      {localStorage.getItem(`quiz_${selectedCharacter.id}_completed`) === 'true' ? t('quizHeaderPractice') : t('quizHeaderTime')}
                    </h3>
                    <p className="text-[11px] text-text-gray">{selectedCharacter?.name}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseQuiz}
                  className="bg-red-500 active:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-200 active:scale-95 shadow-lg"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mx-5 mt-4 bg-accent-blue/20 backdrop-blur-sm border border-accent-blue/40 rounded-full px-4 py-2 mb-4 text-center">
                {localStorage.getItem(`quiz_${selectedCharacter.id}_completed`) === 'true' ? (
                <p className="text-text-light text-center text-sm font-medium">
                  {t('practiceModeMsg')}
                </p>
              ) : (
                <p className="text-text-light text-center text-sm font-medium">
                  {t('unlockByAnsweringMsg')}
                </p>
              )}
            </div>

            {/* Scrollable Questions */}
            <div className="flex-1 overflow-y-auto px-5 pb-4">
              {selectedCharacter?.quizQuestions?.map((q, idx) => {
                const state = questionStates[idx] || {};
                const isAnswered = state.answered;
                
                return (
                  <div key={q.id} className="mb-4 bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 backdrop-blur-sm rounded-2xl p-4 border border-accent-orange/30 shadow-lg">
                    <div className="flex items-start gap-2 mb-3">
                      <span className="text-lg font-bold text-accent-yellow bg-accent-orange/30 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="font-bold text-text-light text-base leading-tight">
                        {q.question}
                      </div>
                    </div>
                    
                    {/* Options */}
                    <div className="flex flex-col gap-2 ml-9">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = state.selectedAnswer === oIdx;
                        const isCorrectAnswer = oIdx === q.answer;
                        const showCorrect = isAnswered && isCorrectAnswer;
                        const showWrong = isAnswered && isSelected && !isCorrectAnswer;
                        
                        return (
                          <button
                            key={oIdx}
                            onClick={() => !isAnswered && handleQuizAnswer(idx, oIdx)}
                            disabled={isAnswered}
                            className={`flex items-center gap-2.5 p-3 rounded-xl transition-all duration-200 border text-left ${
                              showCorrect
                                ? 'bg-gradient-to-r from-green-400/25 to-green-600/25 border-green-400 shadow-lg'
                                : showWrong
                                ? 'bg-gradient-to-r from-red-400/25 to-red-600/25 border-red-400 shadow-lg'
                                : isSelected
                                ? 'bg-gradient-to-r from-accent-orange/25 to-accent-yellow/25 border-accent-orange shadow-lg'
                                : isAnswered
                                ? 'bg-space-card/30 border-accent-purple/20 opacity-50'
                                : 'bg-space-card/60 border-accent-purple/30 active:border-accent-orange/50 active:bg-space-card/70'
                            }`}
                          >
                            <span className="text-text-light text-sm font-medium flex-1">{opt}</span>
                            {showCorrect && <span className="text-lg text-green-400">✓</span>}
                            {showWrong && <span className="text-lg text-red-400">✗</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation & Coins Earned */}
                    {isAnswered && (
                      <div className="mt-4 ml-9 space-y-2">
                        {/* Coins Badge */}
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-1.5 ${
                            state.isCorrect
                              ? 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                              : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300'
                          }`}>
                            <span className="text-base text-accent-yellow"><BsCoin /></span>
                            {state.isCorrect ? t('coinsEarned', { amount: 20 }) : t('zeroCoins')}
                          </div>
                          {state.isCorrect && (
                            <span className="text-green-400 text-sm font-bold animate-bounce-gentle">
                              {t('correct')}
                            </span>
                          )}
                        </div>
                        
                        {/* Explanation */}
                        <div className="bg-accent-blue/20 border-l-4 border-accent-blue rounded-lg p-3">
                          <p className="text-text-light text-sm leading-relaxed">
                            <span className="font-bold text-accent-blue">{t('explanationLabel')} </span>
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Fixed Submit/Complete Button */}
            {!quizCompleted ? (
              <div className="px-5 pb-5">
                <button
                  onClick={handleQuizComplete}
                  className={`w-full bg-gradient-to-r from-accent-purple to-accent-blue text-white px-6 py-4 rounded-2xl font-extrabold text-lg transition-all duration-200 shadow-xl flex items-center justify-center gap-2 ${
                    questionStates.every(state => state.answered)
                      ? 'active:scale-95 animate-pulse-glow'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!questionStates.every(state => state.answered)}
                >
                  <span className="text-xl">
                    {localStorage.getItem(`quiz_${selectedCharacter.id}_completed`) === 'true' ? '📝' : '🎯'}
                  </span>
                  {localStorage.getItem(`quiz_${selectedCharacter.id}_completed`) === 'true' 
                    ? t('finishPractice', { points: totalCoinsEarned })
                    : t('completeQuiz', { coins: totalCoinsEarned })}
                  <span className="text-xl">
                    {localStorage.getItem(`quiz_${selectedCharacter.id}_completed`) === 'true' ? '🔄' : '✨'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="mx-5 mb-5 text-center bg-gradient-to-br from-space-card/60 to-accent-purple/20 backdrop-blur-sm border-2 border-green-400 rounded-3xl p-6 shadow-xl">
                <div className="text-4xl mb-3 animate-bounce-gentle">🎉</div>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {t('quizComplete')}
                </div>
                {localStorage.getItem(`quiz_${selectedCharacter.id}_newUnlock`) === 'true' ? (
                  <>
                    <div className="text-2xl font-extrabold text-accent-yellow mb-3">
                      <span className="inline-block align-middle text-accent-yellow"><BsCoin /></span> {t('coinsEarned', { amount: totalCoinsEarned })}
                    </div>
                    <div className="text-text-light text-base font-medium mb-4">
                      {totalCoinsEarned === 100 ? t('perfectExpert') : t('greatJobKeepLearning')}
                    </div>
                    <div className="text-accent-yellow text-base font-bold mb-4">
                      {t('nextCharacterUnlocked')}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xl font-bold text-text-light mb-3">
                      {t('youScoredCoins', { coins: totalCoinsEarned })}
                    </div>
                    <div className="text-accent-cyan text-base font-medium mb-4">
                      {t('practiceKeepReviewing')}
                    </div>
                    <div className="text-text-gray text-sm italic">
                      {t('coinsFirstCompletionNote')}
                    </div>
                  </>
                )}
                <button onClick={handleCloseQuiz} className="bg-gradient-to-r from-accent-purple to-accent-blue text-white px-6 py-3 rounded-xl font-extrabold transition-all duration-200 active:scale-95 mt-4">{t('continueExploring')}</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Unlock with Coins Modal - Redesigned */}
      {showUnlockModal && characterToUnlock && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/85 z-[70] p-4">
          {/* Decorative Elements */}
          <div className="absolute top-6 left-4 text-3xl animate-twinkle">🔒</div>
          <div className="absolute top-6 right-4 text-3xl animate-float text-accent-yellow"><BsCoin /></div>
          <div className="absolute bottom-6 left-4 text-3xl animate-bounce-gentle">⭐</div>
          <div className="absolute bottom-6 right-4 text-3xl animate-twinkle">✨</div>
          
          <div className="relative max-w-[400px] w-full animate-in zoom-in duration-500">
            <div className="rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-white/15">
              {/* Header */}
              <div className="relative pt-7 pb-4 px-6 text-center bg-gradient-to-br from-accent-purple/95 via-accent-blue/95 to-accent-orange/70 backdrop-blur-xl">
                <button
                  onClick={() => {
                    setShowUnlockModal(false);
                    setCharacterToUnlock(null);
                  }}
                  className="absolute top-4 right-4 bg-red-500 active:bg-red-600 text-white w-12 h-12 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-200 active:scale-95 shadow-lg z-50 focus:outline-none"
                  style={{ touchAction: 'manipulation' }}
                >
                  ×
                </button>
                <div className="text-5xl mb-1 animate-bounce-gentle">{characterToUnlock.emoji}</div>
                <h3 className="text-2xl font-extrabold text-white">{characterToUnlock.name}'s Story</h3>
                <p className="text-accent-cyan text-sm font-semibold mt-1">{characterToUnlock.description}</p>
                <div className="inline-block mt-3 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold border border-white/30">
                  {t('lockedStory')}
                </div>
              </div>
              {/* Body */}
              <div className="p-5 bg-space-card/90">
                {/* Option 1 */}
                <div className="rounded-2xl p-4 mb-4 border border-white/15 bg-accent-blue/10">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0">🎯</span>
                    <div>
                      <p className="text-white text-sm font-bold mb-1">{t('completePrevQuizFree')}</p>
                      <p className="text-white/85 text-xs leading-relaxed">{t('completePrevQuizInfo')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-white/20"></div>
                  <span className="text-white/60 text-sm font-semibold">{t('or')}</span>
                  <div className="flex-1 h-px bg-white/20"></div>
                </div>
                {/* Option 2 */}
                <div className="rounded-2xl p-4 border border-amber-300/40 bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl flex-shrink-0 text-accent-yellow"><BsCoin /></span>
                    <div>
                      <p className="text-white text-sm font-bold mb-1">{t('unlockWithCoinsTitle')} (<BsCoin className="inline text-accent-yellow" />)</p>
                      <p className="text-white/85 text-xs leading-relaxed">{t('unlockWithCoinsInfo')}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleUnlockWithCoins}
                    disabled={userCoins < 50}
                    className={`w-full px-6 py-3 rounded-2xl font-extrabold text-base transition-all duration-200 shadow-xl flex items-center justify-center gap-2 ${
                      userCoins >= 50
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 active:from-amber-500 active:to-orange-600 text-white active:scale-95'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span className="text-xl">🔓</span>
                    {t('unlockNow')} (<BsCoin className="inline text-accent-yellow" />)
                  </button>
                  <p className="text-white/80 text-xs text-center mt-2">
                    {userCoins >= 50 ? t('youHaveCoins', { coins: userCoins }) : t('needMoreCoins', { coins: 50 - userCoins })}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowUnlockModal(false);
                    setCharacterToUnlock(null);
                  }}
                  className="w-full text-white/80 text-sm font-semibold py-2 mt-2"
                >
                  {t('maybeLater')}
                </button>
              </div>
              {/* Decorative Stars */}
              <div className="absolute -top-3 -right-3 text-3xl animate-twinkle">⭐</div>
              <div className="absolute -bottom-2 -left-2 text-2xl animate-float">🌟</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesPage;
