// import "./css/style.css";
"use client";

import Header from "./header";
import Footer from "./footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="Simpleflex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
