import { CalendarMonthView } from '@/components/calendar-month-view';
import { getDummyVotes } from '@/lib/test-data/sample-votes';

export default function CalendarPage() {
  const allVoteEntries = getDummyVotes();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <h1 className="text-3xl font-bold mb-8">Monthly Calendar</h1>
      <CalendarMonthView allVoteEntries={allVoteEntries} />
    </main>
  );
}
