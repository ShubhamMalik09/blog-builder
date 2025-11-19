import { Plus, GripVertical, Trash2, Type, AlignLeft, List, Quote, Code, Save, Eye, ImageIcon, VideoIcon } from 'lucide-react'

export const defaults = {
    heading1: "New Heading 1",
    heading2: "New Heading 2",
    heading3: "New Heading 3",
    heading4: "New Heading 4",
    paragraph: 'Start typing...',
    list: 'List item 1\nList item 2',
    quote: 'Enter your quote here',
    code: 'const example = "code";'
}

export const styles = {
    heading1: "text-4xl font-bold leading-tight",
    heading2: "text-3xl font-bold leading-snug",
    heading3: "text-2xl font-semibold leading-snug",
    heading4: "text-xl font-medium leading-snug",

    paragraph: "text-base leading-relaxed",
    list: "text-base leading-relaxed font-mono",
    quote: "text-lg italic border-l-4 border-blue-500 pl-4 text-gray-600",
    code: "text-sm font-mono bg-gray-900 text-green-400 p-4 rounded-lg"
}

export const blockTypes = [
    { type: 'heading1', icon: Type, label: 'Heading 1' },
    { type: 'heading2', icon: Type, label: 'Heading 2' },
    { type: 'heading3', icon: Type, label: 'Heading 3' },
    { type: 'heading4', icon: Type, label: 'Heading 4' },
    { type: 'paragraph', icon: AlignLeft, label: 'Paragraph' },
    { type: 'list', icon: List, label: 'List' },
    { type: 'quote', icon: Quote, label: 'Quote' },
    { type: 'code', icon: Code, label: 'Code' },
    { type: 'image', icon: ImageIcon, label: 'Image' },
    { type: 'video', icon: VideoIcon, label: 'Video' },
]