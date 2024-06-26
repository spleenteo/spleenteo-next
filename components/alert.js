import Container from './container'
import cn from 'classnames'
import Link from 'next/link'


export default function Alert({ preview }) {
  return (
    <div
      className={cn('border-b', {
        'bg-accent-7 border-accent-7 text-white': preview,
        'bg-accent-1 border-accent-2': !preview,
      })}
    >
      <Container>
          {preview ? (
            <>
              <div className="fixed bottom-0 left-0 py-2 text-center text-sm">
                <div className="p-2">
                  <div className="inline-flex items-center bg-white leading-none text-pink-600 rounded-full p-2 shadow text-teal text-sm">
                    <span className="inline-flex bg-pink-600 text-white rounded-full h-6 px-3 justify-center items-center">
                      <Link href="/api/exit-preview" className="underline hover:text-cyan duration-200 transition-colors" >
                        exit preview.
                      </Link>
                    </span>
                    <span className="inline-flex px-2">This page is showing draft content.{' '}</span>
                  </div>
                </div>
              </div>
            </>
          ) : ("")}
      </Container>
    </div>
  )
}
