import { createLazyFileRoute } from '@tanstack/react-router'

const Tasks = () => {
    return <div>Hello /_authenticated/tasks!</div>
}

export const Route = createLazyFileRoute('/_authenticated/tasks')({
  component: Tasks,
})
