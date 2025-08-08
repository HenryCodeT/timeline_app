// src/hooks/useTimelineLayout.ts

import { useMemo } from 'react';
import TimelineItem from '@/interfaces/TimelineItem';
import ItemWithVisualProps from '@/interfaces/ItemWithVisualProps';
import { assignLanes } from '@/utils/timelineUtils';

interface UseTimelineLayoutProps {
  filteredItems: TimelineItem[];
  timelineStartDate: Date;
  totalDays: number;
  timelineEndDate: Date;
  zoomLevel: number;
  dayWidth: number;
}

interface DateLabel {
  date: Date;
  position: number;
}

interface UseTimelineLayoutReturn {
  lanes: ItemWithVisualProps[][];
  dateLabels: DateLabel[];
}

export const useTimelineLayout = ({
  filteredItems,
  timelineStartDate,
  totalDays,
  timelineEndDate,
  zoomLevel,
  dayWidth
}: UseTimelineLayoutProps): UseTimelineLayoutReturn => {

  const lanes = useMemo(() => {
    const basicLanes = assignLanes(filteredItems);

    return basicLanes.map(lane =>
      lane.map(item => {
        const startDay = Math.floor((new Date(item.start).getTime() - timelineStartDate.getTime()) / (1000 * 60 * 60 * 24));
        const endDay = Math.floor((new Date(item.end).getTime() - timelineStartDate.getTime()) / (1000 * 60 * 60 * 24));
        const duration = endDay - startDay + 1;

        const width = duration * dayWidth * zoomLevel;
        const left = startDay * dayWidth * zoomLevel;

        return {
          ...item,
          width,
          left,
          duration,
          startDay,
          endDay
        };
      })
    );
  }, [filteredItems, timelineStartDate, zoomLevel, dayWidth]);

  const dateLabels = useMemo(() => {
    const labels = [];
    const date = new Date(timelineStartDate);
    const dayInterval = 7;

    for (let i = 0; i < totalDays; i += dayInterval) {
      const currentDate = new Date(date);
      currentDate.setDate(date.getDate() + i);
      labels.push({
        date: currentDate,
        position: i * dayWidth * zoomLevel,
      });
    }

    const lastDate = new Date(timelineEndDate);
    const lastDayIndex = Math.floor((lastDate.getTime() - timelineStartDate.getTime()) / (1000 * 60 * 60 * 24));

    if (totalDays > 0 && labels.length > 0 && lastDayIndex > labels[labels.length - 1].position / (dayWidth * zoomLevel) + dayInterval / 2) {
      labels.push({
        date: lastDate,
        position: lastDayIndex * dayWidth * zoomLevel,
      });
    }

    return labels;
  }, [timelineStartDate, totalDays, zoomLevel, timelineEndDate, dayWidth]);

  return { lanes, dateLabels };
};