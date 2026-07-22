import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContactButtons } from '@/components/ContactButtons';
import { ContactForm } from '@/components/ContactForm';

// This would come from the database in production
async function getProfessionalBySlug(slug: string) {
  // Mock data for demonstration
  const professionals = {
    'nelson-aczon': {
      id: '1',
      name: 'Nelson Aczon',
      title: 'Licensed Real Estate Broker & Appraiser',
      licenseNumber: 'REBL-001',
      photo: '/images/default-avatar.png',
      location: 'Philippines',
      bio: 'Licensed real estate broker and appraiser under Philippine Skyland MGT and DEVT OPC (PPSMDO). Specializing in residential and commercial properties across the Philippines.',
      yearsExperience: 10,
      specializations: ['Residential', 'Commercial', 'Property Appraisal'],
      averageRating: 4.9,
      totalReviews: 50,
      isVerified: true,
      contactInfo: {
        phone: '+639174722107',
        whatsapp: '639174722107',
        viber: '+639174722107',
        email: 'nelsonaczon@gmail.com',
      },
      socialMedia: {},
    },
    'john-santos-broker': {
      id: '2',
      name: 'John Santos',
      title: 'Licensed Real Estate Broker',
      licenseNumber: 'REBL-2024-001',
      photo: '/images/default-avatar.png',
      location: 'Makati City, Metro Manila',
      bio: 'Experienced real estate broker with 10+ years in residential and commercial properties.',
      yearsExperience: 12,
      specializations: ['Residential', 'Commercial', 'Luxury Properties'],
      averageRating: 4.8,
      totalReviews: 156,
      isVerified: true,
      contactInfo: {
        phone: '+639171234567',
        whatsapp: '639171234567',
        viber: '+639171234567',
        email: 'john.santos@example.com',
      },
      socialMedia: {},
    },
  };
  
  return professionals[slug as keyof typeof professionals] || null;
}

interface ProfilePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const professional = await getProfessionalBySlug(params.slug);
  
  if (!professional) {
    return { title: 'Profile Not Found' };
  }
  
  return {
    title: `${professional.name} - ${professional.title} | Philippine Skyland`,
    description: professional.bio,
    openGraph: {
      title: `${professional.name} - ${professional.title}`,
      description: professional.bio,
      type: 'profile',
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const professional = await getProfessionalBySlug(params.slug);
  
  if (!professional) {
    notFound();
  }
  
  return (
    <main className="min-h bg-secondary-50">
      {/* Header Section */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo */}
            <div className="flex-shrink-0">
              <img
                src={professional.photo}
                alt={professional.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary-100"
              />
            </div>
            
            {/* Info */}
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-secondary-900">
                  {professional.name}
                </h1>
                {professional.isVerified && (
                  <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              
              <p className="text-primary-600 font-medium mb-2">
                {professional.title}
              </p>
              
              <p className="text-secondary-600 mb-2">
                License: {professional.licenseNumber}
              </p>
              
              <p className="text-secondary-600 mb-4">
                📍 {professional.location}
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(professional.averageRating) ? 'fill-current' : 'fill-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-secondary-600">
                  {professional.averageRating.toFixed(1)} ({professional.totalReviews} reviews)
                </span>
              </div>
              
              {/* Specializations */}
              <div className="flex flex-wrap gap-2">
                {professional.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 text-secondary-900">
                Contact {professional.name.split(' ')[0]}
              </h2>
              
              <ContactButtons
                contactInfo={professional.contactInfo}
                professionalName={professional.name}
                professionalId={professional.id}
              />
              
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <h3 className="font-medium text-secondary-900 mb-3">
                  Send a Message
                </h3>
                <ContactForm
                  professionalId={professional.id}
                  professionalType="broker"
                  professionalName={professional.name}
                />
              </div>
            </div>
          </div>
          
          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-secondary-900">
                About
              </h2>
              <p className="text-secondary-600 whitespace-pre-line">
                {professional.bio}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-sm text-secondary-500">Experience</p>
                  <p className="font-medium text-secondary-900">
                    {professional.yearsExperience} years
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">License Status</p>
                  <p className="font-medium text-green-600">Active</p>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            {professional.socialMedia && Object.keys(professional.socialMedia).length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-secondary-900">
                  Social Media
                </h2>
                <div className="flex gap-4">
                  {(professional.socialMedia as Record<string, string>).facebook && (
                    <a
                      href={(professional.socialMedia as Record<string, string>).facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {(professional.socialMedia as Record<string, string>).instagram && (
                    <a
                      href={(professional.socialMedia as Record<string, string>).instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                      </svg>
                    </a>
                  )}
                  {(professional.socialMedia as Record<string, string>).linkedin && (
                    <a
                      href={(professional.socialMedia as Record<string, string>).linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
