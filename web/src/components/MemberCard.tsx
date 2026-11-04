import { HiUser } from 'react-icons/hi2'

export type Member = {
  memberId: string
  name: string
  outstandingCents: number
}

type MemberCardProps = {
  member: Member
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

function MemberCard({ member }: MemberCardProps) {
  const hasOutstandingBalance = member.outstandingCents > 0

  return (
    <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-5">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100">
        <HiUser />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold capitalize text-slate-900 sm:text-lg">
          {member.name}
        </h3>
        <p className="mt-0.5 text-sm text-slate-500">
          {hasOutstandingBalance ? 'Amount still to settle' : 'All expenses settled'}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p
          className={`text-sm font-bold tabular-nums sm:text-base ${hasOutstandingBalance ? 'text-amber-700' : 'text-emerald-700'}`}
        >
          {currencyFormatter.format(member.outstandingCents / 100)}
        </p>
        <span
          className={`mt-1 inline-flex rounded-full px-2 py-1.5 text-xs font-semibold ${hasOutstandingBalance ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200' : 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200'}`}
        >
          {hasOutstandingBalance ? 'Pending' : 'Settled'}
        </span>
      </div>
    </article>
  )
}

export default MemberCard
