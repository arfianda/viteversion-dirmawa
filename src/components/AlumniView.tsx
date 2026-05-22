/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { AlumniRecord } from '../types';
import { 
  Search, 
  BookOpen, 
  Database, 
  FileText, 
  Send, 
  UserCheck, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ArrowUpDown 
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from '@tanstack/react-table';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Zod Schema for tracer questionnaire standard validation matching PRD specs
const tracerSchema = z.object({
  name: z.string().min(2, { message: 'Nama lengkap wajib diisi (minimal 2 karakter)' }),
  graduationYear: z.string().min(1, { message: 'Tahun wisuda wajib dipilih' }),
  major: z.string().min(1, { message: 'Silakan pilih Program Studi' }),
  status: z.enum(['Bekerja', 'Wirausaha', 'Lanjut Studi', 'Mencari Kerja']),
  company: z.string().optional(),
  position: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.status !== 'Mencari Kerja') {
    if (!data.company || data.company.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['company'],
        message: data.status === 'Lanjut Studi' ? 'Nama universitas kelanjutan studi wajib diisi' : 'Nama instansi/perusahaan tempat kerja wajib diisi'
      });
    }
    if (data.status !== 'Lanjut Studi' && (!data.position || data.position.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['position'],
        message: 'Posisi atau jabatan pekerjaan saat ini wajib diisi'
      });
    }
  }
});

type TracerFormValues = z.infer<typeof tracerSchema>;

interface AlumniProps {
  alumniList: AlumniRecord[];
  setAlumniList: React.Dispatch<React.SetStateAction<AlumniRecord[]>>;
}

