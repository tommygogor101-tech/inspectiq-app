'use client'

import { useState } from 'react'
import { User, Building2, DollarSign, FileText, Bell, CreditCard, Save, Upload } from 'lucide-react'
import { AU_STATES, INSPECTION_TYPES } from '@/types'

type Tab = 'profile' | 'company' | 'pricing' | 'agreements' | 'notifications' | 'billing'

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'company', label: 'Company', icon: Building2 },
  { key: 'pricing', label: 'Pricing', icon: DollarSign },
  { key: 'agreements', label: 'Agreements', icon: FileText },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'billing', label: 'Billing', icon: CreditCard },
]

const defaultPricing = {
  pre_purchase_standard: 479,
  building_only: 399,
  pest_only: 299,
  stage: 299,
  dilapidation: 549,
  addon_granny_flat: 150,
  addon_pool: 100,
  addon_large_land: 75,
  addon_reinspection: -50,
}

const notifications = [
  { key: 'agreement_signed', label: 'Client signs agreement', description: 'Get notified immediately when a client signs their agreement' },
  { key: 'payment_received', label: 'Payment received', description: 'Get notified when a client pays their invoice' },
  { key: 'sms_reminder', label: 'SMS reminder day before inspection', description: 'Automatically send client a reminder SMS 24 hours before the job' },
  { key: 'weekly_summary', label: 'Weekly revenue summary', description: 'Receive a weekly email with your revenue and jobs summary every Monday' },
  { key: 'overdue_invoice', label: 'Overdue invoice alert', description: 'Alert when an invoice is unpaid after 7 days' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [pricing, setPricing] = useState(defaultPricing)
  const [notifSettings, setNotifSettings] = useState<Record<string, boolean>>({
    agreement_signed: true,
    payment_received: true,
    sms_reminder: true,
    weekly_summary: true,
    overdue_invoice: true,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account, company, and preferences</p>
      </div>

      <div className="flex gap-8">
        {/* Tab nav */}
        <div className="w-52 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeTab === tab.key ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-2xl">

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-6">Personal Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                    <input defaultValue="Tommy Damir" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                    <input defaultValue="tommy@inspectify.com.au" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                    <input defaultValue="0412 345 678" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Licence Number</label>
                    <input defaultValue="241494C" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                    <select defaultValue="NSW" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      {Object.entries(AU_STATES).map(([code, name]) => (
                        <option key={code} value={code}>{name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-2">Signature</h2>
                <p className="text-sm text-slate-500 mb-4">Your signature appears on all reports</p>
                <div className="border-2 border-dashed border-slate-200 rounded-lg h-32 flex items-center justify-center bg-slate-50 cursor-pointer hover:border-blue-300 transition-colors">
                  <div className="text-center">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Upload signature image or draw below</p>
                  </div>
                </div>
              </div>
              <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                <Save className="w-4 h-4" />
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-6">Company Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Company / Trading Name</label>
                    <input defaultValue="Inspectify Building Inspections" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">ABN</label>
                      <input placeholder="12 345 678 901" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                      <input placeholder="02 1234 5678" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Address</label>
                    <input placeholder="123 Example Street, Sydney NSW 2000" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-2">Company Logo</h2>
                <p className="text-sm text-slate-500 mb-4">Appears on all reports, invoices, and the client portal</p>
                <div className="border-2 border-dashed border-slate-200 rounded-lg h-24 flex items-center justify-center bg-slate-50 cursor-pointer hover:border-blue-300 transition-colors">
                  <div className="text-center">
                    <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <p className="text-sm text-slate-500">Upload logo (PNG or SVG recommended)</p>
                  </div>
                </div>
              </div>
              <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                <Save className="w-4 h-4" />{saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-1">Base Fees</h2>
                <p className="text-sm text-slate-500 mb-6">Default fees per inspection type. You can override per job.</p>
                <div className="space-y-3">
                  {Object.entries(INSPECTION_TYPES).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between gap-4">
                      <label className="text-sm text-slate-700 flex-1">{label}</label>
                      <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input
                          type="number"
                          value={pricing[key as keyof typeof pricing]}
                          onChange={e => setPricing(p => ({ ...p, [key]: Number(e.target.value) }))}
                          className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-1">Add-ons</h2>
                <p className="text-sm text-slate-500 mb-6">Additional charges auto-suggested based on property details</p>
                <div className="space-y-3">
                  {[
                    { key: 'addon_granny_flat', label: 'Granny flat / secondary dwelling' },
                    { key: 'addon_pool', label: 'Swimming pool inspection' },
                    { key: 'addon_large_land', label: 'Large land area (>1,000m²)' },
                    { key: 'addon_reinspection', label: 'Re-inspection discount' },
                  ].map(addon => (
                    <div key={addon.key} className="flex items-center justify-between gap-4">
                      <label className="text-sm text-slate-700 flex-1">{addon.label}</label>
                      <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input
                          type="number"
                          value={pricing[addon.key as keyof typeof pricing]}
                          onChange={e => setPricing(p => ({ ...p, [addon.key]: Number(e.target.value) }))}
                          className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                <Save className="w-4 h-4" />{saved ? 'Saved!' : 'Save Pricing'}
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-6">Notification Preferences</h2>
              <div className="space-y-5">
                {notifications.map(n => (
                  <div key={n.key} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{n.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.description}</p>
                    </div>
                    <button
                      onClick={() => setNotifSettings(p => ({ ...p, [n.key]: !p[n.key] }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${notifSettings[n.key] ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifSettings[n.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-4">Current Plan</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-slate-900">Solo Plan</p>
                    <p className="text-sm text-slate-500">$89/month · 1 inspector · Renews 3 May 2026</p>
                  </div>
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Upgrade Plan</button>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-4">Payment Method</h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 bg-slate-100 rounded flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Visa ending in 4242</p>
                    <p className="text-xs text-slate-400">Expires 12/2027</p>
                  </div>
                  <button className="ml-auto text-sm text-blue-600 hover:underline">Update</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agreements' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">Agreement Templates</h2>
                  <button className="text-sm text-blue-600 hover:underline">+ New Template</button>
                </div>
                <div className="space-y-3">
                  {['Pre-Purchase Standard (Default)', 'Stage Inspection', 'Dilapidation Report'].map(name => (
                    <div key={name} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">{name}</span>
                      </div>
                      <button className="text-sm text-blue-600 hover:underline">Edit</button>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-400 px-1">Agreements are automatically sent to clients when a job is created. State-specific legal clauses are inserted automatically based on your state (NSW).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
