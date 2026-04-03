import { NextRequest, NextResponse } from 'next/server'

const MOCK_ADDRESSES = [
  '14/18 Orchard Street, West Ryde NSW 2114',
  '42 Willoughby Road, Crows Nest NSW 2065',
  '8 Glenmore Road, Paddington NSW 2021',
  '22 Pacific Highway, Chatswood NSW 2067',
  '5/120 Bronte Road, Bondi Junction NSW 2022',
  '77 Anzac Parade, Kensington NSW 2033',
  '3/45 Miller Street, North Sydney NSW 2060',
  '128 Macquarie Street, Sydney NSW 2000',
  '15 Bay Street, Double Bay NSW 2028',
  '92 Longueville Road, Lane Cove NSW 2066',
  '6/34 Belmore Street, Burwood NSW 2134',
  '201 Pacific Highway, St Leonards NSW 2065',
  '18 Addison Road, Manly NSW 2095',
  '47 Darling Street, Balmain NSW 2041',
  '11/88 Alfred Street, Milsons Point NSW 2061',
  '34 Tennyson Road, Mortlake NSW 2137',
  '2/67 Phillip Street, Parramatta NSW 2150',
  '55 Burns Bay Road, Lane Cove NSW 2066',
  '103 Victoria Road, Gladesville NSW 2111',
  '9 Warrangi Street, Turramurra NSW 2074',
  '23 Church Street, Ryde NSW 2112',
  '412 New Canterbury Road, Dulwich Hill NSW 2203',
  '7/19 Prospect Street, Rosehill NSW 2142',
  '1 Martin Place, Sydney NSW 2000',
  '88 Botany Road, Alexandria NSW 2015',
  '30 Atchison Street, Crows Nest NSW 2065',
  '16 Bay Road, Waverton NSW 2060',
  '4/12 Holt Street, Surry Hills NSW 2010',
  '52 Oaks Avenue, Dee Why NSW 2099',
  '19 Arabella Street, Longueville NSW 2066',
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  const lower = query.toLowerCase()
  const suggestions = MOCK_ADDRESSES
    .filter(addr => addr.toLowerCase().includes(lower))
    .slice(0, 6)
    .map(address => ({ address, displayText: address }))

  // If no matches, generate some realistic variations based on query
  if (suggestions.length === 0) {
    const generated = [
      `${query}, Sydney NSW 2000`,
      `${query}, North Sydney NSW 2060`,
      `${query}, Parramatta NSW 2150`,
    ].map(address => ({ address, displayText: address }))
    return NextResponse.json({ suggestions: generated })
  }

  return NextResponse.json({ suggestions })
}