export default function AlumniView({ alumniList, setAlumniList }: AlumniProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('semua');
  const [selectedMajor, setSelectedMajor] = React.useState<string>('semua');
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  // Majors list
  const majors = ['semua', 'Teknik Informatika', 'Sistem Informasi', 'Manajemen', 'Teknik Industri', 'Akuntansi'];

  // Status List
  const statuses = ['semua', 'Bekerja', 'Wirausaha', 'Lanjut Studi', 'Mencari Kerja'];

  // React Hook Form + Zod setup
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<TracerFormValues>({
    resolver: zodResolver(tracerSchema),
    defaultValues: {
      name: '',
      graduationYear: '2024',
      major: 'Teknik Informatika',
      status: 'Bekerja',
      company: '',
      position: ''
    }
  });

  const watchStatus = watch('status');

  // Filter list statically before presenting to the data-table engine
  const filteredAlumni = React.useMemo(() => {
    return alumniList.filter((a) => {
      const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            a.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            a.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'semua' || a.status === selectedStatus;
      const matchesMajor = selectedMajor === 'semua' || a.major === selectedMajor;

      return matchesSearch && matchesStatus && matchesMajor;
    });
  }, [alumniList, searchTerm, selectedStatus, selectedMajor]);

  // Recharts Computations
  const statusCounts = React.useMemo(() => {
    return alumniList.reduce((acc: { [key: string]: number }, cur) => {
      acc[cur.status] = (acc[cur.status] || 0) + 1;
      return acc;
    }, {});
  }, [alumniList]);

  const pieData = React.useMemo(() => {
    return Object.keys(statusCounts).map((key) => ({
      name: key,
      value: statusCounts[key]
    }));
  }, [statusCounts]);

  const COLORS = ['#10B981', '#F5A623', '#3B82F6', '#EF4444'];

  // Graduation Year chart computation
  const yearCounts = React.useMemo(() => {
    return alumniList.reduce((acc: { [key: string]: number }, cur) => {
      const yr = cur.graduationYear.toString();
      acc[yr] = (acc[yr] || 0) + 1;
      return acc;
    }, {});
  }, [alumniList]);

  const barData = React.useMemo(() => {
    return Object.keys(yearCounts).sort().map((yr) => ({
      year: `${yr}`,
      Lulusan: yearCounts[yr]
    }));
  }, [yearCounts]);

  // Average employment metrics calculations
  const totalAlumniVal = alumniList.length;
  const workingCount = alumniList.filter(a => a.status === 'Bekerja').length;
  const entrepreneurCount = alumniList.filter(a => a.status === 'Wirausaha').length;
  const studyCount = alumniList.filter(a => a.status === 'Lanjut Studi').length;

  const employmentRate = totalAlumniVal > 0 
    ? (((workingCount + entrepreneurCount + studyCount) / totalAlumniVal) * 100).toFixed(1) 
    : '0';

  // TanStack Table setup for dynamic UI mapping
  const columns = React.useMemo<ColumnDef<AlumniRecord>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center space-x-1.5 hover:text-slate-900 transition font-sans font-bold text-slate-700 text-xs uppercase tracking-wide"
            type="button"
          >
            <span>Nama Alumni</span>
            <ArrowUpDown size={12} className="text-[#feb234]" />
          </button>
        ),
        cell: (info) => {
          const row = info.row.original;
          return (
            <div>
              <span className="text-slate-900 font-bold font-sans block text-sm">{row.name}</span>
              <span className="text-slate-400 font-mono text-[9.5px]">ID: {row.id}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'graduationYear',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center space-x-1.5 hover:text-slate-900 transition font-sans font-bold text-slate-700 text-xs uppercase tracking-wide"
            type="button"
          >
            <span>Angkatan & Prodi</span>
            <ArrowUpDown size={12} className="text-[#feb234]" />
          </button>
        ),
        cell: (info) => {
          const row = info.row.original;
          return (
            <div>
              <span className="text-slate-800 block font-semibold text-xs">Wisuda {row.graduationYear}</span>
              <span className="text-slate-500 block text-[10.5px] font-mono leading-none mt-1">{row.major}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue() as string;
          return (
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold inline-block border ${
              status === 'Bekerja'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : status === 'Wirausaha'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : status === 'Lanjut Studi'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'company',
        header: 'Tempat Kerja / Posisi',
        cell: (info) => {
          const row = info.row.original;
          return row.status === 'Mencari Kerja' ? (
            <span className="text-slate-400 italic text-xs font-sans">Fresh Graduate / Mencari Kerja</span>
          ) : (
            <div>
              <span className="text-slate-800 font-semibold block text-xs">{row.company}</span>
              <span className="text-slate-500 block text-[10.5px] mt-0.5">{row.position}</span>
            </div>
          );
        },
      },
    ],
    []
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: filteredAlumni,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  // Tracer questionnaire robust submit action
  const handleTracerSubmit = (data: TracerFormValues) => {
    const newAlumni: AlumniRecord = {
      id: (alumniList.length + 1).toString(),
      name: data.name,
      graduationYear: Number(data.graduationYear),
      major: data.major,
      status: data.status,
      company: data.status !== 'Mencari Kerja' && data.company ? data.company : '-',
      position: data.status !== 'Mencari Kerja' && data.position ? data.position : '-'
    };

    setAlumniList([newAlumni, ...alumniList]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      reset();
    }, 4000);
  };

  return (
    <div className="space-y-12">
      
      {/* Header title - Light, Elegant, High-contrast */}
      <div className="text-center space-y-3">
        <span className="font-mono text-xs font-black uppercase tracking-widest text-[#feb234] block">DATA TRACER ALUMNI</span>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight">Tracer Alumni & Pelacakan Karir</h1>
        <p className="text-sm sm:text-base text-slate-505 max-w-2xl mx-auto font-sans leading-relaxed">
          Menganalisis keterserapan industri kerja, memvisualisasikan daya saing lulusan, serta mewadahi pengisian kuesioner pelacakan karir terpadu (Tracer Study).
        </p>
      </div>

      {/* Stats Counter metrics - Clean containers matching the site style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Alumni Terlacak', value: `${totalAlumniVal} Wisudawan`, sub: 'Tercatat di Sistem Tracer', icon: Database },
          { label: 'Indeks Keterserapan Kerja', value: `${employmentRate}%`, sub: 'Bekerja/Wirausaha/S2', icon: UserCheck },
          { label: 'Aktif Berwirausaha', value: `${entrepreneurCount} Startup`, sub: 'Mandiri Ekonomi Kreatif', icon: Users },
          { label: 'Studi Magister (S2)', value: `${studyCount} Mahasiswa`, sub: 'Lanjutan Riset Akademik', icon: BookOpen }
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-slate-50 p-2.5 rounded-xl text-[#001e40]">
                <Icon size={18} />
              </div>
              <span className="text-slate-500 text-[11px] font-sans font-bold uppercase tracking-wider block">{item.label}</span>
              <span className="text-[#001e40] text-xl sm:text-2xl font-black font-sans block pt-1">{item.value}</span>
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-medium">{item.sub}</span>
            </div>
          );
        })}
      </div>

      {/* VISUALIZATION CHARTS COLS - Light themed container styles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Status Breakdown (PieChart) */}
        <div id="status-chart" className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-sm">
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#feb234] uppercase font-bold tracking-widest block">Visualisasi Sebaran</span>
            <h3 className="font-sans font-black text-[#001e40] tracking-tight text-lg">Distribusi Karir & Status Alumni</h3>
          </div>
          <div className="h-64 relative font-sans text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-sans text-slate-505 pt-2">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Graduation Trend (BarChart) - Clean & identical to the mockup layout */}
        <div id="trend-chart" className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-sm">
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#feb234] uppercase font-bold tracking-widest block">Rasio Angkatan</span>
            <h3 className="font-sans font-black text-[#001e40] tracking-tight text-lg">Jumlah Lulusan Berdasar Tahun Wisuda</h3>
          </div>
          <div className="h-64 font-sans text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <XAxis dataKey="year" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9', opacity: 0.5 }} 
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="Lulusan" fill="#001e40" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* DUAL COLS: SEARCH ALUMNI DIRECTORY VS TRACER FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        
        {/* Alumni Database query (Left 3/5 with TanStack Table integration) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-1">
            <span className="font-mono text-xs font-black uppercase text-[#feb234]">Direktori Sebaran Lulusan</span>
            <h2 className="font-sans font-extrabold text-2xl text-[#001e40] tracking-tight">Daftar Alumni Pelita Bangsa</h2>
          </div>

          {/* Filters area */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3.5 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Search text */}
              <div>
                <label className="text-slate-555 font-sans text-[10.5px] block font-bold mb-1 uppercase tracking-wide">Cari Kelulusan</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nama / Tempat Kerja..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#001e40] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Status Select */}
              <div>
                <label className="text-slate-555 font-sans text-[10.5px] block font-bold mb-1 uppercase tracking-wide">Filter Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    table.setPageIndex(0);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#001e40] focus:bg-white transition-all"
                >
                  {statuses.map(st => (
                    <option key={st} value={st}>{st === 'semua' ? 'Semua Status' : st}</option>
                  ))}
                </select>
              </div>

              {/* Major select */}
              <div>
                <label className="text-slate-555 font-sans text-[10.5px] block font-bold mb-1 uppercase tracking-wide">Filter Jurusan</label>
                <select
                  value={selectedMajor}
                  onChange={(e) => {
                    setSelectedMajor(e.target.value);
                    table.setPageIndex(0);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#001e40] focus:bg-white transition-all"
                >
                  {majors.map(mj => (
                    <option key={mj} value={mj}>{mj === 'semua' ? 'Semua Program Studi' : mj}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* TanStack Table layout with clean pristine light coloring */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="bg-slate-50 text-slate-500 font-sans text-[10.5px] border-b border-slate-200 uppercase">
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="px-5 py-4 font-black">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/75 transition">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-5 py-4 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {table.getRowModel().rows.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center text-slate-400 font-sans italic">
                        Tidak ada kecocokan alumni dalam basis data tracer.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls for TanStack Table */}
            {table.getPageCount() > 1 && (
              <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-slate-500 select-none">
                <div className="flex items-center space-x-2">
                  <span>Menampilkan</span>
                  <span className="text-slate-900 font-extrabold">
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      filteredAlumni.length
                    )}
                  </span>
                  <span>dari</span>
                  <span className="text-[#feb234] font-extrabold">{filteredAlumni.length}</span>
                  <span>alumni terlacak</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="p-1.5 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Halaman Pertama"
                    type="button"
                  >
                    <ChevronsLeft size={13} />
                  </button>
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="p-1.5 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Sebelumnya"
                    type="button"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <span className="px-2">
                    Hal <span className="text-slate-900 font-bold">{table.getState().pagination.pageIndex + 1}</span> dari{' '}
                    <span className="text-slate-900 font-bold">{table.getPageCount()}</span>
                  </span>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="p-1.5 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Selanjutnya"
                    type="button"
                  >
                    <ChevronRight size={13} />
                  </button>
                  <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="p-1.5 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Halaman Terakhir"
                    type="button"
                  >
                    <ChevronsRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TRACER SUBMISSION FORM with clean light typography */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 blur-2xl pointer-events-none" />
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#001e40]">
              <FileText size={20} className="text-[#feb234]" />
              <h3 className="font-sans font-black text-lg text-[#001e40] tracking-tight">Kuesioner Tracer Study</h3>
            </div>
            <p className="text-xs text-slate-505 leading-relaxed font-sans">
              Silakan sumbangkan partisipasi data Anda dengan mengisi tracer karir untuk membantu pemetaan mutu almamater UPB pada SIMKATMAWA Kemendikbud.
            </p>
          </div>

          {submitSuccess ? (
            <div className="p-4 bg-yellow-500/10 border border-yellow-300 text-[#feb234] text-xs leading-relaxed rounded-xl font-sans animate-fade-in">
              <span className="font-bold block mb-1">✓ Berhasil Melaporkan Karir!</span>
              Terima kasih atas kontribusi luhur Anda. Data kelulusan karir Anda berhasil masuk ke dalam database dinamis simulasi kemahasiswaan Universitas Pelita Bangsa.
            </div>
          ) : (
            <form onSubmit={handleSubmit(handleTracerSubmit)} className="space-y-4 font-sans text-xs">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-slate-700 block font-bold" htmlFor="fullName">Nama Lengkap Alumni</label>
                <input
                  id="fullName"
                  type="text"
                  {...register('name')}
                  className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white text-xs ${
                    errors.name ? 'border-red-500/80 focus:border-red-500' : 'border-slate-200 focus:border-[#001e40]'
                  }`}
                  placeholder="Contoh: Sarah Amanda"
                />
                {errors.name && (
                  <span className="text-red-500 text-[10px] font-sans block mt-1">{errors.name.message}</span>
                )}
              </div>

              {/* Graduation Year & Major */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 block font-bold" htmlFor="graduationYear">Tahun Wisuda</label>
                  <select
                    id="graduationYear"
                    {...register('graduationYear')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#001e40] focus:bg-white text-xs font-sans"
                  >
                    <option value="2024">Wisuda 2024</option>
                    <option value="2023">Wisuda 2023</option>
                    <option value="2022">Wisuda 2022</option>
                    <option value="2021">Wisuda 2021</option>
                    <option value="2020">Wisuda 2020</option>
                  </select>
                  {errors.graduationYear && (
                    <span className="text-red-500 text-[10px] font-sans block mt-1">{errors.graduationYear.message}</span>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 block font-bold" htmlFor="major">Program Studi</label>
                  <select
                    id="major"
                    {...register('major')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#001e40] focus:bg-white text-xs font-sans"
                  >
                    <option value="Teknik Informatika">Teknik Informatika</option>
                    <option value="Sistem Informasi">Sistem Informasi</option>
                    <option value="Manajemen">Manajemen</option>
                    <option value="Teknik Industri">Teknik Industri</option>
                    <option value="Akuntansi">Akuntansi</option>
                  </select>
                  {errors.major && (
                    <span className="text-red-500 text-[10px] font-sans block mt-1">{errors.major.message}</span>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-slate-700 block font-bold" htmlFor="careerStatus">Status Alumni Saat Ini</label>
                <select
                  id="careerStatus"
                  {...register('status')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 focus:outline-none focus:border-[#001e40] focus:bg-white text-xs font-sans"
                >
                  <option value="Bekerja">Bekerja (Karyawan/PNS/TNI-Polri)</option>
                  <option value="Wirausaha">Wirausaha (Pemilik Usaha/Startup)</option>
                  <option value="Lanjut Studi">Lanjut Studi (Magister/S2)</option>
                  <option value="Mencari Kerja">Mencari Kerja / Sedang Transisi</option>
                </select>
                {errors.status && (
                  <span className="text-red-500 text-[10px] font-sans block mt-1">{errors.status.message}</span>
                )}
              </div>

              {/* Company & Position (Conditional display based on watchStatus) */}
              {watchStatus !== 'Mencari Kerja' && (
                <div className="grid grid-cols-2 gap-3 animate-fade-in duration-300 cursor-default">
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-slate-700 block font-bold" htmlFor="company">
                      {watchStatus === 'Lanjut Studi' ? 'Nama Universitas S2' : 'Nama Instansi / Usaha'}
                    </label>
                    <input
                      id="company"
                      type="text"
                      {...register('company')}
                      className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2 text-slate-800 focus:outline-none focus:bg-white text-xs ${
                        errors.company ? 'border-red-500/80 focus:border-red-500' : 'border-slate-200 focus:border-[#001e40]'
                      }`}
                      placeholder={watchStatus === 'Lanjut Studi' ? 'Contoh: ITB / Universitas Indonesia' : 'Contoh: PT Tokopedia'}
                    />
                    {errors.company && (
                      <span className="text-red-500 text-[10px] font-sans block mt-1 leading-normal">{errors.company.message}</span>
                    )}
                  </div>
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-slate-700 block font-bold" htmlFor="position">
                      {watchStatus === 'Lanjut Studi' ? 'Program Konsentrasi' : 'Jabatan / Posisi'}
                    </label>
                    <input
                      id="position"
                      type="text"
                      {...register('position')}
                      className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2 text-slate-800 focus:outline-none focus:bg-white text-xs ${
                        errors.position ? 'border-red-500/80 focus:border-red-500' : 'border-slate-200 focus:border-[#001e40]'
                      }`}
                      placeholder={watchStatus === 'Lanjut Studi' ? 'Contoh: S2 Sains Komputer' : 'Contoh: Senior Developer'}
                    />
                    {errors.position && (
                      <span className="text-red-500 text-[10px] font-sans block mt-1 leading-normal">{errors.position.message}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <Send size={13} className="text-[#feb234]" />
                <span>Kirim Data Karir Saya</span>
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
