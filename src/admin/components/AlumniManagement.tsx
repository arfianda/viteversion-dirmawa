import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle, RefreshCw, Download, Database, Users, Plus, Check, Trash2 } from 'lucide-react';
import { AlumniRecord } from '../types';
import * as XLSX from 'xlsx';

interface AlumniManagementProps {
  alumni: AlumniRecord[];
  onAddAlumni: (record: Omit<AlumniRecord, 'id'>) => void;
  onBulkAddAlumni: (records: Omit<AlumniRecord, 'id'>[]) => void;
  onDeleteAlumni?: (id: string) => void;
}

export default function AlumniManagement({ alumni, onAddAlumni, onBulkAddAlumni, onDeleteAlumni }: AlumniManagementProps) {
  const [dragActive, setDragActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'completed'>('idle');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form input states
  const [newName, setNewName] = useState('');
  const [newNim, setNewNim] = useState('');
  const [newProdi, setNewProdi] = useState('Teknik Informatika');
  const [newYear, setNewYear] = useState('2024');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(() => new Date());

  // Reset to first page when alumni list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [alumni]);

  const formatLastSyncTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `Today, ${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const parseAndUploadFile = (file: File) => {
    setSuccessMessage(`Parsing file: ${file.name}...`);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to JSON array
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (!jsonData || jsonData.length === 0) {
          throw new Error("File Excel kosong atau tidak memiliki data.");
        }
        
        // Map Excel rows to AlumniRecord
        const parsedRecords: Omit<AlumniRecord, 'id'>[] = jsonData.map((row: any) => {
          const name = row['Nama'] || row['Nama Lengkap'] || '';
          const nim = String(row['Nomor Mhs'] || row['NIM'] || row['Nim'] || '');
          const prodiCode = String(row['Kode Prodi'] || '');
          const email = row['Email'] || '';
          const graduationYear = parseInt(row['Tahun Lulus'] || row['Angkatan'] || new Date().getFullYear().toString(), 10);
          
          // Map Prodi Code to Name
          let prodi = 'Teknik Informatika';
          if (prodiCode === '62401') {
            prodi = 'Akuntansi';
          } else if (prodiCode === '57201') {
            prodi = 'Sistem Informasi';
          } else if (prodiCode === '61201') {
            prodi = 'Manajemen';
          } else if (prodiCode === '22201') {
            prodi = 'Teknik Sipil';
          } else if (prodiCode === '26201') {
            prodi = 'Teknik Industri';
          } else if (prodiCode === '55201') {
            prodi = 'Teknik Informatika';
          } else if (row['Prodi'] || row['Program Studi']) {
            prodi = row['Prodi'] || row['Program Studi'];
          }
          
          // NIM Validation: 8 to 11 digits
          const status: 'Valid' | 'Invalid NIM' = (nim.length >= 8 && nim.length <= 11 && /^\d+$/.test(nim)) ? 'Valid' : 'Invalid NIM';
          
          return {
            name,
            nim,
            prodi,
            graduationYear,
            status,
            email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@alumni.pelitabangsa.ac.id`
          };
        }).filter(r => r.name.trim() !== '' && r.nim.trim() !== '');
        
        if (parsedRecords.length === 0) {
          throw new Error("Tidak ada data alumni yang valid dengan Nama dan NIM.");
        }

        onBulkAddAlumni(parsedRecords);
        setLastSyncTime(new Date());
        setSuccessMessage(`Successfully uploaded and parsed "${file.name}"! ${parsedRecords.length} records verified.`);
        setTimeout(() => setSuccessMessage(null), 4000);
      } catch (err: any) {
        console.error(err);
        setSuccessMessage(null);
        alert(`Gagal memproses file: ${err.message || err}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      parseAndUploadFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const sampleUpload = async () => {
    try {
      setSuccessMessage("Fetching SAMPLETRACER.xlsx...");
      const response = await fetch('/SAMPLETRACER.xlsx');
      if (!response.ok) {
        throw new Error("Gagal mengambil file SAMPLETRACER.xlsx dari server.");
      }
      const blob = await response.blob();
      const file = new File([blob], "SAMPLETRACER.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      parseAndUploadFile(file);
    } catch (err: any) {
      console.error(err);
      setSuccessMessage(null);
      alert(`Gagal memuat sample file: ${err.message || err}`);
    }
  };

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('completed');
      setLastSyncTime(new Date());
      setTimeout(() => setSyncStatus('idle'), 3000);
    }, 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newNim) {
      alert("Please fill in Name and NIM!");
      return;
    }

    // A simple NIM validator: lets say typically expects 10 characters for valid
    const status: 'Valid' | 'Invalid NIM' = (newNim.length >= 8 && newNim.length <= 11) ? 'Valid' : 'Invalid NIM';

    onAddAlumni({
      name: newName,
      nim: newNim,
      prodi: newProdi,
      graduationYear: parseInt(newYear, 10),
      status,
      email: `${newName.toLowerCase().replace(/\s+/g, '.')}@alumni.pelitabangsa.ac.id`
    });

    // Reset Form
    setNewName('');
    setNewNim('');
    setNewProdi('Teknik Informatika');
    setNewYear('2024');
    setShowAddModal(false);

    setSuccessMessage(`Alumni student "${newName}" added successfully.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDownloadExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(alumni.map(a => ({
        'Nama': a.name,
        'NIM': a.nim,
        'Program Studi': a.prodi,
        'Tahun Lulus': a.graduationYear,
        'Status NIM': a.status,
        'Email': a.email || ''
      })));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Alumni");
      XLSX.writeFile(workbook, "UPB_Alumni_Data.xlsx");
      setSuccessMessage("Alumni database successfully exported to Excel!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      alert(`Gagal mengekspor data: ${err.message || err}`);
    }
  };

  // Pagination calculations
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = alumni.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(alumni.length / rowsPerPage);

  // Integrity calculation
  const totalCount = alumni.length;
  const validCount = alumni.filter(a => a.status === 'Valid').length;
  const integrityRatio = totalCount > 0 ? ((validCount / totalCount) * 100).toFixed(1) : "100";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#001e40] text-white px-5 py-4 rounded-xl shadow-xl flex items-center gap-3 border border-[#feb234]/30">
          <CheckCircle size={20} className="text-[#feb234]" />
          <span className="text-sm font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline font-bold text-3xl text-[#191c1e]">Alumni Data Hub</h2>
          <p className="text-sm text-[#43474f] font-medium">Manage, verify, and synchronize alumni records across systems.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={handleDownloadExcel}
            className="flex-1 md:flex-none border border-[#815500] text-[#815500] bg-white hover:bg-[#815500]/5 font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download size={16} />
            Export Data
          </button>
          <button
            onClick={handleSync}
            disabled={syncStatus === 'syncing'}
            className="flex-1 md:flex-none bg-[#001e40] hover:bg-[#1f477b] text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            <Database size={16} />
            {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'completed' ? 'Synced ✅' : 'Sync to Database'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#feb234] hover:bg-[#feb234]/90 text-[#291800] font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            Add Record
          </button>
        </div>
      </div>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column (span 4): Drag & Drop, System Status */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-fit">
          
          {/* Upload card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#c3c6d1]/40 flex flex-col flex-1 min-h-[300px] justify-between z-10">
            <div>
              <h3 className="font-headline font-bold text-[#191c1e] text-lg mb-1">Upload Records</h3>
              <p className="text-xs text-[#737780] font-medium mb-4">Validate student credentials batch via spreadsheets.</p>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer group ${
                dragActive
                  ? 'border-[#001e40] bg-[#001e40]/5'
                  : 'border-[#c3c6d1] bg-[#f2f4f7] hover:border-[#001e40]/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <div className="w-12 h-12 bg-[#d5e3ff] text-[#001e40] rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Upload size={24} />
              </div>
              <p className="font-bold text-sm text-[#001e40] mb-0.5">Click to upload or drag and drop</p>
              <p className="text-xs text-[#737780] font-semibold">Excel (.xlsx) or CSV files only</p>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileSelect();
                }}
                className="mt-5 bg-white border border-[#c3c6d1] hover:bg-[#eceef1] text-[#191c1e] font-semibold text-xs py-2 px-4 rounded-lg shadow-sm transition-all"
              >
                Browse Files
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-[#eceef1]">
              <button
                type="button"
                onClick={sampleUpload}
                className="w-full text-center text-xs font-bold text-[#001e40] hover:text-[#1f477b] hover:underline"
              >
                💡 Simulate uploading UPB_Alumni_Data_Class_of_2024.xlsx
              </button>
            </div>
          </div>

          {/* System Status card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#c3c6d1]/40">
            <h3 className="font-headline font-bold text-[#191c1e] text-lg mb-4">System Status</h3>
            <div className="flex flex-col gap-4">
              
              <div className="flex items-center justify-between p-3.5 bg-[#f2f4f7] rounded-xl border border-[#c3c6d1]/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#d5e3ff]/60 text-[#001e40] rounded-lg">
                    <RefreshCw size={18} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#191c1e]">Last Sync</p>
                    <p className="text-xs text-[#737780] font-semibold">{formatLastSyncTime(lastSyncTime)}</p>
                  </div>
                </div>
                <Check className="text-[#815500] stroke-[3]" size={18} />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#f2f4f7] rounded-xl border border-[#c3c6d1]/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#d5e3ff]/60 text-[#001e40] rounded-lg">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#191c1e]">Data Integrity</p>
                    <p className="text-xs text-[#737780] font-semibold">{integrityRatio}% Valid Records</p>
                  </div>
                </div>
                <span className="bg-[#feb234] text-[#291800] text-xs font-bold px-3 py-1 rounded-full border border-[#feb234]">
                  Good
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Right column (span 8): Table Data Preview */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-[#c3c6d1]/40 overflow-hidden h-full flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-[#eceef1] flex justify-between items-center bg-[#f7f9fc]">
                <div>
                  <h3 className="font-headline font-bold text-[#191c1e] text-lg">Data Preview</h3>
                  <p className="text-xs text-[#43474f] font-medium mt-0.5">Showing parsed data from recent upload batch.</p>
                </div>
                <span className="bg-[#d5e3ff] text-[#001b3c] text-xs font-bold px-3 py-1.5 rounded-full border border-[#a7c8ff]/20">
                  {alumni.length} Rows Found
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f2f4f7] text-[#43474f] font-bold text-xs uppercase tracking-wider border-b border-[#c3c6d1]/30">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">NIM</th>
                      <th className="px-6 py-4">Prodi (Program)</th>
                      <th className="px-6 py-4 text-center">Graduation Year</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium divide-y divide-[#c3c6d1]/20 text-[#191c1e]">
                    {currentRows.map((record) => (
                      <tr
                        key={record.id}
                        className={`hover:bg-[#f2f4f7]/40 transition-colors ${
                          record.status === 'Invalid NIM' ? 'bg-[#ffdad6]/10' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-[#191c1e]">{record.name}</p>
                            <span className="text-xs text-[#737780] lowercase">{record.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#43474f] font-mono select-all">{record.nim}</td>
                        <td className="px-6 py-4">{record.prodi}</td>
                        <td className="px-6 py-4 text-center">{record.graduationYear}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold leading-none ${
                              record.status === 'Valid'
                                ? 'bg-[#d5e3ff] text-[#001e40] border border-[#a7c8ff]/30'
                                : 'bg-[#ffdad6] text-[#93000a] border border-[#ffdad6]'
                            }`}
                          >
                            {record.status === 'Valid' ? (
                              <>
                                <Check size={14} className="stroke-[3]" />
                                Valid
                              </>
                            ) : (
                              <>
                                <AlertTriangle size={14} />
                                Invalid NIM
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right pr-6">
                          {onDeleteAlumni && (
                            <button
                              onClick={() => onDeleteAlumni(record.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-all cursor-pointer inline-flex items-center justify-center"
                              title="Delete Alumni Record"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {alumni.length > 0 && (
              <div className="p-4 border-t border-[#eceef1] bg-[#f7f9fc] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-[#43474f]">
                <div className="flex flex-wrap items-center gap-2">
                  <span>Show</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setCurrentPage(1);
                    }}
                    className="bg-[#f2f4f7] border border-[#c3c6d1] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#001e40] font-bold cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>entries</span>
                  <span className="text-slate-400 font-medium ml-2">
                    Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, alumni.length)} of {alumni.length} entries
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-3 py-1.5 rounded-lg border border-[#c3c6d1] bg-white hover:bg-[#f2f4f7] disabled:opacity-50 disabled:hover:bg-white text-[#001e40] transition-colors cursor-pointer disabled:cursor-not-allowed font-bold"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 bg-[#001e40] text-white rounded-lg font-bold">
                    {currentPage} / {totalPages || 1}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1.5 rounded-lg border border-[#c3c6d1] bg-white hover:bg-[#f2f4f7] disabled:opacity-50 disabled:hover:bg-white text-[#001e40] transition-colors cursor-pointer disabled:cursor-not-allowed font-bold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Alumni Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#191c1e]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c6d1]/40 animate-fade-in">
            <h3 className="font-headline font-bold text-xl text-[#001e40] mb-4">Add Alumni Record</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Budi Santoso"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">NIM (Student ID)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1122334455"
                  value={newNim}
                  onChange={(e) => setNewNim(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40] font-mono"
                />
                <span className="text-[10px] text-[#737780] font-semibold mt-1 block">
                  NIM typical verification checks for 8-11 numeric digits.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Study Program (Prodi)</label>
                <select
                  value={newProdi}
                  onChange={(e) => setNewProdi(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                >
                  <option value="Teknik Informatika">Teknik Informatika</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                  <option value="Manajemen">Manajemen</option>
                  <option value="Akuntansi">Akuntansi</option>
                  <option value="Teknik Sipil">Teknik Sipil</option>
                  <option value="Teknik Industri">Teknik Industri</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Graduation Year</label>
                <select
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-[#eceef1]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-[#c3c6d1] text-[#43474f] text-sm font-bold rounded-xl hover:bg-[#f2f4f7] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Add Alumni Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
