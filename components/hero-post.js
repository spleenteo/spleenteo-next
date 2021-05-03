import CoverImage from 'components/cover-image'
import Link from 'next/link'
import PostMeta from 'components/post-meta'

export default function HeroPost({
  category,
  coverImage,
  date,
  excerpt,
  slug,
  title,
  tags
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
          <h3 className="mb-4 text-4xl lg:text-6xl font-bold leading-tight">
            <Link as={`/posts/${slug}`} href="/posts/[slug]">
              <a className="hover:underline">{title}</a>
            </Link>
          </h3>
          <p className="my-2">{excerpt}</p>
          <PostMeta
            category={category}
            date={date}
            tags={tags}
          />
        </div>
      </div>
    </section>
  )
}
