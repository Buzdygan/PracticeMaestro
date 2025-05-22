import { PracticeItem, DEFAULT_INTERVALS } from '../types';
import { updatePracticeItem } from '../firebase/firestore';

/**
 * Calculate the next due date based on the interval stage
 * @param intervalStage Current interval stage
 * @param intervals Array of intervals in days
 * @returns Date when the item is next due
 */
export const calculateNextDue = (
  intervalStage: number,
  intervals: number[] = DEFAULT_INTERVALS
): Date => {
  const now = new Date();
  
  if (intervalStage >= intervals.length) {
    // If beyond the final stage, use the last interval
    const days = intervals[intervals.length - 1] || 30; // Default to 30 days if undefined
    return new Date(now.setDate(now.getDate() + days));
  }
  
  const days = intervals[intervalStage] || 1; // Default to 1 day if undefined
  return new Date(now.setDate(now.getDate() + days));
};

/**
 * Update a practice item's progress based on session outcome
 * @param itemId Practice item ID
 * @param status Session outcome (completed, struggled, skipped)
 * @param intervals Array of intervals in days
 * @returns Updated practice item
 */
export const updateItemProgress = async (
  itemId: string,
  status: 'completed' | 'struggled' | 'skipped',
  intervals: number[] = DEFAULT_INTERVALS
): Promise<Partial<PracticeItem>> => {
  const now = new Date();
  let newIntervalStage: number;
  
  switch (status) {
    case 'completed':
      // Move to next box
      newIntervalStage = 1; // Start at first box for new items
      break;
    case 'struggled':
      // Move back to first box
      newIntervalStage = 0;
      break;
    case 'skipped':
      // Keep in current box
      newIntervalStage = 0;
      break;
    default:
      newIntervalStage = 0;
  }
  
  const nextDue = calculateNextDue(newIntervalStage, intervals);
  
  const updates: Partial<PracticeItem> = {
    lastPracticed: now,
    intervalStage: newIntervalStage,
    nextDue
  };
  
  return updatePracticeItem(itemId, updates);
};

/**
 * Generate a daily practice plan based on due items
 * @param items Array of practice items
 * @param maxItems Maximum number of items to include in plan
 * @returns Array of practice items for the daily plan
 */
export const generateDailyPlan = (
  items: PracticeItem[],
  maxItems: number = 10
): PracticeItem[] => {
  // Sort items by due date (ascending)
  const sortedItems = [...items].sort((a, b) => {
    const dateA = a.nextDue || new Date(0);
    const dateB = b.nextDue || new Date(0);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Take up to maxItems
  return sortedItems.slice(0, maxItems);
}; 