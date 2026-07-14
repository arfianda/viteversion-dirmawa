import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  HelpCircle,
  FileCheck2,
  ChevronRight
} from 'lucide-react';
import { OrmawaService, OrmawaProposal, OrmawaLpj } from '../../services/ormawaService';

interface OrmawaDashboardOverviewProps {
  ukmId: string;
  ukmName: string;
  onNavigate: (tab: string) => void;
}

export default function OrmawaDashboardOverview({ ukmId, ukmName, onNavigate }: OrmawaDashboardOverviewProps) {
  const [proposals, setProposals] = useState<OrmawaProposal[]>([]);
  const [lpjs, setLpjs] = useState<OrmawaLpj[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    membersCount: 15, // default mock member count
    proposalsPending: 0,
    proposalsBudget: 0,
    lpjsPending: 0
  });

  useEffect(() => {
    const loadOverviewData = async () => {
      setIsLoading(true);
      try {
        const [propsList, lpjsList] = await Promise.all([
          OrmawaService.getProposals(ukmId),
          OrmawaService.getLpjs(ukmId)
        ]);
        
        setProposals(propsList);
        setLpjs(lpjsList);

        const pendingProps = propsList.filter(p => p.status !== 'completed' && p.status !== 'rejected');
        const pendingLpjs = lpjsList.filter(l => l.status !== 'completed' && l.status !== 'rejected');
        const totalBudget = propsList
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + Number(p.target_budget), 0);

        // Fetch UKM member count from DB
        const ukmDetails = await OrmawaService.getUkmDetails(ukmId);

        setStats({
          membersCount: ukmDetails.active_members || 12,
          proposalsPending: pendingProps.length,
          proposalsBudget: totalBudget,
          lpjsPending: pendingLpjs.length
        });
      } catch (e) {
        console.error('Failed to load overview statistics:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadOverviewData();
  }, [ukmId]);

  const getProposalProgressSteps = (proposal: OrmawaProposal) => {
    // Return steps based on flow_type
    if (proposal.flow_type === 'ukm') {
      return [
        { label: 'Staff Dirmawa', holder: 'dirmawa_staff', key: 'submitted_dirmawa' },
        { label: 'Direktur', holder: 'dirmawa_direktur', key: 'approved_dirmawa_staff' },
        { label: 'DAU (Anggaran)', holder: 'dau', key: 'approved_dirmawa_direktur' },
        { label: 'Rektorat', holder: 'rektorat', key: 'approved_dau' },
        { label: 'Upload Scan', holder: 'ormawa', key: 'approved_rektorat' },
        { label: 'Pencairan', holder: 'kasir_keuangan', key: 'scan_uploaded' },
        { label: 'Selesai', holder: 'completed', key: 'completed' }
      ];
    } else {
      return [
        { label: 'Kaprodi', holder: 'prodi', key: 'submitted_dirmawa' },
        { label: 'Dekan', holder: 'dekanat', key: 'approved_prodi' },
        { label: 'DAU (Anggaran)', holder: 'dau', key: 'approved_dekanat' },
        { label: 'Upload Scan', holder: 'ormawa', key: 'approved_dau' },
        { label: 'Pencairan', holder: 'kasir_keuangan', key: 'scan_uploaded' },
        { label: 'Selesai', holder: 'completed', key: 'completed' }
      ];
    }
  };

  const getActiveStepIndex = (proposal: OrmawaProposal, steps: any[]) => {
    if (proposal.status === 'completed') return steps.length - 1;
    if (proposal.status === 'rejected') return -1;
    
    // Find current index based on status or step holder
    const statusMap: Record<string, number> = {
      'submitted_dirmawa': 0,
      'approved_dirmawa_staff': 1,
      'approved_dirmawa_direktur': 2,
      'approved_prodi': 1,
      'approved_dekanat': 2,
      'approved_dau': proposal.flow_type === 'ukm' ? 4 : 3,
      'approved_rektorat': 4,
      'scan_uploaded': proposal.flow_type === 'ukm' ? 5 : 4,
    };
    
    return statusMap[proposal.status] ?? 0;
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 font-sans font-bold">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#001e40] rounded-full animate-spin"></div>
        <span>Memuat data dashboard...</span>
      </div>
    );
  }

  const activeProposals = proposals.filter(p => p.status !== 'completed' && p.status !== 'rejected');

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Greetings Hero */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <span className="bg-[#feb234]/15 border border-[#feb234]/25 text-[#734e00] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            Console Ormawa
          </span>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#001e40] mt-2 mb-1">
            Selamat Datang Kembali, Admin {ukmName}!
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-2xl">
            Pantau aktivitas kepengurusan, edit detail informasi direktori, ajukan proposal anggaran, serta laporkan pertanggungjawaban kegiatan Anda di sini.
          </p>
        </div>
      </section>

      {/* Bento Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Members count */}
        <div 
          onClick={() => onNavigate('members')}
          className="bg-white border border-slate-200/60 rounded-2xl p-6 flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-350 hover:shadow transition-all group"
        >
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Anggota Aktif</p>
            <h3 className="text-2xl font-black text-[#001e40]">{stats.membersCount}</h3>
            <p className="text-[10px] text-slate-400 font-bold group-hover:text-[#001e40] transition-colors flex items-center gap-0.5 mt-2">
              <span>Kelola anggota</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Proposals pending */}
        <div 
          onClick={() => onNavigate('proposals')}
          className="bg-white border border-slate-200/60 rounded-2xl p-6 flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-350 hover:shadow transition-all group"
        >
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Proposal Aktif</p>
            <h3 className="text-2xl font-black text-[#001e40]">{stats.proposalsPending}</h3>
            <p className="text-[10px] text-slate-400 font-bold group-hover:text-[#001e40] transition-colors flex items-center gap-0.5 mt-2">
              <span>Ajukan proposal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* LPJ pending */}
        <div 
          onClick={() => onNavigate('proposals')}
          className="bg-white border border-slate-200/60 rounded-2xl p-6 flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-350 hover:shadow transition-all group"
        >
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">LPJ Tertunda</p>
            <h3 className="text-2xl font-black text-[#001e40]">{stats.lpjsPending}</h3>
            <p className="text-[10px] text-slate-400 font-bold group-hover:text-[#001e40] transition-colors flex items-center gap-0.5 mt-2">
              <span>Laporkan LPJ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

        {/* Budget processed */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Dana Cair (Selesai)</p>
            <h3 className="text-2xl font-black text-[#001e40] truncate max-w-[150px]">{formatRupiah(stats.proposalsBudget)}</h3>
            <div className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-md text-[9px] font-black mt-2">
              <TrendingUp className="w-3 h-3" />
              <span>Akumulatif</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

      </section>

      {/* Proposal Tracking Pipeline section */}
      <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#feb234]" />
            <h3 className="font-sans font-black text-sm uppercase tracking-wider text-[#001e40]">Pantau Proses Pengajuan Proposal</h3>
          </div>
          <button 
            onClick={() => onNavigate('proposals')}
            className="text-xs font-black text-[#001e40] hover:text-[#feb234] underline transition-colors uppercase"
          >
            Lihat Semua
          </button>
        </div>

        {activeProposals.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center text-slate-450 gap-2 font-bold text-xs">
            <CheckCircle className="w-8 h-8 text-green-500 mb-1" />
            <p>Tidak ada proposal aktif yang sedang dalam proses persetujuan.</p>
            <p className="text-[10px] text-slate-400 font-medium">Buat pengajuan baru di tab "Proposal & LPJ" untuk memulai.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {activeProposals.map((proposal) => {
              const steps = getProposalProgressSteps(proposal);
              const activeIndex = getActiveStepIndex(proposal, steps);
              
              return (
                <div key={proposal.id} className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-200/50">
                    <div>
                      <h4 className="font-black text-sm text-[#001e40]">{proposal.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                        Diajukan: {new Date(proposal.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} | Anggaran: <strong className="text-slate-700 font-black">{formatRupiah(Number(proposal.target_budget))}</strong>
                      </p>
                    </div>
                    <span className="bg-blue-50 border border-blue-200 text-blue-750 font-black px-2.5 py-1 rounded-full text-[10px] uppercase">
                      Alur {proposal.flow_type === 'ukm' ? 'UKM/LDK/KSU' : 'HIMA/BEM'}
                    </span>
                  </div>

                  {/* Horizontal Pipeline stepper for Desktop & Tablet */}
                  <div className="pt-2 overflow-x-auto hidden sm:block">
                    <div className="flex items-center min-w-[700px] pb-2 px-1">
                      {steps.map((step, idx) => {
                        const isCompleted = idx < activeIndex;
                        const isCurrent = idx === activeIndex;

                        return (
                          <React.Fragment key={idx}>
                            {/* Step circle */}
                            <div className="flex flex-col items-center relative z-10 shrink-0">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${
                                isCompleted 
                                  ? 'bg-[#001e40] border-[#001e40] text-white shadow-sm' 
                                  : isCurrent 
                                    ? 'bg-[#feb234] border-[#feb234] text-[#001e40] shadow animate-pulse scale-105' 
                                    : 'bg-white border-slate-200 text-slate-400'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle className="w-4 h-4 text-[#feb234]" />
                                ) : (
                                  <span>{idx + 1}</span>
                                )}
                              </div>
                              <span className={`text-[9px] font-black mt-2 text-center max-w-[80px] leading-tight ${isCurrent ? 'text-[#001e40] font-black scale-105' : 'text-slate-450 font-bold'}`}>
                                {step.label}
                              </span>
                            </div>

                            {/* Connecting Line */}
                            {idx < steps.length - 1 && (
                              <div className="flex-1 h-0.5 mx-1 relative bg-slate-200 min-w-[30px]">
                                <div className={`absolute inset-0 bg-[#001e40] transition-all duration-300 ${isCompleted ? 'w-full' : 'w-0'}`} />
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vertical Pipeline stepper for Mobile */}
                  <div className="pt-2 block sm:hidden space-y-4">
                    {steps.map((step, idx) => {
                      const isCompleted = idx < activeIndex;
                      const isCurrent = idx === activeIndex;

                      return (
                        <div key={idx} className="flex gap-3 items-start relative">
                          {/* Circle & line wrapper */}
                          <div className="flex flex-col items-center shrink-0">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${
                              isCompleted 
                                ? 'bg-[#001e40] border-[#001e40] text-white shadow-sm' 
                                : isCurrent 
                                  ? 'bg-[#feb234] border-[#feb234] text-[#001e40] shadow animate-pulse scale-105' 
                                  : 'bg-white border-slate-200 text-slate-400'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-[#feb234]" />
                              ) : (
                                <span>{idx + 1}</span>
                              )}
                            </div>
                            {idx < steps.length - 1 && (
                              <div className={`w-0.5 h-6 mt-1 bg-slate-250 ${isCompleted ? 'bg-[#001e40]' : ''}`} />
                            )}
                          </div>
                          {/* Label info */}
                          <div className="pt-1.5 min-w-0">
                            <p className={`text-xs font-black leading-none ${isCurrent ? 'text-[#001e40]' : 'text-slate-500 font-semibold'}`}>
                              {step.label}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Info helper about current step holder */}
                  <div className="bg-white border border-slate-200/60 p-3.5 rounded-xl flex items-center gap-3 text-[11px] leading-relaxed">
                    <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <p className="font-bold text-[#001e40]">
                        Posisi Pengajuan Sekarang: <span className="bg-[#feb234]/15 px-2 py-0.5 rounded text-[#734e00] font-black uppercase text-[9px] tracking-wide ml-1">{steps[activeIndex]?.label || 'Menunggu Peninjauan'}</span>
                      </p>
                      <p className="text-slate-500 font-medium mt-0.5">
                        {proposal.status === 'approved_rektorat' && proposal.flow_type === 'ukm' && (
                          <span>Unduh proposal yang telah disetujui, mintalah tanda tangan ke rektorat, lalu <strong>unggah berkas scan</strong> di halaman Proposal &amp; LPJ agar kasir dapat mencairkan dana.</span>
                        )}
                        {proposal.status === 'approved_dau' && proposal.flow_type === 'hima' && (
                          <span>Unduh proposal anggaran, lengkapi tanda tangan, lalu <strong>unggah berkas scan</strong> di halaman Proposal &amp; LPJ agar kasir dapat mencairkan dana.</span>
                        )}
                        {proposal.status === 'scan_uploaded' && (
                          <span>Berkas scan telah Anda unggah. Staff Dirmawa sedang memproses pencairan dana akhir ke kasir keuangan.</span>
                        )}
                        {proposal.status === 'submitted_dirmawa' && (
                          <span>Menunggu Staff Biro Kemahasiswaan (Staff Dirmawa) melakukan pengecekan kelengkapan berkas awal.</span>
                        )}
                        {proposal.status !== 'approved_rektorat' && proposal.status !== 'approved_dau' && proposal.status !== 'scan_uploaded' && proposal.status !== 'submitted_dirmawa' && (
                          <span>Berkas sedang diproses tinjauan anggaran dan persetujuan oleh divisi {steps[activeIndex]?.label}.</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* LPJ Tracking timeline */}
      <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#feb234]" />
            <h3 className="font-sans font-black text-sm uppercase tracking-wider text-[#001e40]">Laporan Pertanggungjawaban (LPJ) Aktif</h3>
          </div>
        </div>

        {lpjs.filter(l => l.status !== 'completed' && l.status !== 'rejected').length === 0 ? (
          <div className="py-8 text-center text-slate-400 font-bold text-xs border border-dashed border-slate-200 rounded-2xl">
            Tidak ada laporan LPJ aktif yang sedang ditinjau.
          </div>
        ) : (
          <div className="space-y-4">
            {lpjs.filter(l => l.status !== 'completed' && l.status !== 'rejected').map((lpj) => (
              <div key={lpj.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h4 className="font-black text-xs text-[#001e40]">{lpj.title}</h4>
                  <p className="text-[10px] text-slate-450 font-bold mt-0.5">
                    Anggaran Digunakan: <strong className="text-slate-700 font-black">{formatRupiah(Number(lpj.total_spent))}</strong> | Tipe Alur: {lpj.flow_type.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-purple-50 border border-purple-200 text-purple-700 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Aksi Di: {lpj.current_step_holder.replace('_', ' ').toUpperCase()}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
