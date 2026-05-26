'use client';

import React, { useState } from 'react';
import HomeFilters from './HomeFilters';
import AnimeList from './AnimeList';

const HomeAnimeSection = () => {
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    year: '',
    type: ''
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="mt-6 md:mt-12">
      <HomeFilters onFilterChange={handleFilterChange} />
      <AnimeList title="Все Аниме" filters={filters} />
    </div>
  );
};

export default HomeAnimeSection;
