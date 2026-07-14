import { supabase } from './supabaseClient';
import { Scholarship, UKM, Achievement, AlumniRecord, StudentNews, ScholarshipApplication, Appointment } from '../types';
import { NewsArticle, UkmRecord, ScholarshipRecord, AlumniRecord as AdminAlumniRecord } from '../admin/types';

// Registration request types
interface RegistrationRequest {
  id: string;
  nim: string;
  name: string;
  email: string;
  password?: string;
  major: string;
  faculty: string;
  semester: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  created_at: string;
}

interface RegistrationStats {
  pending: number;
  approved: number;
  rejected: number;
}

// Helper to map DB news category/types
function mapAdminCategoryToDb(category: string): 'Berita' | 'Agenda' | 'Pengumuman' {
  const c = category.toLowerCase();
  if (c.includes('announcement') || c.includes('pengumuman')) return 'Pengumuman';
  if (c.includes('agenda')) return 'Agenda';
  return 'Berita';
}

function mapDbCategoryToAdmin(category: 'Berita' | 'Agenda' | 'Pengumuman'): string {
  if (category === 'Pengumuman') return 'Announcement';
  if (category === 'Agenda') return 'Agenda';
  return 'News';
}

function mapUkmCategoryToDb(category: string): 'Seni & Budaya' | 'Olahraga' | 'Akademik' | 'Sosial' | 'Kerohanian' | 'Minat Khusus' {
  const c = category.toLowerCase();
  if (c.includes('seni') || c.includes('art')) return 'Seni & Budaya';
  if (c.includes('olahraga') || c.includes('sport')) return 'Olahraga';
  if (c.includes('akademik') || c.includes('academic') || c.includes('riset') || c.includes('research')) return 'Akademik';
  if (c.includes('sosial') || c.includes('social')) return 'Sosial';
  if (c.includes('rohani') || c.includes('kerohanian') || c.includes('religion')) return 'Kerohanian';
  return 'Minat Khusus';
}

function mapScholarshipTypeToDb(type: string): 'internal' | 'pemerintah' | 'swasta' {
  const t = type.toLowerCase();
  if (t === 'internal') return 'internal';
  if (t === 'government' || t === 'pemerintah') return 'pemerintah';
  return 'swasta';
}

function mapDbScholarshipTypeToAdmin(type: 'internal' | 'pemerintah' | 'swasta'): 'Internal' | 'External' | 'Government' {
  if (type === 'internal') return 'Internal';
  if (type === 'pemerintah') return 'Government';
  return 'External';
}

