import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarMonthView, MonthlyVotes, VoterResponse } from './calendar-month-view'; // Import MonthlyVotes and VoterResponse from component
import '@testing-library/jest-dom';
import { getDummyVotes, VoteEntry } from '@/lib/test-data/sample-votes'; // Import getDummyVotes and VoteEntry

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

// Mock the current date to have a predictable starting point for tests
beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2025-12-15T12:00:00.000Z'));
});

afterAll(() => {
  jest.useRealTimers();
});

describe('CalendarMonthView', () => {
  const allDummyVotes = getDummyVotes();
  const sampleMonthlyVotes = transformVoteEntriesToMonthlyVotes(allDummyVotes);

  it('renders the correct initial month and year', () => {
    render(<CalendarMonthView allVoteEntries={allDummyVotes} />);
    expect(screen.getByText('December 2025')).toBeInTheDocument();
  });

  it('navigates to the next month', () => {
    render(<CalendarMonthView allVoteEntries={allDummyVotes} />);
    fireEvent.click(screen.getByText('>'));
    expect(screen.getByText('January 2026')).toBeInTheDocument();
  });

  it('navigates to the previous month', () => {
    render(<CalendarMonthView allVoteEntries={allDummyVotes} />);
    fireEvent.click(screen.getByText('<'));
    expect(screen.getByText('November 2025')).toBeInTheDocument();
  });

  it('applies a neutral color for a day with no votes', () => {
    render(<CalendarMonthView allVoteEntries={allDummyVotes} />);
    // Day 10 has no votes in December in our dummy data
    const dayElement = screen.getByText('10').closest('div');
    expect(dayElement).toHaveClass('bg-transparent');
  });

  it('applies a green color for a day with all "yes" votes', () => {
    render(<CalendarMonthView allVoteEntries={allDummyVotes} />);
    const dayElement = screen.getByText('5').closest('div');
    expect(dayElement).toHaveClass('bg-green-200');
  });

  it('applies a yellow color for a day with "if-need-be" votes', () => {
    render(<CalendarMonthView allVoteEntries={allDummyVotes} />);
    const dayElement = screen.getByText('12').closest('div');
    expect(dayElement).toHaveClass('bg-yellow-200');
  });

  it('applies a red color for a day with "no" votes', () => {
    render(<CalendarMonthView allVoteEntries={allDummyVotes} />);
    const dayElement = screen.getByText('18').closest('div');
    expect(dayElement).toHaveClass('bg-red-200');
  });

  // New test cases for color priority
  it('applies red for a day with yes, no, and if-need-be votes (Day 1)', () => {
    render(<CalendarMonthView allVoteEntries={allDummyVotes} />);
    const dayElement = screen.getByText('1').closest('div');
    expect(dayElement).toHaveClass('bg-red-200');
  });

  it('applies red for a day with yes and no votes (Day 2)', () => {
    render(<CalendarMonthView allVoteEntries={allDummyVotes} />);
    const dayElement = screen.getByText('2').closest('div');
    expect(dayElement).toHaveClass('bg-red-200');
  });

  it('applies yellow for a day with yes and if-need-be votes (Day 3)', () => {
    render(<CalendarMonthView allVoteEntries={allDummyVotes} />);
    const dayElement = screen.getByText('3').closest('div');
    expect(dayElement).toHaveClass('bg-yellow-200');
  });

  it('applies green for a day with multiple yes votes (Day 4)', () => {
    render(<CalendarMonthView allVoteEntries={allDummyVotes} />);
    const dayElement = screen.getByText('4').closest('div');
    expect(dayElement).toHaveClass('bg-green-200');
  });

  it('retains colors after navigating to a different month and back', () => {
    render(<CalendarMonthView allVoteEntries={allDummyVotes} />);
    
    // Navigate away
    fireEvent.click(screen.getByText('<'));
    expect(screen.getByText('November 2025')).toBeInTheDocument();
    
    // Navigate back
    fireEvent.click(screen.getByText('>'));
    expect(screen.getByText('December 2025')).toBeInTheDocument();

    // Check if colors are still applied
    const dayElement = screen.getByText('18').closest('div');
    expect(dayElement).toHaveClass('bg-red-200');
  });
});
