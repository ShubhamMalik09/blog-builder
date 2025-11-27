"use client";

import { useEffect, useRef, useState } from "react";
import BlockEditor from "@/components/BlockEditor";
import { blocksToMarkdown } from "@/lib/markdown";
import MarkdownPreview from "@/components/MarkdownPreview";
import { Loader, Save, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import BlogDetails from "@/components/BlogDetails";
import { generateId } from "@/lib/utils";
import { archiveBlog, createBlog, publishBlog, unarchiveBlog, unpublishBlog, updateBlog } from "@/lib/api/blog";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import AutoSaveIndicator from "@/components/AutoSaveIndicator";

export default function BlogEditorPage({ initialBlocks, mode='new', initialTitle, initialCover, initialDescription, initialPrimaryTag, initialSecondayTags, id, is_published, is_archived, getBlogData, slug, setSlug}) {
  const router = useRouter();
  const { primaryTags, industries } = useSelector(state => state.tags);
  const [hydrated, setHydrated] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle || '');
  const [coverImage, setCoverImage] = useState(initialCover || null);
  const [description, setDescription] = useState(initialDescription || '');
  const [selectedPrimary, setSelectedPrimary] = useState(initialPrimaryTag || null);
  const [selectedSecondary, setSelectedSecondary] = useState(initialSecondayTags || []);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
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

  // Debounced save on changes
  useEffect(() => {
    if (mode !== "new") return;

    const timeoutId = setTimeout(() => {
      const draft = {
        title: titleRef.current,
        coverImage: coverRef.current,
        description: descRef.current,
        selectedPrimary: primaryRef.current,
        selectedSecondary: secondaryRef.current,
        blocks: blocksRef.current
      };

      const lastDraft = localStorage.getItem("blog-draft");
      const newDraft = JSON.stringify(draft);
      
      if (lastDraft !== newDraft) {
        localStorage.setItem("blog-draft", newDraft);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [mode, title, coverImage, description, selectedPrimary, selectedSecondary, blocks]);

  // Periodic backup every 60s
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

      const lastDraft = localStorage.getItem("blog-draft");
      const newDraft = JSON.stringify(draft);
      
      if (lastDraft !== newDraft) {
        localStorage.setItem("blog-draft", newDraft);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [mode]);

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
  }, [mode]);

  const publishHandler = async (id) => {
    try{
      setIsPublishing(true);
      const payload = {
        username : localStorage.getItem('username')
      }
      const res = await publishBlog(id, payload);
  
      if (!res?.data?.success) {
        toast.error("Failed to publish blog",{
          description: res.data?.error
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
          description: res.data?.error
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
          description: res.data?.error
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
          description: res.data?.error
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
    const missingFields = [];
    
    if (!title) missingFields.push('Title');
    if (!coverImage) missingFields.push('Cover Image');
    if (!description) missingFields.push('Description');
    if (!selectedPrimary?.id) missingFields.push('Primary Tag');
    if (!selectedSecondary || selectedSecondary?.length < 1) missingFields.push('Industries');

    if (missingFields.length > 1) {
      toast.error('Please fill all required details');
      return;
    }
    
    if (missingFields.length === 1) {
      const field = missingFields[0];
      if (field === 'Primary Tag' || field === 'Industries') {
        toast.error(`Please select ${field}`);
      } else {
        toast.error(`Please add ${field}`);
      }
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
      toast.success("Blog updated")
      if(setSlug && result.data.data.slug) {
          setSlug(result.data.data.slug);
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

  const isComplete = title && coverImage && description && selectedPrimary && selectedSecondary?.length > 0;

  if (!hydrated) return null; 
  return (
    <div className="flex flex-col w-full h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-xl bg-opacity-90">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-black cursor-pointer" onClick={() => router.push('/')}>
              Wokelo Blog Builder
            </h1>
            
            <div className="flex gap-3 items-center">
              {mode === "new" && <AutoSaveIndicator status={saveStatus} />}
              
              <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Settings className="w-4 h-4 mr-2" />
                    Details
                    {!isComplete && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto p-0">
                  <SheetHeader className="px-6 pt-6 pb-2">
                    <SheetTitle>Blog Details</SheetTitle>
                    <SheetDescription>
                      Configure your blog metadata and settings
                    </SheetDescription>
                  </SheetHeader>
                  <BlogDetails
                    title={title}
                    setTitle={setTitle}
                    coverImage={coverImage}
                    setCoverImage={setCoverImage}
                    description={description}
                    setDescription={setDescription}
                    selectedPrimary={selectedPrimary}
                    setSelectedPrimary={setSelectedPrimary}
                    selectedSecondary={selectedSecondary}
                    setSelectedSecondary={setSelectedSecondary}
                    primaryTags={primaryTags}
                    industries={industries}
                    mode={mode}
                  />
                </SheetContent>
              </Sheet>

              {mode === "new" ? (
                <Button
                  variant="destructive"
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
                <>
                  {is_archived ? (
                    <Button
                      onClick={() => unarchiveHandler(id)}
                      disabled={isArchiving || isPublishing || isSaving}
                      variant="outline"
                    >
                      {isArchiving ? "Unarchiving..." : "Unarchive"}
                    </Button>
                  ) : (
                    <>
                      {is_published ? (
                        <Button
                          disabled={isArchiving || isPublishing || isSaving}
                          onClick={() => unpublishHandler(id)}
                          variant="outline"
                        >
                          {isPublishing ? "Unpublishing..." : "Unpublish"}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => publishHandler(id)}
                          disabled={isArchiving || isPublishing || isSaving}
                          variant="outline"
                        >
                          {isPublishing ? "Publishing..." : "Publish"}
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => archiveHandler(id)}
                        disabled={isArchiving || isPublishing || isSaving}
                        variant="outline"
                      >
                        {isArchiving ? 'Archiving...' : 'Archive'}
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/blog/${slug}`)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </Button>
                </>
              )}
              
              <Button 
                onClick={handleSave} 
                disabled={isSaving || isPublishing || isArchiving}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Save className="w-4 h-4 mr-2" />
                {mode === 'new' ? (isSaving ? 'Creating...' : 'Create') : (isSaving ? 'Updating...': 'Update')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <Loader size={40}/>
        </div>
      ) : (
        <div className="flex w-full flex-1 overflow-hidden">
          <div className="w-1/2 overflow-y-auto border-r border-gray-200">
            <BlockEditor blocks={blocks} setBlocks={setBlocks} />
          </div>

          <div className="w-1/2 overflow-y-auto bg-white p-6">
            <div className="mb-6 pb-4 border-b border-gray-200">
              <p className="text-4xl font-bold text-center">{title || "Untitled Blog"}</p>
            </div>
            <MarkdownPreview markdown={markdown} />
          </div>
        </div>
      )}
    </div>
  );
}