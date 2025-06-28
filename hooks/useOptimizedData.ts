import { useState, useMemo, useCallback } from 'react';

export function useOptimizedData<T>(data: T[], searchField: keyof T) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    
    return data.filter(item => {
      const fieldValue = item[searchField];
      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  }, [data, searchTerm, searchField]);

  const handleSearch = useCallback((term: string) => {
    setIsLoading(true);
    setSearchTerm(term);
    // Simulate async search
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  return {
    data: filteredData,
    searchTerm,
    isLoading,
    handleSearch,
  };
}

export function usePagination<T>(data: T[], itemsPerPage: number = 20) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  return {
    data: paginatedData,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    hasNext,
    hasPrev,
  };
}