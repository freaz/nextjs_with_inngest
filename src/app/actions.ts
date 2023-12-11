'use server'

import { kv } from "@vercel/kv"
import { randomUUID } from "crypto"
import { inngest } from "@/lib/inngest/client"
import { processJob } from "@/lib/inngest/functions"

export type Job = {
  id: string,
  status: 'new' | 'running' | 'finished' | 'failed',
  started?: Date,
  ended?: Date
}

export async function createJob(): Promise<Job> {
  const job: Job = { id: randomUUID(), status: 'new' }
  await kv.hset(`job:${job.id}`, job)
  await inngest.send({
    name: processJob.trigger.event,
    data: {
      job
    }
  })
  return job
}

export async function getJob(id: string): Promise<Job | undefined> {
  const job = await kv.hgetall<Job>(`job:${id}`);
  if (!job) {
    return undefined
  }
  return job
}

export async function updateJob(id: string, job: Omit<Job, 'id'>): Promise<Job> {
  const originalJob = await getJob(id);
  if (!originalJob) {
    throw new Error(`Job ${id} not found`)
  }
  const updatedJob = { ...originalJob, ...job }
  await kv.hset(`job:${originalJob.id}`, updatedJob)
  return updatedJob
}

export async function listJobs(): Promise<Job[]> {
  const keys = await kv.keys('job:*')

  const pipeline = kv.pipeline()
  keys.forEach((key) => pipeline.hgetall(key))
  if (pipeline.length() === 0) {
    return []
  }
  return await pipeline.exec()
}