import { useRef, useEffect, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { CATEGORIES, REGIONS } from '../utils/constants';
import {
  formatYear,
  getYearRange,
  isEventVisible,
  getEventColor,
  getZoomLevelForYearsVisible,
  getTicksForRange,
} from '../utils/timeHelpers';
import { ZOOM_LEVELS } from '../utils/constants';

export default function Timeline({
  events,
  centerYear,
  yearsVisible,
  colorMode,
  selectedCategories,
  selectedRegions,
  selectedEvent,
  onZoom,
  onPan,
  onSelectEvent,
}) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartCenter = useRef(0);

  const { start: startYear, end: endYear } = getYearRange(centerYear, yearsVisible);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (!isEventVisible(e, startYear, endYear)) return false;
      if (selectedCategories && !selectedCategories.has(e.category)) return false;
      if (selectedRegions && !selectedRegions.has(e.region)) return false;
      return true;
    });
  }, [events, startYear, endYear, selectedCategories, selectedRegions]);

  const zoomLevel = getZoomLevelForYearsVisible(yearsVisible, ZOOM_LEVELS);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const mouseXRatio = (e.clientX - rect.left) / rect.width;
    onZoom(e.deltaY, mouseXRatio);
  }, [onZoom]);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartCenter.current = centerYear;
    e.preventDefault();
  }, [centerYear]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = e.clientX - dragStartX.current;
    const yearsPerPixel = yearsVisible / rect.width;
    onPan(-dx * yearsPerPixel);
    dragStartX.current = e.clientX;
  }, [yearsVisible, onPan]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();

    const xScale = d3.scaleLinear().domain([startYear, endYear]).range([0, width]);
    const timelineY = height - 60;

    // Background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .style('cursor', 'grab');

    // Era backgrounds
    const eras = [
      { start: -3000, end: 476, label: 'Oudheid', color: 'rgba(139, 92, 246, 0.05)' },
      { start: 476, end: 1500, label: 'Middeleeuwen', color: 'rgba(16, 185, 129, 0.05)' },
      { start: 1500, end: 1800, label: 'Vroegmoderne Tijd', color: 'rgba(245, 158, 11, 0.05)' },
      { start: 1800, end: 2024, label: 'Moderne Tijd', color: 'rgba(59, 130, 246, 0.05)' },
    ];

    eras.forEach(era => {
      const x1 = Math.max(xScale(era.start), 0);
      const x2 = Math.min(xScale(era.end), width);
      if (x2 > x1) {
        svg.append('rect')
          .attr('x', x1).attr('y', 0)
          .attr('width', x2 - x1).attr('height', timelineY)
          .attr('fill', era.color);

        if (x2 - x1 > 80) {
          svg.append('text')
            .attr('x', (x1 + x2) / 2).attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('fill', 'rgba(255,255,255,0.15)')
            .attr('font-size', '13px')
            .attr('font-weight', '600')
            .text(era.label);
        }
      }
    });

    // Timeline axis line
    svg.append('line')
      .attr('x1', 0).attr('y1', timelineY)
      .attr('x2', width).attr('y2', timelineY)
      .attr('stroke', 'rgba(255,255,255,0.2)')
      .attr('stroke-width', 1);

    // Ticks
    const ticks = getTicksForRange(startYear, endYear, zoomLevel.tickInterval);
    ticks.forEach(year => {
      const x = xScale(year);
      svg.append('line')
        .attr('x1', x).attr('y1', timelineY - 6)
        .attr('x2', x).attr('y2', timelineY + 6)
        .attr('stroke', 'rgba(255,255,255,0.3)')
        .attr('stroke-width', 1);

      svg.append('text')
        .attr('x', x).attr('y', timelineY + 22)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255,255,255,0.5)')
        .attr('font-size', '11px')
        .text(formatYear(year));
    });

    // Layout events in rows to avoid overlap
    const eventPadding = 4;
    const eventHeight = 28;
    const rows = [];

    const sortedEvents = [...filteredEvents].sort((a, b) => a.start - b.start);
    const eventRows = [];

    sortedEvents.forEach(event => {
      const x1 = xScale(event.start);
      const x2 = Math.max(xScale(event.end), x1 + 60);
      let row = 0;
      while (rows[row] && rows[row] > x1 - eventPadding) {
        row++;
      }
      rows[row] = x2 + eventPadding;
      eventRows.push({ event, x1, x2, row });
    });

    // Draw events
    const eventsGroup = svg.append('g');

    eventRows.forEach(({ event, x1, x2, row }) => {
      const y = timelineY - 40 - row * (eventHeight + eventPadding);
      if (y < 10) return;

      const color = getEventColor(event, colorMode, CATEGORIES, REGIONS);
      const isSelected = selectedEvent?.id === event.id;
      const barWidth = Math.max(x2 - x1, 4);

      const g = eventsGroup.append('g')
        .style('cursor', 'pointer')
        .on('click', (e) => {
          e.stopPropagation();
          onSelectEvent(event);
        });

      // Connection line to timeline
      g.append('line')
        .attr('x1', x1).attr('y1', y + eventHeight)
        .attr('x2', x1).attr('y2', timelineY)
        .attr('stroke', color)
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.3);

      // Event bar
      g.append('rect')
        .attr('x', x1).attr('y', y)
        .attr('width', barWidth).attr('height', eventHeight)
        .attr('rx', 4)
        .attr('fill', color)
        .attr('opacity', isSelected ? 1 : 0.75)
        .attr('stroke', isSelected ? '#fff' : 'none')
        .attr('stroke-width', isSelected ? 2 : 0);

      // Event dot on timeline
      g.append('circle')
        .attr('cx', x1).attr('cy', timelineY)
        .attr('r', isSelected ? 5 : 3)
        .attr('fill', color);

      // Event label
      const maxLabelWidth = barWidth - 8;
      if (maxLabelWidth > 20) {
        const text = g.append('text')
          .attr('x', x1 + 6).attr('y', y + eventHeight / 2 + 4)
          .attr('fill', '#fff')
          .attr('font-size', '11px')
          .attr('font-weight', '500')
          .text(event.title);

        // Truncate if too long
        const node = text.node();
        if (node.getComputedTextLength() > maxLabelWidth) {
          let truncated = event.title;
          while (truncated.length > 3 && node.getComputedTextLength() > maxLabelWidth) {
            truncated = truncated.slice(0, -1);
            text.text(truncated + '…');
          }
        }
      }
    });

    // Click on background to deselect
    svg.on('click', () => onSelectEvent(null));
  }, [startYear, endYear, filteredEvents, colorMode, selectedEvent, zoomLevel, onSelectEvent]);

  return (
    <div
      ref={containerRef}
      className="timeline-container"
      onMouseDown={handleMouseDown}
    >
      <svg ref={svgRef} />
      <div className="timeline-zoom-label">{zoomLevel.label}</div>
    </div>
  );
}
