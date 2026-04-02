import Link from 'next/link'
import { Building2, Camera, Mic, Bot, FileText, CheckCircle, DollarSign, Users, ArrowRight, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">InspectIQ</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <Link href="/auth/login" className="hover:text-slate-900">Sign in</Link>
            <Link href="/auth/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full mb-8">
          🇦🇺 Built for Australian building inspectors
        </div>
        <h1 className="text-6xl font-bold text-slate-900 leading-tight mb-6">
          Finish your report<br />
          <span className="text-blue-600">before you leave the site</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          AI-powered inspection software that writes your AS4349 reports for you. Take photos, use your voice — InspectIQ does the rest.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/auth/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors">
            Start free trial <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/dashboard" className="border border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-3.5 rounded-xl font-semibold text-sm transition-colors">
            View demo →
          </Link>
        </div>
        <p className="text-sm text-slate-400 mt-4">14-day free trial · No credit card required · Cancel anytime</p>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything you need, nothing you don't</h2>
            <p className="text-lg text-slate-500">The only inspection platform built AI-first for Australian standards</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                icon: Camera,
                title: 'AI Photo Analysis',
                description: 'Take a photo — AI identifies defects, assigns severity, suggests AS4349 code, and writes the report entry. Accept, edit, or reject.',
                badge: 'Most popular',
              },
              {
                icon: Mic,
                title: 'Voice-to-Report',
                description: 'Speak your observations as you walk the property. AI transcribes and places each finding in the correct report section automatically.',
              },
              {
                icon: Bot,
                title: 'On-Site AI Assistant',
                description: 'Chat with AI while inspecting. Ask about NCC codes, AS4349 requirements, termite treatment standards — get instant answers.',
              },
              {
                icon: FileText,
                title: 'AS4349 Compliant Reports',
                description: 'Pre-purchase, building only, pest only, stage inspections, dilapidation reports. All Australian states covered — correct legal text auto-inserted.',
              },
              {
                icon: DollarSign,
                title: 'Report Lock + Payments',
                description: 'Client pays online to unlock the report. Stripe integration — card, Apple Pay, Google Pay. No more chasing payments after delivery.',
              },
              {
                icon: Users,
                title: 'Team Management',
                description: 'Add full-time inspectors and subcontractors. Role-based permissions, QA review workflow, company-wide branding on all reports.',
              },
            ].map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="bg-white rounded-2xl p-6 border border-slate-200 relative">
                  {feature.badge && (
                    <span className="absolute top-4 right-4 text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                      {feature.badge}
                    </span>
                  )}
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-500">Less than your morning coffees. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {[
              { name: 'Solo', price: 89, inspectors: '1 inspector', popular: false, features: ['Unlimited reports', 'AI photo analysis', 'Voice-to-report', 'Client portal', 'Invoicing + Stripe', 'All 8 report types'] },
              { name: 'Small Team', price: 179, inspectors: 'Up to 5 inspectors', popular: true, features: ['Everything in Solo', 'Team calendar', 'Admin dashboard', 'QA review workflow', 'Subcontractor support'] },
              { name: 'Company', price: 299, inspectors: 'Up to 20 inspectors', popular: false, features: ['Everything in Team', 'Regional admin hierarchy', 'Advanced analytics', 'White-label reports', 'Priority support'] },
              { name: 'Enterprise', price: 799, inspectors: '20+ inspectors', popular: false, features: ['Everything in Company', 'Custom onboarding', 'API access', 'SSO login', 'Dedicated account manager'] },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl border p-6 ${plan.popular ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'border-slate-200'}`}>
                {plan.popular && <div className="text-xs font-semibold text-blue-600 mb-3">MOST POPULAR</div>}
                <h3 className="font-bold text-slate-900 text-lg">{plan.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{plan.inspectors}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-slate-500 text-sm">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className={`block text-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border border-slate-200 hover:border-slate-300 text-slate-700'}`}
                >
                  Start free trial
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-400 mt-8">All prices AUD + GST. Compare: Spectora $99/mo (US only, no AU standards) · Formitize $80/mo (no AI)</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">InspectIQ</span>
          </div>
          <p className="text-xs">© 2026 InspectIQ · Built for Australian building inspectors · AS4349 compliant</p>
        </div>
      </footer>
    </div>
  )
}
