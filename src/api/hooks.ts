import useSWR from "swr";
import type { Student } from "../components/student/StudentTypes";
import type {
  Class,
  NewClass,
  UpdateClass,
} from "../components/class/ClassTypes";
import type {
  ClassSession,
  CreateClassSessionDto,
  UpdateClassSessionDto,
  ClassSessionFilters,
} from "../components/session/SessionTypes";
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

export const useUpdateClass = () => {
  return async (id: string, classData: UpdateClass) => {
    const response = await apiClient.patch(
      ENDPOINTS.CLASSES.UPDATE(id),
      classData,
    );
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

// ==================== CLASS-STUDENTS HOOKS ====================

export interface UseFetchClassStudentsParams {
  page?: number;
  limit?: number;
  sortBy?: "name" | "registry" | "belt";
  sortOrder?: "ASC" | "DESC";
  name?: string;
  registry?: string;
  belt?: string;
}

export const useFetchClassStudents = (
  classId: string,
  params?: UseFetchClassStudentsParams,
) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params?.name) queryParams.append("name", params.name);
  if (params?.registry) queryParams.append("registry", params.registry);
  if (params?.belt) queryParams.append("belt", params.belt);

  const url = queryParams.toString()
    ? `${ENDPOINTS.CLASSES.GET_STUDENTS(classId)}?${queryParams.toString()}`
    : ENDPOINTS.CLASSES.GET_STUDENTS(classId);

  const hasToken = !!localStorage.getItem("authToken");

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Student>>(
    hasToken && classId ? url : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      keepPreviousData: true,
      revalidateOnMount: true,
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

export const useEnrollStudent = () => {
  return async (classId: string, studentId: string) => {
    const response = await apiClient.post(
      ENDPOINTS.CLASSES.ENROLL_STUDENT(classId, studentId),
    );
    return response.data;
  };
};

export const useUnenrollStudent = () => {
  return async (classId: string, studentId: string) => {
    const response = await apiClient.delete(
      ENDPOINTS.CLASSES.UNENROLL_STUDENT(classId, studentId),
    );
    return response.data;
  };
};

// ==================== CLASS SESSIONS HOOKS ====================

export interface UseFetchClassSessionsParams extends ClassSessionFilters {
  page?: number;
  limit?: number;
  sortBy?: "date" | "startTime" | "createdAt";
  sortOrder?: "ASC" | "DESC";
}

// Hook to fetch all sessions with filters
export const useFetchClassSessions = (params?: UseFetchClassSessionsParams) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params?.classId) queryParams.append("classId", params.classId);
  if (params?.teacherId) queryParams.append("teacherId", params.teacherId);
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  if (params?.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());
  if (params?.includeInactive !== undefined)
    queryParams.append("includeInactive", params.includeInactive.toString());

  const url = queryParams.toString()
    ? `${ENDPOINTS.CLASS_SESSIONS.LIST}?${queryParams.toString()}`
    : ENDPOINTS.CLASS_SESSIONS.LIST;

  const hasToken = !!localStorage.getItem("authToken");

  const { data, error, isLoading, mutate } = useSWR<
    PaginatedResponse<ClassSession>
  >(hasToken ? url : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
    keepPreviousData: true,
    revalidateOnMount: true,
  });

  return {
    sessions: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

// Hook to fetch sessions by class ID
export const useFetchSessionsByClass = (
  classId: string,
  includeInactive = false,
) => {
  const queryParams = new URLSearchParams();
  if (includeInactive) queryParams.append("includeInactive", "true");

  const url = queryParams.toString()
    ? `${ENDPOINTS.CLASS_SESSIONS.BY_CLASS(classId)}?${queryParams.toString()}`
    : ENDPOINTS.CLASS_SESSIONS.BY_CLASS(classId);

  const hasToken = !!localStorage.getItem("authToken");

  const { data, error, isLoading, mutate } = useSWR<ClassSession[]>(
    hasToken && classId ? url : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      keepPreviousData: true,
      revalidateOnMount: true,
    },
  );

  return {
    sessions: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

// Hook to fetch sessions by teacher ID
export const useFetchSessionsByTeacher = (
  teacherId: string,
  includeInactive = false,
) => {
  const queryParams = new URLSearchParams();
  if (includeInactive) queryParams.append("includeInactive", "true");

  const url = queryParams.toString()
    ? `${ENDPOINTS.CLASS_SESSIONS.BY_TEACHER(teacherId)}?${queryParams.toString()}`
    : ENDPOINTS.CLASS_SESSIONS.BY_TEACHER(teacherId);

  const hasToken = !!localStorage.getItem("authToken");

  const { data, error, isLoading, mutate } = useSWR<ClassSession[]>(
    hasToken && teacherId ? url : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      keepPreviousData: true,
      revalidateOnMount: true,
    },
  );

  return {
    sessions: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

// Hook to fetch sessions by date range
export const useFetchSessionsByDateRange = (
  startDate: string,
  endDate: string,
  includeInactive = false,
) => {
  const queryParams = new URLSearchParams();
  queryParams.append("startDate", startDate);
  queryParams.append("endDate", endDate);
  if (includeInactive) queryParams.append("includeInactive", "true");

  const url = `${ENDPOINTS.CLASS_SESSIONS.BY_DATE_RANGE}?${queryParams.toString()}`;

  const hasToken = !!localStorage.getItem("authToken");

  const { data, error, isLoading, mutate } = useSWR<ClassSession[]>(
    hasToken && startDate && endDate ? url : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      keepPreviousData: true,
      revalidateOnMount: true,
    },
  );

  return {
    sessions: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

// Hook to fetch a single session by ID
export const useFetchSession = (sessionId: string) => {
  const hasToken = !!localStorage.getItem("authToken");

  const { data, error, isLoading, mutate } = useSWR<ClassSession>(
    hasToken && sessionId
      ? ENDPOINTS.CLASS_SESSIONS.GET_BY_ID(sessionId)
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  return {
    session: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

// Hook to create a new session
export const useCreateClassSession = () => {
  return async (sessionData: CreateClassSessionDto) => {
    const response = await apiClient.post(
      ENDPOINTS.CLASS_SESSIONS.CREATE,
      sessionData,
    );
    return response.data;
  };
};

// Hook to update a session
export const useUpdateClassSession = () => {
  return async (id: string, sessionData: UpdateClassSessionDto) => {
    const response = await apiClient.patch(
      ENDPOINTS.CLASS_SESSIONS.UPDATE(id),
      sessionData,
    );
    return response.data;
  };
};

// Hook to delete a session
export const useDeleteClassSession = () => {
  return async (id: string) => {
    const response = await apiClient.delete(
      ENDPOINTS.CLASS_SESSIONS.DELETE(id),
    );
    return response.data;
  };
};

// Hook to activate a session
export const useActivateClassSession = () => {
  return async (id: string) => {
    const response = await apiClient.patch(
      ENDPOINTS.CLASS_SESSIONS.ACTIVATE(id),
    );
    return response.data;
  };
};

// Hook to deactivate a session
export const useDeactivateClassSession = () => {
  return async (id: string) => {
    const response = await apiClient.patch(
      ENDPOINTS.CLASS_SESSIONS.DEACTIVATE(id),
    );
    return response.data;
  };
};

// Hook to start a session
export const useStartSession = () => {
  return async (id: string) => {
    const response = await apiClient.patch(ENDPOINTS.CLASS_SESSIONS.START(id));
    return response.data;
  };
};

// Hook to end a session
export const useEndSession = () => {
  return async (id: string) => {
    const response = await apiClient.patch(ENDPOINTS.CLASS_SESSIONS.END(id));
    return response.data;
  };
};
