import Link from "next/link";
import homeItems from "../data/homeItems";
import HomeCard from "@/components/home/homeCard";

const title = "home";
export const metadata = {
  title: "fiqriachmada | " + title,
  description: "pernosal site",
};

export default function Home() {
  return (
    <div>
      <HomeCard/>
    </div>
  );
}
