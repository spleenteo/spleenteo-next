import Avatar from '../components/avatar'
import CoverImage from '../components/cover-image'
import PostMeta from '../components/post-meta'
import Link from 'next/link'

export default function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
  category,
}) {
  return (
    <section>
      <div className="mb-8 md:mb-16">
        <CoverImage
          title={title}
          responsiveImage={coverImage.responsiveImage}
          slug={slug}
        />
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
        <div>
          <h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
            <Link as={`/posts/${slug}`} href="/posts/[slug]">
              <a className="hover:underline">{title}</a>
            </Link>
          </h3>
          <PostMeta
            category={category}
            date={date}
          />
        </div>
      </div>
    </section>
  )
}
