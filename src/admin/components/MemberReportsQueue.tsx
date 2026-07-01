import React, { useState, useEffect } from 'react';
import { ClipboardList, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import { SupabaseService } from '../../services/supabaseService';

export default function MemberReportsQueue() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchReports = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await SupabaseService.getPendingMemberReports();
      setReports(data);
    } catch (e: any) {
      console.error('Failed to load pending member reports:', e);
      setErrorMsg('Gagal memuat daftar laporan anggota.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleApprove = async (reportId: string, ukmId: string, count: number) => {
    setProcessingId(reportId);
    try {
      await SupabaseService.approveMemberReport(reportId, ukmId, count);
      setReports(reports.filter(r => r.id !== reportId));
    } catch (e: any) {
      console.error(e);
      alert('Gagal menyetujui laporan: ' + (e.message || e));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (reportId: string) => {
    setProcessingId(reportId);
    try {
      await SupabaseService.rejectMemberReport(reportId);
      setReports(reports.filter(r => r.id !== reportId));
    } catch (e: any) {
      console.error(e);
      alert('Gagal menolak laporan: ' + (e.message || e));
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001e40]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-sans font-black text-2xl text-[#001e40]">Verifikasi Laporan Anggota UKM</h2>
          <p className="text-xs text-[#737780] font-semibold mt-1">
            Daftar permintaan pembaruan jumlah anggota aktif yang dilaporkan oleh masing-masing pengurus UKM.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl font-semibold">
          {errorMsg}
        </div>
      )}

      {reports.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <ClipboardList size={20} />
          </div>
          <h3 className="font-bold text-slate-700 text-sm mb-1">Tidak Ada Laporan Pending</h3>
          <p className="text-xs text-slate-400 font-semibold">
            Semua laporan jumlah anggota dari pengurus UKM telah diproses.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-slate-750 font-medium">
              <thead>
                <tr className="bg-[#f2f4f7] border-b border-[#eceef1] font-bold text-[#43474f] uppercase tracking-wider">
                  <th className="px-6 py-4 pl-8">Nama Organisasi / UKM</th>
                  <th className="px-6 py-4">Jumlah Dilaporkan</th>
                  <th className="px-6 py-4">Tanggal Pengajuan</th>
                  <th className="px-6 py-4 text-right pr-8">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceef1]">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 pl-8 font-bold text-[#001e40]">
                      {report.ukms?.name || 'UKM Tidak Dikenal'}
                    </td>
                    <td className="px-6 py-5 font-bold text-[#feb234]">
                      {report.reported_count} Mahasiswa
                    </td>
                    <td className="px-6 py-5 text-[#737780] font-semibold">
                      {new Date(report.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-5 text-right pr-8">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove(report.id, report.ukm_id, report.reported_count)}
                          disabled={processingId !== null}
                          className="bg-green-50 hover:bg-green-100 text-green-700 font-bold px-3 py-2 rounded-xl transition border border-green-200/40 inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <Check size={14} className="stroke-[3]" />
                          <span>Setujui</span>
                        </button>
                        <button
                          onClick={() => handleReject(report.id)}
                          disabled={processingId !== null}
                          className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-3 py-2 rounded-xl transition border border-red-200/40 inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <X size={14} className="stroke-[3]" />
                          <span>Tolak</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
