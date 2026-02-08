/**
 * Types for Class Sessions (Aulas Individuais)
 * Based on OpenAPI specification
 */

// Attendance status enum
export type AttendanceStatus =
  | "pending"
  | "present"
  | "late"
  | "absent"
  | "excused";

// Base class session type (response from API)
export interface ClassSession {
  id: string;
  date: string; // ISO date format (YYYY-MM-DD)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  notes?: string;
  classId: string;
  teacherId: string;
  isActive: boolean;
  startedAt?: string; // ISO timestamp when session was started
  endedAt?: string; // ISO timestamp when session was ended
  createdAt: string;
  updatedAt: string;
}

// DTO for creating a new class session
export interface CreateClassSessionDto {
  date: string; // ISO date format (YYYY-MM-DD)
  startTime?: string; // HH:MM format (optional, defaults to class schedule time)
  endTime?: string; // HH:MM format (optional, calculated from start + duration)
  notes?: string;
  classId: string;
  teacherId: string;
}

// DTO for updating a class session
export interface UpdateClassSessionDto {
  date?: string; // ISO date format (YYYY-MM-DD)
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  notes?: string;
  classId?: string;
  teacherId?: string;
}

// Query parameters for fetching sessions
export interface ClassSessionFilters {
  classId?: string;
  teacherId?: string;
  startDate?: string; // ISO date format
  endDate?: string; // ISO date format
  isActive?: boolean;
  includeInactive?: boolean;
}

// Session status for UI
export type SessionStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "cancelled";

// Helper function to determine session status
export function getSessionStatus(session: ClassSession): SessionStatus {
  if (!session.isActive) {
    return "cancelled";
  }
  if (session.endedAt) {
    return "completed";
  }
  if (session.startedAt) {
    return "in-progress";
  }
  return "scheduled";
}

// Helper to format date and time for display
export function formatSessionDateTime(session: ClassSession): string {
  // Parse date as local timezone to avoid timezone conversion issues
  const [year, month, day] = session.date.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const dateStr = date.toLocaleDateString("pt-BR");
  return `${dateStr} - ${session.startTime} às ${session.endTime}`;
}

// Helper to check if session is today
export function isSessionToday(session: ClassSession): boolean {
  // Parse date as local timezone to avoid timezone conversion issues
  const [year, month, day] = session.date.split("-").map(Number);
  const sessionDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  sessionDate.setHours(0, 0, 0, 0);
  return sessionDate.getTime() === today.getTime();
}

// Helper to check if session is in the past
export function isSessionPast(session: ClassSession): boolean {
  // Parse date as local timezone to avoid timezone conversion issues
  const [year, month, day] = session.date.split("-").map(Number);
  const sessionDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  sessionDate.setHours(0, 0, 0, 0);
  return sessionDate < today;
}

// Helper to check if session can be started
export function canStartSession(session: ClassSession): boolean {
  return (
    session.isActive &&
    !session.startedAt &&
    !session.endedAt &&
    (isSessionToday(session) || isSessionPast(session))
  );
}

// Helper to check if session can be ended
export function canEndSession(session: ClassSession): boolean {
  return session.isActive && !!session.startedAt && !session.endedAt;
}
