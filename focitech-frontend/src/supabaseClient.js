// Pehle line ko sahi karein
import { createClient } from '@supabase/supabase-js' // @supabase/supabase-client nahi likhna hai

const supabaseUrl = 'https://kbokxpkacamruyjispwa.supabase.co'
const supabaseAnonKey = 'sb_publishable_l-PhvCsy0Wu6nlRdTdivhQ_twoCZZiO'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)