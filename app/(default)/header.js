'use client'

import { Transition } from '@headlessui/react'
import { useState } from 'react'
import headerItems from '@/data/headerItems'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function Header () {
  const [isShowing, setIsShowing] = useState(false)

  const router = useRouter()

  const handleClick = () => {
    router.push('/')
  }

  return (
    <div>
      <div className='flex justify-between'>
        <div className='sm:items-center mt-3 mb-3' onClick={handleClick}>
          <Link href={'/'}>
            <img
              className='block h-8 w-auto lg:hidden'
              src='https://svgshare.com/i/tmn.svg'
              alt='fiqriachmada-logo'
            />
            <img
              className='hidden h-8 w-auto lg:block'
              src='https://svgshare.com/i/tmn.svg'
              alt='fiqriachmada-logo'
            />
          </Link>
        </div>
        <div className='mt-3 mb-3'>
          <div className='hidden sm:ml-6 sm:block'>
            <div className='flex space-x-4'>
              {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
              {headerItems.map(headerItem => (
                <Link
                  href={headerItem.link}
                  className='bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium capitalize'
                >
                  {headerItem.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className='sm:hidden mt-3 mb-3'>
          {/* <!-- Mobile menu button--> */}
          <button
            onClick={() => setIsShowing(isShowing => !isShowing)}
            type='button'
            className='inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
          >
            {isShowing ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className='sm:hidden' id='mobile-menu'>
        <Transition
          show={isShowing}
          enter='transition-opacity duration-75'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='transition-opacity duration-150'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          {/* <div className="space-y-1 px-2 pb-3 pt-2"> */}
          <div className='space-y-1 pb-3'>
            {headerItems.map(headerItem => (
              <Link
                href={headerItem.link}
                className='bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium capitalize'
                aria-current='page'
              >
                {headerItem.title}
              </Link>
            ))}
          </div>
        </Transition>
      </div>
      {/* <div className="flex h-16 items-center justify-between">
        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
          {/* <!-- Mobile menu button--> */}
      {/* <button
        onClick={() => setIsShowing((isShowing) => !isShowing)}
        type="button"
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
        {isShowing ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        )}
      </button> */}
      {/* </div>

        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex flex-shrink-0 items-center">
            <img
              className="block h-8 w-auto lg:hidden"
              src="https://svgshare.com/i/tmn.svg"
              alt="fiqriachmada-logo"
              onClick={() => {
                handleClick();
              }}
            />
            <img
              className="hidden h-8 w-auto lg:block"
              // src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              src="https://svgshare.com/i/tmn.svg"
              alt="fiqriachmada-logo"
              onClick={() => {
                handleClick();
              }}
            />
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
      {/* {headerItems.map((headerItem) => (
                <Link
                  href={headerItem.link}
                  className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium capitalize">
                  {headerItem.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="sm:hidden" id="mobile-menu">
        <Transition
          show={isShowing}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {headerItems.map((headerItem) => (
              <Link
                href={headerItem.link}
                className="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium capitalize"
                aria-current="page">
                {headerItem.title}
              </Link>
            ))}
          </div>
        </Transition>
      </div> */}
    </div>
  )
}

export default Header
