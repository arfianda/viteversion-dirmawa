/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { AlumniRecord } from "../types";
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
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
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
  Legend,
} from "recharts";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from "@tanstack/react-table";

import { zodResolver } from "@hookform/resolvers/zod";

interface AlumniProps {
  alumniList: AlumniRecord[];
  setAlumniList: React.Dispatch<React.SetStateAction<AlumniRecord[]>>;
}

export default function AlumniView({ alumniList, setAlumniList }: AlumniProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("semua");
  const [selectedMajor, setSelectedMajor] = React.useState<string>("semua");

  // Majors list
  const majors = [
    "semua",
    "Teknik Informatika",
    "Sistem Informasi",
    "Manajemen",
    "Teknik Industri",
    "Akuntansi",
  ];

  // Status List
  const statuses = [
    "semua",
    "Bekerja",
    "Wirausaha",
    "Lanjut Studi",
    "Mencari Kerja",
  ];

  // Filter list statically before presenting to the data-table engine
  const filteredAlumni = React.useMemo(() => {
    return alumniList.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "semua" || a.status === selectedStatus;
      const matchesMajor =
        selectedMajor === "semua" || a.major === selectedMajor;

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
      value: statusCounts[key],
    }));
  }, [statusCounts]);

  const COLORS = ["#10B981", "#F5A623", "#3B82F6", "#EF4444"];

  // Graduation Year chart computation
  const yearCounts = React.useMemo(() => {
    return alumniList.reduce((acc: { [key: string]: number }, cur) => {
      const yr = cur.graduationYear.toString();
      acc[yr] = (acc[yr] || 0) + 1;
      return acc;
    }, {});
  }, [alumniList]);

  const barData = React.useMemo(() => {
    return Object.keys(yearCounts)
      .sort()
      .map((yr) => ({
        year: `${yr}`,
        Lulusan: yearCounts[yr],
      }));
  }, [yearCounts]);

  // Average employment metrics calculations
  const totalAlumniVal = alumniList.length;
  const workingCount = alumniList.filter((a) => a.status === "Bekerja").length;
  const entrepreneurCount = alumniList.filter(
    (a) => a.status === "Wirausaha",
  ).length;
  const studyCount = alumniList.filter(
    (a) => a.status === "Lanjut Studi",
  ).length;

  const employmentRate =
    totalAlumniVal > 0
      ? (
          ((workingCount + entrepreneurCount + studyCount) / totalAlumniVal) *
          100
        ).toFixed(1)
      : "0";

  // TanStack Table setup for dynamic UI mapping
  const columns = React.useMemo<ColumnDef<AlumniRecord>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
              <span className="text-slate-900 font-bold font-sans block text-sm">
                {row.name}
              </span>
              <span className="text-slate-400 font-mono text-[9.5px]">
                ID: {row.id}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "graduationYear",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
              <span className="text-slate-800 block font-semibold text-xs">
                Wisuda {row.graduationYear}
              </span>
              <span className="text-slate-500 block text-[10.5px] font-mono leading-none mt-1">
                {row.major}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          return (
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold inline-block border ${
                status === "Bekerja"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : status === "Wirausaha"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : status === "Lanjut Studi"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "company",
        header: "Tempat Kerja / Posisi",
        cell: (info) => {
          const row = info.row.original;
          return row.status === "Mencari Kerja" ? (
            <span className="text-slate-400 italic text-xs font-sans">
              Fresh Graduate / Mencari Kerja
            </span>
          ) : (
            <div>
              <span className="text-slate-800 font-semibold block text-xs">
                {row.company}
              </span>
              <span className="text-slate-500 block text-[10.5px] mt-0.5">
                {row.position}
              </span>
            </div>
          );
        },
      },
    ],
    [],
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

  return (
    <div className="space-y-12">
      {/* Header title - Light, Elegant, High-contrast */}
      <div className="text-center space-y-3">
        <span className="font-mono text-xs font-black uppercase tracking-widest text-[#feb234] block">
          DATA TRACER ALUMNI
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight">
          Tracer Alumni & Pelacakan Karir
        </h1>
        <p className="text-sm sm:text-base text-slate-505 max-w-2xl mx-auto font-sans leading-relaxed">
          Menganalisis keterserapan industri kerja, memvisualisasikan daya saing
          lulusan, serta mengarahkan alumni untuk mengisi kuesioner pelacakan karir terpadu pada portal Tracer Study resmi
          (Tracer Study).
        </p>
      </div>

      {/* Stats Counter metrics - Clean containers matching the site style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Alumni Terlacak",
            value: `${totalAlumniVal} Wisudawan`,
            sub: "Tercatat di Sistem Tracer",
            icon: Database,
          },
          {
            label: "Indeks Keterserapan Kerja",
            value: `${employmentRate}%`,
            sub: "Bekerja/Wirausaha/S2",
            icon: UserCheck,
          },
          {
            label: "Aktif Berwirausaha",
            value: `${entrepreneurCount} Startup`,
            sub: "Mandiri Ekonomi Kreatif",
            icon: Users,
          },
          {
            label: "Studi Magister (S2)",
            value: `${studyCount} Mahasiswa`,
            sub: "Lanjutan Riset Akademik",
            icon: BookOpen,
          },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-slate-50 p-2.5 rounded-xl text-[#001e40]">
                <Icon size={18} />
              </div>
              <span className="text-slate-500 text-[11px] font-sans font-bold uppercase tracking-wider block">
                {item.label}
              </span>
              <span className="text-[#001e40] text-xl sm:text-2xl font-black font-sans block pt-1">
                {item.value}
              </span>
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-medium">
                {item.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* VISUALIZATION CHARTS COLS - Light themed container styles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Status Breakdown (PieChart) */}
        <div
          id="status-chart"
          className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-sm"
        >
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#feb234] uppercase font-bold tracking-widest block">
              Visualisasi Sebaran
            </span>
            <h3 className="font-sans font-black text-[#001e40] tracking-tight text-lg">
              Distribusi Karir & Status Alumni
            </h3>
          </div>
          <div className="h-64 relative font-sans text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#e2e8f0",
                    color: "#1e293b",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-sans text-slate-505 pt-2">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Graduation Trend (BarChart) - Clean & identical to the mockup layout */}
        <div
          id="trend-chart"
          className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-sm"
        >
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#feb234] uppercase font-bold tracking-widest block">
              Rasio Angkatan
            </span>
            <h3 className="font-sans font-black text-[#001e40] tracking-tight text-lg">
              Jumlah Lulusan Berdasar Tahun Wisuda
            </h3>
          </div>
          <div className="h-64 font-sans text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
              >
                <XAxis
                  dataKey="year"
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#F1F5F9", opacity: 0.5 }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#e2e8f0",
                    color: "#1e293b",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="Lulusan"
                  fill="#001e40"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
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
            <span className="font-mono text-xs font-black uppercase text-[#feb234]">
              Direktori Sebaran Lulusan
            </span>
            <h2 className="font-sans font-extrabold text-2xl text-[#001e40] tracking-tight">
              Daftar Alumni Pelita Bangsa
            </h2>
          </div>

          {/* Filters area */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3.5 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Search text */}
              <div>
                <label className="text-slate-555 font-sans text-[10.5px] block font-bold mb-1 uppercase tracking-wide">
                  Cari Kelulusan
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={14}
                  />
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
                <label className="text-slate-555 font-sans text-[10.5px] block font-bold mb-1 uppercase tracking-wide">
                  Filter Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    table.setPageIndex(0);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#001e40] focus:bg-white transition-all"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st === "semua" ? "Semua Status" : st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Major select */}
              <div>
                <label className="text-slate-555 font-sans text-[10.5px] block font-bold mb-1 uppercase tracking-wide">
                  Filter Jurusan
                </label>
                <select
                  value={selectedMajor}
                  onChange={(e) => {
                    setSelectedMajor(e.target.value);
                    table.setPageIndex(0);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#001e40] focus:bg-white transition-all"
                >
                  {majors.map((mj) => (
                    <option key={mj} value={mj}>
                      {mj === "semua" ? "Semua Program Studi" : mj}
                    </option>
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
                    <tr
                      key={headerGroup.id}
                      className="bg-slate-50 text-slate-500 font-sans text-[10.5px] border-b border-slate-200 uppercase"
                    >
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="px-5 py-4 font-black">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/75 transition"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-5 py-4 whitespace-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {table.getRowModel().rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-12 text-center text-slate-400 font-sans italic"
                      >
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
                    {table.getState().pagination.pageIndex *
                      table.getState().pagination.pageSize +
                      1}
                    -
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) *
                        table.getState().pagination.pageSize,
                      filteredAlumni.length,
                    )}
                  </span>
                  <span>dari</span>
                  <span className="text-[#feb234] font-extrabold">
                    {filteredAlumni.length}
                  </span>
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
                    Hal{" "}
                    <span className="text-slate-900 font-bold">
                      {table.getState().pagination.pageIndex + 1}
                    </span>{" "}
                    dari{" "}
                    <span className="text-slate-900 font-bold">
                      {table.getPageCount()}
                    </span>
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

        {/* TRACER CALL TO ACTION CARD */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#001e40] to-[#002d61] p-6 sm:p-8 rounded-3xl text-white space-y-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[320px]">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#feb234]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#feb234]/15 text-[#feb234] flex items-center justify-center animate-none cursor-default">
                <FileText size={20} />
              </div>
              <h3 className="font-sans font-black text-lg text-white tracking-tight">
                Portal Tracer Study UPB
              </h3>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Tracer Study merupakan survei pelacakan alumni yang dilakukan untuk memetakan lulusan Universitas Pelita Bangsa. Partisipasi Anda sangat berharga bagi pemetaan mutu institusi, akreditasi kampus, serta evaluasi kurikulum akademik SIMKATMAWA Kemendikbud.
            </p>
            
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-start gap-3 select-none">
              <span className="text-lg">💡</span>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Pengisian Tracer Study asli dilakukan di platform resmi universitas. Klik tombol di bawah ini untuk menuju halaman pengisian Tracer Study yang sesungguhnya.
              </p>
            </div>
          </div>

          <a
            href="https://tracerstudy.pelitabangsa.ac.id"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-[#feb234] hover:bg-[#ffddb2] text-[#001e40] font-sans font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] duration-300 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Buka Website Tracer Study</span>
            <ExternalLink size={14} className="stroke-[2.5]" />
          </a>
        </div>
      </div>
    </div>
  );
}
