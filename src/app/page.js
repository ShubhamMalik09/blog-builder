"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import BlogList from '@/components/BlogList';
import BlogFilters from '@/components/BlogFilters';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { logout } from '@/lib/utils';

export default function Home() {
  const [page, setPage] = useState(1);
  const limit = 9;  
  const [totalCount, setTotalCount] = useState(0);   
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: null,
    primary_tag_id: null,
    industry_id: null,
    search: '',
    sort_by: 'updated_at',
    sort_order: 'desc'
  });
  const observerTarget = useRef(null);
  
  const hasMore = page * limit < totalCount;

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({
      status: null,
      primary_tag_id: null,
      industry_id: null,
      search: '',
      sort_by: 'updated_at',
      sort_order: 'desc'
    });
    setPage(1);
  };

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore]);

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
        <BlogFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        <BlogList 
          page={page} 
          limit={limit}
          filters={filters}
          setTotalCount={setTotalCount}
          setLoading={setLoading}
          setInitialLoading={setInitialLoading}
        />

        {loading && !initialLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6 space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && <div ref={observerTarget} className="h-4" />}
      </main>
    </div>
  );
}