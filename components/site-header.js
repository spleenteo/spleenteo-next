import Link from 'next/link'

export default function Intro({
  title,
  subtitle
 }) {

  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <div className="text-1xl md:text-3xl font-bold tracking-tighter leading-tight md:pr-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
        <Link href="/">
          {title}
        </Link>.
      </div>
      <p className="text-center text-gray-500 md:text-left text-sm mt-5 md:pl-8">
        {subtitle}
      </p>
    </section>
  )
}
