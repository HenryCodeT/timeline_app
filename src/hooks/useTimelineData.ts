// src/hooks/useTimelineData.ts

import { useState, useMemo } from 'react';
import TimelineItem from '@/interfaces/TimelineItem';
import timelineItems from '@/data/timelineItems';

interface UseTimelineDataReturn {
  items: TimelineItem[];
  setItems: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
  selectedPriority: 'all' | 'high' | 'medium' | 'low';
  setSelectedPriority: React.Dispatch<React.SetStateAction<'all' | 'high' | 'medium' | 'low'>>;
  filteredItems: TimelineItem[];
  timelineStartDate: Date;
  timelineEndDate: Date;
  totalDays: number;
}

export const useTimelineData = (): UseTimelineDataReturn => {
  const [items, setItems] = useState<TimelineItem[]>(timelineItems);
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const { timelineStartDate, timelineEndDate, totalDays, filteredItems } = useMemo(() => {
    const filtered = selectedPriority === 'all'
      ? items
      : items.filter(item => item.priority === selectedPriority);

    const allDates = filtered.flatMap(item => [new Date(item.start), new Date(item.end)]);
    const startDate = allDates.length > 0 ? new Date(Math.min(...allDates.map(d => d.getTime()))) : new Date();
    const maxEndDate = allDates.length > 0 ? new Date(Math.max(...allDates.map(d => d.getTime()))) : new Date();
    const endDate = new Date(maxEndDate);
    endDate.setDate(endDate.getDate() + 5);

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return {
      timelineStartDate: startDate,
      timelineEndDate: endDate,
      totalDays: days,
      filteredItems: filtered
    };
  }, [items, selectedPriority]);

  return {
    items,
    setItems,
    selectedPriority,
    setSelectedPriority,
    filteredItems,
    timelineStartDate,
    timelineEndDate,
    totalDays,
  };
};