'use client';

import { useState } from 'react';
import { CalendarMonthView } from '@/components/calendar-month-view';
import { getDummyVotes, VoteEntry } from '@/lib/test-data/sample-votes';
import { DateCard } from '@/components/date-card';

// Helper to get VoterResponse[] for a specific date from raw VoteEntry[]
function getVoterResponsesForDate(votes: VoteEntry[], date: string) {
  return votes
    .filter((vote) => vote.date === date)
    .map((vote) => ({ name: vote.voterName, response: vote.response }));
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const allVoteEntries = getDummyVotes();

  const handleDayClick = (date: string) => {
    // Toggle behavior: clicking the same date closes the card
    setSelectedDate(prev => prev === date ? null : date);
  };
  
  const responsesForSelectedDate = selectedDate
    ? getVoterResponsesForDate(allVoteEntries, selectedDate)
    : [];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="flex flex-col items-center gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Monthly Calendar</h1>
          <p className="text-muted-foreground text-center">Click a date to see votes</p>
        </div>
        <CalendarMonthView 
          allVoteEntries={allVoteEntries} 
          onDayClick={handleDayClick} 
        />
        {selectedDate && (
          <div className="mt-4">
            <DateCard 
              date={selectedDate}
              responses={responsesForSelectedDate}
            />
          </div>
        )}
      </div>
    </main>
  );
}
