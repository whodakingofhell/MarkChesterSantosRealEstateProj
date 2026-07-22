import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Philippine Skyland MGT and DEVT OPC (PPSMDO)',
  description: 'Privacy Policy for Philippine Skyland MGT and DEVT OPC (PPSMDO)',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-secondary-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">
          Privacy Policy
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              1. Introduction
            </h2>
            <p className="text-secondary-600">
              Welcome to Philippine Skyland MGT and DEVT OPC (PPSMDO). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our platform.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              2. Information We Collect
            </h2>
            <p className="text-secondary-600 mb-3">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-secondary-600 space-y-2">
              <li>Account registration information (name, email, password)</li>
              <li>Professional license information (for brokers and appraisers)</li>
              <li>Contact information (phone number, address)</li>
              <li>Property listings and related documents</li>
              <li>Transaction and appraisal data</li>
              <li>Communications with us and other users</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              3. How We Use Your Information
            </h2>
            <p className="text-secondary-600 mb-3">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-secondary-600 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Communicate with you about products, services, and promotions</li>
              <li>Verify your identity and license status</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              4. Data Security
            </h2>
            <p className="text-secondary-600">
              We implement appropriate technical and organizational measures to protect your personal data, including encryption, access controls, and regular security assessments. Our platform uses a 10-layer defense-in-depth security stack.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              5. Data Sharing
            </h2>
            <p className="text-secondary-600">
              We do not sell your personal data. We may share your information with:
            </p>
            <ul className="list-disc list-inside text-secondary-600 space-y-2">
              <li>Other users as necessary to facilitate transactions</li>
              <li>Service providers who assist in our operations</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              6. Your Rights
            </h2>
            <p className="text-secondary-600">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-secondary-600 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              7. Contact Us
            </h2>
            <p className="text-secondary-600">
              If you have questions about this privacy policy, please contact us at:
            </p>
            <p className="text-secondary-600 mt-2">
              Globe: +63 917 472 2107<br />
              Smart: +63 960 477 4147<br />
              Email: nelsonaczon@gmail.com
            </p>
          </section>
          
          <section>
            <p className="text-sm text-secondary-500">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
