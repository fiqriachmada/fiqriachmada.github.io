import React from "react";
import WorkDetailClient from "@/components/work/detail/workDetailClient";
import { fetchWorkData } from "@/lib/workApi";

export async function generateStaticParams() {
  try {
    const res = await fetchWorkData({ limit: 100 });
    return (res?.data || []).map((w) => ({ id: w.id }));
  } catch {
    return [];
  }
}

export default function WorkDetailPage() {
  return <WorkDetailClient />;
}
