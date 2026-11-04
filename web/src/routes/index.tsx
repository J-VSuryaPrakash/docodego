import { createFileRoute } from '@tanstack/react-router'
import HomePage from '../pages/HomePage'
import MemberPage from '../pages/MemberPage'

export const Route = createFileRoute('/')({
  component: HomePage,
})


