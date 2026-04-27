'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Lock, Circle, ArrowRight, RotateCcw, AlertTriangle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/provider';
import { TrustLabel } from '@/components/trust-label';

export default function JourneyPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { persona, questSteps, completeStep, earnBadge, resetAll, addXP } = useAppStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!persona) {
      router.replace('/');
      return;
    }

    // Only sync once per mount to prevent infinite re-render loop
    if (hasSynced.current) return;
    
    // Auto-sync local state with latest roadmap blueprints to fix order/content issues
    import('@/lib/roadmaps').then(({ getRoadmap }) => {
      const currentSteps = useAppStore.getState().questSteps;
      const blueprint = getRoadmap(persona);
      if (blueprint.length > 0 && currentSteps.length > 0) {
        const needsSync = blueprint.length !== currentSteps.length || blueprint.some((b, i) => b.id !== currentSteps[i]?.id);
        
        if (needsSync) {
          const syncedSteps = blueprint.map(bStep => {
            const existing = currentSteps.find(s => s.id === bStep.id);
            return existing ? { ...bStep, completed: existing.completed } : bStep;
          });
          
          let foundFirstIncomplete = false;
          const fixedSteps = syncedSteps.map(s => {
            if (s.completed) return { ...s, active: false };
            if (!foundFirstIncomplete) {
              foundFirstIncomplete = true;
              return { ...s, active: true };
            }
            return { ...s, active: false };
          });
          
          useAppStore.getState().setQuestSteps(fixedSteps);
        }
      }
      hasSynced.current = true;
    });
  }, [persona, router]);

  if (!persona) return null;

  const completedCount = questSteps.filter((s) => s.completed).length;
  const progress = questSteps.length ? Math.round((completedCount / questSteps.length) * 100) : 0;

  const handleComplete = (stepId: string) => {
    completeStep(stepId);
    addXP(15);
    if (stepId === 'eligibility') earnBadge('eligible-citizen');
    if (stepId === 'registration' || stepId === 'verify-reg') earnBadge('registered-voter');
    if (stepId === 'checklist') earnBadge('prepared-voter');
  };

  const handleStepAction = (stepId: string) => {
    switch (stepId) {
      case 'eligibility': router.push('/journey/eligibility'); break;
      case 'mock-vote': router.push('/simulator'); break;
      case 'candidate-kyc': router.push('/candidates'); break;
      case 'report-violation': router.push('/complaint'); break;
      case 'polling-station': case 'polling-lookup': router.push('/polling-guide'); break;
      default: handleComplete(stepId);
    }
  };

  const personaLabel = persona === 'new-voter' ? 'New Voter Journey' : persona === 'existing-voter' ? 'Existing Voter Journey' : 'Civic Action Journey';

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-wattle font-bold uppercase">{personaLabel}</p>
          <h1 className="font-heading text-2xl font-bold">My Roadmap</h1>
        </div>
        <button onClick={() => { resetAll(); router.push('/'); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Progress */}
      <div className="glass-card p-4 mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium">Progress: {completedCount} of {questSteps.length}</span>
          <span className="font-heading font-bold text-wattle">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-bottle-light to-sage rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-3">
        {questSteps.map((step, i) => {
          const prevCompleted = i === 0 || questSteps[i - 1].completed;
          const isLocked = !step.completed && !step.active && !prevCompleted;
          const isExpanded = expandedId === step.id;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`glass-card overflow-hidden transition-all ${
                step.active && !step.completed ? 'pulse-glow border-bottle border-2' : ''
              } ${isLocked ? 'opacity-50' : ''}`}
            >
              <div className="p-4 flex items-start gap-4">
                {/* Stage number + status */}
                <div className="flex-shrink-0 mt-0.5">
                  {step.completed ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-sage" />
                    </motion.div>
                  ) : isLocked ? (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-bottle flex items-center justify-center font-heading font-bold text-sm text-wattle">{i + 1}</div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-heading font-bold text-sm">{step.title}</h3>
                    {step.completed && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sage/10 text-sage font-bold">Done</span>}
                    {step.active && !step.completed && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-bottle text-wattle font-bold">In Progress</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!step.completed && !isLocked && (
                    <button
                      onClick={() => handleStepAction(step.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-bottle text-white text-xs font-bold hover:bg-bottle-dark transition-colors"
                    >
                      {step.active ? 'Start' : 'Continue'} <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  {(step.whatYouNeed || step.commonMistake) && (
                    <button onClick={() => setExpandedId(isExpanded ? null : step.id)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded "Snack" section */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4 pt-0 border-t border-border mt-0">
                      <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {step.whatYouNeed && step.whatYouNeed.length > 0 && (
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Info className="w-3 h-3 text-blue-600" />
                              <span className="text-[10px] font-bold text-blue-600 uppercase">What You Need</span>
                            </div>
                            <ul className="space-y-1">
                              {step.whatYouNeed.map((item, j) => (
                                <li key={j} className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-1.5">
                                  <span className="text-blue-400 mt-0.5">•</span> {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {step.checklist && step.checklist.length > 0 && (
                          <div className="p-3 rounded-lg bg-sage/10 border border-sage/20">
                            <div className="flex items-center gap-1.5 mb-2">
                              <CheckCircle2 className="w-3 h-3 text-sage" />
                              <span className="text-[10px] font-bold text-sage uppercase">Checklist</span>
                            </div>
                            <div className="space-y-2">
                              {step.checklist.map((item, j) => (
                                <label key={j} className="flex items-start gap-2 cursor-pointer group">
                                  <input type="checkbox" className="mt-0.5 w-3.5 h-3.5 rounded border-sage/30 accent-sage group-hover:border-sage transition-colors" />
                                  <span className="text-xs text-foreground group-hover:text-sage transition-colors">{item}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                        {step.commonMistake && (
                          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span className="text-[10px] font-bold text-amber-600 uppercase">Common Mistake</span>
                            </div>
                            <p className="text-xs text-amber-700 dark:text-amber-300">{step.commonMistake}</p>
                          </div>
                        )}
                      </div>
                      {step.links && step.links.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2">
                           {step.links.map((link, j) => (
                             <a key={j} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-bottle hover:text-wattle transition-colors text-[10px] font-bold text-muted-foreground group">
                               {link.text}
                               <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                             </a>
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
    </div>
  );
}
