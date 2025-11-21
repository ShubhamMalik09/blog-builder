"use client";

import { useState } from 'react';
import BlogList from '@/components/BlogList';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { logout } from '@/lib/utils';

export default function Home() {
  const [page, setPage] = useState(1);
  const limit = 20;  
  const [ totalCount, setTotalCount ] = useState(0);   
  
  const hasNext = page * limit < totalCount;

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

            <Button variant={"destructive"} onClick={logout} className={' cursor-pointer'}>
              Logout
            </Button>

          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <BlogList page={page} limit={limit} setTotalCount={setTotalCount} />

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded-lg"
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            Page {page}
          </span>

          <Button
            variant="outline"
            disabled={!hasNext}
            onClick={() => setPage(page + 1)}
            className="rounded-lg"
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
}
