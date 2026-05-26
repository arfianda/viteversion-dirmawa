import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle, RefreshCw, Download, Database, Users, Plus, Check } from 'lucide-react';
import { AlumniRecord } from '../types';

interface AlumniManagementProps {
  alumni: AlumniRecord[];
  onAddAlumni: (record: Omit<AlumniRecord, 'id'>) => void;
  onBulkAddAlumni: (records: Omit<AlumniRecord, 'id'>[]) => void;
}

export default function AlumniManagement({ alumni, onAddAlumni, onBulkAddAlumni }: AlumniManagementProps) {
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateFileUpload(e.dataTransfer.files[0].name);
    }
  };

  const simulateFileUpload = (fileName: string) => {
    setSuccessMessage(`Parsing file: ${fileName}...`);
    setTimeout(() => {
      // Create mock premium records to append
      const parsedRecords: Omit<AlumniRecord, 'id'>[] = [
        { name: 'Diana Ross', nim: '1122334461', prodi: 'Teknik Informatika', graduationYear: 2024, status: 'Valid', email: 'diana.ross@alumni.pelitabangsa.ac.id' },
        { name: 'Farhan Azis', nim: '112233', prodi: 'Sistem Informasi', graduationYear: 2023, status: 'Invalid NIM', email: 'farhan.azis@alumni.pelitabangsa.ac.id' },
        { name: 'Gita Gutawa', nim: '1122334463', prodi: 'Akuntansi', graduationYear: 2024, status: 'Valid', email: 'gita.gutawa@alumni.pelitabangsa.ac.id' },
        { name: 'Irfan Bachdim', nim: '1122334464', prodi: 'Manajemen', graduationYear: 2022, status: 'Valid', email: 'irfan.bachdim@alumni.pelitabangsa.ac.id' },
      ];
      onBulkAddAlumni(parsedRecords);
      setSuccessMessage(`Successfully uploaded and parsed "${fileName}"! Mock records verified.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1500);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateFileUpload(e.target.files[0].name);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const sampleUpload = () => {
    simulateFileUpload("UPB_Alumni_Data_Class_of_2024.xlsx");
  };

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('completed');
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
    alert("Exporting Alumni database to Excel format... Complete!");
  };

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
        <div className="lg:col-span-4 flex flex-col gap-6">
          
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
                    <p className="text-xs text-[#737780] font-semibold">Today, 09:42 AM</p>
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
                      <th className="px-6 py-4">Graduation Year</th>
                      <th className="px-6 py-4 text-right pr-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium divide-y divide-[#c3c6d1]/20 text-[#191c1e]">
                    {alumni.map((record) => (
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
                        <td className="px-6 py-4 text-right pr-6">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 border-t border-[#eceef1] bg-[#f7f9fc] text-center">
              <a
                href="#all-alumni"
                onClick={(e) => { e.preventDefault(); alert("You are currently viewing all imported records in real-time.")}}
                className="text-[#001e40] font-bold text-sm hover:underline cursor-pointer"
              >
                View All {alumni.length} Records
              </a>
            </div>
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
