"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Star = {
  slug: string;
  nameEn: string;
  nameCn: string;
  agency: string;
  bio?: string;
  tags: string[];
  chinaFanPriority?: number;
};

interface ArtistSearchProps {
  stars: Star[];
}

const COMPANY_ACCENT: Record<string, string> = {
  "GMMTV": "#f07030",
  "Cloud 9 Entertainment": "#f07030",
  "One31 / independent brand work": "#4a90d9",
  "DOMUNDI TV": "#9b6eff",
  "OPEN LABEL": "#4caf78",
  "BeOnCloud": "#f07030",
  "MEMINDY": "#e84040",
  "Studio Wabi Sabi": "#4a90d9",
  "Billkin Entertainment": "#f07030",
  "PP Krit Entertainment": "#4caf78",
  "CHANGE ARTIST": "#9b6eff",
};

export function ArtistSearch({ stars }: ArtistSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return stars.filter(
      (s) =>
        s.nameEn.toLowerCase().includes(q) ||
        s.nameCn.includes(q) ||
        (s.agency ?? "").toLowerCase().includes(q)
    );
  }, [stars, query]);

  const showResults = query.trim().length > 0;

  return (
    <div className="relative">
      <div className="flex items-center gap-3 rounded-[16px] border-2 border-[#e8e8e8] bg-white px-5 py-4 shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition-all focus-within:border-[#f07030] focus-within:shadow-[0_4px_20px_rgba(240,112,48,0.15)]">
        <span className="text-[20px] shrink-0">🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索艺人名字、公司…"
          className="flex-1 font-cn text-[15px] outline-none bg-transparent text-[#1c1c1e] placeholder:text-[#aeaeb2]"
        />
        {query && (
          <button onClick={() => setQuery("")} className="shrink-0 text-[#aeaeb2] hover:text-[#f07030] text-[20px] leading-none transition">×</button>
        )}
      </div>

      {showResults && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-[20px] border border-[#e8e8e8] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.15)] overflow-hidden">
          {results.length === 0 ? (
            <div className="p-6 text-center">
              <p className="font-cn text-[14px] text-[#6e6e73]">没有找到 &quot;{query}&quot;</p>
              <p className="font-cn text-[12px] text-[#aeaeb2] mt-1">试试英文名或公司名</p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <p className="font-cn text-[11px] text-[#aeaeb2] px-4 pt-3 pb-1">找到 {results.length} 位艺人</p>
              {results.map((star) => {
                const accent = COMPANY_ACCENT[star.agency] ?? "#f07030";
                return (
                  <Link key={star.slug} href={`/stars/${star.slug}`}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-[#fff4ee] transition border-b border-[#f5f5f5] last:border-b-0">
                    {/* Text initial avatar */}
                    <div className="flex h-[52px] w-[40px] shrink-0 items-center justify-center rounded-[12px] font-en text-[20px] font-black text-white"
                      style={{ background: `linear-gradient(135deg, #0f0f10, ${accent}55)` }}>
                      {star.nameEn.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-en text-[15px] font-bold text-[#1c1c1e]">{star.nameEn}</p>
                      <p className="font-cn text-[12px] text-[#6e6e73]">{star.nameCn}</p>
                      <span className="font-cn text-[10px] font-bold" style={{ color: accent }}>{star.agency}</span>
                    </div>
                    <span className="shrink-0 font-en text-[18px] text-[#aeaeb2]">›</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
