import { getJob, updateJob } from "@/app/actions";
import { inngest } from "./client";
import { NonRetriableError } from "inngest";

export const processJob = inngest.createFunction(
  { id: 'process_job' },
  { event: 'app/job.process' },
  async ({ event, step, logger }) => {
    const jobId = event.data.job?.id
    logger.info('Job processing started', jobId);

    const job = await step.run('get-job', async () => {
      if (Math.random() < 0.1) {
        throw new Error('Random failure')
      }

      return await getJob(jobId)
    })

    if (!job) {
      throw new NonRetriableError(`Job ${jobId} not found`)
    }

    await step.sleep('random-wait', randomSeconds());
    const runningJob = await step.run('mark-as-running', async () => {
      return await updateJob(jobId, { status: 'running', started: new Date() })
    })
    logger.debug('Running job', runningJob)

    await step.sleep('random-wait', randomSeconds());
    const finishedJob = await step.run('mark-as-running', async () => {
      const status = Math.random() > 0.5 ? 'finished' : 'failed'
      return await updateJob(jobId, { status, ended: new Date() })
    })
    logger.debug('Finished job', finishedJob)
  }
)

function randomSeconds(): string {
  return parseInt(String(Math.random() * 10), 10) + 's'
}