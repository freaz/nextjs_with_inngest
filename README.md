# Experimenting with Inngest

The goal is to write simple NextJS application, which:

1. creates a job with server action
2. redirects user to job page
3. on client starts polling job state and shows it

## Notes

- Main drawback is need to disable [Deployment Protection](https://vercel.com/docs/security/deployment-protection#configuring-deployment-protection) or need for [Protection Bypass for Automation](https://vercel.com/docs/security/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation) which costs $150 per month. It is described in [Vercel - Inngest Documentation](https://www.inngest.com/docs/deploy/vercel?ref=app-onboarding-functions#deploying-to-vercel)
- Vercel integration works, but no way to select other than `Production` environment
- Preview will automatically create Branch Environments. Which will stay active for 3 days since last deploy. Auto archive can be disabled. [Working with Environments - Inngest Documentation](https://www.inngest.com/docs/platform/environments)
- Every step have maximum duration [Vercel's max duration](https://vercel.com/docs/functions/serverless-functions/runtimes#max-duration). But compared to Upstash solution, we can split the job to several steps and easily overcome this limit.
