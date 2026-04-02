import { formatCurrency, formatDate } from '@/lib/utils'
import { Calendar, Plus, Search, Filter, MapPin, User, Clock } from 'lucide-react'
import Link from 'next/link'

const jobs = [
  {
    id: '1',
    address: '14/18 Orchard Street, West Ryde NSW 2114',
    suburb: 'West Ryde',
    client: 'Celina Hansen',
    email: 'celinahansen7@gmail.com',
    type: 'Pre-Purchase Standard',
    date: '2026-04-04',
    time: '9:00 AM',
    fee: 479,
    status: 'booked',
    agreementSigned: true,
  },
  {
    id: '2',
    address: '42 Willoughby Road, Crows Nest NSW 2065',
    suburb: 'Crows Nest',
    client: 'James Patterson',
    email: 'james.p@email.com',
    type: 'Building + Pest',
    date: '2026-04-04',
    time: '2:00 PM',
    fee: 479,
    status: 'booked',
    agreementSigned: false,
  },
  {
    id: '3',
    address: '8 Glenmore Road, Paddington NSW 2021',
    suburb: 'Paddington',
    client: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    type: 'Building Only',
    date: '2026-04-05',
    time: '10:00 AM',
    fee: 399,
    status: 'booked',
    agreementSigned: true,
  },
  {
    id: '4',
    address: '22 Pacific Highway, Chatswood NSW 2067',
    suburb: 'Chatswood',
    client: 'Michael Chen',
    email: 'mchen@email.com',
    type: 'Pre-Purchase Standard',
    date: '2026-04-03',
    time: '9:00 AM',
    fee: 479,
    status: 'awaiting_payment',
    agreementSigned: true,
  },
  {
    id: '5',
    address: '5/120 Bronte Road, Bondi Junction NSW 2022',
    suburb: 'Bondi Junction',
    client: 'Emma Williams',
    email: 'emmaw@email.com',
    type: 'Pre-Purchase Standard',
    date: '2026-04-02',
    time: '11:00 AM',
    fee: 379,
    status: 'completed',
    agreementSigned: true,
  },
]

const statusConfig = {
  booked: { label: 'Booked', color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'In Progress', color: 'bg-purple-100 text-purple-700' },
  report_draft: { label: 'Report Draft', color: 'bg-slate-100 text-slate-600' },
  awaiting_payment: { label: 'Awaiting Payment', color: 'bg-amber-100 text-amber-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
}

export default function JobsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jobs</h1>
          <p className="text-slate-500 mt-1">Manage your inspection bookings</p>
        </div>
        <Link
          href="/jobs/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Job
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs by address, client..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Property</th>
              <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Client</th>
              <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Type</th>
              <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Date</th>
              <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Fee</th>
              <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {jobs.map((job) => {
              const status = statusConfig[job.status as keyof typeof statusConfig]
              return (
                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 max-w-xs">{job.address}</p>
                        {!job.agreementSigned && (
                          <p className="text-xs text-amber-600 mt-0.5">⚠ Agreement not signed</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-900">{job.client}</p>
                    <p className="text-xs text-slate-400">{job.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-600">{job.type}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-900">{formatDate(job.date)}</p>
                    <p className="text-xs text-slate-400">{job.time}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">{formatCurrency(job.fee)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
