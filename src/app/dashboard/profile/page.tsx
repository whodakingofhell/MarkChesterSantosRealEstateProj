'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';

const SPECIALIZATIONS = ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND'] as const;

interface BrokerProfile {
  name: string;
  email: string;
  bio: string;
  phone: string;
  address: string;
  specializations: string[];
  profilePhoto: string;
  documents: { name: string; size: string; type: string; dataUrl: string }[];
}

const DEFAULT_PROFILE: BrokerProfile = {
  name: '',
  email: '',
  bio: '',
  phone: '',
  address: '',
  specializations: [],
  profilePhoto: '',
  documents: [],
};

export default function DashboardProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<BrokerProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const loadProfile = useCallback(async () => {
    if (status !== 'authenticated') return;
    setLoading(true);

    const savedData = localStorage.getItem('broker-profile');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as BrokerProfile;
        setProfile(parsed);
        if (parsed.profilePhoto) setPhotoPreview(parsed.profilePhoto);
        setLoading(false);
        return;
      } catch {
        // fall through
      }
    }

    let brokerName = session?.user?.name ?? 'Nelson Aczon';
    let brokerEmail = session?.user?.email ?? '';

    try {
      const response = await fetch('/api/properties?limit=50');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.broker) {
          brokerName = result.data.broker.name ?? brokerName;
          brokerEmail = result.data.broker.email ?? brokerEmail;
        }
      }
    } catch {
      // use session data as fallback
    }

    const initialProfile: BrokerProfile = {
      name: brokerName,
      email: brokerEmail,
      bio: '',
      phone: '',
      address: '',
      specializations: [],
      profilePhoto: '',
      documents: [],
    };

    setProfile(initialProfile);
    setLoading(false);
  }, [status, session]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  function handleFieldChange(field: keyof BrokerProfile, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function toggleSpecialization(spec: string) {
    setProfile((prev) => {
      const specs = prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec];
      return { ...prev, specializations: specs };
    });
  }

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setPhotoError('Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('File size must be 5MB or less.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPhotoPreview(dataUrl);
      setProfile((prev) => ({ ...prev, profilePhoto: dataUrl }));
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleDocChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const newDocs: BrokerProfile['documents'] = [];

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const sizeStr =
          file.size < 1024 * 1024
            ? `${(file.size / 1024).toFixed(1)} KB`
            : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

        setProfile((prev) => ({
          ...prev,
          documents: [
            ...prev.documents,
            { name: file.name, size: sizeStr, type: file.type, dataUrl },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });

    if (docInputRef.current) docInputRef.current.value = '';
  }

  function removeDocument(index: number) {
    setProfile((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (docInputRef.current) {
      const dt = new DataTransfer();
      Array.from(e.dataTransfer.files).forEach((file) => {
        const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
        if (allowed.includes(file.type)) {
          dt.items.add(file);
        }
      });
      docInputRef.current.files = dt.files;
      handleDocChange({ target: docInputRef.current } as React.ChangeEvent<HTMLInputElement>);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    localStorage.setItem('broker-profile', JSON.stringify(profile));
    setSaving(false);
    setSaved(true);
  }

  function getInitials(name: string) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-secondary-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) return null;

  const displayPhoto = photoPreview || profile.profilePhoto;

  return (
    <main className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors">
      <section className="bg-white dark:bg-secondary-800 shadow-sm">
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
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mt-2 mb-2">
            Edit Profile
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Update your broker profile and documents
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">

          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div
                onClick={handlePhotoClick}
                className="relative w-[120px] h-[120px] rounded-full overflow-hidden mx-auto mb-4 cursor-pointer border-2 border-dashed border-primary-300 hover:border-primary-500 transition-colors group"
              >
                {displayPhoto ? (
                  <img
                    src={displayPhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      {getInitials(profile.name)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <button
                onClick={handlePhotoClick}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Click to upload photo
              </button>
              {photoError && (
                <p className="text-xs text-red-500 mt-1">{photoError}</p>
              )}
              <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                JPEG, PNG, or WebP. Max 5MB.
              </p>
            </div>

            <div className="border-t border-secondary-100 dark:border-secondary-700 pt-4">
              <h4 className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                Account
              </h4>
              <div className="flex items-center gap-2 text-sm text-secondary-700 dark:text-secondary-300">
                <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{session.user?.email}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-6">
                Personal Information
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="w-full border border-secondary-300 dark:border-secondary-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    value={profile.email}
                    readOnly
                    className="w-full border border-secondary-200 dark:border-secondary-600 rounded-lg px-3 py-2 text-sm bg-secondary-50 dark:bg-secondary-600 text-secondary-500 dark:text-secondary-400 cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleFieldChange('bio', e.target.value)}
                    rows={3}
                    className="w-full border border-secondary-300 dark:border-secondary-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                    placeholder="Tell clients about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    className="w-full border border-secondary-300 dark:border-secondary-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="+63 9XX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    className="w-full border border-secondary-300 dark:border-secondary-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-secondary-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="Your address"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Specializations
                </label>
                <div className="flex flex-wrap gap-3">
                  {SPECIALIZATIONS.map((spec) => (
                    <label
                      key={spec}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${
                        profile.specializations.includes(spec)
                          ? 'bg-primary-50 dark:bg-primary-900/40 border-primary-400 text-primary-700 dark:text-primary-300'
                          : 'bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={profile.specializations.includes(spec)}
                        onChange={() => toggleSpecialization(spec)}
                        className="w-4 h-4 text-primary-600 rounded border-secondary-300 focus:ring-primary-500"
                      />
                      {spec}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                Business Documents
              </h3>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => docInputRef.current?.click()}
                className="border-2 border-dashed border-secondary-300 dark:border-secondary-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary-400 transition-colors"
              >
                <svg className="w-10 h-10 text-secondary-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">
                  Drop files here or click to browse
                </p>
                <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                  PDF, JPG, PNG accepted
                </p>
              </div>
              <input
                ref={docInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={handleDocChange}
                className="hidden"
              />

              {profile.documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  {profile.documents.map((doc, i) => (
                    <div
                      key={`${doc.name}-${i}`}
                      className="flex items-center justify-between bg-secondary-50 dark:bg-secondary-700 rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400">
                            {doc.size}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDocument(i);
                        }}
                        className="ml-3 text-secondary-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary-600 text-white py-2.5 px-8 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {saving && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {saved ? (
                  <>
                    <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved!
                  </>
                ) : saving ? (
                  'Saving...'
                ) : (
                  'Save Profile'
                )}
              </button>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
