import TimelineItem from "@/interfaces/TimelineItem";

function assignLanes(items: TimelineItem[]): TimelineItem[][] {
  // First, sort the items by their start date to process them in order.
  const sortedItems = [...items].sort((a, b) =>
    new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const lanes: TimelineItem[][] = [];

  /**
   * Attempts to assign a single item to the first available lane.
   * A lane is available if the previous item in that lane ends before
   * the new item begins.
   */
  function assignItemToLane(item: TimelineItem) {
    for (const lane of lanes) {
      // Check if the end of the last item in the lane is earlier than the new item's start.
      if (new Date(lane[lane.length - 1].end) < new Date(item.start)) {
        lane.push(item);
        return;
      }
    }
    // If no available lane was found, create a new one.
    lanes.push([item]);
  }

  // Iterate over the sorted items and assign each one to a lane.
  for (const item of sortedItems) {
    assignItemToLane(item);
  }
  
  return lanes;
}

export default assignLanes;
