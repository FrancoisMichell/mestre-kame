import type React from "react";
import type { Class } from "./ClassTypes";
import { formatDays, formatTime, formatDuration } from "./daysConfig";

export interface ClassCardProps {
  classItem: Class;
}

const ClassCard: React.FC<ClassCardProps> = ({ classItem }) => {
  const statusColor = classItem.isActive
    ? "bg-green-100 text-green-800"
    : "bg-gray-100 text-gray-800";

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {classItem.name}
          </h3>
          <p className="text-sm text-gray-600">
            Professor: {classItem.teacher.name}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
        >
          {classItem.isActive ? "Ativa" : "Inativa"}
        </span>
      </div>

      {/* Informações */}
      <div className="space-y-2">
        {/* Dias */}
        <div className="flex items-center text-sm">
          <svg
            className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-gray-700">{formatDays(classItem.days)}</span>
        </div>

        {/* Horário */}
        <div className="flex items-center text-sm">
          <svg
            className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-gray-700">
            {formatTime(classItem.startTime)} •{" "}
            {formatDuration(classItem.durationMinutes)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
