'use client';

import { useState, useEffect } from 'react';
import { TurnstileWidget } from './Turnstile';

interface ContactFormProps {
  professionalId: string;
  professionalType: 'broker' | 'appraiser';
  professionalName: string;
}

export function ContactForm({
  professionalId,
  professionalType,
  professionalName,
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    subject: '',
    message: '',
    propertyType: '',
    budgetRange: '',
  });
  
  const [turnstileToken, setTurnstileToken] = useState('');
  const [hmacSignature, setHmacSignature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [clientTimestamp, setClientTimestamp] = useState(0);
  
  // Set client timestamp on mount
  useEffect(() => {
    setClientTimestamp(Date.now());
  }, []);
  
  // Generate HMAC signature
  useEffect(() => {
    if (typeof window !== 'undefined' && window.crypto) {
      const generateHmac = async () => {
        const payload = {
          professionalId,
          clientEmail: formData.clientEmail,
          subject: formData.subject,
          message: formData.message,
          clientTimestamp,
        };
        
        const encoder = new TextEncoder();
        const keyData = encoder.encode(process.env.NEXT_PUBLIC_HMAC_SECRET || '');
        
        const key = await window.crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        );
        
        const message = JSON.stringify(payload);
        const messageData = encoder.encode(message);
        
        const signature = await window.crypto.subtle.sign('HMAC', key, messageData);
        const signatureArray = new Uint8Array(signature);
        const signatureBase64 = btoa(String.fromCharCode(...signatureArray));
        
        setHmacSignature(signatureBase64);
      };
      
      generateHmac();
    }
  }, [professionalId, formData.clientEmail, formData.subject, formData.message, clientTimestamp]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          professionalId,
          professionalType,
          ...formData,
          turnstileToken,
          hmacSignature,
          clientTimestamp,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      setSuccess(true);
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        subject: '',
        message: '',
        propertyType: '',
        budgetRange: '',
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h3>
        <p className="text-green-600">
          Your message has been sent to {professionalName}. They will contact you soon.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-green-700 underline hover:no-underline"
        >
          Send another message
        </button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="clientName" className="label">
          Your Name *
        </label>
        <input
          type="text"
          id="clientName"
          value={formData.clientName}
          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
          className="input-field"
          required
          maxLength={100}
        />
      </div>
      
      <div>
        <label htmlFor="clientEmail" className="label">
          Email Address *
        </label>
        <input
          type="email"
          id="clientEmail"
          value={formData.clientEmail}
          onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
          className="input-field"
          required
          maxLength={254}
        />
      </div>
      
      <div>
        <label htmlFor="clientPhone" className="label">
          Phone Number
        </label>
        <input
          type="tel"
          id="clientPhone"
          value={formData.clientPhone}
          onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
          className="input-field"
          maxLength={20}
        />
      </div>
      
      <div>
        <label htmlFor="subject" className="label">
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="input-field"
          required
          maxLength={200}
        />
      </div>
      
      <div>
        <label htmlFor="message" className="label">
          Message *
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="input-field"
          rows={5}
          required
          minLength={10}
          maxLength={5000}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="propertyType" className="label">
            Property Type Interest
          </label>
          <select
            id="propertyType"
            value={formData.propertyType}
            onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
            className="input-field"
          >
            <option value="">Select type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="land">Land</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="budgetRange" className="label">
            Budget Range
          </label>
          <select
            id="budgetRange"
            value={formData.budgetRange}
            onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
            className="input-field"
          >
            <option value="">Select range</option>
            <option value="1-3m">₱1M - ₱3M</option>
            <option value="3-5m">₱3M - ₱5M</option>
            <option value="5-10m">₱5M - ₱10M</option>
            <option value="10m+">₱10M+</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-center">
        <TurnstileWidget
          onVerify={(token) => setTurnstileToken(token)}
          onError={(error) => setError(`CAPTCHA error: ${error}`)}
          onExpire={() => setTurnstileToken('')}
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting || !turnstileToken}
        className="btn-primary w-full"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
