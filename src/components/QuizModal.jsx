import React, { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { generateQuizSession } from '../data/spaceWeatherQuiz';

const QuizModal = ({ onClose, level = 'basic', count = 12, onComplete }) => {
  const { t } = useLanguage();
  const [questions] = useState(() => {
    const qs = generateQuizSession(level, count);
    // Shuffle options per question and remap correct answer index
    return qs.map((q) => {
      const pairs = q.options.map((opt, idx) => ({ opt, idx }));
      for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
      }
      const options = pairs.map((p) => p.opt);
      const a = pairs.findIndex((p) => p.idx === q.a);
      return { ...q, options, a };
    });
  });
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null);

  const question = questions[qIdx];

  const total = questions.length;
  const currentNumber = useMemo(() => qIdx + 1, [qIdx]);

  const select = (i) => {
    if (answered !== null) return;
    setAnswered(i);
    if (i === question.a) setScore((s) => s + 1);
  };

  const next = () => {
    if (answered === null) return;
    const nextQIdx = qIdx + 1;
    if (nextQIdx < total) {
      setQIdx(nextQIdx);
      setAnswered(null);
      return;
    }
    onComplete && onComplete({ level, score, total });
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#16213e]/95 to-[#1a1a2e]/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-accent-purple/30 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-accent-blue">{t('spaceWeatherQuiz')}</h3>
          <button onClick={onClose} className="text-text-gray hover:text-text-light text-2xl">×</button>
        </div>
        <div className="text-xs text-text-gray mb-2">{t('level')} {level} • {t('question')} {currentNumber} / {total} • {t('score')} {score}</div>
        <div className="text-text-light font-semibold mb-3">{question.q}</div>
        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.a;
            const isSelected = answered === i;
            const color = answered === null ? 'border-accent-purple/30' : isCorrect ? 'border-accent-blue text-accent-blue' : isSelected ? 'border-accent-orange text-accent-orange' : 'border-accent-purple/20 text-text-gray';
            return (
              <button key={i} onClick={() => select(i)} className={`w-full text-left px-3 py-2 rounded-xl bg-space-card/50 border ${color}`}>
                {opt}
              </button>
            );
          })}
        </div>
        {answered !== null && (
          <div className="mt-3 text-sm text-text-light/90">
            {question.explain}
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button onClick={next} className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white">
            {currentNumber === total ? t('finish') : t('next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;


