'use client';

import React, { useState, FC, useRef, useMemo } from 'react';
import { ZoomIn, Play, Pause, BarChart3, Clock } from 'lucide-react';
import ItemWithVisualProps from '@/interfaces/ItemWithVisualProps';
import { formatDate, getPriorityColor } from '@/utils/timelineUtils';
import { calculateStats } from '@/utils/statsUtils';

import { useTimelineData } from '@/hooks/useTimelineData';
import { useTimelineLayout } from '@/hooks/useTimelineLayout';
import { useTimelinePlayback } from '@/hooks/useTimelinePlayback';
import { useTimelineInteractions } from '@/hooks/useTimelineInteractions';

const Home: FC = () => {
  // useRef is used to get a reference to a DOM element, in this case, the timeline container.
  const timelineRef= useRef<HTMLDivElement>(null);
  // dayWidth defines the visual width of a single day on the timeline.
  const dayWidth: number = 40;
  // useState hooks to manage the zoom level and the visibility of the stats panel.
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showStats, setShowStats] = useState<boolean>(false);

  // Custom hooks encapsulate logic for different parts of the component.
  // useTimelineData handles all the timeline's data management.
  const {
    items,
    setItems,
    selectedPriority,
    setSelectedPriority,
    filteredItems,
    timelineStartDate,
    timelineEndDate,
    totalDays,
  } = useTimelineData();

  // useTimelineLayout calculates the visual layout, like lane assignments and date labels.
  const {
    lanes,
    dateLabels,
  } = useTimelineLayout({
    filteredItems,
    timelineStartDate,
    totalDays,
    timelineEndDate,
    zoomLevel,
    dayWidth
  });

  // useTimelinePlayback manages the animation and state for the timeline's playback feature.
  const {
    isPlaying,
    currentDay,
    togglePlayback,
  } = useTimelinePlayback(totalDays);

  // useTimelineInteractions centralizes all user interaction logic (drag, drop, hover, edit).
  const {
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
  } = useTimelineInteractions({
    setItems,
    timelineStartDate,
    zoomLevel,
    dayWidth
  });

  // useMemo is used to memoize expensive calculations.
  // This memoizes the statistics calculation, so it only re-runs when `filteredItems` changes.
  const stats = useMemo(() => calculateStats(filteredItems), [filteredItems]);
  // This memoizes a sorted version of the items, preventing re-sorting on every render.
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }, [items]);

  // JSX for the component's UI.
  return (
    // Main container with Tailwind CSS classes for styling.
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-gray-200 p-4 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Interactive Algorithmic Timeline
          </h1>
          <p className="text-gray-400 text-lg">
            Optimized visualization with advanced lane assignment algorithms
          </p>
        </div>

        {/* App Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Zoom Control Section */}
          <div className="bg-slate-800 p-4 rounded-xl shadow-md border border-slate-700 hidden md:block">
            <div className="flex items-center gap-2 mb-2">
              <ZoomIn className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-gray-200">Zoom Level</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Range input for controlling the zoom level */}
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4"
              />
              <span className="text-sm text-gray-400 w-12">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>
          </div>

          {/* Priority Filter Control Section */}
          <div className="bg-slate-800 p-4 rounded-xl shadow-md border border-slate-700 hidden md:block">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-gray-200">Priority Filter</span>
            </div>
            {/* Select dropdown for filtering items by priority. */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as 'all' | 'high' | 'medium' | 'low')}
              className="w-full p-2 border border-slate-700 rounded-lg text-sm bg-slate-900 text-gray-200 focus:ring focus:ring-emerald-400 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Timeline Playback Control Section */}
          <div className="bg-slate-800 p-4 rounded-xl shadow-md border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-fuchsia-400" />
              <span className="font-semibold text-gray-200">Timeline Playback</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Button to toggle playback (play/pause). */}
              <button
                onClick={togglePlayback}
                className="flex items-center gap-1 px-3 py-1 bg-fuchsia-900/40 hover:bg-fuchsia-800/60 text-fuchsia-300 rounded-lg transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="text-sm">{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>
          </div>

          {/* Analytics/Stats Button Section */}
          <div className="bg-slate-800 p-4 rounded-xl shadow-md border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-gray-200">Analytics</span>
            </div>
            {/* Button to toggle the visibility of the stats panel. */}
            <button
              onClick={() => setShowStats(!showStats)}
              className="w-full px-3 py-1 bg-amber-900/40 hover:bg-amber-800/60 text-amber-300 rounded-lg transition-colors text-sm"
            >
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
          </div>
        </div>

        {/* Statistics Panel, conditionally rendered based on `showStats` state. */}
        {showStats && (
          <div className="bg-slate-800 p-6 rounded-xl shadow-md border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Algorithmic Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Display key statistics from the `stats` object. */}
              <div className="text-center p-3 bg-cyan-900/40 rounded-lg">
                <div className="text-2xl font-bold text-cyan-300">{stats.totalItems}</div>
                <div className="text-sm text-gray-400">Total Tasks</div>
              </div>
              <div className="text-center p-3 bg-emerald-900/40 rounded-lg">
                <div className="text-2xl font-bold text-emerald-300">{lanes.length}</div>
                <div className="text-sm text-gray-400">Lanes Used</div>
              </div>
              <div className="text-center p-3 bg-fuchsia-900/40 rounded-lg">
                <div className="text-2xl font-bold text-fuchsia-300">{Math.round(stats.avgDuration)}</div>
                <div className="text-sm text-gray-400">Avg Duration (days)</div>
              </div>
              <div className="text-center p-3 bg-amber-900/40 rounded-lg">
                <div className="text-2xl font-bold text-amber-300">{lanes.length > 0 ? Math.round((stats.totalItems / lanes.length) * 10) / 10 : 0}</div>
                <div className="text-sm text-gray-400">Packing Efficiency</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <span className="font-semibold text-gray-200">Priority Distribution:</span>
              <span className="ml-2 text-rose-500">High: {stats.priorities.high || 0}</span>
              <span className="ml-2 text-amber-400">Medium: {stats.priorities.medium || 0}</span>
              <span className="ml-2 text-emerald-500">Low: {stats.priorities.low || 0}</span>
            </div>
          </div>
        )}

        {/* Main Timeline (Desktop View) */}
        {/* The timeline is hidden on mobile devices. */}
        <div className='w-full overflow-x-auto hidden md:block'>
          <div
            ref={timelineRef}
            className="relative bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700"
            style={{
              // Dynamically sets the timeline's width and height based on data and zoom.
              width: `${(totalDays * dayWidth * zoomLevel)}px`,
              minHeight: `${lanes.length * 60 + 100}px`
            }}
            // Event handlers for drag and drop functionality.
            onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, timelineRef)}
            onDragOver={(e) => e.preventDefault()}
          >
            {/* Timeline Header with Date Labels */}
            <div className="absolute top-0 left-0 w-full h-12 border-b border-slate-700 bg-slate-900">
              {dateLabels.map((label, i) => (
                <div
                  key={i}
                  className="absolute text-xs text-gray-400 font-medium px-2 py-2"
                  style={{ left: `${label.position}px` }}
                >
                  {formatDate(label.date)}
                </div>
              ))}
            </div>

            {/* Playback Indicator Line */}
            {/* The line shows the current day during playback. */}
            {(isPlaying || currentDay > 0) && (
              <div
                className="absolute top-12 bottom-0 w-0.5 bg-rose-500 opacity-70 z-20 transition-all duration-100"
                style={{ left: `${(currentDay * dayWidth * zoomLevel)}px` }}
              />
            )}

            {/* Timeline Lanes and Items */}
            <div className="relative mt-12 space-y-3">
              {lanes.map((lane, laneIndex) => (
                <div
                  key={laneIndex}
                  className={`flex items-center h-12 group relative rounded-lg px-2 border border-slate-700 ${laneIndex % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800'}`}
                >
                  <div className="absolute -left-16 text-xs text-gray-500 font-medium">
                    Lane {laneIndex + 1}
                  </div>
                  <div className="relative h-full w-full">
                    {lane.map((item) => {
                      const isActive = currentDay >= item.startDay && currentDay <= item.endDay;
                      return (
                        <div
                          key={item.id}
                          className={`absolute h-10 flex items-center px-3 rounded-lg cursor-pointer shadow-sm transition-all duration-200 text-white text-sm font-medium z-10 ${getPriorityColor(item.priority)} ${isActive ? 'ring-2 ring-cyan-400 shadow-lg scale-105' : ''}`}
                          style={{
                            // Sets position and width of each item dynamically.
                            left: `${item.left}px`,
                            width: `${item.width}px`,
                            top: '1px',
                          }}
                          // Enables dragging and sets up event handlers for interaction.
                          draggable
                          onDragStart={(e) => handleDragStart(e, item.id)}
                          onDoubleClick={() => setEditingItemId(item.id)}
                          onMouseEnter={(e) => handleHover(item as ItemWithVisualProps, e)}
                          onMouseLeave={handleHoverEnd}
                        >
                          {/* Conditionally renders an input field for editing the item's name. */}
                          {editingItemId === item.id ? (
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleNameChange(e, item.id)}
                              onBlur={() => setEditingItemId(null)}
                              onKeyDown={(e) => e.key === 'Enter' && setEditingItemId(null)}
                              autoFocus
                              className="bg-transparent text-white border-b border-white outline-none w-full text-sm"
                            />
                          ) : (
                            <div className="truncate">
                              {item.name}
                              <div className="text-xs opacity-75 mt-0.5">
                                {item.duration} days
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Tooltip */}
            {/* Renders a tooltip with detailed item info on hover. */}
            {hoveredItem && (
              <div
                className="fixed bg-slate-700 text-gray-200 text-xs p-2 rounded-lg shadow-lg z-50 pointer-events-none"
                style={{ left: tooltipPos.x + 10, top: tooltipPos.y + 10 }}
              >
                <div className="font-semibold text-white">{hoveredItem.name}</div>
                <div>Priority: <span className="capitalize">{hoveredItem.priority}</span></div>
                <div>Duration: {hoveredItem.duration} days</div>
                <div>Start: {hoveredItem.start}</div>
                <div>End: {hoveredItem.end}</div>
              </div>
            )}
          </div>
        </div>

        {/* Table View (Mobile) */}
        {/* The table view is only visible on mobile devices. */}
        <div className="md:hidden">
          <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
            <h2 className="text-lg font-bold text-gray-100 mb-4">Task List</h2>
            <div className="overflow-x-auto">
              {/* A simple table to display tasks on smaller screens. */}
              <table className="w-full text-xs text-left text-gray-400 min-w-[500px]">
                <thead className="text-xs text-gray-200 uppercase bg-slate-900">
                  <tr>
                    <th scope="col" className="px-3 py-2">
                      Task
                    </th>
                    <th scope="col" className="px-3 py-2">
                      Priority
                    </th>
                    <th scope="col" className="px-3 py-2">
                      Start
                    </th>
                    <th scope="col" className="px-3 py-2">
                      End
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => (
                    <tr key={item.id} className="bg-slate-800 border-b border-slate-700">
                      <th scope="row" className="px-3 py-2 font-medium text-gray-100 whitespace-nowrap">
                        {/* Input field to edit task name in the table view. */}
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleNameChange(e, item.id)}
                          className="w-full bg-transparent text-xs font-medium focus:outline-none"
                        />
                      </th>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 text-white text-[10px] font-semibold rounded-full capitalize ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {/* Input field to edit the start date. */}
                        <input
                          type="date"
                          value={item.start}
                          onChange={(e) => handleDateChange(e, item.id, 'start')}
                          className="w-full bg-transparent text-xs focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {/* Input field to edit the end date. */}
                        <input
                          type="date"
                          value={item.end}
                          onChange={(e) => handleDateChange(e, item.id, 'end')}
                          className="w-full bg-transparent text-xs focus:outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;