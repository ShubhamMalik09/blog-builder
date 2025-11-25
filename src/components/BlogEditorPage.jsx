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
import ImageModal from "./ImageModal";
import { generateId } from "@/lib/utils";
import { archiveBlog, createBlog, publishBlog, unarchiveBlog, unpublishBlog, updateBlog } from "@/lib/api/blog";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner"

export default function BlogEditorPage({ initialBlocks, mode='new', initialTitle, initialCover, initialDescription, initialPrimaryTag, initialSecondayTags, id, is_published, is_archived, getBlogData}) {
  const isClient = typeof window !== "undefined";
  const router = useRouter()
  const { primaryTags, industries } = useSelector(state => state.tags);
  const [coverModal, setCoverModal] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [title, setTitle] = useState(initialTitle || '')
  const [coverImage, setCoverImage] = useState(initialCover || null);
  const [ description, setDescription ] = useState(initialDescription || '');
  const [selectedPrimary, setSelectedPrimary] = useState( initialPrimaryTag || null);
  const [selectedSecondary, setSelectedSecondary] = useState(initialSecondayTags || []);
  const [isSaving, setIsSaving] = useState(false);
  const [ isPublishing, setIsPublishing ] = useState(false);
  const [ isArchiving, setIsArchiving ] = useState(false);
  const [blocks, setBlocks] = useState(initialBlocks);
  const [loading, setLoading] = useState(true);
  const blocksRef = useRef(blocks);
  const titleRef = useRef(title);
  const coverRef = useRef(coverImage);
  const descRef = useRef(description);
  const primaryRef = useRef(selectedPrimary);
  const secondaryRef = useRef(selectedSecondary);

  const markdown = blocksToMarkdown(blocks);

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

  const publishHandler = async (id) => {
    try{
      setIsPublishing(true);
      const payload = {
        username : localStorage.getItem('username')
      }
      const res = await publishBlog(id, payload);
  
      if (!res?.data?.success) {
        toast.error("Failed to publish blog",{
          description: result.data?.error
        });
        return false;
      }
  
      toast.success("Blog published successfully");
      return true;
    } catch(error){
      toast.error('Error publishing blog', {
        description: error.message
      })
    } finally{
      await getBlogData();
      setIsPublishing(false);
    }
  };

  const unpublishHandler = async (id) => {
    try{
      setIsPublishing(true);
      const res = await unpublishBlog(id, { username: localStorage.getItem('username')});
    
      if (!res?.data?.success) {
        toast.error("Failed to unpublish blog",{
          description: result.data?.error
        });
        return false;
      }
    
      toast.success("Blog unpublished successfully");
      return true;
    } catch(err){
      toast.error('Error unpublishing blog', {
        description: (err.response?.data?.error || err.message )
      })
    } finally{
      await getBlogData();
      setIsPublishing(false);
    }
  };
  
  const archiveHandler = async (id) => {
    try{
      setIsArchiving(true);
      const res = await archiveBlog(id, { username: localStorage.getItem('username')});
  
      if (!res?.data?.success) {
        toast.error("Failed to archive blog",{
          description: result.data?.error
        });
        return false;
      }
  
      toast.success("Blog archived successfully");
      return true;
    } catch(err){
      toast.error('Error archiving blog', {
        description: (err.response?.data?.error || err.message )
      })
    } finally{
      await getBlogData();
      setIsArchiving(false);
    }
  };

  const unarchiveHandler = async (id) => {
    try{
      setIsArchiving(true);
      const res = await unarchiveBlog(id, { username: localStorage.getItem('username')});
      if (!res?.data?.success) {
        toast.error("Failed to unarchive blog",{
          description: result.data?.error
        });
        return false;
      }
  
      toast.success("Blog unarchived successfully");
      return true;
    } catch(err){
      toast.error('Error unarchiving blog', {
        description: (err.response?.data?.error || err.message )
      })
    } finally{
      await getBlogData();
      setIsArchiving(false);
    }
  };

  const handleSave = async() => {
    if(!selectedPrimary?.id){
      toast.error('Primary Tag is required');
      return;
    }
    if(!selectedSecondary || selectedSecondary?.length<1){
      toast.error("Industries is required");
      return;
    }
    if(!title){
      toast.error("Title is required");
      return;
    }
    if(!coverImage){
      toast.error("Cover Image is required");
      return;
    }
    if(!description){
      toast.error("Description is required");
      return;
    }
    setIsSaving(true)
    const markdown = blocksToMarkdown(blocks)

    const payload = {
      username: localStorage.getItem('username'),
      title: title || "",
      slug : title?.trim()?.toLowerCase()?.split(' ')?.join('-'),
      primary_tag_id:  selectedPrimary?.id || null,
      cover_image_url: coverImage || "",
      description: description || "",
      content_markdown: markdown,
      industry_ids: selectedSecondary.map(tag => tag?.id) || [],
    };

    if(mode=='new'){
      await handleCreateBlog(payload);
    } else{
      await handleUpdateBlog(payload, id);
    }

    return;
  }

  const handleCreateBlog = async(payload) =>{
    try{
      const result = await createBlog(payload)
      console.log(result.data);
      if(result.data.success){
        localStorage.removeItem("blog-draft");
        toast.success("Blog Created Successfully")
        router.push(`/editor/${result.data.data.id}`)
      }
      else{
        toast.error('Unable to create blog', {
          description: result.data.error
        })
        console.log('unable to save result', result.data.error);
      }
    } catch(err){
      toast.error('Unable to create blog', {
        description: (err.response?.data?.error || err.message )
      })
      console.log('unable to save result ', err);
    } finally{
      setIsSaving(false);
    }
  }

  const handleUpdateBlog = async(payload, id) => {
    try{
      const result = await updateBlog(id,payload);
      if(result.data.success){
        toast.success('Blog Updated Successfully')
      }
      else{
        toast.error('Unable to update blog', {
          description: result.data.error
        })
      }
    } catch (err){
      toast.error('Unable to update blog', {
        description: (err.response?.data?.error || err.message )
      })
      console.log('error updating blog', err);
    } finally{
      setIsSaving(false);
    }
  }

  if (!hydrated) return null; 
  return (
    <div className="flex flex-col w-full p-2">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-xl bg-opacity-90 w-full">
            <div className="w-full py-3">
                <div className="grid grid-cols-3 items-center justify-center mb-3 px-3 w-full">
                  <h1 className="text-2xl font-bold text-black flex w-full items-center justify-start">
                    <span className="cursor-pointer" onClick={()=>router.push('/')}>Wokelo Blog Builder</span>
                  </h1>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 w-full justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Live Preview
                  </h2>
                  <div className="flex gap-3 w-full items-center justify-end">
                    {mode === "new" ? (
                      <Button
                        className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:shadow-lg hover:bg-red-600 cursor-pointer transition-all"
                        onClick={() => {
                          if (confirm("Discard all changes? This cannot be undone.")) {
                            localStorage.removeItem("blog-draft");
                            setTitle("");
                            setCoverImage(null);
                            setDescription("");
                            setSelectedPrimary(null);
                            setSelectedSecondary([]);
                            setBlocks([
                              { id: generateId(), type: "heading1", content: "" },
                              { id: generateId(), type: "paragraph", content: "" }
                            ]);
                            toast.success("Draft discarded");
                          }
                        }}
                      >
                        Discard
                      </Button>
                    ) : (
                      <div className="flex gap-1">
                        {is_archived ? (
                          <button
                            onClick={() => unarchiveHandler(id)}
                            disabled={isArchiving || isPublishing || isSaving}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            {isArchiving ? "Unarchiving..." : "Unarchive"}
                          </button>
                        ) : (
                          <>
                            {is_published ? (
                              <>
                                <button
                                  disabled={isArchiving || isPublishing || isSaving}
                                  onClick={() => unpublishHandler(id)}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                                >
                                  { isPublishing ? "Unpublishing..." : "Unpublish"}
                                </button>

                                <button
                                  onClick={() => archiveHandler(id)}
                                  disabled={isArchiving || isPublishing || isSaving}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  {isArchiving ? "Archiving..." : "Archive"}
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => publishHandler(id)}
                                  disabled={isArchiving || isPublishing || isSaving}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                  { isPublishing ? "Publishing..." : "Publish"}
                                </button>

                                <button
                                  onClick={() => archiveHandler(id)}
                                  disabled={isArchiving || isPublishing || isSaving}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  { isArchiving ? 'Archiving...' : 'Archive'}
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    <Button className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:shadow-lg hover:bg-gray-800 cursor-pointer transition-all flex items-center gap-2 disabled:opacity-50" onClick={handleSave} disabled={isSaving || isPublishing || isArchiving}>
                      <Save className="w-4 h-4" />
                      {
                        mode === 'new' ? (
                          isSaving ? 'Creating...' : 'Create'
                        ) : (
                          isSaving ? 'Updating...': 'Update'
                        )
                      }
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
              <ImageModal
                open={coverModal}
                onClose={() => setCoverModal(false)}
                onSelect={(url) => setCoverImage(url)}
              />
              {hydrated && coverImage ? (
                <div className="relative w-full h-20">
                  <img
                    src={ isClient ? coverImage : ""}
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
                <div
                  onClick={() => setCoverModal(true)}
                  className="w-full h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  <span className="font-medium">Add Cover Image</span>
                </div>
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
                  <Select value={selectedPrimary} onValueChange={(v) => setSelectedPrimary(v)}>
                    <SelectTrigger className="w-56">
                      <SelectValue placeholder="Select a primary tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {primaryTags.map((tag, idx) => (
                        <SelectItem key={idx} value={tag}>
                          {tag?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* <TagModal
                    triggerText="+ New Primary"
                    onAdd={(tag) => {
                      setPrimaryTags([...primaryTags, tag]);
                      setSelectedPrimary(tag);
                    }}
                  /> */}
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
                      {industries.map((tag, idx) => (
                        <SelectItem key={idx} value={tag}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* <TagModal
                    triggerText="+ New Secondary"
                    onAdd={(tag) => {
                      setSecondaryTags([...secondaryTags, tag]);
                      setSelectedSecondary([...selectedSecondary, tag]);
                    }}
                  /> */}
                </div>

                {/* Selected chips */}
                <div className="flex gap-2 flex-wrap">
                  {selectedSecondary.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="px-3 py-1 flex items-center gap-2 text-sm"
                    >
                      {tag.name}
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
                   <div className="mb-6 pb-4 border-b border-gray-200">
                      <p className="text-4xl font-bold mt-1 text-center">{title}</p>
                    </div>
                    <MarkdownPreview markdown={markdown} />
                </div>
            </div>
        )}
    </div>
  );
}
