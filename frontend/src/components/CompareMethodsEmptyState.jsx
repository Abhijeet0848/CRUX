import React from 'react';
import PropTypes from 'prop-types';
import {
  Scale,
  Columns,
  Repeat,
  Gauge,
  RefreshCw,
} from 'lucide-react';
import EmptyState from './EmptyState';

/**
 * CompareMethodsEmptyState
 *
 * Mobile-first empty state for the "Compare Methods" view when no summary has been run.
 * Shares the unified pattern of sibling NLP Analysis and Sentence Scores empty states
 * (icon badge → title → description → feature list → CTA button).
 *
 * Breakpoint strategy:
 * - Mobile (< 640px):
 *   - Container: pt-4 px-4 pb-24 (pb-24 clears the fixed bottom navigation bar)
 *   - Card: w-full p-6 text-center (no hardcoded narrow max-w-md)
 *   - Central icon badge: w-14 h-14 bg-emerald-50 with w-7 h-7 text-emerald-500
 *   - Typography: title text-lg, description text-sm
 *   - Feature cards: full-width flex-col gap-3, each p-4 with w-9 h-9 icon and text-sm
 *   - Warning banner: restructured above card, dismissible with localStorage persistence
 *   - CTA button: full-width (w-full), text-only "Add an Article to Compare"
 * - Tablet (640px - 1023px):
 *   - Container: sm:pt-6 sm:px-6
 *   - Card: sm:p-8
 *   - Central icon badge: sm:w-16 sm:h-16 with sm:w-8 sm:h-8 icon
 *   - Typography: title sm:text-xl, description sm:text-base
 *   - CTA button: sm:w-auto
 * - Desktop (>= 1024px):
 *   - Container: lg:pt-8 max-w-2xl mx-auto
 *   - Centered layout with generous spacing
 */
export default function CompareMethodsEmptyState({
  onGoToSummarizer,
  showHeader = false,
  showBottomNav = false,
  currentView = 'compare',
  setView,
  showBanner = true,
}) {
  const features = [
    {
      id: 'side_by_side',
      icon: Columns,
      title: 'Side-by-Side View',
      subtitle: 'Sentence overlap diff showing matching and divergent summary selections.',
    },
    {
      id: 'overlap_matrix',
      icon: Repeat,
      title: 'Overlap Matrix',
      subtitle: 'Quantify shared versus unique sentence picks across all three models.',
    },
    {
      id: 'rouge_delta',
      icon: Gauge,
      title: 'ROUGE Delta',
      subtitle: 'Benchmark precision, recall, and F1-score relative to reference summaries.',
    },
    {
      id: 'dynamic_compare',
      icon: RefreshCw,
      title: 'Dynamic Adjustment',
      subtitle: 'Instantly re-score and switch sentence length thresholds on the fly.',
    },
  ];

  // Restructured warning banner above card, dismissible, persistent in localStorage
  const bannerConfig = showBanner
    ? {
        dismissKey: 'summasphere_compare_banner_dismissed',
        message: 'Add an article in the Summarizer Studio to run a 3-way algorithm comparison.',
        linkText: 'Summarizer Studio',
        linkAction: onGoToSummarizer,
      }
    : null;

  return (
    <EmptyState
      icon={Scale}
      iconColor="emerald"
      accent="emerald"
      title="Compare All 3 Summarization Methods"
      description="See summaries created by Word Frequency, Key Words (TF-IDF), and Combined (Hybrid) side-by-side."
      features={features}
      ctaLabel="Add an Article to Compare"
      ctaAction={onGoToSummarizer}
      secondaryLabel="Go to Summarize"
      onSecondary={onGoToSummarizer}
      banner={bannerConfig}
      showHeader={showHeader}
      showBottomNav={showBottomNav}
      currentView={currentView}
      setView={setView}
    />
  );
}

CompareMethodsEmptyState.propTypes = {
  onGoToSummarizer: PropTypes.func.isRequired,
  showHeader: PropTypes.bool,
  showBottomNav: PropTypes.bool,
  currentView: PropTypes.string,
  setView: PropTypes.func,
  showBanner: PropTypes.bool,
};
