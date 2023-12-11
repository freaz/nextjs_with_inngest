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

    const runningJob = await step.run('mark-as-running', async () => {
      return await updateJob(jobId, { status: 'running', started: new Date() })
    })
    logger.debug('Running job', runningJob)

    await step.sleep('random-wait', randomSeconds());

    // long time running step
    await step.run('long-time-running', async () => {
      await new Promise((resolve) => {
        //setTimeout(resolve, (5 * 60 + 30) * 1000); // 5 minutes and 30 seconds
        setTimeout(resolve, 9 * 1000); // 9 seconds, deployed on hobby plan, which allows just 10 seconds at maximum for functions
      })
    })

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