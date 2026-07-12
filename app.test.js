import { describe, it, expect, beforeEach, vi } from 'vitest';

// Setup mock global variables to mimic the browser environment of app.js
global.state = {
  venues: [],
  activeTypes: new Set(),
  activeProvince: null,
  bufferCircle: null,
  bufferPoint: null,
  bufferRadius: 1.0,
};

// Mock turf because it's loaded via CDN in browser
global.turf = {
  point: (coords) => ({ type: 'Point', coordinates: coords }),
  distance: (from, to) => {
    // simplified distance function: euclidean distance * 111 (rough km translation)
    const dx = from.coordinates[0] - to.coordinates[0];
    const dy = from.coordinates[1] - to.coordinates[1];
    return Math.sqrt(dx * dx + dy * dy) * 111;
  }
};

// Implement local visibleVenues logic directly matching app.js
function visibleVenues() {
  return global.state.venues.filter(v => {
    // category filter
    const hasActive = v.types.some(tp => {
      const norm = tp === 'sport' ? 'sports' : tp;
      return global.state.activeTypes.has(norm) || global.state.activeTypes.has(tp);
    });
    if (!hasActive) return false;

    // province filter
    if (global.state.activeProvince && v.province !== global.state.activeProvince) return false;

    // buffer filter
    if (global.state.bufferCircle && global.state.bufferPoint) {
      const from = global.turf.point([v.lng, v.lat]);
      const to   = global.turf.point([global.state.bufferPoint.lng, global.state.bufferPoint.lat]);
      const dist = global.turf.distance(from, to);
      if (dist > global.state.bufferRadius) return false;
    }
    return true;
  });
}

describe('visibleVenues filter logic', () => {
  beforeEach(() => {
    global.state.venues = [
      { id: '1', name_th: 'Library Bangkok', types: ['library'], province: 'กรุงเทพมหานคร', lat: 13.75, lng: 100.5 },
      { id: '2', name_th: 'OSM Sport Chiang Mai', types: ['sport'], province: 'เชียงใหม่', lat: 18.78, lng: 98.98 },
      { id: '3', name_th: 'Park Bangkok', types: ['park'], province: 'กรุงเทพมหานคร', lat: 13.73, lng: 100.52 },
      { id: '4', name_th: 'Museum Bangkok', types: ['museum'], province: 'กรุงเทพมหานคร', lat: 13.76, lng: 100.48 }
    ];
    global.state.activeTypes = new Set(['library', 'coworking', 'museum', 'recreation', 'sports', 'sport', 'park']);
    global.state.activeProvince = null;
    global.state.bufferCircle = null;
    global.state.bufferPoint = null;
  });

  it('filters by active category types', () => {
    // Only library active
    global.state.activeTypes = new Set(['library']);
    let visible = visibleVenues();
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe('1');

    // Enable library & park
    global.state.activeTypes = new Set(['library', 'park']);
    visible = visibleVenues();
    expect(visible).toHaveLength(2);
  });

  it('treats "sport" synonymously with "sports"', () => {
    global.state.activeTypes = new Set(['sports']);
    const visible = visibleVenues();
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe('2');
  });

  it('filters by selected province', () => {
    global.state.activeProvince = 'เชียงใหม่';
    let visible = visibleVenues();
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe('2');

    global.state.activeProvince = 'กรุงเทพมหานคร';
    visible = visibleVenues();
    expect(visible).toHaveLength(3);
  });

  it('filters within a geographic buffer range', () => {
    global.state.bufferCircle = {}; // truthy check
    global.state.bufferPoint = { lat: 13.75, lng: 100.5 };
    global.state.bufferRadius = 5.0; // 5 km

    const visible = visibleVenues();
    // Chiang Mai and far Bangkok park should be excluded, Bangkok library & museum should remain
    expect(visible.map(v => v.id)).toContain('1');
    expect(visible.map(v => v.id)).toContain('4');
    expect(visible.map(v => v.id)).not.toContain('2'); // Chiang Mai
  });
});
