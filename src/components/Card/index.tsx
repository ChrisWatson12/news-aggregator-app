import { useMemo } from "react";
import { INewsItem } from "../../types";
import { getArticleAuthor, getArticleTitle, getNyTimesImageUrl } from "../../utils";

export const Card = ({ item, index }: { item: INewsItem; index: number }) => {
  const {url, webUrl, urlToImage, fields: { thumbnail } = {}, } = item;
  const nyTimesImageUrl = useMemo(() => getNyTimesImageUrl(item), [item]);
  const articleAuthor = useMemo(() => getArticleAuthor(item), [item]);
  const articleTitle = useMemo(() => getArticleTitle(item), [item]);

  // Fallback for article image URL
  const articleImageUrl = useMemo(
    () =>
      urlToImage || thumbnail || nyTimesImageUrl || "/assets/images/news-placeholder.jpg",
    [urlToImage, thumbnail, nyTimesImageUrl]
  );

  return (
    <div
      key={index}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img
        className="w-full h-64 object-cover"
        src={articleImageUrl}
        alt={articleTitle}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{articleTitle}</h3>
        <p className="text-sm text-gray-500 mt-2 truncate">
          By <span className="font-medium">{articleAuthor}</span>
        </p>
        <a
          href={url ?? webUrl}
          className="text-blue-500 mt-4 inline-block"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read more
        </a>
      </div>
    </div>
  );
};
