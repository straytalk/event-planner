import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CalendarPage from './page';
import '@testing-library/jest-dom';
import { getDummyVotes, VoteEntry } from '@/lib/test-data/sample-votes';

// Mock the current date to have a predictable starting point for tests
beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2025-12-15T12:00:00.000Z'));
});

afterAll(() => {
  jest.useRealTimers();
});

describe('CalendarPage', () => {
  const allDummyVotes = getDummyVotes(); // This might need to be dynamic for voting tests

  it('renders Monthly Calendar title and Enter Vote Mode button initially', () => {
    render(<CalendarPage />);
    expect(screen.getByText('Monthly Calendar')).toBeInTheDocument();
    expect(screen.getByText('Enter Vote Mode')).toBeInTheDocument();
    expect(screen.queryByText('Exit Vote Mode')).not.toBeInTheDocument();
    expect(screen.queryByText('Yes')).not.toBeInTheDocument(); // VotePalette buttons
  });

  it('toggles Vote Mode and displays/hides VotePalette', () => {
    render(<CalendarPage />);
    
    // Enter Vote Mode
    fireEvent.click(screen.getByText('Enter Vote Mode'));
    expect(screen.getByText('Exit Vote Mode')).toBeInTheDocument();
    expect(screen.queryByText('Enter Vote Mode')).not.toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument(); // VotePalette buttons
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('If Need Be')).toBeInTheDocument();

    // Exit Vote Mode
    fireEvent.click(screen.getByText('Exit Vote Mode'));
    expect(screen.getByText('Enter Vote Mode')).toBeInTheDocument();
    expect(screen.queryByText('Exit Vote Mode')).not.toBeInTheDocument();
    expect(screen.queryByText('Yes')).not.toBeInTheDocument();
  });

  it('applies a vote when in vote mode and a day is clicked', async () => {
    render(<CalendarPage />);
    
    // Enter Vote Mode
    fireEvent.click(screen.getByText('Enter Vote Mode'));
    
    // Select 'Yes' vote type
    fireEvent.click(screen.getByText('Yes'));
    
    // Click on a day (e.g., 2025-12-21, which initially has no votes in dummy data)
    const dayToVote = screen.getByRole('button', { name: 'View votes for December 21' });
    fireEvent.click(dayToVote);

    // Expect the day to now be green
    // Re-render the calendar page to ensure the color state is updated
    await waitFor(() => {
      expect(dayToVote).toHaveClass('bg-green-200'); // Check for green color
    });

    // Expect DateCard NOT to appear
    expect(screen.queryByText('2025-12-21')).not.toBeInTheDocument(); // DateCard title
  });

  it('opens DateCard when not in vote mode and a day is clicked', async () => {
    render(<CalendarPage />);
    
    // Ensure not in vote mode (initial state)
    expect(screen.queryByText('Exit Vote Mode')).not.toBeInTheDocument();

    // Click on a day (e.g., 2025-12-18, which has votes)
    const dayToClick = screen.getByRole('button', { name: 'View votes for December 18' });
    fireEvent.click(dayToClick);

    // Expect DateCard to appear
    await waitFor(() => {
      expect(screen.getByText('2025-12-18')).toBeInTheDocument(); // DateCard title
    });
    expect(screen.getByText('No (1)')).toBeInTheDocument(); // Content from DateCard
  });

  it('clears vote mode and selected date when exiting vote mode', async () => {
    render(<CalendarPage />);

    // Enter Vote Mode
    fireEvent.click(screen.getByText('Enter Vote Mode'));
    fireEvent.click(screen.getByText('Yes')); // Select a vote type
    
    // Click a date to select it and trigger vote (also sets selectedDate to null)
    fireEvent.click(screen.getByRole('button', { name: 'View votes for December 22' }));

    // Now exit vote mode
    fireEvent.click(screen.getByText('Exit Vote Mode'));

    // Expect VotePalette to be gone
    expect(screen.queryByText('Yes')).not.toBeInTheDocument();
    // Expect selected date to be cleared (DateCard not visible)
    expect(screen.queryByText('2025-12-22')).not.toBeInTheDocument(); // DateCard title
  });

  it('updates an existing vote for the current user', async () => {
    render(<CalendarPage />);
    const dayToVoteOn = screen.getByRole('button', { name: 'View votes for December 21' });

    // --- First vote: Yes ---
    fireEvent.click(screen.getByText('Enter Vote Mode'));
    fireEvent.click(screen.getByText('Yes'));
    fireEvent.click(dayToVoteOn);
    await waitFor(() => {
      expect(dayToVoteOn).toHaveClass('bg-green-200');
    });

    // --- Second vote: No (should override Yes) ---
    fireEvent.click(screen.getByText('No'));
    fireEvent.click(dayToVoteOn);
    await waitFor(() => {
      expect(dayToVoteOn).toHaveClass('bg-red-200'); // Should now be red
      expect(dayToVoteOn).not.toHaveClass('bg-green-200');
    });
  });

  it('adds a vote to a day with existing votes from other users', async () => {
    render(<CalendarPage />);
    const dayToVoteOn = screen.getByRole('button', { name: 'View votes for December 5' });

    // Day 5 is initially green from PersonP's 'yes' vote
    expect(dayToVoteOn).toHaveClass('bg-green-200');

    // --- Add a 'No' vote from CurrentUser ---
    fireEvent.click(screen.getByText('Enter Vote Mode'));
    fireEvent.click(screen.getByText('No'));
    fireEvent.click(dayToVoteOn);

    // The 'no' vote should have priority, turning the day red
    await waitFor(() => {
      expect(dayToVoteOn).toHaveClass('bg-red-200');
    });
  });
});
