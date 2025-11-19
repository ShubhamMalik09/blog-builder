import BlogEditorPage from '@/components/BlogEditorPage'
import React from 'react'

const NewBlogEditorPage = () => {
  return (
    <BlogEditorPage
      mode="new"
      initialTitle="Untitled Blog"
      initialBlocks={[
        { id: 1, type: "heading1", content: "Your Blog Title" },
        { id: 2, type: "paragraph", content: "Start writing your content here..." },
      ]}
    />
  )
}

export default NewBlogEditorPage