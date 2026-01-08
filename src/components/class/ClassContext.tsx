import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { Class } from "./ClassTypes";
import type { PaginationMeta } from "../../types/api";
import { useFetchClasses } from "../../api/hooks";
import { useResponsiveLimit } from "../../hooks/useResponsiveLimit";

export interface ClassContextType {
  classes: Class[];
  meta?: PaginationMeta;
  page: number;
  limit: number;
  includeInactive: boolean;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setIncludeInactive: (include: boolean) => void;
  refreshClasses: () => Promise<void>;
  isLoading: boolean;
  error?: Error;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const responsiveLimit = useResponsiveLimit();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(() => responsiveLimit);
  const [includeInactive, setIncludeInactive] = useState(false);

  const {
    classes: apiClasses,
    meta,
    isLoading,
    error,
    mutate,
  } = useFetchClasses({
    page,
    limit,
    includeInactive,
  });

  const refreshClasses = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const handleSetLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset para primeira página ao mudar o limite
  }, []);

  const value = useMemo(
    () => ({
      classes: apiClasses,
      meta,
      page,
      limit,
      includeInactive,
      setPage,
      setLimit: handleSetLimit,
      setIncludeInactive,
      refreshClasses,
      isLoading,
      error,
    }),
    [
      apiClasses,
      meta,
      page,
      limit,
      includeInactive,
      handleSetLimit,
      refreshClasses,
      isLoading,
      error,
    ],
  );

  return (
    <ClassContext.Provider value={value}>{children}</ClassContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useClasses = (): ClassContextType => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClasses must be used within a ClassProvider");
  }
  return context;
};
