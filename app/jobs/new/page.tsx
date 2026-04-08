'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, MapPin, User, Calendar, DollarSign, FileText,
  CheckCircle, Loader2, Home, Building2, BedDouble, Bath,
  Car, Ruler, Sparkles, Info, ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { INSPECTION_TYPES } from '@/types'

const INSPECTION_FEES: Record<string, number> = {
  pre_purchase_standard: 479,
  building_only: 399,
  pest_only: 299,
  stage: 299,
  dilapidation: 549,
}

interface PropertyDetails {
  bedrooms: number
  bathrooms: number
  parking: number
  building_type: 'house' | 'apartment' | 'townhouse' | 'unit'
  year_built: number
  land_size: number | null
  floor_area: number
  lat: number
  lng: number
}

interface AddOnKey {
  key: string
  label: string
  price: number
}

const ADD_ONS: AddOnKey[] = [
  { key: 'granny_flat', label: 'Granny Flat / Secondary Dwelling', price: 150 },
  { key: 'pool', label: 'Pool / Spa Inspection', price: 100 },
  { key: 'shed', label: 'Shed / Outbuilding', price: 50 },
  { key: 'reinspection', label: 'Re-inspection (same property)', price: -100 },
]

function calcSuggestedFee(
  inspectionType: string,
  property: PropertyDetails | null,
  addOns: Record<string, boolean>
): { total: number; breakdown: { label: string; amount: number }[] } {
  const base = INSPECTION_FEES[inspectionType] || 479
  const breakdown: { label: string; amount: number }[] = [
    { label: `${INSPECTION_TYPES[inspectionType as keyof typeof INSPECTION_TYPES] || 'Inspection'} base fee`, amount: base },
  ]

  let total = base

  if (property) {
    // Bedroom adjustments
    if (property.bedrooms <= 2) {
      breakdown.push({ label: '1–2 bedroom discount', amount: -50 })
      total -= 50
    } else if (property.bedrooms === 4) {
      breakdown.push({ label: '4 bedroom surcharge', amount: 50 })
      total += 50
    } else if (property.bedrooms >= 5) {
      breakdown.push({ label: '5+ bedroom surcharge', amount: 100 })
      total += 100
    }

    // Apartment discount
    if (property.building_type === 'apartment' || property.building_type === 'unit') {
      breakdown.push({ label: 'Apartment / unit discount', amount: -100 })
      total -= 100
    }

    // Large land surcharge
    if (property.land_size && property.land_size > 1000) {
      breakdown.push({ label: 'Large land (>1,000m²) surcharge', amount: 75 })
      total += 75
    }
  }

  // Add-ons
  for (const ao of ADD_ONS) {
    if (addOns[ao.key]) {
      breakdown.push({ label: ao.label, amount: ao.price })
      total += ao.price
    }
  }

  return { total: Math.max(total, 0), breakdown }
}

