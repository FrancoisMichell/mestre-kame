import useSWR from "swr";
import type { Student } from "../components/student/StudentTypes";
import type { Class, NewClass } from "../components/class/ClassTypes";
import type { PaginatedResponse } from "../types/api";
import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

const fetcher = (url: string) => apiClient.get(url).then(({ data }) => data);

export interface UseFetchStudentsParams {
  page?: number;
  limit?: number;
  sortBy?: "name" | "registry" | "belt" | "createdAt";
  sortOrder?: "ASC" | "DESC";
  name?: string;
  registry?: string;
  belt?: string;
  isActive?: boolean;
}

export const useFetchStudents = (params?: UseFetchStudentsParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params?.name) queryParams.append("name", params.name);
  if (params?.registry) queryParams.append("registry", params.registry);
  if (params?.belt) queryParams.append("belt", params.belt);
  if (params?.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());

  const url = queryParams.toString()
    ? `${ENDPOINTS.STUDENTS.LIST}?${queryParams.toString()}`
    : ENDPOINTS.STUDENTS.LIST;

  // Só faz fetch se houver token de autenticação
  const hasToken = !!localStorage.getItem("authToken");

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Student>>(
    hasToken ? url : null, // null desabilita o fetch
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

// ==================== CLASSES HOOKS ====================

export interface UseFetchClassesParams {
  page?: number;
  limit?: number;
  sortBy?: "name" | "startTime" | "createdAt";
  sortOrder?: "ASC" | "DESC";
  name?: string;
  isActive?: boolean;
  includeInactive?: boolean;
}

export const useAddClass = () => {
  return async (classData: NewClass) => {
    const response = await apiClient.post(ENDPOINTS.CLASSES.CREATE, classData);
    return response.data;
  };
};

export const useFetchClasses = (params?: UseFetchClassesParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params?.name) queryParams.append("name", params.name);
  if (params?.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());
  if (params?.includeInactive !== undefined)
    queryParams.append("includeInactive", params.includeInactive.toString());

  const url = queryParams.toString()
    ? `${ENDPOINTS.CLASSES.LIST}?${queryParams.toString()}`
    : ENDPOINTS.CLASSES.LIST;

  // Só faz fetch se houver token de autenticação
  const hasToken = !!localStorage.getItem("authToken");

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Class>>(
    hasToken ? url : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      keepPreviousData: true,
      revalidateOnMount: true,
    },
  );

  return {
    classes: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};
