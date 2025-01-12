import { SelectOptions } from '../types'

export const SOURCE_NEWS_API = "newsAPI";
export const SOURCE_NY_TIME = "nyTimes";
export const SOURCE_THE_GUARDIAN = "theGuardian";

export const CATEGORY_OPTIONS_LIST: SelectOptions[] = [
  { value: 'general', label: 'General', type: SOURCE_NEWS_API },
  { value: 'sports', label: 'Sports', type: SOURCE_NEWS_API },
  { value: 'technology', label: 'Technology', type: SOURCE_NEWS_API },
  { value: 'entertainment', label: 'Entertainment', type: SOURCE_NEWS_API },
  { value: 'science', label: 'Science', type: SOURCE_NEWS_API },
  { value: 'health', label: 'Health', type: SOURCE_NEWS_API },
];

export const SOURCE_OPTIONS_LIST: SelectOptions[] = [
  { value: 0, label: 'NewsAPI.org' },
  { value: 1, label: 'New York Times' },
  { value: 2, label: 'The Guardian' },
];
