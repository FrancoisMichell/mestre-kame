import type React from "react";
import ClassRegisterForm from "../components/class/ClassRegisterForm";

const ClassRegister: React.FC = () => {
  return (
    <div className="pt-20 md:pt-24 px-4 md:px-5 py-3 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Nova Turma
        </h1>
        <ClassRegisterForm />
      </div>
    </div>
  );
};

export default ClassRegister;
