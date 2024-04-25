import Date from '../components/date'
import Link from 'next/link'

export default function PostMeta({ category, date, tags }) {
  return (
    <div>      
      <span className="mb-4 md:mb-0 text-lg">
        <Date dateString={date} />
      </span>
      <span> / </span>
      <Link as={`/categories/${category.slug}`} href="/categories/[slug]" className="hover:underline text-green-600">
        {category.name}
      </Link>
      {tags.map(tag => (
        <Link key={tag.name} as={`/tags/${tag.slug}`} href={`/tags/${tag.slug}`} className="hover:underline text-green-600">
          / {tag.name}
        </Link>
        )
      )}
    </div>
  )
}
