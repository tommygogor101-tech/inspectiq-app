'use client'

import Link from 'next/link'
import { LayoutDashboard, FileText, Plus, LogOut } from 'lucide-react'

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold">Agent Portal</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/agent" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/agent/jobs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
            <FileText className="w-5 h-5" />
            My Jobs
          </Link>
          <Link href="/agent/request" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800">
            <Plus className="w-5 h-5" />
            Request Inspection
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-slate-300">
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </div>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}