import { HiHome } from 'react-icons/hi'

type HomeCardProps = {
    home: { id: string; name: string };
    onMembersClick: (homeId: string) => void;
    onBillsClick: (homeId: string) => void;
};



function HomeCard({ home, onMembersClick, onBillsClick }: HomeCardProps) {
    const initial = home.name.trim().charAt(0).toUpperCase() || 'H';

    return (
        <article className="group flex min-h-56 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3.5">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100">
                        <HiHome className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="mt-1 truncate text-lg font-semibold text-slate-900">{home.name}</h2>
                    </div>
                </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-500">
                Keep members, shared bills, and balances organized in one place.
            </p>

            <div className="mt-auto grid grid-cols-2 gap-2.5 pt-6">
                <button type="button" onClick={() => onMembersClick(home.id)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                    Members
                </button>
                <button type="button" onClick={() => onBillsClick(home.id)} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                    Bills
                </button>
            </div>
        </article>
    );
}

export default HomeCard;
