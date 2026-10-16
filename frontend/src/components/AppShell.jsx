import React from 'react';
import PropTypes from 'prop-types';
import NavBar from './NavBar';
import Footer from './Footer';
import BottomNavBar from './BottomNavBar';

/**
 * AppShell
 *
 * Global layout shell ensuring header + main + footer always sum to exactly 100vh.
 * - Header: fixed height (h-16, flex-shrink-0)
 * - Main: flex-1 flex flex-col min-h-0 overflow-hidden
 * - Footer: fixed height (flex-shrink-0)
 * - BottomNavBar: fixed bottom nav for mobile (< 640px)
 */
export default function AppShell({
  children,
  currentView,
  setView,
  onOpenRouge,
  hasSummary,
}) {
  return (
    <div className="min-h-screen h-screen max-h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Fixed-height header */}
      <NavBar
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
