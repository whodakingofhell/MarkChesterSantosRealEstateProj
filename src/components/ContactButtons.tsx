'use client';

interface ContactInfo {
  phone?: string;
  whatsapp?: string;
  viber?: string;
  email?: string;
  website?: string;
}

interface ContactButtonsProps {
  contactInfo: ContactInfo;
  professionalName: string;
  professionalId: string;
}

export function ContactButtons({
  contactInfo,
  professionalName,
  professionalId,
}: ContactButtonsProps) {
  const handleTrackClick = async (contactType: string) => {
    // Track contact button click for analytics
    try {
      await fetch('/api/analytics/contact-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionalId,
          contactType,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      // Silently fail - don't block user action
    }
  };
  
  const copyContactInfo = () => {
    const text = [
      `${professionalName}`,
      contactInfo.phone ? `Phone: ${contactInfo.phone}` : '',
      contactInfo.email ? `Email: ${contactInfo.email}` : '',
      contactInfo.whatsapp ? `WhatsApp: ${contactInfo.whatsapp}` : '',
      contactInfo.viber ? `Viber: ${contactInfo.viber}` : '',
    ].filter(Boolean).join('\n');
    
    navigator.clipboard.writeText(text);
    alert('Contact information copied!');
  };
  
  const shareProfile = () => {
    const shareData = {
      title: `${professionalName} - Philippine Skyland`,
      text: `Check out ${professionalName}'s profile on Philippine Skyland MGT and DEVT OPC (PPSMDO)`,
      url: `${window.location.origin}/profile/${professionalId}`,
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert('Profile link copied!');
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Primary Contact Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {contactInfo.phone && (
          <a
            href={`tel:${contactInfo.phone}`}
            onClick={() => handleTrackClick('call')}
            className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call
          </a>
        )}
        
        {contactInfo.whatsapp && (
          <a
            href={`https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(`Hi ${professionalName}, I found your profile on Philippine Skyland and would like to inquire about your services.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleTrackClick('whatsapp')}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp
          </a>
        )}
        
        {contactInfo.viber && (
          <a
            href={`viber://chat?number=${contactInfo.viber}`}
            onClick={() => handleTrackClick('viber')}
            className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.996 0C5.372 0 0 5.372 0 11.996 0 18.62 5.372 24 11.996 24c6.624 0 11.996-5.372 11.996-11.996C24 5.372 18.62 0 11.996 0zm5.742 16.944c-.236.664-1.164 1.216-1.892 1.376-.496.108-1.144.196-3.34-.72-2.808-1.176-4.608-4.068-4.748-4.256-.136-.188-1.108-1.476-1.108-2.816 0-1.336.7-1.992.948-2.268.248-.276.54-.344.72-.344.18 0 .36.004.516.012.164.008.384-.06.6.468.236.564.804 1.948.872 2.092.068.144.112.312.024.5-.088.188-.132.304-.264.468-.132.164-.276.368-.392.492-.132.144-.268.296-.116.58.152.284.676 1.112 1.452 1.804.996.888 1.836 1.164 2.104 1.296.268.132.424.112.58-.068.156-.18.664-.776.84-1.044.176-.268.352-.224.596-.136.244.088 1.54.728 1.804.86.264.132.44.196.504.308.068.112.068.648-.168 1.312z" />
            </svg>
            Viber
          </a>
        )}
        
        {contactInfo.email && (
          <a
            href={`mailto:${contactInfo.email}?subject=${encodeURIComponent('Inquiry from Philippine Skyland')}`}
            onClick={() => handleTrackClick('email')}
            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email
          </a>
        )}
      </div>
      
      {/* Secondary Actions */}
      <div className="flex gap-3">
        <button
          onClick={copyContactInfo}
          className="flex-1 flex items-center justify-center gap-2 bg-secondary-100 text-secondary-700 px-4 py-2 rounded-lg font-medium hover:bg-secondary-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Contact
        </button>
        
        <button
          onClick={shareProfile}
          className="flex-1 flex items-center justify-center gap-2 bg-secondary-100 text-secondary-700 px-4 py-2 rounded-lg font-medium hover:bg-secondary-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Profile
        </button>
      </div>
    </div>
  );
}
