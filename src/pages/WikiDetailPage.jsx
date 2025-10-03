import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StarsBackground from "../components/StarsBackground";
import VisualGallery from "../components/VisualGallery";
import QuizModal from "../components/QuizModal";
import { wikiEntries } from "../data/wikiEntries";
import { useLanguage } from "../context/LanguageContext";

const WikiDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showQuiz, setShowQuiz] = useState(false);

  // Safer back navigation, especially for mobile where history may be missing
  const handleBack = React.useCallback(() => {
    try {
      const hasHistory = typeof window !== "undefined" && window.history && window.history.length > 1;
      if (hasHistory) {
        navigate(-1);
        return;
      }
    } catch {
      // no-op, will fall through to fallback route
    }
    navigate("/wiki");
  }, [navigate]);

  const handleQuizClick = () => {
    setShowQuiz(true);
  };

  const handleQuizClose = () => {
    setShowQuiz(false);
  };

  const entry = wikiEntries.find((e) => e.id === id);

  // Render "Entry Not Found"
  if (!entry) {
    return (
      <div className="mobile-container relative pb-32 md:pb-24">
        <StarsBackground />
        <div className="relative z-10 pt-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-accent-orange mb-4">
              {t('wikiEntryNotFound')}
            </h2>
            <p className="text-text-gray mb-6">
              {t('wikiEntryNotFoundDesc')}
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gradient-to-r from-accent-orange to-accent-yellow rounded-xl hover:from-accent-orange/90 hover:to-accent-yellow/90 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              {t('back')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Wiki Entry
  return (
    <div className="mobile-container relative pb-32 md:pb-24">
      <StarsBackground />

      <div className="relative z-10 pt-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <span className="text-6xl inline-block">📚</span>
          </div>
          <h1 className="text-3xl font-bold text-accent-blue mb-3 tracking-wide">
            {entry.title}
          </h1>
          {entry.category && (
            <p className="text-accent-yellow text-base leading-relaxed">
              {entry.category}
            </p>
          )}
        </div>

        {/* Hero Image */}
        {entry.image && (
          <div className="mb-8">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-accent-purple/30">
              <img
                src={entry.image}
                alt={entry.title}
                className="w-full h-48 sm:h-56 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {/* Credit badge */}
              {(entry.imageCredit || entry.imageCreditUrl) && (
                <div className="absolute bottom-3 right-3">
                  <a
                    href={entry.imageCreditUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-white/90 bg-black/40 hover:bg-black/60 transition-colors px-2 py-1 rounded-md border border-white/10"
                  >
                    {t('imageLabel')} {entry.imageCredit || "NASA"}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Back Button and Quiz Button */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gradient-to-r from-accent-orange to-accent-yellow rounded-xl hover:from-accent-orange/90 hover:to-accent-yellow/90 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            {t('back')}
          </button>
          
          {/* Quiz Button - Show for all wiki entries */}
          <button
            onClick={handleQuizClick}
            className="px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-blue rounded-xl hover:from-accent-purple/90 hover:to-accent-blue/90 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            🧠 Take Quiz
          </button>
        </div>

        {/* Description */}
        {entry.description && (
          <div className="mb-6">
            <p className="text-text-light leading-relaxed text-justify">
              {entry.description}
            </p>
          </div>
        )}

        {/* Video */}
        {entry.video && (
  <div className="mb-6">
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-accent-purple/30">
      {/\.gif$/i.test(entry.video) ? (
        // Case 1: GIF
        <img
          src={entry.video}
          alt={entry.title}
          className="w-full h-auto"
        />
      ) : /\.mp4$/i.test(entry.video) || /^\/.*\.mp4$/i.test(entry.video) ? (
        // Case 2: MP4 or local video file
        <video
          src={entry.video}
          controls
          className="w-full h-auto"
          preload="metadata"
        />
      ) : (
        // Case 3: External embed (YouTube, Vimeo, etc.)
        <div className="relative" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={entry.video}
            title={entry.title}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  </div>
)}


        {/* Sections */}
        <div className="space-y-6 mb-8">
          {entry.sections?.map((section, idx) => (
            <div key={idx}>
              <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-2xl p-6 border border-accent-purple/30 shadow-lg">
                {section.subtitle && (
                  <h2 className="text-xl font-bold text-accent-yellow mb-4">
                    {section.subtitle}
                  </h2>
                )}
                {section.image && (
                  <div className="my-4 flex justify-center">
                    <img
                      src={section.image}
                      alt={`${section.subtitle || "Section"} illustration`}
                      className="w-full max-w-[400px] h-auto rounded-xl shadow-lg border border-accent-purple/30"
                      loading="lazy"
                    />
                  </div>
                )}
                <p className="text-text-light leading-relaxed text-justify">
                  {section.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Illustrations strip */}
        {Array.isArray(entry.illustrations) &&
          entry.illustrations.length > 0 && (
            <div className="mb-8">
              <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-2xl p-6 border border-accent-purple/30 shadow-lg">
                <h3 className="text-xl font-bold text-accent-yellow mb-4">
                  {t('illustrations')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {entry.illustrations.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${entry.title} illustration ${i + 1}`}
                      className="w-full h-32 object-cover rounded-xl border border-accent-purple/30 shadow"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* Visual Gallery (NASA Images API) */}
        {entry.galleryQuery && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-2xl p-6 border border-accent-purple/30 shadow-lg">
              <VisualGallery query={entry.galleryQuery} perPage={6} />
            </div>
          </div>
        )}

        {/* Quiz Modal */}
        {showQuiz && (
          <QuizModal
            wikiId={entry.id}
            count={10}
            onClose={handleQuizClose}
            onComplete={() => {
              handleQuizClose();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default WikiDetailPage;
