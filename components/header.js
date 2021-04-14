import Link from 'next/link'

export default function Header() {
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
      <Link href="/">
        <a className="hover:underline">Spleenteo</a>
      </Link>
      .
    </h2>
  )
}
