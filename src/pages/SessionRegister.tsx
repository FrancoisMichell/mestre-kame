import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SessionForm from "../components/session/SessionForm";
import { useCreateClassSession } from "../api/hooks";
import type {
  CreateClassSessionDto,
  UpdateClassSessionDto,
} from "../components/session/SessionTypes";

const SessionRegister: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const createSession = useCreateClassSession();

  const handleSubmit = async (
    data: CreateClassSessionDto | UpdateClassSessionDto,
  ) => {
    setIsSubmitting(true);
    try {
      await createSession(data as CreateClassSessionDto);
      navigate("/aulas");
    } catch (error) {
      console.error("Error creating session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nova Aula</h1>
        <p className="text-gray-600">Agende uma nova aula para uma turma</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <SessionForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  );
};

export default SessionRegister;
