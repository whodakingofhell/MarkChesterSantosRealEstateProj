'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const FAQ_RESPONSES: Record<string, string> = {
  'properties': 'We list various property types including Lot Only, House and Lot, Farm Lot, Commercial, Beachfront, Condominium, Townhouse, Mixed Use, Industrial, and more. Visit our Properties page to browse all listings with advanced search filters.',
  'contact': 'You can reach Nelson Aczon at:\n• Globe: +63 917 472 2107\n• Smart: +63 960 477 4147\n• Email: nelsonaczon@gmail.com',
  'register': 'To register, click the "Sign In" button on the top right, then select "Create an Account". You can register as a Broker, Appraiser, or Client.',
  'login': 'To log in, click "Sign In" on the top navigation bar. Enter your registered email and password. Your session stays active for security.',
  'broker': 'Nelson Aczon is a Licensed Real Estate Broker and Appraiser with over 10 years of experience (REA-001-2024). He specializes in residential, commercial, land, and industrial properties across the Philippines.',
  'appraisal': 'Property appraisal services are available through our platform. Licensed appraisers can assess your property value. Contact Nelson Aczon to schedule an appraisal.',
  'price': 'Property prices vary by type and location. Use our Budget Range filter on the Properties page to narrow down options from Under ₱1M to Over ₱50M.',
  'location': 'Our properties are located across the Philippines including Metro Manila (Makati, Taguig, Quezon City), Cavite, Batangas, Laguna, and more. Use the City and Province filters to search specific areas.',
  'filter': 'Our advanced search filters let you filter by:\n• Property Type (13 categories)\n• Budget Range (7 brackets)\n• Lot Size (5 ranges)\n• Bedrooms & Bathrooms\n• City & Province',
  'dashboard': 'The Dashboard is your control center. From there you can manage properties, view transactions, edit your profile, and check client inquiries.',
  'profile': 'You can edit your profile from the Dashboard by clicking "My Profile" or "Edit Profile". Upload a profile photo, update your bio, phone, address, and business documents.',
  'password': 'To change your password, go to Dashboard → Edit Profile → Change Password section. You\'ll need to enter your current password and the new one.',
  'privacy': 'We take privacy seriously. Read our full Privacy Policy at the Privacy link in the navigation bar. Your data is encrypted and secure.',
  'terms': 'Our Terms of Service outline the rules and guidelines for using our platform. Access it via the Terms link in the navigation bar.',
  'dark mode': 'Click the sun/moon icon in the top navigation bar to toggle dark mode. Your preference is saved automatically.',
  'help': 'I can help with:\n• Property searches and filters\n• Account registration and login\n• Contact information\n• Platform features\n• Profile management\n• General real estate questions\n\nJust ask anything!',
};

function findResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes('help') || lower.includes('what can you')) return FAQ_RESPONSES['help'];
  if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('reach')) return FAQ_RESPONSES['contact'];
  if (lower.includes('register') || lower.includes('sign up') || lower.includes('create account')) return FAQ_RESPONSES['register'];
  if (lower.includes('login') || lower.includes('log in') || lower.includes('sign in')) return FAQ_RESPONSES['login'];
  if (lower.includes('password') || lower.includes('change password')) return FAQ_RESPONSES['password'];
  if (lower.includes('broker') || lower.includes('nelson') || lower.includes('about')) return FAQ_RESPONSES['broker'];
  if (lower.includes('apprais') || lower.includes('valuation') || lower.includes('assess')) return FAQ_RESPONSES['appraisal'];
  if (lower.includes('price') || lower.includes('budget') || lower.includes('cost') || lower.includes('expensive')) return FAQ_RESPONSES['price'];
  if (lower.includes('location') || lower.includes('where') || lower.includes('city') || lower.includes('province') || lower.includes('area')) return FAQ_RESPONSES['location'];
  if (lower.includes('filter') || lower.includes('search') || lower.includes('find') || lower.includes('sort')) return FAQ_RESPONSES['filter'];
  if (lower.includes('dashboard') || lower.includes('manage')) return FAQ_RESPONSES['dashboard'];
  if (lower.includes('profile') || lower.includes('edit profile') || lower.includes('photo')) return FAQ_RESPONSES['profile'];
  if (lower.includes('privacy')) return FAQ_RESPONSES['privacy'];
  if (lower.includes('terms') || lower.includes('condition')) return FAQ_RESPONSES['terms'];
  if (lower.includes('dark') || lower.includes('theme') || lower.includes('mode')) return FAQ_RESPONSES['dark mode'];
  if (lower.includes('property') || lower.includes('listing') || lower.includes('lot') || lower.includes('house') || lower.includes('condo')) return FAQ_RESPONSES['properties'];
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('good morning') || lower.includes('good afternoon')) {
    return 'Hello! Welcome to Philippine Skyland. I\'m here to help you with any questions about our properties, services, or the platform. How can I assist you today?';
  }
  if (lower.includes('thank')) {
    return 'You\'re welcome! If you have any other questions, feel free to ask. Happy property hunting!';
  }

  return 'I\'m not sure I understand that question. I can help with:\n• Property searches and filters\n• Account and login help\n• Contact information\n• Platform features\n• Profile management\n\nTry asking something like "How do I search for properties?" or "What are the property types?"';
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: 'Hello! I\'m the Philippine Skyland assistant. Ask me anything about our properties, services, or how to use the platform.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = findResponse(text);
      const assistantMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl border border-secondary-200 dark:border-secondary-700 flex flex-col overflow-hidden" style={{ height: '520px' }}>
          <div className="bg-primary-600 text-white px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Philippine Skyland</h4>
              <p className="text-xs text-primary-100">Ask us anything</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-br-md'
                    : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-200 rounded-bl-md'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-secondary-100 dark:bg-secondary-700 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-secondary-200 dark:border-secondary-700 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 border border-secondary-300 dark:border-secondary-600 rounded-full px-4 py-2.5 text-sm bg-white dark:bg-secondary-700 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
