'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Download, Upload } from 'lucide-react'

const mockTemplates = [
  {
    id: 'standard',
    name: 'Pre-Purchase Standard',
    sections: {
      cover: {},
      property: {},
      defects: {
        major: [],
        minor: [],
      },
      pest: {},
      conclusion: {},
    },
  },
  {
    id: 'building',
    name: 'Building Only',
    sections: {
      cover: {},
      property: {},
      defects: {},
      conclusion: {},
    },
  },
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(mockTemplates)
  const [selected, setSelected] = useState<typeof mockTemplates[0] | null>(null)
  const [name, setName] = useState('')
  const [jsonData, setJsonData] = useState('')

  useEffect(() => {
    // Load from localStorage mock
    const saved = localStorage.getItem('inspectiq-templates')
    if (saved) setTemplates(JSON.parse(saved))
  }, [])

  const saveTemplates = () => {
    localStorage.setItem('inspectiq-templates', JSON.stringify(templates))
  }

  const createTemplate = () => {
    const newTemplate = {
      id: 'new-' + Date.now(),
      name,
      sections: { cover: {}, property: {}, defects: {}, conclusion: {} },
    }
    setTemplates([...templates, newTemplate])
    setName('')
    saveTemplates()
  }

  const updateTemplate = () => {
    if (selected) {
      setTemplates(templates.map(t => t.id === selected.id ? { ...selected, name, sections: JSON.parse(jsonData) } : t))
      setSelected(null)
      setName('')
      setJsonData('')
      saveTemplates()
    }
  }

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id))
    saveTemplates()
  }

  const editTemplate = (template: typeof mockTemplates[0]) => {
    setSelected(template)
    setName(template.name)
    setJsonData(JSON.stringify(template.sections, null, 2))
  }

  const exportTemplates = () => {
    const dataStr = JSON.stringify(templates, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'inspectiq-templates.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Custom Templates</h1>
          <p className="text-slate-500">Create and edit report templates (JSON structure matching ReportData)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportTemplates} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm hover:bg-slate-50">
            <Download className="w-4 h-4" />
            Export All
          </button>
          <label className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm hover:bg-slate-50 cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input type="file" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (e) => {
                  try {
                    const imported = JSON.parse(e.target?.result as string)
                    setTemplates([...templates, ...imported])
                    saveTemplates()
                  } catch {}
                }
                reader.readAsText(file)
              }
            }} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* List */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 lg:col-span-1">
          <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-lg">
            <Plus className="w-5 h-5 text-blue-600" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New template name"
              className="flex-1 bg-transparent outline-none text-lg placeholder-slate-500"
            />
            <button
              onClick={createTemplate}
              disabled={!name}
              className={`p-2 rounded-lg ${name ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-slate-400'}`}
            >
              Create
            </button>
          </div>
          <div className="space-y-2">
            {templates.map((template) => (
              <div key={template.id} className="group p-3 rounded-lg hover:bg-slate-50 cursor-pointer border transition-colors" onClick={() => editTemplate(template)}>
                <p className="font-medium text-slate-900 text-sm group-hover:text-blue-600 truncate">{template.name}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteTemplate(template.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-all ml-auto"
                >
                  <Trash2 className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-xl font-bold placeholder-slate-500"
                  placeholder="Template name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">JSON Structure</label>
                  <textarea
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    className="w-full h-96 p-4 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder={'{ "sections": { ... } }'}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-2">Example ReportData</p>
                    <p className="text-xs text-slate-500">Matching your report JSON structure</p>
                  </div>
                  <button
                    onClick={updateTemplate}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center gap-2"
                  >
                    Save Template
                  </button>
                  <button
                    onClick={() => {
                      setSelected(null)
                      setName('')
                      setJsonData('')
                    }}
                    className="w-full border border-slate-200 hover:bg-slate-50 py-3 px-6 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
              <div className="text-center">
                <Plus className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No template selected</h3>
                <p className="text-slate-500 mb-4">Click a template to edit or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}