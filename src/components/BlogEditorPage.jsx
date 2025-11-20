"use client";

import { useEffect, useRef, useState } from "react";

import BlockEditor from "@/components/BlockEditor";
import { blocksToMarkdown } from "@/lib/markdown";
import MarkdownPreview from "@/components/MarkdownPreview";
import { Loader, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import TagModal from "./TagModal";
import { Badge } from "./ui/badge";

export default function BlogEditorPage({ initialBlocks, mode='new', initialTitle, initialCover, initialDescription, initialPrimaryTag, initialSecondayTags}) {
  const [hydrated, setHydrated] = useState(false);
  const [title, setTitle] = useState(initialTitle)
  const [coverImage, setCoverImage] = useState(initialCover || null);
  const [ description, setDescription ] = useState(initialDescription || '');
  const [ primaryTags, setPrimaryTags ] = useState(["Deep Learning", "NLP", "Startups"]);
  const [secondaryTags, setSecondaryTags] = useState(["Deep Learning", "NLP", "Startups"]);
  const [selectedPrimary, setSelectedPrimary] = useState( initialPrimaryTag || "");
  const [selectedSecondary, setSelectedSecondary] = useState(initialSecondayTags || []);
  const [isSaving, setIsSaving] = useState(false)
  const [blocks, setBlocks] = useState(initialBlocks);
  const [loading, setLoading] = useState(true);
  const blocksRef = useRef(blocks);
  const titleRef = useRef(title);
  const coverRef = useRef(coverImage);
  const descRef = useRef(description);
  const primaryRef = useRef(selectedPrimary);
  const secondaryRef = useRef(selectedSecondary);

  const markdown = blocksToMarkdown(blocks);
  console.log(markdown);

  useEffect(() => { titleRef.current = title }, [title]);
  useEffect(() => { coverRef.current = coverImage }, [coverImage]);
  useEffect(() => { descRef.current = description }, [description]);
  useEffect(() => { primaryRef.current = selectedPrimary }, [selectedPrimary]);
  useEffect(() => { secondaryRef.current = selectedSecondary }, [selectedSecondary]);
  useEffect(() => { blocksRef.current = blocks }, [blocks]);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (mode !== "new") return;

    const interval = setInterval(() => {
      const draft = {
        title: titleRef.current,
        coverImage: coverRef.current,
        description: descRef.current,
        selectedPrimary: primaryRef.current,
        selectedSecondary: secondaryRef.current,
        blocks: blocksRef.current
      };

      localStorage.setItem("blog-draft", JSON.stringify(draft));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mode === "new") {
      const stored = localStorage.getItem("blog-draft");

      if (stored) {
        const draft = JSON.parse(stored);

        if (draft.title) setTitle(draft.title);
        if (draft.coverImage) setCoverImage(draft.coverImage);
        if (draft.description) setDescription(draft.description);
        if (draft.selectedPrimary) setSelectedPrimary(draft.selectedPrimary);
        if (draft.selectedSecondary) setSelectedSecondary(draft.selectedSecondary);
        if (draft.blocks?.length > 0) setBlocks(draft.blocks);
      }
    }

    setLoading(false);
  }, []);

  const handleSave = () => {
    setIsSaving(true)
    const markdown = blocksToMarkdown(blocks)
    const id = blogId === 'new' ? Date.now().toString() : blogId
    
    // saveBlog(id, title, blocks, markdown)
    
    setTimeout(() => {
      setIsSaving(false)
      if (blogId === 'new') {
        router.push(`/editor/${id}`)
      }
    }, 500)
  }

  return (
    <div className="flex flex-col w-full p-2">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-xl bg-opacity-90 px-4">
            <div className="w-full mx-auto px-6 py-3">
                <div className="flex items-center justify-between mb-3">
                  <h1 className="text-2xl font-bold text-black">
                    Wokelo Blog Builder
                  </h1>
                  <div className="flex gap-3">
                    <Button className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:shadow-lg hover:bg-gray-800 cursor-pointer transition-all flex items-center gap-2 disabled:opacity-50" onClick={handleSave} disabled={isSaving}>
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
            </div>
        </header>

        <div className="flex flex-col w-full justify-between px-3 py-2 border-b-2 gap-2">
          <div className="grid grid-cols-2 w-full h-full pb-2 gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-semibold bg-transparent border-none focus:outline-none text-gray-700"
              placeholder="Blog Title"
            />
            <div className="w-full flex">
              {hydrated && coverImage ? (
                <div className="relative w-full h-20">
                  <img
                    src={coverImage}
                    className="w-full h-full object-cover rounded-xl border"
                    alt="Cover"
                  />

                  <button
                    onClick={() => setCoverImage(null)}
                    className="absolute top-3 right-3 bg-gray-100 backdrop-blur-md w-6 h-6 rounded-full shadow hover:bg-white"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="w-full h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer">
                  <span className="font-medium">Upload Cover Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      setCoverImage(url);
                    }}
                  />
                </label>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 h-full w-full gap-4">
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Write a short description..."
            />
            <div className="grid grid-cols-2 w-full gap-2">
              <div className="flex flex-col w-full space-y-2">
                <label className="text-sm font-semibold text-gray-700">Primary Tag</label>

                <div className="flex items-center gap-3">
                  <Select onValueChange={(v) => setSelectedPrimary(v)}>
                    <SelectTrigger className="w-56">
                      <SelectValue placeholder="Select a primary tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {primaryTags.map((tag, idx) => (
                        <SelectItem key={idx} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <TagModal
                    triggerText="+ New Primary"
                    onAdd={(tag) => {
                      setPrimaryTags([...primaryTags, tag]);
                      setSelectedPrimary(tag);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col w-full space-y-2">
                <label className="text-sm font-semibold text-gray-700">Secondary Tags</label>

                {/* Dropdown */}
                <div className="flex items-center gap-3">
                  <Select
                    onValueChange={(v) => {
                      if (!selectedSecondary.includes(v)) {
                        setSelectedSecondary([...selectedSecondary, v]);
                      }
                    }}
                  >
                    <SelectTrigger className="w-56">
                      <SelectValue placeholder="Select secondary tags" />
                    </SelectTrigger>

                    <SelectContent>
                      {secondaryTags.map((tag, idx) => (
                        <SelectItem key={idx} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <TagModal
                    triggerText="+ New Secondary"
                    onAdd={(tag) => {
                      setSecondaryTags([...secondaryTags, tag]);
                      setSelectedSecondary([...selectedSecondary, tag]);
                    }}
                  />
                </div>

                {/* Selected chips */}
                <div className="flex gap-2 flex-wrap">
                  {selectedSecondary.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="px-3 py-1 flex items-center gap-2 text-sm"
                    >
                      {tag}
                      <button
                        onClick={() =>
                          setSelectedSecondary(selectedSecondary.filter((t) => t !== tag))
                        }
                      >
                        ✕
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {loading ? (
            <div className="flex items-center justify-center w-full h-screen">
                <Loader size={40}/>
            </div>
        ) : (
            <div className="flex w-full">
                <div className={`overflow-y-auto transition-all duration-300 w-1/2 border-r border-gray-200`}>
                    <BlockEditor blocks={blocks} setBlocks={setBlocks} />
                </div>

                <div className="w-1/2 overflow-y-auto bg-white">
                    <MarkdownPreview markdown={markdown} />
                </div>
            </div>
        )}
    </div>
  );
}
