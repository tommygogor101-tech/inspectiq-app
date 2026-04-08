import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

async function getAuthedAdmin(req: NextRequest) {
  const supabase = createServerClient()
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return { error: 'Unauthorized', status: 401, supabase, currentUser: null }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return { error: 'Unauthorized', status: 401, supabase, currentUser: null }

  const { data: currentUser, error: userError } = await supabase
    .from('users')
    .select('company_id, role')
    .eq('id', user.id)
    .single()

  if (userError || !currentUser?.company_id) return { error: 'User has no company', status: 400, supabase, currentUser: null }
  if (currentUser.role !== 'company_admin') return { error: 'Only admins can do this', status: 403, supabase, currentUser: null }

  return { error: null, status: 200, supabase, currentUser }
}

// PATCH /api/team/[id] — update role
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error, status, supabase, currentUser } = await getAuthedAdmin(req)
  if (error || !currentUser) return NextResponse.json({ error }, { status })

  const { role } = await req.json()
  if (!role) return NextResponse.json({ error: 'Role is required' }, { status: 400 })

  const { error: updateError } = await supabase
    .from('users')
    .update({ role })
    .eq('id', id)
    .eq('company_id', currentUser.company_id) // scoped to same company

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// DELETE /api/team/[id] — remove team member
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error, status, supabase, currentUser } = await getAuthedAdmin(req)
  if (error || !currentUser) return NextResponse.json({ error }, { status })

  // Verify the member is in the same company
  const { data: member, error: memberError } = await supabase
    .from('users')
    .select('id, company_id')
    .eq('id', id)
    .eq('company_id', currentUser.company_id)
    .single()

  if (memberError || !member) return NextResponse.json({ error: 'Member not found' }, { status: 404 })

  // Remove from users table first
  const { error: deleteUserError } = await supabase
    .from('users')
    .delete()
    .eq('id', id)

  if (deleteUserError) return NextResponse.json({ error: deleteUserError.message }, { status: 500 })

  // Delete auth user
  const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(id)
  if (deleteAuthError) {
    // Log but don't fail — users table row is already gone
    console.error('Failed to delete auth user:', deleteAuthError.message)
  }

  return NextResponse.json({ success: true })
}
