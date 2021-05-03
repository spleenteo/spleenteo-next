import PostPreview from 'components/post-preview'
import PostTitle from 'components/post-title'

export default function PostGrid({posts}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-16 gap-y-20 mb-32">
      {posts.map(post =>
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
            category={post.category}
            tags={post.tags}
          />      
        )}
    </div>
  )
}