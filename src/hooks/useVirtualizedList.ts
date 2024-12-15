import { useRef, useCallback } from 'react';
import { List } from 'react-virtualized';

interface UseVirtualizedListProps<T> {
  items: T[];
  rowHeight?: number;
  overscanRowCount?: number;
  onRowsRendered?: (info: { startIndex: number; stopIndex: number }) => void;
}

export function useVirtualizedList<T>({
  items,
  rowHeight = 50,
  overscanRowCount = 10,
  onRowsRendered,
}: UseVirtualizedListProps<T>) {
  const listRef = useRef<List>(null);

  const scrollToIndex = useCallback((index: number) => {
    listRef.current?.scrollToRow(index);
  }, []);

  return {
    listRef,
    scrollToIndex,
    rowHeight,
    overscanRowCount,
    onRowsRendered,
    totalCount: items.length,
  };
}