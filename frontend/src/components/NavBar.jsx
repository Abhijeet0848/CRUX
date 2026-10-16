import React from 'react';
import PropTypes from 'prop-types';
import {
  Globe,
  Sparkles,
  BarChart3,
  ListOrdered,
  Layers,
  Scale,
  History,
  Target,
  ChevronLeft,
} from 'lucide-react';

/**
 * Page titles mapping for sub-page mobile headers (< 1024px)
 */
const PAGE_TITLES = {
  workspace: 'Summarize',
  nlp_analysis: 'NLP Analysis',
  ranking: 'Sentence Scores',
  analytics: 'Stats & Charts',
  compare: 'Compare Methods',
  history: 'History',
  accuracy: 'Accuracy Check',
};

/**
 * Header (NavBar) Component
 *
 * Responsive header implementation:
 * - Mobile (< 1024px, lg:hidden):
 *   - Height: h-14 (56px), Padding: px-4, subtle bottom shadow, no borders below.
 *   - Workspace / Home view: Compact logo (w-8 h-8) + Wordmark (text-base font-semibold truncate min-w-0)
 *     on left, Accuracy Check icon button (icon-only, no label) on right.
 *   - Desktop tab bar & "Summarize" pill are completely hidden (navigation handled by bottom nav).
 *   - Sub-pages (NLP, Scores, Compare, Stats, History, Accuracy): Page-level header with
 *     Back chevron + "Back" label on left, Page Title centered, Accuracy Check icon on right.
 * - Desktop (>= 1024px, hidden lg:flex):
 *   - Height: h-16 (64px), Padding: px-4 md:px-6 lg:px-8, border-b border-slate-200.
 *   - Preserves full desktop navigation: Brand + all 7 tabs (Summarize, NLP Analysis, Sentence Scores,
 *     Stats & Charts, Compare Methods, History, Accuracy Check) with active pill and summary indicator dots.
 */
