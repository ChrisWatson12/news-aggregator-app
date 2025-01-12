import { SelectOptions } from '../types'

export const CATEGORY_OPTIONS_LIST: SelectOptions[] = [
  { value: 'general', label: 'General', type: 'newsAPI' },
  { value: 'sports', label: 'Sports', type: 'newsAPI' },
  { value: 'technology', label: 'Technology', type: 'newsAPI' },
  { value: 'entertainment', label: 'Entertainment', type: 'newsAPI' },
  { value: 'science', label: 'Science', type: 'newsAPI' },
  { value: 'health', label: 'Health', type: 'newsAPI' },
];

export const SOURCE_OPTIONS_LIST: SelectOptions[] = [
  { value: 0, label: 'NewsAPI.org' },
  { value: 1, label: 'New York Times' },
  { value: 2, label: 'The Guardian' },
];

export const AUTHOR_OPTIONS_LIST: SelectOptions[] = [
  { value: 0, label: 'Ben Protess' },
  { value: 1, label: 'Ivan Mehta' },
  { value: 2, label: 'Christy Cooney' },
  { value: 3, label: 'Maxwell Zeff' },
  { value: 4, label: 'BBC World Service' },
  { value: 5, label: 'Kayla Epstein' },
  { value: 6, label: 'Phil Harrison' },
  { value: 7, label: 'Matthew Gault' },
  { value: 8, label: 'Brittney Melton' },
  { value: 9, label: 'James Surowiecki' },
];
