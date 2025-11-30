import { render, screen } from '@testing-library/react';
import { DateCard, VoterResponse } from './date-card'; // Import VoterResponse from component
import '@testing-library/jest-dom';
import { getDummyVotes, VoteEntry } from '@/lib/test-data/sample-votes'; // Import getDummyVotes and VoteEntry

// Helper to get VoterResponse[] for a specific date from raw VoteEntry[]
function getVoterResponsesForDate(votes: VoteEntry[], date: string): VoterResponse[] {
  return votes
    .filter((vote) => vote.date === date)
    .map((vote) => ({ name: vote.voterName, response: vote.response }));
}

describe('DateCard', () => {
  // Use a fixed date for the DateCard tests
  const CARD_DATE = '2025-12-20';
  const allDummyVotes = getDummyVotes();
  const sampleResponses = getVoterResponsesForDate(allDummyVotes, CARD_DATE);

  it('renders the date correctly', () => {
    render(<DateCard date={CARD_DATE} responses={sampleResponses} />);
    expect(screen.getByText(CARD_DATE)).toBeInTheDocument();
  });

  it('renders the "Yes" voters', () => {
    render(<DateCard date={CARD_DATE} responses={sampleResponses} />);
    const yesColumn = screen.getByText(/Yes/).closest('div');
    expect(yesColumn).toHaveTextContent('PersonJ');
    expect(yesColumn).toHaveTextContent('PersonK');
    expect(yesColumn).toHaveTextContent('PersonN');
    expect(yesColumn).not.toHaveTextContent('PersonL');
    expect(yesColumn).not.toHaveTextContent('PersonM');
    expect(yesColumn).not.toHaveTextContent('PersonO');
  });

  it('renders the "If Need Be" voters', () => {
    render(<DateCard date={CARD_DATE} responses={sampleResponses} />);
    const ifNeedBeColumn = screen.getByText(/If Need Be/).closest('div');
    expect(ifNeedBeColumn).toHaveTextContent('PersonL');
    expect(ifNeedBeColumn).toHaveTextContent('PersonO');
    expect(ifNeedBeColumn).not.toHaveTextContent('PersonJ');
    expect(ifNeedBeColumn).not.toHaveTextContent('PersonK');
    expect(ifNeedBeColumn).not.toHaveTextContent('PersonM');
    expect(ifNeedBeColumn).not.toHaveTextContent('PersonN');
  });

  it('renders the "No" voters', () => {
    render(<DateCard date={CARD_DATE} responses={sampleResponses} />);
    const noColumn = screen.getByText(/No/).closest('div');
    expect(noColumn).toHaveTextContent('PersonM');
    expect(noColumn).not.toHaveTextContent('PersonJ');
    expect(noColumn).not.toHaveTextContent('PersonK');
    expect(noColumn).not.toHaveTextContent('PersonL');
    expect(noColumn).not.toHaveTextContent('PersonN');
    expect(noColumn).not.toHaveTextContent('PersonO');
  });

  it('displays the correct counts for each response', () => {
    render(<DateCard date={CARD_DATE} responses={sampleResponses} />);
    expect(screen.getByText(/Yes \(3\)/)).toBeInTheDocument();
    expect(screen.getByText(/If Need Be \(2\)/)).toBeInTheDocument();
    expect(screen.getByText(/No \(1\)/)).toBeInTheDocument();
  });
});
