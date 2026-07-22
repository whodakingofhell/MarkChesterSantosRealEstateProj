'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ContactButtons } from '@/components/ContactButtons';

interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  status: string;
  price: number;
  address: string;
  city: string;
  province: string;
  bedrooms?: number;
  bathrooms?: number;
  floorArea?: number;
  lotArea?: number;
  carGarage?: number;
  features: string;
  images: string;
  broker: {
    id: string;
    slug: string;
    user: { name: string; email: string };
    contactInfo?: string;
  };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getPlaceholderImage(type: string): string {
  const colors: Record<string, string> = {
    RESIDENTIAL: '0ea5e9',
    COMMERCIAL: '8b5cf6',
    LAND: '22c55e',
    INDUSTRIAL: 'f59e0b',
  };
  const color = colors[type] || '64748b';
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect fill="%23${color}20" width="800" height="500"/><text fill="%23${color}" font-family="system-ui" font-size="32" font-weight="bold" x="400" y="240" text-anchor="middle">No Image Available</text><text fill="%23${color}80" font-family="system-ui" font-size="16" x="400" y="270" text-anchor="middle">${type}</text></svg>`)}`;
}

export default function PropertyPage() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/properties?limit=50`)
        .then((r) => r.json())
        .then((data) => {
          const props = data.data || [];
          const found = props.find((p: Property) => p.id === params.id);
          setProperty(found || null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-secondary-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-secondary-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">Property Not Found</h1>
          <Link href="/properties" className="text-primary-600 hover:text-primary-700">Back to Properties</Link>
        </div>
      </div>
    );
  }

  let imageUrls: string[] = [];
  try {
    imageUrls = JSON.parse(property.images || '[]');
  } catch {}
  if (imageUrls.length === 0) {
    imageUrls = [getPlaceholderImage(property.propertyType)];
  }

  let features: string[] = [];
  try {
    features = JSON.parse(property.features || '[]');
  } catch {}

  let contactInfo: any = {};
  try {
    contactInfo = JSON.parse(property.broker.contactInfo || '{}');
  } catch {}

  const brokerContact = {
    phone: contactInfo.phone || '+63 917 472 2107',
    whatsapp: contactInfo.whatsapp,
    email: property.broker.user.email,
  };

  return (
    <main className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-secondary-600 dark:text-secondary-400">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/properties" className="hover:text-primary-600">Properties</Link>
            <span className="mx-2">/</span>
            <span className="text-secondary-900 dark:text-white">{property.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-secondary-200 dark:bg-secondary-700">
                <img
                  src={imageUrls[selectedImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {imageUrls.length > 1 && (
                <div className="p-3 flex gap-2 overflow-x-auto">
                  {imageUrls.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-20 h-14 rounded overflow-hidden border-2 transition-colors ${
                        selectedImage === i ? 'border-primary-500' : 'border-transparent hover:border-secondary-300'
                      }`}
                    >
                      <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {imageUrls.length > 1 && (
                <div className="px-4 pb-3 text-center">
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">{selectedImage + 1} of {imageUrls.length} images</p>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 text-sm px-3 py-1 rounded-full">
                  {property.propertyType}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  property.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-secondary-100 text-secondary-800'
                }`}>
                  {property.status}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">{property.title}</h1>
              <p className="text-xl text-primary-600 font-bold mb-4">{formatPrice(property.price)}</p>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">📍 {property.address}, {property.city}, {property.province}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.bedrooms && (
                  <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                    <p className="text-2xl font-bold text-secondary-900 dark:text-white">{property.bedrooms}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                    <p className="text-2xl font-bold text-secondary-900 dark:text-white">{property.bathrooms}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Bathrooms</p>
                  </div>
                )}
                {property.floorArea && (
                  <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                    <p className="text-2xl font-bold text-secondary-900 dark:text-white">{property.floorArea}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Floor Area (sqm)</p>
                  </div>
                )}
                {property.lotArea && (
                  <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                    <p className="text-2xl font-bold text-secondary-900 dark:text-white">{property.lotArea}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Lot Area (sqm)</p>
                  </div>
                )}
                {property.carGarage && (
                  <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                    <p className="text-2xl font-bold text-secondary-900 dark:text-white">{property.carGarage}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Car Garage</p>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">Description</h2>
              <p className="text-secondary-600 dark:text-secondary-400 whitespace-pre-line mb-6">{property.description}</p>

              {features.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">Features</h2>
                  <ul className="grid grid-cols-2 gap-2 mb-6">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">Contact Agent</h2>
              <div className="mb-4 pb-4 border-b border-secondary-200 dark:border-secondary-700">
                <Link
                  href={`/profile/${property.broker.slug}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {property.broker.user.name}
                </Link>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Licensed Real Estate Broker</p>
              </div>

              <ContactButtons
                contactInfo={brokerContact}
                professionalName={property.broker.user.name}
                professionalId={property.broker.id}
              />

              <div className="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
                <p className="text-sm text-secondary-500 dark:text-secondary-400 text-center">
                  Listed on Philippine Skyland
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
