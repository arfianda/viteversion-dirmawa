import React, { useState } from 'react';
import { Search, HelpCircle, PlusCircle, Sparkles, AlertTriangle, FileText, CheckSquare, Calendar, Edit2, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { ScholarshipRecord } from '../types';

interface ScholarshipsManagementProps {
  scholarships: ScholarshipRecord[];
  onAddScholarship: (record: Omit<ScholarshipRecord, 'id' | 'applicants'>) => void;
  onEditScholarship: (record: ScholarshipRecord) => void;
  onDeleteScholarship?: (id: string) => void;
}

export default function ScholarshipsManagement({ scholarships, onAddScholarship, onEditScholarship, onDeleteScholarship }: ScholarshipsManagementProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'Internal' | 'External' | 'Government'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);

  // Form input states
  const [newName, setNewName] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newType, setNewType] = useState<'Internal' | 'External' | 'Government'>('Internal');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState('Internal University');

  // Filter logic
  const filteredScholarships = scholarships.filter(item => {
    const matchesTab = activeTab === 'All' || item.type === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newProvider || !newDeadline) {
      alert("Please fill in Name, Provider, and Deadline!");
      return;
    }

    onAddScholarship({
      name: newName,
      provider: newProvider,
      deadline: newDeadline,
      status: 'Open',
      type: newType,
      description: newDesc || "No description provided.",
      category: newCat
    });

    // Reset Form
    setNewName('');
    setNewProvider('');
    setNewDeadline('');
    setNewType('Internal');
    setNewDesc('');
    setNewCat('Internal University');
    setShowAddModal(false);
  };

  const handleEdit = (item: ScholarshipRecord) => {
    const newNamePrompt = prompt(`Edit Name for "${item.name}":`, item.name);
    if (newNamePrompt !== null && newNamePrompt.trim() !== "") {
      onEditScholarship({
        ...item,
        name: newNamePrompt
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline font-bold text-3xl text-[#001e40] mb-1">Scholarships Management</h2>
          <p className="text-sm text-[#43474f] font-medium">Oversee applications, manage providers, and update scholarship statuses.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => setFaqOpen(true)}
            className="flex-1 md:flex-none border border-[#001e40] text-[#001e40] bg-white hover:bg-[#eceef1] font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle size={16} />
            Manage FAQ
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 md:flex-none bg-[#001e40] hover:bg-[#1f477b] text-white font-[#001e40] font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shadow-[#001e40]/10"
          >
            <PlusCircle size={16} />
            Add Scholarship
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#c3c6d1]/40 flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-container-lowest">
        
        {/* Category filter chips */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {['All', 'Internal', 'External', 'Government'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#001e40] text-white'
                  : 'bg-[#f2f4f7] text-[#43474f] hover:bg-[#eceef1]'
              }`}
            >
              {tab === 'All' ? 'All Categories' : tab}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="w-full md:w-72 flex items-center bg-[#f2f4f7] px-4 py-2.5 rounded-xl border border-[#c3c6d1] focus-within:border-[#001e40]">
          <Search size={18} className="text-[#737780] mr-2" />
          <input
            type="text"
            placeholder="Search scholarships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm text-[#191c1e] focus:ring-0 p-0 font-medium"
          />
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Data Table (Spans 2 columns) */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-[#c3c6d1]/45 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-[#eceef1] bg-[#f7f9fc] flex justify-between items-center">
              <h3 className="font-headline font-bold text-lg text-[#001e40]">Active Programs</h3>
              <span className="text-xs text-[#737780] font-semibold">Live applications database</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f2f4f7] text-[#43474f] font-bold text-xs uppercase tracking-wider border-b border-[#c3c6d1]/30">
                    <th className="p-4 pl-6">Scholarship Name</th>
                    <th className="p-4">Provider</th>
                    <th className="p-4">Deadline</th>
                    <th className="p-4 text-center">Applicants</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium divide-y divide-[#c3c6d1]/20 text-[#191c1e]">
                  {filteredScholarships.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f2f4f7]/30 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="font-bold text-[#001e40]">{item.name}</div>
                        <div className="text-xs text-[#737780] font-semibold mt-0.5">{item.category}</div>
                      </td>
                      <td className="p-4 text-[#191c1e]">{item.provider}</td>
                      <td className="p-4 text-[#737780]">{item.deadline}</td>
                      <td className="p-4 text-center font-bold text-[#191c1e]">{item.applicants?.toLocaleString() || 0}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.status === 'Open'
                              ? 'bg-[#feb234]/15 text-[#6d4700] border-[#feb234]/20'
                              : item.status === 'Soon'
                              ? 'bg-[#f2f4f7] text-[#737780] border-[#c3c6d1]/30'
                              : 'bg-[#001e40]/5 text-[#1f477b] border-[#001e40]/10'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              item.status === 'Open'
                                ? 'bg-[#feb234]'
                                : item.status === 'Soon'
                                ? 'bg-[#737780]'
                                : 'bg-[#001e40]'
                            }`}
                          ></span>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-[#737780] hover:text-[#001e40] p-1.5 rounded-lg hover:bg-[#f2f4f7] transition-all cursor-pointer inline-flex items-center justify-center"
                            title="Edit scholarship"
                          >
                            <Edit2 size={14} />
                          </button>
                          {onDeleteScholarship && (
                            <button
                              onClick={() => onDeleteScholarship(item.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-all cursor-pointer inline-flex items-center justify-center"
                              title="Delete scholarship"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table footer pagination */}
          <div className="p-4 border-t border-[#eceef1] bg-[#f7f9fc] flex justify-between items-center text-xs font-bold text-[#737780]">
            <span>Showing 1 to {filteredScholarships.length} of {scholarships.length} entries</span>
            <div className="flex gap-1.5 items-center">
              <button className="p-1 rounded hover:bg-[#eceef1] transition-colors cursor-pointer" disabled>
                <ChevronLeft size={16} />
              </button>
              <button className="w-7 h-7 rounded bg-[#001e40] text-white flex items-center justify-center text-xs">1</button>
              <button className="w-7 h-7 rounded hover:bg-[#eceef1] text-[#191c1e] flex items-center justify-center text-xs" onClick={() => alert("Simple demo rendering limited page parameters.")}>2</button>
              <button className="p-1 rounded hover:bg-[#eceef1] transition-colors cursor-pointer" onClick={() => alert("Simple demo rendering limited page parameters.")}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Side Widgets Panel */}
        <div className="flex flex-col gap-6">
          
          {/* Quick Stats Widget */}
          <div className="bg-white rounded-2xl p-6 border border-[#c3c6d1]/45 relative overflow-hidden group">
            <h3 className="font-headline font-bold text-[#001e40] text-lg mb-6 relative z-10">Application Stats</h3>
            <div className="space-y-4 relative z-10">
              
              <div className="flex justify-between items-center p-3.5 rounded-xl bg-[#f7f9fc] border border-[#c3c6d1]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#feb234]/15 flex items-center justify-center text-[#6d4700]">
                    <FileText size={18} />
                  </div>
                  <span className="text-sm font-bold text-[#191c1e]">Total Applicants</span>
                </div>
                <span className="font-headline font-bold text-lg text-[#001e40]">5,585</span>
              </div>

              <div className="flex justify-between items-center p-3.5 rounded-xl bg-[#f7f9fc] border border-[#c3c6d1]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#001e40]/5 flex items-center justify-center text-[#001e40]">
                    <CheckSquare size={18} />
                  </div>
                  <span className="text-sm font-bold text-[#191c1e]">Reviewed</span>
                </div>
                <span className="font-headline font-bold text-lg text-[#001e40]">3,120</span>
              </div>

            </div>
          </div>

          {/* Upcoming Deadlines Widget */}
          <div className="bg-[#001e40] text-[#799dd6] rounded-2xl p-6 shadow-lg shadow-[#001e40]/20 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-[#001e40] to-[#003366] opacity-75 z-0"></div>
            
            <div className="relative z-10 flex justify-between items-center mb-6">
              <h3 className="font-headline font-bold text-base text-white">Critical Deadlines</h3>
              <AlertTriangle className="text-[#feb234]" size={18} />
            </div>

            <ul className="relative z-10 space-y-4">
              <li className="flex gap-4 items-start pb-4 border-b border-white/10">
                <div className="bg-[#feb234] text-[#291800] rounded-xl py-1.5 px-3 text-center min-w-[56px] font-bold">
                  <div className="text-[9px] uppercase tracking-wider font-bold">Oct</div>
                  <div className="text-lg font-headline leading-none mt-0.5">15</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">Beasiswa Prestasi Akademik</div>
                  <div className="text-[11px] text-white/70 mt-1 font-semibold leading-relaxed">Internal evaluation closes</div>
                </div>
              </li>

              <li className="flex gap-4 items-start">
                <div className="bg-white/10 text-white border border-white/15 rounded-xl py-1.5 px-3 text-center min-w-[56px] font-bold">
                  <div className="text-[9px] uppercase tracking-wider font-bold">Nov</div>
                  <div className="text-lg font-headline leading-none mt-0.5">01</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">Djarum Foundation Plus</div>
                  <div className="text-[11px] text-white/70 mt-1 font-semibold leading-relaxed">Provider callback deadline</div>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Add Scholarship Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#191c1e]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c6d1]/40">
            <h3 className="font-headline font-bold text-xl text-[#001e40] mb-4">Post New Scholarship Opportunity</h3>
            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Scholarship Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beasiswa Bank Indonesia 2024"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Provider / Sponsor</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bank Indonesia / CSR"
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Funding Category</label>
                  <select
                    value={newType}
                    onChange={(e) => {
                      const typeVal = e.target.value as 'Internal' | 'External' | 'Government';
                      setNewType(typeVal);
                      if (typeVal === 'Internal') setNewCat('Internal University');
                      else if (typeVal === 'External') setNewCat('External Corporate');
                      else setNewCat('Government Agency');
                    }}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                  >
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
                    <option value="Government">Government</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-[#001e40] focus:ring-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Brief Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide GPA requirements, interview structures, monthly stipends, or criteria..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40] resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-[#eceef1]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-[#c3c6d1] text-[#43474f] text-sm font-bold rounded-xl hover:bg-[#f2f4f7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Create Scholarship Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQs Panel */}
      {faqOpen && (
        <div className="fixed inset-0 bg-[#191c1e]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setFaqOpen(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#c3c6d1]/40" onClick={e => e.stopPropagation()}>
            <h3 className="font-headline font-bold text-xl text-[#001e40] mb-4 border-b border-[#eceef1] pb-3">Student Scholarship FAQ Setup</h3>
            
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-xs text-[#001e40]">Q: How is Student GPAs Verified?</p>
                <p className="text-xs text-[#43474f] mt-1 font-medium leading-relaxed">A: GPAs are cross-synchronized with academic SIA system database instantly overnight.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-xs text-[#001e40]">Q: What happens to Incomplete Application Submissions?</p>
                <p className="text-xs text-[#43474f] mt-1 font-medium leading-relaxed">A: Drafts are auto-flagged for student alerts 48 hours prior to deadline closes.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-xs text-[#001e40]">Q: Are Alumni eligible for continuing External Scholarships?</p>
                <p className="text-xs text-[#43474f] mt-1 font-medium leading-relaxed">A: Specific corporate and postgraduate funding support allows alumni nominations.</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#eceef1] mt-5">
              <button
                type="button"
                onClick={() => setFaqOpen(false)}
                className="px-5 py-2.5 bg-[#001e40] text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
