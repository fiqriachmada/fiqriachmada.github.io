import Footer from '../components/footer'
import Header from '../components/header'
import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'

// import google_verification from './../public/googlec4f6b23b5640dd6a.html';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'fiqriachmada',
  description: 'personal site'
}

export default function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <head>
        <meta
          name='google-site-verification'
          content='E9my8MvFE40cVa4KkhP3LP9b6XHVcsAc7oFbi5S3EPs'
        />
      </head>
      <body className={`${jakarta.className}`}>
        <div className='fixed top-0 right-0 left-0 z-10 mx-6 lg:mx-28 my-5 bg-gray-800 mb-16 rounded-xl hover:scale-[101%]'>
          <Header />
        </div>
        <div className='mx-6 lg:mx-28 my-24 lg:my-28'>{children}</div>
      </body>
    </html>
  )
}
