# Agoda preview automatic deployment

Cloudflare Worker: hiflight-agoda-preview
Git repository: hifindhub-pixel/hiflight
Production branch for this TEST Worker: agoda-preview
Root directory: HIFLIGHT-Phase-2
Build command: npm run build:agoda-preview
Deploy command: npm run deploy:agoda-preview
Non-production branch builds: disabled

Retain existing Worker secret AGODA_AUTH, R2 AGODA_CATALOGUE and rate limiter.
Do not connect this branch to the production Worker hiflight.
Do not use the default deploy:cloudflare command (it targets production).

The catalogue is already stored in the preview R2 bucket as destinations-v1.json.
The full catalogue and API credentials are deliberately excluded from Git.
