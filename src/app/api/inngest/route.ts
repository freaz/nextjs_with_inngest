import { inngest } from "@/lib/inngest/client"
import { processJob } from "@/lib/inngest/functions"
import { serve } from "inngest/next"

export const maxDuration = 10 // we want 300 byt I am on hobby

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processJob
  ]
})