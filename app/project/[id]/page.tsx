import React from "react";
import ProjectDetailClient from "@/components/project/detail/projectDetailClient";
import { fetchProjectData } from "@/lib/projectApi";

export async function generateStaticParams() {
  try {
    const res = await fetchProjectData({ limit: 100 });
    return (res?.data || []).map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

export default function ProjectDetailPage() {
  return <ProjectDetailClient />;
}
