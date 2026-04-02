'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, ArrowRight, Check } from 'lucide-react'
import { AU_STATES, PLANS } from '@/types'

type Step = 'account' | 'business' | 'plan'

export default function SignUpPage() {
  const [step, setStep] = useState<Step>('account')
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    company_name: '',
    licence_number: '',
    state: 'NSW',
    phone: '',
    plan: 'solo',
  })

  const steps = ['account', 'business', 'plan']
  const stepIndex = steps.indexOf(step)

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">InspectIQ</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {['Your account', 'Your business', 'Choose plan'].map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= stepIndex ? 'bg-blue-600' : 'bg-slate-200'}`} />
              <p className={`text-xs mt-1.5 ${i === stepIndex ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          {step === 'account' && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
              <p className="text-slate-500 text-sm mb-6">14-day free trial · No credit card needed</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                  <input type="text" value={form.full_name} onChange={e => setForm(p => ({...p, full_name: e.target.value}))} placeholder="Tommy Damir" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="tommy@inspectify.com.au" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <input type="password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} placeholder="Min. 8 characters" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <button onClick={() => setStep('business')} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'business' && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Your business</h1>
              <p className="text-slate-500 text-sm mb-6">This appears on your reports and invoices</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Company / Trading name</label>
                  <input type="text" value={form.company_name} onChange={e => setForm(p => ({...p, company_name: e.target.value}))} placeholder="Inspectify Building Inspections" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Licence number</label>
                  <input type="text" value={form.licence_number} onChange={e => setForm(p => ({...p, licence_number: e.target.value}))} placeholder="241494C" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                  <select value={form.state} onChange={e => setForm(p => ({...p, state: e.target.value}))} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {Object.entries(AU_STATES).map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-400 mt-1">State-specific legal text and standards are loaded automatically</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} placeholder="0412 345 678" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep('account')} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Back</button>
                <button onClick={() => setStep('plan')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 'plan' && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Choose your plan</h1>
              <p className="text-slate-500 text-sm mb-6">Start free for 14 days — no credit card required</p>
              <div className="space-y-3">
                {Object.entries(PLANS).map(([key, plan]) => (
                  <label key={key} className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${form.plan === key ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" name="plan" value={key} checked={form.plan === key} onChange={() => setForm(p => ({...p, plan: key}))} className="mt-0.5 text-blue-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900">{plan.name}</span>
                        <span className="text-sm font-bold text-slate-900">${plan.price}/mo</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{plan.inspectors}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep('business')} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Back</button>
                <Link href="/dashboard" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                  <Check className="w-4 h-4" />
                  Start free trial
                </Link>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account? <Link href="/auth/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
