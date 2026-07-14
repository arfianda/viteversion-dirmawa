import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Clock, User, PlusCircle, Trash2, CheckCircle, XCircle, AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { Appointment } from '../../types';
import { SupabaseService } from '../../services/supabaseService';
import { supabase } from '../../services/supabaseClient';

interface AppointmentSchedulerProps {
  userRoles: string[];
}

export default function AppointmentScheduler({ userRoles }: AppointmentSchedulerProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form states
  const [studentName, setStudentName] = useState('');
  const [ormawaName, setOrmawaName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedTime, setRequestedTime] = useState('');
  const [notes, setNotes] = useState('');

  // Edit/Action states
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [showActionModal, setShowActionModal] = useState<'approve' | 'reject' | null>(null);

  const isDirektur = userRoles.includes('direktur');
  const canManage = userRoles.includes('superadmin') || userRoles.includes('staf_depan');

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await SupabaseService.getAppointments();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat daftar janji temu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !purpose || !requestedDate || !requestedTime) {
      alert('Mohon isi semua field wajib!');
      return;
    }
    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await SupabaseService.createAppointment({
        created_by: user?.id,
        student_name: studentName,
        ormawa_name: ormawaName || undefined,
        purpose,
        requested_date: requestedDate,
        requested_time: requestedTime,
        status: 'pending',
        notes: notes || undefined
      });
      setShowAddModal(false);
      // Reset form
      setStudentName('');
      setOrmawaName('');
      setPurpose('');
      setRequestedDate('');
      setRequestedTime('');
      setNotes('');
      await fetchAppointments();
    } catch (err: any) {
      alert('Gagal membuat janji temu: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleStatusChange = async (status: 'approved' | 'rejected') => {
    if (!selectedAppointment) return;
    setProcessing(true);
    try {
      await SupabaseService.updateAppointment(selectedAppointment.id, {
        status,
        notes: actionNotes || selectedAppointment.notes
      });
      setShowActionModal(null);
      setSelectedAppointment(null);
      setActionNotes('');
      await fetchAppointments();
    } catch (err: any) {
      alert('Gagal memperbarui status janji temu: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal janji temu ini?')) return;
    try {
      await SupabaseService.deleteAppointment(id);
      await fetchAppointments();
    } catch (err: any) {
      alert('Gagal menghapus janji temu: ' + err.message);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-sans font-black text-3xl text-[#001e40] mb-1">
            Penjadwalan Janji Temu Direktur
          </h2>
          <p className="text-sm text-[#43474f] font-medium">
            {isDirektur 
              ? 'Daftar janji temu dan agenda pertemuan Anda.' 
              : 'Kelola dan atur jadwal janji temu mahasiswa/ormawa dengan Direktur Dirmawa.'}
          </p>
        </div>
        
        <div className="flex gap-2.5 w-full md:w-auto">
          <button
            onClick={fetchAppointments}
            className="flex-1 md:flex-none border border-slate-200 bg-white hover:bg-[#eceef1] text-[#001e40] font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Perbarui List
          </button>
          
          {canManage && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 md:flex-none bg-[#001e40] hover:bg-[#1f477b] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle size={14} />
              Atur Janji Temu
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-semibold flex items-center gap-2 text-xs">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200/50">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#001e40] text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {tab === 'all' && `Semua Agenda (${appointments.length})`}
            {tab === 'pending' && `Menunggu (${appointments.filter(a => a.status === 'pending').length})`}
            {tab === 'approved' && `Disetujui (${appointments.filter(a => a.status === 'approved').length})`}
            {tab === 'rejected' && `Dibatalkan (${appointments.filter(a => a.status === 'rejected').length})`}
          </button>
        ))}
      </div>

      {/* List / Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <RefreshCw className="animate-spin w-8 h-8 text-[#001e40] mx-auto mb-4" />
            Memuat jadwal pertemuan...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            Tidak ada agenda janji temu ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left font-sans border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-black text-[10px] uppercase border-b border-slate-200">
                  <th className="px-6 py-4">Tamu / Mahasiswa</th>
                  <th className="px-6 py-4">Ormawa</th>
                  <th className="px-6 py-4">Tujuan Pertemuan</th>
                  <th className="px-6 py-4">Waktu &amp; Tanggal</th>
                  <th className="px-6 py-4">Status</th>
                  {canManage && <th className="px-6 py-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-700">
                {filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <User size={14} />
                        </div>
                        <span className="font-bold text-slate-900">{app.student_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-500">
                      {app.ormawa_name || '-'}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-650 max-w-xs truncate" title={app.purpose}>
                      {app.purpose}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" />
                          {app.requested_date}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                          <Clock size={12} className="text-slate-400" />
                          {app.requested_time} WIB
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                          app.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : app.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border-red-100'
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {app.status === 'pending' ? 'MENUNGGU' : app.status === 'approved' ? 'DISETUJUI' : 'DIBATALKAN'}
                        </span>
                        {app.notes && (
                          <span className="text-[10px] text-slate-450 italic max-w-xs truncate" title={app.notes}>
                            Catatan: {app.notes}
                          </span>
                        )}
                      </div>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedAppointment(app);
                                  setShowActionModal('approve');
                                }}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg cursor-pointer"
                                title="Setujui Janji Temu"
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedAppointment(app);
                                  setShowActionModal('reject');
                                }}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg cursor-pointer"
                                title="Batalkan Janji Temu"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="p-1.5 bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-450 rounded-lg cursor-pointer"
                            title="Hapus Agenda"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left">
            <h3 className="font-sans font-black text-xl text-[#001e40] mb-4">Buat Jadwal Janji Temu Direktur</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Tamu / Mahasiswa *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Arfianda Firsta"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#001e40]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Ormawa / UKM (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: BEM / HIMATI"
                  value={ormawaName}
                  onChange={(e) => setOrmawaName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#001e40]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Waktu &amp; Tanggal Pertemuan *</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    required
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#001e40]"
                  />
                  <input
                    type="time"
                    required
                    value={requestedTime}
                    onChange={(e) => setRequestedTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#001e40]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Perihal / Topik Bahasan *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Deskripsikan secara ringkas tujuan pertemuan..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#001e40] resize-none text-xs"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl cursor-pointer"
                  disabled={processing}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#001e40] hover:bg-[#1f477b] text-white font-bold rounded-xl cursor-pointer"
                  disabled={processing}
                >
                  {processing ? 'Menyimpan...' : 'Atur Pertemuan'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Action Approval / Rejection Modal */}
      {showActionModal && selectedAppointment && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left">
            <h3 className="font-sans font-black text-lg text-[#001e40] mb-3">
              {showActionModal === 'approve' ? 'Setujui Pertemuan' : 'Batalkan Pertemuan'}
            </h3>
            
            <p className="text-slate-600 mb-4 text-xs font-semibold leading-relaxed">
              Apakah Anda yakin ingin {showActionModal === 'approve' ? 'menyetujui' : 'membatalkan'} jadwal janji temu dengan <strong>{selectedAppointment.student_name}</strong> pada tanggal {selectedAppointment.requested_date}?
            </p>

            <div className="space-y-3 mb-5 text-xs">
              <label className="block text-slate-700 font-bold">Catatan / Keterangan Tambahan</label>
              <textarea
                rows={2}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Tuliskan keterangan detail lokasi, link virtual, atau alasan pembatalan..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#001e40] text-xs resize-none"
              />
            </div>

            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => {
                  setShowActionModal(null);
                  setSelectedAppointment(null);
                  setActionNotes('');
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-355 text-slate-700 font-bold rounded-xl cursor-pointer text-xs"
                disabled={processing}
              >
                Batal
              </button>
              
              {showActionModal === 'approve' ? (
                <button
                  onClick={() => handleStatusChange('approved')}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer text-xs"
                  disabled={processing}
                >
                  Setujui
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange('rejected')}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl cursor-pointer text-xs"
                  disabled={processing}
                >
                  Batalkan Agenda
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
