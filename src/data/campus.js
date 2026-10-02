// Illustrative NTU campus layout for the MazeMap-style map.
// Positions, floor levels and machine capacities are placeholders, not surveyed data:
// Venue list checked against public sources (Sep 2026): NTU F&B directory, MissTamChiak and SETHLUI NTU guides.
// Still confirm with the group: "Crespion" (Crescent + Pioneer) and "Pioneer Food Court" may be one venue,
// and Canteen 13 may now trade as "13 Bites".

export const W = 1400;
export const H = 1000;
export const M_PER_UNIT = 1.4;      // 1400 map units ≈ 2 km across campus
export const WALK_M_PER_MIN = 80;

// Road network used for drawing roads and computing walking routes.
export const NODES = {
  A: [120, 480], B: [200, 200], C: [500, 90], D: [850, 80], E: [1200, 150], F: [1300, 420],
  G: [1260, 760], H: [1000, 930], I: [650, 920], J: [300, 850], K: [140, 700],
  L: [480, 470], M: [700, 470], N: [950, 470], O: [700, 250], P: [700, 700], Q: [950, 700],
  R: [400, 300], S: [1080, 300], T: [420, 700], U: [457, 560],
  X1: [320, 474], X2: [320, 260], X3: [320, 377],
  Y1: [1110, 447], Y2: [1110, 731], Y3: [1110, 575], Y4: [1110, 635]
};

