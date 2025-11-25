import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  )
}