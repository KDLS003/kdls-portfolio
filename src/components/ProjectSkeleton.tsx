export default function ProjectSkeleton() {
  return (
    <div className="relative card border border-transparent overflow-hidden bg-white/10 backdrop-blur-md shadow-lg animate-pulse">
      {/* Image skeleton */}
      <div className="rounded-lg mb-3 sm:mb-4 relative w-full aspect-[16/9] bg-gray-700/50" />
      
      {/* Title skeleton */}
      <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-2" />
      
      {/* Description skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-700/50 rounded w-full" />
        <div className="h-4 bg-gray-700/50 rounded w-5/6" />
      </div>
      
      {/* Tags skeleton */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-gray-700/50 rounded-full w-16" />
        <div className="h-6 bg-gray-700/50 rounded-full w-20" />
        <div className="h-6 bg-gray-700/50 rounded-full w-14" />
      </div>
      
      {/* Button skeleton */}
      <div className="h-10 bg-gray-700/50 rounded w-full" />
    </div>
  )
} 