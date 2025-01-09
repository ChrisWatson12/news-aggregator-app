import { Popover, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { Fragment } from 'react'

const categories = [
  { id: 1, title: 'General' },
  { id: 2, title: 'Sports' },
  { id: 3, title: 'Technology' },
  { id: 4, title: 'Entertainment' },
  { id: 5, title: 'Science' },
  { id: 6, title: 'Health' },
]

export const Navbar = () => {
  return (
    <Popover>
      <div className='fixed backdrop-blur py-4 top-0 z-40 w-full bg-[#003366] p-4'>
        <nav
          className='w-[90%] my-0 mx-auto  text-lg font-medium flex flex-row items-center justify-between sm:h-10'
          aria-label='Global'
        >
          <div className='flex flex-shrink-0 flex-grow items-center lg:flex-grow-0'>
            <div className='flex w-full items-center justify-between md:w-auto '>
              <a
                href='/'
                className='uppercase text-xl font-extrabold text-white hover:text-white'
              >
                innoscripta news
              </a>
              <div className='-mr-2 flex items-center md:hidden'>
                <Popover.Button className='inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-hoverColor'>
                  <span className='sr-only'>Open main menu</span>
                  <Bars3Icon className='h-6 w-6' aria-hidden='true' />
                </Popover.Button>
              </div>
            </div>
          </div>
          <div className='hidden md:ml-5 md:block '>
            {categories.map((item) => (
              <a
                key={item.title}
                // href={item.href}
                className='font-semibold text-white hover:bg-hoverColor rounded p-2 cursor-pointer'
              >
                {item.title}
              </a>
            ))}
          </div>
        </nav>
      </div>

      <Transition
        as={Fragment}
        enter='duration-150 ease-out'
        enterFrom='opacity-0 scale-95'
        enterTo='opacity-100 scale-100'
        leave='duration-100 ease-in'
        leaveFrom='opacity-100 scale-100'
        leaveTo='opacity-0 scale-95'
      >
        <Popover.Panel
          focus
          className='container px-5 sm:px-8 xl:px-0 max-w-5xl absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition md:hidden bg-[#003366] text-white'
        >
          <div className='overflow-hidden rounded-lg bg-darkTheme shadow-md ring-1 ring-black ring-opacity-5'>
            <div className='flex items-center justify-between px-5 pt-4'>
              <div>
                <a
                  href='/'
                  className='uppercase text-xl font-extrabold text-white hover:text-white'
                >
                  innoscripta news
                </a>
              </div>
              <div className='-mr-2'>
                <Popover.Button className='inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-hoverColor'>
                  <span className='sr-only'>Close main menu</span>
                  <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                </Popover.Button>
              </div>
            </div>
            <div className='space-y-1 px-2 pt-2 pb-3'>
              {categories.map((item) => (
                <a
                  key={item.title}
                  // href={item.href}
                  className='block rounded-md px-3 py-2 text-base font-semibold text-white  hover:bg-white cursor-pointer'
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
