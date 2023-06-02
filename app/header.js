'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import { Transition } from '@headlessui/react';
import { useState } from 'react';
import headerItems from '@/data/headerItems';
import Link from 'next/link';

function Header() {
  const [isShowing, setIsShowing] = useState(false);

  return (
    <nav class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* <!-- Mobile menu button--> */}
            <button
              onClick={() => setIsShowing((isShowing) => !isShowing)}
              type="button"
              class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false">
              {/* <span class="sr-only">Open main menu</span> */}

              {/* <Bars3Icon className="text-white" /> */}
              {isShowing ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6">
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
            </button>
          </div>

          <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex flex-shrink-0 items-center">
              <img
                class="block h-8 w-auto lg:hidden"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              />
              <img
                class="hidden h-8 w-auto lg:block"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              />
            </div>
            <div class="hidden sm:ml-6 sm:block">
              <div class="flex space-x-4">
                {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                {headerItems.map((headerItem) => (
                  <a
                    href="#"
                    class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                    aria-current="page">
                    {headerItem.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      <div class="sm:hidden" id="mobile-menu">
        <Transition
          show={isShowing}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div class="space-y-1 px-2 pb-3 pt-2">
            {headerItems.map((headerItem) => (
              <Link
                href="#"
                className="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium capitalize"
                aria-current="page">
                {headerItem.title}
              </Link>
            ))}
          </div>
        </Transition>
      </div>
    </nav>
  );
}

export default Header;
