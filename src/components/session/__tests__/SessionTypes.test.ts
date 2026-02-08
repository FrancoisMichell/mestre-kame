import { describe, it, expect } from "vitest";
import {
  getSessionStatus,
  formatSessionDateTime,
  isSessionToday,
  isSessionPast,
  canStartSession,
  canEndSession,
} from "../SessionTypes";
import type { ClassSession } from "../SessionTypes";

describe("SessionTypes Helpers", () => {
  const baseSession: ClassSession = {
    id: "session-1",
    date: "2026-02-10",
    startTime: "18:30",
    endTime: "20:00",
    classId: "1",
    teacherId: "teacher-1",
    isActive: true,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
  };

  describe("getSessionStatus", () => {
    it("should return scheduled for future active sessions", () => {
      const status = getSessionStatus(baseSession);
      expect(status).toBe("scheduled");
    });

    it("should return in-progress for started sessions", () => {
      const session: ClassSession = {
        ...baseSession,
        startedAt: "2026-02-10T18:30:00Z",
      };
      const status = getSessionStatus(session);
      expect(status).toBe("in-progress");
    });

    it("should return completed for ended sessions", () => {
      const session: ClassSession = {
        ...baseSession,
        startedAt: "2026-02-10T18:30:00Z",
        endedAt: "2026-02-10T20:00:00Z",
      };
      const status = getSessionStatus(session);
      expect(status).toBe("completed");
    });

    it("should return cancelled for inactive sessions", () => {
      const session: ClassSession = {
        ...baseSession,
        isActive: false,
      };
      const status = getSessionStatus(session);
      expect(status).toBe("cancelled");
    });
  });

  describe("formatSessionDateTime", () => {
    it("should format session date and time", () => {
      const formatted = formatSessionDateTime(baseSession);
      expect(formatted).toMatch(/10\/02\/2026/);
      expect(formatted).toContain("18:30 às 20:00");
    });
  });

  describe("isSessionToday", () => {
    it("should return true for today's session", () => {
      const today = new Date().toISOString().split("T")[0];
      const session: ClassSession = {
        ...baseSession,
        date: today,
      };
      expect(isSessionToday(session)).toBe(true);
    });

    it("should return false for future session", () => {
      const session: ClassSession = {
        ...baseSession,
        date: "2030-12-31",
      };
      expect(isSessionToday(session)).toBe(false);
    });

    it("should return false for past session", () => {
      const session: ClassSession = {
        ...baseSession,
        date: "2020-01-01",
      };
      expect(isSessionToday(session)).toBe(false);
    });
  });

  describe("isSessionPast", () => {
    it("should return true for past sessions", () => {
      const session: ClassSession = {
        ...baseSession,
        date: "2020-01-01",
      };
      expect(isSessionPast(session)).toBe(true);
    });

    it("should return false for future sessions", () => {
      const session: ClassSession = {
        ...baseSession,
        date: "2030-12-31",
      };
      expect(isSessionPast(session)).toBe(false);
    });

    it("should return false for today's session", () => {
      const today = new Date().toISOString().split("T")[0];
      const session: ClassSession = {
        ...baseSession,
        date: today,
      };
      expect(isSessionPast(session)).toBe(false);
    });
  });

  describe("canStartSession", () => {
    it("should return true for today's active session not started", () => {
      const today = new Date().toISOString().split("T")[0];
      const session: ClassSession = {
        ...baseSession,
        date: today,
      };
      expect(canStartSession(session)).toBe(true);
    });

    it("should return false for already started session", () => {
      const today = new Date().toISOString().split("T")[0];
      const session: ClassSession = {
        ...baseSession,
        date: today,
        startedAt: "2026-02-08T09:00:00Z",
      };
      expect(canStartSession(session)).toBe(false);
    });

    it("should return false for inactive session", () => {
      const today = new Date().toISOString().split("T")[0];
      const session: ClassSession = {
        ...baseSession,
        date: today,
        isActive: false,
      };
      expect(canStartSession(session)).toBe(false);
    });

    it("should return false for ended session", () => {
      const today = new Date().toISOString().split("T")[0];
      const session: ClassSession = {
        ...baseSession,
        date: today,
        startedAt: "2026-02-08T09:00:00Z",
        endedAt: "2026-02-08T10:30:00Z",
      };
      expect(canStartSession(session)).toBe(false);
    });
  });

  describe("canEndSession", () => {
    it("should return true for started but not ended session", () => {
      const session: ClassSession = {
        ...baseSession,
        startedAt: "2026-02-10T18:30:00Z",
      };
      expect(canEndSession(session)).toBe(true);
    });

    it("should return false for not started session", () => {
      expect(canEndSession(baseSession)).toBe(false);
    });

    it("should return false for already ended session", () => {
      const session: ClassSession = {
        ...baseSession,
        startedAt: "2026-02-10T18:30:00Z",
        endedAt: "2026-02-10T20:00:00Z",
      };
      expect(canEndSession(session)).toBe(false);
    });

    it("should return false for inactive session", () => {
      const session: ClassSession = {
        ...baseSession,
        isActive: false,
        startedAt: "2026-02-10T18:30:00Z",
      };
      expect(canEndSession(session)).toBe(false);
    });
  });
});
