import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Target,
  AlertCircle,
  X,
} from 'lucide-react';
import BottomNavBar from './BottomNavBar';

/**
 * ACCENT Color Tokens Map
 * Supports indigo, purple, emerald, blue, amber, and rose themes.
 */
const ACCENT = {
  indigo: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-100/80',
    text: 'text-indigo-500',
    btnBg: 'bg-indigo-600 hover:bg-indigo-700',
    focusRing: 'focus-visible:ring-indigo-500',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-100/80',
    text: 'text-purple-500',
    btnBg: 'bg-indigo-600 hover:bg-indigo-700', // unified CTA brand color
    focusRing: 'focus-visible:ring-indigo-500',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100/80',
    text: 'text-emerald-500',
    btnBg: 'bg-indigo-600 hover:bg-indigo-700',
    focusRing: 'focus-visible:ring-indigo-500',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-100/80',
    text: 'text-blue-500',
    btnBg: 'bg-indigo-600 hover:bg-indigo-700',
    focusRing: 'focus-visible:ring-indigo-500',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-100/80',
    text: 'text-amber-500',
    btnBg: 'bg-indigo-600 hover:bg-indigo-700',
    focusRing: 'focus-visible:ring-indigo-500',
  },
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-100/80',
    text: 'text-rose-500',
    btnBg: 'bg-indigo-600 hover:bg-indigo-700',
    focusRing: 'focus-visible:ring-indigo-500',
  },
};

/**
 * Shared EmptyState Component
 *
 * Universal, mobile-first empty state component used across:
 * - NLP Analysis
 * - Sentence Scores
 * - Compare Methods
 * - History & Accuracy
 *
 * Guarantees visual consistency with identical container widths (max-w-2xl),
 * top padding scale (pt-4 sm:pt-6 lg:pt-8), bottom nav clearance (pb-24),
 * balanced icon badges, and text-only CTA buttons.
 */
