// import BlogList from '@/components/BlogList'
import BlogList from '@/components/BlogList'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">
            Wokelo Blog Builder
          </h1>
          <Button className={` bg-black text-white hover:cursor-pointer hover:bg-gray-800`}>
            <Link href={'/editor/new'} className='flex w-full gap-1 items-center'>
              <PlusIcon/>
              Create Blog
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <BlogList />
      </main>
    </div>
  )
}