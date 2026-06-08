export type Role = "owner" | "admin" | "instructor" | "pilot";

export const ROLE_RANK: Record<Role, number> = {
  pilot: 0,
  instructor: 1,
  admin: 2,
  owner: 3,
};

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  certs?: string;
  ratings?: string;
  totalTime?: number;
  picTime?: number;
  typeTime?: number;
}

/** A local, unauthenticated study session (offline / no backend). */
export interface GuestProfile {
  userId: "guest";
  email: "";
  name: "Guest Pilot";
  role: "pilot";
}

export function hasAtLeast(role: Role, minimum: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}
