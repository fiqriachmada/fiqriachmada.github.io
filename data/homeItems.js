import {
  faGithub,
  faInstagram,
  faLinkedin,
  faLinkedinIn,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const links = [
  {
    title: "LinkedIn",
    link: "https://www.linkedin.com/in/fiqriachmada",
    icon: faLinkedinIn,
  },
  {
    title: "Instagram",
    link: "https://www.instagram.com/fiqriachmada",
    icon: faInstagram,
  },
  {
    title: "X",
    link: "https://x.com/fiqriachmada",
    icon: faXTwitter,
  },
  {
    title: "Github",
    link: "https://github.com/fiqriachmada",
    icon: faGithub,
  },
];

const homeItems = [
  {
    welcome: `Hi, It's Mada`,
    content: {
      0: <p>Achmada Fiqri</p>,
      1: <p>Front-End Engineer</p>,
      2: (
        <p className="p1 margin-left--sm margin-right--sm avatar avatar--vertical">
          Junior Software Developer at PT Gudang Segar Indonesia
          <a className="text-blue-500" href="https://freshfactory.id/">
            {" "}
            (Fresh Factory){" "}
          </a>
          and still Student (Hopefully graduate 2024) at
          <a className="text-blue-500" href="https://itats.ac.id/">
            {" "}
            ITATS.{" "}
          </a>
          Sometimes doing code, Mobile Legends and Basketball with ❤️. Currently
          based on Jakarta, Indonesia
        </p>
      ),
      3: (
        <p className="p2 margin-left--sm margin-right--sm avatar avatar--vertical">
          Reach me via email at{" "}
          <a className="text-blue-500" href="mailto:achmada1998@gmail.com">
            achmada1998@gmail.com
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
