'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Vote, UserCheck, Zap, ArrowRight, ArrowLeft, Globe, Check } from 'lucide-react';
import { useAppStore, type Persona, type Language } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/provider';
import { getRoadmap } from '@/lib/roadmaps';

const languageOptions: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

const personas = [
  { id: 'new-voter' as Persona, icon: Vote, gradient: 'from-blue-500 to-indigo-600', label: 'New Voter', desc: 'First time voting. I need help from the beginning.' },
  { id: 'existing-voter' as Persona, icon: UserCheck, gradient: 'from-sage-500 to-teal-600', label: 'Existing Voter', desc: 'I have voted before. I need to check my details and prepare.' },
  { id: 'civic-action' as Persona, icon: Zap, gradient: 'from-bottle-light to-amber-600', label: 'Civic Action', desc: 'I want to report issues, fight misinformation and stay informed.' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setLanguage } = useTranslation();
  const store = useAppStore();
  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [selectedPersona, setSelectedPersona] = useState<Persona>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleFinish = () => {
    store.setLanguage(selectedLang);
    setLanguage(selectedLang);
    store.setPersona(selectedPersona);
    store.setQuestSteps(getRoadmap(selectedPersona!));
    store.setOnboardingAnswers(answers);
    store.setOnboardingCompleted(true);
    store.earnBadge('civic-starter');
    store.addXP(10);
    router.push('/dashboard');
  };

  const contextQuestions: Record<string, { q: string; options: string[] }[]> = {
    'new-voter': [
      { q: 'Do you know if you are registered?', options: ['Yes', 'No', 'Not sure'] },
      { q: 'What is your age?', options: ['Under 17', '17-18', '18-25', '25+'] },
    ],
    'existing-voter': [
      { q: 'When did you last vote?', options: ['Last election', 'Before that', 'Not sure'] },
      { q: 'Do you know your polling booth?', options: ['Yes', 'No'] },
    ],
    'civic-action': [
      { q: 'What is your primary interest?', options: ['Report violations', 'Fight misinformation', 'Monitor candidates', 'Learn voting rules'] },
    ],
  };

  const steps = ['Language', 'Persona', 'Context', 'Roadmap'];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-bottle rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto w-full px-4 py-8 flex-1 flex flex-col">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-bottle' : 'bg-muted'}`} />
              <p className={`text-[9px] mt-1 text-center ${i <= step ? 'text-wattle font-bold' : 'text-muted-foreground'}`}>{s}</p>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 0: Language */}
          {step === 0 && (
            <motion.div key="lang" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-8 h-8 text-wattle" />
                <div>
                  <h2 className="font-heading text-2xl font-bold">Choose Your Language</h2>
                  <p className="text-sm text-muted-foreground">Select your preferred language</p>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {languageOptions.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setSelectedLang(l.code)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedLang === l.code ? 'border-bottle bg-bottle' : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <span className="text-xs font-bold px-2 py-1 bg-muted rounded uppercase text-muted-foreground">{l.code}</span>
                    <div className="flex-1">
                      <span className="font-semibold">{l.native}</span>
                      <span className="text-sm text-muted-foreground ml-2">({l.label})</span>
                    </div>
                    {selectedLang === l.code && <Check className="w-5 h-5 text-wattle" />}
                  </button>
                ))}
              </div>
              <button onClick={handleNext} className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-bottle-light to-bottle text-white font-bold flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 1: Persona */}
          {step === 1 && (
            <motion.div key="persona" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col">
              <h2 className="font-heading text-2xl font-bold mb-1">What describes you best?</h2>
              <p className="text-sm text-muted-foreground mb-6">Choose your civic profile</p>
              <div className="space-y-3 flex-1">
                {personas.map((p, i) => (
                  <motion.button
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedPersona(p.id)}
                    className={`w-full flex items-start gap-4 p-5 rounded-xl border-2 transition-all text-left ${
                      selectedPersona === p.id ? 'border-bottle bg-bottle' : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
                      <p.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-lg">{p.label}</h3>
                      <p className="text-sm text-muted-foreground">{p.desc}</p>
                    </div>
                    {selectedPersona === p.id && <Check className="w-5 h-5 text-wattle mt-1" />}
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleBack} className="px-6 py-3 rounded-xl border border-border font-medium"><ArrowLeft className="w-4 h-4" /></button>
                <button onClick={handleNext} disabled={!selectedPersona} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-bottle-light to-bottle text-white font-bold disabled:opacity-40 flex items-center justify-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Context Questions */}
          {step === 2 && selectedPersona && (
            <motion.div key="context" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col">
              <h2 className="font-heading text-2xl font-bold mb-1">A few quick questions</h2>
              <p className="text-sm text-muted-foreground mb-6">Help us personalize your journey</p>
              <div className="space-y-5 flex-1">
                {contextQuestions[selectedPersona]?.map((q, qi) => (
                  <div key={qi}>
                    <p className="font-medium text-sm mb-2">{q.q}</p>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setAnswers((a) => ({ ...a, [`q${qi}`]: opt }))}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                            answers[`q${qi}`] === opt ? 'border-bottle bg-bottle text-wattle' : 'border-border hover:bg-muted'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleBack} className="px-6 py-3 rounded-xl border border-border font-medium"><ArrowLeft className="w-4 h-4" /></button>
                <button onClick={handleNext} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-bottle-light to-bottle text-white font-bold flex items-center justify-center gap-2">
                  Build My Roadmap <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Roadmap Preview */}
          {step === 3 && selectedPersona && (
            <motion.div key="roadmap" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col">
              <h2 className="font-heading text-2xl font-bold mb-1">Your Personal Action Plan</h2>
              <p className="text-sm text-muted-foreground mb-6">Here&apos;s your step-by-step civic journey</p>
              <div className="space-y-2 flex-1 overflow-y-auto">
                {getRoadmap(selectedPersona).map((step, i) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card p-3 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-bottle flex items-center justify-center text-xs font-bold text-wattle">{i + 1}</div>
                    <div className="flex-1">
                      <h4 className="font-heading font-semibold text-sm">{step.title}</h4>
                      <p className="text-[11px] text-muted-foreground">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleBack} className="px-6 py-3 rounded-xl border border-border font-medium"><ArrowLeft className="w-4 h-4" /></button>
                <button onClick={handleFinish} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-bottle-light to-bottle text-white font-bold flex items-center justify-center gap-2">
                  Let&apos;s Go! <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
