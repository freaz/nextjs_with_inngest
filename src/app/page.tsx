import { redirect } from "next/navigation";
import { createJob } from "./actions";

async function submitForm(formData: FormData) {
  "use server"

  console.log('submitForm', formData)

  const job = await createJob();

  redirect(`/job/${job.id}`)
}

export default function Home() {
  return (
    <form action={submitForm}>
      <button type="submit">
        Create job
      </button>
    </form>
  )
}
