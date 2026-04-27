'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info, ShieldAlert, ArrowRight, Sun, Flower2, Wheat, Scale, Leaf, Star, X as XIcon, Vote as VoteIcon, CheckCircle2 as CheckCircle2Icon, AlertTriangle, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/provider';
import { useAppStore } from '@/lib/store';
import { candidates } from '@/lib/data';
import { playBeep, playPrint, playSuccess } from '@/lib/sounds';

type Phase = 'intro' | 'tutorial' | 'ready' | 'ballot-enabled' | 'voted' | 'vvpat' | 'done';

const IconMap: Record<string, React.ElementType> = {
  Sun, Flower2, Wheat, Scale, Leaf, Star, X: XIcon
};

export default function SimulatorPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { addVote, earnBadge, completeStep, addXP } = useAppStore();

  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeLed, setActiveLed] = useState<number | null>(null);
  const [vvpatTimer, setVvpatTimer] = useState(7);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    if (phase !== 'vvpat') return;
    if (vvpatTimer <= 0) { setPhase('done'); playSuccess(); return; }
    const id = setTimeout(() => setVvpatTimer((v) => v - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, vvpatTimer]);

  const handleVote = useCallback((candidateId: number) => {
    if (phase !== 'ballot-enabled') return;
    playBeep();
    setSelectedId(candidateId);
    setActiveLed(candidateId);
    setPhase('voted');
    setTimeout(() => {
      playPrint();
      setPhase('vvpat');
      setVvpatTimer(7);
      setTotalVotes((v) => v + 1);
      const c = candidates.find((c) => c.id === candidateId)!;
      addVote({ candidateId, candidateName: c.name, party: c.party, timestamp: new Date().toISOString() });
      earnBadge('mock-voter');
      completeStep('mock-vote');
      addXP(20);
    }, 500);
  }, [phase, addVote, earnBadge, completeStep, addXP]);

  const selectedCandidate = candidates.find((c) => c.id === selectedId);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Disclaimer Modal */}
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
                Please note that this EVM Voting Simulator is a <strong>simulated demonstration</strong>. All candidate names, symbols, and political parties shown here are completely fictional and generated for educational purposes. 
              </p>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Any resemblance to actual persons, living or dead, or actual political parties is entirely coincidental. This simulator is solely designed to educate voters on the EVM process and is not intended to harm anyone&apos;s sentiments.
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

      {/* Intro Screen */}
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <VoteIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">Practice Your Vote</h1>
            <p className="text-lg text-muted-foreground mb-4">Safe Simulation — No Real Votes Cast</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm mb-8">
              <ShieldAlert className="w-4 h-4" />
              This is a practice simulation. No real votes are cast or recorded.
            </div>
            <br />
            <button
              onClick={() => setPhase('tutorial')}
              className="mt-4 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-bottle-light to-bottle text-white font-bold text-lg shadow-lg"
            >
              Enter Polling Booth <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Tutorial */}
        {phase === 'tutorial' && (
          <motion.div key="tutorial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md mx-auto py-8">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-wattle" />
                <h2 className="font-heading font-bold text-lg">How to Vote — Step by Step</h2>
              </div>
              <ol className="space-y-3 text-sm text-muted-foreground mb-6">
                <li className="flex gap-2"><span className="font-bold text-wattle">1.</span> Officer presses &quot;Enable Ballot&quot; on the Control Unit</li>
                <li className="flex gap-2"><span className="font-bold text-wattle">2.</span> Green &quot;Ready&quot; lamp glows — machine is ready</li>
                <li className="flex gap-2"><span className="font-bold text-wattle">3.</span> Press the blue button next to your chosen candidate</li>
                <li className="flex gap-2"><span className="font-bold text-wattle">4.</span> You hear a beep — the red LED lights up next to your candidate</li>
                <li className="flex gap-2"><span className="font-bold text-wattle">5.</span> VVPAT shows your vote on a paper slip for 7 seconds</li>
                <li className="flex gap-2"><span className="font-bold text-wattle">6.</span> Slip drops into sealed box — your vote is recorded!</li>
              </ol>
              <button onClick={() => setPhase('ready')} className="w-full py-3 rounded-xl bg-gradient-to-r from-bottle-light to-bottle text-white font-bold mb-4">
                I Understand — Start Voting
              </button>
              <div className="text-center">
                <a href="https://eci.gov.in/voter/evm/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-wattle hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> Official ECI EVM Manual
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* EVM Interface */}
        {(phase === 'ready' || phase === 'ballot-enabled' || phase === 'voted' || phase === 'vvpat' || phase === 'done') && (
          <motion.div key="evm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* SIMULATION watermark */}
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 text-xs font-bold uppercase">
                <ShieldAlert className="w-3 h-3" /> Simulation Only — No Real Votes
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px_280px] gap-4">
              {/* Ballot Unit */}
              <div className="glass-card p-4 overflow-x-auto">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="font-heading font-semibold text-sm">Ballot Unit</h2>
                    <p className="text-[9px] text-muted-foreground">Mumbai South — Booth #42 — Ser. EVS/2027/001</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`led ${phase === 'ballot-enabled' ? 'ready' : ''}`} />
                    <span className="text-xs text-muted-foreground">Ready</span>
                  </div>
                </div>

                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-[40px_1fr_50px_60px] bg-muted/50 px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase">
                    <span>No.</span><span>Candidate / Party</span><span>Symbol</span><span>Vote</span>
                  </div>
                  {candidates.map((c) => (
                    <div key={c.id} className="grid grid-cols-[40px_1fr_50px_60px] items-center px-3 py-2.5 border-t border-border hover:bg-muted/30 transition-colors">
                      <span className="text-xs font-mono font-bold">{c.id}</span>
                      <div>
                        <span className="text-sm font-medium block">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground">{c.party}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center justify-center w-6 h-6">
                          {(() => {
                            const Icon = IconMap[c.symbol];
                            return Icon ? <Icon className="w-5 h-5 text-muted-foreground" /> : null;
                          })()}
                        </span>
                        <div className={`led ${activeLed === c.id ? 'active' : ''}`} />
                      </div>
                      <button
                        onClick={() => handleVote(c.id)}
                        disabled={phase !== 'ballot-enabled'}
                        className="evm-btn text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        VOTE
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Control Unit */}
              <div className="glass-card p-4 flex flex-col gap-3">
                <h2 className="font-heading font-semibold text-sm">Control Unit</h2>
                <div className="bg-bottle-dark rounded-xl p-4 flex flex-col gap-3 flex-1">
                  <div className="text-center">
                    <span className="text-[10px] text-white/50 uppercase">Total Votes</span>
                    <div className="text-3xl font-bold text-white font-mono">{String(totalVotes).padStart(3, '0')}</div>
                  </div>
                  <button
                    onClick={() => { setPhase('ballot-enabled'); setSelectedId(null); setActiveLed(null); }}
                    disabled={phase === 'ballot-enabled' || phase === 'vvpat' || phase === 'voted'}
                    className="w-full py-3 rounded-lg bg-sage text-white font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-sage-dark transition-colors"
                  >
                    Enable Ballot
                  </button>
                  {phase === 'done' && (
                    <button onClick={() => { setPhase('ready'); setSelectedId(null); setActiveLed(null); }} className="w-full py-2 rounded-lg border border-white/20 text-white text-xs hover:bg-white/10">
                      Vote Again
                    </button>
                  )}
                </div>
              </div>

              {/* VVPAT */}
              <div className="glass-card p-4">
                <h2 className="font-heading font-semibold text-sm mb-3">VVPAT Display</h2>
                <div className="bg-white dark:bg-gray-100 rounded-xl border-2 border-gray-300 min-h-[200px] flex items-center justify-center relative overflow-hidden">
                  <AnimatePresence>
                    {phase === 'vvpat' && selectedCandidate && (
                      <motion.div key="slip" initial={{ y: '-100%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} exit={{ y: '100%', opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-x-3 bg-white border-2 border-dashed border-gray-400 rounded p-4">
                        <div className="text-center">
                          <p className="text-[9px] text-gray-400 uppercase font-bold mb-2">VVPAT VERIFICATION SLIP</p>
                          <p className="text-xs text-gray-500 border-b border-gray-300 pb-2 mb-2">Serial No. {selectedCandidate.id}</p>
                          <p className="text-lg font-bold text-gray-900">{selectedCandidate.name}</p>
                          <p className="text-xs text-gray-500 mb-2">{selectedCandidate.party}</p>
                          <div className="flex justify-center mb-2">
                            {(() => {
                              const Icon = IconMap[selectedCandidate.symbol];
                              return Icon ? <Icon className="w-10 h-10 text-gray-800" /> : null;
                            })()}
                          </div>
                          <div className="mt-3 pt-2 border-t border-gray-300">
                            <div className="w-12 h-12 mx-auto rounded-full bg-bottle flex items-center justify-center">
                              <span className="text-lg font-bold text-wattle">{vvpatTimer}</span>
                            </div>
                            <p className="text-[9px] text-gray-400 mt-1">Slip visible for {vvpatTimer}s</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {phase === 'done' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center p-4">
                      <CheckCircle2Icon className="w-10 h-10 mx-auto text-sage mb-2" />
                      <p className="font-heading font-bold text-sm text-gray-900">Vote Recorded!</p>
                      <p className="text-xs text-gray-500">Thank you for participating.</p>
                    </motion.div>
                  )}
                  {(phase === 'ready' || phase === 'ballot-enabled') && (
                    <p className="text-xs text-gray-400 italic px-4 text-center">Paper slip will appear here after you vote</p>
                  )}
                </div>
              </div>
            </div>

            {/* Completion */}
            {phase === 'done' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 glass-card p-6 text-center">
                <h2 className="font-heading text-xl font-bold mb-2">🎉 Congratulations, Mock Voter!</h2>
                <p className="text-sm text-muted-foreground mb-4">You&apos;ve successfully practiced the full voting process. You&apos;re ready for the real thing!</p>
                <button onClick={() => {
                  useAppStore.getState().completeStep('mock-vote');
                  router.push('/journey');
                }} className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-bottle-light to-bottle text-white font-bold text-sm">
                  Mark as Complete & Continue to Journey
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
