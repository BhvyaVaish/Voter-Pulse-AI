'use client';
import dynamic from 'next/dynamic';
import { I18nProvider } from '@/lib/i18n/provider';
import { ErrorBoundary } from '@/components/error-boundary';

// Lazy-load BadgePopup since it imports framer-motion.
// This prevents framer-motion from being compiled on initial page load.
const BadgePopup = dynamic(
  () => import('@/components/badge-popup').then((m) => ({ default: m.BadgePopup })),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      <BadgePopup />
    </I18nProvider>
  );
}
