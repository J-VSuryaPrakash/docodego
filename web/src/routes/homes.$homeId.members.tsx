import { createFileRoute } from '@tanstack/react-router'
import MemberPage from '../pages/MemberPage'

export const Route = createFileRoute('/homes/$homeId/members')({
  component: MemberPage,
})
