const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Logging in as superadmin...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'arfiandafirsta@gmail.com',
    password: 'password123'
  });

  if (authError) {
    console.error('Auth error:', authError);
    return;
  }

  console.log('Login successful! Token:', authData.session.access_token.substring(0, 10) + '...');

  console.log('Testing verifyPhysicalReceipt with PRP-1000...');
  try {
    const { data, error } = await supabase
      .from('ormawa_proposals')
      .update({
        physical_received: true,
        updated_at: new Date().toISOString()
      })
      .eq('submission_code', 'PRP-1000')
      .select(`
        *,
        ukms (
          name
        )
      `);

    console.log('Error:', error);
    console.log('Data:', data);
  } catch (err) {
    console.error('Catch error:', err);
  }
}

run();
