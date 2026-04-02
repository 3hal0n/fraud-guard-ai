"use client";

import React from "react";

export default function Pagination({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
}: {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const makeRange = (start: number, end: number) => {
    const out = [] as number[];
    for (let i = start; i <= end; i++) out.push(i);
    return out;
  };

  const getWindow = () => {
    const maxButtons = 5;
    if (totalPages <= maxButtons) return makeRange(1, totalPages);
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = end - maxButtons + 1;
    }
    return makeRange(start, end);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-3 px-6 py-4 bg-[#121214] border-t border-white/5">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded text-sm ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "bg-white/3"}`}
      >
        Prev
      </button>

      <div className="flex items-center gap-2">
        {getWindow().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded text-sm ${p === currentPage ? "bg-cyan-500 text-black font-medium" : "bg-white/3"}`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded text-sm ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "bg-white/3"}`}
      >
        Next
      </button>

      <div className="ml-auto text-xs text-slate-400">Page {currentPage} / {totalPages}</div>
    </div>
  );
}
