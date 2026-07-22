'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
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
    userId: string;
    slug: string;
    user: { name: string; email: string; role: string };
    contactInfo?: string;
  };
}

function formatPrice(price: number): string {
  if (price >= 1000000) return `₱${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}M`;
  return new Intl.NumberFormat('en-PH', {
    style: 'currency', currency: 'PHP',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(price);
}

function getTypeColor(type: string): string {
  const c: Record<string, string> = {
    LOT_ONLY: '#22c55e', HOUSE_AND_LOT: '#0ea5e9', FARM_LOT: '#84cc16',
    COMMERCIAL: '#8b5cf6', BEACHFRONT: '#06b6d4', CONDOMINIUM: '#ec4899',
    TOWNHOUSE: '#f59e0b', MIXED_USE: '#6366f1', INDUSTRIAL: '#f97316',
    LAND: '#10b981', RESIDENTIAL: '#3b82f6', CONDO: '#ec4899', APARTMENT: '#a855f7',
  };
  return c[type] || '#64748b';
}

function getPlaceholderImage(type: string): string {
  const color = getTypeColor(type);
  const label = type.replace(/_/g, ' ');
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect fill="%23${color}20" width="800" height="500"/><rect fill="%23${color}40" x="350" y="180" width="100" height="100" rx="10"/><text fill="%23${color}" font-family="system-ui" font-size="28" font-weight="bold" x="400" y="330" text-anchor="middle">${label}</text><text fill="%23${color}80" font-family="system-ui" font-size="14" x="400" y="355" text-anchor="middle">No image available</text></svg>`)}`;
}

export default function PropertyPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userRole = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;
  const isOwner = property?.broker.userId === userId;
  const isAdmin = userRole === 'ADMIN';
  const canEditImages = isOwner || isAdmin;

  useEffect(() => {
    if (params.id) {
      fetch(`/api/properties?limit=100`)
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !property) return;

    setUploading(true);
    setUploadError(null);

    try {
      const currentImages = JSON.parse(property.images || '[]');
      const newImages: string[] = [];

      for (const file of Array.from(files)) {
        if (currentImages.length + newImages.length >= 20) {
          setUploadError('Maximum 20 images allowed');
          break;
        }

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          setUploadError('Only JPEG, PNG, and WebP images are allowed');
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          setUploadError('File size must be 5MB or less');
          continue;
        }

        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        });
        newImages.push(dataUrl);
      }

      if (newImages.length > 0) {
        const allImages = [...currentImages, ...newImages];
        const res = await fetch(`/api/properties/${property.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: allImages }),
        });

        if (!res.ok) {
          const data = await res.json();
          setUploadError(data.error || 'Failed to upload images');
          return;
        }

        const updated = await res.json();
        setProperty((prev) => prev ? { ...prev, images: JSON.stringify(updated.data.images) } : prev);
      }
    } catch {
      setUploadError('Failed to process images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleRemoveImage(index: number) {
    if (!property) return;

    try {
      const res = await fetch(`/api/properties/${property.id}?index=${index}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        setUploadError('Failed to remove image');
        return;
      }

      const currentImages = JSON.parse(property.images || '[]');
      currentImages.splice(index, 1);
      setProperty((prev) => prev ? { ...prev, images: JSON.stringify(currentImages) } : prev);
      if (selectedImage >= currentImages.length) setSelectedImage(Math.max(0, currentImages.length - 1));
    } catch {
      setUploadError('Failed to remove image');
    }
  }

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
  try { imageUrls = JSON.parse(property.images || '[]'); } catch {}
  if (imageUrls.length === 0) imageUrls = [getPlaceholderImage(property.propertyType)];

  let features: string[] = [];
  try { features = JSON.parse(property.features || '[]'); } catch {}

  let contactInfo: any = {};
  try { contactInfo = JSON.parse(property.broker.contactInfo || '{}'); } catch {}

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
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-secondary-200 dark:bg-secondary-700">
                <img src={imageUrls[selectedImage]} alt={property.title} className="w-full h-full object-cover" />
              </div>
              {imageUrls.length > 1 && (
                <div className="p-3 flex gap-2 overflow-x-auto">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative flex-shrink-0 group">
                      <button
                        onClick={() => setSelectedImage(i)}
                        className={`w-20 h-14 rounded overflow-hidden border-2 transition-colors ${
                          selectedImage === i ? 'border-primary-500' : 'border-transparent hover:border-secondary-300'
                        }`}
                      >
                        <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                      {canEditImages && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveImage(i); }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {imageUrls.length > 1 && (
                <div className="px-4 pb-3 text-center">
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">{selectedImage + 1} of {imageUrls.length} images</p>
                </div>
              )}

              {canEditImages && (
                <div className="px-4 pb-4 border-t border-secondary-200 dark:border-secondary-700 pt-3">
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageUpload} className="hidden" />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading || imageUrls.length >= 20}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-900/60 transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                      {uploading ? 'Uploading...' : 'Add Images'}
                    </button>
                    <span className="text-xs text-secondary-400">{imageUrls.length}/20 images</span>
                  </div>
                  {uploadError && (
                    <p className="text-xs text-red-500 mt-2">{uploadError}</p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-white text-sm font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: getTypeColor(property.propertyType) }}
                >
                  {property.propertyType.replace(/_/g, ' ')}
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
                {property.bedrooms != null && property.bedrooms > 0 && (
                  <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                    <p className="text-2xl font-bold text-secondary-900 dark:text-white">{property.bedrooms}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms != null && property.bathrooms > 0 && (
                  <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                    <p className="text-2xl font-bold text-secondary-900 dark:text-white">{property.bathrooms}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Bathrooms</p>
                  </div>
                )}
                {property.floorArea && (
                  <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                    <p className="text-2xl font-bold text-secondary-900 dark:text-white">{property.floorArea.toLocaleString()}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Floor Area (sqm)</p>
                  </div>
                )}
                {property.lotArea && (
                  <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                    <p className="text-2xl font-bold text-secondary-900 dark:text-white">{property.lotArea.toLocaleString()}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Lot Area (sqm)</p>
                  </div>
                )}
                {property.carGarage != null && property.carGarage > 0 && (
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
                        <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">Contact Agent</h2>
              <div className="mb-4 pb-4 border-b border-secondary-200 dark:border-secondary-700">
                <Link href={`/profile/${property.broker.slug}`} className="text-primary-600 hover:text-primary-700 font-medium">
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
