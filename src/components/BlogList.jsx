'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
// import { getAllBlogs, deleteBlog } from '@/lib/storage'
import { FileText, Trash2, Eye, Edit } from 'lucide-react'
import { Button } from './ui/button'

export default function BlogList() {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = () => {
    const allBlogs = {}  //getAllBlogs()
    const blogArray = Object.values(allBlogs).sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    )
    setBlogs(blogArray)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      //deleteBlog(id)
      loadBlogs()
    }
  }

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col text-center py-20 w-full items-center justify-center">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No blogs yet</h2>
        <p className="text-gray-600 mb-6">Create your first blog to get started</p>
        <Button className={`w-36 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 hover:cursor-pointer hover:shadow-lg transition-all`}>
          <Link 
            href="/editor/new"
          >
            Create Blog
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <div key={blog.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{blog.title}</h3>
          <p className="text-sm text-gray-500 mb-4">
            Updated {new Date(blog.updatedAt).toLocaleDateString()}
          </p>
          <div className="text-sm text-gray-600 mb-4 line-clamp-3">
            {blog.markdown.substring(0, 150)}...
          </div>
          <div className="flex gap-2">
            <Link 
              href={`/blog/${blog.id}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View
            </Link>
            <Link 
              href={`/editor/${blog.id}`}
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
      ))}
    </div>
  )
}