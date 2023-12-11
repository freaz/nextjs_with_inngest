import { redirect } from "next/navigation";
import { createJob, listJobs } from "./actions";

export const dynamic = 'force-dynamic'

async function submitForm(formData: FormData) {
  "use server"

  console.log('submitForm', formData)

  const job = await createJob();

  redirect(`/job/${job.id}`)
}

export default async function Home() {
  const jobs = await listJobs()

  return (
    <main>
      <form action={submitForm}>
        <button type="submit">
          Create job
        </button>
      </form>

      <ul>
        {jobs.length > 0 ? jobs.map(job => (
          <li key={job.id}>
            <a href={`/job/${job.id}`}>
              {job.id}
            </a>
          </li>
        )) : 'No jobs'}
      </ul>
    </main>
  )
}
