'use client';
import { ShieldCheck, BadgeCheck, Lightbulb, Database, AlertTriangle } from 'lucide-react';
import type { TrustLevel } from '@/lib/store';

const trustConfig: Record<TrustLevel, { icon: typeof ShieldCheck; color: string; bg: string; label: string; tooltip: string }> = {
  OFFICIAL: { icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800', label: 'Official', tooltip: 'Source: ECI official documentation or rules' },
  VERIFIED: { icon: BadgeCheck, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800', label: 'Verified', tooltip: 'Widely confirmed across official sources' },
  EXPLANATORY: { icon: Lightbulb, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800', label: 'Explanatory', tooltip: 'Educational content simplifying official rules' },
  MOCK_DATA: { icon: Database, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700', label: 'Mock Data', tooltip: 'Fictional data for demonstration only' },
  UNCERTAIN: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', label: 'Uncertain', tooltip: 'Cannot confirm accuracy — verify at voters.eci.gov.in' },
  ECI_SOURCE: { icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800', label: 'ECI Source', tooltip: 'Based on Election Commission of India data and constitutional term calculations' },
};

/**
 * Informational Trust Label component.
 * Displays a badge indicating the source and reliability of the associated data.
 * 
 * @param {Object} props - Component props.
 * @param {TrustLevel} props.level - The trust tier (OFFICIAL, VERIFIED, etc.).
 * @param {'sm' | 'xs'} [props.size='sm'] - Visual size of the label.
 * @returns {JSX.Element} The rendered trust badge.
 */
export function TrustLabel({ level, size = 'sm' }: { level: TrustLevel; size?: 'sm' | 'xs' }) {
  const config = trustConfig[level];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${config.bg} ${size === 'xs' ? 'text-[9px]' : 'text-[10px]'} font-bold ${config.color}`}
      title={config.tooltip}
    >
      <Icon className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      {config.label}
    </span>
  );
}
