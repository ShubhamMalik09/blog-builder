"use client";

import { useParams } from "next/navigation";
import { getBlogBySlug } from "@/lib/api/blog";
import MarkdownPreview from "@/components/MarkdownPreview";
import { useEffect, useState } from "react";
import Image from "next/image";

const GetPostBySlugPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [notFoundState, setNotFoundState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!slug) return;

      try {
        const res = await getBlogBySlug(slug);

        if (res.data?.data) {
          setPost(res.data.data);
        } else {
          setNotFoundState(true);
        }
      } catch {
        setNotFoundState(true);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [slug]);

  if (loading) return null;

  if (notFoundState) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold">404 – Blog Not Found</h2>
        <p className="text-gray-600">The blog you are looking for doesn’t exist.</p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl py-10 px-4">
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
          <div className="relative mt-6 w-full h-96">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              priority
              className="rounded-xl border border-gray-200 object-cover"
            />
          </div>
        )}
      </header>

      <MarkdownPreview markdown={post.content_markdown} title={post.title} />
    </main>
  );
};

export default GetPostBySlugPage;
