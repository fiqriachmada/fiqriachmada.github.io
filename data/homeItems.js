import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

export const links = [
  {
    title: "Instagram",
    link: "https://www.instagram.com/fiqriachmada/",
    icon: faInstagram,
  },
  {
    title: "LinkedIn",
    link: "https://www.linkedin.com/in/fiqri-achmada-8575a7178/",
    icon: faLinkedin,
  },
  {
    title: "GitHub",
    link: "https://github.com/fiqriachmada",
    icon: faGithub,
  },
];

const homeItems = ({ work } = {}) => [
  {
    welcome: `Hi, It's Mada`,
    content: {
      0: <p>Achmada Fiqri</p>,
      1: <p>Fullstack Developer</p>,
      2: (
        <p className="p1 margin-left--sm margin-right--sm avatar avatar--vertical">
          Fullstack Developer. Sometimes doing code, Mobile Legends and Basketball with ❤️. Currently
          based on Jakarta, Indonesia
        </p>
      ),
      3: (
        <p className="p2 margin-left--sm margin-right--sm avatar avatar--vertical">
          Reach me via email at{" "}
          <a
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            href="mailto:achmadafiqri.work@gmail.com">
            achmadafiqri.work@gmail.com
          </a>
        </p>
      ),
      4: (
        <div className="flex gap-10">
          {links.map((link, index) => (
            <div key={index} className="cursor-pointer">
              <Link href={link.link} title={link.title} target="_blank">
                <FontAwesomeIcon
                  className="hover:scale-[110%] h-6 hover:text-gray-400"
                  icon={link.icon}
                />
              </Link>
            </div>
          ))}
        </div>
      ),
    },
    link: "/about",
  },
];

export default homeItems;
