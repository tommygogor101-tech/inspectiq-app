'use client'

import { use } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Phone, Mail, Building2, MapPin, Calendar,
  DollarSign, FileText, Star, TrendingUp, Clock, CheckCircle,
  Edit2, MessageSquare,
} from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

interface Contact {
  id: string
  name: string
  type: 'client' | 'agent' | 'lead'
  email: string
  phone: string
  company?: string
  jobs_count: number
  total_value: number
  referrals?: number
  notes?: string
  address?: string
}

interface Job {
  id: string
  address: string
  type: string
  date: string
  fee: number
  status: string
}

const CONTACTS: Record<string, Contact> = {
  '1': {
    id: '1',
    name: 'Celina Hansen',
    type: 'client',
    email: 'celina.hansen@gmail.com',
    phone: '0412 345 678',
    address: 'Crows Nest NSW 2065',
    jobs_count: 3,
    total_value: 1437,
    notes: 'Repeat buyer, always requests pre-purchase standard. Happy to refer friends.',
  },
  '2': {
    id: '2',
    name: 'Sarah Nguyen',
    type: 'agent',
    email: 'sarah.nguyen@raywhite.com',
    phone: '0411 234 567',
    company: 'Ray White Crows Nest',
    address: 'Crows Nest NSW 2065',
    jobs_count: 14,
    total_value: 6706,
    referrals: 14,
    notes: 'Top referring agent. Always sends buyers our way before auction. Prefers SMS contact.',
  },
  '3': {
    id: '3',
    name: 'Priya Patel',
    type: 'lead',
    email: 'priya.patel@gmail.com',
    phone: '0433 789 012',
    jobs_count: 0,
    total_value: 0,
    notes: 'Enquired about pre-purchase inspection for a property in Manly. Budget-conscious, looking at 3-bed houses.',
  },
}

const JOB_HISTORY: Record<string, Job[]> = {
  '1': [
    { id: '1', address: '14/18 Orchard Street, West Ryde NSW', type: 'Pre-Purchase Standard', date: '2026-04-04', fee: 479, status: 'booked' },
    { id: '2', address: '42 Willoughby Road, Crows Nest NSW', type: 'Building Only', date: '2026-01-15', fee: 399, status: 'completed' },
    { id: '3', address: '8 Glenmore Road, Paddington NSW', type: 'Pre-Purchase Standard', date: '2025-09-22', fee: 559, status: 'completed' },
  ],
  '2': [
    { id: '4', address: '22 Pacific Highway, Chatswood NSW', type: 'Pre-Purchase Standard', date: '2026-04-03', fee: 479, status: 'awaiting_payment' },
    { id: '5', address: '5/120 Bronte Road, Bondi Junction NSW', type: 'Building + Pest', date: '2026-04-02', fee: 479, status: 'delivered' },
    { id: '6', address: '77 Anzac Parade, Kensington NSW', type: 'Building Only', date: '2026-03-28', fee: 399, status: 'completed' },
  ],
  '3': [],
}

const AGENT_MONTHLY: Record<string, { month: string; referrals: number; value: number }[]> = {
  '2': [
    { month: 'Nov', referrals: 1, value: 479 },
    { month: 'Dec', referrals: 2, value: 958 },
    { month: 'Jan', referrals: 3, value: 1197 },
    { month: 'Feb', referrals: 2, value: 878 },
    { month: 'Mar', referrals: 4, value: 1916 },
    { month: 'Apr', referrals: 2, value: 958 },
  ],
}

