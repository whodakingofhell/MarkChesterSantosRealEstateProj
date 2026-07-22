'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

const PROPERTY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'LOT_ONLY', label: 'Lot Only' },
  { value: 'HOUSE_AND_LOT', label: 'House and Lot' },
  { value: 'FARM_LOT', label: 'Farm Lot' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'BEACHFRONT', label: 'Beachfront' },
  { value: 'CONDOMINIUM', label: 'Condominium' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
  { value: 'MIXED_USE', label: 'Mixed Use' },
  { value: 'INDUSTRIAL', label: 'Industrial' },
  { value: 'LAND', label: 'Land' },
  { value: 'RESIDENTIAL', label: 'Residential' },
  { value: 'CONDO', label: 'Condo' },
  { value: 'APARTMENT', label: 'Apartment' },
];

const BUDGET_RANGES = [
  { min: '', max: '', label: 'Any Budget' },
  { min: '0', max: '1000000', label: 'Under ₱1M' },
  { min: '1000000', max: '3000000', label: '₱1M - ₱3M' },
  { min: '3000000', max: '5000000', label: '₱3M - ₱5M' },
  { min: '5000000', max: '10000000', label: '₱5M - ₱10M' },
  { min: '10000000', max: '25000000', label: '₱10M - ₱25M' },
  { min: '25000000', max: '50000000', label: '₱25M - ₱50M' },
  { min: '50000000', max: '', label: 'Over ₱50M' },
];

const LOT_SIZES = [
  { min: '', max: '', label: 'Any Size' },
  { min: '0', max: '200', label: 'Under 200 sqm' },
  { min: '200', max: '500', label: '200 - 500 sqm' },
  { min: '500', max: '1000', label: '500 - 1,000 sqm' },
  { min: '1000', max: '5000', label: '1,000 - 5,000 sqm' },
  { min: '5000', max: '', label: 'Over 5,000 sqm' },
];

interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  status: string;
  price: number;
  lotArea?: number;
  floorArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  carGarage?: number;
  address: string;
  city: string;
  province: string;
  images: string;
  features: string;
  broker: {
    user: { name: string; email: string };
    slug: string;
  };
  createdAt: string;
}

function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `₱${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}M`;
  }
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatArea(area: number): string {
  return area.toLocaleString() + ' sqm';
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    LOT_ONLY: '#22c55e',
    HOUSE_AND_LOT: '#0ea5e9',
    FARM_LOT: '#84cc16',
    COMMERCIAL: '#8b5cf6',
    BEACHFRONT: '#06b6d4',
    CONDOMINIUM: '#ec4899',
    TOWNHOUSE: '#f59e0b',
    MIXED_USE: '#6366f1',
    INDUSTRIAL: '#f97316',
    LAND: '#10b981',
    RESIDENTIAL: '#3b82f6',
    CONDO: '#ec4899',
    APARTMENT: '#a855f7',
  };
  return colors[type] || '#64748b';
}

