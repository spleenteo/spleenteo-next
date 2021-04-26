import PostPreview from '../components/post-preview'
import Link from 'next/link'

export default function MoreStories({ posts, categories }) {
  return (
    <section>
      <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
        Altre amenità
      </h2>

      <ul className="flex flex-row space-x-4 my-8">
            {categories.map(cat =>
              <li className="rounded-md bg-green-500 text-white flex items-center justify-center text-2xl font-bold rounded-t-xl p-2 px-4">
                <Link as={`/categories/${cat.slug}`} href="/categories/[slug]">
                  <a className="hover:underline">{cat.name}</a>
                </Link>
              </li>
            )}
          </ul>


      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
        {posts.map(post => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
            category={post.category}
          />
        ))}
      </div>
    </section>
  )
}
