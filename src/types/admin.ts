// Admin-side types for drivers, sessions, fleet status, counts, complaints

export type AdminRole = "admin" | "manager" | "driver";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  username: string; // for login
  password: string; // demo only; use hashed in production
  role: AdminRole;
}

/** Assignment for a driver on a given day: which bus and route(s) */
export interface DriverAssignment {
  id: string;
  driverId: string;
  date: string; // YYYY-MM-DD
  vehicleId: string;
  vehicleLabel: string;
  routeId: string;
  routeName: string;
  shiftStart: string; // "09:00"
  shiftEnd: string;   // "15:00"
}

export interface DriverSession {
  id: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehicleLabel: string;
  routeName: string;
  loginAt: string; // ISO
  loggedOutAt?: string; // ISO, undefined if still active
}

export type RouteVariant = "express" | "basketball" | "football" | "baity-hill" | "other";

export interface FleetVehicleStatus {
  vehicleId: string;
  routeId: string;
  routeName: string;
  routeVariant: RouteVariant;
  capacityCurrent: number;
  capacityMax: number;
  onRoute: boolean; // true = on assigned route, false = off route
  lastUpdated: string; // ISO
}

export interface DailyBusCount {
  vehicleId: string;
  vehicleLabel: string;
  routeName: string;
  date: string; // YYYY-MM-DD
  boardings: number;
  alightings: number;
  totalTrips: number;
}

export type ComplaintType =
  | "tracker_stopped"
  | "gps_out"
  | "bus_freeze"
  | "no_backup"
  | "other";

export type ComplaintStatus = "new" | "in_progress" | "resolved" | "dismissed";

export interface Complaint {
  id: string;
  type: ComplaintType;
  status: ComplaintStatus;
  vehicleId?: string;
  vehicleLabel?: string;
  driverId?: string;
  driverName?: string;
  description: string;
  reportedAt: string; // ISO
  resolvedAt?: string;
  notes?: string;
}