function getPlaceholderImage(type: string): string {
  const color = getTypeColor(type);
  const label = type.replace(/_/g, ' ');
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect fill="%23${color}15" width="600" height="400"/><rect fill="%23${color}30" x="250" y="150" width="100" height="100" rx="8"/><text fill="%23${color}" font-family="system-ui" font-size="18" font-weight="bold" x="300" y="280" text-anchor="middle">${label}</text><text fill="%23${color}80" font-family="system-ui" font-size="12" x="300" y="300" text-anchor="middle">No image available</text></svg>`)}`;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [lotSizeRange, setLotSizeRange] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (propertyType) params.set('propertyType', propertyType);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (bathrooms) params.set('bathrooms', bathrooms);
    if (city) params.set('city', city);
    if (province) params.set('province', province);
    
    const budget = BUDGET_RANGES.find(r => r.label === budgetRange);
    if (budget) {
      if (budget.min) params.set('minPrice', budget.min);
      if (budget.max) params.set('maxPrice', budget.max);
    }
    
    const lot = LOT_SIZES.find(r => r.label === lotSizeRange);
    if (lot) {
      if (lot.min) params.set('minLotArea', lot.min);
      if (lot.max) params.set('maxLotArea', lot.max);
    }
    
    params.set('limit', '50');
    
    try {
      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      setProperties(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, propertyType, budgetRange, lotSizeRange, bedrooms, bathrooms, city, province]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  function clearFilters() {
    setSearchQuery('');
    setPropertyType('');
    setBudgetRange('');
    setLotSizeRange('');
    setBedrooms('');
    setBathrooms('');
    setCity('');
    setProvince('');
  }

  const activeFilterCount = [propertyType, budgetRange, lotSizeRange, bedrooms, bathrooms, city, province].filter(Boolean).length;

  function getImageSrc(p: Property): string {
    try {
      const imgs = JSON.parse(p.images || '[]');
      if (imgs.length > 0 && imgs[0]) return imgs[0];
    } catch {}
    return getPlaceholderImage(p.propertyType);
  }

  function getTypeLabel(type: string): string {
    return PROPERTY_TYPES.find(t => t.value === type)?.label || type.replace(/_/g, ' ');
  }

  return (
    <main className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <section className="bg-white dark:bg-secondary-800 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">Properties for Sale</h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Browse {total} properties across the Philippines — Lot Only, House & Lot, Farm Lot, Commercial, Beachfront, and more
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search by name, city, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field flex-grow min-w-[200px]"
            />
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="input-field w-auto">
              {PROPERTY_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <select value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} className="input-field w-auto">
              {BUDGET_RANGES.map((r, i) => (
                <option key={i} value={r.label}>{r.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary-100 dark:bg-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5">{activeFilterCount}</span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Clear all
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-secondary-50 dark:bg-secondary-750 rounded-lg border border-secondary-200 dark:border-secondary-600">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Lot Size</label>
                  <select value={lotSizeRange} onChange={(e) => setLotSizeRange(e.target.value)} className="input-field w-full text-sm">
                    {LOT_SIZES.map((r, i) => (
                      <option key={i} value={r.label}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Bedrooms</label>
                  <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="input-field w-full text-sm">
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Bathrooms</label>
                  <select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="input-field w-full text-sm">
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Manila"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Province</label>
                  <input
                    type="text"
                    placeholder="e.g. Cavite"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="input-field w-full text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className="aspect-video bg-secondary-200 dark:bg-secondary-700 overflow-hidden relative">
                  <img
                    src={getImageSrc(property)}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-white text-xs font-bold px-3 py-1 rounded-full shadow"
                      style={{ backgroundColor: getTypeColor(property.propertyType) }}
                    >
                      {getTypeLabel(property.propertyType)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 dark:bg-secondary-800/90 text-secondary-700 dark:text-secondary-300 text-xs font-medium px-2 py-1 rounded-full">
                      {property.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-secondary-900 dark:text-white mb-1 line-clamp-1">{property.title}</h3>
                  <p className="text-secondary-500 dark:text-secondary-400 text-sm mb-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.city}, {property.province}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-secondary-500 dark:text-secondary-400 mb-3">
                    {property.lotArea && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                        {formatArea(property.lotArea)}
                      </span>
                    )}
                    {property.floorArea && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        {formatArea(property.floorArea)}
                      </span>
                    )}
                    {property.bedrooms != null && property.bedrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        {property.bedrooms} Bed
                      </span>
                    )}
                    {property.bathrooms != null && property.bathrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                        {property.bathrooms} Bath
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-secondary-100 dark:border-secondary-700">
                    <p className="text-xl font-bold text-primary-600">{formatPrice(property.price)}</p>
                    <p className="text-xs text-secondary-400">by {property.broker.user.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && properties.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-secondary-300 dark:text-secondary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-lg font-medium text-secondary-900 dark:text-white mb-2">No properties found</p>
            <p className="text-secondary-500 dark:text-secondary-400 mb-4">Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
