import { createFileRoute } from '@tanstack/react-router'
import BillPage from '../pages/BillPage'

export const Route = createFileRoute('/homes/$homeId/bills')({
  component: BillPage,
})
