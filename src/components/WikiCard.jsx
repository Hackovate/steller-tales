import React from "react";

const WikiCard = ({
  story,
  onClick,
  isLocked = false,
  isCompleted = false,
}) => {
  return (
    <div className="px-2 mb-4">
      <div
        onClick={() => !isLocked && onClick(story)}
        className={`bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-2xl p-6 border transition-all duration-300 shadow-lg ${
          isLocked
            ? "opacity-60 cursor-not-allowed border-gray-500/30"
            : isCompleted
            ? "border-green-400/50 hover:border-green-400/70 cursor-pointer hover:scale-[1.02] hover:shadow-xl"
            : "border-accent-purple/30 hover:border-accent-orange/60 cursor-pointer hover:scale-[1.02] hover:shadow-xl"
        }`}
      >
      <div className="flex items-center gap-4">
        {/* Story Icon */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${
              isCompleted
                ? "bg-green-400/20"
                : "bg-gradient-to-br from-accent-orange/20 to-accent-yellow/20"
            }`}
          >
            <img
              src={story.thumbnail || story.image}
              alt={story.title}
              className="w-16 h-16 object-cover rounded-lg shadow-md"
            />
          </div>
          {isLocked && (
            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
              <span className="text-xl">🔒</span>
            </div>
          )}
          {isCompleted && (
            <div className="absolute -top-2 -right-2 bg-green-400 text-white rounded-full w-6 h-6 flex items-center justify-center">
              <span className="text-sm">✓</span>
            </div>
          )}
        </div>

        {/* Story Content */}
        <div className="flex-1 relative">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-text-light leading-tight">
              {story.title}
            </h3>
            {story.difficulty && (
              <span
                className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  story.difficulty === "Beginner"
                    ? "bg-green-400/20 text-green-300"
                    : story.difficulty === "Intermediate"
                    ? "bg-yellow-400/20 text-yellow-300"
                    : "bg-red-400/20 text-red-300"
                }`}
              >
                {story.difficulty}
              </span>
            )}
          </div>

          <p className="text-text-gray text-sm mb-3 leading-relaxed text-justify">
            {isLocked
              ? "Complete previous stories to unlock! ✨"
              : story.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="text-text-gray text-xs italic">
              Source: NASA
            </div>
            {!isLocked && (
              <div className="text-accent-orange text-sm font-medium">
                Read →
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default WikiCard;
