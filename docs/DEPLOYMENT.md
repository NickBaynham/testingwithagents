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
6. Note the `AMPLIFY_APP_ID` from the console URL or `aws amplify list-apps`. Export it locally:

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
```

Notes:

- `next.config.ts` sets `output: "export"`, `trailingSlash: true`, and `images: { unoptimized: true }`. `npm run build` therefore emits a fully static site to `out/`.
- The Node version is pinned to 24 via `nvm use 24` to match GitHub Actions CI. Amplify Hosting build images include `nvm` and the latest LTS versions of Node.
- `node_modules` and `.next/cache` are cached between builds for speed.
- Locally, `npm run start` serves `out/` via `serve` on port 3000 (used by Playwright in CI).

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
