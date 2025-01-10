import useSWR from "swr";
import axios from "axios";
import { FilterData } from "../types";
import { joinQueryValues } from "../utils";

const swrConfig = {
  revalidateOnFocus: false, // Disable revalidation when the page regains focus
  revalidateOnReconnect: false, // Disable revalidation when the network reconnects
  shouldRetryOnError: false, // Disable retries on API errors
};

const newsApiKey = "a2b077099b0d4c2b9f0f55a0ccb43ee4";
const nYTimesKey = "X7NZonKJgrdAaJdumZc7S0KLtaXLZIW3";
const theGuardianAPiKey = "0c2ca7b2-1736-4348-82b3-d711a9b817c0";

const newsApiAPiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=20&apiKey=${newsApiKey}`;

const newYorkTimesArticlesUrl = `https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=${nYTimesKey}`;

const theGuardianAPiUrl = `https://content.guardianapis.com/search?&page-size=50&show-fields=thumbnail&api-key=${theGuardianAPiKey}`;

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

export function useFetchSearchResultData(filterData: FilterData) {
  const { searchQuery, categories, authors, sources, fromDate, toDate } = filterData;
  const selectedCategories = joinQueryValues(categories, 'value', false, ', ');
  const selectedAuthors = joinQueryValues(authors, 'label', false, ', ');
  const selectedSources = joinQueryValues(sources, 'value', false, ', ');
  let isValidQuery = Boolean(searchQuery || selectedCategories || selectedSources || selectedAuthors || fromDate);
  
  if((fromDate && toDate) && (fromDate > toDate)) {
    isValidQuery = false;
  }

  const constructUrl = (
    baseUrl: string,
    params: Record<string, string | number | undefined>
  ) => {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.append(key, String(value));
    });

    return `${baseUrl}?${urlParams.toString()}`;
  };

  const buildFqQuery = () => {
    const conditions = [];
  
    if (categories.length) {
      conditions.push(`section_name.exact:(${joinQueryValues(categories, 'value', true, ' ')})`);
    }
  
    if (sources.length) {
      conditions.push(`source.exact:(${joinQueryValues(sources, 'value', true, ' ')})`);
    }
  
    if (authors.length) {
      conditions.push(`byline.exact:(${joinQueryValues(authors, 'label', true, ' ')})`);
    }
  
    return conditions.length ? conditions.join(" OR ") : undefined;
  }

  const urls = {
    newsApi: constructUrl("https://newsapi.org/v2/everything", {
      q: searchQuery || undefined,
      category: selectedCategories || undefined,
      author: selectedAuthors || undefined,
      sources: selectedSources || undefined,
      from: fromDate || undefined,
      to: toDate || undefined,
      apiKey: newsApiKey,
    }),

    NYTimes: constructUrl(
      "https://api.nytimes.com/svc/search/v2/articlesearch.json",
      {
        q: searchQuery || undefined,
        begin_date: fromDate.replace(/-/g, "") || undefined,
        end_date: toDate.replace(/-/g, "") || undefined,
        fq: buildFqQuery(),
        "api-key": nYTimesKey,
      }
    ),

    theGuardian: constructUrl("https://content.guardianapis.com/search", {
      q: searchQuery || undefined,
      section: selectedCategories || undefined,
      byline: selectedAuthors || undefined,
      "from-date": fromDate || undefined,
      "to-date": toDate || undefined,
      "page-size": 50,
      "show-fields": "thumbnail,byline",
      "api-key": theGuardianAPiKey,
    }),
  };

  const { data: newsApiData, isLoading: newsApiIsLoading } = useSWR(isValidQuery ? urls.newsApi : null, fetcher, swrConfig);
  const { data: NYTimesData, isLoading: nyTimesDataIsLoading } = useSWR(isValidQuery ? urls.NYTimes : null, fetcher, swrConfig);
  const { data: theGuardianData, isLoading: theGuardianDataIsLoading } = useSWR(isValidQuery ? urls.theGuardian : null, fetcher, swrConfig);

  const mergedArray = [
    ...(newsApiData?.articles || []),
    ...(NYTimesData?.response?.docs || NYTimesData?.articles || []),
    ...(theGuardianData?.response?.results || []),
  ];

  return {
    searchResultData: mergedArray,
    isSearchResultLoading: newsApiIsLoading || nyTimesDataIsLoading || theGuardianDataIsLoading,
  };
}
