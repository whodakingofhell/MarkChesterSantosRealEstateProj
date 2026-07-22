# Social Media & Contact Integration Design
## Nelson Aczon License Broker & Appraiser Platform

**Document ID:** INT-SOCIAL-001  
**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-07-22  
**Review Board:** UX Council, Executive Board  

---

## 1. Executive Summary

This document outlines the social media and contact integration design for the NALBAP platform. Based on industry research, clients contact brokers and appraisers through social media, making public profile pages with direct contact capabilities essential. This design includes public-facing profiles, direct contact buttons, and auto-forwarding contact forms.

---

## 2. Industry Research Findings

### 2.1 How Clients Contact Brokers/Appraisers

| Channel | Usage | Platform Preference |
|---------|-------|---------------------|
| **Social Media** | Very High | Facebook, Instagram, LinkedIn |
| **Messaging Apps** | Very High | WhatsApp, Viber, Messenger |
| **Phone Calls** | High | Direct call, SMS |
| **Email** | Medium | Professional email |
| **Referrals** | High | Word of mouth |
| **Website Forms** | Low-Medium | Company website |

### 2.2 Client Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT JOURNEY                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ DISCOVER │    │ EVALUATE │    │ CONTACT  │              │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘              │
│       │               │               │                      │
│       ▼               ▼               ▼                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ Social   │    │ Review   │    │ Call     │              │
│  │ Media    │    │ Profile  │    │ WhatsApp │              │
│  │ Search   │    │ Reviews  │    │ Viber    │              │
│  │ Referral │    │ Portfolio│    │ Email    │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│                                                              │
│       └───────────────┼───────────────┘                      │
│                       │                                      │
│                       ▼                                      │
│              ┌────────────────┐                              │
│              │   PLATFORM     │                              │
│              │   PUBLIC       │                              │
│              │   PROFILE      │                              │
│              └────────────────┘                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Public Profile System

### 3.1 Profile URL Structure

```
https://nalbap.com/profile/{professional-slug}
```

**Examples:**
- `https://nalbap.com/profile/john-santos-broker`
- `https://nalbap.com/profile/maria-reyes-appraiser`
- `https://nalbap.com/profile/nelson-aczon-broker`

### 3.2 Profile Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    PUBLIC PROFILE PAGE                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  HEADER SECTION                                      │   │
│  │  - Professional Photo                                │   │
│  │  - Name & License Number                            │   │
│  │  - Title (Licensed Broker/Appraiser)                 │   │
│  │  - Location (City, Province)                         │   │
│  │  - Star Rating ⭐⭐⭐⭐⭐ (4.8/5.0)                    │   │
│  │  - Verified Badge ✓                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  QUICK CONTACT BUTTONS                               │   │
│  │  [📞 Call] [💬 WhatsApp] [📱 Viber] [✉️ Email]       │   │
│  │  [📋 Copy Contact] [🔗 Share Profile]                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ABOUT SECTION                                       │   │
│  │  - Professional Summary                              │   │
│  │  - Years of Experience                               │   │
│  │  - Specializations                                   │   │
│  │  - Languages Spoken                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SERVICES SECTION                                    │   │
│  │  - Residential Brokerage                             │   │
│  │  - Commercial Brokerage                              │   │
│  │  - Property Appraisal                                │   │
│  │  - Consultation Services                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PORTFOLIO SECTION                                   │   │
│  │  - Featured Properties                               │   │
│  │  - Sold Properties                                   │   │
│  │  - Client Testimonials                               │   │
│  │  - Photo Gallery                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  CONTACT FORM                                        │   │
│  │  - Name                                              │   │
│  │  - Email                                             │   │
│  │  - Phone                                             │   │
│  │  - Message                                           │   │
│  │  - Property Type Interest                            │   │
│  │  - Budget Range                                      │   │
│  │  [Send Message]                                      │   │
│  │  - Auto-forward to email/SMS/WhatsApp                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  REVIEWS SECTION                                     │   │
│  │  - Client Reviews                                    │   │
│  │  - Star Ratings                                      │   │
│  │  - Testimonials                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SOCIAL MEDIA LINKS                                  │   │
│  │  [Facebook] [Instagram] [LinkedIn] [Twitter]         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Profile Data Model

