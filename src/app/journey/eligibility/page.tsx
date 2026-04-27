'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Clock, ArrowLeft, Calendar } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/provider';
import { useAppStore } from '@/lib/store';
import { checkEligibility } from '@/lib/eligibility';
import { indianStates } from '@/lib/data';

export default function EligibilityPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setEligibility, earnBadge, completeStep, addXP } = useAppStore();
  const [dob, setDob] = useState('');
  const [isCitizen, setIsCitizen] = useState(true);
  const [state, setState] = useState('');
  const [result, setResult] = useState<ReturnType<typeof checkEligibility> | null>(null);

  const handleCheck = () => {
    if (!dob) return;
    const res = checkEligibility(dob, isCitizen);
    setResult(res);
    setEligibility({ dob, isCitizen, residency: state, checked: true, eligible: res.eligible });
    if (res.eligible || res.advanceEligible) {
      earnBadge('eligible-citizen');
      completeStep('eligibility');
      addXP(15);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h1 className="font-heading text-2xl font-bold mb-2">{t('eligibility.title')}</h1>
        <p className="text-sm text-muted-foreground mb-6">Based on ECI Form 6 eligibility rules</p>

        <div className="space-y-5">
          {/* DOB */}
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('eligibility.dob')}</label>
            <div className="relative">
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground focus:ring-2 focus:ring-bottle focus:border-bottle outline-none transition-all"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Citizen */}
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('eligibility.citizen')}</label>
            <div className="flex gap-3">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  onClick={() => setIsCitizen(v)}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    isCitizen === v
                      ? 'border-bottle bg-bottle text-wattle'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {v ? 'Yes ✓' : 'No ✗'}
                </button>
              ))}
            </div>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('eligibility.residency')}</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground focus:ring-2 focus:ring-bottle focus:border-bottle outline-none transition-all"
            >
              <option value="">{t('eligibility.selectState')}</option>
              {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Check button */}
          <button
            onClick={handleCheck}
            disabled={!dob}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-bottle-light to-bottle text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-bottle transition-all"
          >
            {t('eligibility.check')}
          </button>
        </div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-5 rounded-xl border-2 ${
              result.eligible ? 'border-sage bg-sage/5' :
              result.advanceEligible ? 'border-yellow-500 bg-yellow-500/5' :
              'border-red-500 bg-red-500/5'
            }`}
          >
            <div className="flex items-start gap-3">
              {result.eligible ? <CheckCircle2 className="w-6 h-6 text-sage flex-shrink-0 mt-0.5" /> :
               result.advanceEligible ? <Clock className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" /> :
               <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />}
              <div>
                <h3 className="font-heading font-bold text-lg mb-1">
                  {result.eligible ? t('eligibility.eligible') :
                   result.advanceEligible ? t('eligibility.advance') :
                   t('eligibility.notEligible')}
                </h3>
                <p className="text-sm text-muted-foreground">{result.message}</p>
                {result.recommendedForm && (
                  <p className="mt-2 text-sm font-medium">
                    Recommended: <span className="text-wattle">{result.recommendedForm}</span>
                  </p>
                )}
              </div>
            </div>
            
            {(result.eligible || result.advanceEligible) && (
              <button
                onClick={() => router.push('/journey')}
                className="mt-6 w-full py-2.5 rounded-lg bg-bottle text-white font-bold text-sm hover:bg-bottle-dark transition-all"
              >
                Mark as Complete & Continue to Journey
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
