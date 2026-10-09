import React from 'react';
import { Shield } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'dashboard';
  onNavigateView: (view: 'landing' | 'dashboard') => void;
  onNavigateSection?: (sectionId: string) => void;
  onBookAppointment: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateView,
  onNavigateSection,
  onBookAppointment
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <button
          onClick={() => onNavigateView('landing')}
          className="flex items-center gap-2.5 text-left text-base font-bold tracking-tight text-slate-100 hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-400 shadow-sm">
            <Shield className="h-4 w-4" />
          </div>
          <span className="font-display">Talfor Digital Forensics</span>
        </button>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <button
            onClick={() => {
              onNavigateView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigateView('landing');
              setTimeout(() => onNavigateSection?.('features'), 50);
            }}
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
          >
            Features
          </button>
          <button
            onClick={() => {
              onNavigateView('landing');
              setTimeout(() => onNavigateSection?.('workflow'), 50);
            }}
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigateView('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'dashboard' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={onBookAppointment}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 text-cyan-300 font-medium"
          >
            Book Appointment
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBookAppointment}
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Book Consultation
          </button>
          {currentView === 'landing' ? (
            <button
              onClick={() => onNavigateView('dashboard')}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              Start Investigation
            </button>
          ) : (
            <button
              onClick={() => onNavigateView('landing')}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Overview Page
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
