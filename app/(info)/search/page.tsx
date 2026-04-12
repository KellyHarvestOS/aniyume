'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaSadCry, FaChevronLeft, FaChevronRight, FaPlay, FaStar } from "react-icons/fa";
import AnimeCardSkeleton from "@/components/skeletons/AnimeCardSkeleton";
import { AnimeDetails } from "@/types/anime";

const PageButton = ({
  page,
  active,
  onClick,
}: {
  page: number;
  active: boolean;
  onClick: (p: number) => void;
}) => (
  <button
    onClick={() => onClick(page)}
    className={`
      w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-200
      ${
        active
          ? "bg-[#21D0B8] text-white shadow-lg shadow-teal-500/30 scale-110"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:text-[#21D0B8]"
      }
    `}
  >
    {page}
  </button>
);

function AnimeCard({ anime }: { anime: AnimeDetails }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/anime/${anime.id}`}
      className="group flex flex-col gap-3 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-2/3 bg-gray-200 dark:bg-[#161616] rounded-lg overflow-hidden shadow-md transition-all duration-300 ring-2 ring-transparent group-hover:ring-[#21D0B8]">
        <img
          src={anime.poster_url || "/placeholder.jpg"}
          alt={anime.title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? "scale-110 blur-[2px]" : "scale-100"
          }`}
        />

        <div className="absolute top-3 left-3 bg-[#111111]/80 border border-amber-500/30 p-1.5 rounded-lg shadow-lg z-20">
          <FaStar className="text-amber-400 text-xs" />
        </div>

        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col justify-end p-4 transition-opacity duration-300 z-10 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex gap-2 mb-3">
            <span className="bg-gray-700/80 text-white text-[10px] px-2 py-0.5 rounded font-bold">
              {anime.year || "2025"}
            </span>
            <span className="bg-[#21D0B8]/30 text-[#21D0B8] border border-[#21D0B8]/30 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
              {anime.type || "TV"}
            </span>
          </div>

          <p className="text-white text-[11px] leading-relaxed line-clamp-4 mb-4 font-medium opacity-90">
            {(anime as any).description || "Описание временно отсутствует..."}
          </p>

          <div className="w-full bg-[#21D0B8] hover:bg-[#1bb8a3] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg">
            <FaPlay className="text-[10px]" />
            <span className="text-sm font-bold">Смотреть</span>
          </div>
        </div>
      </div>

      <div className="px-1 text-center">
        <h3
          className={`font-bold text-sm line-clamp-1 transition-colors duration-300 ${
            isHovered ? "text-[#21D0B8]" : "text-gray-900 dark:text-gray-200"
          }`}
        >
          {anime.title}
        </h3>
      </div>
    </Link>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const [results, setResults] = useState<AnimeDetails[]>([]);
  const [pagination, setPagination] = useState({ current: 1, last: 1 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/external/public/anime?search=${encodeURIComponent(query)}&page=${page}`
        );
        const json = await res.json();
        setResults(json.data || []);
        setPagination({
          current: json.meta?.current_page || 1,
          last: json.meta?.last_page || 1,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (query) fetchData();
  }, [query, page]);

  const handlePageChange = (p: number) => {
    router.push(`/search?q=${encodeURIComponent(query)}&page=${p}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 md:px-12 py-10">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black text-gray-900 dark:text-gray-200 uppercase tracking-tight">
          Поиск: <span className="text-[#21D0B8]">«{query}»</span>
        </h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {results.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-16 mb-10">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 text-gray-400 hover:text-[#21D0B8] disabled:opacity-0 transition-all"
            >
              <FaChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: pagination.last }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === pagination.last ||
                    (p >= page - 2 && p <= page + 2)
                )
                .map((p, index, array) => (
                  <div key={p} className="flex gap-2">
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="text-gray-500 self-end">…</span>
                    )}
                    <PageButton
                      page={p}
                      active={page === p}
                      onClick={handlePageChange}
                    />
                  </div>
                ))}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.last}
              className="p-2 text-gray-400 hover:text-[#21D0B8] disabled:opacity-0 transition-all"
            >
              <FaChevronRight size={20} />
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
          <FaSadCry size={80} className="mb-4 opacity-20" />
          <p className="text-xl font-medium">Ничего не найдено</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#111111] transition-colors">
      <Suspense fallback={null}>
        <SearchContent />
      </Suspense>
    </main>
  );
}
