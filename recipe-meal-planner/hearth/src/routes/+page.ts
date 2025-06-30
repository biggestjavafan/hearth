import { supabase } from '$lib/supabase';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*');

  return {
    recipes: data ?? [],
    error: error?.message ?? null
  };
};