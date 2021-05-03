import Link from 'next/link'
import PostGrid from "components/post-grid"

export default function MoreStories({ posts, categories }) {
  return (
    <section>
      <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
        Altre amenità
      </h2>

      <ul className="flex flex-row flex-wrap my-8">
        {categories.map(cat =>
          <li className="mb-3 mr-3 rounded-md bg-green-500 text-white flex items-center justify-center md:text-lg lg:text-2xl font-bold rounded-t-xl p-2 px-4">
            <Link as={`/categories/${cat.slug}`} href="/categories/[slug]">
              <a className="hover:underline">{cat.name}</a>
            </Link>
          </li>
        )}
      </ul>

      <PostGrid posts={posts} />
    </section>
  )
}
