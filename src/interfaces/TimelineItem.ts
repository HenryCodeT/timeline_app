interface TimelineItem {
  id: number;
  start: string;
  end: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
}
export default TimelineItem;