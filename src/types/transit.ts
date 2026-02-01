export interface Stop {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface Route {
  id: string;
  name: string;
}

export interface UpcomingStop {
  stopId: string;
  etaMin: number;
}

export interface Vehicle {
  id: string;
  routeId: string;
  routeName: string;
  lat: number;
  lon: number;
  heading: number;
  nextStopId: string;
  nextStopEtaMin: number;
  upcomingStops: UpcomingStop[];
}

export interface UserLocation {
  lat: number;
  lon: number;
}
