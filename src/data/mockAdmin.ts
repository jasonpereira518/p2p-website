import type {
  AdminUser,
  DriverAssignment,
  DriverSession,
  FleetVehicleStatus,
  DailyBusCount,
  Complaint,
} from "@/types/admin";

// Demo credentials: username / password
// Admin: arivera / admin123  |  Manager: jlee / manager123  |  Drivers: schen / driver123, mtaylor / driver123, cwilliams / driver123
export const adminUsers: AdminUser[] = [
  { id: "a1", name: "Alex Rivera", email: "arivera@unc.edu", username: "arivera", password: "admin123", role: "admin" },
  { id: "a2", name: "Jordan Lee", email: "jlee@unc.edu", username: "jlee", password: "manager123", role: "manager" },
  { id: "d1", name: "Sam Chen", email: "schen@unc.edu", username: "schen", password: "driver123", role: "driver" },
  { id: "d2", name: "Morgan Taylor", email: "mtaylor@unc.edu", username: "mtaylor", password: "driver123", role: "driver" },
  { id: "d3", name: "Casey Williams", email: "cwilliams@unc.edu", username: "cwilliams", password: "driver123", role: "driver" },
];

const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

/** Driver assignments for the day (bus + route). Used on driver dashboard. */
export const driverAssignments: DriverAssignment[] = [
  { id: "da1", driverId: "d1", date: today, vehicleId: "v1", vehicleLabel: "Bus 101", routeId: "r1", routeName: "Baity Hill", shiftStart: "09:00", shiftEnd: "15:00" },
  { id: "da2", driverId: "d2", date: today, vehicleId: "v2", vehicleLabel: "Bus 102", routeId: "r1", routeName: "Baity Hill", shiftStart: "10:00", shiftEnd: "16:00" },
  { id: "da3", driverId: "d3", date: today, vehicleId: "v3", vehicleLabel: "Bus 103", routeId: "r2", routeName: "P2P Express", shiftStart: "08:30", shiftEnd: "14:30" },
  // Sam Chen also has an afternoon assignment on Bus 104
  { id: "da4", driverId: "d1", date: today, vehicleId: "v4", vehicleLabel: "Bus 104", routeId: "r2", routeName: "P2P Express", shiftStart: "16:00", shiftEnd: "22:00" },
];

// Active and recent driver sessions (who's driving which bus)
export const driverSessions: DriverSession[] = [
  {
    id: "s1",
    driverId: "d1",
    driverName: "Sam Chen",
    vehicleId: "v1",
    vehicleLabel: "Bus 101",
    routeName: "Baity Hill",
    loginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "s2",
    driverId: "d2",
    driverName: "Morgan Taylor",
    vehicleId: "v2",
    vehicleLabel: "Bus 102",
    routeName: "Baity Hill",
    loginAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "s3",
    driverId: "d3",
    driverName: "Casey Williams",
    vehicleId: "v3",
    vehicleLabel: "Bus 103",
    routeName: "P2P Express",
    loginAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "s4",
    driverId: "d1",
    driverName: "Sam Chen",
    vehicleId: "v4",
    vehicleLabel: "Bus 104",
    routeName: "P2P Express",
    loginAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    loggedOutAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];

// Fleet status: capacity and on/off route (e.g. basketball/football special routes)
export const fleetStatus: FleetVehicleStatus[] = [
  {
    vehicleId: "v1",
    routeId: "r1",
    routeName: "Baity Hill",
    routeVariant: "baity-hill",
    capacityCurrent: 18,
    capacityMax: 24,
    onRoute: true,
    lastUpdated: new Date().toISOString(),
  },
  {
    vehicleId: "v2",
    routeId: "r1",
    routeName: "Baity Hill",
    routeVariant: "baity-hill",
    capacityCurrent: 22,
    capacityMax: 24,
    onRoute: true,
    lastUpdated: new Date().toISOString(),
  },
  {
    vehicleId: "v3",
    routeId: "r2",
    routeName: "P2P Express",
    routeVariant: "basketball",
    capacityCurrent: 20,
    capacityMax: 28,
    onRoute: false, // off route – e.g. basketball special
    lastUpdated: new Date().toISOString(),
  },
  {
    vehicleId: "v4",
    routeId: "r2",
    routeName: "P2P Express",
    routeVariant: "express",
    capacityCurrent: 12,
    capacityMax: 28,
    onRoute: true,
    lastUpdated: new Date().toISOString(),
  },
];

export const dailyBusCounts: DailyBusCount[] = [
  { vehicleId: "v1", vehicleLabel: "Bus 101", routeName: "Baity Hill", date: today, boardings: 142, alightings: 138, totalTrips: 18 },
  { vehicleId: "v2", vehicleLabel: "Bus 102", routeName: "Baity Hill", date: today, boardings: 98, alightings: 95, totalTrips: 12 },
  { vehicleId: "v3", vehicleLabel: "Bus 103", routeName: "P2P Express", date: today, boardings: 210, alightings: 205, totalTrips: 22 },
  { vehicleId: "v4", vehicleLabel: "Bus 104", routeName: "P2P Express", date: today, boardings: 176, alightings: 172, totalTrips: 20 },
  { vehicleId: "v1", vehicleLabel: "Bus 101", routeName: "Baity Hill", date: yesterday, boardings: 165, alightings: 162, totalTrips: 21 },
  { vehicleId: "v2", vehicleLabel: "Bus 102", routeName: "Baity Hill", date: yesterday, boardings: 88, alightings: 85, totalTrips: 11 },
  { vehicleId: "v3", vehicleLabel: "Bus 103", routeName: "P2P Express", date: yesterday, boardings: 198, alightings: 195, totalTrips: 24 },
  { vehicleId: "v4", vehicleLabel: "Bus 104", routeName: "P2P Express", date: yesterday, boardings: 189, alightings: 186, totalTrips: 23 },
];

export const complaints: Complaint[] = [
  {
    id: "c1",
    type: "tracker_stopped",
    status: "resolved",
    vehicleId: "v2",
    vehicleLabel: "Bus 102",
    driverId: "d2",
    driverName: "Morgan Taylor",
    description: "Tracker stopped updating for ~15 min. Restarted tablet and it came back.",
    reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Replaced SIM; no recurrence.",
  },
  {
    id: "c2",
    type: "gps_out",
    status: "in_progress",
    vehicleId: "v3",
    vehicleLabel: "Bus 103",
    driverId: "d3",
    driverName: "Casey Williams",
    description: "GPS went out near Kenan. Bus stopped tracking on map. No backup device in cab.",
    reportedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    notes: "Driver requested backup when GPS fails.",
  },
  {
    id: "c3",
    type: "no_backup",
    status: "new",
    driverId: "d1",
    driverName: "Sam Chen",
    description: "If the GPS goes out, we have no backup. Passengers can't see where the bus is.",
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "c4",
    type: "bus_freeze",
    status: "resolved",
    vehicleId: "v4",
    vehicleLabel: "Bus 104",
    description: "App froze on tablet; bus showed as not moving for 20 min.",
    reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Firmware update applied.",
  },
];
