import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/team — list all users in current user's company
export async function GET(req: NextRequest) {
  const supabase = createServerClient()

  // Get the current user from the auth header
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get current user's company_id from users table
  const { data: currentUser, error: userError } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (userError || !currentUser?.company_id) {
    return NextResponse.json({ error: 'User has no company' }, { status: 400 })
  }

  // Get all team members
  const { data: teamMembers, error: teamError } = await supabase
    .from('users')
    .select('id, full_name, email, role, licence_number, phone, created_at')
    .eq('company_id', currentUser.company_id)
    .order('created_at', { ascending: true })

  if (teamError) {
    return NextResponse.json({ error: teamError.message }, { status: 500 })
  }

  return NextResponse.json({ members: teamMembers })
}

// POST /api/team — invite a new team member
export async function POST(req: NextRequest) {
  const supabase = createServerClient()

  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get current user's company_id and verify they are admin
  const { data: currentUser, error: userError } = await supabase
    .from('users')
    .select('company_id, role')
    .eq('id', user.id)
    .single()

  if (userError || !currentUser?.company_id) {
    return NextResponse.json({ error: 'User has no company' }, { status: 400 })
  }

  if (currentUser.role !== 'company_admin') {
    return NextResponse.json({ error: 'Only company admins can invite team members' }, { status: 403 })
  }

  const body = await req.json()
  const { email, role } = body

  if (!email || !role) {
    return NextResponse.json({ error: 'Email and role are required' }, { status: 400 })
  }

  // Create the auth user (sends invite email)
  const { data: newAuthUser, error: createError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    password: Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12).toUpperCase() + '!',
  })

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 })
  }

  // Insert into users table
  const full_name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
  const { error: insertError } = await supabase.from('users').insert({
    id: newAuthUser.user.id,
    email,
    full_name,
    role,
    company_id: currentUser.company_id,
    state: 'NSW', // default, can be updated in settings
  })

  if (insertError) {
    // Rollback: delete the auth user
    await supabase.auth.admin.deleteUser(newAuthUser.user.id)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({
    member: {
      id: newAuthUser.user.id,
      email,
      full_name,
      role,
    }
  }, { status: 201 })
}
