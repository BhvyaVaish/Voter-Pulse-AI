'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollText, FileEdit, ClipboardList, LogOut, Megaphone, CheckSquare, Hash, Trophy } from 'lucide-react';
import { getNextQualifyingDate } from '@/lib/eligibility';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format } from 'date-fns';

const electionPhases = [
  { id: 'mcc', name: 'Model Code of Conduct Announced', timing: 'Schedule Announcement', desc: 'All political parties must follow strict rules on conduct and spending from the date of election announcement.', icon: ScrollText },
  { id: 'revision', name: 'Voter List Revision Window', timing: 'Before Nominations', desc: 'Last chance to register, correct details, or file objections on voter rolls.', icon: FileEdit },
  { id: 'nomination', name: 'Nomination Filing', timing: 'About 3 Weeks Before Polls', desc: 'Candidates file nomination papers with the returning officer.', icon: ClipboardList },
  { id: 'withdrawal', name: 'Candidate Withdrawal', timing: 'About 2 Weeks Before Polls', desc: 'Last day for candidates to withdraw from the election.', icon: LogOut },
  { id: 'campaign', name: 'Election Campaigning', timing: 'Until 48 Hours Before Polls', desc: 'Parties campaign, rallies held, advertisements published.', icon: Megaphone },
  { id: 'polling', name: 'Polling Day', timing: 'Voting Day', desc: 'Cast your vote at your designated polling station.', icon: CheckSquare },
  { id: 'counting', name: 'Vote Counting Day', timing: 'After All Phases Complete', desc: 'Electronic counting of votes at counting centres.', icon: Hash },
  { id: 'results', name: 'Results Declared', timing: 'Counting Day Evening', desc: 'Final results announced. Winners declared officially.', icon: Trophy },
];

function LiveCountdown() {
  const [now, setNow] = useState(new Date());
  const nextDate = getNextQualifyingDate(now);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const d = differenceInDays(nextDate, now);
  const h = differenceInHours(nextDate, now) % 24;
  const m = differenceInMinutes(nextDate, now) % 60;
  const s = differenceInSeconds(nextDate, now) % 60;

  return (
    <div className="glass-card p-6 text-center mb-6">
      <h2 className="font-heading font-bold text-lg mb-1">Next ECI Qualifying Date</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {format(nextDate, 'dd-MM-yyyy')}
      </p>
      <div className="flex justify-center gap-3">
        {[
          { v: d, l: 'Days' }, { v: h, l: 'Hours' }, { v: m, l: 'Min' }, { v: s, l: 'Sec' },
        ].map((u) => (
          <div key={u.l} className="text-center">
            <div className="countdown-digit text-2xl min-w-[56px]">{String(u.v).padStart(2, '0')}</div>
            <span className="text-[10px] text-muted-foreground mt-1 block">{u.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TimelinePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <h1 className="font-heading text-2xl font-bold">Standard Election Sequence</h1>
        <p className="text-sm text-muted-foreground">Learn the chronological steps of the democratic process</p>
      </div>

      <LiveCountdown />

      <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {electionPhases.map((phase, i) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            {/* Timeline dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors group-hover:border-bottle group-hover:text-bottle">
              <phase.icon className="w-4 h-4" />
            </div>

            {/* Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-4 hover:border-bottle/50 transition-all">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-heading font-bold text-sm text-foreground">{phase.name}</h3>
              </div>
              <p className="text-xs font-medium text-bottle dark:text-wattle mb-2">{phase.timing}</p>
              <p className="text-xs text-muted-foreground">{phase.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
