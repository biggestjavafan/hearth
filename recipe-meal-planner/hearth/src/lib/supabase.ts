import { createClient } from '@supabase/supabase-js';

console.log('ALL ENV VARS:', import.meta.env);

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_API_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Anon Key:', supabaseAnonKey);
    throw new Error('Missing Supabase environment variables.');
  }

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


  