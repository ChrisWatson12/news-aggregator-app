import useSWR from "swr";
import axios from "axios";
import { FilterData } from "../types";
import { getArrayOrNull } from "../utils";

const swrConfig = {
  revalidateOnFocus: false, // Disable revalidation when the page regains focus
  revalidateOnReconnect: false, // Disable revalidation when the network reconnects
  shouldRetryOnError: false, // Disable retries on API errors
};

// API Keys
const API_KEYS = {
  newsAPI: "a2b077099b0d4c2b9f0f55a0ccb43ee4",
  nyTimes: "X7NZonKJgrdAaJdumZc7S0KLtaXLZIW3",
  theGuardian: "0c2ca7b2-1736-4348-82b3-d711a9b817c0",
};

const newsApiAPiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=20&apiKey=${API_KEYS.newsAPI}`;

const newYorkTimesArticlesUrl = `https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=${API_KEYS.nyTimes}`;

const theGuardianAPiUrl = `https://content.guardianapis.com/search?&page-size=50&show-fields=thumbnail&api-key=${API_KEYS.theGuardian}`;

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useFetchNewsApiData() {
  const { data, error, isLoading } = useSWR(newsApiAPiUrl, fetcher, swrConfig);

  return {
    allNewsApiData: data?.articles || [],
    isLoadingNewsApiData: isLoading,
    isErrorNewsApiData: error,
  };
}

export function useFetchNewYorkTimesArticlesData() {
  const { data, error, isLoading } = useSWR(newYorkTimesArticlesUrl, fetcher, swrConfig);

  return {
    allNewYorkTimesData: data?.results || [],
    isLoadingNewYorkTimesData: isLoading,
    isErrorNewYorkTimesData: error,
  };
}

export function useFetchTheGuardianData() {
  const { data, error, isLoading } = useSWR(theGuardianAPiUrl, fetcher, swrConfig);

  return {
    allTheGuardianData: data?.response?.results || [],
    isLoadingTheGuardianData: isLoading,
    isErrorTheGuardianData: error,
  };
}

