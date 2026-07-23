import React from 'react';

const PageSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse text-left">
      {/* Header title skeleton */}
      <div className="h-8 bg-slate-900 border border-slate-850 rounded-xl w-1/4"></div>
      
      {/* Body layout structures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left main area */}
        <div className="md:col-span-2 space-y-6">
          <div className="h-64 bg-slate-900/60 border border-slate-850/50 rounded-3xl w-full"></div>
          <div className="h-40 bg-slate-900/60 border border-slate-850/50 rounded-3xl w-full"></div>
        </div>
        {/* Right sidebar */}
        <div className="space-y-6">
          <div className="h-52 bg-slate-900/60 border border-slate-850/50 rounded-3xl w-full"></div>
          <div className="h-52 bg-slate-900/60 border border-slate-850/50 rounded-3xl w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
