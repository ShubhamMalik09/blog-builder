'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Edit, Clock, Calendar, Tag } from 'lucide-react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { archiveBlog, getAllBlogs, publishBlog, unpublishBlog } from '@/lib/api/blog'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

export default function BlogList({ page, limit, filters, setTotalCount, setLoading, setInitialLoading }) {
  const { primaryTags, industries } = useSelector(state => state.tags)
  const [blogs, setBlogs] = useState([])
  const [initialLoad, setInitialLoad] = useState(true)
  const [error, setError] = useState(null)
  const [loadingBlogs, setLoadingBlogs] = useState({})

  useEffect(() => {
    loadBlogs()
  }, [page, limit, filters])

  const loadBlogs = async () => {
    try {
      if (page === 1) {
        setInitialLoad(true)
        setInitialLoading(true)
      }
      setLoading(true)
      setError(null)

      const params = {
        page,
        page_size: limit,
        sort_by: filters.sort_by || 'updated_at',
        sort_order: filters.sort_order || 'desc',
      }

      if (filters.status) params.status = filters.status
      if (filters.primary_tag_id) params.primary_tag_id = filters.primary_tag_id
      if (filters.industry_id?.length > 0) params.industry_ids = filters.industry_id.join(',')
      if (filters.search) params.search = filters.search

      const response = await getAllBlogs(params)

      if (response.data.success) {
        if (page === 1) {
          setBlogs(response.data.data)
        } else {
          setBlogs(prev => [...prev, ...response.data.data])
        }
        setTotalCount(response.data.total)
      } else {
        toast.error('Failed to load blogs', {
          description: response.data.error
        })
        setError('Failed to load blogs')
      }
    } catch (err) {
      toast.error('Unable to load blog', {
        description: (err.response?.data?.error || err.message)
      })
      console.error('Error loading blogs:', err)
      setError(err.response?.data?.error || 'Failed to load blogs')
    } finally {
      setInitialLoad(false)
      setInitialLoading(false)
      setLoading(false)
    }
  }
  
  const publishHandler = async (id) => {
    try {
      setLoadingBlogs(prev => ({ ...prev, [id]: true }))
      const res = await publishBlog(id, { username: localStorage.getItem('username') })

      if (!res?.data?.success) {
        toast.error("Failed to publish blog", {
          description: res.data?.error
        })
        return false
      }

      setBlogs(blogs.map(blog =>
        blog.id === id
          ? { ...blog, is_published: true, published_at: new Date().toISOString() }
          : blog
      ))

      toast.success("Blog published successfully")
      return true
    } catch (error) {
      toast.error('Error publishing blog', {
        description: error.message
      })
    } finally {
      setLoadingBlogs(prev => ({ ...prev, [id]: false }))
    }
  }

  const unpublishHandler = async (id) => {
    try {
      setLoadingBlogs(prev => ({ ...prev, [id]: true }))
      const res = await unpublishBlog(id, { username: localStorage.getItem('username') })

      if (!res?.data?.success) {
        toast.error("Failed to unpublish blog", {
          description: res.data?.error
        })
        return false
      }

      setBlogs(blogs.map(blog =>
        blog.id === id ? { ...blog, is_published: false } : blog
      ))

      toast.success("Blog unpublished successfully")
      return true
    } catch (err) {
      toast.error('Error unpublishing blog', {
        description: (err.response?.data?.error || err.message)
      })
    } finally {
      setLoadingBlogs(prev => ({ ...prev, [id]: false }))
    }
  }

  const archiveHandler = async (id) => {
    try {
      setLoadingBlogs(prev => ({ ...prev, [id]: true }))
      const res = await archiveBlog(id, { username: localStorage.getItem('username') })

      if (!res?.data?.success) {
        toast.error("Failed to archive blog", {
          description: res.data?.error
        })
        return false
      }

      setBlogs(blogs.map(blog =>
        blog.id === id ? { ...blog, is_archived: true } : blog
      ))

      toast.success("Blog archived successfully")
      return true
    } catch (err) {
      toast.error('Error archiving blog', {
        description: (err.response?.data?.error || err.message)
      })
    } finally {
      setLoadingBlogs(prev => ({ ...prev, [id]: false }))
    }
  }

  const unarchiveHandler = async (id) => {
    try {
      setLoadingBlogs(prev => ({ ...prev, [id]: true }))
      const res = await unpublishBlog(id, { username: localStorage.getItem('username') })

      if (!res?.data?.success) {
        toast.error("Failed to unarchive blog", {
          description: res.data?.error
        })
        return false
      }

      setBlogs(blogs.map(blog =>
        blog.id === id ? { ...blog, is_archived: false } : blog
      ))

      toast.success("Blog unarchived successfully")
      return true
    } catch (err) {
      toast.error('Error unarchiving blog', {
        description: (err.response?.data?.error || err.message)
      })
    } finally {
      setLoadingBlogs(prev => ({ ...prev, [id]: false }))
    }
  }

  const getTagName = (id, type) => {
    if (type === 'primary') {
      return (primaryTags.find(tag => tag.id == id))?.name
    }
    else if (type === 'industry') {
      return (industries.find(industry => industry.id == id))?.name
    }
  }

  const getStatusBadge = (blog) => {
    if (blog?.is_published) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
          Published
        </span>
      )
    }
    if (blog?.is_archived) {
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

  if (initialLoad) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <Skeleton className="w-full h-48" />
            <div className="p-6 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col text-center py-20 w-full items-center justify-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error loading blogs</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button
          onClick={loadBlogs}
          className="w-36 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 hover:cursor-pointer hover:shadow-lg transition-all"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col text-center py-20 w-full items-center justify-center">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No blogs found</h2>
        <p className="text-gray-600 mb-6">Try adjusting your filters or create a new blog</p>
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
                src={blog?.cover_image_url}
                alt={blog?.title}
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
                  {blog?.read_time_minutes} min read
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 ">
              <Link href={`/blog/${blog.slug}`} className="hover:text-blue-500 inline">
                {blog.title}
              </Link>
            </h3>

            {blog.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {blog.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                <Tag className="w-3 h-3" />
                {getTagName(String(blog.primary_tag_id), 'primary')}
              </span>
              {blog.industry_ids?.slice(0, 2).map((tagId, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                  {getTagName(tagId, 'industry')}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
              <Calendar className="w-3 h-3" />
              {blog.published_at
                ? `Published ${new Date(blog?.published_at)?.toLocaleDateString()}`
                : `Updated ${new Date(blog?.updated_at)?.toLocaleDateString()}`
              }
            </div>

            <div className="flex gap-2">
              {blog.is_archived ? (
                <>
                  <button
                    onClick={() => unarchiveHandler(blog.id)}
                    disabled={loadingBlogs[blog.id]}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Unarchive
                  </button>

                  <Link
                    href={`/editor/${blog.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                </>
              ) : (
                <>
                  {blog.is_published ? (
                    <>
                      <button
                        onClick={() => unpublishHandler(blog.id)}
                        disabled={loadingBlogs[blog.id]}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Unpublish
                      </button>

                      <button
                        onClick={() => archiveHandler(blog.id)}
                        disabled={loadingBlogs[blog.id]}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Archive
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => publishHandler(blog.id)}
                        disabled={loadingBlogs[blog.id]}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Publish
                      </button>

                      <button
                        onClick={() => archiveHandler(blog.id)}
                        disabled={loadingBlogs[blog.id]}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Archive
                      </button>
                    </>
                  )}

                  <Link
                    href={`/editor/${blog.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}