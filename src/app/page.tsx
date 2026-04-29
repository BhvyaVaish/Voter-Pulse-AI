'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Vote, ArrowRight, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/provider';

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const onboardingCompleted = useAppStore((s) => s.onboardingCompleted);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  useEffect(() => {
    if (mounted && onboardingCompleted) {
      router.replace('/dashboard');
    }
  }, [mounted, onboardingCompleted, router]);

  // Show loading spinner during hydration or redirect
  if (!mounted || onboardingCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-muted" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-wattle animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading Voter Pulse AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-bottle rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sage/5 rounded-full blur-3xl" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <div className="text-center animate-fadeInUp">
          {/* Logo */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-bottle-light to-bottle flex items-center justify-center shadow-lg shadow-bottle animate-scaleIn">
            <Vote className="w-12 h-12 text-white" />
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
            Voter Pulse <span className="text-wattle">AI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-2">{t('app.subtitle')}</p>
          <p className="text-sm text-muted-foreground/70 max-w-md mx-auto mb-10">{t('app.tagline')}</p>

          <button
            onClick={() => router.push('/onboarding')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-bottle-light to-bottle text-white font-bold text-lg shadow-lg shadow-bottle hover:shadow-xl hover:shadow-bottle hover:scale-[1.03] active:scale-[0.98] transition-all animate-fadeInUpDelay"
            aria-label="Start My Civic Journey"
          >
            Start My Civic Journey
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-16 flex flex-col items-center text-muted-foreground/50 animate-fadeInUpLate">
          <span className="text-xs mb-1">Powered by ECI Data</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </main>
    </div>
  );
}
