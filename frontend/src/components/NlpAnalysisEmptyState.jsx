import React from 'react';
import PropTypes from 'prop-types';
import {
  Layers,
  Scissors,
  Filter,
  GitBranch,
} from 'lucide-react';

/**
 * NLP pipeline features showcased in the empty state
 */
const FEATURES = [
  {
    id: 'tokenization',
    icon: Scissors,
    title: 'Tokenization',
    description: 'Word & sentence boundary segmentation for granular linguistic units.',
  },
  {
    id: 'stopwords',
    icon: Filter,
    title: 'Stop-word Removal',
    description: 'Noise filtering per language to isolate semantic content words.',
  },
  {
    id: 'lemmatization',
    icon: GitBranch,
    title: 'Lemmatization',
    description: 'Root-form normalization mapping inflected words to dictionary lemmas.',
  },
];

/**
 * NlpAnalysisEmptyState Component
 *
 * Compact, dynamically-sized modern SaaS empty state for the NLP Analysis view:
 * - Dynamic Container: `max-w-md sm:max-w-lg` with fluid responsive padding (`p-5 sm:p-7 md:p-8`) to prevent oversized empty box feel.
 * - Dynamic Badge: Responsive `w-10 h-10 sm:w-12 sm:h-12` icon badge.
 * - Proportional Spacing: Balanced vertical gaps (`mb-4 sm:mb-6`) ensuring the box comfortably fits the viewport.
 * - Streamlined Feature Items: Compact soft slate items with crisp white icon badges.
 * - Brand CTA: Responsive brand indigo button (`px-6 py-2.5 sm:px-8 sm:py-3`).
 */
export default function NlpAnalysisEmptyState({ onGoToSummarizer }) {
  return (
    <div className="flex-1 min-h-0 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto w-full bg-slate-50">
      {/* 1. Dynamic Card Container */}
      <div className="w-full max-w-md sm:max-w-lg mx-auto my-auto bg-white rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-5 sm:p-7 md:p-8 flex flex-col items-center text-center transition-all duration-200">
        {/* 2. Dynamic Top Icon Badge */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-3.5 sm:mb-4 mx-auto flex-shrink-0">
          <Layers className="w-5 h-5 text-indigo-600" />
        </div>

        {/* 3. Typography */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5 sm:mb-2 tracking-tight">
          No NLP Analysis Data Yet
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs sm:max-w-sm mx-auto mb-4 sm:mb-6">
          Run a summary to unlock tokenization, stop-word removal, and lemmatization insights computed live on your source text.
        </p>

        {/* 4. Dynamic Feature List */}
        <div className="w-full flex flex-col gap-2 sm:gap-2.5 mb-5 sm:mb-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="w-full flex items-start gap-3 sm:gap-3.5 p-2.5 sm:p-3 sm:px-3.5 rounded-xl sm:rounded-2xl bg-slate-50/70 hover:bg-slate-50 transition-colors text-left border border-transparent hover:border-slate-200/60"
              >
                {/* Feature Icon Container */}
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-indigo-500 mt-0.5">
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>

                {/* Text Container */}
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                    {feature.title}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                    {feature.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. Action Button */}
        <button
          type="button"
          onClick={onGoToSummarizer}
          className="px-6 py-2.5 sm:px-8 sm:py-3 bg-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm hover:shadow focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 cursor-pointer active:scale-[0.98]"
        >
          Run a Summary
        </button>
      </div>
    </div>
  );
}

NlpAnalysisEmptyState.propTypes = {
  onGoToSummarizer: PropTypes.func.isRequired,
};
