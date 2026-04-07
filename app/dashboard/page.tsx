import { formatCurrency, formatDate } from '@/lib/utils'
import { Calendar, FileText, DollarSign, Clock, Plus, ArrowRight, CheckCircle, AlertCircle, TrendingUp, Users, Star } from 'lucide-react'
import Link from 'next/link'

const revenueData = [
  { month: 'Nov', amount: 3840 },
  { month: 'Dec', amount: 2960 },
  { month: 'Jan', amount: 4320 },
  { month: 'Feb', amount: 3680 },
  { month: 'Mar', amount: 5120 },
  { month: 'Apr', amount: 5748 },
]

const topAgents = [
  { name: 'Sarah Chen', company: 'Ray White West Ryde', jobs: 8, revenue: 3832 },
  { name: 'Michael Torres', company: 'McGrath Chatswood', jobs: 5, revenue: 2395 },
  { name: 'Emma Liu', company: 'LJ Hooker Parramatta', jobs: 4, revenue: 1916 },
]

const pendingActions = [
  { type: 'agreement', text: '42 Willoughby Road — James Patterson hasn\'t signed agreement', href: '/jobs/2', urgency: 'warning' },
  { type: 'invoice', text: '22 Pacific Highway — Michael Chen invoice overdue 8 days', href: '/jobs/4', urgency: 'danger' },
]

// Mock data for demo
const stats = [
  { label: 'Jobs This Month', value: '12', icon: Calendar, change: '+3 from last month', positive: true },
  { label: 'Revenue This Month', value: '$5,748', icon: DollarSign, change: '+18% from last month', positive: true },
  { label: 'Reports Pending', value: '3', icon: FileText, change: '2 awaiting payment', positive: false },
  { label: 'Avg Report Time', value: '42 min', icon: Clock, change: '-8 min from last month', positive: true },
  { label: 'Review Score', value: '4.9/5 (23)', icon: Star, change: '+0.2 from last month', positive: true },
]

const upcomingJobs: any[] = [
  {
    id: '1',
    address: '14/18 Orchard Street, West Ryde NSW 2114',
    client: 'Celina Hansen',
    type: 'Pre-Purchase Standard',
    date: '2026-04-04',
    time: '9:00 AM',
    fee: 479,
    status: 'booked',
  },
  {
    id: '2',
    address: '42 Willoughby Road, Crows Nest NSW 2065',
    client: 'James Patterson',
    type: 'Building + Pest',
    date: '2026-04-04',
    time: '2:00 PM',
    fee: 479,
    status: 'booked',
  },
  {
    id: '3',
    address: '8 Glenmore Road, Paddington NSW 2021',
    client: 'Sarah Mitchell',
    type: 'Building Only',
    date: '2026-04-05',
    time: '10:00 AM',
    fee: 399,
    status: 'booked',
  },
]

const recentReports = [
  {
    id: '1',
    address: '22 Pacific Highway, Chatswood NSW 2067',
    client: 'Michael Chen',
    status: 'awaiting_payment',
    date: '2026-04-03',
  },
  {
    id: '2',
    address: '5/120 Bronte Road, Bondi Junction NSW 2022',
    client: 'Emma Williams',
    status: 'delivered',
    date: '2026-04-02',
  },
  {
    id: '3',
    address: '77 Anzac Parade, Kensington NSW 2033',
    client: 'David Brown',
    status: 'draft',
    date: '2026-04-01',
  },
]

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-600' },
  awaiting_payment: { label: 'Awaiting Payment', color: 'bg-amber-100 text-amber-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
  review: { label: 'In Review', color: 'bg-blue-100 text-blue-700' },
}

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good morning, Tommy 👋</h1>
          <p className="text-slate-500 mt-1">Friday, 4 April 2026 — you have 2 inspections today</p>
        </div>
        <Link
          href="/jobs/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className={`text-xs ${stat.positive ? 'text-green-600' : 'text-amber-600'}`}>
                {stat.change}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Upcoming Jobs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Upcoming Jobs</h2>
            <Link href="/jobs" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {upcomingJobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{job.address}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{job.client} · {job.type}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(job.date)} at {job.time}</p>
                </div>
                <div className="text-sm font-semibold text-slate-900 flex-shrink-0">
                  {formatCurrency(job.fee)}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recent Reports</h2>
            <Link href="/reports" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentReports.map((report) => {
              const status = statusConfig[report.status as keyof typeof statusConfig]
              return (
                <Link key={report.id} href={`/reports/${report.id}`} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{report.address}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{report.client}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(report.date)}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${status.color}`}>
                    {status.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        {/* Revenue Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-slate-900">Revenue (Last 6 Months)</h2>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />+12% avg
            </div>
          </div>
          <div className="flex items-end gap-3 h-32">
            {revenueData.map((d) => {
              const max = Math.max(...revenueData.map(r => r.amount))
              const height = Math.round((d.amount / max) * 100)
              const isLatest = d.month === 'Apr'
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-slate-400">${(d.amount/1000).toFixed(1)}k</span>
                  <div
                    className={`w-full rounded-t-md transition-all ${isLatest ? 'bg-blue-600' : 'bg-slate-200'}`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-slate-500">{d.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Agent leaderboard + pending actions */}
        <div className="space-y-4">
          {/* Agent leaderboard */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-blue-600" />
              <h2 className="font-semibold text-slate-900 text-sm">Top Agents (Apr)</h2>
            </div>
            <div className="space-y-3">
              {topAgents.map((agent, i) => (
                <div key={agent.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">{agent.name}</p>
                    <p className="text-xs text-slate-400 truncate">{agent.company}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{agent.jobs} jobs</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending actions */}
          <div className="space-y-2">
            {pendingActions.map((action, i) => (
              <Link key={i} href={action.href} className={`flex items-start gap-3 p-3 rounded-xl border text-sm transition-colors hover:opacity-90 ${action.urgency === 'danger' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${action.urgency === 'danger' ? 'text-red-500' : 'text-amber-500'}`} />
                <span className={`text-xs ${action.urgency === 'danger' ? 'text-red-800' : 'text-amber-800'}`}>{action.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