export function useFetchSearchResultData(filterData: FilterData, selectedSources: Record<string, boolean>) {
  const { searchQuery, category, fromDate, toDate  } = filterData;
  const {value: selectedCategory, type: catType} = category || {};

  const urls = {
    newsAPI: {
      query: `https://newsapi.org/v2/everything?q=${searchQuery}&pageSize=50&apiKey=${API_KEYS.newsAPI}`,
      category: `https://newsapi.org/v2/top-headlines?country=us&category=${selectedCategory}&pageSize=50&apiKey=${API_KEYS.newsAPI}`,
      dates: `https://newsapi.org/v2/everything?from=${fromDate}&to=${toDate}&sources=abc-news&pageSize=50&apiKey=${API_KEYS.newsAPI}`,
      queryAndCategory: `https://newsapi.org/v2/top-headlines?country=us&q=${searchQuery}&category=${selectedCategory}&pageSize=50&apiKey=${API_KEYS.newsAPI}`,
    },
    nyTimes: {
      query: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchQuery}&api-key=${API_KEYS.nyTimes}`,
      category: `https://api.nytimes.com/svc/news/v3/content/all/${selectedCategory}.json?api-key=${API_KEYS.nyTimes}`,
      dates: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchQuery}&begin_date=${fromDate.replace(/-/g, "")}${toDate ? `&end_date=${toDate.replace(/-/g, "")}` : ''}&api-key=${API_KEYS.nyTimes}`,
      queryAndCategory: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchQuery}?fq=${`section.exact:("${selectedCategory}")`}&api-key=${API_KEYS.nyTimes}`,
    },
    theGuardian: {
      query: `https://content.guardianapis.com/search?q=${searchQuery}&page-size=50&show-fields=thumbnail&api-key=${API_KEYS.theGuardian}`,
      category: `https://content.guardianapis.com/search?section=${selectedCategory}&page-size=50&show-fields=thumbnail&api-key=${API_KEYS.theGuardian}`,
      dates: `https://content.guardianapis.com/search?from-date=${fromDate}${toDate ? `&to-date=${toDate}` : ''}&page-size=50&show-fields=thumbnail&api-key=${API_KEYS.theGuardian}`,
      queryAndCategory: `https://content.guardianapis.com/search?q=${searchQuery}&section=${selectedCategory}&page-size=50&show-fields=thumbnail&api-key=${API_KEYS.theGuardian}`,
    },
  };

  // Helper to select appropriate URL
  const getUrl = (src: string, baseUrls: any, selectedSource: any, defaultUrl: any) => {
    if (!selectedSource) return null;

    switch (true) {
      case Boolean(fromDate):
        return (fromDate && !toDate || fromDate < toDate)  ? baseUrls.dates : null;  

      case Boolean(searchQuery && selectedCategory):
        return baseUrls.queryAndCategory || baseUrls.category;

      case Boolean(selectedCategory):
        return catType === src ? baseUrls.category : null;

      case Boolean(searchQuery):
        return baseUrls.query;

      default:

        return defaultUrl;
    }
  };

  // Generate URLs
  const newsApiSearchUrl = getUrl(
    'newAPI',
    urls.newsAPI,
    selectedSources.isNewsAPI,
    newsApiAPiUrl,
  );
  const nyTimesSearchUrl = getUrl(
    'nyTimes',
    urls.nyTimes,
    selectedSources.isNYTimes,
    newYorkTimesArticlesUrl
  );
  const theGuardianSearchUrl = getUrl(
    'theGuardian',
    urls.theGuardian,
    selectedSources.isTheGuardian,
    theGuardianAPiUrl
  );

  // Fetch data using SWR
  const { data: newsApiData, isLoading: newsApiIsLoading } = useSWR(
    newsApiSearchUrl,
    fetcher,
    swrConfig
  );

  const { data: nyTimesApiData, isLoading: nyTimesIsLoading } = useSWR(
    nyTimesSearchUrl,
    fetcher,
    swrConfig
  );

  const { data: theGuardianApiData, isLoading: theGuardianIsLoading } = useSWR(
    theGuardianSearchUrl,
    fetcher,
    swrConfig
  );

  // Merge results
  const mergedArray = [
    ...(getArrayOrNull(newsApiData?.response?.docs) ??
      getArrayOrNull(newsApiData?.results) ??
      getArrayOrNull(newsApiData?.articles) ??
      []),
    ...(getArrayOrNull(nyTimesApiData?.response?.docs) ??
      getArrayOrNull(nyTimesApiData?.results) ??
      getArrayOrNull(nyTimesApiData?.articles) ??
      []),
    ...(getArrayOrNull(theGuardianApiData?.response?.docs) ??
      getArrayOrNull(theGuardianApiData?.response?.results) ??
      getArrayOrNull(theGuardianApiData?.articles) ??
      []),
  ];

  // Return results
  return {
    searchResultData: mergedArray,
    isSearchResultLoading: newsApiIsLoading || nyTimesIsLoading || theGuardianIsLoading,
  };
}

export function useFetchNYTimesSectionListData(shouldFetch = false) {
  const { data, isLoading } = useSWR(
    shouldFetch ? `https://api.nytimes.com/svc/news/v3/content/section-list.json?api-key=${API_KEYS.nyTimes}` : null,
    fetcher,
    swrConfig
  );

  return {
    nyTimesSectionListData: data?.results || [],
    isNYTimesSectionListLoading: isLoading,
  };
}

export function useFetchTheGuardianSectionListData(shouldFetch = false) {
  const { data, isLoading } = useSWR(
    shouldFetch ? `https://content.guardianapis.com/sections?api-key=${API_KEYS.theGuardian}` : null,
    fetcher,
    swrConfig
  );

  return {
    guadianSectionListData: data?.response?.results || [],
    isGuardianSectionListLoading: isLoading,
  };
}
