import Footer from './(default)/footer';
import Header from './(default)/header';
import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';

// import google_verification from './../public/googlec4f6b23b5640dd6a.html';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'fiqriachmada',
  description: 'personal site',
};

export default function RootLayout({ children }) {
  // console.log('google_verification', google_verification);
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="E9my8MvFE40cVa4KkhP3LP9b6XHVcsAc7oFbi5S3EPs"
        />
      </head>
      <body className={`${jakarta.className}`}>
        <div className="bg-gray-800 mb-16">
          <div className=" mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <Header />
          </div>
        </div>
        <div className=" mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">
          {children}
        </div>

        <div className="bg-gray-600 mt-16">
          <div className=" mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
