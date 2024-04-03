import Link from "next/link";
import homeItems from "./homeItems";

const title = "home";
export const metadata = {
  title: "fiqriachmada | " + title,
  description: "pernosal site",
};

export default function Home() {
  return (
    <div>
      {homeItems.map((homeItem, index) => (
        <div className="bg-white text-black shadow-xl rounded-md" key={index}>
          <div className="p-6 lg:px-32">
            <div className="flex justify-center pt-5 capitalize">
              {homeItem.welcome}
            </div>
            <div className="flex justify-center pt-5">
              <Link href={homeItem.link}>
                <img
                  src="https://svgshare.com/i/tmn.svg"
                  className="hover:opacity-70"
                />
              </Link>
            </div>
            <div className="text-center pt-5 ">{homeItem.content[1]}</div>
            <div className="text-center pt-5 ">{homeItem.content[2]}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
