import { INewsItem } from '../types'

export const isValidDate = (dateString: string) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/

  if (!regex.test(dateString)) {
    return false
  }

  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return false
  }

  return true
}

export const filterNews = (
  selectedSources: any,
  allBreakingNewsData: INewsItem[],
  allNewsApiData: INewsItem[],
  allNewYorkTimesData: INewsItem[],
  allTheGuardianData: INewsItem[],
) => {
  if (
    !selectedSources ||
    selectedSources.length === 0 ||
    selectedSources.length === 3
  ) {
    return allBreakingNewsData
  }

  let filteredNews: INewsItem[] = []
  selectedSources.forEach((source: any) => {
    if (source.value === 1) {
      filteredNews = [...filteredNews, ...allNewsApiData]
    } else if (source.value === 2) {
      filteredNews = [...filteredNews, ...allNewYorkTimesData]
    } else if (source.value === 3) {
      filteredNews = [...filteredNews, ...allTheGuardianData]
    }
  })

  return filteredNews
}
