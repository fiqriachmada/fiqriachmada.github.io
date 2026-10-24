import type { StaticImageData } from "next/image";

/** Static portfolio project entry (see `data/projectItems.ts`). */
export interface ProjectItem {
  id: string;
  image: string | StaticImageData;
  title: string;
  description: string;
  link?: string;
  googlePlay?: string;
  appStore?: string;
}
