import { useEffect, useRef, useState } from 'react'
import {
  PiCheckCircle,
  PiCreditCard,
  PiLock,
  PiSpinnerGap,
  PiWarningCircle,
  PiX,
} from 'react-icons/pi'
import type { Share } from './ShareCard'

type PaymentStatus = 'confirm' | 'processing' | 'success' | 'error'

type PaymentModalProps = {
  isOpen: boolean
  share: Share | null
  onClose: () => void
  onConfirm: (share: Share) => void | Promise<void>
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

function PaymentModal({ isOpen, share, onClose, onConfirm }: PaymentModalProps) {
  const [status, setStatus] = useState<PaymentStatus>('confirm')
  const isSubmitting = useRef(false)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!isOpen) return

    setStatus('confirm')
    isSubmitting.current = false
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting.current) onCloseRef.current()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!isOpen || !share) return null

  const isProcessing = status === 'processing'
  const amount = currencyFormatter.format(share.amountCents / 100)

  const handleConfirm = async () => {
    if (isSubmitting.current) return

    isSubmitting.current = true
    setStatus('processing')
    try {
      await onConfirm(share)
      isSubmitting.current = false
      setStatus('success')
    } catch {
      isSubmitting.current = false
      setStatus('error')
    }
  }

  const handleBackdropClick = () => {
    if (!isProcessing) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close payment dialog"
        onClick={handleBackdropClick}
        className="absolute inset-0 bg-slate-950/45"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        aria-describedby="payment-modal-description"
        className="relative z-10 w-full max-w-md rounded-t-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${
              status === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : status === 'error'
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-indigo-50 text-indigo-700'
            }`}
          >
            {status === 'processing' && (
              <PiSpinnerGap className="size-6 animate-spin" aria-hidden="true" />
            )}
            {status === 'success' && <PiCheckCircle className="size-6" aria-hidden="true" />}
            {status === 'error' && <PiWarningCircle className="size-6" aria-hidden="true" />}
            {status === 'confirm' && <PiCreditCard className="size-6" aria-hidden="true" />}
          </div>

          {!isProcessing && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close payment dialog"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <PiX className="size-5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="mt-5">
          <h2
            id="payment-modal-title"
            className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl"
          >
            {status === 'confirm' && 'Confirm payment'}
            {status === 'processing' && 'Processing payment'}
            {status === 'success' && 'Payment complete'}
            {status === 'error' && 'Payment unsuccessful'}
          </h2>
          <p id="payment-modal-description" className="mt-2 text-sm leading-6 text-slate-600">
            {status === 'confirm' && `Review ${share.memberName}'s share before confirming.`}
            {status === 'processing' && 'Please wait while the payment is being recorded.'}
            {status === 'success' && `${share.memberName}'s share has been marked as paid.`}
            {status === 'error' && 'The payment could not be completed. You can safely try again.'}
          </p>
        </div>

        <div
          className={`mt-6 rounded-2xl border p-5 text-center ${
            status === 'success'
              ? 'border-emerald-200 bg-emerald-50'
              : status === 'error'
                ? 'border-rose-200 bg-rose-50'
                : 'border-slate-200 bg-slate-50'
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Payment amount
          </p>
          <p
            className={`mt-2 text-3xl font-bold tracking-tight tabular-nums ${
              status === 'success'
                ? 'text-emerald-700'
                : status === 'error'
                  ? 'text-rose-700'
                  : 'text-slate-950'
            }`}
          >
            {amount}
          </p>
          <p className="mt-2 truncate text-sm font-medium text-slate-600">{share.memberName}</p>
        </div>

        {status === 'confirm' && (
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isProcessing}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <PiCreditCard className="size-5" aria-hidden="true" />
              Confirm {amount}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        )}

        {status === 'processing' && (
          <div
            className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 text-sm font-semibold text-slate-600"
            aria-live="polite"
          >
            <PiSpinnerGap className="size-5 animate-spin" aria-hidden="true" />
            Processing securely…
          </div>
        )}

        {status === 'success' && (
          <button
            type="button"
            onClick={onClose}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <PiCheckCircle className="size-5" aria-hidden="true" />
            Done
          </button>
        )}

        {status === 'error' && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {(status === 'confirm' || status === 'processing') && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <PiLock className="size-3.5" aria-hidden="true" />
            Your payment is recorded securely
          </p>
        )}
      </section>
    </div>
  )
}

export default PaymentModal
