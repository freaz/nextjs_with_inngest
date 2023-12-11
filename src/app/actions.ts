'use server'

import { randomUUID } from "crypto"

export type Job = {
  id: string,
}

export async function createJob(): Promise<Job> {
  const job = { id: randomUUID() }
  return job
}

export async function getJob(id: string): Promise<Job> {
  return { id }
}