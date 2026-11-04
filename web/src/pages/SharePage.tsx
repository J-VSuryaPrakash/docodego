import { useEffect, useRef, useState } from 'react';
import { PiCheckCircle, PiClock, PiReceipt, PiUsersThree, PiWallet } from 'react-icons/pi';
import PaymentModal from '../components/PaymentModal';
import ShareCard, { type Share } from '../components/ShareCard';
import { useParams } from '@tanstack/react-router';
import { getShares, payShare } from '../api/shares.api';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});

function SharePage() {
    const [shares, setShares] = useState([] as Share[]);
    const [selectedShare, setSelectedShare] = useState<Share | null>(null);
    const idempotencyKeys = useRef<Record<string, string>>({});

    const { homeId, billId } = useParams({
        from: "/homes/$homeId/bills_/$billId/shares"
    });

    useEffect(() => {
        async function fetchShares(){
            const response = await getShares(homeId, billId);
            setShares(response);
        }
        fetchShares();
    }, [])

    const handlePay = async (shareToPay: Share) => {
        const idempotencyKey = idempotencyKeys.current[shareToPay.id]
            ?? crypto.randomUUID();

        idempotencyKeys.current[shareToPay.id] = idempotencyKey;

        const paidShare = await payShare(billId, shareToPay.id, idempotencyKey);

        setShares((currentShares) => currentShares.map((share) => (
            share.id === paidShare.id
                ? {
                    ...share,
                    amountCents: paidShare.amountCents,
                    paidAt: paidShare.paidAt,
                }
                : share
        )));

        delete idempotencyKeys.current[shareToPay.id];
    };

    const paidShares = shares.filter((share) => share.paidAt);
    const totalCents = shares.reduce((total, share) => total + share.amountCents, 0);
    const paidCents = paidShares.reduce((total, share) => total + share.amountCents, 0);

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                <header className="max-w-2xl">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">Payment shares</h1>
                    <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                        Track each person's part of the bill and see which payments are still outstanding.
                    </p>
                </header>

                <section aria-label="Payment summary" className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                            <PiWallet className="size-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Bill total</p>
                            <p className="mt-1 truncate text-lg font-bold tabular-nums text-slate-900">{currencyFormatter.format(totalCents / 100)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                            <PiCheckCircle className="size-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Collected</p>
                            <p className="mt-1 truncate text-lg font-bold tabular-nums text-emerald-700">{currencyFormatter.format(paidCents / 100)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                            <PiClock className="size-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Remaining</p>
                            <p className="mt-1 truncate text-lg font-bold tabular-nums text-amber-700">{currencyFormatter.format((totalCents - paidCents) / 100)}</p>
                        </div>
                    </div>
                </section>

                <section aria-labelledby="share-list-title" className="mt-10 sm:mt-12">
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <h2 id="share-list-title" className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Everyone's share</h2>
                            <p className="mt-1 text-sm text-slate-500">Individual amounts and payment status.</p>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm">
                            <PiUsersThree className="size-4" aria-hidden="true" />
                            {shares.length}
                        </span>
                    </div>

                    {shares.length > 0 ? (
                        <div className="space-y-3">
                            {shares.map((share) => <ShareCard key={share.id} share={share} onPayClick={setSelectedShare} />)}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                            <PiUsersThree className="mx-auto size-7 text-slate-400" aria-hidden="true" />
                            <h3 className="mt-3 font-semibold text-slate-900">No shares yet</h3>
                            <p className="mt-2 text-sm text-slate-500">Shares will appear after members are added to this bill.</p>
                        </div>
                    )}
                </section>
            </div>

            <PaymentModal
                isOpen={Boolean(selectedShare)}
                share={selectedShare}
                onClose={() => setSelectedShare(null)}
                onConfirm={handlePay}
            />
        </main>
    );
}

export default SharePage;
