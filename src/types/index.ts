export interface SelectOptions {
  value: number | string
  label: string
}

interface sourceType {
  name: string
  id: string
}

interface fieldsType {
  thumbnail?: string
}

type TSourceType = sourceType | string

interface IMultiMedia {
  url?: string
  format: string
  height?: number
  width?: number
  type: string
  subtype: string
  caption: string
  copyright: string
}

interface IByline {
  original?: string
}
export interface INewsItem {
  author?: string
  title?: string
  source?: TSourceType
  description?: string
  url?: string
  urlToImage?: string
  publishedAt?: string
  content?: string
  slug_name?: string
  section?: string
  subsection?: string
  abstract?: string
  uri?: string
  byline?: string | IByline
  item_type?: string
  updated_date?: string
  created_date?: string
  published_date?: string
  first_published_date?: string
  material_type_facet?: string
  kicker?: string
  subheadline?: string
  des_facet?: string[]
  org_facet?: []
  per_facet?: string[]
  geo_facet?: string[]
  related_urls?: []
  multimedia?: IMultiMedia[]
  id?: string
  type?: string
  sectionId?: string
  sectionName?: string
  webPublicationDate?: string
  webTitle?: string
  webUrl?: string
  apiUrl?: string
  fields?: fieldsType
  isHosted?: boolean
  pillarId?: string
  pillarName?: string
}

export type TNewsItem = {
  item: INewsItem
}

export type TNewsItems = {
  items: INewsItem[]
}
