export const CATEGORIES = {
  kunst: { label: 'Kunst & Cultuur', color: '#8B5CF6', icon: '🎨' },
  oorlogen: { label: 'Oorlogen & Conflicten', color: '#EF4444', icon: '⚔️' },
  uitvindingen: { label: 'Uitvindingen & Tech', color: '#06B6D4', icon: '🔧' },
  ontdekkingen: { label: 'Ontdekkingen', color: '#F59E0B', icon: '🌍' },
  leiders: { label: 'Politieke Leiders', color: '#10B981', icon: '👑' },
  personen: { label: 'Bekende Personen', color: '#EC4899', icon: '⭐' },
  economie: { label: 'Economie', color: '#F97316', icon: '💰' },
};

export const REGIONS = {
  europa: { label: 'Europa', color: '#3B82F6' },
  azie: { label: 'Azië', color: '#F59E0B' },
  afrika: { label: 'Afrika', color: '#10B981' },
  amerika: { label: "Amerika's", color: '#EF4444' },
  oceanie: { label: 'Oceanië', color: '#8B5CF6' },
};

export const ZOOM_LEVELS = [
  { level: 1, label: 'Millennia', yearsVisible: 5000, tickInterval: 1000 },
  { level: 2, label: '500 jaar', yearsVisible: 2500, tickInterval: 500 },
  { level: 3, label: 'Eeuwen', yearsVisible: 1000, tickInterval: 100 },
  { level: 4, label: '50 jaar', yearsVisible: 400, tickInterval: 50 },
  { level: 5, label: 'Decennia', yearsVisible: 150, tickInterval: 10 },
  { level: 6, label: 'Jaren', yearsVisible: 50, tickInterval: 5 },
  { level: 7, label: 'Detail', yearsVisible: 20, tickInterval: 1 },
];

export const MIN_YEAR = -3000;
export const MAX_YEAR = 2024;

export const COLOR_MODES = {
  CATEGORY: 'category',
  REGION: 'region',
};
