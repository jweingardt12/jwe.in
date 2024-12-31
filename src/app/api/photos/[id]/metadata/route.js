import { NextResponse } from 'next/server'

// This would typically come from a database or external API
const photoMetadata = {
  '1': {
    title: 'Wrigley Field, Chicago',
    views: 1787492,
    downloads: 86580,
    camera: 'iPhone 7 Plus',
    aperture: '2.8',
    focalLength: '6.6',
    iso: '20'
  },
  '2': {
    title: 'Downtown Chicago',
    views: 892345,
    downloads: 45123,
    camera: 'Canon EOS R5',
    aperture: '1.8',
    focalLength: '50',
    iso: '100'
  },
  '3': {
    title: 'Lake Michigan Sunset',
    views: 654789,
    downloads: 32145,
    camera: 'Sony A7III',
    aperture: '2.8',
    focalLength: '24',
    iso: '400'
  },
  '4': {
    title: 'Chicago River',
    views: 456123,
    downloads: 23456,
    camera: 'Fujifilm X-T4',
    aperture: '4.0',
    focalLength: '35',
    iso: '200'
  },
  '5': {
    title: 'Millennium Park',
    views: 789456,
    downloads: 34567,
    camera: 'Nikon Z6',
    aperture: '2.0',
    focalLength: '85',
    iso: '64'
  }
}

export async function GET(request, { params }) {
  const { id } = params
  
  if (!photoMetadata[id]) {
    return new NextResponse(JSON.stringify({ error: 'Photo not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return new NextResponse(JSON.stringify(photoMetadata[id]), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
} 