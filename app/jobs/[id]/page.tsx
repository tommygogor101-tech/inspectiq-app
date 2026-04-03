import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, MapPin, User, Calendar, DollarSign, FileText, CheckCircle, Clock, AlertCircle, ExternalLink, Send, Play } from 'lucide-react'
import Link from 'next/link'

const job = {
  id: '1',
  address: '14/18 Orchard Street, West Ryde NSW 2114',
  client_name: 'Celina Hansen',
  client_email: 'celinahansen7@gmail.com',
  client_phone: '0412 789 456',
  type: 'Pre-Purchase Standard (Building + Pest)',
  date: '2026-03-30',
  time: '9:00 AM',
  fee: 479,
  status: 'completed',
  inspector: 'Tommy Damir',
  licence: '241494C',
  notes: 'Access via front gate code 1234. Owner will not be present.',
  agreementSigned: true,
  agreementSignedAt: '2026-03-29 14:22',
  reportStatus: 'delivered',
  invoiceStatus: 'paid',
  invoicePaidAt: '2026-03-30 16:45',
  property: {
    building_type: 'Apartment',
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    floor_area: 78,
    year_built: 1996,
    approx_age: 30,
  },
  agent: {
    name: 'Sarah Chen',
    company: 'Ray White West Ryde',
    phone: '0411 234 567',
  },
  timeline: [
    { time: '2026-03-29 10:15', event: 'Job created', icon: 'create' },
    { time: '2026-03-29 10:16', event: 'Agreement email sent to Celina Hansen', icon: 'email' },
    { time: '2026-03-29 14:22', event: 'Client signed agreement', icon: 'check' },
    { time: '2026-03-30 09:00', event: 'Inspection started', icon: 'play' },
    { time: '2026-03-30 11:45', event: 'Report finalised', icon: 'report' },
    { time: '2026-03-30 11:46', event: 'Payment link sent to client', icon: 'email' },
    { time: '2026-03-30 16:45', event: 'Payment received — $479.00', icon: 'paid' },
    { time: '2026-03-30 16:45', event: 'Report delivered to client', icon: 'check' },
  ],
}

const statusColors: Record<string, string> = {
  booked: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  awaiting_payment: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-purple-100 text-purple-700',
  draft: 'bg-slate-100 text-slate-600',
  paid: 'bg-green-100 text-green-700',
  delivered: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/jobs" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">{job.address}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[job.status]}`}>
              {job.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">{job.type} · {formatDate(job.date)} at {job.time}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-8">
        {job.reportStatus === 'delivered' ? (
          <Link href={`/reports/${job.id}`} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <FileText className="w-4 h-4" />View Report
          </Link>
        ) : (
          <Link href={`/reports/${job.id}`} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Play className="w-4 h-4" />Start Report
          </Link>
        )}
        <Link href={`/portal/${job.id}`} className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <ExternalLink className="w-4 h-4" />Client Portal
        </Link>
        {!job.agreementSigned && (
          <button className="flex items-center gap-2 border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Send className="w-4 h-4" />Resend Agreement
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column */}
        <div className="col-span-2 space-y-6">
          {/* Property Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h2 className="font-semibold text-slate-900">Property Details</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Type', value: job.property.building_type },
                { label: 'Bedrooms', value: job.property.bedrooms },
                { label: 'Bathrooms', value: job.property.bathrooms },
                { label: 'Parking', value: job.property.parking },
                { label: 'Floor Area', value: `${job.property.floor_area}m²` },
                { label: 'Year Built', value: `${job.property.year_built} (~${job.property.approx_age} yrs)` },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Client + Agent */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-blue-600" />
                <h2 className="font-semibold text-slate-900">Client</h2>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">{job.client_name}</p>
                <p className="text-sm text-slate-500">{job.client_email}</p>
                <p className="text-sm text-slate-500">{job.client_phone}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-slate-400" />
                <h2 className="font-semibold text-slate-900">Referring Agent</h2>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">{job.agent.name}</p>
                <p className="text-sm text-slate-500">{job.agent.company}</p>
                <p className="text-sm text-slate-500">{job.agent.phone}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {job.notes && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-3">Notes</h2>
              <p className="text-sm text-slate-600">{job.notes}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Activity Timeline</h2>
            <div className="space-y-4">
              {job.timeline.map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${event.icon === 'paid' || event.icon === 'check' ? 'bg-green-100' : event.icon === 'email' ? 'bg-blue-100' : 'bg-slate-100'}`}>
                    {event.icon === 'check' || event.icon === 'paid' ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    ) : event.icon === 'email' ? (
                      <Send className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-800">{event.event}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — Status cards */}
        <div className="space-y-4">
          {/* Fee */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <h2 className="font-semibold text-slate-900">Fee</h2>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(job.fee)}</p>
            <p className="text-xs text-slate-400 mt-1">incl. GST</p>
          </div>

          {/* Agreement */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-3">Agreement</h2>
            {job.agreementSigned ? (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">Signed</p>
                  <p className="text-xs text-slate-400">{job.agreementSignedAt}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-700">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm font-medium">Not yet signed</p>
              </div>
            )}
          </div>

          {/* Report */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-3">Report</h2>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[job.reportStatus]}`}>
              {job.reportStatus.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </span>
            <div className="mt-3">
              <Link href={`/reports/${job.id}`} className="text-sm text-blue-600 hover:underline">
                {job.reportStatus === 'delivered' ? 'View report →' : 'Continue report →'}
              </Link>
            </div>
          </div>

          {/* Invoice */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-3">Invoice</h2>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[job.invoiceStatus]}`}>
              {job.invoiceStatus.replace(/\b\w/g, c => c.toUpperCase())}
            </span>
            {job.invoiceStatus === 'paid' && (
              <p className="text-xs text-slate-400 mt-2">Paid {job.invoicePaidAt}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
