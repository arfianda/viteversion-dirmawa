import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { RegistrationRequest } from '../types';
import { SupabaseService } from '../../services/supabaseService';
import { supabase } from '../../services/supabaseClient';

interface RegistrationQueueProps {
  onRefresh?: () => void;
}

interface ModalState {
  type: 'approve' | 'reject' | 'detail' | null;
  request: RegistrationRequest | null;
}

export default function RegistrationQueue({ onRefresh }: RegistrationQueueProps) {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [modal, setModal] = useState<ModalState>({ type: null, request: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await SupabaseService.getRegistrationRequests();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch registration requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRequests = requests.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.status === activeFilter;
  });

  const getStatusCount = (status: 'pending' | 'approved' | 'rejected') =>
    requests.filter((r) => r.status === status).length;

  const handleApprove = async () => {
    if (!modal.request) return;
    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Admin session not found');
      }
      await SupabaseService.approveRegistrationRequest(modal.request.id, user.id);
      setModal({ type: null, request: null });
      await fetchData();
      onRefresh?.();
    } catch (err: any) {
      setError('Failed to approve: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!modal.request) return;
    setProcessing(true);
    try {
      await SupabaseService.rejectRegistrationRequest(modal.request.id, rejectionReason);
      setModal({ type: null, request: null });
      setRejectionReason('');
      await fetchData();
      onRefresh?.();
    } catch (err: any) {
      setError('Failed to reject: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slantezinc200/60 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-[#001e40] mb-1.5">
              Student Registration Queue
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Review and approve new student registrations requests.
            </p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pending</p>
            <p className="text-3xl font-black text-[#815500]">{getStatusCount('pending')}</p>
          </div>
          <div className="p-3 bg-amber-100 rounded slated650 text-amber-700 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Approved</p>
            <p className="text-3xl font-black text-emerald-600">{getStatusCount('approved')}</p>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Rejected</p>
            <p className="text-3xl font-black text-red-600">{getStatusCount('rejected')}</p>
          </div>
          <div className="p-3 bg-red-100 text-red-700 rounded-xl">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tab Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              activeFilter === filter
                ? 'bg-[#001e40] text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filter === 'all' ? 'All Requests' : filter}
            {filter !== 'all' && (
              <span className="ml-1 bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full text-xs font-bold">
                {getStatusCount(filter as 'pending' | 'approved' | 'rejected')}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1">{error}</div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 font-bold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-sans font-black text-lg text-[#001e40]">Registration Requests</h3>
          <span className="text-xs text-slate-500 font-semibold">
            Showing {filteredRequests.length} of {requests.length} requests
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            <div className="inline-block w-6 h-6 border-2 border-slate-200 border-t-[#001e40] rounded-full animate-spin mb-2"></div>
            <p>Loading registration requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-700">
              {activeFilter === 'all'
                ? 'No registration requests found'
                : `No ${activeFilter} requests found`}
            </p>
            <p className="text-xs text-slate-400 mt-1">Check back later for new submissions.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-black uppercase tracking-wider border-b border-slate-200 text-[10px]">
                  <th className="px-5 py-4 pl-6">Student Info</th>
                  <th className="px-5 py-4">NIM</th>
                  <th className="px-5 py-4">Program Studi</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-5 py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#001e40] text-[#feb234] flex items-center justify-center font-bold text-xs">
                          {req.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{req.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{req.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-600">{req.nim}</td>
                    <td className="px-5 py-4">
                      <div className="text-slate-700 font-medium">{req.major}</div>
                      <div className="text-[11px] text-slate-400">{req.faculty}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          req.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : req.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}
                      >
                        {req.status === 'pending' && <Clock className="w-3 h-3" />}
                        {req.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                        {req.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(req.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => setModal({ type: 'approve', request: req })}
                              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setModal({ type: 'reject', request: req })}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors cursor-pointer"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setModal({ type: 'detail', request: req })}
                          className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {modal.type === 'approve' && modal.request && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-black text-lg text-[#001e40]">Approve Registration</h3>
                <p className="text-xs text-slate-500">Confirm student account approval</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Name</span>
                <span className="font-bold text-slate-800">{modal.request.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">NIM</span>
                <span className="font-bold text-slate-800">{modal.request.nim}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Email</span>
                <span className="font-bold text-slate-800">{modal.request.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Program Studi</span>
                <span className="font-bold text-slate-800">{modal.request.major}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModal({ type: null, request: null })}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={processing}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Approve Registration</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {modal.type === 'reject' && modal.request && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-black text-lg text-[#001e40]">Reject Registration</h3>
                <p className="text-xs text-slate-500">Provide a reason for the student</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4 text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500 font-semibold">Name</span>
                  <span className="font-bold text-slate-800">{modal.request.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">NIM</span>
                  <span className="font-bold text-slate-800">{modal.request.nim}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Rejection Reason (optional)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Incomplete documentation, invalid NIM"
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-[#001e40]/10 focus:border-[#001e40] outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setModal({ type: null, request: null });
                  setRejectionReason('');
                }}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Reject Registration</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {modal.type === 'detail' && modal.request && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-[#001e40] text-[#feb234] rounded-xl flex items-center justify-center font-bold text-sm">
                {modal.request.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-sans font-black text-lg text-[#001e40]">{modal.request.name}</h3>
                <p className="text-xs text-slate-500">{modal.request.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
              <div className="bg-slate1545 rounded-xl p-3">
                <p className="text-slate-400 font-semibold mb-1">NIM</p>
                <p className="font-bold text-slate-800">{modal.request.nim}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-slate-400 font-semibold mb-1">Program Studi</p>
                <p className="font-bold text-slate-800">{modal.request.major}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-slate-400 font-semibold mb-1">Fakultas</p>
                <p className="font-bold text-slate-800">{modal.request.faculty}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-slate-400 font-semibold mb-1">Semester</p>
                <p className="font-bold text-slate-800">{modal.request.semester}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  modal.request.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                    : modal.request.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : 'bg-red-50 text-red-700 border-red-100'
                }`}
              >
                {modal.request.status === 'pending' && <Clock className="w-3 h-3" />}
                {modal.request.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                {modal.request.status === 'rejected' && <XCircle className="w-3 h-3" />}
                {modal.request.status}
              </span>
              <span className="text-xs text-slate-400">
                Submitted on{' '}
                {new Date(modal.request.created_at).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setModal({ type: null, request: null })}
                className="px-5 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
