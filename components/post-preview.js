import Date from '../components/date'
import CoverImage from './cover-image'
import PostMeta from '../components/post-meta'
import Link from 'next/link'

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  slug,
  category,
}) {
  return (
    <div>
      <div className="mb-5">
        <CoverImage
          slug={slug}
          title={title}
          responsiveImage={coverImage.responsiveImage}
        />
      </div>
      <h3 className="text-3xl mb-3 leading-snug">
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <a className="hover:underline">{title}</a>
        </Link>
      </h3>
      <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
      <PostMeta
        category={category}
        date={date}
      />
    </div>
  )
}
