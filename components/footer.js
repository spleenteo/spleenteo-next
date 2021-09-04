import Container from './container'

export default function Footer() {
  return (
    <footer className="bg-accent-1 border-t border-accent-2">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row items-center">
          <div className="lg:text-left lg:mb-0 lg:pr-4 lg:w-1/2">
            <h3 className="text-4xl lg:text-5xl font-bold tracking-tighter leading-tight mb-1">
              Appunti sparsi di una vita.
            </h3>
            <p className="text-1xl">Il contenuto di questo sito è <a className="text-green-600" href="https://creativecommons.org/licenses/by-nc/3.0/deed.it" target="_blank">Creative Commons BY-NC 3.0</a></p>
          </div>
          <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
            <a
              href="https://www.cantierecreativo.net"
              className="mx-3 bg-3 hover:bg-white hover:text-black border border-black font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0"
            >
              Cantiere Creativo
            </a>
            <a
              href="https://www.datocms.com/"
              className="mx-3 bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0"
            >
              DatoCMS
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
