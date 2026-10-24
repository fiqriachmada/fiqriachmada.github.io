"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function getVisitorId() {
  if (typeof window === "undefined") return "anonymous";
  let vid = localStorage.getItem("fc_visitor_id");
  if (!vid) {
    vid = "v_" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    localStorage.setItem("fc_visitor_id", vid);
  }
  return vid;
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastTrackedPath.current) return;
    lastTrackedPath.current = pathname;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://fiqriachmada-cms.vercel.app/api";
    const visitorId = getVisitorId();
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const referrer = document.referrer || null;

    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source");
    const utmMedium = urlParams.get("utm_medium");
    const utmCampaign = urlParams.get("utm_campaign");

    // Send tracking beacon / fetch to CMS client analytics endpoint
    fetch(`${apiUrl}/client/v1/analytics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: pathname,
        referrer,
        visitorId,
        screenResolution,
        utmSource,
        utmMedium,
        utmCampaign,
      }),
    }).catch(() => {
      // Ignore background analytics network errors
    });
  }, [pathname]);

  return null;
}
