'use client';

import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { mockAdminRoleMatrices } from '../../data/mock/cases';
import { 
  BarChart3, 
  Sliders, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  X,
  Plus
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AdminRolesAnalyticsCMSPageProps {
  initialView?: 'roles' | 'analytics' | 'cms' | 'settings';
}

export const AdminRolesAnalyticsCMSPage: React.FC<AdminRolesAnalyticsCMSPageProps> = ({ initialView = 'roles' }) => {
  const { state } = useDemo();
  const [view, setView] = useState<'roles' | 'analytics' | 'cms' | 'settings'>(initialView);

  const [featuredSchoolId, setFeaturedSchoolId] = useState(state.schools[0]?.id || '');
  const [announcementText, setAnnouncementText] = useState('Welcome to SkoolFinder Ghana! 2026/2027 admissions diagnostic registrations are now open across Greater Accra.');

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Nav tabs */}
        <div className="flex border-b border-surface-border overflow-x-auto no-scrollbar gap-1 bg-white p-1 rounded-xl shadow-subtle">
          {[
            { id: 'roles', label: 'Identity & Admin Roles', icon: <Users className="w-4 h-4" /> },
            { id: 'analytics', label: 'Advanced Analytics', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'cms', label: 'Platform CMS & Featured', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'settings', label: 'System Configuration', icon: <Sliders className="w-4 h-4" /> },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setView(t.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                view === t.id
                  ? 'bg-[#0078D4] text-white shadow-sm'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-slate-100'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* VIEW: ROLES MATRIX */}
        {view === 'roles' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-ink-primary">Administrative Role Matrix Preview</h2>
              <p className="text-xs text-ink-secondary">Visual representation of governance access tiers across SkoolFinder Ghana</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockAdminRoleMatrices.map((role, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-surface-border space-y-4 shadow-subtle">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-ink-primary">{role.roleName}</h3>
                      <p className="text-xs text-ink-secondary mt-0.5">{role.description}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100">
                      {role.assignedUsersCount} Admins
                    </span>
                  </div>

                  <div className="pt-2 border-t space-y-2 text-xs">
                    <span className="font-bold text-ink-muted uppercase tracking-wider block text-[10px]">
                      Designated Permission Gates:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(role.permissions).map(([perm, allowed]) => (
                        <div key={perm} className="flex items-center gap-2 text-ink-secondary">
                          {allowed ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-300" />}
                          <span className={allowed ? 'font-semibold text-ink-primary' : 'line-through text-slate-400'}>
                            {perm.replace(/([A-Z])/g, ' $1')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: ANALYTICS */}
        {view === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-ink-primary">Ecosystem Cross-Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border space-y-3">
                <h3 className="text-sm font-bold">Inquiry Volumes by Locality</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { loc: 'East Legon', enquiries: 42 },
                      { loc: 'Cantonments', enquiries: 38 },
                      { loc: 'Tema', enquiries: 29 },
                      { loc: 'Achimota', enquiries: 24 },
                      { loc: 'Dansoman', enquiries: 19 },
                      { loc: 'Spintex', enquiries: 17 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="loc" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="enquiries" fill="#C5A55A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border space-y-3">
                <h3 className="text-sm font-bold">Supply Chain RFQ Fulfillments</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { cat: 'Stationery', bids: 12 },
                      { cat: 'ICT', bids: 9 },
                      { cat: 'Furniture', bids: 8 },
                      { cat: 'Transport', bids: 6 },
                      { cat: 'Science', bids: 5 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="cat" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="bids" fill="#102A43" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: CMS */}
        {view === 'cms' && (
          <div className="bg-white rounded-2xl p-6 border space-y-6 max-w-2xl">
            <div>
              <h2 className="text-xl font-bold text-ink-primary">Platform Content Curator</h2>
              <p className="text-xs text-ink-secondary">Manage announcements and featured showcase</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 uppercase">Top Announcement Banner</label>
                <textarea
                  rows={2}
                  value={announcementText}
                  onChange={e => setAnnouncementText(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-xs focus:border-brand-navy outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 uppercase">Spotlight Featured School</label>
                <select
                  value={featuredSchoolId}
                  onChange={e => setFeaturedSchoolId(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-xs bg-white"
                >
                  {state.schools.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.locality})</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <Button variant="primary" onClick={() => alert('CMS updates simulated successfully!')}>
                  Save & Publish to Public Site
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SETTINGS */}
        {view === 'settings' && (
          <div className="bg-white rounded-2xl p-6 border space-y-4 max-w-xl">
            <h2 className="text-xl font-bold text-ink-primary">System Settings</h2>
            <Input label="Default Geographic Scope" defaultValue="Greater Accra, Ghana" disabled />
            <Input label="Supported Currency" defaultValue="Ghana Cedi (GHS)" disabled />
            <Input label="Demonstration Reset Cycle" defaultValue="Browser Memory & LocalStorage" disabled />
            <div className="pt-2">
              <Button variant="outline" onClick={() => alert('Platform configurations are managed via demo state.')}>
                Confirm Settings
              </Button>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
