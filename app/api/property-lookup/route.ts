import { NextRequest, NextResponse } from 'next/server'

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

function parsePropertyFromAddress(address: string): PropertyDetails {
  const lower = address.toLowerCase()

  // Determine building type
  const isApartment = lower.includes('unit') || lower.includes('/') || lower.includes('apt') || lower.includes('level ')
  const isTownhouse = lower.includes('townhouse') || lower.includes('town house')
  const building_type = isApartment ? 'apartment' : isTownhouse ? 'townhouse' : 'house'

  // Try to parse unit/street number
  const unitMatch = address.match(/^(\d+)\//)
  const streetNumMatch = address.match(/^(\d+)\s/)
  const streetNum = unitMatch ? parseInt(unitMatch[1]) : streetNumMatch ? parseInt(streetNumMatch[1]) : 1

  // Seed a pseudo-random based on address characters for consistency
  const seed = address.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const pseudo = (min: number, max: number) => min + ((seed * 17 + 13) % (max - min + 1))

  // Set realistic values based on property type
  let bedrooms: number
  let bathrooms: number
  let parking: number
  let land_size: number | null
  let floor_area: number
  let year_built: number

  if (building_type === 'apartment') {
    bedrooms = pseudo(1, 3)
    bathrooms = bedrooms >= 3 ? 2 : 1
    parking = pseudo(0, 1)
    land_size = null
    floor_area = 55 + pseudo(0, 65) // 55–120 sqm
    year_built = 1990 + pseudo(0, 34)
  } else if (building_type === 'townhouse') {
    bedrooms = 2 + pseudo(0, 2)
    bathrooms = bedrooms >= 4 ? 2 : pseudo(1, 2)
    parking = 1 + pseudo(0, 1)
    land_size = 150 + pseudo(0, 200)
    floor_area = 130 + pseudo(0, 90)
    year_built = 1995 + pseudo(0, 29)
  } else {
    // House — larger range
    bedrooms = 2 + pseudo(0, 4)
    bathrooms = bedrooms >= 4 ? 2 + pseudo(0, 1) : 1 + pseudo(0, 1)
    parking = 1 + pseudo(0, 2)
    land_size = 400 + pseudo(0, 800)
    floor_area = 140 + pseudo(0, 200)
    year_built = 1955 + pseudo(0, 68)
  }

  // Sydney approximate GPS coordinates with slight variation
  const baseLat = -33.8688 + (seed % 100) * 0.001
  const baseLng = 151.2093 + (seed % 100) * 0.001

  return {
    bedrooms,
    bathrooms,
    parking,
    building_type,
    year_built,
    land_size,
    floor_area,
    lat: parseFloat(baseLat.toFixed(4)),
    lng: parseFloat(baseLng.toFixed(4)),
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  }

  // Simulate slight network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const details = parsePropertyFromAddress(address)

  return NextResponse.json({
    success: true,
    address,
    ...details,
  })
}
