'use server'

import { inngest } from "@/lib/inngest/client"
import { helloWorld } from "@/lib/inngest/functions"
import { randomUUID } from "crypto"

export type Job = {
  id: string,
}

export async function createJob(): Promise<Job> {
  const job = { id: randomUUID() }
  await inngest.send({
    name: helloWorld.trigger.event,
    data: {
      job
    }
  })
  return job
}

export async function getJob(id: string): Promise<Job> {
  return { id }
}