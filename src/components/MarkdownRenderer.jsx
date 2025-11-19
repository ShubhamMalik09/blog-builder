'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
// import { getBlog } from '@/lib/storage'
import { ArrowLeft, Edit } from 'lucide-react'

export default function MarkdownRenderer({ blogId }) {
  const router = useRouter()
  const [blog, setBlog] = useState(null)

//   useEffect(() => {
//     const loadedBlog = getBlog(blogId)
//     if (loadedBlog) {
//       setBlog(loadedBlog)
//     } else {
//       router.push('/')
//     }
//   }, [blogId, router])

  if (!blog) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <Link 
            href={`/editor/${blogId}`}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <style>{`
              table {
                width: 100%;
                border-collapse: collapse;
                display: block;
                overflow-x: auto;
                margin: 24px 0;
              }
              td, th {
                border: 1px solid #e2e2e2;
                padding: 16px;
                vertical-align: top;
              }
              td img {
                max-width: 100%;
                border-radius: 12px;
              }
            `}</style>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              urlTransform={(url) => {
                if (url.startsWith("data:image/")) return url;
                if (url.startsWith("data:video/")) return url;
                return url;
              }}
              components={{
                table: ({node, ...props}) => (
                  <table {...props} className="rounded-lg shadow-sm" />
                ),
                tr: ({node, ...props}) => <tr {...props} />,
                th: ({node, ...props}) => (
                  <th className="bg-gray-100 text-gray-800 font-semibold" {...props} />
                ),
                td: ({node, ...props}) => (
                  <td className="align-top" {...props} />
                ),
                img: ({node, ...props}) => {
                  if (!props.src) return null
                  return (
                    <img 
                      className="rounded-xl my-4 max-w-full border border-gray-200 shadow"
                      {...props}
                    />
                  )
                },
                video: ({node, ...props}) => {
                  if (!props.src) return null
                  return (
                    <video
                      className="rounded-lg max-w-full my-4"
                      controls
                      {...props}
                    />
                  )
                },
                h1: ({node, ...props}) => <h1 className="text-4xl font-bold mb-6 text-gray-900" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-3xl font-bold mb-4 mt-8 text-gray-900" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-2xl font-bold mb-3 mt-6 text-gray-900" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline 
                    ? <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm" {...props} />
                    : <code className="block bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto" {...props} />,
                pre: ({node, ...props}) => <pre className="mb-4" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                em: ({node, ...props}) => <em className="italic" {...props} />,
              }}
            >
              {blog.markdown}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  )
}