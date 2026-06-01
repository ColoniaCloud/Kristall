export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F2F2F0] animate-pulse">
      {/* Hero skeleton */}
      <div className="h-[56vh] bg-[#E4E4E2]" />

      {/* Stats row skeleton */}
      <div className="bg-white border-b border-[#E4E4E2] h-16" />

      {/* Content skeleton */}
      <div className="px-6 py-10 max-w-[1160px] mx-auto">
        <div className="h-3 bg-[#E4E4E2] rounded w-24 mb-4" />
        <div className="h-7 bg-[#E4E4E2] rounded w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <div className="h-56 bg-[#E4E4E2] rounded-xl" />
          <div className="h-56 bg-[#E4E4E2] rounded-xl" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-[#E4E4E2] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
