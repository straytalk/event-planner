// lib/test-data/sample-votes.ts

/**
 * The core data structure for a single vote entry.
 * Represents a vote by a specific voter for a specific date.
 */
export interface VoteEntry {
  date: string; // YYYY-MM-DD format. TODO: Refactor to use Date objects instead of strings.
  voterName: string;
  response: 'yes' | 'no' | 'if-need-be';
}

// Fixed reference date for generating consistent mock data
const MOCK_DATE = new Date('2025-12-15T12:00:00.000Z');
const year = MOCK_DATE.getFullYear();
const month = String(MOCK_DATE.getMonth() + 1).padStart(2, '0');

/**
 * Returns a static, comprehensive list of all sample vote entries.
 * This serves as the single source of truth for raw mock data.
 */
export function getDummyVotes(): VoteEntry[] {
  return [
    // --- CalendarMonthView specific test cases ---
    // Case 1: Yes, No, If-Need-Be -> Red (priority to 'no')
    { date: `${year}-${month}-01`, voterName: 'PersonA', response: 'yes' },
    { date: `${year}-${month}-01`, voterName: 'PersonB', response: 'no' },
    { date: `${year}-${month}-01`, voterName: 'PersonC', response: 'if-need-be' },

    // Case 2: Yes, No -> Red (priority to 'no')
    { date: `${year}-${month}-02`, voterName: 'PersonD', response: 'yes' },
    { date: `${year}-${month}-02`, voterName: 'PersonE', response: 'no' },

    // Case 3: Yes, If-Need-Be -> Yellow (priority to 'if-need-be')
    { date: `${year}-${month}-03`, voterName: 'PersonF', response: 'yes' },
    { date: `${year}-${month}-03`, voterName: 'PersonG', response: 'if-need-be' },

    // Case 4: Multiple Yes -> Green
    { date: `${year}-${month}-04`, voterName: 'PersonH', response: 'yes' },
    { date: `${year}-${month}-04`, voterName: 'PersonI', response: 'yes' },

    // Original simple Green day
    { date: `${year}-${month}-05`, voterName: 'PersonP', response: 'yes' },
    // Original simple Yellow day
    { date: `${year}-${month}-12`, voterName: 'PersonQ', response: 'if-need-be' },
    // Original simple Red day
    { date: `${year}-${month}-18`, voterName: 'PersonR', response: 'no' },

    // --- DateCard specific sample data ---
    { date: '2025-12-20', voterName: 'PersonJ', response: 'yes' },
    { date: '2025-12-20', voterName: 'PersonK', response: 'yes' },
    { date: '2025-12-20', voterName: 'PersonL', response: 'if-need-be' },
    { date: '2025-12-20', voterName: 'PersonM', response: 'no' },
    { date: '2025-12-20', voterName: 'PersonN', response: 'yes' },
    { date: '2025-12-20', voterName: 'PersonO', response: 'if-need-be' },
  ];
}
