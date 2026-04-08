import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerClient } from '@/lib/supabase'
import type { InspectionType, JobStatus } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    property_address,
    client_name,
    client_email,
    client_phone,
    inspection_type,
    scheduled_date,
    scheduled_time,
    fee,
    notes,
    send_agreement,
    referring_agent,
  } = body as {
    property_address: string
    client_name: string
    client_email: string
    client_phone?: string
    inspection_type: InspectionType
    scheduled_date: string
    scheduled_time?: string
    fee: number
    notes?: string
    send_agreement?: boolean
    referring_agent?: string
  }

  // Validate required fields
  if (!property_address || !client_name || !client_email || !inspection_type || !scheduled_date || !fee) {
    return NextResponse.json(
      { error: 'Missing required fields: property_address, client_name, client_email, inspection_type, scheduled_date, fee' },
      { status: 422 }
    )
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRe.test(client_email)) {
    return NextResponse.json({ error: 'Invalid client_email' }, { status: 422 })
  }

  if (typeof fee !== 'number' || fee <= 0) {
    return NextResponse.json({ error: 'fee must be a positive number' }, { status: 422 })
  }

  // Build datetime for scheduled_date (combine date + time if provided)
  const scheduledDatetime = scheduled_time
    ? `${scheduled_date}T${scheduled_time}:00`
    : scheduled_date

  let supabase: ReturnType<typeof createServerClient>
  try {
    supabase = createServerClient()
  } catch {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const insertPayload: {
    client_name: string
    client_email: string
    client_phone?: string
    property_address: string
    inspection_type: InspectionType
    scheduled_date: string
    fee: number
    status: JobStatus
    notes?: string
    referring_agent?: string
    // company_id and inspector_id would come from auth session in production
  } = {
    client_name,
    client_email,
    property_address,
    inspection_type,
    scheduled_date: scheduledDatetime,
    fee,
    status: 'booked' as JobStatus,
    ...(client_phone && { client_phone }),
    ...(notes && { notes }),
    ...(referring_agent && { referring_agent }),
  }

  const { data: job, error: dbError } = await supabase
    .from('jobs')
    .insert(insertPayload)
    .select()
    .single()

  if (dbError) {
    console.error('Supabase insert error:', dbError)
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  // Send agreement email if requested
  if (send_agreement !== false && process.env.RESEND_API_KEY) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const signLink = `${appUrl}/portal/${job.id}`
    const formattedDate = new Date(scheduledDatetime).toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    await resend.emails.send({
      from: 'InspectIQ <agreements@inspectiq.com.au>',
      to: client_email,
      subject: `Inspection Agreement - ${property_address}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;margin:0;padding:0">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">
        <!-- Header -->
        <tr><td style="background:#1d4ed8;padding:32px 40px">
          <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700">InspectIQ</h1>
          <p style="color:#bfdbfe;margin:4px 0 0;font-size:14px">Building Inspection Agreement</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px">
          <p style="color:#1e293b;font-size:16px;margin:0 0 16px">Dear ${client_name},</p>
          <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px">
            Your building inspection has been booked. Please review and sign the inspection agreement before your appointment.
          </p>
          <!-- Details box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;border-radius:8px;margin-bottom:32px">
            <tr><td style="padding:24px">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;color:#64748b;font-size:14px;width:140px">Property</td>
                  <td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:600">${property_address}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#64748b;font-size:14px">Date</td>
                  <td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:600">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#64748b;font-size:14px">Inspection Fee</td>
                  <td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:600">$${fee} AUD (inc. GST)</td>
                </tr>
              </table>
            </td></tr>
          </table>
          <!-- CTA -->
          <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px">
            <tr><td align="center" style="background:#1d4ed8;border-radius:8px">
              <a href="${signLink}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none">
                Review &amp; Sign Agreement
              </a>
            </td></tr>
          </table>
          <p style="color:#94a3b8;font-size:13px;line-height:1.5;margin:0">
            If the button above doesn't work, copy and paste this link into your browser:<br>
            <a href="${signLink}" style="color:#1d4ed8">${signLink}</a>
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0">
          <p style="color:#94a3b8;font-size:12px;margin:0;line-height:1.6">
            This email was sent by InspectIQ on behalf of your building inspector.<br>
            The inspection cannot proceed until the agreement has been signed.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    }).catch((err: unknown) => {
      // Log but don't fail the request — job is already created
      console.error('Resend email error:', err)
    })
  }

  return NextResponse.json({ job }, { status: 201 })
}
