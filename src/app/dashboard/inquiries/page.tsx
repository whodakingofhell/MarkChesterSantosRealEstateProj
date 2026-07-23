'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Inquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  subject: string;
  message: string;
  propertyType?: string;
  budgetRange?: string;
  source: string;
  status: string;
  createdAt: string;
}

const MOCK_INQUIRIES: Inquiry[] = [];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'OPEN':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Open
        </span>
      );
    case 'RESPONDED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Responded
        </span>
      );
    case 'CLOSED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Closed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
}

export default function DashboardInquiriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchInquiries();
    }
  }, [status]);

  async function fetchInquiries() {
    try {
      setLoading(true);
      const response = await fetch('/api/contact');
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      if (result.success && result.data && result.data.length > 0) {
        setInquiries(result.data);
      } else {
        setInquiries(MOCK_INQUIRIES);
      }
    } catch {
      setInquiries(MOCK_INQUIRIES);
    } finally {
      setLoading(false);
    }
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const openCount = inquiries.filter((i) => i.status === 'OPEN').length;
  const respondedCount = inquiries.filter((i) => i.status === 'RESPONDED').length;
  const closedCount = inquiries.filter((i) => i.status === 'CLOSED').length;

  return (
    <main className="min-h-screen bg-secondary-50">
      <section className="bg-white shadow-sm">
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
          <h1 className="text-3xl font-bold text-secondary-900 mt-2 mb-2">
            Client Inquiries
          </h1>
          <p className="text-secondary-600">
            Messages and inquiries from potential clients
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        {inquiries.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{openCount}</p>
              <p className="text-sm text-secondary-600">Open</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{respondedCount}</p>
              <p className="text-sm text-secondary-600">Responded</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <p className="text-2xl font-bold text-secondary-400">{closedCount}</p>
              <p className="text-sm text-secondary-600">Closed</p>
            </div>
          </div>
        )}

        {inquiries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 text-secondary-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No inquiries yet.
            </h3>
            <p className="text-secondary-600">
              Client inquiries will appear here when they contact you.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(inquiry.id)}
                  className="w-full text-left p-5 hover:bg-secondary-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-secondary-900 truncate">
                          {inquiry.subject}
                        </h3>
                        {getStatusBadge(inquiry.status)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-secondary-500">
                        <span className="font-medium text-secondary-700">
                          {inquiry.clientName}
                        </span>
                        <span>{inquiry.clientEmail}</span>
                        <span>{formatDate(inquiry.createdAt)}</span>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-secondary-400 shrink-0 transition-transform ${
                        expandedId === inquiry.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {expandedId === inquiry.id && (
                  <div className="px-5 pb-5 border-t border-secondary-100 pt-4">
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-medium text-secondary-500 mb-1">
                          Client Name
                        </p>
                        <p className="text-sm text-secondary-900">
                          {inquiry.clientName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-secondary-500 mb-1">
                          Email
                        </p>
                        <p className="text-sm text-secondary-900">
                          {inquiry.clientEmail}
                        </p>
                      </div>
                      {inquiry.clientPhone && (
                        <div>
                          <p className="text-xs font-medium text-secondary-500 mb-1">
                            Phone
                          </p>
                          <p className="text-sm text-secondary-900">
                            {inquiry.clientPhone}
                          </p>
                        </div>
                      )}
                      {inquiry.propertyType && (
                        <div>
                          <p className="text-xs font-medium text-secondary-500 mb-1">
                            Property Type
                          </p>
                          <p className="text-sm text-secondary-900">
                            {inquiry.propertyType}
                          </p>
                        </div>
                      )}
                      {inquiry.budgetRange && (
                        <div>
                          <p className="text-xs font-medium text-secondary-500 mb-1">
                            Budget Range
                          </p>
                          <p className="text-sm text-secondary-900">
                            {inquiry.budgetRange}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-medium text-secondary-500 mb-1">
                          Source
                        </p>
                        <p className="text-sm text-secondary-900 capitalize">
                          {inquiry.source.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-secondary-500 mb-1">
                        Message
                      </p>
                      <p className="text-sm text-secondary-700 bg-secondary-50 rounded-lg p-3 whitespace-pre-wrap">
                        {inquiry.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-secondary-100">
                      <a
                        href={`mailto:${inquiry.clientEmail}?subject=Re: ${encodeURIComponent(inquiry.subject)}`}
                        className="inline-flex items-center gap-1.5 bg-primary-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Reply via Email
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
