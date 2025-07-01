import { supabase } from '$lib/supabase';
import type { PageLoad } from './$types';

interface TableRow {
    id: number;
    type: string;
}

export const load: PageLoad = async () => {
    const {data, error} = await supabase
        .from('tables')
        .select('*')
        .order('id', { ascending: true });

        return {
            tables: data ?? [],
            error: error ? error.message : null 
        }
}
