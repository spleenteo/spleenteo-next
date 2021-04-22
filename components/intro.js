export default function Intro({
  title,
  subtitle
 }) {

  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
        {title}
      </h1>
      <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        {subtitle}
      </h4>
    </section>
  )
}
