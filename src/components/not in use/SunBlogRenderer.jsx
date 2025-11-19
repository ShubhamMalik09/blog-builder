"use client";

export default function SunBlogRenderer({ html }) {
  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}
