import { getJob } from '@/app/actions'

export const dynamic = 'force-dynamic'

export default async function JobDetail({ params }: { params: { id: string } }) {
  const job = await getJob(params.id)

  return (
    <main>
      <pre>
        {JSON.stringify(job, null, 2)}
      </pre>
    </main>
  )
}