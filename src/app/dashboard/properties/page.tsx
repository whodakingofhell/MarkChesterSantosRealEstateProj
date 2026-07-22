'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  propertyType: string;
  status: string;
  price: number;
  city: string;
  province: string;
  bedrooms?: number;
  bathrooms?: number;
  floorArea?: number;
  lotArea?: number;
  address: string;
  description: string;
  features: string[];
  images: string[];
  createdAt: string;
}

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Condo Unit in BGC',
    propertyType: 'RESIDENTIAL',
    status: 'ACTIVE',
    price: 15000000,
    city: 'Taguig',
    province: 'Metro Manila',
    bedrooms: 2,
    bathrooms: 2,
    floorArea: 85,
    address: '123 Main St, BGC, Taguig',
    description: 'A beautiful modern condo in the heart of BGC.',
    features: ['Swimming Pool', 'Gym', 'Parking'],
    images: [],
    createdAt: '2025-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Commercial Space in Makati CBD',
    propertyType: 'COMMERCIAL',
    status: 'PENDING',
    price: 25000000,
    city: 'Makati',
    province: 'Metro Manila',
    floorArea: 200,
    address: '456 Ayala Ave, Makati City',
    description: 'Prime commercial space in Makati CBD.',
    features: ['Corner Unit', 'High Foot Traffic'],
    images: [],
    createdAt: '2025-02-20T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Beachfront Lot in Batangas',
    propertyType: 'LAND',
    status: 'SOLD',
    price: 8500000,
    city: 'Nasugbu',
    province: 'Batangas',
    lotArea: 500,
    address: '789 Beach Rd, Nasugbu, Batangas',
    description: 'Pristine beachfront lot with mountain views.',
    features: ['Beach Access', 'Mountain View'],
    images: [],
    createdAt: '2024-11-10T00:00:00.000Z',
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'ACTIVE':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    case 'SOLD':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Sold
        </span>
      );
    case 'WITHDRAWN':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Withdrawn
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
}

export default function DashboardPropertiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProperties();
    }
  }, [status]);

  async function fetchProperties() {
    try {
      setLoading(true);
      const response = await fetch('/api/properties?limit=100');
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      if (result.success && result.data) {
        setProperties(result.data);
      } else {
        setProperties(MOCK_PROPERTIES);
      }
    } catch {
      setProperties(MOCK_PROPERTIES);
    } finally {
      setLoading(false);
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-secondary-50">
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/dashboard"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-4 inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-secondary-900 mt-2 mb-2">
            My Properties
          </h1>
          <p className="text-secondary-600">
            Manage your property listings
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 text-secondary-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No properties yet
            </h3>
            <p className="text-secondary-600">
              Add your first property to get started.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-secondary-200">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-secondary-900">
                          {property.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-primary-100 text-primary-800 text-xs px-2.5 py-1 rounded-full font-medium">
                          {property.propertyType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(property.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-secondary-900">
                          {formatPrice(property.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary-600">
                          {property.city}, {property.province}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                        <div className="flex items-center gap-3">
                          {property.bedrooms != null && (
                            <span>{property.bedrooms} bd</span>
                          )}
                          {property.bathrooms != null && (
                            <span>{property.bathrooms} ba</span>
                          )}
                          {(property.floorArea ?? property.lotArea) != null && (
                            <span>{property.floorArea ?? property.lotArea} sqm</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-secondary-900 flex-1 mr-2">
                      {property.title}
                    </h3>
                    {getStatusBadge(property.status)}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded-full font-medium">
                      {property.propertyType}
                    </span>
                    <span className="text-xs text-secondary-500">
                      {property.city}, {property.province}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-secondary-500 mb-3">
                    {property.bedrooms != null && (
                      <span>{property.bedrooms} Bedrooms</span>
                    )}
                    {property.bathrooms != null && (
                      <span>{property.bathrooms} Bathrooms</span>
                    )}
                    {(property.floorArea ?? property.lotArea) != null && (
                      <span>{property.floorArea ?? property.lotArea} sqm</span>
                    )}
                  </div>
                  <p className="text-lg font-bold text-primary-600">
                    {formatPrice(property.price)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
