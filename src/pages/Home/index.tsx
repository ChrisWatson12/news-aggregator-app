import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import { Tooltip } from 'react-tooltip';
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  useFetchNewsApiData,
  useFetchNewYorkTimesArticlesData,
  useFetchTheGuardianData,
  useFetchSearchResultData,
  useFetchNYTimesSectionListData,
  useFetchTheGuardianSectionListData,
  useFetchAuthorListData
} from "../../hooks/services/useApi";
import { NewsList } from "../../components/NewsList";
import { NewsSkeleton } from "../../components/NewsSkeleton";
import { ScrollButton } from "../../components/ScrollToTopButton";
import { FilterData, SelectOptions } from "../../types";
import { CATEGORY_OPTIONS_LIST, SOURCE_NY_TIME, SOURCE_OPTIONS_LIST, SOURCE_THE_GUARDIAN } from "../../constants";
import { getArrayOrNull } from "../../utils";
import { Snackbar } from "../../components/Snackbar";

export const Home: React.FC = () => {
  const [localStorageData, setLocalStorageData] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [filterSelection, setFilterSelection] = useState<FilterData>({
    searchQuery: "",
    category: null,
    author: null,
    sources: [],
    fromDate: "",
    toDate: "",
  });
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterDateError, setFilterDateError] = useState("");
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [isShowSearchInput, setIsShowSearchInput] = useState(false);
  const { allNewsApiData, isLoadingNewsApiData } = useFetchNewsApiData();
  const { allNewYorkTimesData, isLoadingNewYorkTimesData } = useFetchNewYorkTimesArticlesData();
  const { allTheGuardianData, isLoadingTheGuardianData } = useFetchTheGuardianData();
  const isEmptyLocalStorage = localStorageData.every((element) => (Array.isArray(element) && element?.length === 0) || element === null);
  const { category, author, sources, fromDate, toDate } = filterSelection;
  // Check selected sources
  const selectedSources = useMemo(() => ({
    isNewsAPI: sources.some((source) => source.value === 0),
    isNYTimes: sources.some((source) => source.value === 1),
    isTheGuardian: sources.some((source) => source.value === 2),
  }), [sources]);
  const { searchResultData, isSearchResultLoading } = useFetchSearchResultData(filterSelection, selectedSources);
  const { nyTimesSectionListData = [], isNYTimesSectionListLoading } = useFetchNYTimesSectionListData(selectedSources.isNYTimes);
  const { guadianSectionListData = [], isGuardianSectionListLoading } = useFetchTheGuardianSectionListData(selectedSources.isTheGuardian);
  const { authorOptionsListData, isAuthorOptionsLoading } = useFetchAuthorListData(category, Boolean(category));
  const guardianSectionsList = guadianSectionListData?.map(
    ({ id, webTitle }: { id: string; webTitle: string }) => ({ value: id, label: webTitle, type: SOURCE_THE_GUARDIAN })
  );
  const nyTimeSectionList = nyTimesSectionListData?.map(
    ({ section, display_name }: { section: string; display_name: string }) => ({
      value: section,
      label: display_name,
      type: SOURCE_NY_TIME,
    })
  );
  const categoriesOptions = [
    ...(selectedSources.isNewsAPI ? CATEGORY_OPTIONS_LIST : []),
    ...(selectedSources.isTheGuardian ? guardianSectionsList : []),
    ...(selectedSources.isNYTimes ? nyTimeSectionList : []),
  ]
  const getDataFromStorage = (): [] => JSON.parse(localStorage.getItem("personalizedNewsFeed") ?? "[]");
  const animatedComponents = makeAnimated();
  const isLaodingBreakingNews = isLoadingNewsApiData || isLoadingNewYorkTimesData || isLoadingTheGuardianData;
  const newsArticles = (sources.length || category || author || fromDate || toDate) ? searchResultData : [...allNewsApiData, ...allNewYorkTimesData, ...allTheGuardianData];
  
  useEffect(() => {
    setLocalStorageData(getDataFromStorage());
  }, []);

  useEffect(() => {
    if (localStorageData.length) {
      
      setFilterSelection((prevState) => ({
        ...prevState,
        sources: getArrayOrNull(localStorageData[0]) ?? [],
        category: localStorageData[1] ? localStorageData[1] : null,
        author: localStorageData[2] ? localStorageData[2] : null,
      }));
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

  const handleCategorySelection = (selectedCatOption: SelectOptions | null) => {
    setFilterSelection((prevState) => ({
      ...prevState,
      category: selectedCatOption,
    }));
  };

  const handleSourceSelection = (selectedOptions: readonly SelectOptions[]) => {
    setFilterSelection((prevState) => ({
      ...prevState,
      sources: selectedOptions,
      category: null,
      author: null,
    }));
  };

  const handleAuthorSelection = (selectedOption: SelectOptions | null) => {
    setFilterSelection((prevState) => ({
      ...prevState,
      author: selectedOption,
    }));
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query) {
      setFilterSelection((prevState) => ({
        ...prevState,
        searchQuery: query,
      }));
    }
  };

  const clearSearchQuery = () => {
    setFilterSelection((prevState) => ({
      ...prevState,
      searchQuery: '',
    }));
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterSelection((prevState) => ({
      ...prevState,
      category: null,
      author: null,
      fromDate: e.target.value,
    }));
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterSelection((prevState) => ({
      ...prevState,
      toDate: e.target.value,
    }));
  };

  const handleRemoveDateFilter = () => {
    setFilterFromDate("");
    setFilterToDate("");
    setFilterSelection((prevState) => ({
      ...prevState,
      fromDate: '',
      toDate: '',
    }));
  };

  const handleRemoveDateFilterError = () => {
    setFilterDateError("");
  };

  const handleSaveFavorite = () => {
    localStorage.setItem(
      "personalizedNewsFeed",
      JSON.stringify([sources, category, author])
    );
    setLocalStorageData([sources, category, author]);
    showSnackbar();
  };

  const handleSearchButtonClick = () => {
    setIsShowSearchInput(!isShowSearchInput);
  };

  useEffect(() => {
    if(!fromDate || !toDate) {
      return;
    }

    if (fromDate < toDate) {
      setFilterFromDate(fromDate);
      setFilterToDate(toDate);
      setFilterDateError("");
    } else {
      setFilterFromDate("");
      setFilterToDate("");
      setFilterDateError("From date cannot be greater than To date");
    }
  }, [ fromDate, toDate ]);

  const showSnackbar = () => {
    setIsSnackbarVisible(true);
    
    setTimeout(() => {
      setIsSnackbarVisible(false);
    }, 3000);
  }

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
            className="col-span-full md:col-span-1"
            value={sources}
            components={animatedComponents}
            onChange={handleSourceSelection}
            options={SOURCE_OPTIONS_LIST}
            placeholder="Select a source"
            isClearable
            isMulti
          />
          <div data-tooltip-id="categoryTooltip" className="col-span-full md:col-span-1">
            <Select
              value={category}
              components={animatedComponents}
              onChange={handleCategorySelection}
              options={categoriesOptions}
              placeholder="Select a category"
              isLoading={isGuardianSectionListLoading || isNYTimesSectionListLoading}
              isClearable
              isMulti={false}
              isDisabled={Boolean(fromDate) || Boolean(!sources.length)}
            />
            <Tooltip id="categoryTooltip" place="bottom">{(fromDate || sources.length > 0) ? "" : "Please select at least one source first."}</Tooltip>
          </div>
          <div data-tooltip-id="authorTooltip" className="col-span-full md:col-span-1">
            <Select
              value={author}
              components={animatedComponents}
              onChange={handleAuthorSelection}
              options={authorOptionsListData}
              placeholder="Select a author"
              isLoading={isAuthorOptionsLoading}
              isClearable
              isMulti={false}
              isDisabled={Boolean(fromDate) || Boolean(!category)}
            />
            <Tooltip id="authorTooltip" place="bottom">{(fromDate || category) ? "" : "Please select a category first."}</Tooltip>
          </div>
          <div
            className="col-span-full md:col-span-1"
            style={{ height: "36px" }}
          >
            <button
              onClick={handleSaveFavorite}
              className="w-full h-full font-bold bg-white text-appBgColor rounded-md"
            >
              Save Filter Options
            </button>
          </div>
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
              value={fromDate}
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
              disabled={!fromDate}
              value={toDate}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleToDateChange}
            />
          </div>
        </div>
      </div>
      {isSearchResultLoading || isLaodingBreakingNews ? (
        <div className="mt-3">
          <NewsSkeleton />
        </div>
      ) : (
        !newsArticles?.length && (
          <p className="col-span-full text-lg font-bold text-center">
            Hmmm... There were no article found with this search.
            <br /> Please try another.
          </p>
        )
      )}
      {newsArticles.length > 0 && (
        <>
          <NewsList items={newsArticles} />
          <ScrollButton />
        </>
      )}
      <Snackbar
        visible={isSnackbarVisible}
        message="Personalized news feed saved successfully."
      />
    </div>
  );
};
