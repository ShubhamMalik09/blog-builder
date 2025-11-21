"use client";

import { useState } from 'react';
import BlogList from '@/components/BlogList';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [page, setPage] = useState(1);        // current page
  const [limit] = useState(10);              // blogs per page

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">
            Wokelo Blog Builder
          </h1>

          <Button className="bg-black text-white hover:bg-gray-800">
            <Link href="/editor/new" className="flex w-full gap-1 items-center">
              <PlusIcon />
              Create Blog
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <BlogList page={page} limit={limit} />

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
