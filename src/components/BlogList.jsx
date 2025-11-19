'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Trash2, Eye, Edit, Clock, Calendar, Tag, Archive } from 'lucide-react'
import { Button } from './ui/button'

// Sample blog data with all three states

/* 
TODO: 
- Blogs payload will have tag ids instead of tags info. use global state to resolve them
- Don't add destructive actions
*/

const SAMPLE_BLOGS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Getting Started with Next.js 14',
    slug: 'getting-started-nextjs-14',
    description: 'Explore the latest features in Next.js 14 including improved performance and enhanced caching strategies.',
    content_markdown: 'Next.js 14 brings exciting new features...',
    cover_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    primary_tag: 'Next.js',
    secondary_tags: ['React', 'Web Development'],
    read_time_minutes: 8,
    is_published: true,
    is_archived: false,
    published_at: '2024-11-15T10:30:00Z',
    updated_at: '2024-11-15T10:30:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Understanding React Server Components',
    slug: 'understanding-react-server-components',
    description: 'Deep dive into React Server Components and how they transform modern web development.',
    content_markdown: 'React Server Components revolutionize...',
    cover_image_url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=400&fit=crop',
    primary_tag: 'React',
    secondary_tags: ['Server Components'],
    read_time_minutes: 12,
    is_published: false,
    is_archived: false,
    published_at: null,
    updated_at: '2024-11-18T14:20:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: 'Tailwind CSS Best Practices',
    slug: 'tailwind-css-best-practices',
    description: 'Learn how to structure scalable Tailwind projects with reusable components and clean styles.',
    content_markdown: 'Tailwind CSS has become one of the most popular...',
    cover_image_url: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&h=400&fit=crop',
    primary_tag: 'CSS',
    secondary_tags: ['Tailwind', 'Design'],
    read_time_minutes: 6,
    is_published: false,
    is_archived: true,
    published_at: null,
    updated_at: '2024-11-10T09:15:00Z',
  }
]

export default function BlogList() {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = () => {
    const blogArray = SAMPLE_BLOGS.sort((a, b) => 
      new Date(b.updated_at) - new Date(a.updated_at)
    )
    setBlogs(blogArray)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      setBlogs(blogs.filter(blog => blog.id !== id))
    }
  }

  const getStatusBadge = (blog) => {
    if (blog.is_published) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
          Published
        </span>
      )
    }
    if (blog.is_archived) {
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
          Archived
        </span>
      )
    }
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
        Draft
      </span>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col text-center py-20 w-full items-center justify-center">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No blogs yet</h2>
        <p className="text-gray-600 mb-6">Create your first blog to get started</p>
        <Button className="w-36 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 hover:cursor-pointer hover:shadow-lg transition-all">
          <Link href="/editor/new">
            Create Blog
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <div key={blog.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden">
          {blog.cover_image_url && (
            <div className="w-full h-48 bg-gray-200">
              <img 
                src={blog.cover_image_url} 
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              {getStatusBadge(blog)}
              {blog.read_time_minutes && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {blog.read_time_minutes} min read
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
              {blog.title}
            </h3>
            
            {blog.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {blog.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                <Tag className="w-3 h-3" />
                {blog.primary_tag}
              </span>
              {blog.secondary_tags?.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
              <Calendar className="w-3 h-3" />
              {blog.published_at 
                ? `Published ${new Date(blog.published_at).toLocaleDateString()}`
                : `Updated ${new Date(blog.updated_at).toLocaleDateString()}`
              }
            </div>

            <div className="flex gap-2">
              <Link 
                href={`/blog/${blog.slug}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View
              </Link>
              <Link 
                href={`/editor/${blog.slug}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              <button 
                onClick={() => handleDelete(blog.id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}