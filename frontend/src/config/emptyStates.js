import React from 'react';
import {
  BarChart3,
  ListOrdered,
  BarChart2,
  GitCompareArrows,
  Clock,
  Target,
  Scissors,
  Filter,
  GitBranch,
  TrendingUp,
  Percent,
  Highlighter,
  PieChart,
  Activity,
  Ruler,
  Columns,
  Repeat,
  Gauge,
  Database,
  Search,
  Download,
  AlignLeft,
  AlignJustify,
  Waves,
} from 'lucide-react';
import {
  RankedListMockVisual,
  ChartMockVisual,
  CompareMockVisual,
  HistoryMockVisual,
  AccuracyMockVisual,
} from '../components/EmptyState.mockVisuals';

/**
 * Per-Tab Empty State Configurations
 * Uses React.createElement to remain 100% standard ES module without JSX syntax requirements.
 */
export const emptyStates = {
  nlpAnalysis: {
    icon: BarChart3,
    accent: 'indigo',
    title: 'No NLP Analysis Data Yet',
    description:
      'Run a summary to unlock tokenization, stop-word removal, and lemmatization insights computed live on your source text.',
    preview: [
      {
        icon: Scissors,
        label: 'Tokenization',
        hint: 'Word & sentence splits',
      },
      {
        icon: Filter,
        label: 'Stop-word Removal',
        hint: 'Noise filtering per language',
      },
      {
        icon: GitBranch,
        label: 'Lemmatization',
        hint: 'Root-form normalization',
      },
    ],
  },

  sentenceScores: {
    icon: ListOrdered,
    accent: 'purple',
    title: 'No Sentence Scores Yet',
    description:
      'Run a summary to see every sentence scored, ranked, and color-coded by its contribution to the final extract.',
    preview: [
      {
        icon: TrendingUp,
        label: 'Ranked List',
        hint: 'Sentences ordered by score',
      },
      {
        icon: Percent,
        label: 'Score Breakdown',
        hint: 'Frequency, TF-IDF & hybrid weights',
      },
      {
        icon: Highlighter,
        label: 'Selected Extract',
        hint: 'Top-K sentences highlighted in-source',
      },
    ],
    mockVisual: React.createElement(RankedListMockVisual),
  },

  statsCharts: {
    icon: BarChart2,
    accent: 'blue',
    title: 'No Statistics Yet',
    description:
      'Run a summary to visualize compression ratio, sentence-length distribution, and score histograms.',
    preview: [
      {
        icon: PieChart,
        label: 'Compression',
        hint: 'Original vs. summary size',
      },
      {
        icon: Activity,
        label: 'Score Distribution',
        hint: 'Histogram of sentence scores',
      },
      {
        icon: Ruler,
        label: 'Length Stats',
        hint: 'Avg words per sentence',
      },
    ],
    mockVisual: React.createElement(ChartMockVisual),
  },

  compareMethods: {
    icon: GitCompareArrows,
    accent: 'emerald',
    title: 'Nothing to Compare Yet',
    description:
      'Run a summary, then toggle between Frequency, TF-IDF, and Hybrid to see how outputs differ side-by-side.',
    preview: [
      {
        icon: Columns,
        label: 'Side-by-Side',
        hint: 'Sentence overlap diff',
      },
      {
        icon: Repeat,
        label: 'Overlap Matrix',
        hint: 'Shared vs. unique picks',
      },
      {
        icon: Gauge,
        label: 'ROUGE Delta',
        hint: 'Which method scores higher',
      },
    ],
    mockVisual: React.createElement(CompareMockVisual),
  },

  history: {
    icon: Clock,
    accent: 'amber',
    title: 'No History Yet',
    description:
      'Your past summaries will appear here with timestamps, compression ratios, and one-click restore.',
    preview: [
      {
        icon: Database,
        label: 'Persistent',
        hint: 'SQLite-backed storage',
      },
      {
        icon: Search,
        label: 'Searchable',
        hint: 'Find by keyword or date',
      },
      {
        icon: Download,
        label: 'Exportable',
        hint: 'Download as JSON / TXT',
      },
    ],
    mockVisual: React.createElement(HistoryMockVisual),
  },

  accuracyCheck: {
    icon: Target,
    accent: 'rose',
    title: 'No Reference Summary Yet',
    description:
      'Paste a reference summary and run ROUGE-1, ROUGE-2, and ROUGE-L to measure overlap with the extracted output.',
    preview: [
      {
        icon: AlignLeft,
        label: 'ROUGE-1',
        hint: 'Unigram overlap',
      },
      {
        icon: AlignJustify,
        label: 'ROUGE-2',
        hint: 'Bigram overlap',
      },
      {
        icon: Waves,
        label: 'ROUGE-L',
        hint: 'Longest common subsequence',
      },
    ],
    mockVisual: React.createElement(AccuracyMockVisual),
  },
};

export const emptyStatesConfig = emptyStates;
export default emptyStates;
