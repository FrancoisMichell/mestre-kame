import type React from "react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Belt, Student, NewStudent } from "./StudentTypes";
import { useNavigate } from "react-router-dom";
import { useStudents } from "./StudentContext";
import { getBeltColor } from "./StudentUtils";

const beltOptions: Belt[] = ['branca', 'amarela', 'laranja', 'verde', 'azul', 'marrom', 'preta'];

const initialFormData: NewStudent = {
  id: "",
  name: "",
  birthday: "",
  email: "",
  trainingSince: "",
  belt: "branca",
};

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<NewStudent>(initialFormData);
  const { addStudent } = useStudents();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalStudentData: Student = {
      ...formData,
      id: formData.id || Date.now().toString(),
      isActive: true,
      color: getBeltColor(formData.belt),
    };
    addStudent(finalStudentData);

    setFormData(initialFormData);
    alert(`Aluno ${formData.name} cadastrado com sucesso!`);
    navigate("/");
  };

  return (
    <div className="flex justify-center w-full my-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl p-8 rounded-lg w-full max-w-lg border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Novo aluno
        </h2>

        <div className="mb-5">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {" "}
            Nome completo{" "}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="text-gray-900 w-full border border-gray-300 p-3 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
            placeholder="Ex: João das Neves"
          />
        </div>
        {/* Matrícula (ID) */}
        <div className="mb-5">
          <label
            htmlFor="id"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Matrícula (ID)
          </label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
            className="text-gray-900 w-full border border-gray-300 p-3 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
            placeholder="Ex: 2024010"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="text-gray-900 w-full border border-gray-300 p-3 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
            placeholder="exemplo@academia.com"
          />
        </div>

        {/* Datas (Birthday e TrainingSince) */}
        <div className="flex space-x-4 mb-6">
          <div className="w-1/2">
            <label
              htmlFor="birthday"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data de Nascimento
            </label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              required
              className="text-gray-900 w-full border border-gray-300 p-3 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="trainingSince"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Treinando Desde
            </label>
            <input
              type="date"
              id="trainingSince"
              name="trainingSince"
              value={formData.trainingSince}
              onChange={handleChange}
              required
              className="text-gray-900 w-full border border-gray-300 p-3 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
            />
          </div>
        </div>

        {/* Faixa (Belt) */}
        <div className="mb-5">
          <label
            htmlFor="belt"
            className="block text-sm font-medium text-gray-700 mb-1">Faixa</label>
          <select
            id="belt"
            name="belt"
            value={formData.belt}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-md text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
          >
            {beltOptions.map((belt) => (
              <option key={belt} value={belt}>
                {belt.charAt(0).toUpperCase() + belt.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Botão de Submissão */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-150 shadow-md"
        >
          Cadastrar Aluno
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
