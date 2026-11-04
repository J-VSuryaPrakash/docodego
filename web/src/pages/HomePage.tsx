import { zodResolver } from '@hookform/resolvers/zod';
import { createHomeSchema, type createHomeInput } from '@bill-splitter/shared';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import HomeCard from '../components/HomeCard';
import { PiPlus } from 'react-icons/pi'

type Home = { id: number; name: string };

const initialHomes: Home[] = [
    { id: 1, name: 'Flat 201' },
    { id: 2, name: 'Flat 202' },
    { id: 3, name: 'Flat 203' },
    { id: 4, name: 'Flat 204' },
    { id: 5, name: 'Flat 205' },
    { id: 6, name: 'Flat 206' },
];


function HomePage() {
    const [homes, setHomes] = useState(initialHomes);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<createHomeInput>({
        defaultValues: { name: '' },
        resolver: zodResolver(createHomeSchema),
    });

    const createHome = (data: createHomeInput) => {
        setHomes((currentHomes) => [
            ...currentHomes,
            { id: Math.max(0, ...currentHomes.map((home) => home.id)) + 1, name: data.name.trim() },
        ]);
        reset();
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                <header className="max-w-2xl">
                   
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">Your homes</h1>
                    <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                        Create a home, invite your people, and keep every shared expense easy to follow.
                    </p>
                </header>

                <section aria-labelledby="create-home-title" className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:mt-10 sm:p-7">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-md">
                            <h2 id="create-home-title" className="text-lg font-semibold text-slate-900">Create a new home</h2>
                            <p className="mt-1.5 text-sm leading-6 text-slate-500">Give your space a name everyone will recognize.</p>
                        </div>

                        <form onSubmit={handleSubmit(createHome)} className="w-full lg:max-w-2xl" noValidate>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                                <div className="min-w-0 flex-1">
                                    <label htmlFor="name" className="sr-only">Name of the home</label>
                                    <input
                                        id="name"
                                        type="text"
                                        autoComplete="off"
                                        placeholder="e.g. Maple House"
                                        {...register('name')}
                                        className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 aria-[invalid=true]:border-rose-400 aria-[invalid=true]:focus:ring-rose-100"
                                    />
                                    {errors.name && <p className="mt-2 text-sm font-medium text-rose-600">{errors.name.message}</p>}
                                </div>
                                <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-36">
                                    <PiPlus  className="w-4 h-4" /> Add home
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                <section aria-labelledby="homes-heading" className="mt-10 sm:mt-12">
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <h2 id="homes-heading" className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">All homes</h2>
                            <p className="mt-1 text-sm text-slate-500">Choose a home to manage its members or bills.</p>
                        </div>
                        <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm">
                            {homes.length} {homes.length === 1 ? 'home' : 'homes'}
                        </span>
                    </div>

                    {homes.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                            {homes.map((home) => (
                                <HomeCard key={home.id} home={home} onMembersClick={() => { }} onBillsClick={() => { }} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                            <h3 className="font-semibold text-slate-900">No homes yet</h3>
                            <p className="mt-2 text-sm text-slate-500">Add your first home using the form above.</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default HomePage;
