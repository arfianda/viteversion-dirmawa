import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hqyvbarhhhvjtmmzntvq.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxeXZiYXJoaGh2anRtbXpudHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NTkwOTQsImV4cCI6MjA5NTMzNTA5NH0.XaSJTkeEiVLj8xdU12AppAdI65iao8waawfK_jb8JDw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Fetching news...');
  const { data, error } = await supabase.from('student_news').select('*');
  if (error) {
    console.error('Fetch error:', error);
    return;
  }
  console.log('Fetched news count:', data.length);
  if (data.length > 0) {
    console.log('Sample news item:', data[0]);
    const testId = data[0].id;
    console.log(`Attempting to delete news item with ID: ${testId}`);
    const { error: deleteError } = await supabase.from('student_news').delete().eq('id', testId);
    if (deleteError) {
      console.error('Delete error:', deleteError);
    } else {
      console.log('Delete successful!');
    }
  } else {
    console.log('No news articles to test delete on.');
  }
}

run();
