// @ts-nocheck
// Follows: https://supabase.com/docs/guides/functions/typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface RegistrationRequest {
  id: string;
  nim: string;
  name: string;
  email: string;
  password: string;
  major: string;
  faculty: string;
  semester: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Validate auth
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: "Unauthorized: Missing or invalid Authorization header" }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const supabaseKey = authHeader.split(' ')[1];
  const expectedKey = Deno.env.get('SUPABASE_ANON_KEY');
  const legacyKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxeXZiYXJoaGh2anRtbXpudHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NTkwOTQsImV4cCI6MjA5NTMzNTA5NH0.XaSJTkeEiVLj8xdU12AppAdI65iao8waawfK_jb8JDw";

  if (supabaseKey !== expectedKey && supabaseKey !== legacyKey) {
    return new Response(JSON.stringify({ error: "Unauthorized: Invalid API key" }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Parse input
  let request: { id: string; admin_id: string };
  try {
    request = await req.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (!request.id || !request.admin_id) {
    return new Response(JSON.stringify({ error: "Missing 'id' or 'admin_id'" }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Fetch Supabase client
  const supabaseAdminUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAdminKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseAdminUrl || !supabaseAdminKey) {
    throw new Error('Supabase URL or Service Role Key not configured');
  }
  const { createClient } = await import("npm:@supabase/supabase-js@2");
  const supabase = createClient(supabaseAdminUrl, supabaseAdminKey);

  // Fetch registration request
  const { data: requestData, error: fetchError } = await supabase
    .from('registration_requests')
    .select('*')
    .eq('id', request.id)
    .maybeSingle();
  if (fetchError) {
    return new Response(JSON.stringify({ error: `Failed to fetch request: ${fetchError.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (!requestData) {
    return new Response(JSON.stringify({ error: "Registration request not found" }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (requestData.status !== 'pending') {
    return new Response(JSON.stringify({ error: "Request is not pending approval" }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const reqData: RegistrationRequest = {
    id: requestData.id,
    nim: requestData.nim,
    name: requestData.name,
    email: requestData.email,
    password: requestData.password,
    major: requestData.major,
    faculty: requestData.faculty,
    semester: requestData.semester,
  };

  // Begin transaction
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: reqData.email,
    password: reqData.password,
    email_confirm: true,
    user_metadata: { nim: reqData.nim, role: 'mahasiswa' },
  });
  if (authError || !authUser.user) {
    return new Response(JSON.stringify({ error: `Auth creation failed: ${authError?.message || 'No user returned'}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Insert into public.users
  const { error: userError } = await supabase
    .from('users')
    .insert({
      id: authUser.user.id,
      name: reqData.name,
      email: reqData.email,
      role: 'mahasiswa',
      created_at: new Date().toISOString(),
    });
  if (userError) {
    // Rollback auth user
    await supabase.auth.admin.deleteUser(authUser.user.id);
    return new Response(JSON.stringify({ error: `User insertion failed: ${userError.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Insert into mahasiswa_profiles
  const { error: profileError } = await supabase
    .from('mahasiswa_profiles')
    .insert({
      user_id: authUser.user.id,
      nim: reqData.nim,
      major: reqData.major,
      faculty: reqData.faculty,
      semester: reqData.semester,
      created_at: new Date().toISOString(),
    });
  if (profileError) {
    // Rollback auth user and public.users
    await supabase.auth.admin.deleteUser(authUser.user.id);
    await supabase.from('users').delete().eq('id', authUser.user.id);
    return new Response(JSON.stringify({ error: `Profile insertion failed: ${profileError.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Update registration_requests
  const { error: requestError } = await supabase
    .from('registration_requests')
    .update({
      status: 'approved',
      reviewed_by: request.admin_id,
      reviewed_at: new Date().toISOString(),
      password: null // Clear password after approval
    })
    .eq('id', reqData.id);
  if (requestError) {
    // Rollback auth user, public.users, and mahasiswa_profiles
    await supabase.auth.admin.deleteUser(authUser.user.id);
    await supabase.from('users').delete().eq('id', authUser.user.id);
    await supabase.from('mahasiswa_profiles').delete().eq('user_id', authUser.user.id);
    return new Response(JSON.stringify({ error: `Request update failed: ${requestError.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Success
  return new Response(JSON.stringify({
    status: "success",
    authUserId: authUser.user.id,
    message: "Registration approved successfully",
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});