"use client";

import { useState } from 'react';
import BlogList from '@/components/BlogList';
import { Button } from '@/components/ui/button';
import { PlusIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { logout } from '@/lib/utils';

export default function Home() {
  const [page, setPage] = useState(1);
  const limit = 9;  
  const [totalCount, setTotalCount] = useState(0);   
  const [loading, setLoading] = useState(false);
  
  const hasMore = page * limit < totalCount;

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">
            Wokelo Blog Builder
          </h1>

          <div className='flex items-center justify-center gap-2'>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Link href="/editor/new" className="flex w-full gap-1 items-center">
                <PlusIcon />
                Create Blog
              </Link>
            </Button>

            <Button variant={"destructive"} onClick={logout} className={'cursor-pointer'}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <BlogList 
          page={page} 
          limit={limit} 
          setTotalCount={setTotalCount}
          setLoading={setLoading}
        />

        {hasMore && (
          <div className="flex justify-center mt-10">
            <Button
              onClick={loadMore}
              disabled={loading}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}