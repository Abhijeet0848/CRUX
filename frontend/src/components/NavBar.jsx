import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
} from 'lucide-react';

/**
 * NavBar (Header)
 *
 * Responsive header implementation:
 * - Brand: Protected with flex-shrink-0, mr-4 md:mr-6, whitespace-nowrap
 * - Desktop (>= 1024px, lg breakpoint):
 *   - Shows ALL 7 tabs in desktop nav: Summarize, NLP Analysis, Sentence Scores,
 *     Stats & Charts, Compare Methods, History, Accuracy Check
 *   - "More" dropdown is completely hidden
 * - Mobile / Tablet (< 1024px):
 *   - Shows: Summarize (primary), "More ▾" dropdown (with the 5 secondary tabs),
 *     and Accuracy Check (as right-side primary action)
 */
export default function NavBar({ currentView, setView, onOpenRouge, hasSummary }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // The 5 secondary tabs grouped inside "More ▾" dropdown on < 1024px
  const secondaryItems = [
    { id: 'nlp_analysis', label: 'NLP Analysis', icon: Layers, requiresSummary: true },
    { id: 'ranking', label: 'Sentence Scores', icon: ListOrdered, requiresSummary: true },
    { id: 'analytics', label: 'Stats & Charts', icon: BarChart3, requiresSummary: true },
    { id: 'compare', label: 'Compare Methods', icon: Scale },
    { id: 'history', label: 'History', icon: History },
  ];

  const isMoreActive = secondaryItems.some((item) => item.id === currentView);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectNav = (viewId) => {
    setView(viewId);
    setIsDropdownOpen(false);
  };

  const handleAccuracyClick = () => {
    if (onOpenRouge && currentView === 'workspace') {
      onOpenRouge();
    } else {
      setView('accuracy');
    }
    setIsDropdownOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center">
        {/* 1. Brand Container — flex-shrink-0, whitespace-nowrap, mr-4 md:mr-6 */}
        <a
          href="#workspace"
          onClick={(e) => {
            e.preventDefault();
            handleSelectNav('workspace');
          }}
          className="flex items-center gap-2 flex-shrink-0 mr-4 md:mr-6 cursor-pointer select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
          aria-label="SummaSphere home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
            SummaSphere
          </span>
        </a>

        {/* 2. Desktop Full Nav (>= 1024px) — All 7 tabs visible, More dropdown hidden */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
          {allTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectNav(tab.id)}
                className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
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

        {/* 3. Mobile / Tablet Nav (< 1024px) — Summarize + More ▾ dropdown */}
        <nav className="flex lg:hidden items-center gap-1 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
          {/* Always visible "Summarize" primary button */}
          <button
            type="button"
            onClick={() => handleSelectNav('workspace')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              currentView === 'workspace'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Sparkles size={16} className="shrink-0" />
            <span>Summarize</span>
          </button>

          {/* "More ▾" Dropdown with the 5 secondary tabs */}
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                isMoreActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{isMoreActive ? (secondaryItems.find((i) => i.id === currentView)?.label || 'More') : 'More'}</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div
                role="menu"
                className="absolute left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                {secondaryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      onClick={() => handleSelectNav(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={isActive ? 'text-indigo-600' : 'text-slate-500'} />
                        <span>{item.label}</span>
                      </div>
                      {item.requiresSummary && hasSummary && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* 4. Mobile / Tablet Right-Side Action (< 1024px) — Accuracy Check */}
        <div className="flex lg:hidden items-center gap-2 flex-shrink-0 ml-2 sm:ml-4">
          <button
            type="button"
            onClick={handleAccuracyClick}
            title="Accuracy Check (ROUGE Evaluation)"
            aria-label="Accuracy Check"
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap cursor-pointer shadow-xs active:scale-95 ${
              currentView === 'accuracy'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm font-semibold'
                : 'text-slate-700 hover:text-indigo-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300'
            }`}
          >
            <Target size={16} className={`shrink-0 ${currentView === 'accuracy' ? 'text-white' : 'text-indigo-600'}`} />
            <span className="hidden sm:inline">Accuracy Check</span>
          </button>
        </div>
      </div>
    </header>
  );
}

NavBar.propTypes = {
  currentView: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
  onOpenRouge: PropTypes.func,
  hasSummary: PropTypes.bool,
};

export { NavBar as Header };
