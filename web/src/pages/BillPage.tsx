import { zodResolver } from '@hookform/resolvers/zod';
import { createBillSchema, type createBillInput } from '@bill-splitter/shared';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PiCurrencyDollar, PiPlus, PiReceipt } from 'react-icons/pi';
import BillCard, { type Bill } from '../components/BillCard';
import { useParams } from '@tanstack/react-router';
import { getBills, createBill } from '../api/bills.api';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});

function BillPage() {
    const [bills, setBills] = useState<Bill[]>([]);
    const { homeId } = useParams({
        from: "/homes/$homeId/bills"
    })
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<createBillInput>({
        defaultValues: { title: '' },
        resolver: zodResolver(createBillSchema),
    });

    const addBill = async (data: createBillInput) => {
        const response = await createBill(homeId, data)
        const newBill: Bill = {
            id: response.id,
            title: response.title,
            totalCents: response.totalCents
        }
        setBills((prev) => [...prev, newBill]);
        reset();
    };


    useEffect(() => {
        try {
            async function fetchBills() {
                const bills = await getBills(homeId);
                setBills(bills)
            }
            fetchBills();
        }
        catch (error) {
            console.error('Error fetching bills:', error);
        }
    }, []);

    const totalCents = bills.reduce((total, bill) => total + bill.totalCents, 0);

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">Household bills</h1>
                        <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                            Add shared expenses and keep every household bill easy to find.
                        </p>
                    </div>

                    <div className="flex w-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-center shadow-sm sm:w-auto sm:min-w-44">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total bills</p>
                        <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{currencyFormatter.format(totalCents / 100)}</p>
                    </div>
                </header>

                <section aria-labelledby="add-bill-title" className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:mt-10 sm:p-7">
                    <div className="mb-6">
                        <h2 id="add-bill-title" className="text-lg font-semibold text-slate-900">Add a new bill</h2>
                        <p className="mt-1.5 text-sm leading-6 text-slate-500">Enter the bill details to split the expense with your household.</p>
                    </div>

                    <form onSubmit={handleSubmit(addBill)} noValidate>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)_auto] md:items-start">
                            <div>
                                <label htmlFor="bill-title" className="mb-2 block text-sm font-semibold text-slate-700">Bill title</label>
                                <input
                                    id="bill-title"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="e.g. Electricity bill"
                                    {...register('title')}
                                    className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 aria-[invalid=true]:border-rose-400 aria-[invalid=true]:focus:ring-rose-100"
                                />
                                {errors.title && <p className="mt-2 text-sm font-medium text-rose-600">{errors.title.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="bill-amount" className="mb-2 block text-sm font-semibold text-slate-700">Total amount</label>
                                <div className="relative">
                                    <PiCurrencyDollar className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                                    <input
                                        id="bill-amount"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        {...register('totalCents', {
                                            setValueAs: (value: string) => value === '' ? 0 : Math.round(Number(value) * 100),
                                        })}
                                        className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-2 pl-11 pr-4 text-base tabular-nums text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                    />
                                </div>
                                {errors.totalCents && <p className="mt-2 text-sm font-medium text-rose-600">{errors.totalCents.message}</p>}
                            </div>

                            <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 md:mt-7 md:min-w-32">
                                <PiPlus className="size-5" aria-hidden="true" />
                                Add bill
                            </button>
                        </div>
                    </form>
                </section>

                <section aria-labelledby="bill-list-title" className="mt-10 sm:mt-12">
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <h2 id="bill-list-title" className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">All bills</h2>
                            <p className="mt-1 text-sm text-slate-500">Review the expenses shared by this household.</p>
                        </div>
                        <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm">
                            {bills.length} {bills.length === 1 ? 'bill' : 'bills'}
                        </span>
                    </div>

                    {bills.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                            {bills.map((bill) => <BillCard key={bill.id} bill={bill} onOpen={() => { }} />)}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                            <PiReceipt className="mx-auto size-7 text-slate-400" aria-hidden="true" />
                            <h3 className="mt-3 font-semibold text-slate-900">No bills yet</h3>
                            <p className="mt-2 text-sm text-slate-500">Use the form above to add the first shared expense.</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default BillPage;
