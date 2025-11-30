import { render, screen } from '@testing-library/react';
import { DateCard, VoterResponse } from './date-card';
import '@testing-library/jest-dom';

describe('DateCard', () => {
  const sampleResponses: VoterResponse[] = [
    { name: 'Alice', response: 'yes' },
    { name: 'Bob', response: 'if-need-be' },
    { name: 'Charlie', response: 'no' },
    { name: 'David', response: 'no' },
  ];

  it('renders the date correctly', () => {
    render(<DateCard date="December 25, 2025" responses={sampleResponses} />);
    expect(screen.getByText('December 25, 2025')).toBeInTheDocument();
  });

  it('renders the "Yes" voters', () => {
    render(<DateCard date="test-date" responses={sampleResponses} />);
    const yesColumn = screen.getByText(/Yes/).closest('div');
    expect(yesColumn).toHaveTextContent('Alice');
    expect(yesColumn).not.toHaveTextContent('Bob');
    expect(yesColumn).not.toHaveTextContent('Charlie');
    expect(yesColumn).not.toHaveTextContent('David');
  });

  it('renders the "If Need Be" voters', () => {
    render(<DateCard date="test-date" responses={sampleResponses} />);
    const ifNeedBeColumn = screen.getByText(/If Need Be/).closest('div');
    expect(ifNeedBeColumn).toHaveTextContent('Bob');
    expect(ifNeedBeColumn).not.toHaveTextContent('Alice');
    expect(ifNeedBeColumn).not.toHaveTextContent('Charlie');
    expect(ifNeedBeColumn).not.toHaveTextContent('David');
  });

  it('renders the "No" voters', () => {
    render(<DateCard date="test-date" responses={sampleResponses} />);
    const noColumn = screen.getByText(/No/).closest('div');
    expect(noColumn).toHaveTextContent('Charlie');
    expect(noColumn).toHaveTextContent('David'); 
    expect(noColumn).not.toHaveTextContent('Alice');
    expect(noColumn).not.toHaveTextContent('Bob');
  });

  it('displays the correct counts for each response', () => {
    render(<DateCard date="test-date" responses={sampleResponses} />);
    expect(screen.getByText(/Yes \(1\)/)).toBeInTheDocument();
    expect(screen.getByText(/If Need Be \(1\)/)).toBeInTheDocument();
    expect(screen.getByText(/No \(2\)/)).toBeInTheDocument();
  });
});