export default function Header({
  currentView,
  setView,
  onOpenRouge,
  hasSummary,
}) {
  // All 7 tabs visible on desktop (>= 1024px)
  const allTabs = [
    { id: 'workspace', label: 'Summarize', icon: Sparkles },
    { id: 'nlp_analysis', label: 'NLP Analysis', icon: Layers, requiresSummary: true },
    { id: 'ranking', label: 'Sentence Scores', icon: ListOrdered, requiresSummary: true },
    { id: 'analytics', label: 'Stats & Charts', icon: BarChart3, requiresSummary: true },
    { id: 'compare', label: 'Compare Methods', icon: Scale },
    { id: 'history', label: 'History', icon: History },
    { id: 'accuracy', label: 'Accuracy Check', icon: Target },
  ];

  const isSubPage = currentView !== 'workspace';

  const handleAccuracyClick = () => {
    if (onOpenRouge && currentView === 'workspace') {
      onOpenRouge();
    } else {
      setView('accuracy');
    }
  };

  return (
    <header className="w-full bg-white sticky top-0 z-40 shadow-xs lg:shadow-none border-b border-transparent lg:border-slate-200 flex-shrink-0">
      {/* =========================================================================
          1. MOBILE / TABLET HEADER (< 1024px, breakpoint: lg:hidden)
          - Height: h-14 (56px)
          - Padding: px-4
          - No border below; subtle bottom shadow (shadow-xs)
          ========================================================================= */}
      <div className="flex lg:hidden items-center justify-between w-full h-14 px-4 min-w-0">
        {isSubPage ? (
          /* -------------------------------------------------------------------
             1A. Sub-pages Mobile Header (< 1024px)
             - Left: Back chevron + "Back" label
             - Center: Page title (truncated if narrow)
             - Right: Accuracy-check icon button
             ------------------------------------------------------------------- */
          <div className="flex items-center justify-between w-full min-w-0">
            {/* Left: Back button returning to Summarizer workspace */}
            <button
              type="button"
              onClick={() => setView('workspace')}
              aria-label="Back to Summarize"
              className="flex items-center gap-1 text-slate-700 hover:text-indigo-600 font-medium text-sm py-1.5 px-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 flex-shrink-0 active:scale-95"
            >
              <ChevronLeft size={20} className="shrink-0 text-slate-600" />
              <span>Back</span>
            </button>

            {/* Center: Page Title */}
            <h1 className="text-base font-semibold text-slate-900 truncate text-center flex-1 px-2 min-w-0">
              {PAGE_TITLES[currentView] || 'SummaSphere'}
            </h1>

            {/* Right: Accuracy Check icon button */}
            <button
              type="button"
              onClick={handleAccuracyClick}
              aria-label="Accuracy Check"
              title="Accuracy Check (ROUGE Evaluation)"
              className={`p-2 rounded-lg transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95 ${
                currentView === 'accuracy'
                  ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
              }`}
            >
              <Target size={20} className="shrink-0" />
            </button>
          </div>
        ) : (
          /* -------------------------------------------------------------------
             1B. Main / Workspace Mobile Header (< 1024px)
             - Left: Compact logo (w-8 h-8) + Wordmark "SummaSphere" (text-base font-semibold truncate min-w-0)
             - Right: Accuracy Check icon button (icon-only, no label)
             - Desktop tab bar & "Summarize" pill completely hidden
             ------------------------------------------------------------------- */
          <div className="flex items-center justify-between w-full min-w-0">
            {/* Left: Brand with compact icon + wordmark */}
            <a
              href="#workspace"
              onClick={(e) => {
                e.preventDefault();
                setView('workspace');
              }}
              className="flex items-center gap-2 min-w-0 cursor-pointer select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
              aria-label="SummaSphere home"
            >
              {/* Compact Logo: w-8 h-8 */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-xs flex-shrink-0">
                <Globe className="w-4 h-4 text-white" />
              </div>
              {/* Wordmark: text-base font-semibold truncate min-w-0 */}
              <span className="text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate min-w-0">
                SummaSphere
              </span>
            </a>

            {/* Right: Target / Accuracy Check icon button (icon-only, no label) */}
            <button
              type="button"
              onClick={handleAccuracyClick}
              aria-label="Accuracy Check"
              title="Accuracy Check (ROUGE Evaluation)"
              className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95"
            >
              <Target size={20} className="shrink-0" />
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          2. DESKTOP NAVBAR (>= 1024px, breakpoint: hidden lg:flex)
          - Full desktop navbar exactly as-is
          - Height: h-16 (64px)
          - Padding: px-4 md:px-6 lg:px-8 max-w-screen-2xl mx-auto
          - All 7 tabs visible with active pill highlight & summary status dots
          ========================================================================= */}
      <div className="hidden lg:flex mx-auto px-4 md:px-6 lg:px-8 h-16 items-center gap-4 max-w-screen-2xl w-full min-w-0">
        {/* Desktop Brand: flex-shrink-0 */}
        <a
          href="#workspace"
          onClick={(e) => {
            e.preventDefault();
            setView('workspace');
          }}
          className="flex items-center gap-2 flex-shrink-0 mr-2 md:mr-4 lg:mr-6 cursor-pointer select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
          aria-label="SummaSphere home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
            SummaSphere
          </span>
        </a>

        {/* Desktop Nav Tabs: All 7 tabs */}
        <nav
          className="flex items-center gap-1 xl:gap-1.5 flex-1 min-w-0 overflow-x-auto scrollbar-hide py-1 pr-3"
          aria-label="Desktop Primary Navigation"
        >
          {allTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.id === 'accuracy') {
                    handleAccuracyClick();
                  } else {
                    setView(tab.id);
                  }
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap flex-shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={16} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.requiresSummary && hasSummary && (
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isActive ? 'bg-emerald-300 ring-2 ring-indigo-500' : 'bg-emerald-500'
                    }`}
                    title="Summary ready"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

Header.propTypes = {
  currentView: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
  onOpenRouge: PropTypes.func,
  hasSummary: PropTypes.bool,
};

// Re-export as NavBar for seamless backward compatibility
export { Header as NavBar };
