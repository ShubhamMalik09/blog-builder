import BlogEditorPage from '@/components/BlogEditorPage'
import { generateId } from '@/lib/utils';
import React from 'react'

const NewBlogEditorPage = () => {
  return (
    <BlogEditorPage
      mode="new"
      initialTitle="Untitled Blog"
      initialBlocks={[
        { id: generateId(), type: "heading1", content: "" },
        { id: generateId(), type: "paragraph", content: "" },
      ]}
    />
  )
}

export default NewBlogEditorPage