import Link from 'next/link'

export default function PostPreview({
  name,
  description,
  slug
}) {
  return (
    <div className="mb-10">
      <h2 className="text-3xl mb-3 leading-snug mb-2">
        <Link as={`/cayegories/${slug}`} href="/cattegories/[slug]">
          <a className="hover:underline">{name}</a>
        </Link>
      </h2>
      <div dangerouslySetInnerHTML={{__html: description}} />
      <Link as={`/cayegories/${slug}`} href="/cattegories/[slug]">
          <a className="hover:underline text-green-600 mt-6 block">Tutti gli articoli</a>
        </Link>

    </div>
  )
}
