

import Footer from './(default)/footer'
import Header from './(default)/header'
import './globals.css'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <body className={`${jakarta.className}`}>
        <div className='bg-gray-800 mb-16'>
          <div className=' mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
            <Header />
          </div>
        </div>
        <div className=' mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 '>
          {children}
        </div>

        {/* <DefaultLayout children={children} /> */}
        <div className='bg-gray-600 mt-16'>
          <div className=' mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  )
}
