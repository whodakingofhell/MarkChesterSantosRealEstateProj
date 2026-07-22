import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Philippine Skyland MGT and DEVT OPC (PPSMDO)',
  description: 'Frequently Asked Questions about Philippine Skyland MGT and DEVT OPC (PPSMDO) - Licensed Real Estate Broker and Appraiser',
};

const faqs = [
  {
    question: 'What is Philippine Skyland MGT and DEVT OPC (PPSMDO)?',
    answer: 'Philippine Skyland MGT and DEVT OPC (PPSMDO) is a licensed real estate broker and appraiser platform operated by Nelson Aczon. We provide enterprise-grade property appraisal management and real estate services for Philippine real estate professionals.',
  },
  {
    question: 'What services do you offer?',
    answer: 'We offer comprehensive real estate services including: property listing and search, professional broker and appraiser profiles, transaction management, appraisal management with mobile-first field work, and direct contact between clients and licensed professionals.',
  },
  {
    question: 'How do I contact Nelson Aczon?',
    answer: 'You can reach Nelson Aczon through the following channels:\n\n• Globe: +63 917 472 2107\n• Smart: +63 960 477 4147\n• Email: nelsonaczon@gmail.com',
  },
  {
    question: 'Is this platform free to use?',
    answer: 'Yes, clients can browse properties and contact brokers/appraisers for free. Licensed professionals can create profiles to showcase their services and receive client inquiries.',
  },
  {
    question: 'How do I register as a broker or appraiser?',
    answer: 'Click "Get Started" on our homepage, select "Licensed Broker" or "Licensed Appraiser" during registration, and provide your professional license information. Your account will be set up immediately.',
  },
  {
    question: 'How do I search for properties?',
    answer: 'Visit our Properties page to browse available listings. You can filter by property type (residential, commercial, industrial, land), location, and budget range.',
  },
  {
    question: 'How do I contact a broker or appraiser?',
    answer: 'Visit the professional\'s profile page and use the contact buttons to Call, WhatsApp, Viber, or Email them directly. You can also use the contact form on their profile page.',
  },
  {
    question: 'Is my personal information secure?',
    answer: 'Yes. We implement a 10-layer defense-in-depth security stack including encryption, rate limiting, CAPTCHA verification, and input validation to protect your personal data.',
  },
  {
    question: 'Can I leave reviews for brokers and appraisers?',
    answer: 'Yes. After completing a transaction, clients can leave reviews and ratings for licensed professionals. This helps maintain quality and trust in our community.',
  },
  {
    question: 'What areas do you serve?',
    answer: 'We serve the entire Philippines, with a focus on Metro Manila and surrounding areas. Our platform connects clients with licensed professionals nationwide.',
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-secondary-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-secondary-600 mb-8">
          Philippine Skyland MGT and DEVT OPC (PPSMDO) - Licensed Real Estate Broker and Appraiser
        </p>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-3">
                {faq.question}
              </h2>
              <p className="text-secondary-600 whitespace-pre-line">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
        
        {/* Contact Section */}
        <div className="mt-12 bg-primary-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">
            Contact Us
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-secondary-900 mb-2">Globe</h3>
              <a href="tel:+639174722107" className="text-primary-600 hover:text-primary-700 font-medium">
                +63 917 472 2107
              </a>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-secondary-900 mb-2">Smart</h3>
              <a href="tel:+639604774147" className="text-primary-600 hover:text-primary-700 font-medium">
                +63 960 477 4147
              </a>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-secondary-900 mb-2">Email</h3>
              <a href="mailto:nelsonaczon@gmail.com" className="text-primary-600 hover:text-primary-700 font-medium">
                nelsonaczon@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
