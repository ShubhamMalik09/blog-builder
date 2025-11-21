"use client"

import { notFound, useParams, useSearchParams } from "next/navigation";
import { getBlogBySlug } from "@/lib/api/blog";
import MarkdownPreview from "@/components/MarkdownPreview";
import { useEffect, useState } from "react";

const GetPostBySlugPage =  () => {
  const { slug } = useParams();
  const [ post, setPost ] = useState(null);

  const init = async() =>{
    if(!slug) return;
    const res = await getBlogBySlug(slug);
    if(res.data.data){
        setPost(res?.data?.data);
    }
  }

  useEffect(()=>{
    init();
  },[slug]);

  if(!post) return null;

  return (
    <main className="mx-auto max-w-3xl py-10">

      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {post.description && (
          <p className="text-lg text-gray-600 mb-4">{post.description}</p>
        )}

        <div className="text-gray-500 text-sm flex gap-2">
          {post.published_at && (
            <span>
              {new Date(post.published_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          {typeof post.read_time_minutes === "number" && (
            <span>· {post.read_time_minutes} min read</span>
          )}
        </div>

        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="mt-6 w-full rounded-xl border border-gray-200 object-cover"
          />
        )}
      </header>

      {/* CONTENT */}
      <MarkdownPreview
        markdown={post.content_markdown}
        title={post.title}
      />
    </main>
  );
}

export default GetPostBySlugPage;