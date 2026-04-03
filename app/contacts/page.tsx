'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Search, Plus, Phone, Mail, Star, Building2, User, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

type ContactType = 'client' | 'agent' | 'lead'

interface Contact {
  id: string
  name: string
  type: ContactType
  email: string
  phone: string
  company?: string
  jobs_count: number
  last_job?: string
  total_value: number
  referrals?: number
  notes?: string
}

const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Celina Hansen',
    type: 'client',
    email: 'celina.hansen@gmail.com',
    phone: '0412 345 678',
    jobs_count: 3,
    last_job: '2026-04-04',
    total_value: 1437,
    notes: 'Repeat buyer, always pre-purchase',
  },
  {
    id: '2',
    name: 'Sarah Nguyen',
    type: 'agent',
    email: 'sarah.nguyen@raywhite.com',
    phone: '0411 234 567',
    company: 'Ray White Crows Nest',
    jobs_count: 14,
    last_job: '2026-04-03',
    total_value: 6706,
    referrals: 14,
  },
  {
    id: '3',
    name: 'James Patterson',
    type: 'client',
    email: 'james.p@hotmail.com',
    phone: '0488 901 234',
    jobs_count: 1,
    last_job: '2026-04-04',
    total_value: 479,
  },
  {
    id: '4',
    name: 'Michael Chen',
    type: 'client',
    email: 'mchen@outlook.com',
    phone: '0401 567 890',
    jobs_count: 2,
    last_job: '2026-04-03',
    total_value: 878,
  },
  {
    id: '5',
    name: 'David Kowalski',
    type: 'agent',
    email: 'dkowalski@lji.com.au',
    phone: '0422 678 901',
    company: 'LJ Hooker Chatswood',
    jobs_count: 9,
    last_job: '2026-03-30',
    total_value: 4311,
    referrals: 9,
  },
  {
    id: '6',
    name: 'Emma Williams',
    type: 'client',
    email: 'emma.w@gmail.com',
    phone: '0499 345 678',
    jobs_count: 1,
    last_job: '2026-04-02',
    total_value: 479,
  },
  {
    id: '7',
    name: 'Priya Patel',
    type: 'lead',
    email: 'priya.patel@gmail.com',
    phone: '0433 789 012',
    jobs_count: 0,
    total_value: 0,
    notes: 'Enquired about pre-purchase, buying in Manly',
  },
  {
    id: '8',
    name: 'Rebecca Lawson',
    type: 'agent',
    email: 'rlawson@mcgrath.com.au',
    phone: '0455 890 123',
    company: 'McGrath Estate Agents',
    jobs_count: 6,
    last_job: '2026-03-28',
    total_value: 2874,
    referrals: 6,
  },
  {
    id: '9',
    name: 'Tony Moretti',
    type: 'lead',
    email: 'tony.moretti@icloud.com',
    phone: '0477 012 345',
    jobs_count: 0,
    total_value: 0,
    notes: 'Stage inspection needed for new build in Kellyville',
  },
  {
    id: '10',
    name: 'David Brown',
    type: 'client',
    email: 'david.brown.au@gmail.com',
    phone: '0413 456 789',
    jobs_count: 2,
    last_job: '2026-04-01',
    total_value: 848,
  },
]

type TabKey = 'all' | 'clients' | 'agents' | 'leads'

const TABS: { key: TabKey; label: string; filter?: ContactType }[] = [
  { key: 'all', label: 'All' },
  { key: 'clients', label: 'Clients', filter: 'client' },
  { key: 'agents', label: 'Agents', filter: 'agent' },
  { key: 'leads', label: 'Leads', filter: 'lead' },
]

const typeConfig: Record<ContactType, { label: string; color: string; icon: typeof User }> = {
  client: { label: 'Client', color: 'bg-blue-100 text-blue-700', icon: User },
  agent: { label: 'Agent', color: 'bg-purple-100 text-purple-700', icon: Building2 },
  lead: { label: 'Lead', color: 'bg-amber-100 text-amber-700', icon: TrendingUp },
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const avatarColors = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500',
  'bg-rose-500', 'bg-teal-500', 'bg-indigo-500', 'bg-orange-500',
]

export default function ContactsPage() {
  const [tab, setTab] = useState<TabKey>('all')
  const [search, setSearch] = useState('')

  const currentFilter = TABS.find(t => t.key === tab)?.filter

  const filtered = MOCK_CONTACTS
    .filter(c => !currentFilter || c.type === currentFilter)
    .filter(c =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-500 mt-1">Clients, agents, and leads in one place</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Contacts', value: MOCK_CONTACTS.length, color: 'text-slate-900' },
          { label: 'Agent Referrals (MTD)', value: MOCK_CONTACTS.filter(c => c.type === 'agent').reduce((a, c) => a + (c.referrals || 0), 0), color: 'text-purple-700' },
          { label: 'Active Leads', value: MOCK_CONTACTS.filter(c => c.type === 'lead').length, color: 'text-amber-700' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
            <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex gap-1">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  tab === t.key ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
          </div>
        </div>

        {/* Table */}
        <div className="divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No contacts found</div>
          ) : (
            filtered.map((contact, i) => {
              const tc = typeConfig[contact.type]
              const TypeIcon = tc.icon
              return (
                <Link
                  key={contact.id}
                  href={`/contacts/${contact.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
                >
                  {/* Avatar */}
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0',
                    avatarColors[i % avatarColors.length]
                  )}>
                    {initials(contact.name)}
                  </div>

                  {/* Name + company */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {contact.name}
                      </p>
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', tc.color)}>
                        {tc.label}
                      </span>
                    </div>
                    {contact.company && (
                      <p className="text-xs text-slate-500 mt-0.5">{contact.company}</p>
                    )}
                    {contact.notes && !contact.company && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{contact.notes}</p>
                    )}
                  </div>

                  {/* Contact info */}
                  <div className="hidden lg:flex flex-col gap-0.5 w-48">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Phone className="w-3 h-3" />
                      <span>{contact.phone}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right flex-shrink-0">
                    {contact.type === 'agent' ? (
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{contact.referrals} referrals</p>
                        <p className="text-xs text-slate-500">${contact.total_value.toLocaleString()} value</p>
                      </div>
                    ) : contact.jobs_count > 0 ? (
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{contact.jobs_count} jobs</p>
                        <p className="text-xs text-slate-500">${contact.total_value.toLocaleString()} spent</p>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">New lead</span>
                    )}
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
