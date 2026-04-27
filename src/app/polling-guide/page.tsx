'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, IdCard, Droplets, Vote, LogOut, ChevronRight, CheckCircle2, ClipboardList, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/provider';
import { useAppStore } from '@/lib/store';

const steps = [
  { id: 'entry', icon: Users, color: 'from-blue-500 to-blue-600', key: 'entry', tipKey: 'entryTip' },
  { id: 'id-check', icon: IdCard, color: 'from-indigo-500 to-indigo-600', key: 'idCheck', tipKey: 'idTip' },
  { id: 'ink', icon: Droplets, color: 'from-purple-500 to-purple-600', key: 'ink', tipKey: 'inkTip' },
  { id: 'vote', icon: Vote, color: 'from-bottle-light to-bottle', key: 'votingBooth', tipKey: 'voteTip' },
  { id: 'exit', icon: LogOut, color: 'from-sage-500 to-sage-600', key: 'exit', tipKey: 'exitTip' },
];

export default function PollingGuidePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { completeStep } = useAppStore();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={() => { completeStep('polling-station'); completeStep('polling-lookup'); router.back(); }}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="text-center mb-8">
        <h1 className="font-heading text-2xl font-bold">{t('guide.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('guide.subtitle')}</p>
      </div>

      {/* Isometric Polling Station Map */}
      <div className="glass-card p-6 mb-8">
        <div className="relative">
          {/* Visual path */}
          <svg className="w-full h-20 mb-2" viewBox="0 0 500 60" fill="none">
            <path d="M30 30 L130 30 L230 30 L330 30 L470 30" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" className="text-border" />
            <motion.path
              d="M30 30 L130 30 L230 30 L330 30 L470 30"
              stroke="url(#pathGrad)" strokeWidth="3" strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: (activeStep + 1) / steps.length }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#CCDA47" />
                <stop offset="100%" stopColor="#0A3625" />
              </linearGradient>
            </defs>
            {steps.map((_, i) => {
              const x = 30 + (i * 110);
              return (
                <g key={i}>
                  <circle cx={x} cy="30" r="14" fill={i <= activeStep ? '#0A3625' : 'var(--muted)'} className="transition-all duration-300" />
                  <text x={x} y="35" textAnchor="middle" fontSize="12" fill={i <= activeStep ? '#CCDA47' : 'white'} fontWeight="bold">{i + 1}</text>
                </g>
              );
            })}
          </svg>

          {/* Step buttons row */}
          <div className="grid grid-cols-5 gap-2">
            {steps.map((s, i) => {
              const isActive = i === activeStep;
              const isDone = i < activeStep;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(i)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                    isActive ? 'bg-bottle ring-2 ring-bottle' : isDone ? 'bg-sage/5' : 'hover:bg-muted'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center ${
                    isActive ? 'shadow-lg' : isDone ? 'opacity-60' : 'opacity-40'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-5 h-5 text-white" /> : <s.icon className="w-5 h-5 text-white" />}
                  </div>
                  <span className={`text-[10px] font-medium text-center leading-tight ${
                    isActive ? 'text-wattle' : 'text-muted-foreground'
                  }`}>
                    {t(`guide.${s.key}`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Step Detail */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            {(() => { const Icon = steps[activeStep].icon; return <Icon className="w-7 h-7 text-white" />; })()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-wattle">STEP {activeStep + 1} of {steps.length}</span>
            </div>
            <h2 className="font-heading text-xl font-bold mb-2">{t(`guide.${steps[activeStep].key}`)}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{t(`guide.${steps[activeStep].tipKey}`)}</p>

            {/* Specific tips per step */}
            {activeStep === 0 && (
              <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-start gap-1 mb-2">
                  <ClipboardList className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>12 Accepted Photo IDs (if no EPIC)</span>
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                  {['Aadhaar Card', 'Passport', 'Driving License', 'PAN Card', 'MNREGA Job Card', 'Bank/PO Passbook (with photo)', 'Health Insurance Smart Card', 'NPR Smart Card', 'Pension Document (with photo)', 'Service Photo ID (Govt/PSU)', 'MP / MLA / MLC Identity Card', 'UDID Card (Disability ID)'].map(id => (
                    <p key={id} className="text-[10px] text-blue-700 dark:text-blue-300 flex items-start gap-1">
                      <span className="text-blue-400">•</span> {id}
                    </p>
                  ))}
                </div>
                <p className="text-[10px] text-red-600 dark:text-red-400 font-bold mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Voter Information Slip alone is NOT a valid ID
                </p>
              </div>
            )}
            {activeStep === 2 && (
              <div className="mt-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                <p className="text-xs font-medium text-purple-700 dark:text-purple-300">💡 Indelible ink is applied on the nail and cuticle of your <strong>left index finger</strong>. It stays visible for at least 3 days on skin, and 2–4 weeks on the nail (until it grows out). It is manufactured by Mysore Paints &amp; Varnish Ltd. (Govt. of Karnataka).</p>
              </div>
            )}
            {activeStep === 3 && (
              <div className="mt-4 p-3 rounded-lg bg-bottle/10 dark:bg-bottle/20 border border-bottle/30">
                <p className="text-xs font-medium text-bottle dark:text-wattle flex items-start gap-1">
                  <Vote className="w-4 h-4 flex-shrink-0" />
                  <span>One vote per ballot. Press the <strong>blue button</strong> next to your candidate firmly. The EVM beeps and a <strong>red LED</strong> glows to confirm. You cannot vote again — the ballot is locked.</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-30 transition-all"
          >
            ← Previous
          </button>
          {activeStep === steps.length - 1 ? (
             <button
               onClick={() => { completeStep('polling-station'); completeStep('polling-lookup'); router.push('/journey'); }}
               className="flex items-center gap-1 px-4 py-2 rounded-lg bg-bottle text-white text-sm font-medium hover:bg-bottle-dark transition-all"
             >
               Mark as Complete & Continue to Journey <ChevronRight className="w-4 h-4" />
             </button>
          ) : (
             <button
               onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
               className="flex items-center gap-1 px-4 py-2 rounded-lg bg-bottle text-white text-sm font-medium hover:bg-bottle-dark transition-all"
             >
               Next <ChevronRight className="w-4 h-4" />
             </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
