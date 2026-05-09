import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://diyjeekwwwudiommdxbm.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpeWplZWt3d3d1ZGlvbW1keGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NjUyNzIsImV4cCI6MjA5MzU0MTI3Mn0.LPQb5SIj6xOwhmGoAe1J6VpcbsLNByoonu-iwjWy_5Y';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
