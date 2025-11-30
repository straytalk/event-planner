import { DateCard, VoterResponse } from "@/components/date-card";

export default function Home() {
  // Sample data for demonstration
  const sampleResponses: VoterResponse[] = [
    { name: "Alice", response: "yes" },
    { name: "Bob", response: "yes" },
    { name: "Charlie", response: "if-need-be" },
    { name: "Diana", response: "no" },
    { name: "Ethan", response: "yes" },
    { name: "Fiona", response: "if-need-be" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-50 dark:bg-black">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Proposed Dates</h1>
      </div>
      <DateCard date="December 20, 2025" responses={sampleResponses} />
    </main>
  );
}
