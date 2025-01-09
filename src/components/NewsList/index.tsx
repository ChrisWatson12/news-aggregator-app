import { useRef } from 'react'
import { Card } from '../Card'
import { useLazyLoad } from '../../hooks/useLazyLoad'
import { INewsItem } from '../../types'

export const NewsList = ({ items }: { items: INewsItem[] }) => {
  const loaderTriggerRef = useRef(null)
  const { visibleItems, isLastPage } = useLazyLoad(
    items,
    loaderTriggerRef.current,
  )

  const filteredItems = visibleItems.filter(
    (article: any) =>
      article?.title !== '[Removed]' && article?.source?.name !== '[Removed]',
  )

  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-20'>
      {filteredItems &&
        filteredItems?.map((article: any) => (
          <Card key={article.title} item={article} />
        ))}
      <div
        ref={loaderTriggerRef}
        style={{ height: '100px' }}
        hidden={isLastPage}
      ></div>
    </div>
  )
}
