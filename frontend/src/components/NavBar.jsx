import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Sparkles,
  Layers,
  Scale,
  History,
  Target,
  ChevronLeft,
  Menu,
  X,
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
 */
const NAV_TABS = [
  { id: 'workspace', label: 'Summarize', icon: Sparkles },
  { id: 'nlp_analysis', label: 'NLP Analysis', icon: Layers, requiresSummary: true },
  { id: 'compare', label: 'Compare Methods', icon: Scale },
  { id: 'history', label: 'History', icon: History },
];

/**
 * Navbar Component (Fluid & Premium SaaS Navigation)
 *
 * Smooth Interactions & Architecture:
 * 1. Global Smooth Scroll: Integrated with smooth scroll on view change.
 * 2. Link Transitions: `transition-all duration-300 ease-in-out` on all interactive tabs.
 * 3. Framer Motion Sliding Active Indicator: Magic gliding `motion.div` with layoutId="activeTabIndicator".
 * 4. Mobile Menu Transition: Fluid slide-and-fade dropdown via Framer Motion AnimatePresence.
 */
export default function Navbar({
  currentView,
  setView,
  onOpenRouge,
  hasSummary,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isSubPage = currentView !== 'workspace';

  const handleAccuracyClick = () => {
    if (onOpenRouge && currentView === 'workspace') {
      onOpenRouge();
    } else {
      setView('accuracy');
    }
  };

  const handleNavClick = (tabId) => {
    setView(tabId);
    setMobileMenuOpen(false);
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
              handleNavClick('workspace');
            }}
            className="flex items-center cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg transition-opacity duration-300 hover:opacity-90"
            aria-label="Crux Home"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white mr-2.5 shadow-sm transition-transform duration-300 hover:scale-105">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Crux
            </span>
          </a>

          {/* Primary Navigation Tabs with Framer Motion Magic Sliding Indicator */}
          <nav className="flex items-center gap-1 xl:gap-2 h-full relative" aria-label="Main Navigation">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentView === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleNavClick(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative inline-flex items-center gap-2 h-16 px-3.5 text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg select-none group ${
                    isActive
                      ? 'text-indigo-600 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-all duration-300 ease-in-out ${
                      isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{tab.label}</span>

                  {/* Optional indicator dot when a summary is ready */}
                  {tab.requiresSummary && hasSummary && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 ease-in-out ${
                        isActive ? 'bg-indigo-600' : 'bg-emerald-500'
                      }`}
                      title="Summary available"
                    />
                  )}

                  {/* Option B: Framer Motion Sliding Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
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

          {/* Crisp Outlined Secondary Action */}
          <button
            type="button"
            onClick={handleAccuracyClick}
            aria-label="Accuracy Check"
            className="group flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg bg-white border border-gray-300 text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-all duration-300 ease-in-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <Target className="w-4 h-4 shrink-0 text-gray-500 group-hover:text-gray-700 transition-colors duration-300 ease-in-out" />
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
              onClick={() => handleNavClick('workspace')}
              aria-label="Back to Summarize"
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 font-medium text-sm py-1.5 px-2 -ml-2 rounded-md hover:bg-gray-100 transition-all duration-300 ease-in-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 flex-shrink-0 active:scale-95"
            >
              <ChevronLeft size={18} className="shrink-0 text-gray-600" />
              <span>Back</span>
            </button>

            <h1 className="text-base font-semibold text-gray-900 truncate text-center flex-1 px-2 min-w-0">
              {PAGE_TITLES[currentView] || 'Crux'}
            </h1>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={handleAccuracyClick}
                aria-label="Accuracy Check"
                title="Accuracy Check (ROUGE Evaluation)"
                className="p-2 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center cursor-pointer bg-white border border-gray-300 text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95"
              >
                <Target size={18} className="shrink-0" />
              </button>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 ease-in-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        ) : (
          /* Main / Workspace Mobile Header: Brand + Accuracy + Hamburger */
          <div className="flex items-center justify-between w-full min-w-0">
            <a
              href="#workspace"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('workspace');
              }}
              className="flex items-center gap-2 min-w-0 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md transition-opacity duration-300 hover:opacity-90"
              aria-label="Crux Home"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-gray-900 tracking-tight">
                Crux
              </span>
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAccuracyClick}
                aria-label="Accuracy Check"
                title="Accuracy Check (ROUGE Evaluation)"
                className="flex items-center gap-1.5 px-2 sm:px-4 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 ease-in-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95"
              >
                <Target size={14} className="shrink-0 text-gray-500" />
                <span className="hidden sm:inline">Accuracy Check</span>
              </button>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 ease-in-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MOBILE SLIDING MENU (Animated with Framer Motion AnimatePresence)
          ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden w-full border-t border-gray-200 bg-white shadow-lg overflow-hidden"
          >
            <nav className="p-3 flex flex-col gap-1" aria-label="Mobile Navigation Menu">
              {NAV_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentView === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleNavClick(tab.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors duration-300 ${
                          isActive ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                      />
                      <span>{tab.label}</span>
                    </div>

                    {tab.requiresSummary && hasSummary && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-indigo-600' : 'bg-emerald-500'
                        }`}
                        title="Summary available"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

Navbar.propTypes = {
  currentView: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
  onOpenRouge: PropTypes.func,
  hasSummary: PropTypes.bool,
};

// Aliased exports for backwards compatibility
export { Navbar as Header, Navbar as NavBar };
