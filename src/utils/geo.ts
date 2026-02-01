import type { Stop, UserLocation } from "@/types/transit";

const WALK_SPEED_MPS = 1.4; // meters per second
const EARTH_RADIUS_M = 6371000;

/**
 * Haversine distance in meters between two points
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_M * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Find the closest stop to the user's location
 */
export function nearestStop(
  userLocation: UserLocation,
  stops: Stop[]
): { stop: Stop; distanceM: number } | null {
  if (stops.length === 0) return null;

  let closest: { stop: Stop; distanceM: number } = {
    stop: stops[0],
    distanceM: haversineDistance(
      userLocation.lat,
      userLocation.lon,
      stops[0].lat,
      stops[0].lon
    ),
  };

  for (let i = 1; i < stops.length; i++) {
    const distanceM = haversineDistance(
      userLocation.lat,
      userLocation.lon,
      stops[i].lat,
      stops[i].lon
    );
    if (distanceM < closest.distanceM) {
      closest = { stop: stops[i], distanceM };
    }
  }

  return closest;
}

/**
 * Estimate walking time in minutes from distance in meters
 * Assumes 1.4 m/s walking speed
 */
export function walkTimeMinutes(distanceM: number): number {
  const seconds = distanceM / WALK_SPEED_MPS;
  return Math.round(seconds / 60);
}

/**
 * Round minutes for display (e.g. 0 -> 1 for "&lt; 1 min")
 */
export function roundEtaDisplay(min: number): number {
  return min < 1 ? 1 : Math.round(min);
}
