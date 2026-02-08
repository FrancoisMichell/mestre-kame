import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "../../../test-utils";
import {
  useFetchClassSessions,
  useFetchSessionsByClass,
  useCreateClassSession,
  useStartSession,
  useEndSession,
} from "../../../api/hooks";
import type { CreateClassSessionDto } from "../SessionTypes";

describe("Session Hooks", () => {
  beforeEach(() => {
    localStorage.setItem("authToken", "mock-token");
  });

  describe("useFetchClassSessions", () => {
    it("should fetch all sessions", async () => {
      const { result } = renderHook(() => useFetchClassSessions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toBeDefined();
      expect(Array.isArray(result.current.sessions)).toBe(true);
      expect(result.current.sessions.length).toBeGreaterThan(0);
    });

    it("should filter sessions by classId", async () => {
      const { result } = renderHook(
        () => useFetchClassSessions({ classId: "1" }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toBeDefined();
      result.current.sessions.forEach((session) => {
        expect(session.classId).toBe("1");
      });
    });

    it("should filter sessions by date range", async () => {
      const startDate = "2026-02-01";
      const endDate = "2026-02-28";

      const { result } = renderHook(
        () => useFetchClassSessions({ startDate, endDate }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toBeDefined();
      result.current.sessions.forEach((session) => {
        expect(session.date >= startDate).toBe(true);
        expect(session.date <= endDate).toBe(true);
      });
    });
  });

  describe("useFetchSessionsByClass", () => {
    it("should fetch sessions for a specific class", async () => {
      const classId = "1";
      const { result } = renderHook(() => useFetchSessionsByClass(classId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toBeDefined();
      expect(Array.isArray(result.current.sessions)).toBe(true);
      result.current.sessions.forEach((session) => {
        expect(session.classId).toBe(classId);
      });
    });

    it("should return empty array if no sessions found", async () => {
      const classId = "999";
      const { result } = renderHook(() => useFetchSessionsByClass(classId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.sessions).toEqual([]);
    });
  });

  describe("useCreateClassSession", () => {
    it("should create a new session", async () => {
      const { result } = renderHook(() => useCreateClassSession(), {
        wrapper: createWrapper(),
      });

      const newSession: CreateClassSessionDto = {
        date: "2026-02-15",
        startTime: "19:00",
        endTime: "20:30",
        notes: "Test session",
        classId: "1",
        teacherId: "teacher-1",
      };

      const createdSession = await result.current(newSession);

      expect(createdSession).toBeDefined();
      expect(createdSession.date).toBe(newSession.date);
      expect(createdSession.classId).toBe(newSession.classId);
      expect(createdSession.notes).toBe(newSession.notes);
    });
  });

  describe("useStartSession", () => {
    it("should start a session", async () => {
      const { result } = renderHook(() => useStartSession(), {
        wrapper: createWrapper(),
      });

      const sessionId = "session-1";
      const updatedSession = await result.current(sessionId);

      expect(updatedSession).toBeDefined();
      expect(updatedSession.startedAt).toBeDefined();
    });
  });

  describe("useEndSession", () => {
    it("should end a session", async () => {
      const { result } = renderHook(() => useEndSession(), {
        wrapper: createWrapper(),
      });

      const sessionId = "session-3";
      const updatedSession = await result.current(sessionId);

      expect(updatedSession).toBeDefined();
      expect(updatedSession.endedAt).toBeDefined();
    });
  });
});
