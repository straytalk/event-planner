import { render, screen, fireEvent } from '@testing-library/react';
import { VotePalette } from './VotePalette';
import '@testing-library/jest-dom';

describe('VotePalette', () => {
  const onVoteModeChange = jest.fn();

  beforeEach(() => {
    onVoteModeChange.mockClear();
  });

  it('renders all vote buttons', () => {
    render(<VotePalette currentVoteMode="notEnabled" onVoteModeChange={onVoteModeChange} />);
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('If Need Be')).toBeInTheDocument();
  });

  it('calls onVoteModeChange with "yes" when Yes button is clicked', () => {
    render(<VotePalette currentVoteMode="notEnabled" onVoteModeChange={onVoteModeChange} />);
    fireEvent.click(screen.getByText('Yes'));
    expect(onVoteModeChange).toHaveBeenCalledTimes(1);
    expect(onVoteModeChange).toHaveBeenCalledWith('yes');
  });

  it('calls onVoteModeChange with "no" when No button is clicked', () => {
    render(<VotePalette currentVoteMode="notEnabled" onVoteModeChange={onVoteModeChange} />);
    fireEvent.click(screen.getByText('No'));
    expect(onVoteModeChange).toHaveBeenCalledTimes(1);
    expect(onVoteModeChange).toHaveBeenCalledWith('no');
  });

  it('calls onVoteModeChange with "if-need-be" when If Need Be button is clicked', () => {
    render(<VotePalette currentVoteMode="notEnabled" onVoteModeChange={onVoteModeChange} />);
    fireEvent.click(screen.getByText('If Need Be'));
    expect(onVoteModeChange).toHaveBeenCalledTimes(1);
    expect(onVoteModeChange).toHaveBeenCalledWith('if-need-be');
  });

  it('highlights the "Yes" button when currentVoteMode is "yes"', () => {
    render(<VotePalette currentVoteMode="yes" onVoteModeChange={onVoteModeChange} />);
    const yesButton = screen.getByText('Yes');
    expect(yesButton).toHaveClass('bg-green-500');
    expect(yesButton).not.toHaveClass('border'); // It should not have a border when selected as default variant
  });

  it('highlights the "No" button when currentVoteMode is "no"', () => {
    render(<VotePalette currentVoteMode="no" onVoteModeChange={onVoteModeChange} />);
    const noButton = screen.getByText('No');
    expect(noButton).toHaveClass('bg-red-500');
    expect(noButton).not.toHaveClass('border');
  });

  it('highlights the "If Need Be" button when currentVoteMode is "if-need-be"', () => {
    render(<VotePalette currentVoteMode="if-need-be" onVoteModeChange={onVoteModeChange} />);
    const ifNeedBeButton = screen.getByText('If Need Be');
    expect(ifNeedBeButton).toHaveClass('bg-yellow-500');
    expect(ifNeedBeButton).not.toHaveClass('border');
  });

  it('does not highlight buttons when currentVoteMode is "notEnabled"', () => {
    render(<VotePalette currentVoteMode="notEnabled" onVoteModeChange={onVoteModeChange} />);
    const yesButton = screen.getByText('Yes');
    const noButton = screen.getByText('No');
    const ifNeedBeButton = screen.getByText('If Need Be');

    expect(yesButton).toHaveClass('border');
    expect(yesButton).not.toHaveClass('bg-green-500');

    expect(noButton).toHaveClass('border');
    expect(noButton).not.toHaveClass('bg-red-500');

    expect(ifNeedBeButton).toHaveClass('border');
    expect(ifNeedBeButton).not.toHaveClass('bg-yellow-500');
  });
});
