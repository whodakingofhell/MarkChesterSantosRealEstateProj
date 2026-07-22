'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  propertyType: string;
  price: number;
  city: string;
  province: string;
  bedrooms?: number;
  bathrooms?: number;
  floorArea?: number;
  lotArea?: number;
  images: string;
  broker: {
    user: { name: string };
    slug: string;
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
  const label = type || 'Property';
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect fill="%23${color}20" width="600" height="400"/><text fill="%23${color}" font-family="system-ui" font-size="24" font-weight="bold" x="300" y="190" text-anchor="middle">${label}</text><text fill="%23${color}80" font-family="system-ui" font-size="14" x="300" y="220" text-anchor="middle">No image available</text></svg>`)}`;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetch('/api/properties?limit=50')
      .then((r) => r.json())
      .then((data) => {
        setProperties(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = properties.filter((p) => {
    const matchesSearch = !filter || p.title.toLowerCase().includes(filter.toLowerCase()) || p.city.toLowerCase().includes(filter.toLowerCase());
    const matchesType = !typeFilter || p.propertyType === typeFilter;
    return matchesSearch && matchesType;
  });

  function getImageSrc(p: Property): string {
    try {
      const imgs = JSON.parse(p.images || '[]');
      if (imgs.length > 0 && imgs[0]) return imgs[0];
    } catch {}
    return getPlaceholderImage(p.propertyType);
  }

  return (
    <main className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <section className="bg-white dark:bg-secondary-800 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">Properties</h1>
          <p className="text-secondary-600 dark:text-secondary-400">Browse available properties listed on Philippine Skyland</p>
        </div>
      </section>

      <section className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="">All Types</option>
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="INDUSTRIAL">Industrial</option>
              <option value="LAND">Land</option>
            </select>
            <input
              type="text"
              placeholder="Search properties..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field flex-grow"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-secondary-200 dark:bg-secondary-700 overflow-hidden">
                  <img
                    src={getImageSrc(property)}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 text-xs px-2 py-1 rounded-full">
                      {property.propertyType}
                    </span>
                  </div>
                  <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">{property.title}</h3>
                  <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-2">
                    📍 {property.city}, {property.province}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400 mb-3">
                    {property.bedrooms && <span>🛏️ {property.bedrooms} Beds</span>}
                    {property.bathrooms && <span>🚿 {property.bathrooms} Baths</span>}
                    {property.floorArea && <span>📐 {property.floorArea} sqm</span>}
                    {property.lotArea && <span>🏞️ {property.lotArea} sqm</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-primary-600">{formatPrice(property.price)}</p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">by {property.broker.user.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg font-medium text-secondary-900 dark:text-white mb-2">No properties found</p>
            <p className="text-secondary-600 dark:text-secondary-400">Try adjusting your filters or search terms</p>
          </div>
        )}
      </section>
    </main>
  );
}
