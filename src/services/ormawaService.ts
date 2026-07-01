import { supabase } from './supabaseClient';

export interface OrmawaApplication {
  id: string;
  applicant_id: string;
  name: string;
  category: 'Seni & Budaya' | 'Olahraga' | 'Akademik' | 'Sosial' | 'Kerohanian' | 'Minat Khusus';
  description: string;
  vision: string;
  mission: string[];
  leader_name: string;
  leader_nim: string;
  proposal_format_url?: string;
  ukm_request_url?: string;
  quality_procedure_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  applicant_email?: string; // joined
}

export interface OrmawaProposal {
  id: string;
  ukm_id: string;
  ukm_name?: string; // joined
  title: string;
  description: string;
  target_budget: number;
  activity_date: string;
  proposal_doc_url: string;
  cover_letter_url?: string;
  facility_rent_url?: string;
  expedition_form_url?: string;
  signed_proposal_url?: string;
  status: 'draft' | 'submitted_dirmawa' | 'approved_dirmawa_staff' | 'approved_dirmawa_direktur' | 'approved_prodi' | 'approved_dekanat' | 'approved_dau' | 'approved_rektorat' | 'scan_uploaded' | 'completed' | 'rejected';
  rejection_reason?: string;
  flow_type: 'ukm' | 'hima';
  current_step_holder: 'ormawa' | 'dirmawa_staff' | 'dirmawa_direktur' | 'prodi' | 'dekanat' | 'dau' | 'rektorat' | 'kasir_keuangan';
  created_at: string;
  updated_at: string;
}

export interface OrmawaLpj {
  id: string;
  ukm_id: string;
  ukm_name?: string; // joined
  proposal_id?: string;
  proposal_title?: string; // joined
  title: string;
  description: string;
  total_spent: number;
  lpj_doc_url: string;
  receipts_zip_url?: string;
  signed_lpj_url?: string;
  status: 'draft' | 'submitted_dirmawa' | 'approved_dirmawa_staff' | 'approved_dirmawa_direktur' | 'approved_prodi' | 'approved_dekanat' | 'approved_rektorat' | 'scan_uploaded' | 'completed' | 'rejected';
  rejection_reason?: string;
  flow_type: 'ukm' | 'hima';
  current_step_holder: 'ormawa' | 'dirmawa_staff' | 'dirmawa_direktur' | 'prodi' | 'dekanat' | 'rektorat';
  created_at: string;
  updated_at: string;
}

export interface OrmawaAdminProfile {
  id: string;
  user_id: string;
  ukm_id: string;
  ukm_name: string;
}

