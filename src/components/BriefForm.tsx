import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Direct brief request — posts to FormSubmit (no backend needed).
 * NOTE: the first ever submission sends an activation email to the inbox
 * below; confirm it once and every request after that lands directly.
 */
const ENDPOINT = 'https://formsubmit.co/ajax/crafterlabs0506@gmail.com'

function BriefForm() {
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.currentTarget
    setStatus('sending')
    try {
      const data = Object.fromEntries(new FormData(form).entries())
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          _subject: 'New brief request — Kaleum Studios site',
          _template: 'table',
          _captcha: 'false',
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="brief-form brief-form--sent" role="status">
        <p className="brief-sent-title">Request received.</p>
        <p className="brief-sent-text">
          We'll read your brief and get back to you within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form className="brief-form" onSubmit={onSubmit}>
      <div className="brief-row">
        <label className="brief-field">
          <span>Name *</span>
          <input type="text" name="name" required autoComplete="name" placeholder="Your name" />
        </label>
        <label className="brief-field">
          <span>Email *</span>
          <input type="email" name="email" required autoComplete="email" placeholder="you@brand.com" />
        </label>
      </div>
      <label className="brief-field">
        <span>Phone</span>
        <input type="tel" name="phone" autoComplete="tel" placeholder="+1 …" />
      </label>
      <label className="brief-field">
        <span>Brief *</span>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Tell us about your venue and what you want to achieve…"
        />
      </label>
      <button type="submit" className="brief-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Submit a request'}
      </button>
      {status === 'error' && (
        <p className="brief-error" role="alert">
          Something went wrong — email us directly at{' '}
          <a href="mailto:crafterlabs0506@gmail.com">crafterlabs0506@gmail.com</a>
        </p>
      )}
    </form>
  )
}

export default BriefForm
