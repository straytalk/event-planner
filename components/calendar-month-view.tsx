'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VoteEntry } from '@/lib/test-data/sample-votes'; // Import VoteEntry

// Define VoterResponse and MonthlyVotes locally here
export interface VoterResponse {
  name: string;
  response: 'yes' | 'no' | 'if-need-be';
}

export interface MonthlyVotes {
  [date: string]: VoterResponse[];
}

// Helper to transform VoteEntry[] to MonthlyVotes
function transformVoteEntriesToMonthlyVotes(voteEntries: VoteEntry[]): MonthlyVotes {
  return voteEntries.reduce((acc, vote) => {
    if (!acc[vote.date]) {
      acc[vote.date] = [];
    }
    acc[vote.date].push({ name: vote.voterName, response: vote.response });
    return acc;
  }, {} as MonthlyVotes);
}

// Helper to get days in a month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper to get the day of the week for the first day of the month
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.
};

interface CalendarMonthViewProps {
  allVoteEntries?: VoteEntry[]; // Accept raw VoteEntry[]
}

export function CalendarMonthView({ allVoteEntries = [] }: CalendarMonthViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Transform raw VoteEntry[] to MonthlyVotes for the current month's display
  const monthlyVotes = useMemo(() => {
    const currentMonthFormatted = String(month + 1).padStart(2, '0');
    const filteredVotes = allVoteEntries.filter(
      (entry) => entry.date.startsWith(`${year}-${currentMonthFormatted}`)
    );
    return transformVoteEntriesToMonthlyVotes(filteredVotes);
  }, [allVoteEntries, year, month]);


  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month); // 0-indexed day of week

  const getDayColor = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayVotes = monthlyVotes[dateString];

    if (!dayVotes || dayVotes.length === 0) {
      return 'bg-transparent'; // Neutral
    }
    if (dayVotes.some(v => v.response === 'no')) {
      return 'bg-red-200 dark:bg-red-900'; // Red
    }
    if (dayVotes.some(v => v.response === 'if-need-be')) {
      return 'bg-yellow-200 dark:bg-yellow-800'; // Yellow
    }
    if (dayVotes.every(v => v.response === 'yes')) {
      return 'bg-green-200 dark:bg-green-900'; // Green
    }
    return 'bg-transparent'; // Fallback neutral
  };

  const daysGrid = useMemo(() => {
    const grid = [];
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    // Fill leading empty days
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Fill days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && today.getDate() === day;
      const dayColor = getDayColor(day);

      grid.push(
        <div
          key={day}
          className={`h-10 flex items-center justify-center text-sm rounded-md transition-colors
            ${dayColor}
            ${isToday ? 'ring-2 ring-primary' : ''}
            ${dayColor !== 'bg-transparent' ? '' : 'hover:bg-accent hover:text-accent-foreground'}
          `}
        >
          {day}
        </div>
      );
    }
    return grid;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, daysInMonth, firstDayOfMonth, monthlyVotes]); // Depend on monthlyVotes

  const goToPreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={goToPreviousMonth}>
            &lt;
          </Button>
          <CardTitle className="text-xl">
            {monthName} {year}
          </CardTitle>
          <Button variant="outline" onClick={goToNextMonth}>
            &gt;
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center font-medium mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {daysGrid}
        </div>
      </CardContent>
    </Card>
  );
}
