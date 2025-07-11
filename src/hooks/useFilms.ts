
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Film } from "@/types/film";

export function useFilms() {
  return useQuery({
    queryKey: ['films'],
    queryFn: async (): Promise<Film[]> => {
      const { data, error } = await supabase
        .from('films')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Film[];
    }
  });
}

export function useUserFilms(userId: string | null) {
  return useQuery({
    queryKey: ['userFilms', userId],
    queryFn: async (): Promise<Film[]> => {
      if (!userId) return [] as Film[];
      
      const { data, error } = await supabase
        .from('films')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Film[];
    },
    enabled: !!userId
  });
}
