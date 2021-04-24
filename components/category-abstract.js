import Link from 'next/link'

export default function PostPreview({
  name,
  description,
  slug
}) {
  return (
    <div className="mb-10">
      <h2 className="mb-4 text-3xl md:text-3xl font-bold tracking-tighter leading-tight">
        <Link as={`/categories/${slug}`} href="/categories/[slug]">
          <a className="hover:underline">{name}</a>
        </Link>
      </h2>
      <div dangerouslySetInnerHTML={{__html: description}} />
      <Link as={`/categories/${slug}`} href="/categories/[slug]">
          <a className="hover:underline text-green-600 mt-6 block">Tutti gli articoli</a>
      </Link>
    </div>
  )
}
