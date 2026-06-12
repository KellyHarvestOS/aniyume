'use client';

import AnimeList from './AnimeList';
import { useI18n } from '@/contexts/I18nContext';

const HomeAnimeSection = () => {
  const { t } = useI18n();
  return (
    <div className="mt-6 md:mt-12">
      <AnimeList title={t('home.allAnime')} />
    </div>
  );
};

export default HomeAnimeSection;
