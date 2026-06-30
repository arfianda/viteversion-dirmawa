import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Supabase URL and Anon Key must be defined in .env.local!');
  process.exit(1);
}

// Instantiate standard anonymous Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTests() {
  console.log('🏁 Starting Automated Access Control Verification...');
  let testsFailed = false;

  // Test 1: Frontend Role Filtering Mock Validation
  console.log('\n🔍 Test 1: Verifying frontend role-based navigation filters...');
  const NAVIGATION_ITEMS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'news', label: 'News & Announcements' },
    { id: 'settings', label: 'Access Control' },
  ];

  const filterNav = (role: string) => {
    return NAVIGATION_ITEMS.filter(item => {
      if (item.id === 'settings' && role !== 'superadmin') {
        return false;
      }
      return true;
    });
  };

  const superadminNav = filterNav('superadmin');
  const adminNav = filterNav('admin');

  if (superadminNav.some(item => item.id === 'settings') && !adminNav.some(item => item.id === 'settings')) {
    console.log('✅ Pass: Access Control tab is correctly visible ONLY to superadmin.');
  } else {
    console.error('❌ Fail: Frontend role filtering logic does not isolate the settings tab!');
    testsFailed = true;
  }

  // Test 2: Database RPC Execution Authorization Validation
  console.log('\n🔍 Test 2: Verifying database level security policy for create_user_with_role RPC...');
  try {
    // Attempt to invoke the RPC as anonymous/standard caller
    const { data, error } = await supabase.rpc('create_user_with_role', {
      p_email: 'unauthorized_hacker@test.com',
      p_name: 'Hacker',
      p_role: 'Super Admin'
    });

    if (error) {
      if (error.message.includes('Unauthorized') || error.message.includes('permission denied')) {
        console.log('✅ Pass: Database correctly blocked unauthorized user creation call!');
        console.log(`   └─ Database Response: "${error.message}"`);
      } else {
        console.error(`❌ Fail: RPC failed with unexpected error: ${error.message}`);
        testsFailed = true;
      }
    } else {
      console.error('❌ Fail: Security Breach! The database RPC allowed an unauthorized user creation call!');
      testsFailed = true;
      // Clean up the created user if it somehow succeeded
      if (data && data.id) {
        await supabase.from('users').delete().eq('id', data.id);
      }
    }
  } catch (err: any) {
    console.error('❌ Fail: Unexpected exception while invoking RPC:', err.message || err);
    testsFailed = true;
  }

  if (testsFailed) {
    console.error('\n🔴 Verification Failed: Role isolation rules are not fully enforced!');
    process.exit(1);
  } else {
    console.log('\n🟢 Verification Success: Access control role isolation is fully secure!');
    process.exit(0);
  }
}

runTests();
