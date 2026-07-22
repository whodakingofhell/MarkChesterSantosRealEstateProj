import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Philippine Skyland MGT and DEVT OPC (PPSMDO)',
  description: 'Terms of Service for Philippine Skyland MGT and DEVT OPC (PPSMDO)',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-secondary-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">
          Terms of Service
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-secondary-600">
              By accessing or using Philippine Skyland MGT and DEVT OPC (PPSMDO), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              2. Description of Services
            </h2>
            <p className="text-secondary-600">
              Philippine Skyland MGT and DEVT OPC (PPSMDO) provides a platform for licensed real estate brokers, appraisers, and clients to connect, manage properties, process transactions, and conduct appraisals. Our services include:
            </p>
            <ul className="list-disc list-inside text-secondary-600 space-y-2 mt-3">
              <li>Professional profile management</li>
              <li>Property listing and search</li>
              <li>Transaction management</li>
              <li>Appraisal management</li>
              <li>Communication tools</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              3. User Responsibilities
            </h2>
            <p className="text-secondary-600">
              Users are responsible for:
            </p>
            <ul className="list-disc list-inside text-secondary-600 space-y-2 mt-3">
              <li>Maintaining accurate and up-to-date information</li>
              <li>Keeping their account credentials secure</li>
              <li>Complying with all applicable laws and regulations</li>
              <li>Obtaining and maintaining valid professional licenses (for brokers and appraisers)</li>
              <li>All activities that occur under their account</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              4. Prohibited Activities
            </h2>
            <p className="text-secondary-600">
              Users may not:
            </p>
            <ul className="list-disc list-inside text-secondary-600 space-y-2 mt-3">
              <li>Use the platform for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to the platform</li>
              <li>Interfere with or disrupt the platform</li>
              <li>Transmit malware or harmful code</li>
              <li>Impersonate another user or person</li>
              <li>Collect user information without permission</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              5. Intellectual Property
            </h2>
            <p className="text-secondary-600">
              All content on Philippine Skyland MGT and DEVT OPC (PPSMDO), including text, graphics, logos, and software, is the property of Philippine Skyland or its content suppliers and is protected by intellectual property laws.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              6. Limitation of Liability
            </h2>
            <p className="text-secondary-600">
              Philippine Skyland MGT and DEVT OPC (PPSMDO) is not liable for:
            </p>
            <ul className="list-disc list-inside text-secondary-600 space-y-2 mt-3">
              <li>Any indirect, incidental, or consequential damages</li>
              <li>Loss of data or profits</li>
              <li>Actions of third parties</li>
              <li>Errors or omissions in content</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              7. Termination
            </h2>
            <p className="text-secondary-600">
              We may terminate or suspend your account and access to the platform at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              8. Changes to Terms
            </h2>
            <p className="text-secondary-600">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the platform.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 mb-3">
              9. Contact Information
            </h2>
            <p className="text-secondary-600">
              For questions about these Terms of Service, please contact us at:
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
