import React from 'react';
import PropTypes from 'prop-types';
import {
  Sparkles,
  Layers,
  ListOrdered,
  Scale,
  History,
} from 'lucide-react';

/**
 * BottomNavBar (BottomNav)
 *
 * Mobile-only bottom navigation bar:
 * Breakpoint strategy:
 * - Mobile (< 640px): fixed bottom-0 left-0 right-0 z-50 bg-white border-t
 *   flex items-center justify-around h-16 safe-area-inset-bottom.
 *   Provides intuitive one-thumb navigation for the 5 primary views.
 * - Tablet & Desktop (>= 640px): sm:hidden (completely hidden).
 *   Tablets and desktops utilize the top navigation bar instead.
 */
export default function BottomNavBar({
  currentView,
  setView,
  hasSummary,
}) {
  const navItems = [
    {
      id: 'workspace',
      label: 'Home',
      icon: Sparkles,
      tooltip: 'Summarizer Studio',
    },
    {
      id: 'nlp_analysis',
      label: 'NLP',
      icon: Layers,
      requiresSummary: true,
      tooltip: 'NLP Tokenization & Lemmatization',
    },
    {
      id: 'ranking',
      label: 'Scores',
      icon: ListOrdered,
      requiresSummary: true,
      tooltip: 'Sentence Scoring & Ranking',
    },
    {
      id: 'compare',
      label: 'Compare',
      icon: Scale,
      tooltip: 'Multi-Algorithm Comparison',
    },
    {
      id: 'history',
      label: 'History',
      icon: History,
      tooltip: 'Saved Summaries',
    },
  ];

  return (
    /* 
      Bottom Navigation Container:
      - Mobile (< 640px): fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around h-16 safe-area-inset-bottom
      - Tablet & Desktop (>= 640px): sm:hidden
    */
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around h-16 px-1 safe-area-inset-bottom sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Mobile Bottom Navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        const isScores = item.id === 'ranking';

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setView(item.id)}
            title={item.tooltip}
            aria-label={item.tooltip}
            aria-current={isActive ? 'page' : undefined}
            /* Each nav item: flex flex-col items-center justify-center gap-1 text-xs */
            className={`flex flex-col items-center justify-center gap-1 text-xs flex-1 py-1 px-1 transition-colors duration-150 cursor-pointer select-none active:scale-95 ${
              isActive
                ? isScores
                  ? 'text-purple-600 font-bold'
                  : 'text-indigo-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive
                    ? isScores
                      ? 'scale-110 text-purple-600 stroke-[2.4]'
                      : 'scale-110 text-indigo-600 stroke-[2.4]'
                    : 'text-slate-500 stroke-[1.8]'
                }`}
              />

              {/* Ready indicator dot if summary is available */}
              {item.requiresSummary && hasSummary && !isActive && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse"
                  title="Data ready"
                />
              )}
            </div>

            <span
              className={`text-[10px] sm:text-xs leading-none tracking-tight ${
                isActive
                  ? isScores
                    ? 'text-purple-700 font-bold'
                    : 'text-indigo-700 font-bold'
                  : 'text-slate-600 font-medium'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

BottomNavBar.propTypes = {
  currentView: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
  hasSummary: PropTypes.bool,
};

// Re-export as BottomNav for deliverable compliance
export { BottomNavBar as BottomNav };
