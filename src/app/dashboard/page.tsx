'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Calendar, Vote, ShieldCheck, AlertTriangle, MapPin, Route, Trophy, Zap, BarChart2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/provider';
import { getNextQualifyingDate } from '@/lib/eligibility';
import { differenceInDays, format } from 'date-fns';
import { TrustLabel } from '@/components/trust-label';

const tips = [
  "Did you know? You can register to vote at 17 years of age through an advance application — no need to wait till you turn 18!",
  "ECI qualifying dates: Jan 1, Apr 1, Jul 1, Oct 1 — register before the nearest one!",
  "VVPAT lets you verify your vote on a paper slip for 7 seconds after pressing the EVM button.",
  "Form 6 is for new registration. Form 8 is for corrections or address changes.",
  "You can report election violations anonymously using the cVIGIL app.",
];

const exploreLinks = [
  { href: '/timeline', icon: Calendar, label: 'Timeline', color: 'from-blue-600 to-indigo-800' },
  { href: '/candidates', icon: ShieldCheck, label: 'Candidates', color: 'from-purple-600 to-violet-800' },
  { href: '/simulator', icon: Vote, label: 'Simulator', color: 'from-amber-500 to-orange-700' },
  { href: '/complaint', icon: AlertTriangle, label: 'Report Issue', color: 'from-red-600 to-rose-800' },
  { href: '/polling-guide', icon: MapPin, label: 'Polling Guide', color: 'from-teal-600 to-cyan-900' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { persona, questSteps, badges, xp, level, onboardingCompleted } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !onboardingCompleted) router.replace('/');
  }, [mounted, onboardingCompleted, router]);

  if (!mounted || !onboardingCompleted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-muted" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-wattle animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const completedCount = questSteps.filter((s) => s.completed).length;
  const progress = questSteps.length ? Math.round((completedCount / questSteps.length) * 100) : 0;
  const nextStep = questSteps.find((s) => s.active && !s.completed) || questSteps.find((s) => !s.completed);
  const earnedBadges = badges.filter((b) => b.earned).length;
  const nextDate = getNextQualifyingDate();
  const daysToNext = differenceInDays(nextDate, new Date());
  const tipIndex = Math.floor(Date.now() / 10000) % tips.length;

  const personaLabel = persona === 'new-voter' ? 'New Voter Journey' : persona === 'existing-voter' ? 'Existing Voter Journey' : 'Civic Action Journey';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Badges', value: `${earnedBadges}/${badges.length}`, icon: Trophy },
          { label: 'XP Points', value: String(xp), icon: Zap },
          { label: 'Days to Qualify', value: String(daysToNext), icon: Calendar, isDateObj: true },
          { label: 'Progress', value: `${progress}%`, icon: BarChart2 },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-3 text-center transition-transform hover:-translate-y-1 relative group hover:z-50">
            <stat.icon className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="font-heading font-bold text-lg">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            {stat.isDateObj && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-3 bg-bottle-dark border border-bottle rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                <p className="text-[10px] text-wattle font-bold mb-1">Next Qualifying Date: {format(nextDate, 'dd-MM-yyyy')}</p>
                <p className="text-[9px] text-muted-foreground leading-tight">This is the ECI cutoff date (Jan 1, Apr 1, Jul 1, Oct 1) used to determine if you meet the 18-year age requirement for voter registration.</p>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-bottle-dark"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ROW 1: Where am I? */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-wattle font-bold uppercase">{personaLabel}</p>
            <h2 className="font-heading text-lg font-bold">Your Progress</h2>
          </div>
          <Link href="/journey" className="text-xs text-wattle font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View Roadmap <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-bottle-light to-bottle rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">{completedCount} of {questSteps.length} stages completed</p>
      </div>

      {/* ROW 2: What should I do next? */}
      {nextStep && (
        <div className="animate-fadeInUp">
          <Link href="/journey" className="block glass-card p-5 border-2 border-bottle hover:border-bottle transition-all group">
            <p className="text-xs text-wattle font-bold uppercase mb-2">↗ What should you do next?</p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bottle-light to-bottle-dark flex items-center justify-center flex-shrink-0">
                <Route className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-bold text-lg">{nextStep.title}</h3>
                <p className="text-sm text-muted-foreground">{nextStep.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-wattle group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      )}

      {/* ROW 3: What should I know? */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tip ticker */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-wattle" />
            <span className="text-xs font-bold text-muted-foreground uppercase">Did You Know?</span>
            <TrustLabel level="VERIFIED" size="xs" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{tips[tipIndex]}</p>
        </div>

        {/* Upcoming deadline */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-muted-foreground uppercase">Upcoming Deadline</span>
          </div>
          <p className="font-heading font-bold">{format(nextDate, 'dd-MM-yyyy')}</p>
          <p className="text-sm text-muted-foreground">Next ECI qualifying date — {daysToNext} days away</p>
        </div>
      </div>

      {/* Explore shortcuts */}
      <div>
        <h3 className="font-heading font-semibold text-sm mb-3">Explore</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {exploreLinks.map((link) => (
            <Link key={link.href} href={link.href} className="glass-card p-3 text-center hover:scale-[1.02] transition-transform">
              <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-2`}>
                <link.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