```typescript
// Professional Profile
interface ProfessionalProfile {
  id: string;
  userId: string;
  slug: string; // URL-friendly identifier
  displayName: string;
  title: 'licensed_broker' | 'licensed_appraiser' | 'both';
  licenseNumber: string;
  licenseExpiry: Date;
  isVerified: boolean;
  
  // Personal Information
  photo: string;
  location: {
    city: string;
    province: string;
    coordinates: GeoCoordinates;
  };
  
  // Professional Details
  bio: string;
  yearsOfExperience: number;
  specializations: string[];
  languages: string[];
  
  // Contact Information (public)
  contact: {
    phone: string;
    whatsapp: string;
    viber: string;
    email: string;
    website?: string;
  };
  
  // Social Media Links
  socialMedia: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  
  // Services
  services: Service[];
  
  // Portfolio
  portfolio: Property[];
  
  // Reviews
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  
  // Settings
  settings: ProfileSettings;
}

// Contact Form Submission
interface ContactSubmission {
  id: string;
  professionalId: string;
  
  // Client Information
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  
  // Message Details
  subject: string;
  message: string;
  propertyType: PropertyType;
  budgetRange?: BudgetRange;
  
  // Metadata
  timestamp: Date;
  source: 'profile_page' | 'social_media' | 'referral';
  
  // Auto-forwarding status
  forwardingStatus: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
}

// Profile Settings
interface ProfileSettings {
  visibility: 'public' | 'private';
  contactFormEnabled: boolean;
  autoForwarding: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  notificationPreferences: NotificationPreferences;
  privacySettings: PrivacySettings;
}
```

---

## 4. Direct Contact Buttons

### 4.1 Button Design

```tsx
// Contact Buttons Component
interface ContactButtonsProps {
  professional: ProfessionalProfile;
}

export function ContactButtons({ professional }: ContactButtonsProps) {
  return (
    <div className="contact-buttons">
      {/* Primary Contact Methods */}
      <div className="primary-buttons">
        <a
          href={`tel:${professional.contact.phone}`}
          className="btn btn-call"
          aria-label="Call"
        >
          <PhoneIcon />
          <span>Call</span>
        </a>
        
        <a
          href={`https://wa.me/${professional.contact.whatsapp}?text=${encodeURIComponent(`Hi ${professional.displayName}, I found your profile on NALBAP and would like to inquire about your services.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp"
          aria-label="WhatsApp"
        >
          <WhatsAppIcon />
          <span>WhatsApp</span>
        </a>
        
        <a
          href={`viber://chat?number=${professional.contact.viber}`}
          className="btn btn-viber"
          aria-label="Viber"
        >
          <ViberIcon />
          <span>Viber</span>
        </a>
        
        <a
          href={`mailto:${professional.contact.email}?subject=${encodeURIComponent(`Inquiry from NALBAP`)}`}
          className="btn btn-email"
          aria-label="Email"
        >
          <EmailIcon />
          <span>Email</span>
        </a>
      </div>
      
      {/* Secondary Actions */}
      <div className="secondary-buttons">
        <button
          onClick={() => copyContactInfo(professional)}
          className="btn btn-secondary"
        >
          <CopyIcon />
          <span>Copy Contact</span>
        </button>
        
        <button
          onClick={() => shareProfile(professional)}
          className="btn btn-secondary"
        >
          <ShareIcon />
          <span>Share Profile</span>
        </button>
      </div>
    </div>
  );
}
```

### 4.2 Button Styling

```css
/* Contact Buttons */
.contact-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.primary-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-call {
  background: #25D366;
  color: white;
}

.btn-whatsapp {
  background: #25D366;
  color: white;
}

