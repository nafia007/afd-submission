
import { Film } from "@/types/film";
import FilmCard from "@/components/FilmCard";

interface FilmGridProps {
  films: Film[];
  isLoading: boolean;
  onMint: (film: Film) => Promise<void>;
  onDelete: (filmId: string) => Promise<void>;
  userProfile: { id: string; role: 'admin' | 'user' } | null;
}

const FilmGrid = ({ films, isLoading, onMint, onDelete, userProfile }: FilmGridProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading films...</div>;
  }

  if (!films || films.length === 0) {
    return <div className="text-center py-8">No films available at the moment.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {films.map((film) => (
        <FilmCard
          key={film.id}
          id={film.id}
          title={film.title}
          description={film.description || ""}
          price={film.price}
          director={film.director}
          videoUrl={film.video_url}
          onMint={() => onMint(film)}
          onDelete={userProfile?.role === 'admin' ? () => onDelete(film.id) : undefined}
        />
      ))}
    </div>
  );
};

export default FilmGrid;
