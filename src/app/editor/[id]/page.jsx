'use client'

import BlogEditorPage from '@/components/BlogEditorPage';
import React, { useState } from 'react'

const StoredBlogEditorPage = () => {
    const [ title, setTitle ] = useState('');
    const [ blocks, setBlocks ] = useState([]);


    return (
        <BlogEditorPage
            mode="edit"
            initialTitle="Untitled Blog"
            initialBlocks={[
                { id: 1, type: "heading", content: "Your Blog Title" },
                { id: 2, type: "paragraph", content: "Start writing your content here..." },
            ]}
        />
    )
}

export default StoredBlogEditorPage