import React from 'react';

const GameCard = ({ game, onClick, isLocked = false }) => {
  return (
    <div
      onClick={() => !isLocked && onClick(game)}
      className={`bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-2xl p-6 border transition-all duration-300 shadow-lg ${
        isLocked 
          ? 'opacity-60 cursor-not-allowed border-gray-500/30' 
          : 'border-accent-purple/30 hover:border-accent-blue/60 cursor-pointer hover:scale-[1.02] hover:shadow-xl'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Game Icon */}
        <div className="relative flex-shrink-0">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl bg-gradient-to-br ${
            isLocked ? 'from-gray-500/20 to-gray-600/20' : 'from-accent-blue/20 to-accent-purple/20'
          }`}>
            {game.emoji || '🎮'}
          </div>
          {isLocked && (
            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
              <span className="text-xl">🔒</span>
            </div>
          )}
        </div>
        
        {/* Game Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-light leading-tight mb-2">
            {game.title}
          </h3>
          
          <p className="text-text-gray text-sm mb-2 leading-relaxed">
            {isLocked ? 'Complete previous games to unlock! 🛡️' : game.description}
          </p>
          {game.tag === 'learning' && (
            <span className={`inline-block mb-2 px-2 py-1 rounded-lg text-xs bg-accent-blue/20 text-accent-blue`}>
              Learning
            </span>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {game.type === 'quiz' && (
                <span className="px-3 py-1 bg-accent-blue/20 text-accent-blue rounded-lg text-xs font-medium">
                  Quiz
                </span>
              )}
              {(game.type === 'action' || game.tag === 'action') && (
                <span className="px-3 py-1 bg-accent-purple/20 text-accent-purple rounded-lg text-xs font-medium">
                  Action
                </span>
              )}
            </div>
            
            {!isLocked && (
              <button className="bg-gradient-to-r from-accent-blue to-accent-purple hover:from-accent-blue/90 hover:to-accent-purple/90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02]">
                Play Now →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;