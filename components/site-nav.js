/* This example requires Tailwind CSS v2.0+ */
import Link from 'next/link'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon,XMarkIcon } from '@heroicons/react/24/outline';


const navigation = [
  ['Home', '/'],
  ['Argomenti', '/categories'],
  ['Perché questo sito', '/about']
]
const deskClass = "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
const mobClass = "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"


export default function Example() {
  return (
    <div>
      <Disclosure as="nav" className="bg-gray-800 mb-12">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-1xl md:text-3xl font-bold tracking-tighter leading-tight md:pr-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                      <Link href="/">Spleenteo</Link>.    
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item, itemIdx) =>
                        <Link key={item[1]} href={item[1]} className={deskClass} >
                          {item[0]}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigation.map((item, itemIdx) =>
                  <Link key={item[1]+itemIdx} href={item[1]} className={mobClass}>
                    {item[0]}
                  </Link>
                )}              </div>              
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}