const statusConfig: Record<string, { label: string; color: string }> = {
  booked: { label: 'Booked', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
  awaiting_payment: { label: 'Awaiting Payment', color: 'bg-amber-100 text-amber-700' },
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-600' },
}

const typeConfig: Record<string, { label: string; color: string }> = {
  client: { label: 'Client', color: 'bg-blue-100 text-blue-700' },
  agent: { label: 'Agent', color: 'bg-purple-100 text-purple-700' },
  lead: { label: 'Lead', color: 'bg-amber-100 text-amber-700' },
}

const avatarColors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500']

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const contact = CONTACTS[id] || CONTACTS['1']
  const jobs = JOB_HISTORY[id] || []
  const agentStats = AGENT_MONTHLY[id]
  const tc = typeConfig[contact.type]
  const colorIdx = parseInt(id) % avatarColors.length

  return (
    <div className="p-8 max-w-4xl">
      {/* Back */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/contacts" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{contact.name}</h1>
          <p className="text-slate-500 text-sm">{contact.company || contact.type}</p>
        </div>
        <button className="ml-auto flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Contact card */}
        <div className="col-span-1 space-y-4">
          {/* Profile card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col items-center mb-4">
              <div className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3',
                avatarColors[colorIdx]
              )}>
                {initials(contact.name)}
              </div>
              <p className="font-semibold text-slate-900 text-center">{contact.name}</p>
              {contact.company && (
                <p className="text-xs text-slate-500 text-center mt-0.5">{contact.company}</p>
              )}
              <span className={cn('mt-2 text-xs font-medium px-2 py-0.5 rounded-full', tc.color)}>
                {tc.label}
              </span>
            </div>

            <div className="space-y-2.5">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{contact.email}</span>
              </a>
              <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {contact.phone}
              </a>
              {contact.address && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {contact.address}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {contact.notes && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Notes</p>
              <p className="text-sm text-slate-600 leading-relaxed">{contact.notes}</p>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Actions</p>
            <Link href="/jobs/new" className="w-full flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 py-1">
              <Calendar className="w-3.5 h-3.5" />
              Book new job
            </Link>
            <button className="w-full flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 py-1">
              <MessageSquare className="w-3.5 h-3.5" />
              Send SMS
            </button>
            <button className="w-full flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 py-1">
              <Mail className="w-3.5 h-3.5" />
              Send email
            </button>
          </div>
        </div>

        {/* Right: Stats + history */}
        <div className="col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {contact.type === 'agent' ? (
              <>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <p className="text-xs text-slate-500 mb-1">Total Referrals</p>
                  <p className="text-2xl font-bold text-purple-700">{contact.referrals}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <p className="text-xs text-slate-500 mb-1">Revenue Generated</p>
                  <p className="text-2xl font-bold text-slate-900">${contact.total_value.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <p className="text-xs text-slate-500 mb-1">This Month</p>
                  <p className="text-2xl font-bold text-green-700">
                    {agentStats?.[agentStats.length - 1]?.referrals || 0}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <p className="text-xs text-slate-500 mb-1">Total Jobs</p>
                  <p className="text-2xl font-bold text-blue-700">{contact.jobs_count}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <p className="text-xs text-slate-500 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-slate-900">${contact.total_value.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <p className="text-xs text-slate-500 mb-1">Avg Fee</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${contact.jobs_count > 0 ? Math.round(contact.total_value / contact.jobs_count) : 0}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Agent referral chart */}
          {agentStats && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="font-semibold text-slate-900 mb-4">Monthly Referrals (Last 6 months)</p>
              <div className="flex items-end gap-3 h-24">
                {agentStats.map((m) => {
                  const maxVal = Math.max(...agentStats.map(s => s.referrals))
                  const pct = maxVal > 0 ? (m.referrals / maxVal) * 100 : 0
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-semibold text-slate-700">{m.referrals}</span>
                      <div className="w-full flex items-end" style={{ height: '64px' }}>
                        <div
                          className="w-full bg-purple-500 rounded-t"
                          style={{ height: `${Math.max(pct, 5)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{m.month}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Job history */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">
                {contact.type === 'agent' ? 'Referred Jobs' : 'Job History'}
              </h2>
            </div>
            {jobs.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-slate-400 text-sm">No jobs yet</p>
                <Link href="/jobs/new" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
                  Book first job →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {jobs.map(job => {
                  const sc = statusConfig[job.status] || { label: job.status, color: 'bg-slate-100 text-slate-600' }
                  return (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{job.address}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{job.type} · {formatDate(job.date)}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', sc.color)}>
                          {sc.label}
                        </span>
                        <span className="text-sm font-semibold text-slate-700">${job.fee}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
