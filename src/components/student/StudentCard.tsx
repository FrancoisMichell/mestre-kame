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
      className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 pr-6 
                 border-l-4 border-solid transition-transform duration-200 
                 hover:-translate-y-0.5 hover:shadow-lg"
      style={{ borderLeftColor: beltColor }}
    >
      <div className="flex items-center space-x-5 flex-1 min-w-0">
        {/* Imagem do Aluno */}
        <img
          src={`https://ui-avatars.com/api/?name=${name.replace(" ", "+")}`}
          alt={`Foto de ${name}`}
          className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shrink-0"
        />

        {/* Informações Principais */}
        <div className="min-w-0">
          <div>
            <h3 className="text-lg font-bold text-gray-800 truncate">
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
            <strong className="font-semibold"> Treina desde:</strong>{" "}
            {trainingSince ? formatDate(trainingSince) : "N/A"}
          </p>
        </div>
      </div>

      {/* Indicador de Status */}
      <div className="flex items-center space-x-6 shrink-0 ml-6">
        <div
          className={`py-1.5 px-3 rounded-full text-xs font-semibold ${statusClasses}`}
        >
          {isActive ? "Ativo" : "Inativo"}
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
