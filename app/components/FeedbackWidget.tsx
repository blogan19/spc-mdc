'use client';

import { useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('General feedback');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 50);
  }, [open]);

  // Auto-close after sent
  useEffect(() => {
    if (status !== 'sent') return;
    const t = setTimeout(() => {
      setOpen(false);
      setStatus('idle');
      setMessage('');
      setEmail('');
      setType('General feedback');
    }, 2500);
    return () => clearTimeout(t);
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, email, type }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body.error ?? 'Something went wrong — please try again.');
        setStatus('error');
      } else {
        setStatus('sent');
      }
    } catch {
      setErrorMsg('Network error — please check your connection.');
      setStatus('error');
    }
  };

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-80 rounded-2xl shadow-2xl bg-white border border-gray-200 overflow-hidden">
          <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Send feedback</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-indigo-200 hover:text-white transition-colors text-lg leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {status === 'sent' ? (
            <div className="px-4 py-8 text-center">
              <div className="text-3xl mb-2">✓</div>
              <p className="text-sm font-medium text-gray-800">Thanks for the feedback!</p>
              <p className="text-xs text-gray-500 mt-1">We&apos;ll look into it.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option>General feedback</option>
                  <option>Bug report</option>
                  <option>Feature request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Message</label>
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  placeholder="Tell us what you think…"
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Your email <span className="text-gray-400">(optional — for a reply)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-600">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || !message.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded px-4 py-2 transition-colors"
              >
                {status === 'sending' ? 'Sending…' : 'Send'}
              </button>
            </form>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-full px-4 py-2 shadow-lg transition-colors"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path
            fillRule="evenodd"
            d="M10 2a8 8 0 100 16A8 8 0 0010 2zM7.5 9a.5.5 0 000 1h5a.5.5 0 000-1h-5zm0 2.5a.5.5 0 000 1h3a.5.5 0 000-1h-3z"
            clipRule="evenodd"
          />
        </svg>
        Feedback
      </button>
    </div>
  );
}
