'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Shield, ClipboardCheck, BookOpen, Vote, Megaphone, ListChecks, Trophy } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const badgeIcons: Record<string, React.ElementType> = {
  'civic-starter': Star,
  'eligible-citizen': Shield,
  'registered-voter': ClipboardCheck,
  'informed-citizen': BookOpen,
  'mock-voter': Vote,
  'civic-guardian': Megaphone,
  'prepared-voter': ListChecks,
  'election-champion': Trophy,
};

export function BadgePopup() {
  const pendingBadge = useAppStore((s) => s.pendingBadge);
  const dismissBadge = useAppStore((s) => s.dismissBadge);

  return (
    <AnimatePresence>
      {pendingBadge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
          onClick={dismissBadge}
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="glass-card p-8 max-w-sm w-full text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={dismissBadge} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.5, times: [0, 0.6, 1] }}
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 text-4xl"
              style={{ backgroundColor: `${pendingBadge.color}15` }}
            >
              {(() => {
                const Icon = badgeIcons[pendingBadge.id] || Trophy;
                return <Icon className="w-10 h-10" style={{ color: pendingBadge.color }} />;
              })()}
            </motion.div>

            <h2 className="font-heading text-xl font-bold mb-1">Badge Earned!</h2>
            <h3 className="font-heading font-semibold text-lg mb-1" style={{ color: pendingBadge.color }}>
              {pendingBadge.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{pendingBadge.description}</p>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-bottle text-wattle text-sm font-bold">
              +{pendingBadge.xpReward} XP
            </div>

            <button
              onClick={dismissBadge}
              className="w-full mt-5 py-2.5 rounded-lg bg-gradient-to-r from-bottle-light to-bottle text-white font-bold text-sm"
            >
              Continue My Journey
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
