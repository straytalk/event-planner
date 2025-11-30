'use client';

import { useState } from 'react';
import { CalendarMonthView } from '@/components/calendar-month-view';
import { getDummyVotes, VoteEntry } from '@/lib/test-data/sample-votes';
import { DateCard } from '@/components/date-card';
import { Button } from '@/components/ui/button'; // Import Button
import { VotePalette } from '@/components/VotePalette'; // Import VotePalette

// Helper to get VoterResponse[] for a specific date from raw VoteEntry[]
function getVoterResponsesForDate(votes: VoteEntry[], date: string) {
  return votes
    .filter((vote) => vote.date === date)
    .map((vote) => ({ name: vote.voterName, response: vote.response }));
}

type VoteType = 'yes' | 'no' | 'if-need-be';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [voteMode, setVoteMode] = useState<VoteType | 'notEnabled'>('notEnabled');
  const [isVoteModeActive, setIsVoteModeActive] = useState(false); // New state for Vote Mode visibility
  const [allVoteEntries, setAllVoteEntries] = useState<VoteEntry[]>(getDummyVotes()); // Now stateful

  const handleVote = (date: string, response: VoteType) => {
    const currentUser = 'CurrentUser'; // Hardcode for now

    setAllVoteEntries(prevEntries => {
      // Filter out existing vote by currentUser for this date
      const filteredEntries = prevEntries.filter(
        entry => !(entry.date === date && entry.voterName === currentUser)
      );

      // Add the new vote
      const newVote: VoteEntry = { date, voterName: currentUser, response };
      return [...filteredEntries, newVote];
    });
  };

  const handleDayClick = (date: string) => {
    if (isVoteModeActive && voteMode !== 'notEnabled') {
      // If in vote mode and a vote type is selected, apply the vote
      handleVote(date, voteMode);
    } else {
      // Otherwise, toggle behavior: clicking the same date closes the card
      setSelectedDate(prev => prev === date ? null : date);
    }
  };

  const handleToggleVoteMode = () => {
    setIsVoteModeActive(prev => !prev);
    // When exiting vote mode, reset selected vote type and clear selected date
    if (isVoteModeActive) {
      setVoteMode('notEnabled');
      setSelectedDate(null);
    }
  };

  const handleVoteTypeChange = (type: VoteType) => {
    setVoteMode(type);
    setSelectedDate(null); // Clear selected date when changing vote type in vote mode
  };
  
  const responsesForSelectedDate = selectedDate
    ? getVoterResponsesForDate(allVoteEntries, selectedDate)
    : [];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="flex flex-col items-center gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Monthly Calendar</h1>
          <p className="text-muted-foreground text-center">
            {isVoteModeActive ? 'Select your vote and click on dates!' : 'Click a date to see votes'}
          </p>
        </div>

        <Button 
          onClick={handleToggleVoteMode} 
          className="mb-4"
          variant={isVoteModeActive ? "destructive" : "default"} // Destructive for active mode
        >
          {isVoteModeActive ? 'Exit Vote Mode' : 'Enter Vote Mode'}
        </Button>

        {isVoteModeActive && (
          <VotePalette 
            currentVoteMode={voteMode}
            onVoteModeChange={handleVoteTypeChange}
          />
        )}

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
