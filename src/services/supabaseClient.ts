import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hqyvbarhhhvjtmmzntvq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxeXZiYXJoaGh2anRtbXpudHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NTkwOTQsImV4cCI6MjA5NTMzNTA5NH0.XaSJTkeEiVLj8xdU12AppAdI65iao8waawfK_jb8JDw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
