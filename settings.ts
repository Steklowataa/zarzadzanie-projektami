export const ADMIN_EMAILS = "slizzzerin@gmail.com"

export type UserRole = "admin" | "guest" | "devops" | "developer" | "super-admin" | "blocked"

export function getRoleByEmail(email: string): UserRole {
  return ADMIN_EMAILS.includes(email) ? 'super-admin' : 'guest';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}