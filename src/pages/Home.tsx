// import { useEffect, useState } from "react";

// import axios from "axios";
import StudentCard from "../components/student/StudentCard";
import { useStudents } from "../components/student/StudentContext";

const Home: React.FC = () => {
  const { students } = useStudents();

  // const [students, setStudents] = useState<
  //   Array<{ id: string; name: string; isActive: boolean; createdAt: Date }>
  // >([]);

  // useEffect(() => {
  //   axios.get("http://localhost:3000/students").then((res) => {
  //     setStudents(res.data);
  //   });
  // }, []);

  return (
    <div className="pt-24flex flex-col space-y-2 p-5 max-w-4xl mx-auto">
      {" "}
      <h1 className="text-3xl font-bold mb-6 text-red-900 text-center">
        Lista de Alunos
      </h1>
      {students.length > 0 ? (
        students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))
      ) : (
        <p className="text-gray-600 text-center py-10">
          Nenhum aluno cadastrado.
        </p>
      )}
    </div>
  );
};

export default Home;
