'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info, Sun, Flower2, Wheat, Scale, Leaf, Star, X as XIcon, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/provider';
import { useAppStore } from '@/lib/store';
import { candidates } from '@/lib/data';
import { playBeep, playPrint, playSuccess } from '@/lib/sounds';

type Phase = 'tutorial' | 'ready' | 'ballot-enabled' | 'voted' | 'vvpat' | 'done';

const IconMap: Record<string, React.ElementType> = {
  Sun, Flower2, Wheat, Scale, Leaf, Star, X: XIcon
};

export default function MockVotePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { addVote, earnBadge, completeStep } = useAppStore();

  const [phase, setPhase] = useState<Phase>('tutorial');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeLed, setActiveLed] = useState<number | null>(null);
  const [vvpatTimer, setVvpatTimer] = useState(7);
  const [totalVotes, setTotalVotes] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  // VVPAT countdown
  useEffect(() => {
    if (phase !== 'vvpat') return;
    if (vvpatTimer <= 0) {
      setPhase('done'); // eslint-disable-line react-hooks/set-state-in-effect
      playSuccess();
      return;
    }
    const id = setTimeout(() => setVvpatTimer((v) => v - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, vvpatTimer]);

  const handleEnableBallot = () => {
    setPhase('ballot-enabled');
    setSelectedId(null);
    setActiveLed(null);
  };

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
    }, 500);
  }, [phase, addVote, earnBadge, completeStep]);

  const handleReset = () => {
    setPhase('ready');
    setSelectedId(null);
    setActiveLed(null);
  };

  const selectedCandidate = candidates.find((c) => c.id === selectedId);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="text-center mb-6">
        <h1 className="font-heading text-2xl font-bold">{t('evm.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('evm.subtitle')}</p>
      </div>

      {/* Tutorial overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => { setShowTutorial(false); setPhase('ready'); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-wattle" />
                <h2 className="font-heading font-bold text-lg">How to Vote</h2>
              </div>
              <ol className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex gap-2"><span className="font-bold text-wattle">1.</span> Officer presses &quot;Enable Ballot&quot; on the Control Unit</li>
                <li className="flex gap-2"><span className="font-bold text-wattle">2.</span> Green &quot;Ready&quot; lamp glows on the Ballot Unit</li>
                <li className="flex gap-2"><span className="font-bold text-wattle">3.</span> Press the blue button next to your candidate</li>
                <li className="flex gap-2"><span className="font-bold text-wattle">4.</span> You&apos;ll hear a beep — the red LED lights up</li>
                <li className="flex gap-2"><span className="font-bold text-wattle">5.</span> VVPAT shows your vote on a paper slip for 7 seconds</li>
                <li className="flex gap-2"><span className="font-bold text-wattle">6.</span> Slip drops into sealed box — you&apos;re done!</li>
              </ol>
              <button
                onClick={() => { setShowTutorial(false); setPhase('ready'); }}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-bottle-light to-bottle text-white font-bold text-sm"
              >
                {t('evm.startVoting')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px_280px] gap-4">
        {/* Ballot Unit */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-semibold text-sm">{t('evm.ballotUnit')}</h2>
            <div className="flex items-center gap-2">
              <div className={`led ${phase === 'ballot-enabled' ? 'ready' : ''}`} />
              <span className="text-xs text-muted-foreground">{t('evm.readyLamp')}</span>
            </div>
          </div>

          {phase !== 'ballot-enabled' && phase !== 'ready' && phase !== 'tutorial' && (
            <p className="text-xs text-center text-muted-foreground py-2 mb-2">
              {phase === 'voted' ? 'Recording...' : phase === 'vvpat' ? 'Verify VVPAT slip →' : t('evm.voteRecorded')}
            </p>
          )}

          <div className="border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[40px_1fr_50px_60px] bg-muted/50 px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase">
              <span>No.</span><span>Candidate / Party</span><span>Symbol</span><span>Vote</span>
            </div>
            {/* Candidates */}
            {candidates.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-[40px_1fr_50px_60px] items-center px-3 py-2.5 border-t border-border hover:bg-muted/30 transition-colors"
              >
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
          <p className="text-[10px] text-center text-muted-foreground mt-2">{t('evm.pressToVote')}</p>
        </div>

        {/* Control Unit */}
        <div className="glass-card p-4 flex flex-col gap-3">
          <h2 className="font-heading font-semibold text-sm">{t('evm.controlUnit')}</h2>
          <div className="bg-bottle-dark rounded-xl p-4 flex flex-col gap-3 flex-1">
            <div className="text-center">
              <span className="text-[10px] text-white/50 uppercase">{t('evm.totalVotes')}</span>
              <div className="text-3xl font-bold text-white font-mono">{String(totalVotes).padStart(3, '0')}</div>
            </div>
            <button
              onClick={handleEnableBallot}
              disabled={phase === 'ballot-enabled' || phase === 'vvpat' || phase === 'voted'}
              className="w-full py-3 rounded-lg bg-sage text-white font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-sage-dark transition-colors"
            >
              {t('evm.enableBallot')}
            </button>
            {phase === 'done' && (
              <button
                onClick={handleReset}
                className="w-full py-2 rounded-lg border border-white/20 text-white text-xs hover:bg-white/10 transition-colors"
              >
                Vote Again
              </button>
            )}
          </div>
        </div>

        {/* VVPAT */}
        <div className="glass-card p-4">
          <h2 className="font-heading font-semibold text-sm mb-3">{t('evm.vvpat')}</h2>
          <div className="bg-white dark:bg-gray-100 rounded-xl border-2 border-gray-300 min-h-[200px] flex items-center justify-center relative overflow-hidden">
            <AnimatePresence>
              {phase === 'vvpat' && selectedCandidate && (
                <motion.div
                  key="slip"
                  initial={{ y: '-100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '100%', opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-x-3 bg-white border-2 border-dashed border-gray-400 rounded p-4"
                >
                  <div className="text-center">
                    <p className="text-[9px] text-gray-400 uppercase font-bold mb-2">VVPAT VERIFICATION SLIP</p>
                    <div className="border-b border-gray-300 pb-2 mb-2">
                      <p className="text-xs text-gray-500">Serial No. {selectedCandidate.id}</p>
                    </div>
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
                      <p className="text-[9px] text-gray-400 mt-1">{t('evm.seconds')}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {phase === 'done' && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center p-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-sage/10 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-8 h-8 text-sage" />
                </div>
                <p className="font-heading font-bold text-sm text-gray-900">{t('evm.voteRecorded')}</p>
              </motion.div>
            )}

            {(phase === 'ready' || phase === 'ballot-enabled') && (
              <p className="text-xs text-gray-400 italic px-4 text-center">{t('evm.slipVerify')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
