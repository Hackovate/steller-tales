import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarsBackground from '../components/StarsBackground';
import WikiCard from '../components/WikiCard';
import { wikiEntries } from '../data/wikiEntries';
import { useLanguage } from '../context/LanguageContext';

const WikiPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleEntryClick = (entry) => {
    // Navigate to detail page with entry id
    navigate(`/wiki/${entry.id}`);
  };

  // Filter entries based on search term
  const filteredEntries = wikiEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.content && entry.content.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="mobile-container relative pb-32 md:pb-24">
      <StarsBackground />

      <div className="relative z-10 pt-6">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="mb-4">
            <span className="text-6xl inline-block hover:scale-110 transition-all cursor-pointer">📚</span>
          </div>
          <h1 className="text-3xl font-bold text-accent-blue mb-3 tracking-wide">
            {t('wikiHeaderTitle')}
          </h1>
          <p className="text-text-light text-base leading-relaxed">
            {t('wikiHeaderSubtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-in fade-in slide-in-from-left duration-500 delay-150">
          <div className="relative">
            <input
              type="text"
              placeholder={t('wikiSearchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 rounded-2xl bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md border border-accent-purple/30 text-text-light placeholder-text-gray focus:outline-none focus:border-accent-blue transition-all duration-300 shadow-lg hover:scale-[1.02]"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-gray text-xl animate-float">
              🔍
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-gray hover:text-text-light text-xl transition-colors duration-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Wiki Entries Grid */}
        <div className="mb-8">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <WikiCard
                key={entry.id}
                story={entry}
                onClick={handleEntryClick}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-accent-yellow mb-2">
                {t('wikiNoResults')}
              </h3>
              <p className="text-text-gray">
                {t('wikiTrySearching')}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default WikiPage;
