import useSWR from "swr";
import type { Student } from "../components/student/StudentTypes";
import apiClient from "./client";

const fetcher = (url: string) => apiClient.get(url).then(({ data }) => data);

export const useFetchStudents = () => {
  const { data, error, isLoading, mutate } = useSWR<Student[]>(
    "/students",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 },
  );
  return {
    students: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

export const useAddStudent = () => {
  return async (student: Student) => {
    const response = await apiClient.post("/students", student);
    return response.data;
  };
};
