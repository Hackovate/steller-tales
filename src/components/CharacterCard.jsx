import React from 'react';
import { BsCoin } from 'react-icons/bs';

const CharacterCard = ({ character, unlocked, completed, onClick }) => {
  return (
    <div
      className={`relative rounded-3xl p-4 shadow-xl transition-all duration-300 flex flex-col items-center justify-center border-3 overflow-hidden active:scale-95 cursor-pointer ${
        unlocked
          ? 'active:shadow-2xl border-accent-orange bg-gradient-to-br from-accent-purple/20 via-accent-blue/15 to-accent-orange/20 backdrop-blur-md'
          : 'active:opacity-70 border-gray-600/50 bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-sm'
      } ${completed ? 'ring-4 ring-accent-blue ring-offset-2 ring-offset-space-dark' : ''}`}
      onClick={() => onClick(character)}
      style={{ minHeight: 190 }}
    >
      {/* Character Emoji */}
      <div className={`relative text-5xl mb-2 ${unlocked ? 'animate-bounce-gentle' : 'grayscale opacity-40'}`}>
        {character.emoji}
      </div>

      {/* Character Name */}
      <div className={`font-bold text-base mb-2 text-center leading-tight ${
        unlocked ? 'text-accent-orange' : 'text-gray-500'
      }`}>
        {character.name}
      </div>

      {/* Description */}
      <div className={`text-xs text-center mb-2 px-1 leading-snug ${
        unlocked ? 'text-text-light' : 'text-gray-600'
      }`}>
        {character.description}
      </div>

      {/* Story Count Badge */}
      {unlocked && character.images.length > 0 && (
        <div className="mb-2 px-2.5 py-1 bg-gradient-to-r from-accent-blue/30 to-accent-purple/30 backdrop-blur-sm text-text-light rounded-full text-xs font-semibold border border-accent-blue/50">
          📖 {character.images.length} pages
        </div>
      )}

      {/* Locked Badge - Clickable to unlock */}
      {!unlocked && (
        <div className="relative">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-full" />
          <div className="relative mt-2 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full text-xs font-bold border-2 border-amber-400 flex items-center gap-1.5 animate-pulse">
            <span className="text-sm">🔒</span>
            Tap to Unlock
            <span className="text-sm text-accent-yellow"><BsCoin /></span>
          </div>
        </div>
      )}

      {/* Completed Badge with Stars */}
      {completed && (
        <div className="relative">
          <div className="mt-2 px-3 py-1.5 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 animate-pulse-glow">
            <span className="text-sm">✨</span>
            Completed
            <span className="text-sm">🏆</span>
          </div>
        </div>
      )}

      {/* Lock Overlay with Coin Hint */}
      {!unlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-3xl pointer-events-none">
          <div className="text-5xl animate-bounce mb-2">🔒</div>
          <div className="text-xs text-amber-400 font-bold bg-black/60 px-2 py-1 rounded-full">
            50 <BsCoin className="inline text-accent-yellow" />
          </div>
        </div>
      )}

      {/* Sparkle Effect for Unlocked Cards */}
      {unlocked && (
        <div className="absolute top-2 right-2 text-lg animate-twinkle">
          ✨
        </div>
      )}
    </div>
  );
};

export default CharacterCard;
