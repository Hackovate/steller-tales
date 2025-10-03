import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const QuizCompletionModal = ({ 
  isOpen, 
  onClose, 
  score, 
  total, 
  level, 
  onRetake, 
  onNextLevel, 
  hasNextLevel = false 
}) => {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 80; // 80% to pass
  const isExcellent = percentage >= 90;
  const isGood = percentage >= 80 && percentage < 90;
  const isNeedsImprovement = percentage < 80;

  const getScoreMessage = () => {
    if (isExcellent) {
      return {
        emoji: '🌟',
        title: t('excellentWork') || 'Excellent Work!',
        message: '',
        color: 'text-accent-yellow'
      };
    } else if (isGood) {
      return {
        emoji: '🎉',
        title: t('greatJob') || 'Great Job!',
        message: '',
        color: 'text-accent-blue'
      };
    } else {
      return {
        emoji: '💪',
        title: t('keepLearning') || 'Keep Learning!',
        message: '',
        color: 'text-accent-orange'
      };
    }
  };

  const scoreInfo = getScoreMessage();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-accent-purple/30 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{scoreInfo.emoji}</div>
          <h2 className={`text-2xl font-bold ${scoreInfo.color}`}>
            {scoreInfo.title}
          </h2>
        </div>

        {/* Score Display */}
        <div className="bg-space-card/50 rounded-xl p-4 mb-6 border border-accent-purple/20">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-yellow mb-2">
              {score} / {total}
            </div>
            <div className="text-lg text-text-light mb-3">
              {percentage}% {t('correct') || 'Correct'}
            </div>
            
            {/* Progress Bar */}
            <div className="bg-space-blue rounded-full h-3 overflow-hidden mb-2">
              <div 
                className={`h-full transition-all duration-1000 ${
                  isExcellent ? 'bg-gradient-to-r from-accent-yellow to-accent-orange' :
                  isGood ? 'bg-gradient-to-r from-accent-blue to-accent-purple' :
                  'bg-gradient-to-r from-accent-orange to-accent-red'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            <div className="text-xs text-text-gray">
              {t('level') || 'Level'}: {level.charAt(0).toUpperCase() + level.slice(1)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {passed ? (
            <>
              {/* Passed - Show next level option if available */}
              {hasNextLevel ? (
                <button
                  onClick={onNextLevel}
                  className="w-full bg-gradient-to-r from-accent-blue to-accent-purple hover:from-accent-blue/90 hover:to-accent-purple/90 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] shadow-lg"
                >
                  🚀 {t('nextLevel') || 'Next Level'} →
                </button>
              ) : (
                <div className="text-center text-accent-yellow font-medium mb-3">
                  🏆 {t('allLevelsComplete') || 'All levels completed!'}
                </div>
              )}
              
              <button
                onClick={onRetake}
                className="w-full bg-gradient-to-r from-accent-purple/80 to-accent-blue/80 hover:from-accent-purple hover:to-accent-blue text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg"
              >
                🔄 {t('retakeQuiz') || 'Retake Quiz'}
              </button>
            </>
          ) : (
            <>
              {/* Failed - Show retake option */}
              <button
                onClick={onRetake}
                className="w-full bg-gradient-to-r from-accent-orange to-accent-yellow hover:from-accent-orange/90 hover:to-accent-yellow/90 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] shadow-lg"
              >
                🔄 {t('tryAgain') || 'Try Again'}
              </button>
            </>
          )}
          
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg"
          >
            {t('backToGames') || 'Back to Games'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCompletionModal;
