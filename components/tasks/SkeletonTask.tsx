const SkeletonTask = () => (
  <div className="bg-[#1a1a1a]/40 p-5 rounded-2xl border border-white/5 animate-pulse h-[120px] w-full">
    <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
    <div className="h-3 bg-white/5 rounded w-1/2 mb-2"></div>
    <div className="flex justify-between mt-6">
      <div className="w-8 h-8 rounded-full bg-white/10"></div>
      <div className="w-12 h-4 bg-white/10 rounded"></div>
    </div>
  </div>
);

export default SkeletonTask;