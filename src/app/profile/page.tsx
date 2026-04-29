'use client';
import { Trophy, Star, Shield, ClipboardCheck, BookOpen, Vote, Megaphone, ListChecks, Zap, CheckCircle2, Lock } from 'lucide-react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';

const badgeIcons: Record<string, typeof Trophy> = {
  'civic-starter': Star,
  'eligible-citizen': Shield,
  'registered-voter': ClipboardCheck,
  'informed-citizen': BookOpen,
  'mock-voter': Vote,
  'civic-guardian': Megaphone,
  'prepared-voter': ListChecks,
  'election-champion': Trophy,
};

const levels = [
  { name: 'Civic Beginner', minXp: 0, maxXp: 100, color: 'from-gray-400 to-gray-500' },
  { name: 'Active Citizen', minXp: 101, maxXp: 300, color: 'from-blue-400 to-blue-600' },
  { name: 'Informed Voter', minXp: 301, maxXp: 600, color: 'from-purple-400 to-purple-600' },
  { name: 'Election Champion', minXp: 601, maxXp: 1000, color: 'from-bottle-light to-yellow-500' },
];

import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export default function ProfilePage() {
  const { persona, badges, xp, level, questSteps, voteHistory, user, setUser } = useAppStore();

  const handleLogin = async () => {
    if (!auth) {
      console.error('Firebase Auth not initialized');
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;
      setUser({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const earnedBadges = badges.filter((b) => b.earned);
  const completedSteps = questSteps.filter((s) => s.completed).length;
  const totalSteps = questSteps.length;
  const currentLevel = levels.find((l) => xp >= l.minXp && xp <= l.maxXp) || levels[0];
  const nextLevel = levels[levels.indexOf(currentLevel) + 1];
  const xpProgress = nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100;

  const personaLabel = persona === 'new-voter' ? 'New Voter' : persona === 'existing-voter' ? 'Existing Voter' : 'Civic Action';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Auth Card */}
      <div className="glass-card p-6 flex items-center justify-between">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-bottle-light shadow-sm">
              <Image src={user.photoURL || ''} alt={user.displayName || 'User'} fill className="object-cover" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg leading-tight">{user.displayName}</h2>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <button onClick={handleLogout} className="text-[10px] font-bold text-red-500 hover:text-red-400 mt-1 transition-colors">Sign Out</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
            <div>
              <h2 className="font-heading font-bold text-lg leading-tight">Save Your Progress</h2>
              <p className="text-xs text-muted-foreground">Sign in with Google to backup your badges and XP.</p>
            </div>
            <button
              onClick={handleLogin}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-sm shadow-sm hover:bg-gray-50 transition-all border border-border"
            >
              <div className="relative w-4 h-4">
                <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" fill className="object-contain" />
              </div>
              Sign in with Google
            </button>
          </div>
        )}
      </div>

      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold">My Profile</h1>
        <p className="text-sm text-muted-foreground">{personaLabel} Journey</p>
      </div>

      {/* Level & XP */}
      <div className="glass-card p-6 text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${currentLevel.color} text-white text-sm font-bold mb-3`}>
          <Zap className="w-4 h-4" /> {level}
        </div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-3xl font-heading font-bold">{xp}</span>
          <span className="text-sm text-muted-foreground">XP</span>
        </div>
        <div className="max-w-xs mx-auto">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${currentLevel.color} rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            />
          </div>
          {nextLevel && (
            <p className="text-[10px] text-muted-foreground mt-1">{nextLevel.minXp - xp} XP to {nextLevel.name}</p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 text-center">
          <p className="font-heading text-2xl font-bold">{earnedBadges.length}</p>
          <p className="text-[10px] text-muted-foreground">Badges</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="font-heading text-2xl font-bold">{completedSteps}/{totalSteps}</p>
          <p className="text-[10px] text-muted-foreground">Stages</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="font-heading text-2xl font-bold">{voteHistory.length}</p>
          <p className="text-[10px] text-muted-foreground">Mock Votes</p>
        </div>
      </div>

      {/* All Badges */}
      <div>
        <h2 className="font-heading font-bold text-lg mb-4">Badges ({earnedBadges.length}/{badges.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`glass-card p-4 text-center transition-all relative group cursor-help ${
                badge.earned ? 'badge-earned' : 'opacity-40 grayscale'
              }`}
            >
              {/* Custom Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-xl bg-bottle-dark/95 backdrop-blur-md border border-bottle-light/20 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 translate-y-2 group-hover:translate-y-0 flex flex-col items-center">
                <div className="flex items-center gap-1.5 mb-1.5">
                  {badge.earned ? <CheckCircle2 className="w-3.5 h-3.5 text-wattle" /> : <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
                  <span className={`text-[10px] font-bold uppercase ${badge.earned ? 'text-wattle' : 'text-muted-foreground'}`}>
                    {badge.earned ? 'Unlocked' : 'How to unlock'}
                  </span>
                </div>
                <p className="text-[10px] text-white/90 text-center leading-tight">
                  {badge.description}
                </p>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-bottle-dark/95 border-b border-r border-bottle-light/20 rotate-45"></div>
              </div>

              <div
                className="w-14 h-14 mx-auto rounded-full flex items-center justify-center text-2xl mb-2"
                style={{ backgroundColor: badge.earned ? `${badge.color}15` : undefined }}
              >
                {(() => {
                  const Icon = badgeIcons[badge.id] || Trophy;
                  return <Icon className="w-8 h-8" style={{ color: badge.earned ? badge.color : undefined }} />;
                })()}
              </div>
              <h3 className="font-heading font-bold text-xs mb-0.5">{badge.title}</h3>
              <p className="text-[9px] text-muted-foreground">{badge.description}</p>
              {badge.earned && (
                <span className="inline-block mt-1 text-[9px] font-bold text-wattle">+{badge.xpReward} XP</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
