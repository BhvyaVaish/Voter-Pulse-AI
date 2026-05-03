'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Route, MessageCircle, Compass, User, Vote, ShieldCheck,
  AlertTriangle, Calendar, Bell, ChevronLeft, ChevronRight,
  MessageSquare, Trophy, Landmark, RotateCcw
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/provider';
import { useAppStore, type Language } from '@/lib/store';

const sidebarItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/journey', icon: Route, label: 'My Journey' },
  { href: '/timeline', icon: Calendar, label: 'Timeline' },
  { href: '/elections', icon: Landmark, label: 'Elections' },
  { href: '/assistant', icon: MessageCircle, label: 'Ask AI' },
  { href: '/candidates', icon: ShieldCheck, label: 'Candidates' },
  { href: '/simulator', icon: Vote, label: 'Simulator' },
  { href: '/complaint', icon: AlertTriangle, label: 'Report Issue' },
  { href: '/reminders', icon: Bell, label: 'Reminders' },
  { href: '/profile', icon: User, label: 'My Profile' },
];

const mobileItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/journey', icon: Route, label: 'Journey' },
  { href: '/assistant', icon: MessageCircle, label: 'Ask AI' },
  { href: '/candidates', icon: Compass, label: 'Explore' },
  { href: '/profile', icon: User, label: 'Profile' },
];

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'mr', label: 'मराठी' },
];

/**
 * Universal Desktop Navigation Sidebar.
 * Provides access to all major app modules, user XP tracking, 
 * language selection, and journey reset.
 * 
 * @returns {JSX.Element} The rendered desktop sidebar.
 */
export function DesktopSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useTranslation();
  const { xp, level, badges, resetAll } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const earnedCount = badges.filter((b) => b.earned).length;

  const handleReset = () => {
    resetAll();
    setShowResetConfirm(false);
    router.push('/onboarding');
  };

  return (
    <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen border-r border-border bg-card z-40 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center gap-2">
        <div className="w-8 h-8 bg-white/95 rounded-lg flex items-center justify-center flex-shrink-0 p-1 shadow-sm relative">
          <Image src="/logo.png" alt="Voter Pulse AI" fill className="object-contain drop-shadow-sm p-1" />
        </div>
        {!collapsed && (
          <span className="font-heading font-bold text-sm">
            Voter Pulse <span className="text-wattle">AI</span>
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-bottle text-wattle' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={item.label}
              aria-label={`Navigate to ${item.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" aria-hidden="true" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* XP bar */}
      {!collapsed && (
        <div className="px-4 py-2 border-t border-border">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>{level}</span>
            <span>{xp} XP</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-bottle-light to-sage rounded-full transition-all" style={{ width: `${Math.min((xp / 600) * 100, 100)}%` }} />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-wattle" /> {earnedCount} badges</span>
          </div>
        </div>
      )}

      {/* Language + Reset + Collapse */}
      <div className="p-2 border-t border-border space-y-2">
        {!collapsed && (
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full px-2 py-1.5 rounded-lg border border-border bg-card text-xs"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        )}

        {/* Reset Journey Button */}
        <div className="relative group">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/15 hover:border-red-500/40 transition-all ${collapsed ? 'px-2' : 'px-3'}`}
              aria-label="Reset Journey"
            >
              <RotateCcw className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="text-xs font-bold">Reset Journey</span>}
            </button>
          ) : (
            <div className={`space-y-1.5 ${collapsed ? 'w-12' : ''}`}>
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> {!collapsed && 'Confirm Reset'}
              </button>
              {!collapsed && (
                <button onClick={() => setShowResetConfirm(false)} className="w-full py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
              )}
            </div>
          )}
          {/* Tooltip */}
          {!showResetConfirm && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 rounded-xl bg-bottle-dark/95 backdrop-blur-md border border-bottle-light/20 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 translate-y-1 group-hover:translate-y-0">
              <p className="text-[11px] text-white font-bold mb-1">Reset Journey</p>
              <p className="text-[10px] text-white/75 leading-relaxed">Clear all progress, badges, and XP. Return to the onboarding screen to explore a different voter path from scratch.</p>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-bottle-dark/95 border-b border-r border-bottle-light/20 rotate-45" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end">
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-muted" aria-label="Collapse sidebar">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}

/**
 * Mobile-specific Bottom Navigation Bar.
 * Optimized for thumb-reach and one-handed operation.
 * Includes a quick-access reset button for the user journey.
 * 
 * @returns {JSX.Element} The rendered mobile navigation bar.
 */
export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const resetAll = useAppStore((s) => s.resetAll);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetAll();
    setShowResetConfirm(false);
    router.push('/onboarding');
  };

  return (
    <>
      {/* Reset Confirmation Overlay (mobile) */}
      {showResetConfirm && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/50 flex items-end justify-center p-4" onClick={() => setShowResetConfirm(false)}>
          <div className="glass-card p-5 w-full max-w-sm rounded-2xl text-center mb-16" onClick={(e) => e.stopPropagation()}>
            <RotateCcw className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-heading font-bold text-sm mb-1">Reset Journey?</h3>
            <p className="text-xs text-muted-foreground mb-4">This will clear all your progress and return you to the onboarding screen to explore a different path.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium">Cancel</button>
              <button onClick={handleReset} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold">Reset</button>
            </div>
          </div>
        </div>
      )}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass-card border-t border-border">
        <div className="flex items-center justify-around py-1.5 px-2">
          {mobileItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all min-w-[56px] ${
                  isActive ? 'text-wattle' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          {/* Mobile Reset Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all min-w-[56px] text-muted-foreground hover:text-red-500"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-[10px] font-medium">Reset</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export function AskFAB() {
  const pathname = usePathname();
  if (pathname === '/assistant') return null;

  return (
    <Link
      href="/assistant"
      className="fixed bottom-20 lg:bottom-6 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-bottle-light to-bottle text-white flex items-center justify-center shadow-lg shadow-bottle hover:scale-105 transition-transform"
      aria-label="Ask Voter Pulse AI"
    >
      <MessageSquare className="w-6 h-6" />
    </Link>
  );
}
