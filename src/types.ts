export type Category =
  | 'kunst'
  | 'oorlogen'
  | 'uitvindingen'
  | 'ontdekkingen'
  | 'leiders'
  | 'personen'
  | 'economie';

export type Region = 'europa' | 'azie' | 'afrika' | 'amerika' | 'oceanie';

export type UncertaintyLevel = 'exact' | 'approximate' | 'estimated';

export type ColorMode = 'thema' | 'geo';

export interface HistoricalEvent {
  id: string;
  name: string;
  start: number; // negative for BCE
  end: number;
  category: Category;
  region: Region;
  description: string;
  image: string; // emoji
  funFacts: string[];
  teaserQuestion?: string;
  popularityScore: number; // 0-100
  uncertaintyLevel: UncertaintyLevel;
  wikipediaUrl?: string;
  relatedEvents: string[];
}

export interface ZoomLevel {
  level: number;
  label: string;
  yearsPerPixel: number;
  tickInterval: number;
  labelFormat: (year: number) => string;
}

export interface FilterState {
  categories: Category[];
  regions: Region[];
  colorMode: ColorMode;
  searchQuery: string;
}

export interface ViewState {
  centerYear: number;
  zoom: number; // 0-6 corresponding to zoom levels
  selectedEventId: string | null;
}

export const CATEGORY_CONFIG: Record<Category, { label: string; color: string; icon: string }> = {
  kunst: { label: 'Kunst & Cultuur', color: '#8B5CF6', icon: '🎨' },
  oorlogen: { label: 'Oorlogen & Conflicten', color: '#EF4444', icon: '⚔️' },
  uitvindingen: { label: 'Uitvindingen & Tech', color: '#06B6D4', icon: '🔧' },
  ontdekkingen: { label: 'Ontdekkingen', color: '#F59E0B', icon: '🌍' },
  leiders: { label: 'Politieke Leiders', color: '#10B981', icon: '👑' },
  personen: { label: 'Bekende Personen', color: '#EC4899', icon: '⭐' },
  economie: { label: 'Economie', color: '#6366F1', icon: '💰' },
};

export const REGION_CONFIG: Record<Region, { label: string; color: string }> = {
  europa: { label: 'Europa', color: '#3B82F6' },
  azie: { label: 'Azië', color: '#F59E0B' },
  afrika: { label: 'Afrika', color: '#10B981' },
  amerika: { label: "Amerika's", color: '#EF4444' },
  oceanie: { label: 'Oceanië', color: '#8B5CF6' },
};

export const ZOOM_LEVELS: ZoomLevel[] = [
  { level: 0, label: 'Millennia', yearsPerPixel: 5, tickInterval: 1000, labelFormat: (y) => formatYear(y) },
  { level: 1, label: '500 jaar', yearsPerPixel: 2.5, tickInterval: 500, labelFormat: (y) => formatYear(y) },
  { level: 2, label: 'Eeuwen', yearsPerPixel: 1, tickInterval: 100, labelFormat: (y) => formatYear(y) },
  { level: 3, label: '50 jaar', yearsPerPixel: 0.4, tickInterval: 50, labelFormat: (y) => formatYear(y) },
  { level: 4, label: 'Decennia', yearsPerPixel: 0.15, tickInterval: 10, labelFormat: (y) => formatYear(y) },
  { level: 5, label: 'Jaren', yearsPerPixel: 0.05, tickInterval: 5, labelFormat: (y) => formatYear(y) },
  { level: 6, label: 'Maanden', yearsPerPixel: 0.02, tickInterval: 1, labelFormat: (y) => formatYear(y) },
];

export function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} v.Chr.`;
  return `${year} n.Chr.`;
}
