import useSWR from "swr";
import axios from "axios";

const newsApiKey = "a2b077099b0d4c2b9f0f55a0ccb43ee4";
const nYTimesKey = "X7NZonKJgrdAaJdumZc7S0KLtaXLZIW3";
const theGuardianAPiKey = "0c2ca7b2-1736-4348-82b3-d711a9b817c0";

const newsApiAPiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=20&apiKey=${newsApiKey}`;

const newYorkTimesArticlesUrl = `https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=${nYTimesKey}`;

const theGuardianAPiUrl = `https://content.guardianapis.com/search?&page-size=20&show-fields=thumbnail&api-key=${theGuardianAPiKey}`;

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useFetchNewsApiData() {
  const { data, error } = useSWR(newsApiAPiUrl, fetcher);

  return {
    allNewsApiData: data?.articles || [],
    isLoadingNewsApiData: !error && !data,
    isErrorNewsApiData: error,
  };
}

export function useFetchNewYorkTimesArticlesData() {
  const { data, error } = useSWR(newYorkTimesArticlesUrl, fetcher);

  return {
    allNewYorkTimesData: data?.results || [],
    isLoadingNewYorkTimesData: !error && !data,
    isErrorNewYorkTimesData: error,
  };
}

export function useFetchTheGuardianData() {
  const { data, error } = useSWR(theGuardianAPiUrl, fetcher);

  return {
    allTheGuardianData: data?.response?.results || [],
    isLoadingTheGuardianData: !error && !data,
    isErrorTheGuardianData: error,
  };
}

export function useFetchSearchResultData(
  searchQuery: string,
  category: string
) {
  const constructUrl = (
    baseUrl: string,
    params: Record<string, string | undefined>
  ) => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.append(key, value);
    });
    return `${baseUrl}?${urlParams.toString()}`;
  };

  const urls = {
    newsApi: constructUrl(
      searchQuery && category
        ? "https://newsapi.org/v2/top-headlines"
        : searchQuery
        ? "https://newsapi.org/v2/everything"
        : "https://newsapi.org/v2/top-headlines",
      {
        q: searchQuery || undefined,
        category: category || undefined,
        country: searchQuery || category ? undefined : "us",
        apiKey: newsApiKey,
      }
    ),
    NYTimes: searchQuery
      ? constructUrl("https://api.nytimes.com/svc/search/v2/articlesearch.json", {
          q: searchQuery,
          "api-key": nYTimesKey,
        })
      : category
      ? constructUrl(
          `https://api.nytimes.com/svc/news/v3/content/all/${category}.json`,
          {
            "api-key": nYTimesKey,
          }
        )
      : undefined,
    theGuardian: constructUrl("https://content.guardianapis.com/search", {
      q: searchQuery || undefined,
      section: category || undefined,
      "page-size": "20",
      "show-fields": "thumbnail",
      "api-key": theGuardianAPiKey,
    }),
  };

  const { data: newsApiData, error: newsApiError } = useSWR(
    urls.newsApi,
    fetcher
  );
  const { data: NYTimesData, error: NYTimesError } = useSWR(
    urls.NYTimes,
    fetcher
  );
  const { data: theGuardianData, error: theGuardianError } = useSWR(
    urls.theGuardian,
    fetcher
  );

  const mergedArray = [
    ...(newsApiData?.articles || []),
    ...(NYTimesData?.response?.docs || NYTimesData?.articles || []),
    ...(theGuardianData?.response?.results || []),
  ];

  return {
    searchResultData: mergedArray,
    isSearchResultLoading:
      !newsApiData || !NYTimesData || !theGuardianData,
    isSearchResultError:
      newsApiError || NYTimesError || theGuardianError,
  };
}

export function useFetchNYTimesSectionListData() {
  const NYTimesSectionUrl =
    "https://api.nytimes.com/svc/news/v3/content/section-list.json?api-key=uvXeQ3yYDdhDsKcSfRWkUAtOHN6tIVYe";

  const { data, error } = useSWR(NYTimesSectionUrl, fetcher);

  return {
    NYTimesSectionListData: data?.results || [],
    isNYTimesSectionListDataLoading: !error && !data,
    isNYTimesSectionListDataError: error,
  };
}

export function useFetchTheGuardianSectionListData() {
  const NYTimesSectionUrl =
    "https://content.guardianapis.com/sections?api-key=50887b5b-52a9-435f-b5e2-fd0a17568d18";

  const { data, error } = useSWR(NYTimesSectionUrl, fetcher);

  return {
    TheGuardianSectionListData: data?.response?.results || [],
    isTheGuardianSectionListDataLoading: !error && !data,
    isTheGuardianSectionListDataError: error,
  };
}
