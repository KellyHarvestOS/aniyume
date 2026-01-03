'use client';

import Slider, { Settings } from "react-slick";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import CarouselSkeleton from '@/components/skeletons/CarouselSkeleton';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

interface AnimeItem {
  id: number;
  title: string;
  poster_url: string;
}

const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const CACHE_KEY = 'aniyume_featured_newest';
const CACHE_DURATION = 1000 * 60 * 30;

const TickerCard = ({ anime }: { anime: AnimeItem }) => (
  <div className="px-2 outline-none">
    <Link href={`/anime/${anime.id}`}>
      <div className="relative aspect-video rounded-md md:rounded-2xl overflow-hidden cursor-pointer group border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-[#111111] shadow-xl dark:shadow-2xl transition-all duration-500 hover:border-[#39bcba]/30">
        <img
          src={anime.poster_url}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-5 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <h3 className="text-white font-black text-xs md:text-sm uppercase tracking-tight line-clamp-1 group-hover:text-[#39bcba]">
            {anime.title}
          </h3>
        </div>
      </div>
    </Link>
  </div>
);

export default function FeaturedNewestRows() {
  const [allAnime, setAllAnime] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewest = async () => {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setAllAnime(data);
          setLoading(false);
          return;
        }
      }

      try {
        const [p1, p2] = await Promise.all([
          fetch('/api/external/anime?sort=newest&page=1').then(r => r.json()),
          fetch('/api/external/anime?sort=newest&page=2').then(r => r.json()),
        ]);
        const combined = [...(p1.data || []), ...(p2.data || [])];
        const shuffled = shuffleArray(combined);
        
        setAllAnime(shuffled);
        
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
          data: shuffled,
          timestamp: Date.now()
        }));

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewest();
  }, []);

  const rows = useMemo(() => {
    return {
      row1: allAnime.slice(0, 20),
      row2: allAnime.slice(20, 40),
    };
  }, [allAnime]);

  const baseSettings: Settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 4.5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: false,
    draggable: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3.5 } },
      { breakpoint: 768, settings: { slidesToShow: 2.2 } },
      { breakpoint: 480, settings: { slidesToShow: 1.5 } }
    ]
  };

  if (loading) return <CarouselSkeleton />;

  return (
    <div className="w-full bg-white dark:bg-[#111111] py-1 overflow-hidden flex flex-col gap-6 relative transition-colors duration-300">

      <div className="container mx-auto px-6 md:px-16 mb-4 relative">
        <div />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-12 bg-[#39bcba] rounded-full" />
            <span className="text-[10px] font-black text-[#39bcba] uppercase tracking-[0.4em]">
             ВаШ сайт AniYume
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
            Новинки <span className="text-gray-500 dark:text-gray-600">сезона</span>
          </h2>
          
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium max-w-md leading-relaxed">
            Самые ожидаемые релизы этого года уже доступны на AniYume. 
            Смотрите первыми в высоком качестве.
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className="w-[110%] -ml-[2%]">
          <Slider {...baseSettings} speed={12000}>
            {rows.row1.map((anime) => (
              <TickerCard key={`row1-${anime.id}`} anime={anime} />
            ))}
          </Slider>
        </div>

        <div className="w-[115%] -ml-[8%]">
          <Slider {...baseSettings} speed={15000}>
            {rows.row2.map((anime) => (
              <TickerCard key={`row2-${anime.id}`} anime={anime} />
            ))}
          </Slider>
        </div>
      </div>

      <style jsx global>{`
        .slick-track {
          display: flex !important;
          transition-timing-function: linear !important;
        }
        .slick-list {
          overflow: visible !important;
        }
      `}</style>
    </div>
  );
}