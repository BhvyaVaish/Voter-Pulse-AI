'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, X, AlertTriangle, GraduationCap, IndianRupee, ExternalLink } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { mockCandidateProfiles, formatINR } from '@/lib/data';
import { TrustLabel } from '@/components/trust-label';

function WealthBar({ candidates: data }: { candidates: typeof mockCandidateProfiles }) {
  const maxAsset = Math.max(...data.map((c) => c.assets.total));
  return (
    <div className="glass-card p-5 mb-6">
      <h3 className="font-heading font-bold text-sm mb-3">Asset Comparison</h3>
      <div className="space-y-2">
        {data.map((c) => {
          const pct = (c.assets.total / maxAsset) * 100;
          return (
            <div key={c.id} className="flex items-center gap-3">
              <span className="text-xs font-medium w-24 truncate">{c.name}</span>
              <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-end pr-2"
                >
                  <span className="text-[9px] text-white font-bold">{formatINR(c.assets.total)}</span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CandidatesPage() {
  const router = useRouter();
  const { completeStep, earnBadge, addXP } = useAppStore();
  const [selected, setSelected] = useState<number[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<number>>(new Set());
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const badgeAwarded = useRef(false);

  const toggleSelect = (id: number) => {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : s.length < 3 ? [...s, id] : s);
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
    setViewedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (viewedIds.size >= mockCandidateProfiles.length && !badgeAwarded.current) {
      badgeAwarded.current = true;
      earnBadge('informed-citizen');
      completeStep('candidate-kyc');
      addXP(15);
    }
  }, [viewedIds.size, earnBadge, completeStep, addXP]);

  const selectedProfiles = mockCandidateProfiles.filter((c) => selected.includes(c.id));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <AnimatePresence>
        {showDisclaimer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-heading font-bold mb-3">Simulation Disclaimer</h2>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Please note that this Candidate Dashboard is a <strong>simulated demonstration</strong>. All candidate names, profiles, assets, criminal records, and political parties shown here are fictional and generated for educational purposes. 
              </p>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Any resemblance to actual persons, living or dead, or actual political parties is entirely coincidental. This platform is solely for civic education and is not intended to harm anyone&apos;s sentiments or represent real electoral data.
              </p>
              <button 
                onClick={() => setShowDisclaimer(false)}
                className="w-full py-3 rounded-xl bg-bottle text-white font-bold text-sm hover:bg-bottle-dark transition-colors"
              >
                I Understand, Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="text-center mb-4">
        <h1 className="font-heading text-2xl font-bold">Candidate Dashboard</h1>
        <p className="text-sm text-muted-foreground">Know Your Candidates — Mumbai South Constituency</p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <TrustLabel level="MOCK_DATA" />
        <a href="https://affidavit.eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 flex items-center gap-0.5 hover:underline">
          Real data at affidavit.eci.gov.in <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      <WealthBar candidates={mockCandidateProfiles} />

      {/* Candidate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {mockCandidateProfiles.map((c, i) => {
          const hasCriminal = c.criminalCases > 0;
          const isGrad = ['MBA', 'LLB', 'PhD', 'B.Tech', 'MA'].some((d) => c.education.includes(d));
          const edColor = isGrad ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : c.education.includes('Class') ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600';
          const isExpanded = expandedId === c.id;

          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card overflow-hidden ${selected.includes(c.id) ? 'ring-2 ring-bottle' : ''}`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bottle-light/20 to-bottle/20 flex items-center justify-center text-lg font-bold">{c.name.charAt(0)}</div>
                    <div>
                      <h3 className="font-heading font-bold text-sm">{c.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{c.party}</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} className="w-4 h-4 accent-wattle rounded" />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${edColor}`}>
                    <GraduationCap className="w-2.5 h-2.5 inline mr-0.5" />{isGrad ? 'Graduate+' : c.education.includes('Class') ? 'Below Grad' : 'N/A'}
                  </span>
                  {hasCriminal ? (
                    <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold">
                      <AlertTriangle className="w-2.5 h-2.5" /> {c.criminalCases} {c.criminalCases >= 3 ? 'Multiple Cases' : 'Cases Pending'}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold">✓ Clean Record</span>
                  )}
                </div>

                {/* Assets bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-0.5">
                    <span>Net Assets</span>
                    <span className="font-bold">{formatINR(c.assets.total)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${(c.assets.total / 12700000000) * 100}%` }} />
                  </div>
                </div>

                <button onClick={() => toggleExpand(c.id)} className="w-full flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2 py-1">
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {isExpanded ? 'Less' : 'View Full Profile'}
                </button>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-muted-foreground">Age:</span> <span className="font-medium">{c.age}</span></div>
                        <div><span className="text-muted-foreground">Education:</span> <span className="font-medium">{c.education}</span></div>
                        <div><span className="text-muted-foreground">Profession:</span> <span className="font-medium">{c.profession}</span></div>
                        <div><span className="text-muted-foreground">Liabilities:</span> <span className="font-medium">{formatINR(c.liabilities)}</span></div>
                      </div>
                      {c.criminalDetails.length > 0 && (
                        <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                          <p className="text-[10px] text-red-600 font-bold mb-1">Criminal Cases:</p>
                          {c.criminalDetails.map((d, j) => (<p key={j} className="text-[10px] text-red-500">• {d}</p>))}
                        </div>
                      )}
                      <p className="text-[9px] text-muted-foreground italic">Source: ECI ADR Portal (Mock)</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison */}
      <AnimatePresence>
        {selectedProfiles.length >= 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="glass-card p-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold">Side-by-Side Comparison</h2>
              <button onClick={() => setSelected([])} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium text-xs">Metric</th>
                    {selectedProfiles.map((c) => (<th key={c.id} className="text-left py-2 font-heading font-bold text-xs">{c.name}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Party', fn: (c: typeof selectedProfiles[0]) => c.party },
                    { label: 'Age', fn: (c: typeof selectedProfiles[0]) => String(c.age) },
                    { label: 'Education', fn: (c: typeof selectedProfiles[0]) => c.education },
                    { label: 'Profession', fn: (c: typeof selectedProfiles[0]) => c.profession },
                    { label: 'Total Assets', fn: (c: typeof selectedProfiles[0]) => formatINR(c.assets.total) },
                    { label: 'Liabilities', fn: (c: typeof selectedProfiles[0]) => formatINR(c.liabilities) },
                    { label: 'Criminal Cases', fn: (c: typeof selectedProfiles[0]) => c.criminalCases === 0 ? 'None' : `${c.criminalCases} cases` },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-border/50">
                      <td className="py-2 text-muted-foreground text-xs">{row.label}</td>
                      {selectedProfiles.map((c) => (<td key={c.id} className="py-2 text-xs font-medium">{row.fn(c)}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center pb-8 pt-4">
        <button 
          onClick={() => {
            completeStep('candidate-kyc');
            router.push('/journey');
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-bottle-light to-bottle text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
        >
          Mark as Complete & Continue <ExternalLink className="w-4 h-4" />
        </button>
        {viewedIds.size < mockCandidateProfiles.length && (
          <p className="text-xs text-amber-500 mt-3 font-medium">
            💡 Tip: Expand and view all candidate profiles to earn the "Informed Citizen" badge!
          </p>
        )}
      </div>
    </div>
  );
}
