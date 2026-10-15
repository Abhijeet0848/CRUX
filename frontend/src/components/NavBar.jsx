import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  BarChart3,
  ListOrdered,
  Layers,
  Scale,
  History,
  Target,
  ChevronDown,
} from 'lucide-react';
import logoImg from '../assets/logo.png';

/**
 * NavBar
 * Responsive top navigation bar:
 * - Full segmented tab bar on large screens (>= 1024px)
 * - Collapses secondary tabs into a "More" dropdown on smaller screens
 * - "Summarize" and "Accuracy Check" always stay visible
 * - Fully accessible with focus rings and ARIA attributes
 */
export default function NavBar({ currentView, setView, onOpenRouge, hasSummary }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const mainItem = {
    id: 'workspace',
    label: 'Summarize',
    icon: Sparkles,
  };

  const secondaryItems = [
    { id: 'nlp_analysis', label: 'NLP Analysis', shortLabel: 'NLP', icon: Layers, requiresSummary: true },
    { id: 'ranking', label: 'Sentence Scores', shortLabel: 'Scores', icon: ListOrdered, requiresSummary: true },
    { id: 'analytics', label: 'Stats & Charts', shortLabel: 'Stats', icon: BarChart3, requiresSummary: true },
    { id: 'compare', label: 'Compare Methods', shortLabel: 'Compare', icon: Scale },
    { id: 'history', label: 'History', shortLabel: 'History', icon: History },
  ];

  // Check if current active view belongs to the collapsed "More" group
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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs flex-shrink-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Left */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 group focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl focus:outline-none"
            onClick={() => handleSelectNav('workspace')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSelectNav('workspace')}
            aria-label="SummaSphere home"
          >
            <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs flex items-center justify-center p-0.5 transition-transform group-hover:scale-105">
              <img
                src={logoImg}
                alt="SummaSphere Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <h1 className="flex items-center m-0 p-0 text-base sm:text-lg font-bold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
                SummaSphere
              </span>
            </h1>
          </div>

          {/* Desktop Navigation (>= 1024px) */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 gap-1"
          >
            {/* Primary Tab: Summarize */}
            <button
              type="button"
              onClick={() => handleSelectNav(mainItem.id)}
              className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs xl:text-sm rounded-lg font-semibold transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus:outline-none ${
                currentView === mainItem.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <mainItem.icon className="w-4 h-4 shrink-0" />
              <span>{mainItem.label}</span>
            </button>

            {/* Secondary Tabs */}
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectNav(item.id)}
                  className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs xl:text-sm rounded-lg font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus:outline-none ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="hidden xl:inline">{item.label}</span>
                  <span className="inline xl:hidden">{item.shortLabel}</span>
                  {item.requiresSummary && hasSummary && (
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

          {/* Collapsed Middle Tabs (< 1024px) */}
          <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {/* Always Visible: Summarize */}
            <button
              type="button"
              onClick={() => handleSelectNav(mainItem.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-semibold transition-all cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus:outline-none ${
                currentView === mainItem.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <mainItem.icon className="w-3.5 h-3.5 shrink-0" />
              <span>{mainItem.label}</span>
            </button>

            {/* "More" Dropdown Menu */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus:outline-none ${
                  isMoreActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{isMoreActive ? secondaryItems.find((i) => i.id === currentView)?.shortLabel || 'More' : 'More'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Popover */}
              {isDropdownOpen && (
                <div
                  role="menu"
                  className="absolute left-0 sm:right-0 sm:left-auto mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
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
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg font-medium transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
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
          </div>

          {/* Right Actions: Accuracy Check (Always Visible) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (onOpenRouge) {
                  onOpenRouge();
                } else {
                  setView('accuracy');
                }
              }}
              aria-label="Accuracy Check"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus:outline-none active:scale-95 ${
                currentView === 'accuracy'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xs font-bold'
                  : 'text-slate-800 hover:text-indigo-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400'
              }`}
            >
              <Target className={`w-4 h-4 shrink-0 ${currentView === 'accuracy' ? 'text-white' : 'text-indigo-600'}`} />
              <span>Accuracy Check</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
