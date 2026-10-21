import React from "react";
import BlogCard from "@/components/blog/blogCard";

const title = "blog";
export const metadata = {
  title: "fiqriachmada | " + title,
  description: "personal site - blog & articles",
};

export default function BlogPage() {
  return <BlogCard />;
}
