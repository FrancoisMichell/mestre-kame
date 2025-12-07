// import { useEffect, useState } from "react";

// import axios from "axios";
import StudentCard from "../components/student/StudentCard";
import { useStudents } from "../components/student/StudentContext";

const Home: React.FC = () => {
  const { students, isLoading, error } = useStudents();

  const containerClass = "pt-24 flex flex-col space-y-2 p-5 max-w-4xl mx-auto";
  const headerClass = "text-3xl font-bold mb-6 text-red-900 text-center";

  const content = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Erro ao carregar alunos</p>
          <p className="text-sm">
            {error?.message || "Tente novamente mais tarde"}
          </p>
        </div>
      );
    }

    return students.length > 0 ? (
      students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))
    ) : (
      <p className="text-gray-600 text-center py-10">
        Nenhum aluno cadastrado.
      </p>
    );
  };
  return (
    <div className={containerClass}>
      <h1 className={headerClass}>Lista de Alunos</h1>
      {content()}
    </div>
  );
};

export default Home;
