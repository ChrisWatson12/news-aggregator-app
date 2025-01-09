import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/solid";
import {
  useFetchNewsApiData,
  useFetchNewYorkTimesArticlesData,
  useFetchTheGuardianData,
  useFetchSearchResultData,
  useFetchNYTimesSectionListData,
  useFetchTheGuardianSectionListData,
} from "../../services/useApi";
import { NewsList } from "../../components/NewsList";
import { NewsSkeleton } from "../../components/NewsSkeleton";
import { ScrollButton } from "../../components/ScrollToTopButton";
import { filterNews, isValidDate } from "../../utils";
import { SelectOptions } from "../../types";
import {
  dayOptions,
  monthOptions,
  newsApiOrgCategoryList,
  sourceOptions,
  yearOptions,
} from "../../constants";

export const Home: React.FC = () => {
  const [localStorageData, setLocalStorageData] = useState<any[]>([]);
  const isEmptyLocalStorage = localStorageData.every(
    (element) =>
      (Array.isArray(element) && element?.length === 0) || element === null
  );
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<
    readonly SelectOptions[] | SelectOptions
  >([]);
  const [selectedCategory, setSelectedCategory] =
    useState<SelectOptions | null>(null);

  const [selectedFromDay, setSelectedFromDay] = useState<SelectOptions | null>(
    null
  );
  const [selectedFromMonth, setSelectedFromMonth] =
    useState<SelectOptions | null>(null);
  const [selectedFromYear, setSelectedFromYear] =
    useState<SelectOptions | null>(null);
  const [selectedToDay, setSelectedToDay] = useState<SelectOptions | null>(
    null
  );
  const [selectedToMonth, setSelectedToMonth] = useState<SelectOptions | null>(
    null
  );
  const [selectedToYear, setSelectedToYear] = useState<SelectOptions | null>(
    null
  );
  const [filteredNewsData, setFilteredNewsData] = useState([]);
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterDateError, setFilterDateError] = useState("");

  const [isShowSearchInput, setIsShowSearchInput] = useState(false);
  const [isShowSettings, setIsShowSettings] = useState(false);

  const { allNewsApiData, isLoadingNewsApiData, isErrorNewsApiData } =
    useFetchNewsApiData();

  const {
    allNewYorkTimesData,
    isLoadingNewYorkTimesData,
    isErrorNewYorkTimesData,
  } = useFetchNewYorkTimesArticlesData();

  const {
    allTheGuardianData,
    isLoadingTheGuardianData,
    isErrorTheGuardianData,
  } = useFetchTheGuardianData();

  const allBreakingNewsData = [
    ...allNewsApiData,
    ...allNewYorkTimesData,
    ...allTheGuardianData,
  ];

  const filteredNews = filterNews(
    selectedSource,
    allBreakingNewsData,
    allNewsApiData,
    allNewYorkTimesData,
    allTheGuardianData
  );

  const { searchResultData, isSearchResultLoading, isSearchResultError } =
    useFetchSearchResultData(
      searchQuery,
      selectedCategory?.label.toLowerCase() as string
    );

  const { NYTimesSectionListData } = useFetchNYTimesSectionListData();
  const { TheGuardianSectionListData } = useFetchTheGuardianSectionListData();

  const guardianSectionsList = TheGuardianSectionListData?.map(
    ({ id, webTitle }: { id: string; webTitle: string }) => ({ id, webTitle })
  );

  const renamedNYTimesSectionListDataKeys = NYTimesSectionListData?.map(
    ({ section, display_name }: { section: string; display_name: string }) => ({
      id: section,
      webTitle: display_name,
    })
  );

  const allCategories = [
    ...newsApiOrgCategoryList,
    ...guardianSectionsList,
    ...renamedNYTimesSectionListDataKeys,
  ];

  const uniqueCategoriesArray = Array.from(
    new Set(allCategories.map((obj) => obj.id))
  ).map((id) => {
    return allCategories.find((obj) => obj.id === id);
  });

  const newsData =
    filterToDate.length > 0 && filteredNewsData?.length >= 0
      ? filteredNewsData
      : (searchQuery.length > 0 ||
          (selectedCategory && selectedCategory.label?.length > 0)) &&
        searchResultData?.length >= 0
      ? searchResultData
      : filteredNews;

  function getDataFromStorage(): [] {
    return JSON.parse(localStorage.getItem("favNews") ?? "[]");
  }

  useEffect(() => {
    setLocalStorageData(getDataFromStorage());
  }, []);

  useEffect(() => {
    if (localStorageData.length > 0) {
      setSelectedSource(localStorageData[0]);
      setSelectedCategory(localStorageData[1]);
    }
  }, [localStorageData]);

  const categoryOptionsList = uniqueCategoriesArray.map((category) => ({
    value: category.id,
    label: category.webTitle,
  }));

  useEffect(() => {
    if (query === "") {
      setSearchQuery("");
    }
  }, [query]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const value = e.target.value;
    setQuery(value);
    if (value === "") {
      clearSearchQuery();
    }
  }

  const handleCategorySelection = (selectedOption: SelectOptions | null) => {
    setSelectedCategory(selectedOption);
  };

  const handleSourceSelection = (selectedOption: readonly SelectOptions[]) => {
    setSelectedSource(selectedOption);
    setSelectedCategory(null);
  };

  const handleFromDayChange = (selectedOption: SelectOptions | null) => {
    setSelectedFromDay(selectedOption);
  };

  const handleFromMonthChange = (selectedOption: SelectOptions | null) => {
    setSelectedFromMonth(selectedOption);
  };

  const handleFromYearChange = (selectedOption: SelectOptions | null) => {
    setSelectedFromYear(selectedOption);
  };

  const handleToDayChange = (selectedOption: SelectOptions | null) => {
    setSelectedToDay(selectedOption);
  };

  const handleToMonthChange = (selectedOption: SelectOptions | null) => {
    setSelectedToMonth(selectedOption);
  };

  const handleToYearChange = (selectedOption: SelectOptions | null) => {
    setSelectedToYear(selectedOption);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query !== "") {
      setSearchQuery(query);
    }
  };

  const clearSearchQuery = () => {
    setSearchQuery("");
  };

  useEffect(() => {
    const fetchFilteredNews = async () => {
      if (searchQuery.trim() === "") return;

      const fromDay = selectedFromDay?.value;
      const fromMonth = selectedFromMonth?.value;
      const fromYear = selectedFromYear?.value;

      const toDay = selectedToDay?.value;
      const toMonth = selectedToMonth?.value;
      const toYear = selectedToYear?.value;

      const fromDateString = `${fromYear}-${fromMonth
        ?.toString()
        .padStart(2, "0")}-${fromDay?.toString().padStart(2, "0")}`;

      const toDateString = `${toYear}-${toMonth
        ?.toString()
        .padStart(2, "0")}-${toDay?.toString().padStart(2, "0")}`;

      const beginDateString = `${fromYear}${fromMonth
        ?.toString()
        .padStart(2, "0")}${fromDay?.toString().padStart(2, "0")}`;

      const endDateString = `${fromYear}${fromMonth
        ?.toString()
        .padStart(2, "0")}${fromDay?.toString().padStart(2, "0")}`;

      if (
        (isValidDate(fromDateString) && fromDateString < toDateString) ||
        (isValidDate(beginDateString) && beginDateString < endDateString)
      )
        setFilterFromDate(fromDateString);
      if (
        (isValidDate(toDateString) && fromDateString < toDateString) ||
        (isValidDate(endDateString) && beginDateString < endDateString)
      ) {
        setFilterToDate(toDateString);
      }

      if (fromDateString > toDateString || beginDateString > endDateString) {
        setFilterDateError("From date cannot be greater than To date");
        return;
      } else {
        try {
          let newsApiSearchByQueryUrl = `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=a3906f4f790f4f2b8c917eb2f3a5621d`;
          let NYTimesSearchByQueryUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchQuery}&api-key=uvXeQ3yYDdhDsKcSfRWkUAtOHN6tIVYe`;
          let theGuardianSearchByQueryUrl = `https://content.guardianapis.com/search?q=${searchQuery}&page-size=20&show-fields=thumbnail&api-key=50887b5b-52a9-435f-b5e2-fd0a17568d18`;

          if (selectedToDay && selectedToMonth && selectedToYear) {
            newsApiSearchByQueryUrl += `&from=${fromDateString}&to=${toDateString}`;
            NYTimesSearchByQueryUrl += `&begin_date=${beginDateString}&end_date=${endDateString}`;
            theGuardianSearchByQueryUrl += `&from-date=${fromDateString}&to-date=${toDateString}`;
          }

          const newsApiResponse = await fetch(newsApiSearchByQueryUrl);
          const nYTimesApiResponse = await fetch(NYTimesSearchByQueryUrl);
          const theGuardianApiResponse = await fetch(
            theGuardianSearchByQueryUrl
          );

          const newsApiData = await newsApiResponse.json();
          const nYTimesApiData = await nYTimesApiResponse.json();
          const theGuardianApiData = await theGuardianApiResponse.json();

          const mergedArray: any = [
            ...(newsApiData?.articles ?? []),
            ...(nYTimesApiData?.response?.docs ??
              nYTimesApiData?.articles ??
              []),
            ...(theGuardianApiData?.response?.results ??
              theGuardianApiData?.response?.docs ??
              []),
          ];

          setFilteredNewsData(mergedArray);
        } catch (error) {
          console.error("Error fetching filtered news data:", error);
        }
      }
    };
    fetchFilteredNews();
  }, [
    searchQuery,
    selectedFromDay,
    selectedFromMonth,
    selectedFromYear,
    selectedToDay,
    selectedToMonth,
    selectedToYear,
  ]);

  const handleRemoveDateFilter = () => {
    setFilterFromDate("");
    setFilterToDate("");
    setSelectedFromDay(null);
    setSelectedFromMonth(null);
    setSelectedFromYear(null);
    setSelectedToDay(null);
    setSelectedToMonth(null);
    setSelectedToYear(null);
  };

  const handleRemoveDateFilterError = () => {
    setFilterDateError("");
  };

  const handleSaveFavorite = () => {
    localStorage.setItem(
      "favNews",
      JSON.stringify([selectedSource, selectedCategory])
    );
    setLocalStorageData([selectedSource, selectedCategory]);
    setIsShowSettings(false);
  };

  const handleSearchButtonClick = () => {
    setIsShowSearchInput(!isShowSearchInput);
    setIsShowSettings(false);
  };

  const handleSettingsButtonClick = () => {
    setIsShowSettings(!isShowSettings);
    setIsShowSearchInput(false);
  };

  return (
    <div className="py-7 space-y-7 w-full">
      <div className="flex items-center justify-between mt-16">
        <h1 className="text-xl font-bold px-4 py-2 rounded-lg">
          {!isEmptyLocalStorage ? "My Favorite Articles" : "Breaking News"}
        </h1>
        <div className="flex items-end justify-around py-2 rounded-lg bg-[#003366] text-white w-[25%] md:w-[15%] lg:w-[10%]">
          <button onClick={handleSearchButtonClick}>
            <MagnifyingGlassIcon className="h-8 w-8" aria-hidden="true" />
          </button>
          <button onClick={handleSettingsButtonClick}>
            <Cog8ToothIcon className="h-8 w-8" aria-hidden="true" />
          </button>
        </div>
      </div>
      {isShowSettings && (
        <div className="grid  gap-y-5 gap-x-5  bg-[#003366] py-6 px-4 rounded-lg ">
          <p className="text-base font-bold text-white">
            You can choose your favorite sources and categories
          </p>
          <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-4">
            <Select
              value={selectedSource}
              onChange={handleSourceSelection}
              options={sourceOptions}
              placeholder="Select a source"
              isClearable
              isMulti
              className="col-span-full md:col-span-2"
            />

            <Select
              value={selectedCategory}
              onChange={handleCategorySelection}
              options={categoryOptionsList}
              placeholder="Select a category"
              isClearable
              isDisabled={filterToDate.length > 0}
              className="col-span-full md:col-span-2"
            />
            <button
              onClick={handleSaveFavorite}
              className="text-xl p-2 md:p-1 font-bold bg-white  text-[#003366] rounded-md col-span-full md:col-span-1"
            >
              Save
            </button>
          </div>
        </div>
      )}
      <div className="grid items-center gap-y-5 gap-x-5 md:grid-cols-2 xl:grid-cols-3 mt-20">
        {isShowSearchInput && (
          <form
            onSubmit={(e) => handleSearch(e)}
            className="col-span-full w-full flex items-center"
          >
            <input
              required
              placeholder="Search innoscripta news"
              className="w-[80%] py-2 px-3 rounded rounded-l-md border border-[#ccc] box-border min-h-[38px] col-span-full xl:col-auto focus:border-2 outline-[#2684ff] focus:shadow-sm-[#2684ff] font-sans placeholder:text-[#808080] placeholder:text-lg font-normal"
              value={query}
              type="text"
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="w-[20%] text-xl font-bold bg-[#C20017] border border-[#C20017] min-h-[38px] p-1.5 text-white rounded-r-md"
            >
              Search
            </button>
          </form>
        )}

        {filterDateError.length === 0 && filterFromDate && filterToDate && (
          <div className="w-fit flex justify-between items-center p-2 rounded-sm text-lg font-semibold bg-[#C20017]">
            <h4 className="text-base text-white font-normal">
              From: {filterFromDate} to:{filterToDate}
            </h4>
            <button onClick={handleRemoveDateFilter}>
              <XMarkIcon
                className="h-5 w-5 ml-2 text-white"
                aria-hidden="true"
              />
            </button>
          </div>
        )}

        {filterDateError.length > 0 && (
          <div className="w-fit flex justify-between items-center p-2 rounded-sm text-lg font-semibold bg-[#C20017]">
            <h4 className="text-base text-white font-normal">
              {filterDateError}
            </h4>
            <button onClick={handleRemoveDateFilterError}>
              <XMarkIcon
                className="h-5 w-5 ml-2 text-white"
                aria-hidden="true"
              />
            </button>
          </div>
        )}

        {searchQuery.length > 0 && searchResultData?.length > 0 && (
          <div className="w-full flex col-span-full flex-col">
            <h2 className="text-lg font-bold">Date range:</h2>
            <div className="w-full grid sm:grid-cols-2 gap-4">
              <div className="col-span-full sm:col-span-1">
                <h2>From Date</h2>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={selectedFromMonth}
                    onChange={handleFromMonthChange}
                    options={monthOptions}
                    placeholder="MM"
                  />
                  <Select
                    value={selectedFromDay}
                    onChange={handleFromDayChange}
                    options={dayOptions}
                    placeholder="DD"
                  />
                  <Select
                    value={selectedFromYear}
                    onChange={handleFromYearChange}
                    options={yearOptions}
                    placeholder="YYYY"
                  />
                </div>
              </div>
              <div className="col-span-full sm:col-span-1">
                <h2>To date</h2>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={selectedToMonth}
                    onChange={handleToMonthChange}
                    options={monthOptions}
                    placeholder="MM"
                  />
                  <Select
                    value={selectedToDay}
                    onChange={handleToDayChange}
                    options={dayOptions}
                    placeholder="DD"
                  />
                  <Select
                    value={selectedToYear}
                    onChange={handleToYearChange}
                    options={yearOptions}
                    placeholder="YYYY"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isErrorNewsApiData &&
        isErrorNewYorkTimesData &&
        isErrorTheGuardianData && (
          <div className="flex flex-col items-center justify-between text-rose-600 text-lg mt-20">
            <pre>There was a problem.</pre>

            <pre>Please try again later.</pre>
          </div>
        )}

      {(searchQuery.length > 0 ||
        (selectedCategory && selectedCategory.label?.length > 0)) &&
        isSearchResultLoading && (
          <div className="mt-3">
            <NewsSkeleton />
          </div>
        )}

      {searchQuery.length > 0 && isSearchResultError && (
        <div className="flex flex-col items-center justify-between text-rose-600 text-lg mt-20">
          <pre>There was a problem.</pre>

          <pre>Please try again later.</pre>
        </div>
      )}

      {(isLoadingNewsApiData ||
        isLoadingNewYorkTimesData ||
        isLoadingTheGuardianData) && (
        <div className="mt-3">
          <NewsSkeleton />
        </div>
      )}

      {(searchQuery.length > 0 ||
        (selectedCategory && selectedCategory.label?.length > 0)) &&
        searchResultData?.length === 0 && (
          <p className="col-span-full text-lg font-bold text-center">
            Hmmm... There were no article found with this search.
            <br /> Please try another.
          </p>
        )}

      {newsData && <NewsList items={newsData} />}
      {newsData && <ScrollButton />}
    </div>
  );
};
