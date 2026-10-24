import { fetchFromAPI } from "./api";

export interface SocialItem {
  id: string;
  platform: string;
  title: string;
  url: string;
  iconSource?: string | null;
  iconName?: string | null;
  iconVersion?: string | null;
  order: number;
  isActive: boolean;
}

export async function fetchSocials(): Promise<{ data: SocialItem[] }> {
  try {
    const res = await fetchFromAPI("/socials");
    return res as { data: SocialItem[] };
  } catch (error) {
    console.error("Error fetching socials from CMS:", error);
    return { data: [] };
  }
}
