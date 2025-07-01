import { supabase } from '$lib/supabase';

export async function getAllTables() {
    const { data, error } = await supabase
        .from('tables')
        .select('*');

    if (error) {
        console.error(error);
        return [];
    }

    return data ?? [];
}

export async function insertTable(Type: string) {
    const { data, error } = await supabase
        .from('tables')
        .insert([
            { Type }
        ]);

    if (error) {
        console.error(error);
        return null;
    }

    return data?.[0] ?? null;

}

export async function deleteTable(id: number) {
    const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', id);

    if (error) {
        console.error(error);
    }
}

export async function updateTable(id: number, Type: string) {
    const { error } = await supabase
        .from('tables')
        .update({ type: Type })
        .eq('id', id);

    if (error) {
        console.error(error);
    }
}

export async function getTableById(id: number) {
    const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    return data;
}

export async function getTableByType(type: string) {
    const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('type', type)
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    return data;
}