export type UserRole = 'company_admin' | 'inspector' | 'subcontractor' | 'office_staff'
export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'
export type InspectionType = 'pre_purchase_standard' | 'building_only' | 'pest_only' | 'stage' | 'dilapidation'
export type Plan = 'solo' | 'team' | 'company' | 'enterprise'
export type JobStatus = 'booked' | 'in_progress' | 'report_draft' | 'awaiting_payment' | 'completed' | 'cancelled'
export type DefectSeverity = 'minor' | 'major' | 'safety_hazard'

export interface User {
  id: string
  email: string
  full_name: string
  licence_number?: string
  state: AustralianState
  company_id?: string
  role: UserRole
  phone?: string
  signature_url?: string
  created_at: string
}

export interface Company {
  id: string
  name: string
  logo_url?: string
  plan: Plan
  state: AustralianState
  stripe_customer_id?: string
  stripe_subscription_id?: string
  abn?: string
  phone?: string
  email?: string
  address?: string
  created_at: string
}

export interface Job {
  id: string
  company_id: string
  inspector_id: string
  client_name: string
  client_email: string
  client_phone?: string
  property_address: string
  inspection_type: InspectionType
  scheduled_date: string
  fee: number
  status: JobStatus
  notes?: string
  agreement_signed_at?: string
  created_at: string
}

export interface Report {
  id: string
  job_id: string
  status: 'draft' | 'review' | 'final' | 'delivered'
  data: ReportData
  pdf_url?: string
  created_at: string
  updated_at: string
}

export interface ReportData {
  // Property details
  property_address: string
  inspection_date: string
  inspector_name: string
  inspector_licence: string
  client_name: string
  inspection_type: InspectionType

  // General description
  building_type?: string
  storeys?: string
  building_age?: string
  construction_main_floor?: string
  construction_walls?: string
  construction_roof?: string
  occupancy_status?: string
  prevailing_weather?: string
  overall_condition?: string

  // Section D - Property Report
  serious_safety_hazards?: DefectItem[]
  ceiling_defects?: DefectItem[]
  internal_wall_defects?: DefectItem[]
  floor_defects?: DefectItem[]
  joinery_defects?: DefectItem[]
  kitchen_defects?: DefectItem[]
  bathroom_defects?: DefectItem[]
  external_wall_defects?: DefectItem[]
  roof_exterior_defects?: DefectItem[]
  minor_defects?: DefectItem[]

  // Section E - Timber Pest Report
  termite_activity?: string
  termite_management_recommendation?: string
  fungal_decay?: DefectItem[]
  wood_borers?: string
  excessive_moisture?: DefectItem[]
  conducive_conditions?: string[]

  // Conclusion
  overall_rating?: 'below_average' | 'average' | 'above_average'
  property_report_conclusion?: string
  timber_pest_conclusion?: string
  additional_comments?: string
  recommended_specialists?: string[]

  // Obstructions
  obstructions?: string[]
  inaccessible_areas?: string[]
  undetected_defect_risk?: 'low' | 'moderate' | 'moderate_high' | 'high'
}

export interface DefectItem {
  id: string
  location: string
  description: string
  severity: DefectSeverity
  as_code?: string
  recommendation: string
  photos?: string[]
  ai_generated?: boolean
}

export interface Photo {
  id: string
  report_id: string
  url: string
  thumbnail_url?: string
  location_tag?: string
  timestamp: string
  gps_lat?: number
  gps_lng?: number
  ai_analysis?: AIPhotoAnalysis
}

export interface AIPhotoAnalysis {
  defect_detected: boolean
  defect_type?: string
  severity?: DefectSeverity
  description?: string
  as_code?: string
  recommendation?: string
  confidence: number
}

export const PLANS: Record<Plan, { name: string; price: number; inspectors: string; features: string[] }> = {
  solo: {
    name: 'Solo',
    price: 89,
    inspectors: '1 inspector',
    features: ['Unlimited reports', 'AI photo analysis', 'Voice-to-report', 'Client portal', 'Invoicing', 'All report types'],
  },
  team: {
    name: 'Small Team',
    price: 179,
    inspectors: '2-5 inspectors',
    features: ['Everything in Solo', 'Team calendar', 'Admin dashboard', 'QA review workflow', 'Subcontractor support'],
  },
  company: {
    name: 'Company',
    price: 299,
    inspectors: '6-20 inspectors',
    features: ['Everything in Team', 'Regional admin hierarchy', 'Advanced analytics', 'White-label reports', 'Priority support'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 799,
    inspectors: '20+ inspectors',
    features: ['Everything in Company', 'Custom onboarding', 'API access', 'SSO', 'Dedicated account manager', 'Custom SLA'],
  },
}

export const INSPECTION_TYPES: Record<InspectionType, string> = {
  pre_purchase_standard: 'Pre-Purchase Standard (Building + Pest)',
  building_only: 'Building Inspection Only',
  pest_only: 'Timber Pest Inspection Only',
  stage: 'Stage Inspection',
  dilapidation: 'Dilapidation Report',
}

export const AU_STATES: Record<AustralianState, string> = {
  NSW: 'New South Wales',
  VIC: 'Victoria',
  QLD: 'Queensland',
  WA: 'Western Australia',
  SA: 'South Australia',
  TAS: 'Tasmania',
  ACT: 'Australian Capital Territory',
  NT: 'Northern Territory',
}