.btn-viber {
  background: #7360F2;
  color: white;
}

.btn-email {
  background: #EA4335;
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

---

## 5. Contact Form with Auto-Forwarding

### 5.1 Form Design

```tsx
// Contact Form Component
interface ContactFormProps {
  professional: ProfessionalProfile;
}

export function ContactForm({ professional }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyType: '',
    budgetRange: '',
  });
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Submit to API
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        professionalId: professional.id,
        ...formData,
      }),
    });
    
    if (response.ok) {
      // Auto-forward based on professional settings
      await autoForwardMessage(professional, formData);
      showSuccess('Message sent successfully!');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label htmlFor="name">Your Name *</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="subject">Subject *</label>
        <input
          type="text"
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={5}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="propertyType">Property Type Interest</label>
        <select
          id="propertyType"
          value={formData.propertyType}
          onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
        >
          <option value="">Select property type</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
          <option value="land">Land</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="budgetRange">Budget Range</label>
        <select
          id="budgetRange"
          value={formData.budgetRange}
          onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
        >
          <option value="">Select budget range</option>
          <option value="1-3m">₱1M - ₱3M</option>
          <option value="3-5m">₱3M - ₱5M</option>
          <option value="5-10m">₱5M - ₱10M</option>
          <option value="10m+">₱10M+</option>
        </select>
      </div>
      
      <button type="submit" className="btn btn-primary">
        Send Message
      </button>
    </form>
  );
}
```

### 5.2 Auto-Forwarding System

```typescript
// Auto-forwarding service
class AutoForwardingService {
  async forwardMessage(
    professional: ProfessionalProfile,
    submission: ContactSubmission
  ): Promise<ForwardingResult> {
    const results: ForwardingResult = {
      email: false,
      sms: false,
      whatsapp: false,
    };
    
    // Email forwarding
    if (professional.settings.autoForwarding.email) {
      await this.forwardByEmail(professional, submission);
      results.email = true;
    }
    
    // SMS forwarding
    if (professional.settings.autoForwarding.sms) {
      await this.forwardBySMS(professional, submission);
      results.sms = true;
    }
    
    // WhatsApp forwarding
    if (professional.settings.autoForwarding.whatsapp) {
      await this.forwardByWhatsApp(professional, submission);
      results.whatsapp = true;
    }
    
    return results;
  }
  
  private async forwardByEmail(
    professional: ProfessionalProfile,
    submission: ContactSubmission
  ): Promise<void> {
    const emailContent = this.generateEmailContent(professional, submission);
    
    await sendEmail({
      to: professional.contact.email,
      subject: `New Inquiry from ${submission.clientName}`,
      html: emailContent,
    });
  }
  
  private async forwardBySMS(
    professional: ProfessionalProfile,
    submission: ContactSubmission
  ): Promise<void> {
    const smsMessage = `New inquiry from ${submission.clientName}: ${submission.message.substring(0, 100)}...`;
    
    await sendSMS({
      to: professional.contact.phone,
      message: smsMessage,
    });
  }
  
  private async forwardByWhatsApp(
    professional: ProfessionalProfile,
    submission: ContactSubmission
  ): Promise<void> {
    const whatsappMessage = this.generateWhatsAppMessage(professional, submission);
    
    await sendWhatsAppMessage({
      to: professional.contact.whatsapp,
      message: whatsappMessage,
    });
  }
  
  private generateEmailContent(
    professional: ProfessionalProfile,
    submission: ContactSubmission
  ): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">New Client Inquiry</h2>
        <p>You have received a new inquiry through your NALBAP profile.</p>
        
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Client Information</h3>
          <p><strong>Name:</strong> ${submission.clientName}</p>
          <p><strong>Email:</strong> ${submission.clientEmail}</p>
          <p><strong>Phone:</strong> ${submission.clientPhone || 'Not provided'}</p>
        </div>
        
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Message Details</h3>
          <p><strong>Subject:</strong> ${submission.subject}</p>
          <p><strong>Property Type:</strong> ${submission.propertyType || 'Not specified'}</p>
          <p><strong>Budget Range:</strong> ${submission.budgetRange || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <p>${submission.message}</p>
        </div>
        
        <p style="color: #718096; font-size: 12px;">
          This message was sent through your NALBAP profile on ${submission.timestamp.toLocaleDateString()}.
        </p>
      </div>
    `;
  }
}
```

### 5.3 API Route

```typescript
// Contact API route
export async function POST(request: Request) {
  const body = await request.json();
  
  // Validate input
  const validation = validateContactSubmission(body);
  if (!validation.valid) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.errors },
      { status: 400 }
    );
  }
  
  // Get professional profile
  const professional = await getProfessionalById(body.professionalId);
  if (!professional) {
    return NextResponse.json(
      { error: 'Professional not found' },
      { status: 404 }
    );
  }
  
  // Create submission
  const submission = await createContactSubmission({
    professionalId: professional.id,
    clientName: body.name,
    clientEmail: body.email,
    clientPhone: body.phone,
    subject: body.subject,
    message: body.message,
    propertyType: body.propertyType,
    budgetRange: body.budgetRange,
    source: 'profile_page',
    timestamp: new Date(),
  });
  
  // Auto-forward message
  const forwardingService = new AutoForwardingService();
  const forwardingResult = await forwardingService.forwardMessage(professional, submission);
  
  // Update submission with forwarding status
  await updateContactSubmission(submission.id, {
    forwardingStatus: forwardingResult,
  });
  
  return NextResponse.json({
    success: true,
    message: 'Your message has been sent successfully',
    forwardingStatus: forwardingResult,
  });
}
```

---

## 6. Social Media Integration

### 6.1 Social Media Link Display

```tsx
// Social Media Links Component
interface SocialMediaLinksProps {
  socialMedia: ProfessionalProfile['socialMedia'];
}

