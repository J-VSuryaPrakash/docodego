import { createFileRoute } from '@tanstack/react-router'
import SharePage from '../pages/SharePage'

export const Route = createFileRoute('/homes/$homeId/bills_/$billId/shares')({
  component: SharePage,
})

