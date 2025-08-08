import { useState } from 'react';
import React from 'react';
import TimelineItem from '@/interfaces/TimelineItem';
import ItemWithVisualProps from '@/interfaces/ItemWithVisualProps';

interface UseTimelineInteractionsProps {
  setItems: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
  timelineStartDate: Date;
  zoomLevel: number;
  dayWidth: number;
}

// ⚠️ MODIFICATION HERE: Change the type of timelineRef to include null
interface UseTimelineInteractionsReturn {
  editingItemId: number | null;
  setEditingItemId: React.Dispatch<React.SetStateAction<number | null>>;
  hoveredItem: ItemWithVisualProps | null;
  tooltipPos: { x: number; y: number };
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>, id: number, dateType: 'start' | 'end') => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, timelineRef: React.RefObject<HTMLDivElement | null>) => void;
  handleHover: (item: ItemWithVisualProps, e: React.MouseEvent<HTMLDivElement>) => void;
  handleHoverEnd: () => void;
}

export const useTimelineInteractions = ({ setItems, timelineStartDate, zoomLevel, dayWidth }: UseTimelineInteractionsProps): UseTimelineInteractionsReturn => {
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<ItemWithVisualProps | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const newName = e.target.value;
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, name: newName } : item
      )
    );
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, id: number, dateType: 'start' | 'end') => {
    const newDate = e.target.value;
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, [dateType]: newDate } : item
      )
    );
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.setData("text/plain", id.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  // ⚠️ MODIFICATION HERE: Change the parameter type to accept null
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, timelineRef: React.RefObject<HTMLDivElement | null>) => {
    e.preventDefault();
    if (!timelineRef.current) return;

    const droppedItemId = parseInt(e.dataTransfer.getData("text/plain"));
    const rect = timelineRef.current.getBoundingClientRect();
    const dropX = e.clientX - rect.left;

    const newStartDay = Math.floor(dropX / (dayWidth * zoomLevel));

    const newStartDate = new Date(timelineStartDate);
    newStartDate.setDate(timelineStartDate.getDate() + newStartDay);

    setItems(prevItems => prevItems.map(item => {
      if (item.id === droppedItemId) {
        const duration = Math.floor((new Date(item.end).getTime() - new Date(item.start).getTime()) / (1000 * 60 * 60 * 24));
        const newEndDate = new Date(newStartDate);
        newEndDate.setDate(newStartDate.getDate() + duration);
        return {
          ...item,
          start: newStartDate.toISOString().split('T')[0],
          end: newEndDate.toISOString().split('T')[0],
        };
      }
      return item;
    }));
  };

  const handleHover = (item: ItemWithVisualProps, e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredItem(item);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleHoverEnd = () => {
    setHoveredItem(null);
  };

  return {
    editingItemId,
    setEditingItemId,
    hoveredItem,
    tooltipPos,
    handleNameChange,
    handleDateChange,
    handleDragStart,
    handleDrop,
    handleHover,
    handleHoverEnd,
  };
};