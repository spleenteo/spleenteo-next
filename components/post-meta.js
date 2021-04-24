import Date from '../components/date'
import Link from 'next/link'

export default function PostMeta({ category, date }) {
  return (
    <div>      
      <span className="mb-4 md:mb-0 text-lg">
        <Date dateString={date} />
      </span>
      <span> / </span>
      <Link as={`/categories/${category.slug}`} href="/categories/[slug]">
        <a className="hover:underline text-green-600">{category.name}</a>
      </Link>
    </div>
  )
}
