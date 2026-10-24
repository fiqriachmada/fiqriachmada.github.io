import React from "react";
import * as RadixIcons from "@radix-ui/react-icons";

export interface SocialIconProps {
  iconSource?: string | null;
  iconName?: string | null;
  className?: string;
}

export function SocialIcon({
  iconSource = "radix-ui",
  iconName = "GlobeIcon",
  className = "h-6 w-6 hover:scale-110 transition-transform",
}: SocialIconProps) {
  const safeName = (iconName || "GlobeIcon").trim();

  if (iconSource === "radix-ui" || !iconSource) {
    const Component = (RadixIcons as any)[safeName] || RadixIcons.GlobeIcon;
    return <Component className={className} />;
  }

  return <RadixIcons.GlobeIcon className={className} />;
}
