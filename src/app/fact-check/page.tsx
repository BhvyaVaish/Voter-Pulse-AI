'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Scale, GraduationCap, AlertTriangle, IndianRupee, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/provider';
import { useAppStore } from '@/lib/store';
import { mockCandidateProfiles, formatINR } from '@/lib/data';

function WealthTreemap({ assets }: { assets: { movable: number; immovable: number; total: number } }) {
  const total = assets.total || 1;
  const movPct = Math.max((assets.movable / total) * 100, 15);
  const immPct = Math.max((assets.immovable / total) * 100, 15);

  return (
    <div className="flex gap-1 h-16 rounded-lg overflow-hidden">
      <div className="treemap-block bg-blue-500" style={{ width: `${movPct}%` }}>
        <div><div className="text-[9px] opacity-75">Movable</div><div className="text-xs">{formatINR(assets.movable)}</div></div>
      </div>
      <div className="treemap-block bg-sage-600" style={{ width: `${immPct}%` }}>
        <div><div className="text-[9px] opacity-75">Immovable</div><div className="text-xs">{formatINR(assets.immovable)}</div></div>
      </div>
    </div>
  );
}

export default function FactCheckPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { completeStep } = useAppStore();
  const [selected, setSelected] = useState<number[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleSelect = (id: number) => {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : s.length < 3 ? [...s, id] : s);
  };
  const selectedProfiles = mockCandidateProfiles.filter((c) => selected.includes(c.id));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <button onClick={() => { completeStep('fact-check'); completeStep('candidate-kyc'); router.back(); }}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="text-center mb-8">
        <h1 className="font-heading text-2xl font-bold">{t('factCheck.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('factCheck.subtitle')}</p>
      </div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {mockCandidateProfiles.map((c, i) => {
          const isCrorepati = c.assets.total > 10000000;
          const hasCriminal = c.criminalCases > 0;
          const isGrad = c.education.includes('MBA') || c.education.includes('LLB') || c.education.includes('PhD') || c.education.includes('B.Tech') || c.education.includes('MA');
          const isExpanded = expandedId === c.id;

          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card overflow-hidden transition-all ${selected.includes(c.id) ? 'ring-2 ring-bottle' : ''}`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bottle-light/20 to-bottle/20 flex items-center justify-center text-lg font-bold">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm">{c.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{c.party}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSelect(c.id)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                      selected.includes(c.id) ? 'bg-bottle text-white' : 'bg-muted text-muted-foreground hover:bg-bottle'
                    }`}
                  >
                    {selected.includes(c.id) ? '✓' : t('factCheck.compare')}
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {isCrorepati && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold">
                      <IndianRupee className="w-2.5 h-2.5" /> {t('factCheck.crorepati')}
                    </span>
                  )}
                  {hasCriminal ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold">
                      <AlertTriangle className="w-2.5 h-2.5" /> {c.criminalCases} {t('factCheck.cases')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold">
                      ✓ {t('factCheck.clean')}
                    </span>
                  )}
                  {isGrad && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold">
                      <GraduationCap className="w-2.5 h-2.5" /> Graduate+
                    </span>
                  )}
                </div>

                <WealthTreemap assets={c.assets} />

                <button
                  onClick={() => setExpandedId(isExpanded ? null : c.id)}
                  className="w-full mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {isExpanded ? 'Less' : 'More Details'}
                </button>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-muted-foreground">Age:</span> <span className="font-medium">{c.age}</span></div>
                        <div><span className="text-muted-foreground">Education:</span> <span className="font-medium">{c.education}</span></div>
                        <div><span className="text-muted-foreground">Profession:</span> <span className="font-medium">{c.profession}</span></div>
                        <div><span className="text-muted-foreground">Liabilities:</span> <span className="font-medium">{formatINR(c.liabilities)}</span></div>
                      </div>
                      {c.criminalDetails.length > 0 && (
                        <div>
                          <p className="text-[10px] text-red-500 font-bold mb-1">Criminal Cases:</p>
                          {c.criminalDetails.map((d, j) => (
                            <p key={j} className="text-[10px] text-muted-foreground">• {d}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Panel */}
      <AnimatePresence>
        {selectedProfiles.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold">Candidate Comparison</h2>
              <button onClick={() => setSelected([])} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium text-xs">Metric</th>
                    {selectedProfiles.map((c) => (
                      <th key={c.id} className="text-left py-2 font-heading font-bold text-xs">{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Total Assets', fn: (c: typeof selectedProfiles[0]) => formatINR(c.assets.total) },
                    { label: 'Liabilities', fn: (c: typeof selectedProfiles[0]) => formatINR(c.liabilities) },
                    { label: 'Criminal Cases', fn: (c: typeof selectedProfiles[0]) => c.criminalCases === 0 ? 'None' : `${c.criminalCases} cases` },
                    { label: 'Education', fn: (c: typeof selectedProfiles[0]) => c.education },
                    { label: 'Age', fn: (c: typeof selectedProfiles[0]) => String(c.age) },
                    { label: 'Profession', fn: (c: typeof selectedProfiles[0]) => c.profession },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-border/50">
                      <td className="py-2 text-muted-foreground text-xs">{row.label}</td>
                      {selectedProfiles.map((c) => (
                        <td key={c.id} className="py-2 text-xs font-medium">{row.fn(c)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
