
import { getAllGumletExercises, getExercisesByPlaylist } from '@/services/eyeExerciseService';
import { useQuery } from '@tanstack/react-query';

export type ExerciseCardData = {
  title: string;
  image: string;
  videoUrl: string;
};

export function useExercises(playlistId?: string) {
  return useQuery<ExerciseCardData[], Error>({
    queryKey: playlistId ? ['gumletExercises', playlistId] : ['gumletExercises'],
    queryFn: async () => {
      const gumletData = playlistId 
        ? await getExercisesByPlaylist(playlistId)
        : await getAllGumletExercises();
      return gumletData.map((exercise) => ({
        title: exercise.title,
        image: exercise.thumbnailUrl,
        videoUrl: exercise.assetId,
      }));
    },
  });
}
