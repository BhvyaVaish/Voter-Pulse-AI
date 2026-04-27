'use client';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Bell, Trash2, Clock, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function RemindersPage() {
  const { reminders, removeReminder } = useAppStore();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <h1 className="font-heading text-2xl font-bold">Your Reminders</h1>
        <p className="text-sm text-muted-foreground">Stay on top of important election dates</p>
      </div>

      {reminders.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="font-heading font-bold text-lg mb-2">No Reminders Set</h2>
          <p className="text-sm text-muted-foreground">Visit the Timeline page to set reminders for important election dates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((reminder, i) => {
            const isPast = new Date(reminder.date) < new Date();
            return (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card p-4 flex items-center gap-4 ${isPast ? 'opacity-60' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPast ? 'bg-gray-100 dark:bg-gray-800' : 'bg-bottle'}`}>
                  {isPast ? <Check className="w-5 h-5 text-gray-400" /> : <Clock className="w-5 h-5 text-wattle" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-sm">{reminder.title}</h3>
                  <p className="text-xs text-muted-foreground">{format(new Date(reminder.date), 'dd-MM-yyyy')}</p>
                </div>
                <button onClick={() => removeReminder(reminder.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