export const EDGES = [
  // outer ring road
  ['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'F'], ['F', 'G'], ['G', 'H'], ['H', 'I'],
  ['I', 'J'], ['J', 'K'], ['K', 'A'],
  // academic core
  ['A', 'X1'], ['X1', 'L'], ['L', 'M'], ['M', 'N'], ['O', 'M'], ['O', 'D'], ['M', 'P'], ['P', 'I'],
  ['L', 'U'], ['U', 'T'], ['T', 'J'], ['T', 'P'], ['P', 'Q'],
  ['B', 'X2'], ['X2', 'R'], ['R', 'L'], ['R', 'O'],
  // west hall lane
  ['X1', 'X3'], ['X3', 'X2'],
  // east halls
  ['N', 'Y1'], ['Y1', 'F'], ['N', 'S'], ['S', 'E'], ['N', 'Q'], ['Q', 'H'],
  ['Q', 'Y2'], ['Y2', 'G'], ['Y1', 'Y3'], ['Y3', 'Y4'], ['Y4', 'Y2']
];

// cap = machine slots; stock = clean containers inside (free return slots = cap - stock).
// bldg = the canteen building footprint drawn on the map.
export const CANTEENS = [
  { id: 'nsfc', name: 'North Spine Food Court', short: 'North Spine', x: 605, y: 412, node: 'M', level: 'L2', spot: 'Beside the drinks stall', cap: 60, stock: 60, sim: false, bldg: { x: 520, y: 395, w: 170, h: 50 } },
  { id: 'ssfc', name: 'South Spine Food Court', short: 'South Spine', x: 805, y: 537, node: 'M', level: 'B1', spot: 'Next to the tray return', cap: 60, stock: 41, bldg: { x: 720, y: 520, w: 170, h: 50 } },
  { id: 'quad', name: 'Quad Café', short: 'Quad Café (SBS)', x: 305, y: 578, node: 'U', level: 'L1', spot: 'Outside the café doors', cap: 30, stock: 25, bldg: { x: 260, y: 560, w: 90, h: 50 } },
  { id: 'c1', name: 'Canteen 1', short: 'Canteen 1', x: 1205, y: 328, node: 'Y1', level: 'L1', spot: 'Main entrance', cap: 40, stock: 20, bldg: { x: 1180, y: 315, w: 50, h: 30 } },
  { id: 'c2', name: 'Canteen 2', short: 'Canteen 2', x: 1085, y: 383, node: 'Y1', level: 'L1', spot: 'Beside the cashier', cap: 40, stock: 22, bldg: { x: 1060, y: 370, w: 50, h: 30 } },
  { id: 'c9', name: 'Canteen 9', short: 'Canteen 9', x: 1075, y: 573, node: 'Y3', level: 'L1', spot: 'By the hand-wash sinks', cap: 40, stock: 35, bldg: { x: 1050, y: 560, w: 50, h: 30 } },
  { id: 'c11', name: 'Canteen 11', short: 'Canteen 11', x: 1215, y: 633, node: 'Y4', level: 'L1', spot: 'Beside the cashier', cap: 40, stock: 18, bldg: { x: 1190, y: 620, w: 50, h: 30 } },
  { id: 'c13', name: 'Canteen 13', short: 'Canteen 13', x: 220, y: 428, node: 'X1', level: 'L1', spot: 'Near the side exit', cap: 40, stock: 29, bldg: { x: 190, y: 415, w: 60, h: 30 } },
  { id: 'c14', name: 'Canteen 14', short: 'Canteen 14', x: 360, y: 368, node: 'X3', level: 'L1', spot: 'Main entrance', cap: 40, stock: 15, bldg: { x: 330, y: 355, w: 60, h: 34 } },
  { id: 'c16', name: 'Canteen 16', short: 'Canteen 16', x: 220, y: 320, node: 'X2', level: 'L1', spot: 'Main entrance', cap: 40, stock: 12, bldg: { x: 190, y: 305, w: 60, h: 34 } },
  { id: 'nh', name: 'North Hill Food Court', short: 'North Hill FC', x: 1275, y: 78, node: 'E', level: 'L2', spot: 'Top of the escalator', cap: 40, stock: 26, bldg: { x: 1240, y: 60, w: 70, h: 40 } },
  { id: 'crespion', name: 'Crespion Food Court', short: 'Crespion', x: 1020, y: 774, node: 'Y2', level: 'L1', spot: 'Near the drinks stall', cap: 40, stock: 31, bldg: { x: 990, y: 760, w: 60, h: 32 } },
  { id: 'pioneer', name: 'Pioneer Food Court', short: 'Pioneer FC', x: 1098, y: 818, node: 'Y2', level: 'L1', spot: 'Main entrance', cap: 40, stock: 24, bldg: { x: 1070, y: 806, w: 56, h: 30 } },
  { id: 'c4', name: 'Canteen 4', short: 'Canteen 4', x: 1005, y: 512, node: 'N', level: 'L1', spot: 'Beside the economic rice stall', cap: 40, stock: 21, bldg: { x: 980, y: 500, w: 50, h: 28 } },
  { id: 'saraca', name: 'Saraca Canteen', short: 'Saraca Canteen', x: 1055, y: 200, node: 'S', level: 'L1', spot: 'Main entrance', cap: 30, stock: 17, bldg: { x: 1030, y: 190, w: 50, h: 26 } },
  { id: 'nie', name: 'NIE Canteen', short: 'NIE Canteen', x: 60, y: 640, node: 'K', level: 'L1', spot: 'Near the drinks stall', cap: 30, stock: 9, bldg: { x: 30, y: 630, w: 60, h: 28 } }
];

// Halls of residence (label shown when zoomed in).
export const HALLS = [
  { x: 1100, y: 320, w: 50, h: 28, label: 'Hall 1' },
  { x: 1120, y: 370, w: 50, h: 28, label: 'Hall 2' },
  { x: 1180, y: 370, w: 50, h: 28, label: 'Hall 3' },
  { x: 1190, y: 560, w: 50, h: 28, label: 'Hall 4' },
  { x: 1050, y: 500, w: 50, h: 28, label: 'Hall 5' },
  { x: 1120, y: 500, w: 50, h: 28, label: 'Hall 6' },
  { x: 1190, y: 500, w: 50, h: 28, label: 'Hall 7' },
  { x: 980, y: 560, w: 50, h: 28, label: 'Hall 8' },
  { x: 1120, y: 560, w: 50, h: 28, label: 'Hall 9' },
  { x: 980, y: 620, w: 50, h: 28, label: 'Hall 10' },
  { x: 1050, y: 620, w: 50, h: 28, label: 'Hall 11' },
  { x: 260, y: 415, w: 50, h: 30, label: 'Hall 12' },
  { x: 260, y: 360, w: 50, h: 30, label: 'Hall 13' },
  { x: 190, y: 360, w: 60, h: 30, label: 'Hall 14' },
  { x: 330, y: 305, w: 60, h: 30, label: 'Hall 15' },
  { x: 260, y: 305, w: 50, h: 30, label: 'Hall 16' },
  { x: 1070, y: 760, w: 56, h: 28, label: 'Crescent Hall' },
  { x: 1000, y: 810, w: 60, h: 30, label: 'Pioneer Hall' },
  { x: 1320, y: 60, w: 60, h: 34, label: 'North Hill' },
  { x: 1320, y: 110, w: 60, h: 30, label: 'Binjai' },
  { x: 1300, y: 200, w: 60, h: 30, label: 'Tanjong' },
  { x: 1320, y: 250, w: 60, h: 30, label: 'Banyan' },
  { x: 1025, y: 150, w: 60, h: 30, label: 'Saraca' },
  { x: 940, y: 160, w: 60, h: 30, label: 'Tamarind' }
];

// Other landmark buildings (always labelled).
export const BUILDINGS = [
  { x: 500, y: 510, w: 70, h: 60, r: 22, label: 'The Hive' },
  { x: 590, y: 510, w: 90, h: 40, label: 'Library' },
  { x: 540, y: 300, w: 100, h: 44, label: 'Admin Building' },
  { x: 445, y: 735, w: 100, h: 40, label: 'Chinese Heritage Centre' },
  { x: 760, y: 760, w: 130, h: 60, label: 'Sports & Rec Centre' },
  { x: 30, y: 560, w: 70, h: 60, label: 'NIE' },
  { x: 800, y: 600, w: 70, h: 40, label: 'LT Block' },
  { x: 760, y: 330, w: 70, h: 40, label: 'Research Techno Plaza' }
];


// [cx, cy, rx, ry, label?]
export const GREENS = [
  [500, 810, 120, 50, 'Yunnan Garden'], [130, 120, 110, 70], [1330, 900, 120, 90], [700, 990, 220, 40],
  [60, 900, 100, 80], [880, 220, 60, 35], [230, 700, 70, 50]
];
export const WATER = [[830, 430, 40, 18]];

export const YOU = { x: 457, y: 560, node: 'U', label: 'The Hive' };
export const FLOORS = ['All', 'B1', 'L1', 'L2'];
