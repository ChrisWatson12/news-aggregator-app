import { SelectOptions } from '../types'

export const newsApiOrgCategoryList = [
  { id: 'general', webTitle: 'General' },
  { id: 'sports', webTitle: 'Sports' },
  { id: 'technology', webTitle: 'Technology' },
  { id: 'entertainment', webTitle: 'Entertainment' },
  { id: 'science', webTitle: 'Science' },
  { id: 'health', webTitle: 'Health' },
  { id: 'business', webTitle: 'Business' },
]

export const sourceOptions: SelectOptions[] = [
  { value: 1, label: 'News.org' },
  { value: 2, label: 'New York Times' },
  { value: 3, label: 'The Guardian' },
]

export const dayOptions = Array.from({ length: 30 }, (_, i) => ({
  value: i + 1,
  label: (i + 1).toString(),
}))

export const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: (i + 1).toString(),
}))

export const currentYear = new Date().getFullYear()
export const yearOptions = Array.from({ length: 10 }, (_, i) => ({
  value: currentYear - i,
  label: (currentYear - i).toString(),
}))
