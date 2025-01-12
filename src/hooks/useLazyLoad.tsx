import { useState, useEffect, useRef, useCallback } from "react";
import { useScrollEnd } from "./useScrollEnd";
import { INewsItem } from "../types";

const PAGE_SIZE = 20;

export function useLazyLoad(
  items: INewsItem[],
  loaderTriggerElement: HTMLElement | null
) {
  const lastItems = useRef<object | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPagesCount = items?.length;
  const isLastPage = totalPagesCount === currentPage || totalPagesCount === 0;
  const visibleItems = items?.slice(0, currentPage * PAGE_SIZE);

  const onScrollEnd = useCallback(() => {
    if (!isLastPage) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, isLastPage]);

  useEffect(() => {
    if (lastItems.current !== items) {
      setCurrentPage(1);
      lastItems.current = items;
    }
  }, [items]);

  useScrollEnd(loaderTriggerElement, onScrollEnd);

  return { visibleItems, currentPage, isLastPage };
}
