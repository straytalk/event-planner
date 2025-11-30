import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface VoterResponse {
  name: string;
  response: 'yes' | 'no' | 'if-need-be';
}

export interface DateCardProps {
  date: string;
  responses: VoterResponse[];
}

export function DateCard({ date, responses }: DateCardProps) {
  const getResponseColor = (response: VoterResponse['response']) => {
    switch (response) {
      case 'yes':
        return 'text-green-600';
      case 'if-need-be':
        return 'text-yellow-600';
      case 'no':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const yesVotes = responses.filter((r) => r.response === 'yes');
  const noVotes = responses.filter((r) => r.response === 'no');
  const ifNeedBeVotes = responses.filter((r) => r.response === 'if-need-be');

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{date}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="font-bold mb-2">Yes ({yesVotes.length})</h3>
          <ul>
            {yesVotes.map((voter) => (
              <li key={voter.name} className={getResponseColor(voter.response)}>
                {voter.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">If Need Be ({ifNeedBeVotes.length})</h3>
          <ul>
            {ifNeedBeVotes.map((voter) => (
              <li key={voter.name} className={getResponseColor(voter.response)}>
                {voter.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">No ({noVotes.length})</h3>
          <ul>
            {noVotes.map((voter) => (
              <li key={voter.name} className={getResponseColor(voter.response)}>
                {voter.name}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
