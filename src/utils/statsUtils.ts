import TimelineItem from "@/interfaces/TimelineItem";
import Stats from "@/interfaces/Stats";

/**
 * Calculates timeline statistics such as total items, average duration, and priority distribution.
 * @param {TimelineItem[]} items - The list of timeline items.
 * @returns {Stats} An object containing the calculated statistics.
 */
export const calculateStats = (items: TimelineItem[]): Stats => {
  const totalItems = items.length;
  const avgDuration = totalItems > 0 ? items.reduce((sum, item) => {
    const duration = (new Date(item.end).getTime() - new Date(item.start).getTime()) / (1000 * 60 * 60 * 24) + 1;
    return sum + duration;
  }, 0) / totalItems : 0;

  const priorities = items.reduce((acc: Record<string, number>, item) => {
    acc[item.priority] = (acc[item.priority] || 0) + 1;
    return acc;
  }, {});

  return { totalItems, avgDuration, priorities };
};