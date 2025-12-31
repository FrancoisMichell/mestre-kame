import useSWR from "swr";
import type { Student } from "../components/student/StudentTypes";
import type { PaginatedResponse } from "../types/api";
import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

const fetcher = (url: string) => apiClient.get(url).then(({ data }) => data);

export interface UseFetchStudentsParams {
  page?: number;
  limit?: number;
}

export const useFetchStudents = (params?: UseFetchStudentsParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const url = queryParams.toString()
    ? `${ENDPOINTS.STUDENTS.LIST}?${queryParams.toString()}`
    : ENDPOINTS.STUDENTS.LIST;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Student>>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // 5s para evitar requisições duplicadas
      keepPreviousData: true, // Mantém dados anteriores durante transição
      revalidateOnMount: true, // Sempre valida ao montar
    },
  );
  return {
    students: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

export const useAddStudent = () => {
  return async (student: Student) => {
    const response = await apiClient.post(ENDPOINTS.STUDENTS.CREATE, student);
    return response.data;
  };
};
