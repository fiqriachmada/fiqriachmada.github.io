import React from "react";
import * as RadixIcons from "@radix-ui/react-icons";
import * as SiIcons from "react-icons/si";

export interface SocialIconProps {
  iconSource?: string | null;
  iconName?: string | null;
  className?: string;
}

export function SocialIcon({
  iconSource = "react-icons",
  iconName = "SiGlobe",
  className = "h-6 w-6 hover:scale-110 transition-transform",
}: SocialIconProps) {
  const safeName = (iconName || "").trim();

  // 1. Simple Icons (react-icons/si)
  if (iconSource === "react-icons" || iconSource === "simple-icons") {
    const Component = (SiIcons as any)[safeName];
    if (Component) return <Component className={className} />;
  }

  // 2. Radix UI Icons
  if (iconSource === "radix-ui") {
    const Component = (RadixIcons as any)[safeName] || RadixIcons.GlobeIcon;
    if (Component) return <Component className={className} />;
  }

  // Fallback ke SiIcons jika nama cocok
  if ((SiIcons as any)[safeName]) {
    const Component = (SiIcons as any)[safeName];
    return <Component className={className} />;
  }

  return <RadixIcons.GlobeIcon className={className} />;
}
