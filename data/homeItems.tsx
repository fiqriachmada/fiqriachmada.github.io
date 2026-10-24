import type { WorkItem } from "@/types/api";
import type { SocialItem } from "@/lib/socialApi";
import Link from "next/link";
import { SocialIcon } from "@/components/socials/socialIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

// Fallback jika API CMS tidak terjangkau
export const fallbackLinks = [
  {
    id: "fb-1",
    title: "Instagram",
    url: "https://www.instagram.com/fiqriachmada/",
    iconSource: "react-icons",
    iconName: "SiInstagram",
    faIcon: faInstagram,
  },
  {
    id: "fb-2",
    title: "LinkedIn",
    url: "https://www.linkedin.com/in/fiqri-achmada-8575a7178/",
    iconSource: "react-icons",
    iconName: "SiLinkedin",
    faIcon: faLinkedin,
  },
  {
    id: "fb-3",
    title: "GitHub",
    url: "https://github.com/fiqriachmada",
    iconSource: "react-icons",
    iconName: "SiGithub",
    faIcon: faGithub,
  },
];

const homeItems = (
  options: {
    currentWork?: WorkItem | null;
    socials?: SocialItem[] | null;
  } = {},
) => {
  const { currentWork, socials } = options;

  // Prioritaskan data secure dari API CMS
  const activeSocials =
    socials && socials.length > 0
      ? socials.map((s) => ({
          id: s.id,
          title: s.title,
          url: s.url,
          iconSource: s.iconSource || "radix-ui",
          iconName: s.iconName || "GlobeIcon",
          faIcon: null,
        }))
      : fallbackLinks;

  return [
    {
      welcome: `Hi, It's Mada`,
      content: {
        0: <p>Achmada Fiqri</p>,
        1: <p>{currentWork?.position}</p>,
        2: (
          <p className="p1 margin-left--sm margin-right--sm avatar avatar--vertical">
            {currentWork?.position}. Sometimes doing code, Mobile Legends and
            Basketball with ❤️. Currently based on Jakarta, Indonesia
          </p>
        ),
        3: (
          <p className="p2 margin-left--sm margin-right--sm avatar avatar--vertical">
            Reach me via email at{" "}
            <a
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              href="mailto:achmadafiqri.work@gmail.com"
            >
              achmadafiqri.work@gmail.com
            </a>
          </p>
        ),
        4: (
          <div className="flex gap-6 sm:gap-8 items-center">
            {activeSocials.map((link) => (
              <div key={link.id} className="cursor-pointer">
                <Link
                  href={link.url}
                  title={link.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {link.faIcon ? (
                    <FontAwesomeIcon
                      className="hover:scale-[110%] h-6 hover:text-gray-400 transition-transform"
                      icon={link.faIcon}
                    />
                  ) : (
                    <SocialIcon
                      iconSource={link.iconSource}
                      iconName={link.iconName}
                      className="h-6 w-6 hover:scale-110 transition-transform"
                    />
                  )}
                </Link>
              </div>
            ))}
          </div>
        ),
      },
      link: "/about",
    },
  ];
};

export default homeItems;
