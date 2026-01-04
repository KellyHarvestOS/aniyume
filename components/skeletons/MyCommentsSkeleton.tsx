import React from 'react';

const CommentCardSkeleton = () => (
  <div className="rounded-3xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#161616] overflow-hidden animate-pulse shadow-sm">
    <div className="p-5 flex gap-4 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/10">
      <div className="w-16 h-24 rounded-xl bg-slate-200 dark:bg-white/10 shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="h-4 w-3/4 bg-slate-200 dark:bg-white/10 rounded-lg" />
          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/10 shrink-0" />
        </div>
        <div className="h-3 w-24 bg-slate-200 dark:bg-white/10 rounded-lg mt-3" />
      </div>
    </div>

    <div className="p-5 space-y-3">
      <div className="h-3 w-full bg-slate-200 dark:bg-white/10 rounded-lg" />
      <div className="h-3 w-5/6 bg-slate-200 dark:bg-white/10 rounded-lg" />
      <div className="h-3 w-2/3 bg-slate-200 dark:bg-white/10 rounded-lg" />
    </div>

    <div className="border-t border-slate-200 dark:border-white/5 py-3 flex justify-center">
      <div className="h-3 w-28 bg-slate-200 dark:bg-white/10 rounded-lg" />
    </div>
  </div>
);

export default function MyCommentsSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111111] transition-colors">
      <header className="border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 w-16 h-16 animate-pulse" />
          <div className="space-y-3">
            <div className="h-8 w-48 md:w-64 bg-slate-200 dark:bg-white/5 rounded-xl animate-pulse" />
            <div className="h-3 w-24 bg-slate-200 dark:bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>

      <div className="h-14 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="h-3 w-32 bg-slate-200 dark:bg-white/5 rounded-lg animate-pulse" />
          <div className="h-6 w-10 bg-slate-200 dark:bg-white/5 rounded-full animate-pulse" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CommentCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