export function SocialMediaLinks({ socialMedia }: SocialMediaLinksProps) {
  const platforms = [
    { key: 'facebook', icon: FacebookIcon, color: '#1877F2' },
    { key: 'instagram', icon: InstagramIcon, color: '#E4405F' },
    { key: 'linkedin', icon: LinkedInIcon, color: '#0A66C2' },
    { key: 'twitter', icon: TwitterIcon, color: '#1DA1F2' },
    { key: 'youtube', icon: YouTubeIcon, color: '#FF0000' },
  ];
  
  return (
    <div className="social-media-links">
      {platforms.map(({ key, icon: Icon, color }) => {
        const url = socialMedia[key as keyof typeof socialMedia];
        if (!url) return null;
        
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            style={{ backgroundColor: color }}
            aria-label={key}
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
}
```

### 6.2 Social Sharing

```typescript
// Share profile function
async function shareProfile(professional: ProfessionalProfile): Promise<void> {
  const shareData = {
    title: `${professional.displayName} - Licensed ${professional.title}`,
    text: `Check out ${professional.displayName}'s profile on NALBAP`,
    url: `https://nalbap.com/profile/${professional.slug}`,
  };
  
  if (navigator.share) {
    // Native share (mobile)
    await navigator.share(shareData);
  } else {
    // Fallback to social media links
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
    };
    
    // Open share dialog
    window.open(shareUrls.facebook, '_blank', 'width=600,height=400');
  }
}
```

---

## 7. SEO Optimization

### 7.1 Meta Tags

```tsx
// Profile Head Component
interface ProfileHeadProps {
  professional: ProfessionalProfile;
}

export function ProfileHead({ professional }: ProfileHeadProps) {
  return (
    <Head>
      <title>{professional.metaTitle}</title>
      <meta name="description" content={professional.metaDescription} />
      <meta name="keywords" content={professional.keywords.join(', ')} />
      
      {/* Open Graph */}
      <meta property="og:title" content={professional.metaTitle} />
      <meta property="og:description" content={professional.metaDescription} />
      <meta property="og:image" content={professional.photo} />
      <meta property="og:url" content={`https://nalbap.com/profile/${professional.slug}`} />
      <meta property="og:type" content="profile" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={professional.metaTitle} />
      <meta name="twitter:description" content={professional.metaDescription} />
      <meta name="twitter:image" content={professional.photo} />
      
      {/* Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": professional.displayName,
          "jobTitle": professional.title,
          "url": `https://nalbap.com/profile/${professional.slug}`,
          "image": professional.photo,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": professional.location.city,
            "addressRegion": professional.location.province,
          },
          "telephone": professional.contact.phone,
          "email": professional.contact.email,
        })}
      </script>
    </Head>
  );
}
```

---

## 8. Security Considerations

### 8.1 Privacy Settings

```typescript
// Privacy settings interface
interface PrivacySettings {
  showPhoneNumber: boolean;
  showEmail: boolean;
  showLocation: boolean;
  showReviews: boolean;
  showPortfolio: boolean;
  allowContactForm: boolean;
  showSocialMedia: boolean;
}

// Default privacy settings
const defaultPrivacySettings: PrivacySettings = {
  showPhoneNumber: true,
  showEmail: true,
  showLocation: true,
  showReviews: true,
  showPortfolio: true,
  allowContactForm: true,
  showSocialMedia: true,
};
```

### 8.2 Spam Protection

```typescript
// Spam detection
async function detectSpam(submission: ContactSubmission): Promise<boolean> {
  const spamIndicators = [
    // Check for suspicious content
    containsSuspiciousLinks(submission.message),
    containsProfanity(submission.message),
    containsPersonalInfo(submission.message),
    
    // Check for rapid submissions
    await isRapidSubmission(submission.clientEmail),
    
    // Check for known spam patterns
    matchesSpamPattern(submission.message),
  ];
  
  return spamIndicators.some(indicator => indicator);
}
```

---

## 9. Analytics & Tracking

### 9.1 Profile Views

```typescript
// Track profile views
async function trackProfileView(
  professionalId: string,
  viewerIp: string,
  userAgent: string
): Promise<void> {
  await analytics.track({
    event: 'profile_view',
    properties: {
      professionalId,
      viewerIp: hashIp(viewerIp), // Hash for privacy
      userAgent,
      timestamp: new Date(),
    },
  });
}
```

### 9.2 Contact Button Clicks

```typescript
// Track contact button clicks
async function trackContactClick(
  professionalId: string,
  contactType: 'call' | 'whatsapp' | 'viber' | 'email',
  viewerIp: string
): Promise<void> {
  await analytics.track({
    event: 'contact_click',
    properties: {
      professionalId,
      contactType,
      viewerIp: hashIp(viewerIp),
      timestamp: new Date(),
    },
  });
}
```

---

## 10. Mobile Optimization

### 10.1 Responsive Design

```css
/* Mobile-first responsive design */
.contact-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (min-width: 640px) {
  .primary-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .primary-buttons {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .contact-buttons {
    flex-direction: row;
    align-items: center;
  }
}
```

### 10.2 Click-to-Call Optimization

```tsx
// Mobile-optimized call button
<a
  href={`tel:${professional.contact.phone}`}
  className="btn btn-call btn-mobile"
  aria-label="Call ${professional.displayName}"
>
  <PhoneIcon />
  <span>Call Now</span>
</a>
```

---

## 11. Review Board Assessment

### UX Council Review

| Reviewer | Status | Comments |
|----------|--------|----------|
| **UI/UX Designer** | Pending | Interface design |
| **Accessibility Expert** | Pending | WCAG compliance |
| **Mobile Designer** | Pending | Mobile experience |
| **Interaction Designer** | Pending | User flow |
| **Visual Designer** | Pending | Visual consistency |

---

## 12. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-22 | System | Initial draft |

---

**Next Review:** Deployment-Ready Package Configuration  
**Dependencies:** 10-Layer Defense Stack, Comprehensive Security Audit  
**Blockers:** UX Council approval required