export const SupabaseService = {
  // ==========================================
  // 1. NEWS / student_news
  // ==========================================
  async getNews(): Promise<StudentNews[]> {
    const { data, error } = await supabase
      .from('student_news')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      summary: row.summary || '',
      description: row.description || '',
      image: row.image_url || '',
      date: row.news_date,
      category: row.category as any
    }));
  },

  async getAdminNewsArticles(): Promise<NewsArticle[]> {
    const { data, error } = await supabase
      .from('student_news')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      content: row.description || '',
      status: (row.status || 'Published') as any,
      visibility: (row.visibility || 'Public') as any,
      publishDate: row.news_date || '',
      category: mapDbCategoryToAdmin(row.category),
      tags: row.tags || []
    }));
  },

  async saveNewsArticle(article: NewsArticle): Promise<void> {
    const dbCategory = mapAdminCategoryToDb(article.category);
    
    // We try to find if it exists
    const { data: existing } = await supabase
      .from('student_news')
      .select('id')
      .eq('id', article.id)
      .maybeSingle();

    const payload = {
      title: article.title,
      summary: article.content ? article.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '',
      description: article.content,
      image_url: article.coverImageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300&auto=format&fit=crop',
      news_date: article.publishDate,
      category: dbCategory,
      status: article.status,
      visibility: article.visibility,
      tags: article.tags
    };

    if (existing) {
      const { error } = await supabase
        .from('student_news')
        .update(payload)
        .eq('id', article.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('student_news')
        .insert({
          id: article.id,
          ...payload
        });
      if (error) throw error;
    }
  },

  async deleteNewsArticle(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('student_news')
      .delete()
      .eq('id', id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error("No rows deleted. This usually indicates that Row-Level Security (RLS) policies on your Supabase 'student_news' table are blocking the DELETE operation for your authenticated session.");
    }
  },

  async addStudentNews(item: Omit<StudentNews, 'id'>): Promise<StudentNews> {
    const id = crypto.randomUUID();
    const { error } = await supabase
      .from('student_news')
      .insert({
        id,
        title: item.title,
        summary: item.summary,
        description: item.description,
        image_url: item.image,
        news_date: item.date,
        category: item.category
      });
    if (error) throw error;
    return {
      id,
      ...item
    };
  },

  async updateStudentNews(id: string, item: Partial<StudentNews>): Promise<void> {
    const updateData: any = {};
    if (item.title !== undefined) updateData.title = item.title;
    if (item.summary !== undefined) updateData.summary = item.summary;
    if (item.description !== undefined) updateData.description = item.description;
    if (item.image !== undefined) updateData.image_url = item.image;
    if (item.date !== undefined) updateData.news_date = item.date;
    if (item.category !== undefined) updateData.category = item.category;

    const { error } = await supabase
      .from('student_news')
      .update(updateData)
      .eq('id', id);
    if (error) throw error;
  },


  // ==========================================
  // 2. SCHOLARSHIPS / scholarships
  // ==========================================
  async getScholarships(): Promise<Scholarship[]> {
    const { data, error } = await supabase
      .from('scholarships')
      .select('*, scholarship_requirements(requirement), scholarship_benefits(benefit)')
      .order('created_at', { ascending: false });
    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      type: row.type as any,
      provider: row.provider,
      description: row.description || '',
      fundingAmount: row.funding_amount || '',
      registrationDeadline: row.registration_deadline || '',
      bannerImage: row.banner_image_url || '',
      requirements: (row.scholarship_requirements || []).map((r: any) => r.requirement),
      benefits: (row.scholarship_benefits || []).map((b: any) => b.benefit)
    }));
  },

  async getAdminScholarshipRecords(): Promise<ScholarshipRecord[]> {
    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      name: row.title,
      provider: row.provider,
      deadline: row.registration_deadline || '',
      applicants: row.applicants || 0,
      status: (row.status || 'Open') as any,
      type: mapDbScholarshipTypeToAdmin(row.type),
      description: row.description || '',
      category: row.category || 'Government'
    }));
  },

  async saveScholarship(s: Scholarship, isNew: boolean = false): Promise<void> {
    const scholarshipId = isNew ? crypto.randomUUID() : s.id;
    
    const payload = {
      title: s.title,
      type: s.type,
      provider: s.provider,
      description: s.description,
      funding_amount: s.fundingAmount,
      registration_deadline: s.registrationDeadline,
      banner_image_url: s.bannerImage || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    };

    if (isNew) {
      const { error } = await supabase
        .from('scholarships')
        .insert({
          id: scholarshipId,
          ...payload,
          status: 'Open',
          applicants: 0,
          category: s.type === 'pemerintah' ? 'Government' : s.type === 'internal' ? 'Internal University' : 'External Corporate'
        });
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('scholarships')
        .update(payload)
        .eq('id', scholarshipId);
      if (error) throw error;
    }

    // Update requirements
    await supabase.from('scholarship_requirements').delete().eq('scholarship_id', scholarshipId);
    if (s.requirements && s.requirements.length > 0) {
      const reqs = s.requirements.filter(r => r.trim() !== '').map(r => ({ scholarship_id: scholarshipId, requirement: r }));
      if (reqs.length > 0) {
        await supabase.from('scholarship_requirements').insert(reqs);
      }
    }

    // Update benefits
    await supabase.from('scholarship_benefits').delete().eq('scholarship_id', scholarshipId);
    if (s.benefits && s.benefits.length > 0) {
      const bens = s.benefits.filter(b => b.trim() !== '').map(b => ({ scholarship_id: scholarshipId, benefit: b }));
      if (bens.length > 0) {
        await supabase.from('scholarship_benefits').insert(bens);
      }
    }
  },

  async saveAdminScholarshipRecord(sr: ScholarshipRecord, isNew: boolean = false): Promise<void> {
    const scholarshipId = isNew ? crypto.randomUUID() : sr.id;
    const dbType = mapScholarshipTypeToDb(sr.type);

    const payload = {
      title: sr.name,
      provider: sr.provider,
      registration_deadline: sr.deadline,
      applicants: sr.applicants,
      status: sr.status,
      type: dbType,
      description: sr.description,
      category: sr.category
    };

    if (isNew) {
      const { error } = await supabase
        .from('scholarships')
        .insert({
          id: scholarshipId,
          ...payload,
          banner_image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop'
        });
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('scholarships')
        .update(payload)
        .eq('id', scholarshipId);
      if (error) throw error;
    }
  },

  async deleteScholarship(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('scholarships')
      .delete()
      .eq('id', id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error("No rows deleted. This usually indicates that Row-Level Security (RLS) policies on your Supabase 'scholarships' table are blocking the DELETE operation for your authenticated session.");
    }
  },


  // ==========================================
  // 3. UKMS / ukms
  // ==========================================
  async getUkms(): Promise<UKM[]> {
    const { data, error } = await supabase
      .from('ukms')
      .select('*, ukpm_missions(mission), ukpm_schedules(day, time, activity), ukpm_gallery(image_url), ukpm_contacts(role, name, contact), ukpm_requirements(requirement)')
      .order('name', { ascending: true });
    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      category: row.category as any,
      description: row.description || '',
      shortDescription: row.short_description || '',
      coverImage: row.cover_image_url || '',
      logoImage: row.logo_image_url || '',
      vision: row.vision || '',
      activeMembers: row.active_members || 0,
      instagramUrl: row.instagram_url || '',
      mission: (row.ukpm_missions || []).map((m: any) => m.mission),
      schedule: (row.ukpm_schedules || []).map((s: any) => ({ day: s.day, time: s.time, activity: s.activity })),
      gallery: (row.ukpm_gallery || []).map((g: any) => g.image_url),
      contacts: (row.ukpm_contacts || []).map((c: any) => ({ role: c.role, name: c.name, contact: c.contact })),
      requirements: (row.ukpm_requirements || []).map((r: any) => r.requirement)
    }));
  },

  async getAdminUkmRecords(): Promise<UkmRecord[]> {
    const { data, error } = await supabase
      .from('ukms')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      type: row.type || 'Academic & Tech',
      status: (row.status || 'Active') as any,
      logoUrl: row.logo_image_url || undefined,
      coverUrl: row.cover_image_url || undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Oct 24, 2023',
      description: row.description || '',
      leaderName: row.leader_name || undefined,
      instagramUrl: row.instagram_url || undefined
    }));
  },

  async saveUkm(u: UKM, isNew: boolean = false): Promise<void> {
    const ukmId = isNew ? crypto.randomUUID() : u.id;
    
    const payload = {
      name: u.name,
      category: mapUkmCategoryToDb(u.category),
      description: u.description,
      short_description: u.shortDescription,
      cover_image_url: u.coverImage || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
      logo_image_url: u.logoImage,
      vision: u.vision,
      active_members: u.activeMembers,
      leader_name: u.contacts && u.contacts[0] ? u.contacts[0].name : '',
      instagram_url: u.instagramUrl || null
    };

    if (isNew) {
      const { error } = await supabase
        .from('ukms')
        .insert({
          id: ukmId,
          ...payload,
          type: 'Academic & Tech',
          status: 'Active'
        });
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('ukms')
        .update(payload)
        .eq('id', ukmId);
      if (error) throw error;
    }

    // Update missions
    await supabase.from('ukpm_missions').delete().eq('ukpm_id', ukmId);
    if (u.mission && u.mission.length > 0) {
      const mis = u.mission.filter(m => m.trim() !== '').map(m => ({ ukpm_id: ukmId, mission: m }));
      if (mis.length > 0) {
        await supabase.from('ukpm_missions').insert(mis);
      }
    }

    // Update requirements
    await supabase.from('ukpm_requirements').delete().eq('ukpm_id', ukmId);
    if (u.requirements && u.requirements.length > 0) {
      const reqs = u.requirements.filter(r => r.trim() !== '').map(r => ({ ukpm_id: ukmId, requirement: r }));
      if (reqs.length > 0) {
        await supabase.from('ukpm_requirements').insert(reqs);
      }
    }

    // Update schedules
    await supabase.from('ukpm_schedules').delete().eq('ukpm_id', ukmId);
    if (u.schedule && u.schedule.length > 0) {
      const sched = u.schedule.filter(s => s.day.trim() !== '').map(s => ({ ukpm_id: ukmId, day: s.day, time: s.time, activity: s.activity }));
      if (sched.length > 0) {
        await supabase.from('ukpm_schedules').insert(sched);
      }
    }

    // Update contacts
    await supabase.from('ukpm_contacts').delete().eq('ukpm_id', ukmId);
    if (u.contacts && u.contacts.length > 0) {
      const conts = u.contacts.filter(c => c.name.trim() !== '').map(c => ({ ukpm_id: ukmId, role: c.role, name: c.name, contact: c.contact }));
      if (conts.length > 0) {
        await supabase.from('ukpm_contacts').insert(conts);
      }
    }

    // Update gallery
    await supabase.from('ukpm_gallery').delete().eq('ukpm_id', ukmId);
    if (u.gallery && u.gallery.length > 0) {
      const gals = u.gallery.filter(g => g.trim() !== '').map(g => ({ ukpm_id: ukmId, image_url: g }));
      if (gals.length > 0) {
        await supabase.from('ukpm_gallery').insert(gals);
      }
    }
  },

  async saveAdminUkmRecord(ur: UkmRecord, isNew: boolean = false): Promise<void> {
    const ukmId = ur.id || crypto.randomUUID();
    const dbCategory = mapUkmCategoryToDb(ur.category);

    const payload = {
      name: ur.name,
      category: dbCategory,
      type: ur.type,
      status: ur.status,
      logo_image_url: ur.logoUrl,
      cover_image_url: ur.coverUrl,
      description: ur.description,
      leader_name: ur.leaderName,
      instagram_url: ur.instagramUrl || null
    };

    if (isNew) {
      const { error } = await supabase
        .from('ukms')
        .insert({
          id: ukmId,
          ...payload,
          cover_image_url: ur.coverUrl || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop'
        });
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('ukms')
        .update(payload)
        .eq('id', ukmId);
      if (error) throw error;
    }
  },

  async deleteUkm(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('ukms')
      .delete()
      .eq('id', id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error("No rows deleted. This usually indicates that Row-Level Security (RLS) policies on your Supabase 'ukms' table are blocking the DELETE operation for your authenticated session.");
    }
  },


  // ==========================================
  // 4. ACHIEVEMENTS / achievements
  // ==========================================
  async getAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('year', { ascending: false });
    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      studentName: row.student_name,
      major: row.major,
      level: row.level as any,
      rank: row.rank || '',
      category: row.category as any,
      year: row.year,
      description: row.description || '',
      image: row.image_url || '',
      status: row.status
    }));
  },

  async saveAchievement(a: Achievement, isNew: boolean = false): Promise<void> {
    const achievementId = isNew ? crypto.randomUUID() : a.id;
    const payload = {
      title: a.title,
      student_name: a.studentName,
      major: a.major,
      level: a.level,
      rank: a.rank,
      category: a.category,
      year: a.year,
      description: a.description,
      image_url: a.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=300&auto=format&fit=crop',
      status: a.status || 'Menunggu Verifikasi'
    };

    if (isNew) {
      const { error } = await supabase
        .from('achievements')
        .insert({
          id: achievementId,
          ...payload
        });
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('achievements')
        .update(payload)
        .eq('id', achievementId);
      if (error) throw error;
    }
  },

  async deleteAchievement(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error("No rows deleted. This usually indicates that Row-Level Security (RLS) policies on your Supabase 'achievements' table are blocking the DELETE operation for your authenticated session.");
    }
  },


  // ==========================================
  // 5. ALUMNI RECORDS / alumni_records
  // ==========================================
  async getAlumni(): Promise<AlumniRecord[]> {
    const { data, error } = await supabase
      .from('alumni_records')
      .select('*')
      .order('graduation_year', { ascending: false });
    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      graduationYear: row.graduation_year,
      major: row.major,
      status: row.status as any,
      company: row.company || '',
      position: row.position || ''
    }));
  },

  async getAdminAlumniRecords(): Promise<AdminAlumniRecord[]> {
    const { data, error } = await supabase
      .from('alumni_records')
      .select('*')
      .order('graduation_year', { ascending: false });
    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      nim: row.nim || '',
      prodi: row.major,
      graduationYear: row.graduation_year,
      status: (row.nim_status || 'Valid') as any,
      email: row.email || undefined,
      employmentStatus: row.status as any,
      company: row.company || '',
      position: row.position || ''
    }));
  },

  async saveAlumni(a: AlumniRecord, isNew: boolean = false): Promise<void> {
    const alumniId = isNew ? crypto.randomUUID() : a.id;
    const payload = {
      name: a.name,
      graduation_year: a.graduationYear,
      major: a.major,
      status: a.status,
      company: a.company,
      position: a.position
    };

    if (isNew) {
      const { error } = await supabase
        .from('alumni_records')
        .insert({
          id: alumniId,
          ...payload,
          nim: '',
          email: '',
          nim_status: 'Valid'
        });
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('alumni_records')
        .update(payload)
        .eq('id', alumniId);
      if (error) throw error;
    }
  },

  async saveAdminAlumniRecord(ar: AdminAlumniRecord, isNew: boolean = false): Promise<void> {
    const alumniId = isNew ? crypto.randomUUID() : ar.id;
    const payload = {
      name: ar.name,
      nim: ar.nim,
      major: ar.prodi,
      graduation_year: ar.graduationYear,
      nim_status: ar.status,
      email: ar.email || ''
    };

    if (isNew) {
      const { error } = await supabase
        .from('alumni_records')
        .insert({
          id: alumniId,
          ...payload,
          status: 'Bekerja',
          company: '',
          position: ''
        });
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('alumni_records')
        .update(payload)
        .eq('id', alumniId);
      if (error) throw error;
    }
  },

  async saveAdminAlumniRecordsBulk(records: Omit<AdminAlumniRecord, 'id'>[]): Promise<void> {
    // 1. Fetch all existing NIMs from database to prevent duplicate insertions
    const { data: existing, error: fetchError } = await supabase
      .from('alumni_records')
      .select('nim');
    if (fetchError) throw fetchError;
    
    const existingNims = new Set(existing ? existing.map((x: any) => String(x.nim || '').trim()) : []);

    // 2. Filter records to avoid duplicate NIMs within the batch and matching existing DB records
    const seenBatchNims = new Set<string>();
    const uniqueNewRecords = records.filter(ar => {
      const cleanNim = String(ar.nim || '').trim();
      if (!cleanNim) return false;
      if (existingNims.has(cleanNim) || seenBatchNims.has(cleanNim)) {
        return false;
      }
      seenBatchNims.add(cleanNim);
      return true;
    });

    if (uniqueNewRecords.length === 0) {
      console.log('No new alumni records to insert (all duplicates skipped).');
      return;
    }

    const payloads = uniqueNewRecords.map(ar => ({
      id: crypto.randomUUID(),
      name: ar.name,
      nim: ar.nim,
      major: ar.prodi,
      graduation_year: ar.graduationYear,
      nim_status: ar.status,
      email: ar.email || '',
      status: ar.employmentStatus || 'Bekerja',
      company: ar.company || '',
      position: ar.position || ''
    }));

    const { error } = await supabase
      .from('alumni_records')
      .insert(payloads);
    if (error) throw error;
  },

  async deleteAlumni(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('alumni_records')
      .delete()
      .eq('id', id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error("No rows deleted. This usually indicates that Row-Level Security (RLS) policies on your Supabase 'alumni_records' table are blocking the DELETE operation for your authenticated session.");
    }
  },

  // ==========================================
  // 6. REGISTRATION REQUESTS / registration_requests
  // ==========================================
  async getRegistrationRequests(status?: 'pending' | 'approved' | 'rejected', limit?: number, offset?: number): Promise<RegistrationRequest[]> {
    let query = supabase
      .from('registration_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (status) {
      query = query.eq('status', status);
    }
    if (limit) {
      query = query.limit(limit);
    }
    if (offset) {
      query = query.range(offset, offset + (limit || 0) - 1);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as RegistrationRequest[];
  },

  async approveRegistrationRequest(id: string, adminId: string): Promise<void> {
    const { data: supabaseData } = await supabase.auth.getSession();
    if (!supabaseData.session) {
      throw new Error("Admin session required for approval");
    }

    const { error } = await supabase.rpc('approve_registration_request', {
      p_request_id: id,
      p_admin_id: adminId
    });

    if (error) {
      throw new Error(error.message || "Failed to approve registration");
    }
  },

  async rejectRegistrationRequest(id: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from('registration_requests')
      .update({
        status: 'rejected',
        rejection_reason: reason || null,
        reviewed_by: (await supabase.auth.getUser()).data.user?.id || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (error) throw error;
  },

  async getRegistrationRequestStats(): Promise<RegistrationStats> {
    const { data, error } = await supabase
      .from('registration_requests')
      .select('status, count');
    if (error) throw error;

    const stats: RegistrationStats = { pending: 0, approved: 0, rejected: 0 };
    (data || []).forEach((row: any) => {
      if (row.status in stats) {
        stats[row.status as 'pending' | 'approved' | 'rejected'] = parseInt(row.count, 10);
      }
    });
    return stats;
  },

  async getStudentsCount(): Promise<number> {
    const { count, error } = await supabase
      .from('mahasiswa_profiles')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  },

  async getNewStudentsCountThisMonth(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from('mahasiswa_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString());
    if (error) throw error;
    return count || 0;
  },

  async getPendingRegistrationsCount(): Promise<number> {
    const { count, error } = await supabase
      .from('registration_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    if (error) throw error;
    return count || 0;
  },

  async getAlumniStats(): Promise<{ total: number; verified: number }> {
    const [
      { count: total, error: totalError },
      { count: verified, error: verifiedError }
    ] = await Promise.all([
      supabase.from('alumni_records').select('*', { count: 'exact', head: true }),
      supabase.from('alumni_records').select('*', { count: 'exact', head: true }).eq('nim_status', 'Valid')
    ]);
    if (totalError) throw totalError;
    if (verifiedError) throw verifiedError;
    return {
      total: total || 0,
      verified: verified || 0
    };
  },

  // ==========================================
  // 10. SCHOLARSHIP APPLICATIONS / scholarship_applications
  // ==========================================
  async submitScholarshipApplication(appData: {
    user_id: string;
    scholarship_id: string;
    nim: string;
    name: string;
    major: string;
    gpa: number;
    phone: string;
    document_url?: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('scholarship_applications')
      .insert(appData);
    if (error) throw error;

    // Increment applicants counter on the scholarship record (if possible)
    const { data: scholarship, error: getError } = await supabase
      .from('scholarships')
      .select('applicants')
      .eq('id', appData.scholarship_id)
      .single();
    if (!getError && scholarship) {
      await supabase
        .from('scholarships')
        .update({ applicants: (scholarship.applicants || 0) + 1 })
        .eq('id', appData.scholarship_id);
    }
  },

  async getStudentScholarshipApplications(userId: string): Promise<ScholarshipApplication[]> {
    const { data, error } = await supabase
      .from('scholarship_applications')
      .select('*, scholarships(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      user_id: row.user_id,
      scholarship_id: row.scholarship_id,
      nim: row.nim,
      name: row.name,
      major: row.major,
      gpa: Number(row.gpa),
      phone: row.phone,
      document_url: row.document_url || '',
      status: row.status as any,
      rejection_reason: row.rejection_reason || '',
      created_at: row.created_at,
      updated_at: row.updated_at,
      scholarships: row.scholarships ? {
        id: row.scholarships.id,
        title: row.scholarships.title,
        type: row.scholarships.type,
        provider: row.scholarships.provider,
        description: row.scholarships.description || '',
        fundingAmount: row.scholarships.funding_amount || '',
        registrationDeadline: row.scholarships.registration_deadline || '',
        requirements: [],
        bannerImage: row.scholarships.banner_image_url || '',
        benefits: []
      } : undefined
    }));
  },

  async getAdminScholarshipApplications(): Promise<ScholarshipApplication[]> {
    const { data, error } = await supabase
      .from('scholarship_applications')
      .select('*, scholarships(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      user_id: row.user_id,
      scholarship_id: row.scholarship_id,
      nim: row.nim,
      name: row.name,
      major: row.major,
      gpa: Number(row.gpa),
      phone: row.phone,
      document_url: row.document_url || '',
      status: row.status as any,
      rejection_reason: row.rejection_reason || '',
      created_at: row.created_at,
      updated_at: row.updated_at,
      scholarships: row.scholarships ? {
        id: row.scholarships.id,
        title: row.scholarships.title,
        type: row.scholarships.type,
        provider: row.scholarships.provider,
        description: row.scholarships.description || '',
        fundingAmount: row.scholarships.funding_amount || '',
        registrationDeadline: row.scholarships.registration_deadline || '',
        requirements: [],
        bannerImage: row.scholarships.banner_image_url || '',
        benefits: []
      } : undefined
    }));
  },

  async updateScholarshipApplicationStatus(id: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<void> {
    const { error } = await supabase
      .from('scholarship_applications')
      .update({
        status,
        rejection_reason: rejectionReason || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    if (error) throw error;
  },

  // ==========================================
  // MEMBER REPORTS MANAGEMENT
  // ==========================================
  async createMemberReport(ukmId: string, reportedCount: number): Promise<void> {
    const reportId = crypto.randomUUID();
    const { error } = await supabase
      .from('member_reports')
      .insert({
        id: reportId,
        ukm_id: ukmId,
        reported_count: reportedCount,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    if (error) throw error;
  },

  async getPendingMemberReports(): Promise<any[]> {
    const { data, error } = await supabase
      .from('member_reports')
      .select('*, ukms(name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getPendingMemberReportForUkm(ukmId: string): Promise<any> {
    const { data, error } = await supabase
      .from('member_reports')
      .select('*')
      .eq('ukm_id', ukmId)
      .eq('status', 'pending')
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async approveMemberReport(reportId: string, ukmId: string, count: number): Promise<void> {
    // 1. Update report status to approved
    const { error: reportError } = await supabase
      .from('member_reports')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', reportId);
    if (reportError) throw reportError;

    // 2. Update active_members in ukms table
    const { error: ukmError } = await supabase
      .from('ukms')
      .update({ active_members: count, updated_at: new Date().toISOString() })
      .eq('id', ukmId);
    if (ukmError) throw ukmError;
  },

  async rejectMemberReport(reportId: string): Promise<void> {
    const { error } = await supabase
      .from('member_reports')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', reportId);
    if (error) throw error;
  },

  async getSystemSetting(key: string): Promise<string> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    if (error) throw error;
    return data ? data.value : 'false';
  },

  async setSystemSetting(key: string, value: string): Promise<void> {
    const { error } = await supabase
      .from('system_settings')
      .upsert({ key, value });
    if (error) throw error;
  },

  // ==========================================
  // APPOINTMENTS MANAGEMENT & ROLES UPDATE
  // ==========================================
  async getAppointments(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('requested_date', { ascending: true })
      .order('requested_time', { ascending: true });
    if (error) throw error;
    return (data || []) as Appointment[];
  },

  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        ...appointment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return data as Appointment;
  },

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    if (error) throw error;
  },

  async deleteAppointment(id: string): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async updateUserRoles(userId: string, roles: string[]): Promise<void> {
    const primaryRole = roles.length > 0 ? roles[0] : 'operator';
    const { error } = await supabase
      .from('users')
      .update({
        roles,
        role: primaryRole,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    if (error) throw error;
  },

  async logLogin(email: string, role: string, status: 'success' | 'failed', userId?: string): Promise<void> {
    try {
      const userAgent = navigator.userAgent;
      await supabase.from('login_logs').insert({
        user_id: userId || null,
        email,
        role,
        status,
        user_agent: userAgent
      });
    } catch (e) {
      console.error('Failed to save login log:', e);
    }
  },

  async getLoginLogs(limit = 100): Promise<any[]> {
    const { data, error } = await supabase
      .from('login_logs')
      .select('id, user_id, email, role, status, user_agent, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async getActiveStudents(): Promise<any[]> {
    const { data, error } = await supabase
      .from('mahasiswa_profiles')
      .select('user_id, nim, major, faculty, semester, users:user_id(name, email, phone, avatar_url)')
      .order('nim', { ascending: true });
    if (error) throw error;
    
    return (data || []).map((profile: any) => ({
      userId: profile.user_id,
      nim: profile.nim,
      major: profile.major,
      faculty: profile.faculty,
      semester: profile.semester,
      name: profile.users?.name || 'Unknown',
      email: profile.users?.email || '',
      phone: profile.users?.phone || '',
      avatarUrl: profile.users?.avatar_url || ''
    }));
  }
};

