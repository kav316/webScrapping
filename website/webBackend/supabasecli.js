import {createClient} from '@supabase/supabase-js';
require('dotenv').config();

const supabaseUrl= VITE_SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;
const supabase = createClient(supabaseUrl,supabaseKey);

export default supabase;