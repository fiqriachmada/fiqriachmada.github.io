// import "./css/style.css";
"use client";

// import "global.css";
import Header from "./header";
import Footer from "./footer";

export default function DefaultLayout({ children }) {
  return (
    <main>
      <div className="Simpleflex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
        <Header />
        {children}
        <Footer />
      </div>
    </main>
  );
}
