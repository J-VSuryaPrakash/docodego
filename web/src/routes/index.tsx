import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="p-6 font-sans bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold">Bill Splitter — starter</h1>
      <p className="mt-4">
        Replace this with the app. See <code>README.md</code> at the repo root.
      </p>
    </main>
  )
}