export default function EmptyState({
  icon: Icon = Sparkles,
  iconColor,
  accent = 'indigo',
  title,
  description,
  preview,
  features,
  ctaLabel,
  ctaAction,
  onPrimary,
  secondaryLabel = 'Go to Summarize',
  onSecondary,
  banner,
  showHeader = false,
  showBottomNav = false,
  currentView = 'workspace',
  setView,
}) {
  const chosenAccent = iconColor || accent;
  const theme = ACCENT[chosenAccent] || ACCENT.indigo;
  const handlePrimary = ctaAction || onPrimary;
  const buttonText = ctaLabel || 'Run a Summary';

  // Banner dismissal state with optional localStorage persistence
  const bannerDismissKey = banner?.dismissKey;
  const [isBannerDismissed, setIsBannerDismissed] = useState(() => {
    if (bannerDismissKey && typeof window !== 'undefined') {
      try {
        return localStorage.getItem(bannerDismissKey) === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });

  const handleDismissBanner = () => {
    setIsBannerDismissed(true);
    if (bannerDismissKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(bannerDismissKey, 'true');
      } catch {
        // ignore localStorage access errors
      }
    }
    if (banner?.onDismiss) {
      banner.onDismiss();
    }
  };

  // Resolve feature cards (supports explicit features array or legacy preview objects)
  const resolvedFeatures = features || (Array.isArray(preview) ? preview.map(p => ({
    id: p.label || p.title,
    icon: p.icon,
    title: p.label || p.title,
    subtitle: p.hint || p.subtitle,
  })) : []);

  // Resolve visual preview element if custom node is provided
  const resolvedPreview = !Array.isArray(preview) ? preview : null;

  return (
    /* 
      1. Page Container (mobile-first):
      - Mobile (< 640px): w-full min-h-screen flex flex-col bg-gray-50
      - Tablet & Desktop (>= 640px): bg-gray-50
    */
    <div className="w-full min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* 
        Optional Sub-Page Header Variant:
        Shows back chevron on the left, centered page title, and right icon button
      */}
      {showHeader && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs flex-shrink-0 w-full">
          <div className="w-full max-w-2xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
            {handlePrimary && (
              <button
                type="button"
                onClick={handlePrimary}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 p-1.5 -ml-1 rounded-xl active:bg-gray-100 cursor-pointer transition-colors"
                aria-label="Back to Summarize"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 shrink-0" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate tracking-tight text-center flex-1">
              {title}
            </h1>

            <div className="flex items-center gap-1.5">
              {handlePrimary && (
                <button
                  type="button"
                  onClick={handlePrimary}
                  title="Summarizer Studio"
                  aria-label="Summarizer Studio"
                  className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Target className="w-4 h-4 text-indigo-600 sm:hidden" />
                  <span className="hidden sm:inline">Summarize</span>
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* 
        Main Content Wrapper:
        - Mobile (< 640px): flex-1 px-4 pt-4 pb-24 max-w-2xl mx-auto w-full (pt-4 top padding, no excessive whitespace)
        - Tablet (640px - 1023px): sm:px-6 sm:pt-6
        - Desktop (>= 1024px): lg:pt-8
      */}
      <main className="flex-1 px-4 pt-4 pb-24 sm:px-6 sm:pt-6 lg:pt-8 max-w-2xl mx-auto w-full flex flex-col">
        {/* 
          2. Restructured Warning Banner (rendered above card, dismissible, tight against text):
        */}
        {banner && !isBannerDismissed && (
          <div
            role="alert"
            className="w-full flex items-start gap-3 p-3 sm:p-4 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-left animate-in fade-in duration-150"
          >
            <AlertCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-amber-600" />
            <div className="flex-1 min-w-0 text-sm leading-snug">
              {typeof banner === 'string' ? (
                <span>{banner}</span>
              ) : banner.message ? (
                <div>
                  <span>{banner.message}</span>
                  {banner.linkText && banner.linkAction && (
                    <button
                      type="button"
                      onClick={banner.linkAction}
                      className="ml-1.5 font-bold underline hover:text-amber-950 cursor-pointer inline"
                    >
                      {banner.linkText}
                    </button>
                  )}
                </div>
              ) : (
                banner
              )}
            </div>
            <button
              type="button"
              onClick={handleDismissBanner}
              className="flex-shrink-0 w-6 h-6 rounded-md hover:bg-amber-100 flex items-center justify-center text-amber-700 transition-colors cursor-pointer"
              aria-label="Dismiss warning"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 
          3. Empty-State Card:
          - Mobile (< 640px): w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center
          - Tablet & Desktop (>= 640px): sm:p-8
          - Fills max-w-2xl parent container with no hardcoded narrow max-w
        */}
        <div
          role="region"
          aria-label={title}
          className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center transition-all"
        >
          {/* Central Icon Badge: w-14 h-14 on mobile, w-16 h-16 on sm+ */}
          {Icon && (
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${theme.bg} border ${theme.border} flex items-center justify-center mx-auto mb-4 shadow-2xs`}
            >
              <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${theme.text}`} />
            </div>
          )}

          {/* Title: text-lg on mobile, sm:text-xl */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 tracking-tight">
            {title}
          </h2>

          {/* Description: text-sm on mobile, sm:text-base with relaxed leading */}
          {description && (
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-md mx-auto">
              {description}
            </p>
          )}

          {/* Optional Visual Preview (Rendered above feature cards) */}
          {resolvedPreview && (
            <div className="w-full flex justify-center">
              {typeof resolvedPreview === 'function'
                ? React.createElement(resolvedPreview)
                : resolvedPreview}
            </div>
          )}

          {/* 
            4. Feature List Cards:
            - flex flex-col gap-3 mt-6 w-full
            - Each card: w-full flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100
          */}
          {resolvedFeatures.length > 0 && (
            <div className="flex flex-col gap-3 mt-6 w-full">
              {resolvedFeatures.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.id || idx}
                    className="w-full flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition-colors text-left"
                  >
                    {ItemIcon && (
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-lg ${theme.bg} border ${theme.border} flex items-center justify-center ${theme.text}`}
                      >
                        <ItemIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 text-left">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 leading-snug">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-relaxed">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 
            5. Call-to-Action:
            - Primary button: w-full sm:w-auto mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium (text-only)
            - Secondary text link
          */}
          <div className="flex flex-col items-center justify-center">
            {handlePrimary && (
              <button
                type="button"
                onClick={handlePrimary}
                className="w-full sm:w-auto mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm hover:shadow-md active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center mx-auto block focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
              >
                <span>{buttonText}</span>
              </button>
            )}

            {(onSecondary || handlePrimary) && (
              <button
                type="button"
                onClick={onSecondary || handlePrimary}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-semibold mt-3.5 transition-colors cursor-pointer"
              >
                <span>{secondaryLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* 
        Optional Bottom Navigation Bar:
        Supported if rendered standalone
      */}
      {showBottomNav && setView && (
        <BottomNavBar
          currentView={currentView}
          setView={setView}
          hasSummary={false}
        />
      )}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  iconColor: PropTypes.oneOf(['indigo', 'purple', 'emerald', 'blue', 'amber', 'rose']),
  accent: PropTypes.oneOf(['indigo', 'purple', 'emerald', 'blue', 'amber', 'rose']),
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  preview: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  features: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      icon: PropTypes.elementType,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
    })
  ),
  ctaLabel: PropTypes.string,
  ctaAction: PropTypes.func,
  onPrimary: PropTypes.func,
  secondaryLabel: PropTypes.string,
  onSecondary: PropTypes.func,
  banner: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object]),
  showHeader: PropTypes.bool,
  showBottomNav: PropTypes.bool,
  currentView: PropTypes.string,
  setView: PropTypes.func,
};
