'use client'

import { useEffect, useState } from 'react'
import { LogIn, Mail, Phone, Building2 } from 'lucide-react'

export default function AgentDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('agentToken')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogin = () => {
    localStorage.setItem('agentToken', 'mock-agent-' + Date.now())
    setIsLoggedIn(true)
    window.location.reload()
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
        <div className="text-center mb-8">
          <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Agent Portal</h1>
          <p className="text-slate-500">Log in to access your jobs and reports</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="agent@example.com"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={!email}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${email ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            <LogIn className="w-4 h-4" />
            Log in
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-6 text-center">
          Mock login — no real auth yet
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Agent Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-2">My Jobs</h3>
          <p className="text-3xl font-bold text-blue-600">5</p>
          <p className="text-sm text-slate-500">3 active, 2 completed</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-2">Pending Reports</h3>
          <p className="text-3xl font-bold text-amber-600">2</p>
          <p className="text-sm text-slate-500">Submit to inspector</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-2">Earnings</h3>
          <p className="text-3xl font-bold text-green-600">$1,200</p>
          <p className="text-sm text-slate-500">This month</p>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Recent Jobs</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
            <div>
              <p className="font-medium text-slate-900">14 Orchard St, West Ryde</p>
              <p className="text-sm text-slate-500">Pre-Purchase · Assigned</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Active</span>
          </div>
          {/* more */}
        </div>
      </div>
    </div>
  )
}