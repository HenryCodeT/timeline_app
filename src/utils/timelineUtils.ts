import TimelineItem from "@/interfaces/TimelineItem";

/**
 * Assigns timeline items to lanes using a First-Fit Greedy algorithm.
 * This function places each item into the first available lane where it doesn't overlap with existing items.
 * @param {TimelineItem[]} items - The list of timeline items.
 * @returns {TimelineItem[][]} A 2D array of lanes with their assigned items.
 */
export function assignLanes(items: TimelineItem[]): TimelineItem[][] {
  const sortedItems = [...items].sort((a, b) =>
    new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const lanes: TimelineItem[][] = [];

  function assignItemToLane(item: TimelineItem) {
    for (const lane of lanes) {
      if (new Date(lane[lane.length - 1].end) < new Date(item.start)) {
        lane.push(item);
        return;
      }
    }
    lanes.push([item]);
  }

  for (const item of sortedItems) {
    assignItemToLane(item);
  }

  return lanes;
}

/**
 * Formats a date for display.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Returns a CSS class for priority-based coloring, ensuring consistency.
 * @param {TimelineItem['priority']} priority - The item's priority.
 * @returns {string} The Tailwind CSS class string.
 */
export const getPriorityColor = (priority: TimelineItem['priority']): string => {
  const colors: Record<TimelineItem['priority'], string> = {
    high: 'bg-rose-600 hover:bg-rose-500',
    medium: 'bg-amber-500 hover:bg-amber-400',
    low: 'bg-emerald-600 hover:bg-emerald-500'
  };
  return colors[priority] || 'bg-blue-600 hover:bg-blue-500';
};