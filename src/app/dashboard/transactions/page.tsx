'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Transaction {
  id: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
    propertyType: string;
    city: string;
    province: string;
  };
  type: string;
  status: string;
  amount: number;
  commission: number;
  commissionRate: number;
  notes?: string;
  createdAt: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    propertyId: 'p1',
    property: {
      id: 'p1',
      title: 'Modern Condo Unit in BGC',
      propertyType: 'RESIDENTIAL',
      city: 'Taguig',
      province: 'Metro Manila',
    },
    type: 'SALE',
    status: 'COMPLETED',
    amount: 15000000,
    commission: 450000,
    commissionRate: 3,
    notes: 'Closed deal with Filipino buyer.',
    createdAt: '2025-03-10T00:00:00.000Z',
  },
  {
    id: '2',
    propertyId: 'p2',
    property: {
      id: 'p2',
      title: 'Commercial Space in Makati CBD',
      propertyType: 'COMMERCIAL',
      city: 'Makati',
      province: 'Metro Manila',
    },
    type: 'LEASE',
    status: 'PENDING',
    amount: 120000,
    commission: 12000,
    commissionRate: 10,
    createdAt: '2025-06-20T00:00:00.000Z',
  },
  {
    id: '3',
    propertyId: 'p3',
    property: {
      id: 'p3',
      title: 'Lot for Sale in Cavite',
      propertyType: 'LAND',
      city: 'Dasmarinas',
      province: 'Cavite',
    },
    type: 'SALE',
    status: 'CANCELLED',
    amount: 5000000,
    commission: 0,
    commissionRate: 3,
    notes: 'Buyer backed out.',
    createdAt: '2024-12-05T00:00:00.000Z',
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Completed
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Cancelled
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

function getTypeBadge(type: string) {
  switch (type) {
    case 'SALE':
      return (
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
          Sale
        </span>
      );
    case 'LEASE':
      return (
        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium">
          Lease
        </span>
      );
    case 'RENTAL':
      return (
        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-medium">
          Rental
        </span>
      );
    default:
      return (
        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full font-medium">
          {type}
        </span>
      );
  }
}

export default function DashboardTransactionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTransactions();
    }
  }, [status]);

  async function fetchTransactions() {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions?limit=100');
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      if (result.success && result.data) {
        setTransactions(result.data);
      } else {
        setTransactions(MOCK_TRANSACTIONS);
      }
    } catch {
      setTransactions(MOCK_TRANSACTIONS);
    } finally {
      setLoading(false);
    }
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
            My Transactions
          </h1>
          <p className="text-secondary-600">
            View and manage your property transactions
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {transactions.length === 0 ? (
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
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No transactions yet.
            </h3>
            <p className="text-secondary-600">
              Your completed and pending transactions will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-secondary-200">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-secondary-900">
                          {tx.property.title}
                        </div>
                        <div className="text-xs text-secondary-500">
                          {tx.property.city}, {tx.property.province}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(tx.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-secondary-900">
                          {formatPrice(tx.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-700">
                          {formatPrice(tx.commission)}
                        </div>
                        <div className="text-xs text-secondary-500">
                          {tx.commissionRate}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(tx.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                        {formatDate(tx.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 mr-2">
                      <h3 className="text-sm font-semibold text-secondary-900">
                        {tx.property.title}
                      </h3>
                      <p className="text-xs text-secondary-500">
                        {tx.property.city}, {tx.property.province}
                      </p>
                    </div>
                    {getStatusBadge(tx.status)}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    {getTypeBadge(tx.type)}
                    <span className="text-xs text-secondary-500">
                      {formatDate(tx.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-secondary-500">Amount</p>
                      <p className="text-sm font-semibold text-secondary-900">
                        {formatPrice(tx.amount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-secondary-500">Commission</p>
                      <p className="text-sm font-semibold text-green-700">
                        {formatPrice(tx.commission)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
