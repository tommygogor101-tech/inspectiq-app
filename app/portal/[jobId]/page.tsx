'use client'

import { useState } from 'react'
import { CheckCircle, Lock, Download, FileText, CreditCard, Building2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ClientPortalPage({ params }: { params: { jobId: string } }) {
  const [paid, setPaid] = useState(false)

  const job = {
    address: '14/18 Orchard Street, West Ryde NSW 2114',
    client: 'Celina Hansen',
    type: 'Pre-Purchase Standard (Building + Pest)',
    date: '30 March 2026',
    inspector: 'Tommy Damir',
    company: 'Inspectify Building Inspections',
    licence: '241494C',
    fee: 479,
    gst: 47.9,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">{job.company}</p>
            <p className="text-xs text-slate-500">Powered by InspectIQ</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Property card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h1 className="text-xl font-bold text-slate-900 mb-1">{job.address}</h1>
          <p className="text-slate-500 text-sm">{job.type} · {job.date}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 text-xs mb-0.5">Client</p>
              <p className="text-slate-900 font-medium">{job.client}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-0.5">Inspector</p>
              <p className="text-slate-900 font-medium">{job.inspector}</p>
              <p className="text-slate-400 text-xs">Licence {job.licence}</p>
            </div>
          </div>
        </div>

        {/* Payment */}
        {!paid ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Your report is ready</h2>
                <p className="text-sm text-slate-500 mt-1">Complete payment below to unlock and download your full inspection report.</p>
              </div>
            </div>

            {/* Invoice breakdown */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{job.type}</span>
                <span className="text-slate-900 font-medium">{formatCurrency(job.fee - job.gst)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">GST (10%)</span>
                <span className="text-slate-900">{formatCurrency(job.gst)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold">
                <span>Total</span>
                <span>{formatCurrency(job.fee)}</span>
              </div>
            </div>

            <button
              onClick={() => setPaid(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Pay {formatCurrency(job.fee)} with Stripe
            </button>
            <p className="text-xs text-slate-400 text-center mt-3">Secure payment via Stripe · Card, Apple Pay, Google Pay accepted</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Success */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-900">Payment received — thank you!</p>
                <p className="text-xs text-green-700 mt-0.5">Receipt sent to celinahansen7@gmail.com</p>
              </div>
            </div>

            {/* Report download */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Pre-Purchase Inspection Report</p>
                  <p className="text-sm text-slate-500 mt-0.5">41 pages · PDF</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center">
              This report is for the exclusive use of {job.client} and was prepared in accordance with AS4349.1-2007 and AS4349.3.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
