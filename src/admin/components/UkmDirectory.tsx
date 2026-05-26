import React, { useState } from 'react';
import { Search, PlusCircle, Eye, Edit2, Ban, RefreshCw, CheckCircle, Users } from 'lucide-react';
import { UkmRecord } from '../types';

interface UkmDirectoryProps {
  ukms: UkmRecord[];
  onAddUkm: (record: Omit<UkmRecord, 'id' | 'updatedAt'>) => void;
  onUpdateUkmStatus: (id: string, status: 'Active' | 'Inactive') => void;
  onEditUkm: (record: UkmRecord) => void;
}

export default function UkmDirectory({ ukms, onAddUkm, onUpdateUkmStatus, onEditUkm }: UkmDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<UkmRecord | null>(null);
  
  // Add UKM Form States
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Academic');
  const [newType, setNewType] = useState('Academic & Tech');
  const [newDesc, setNewDesc] = useState('');
  const [newLeader, setNewLeader] = useState('');

  // Filtering logic
  const filteredUkms = ukms.filter(ukm => {
    const matchesSearch = ukm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ukm.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ukm.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || ukm.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Sports', 'Arts & Culture', 'Academic'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDesc || !newLeader) {
      alert("Please fill in all layout fields!");
      return;
    }

    onAddUkm({
      name: newName,
      category: newCat,
      type: newType,
      status: 'Active',
      description: newDesc,
      leaderName: newLeader
    });

    // Reset layout form
    setNewName('');
    setNewCat('Academic');
    setNewType('Academic & Tech');
    setNewDesc('');
    setNewLeader('');
    setShowAddModal(false);
  };

  const toggleStatus = (id: string, current: 'Active' | 'Inactive') => {
    const nextStatus = current === 'Active' ? 'Inactive' : 'Active';
    onUpdateUkmStatus(id, nextStatus);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-headline font-bold text-3xl text-[#191c1e]">UKM &amp; Ormawa Directory</h2>
          <p className="text-sm text-[#43474f] max-w-2xl font-medium mt-1">
            Manage registered student organizations, monitor their active status, and oversee leadership profiles within the university ecosystem.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#001e40] hover:bg-[#1f477b] text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
          <PlusCircle size={18} />
          Add New UKM
        </button>
      </div>

      {/* Toolbar Filter / Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#c3c6d1]/40 flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-container-lowest">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737780]">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by name, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f2f4f7] text-[#191c1e] text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#c3c6d1] focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] transition-all font-medium"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#feb234] text-[#291800]'
                  : 'bg-[#f2f4f7] text-[#43474f] hover:bg-[#eceef1]'
              }`}
            >
              {cat === 'All' ? 'All Organizations' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUkms.map((ukm) => (
          <div
            key={ukm.id}
            className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-[#c3c6d1]/30 flex flex-col justify-between group ${
              ukm.status === 'Inactive' ? 'opacity-70' : ''
            }`}
          >
            <div>
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex gap-4 items-center min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-[#f2f4f7] border border-[#c3c6d1]/40 flex items-center justify-center overflow-hidden shrink-0">
                    {ukm.logoUrl ? (
                      <img
                        alt={`${ukm.name} logo`}
                        className="w-full h-full object-cover"
                        src={ukm.logoUrl}
                        onError={(e) => {
                          // Fallback to initial
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Users size={28} className="text-[#001e40]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3
                      onClick={() => setShowDetailModal(ukm)}
                      className="font-headline font-bold text-[#191c1e] text-base leading-tight group-hover:text-[#001e40] transition-colors cursor-pointer truncate"
                    >
                      {ukm.name}
                    </h3>
                    <p className="text-xs font-bold text-[#737780] mt-1 truncate">{ukm.type}</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0 ${
                    ukm.status === 'Active'
                      ? 'bg-[#feb234]/20 text-[#6d4700]'
                      : 'bg-[#eceef1] text-[#43474f]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      ukm.status === 'Active' ? 'bg-[#feb234]' : 'bg-[#737780]'
                    }`}
                  ></span>
                  {ukm.status}
                </span>
              </div>

              <p className="text-xs text-[#43474f] font-medium line-clamp-3 mb-5">
                {ukm.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#eceef1] flex justify-between items-center mt-auto">
              <span className="text-[11px] font-semibold text-[#737780]">
                Updated: {ukm.updatedAt || 'Oct 24, 2023'}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setShowDetailModal(ukm)}
                  className="w-8 h-8 rounded-full bg-[#f2f4f7] hover:bg-[#001e40]/10 text-[#001e40] flex items-center justify-center transition-colors cursor-pointer"
                  title="View Profile"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => {
                    const desc = prompt(`Edit description for ${ukm.name}:`, ukm.description);
                    if (desc !== null) {
                      onEditUkm({ ...ukm, description: desc });
                    }
                  }}
                  className="w-8 h-8 rounded-full bg-[#f2f4f7] hover:bg-[#001e40]/10 text-[#001e40] flex items-center justify-center transition-colors cursor-pointer"
                  title="Edit details"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => toggleStatus(ukm.id, ukm.status)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    ukm.status === 'Active'
                      ? 'bg-[#f2f4f7] text-[#ba1a1a] hover:bg-[#ffdad6]'
                      : 'bg-green-50 text-green-700 hover:bg-green-200'
                  }`}
                  title={ukm.status === 'Active' ? 'Deactivate' : 'Reactivate'}
                >
                  {ukm.status === 'Active' ? <Ban size={14} /> : <CheckCircle size={14} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-[#c3c6d1]/30">
        <span className="text-xs font-semibold text-[#43474f]">
          Showing 1-{filteredUkms.length} of {ukms.length} organizations
        </span>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl border border-[#c3c6d1] text-[#191c1e] text-xs font-bold hover:bg-[#f2f4f7] disabled:opacity-50 transition-colors" disabled>
            Previous
          </button>
          <button className="px-4 py-2 rounded-xl border border-[#c3c6d1] text-[#191c1e] text-xs font-bold hover:bg-[#f2f4f7] transition-colors" onClick={() => alert("All UKM items currently rendered on single layout.")}>
            Next
          </button>
        </div>
      </div>

      {/* Add UKM Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#191c1e]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c6d1]/40">
            <h3 className="font-headline font-bold text-xl text-[#001e40] mb-4">Register New Student Organization (UKM)</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">UKM Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Futsal Club Pelita Bangsa"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => {
                      setNewCat(e.target.value);
                      if (e.target.value === 'Sports') setNewType('Sports & Athletics');
                      else if (e.target.value === 'Arts & Culture') setNewType('Arts & Performance');
                      else setNewType('Academic & Tech');
                    }}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Arts & Culture">Arts & Culture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Subtype</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sports & Recreation"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Leader name</label>
                <input
                  type="text"
                  required
                  placeholder="Student Leader's name"
                  value={newLeader}
                  onChange={(e) => setNewLeader(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the organization's goals, schedules, achievements..."
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
                  className="px-5 py-2.5 bg-[#001e40] text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Create UKM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-[#191c1e]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setShowDetailModal(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c6d1]/40" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4 border-b border-[#eceef1] pb-4">
              <div className="w-16 h-16 rounded-xl bg-[#f2f4f7] border border-[#c3c6d1]/40 flex items-center justify-center overflow-hidden shrink-0">
                {showDetailModal.logoUrl ? (
                  <img src={showDetailModal.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Users size={28} className="text-[#001e40]" />
                )}
              </div>
              <div>
                <span className="text-xs bg-[#feb234]/15 text-[#6d4700] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[#feb234]/20">
                  {showDetailModal.category}
                </span>
                <h3 className="font-headline font-bold text-[#001e40] text-lg mt-1">{showDetailModal.name}</h3>
              </div>
            </div>

            <div className="space-y-3 font-medium text-sm text-[#191c1e]">
              <div>
                <p className="text-xs text-[#737780] font-bold uppercase tracking-wider">Subtype / Type</p>
                <p className="text-[#191c1e] text-sm mt-0.5 font-semibold">{showDetailModal.type}</p>
              </div>

              <div>
                <p className="text-xs text-[#737780] font-bold uppercase tracking-wider">Current Leader</p>
                <p className="text-[#191c1e] text-sm mt-0.5 font-semibold">{showDetailModal.leaderName || 'To Be Appointed'}</p>
              </div>

              <div>
                <p className="text-xs text-[#737780] font-bold uppercase tracking-wider">Active Status</p>
                <p className="text-[#191c1e] text-sm mt-0.5 font-semibold">{showDetailModal.status}</p>
              </div>

              <div>
                <p className="text-xs text-[#737780] font-bold uppercase tracking-wider">Detailed Description</p>
                <p className="text-[#43474f] text-sm mt-0.5 leading-relaxed">{showDetailModal.description}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-5 border-t border-[#eceef1] mt-5">
              <button
                type="button"
                onClick={() => setShowDetailModal(null)}
                className="px-5 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