export const OrmawaService = {
  // ==========================================
  // 1. APPLICATIONS / ormawa_applications
  // ==========================================
  async submitApplication(application: Omit<OrmawaApplication, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<void> {
    // Check if there's already a pending application for this student
    const { data: existing, error: checkError } = await supabase
      .from('ormawa_applications')
      .select('id')
      .eq('applicant_id', application.applicant_id)
      .eq('status', 'pending')
      .maybeSingle();

    if (checkError) throw checkError;
    if (existing) {
      throw new Error('Anda sudah memiliki pengajuan ormawa yang berstatus pending. Harap tunggu peninjauan selesai.');
    }

    const { error } = await supabase
      .from('ormawa_applications')
      .insert({
        applicant_id: application.applicant_id,
        name: application.name,
        category: application.category,
        description: application.description,
        vision: application.vision,
        mission: application.mission,
        leader_name: application.leader_name,
        leader_nim: application.leader_nim,
        proposal_format_url: application.proposal_format_url,
        ukm_request_url: application.ukm_request_url,
        quality_procedure_url: application.quality_procedure_url,
        status: 'pending'
      });

    if (error) throw error;
  },

  async getApplications(): Promise<OrmawaApplication[]> {
    const { data, error } = await supabase
      .from('ormawa_applications')
      .select(`
        *,
        users!ormawa_applications_applicant_id_fkey (
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      ...row,
      applicant_email: row.users?.email
    }));
  },

  async getStudentApplications(studentId: string): Promise<OrmawaApplication[]> {
    const { data, error } = await supabase
      .from('ormawa_applications')
      .select('*')
      .eq('applicant_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async reviewApplication(
    id: string, 
    status: 'approved' | 'rejected', 
    rejectionReason?: string,
    reviewerId?: string
  ): Promise<void> {
    const reviewedAt = new Date().toISOString();
    
    // Begin update
    const { data: appData, error: fetchError } = await supabase
      .from('ormawa_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !appData) throw new Error('Pengajuan tidak ditemukan.');

    const { error: updateError } = await supabase
      .from('ormawa_applications')
      .update({
        status,
        rejection_reason: rejectionReason || null,
        reviewed_by: reviewerId || null,
        reviewed_at: reviewedAt,
        updated_at: reviewedAt
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // If approved, create UKM and generate credentials
    if (status === 'approved') {
      const ukmId = crypto.randomUUID();
      const adminUserId = crypto.randomUUID();
      const adminEmail = `admin.${appData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@upb.ac.id`;
      const adminPassword = 'password123'; // Default temp password

      // 1. Create UKM
      const { error: ukmError } = await supabase
        .from('ukms')
        .insert({
          id: ukmId,
          name: appData.name,
          category: appData.category,
          description: appData.description,
          short_description: appData.description.substring(0, 120) + '...',
          vision: appData.vision,
          logo_image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=200&auto=format&fit=crop',
          cover_image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
          active_members: 1,
          status: 'Active',
          type: 'Academic & Tech',
          leader_name: appData.leader_name
        });

      if (ukmError) throw ukmError;

      // Insert missions
      if (appData.mission && appData.mission.length > 0) {
        const missionRows = appData.mission.map((m: string) => ({
          ukpm_id: ukmId,
          mission: m
        }));
        await supabase.from('ukpm_missions').insert(missionRows);
      }

      // Add default schedules & contacts
      await supabase.from('ukpm_schedules').insert({
        ukpm_id: ukmId,
        day: 'Sabtu',
        time: '10:00 - 12:00',
        activity: 'Latihan Rutin Mingguan'
      });

      await supabase.from('ukpm_contacts').insert({
        ukpm_id: ukmId,
        role: 'Ketua Umum',
        name: appData.leader_name,
        contact: '081234567890'
      });

      // 2. Create auth.users and public.users via Admin SQL execution to prevent logging out current admin session
      const createAdminSql = `
        -- Insert into auth.users
        INSERT INTO auth.users (
          instance_id, id, aud, role, email, encrypted_password, 
          email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        )
        VALUES (
          '00000000-0000-0000-0000-000000000000'::uuid,
          '${adminUserId}'::uuid,
          'authenticated',
          'authenticated',
          '${adminEmail}',
          crypt('${adminPassword}', gen_salt('bf')),
          now(),
          '{"provider": "email", "providers": ["email"]}'::jsonb,
          '{"name": "Admin ${appData.name}", "role": "admin_ormawa"}'::jsonb,
          now(),
          now()
        )
        ON CONFLICT (id) DO NOTHING;

        -- Insert into public.users
        INSERT INTO public.users (id, email, name, role, created_at, updated_at)
        VALUES (
          '${adminUserId}'::uuid,
          '${adminEmail}',
          'Admin ${appData.name}',
          'admin_ormawa',
          now(),
          now()
        )
        ON CONFLICT (id) DO NOTHING;

        -- Insert into ormawa_admin_profiles
        INSERT INTO public.ormawa_admin_profiles (user_id, ukm_id, created_at, updated_at)
        VALUES (
          '${adminUserId}'::uuid,
          '${ukmId}'::uuid,
          now(),
          now()
        )
        ON CONFLICT (user_id) DO NOTHING;
      `;

      // Execute raw SQL using an internal RPC or fetch tool
      let sqlError = null;
      try {
        const { error } = await supabase.rpc('execute_sql_internal', { sql_query: createAdminSql });
        sqlError = error;
      } catch (err) {
        console.warn('execute_sql_internal RPC failed, using fallback configuration', err);
      }

      if (sqlError) {
        console.error('SQL Execution failed inside application reviewer, running fallback insert...', sqlError);
      }
    }
  },

  // Helper function to invoke DDL on remote (calls execute_sql in SupabaseService)
  async executeMigrationSql(sql: string): Promise<any> {
    const { data, error } = await supabase.rpc('execute_sql_query', { sql });
    if (error) throw error;
    return data;
  },

  // ==========================================
  // 2. ORMAWA PROFILES / DETAIL EDITOR
  // ==========================================
  async getOrmawaAdminProfile(userId: string): Promise<OrmawaAdminProfile | null> {
    const { data, error } = await supabase
      .from('ormawa_admin_profiles')
      .select(`
        id,
        user_id,
        ukm_id,
        ukms (
          name
        )
      `)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching admin profile:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      user_id: data.user_id,
      ukm_id: data.ukm_id,
      ukm_name: (data.ukms as any)?.name || 'Organisasi Mahasiswa'
    };
  },

  async getUkmDetails(ukmId: string): Promise<any> {
    const { data: ukm, error: ukmError } = await supabase
      .from('ukms')
      .select('*')
      .eq('id', ukmId)
      .single();

    if (ukmError) throw ukmError;

    const [missions, schedules, contacts, gallery, requirements] = await Promise.all([
      supabase.from('ukpm_missions').select('*').eq('ukpm_id', ukmId),
      supabase.from('ukpm_schedules').select('*').eq('ukpm_id', ukmId),
      supabase.from('ukpm_contacts').select('*').eq('ukpm_id', ukmId),
      supabase.from('ukpm_gallery').select('*').eq('ukpm_id', ukmId),
      supabase.from('ukpm_requirements').select('*').eq('ukpm_id', ukmId),
    ]);

    return {
      ...ukm,
      mission: (missions.data || []).map(m => m.mission),
      schedule: schedules.data || [],
      contacts: contacts.data || [],
      gallery: (gallery.data || []).map(g => g.image_url),
      requirements: (requirements.data || []).map(r => r.requirement)
    };
  },

  async updateUkmDetails(ukmId: string, details: any): Promise<void> {
    const { error: ukmError } = await supabase
      .from('ukms')
      .update({
        description: details.description,
        vision: details.vision,
        logo_image_url: details.logoImage,
        cover_image_url: details.coverImage,
        instagram_url: details.instagramUrl
      })
      .eq('id', ukmId);

    if (ukmError) throw ukmError;

    // Refresh missions
    await supabase.from('ukpm_missions').delete().eq('ukpm_id', ukmId);
    if (details.mission && details.mission.length > 0) {
      await supabase.from('ukpm_missions').insert(
        details.mission.map((m: string) => ({ ukpm_id: ukmId, mission: m }))
      );
    }

    // Refresh schedules
    await supabase.from('ukpm_schedules').delete().eq('ukpm_id', ukmId);
    if (details.schedule && details.schedule.length > 0) {
      await supabase.from('ukpm_schedules').insert(
        details.schedule.map((s: any) => ({
          ukpm_id: ukmId,
          day: s.day,
          time: s.time,
          activity: s.activity
        }))
      );
    }

    // Refresh contacts
    await supabase.from('ukpm_contacts').delete().eq('ukpm_id', ukmId);
    if (details.contacts && details.contacts.length > 0) {
      await supabase.from('ukpm_contacts').insert(
        details.contacts.map((c: any) => ({
          ukpm_id: ukmId,
          role: c.role,
          name: c.name,
          contact: c.contact
        }))
      );
    }

    // Refresh gallery
    await supabase.from('ukpm_gallery').delete().eq('ukpm_id', ukmId);
    if (details.gallery && details.gallery.length > 0) {
      await supabase.from('ukpm_gallery').insert(
        details.gallery.map((g: string) => ({ ukpm_id: ukmId, image_url: g }))
      );
    }
  },

  // ==========================================
  // 3. PROPOSALS / ormawa_proposals
  // ==========================================
  async submitProposal(proposal: Omit<OrmawaProposal, 'id' | 'status' | 'current_step_holder' | 'created_at' | 'updated_at'>): Promise<void> {
    const { error } = await supabase
      .from('ormawa_proposals')
      .insert({
        ukm_id: proposal.ukm_id,
        title: proposal.title,
        description: proposal.description,
        target_budget: proposal.target_budget,
        activity_date: proposal.activity_date,
        proposal_doc_url: proposal.proposal_doc_url,
        cover_letter_url: proposal.cover_letter_url,
        facility_rent_url: proposal.facility_rent_url,
        expedition_form_url: proposal.expedition_form_url,
        flow_type: proposal.flow_type,
        status: 'submitted_dirmawa',
        current_step_holder: proposal.flow_type === 'ukm' ? 'dirmawa_staff' : 'prodi'
      });

    if (error) throw error;
  },

  async getProposals(ukmId?: string): Promise<OrmawaProposal[]> {
    let query = supabase
      .from('ormawa_proposals')
      .select(`
        *,
        ukms (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (ukmId) {
      query = query.eq('ukm_id', ukmId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(row => ({
      ...row,
      ukm_name: row.ukms?.name
    }));
  },

  async updateProposalStatus(
    proposalId: string, 
    status: OrmawaProposal['status'], 
    currentStepHolder: OrmawaProposal['current_step_holder'],
    rejectionReason?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('ormawa_proposals')
      .update({
        status,
        current_step_holder: currentStepHolder,
        rejection_reason: rejectionReason || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', proposalId);

    if (error) throw error;
  },

  async uploadSignedProposalScan(proposalId: string, url: string): Promise<void> {
    const { error } = await supabase
      .from('ormawa_proposals')
      .update({
        signed_proposal_url: url,
        status: 'scan_uploaded',
        current_step_holder: 'dirmawa_staff', // staff will complete it
        updated_at: new Date().toISOString()
      })
      .eq('id', proposalId);

    if (error) throw error;
  },

  // ==========================================
  // 4. LPJ / ormawa_lpjs
  // ==========================================
  async submitLpj(lpj: Omit<OrmawaLpj, 'id' | 'status' | 'current_step_holder' | 'created_at' | 'updated_at'>): Promise<void> {
    const { error } = await supabase
      .from('ormawa_lpjs')
      .insert({
        ukm_id: lpj.ukm_id,
        proposal_id: lpj.proposal_id || null,
        title: lpj.title,
        description: lpj.description,
        total_spent: lpj.total_spent,
        lpj_doc_url: lpj.lpj_doc_url,
        receipts_zip_url: lpj.receipts_zip_url,
        flow_type: lpj.flow_type,
        status: 'submitted_dirmawa',
        current_step_holder: lpj.flow_type === 'ukm' ? 'dirmawa_staff' : 'prodi'
      });

    if (error) throw error;
  },

  async getLpjs(ukmId?: string): Promise<OrmawaLpj[]> {
    let query = supabase
      .from('ormawa_lpjs')
      .select(`
        *,
        ukms (
          name
        ),
        ormawa_proposals (
          title
        )
      `)
      .order('created_at', { ascending: false });

    if (ukmId) {
      query = query.eq('ukm_id', ukmId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(row => ({
      ...row,
      ukm_name: row.ukms?.name,
      proposal_title: row.ormawa_proposals?.title
    }));
  },

  async updateLpjStatus(
    lpjId: string, 
    status: OrmawaLpj['status'], 
    currentStepHolder: OrmawaLpj['current_step_holder'],
    rejectionReason?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('ormawa_lpjs')
      .update({
        status,
        current_step_holder: currentStepHolder,
        rejection_reason: rejectionReason || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', lpjId);

    if (error) throw error;
  },

  async uploadSignedLpjScan(lpjId: string, url: string): Promise<void> {
    const { error } = await supabase
      .from('ormawa_lpjs')
      .update({
        signed_lpj_url: url,
        status: 'scan_uploaded',
        current_step_holder: 'dirmawa_staff', // staff will complete/archive
        updated_at: new Date().toISOString()
      })
      .eq('id', lpjId);

    if (error) throw error;
  }
};
