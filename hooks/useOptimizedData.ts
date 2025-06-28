import { useState, useEffect, useMemo, useCallback } from 'react';
import { debounce } from '../utils/performance';

// Hook pour la gestion optimisée des données
export const useOptimizedData = <T>(
  initialData: T[],
  searchKey?: keyof T
) => {
  const [data, setData] = useState<T[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Recherche debouncée
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setIsLoading(true);
      // Simulation d'une recherche asynchrone
      setTimeout(() => {
        if (searchKey && term) {
          const filtered = initialData.filter(item =>
            String(item[searchKey]).toLowerCase().includes(term.toLowerCase())
          );
          setData(filtered);
        } else {
          setData(initialData);
        }
        setIsLoading(false);
      }, 100);
    }, 300),
    [initialData, searchKey]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Données memoizées
  const memoizedData = useMemo(() => data, [data]);

  return {
    data: memoizedData,
    searchTerm,
    isLoading,
    handleSearch,
    setData,
  };
};

// Hook pour la pagination
export const usePagination = <T>(
  data: T[],
  itemsPerPage: number = 10
) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    data: paginatedData,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
};