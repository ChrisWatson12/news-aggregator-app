import { INewsItem } from "../../types";

export const Card = ({ item }: { item: INewsItem }) => {
  const startsWithStatic01Nyt = (url: string) => {
    return url.startsWith("https://static01.nyt.com/");
  };

  const articleUrl = item?.url ? item?.url : item?.webUrl;

  const openArticleInNewTab = () => {
    if (articleUrl) {
      window.open(articleUrl, "_blank");
    }
  };

  // Helper function to extract the multimedia URL
  const getNyTimesImageUrl = (item: INewsItem) => {
    if (
      item?.multimedia?.[2]?.url &&
      startsWithStatic01Nyt(item?.multimedia[2]?.url)
    ) {
      return item?.multimedia[2]?.url;
    }
    if (item?.multimedia?.length) {
      return "https://static01.nyt.com/" + item?.multimedia[2]?.url;
    }
    return "";
  };

  // Helper function to get the article author
  const getArticleAuthor = (item: INewsItem) => {
    if (item?.author) {
      return item.author.substring(0, 30);
    }

    if (item?.source?.name) {
      return item.source.name.substring(0, 30);
    }

    if (item?.fields?.byline) {
      return item?.fields?.byline.substring(0, 30);
    }
    
    if (item?.byline) {
      if (typeof item.byline === "object" && item.byline?.original) {
        return item.byline.original.substring(0, 30);
      }
      if (typeof item.byline === "string" && item.byline.length > 0) {
        return item.byline.substring(0, 30);
      }
    }

    return (
      item?.sectionName?.substring(0, 30) || item?.subsection?.substring(0, 30)
    );
  };

  // Helper function to get the article title
  const getArticleTitle = (item: INewsItem) => {
    return (
      item?.title?.substring(0, 100) ||
      item?.webTitle?.substring(0, 100) ||
      item?.abstract?.substring(0, 100)
    );
  };

  // Main logic for constructing article info
  const nyTimesImageUrl = getNyTimesImageUrl(item);
  const articleAuthor = getArticleAuthor(item);
  const articleTitle = getArticleTitle(item);

  // Fallback for article image URL
  const articleImageUrl =
    item?.urlToImage || item?.fields?.thumbnail || nyTimesImageUrl;

  return (
    <div
      className="rounded-md overflow-hidden shadow-lg cursor-pointer"
      onClick={openArticleInNewTab}
    >
      <div
        className="w-full h-64 object-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            articleImageUrl
              ? articleImageUrl
              : "/assets/images/news-placeholder.jpg"
          })`,
        }}
      ></div>
      <img
        className="w-full h-64 object-center bg-cover hidden"
        src={item.urlToImage}
        alt={`cover of "${item.title}" by ${item.author}`}
      />
      <div className="px-6 py-2">
        <div className="flex flex-col items-center">
          <h1 className="py-2 px-4 rounded-lg text-center text-lg tracking-tighter font-bold bg-[#003366] text-white">
            {articleAuthor}
          </h1>
          <h2 className="text-base tracking-tighter mt-1 text-center font-bold">
            {articleTitle}
          </h2>
        </div>
      </div>
    </div>
  );
};
