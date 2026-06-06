'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaHeart, FaRegHeart } from 'react-icons/fa';

interface AnimeActionsProps {
  animeId: number;
  initialFavCount?: number;
}

const STATUS_MAP: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  not_watching: {
    label: 'Не смотрю',
    color: 'bg-[#303030]  hover:bg-[#1a202c] text-white',
    dot: 'bg-gray-400',
  },
  watching: {
    label: 'Смотрю',
    color: 'bg-green-500 hover:bg-green-600 text-white',
    dot: 'bg-green-500',
  },
  planned: {
    label: 'В планах',
    color: 'bg-purple-500 hover:bg-purple-600 text-white',
    dot: 'bg-purple-500',
  },
  completed: {
    label: 'Просмотрено',
    color: 'bg-blue-500 hover:bg-blue-600 text-white',
    dot: 'bg-blue-500',
  },
  on_hold: {
    label: 'Отложено',
    color: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    dot: 'bg-yellow-500',
  },
  dropped: {
    label: 'Брошено',
    color: 'bg-red-500 hover:bg-red-600 text-white',
    dot: 'bg-red-500',
  },
};

export default function AnimeActions({
  animeId,
  initialFavCount = 0,
}: AnimeActionsProps) {
  const [status, setStatus] = useState<string>('not_watching');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favCount, setFavCount] = useState(initialFavCount);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const API_BASE = '/api/external';

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token || !animeId) return;

    const fetchData = async () => {
      try {
        const statusRes = await fetch(
          `${API_BASE}/anime/${animeId}/user-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );

        if (statusRes.ok) {
          const data = await statusRes.json();
          const serverStatus =
            data?.status || data?.data?.status;
          if (serverStatus) setStatus(serverStatus);
        } else {
          setStatus('not_watching');
        }

        const favRes = await fetch(
          `${API_BASE}/favorites/${animeId}/check`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (favRes.ok) {
          const data = await favRes.json();
          setIsFavorite(data.is_favorite);
        }
      } catch {}
    };

    fetchData();
  }, [animeId]);

  const handleStatusChange = async (newStatus: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) return alert('Нужна авторизация');

    const previousStatus = status;
    setStatus(newStatus);
    setIsOpen(false);

    try {
      const res = await fetch(
        `${API_BASE}/anime/${animeId}/status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        setStatus(previousStatus);
      }
    } catch {
      setStatus(previousStatus);
    }
  };

  const toggleFavorite = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return alert('Нужна авторизация');

    try {
      const res = await fetch(
        isFavorite
          ? `${API_BASE}/favorites/${animeId}`
          : `${API_BASE}/favorites`,
        {
          method: isFavorite ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: isFavorite
            ? undefined
            : JSON.stringify({ anime_id: animeId }),
        }
      );

      if (res.ok) {
        setIsFavorite(!isFavorite);
        setFavCount((c) =>
          isFavorite ? Math.max(0, c - 1) : c + 1
        );
      }
    } catch {}
  };

  const activeStyle =
    STATUS_MAP[status] || STATUS_MAP.not_watching;

  return (
    <div className="flex items-center gap-3" ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${activeStyle.color} px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-between gap-3 min-w-[180px] transition-all shadow-md`}
        >
          <span>{activeStyle.label}</span>
          <FaChevronDown
            className={`transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
            {Object.entries(STATUS_MAP).map(([key, val]) => (
              <button
                key={key}
                onClick={() => handleStatusChange(key)}
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b last:border-0"
              >
                <span
                  className={`w-2 h-2 rounded-full ${val.dot}`}
                />
                {val.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={toggleFavorite}
        className={`flex items-center gap-2 px-4 py-3 rounded-full border font-bold text-2xl transition-all shadow-sm ${
          isFavorite
            ? 'border-pink-200 bg-pink-50 text-red-600'
            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        {isFavorite ? <FaHeart /> : <FaRegHeart />}
      </button>
    </div>
  );
}
