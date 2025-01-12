import { useRef, useMemo } from "react";
import { Card } from "../Card";
import { useLazyLoad } from "../../hooks/useLazyLoad";
import { INewsItem } from "../../types";

export const NewsList = ({ items }: { items: INewsItem[] }) => {
  const loaderTriggerRef = useRef(null);
  const { visibleItems, isLastPage } = useLazyLoad(
    items,
    loaderTriggerRef.current
  );

  // Memoize filteredItems to avoid recalculating on every render
  const filteredItems = useMemo(
    () =>
      visibleItems.filter(
        (article) =>
          article?.title !== "[Removed]" &&
          article?.source?.name !== "[Removed]"
      ),
    [visibleItems]
  );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-20">
      {filteredItems.map((article, i) => (
        <Card key={`news-article-${i}`} item={article} index={i} />
      ))}
      <div
        ref={loaderTriggerRef}
        style={{ height: "100px" }}
        hidden={isLastPage}
      ></div>
    </div>
  );
};
