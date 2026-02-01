import type { Stop, Route, Vehicle } from "@/types/transit";

/**
 * P2P stops from UNC Point-to-Point routes (move.unc.edu/p2p).
 * Coordinates approximate based on UNC Chapel Hill campus layout.
 * P2P Express: 23 stops | Baity Hill Shuttle: 16 stops (some shared).
 */
export const stops: Stop[] = [
  // P2P Express stops (route order: Old Well → Craige Deck → ... → Ehringhaus)
  { id: "old-well", name: "Old Well", lat: 35.9112, lon: -79.0513 },
  { id: "craige-deck", name: "Craige Deck", lat: 35.903, lon: -79.0525 },
  { id: "rams-1", name: "Rams 1", lat: 35.8995, lon: -79.052 },
  { id: "rams-4", name: "Rams 4", lat: 35.8998, lon: -79.0525 },
  { id: "williamson-lot", name: "Williamson Lot", lat: 35.901, lon: -79.0535 },
  { id: "manning-lot", name: "Manning Lot", lat: 35.904, lon: -79.054 },
  { id: "horton", name: "Horton Residence Hall", lat: 35.902, lon: -79.053 },
  { id: "avery", name: "Avery", lat: 35.9055, lon: -79.047 },
  { id: "kenan-stadium", name: "Kenan Stadium", lat: 35.9064, lon: -79.0458 },
  { id: "bell-tower", name: "Bell Tower", lat: 35.9062, lon: -79.0481 },
  { id: "mccauley", name: "McCauley", lat: 35.9095, lon: -79.0508 },
  { id: "newman-center", name: "Newman Center", lat: 35.9105, lon: -79.0515 },
  { id: "granville-towers", name: "Granville Towers", lat: 35.9145, lon: -79.0525 },
  { id: "varsity-theater", name: "Varsity Theater", lat: 35.9125, lon: -79.052 },
  { id: "henderson", name: "Henderson", lat: 35.909, lon: -79.051 },
  { id: "planetarium", name: "Planetarium", lat: 35.9085, lon: -79.0505 },
  { id: "alderman", name: "Alderman", lat: 35.907, lon: -79.05 },
  { id: "lewis", name: "Lewis", lat: 35.906, lon: -79.0495 },
  { id: "conner", name: "Conner", lat: 35.9055, lon: -79.049 },
  { id: "src-union", name: "SRC/Union", lat: 35.9076, lon: -79.0478 },
  { id: "carmichael", name: "Carmichael", lat: 35.9045, lon: -79.0485 },
  { id: "parker", name: "Parker", lat: 35.9015, lon: -79.0498 },
  { id: "ehringhaus", name: "Ehringhaus", lat: 35.9008, lon: -79.0502 },

  // Baity Hill Shuttle–only stops
  { id: "carolina-coffee", name: "Carolina Coffee Shop", lat: 35.913, lon: -79.0518 },
  { id: "spenser-hall", name: "Spenser Hall", lat: 35.912, lon: -79.051 },
  { id: "union-north", name: "Student Union (North)", lat: 35.9078, lon: -79.048 },
  { id: "union-south", name: "Student Union (South)", lat: 35.9073, lon: -79.0475 },
  { id: "credit-union", name: "Credit Union", lat: 35.9065, lon: -79.049 },
  { id: "ambulatory-care", name: "Ambulatory Care Center", lat: 35.9015, lon: -79.0545 },
  { id: "baity-hill", name: "Baity Hill Community", lat: 35.918, lon: -79.057 },
  { id: "1501-mason", name: "1501 Mason Farm", lat: 35.903, lon: -79.0565 },
  { id: "1351-1401-mason", name: "1351, 1401 Mason Farm", lat: 35.902, lon: -79.056 },
  { id: "1101-mason", name: "1101 Mason Farm", lat: 35.901, lon: -79.0555 },
  { id: "marsico-hall", name: "Marsico Hall", lat: 35.901, lon: -79.055 },
  { id: "health-science", name: "Health Science, Carrington, Bondurant", lat: 35.902, lon: -79.0545 },
  { id: "sitterson", name: "Sitterson Hall", lat: 35.9105, lon: -79.0475 },
];

export const routes: Route[] = [
  { id: "r1", name: "Baity Hill" },
  { id: "r2", name: "P2P Express" },
];

// P2P Express route order (stop IDs)
const P2P_EXPRESS_STOP_ORDER = [
  "old-well", "craige-deck", "rams-1", "rams-4", "williamson-lot",
  "manning-lot", "horton", "avery", "kenan-stadium", "bell-tower",
  "mccauley", "newman-center", "granville-towers", "varsity-theater",
  "henderson", "planetarium", "alderman", "lewis", "conner",
  "src-union", "carmichael", "parker", "ehringhaus",
];

// Baity Hill Shuttle route order (stop IDs)
const BAITY_HILL_STOP_ORDER = [
  "granville-towers", "carolina-coffee", "spenser-hall", "union-north", "union-south",
  "credit-union", "ambulatory-care", "craige-deck", "horton", "baity-hill",
  "1501-mason", "1351-1401-mason", "1101-mason", "marsico-hall",
  "health-science", "sitterson",
];

function buildUpcomingStops(
  stopIds: string[],
  nextStopIndex: number,
  firstEtaMin: number,
  etaIncrement: number = 3
): { stopId: string; etaMin: number }[] {
  const result: { stopId: string; etaMin: number }[] = [];
  let eta = firstEtaMin;
  for (let i = 0; i < 6 && nextStopIndex + i < stopIds.length; i++) {
    result.push({ stopId: stopIds[nextStopIndex + i], etaMin: eta });
    eta += etaIncrement;
  }
  return result;
}

// Active buses with realistic positions on routes
export const vehicles: Vehicle[] = [
  {
    id: "v1",
    routeId: "r1",
    routeName: "Baity Hill",
    lat: 35.907,
    lon: -79.0485,
    heading: 180,
    nextStopId: "credit-union",
    nextStopEtaMin: 2,
    upcomingStops: buildUpcomingStops(BAITY_HILL_STOP_ORDER, 5, 2, 3),
  },
  {
    id: "v2",
    routeId: "r1",
    routeName: "Baity Hill",
    lat: 35.903,
    lon: -79.0555,
    heading: 45,
    nextStopId: "marsico-hall",
    nextStopEtaMin: 3,
    upcomingStops: buildUpcomingStops(BAITY_HILL_STOP_ORDER, 13, 3, 3),
  },
  {
    id: "v3",
    routeId: "r2",
    routeName: "P2P Express",
    lat: 35.9075,
    lon: -79.048,
    heading: 90,
    nextStopId: "src-union",
    nextStopEtaMin: 1,
    upcomingStops: buildUpcomingStops(P2P_EXPRESS_STOP_ORDER, 18, 1, 2),
  },
  {
    id: "v4",
    routeId: "r2",
    routeName: "P2P Express",
    lat: 35.91,
    lon: -79.052,
    heading: 270,
    nextStopId: "kenan-stadium",
    nextStopEtaMin: 4,
    upcomingStops: buildUpcomingStops(P2P_EXPRESS_STOP_ORDER, 8, 4, 2),
  },
];
