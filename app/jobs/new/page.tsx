'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, User, Calendar, DollarSign, FileText } from 'lucide-react'
import { INSPECTION_TYPES } from '@/types'

const INSPECTION_FEES = {
  pre_purchase_standard: 479,
  building_only: 399,
  pest_only: 299,
  stage: 299,
  dilapidation: 549,
}

export default function NewJobPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    property_address: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    inspection_type: 'pre_purchase_standard',
    scheduled_date: '',
    scheduled_time: '09:00',
    fee: 479,
    notes: '',
    send_agreement: true,
  })

  const handleTypeChange = (type: string) => {
    setForm(prev => ({
      ...prev,
      inspection_type: type,
      fee: INSPECTION_FEES[type as keyof typeof INSPECTION_FEES] || 479,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production: save to Supabase, send agreement email
    alert('Job created! Agreement email sent to client.')
    router.push('/jobs')
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/jobs" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Job</h1>
          <p className="text-slate-500 text-sm mt-0.5">Create a new inspection booking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Property</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Property Address *</label>
              <input
                type="text"
                required
                value={form.property_address}
                onChange={e => setForm(prev => ({ ...prev, property_address: e.target.value }))}
                placeholder="14/18 Orchard Street, West Ryde NSW 2114"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Client */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Client Details</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={form.client_name}
                onChange={e => setForm(prev => ({ ...prev, client_name: e.target.value }))}
                placeholder="Jane Smith"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input
                type="tel"
                value={form.client_phone}
                onChange={e => setForm(prev => ({ ...prev, client_phone: e.target.value }))}
                placeholder="0412 345 678"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
              <input
                type="email"
                required
                value={form.client_email}
                onChange={e => setForm(prev => ({ ...prev, client_email: e.target.value }))}
                placeholder="jane@email.com"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Inspection Type */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Inspection Type</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(INSPECTION_TYPES).map(([key, label]) => (
              <label
                key={key}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                  form.inspection_type === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="inspection_type"
                    value={key}
                    checked={form.inspection_type === key}
                    onChange={() => handleTypeChange(key)}
                    className="text-blue-600"
                  />
                  <span className="text-sm font-medium text-slate-900">{label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-600">
                  ${INSPECTION_FEES[key as keyof typeof INSPECTION_FEES]}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Schedule & Fee */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Schedule & Fee</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date *</label>
              <input
                type="date"
                required
                value={form.scheduled_date}
                onChange={e => setForm(prev => ({ ...prev, scheduled_date: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Time *</label>
              <input
                type="time"
                required
                value={form.scheduled_time}
                onChange={e => setForm(prev => ({ ...prev, scheduled_time: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Fee (AUD) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  required
                  value={form.fee}
                  onChange={e => setForm(prev => ({ ...prev, fee: Number(e.target.value) }))}
                  className="w-full pl-7 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Access instructions, special conditions..."
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Agreement */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.send_agreement}
              onChange={e => setForm(prev => ({ ...prev, send_agreement: e.target.checked }))}
              className="mt-0.5 text-blue-600 rounded"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">Send client agreement automatically</p>
              <p className="text-xs text-slate-500 mt-0.5">Client will receive an email with a link to sign the inspection agreement before the job.</p>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Create Job
          </button>
          <Link
            href="/jobs"
            className="px-6 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