export default function NewJobPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    property_address: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    inspection_type: 'pre_purchase_standard',
    scheduled_date: '',
    scheduled_time: '09:00',
    fee: 479,
    notes: '',
    send_agreement: true,
    referring_agent: '',
  })

  const [addressQuery, setAddressQuery] = useState('')
  const [suggestions, setSuggestions] = useState<{ address: string; displayText: string }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingProperty, setLoadingProperty] = useState(false)
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null)
  const [addOns, setAddOns] = useState<Record<string, boolean>>({})
  const suggestRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced address suggest
  const fetchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      if (q.length < 3) {
        setSuggestions([])
        return
      }
      try {
        const res = await fetch(`/api/address-suggest?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setSuggestions(data.suggestions || [])
        setShowSuggestions(true)
      } catch {
        setSuggestions([])
      }
    }, 300)
  }, [])

  const handleAddressInput = (val: string) => {
    setAddressQuery(val)
    setPropertyDetails(null)
    fetchSuggestions(val)
  }

  const handleAddressSelect = async (address: string) => {
    setAddressQuery(address)
    setForm(prev => ({ ...prev, property_address: address }))
    setShowSuggestions(false)
    setSuggestions([])
    setLoadingProperty(true)
    try {
      const res = await fetch(`/api/property-lookup?address=${encodeURIComponent(address)}`)
      const data = await res.json()
      if (data.success) {
        const details: PropertyDetails = {
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          parking: data.parking,
          building_type: data.building_type,
          year_built: data.year_built,
          land_size: data.land_size,
          floor_area: data.floor_area,
          lat: data.lat,
          lng: data.lng,
        }
        setPropertyDetails(details)
      }
    } catch {
      // fail silently
    } finally {
      setLoadingProperty(false)
    }
  }

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleTypeChange = (type: string) => {
    setForm(prev => ({
      ...prev,
      inspection_type: type,
      fee: INSPECTION_FEES[type] || 479,
    }))
  }

  // Recompute fee when inspection type, property, or add-ons change
  useEffect(() => {
    const { total } = calcSuggestedFee(form.inspection_type, propertyDetails, addOns)
    setForm(prev => ({ ...prev, fee: total }))
  }, [form.inspection_type, propertyDetails, addOns])

  const { total: suggestedTotal, breakdown } = calcSuggestedFee(form.inspection_type, propertyDetails, addOns)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || 'Failed to create job.')
        return
      }
      router.push(`/jobs/${data.job.id}`)
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const buildingTypeIcon = propertyDetails?.building_type === 'apartment' || propertyDetails?.building_type === 'unit'
    ? Building2
    : Home

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/jobs" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Job</h1>
          <p className="text-slate-500 text-sm mt-0.5">Create a new inspection booking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Property</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Property Address *
              </label>
              <div className="relative" ref={suggestRef}>
                <input
                  type="text"
                  required
                  value={addressQuery}
                  onChange={e => handleAddressInput(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Start typing an address..."
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                {loadingProperty && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
                )}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => handleAddressSelect(s.address)}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 flex items-center gap-2 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-700">{s.displayText}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Property Details Card */}
            {propertyDetails && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">Property Details Confirmed</span>
                  <span className="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full capitalize">
                    {propertyDetails.building_type}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="flex flex-col items-center bg-white rounded-lg p-2.5 border border-green-100">
                    <BedDouble className="w-4 h-4 text-slate-500 mb-1" />
                    <span className="text-lg font-bold text-slate-900">{propertyDetails.bedrooms}</span>
                    <span className="text-xs text-slate-500">Bedrooms</span>
                  </div>
                  <div className="flex flex-col items-center bg-white rounded-lg p-2.5 border border-green-100">
                    <Bath className="w-4 h-4 text-slate-500 mb-1" />
                    <span className="text-lg font-bold text-slate-900">{propertyDetails.bathrooms}</span>
                    <span className="text-xs text-slate-500">Bathrooms</span>
                  </div>
                  <div className="flex flex-col items-center bg-white rounded-lg p-2.5 border border-green-100">
                    <Car className="w-4 h-4 text-slate-500 mb-1" />
                    <span className="text-lg font-bold text-slate-900">{propertyDetails.parking}</span>
                    <span className="text-xs text-slate-500">Parking</span>
                  </div>
                  <div className="flex flex-col items-center bg-white rounded-lg p-2.5 border border-green-100">
                    <Ruler className="w-4 h-4 text-slate-500 mb-1" />
                    <span className="text-lg font-bold text-slate-900">{propertyDetails.floor_area}</span>
                    <span className="text-xs text-slate-500">m² floor</span>
                  </div>
                </div>
                <div className="mt-2 flex gap-4 text-xs text-slate-600">
                  <span>Built: <strong>{propertyDetails.year_built}</strong></span>
                  {propertyDetails.land_size && (
                    <span>Land: <strong>{propertyDetails.land_size} m²</strong></span>
                  )}
                </div>
              </div>
            )}

            {loadingProperty && !propertyDetails && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="text-sm text-blue-700">Looking up property details...</span>
              </div>
            )}
          </div>
        </div>

        {/* Client */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Client Details</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={form.client_name}
                onChange={e => setForm(prev => ({ ...prev, client_name: e.target.value }))}
                placeholder="Jane Smith"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input
                type="tel"
                value={form.client_phone}
                onChange={e => setForm(prev => ({ ...prev, client_phone: e.target.value }))}
                placeholder="0412 345 678"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
              <input
                type="email"
                required
                value={form.client_email}
                onChange={e => setForm(prev => ({ ...prev, client_email: e.target.value }))}
                placeholder="jane@email.com"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Referring Agent (optional)</label>
              <input
                type="text"
                value={form.referring_agent}
                onChange={e => setForm(prev => ({ ...prev, referring_agent: e.target.value }))}
                placeholder="Sarah Nguyen – Ray White Crows Nest"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Inspection Type */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Inspection Type</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(INSPECTION_TYPES).map(([key, label]) => (
              <label
                key={key}
                className={cn(
                  'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors',
                  form.inspection_type === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="inspection_type"
                    value={key}
                    checked={form.inspection_type === key}
                    onChange={() => handleTypeChange(key)}
                    className="text-blue-600"
                  />
                  <span className="text-sm font-medium text-slate-900">{label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-600">
                  ${INSPECTION_FEES[key]}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* AI Pricing Assistant */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h2 className="font-semibold text-slate-900">AI Pricing Assistant</h2>
            {!propertyDetails && (
              <span className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Select an address for smart pricing
              </span>
            )}
          </div>

          {/* Add-ons */}
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-700 mb-2">Add-ons</p>
            <div className="space-y-2">
              {ADD_ONS.map(ao => (
                <label key={ao.key} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!addOns[ao.key]}
                      onChange={e => setAddOns(prev => ({ ...prev, [ao.key]: e.target.checked }))}
                      className="text-blue-600 rounded"
                    />
                    <span className="text-sm text-slate-700">{ao.label}</span>
                  </div>
                  <span className={cn('text-sm font-semibold', ao.price < 0 ? 'text-green-600' : 'text-slate-600')}>
                    {ao.price >= 0 ? `+$${ao.price}` : `-$${Math.abs(ao.price)}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700">Suggested Fee Breakdown</span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">AI Calculated</span>
            </div>
            <div className="space-y-1.5 mb-3">
              {breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{item.label}</span>
                  <span className={cn('font-medium', item.amount < 0 ? 'text-green-600' : 'text-slate-700')}>
                    {item.amount < 0 ? `-$${Math.abs(item.amount)}` : `$${item.amount}`}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-blue-200 flex items-center justify-between">
              <span className="font-semibold text-slate-900">Total Suggested Fee</span>
              <span className="text-xl font-bold text-blue-700">${suggestedTotal}</span>
            </div>
          </div>
        </div>

        {/* Schedule & Fee */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Schedule & Fee</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date *</label>
              <input
                type="date"
                required
                value={form.scheduled_date}
                onChange={e => setForm(prev => ({ ...prev, scheduled_date: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Time *</label>
              <input
                type="time"
                required
                value={form.scheduled_time}
                onChange={e => setForm(prev => ({ ...prev, scheduled_time: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Fee (AUD) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  required
                  value={form.fee}
                  onChange={e => setForm(prev => ({ ...prev, fee: Number(e.target.value) }))}
                  className="w-full pl-7 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Access instructions, special conditions..."
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Agreement */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.send_agreement}
              onChange={e => setForm(prev => ({ ...prev, send_agreement: e.target.checked }))}
              className="mt-0.5 text-blue-600 rounded"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">Send client agreement automatically</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Client will receive an email with a link to sign the inspection agreement before the job.
              </p>
            </div>
          </label>
        </div>

        {/* Actions */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Creating Job...' : 'Create Job'}
          </button>
          <Link
            href="/jobs"
            className="px-6 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
