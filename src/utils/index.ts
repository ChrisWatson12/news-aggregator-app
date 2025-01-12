import { INewsItem, SelectOptions } from "../types";

export const joinQueryValues = (
  data: readonly SelectOptions[],
  key: "value" | "label",
  withQuotes: boolean = true,
  separator: string = " "
): string =>
  data
    .map((item: SelectOptions) => (withQuotes ? `"${item[key]}"` : item[key]))
    .join(separator);

// Helper function to check URL prefix
export const startsWithStatic01Nyt = (url: string): boolean =>
  url.startsWith("https://static01.nyt.com/");

// Helper function to extract multimedia URL
export const getNyTimesImageUrl = (item: Partial<INewsItem>): string => {
  const multimedia = item?.multimedia;
  if (!multimedia || multimedia.length < 3) return "";

  const imageUrl = multimedia[2]?.url as string;
  return startsWithStatic01Nyt(imageUrl)
    ? imageUrl
    : `https://static01.nyt.com/${imageUrl}`;
};

// Helper function to extract article author
export const getArticleAuthor = (item: Partial<INewsItem>): string => {
  return (
    item?.author ||
    item?.source?.name ||
    item?.fields?.byline ||
    (typeof item?.byline === "object" && item?.byline?.original) ||
    (typeof item?.byline === "string" && item?.byline) ||
    item?.sectionName ||
    item?.subsection ||
    "Unknown Author"
  );
};

// Helper function to extract article title
export const getArticleTitle = (item: Partial<INewsItem>): string =>
  item?.title || item?.webTitle || item?.headline?.main || "";    

/**
 * Checks if an array has values.
 * @param {Array} array - The array to check.
 * @returns {Array|null} - The array itself if it has values, otherwise null.
 */
export const getArrayOrNull = (array: []) => (Array.isArray(array) && array.length > 0 ? array : null);
