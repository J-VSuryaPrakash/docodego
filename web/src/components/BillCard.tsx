import { PiArrowRight, PiReceipt } from 'react-icons/pi'

export type Bill = {
  id: string
  title: string
  totalCents: number
}

type BillCardProps = {
  bill: Bill
  onOpen: (billId: string) => void
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

function BillCard({ bill, onOpen }: BillCardProps) {
  return (
    <article className="group flex min-h-52 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100">
            <PiReceipt className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="mt-1 truncate text-lg font-semibold text-slate-900">{bill.title}</h3>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm text-slate-500">Total amount</p>
        <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums text-slate-950">
          {currencyFormatter.format(bill.totalCents / 100)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onOpen(bill.id)}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      >
        View Share Split
        <PiArrowRight
          className="size-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </button>
    </article>
  )
}

export default BillCard
