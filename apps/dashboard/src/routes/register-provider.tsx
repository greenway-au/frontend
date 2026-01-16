import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register-provider')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/register-provider"!</div>
}
