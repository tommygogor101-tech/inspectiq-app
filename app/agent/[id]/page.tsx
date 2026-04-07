'use client'

import { useEffect, useState } from 'react'
import { Mail, Phone, MapPin, FileText, Camera, MessageSquare } from 'lucide-react'

export default function AgentJobPage({ params }: { params: { id: string } }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('agentToken')
    setIsLoggedIn(!!token)
  }, [])

  if (!isLoggedIn) {
    return <div>Login required</div>
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Job #{params.id}</h1>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">Active</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="font-semibold text-slate-900 mb-4">Property Details</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-900">14/18 Orchard Street</p>
                <p className="text-sm text-slate-500">West Ryde NSW 2114</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <p className="text-sm text-slate-900">celina@example.com</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <p className="text-sm text-slate-900">0412 345 678</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="font-semibold text-slate-900 mb-4">Job Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Inspection Type</span>
              <span className="text-sm font-medium text-slate-900">Pre-Purchase Standard</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Date</span>
              <span className="text-sm font-medium text-slate-900">4 April 2026, 9:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Your Fee</span>
              <span className="text-sm font-bold text-green-600">$120</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Status</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">On-site</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="font-semibold text-slate-900 mb-4">Photos (12)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square bg-slate-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="font-semibold text-slate-900 mb-4">Notes</h2>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm p-2 bg-slate-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Camera className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Cracked tile in kitchen</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
            {/* more */}
          </div>
          <textarea
            className="w-full mt-4 p-3 border border-slate-200 rounded-lg resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Add note..."
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}