# Deployment

Production target: AWS Amplify Hosting. Custom domain via Route 53 + ACM. The site is static-only - no backend.

## Environments

| Env | Branch | URL |
|---|---|---|
| Preview | any feature branch | Amplify-generated preview URL |
| Production | `main` | `https://main.d2f2x4ij8pxn6g.amplifyapp.com` (Phase 0) → `https://testingwithagents.com` (after Phase 5) |

## Required Setup (Phase 0)

This is a user-driven step. Run it once.

1. Sign in to the AWS console with the account that will own the site.
2. In Amplify, create a new app and connect it to the GitHub repo `testingwithagents`.
3. Allow Amplify to install its GitHub app and grant access to the repo.
4. Use the `amplify.yml` in the repo root as the build spec (see below).
5. Enable preview deploys for non-`main` branches.
6. **Disable Amplify's webhook auto-build on `main`** so the GH Actions `deploy` job is the single canonical trigger:

   ```sh
   aws amplify update-branch --app-id "$AMPLIFY_APP_ID" --branch-name main --no-enable-auto-build
   ```

7. **Override the Amplify default customRule** (see ["customRules: 404 handling"](#customrules-404-handling) below).
8. **Set the security-header policy on the app** (see ["Security headers (Amplify custom-headers)"](#security-headers-amplify-custom-headers) below). The `customHeaders:` block in `amplify.yml` is **ignored** by Amplify - the source of truth is the app config, applied via `aws amplify update-app --custom-headers`.
9. Note the `AMPLIFY_APP_ID` from the console URL or `aws amplify list-apps`. Export it locally:

   ```sh
   export AMPLIFY_APP_ID=d2f2x4ij8pxn6g
   ```

   Add it to your shell profile or `.env.local` so `make deploy` works.

## amplify.yml

The repo ships `amplify.yml` at the root. Amplify picks it up automatically when the app is connected to the GitHub repository.

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm use 24
        - npm ci --no-audit --no-fund
        - npx playwright install chromium chromium-headless-shell
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: out
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
      - /root/.cache/ms-playwright/**/*
```

Notes:

- `next.config.ts` sets `output: "export"`, `trailingSlash: true`, and `images: { unoptimized: true }`. `npm run build` therefore emits a fully static site to `out/`.
- The Node version is pinned to 24 via `nvm use 24` to match GitHub Actions CI. Amplify Hosting build images include `nvm` and the latest LTS versions of Node.
- `node_modules`, `.next/cache`, **and Playwright's browser bundle** are cached between builds. First build downloads chromium + chromium-headless-shell (~200 MB); subsequent builds reuse the cached binaries.
- Locally, `npm run start` serves `out/` via `serve` on port 3000 (used by Playwright in CI).

## Amplify build-image quirks

The Amplify Hosting build image ships Node and `nvm` but **does not** ship a Playwright browser binary. The build-time resume PDF (`scripts/generate-resume-pdf.tsx`) calls `chromium.launch()`, so the build will fail with `Executable doesn't exist at /root/.cache/ms-playwright/...` unless we install it.

The `amplify.yml` preBuild explicitly runs `npx playwright install chromium`, and the `cache.paths` block includes `/root/.cache/ms-playwright/**/*` so the browser binary persists between builds (the first build is ~150 MB heavier; subsequent builds reuse the cached binary). If you add a new build-time tool that depends on a system binary not present in Amazon Linux 2023, install it the same way.

## Security headers (Amplify custom-headers)

Static export leaves no Next runtime to attach response headers via `next.config.ts`, so the policy lives on the Amplify app itself, not in `amplify.yml`. We discovered this the hard way on the Phase 4 deploy - a `customHeaders:` block in `amplify.yml` was silently ignored at the CloudFront layer.

The headers are configured via `aws amplify update-app --custom-headers ...`. The current state is captured in `amplify.yml`'s `customHeaders:` block as documentation, but the source of truth is the app config. To update:

```sh
cat > /tmp/headers.yml <<'EOF'
customHeaders:
  - pattern: "**/*"
    headers:
      - key: "Strict-Transport-Security"
        value: "max-age=31536000; includeSubDomains; preload"
      - key: "Referrer-Policy"
        value: "strict-origin-when-cross-origin"
      - key: "Permissions-Policy"
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()"
      - key: "X-Content-Type-Options"
        value: "nosniff"
      - key: "X-Frame-Options"
        value: "DENY"
      - key: "Cross-Origin-Opener-Policy"
        value: "same-origin"
EOF

aws amplify update-app --app-id "$AMPLIFY_APP_ID" --custom-headers "$(cat /tmp/headers.yml)"
```

Verify with `curl -sI <amplify-url>/ | grep -iE "strict-transport|referrer-policy|permissions-policy|x-content-type|x-frame|cross-origin"`. The `tests/e2e/security-headers.spec.ts` spec asserts the same set against `SECURITY_HEADERS_URL`; the GitHub Actions deploy job can be wired to run it after each release.

## customRules: 404 handling

Amplify Hosting auto-provisions a customRule on new apps that rewrites every unmatched path to `/index.html` with status `404-200`. For a static export that has a real `out/404.html`, that default is wrong: users hitting `/about/` or any not-yet-built route receive the homepage body. **Override the rule once, after the app is created**:

```sh
cat > /tmp/rules.json <<'EOF'
[
  {
    "source": "/<*>",
    "target": "/404.html",
    "status": "404"
  }
]
EOF

aws amplify update-app --app-id "$AMPLIFY_APP_ID" --custom-rules file:///tmp/rules.json
```

Verify with:

```sh
curl -sI "https://main.$AMPLIFY_APP_ID.amplifyapp.com/this-route-does-not-exist" | head -3
# HTTP/2 404
# content-length: 14961   <- matches `wc -c out/404.html`
```

If the rule is wrong, you'll see `content-length` matching `out/index.html` instead. The `tests/e2e/not-found.spec.ts` Playwright spec verifies the same behavior against the local test server on every PR.

## Common deploy failures (lessons learned)

Every entry below is a real failure mode we hit during Phase 0-4. The "verified by" column names the artifact (test, doc, or config) that prevents the regression now.

| Symptom | Root cause | Fix | Verified by |
| --- | --- | --- | --- |
| Every URL serves the homepage HTML with HTTP 404 status | Amplify ships a default `customRule` rewriting `/<*>` to `/index.html` with status `404-200`. Static-export `out/404.html` is never used. | `aws amplify update-app --custom-rules` with target `/404.html`, status `404`. | `tests/e2e/not-found.spec.ts` (local), `tests/e2e/post-deploy-smoke.spec.ts` (live) |
| Amplify build fails with `Executable doesn't exist at /root/.cache/ms-playwright/...` | Amplify build image does not ship Playwright browser binaries. `chromium.launch()` in the postbuild PDF script crashes. | `npx playwright install chromium chromium-headless-shell` in preBuild; cache `/root/.cache/ms-playwright/**/*`. | `amplify.yml` (preBuild step), `.github/workflows/ci.yml` (build job) |
| GH Actions build fails with `Executable doesn't exist at /home/runner/.cache/ms-playwright/...` | Same root cause - the `build` job did not install Playwright before invoking the postbuild PDF script. | Same fix in the `build` job of the workflow. | `.github/workflows/ci.yml` (build job) |
| `chromium.launch()` fails after installing chromium | Playwright 1.49+ launches `chromium-headless-shell` (a separate package) by default, not the full `chromium`. | Install **both** binaries. | `amplify.yml`, `.github/workflows/ci.yml` |
| Per-route OG image URLs 404 in production but work locally | Next's `opengraph-image.tsx` route convention emits an extensionless artifact. Amplify's static backend 301-redirects extensionless paths to add a trailing slash, breaking the meta-tag URL. | Generate OG PNGs at build time into `public/og/<route>.png` with explicit `.png` extension via `scripts/generate-og-images.tsx`. | `tests/e2e/og-images.spec.ts` (local), `tests/e2e/post-deploy-smoke.spec.ts` (live) |
| Security headers absent from production response despite `amplify.yml` declaring them | Amplify silently ignores `customHeaders:` declared in `amplify.yml`. The source of truth is the app config. | `aws amplify update-app --custom-headers ...`. Documented in this file and mirrored as a commented-out reference in `amplify.yml`. | `tests/e2e/security-headers.spec.ts` (live, gated on `SECURITY_HEADERS_URL`) |
| GH Actions deploy hangs after `Wrote .../out/resume.pdf` | `serve` (npx-wrapped) did not forward SIGTERM; an uncleared startup timeout kept the Node event loop alive. | Detached spawn with process-group kill, escalating SIGKILL after 3s, `clearTimeout`, and explicit `process.exit(0)`. | `scripts/generate-resume-pdf.tsx` (local timing ~2s) |
| GH Actions `linkcheck` job fails with `Cannot convert path '/' to a URI` | The action invocation lacked `--root-dir`. Root-relative links in `out/*.html` could not be resolved. | `--root-dir ./out` in the GH Actions step (mirrors the docker-compose invocation). | `.github/workflows/ci.yml` (linkcheck job) |
| OIDC handshake fails: `Not authorized to perform sts:AssumeRoleWithWebIdentity` | IAM role or OIDC provider not created; secrets misconfigured. | Run the steps in [Continuous Deployment (GitHub Actions)](#continuous-deployment-github-actions). Verify with `aws iam get-role --role-name testingwithagents-deploy`. | Setup runbook in this doc |
| OIDC handshake works but `aws amplify start-job` returns `LimitExceededException` | Amplify's GitHub-webhook auto-build is racing with the GH Actions deploy on the same commit. | Disable auto-build on `main` (`aws amplify update-branch --no-enable-auto-build`) so GH Actions is the single trigger, AND make the deploy step treat `LimitExceededException` as success for defense in depth. | `.github/workflows/ci.yml` (deploy step) |
| Inline JSON in `aws iam create-role` errors with `MalformedPolicyDocument` | The terminal wrapped the long line and inserted newlines inside JSON strings. | Pass JSON via `file://` referring to a base64-decoded payload, never via inline quoted shell strings on long lines. Captured in [Continuous Deployment (GitHub Actions)](#continuous-deployment-github-actions). | This runbook |

A `post-deploy-smoke` job in the workflow runs `tests/e2e/post-deploy-smoke.spec.ts` and `tests/e2e/security-headers.spec.ts` against the live Amplify URL after every successful deploy. That is the safety net for everything in the table above that has a "live" entry in the "verified by" column.

## Custom Domain (Phase 5)

1. In Amplify, add domain `testingwithagents.com` and the `www` subdomain.
2. Amplify requests an ACM certificate, validated via DNS records in Route 53.
3. Configure `www` -> apex redirect via Amplify redirect rules.
4. Verify TLS on the live site (`curl -I https://testingwithagents.com`).
5. Confirm HSTS header is present (Phase 4 adds it to `next.config.ts` + Amplify response-header rules).

## Rollback

Amplify retains build history. To roll back, redeploy a prior successful build from the Amplify console or via:

```sh
aws amplify start-deployment --app-id "$AMPLIFY_APP_ID" --branch-name main --source-url <prior-artifact>
```

## Continuous Deployment (GitHub Actions)

Deploys are driven by the `deploy` job in `.github/workflows/ci.yml`. It runs only on push to `main` and only after every CI job (lint, typecheck, unit, build, e2e, a11y, linkcheck) is green. The job calls `aws amplify start-job ... --job-type RELEASE`, which tells Amplify to fetch the latest commit from GitHub, run the `amplify.yml` build, and publish the artifact.

### One-time AWS setup

1. Create an IAM OIDC provider for GitHub Actions in the AWS account:

   - Provider URL: `https://token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`

2. Create an IAM role (e.g. `testingwithagents-deploy`) with a trust policy that allows the GitHub OIDC provider to assume it only from this repository's `main` branch:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
         },
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Condition": {
           "StringEquals": {
             "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
           },
           "StringLike": {
             "token.actions.githubusercontent.com:sub": "repo:<GITHUB_OWNER>/testingwithagents:ref:refs/heads/main"
           }
         }
       }
     ]
   }
   ```

3. Attach an inline policy that only permits the operations needed to trigger an Amplify build:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["amplify:StartJob", "amplify:GetJob"],
         "Resource": "arn:aws:amplify:<REGION>:<ACCOUNT_ID>:apps/<AMPLIFY_APP_ID>/branches/main/jobs/*"
       }
     ]
   }
   ```

4. In the GitHub repo, add secrets and variables under **Settings → Secrets and variables → Actions**:

   - Secret `AWS_DEPLOY_ROLE_ARN` - the ARN of the role created above.
   - Secret `AMPLIFY_APP_ID` - the Amplify app ID (also recorded above).
   - Optional repo variable `AWS_REGION` - defaults to `us-east-1` in the workflow.

### Manual override

```sh
make deploy
```

Triggers `aws amplify start-job` locally against the current branch. Requires the `aws` CLI signed in to the account and `AMPLIFY_APP_ID` exported in the shell. Use this for hotfixes from a developer machine when GitHub Actions is unavailable.
