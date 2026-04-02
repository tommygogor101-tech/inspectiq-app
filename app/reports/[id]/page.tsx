'use client'

import { useState } from 'react'
import { ArrowLeft, Camera, Mic, MicOff, Bot, Send, CheckCircle, FileText, Download, AlertTriangle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type SectionKey = 'serious_safety_hazards' | 'ceiling_defects' | 'internal_wall_defects' | 'floor_defects' |
  'joinery_defects' | 'kitchen_defects' | 'bathroom_defects' | 'external_walls' | 'eaves_defects' |
  'roof_defects' | 'minor_defects' | 'termite_activity' | 'fungal_decay' | 'excessive_moisture' |
  'conducive_conditions' | 'conclusion'

interface ReportSection {
  key: SectionKey
  label: string
  category: 'property' | 'pest'
  content: string
  hasDefects: boolean | null
  photos: string[]
}

const initialSections: ReportSection[] = [
  { key: 'serious_safety_hazards', label: 'D1 — Serious Safety Hazards', category: 'property', content: 'No evidence was found of any serious safety hazards at the time of inspection.', hasDefects: false, photos: [] },
  { key: 'ceiling_defects', label: 'D2 — Ceilings', category: 'property', content: 'No evidence of Major Defect was found.', hasDefects: false, photos: [] },
  { key: 'internal_wall_defects', label: 'D3 — Internal Walls', category: 'property', content: 'No evidence of Major Defect was found.', hasDefects: false, photos: [] },
  { key: 'floor_defects', label: 'D4 — Floors', category: 'property', content: 'No evidence of Major Defect was found.', hasDefects: false, photos: [] },
  { key: 'joinery_defects', label: 'D5 — Internal Joinery', category: 'property', content: '', hasDefects: null, photos: [] },
  { key: 'kitchen_defects', label: 'D6 — Kitchen & Laundry', category: 'property', content: '', hasDefects: null, photos: [] },
  { key: 'bathroom_defects', label: 'D7 — Bathrooms', category: 'property', content: '', hasDefects: null, photos: [] },
  { key: 'external_walls', label: 'D11 — External Walls', category: 'property', content: 'No evidence of Major Defect was found.', hasDefects: false, photos: [] },
  { key: 'eaves_defects', label: 'D16 — Eaves & Fascias', category: 'property', content: '', hasDefects: null, photos: [] },
  { key: 'minor_defects', label: 'D22 — Minor Defects', category: 'property', content: '', hasDefects: null, photos: [] },
  { key: 'termite_activity', label: 'E1 — Termite Activity', category: 'pest', content: 'No evidence of termite activity or damage was found during the course of this visual inspection.', hasDefects: false, photos: [] },
  { key: 'fungal_decay', label: 'E7 — Fungal Decay', category: 'pest', content: '', hasDefects: null, photos: [] },
  { key: 'excessive_moisture', label: 'E10 — Excessive Moisture', category: 'pest', content: '', hasDefects: null, photos: [] },
  { key: 'conducive_conditions', label: 'E9-E13 — Conducive Conditions', category: 'pest', content: '', hasDefects: null, photos: [] },
  { key: 'conclusion', label: 'Section F — Conclusion', category: 'property', content: '', hasDefects: null, photos: [] },
]

export default function ReportPage({ params }: { params: { id: string } }) {
  const [sections, setSections] = useState<ReportSection[]>(initialSections)
  const [activeSection, setActiveSection] = useState<SectionKey>('joinery_defects')
  const [isRecording, setIsRecording] = useState(false)
  const [aiMessage, setAiMessage] = useState('')
  const [aiChat, setAiChat] = useState([
    { role: 'assistant', content: "G'day! I'm your AI inspection assistant. Take photos, record voice observations, or ask me anything about AS4349 standards. I'll help fill in the report as we go." }
  ])
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(new Set(['joinery_defects']))

  const activeJob = {
    address: '14/18 Orchard Street, West Ryde NSW 2114',
    client: 'Celina Hansen',
    type: 'Pre-Purchase Standard (Building + Pest)',
    date: '30 Mar 2026',
  }

  const toggleSection = (key: SectionKey) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
    setActiveSection(key)
  }

  const updateSection = (key: SectionKey, content: string) => {
    setSections(prev => prev.map(s => s.key === key ? { ...s, content } : s))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setPhotoUploading(true)
    // Simulate AI analysis
    await new Promise(r => setTimeout(r, 2000))

    // Mock AI response
    const mockAnalysis = [
      "🔍 **AI Analysis Complete** — Photo added to Section D7 (Bathrooms)\n\n**Defect detected:** Cracked tiles and damaged grout in wet area\n**Severity:** Major Defect\n**AS Code:** AS4349.1 Section 3.3\n\n*Suggested text added to report. Review and confirm ↓*",
      "🔍 **AI Analysis Complete** — Photo added to Section D6 (Kitchen)\n\n**Defect detected:** Elevated moisture reading, possible water leak behind cabinetry\n**Severity:** Major Defect\n**Recommendation:** Engage plumber for further investigation\n\n*Suggested text added to report. Review and confirm ↓*",
    ]

    const randomAnalysis = mockAnalysis[Math.floor(Math.random() * mockAnalysis.length)]
    setAiChat(prev => [...prev, { role: 'assistant', content: randomAnalysis }])
    setPhotoUploading(false)
  }

  const handleAiSend = async () => {
    if (!aiMessage.trim()) return
    const msg = aiMessage.trim()
    setAiMessage('')
    setAiChat(prev => [...prev, { role: 'user', content: msg }])
    setIsAiThinking(true)

    // Simulate AI response
    await new Promise(r => setTimeout(r, 1500))

    const responses: Record<string, string> = {
      default: "Based on AS4349.1-2007, I'd recommend documenting this as a Major Defect and recommending a specialist inspection. Would you like me to draft the section text?",
    }

    const lowerMsg = msg.toLowerCase()
    let response = responses.default
    if (lowerMsg.includes('termite') || lowerMsg.includes('pest')) {
      response = "For termite-related findings, this falls under AS4349.3. Since you found evidence, you must recommend a Subterranean Termite Management Proposal in accordance with AS3660.2. I'll add this to Section E2. Want me to also flag a 1-month re-inspection recommendation?"
    } else if (lowerMsg.includes('retaining wall')) {
      response = "Retaining walls over 700mm high fall within the scope of the Building & Site inspection under AS4349.1. If there's evidence of movement or failure, this is a Major Defect. The relevant NCC provision is Section B1 Structural Provisions. Want me to draft the finding text?"
    } else if (lowerMsg.includes('crack')) {
      response = "Cracks need to be categorised by width and pattern. Fine cracks (<1mm) are typically Minor Defects. Cracks >3mm or with displacement should be classified as Major Defects and may require structural engineer assessment. Which area are we talking about?"
    } else if (lowerMsg.includes('moisture') || lowerMsg.includes('damp')) {
      response = "Elevated moisture readings should be documented with the meter readings if possible. Under AS4349.3, this is a 'Condition Conducive to Timber Pest Attack' (Section E10). Recommend engaging a plumber to investigate the source. Want me to add this to the report?"
    }

    setAiChat(prev => [...prev, { role: 'assistant', content: response }])
    setIsAiThinking(false)
  }

  const propertySections = sections.filter(s => s.category === 'property')
  const pestSections = sections.filter(s => s.category === 'pest')

  const completedCount = sections.filter(s => s.content.trim().length > 0).length
  const progress = Math.round((completedCount / sections.length) * 100)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left: Report Sections */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/reports" className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <ArrowLeft className="w-4 h-4 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-sm font-semibold text-slate-900 truncate max-w-md">{activeJob.address}</h1>
                <p className="text-xs text-slate-500">{activeJob.client} · {activeJob.type} · {activeJob.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Progress */}
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs text-slate-500">{progress}%</span>
              </div>
              <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <FileText className="w-4 h-4" />
                Preview PDF
              </button>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <CheckCircle className="w-4 h-4" />
                Finalise & Send
              </button>
            </div>
          </div>
        </div>

        {/* Photo/Voice bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-3">
          <label className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors",
            photoUploading ? "bg-blue-100 text-blue-600" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          )}>
            {photoUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            {photoUploading ? 'Analysing...' : 'Add Photo'}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
          </label>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isRecording
                ? "bg-red-100 text-red-600 border border-red-200 animate-pulse"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isRecording ? 'Stop Recording' : 'Voice Note'}
          </button>
          <p className="text-xs text-slate-400 ml-2">
            📸 Take photos or record voice observations — AI will auto-fill the report
          </p>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {/* Property Report */}
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 mt-2">Section D — Property Report</h3>
          {propertySections.map(section => (
            <SectionCard
              key={section.key}
              section={section}
              isExpanded={expandedSections.has(section.key)}
              onToggle={() => toggleSection(section.key)}
              onUpdate={(content) => updateSection(section.key, content)}
            />
          ))}

          {/* Timber Pest */}
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 mt-6">Section E — Timber Pest Report</h3>
          {pestSections.map(section => (
            <SectionCard
              key={section.key}
              section={section}
              isExpanded={expandedSections.has(section.key)}
              onToggle={() => toggleSection(section.key)}
              onUpdate={(content) => updateSection(section.key, content)}
            />
          ))}
        </div>
      </div>

      {/* Right: AI Assistant */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col">
        <div className="px-4 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">AI Assistant</p>
            <p className="text-xs text-slate-500">AS4349 · NCC · BCA</p>
          </div>
          <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {aiChat.map((msg, i) => (
            <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm",
                msg.role === 'user'
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-slate-100 text-slate-800 rounded-bl-sm"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {isAiThinking && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-xl rounded-bl-sm px-3.5 py-2.5">
                <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={aiMessage}
              onChange={e => setAiMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAiSend()}
              placeholder="Ask about AS4349, NCC codes..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAiSend}
              disabled={!aiMessage.trim() || isAiThinking}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">AI knows AS4349, NCC, BCA + all state standards</p>
        </div>
      </div>
    </div>
  )
}

function SectionCard({
  section,
  isExpanded,
  onToggle,
  onUpdate,
}: {
  section: ReportSection
  isExpanded: boolean
  onToggle: () => void
  onUpdate: (content: string) => void
}) {
  const hasContent = section.content.trim().length > 0

  return (
    <div className={cn(
      "bg-white rounded-xl border transition-all",
      isExpanded ? "border-blue-300 shadow-sm" : "border-slate-200",
      section.hasDefects === true ? "border-l-4 border-l-amber-400" : "",
    )}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-2 h-2 rounded-full",
            hasContent ? "bg-green-500" : "bg-slate-300"
          )} />
          <span className="text-sm font-medium text-slate-900">{section.label}</span>
          {section.hasDefects === true && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Defects found
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <textarea
            value={section.content}
            onChange={e => onUpdate(e.target.value)}
            placeholder="No observations recorded. Take a photo or use voice to auto-fill, or type manually..."
            rows={4}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-700 placeholder:text-slate-400"
          />
          {section.photos.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {section.photos.map((photo, i) => (
                <div key={i} className="w-16 h-16 bg-slate-100 rounded-lg" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
