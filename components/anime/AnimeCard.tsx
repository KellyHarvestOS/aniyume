'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaPlay } from 'react-icons/fa';
import { Genre } from '@/types/anime'; 


interface AnimeCardProps {
  id: number;
  title: string;
  poster_url: string;
  rating: string;
  description?: string;
  year?: number;
  type?: string;
  genres?: Genre[] | { name: string }[] | string[];
}

const AnimeCard: React.FC<AnimeCardProps> = ({
  id,
  title,
  poster_url,
  rating,
  description,
  year,
  type,
  genres,
}) => {
  

  const genreList = Array.isArray(genres) 
    ? genres.slice(0, 3).map((g: any) => (typeof g === 'string' ? g : g.name))
    : [];

  return (
    <Link href={`/anime/${id}`} className="block group w-full max-w-60">
      <div 
        className="
          relative rounded-xl overflow-hidden bg-gray-200 aspect-2/3 
          transition-all duration-300 
          group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(33,208,184,0.4)]
          border-2 border-transparent group-hover:border-[#21D0B8]
          dark:bg-gray-900
        "
      >
     
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-black/50 border border-yellow-500/50 px-2 py-1 rounded-lg shadow-lg">
          <FaStar className="text-yellow-400 text-xs" />
          <span className="text-yellow-400 font-bold text-xs">{rating}</span>
        </div>

    
        <Image
          src={poster_url || '/placeholder.jpg'}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:blur-[3px] group-hover:scale-110"
          unoptimized
        />

     
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

     
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            
            <div className="flex gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-300">
              {year && <span className="bg-gray-700/80 px-2 py-0.5 rounded">{year}</span>}
              {type && <span className="bg-[#21D0B8]/20 text-[#21D0B8] px-2 py-0.5 rounded">{type}</span>}
            </div>

           
            {genreList.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {genreList.map((g, idx) => (
                  <span key={idx} className="text-[9px] border border-gray-500 text-gray-200 px-1.5 py-0.5 rounded-full bg-black/50">
                    {g}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-300 text-xs line-clamp-3 mb-3 leading-snug">
              {description ? description.replace(/<[^>]*>?/gm, '') : 'Нет описания...'}
            </p>

            <button className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg active:scale-95
            dark:text-gray-800">
              <FaPlay className="text-xs dark:text-gray-800" /> Смотреть
            </button>
          </div>
        </div>
      </div>

      <h3 className="mt-3 text-center font-bold text-gray-800 text-sm truncate group-hover:text-[#21D0B8] transition-colors px-1
      dark:text-gray-200">
        {title}
      </h3>
    </Link>
  );
};

export default AnimeCard;