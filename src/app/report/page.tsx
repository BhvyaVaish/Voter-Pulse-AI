'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, MapPin, Send, Eye, EyeOff, CheckCircle2, Users, Shield, Banknote, GlassWater, ClipboardList, Megaphone, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/provider';
import { useAppStore } from '@/lib/store';

const violationTypes = [
  { id: 'money', icon: Banknote, key: 'money', color: 'text-amber-500' },
  { id: 'liquor', icon: GlassWater, key: 'liquor', color: 'text-cyan-500' },
  { id: 'posters', icon: ClipboardList, key: 'posters', color: 'text-blue-500' },
  { id: 'campaigning', icon: Megaphone, key: 'campaigning', color: 'text-orange-500' },
  { id: 'other', icon: HelpCircle, key: 'other', color: 'text-gray-500' },
];

const statusSteps = [
  { key: 'submitted', icon: Send, label: 'Submitted' },
  { key: 'under-review', icon: Eye, label: 'Under Review' },
  { key: 'assigned', icon: Users, label: 'Field Unit Assigned' },
  { key: 'resolved', icon: Shield, label: 'Resolved' },
];

export default function ReportPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { reports, addReport, earnBadge, completeStep } = useAppStore();
  const [step, setStep] = useState<'form' | 'submitted'>('form');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const handleSubmit = () => {
    if (!type || !description) return;
    const id = `cVIGIL-${Date.now().toString(36).toUpperCase()}`;
    addReport({
      id, type, description,
      status: 'submitted',
      timestamp: new Date().toISOString(),
      location: location || 'Auto-detected via GPS',
    });
    earnBadge('guardian');
    completeStep('report-violation');
    setSubmittedId(id);
    setStep('submitted');

    // Simulate status progression
    setTimeout(() => useAppStore.getState().updateReportStatus(id, 'under-review'), 3000);
    setTimeout(() => useAppStore.getState().updateReportStatus(id, 'assigned'), 8000);
    setTimeout(() => useAppStore.getState().updateReportStatus(id, 'resolved'), 15000);
  };

  const handleNewReport = () => {
    setStep('form');
    setType('');
    setDescription('');
    setLocation('');
    setSubmittedId('');
  };

  const currentReport = reports.find((r) => r.id === submittedId);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="text-center mb-6">
        <h1 className="font-heading text-2xl font-bold">{t('report.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('report.subtitle')}</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'form' ? (
          <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-card p-6 space-y-5">
            {/* Violation type */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('report.type')}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {violationTypes.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setType(v.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      type === v.id ? 'border-bottle bg-bottle' : 'border-border hover:bg-muted'
                    }`}
                  >
                    <span className="mb-2 block"><v.icon className={`w-6 h-6 mx-auto ${v.color}`} /></span>
                    <span className="text-xs font-medium">{t(`report.${v.key}`)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('report.description')}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground focus:ring-2 focus:ring-bottle focus:border-bottle outline-none transition-all resize-none"
                placeholder="Describe what you witnessed..."
              />
            </div>

            {/* Photo placeholder */}
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('report.photo')}</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 cursor-pointer transition-all">
                <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">Tap to capture or upload photo</p>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('report.location')}</label>
              <div className="flex gap-2">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location or auto-detect"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground focus:ring-2 focus:ring-bottle focus:border-bottle outline-none transition-all"
                />
                <button className="px-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors" title="Auto-detect location">
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Anonymous */}
            <button
              onClick={() => setAnonymous(!anonymous)}
              className="flex items-center gap-2 text-sm"
            >
              {anonymous ? <EyeOff className="w-4 h-4 text-wattle" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
              <span className={anonymous ? 'text-wattle font-medium' : 'text-muted-foreground'}>
                {t('report.anonymous')}
              </span>
            </button>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!type || !description}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-500/20 transition-all"
            >
              {t('report.submit')}
            </button>
          </motion.div>
        ) : (
          <motion.div key="submitted" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            {/* Success card */}
            <div className="glass-card p-6 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                <div className="w-16 h-16 mx-auto rounded-full bg-sage/10 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8 text-sage" />
                </div>
              </motion.div>
              <h2 className="font-heading font-bold text-lg mb-1">Report Submitted!</h2>
              <p className="text-sm text-muted-foreground mb-3">Your report will be processed within 100 minutes.</p>
              <div className="inline-block px-4 py-2 rounded-lg bg-muted">
                <span className="text-xs text-muted-foreground">{t('report.trackingId')}: </span>
                <span className="font-mono font-bold text-sm">{submittedId}</span>
              </div>
            </div>

            {/* Status tracker */}
            <div className="glass-card p-5">
              <h3 className="font-heading font-semibold text-sm mb-4">Report Status</h3>
              <div className="space-y-3">
                {statusSteps.map((s, i) => {
                  const statusOrder = ['submitted', 'under-review', 'assigned', 'resolved'];
                  const currentIdx = statusOrder.indexOf(currentReport?.status || 'submitted');
                  const isCompleted = i <= currentIdx;
                  const isCurrent = i === currentIdx;

                  return (
                    <div key={s.key} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted ? 'bg-sage/10' : 'bg-muted'
                      } ${isCurrent ? 'pulse-glow' : ''}`}>
                        <s.icon className={`w-4 h-4 ${isCompleted ? 'text-sage' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${isCompleted ? '' : 'text-muted-foreground'}`}>{s.label}</p>
                      </div>
                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-sage" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={handleNewReport}
              className="w-full py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              File Another Report
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
