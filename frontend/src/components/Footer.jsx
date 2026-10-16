import React from 'react';
import PropTypes from 'prop-types';

/**
 * Footer
 *
 * Fixed-height status bar pinned at the bottom of the AppShell.
 * Mobile (< 640px) includes pb-20 clearance for floating BottomNavBar.
 */
export default function Footer({ className = '' }) {
  return (
    <footer
      className={`hidden lg:block flex-shrink-0 border-t border-slate-200/80 bg-white py-2 px-4 sm:px-6 text-center lg:text-left text-[11px] text-slate-400 font-medium ${className}`}
    >
      <p>SummaSphere v1.0.0 · Intelligent Extractive Text Summarization System</p>
    </footer>
  );
}

Footer.propTypes = {
  className: PropTypes.string,
};
