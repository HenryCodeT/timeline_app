import TimelineItem from "./TimelineItem";

interface ItemWithVisualProps extends TimelineItem {
  width: number;
  left: number;
  duration: number;
  startDay: number;
  endDay: number;
}

export default ItemWithVisualProps;
