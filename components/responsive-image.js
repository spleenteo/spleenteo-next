import { Image } from 'react-datocms'
import cn from 'classnames'
import Link from 'next/link'

export default function ResponsiveImage({ img }) {
  const image = (
    <Image
      data={{
        ...img,
        alt: `${img.title}`,
      }}
      className='shadow-small max-w-max mx-auto'
    />
  )
  return (
    <figure className="text-center -mx-5 sm:mx-0">
      {image}
      <figcaption className="text-center">{img.title}</figcaption>
    </figure>
  )
}
