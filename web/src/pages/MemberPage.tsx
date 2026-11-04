import { type createMemberInput, createMemberSchema } from '@bill-splitter/shared'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from '@tanstack/react-router'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PiPlus } from 'react-icons/pi'
import { toast } from 'sonner'
import { createMember, getMembers } from '../api/members.api'
import MemberCard, { type Member } from '../components/MemberCard'

function MemberPage() {
  const [members, setMembers] = useState([] as Member[])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<createMemberInput>({
    defaultValues: { name: '' },
    resolver: zodResolver(createMemberSchema),
  })

  const addMember = async (data: createMemberInput) => {
    const response = await createMember(homeId, data)
    const newMember = {
      memberId: response.id,
      name: response.name,
      outstandingCents: 0,
    }
    setMembers((currentMembers) => [...currentMembers, newMember])
    reset()
  }
  const { homeId } = useParams({
    from: '/homes/$homeId/members',
  })

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers(homeId)
        setMembers(data.balances)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.error ?? 'Something went wrong', {
            id: homeId,
          })
        } else {
          toast.error('Something went wrong', {
            id: homeId,
          })
        }
      }
    }
    fetchMembers()
  }, [homeId])

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Everyone at home
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Add the people you share expenses with and see who still has a balance to settle.
            </p>
          </div>

          <div className="flex w-full gap-3 sm:w-auto">
            <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:min-w-32">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Members
              </p>
              <p className="mt-1 text-xl font-bold text-slate-900">{members.length}</p>
            </div>
          </div>
        </header>

        <section
          aria-labelledby="add-member-title"
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:mt-10 sm:p-7"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 id="add-member-title" className="text-lg font-semibold text-slate-900">
                Add a member
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Add someone before including them in shared bills.
              </p>
            </div>

            <form onSubmit={handleSubmit(addMember)} className="w-full lg:max-w-xl" noValidate>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <label htmlFor="member-name" className="sr-only">
                    Member name
                  </label>
                  <input
                    id="member-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter member name"
                    {...register('name')}
                    className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm font-medium text-rose-600">{errors.name.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-36"
                >
                  <PiPlus /> Add member
                </button>
              </div>
            </form>
          </div>
        </section>

        <section aria-labelledby="member-list-title" className="mt-10 sm:mt-12">
          <div className="mb-5">
            <h2
              id="member-list-title"
              className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl"
            >
              Member balances
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A quick view of each person's current status.
            </p>
          </div>

          {members.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              {members.map((member) => (
                <MemberCard key={member.memberId} member={member} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <h3 className="font-semibold text-slate-900">No members yet</h3>
              <p className="mt-2 text-sm text-slate-500">
                Use the form above to add the first person.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default MemberPage
