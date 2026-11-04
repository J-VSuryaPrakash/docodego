import { PiCheckCircle, PiCreditCard, PiUser } from 'react-icons/pi';

export type Share = {
    id: string;
    memberName: string;
    amountCents: number;
    paidAt: string | null;
};

type ShareCardProps = {
    share: Share;
    onPayClick: (share: Share) => void;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});

function ShareCard({ share, onPayClick }: ShareCardProps) {
    const isPaid = Boolean(share.paidAt);

    return (
        <article className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:border-indigo-200 hover:shadow-md sm:flex-row sm:items-center sm:p-5">
            <div className="flex min-w-0 flex-1 items-center gap-3.5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100">
                    <PiUser className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold capitalize text-slate-900 sm:text-lg">{share.memberName}</h3>
                    <p className="mt-0.5 text-sm text-slate-500">Individual share</p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:w-72 sm:border-l sm:border-t-0 sm:py-1 sm:pl-6 sm:pt-0">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Amount due</p>
                    <p className="mt-1 text-lg font-bold tabular-nums text-slate-950">
                        {currencyFormatter.format(share.amountCents / 100)}
                    </p>
                </div>

                {isPaid ? (
                    <span className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-emerald-50 px-3 text-sm font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        <PiCheckCircle className="size-5" aria-hidden="true" />
                        Paid
                    </span>
                ) : (
                    <button
                        type="button"
                        onClick={() => onPayClick(share)}
                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    >
                        <PiCreditCard className="size-5" aria-hidden="true" />
                        Pay
                    </button>
                )}
            </div>
        </article>
    );
}

export default ShareCard;
