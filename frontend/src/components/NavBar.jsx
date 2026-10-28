import React from 'react';
import PropTypes from 'prop-types';
import {
  Globe,
  Sparkles,
  Layers,
  Scale,
  History,
  Target,
  ChevronLeft,
} from 'lucide-react';

/**
 * Mobile Sub-Page Header Titles (< 1024px)
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
 * 4 Core Navigation Tabs (Left Group)
 * Clutter reduced: "Sentence Scores" and "Stats & Charts" removed from top bar
 * in favor of a clean, focused 4-tab primary navigation.
 */
const NAV_TABS = [
  { id: 'workspace', label: 'Summarize', icon: Sparkles },
  { id: 'nlp_analysis', label: 'NLP Analysis', icon: Layers, requiresSummary: true },
  { id: 'compare', label: 'Compare Methods', icon: Scale },
  { id: 'history', label: 'History', icon: History },
];

/**
 * Navbar Component (Enterprise SaaS Refactor)
 *
 * Layout Architecture:
 * 1. Container: `flex items-center w-full px-6 h-16 bg-white border-b border-gray-200`
 * 2. Left Group: Logo + 4 Nav Tabs tightly clustered with `gap-8 lg:gap-12`
 * 3. Logo Refinement: `w-8 h-8 rounded-lg bg-indigo-600` with `w-5 h-5` Globe icon + `text-lg font-bold text-gray-900`
 * 4. Active Tab Style: Premium bottom-border indicator (`border-b-2 border-indigo-600 text-indigo-600 -mb-px h-16`)
 * 5. Right Action: "Accuracy Check" pushed to far right via `ml-auto` with clean secondary outline styling
 */
export default function Navbar({
  currentView,
  setView,
  onOpenRouge,
  hasSummary,
}) {
  const isSubPage = currentView !== 'workspace';

  const handleAccuracyClick = () => {
    if (onOpenRouge && currentView === 'workspace') {
      onOpenRouge();
    } else {
      setView('accuracy');
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 flex-shrink-0">
      {/* =========================================================================
          DESKTOP NAVBAR (>= 1024px, hidden lg:flex)
          Left-grouped (Logo + Tabs) and Right-aligned Action via ml-auto
          ========================================================================= */}
      <div className="hidden lg:flex items-center w-full px-6 h-16">
        {/* Left Zone: Logo + Nav Tabs grouped together */}
        <div className="flex items-center gap-8 lg:gap-12 h-full">
          {/* Logo */}
          <a
            href="#workspace"
            onClick={(e) => {
              e.preventDefault();
              setView('workspace');
            }}
            className="flex items-center cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg transition-opacity hover:opacity-95"
            aria-label="Crux Home"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white mr-2.5 shadow-sm">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Crux
            </span>
          </a>

          {/* Primary Navigation Tabs with Bottom-Border Indicator */}
          <nav className="flex items-center gap-6 xl:gap-8 h-full" aria-label="Main Navigation">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentView === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setView(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center gap-2 h-16 border-b-2 -mb-px text-sm font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 px-1 ${
                    isActive
                      ? 'text-indigo-600 border-indigo-600'
                      : 'text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
                      isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  <span>{tab.label}</span>

                  {/* Optional indicator dot when a summary is ready */}
                  {tab.requiresSummary && hasSummary && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isActive ? 'bg-indigo-600' : 'bg-emerald-500'
                      }`}
                      title="Summary available"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action: Pushed to far right via ml-auto with subtle divider */}
        <div className="ml-auto flex items-center">
          {/* Subtle vertical divider */}
          <div className="h-6 w-px bg-gray-200 mr-4" aria-hidden="true" />

          {/* Crisp Outlined Secondary Action (Option A) */}
          <button
            type="button"
            onClick={handleAccuracyClick}
            aria-label="Accuracy Check"
            className="group flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg bg-white border border-gray-300 text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <Target className="w-4 h-4 shrink-0 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
            <span>Accuracy Check</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MOBILE / TABLET HEADER (< 1024px, lg:hidden)
          ========================================================================= */}
      <div className="flex lg:hidden items-center justify-between w-full h-14 px-4 min-w-0">
        {isSubPage ? (
          /* Sub-pages Mobile Header: Back button + Title + Accuracy Icon */
          <div className="flex items-center justify-between w-full min-w-0">
            <button
              type="button"
              onClick={() => setView('workspace')}
              aria-label="Back to Summarize"
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 font-medium text-sm py-1.5 px-2 -ml-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 flex-shrink-0 active:scale-95"
            >
              <ChevronLeft size={18} className="shrink-0 text-gray-600" />
              <span>Back</span>
            </button>

            <h1 className="text-base font-semibold text-gray-900 truncate text-center flex-1 px-2 min-w-0">
              {PAGE_TITLES[currentView] || 'Crux'}
            </h1>

            <button
              type="button"
              onClick={handleAccuracyClick}
              aria-label="Accuracy Check"
              title="Accuracy Check (ROUGE Evaluation)"
              className="p-2 rounded-lg transition-all duration-200 flex items-center justify-center flex-shrink-0 cursor-pointer bg-white border border-gray-300 text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-95"
            >
              <Target size={18} className="shrink-0" />
            </button>
          </div>
        ) : (
          /* Main / Workspace Mobile Header: Brand + Compact Outlined Secondary Button */
          <div className="flex items-center justify-between w-full min-w-0">
            <a
              href="#workspace"
              onClick={(e) => {
                e.preventDefault();
                setView('workspace');
              }}
              className="flex items-center gap-2 min-w-0 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
              aria-label="Crux Home"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-gray-900 tracking-tight">
                Crux
              </span>
            </a>

            <button
              type="button"
              onClick={handleAccuracyClick}
              aria-label="Accuracy Check"
              title="Accuracy Check (ROUGE Evaluation)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95"
            >
              <Target size={14} className="shrink-0 text-gray-500" />
              <span>Accuracy</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

Navbar.propTypes = {
  currentView: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
  onOpenRouge: PropTypes.func,
  hasSummary: PropTypes.bool,
};

// Aliased exports for compatibility
export { Navbar as Header, Navbar as NavBar };
