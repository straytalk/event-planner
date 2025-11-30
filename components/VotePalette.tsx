'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Assuming cn for conditional class merging

type VoteOption = 'yes' | 'no' | 'if-need-be';
type VoteMode = VoteOption | 'notEnabled';

interface VotePaletteProps {
  currentVoteMode: VoteMode;
  onVoteModeChange: (mode: VoteOption) => void;
}

export function VotePalette({ currentVoteMode, onVoteModeChange }: VotePaletteProps) {
  const renderButton = (mode: VoteOption, label: string) => (
    <Button
      key={mode}
      variant={currentVoteMode === mode ? 'default' : 'outline'}
      onClick={() => onVoteModeChange(mode)}
      className={cn(
        'w-24', // Fixed width for consistent sizing
        {
          'bg-green-500 hover:bg-green-600': mode === 'yes' && currentVoteMode === 'yes',
          'bg-red-500 hover:bg-red-600': mode === 'no' && currentVoteMode === 'no',
          'bg-yellow-500 hover:bg-yellow-600': mode === 'if-need-be' && currentVoteMode === 'if-need-be',
        }
      )}
    >
      {label}
    </Button>
  );

  return (
    <div className="flex gap-2 p-2 border rounded-md">
      {renderButton('yes', 'Yes')}
      {renderButton('if-need-be', 'If Need Be')}
      {renderButton('no', 'No')}
    </div>
  );
}
