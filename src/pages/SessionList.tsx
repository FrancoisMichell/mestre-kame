import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useFetchClassSessions,
  useFetchSessionsByClass,
  useFetchClasses,
  useStartSession,
  useEndSession,
} from "../api/hooks";
import SessionCalendar from "../components/session/SessionCalendar";

const SessionList = () => {
  const navigate = useNavigate();
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  // Fetch classes for the filter
  const { classes } = useFetchClasses({ isActive: true });

  // Fetch sessions based on selected class
  const allSessions = useFetchClassSessions({});
  const classSessions = useFetchSessionsByClass(selectedClassId || "", false);

  // Use the appropriate data source based on filter
  const { sessions, isLoading, mutate } = selectedClassId
    ? classSessions
    : allSessions;

  const startSession = useStartSession();
  const endSession = useEndSession();

  const handleCreateSession = () => {
    navigate("/aulas/nova");
  };

  const handleSessionClick = (sessionId: string) => {
    navigate(`/aulas/${sessionId}/editar`);
  };

  const handleStartSession = async (sessionId: string) => {
    try {
      const updated = await startSession(sessionId);
      if (updated) {
        // Update the cache with the new session data
        mutate();
      }
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  const handleEndSession = async (sessionId: string) => {
    try {
      const updated = await endSession(sessionId);
      if (updated) {
        // Update the cache with the new session data
        mutate();
      }
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Aulas Agendadas
        </h1>
        <p className="text-gray-600">
          Visualize e gerencie as aulas da sua academia
        </p>
      </div>

      {/* Class Filter */}
      <div className="mb-6">
        <label
          htmlFor="classFilter"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Filtrar por turma
        </label>
        <select
          id="classFilter"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as turmas</option>
          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.name}
            </option>
          ))}
        </select>
      </div>

      <SessionCalendar
        sessions={sessions}
        isLoading={isLoading}
        onSessionClick={handleSessionClick}
        onSessionStart={handleStartSession}
        onSessionEnd={handleEndSession}
        onCreateSession={handleCreateSession}
      />
    </div>
  );
};

export default SessionList;
