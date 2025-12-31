import React from "react";
import type { StudentCardProps } from "./StudentTypes";
import { getBeltColor, getBeltName } from "./StudentUtils";
import { useNavigate } from "react-router-dom";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "";
  // Parseia a data em formato DD/MM/YYYY de forma determinística
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  const { name, registry, birthday, isActive, trainingSince, belt } = student;
  const beltColor = getBeltColor(belt);
  const navigate = useNavigate();

  // Classes condicionais para Status
  const statusClasses = isActive
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";

  return (
    <div
      onClick={() => navigate(`/aluno/${student.id}`)}
      className="flex flex-wrap items-center gap-3 md:gap-4 bg-white rounded-lg md:rounded-xl 
                 shadow-sm md:shadow-md p-2.5 md:p-4 border-l-4 border-solid 
                 transition-all duration-200 hover:shadow-md md:hover:shadow-lg 
                 md:hover:-translate-y-0.5 cursor-pointer"
      style={{ borderLeftColor: beltColor }}
    >
      {/* Avatar - menor em mobile */}
      <img
        src={`https://ui-avatars.com/api/?name=${name.replace(" ", "+")}`}
        alt={`Foto de ${name}`}
        className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border-2 border-gray-200 shrink-0"
      />

      {/* Informações - Layout adaptativo */}
      <div className="flex-1 min-w-0">
        {/* Mobile: Compacto */}
        <div className="md:hidden">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-gray-800">{name}</h3>
            <span className="text-xs text-gray-500">#{registry}</span>
            <span
              style={{ color: beltColor }}
              className="text-xs font-semibold capitalize"
            >
              {getBeltName(belt)}
            </span>
          </div>
          <div className="flex gap-4 text-xs text-gray-500 mt-0.5">
            {birthday && <span>🎂 {formatDate(birthday)}</span>}
            {trainingSince && <span>🥋 {formatDate(trainingSince)}</span>}
          </div>
        </div>

        {/* Desktop: Original */}
        <div className="hidden md:block">
          <div>
            <h3 className="text-lg font-bold text-gray-800 break-words">
              {name} - {registry}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              <span className="font-semibold mr-1">Faixa:</span>
              <span
                style={{
                  color: beltColor,
                  fontWeight: "bold" as const,
                  textTransform: "capitalize" as const,
                }}
                className="mr-3"
              >
                {getBeltName(belt)}
              </span>
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            <strong className="font-semibold">Aniversário:</strong>{" "}
            {birthday ? formatDate(birthday) : "N/A"}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            <strong className="font-semibold">Treina desde:</strong>{" "}
            {trainingSince ? formatDate(trainingSince) : "N/A"}
          </p>
        </div>
      </div>

      {/* Status Badge - adaptativo */}
      <div className="flex items-center shrink-0">
        <div
          className={`py-1 md:py-1.5 px-2 md:px-3 rounded-full text-xs font-semibold ${statusClasses}`}
        >
          <span className="md:hidden">{isActive ? "✓" : "✗"}</span>
          <span className="hidden md:inline">
            {isActive ? "Ativo" : "Inativo"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
