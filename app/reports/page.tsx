import { formatCurrency, formatDate } from '@/lib/utils'
import { FileText, Plus, Search, Filter, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const reports = [
  { id: '1', address: '14/18 Orchard Street, West Ryde NSW 2114', client: 'Celina Hansen', type: 'Pre-Purchase Standard', date: '2026-03-30', fee: 479, status: 'delivered' },
  { id: '2', address: '22 Pacific Highway, Chatswood NSW 2067', client: 'Michael Chen', type: 'Pre-Purchase Standard', date: '2026-04-03', fee: 479, status: 'awaiting_payment' },
  { id: '3', address: '5/120 Bronte Road, Bondi Junction NSW 2022', client: 'Emma Williams', type: 'Building + Pest', date: '2026-04-02', fee: 379, status: 'delivered' },
  { id: '4', address: '77 Anzac Parade, Kensington NSW 2033', client: 'David Brown', type: 'Building Only', date: '2026-04-01', fee: 399, status: 'draft' },
  { id: '5', address: '42 Willoughby Road, Crows Nest NSW 2065', client: 'James Patterson', type: 'Building + Pest', date: '2026-04-04', fee: 479, status: 'draft' },
  { id: '6', address: '18 Neutral Street, North Sydney NSW 2060', client: 'Sophie Turner', type: 'Stage Inspection', date: '2026-03-28', fee: 299, status: 'delivered' },
  { id: '7', address: '9 Military Road, Mosman NSW 2088', client: 'Alex Johnson', type: 'Dilapidation Report', date: '2026-03-25', fee: 549, status: 'delivered' },
]

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-600' },
  review: { label: 'In Review', color: 'bg-blue-100 text-blue-700' },
  awaiting_payment: { label: 'Awaiting Payment', color: 'bg-amber-100 text-amber-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
}

const tabs = ['All', 'Draft', 'Awaiting Payment', 'Delivered']

export default function ReportsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-500 mt-1">All inspection reports</p>
        </div>
        <Link href="/jobs/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />New Job
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
        {tabs.map((tab, i) => (
          <button key={tab} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${i === 0 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by address or client..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Table */}
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
            {reports.map((report) => {
              const status = statusConfig[report.status as keyof typeof statusConfig]
              return (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-slate-500" />
                      </div>
                      <p className="text-sm font-medium text-slate-900 max-w-xs truncate">{report.address}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{report.client}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{report.type}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{formatDate(report.date)}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">{formatCurrency(report.fee)}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>{status.label}</span>
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/reports/${report.id}`} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      {report.status === 'draft' ? 'Continue' : 'View'} <ArrowRight className="w-3 h-3" />
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
