'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";


export default function MarkdownPreview({ markdown }) {
  return (
    <div className="p-8">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Live Preview
        </h2>
        <p className="text-sm text-gray-500 mt-1">Changes appear instantly as you type</p>
      </div>
      
      <article className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]} 
          urlTransform={(url) => {
            // Allow base64 image URLs
            if (url.startsWith("data:image/")) return url;
            if (url.startsWith("data:video/")) return url;
            // Default behavior for everything else
            return url;
        }}
          components={{
            img: ({node, ...props}) => {
                console.log(props);
                const src = props.src;
                if (!src) return null;
                return <img 
                    className="rounded-lg my-4 max-w-full h-auto border border-gray-200 shadow-sm"
                    src={src}
                    alt={props.alt || "image"}
                />
            },
            video: ({node, ...props}) => {
                if (!props.src) return null;
                return <video
                    className="rounded-xl max-w-full"
                    controls
                    {...props}
                />
            },
            h1: ({node, ...props}) => <h1 className="text-4xl font-bold mt-6 mb-4 text-gray-900" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-3xl font-bold mt-6 mb-4 text-gray-900" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-2xl font-semibold mt-5 mb-3 text-gray-900" {...props} />,
            h4: ({node, ...props}) => <h4 className="text-xl font-medium mt-4 mb-2 text-gray-900" {...props} />,
            p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
            li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4 bg-blue-50 py-2" {...props} />,
            code: ({node, inline, ...props}) => 
              inline 
                ? <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono" {...props} />
                : <code className="block bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm" {...props} />,
            pre: ({node, ...props}) => <pre className="mb-4 rounded-lg overflow-hidden" {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
            em: ({node, ...props}) => <em className="italic" {...props} />,
            a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-800 underline" {...props} />,
            hr: ({node, ...props}) => <hr className="my-8 border-gray-300" {...props} />,
          }}
        >
          {markdown || '*Start typing to see preview...*'}
        </ReactMarkdown>
      </article>
    </div>
  )
}