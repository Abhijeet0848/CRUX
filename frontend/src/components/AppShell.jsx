import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';
import BottomNavBar from './BottomNavBar';

/**
 * AppShell
 *
 * Global layout shell ensuring header + main + footer always fit the viewport.
 * - Header: responsive height (h-14 mobile < 1024px, h-16 desktop >= 1024px, flex-shrink-0)
 * - Main: flex-1 flex flex-col min-h-0 overflow-hidden
 * - Footer: desktop-only (hidden lg:block, flex-shrink-0)
 * - BottomNavBar: fixed bottom nav for mobile & tablet (< 1024px, lg:hidden)
 */
export default function AppShell({
  children,
  currentView,
  setView,
  onOpenRouge,
  hasSummary,
}) {
  return (
    <div className="font-sans antialiased text-gray-900 min-h-screen h-screen max-h-screen w-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Responsive Header: Minimal on < 1024px (h-14), Full on >= 1024px (h-16) */}
      <Header
        currentView={currentView}
        setView={setView}
        onOpenRouge={onOpenRouge}
        hasSummary={hasSummary}
      />

      {/* Main view container: fills remaining height without overflow */}
      <main className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden relative">
        {children}
      </main>

      {/* Fixed-height footer */}
      <Footer className="flex-shrink-0" />

      {/* Floating Sticky Bottom Navigation Bar (Visible only on mobile < 640px) */}
      <BottomNavBar
        currentView={currentView}
        setView={setView}
        onOpenRouge={onOpenRouge}
        hasSummary={hasSummary}
      />
    </div>
  );
}

AppShell.propTypes = {
  children: PropTypes.node,
  currentView: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
  onOpenRouge: PropTypes.func,
  hasSummary: PropTypes.bool,
};
