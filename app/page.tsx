import AnimeCarousel from "@/components/anime/AnimeCarousel"; 
import HomeAnimeSection from "@/components/anime/HomeAnimeSection";

export default function HomePage() {
  return (
    <main className="m-0 p-0">
      <div className="m-0 p-0">
        <AnimeCarousel />
      </div>

      <HomeAnimeSection />
    </main>
  );
}