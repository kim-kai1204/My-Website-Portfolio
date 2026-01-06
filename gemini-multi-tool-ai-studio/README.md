<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/18eIlaIrkFxcl8vw8ySlsyJK4yfcjG1h7

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Deploy the proxy (see below) and set `VITE_GEMINI_PROXY_URL` in `.env.local`
3. Run the app:
   `npm run dev`

## Secure API Proxy (Recommended)

The Gemini API key must stay on the server. This project includes a Cloudflare Worker proxy.

1. Install Wrangler and log in:
   `npm install -g wrangler`
   `wrangler login`
2. Set the secret:
   `wrangler secret put GEMINI_API_KEY`
3. Deploy from `worker/`:
   `wrangler deploy`
4. Use the Worker URL as `VITE_GEMINI_PROXY_URL` (example: `https://gemini-proxy.<account>.workers.dev`)
