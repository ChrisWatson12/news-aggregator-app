import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  useFetchNewsApiData,
  useFetchNewYorkTimesArticlesData,
  useFetchTheGuardianData,
  useFetchSearchResultData,
} from "../../services/useApi";
import { NewsList } from "../../components/NewsList";
import { NewsSkeleton } from "../../components/NewsSkeleton";
import { ScrollButton } from "../../components/ScrollToTopButton";
import { FilterData, SelectOptions } from "../../types";
import {
  AUTHOR_OPTIONS_LIST,
  CATEGORY_OPTIONS_LIST,
  SOURCE_OPTIONS_LIST,
} from "../../constants";

export const Home: React.FC = () => {
  const [localStorageData, setLocalStorageData] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<readonly SelectOptions[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<readonly SelectOptions[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<readonly SelectOptions[]>([]);
  const [selectedFromDate, setSelectedFromDate] = useState<string>("");
  const [selectedToDate, setSelectedToDate] = useState<string>("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterDateError, setFilterDateError] = useState("");
  const [isShowSearchInput, setIsShowSearchInput] = useState(false);
  const isEmptyLocalStorage = localStorageData.every((element) => (Array.isArray(element) && element?.length === 0) || element === null);
  const filterSelectionData: FilterData = {
    searchQuery,
    categories: selectedCategory,
    authors: selectedAuthor,
    sources: selectedSource,
    fromDate: selectedFromDate,
    toDate: selectedToDate,
  };
  const { searchResultData, isSearchResultLoading } = useFetchSearchResultData(filterSelectionData);
  const { allNewsApiData, isLoadingNewsApiData } = useFetchNewsApiData();
  const { allNewYorkTimesData, isLoadingNewYorkTimesData } = useFetchNewYorkTimesArticlesData();
  const { allTheGuardianData, isLoadingTheGuardianData } = useFetchTheGuardianData();
  const getDataFromStorage = (): [] => JSON.parse(localStorage.getItem("personalizedNewsFeed") ?? "[]");
  const animatedComponents = makeAnimated();
  const isLaodingBreakingNews = isLoadingNewsApiData || isLoadingNewYorkTimesData || isLoadingTheGuardianData;
  const allBreakingNewsData = [ ...allNewsApiData, ...allNewYorkTimesData, ...allTheGuardianData ];

  const newsArticleData = (searchQuery || selectedCategory.length || selectedAuthor.length || selectedSource.length || selectedFromDate || selectedToDate) ? searchResultData : allBreakingNewsData;

  useEffect(() => {
    setLocalStorageData(getDataFromStorage());
  }, []);

  useEffect(() => {
    if (localStorageData.length) {
      setSelectedSource(localStorageData[0] ?? []);
      setSelectedCategory(localStorageData[1] ?? []);
      setSelectedAuthor(localStorageData[2] ?? []);
    }
  }, [localStorageData]);

  useEffect(() => {
    if (!query) {
      clearSearchQuery();
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    setQuery(value);

    if (!value) {
      clearSearchQuery();
    }
  }

  const handleCategorySelection = (selectedCatOption: readonly SelectOptions[]) => {
    setSelectedCategory(selectedCatOption);
  };

  const handleSourceSelection = (selectedSrcOption: readonly SelectOptions[]) => {
    setSelectedSource(selectedSrcOption);
  };

  const handleAuthorSelection = (selectedAuthOption: readonly SelectOptions[]) => {
    setSelectedAuthor(selectedAuthOption);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query) {
      setSearchQuery(query);
    }
  };

  const clearSearchQuery = () => {
    setSearchQuery("");
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setSelectedFromDate(selectedDate);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setSelectedToDate(selectedDate);
  };

  const handleRemoveDateFilter = () => {
    setFilterFromDate("");
    setFilterToDate("");
    setSelectedFromDate("");
    setSelectedToDate("");
  };

  const handleRemoveDateFilterError = () => {
    setFilterDateError("");
  };

  const handleSaveFavorite = () => {
    localStorage.setItem(
      "personalizedNewsFeed",
      JSON.stringify([selectedSource, selectedCategory, selectedAuthor])
    );
    setLocalStorageData([selectedSource, selectedCategory, selectedAuthor]);
  };

  const handleSearchButtonClick = () => {
    setIsShowSearchInput(!isShowSearchInput);
  };

  useEffect(() => {
    if(!selectedFromDate || !selectedToDate) {
      return;
    }

    if (selectedFromDate < selectedToDate) {
      setFilterFromDate(selectedFromDate);
      setFilterToDate(selectedToDate);
      setFilterDateError("");
    } else {
      setFilterFromDate("");
      setFilterToDate("");
      setFilterDateError("From date cannot be greater than To date");
    }
  }, [ selectedFromDate, selectedToDate ]);

  const renderFilterMessage = () => {
    if (filterFromDate && filterToDate && !filterDateError) {
      return {
        message: `From: ${filterFromDate} to: ${filterToDate}`,
        onClickHandler: handleRemoveDateFilter,
      };
    }
    if (filterDateError.length) {
      return {
        message: filterDateError,
        onClickHandler: handleRemoveDateFilterError,
      };
    }
    return null;
  };
  
  const filterData = renderFilterMessage();

  return (
    <div className="py-7 space-y-7 w-full">
      <div className="flex items-center justify-between mt-16">
        <h1 className="text-xl font-bold py-2 rounded-lg">
          {!isEmptyLocalStorage ? "My Favorite Articles" : "Breaking News"}
        </h1>
        <div className="flex items-end justify-around p-2 rounded-lg bg-appBgColor text-white">
          <button onClick={handleSearchButtonClick}>
            <MagnifyingGlassIcon className="h-8 w-8" aria-hidden="true" />
          </button>
        </div>
      </div>

      {isShowSearchInput && (
          <form
            onSubmit={(e) => handleSearch(e)}
            className="col-span-full w-full flex items-center"
          >
            <input
              required
              placeholder="Search..."
              className="w-[90%] py-2 px-3 rounded-l-md border border-[#ccc] box-border min-h-[38px] col-span-full xl:col-auto focus:border-2 outline-[#2684ff] focus:shadow-sm-[#2684ff] font-sans placeholder:text-[#808080] placeholder:text-lg font-normal"
              value={query}
              type="text"
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="flex-grow text-xl font-bold bg-[#C20017] border border-[#C20017] min-h-[38px] p-1.5 text-white rounded-r-md"
            >
              Search
            </button>
          </form>
        )}

      <div className="grid  gap-y-5 gap-x-5  bg-appBgColor py-6 px-4 rounded-lg ">
        <p className="text-base font-bold text-white">
          You can choose your favorite sources, categories and authors
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Select
            value={selectedSource}
            components={animatedComponents}
            onChange={handleSourceSelection}
            options={SOURCE_OPTIONS_LIST}
            placeholder="Select a source"
            isClearable
            isMulti
            className="col-span-full md:col-span-1"
          />

          <Select
            value={selectedCategory}
            components={animatedComponents}
            onChange={handleCategorySelection}
            options={CATEGORY_OPTIONS_LIST}
            placeholder="Select a category"
            isClearable
            isMulti
            className="col-span-full md:col-span-1"
          />

          <Select
            value={selectedAuthor}
            components={animatedComponents}
            onChange={handleAuthorSelection}
            options={AUTHOR_OPTIONS_LIST}
            placeholder="Select a author"
            isClearable
            isMulti
            className="col-span-full md:col-span-1"
          />

          <button
            onClick={handleSaveFavorite}
            className="p-2 md:p-1 font-bold bg-white text-appBgColor rounded-md col-span-full md:col-span-1"
          >
            Save Filter Options
          </button>
        </div>
      </div>

      <div className="grid items-center gap-y-5 gap-x-5 md:grid-cols-2 xl:grid-cols-3 mt-20">
        {filterData && (
          <div className="w-fit flex justify-between items-center p-2 rounded-sm text-lg font-semibold bg-[#C20017]">
            <h4 className="text-base text-white font-normal">
              {filterData.message}
            </h4>
            <button onClick={filterData.onClickHandler}>
              <XMarkIcon
                className="h-5 w-5 ml-2 text-white"
                aria-hidden="true"
              />
            </button>
          </div>
        )}

        <div className="col-span-full flex flex-wrap items-end w-full gap-4">
          <div className="w-64">
            <h2>From Date</h2>
            <input
              id="from-date-picker"
              type="date"
              name="date"
              value={selectedFromDate}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleFromDateChange}
            />
          </div>
          <div className="w-64">
            <h2>To Date</h2>
            <input
              id="from-date-picker"
              type="date"
              name="date"
              disabled={!selectedFromDate}
              value={selectedToDate}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleToDateChange}
            />
          </div>
        </div>
      </div>

      {(isSearchResultLoading || isLaodingBreakingNews) ? (
        <div className="mt-3">
          <NewsSkeleton />
        </div>
      ) : !newsArticleData?.length && (
        <p className="col-span-full text-lg font-bold text-center">
          Hmmm... There were no article found with this search.
          <br /> Please try another.
        </p>
      )}

      {newsArticleData.length > 0 && (
        <>
          <NewsList items={newsArticleData} />
          <ScrollButton />
        </>
      )}
    </div>
  );
};
