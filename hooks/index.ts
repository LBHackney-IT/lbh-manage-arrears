import { useCallback, useMemo, useState } from 'react';

export const usePagination = () => {
    const [currentPage, setCurrentPage] = useState(1);
  
    const onPageChange = (pageIndex: number) => {
      setCurrentPage(pageIndex + 1);
    }
  
    const resetCurrentPage = () => {
      setCurrentPage(1);
    };
  
    return {
      currentPage,
      onPageChange,
      resetCurrentPage,
    };
  };