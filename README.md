# testingwithagents.com

Professional portfolio and thought-leadership site for Nick Baynham, positioned around AI-augmented software testing and agentic automation. Tagline: "Software testing for the agentic era."

The site is static-only: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, built to a static `out/` directory and hosted on AWS Amplify Hosting behind Route 53 + ACM.

Authoritative documents:

- [`AGENTS.md`](AGENTS.md) — working agreement, project identity, definition of done.
- [`requirements/business_requirements.md`](requirements/business_requirements.md) — scope, audiences, user journeys, success metrics.
- [`plan/plan.md`](plan/plan.md) — phased delivery plan, exit criteria.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md), [`docs/MAINTENANCE.md`](docs/MAINTENANCE.md), [`docs/TESTING.md`](docs/TESTING.md), [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
- [`CHANGELOG.md`](CHANGELOG.md), [`FEATURES.md`](FEATURES.md), [`TODO.md`](TODO.md) — living status.

## Quickstart

Requirements: Node 20+ (CI runs on 24), Docker (for `linkcheck` and local Plausible), AWS CLI (for `make deploy`).

```sh
make install     # Node deps + Playwright browsers
make dev         # Next.js dev server at http://127.0.0.1:3000
make build       # static export to out/
make test        # unit + e2e + a11y
make ci          # full local pipeline: lint, typecheck, test, build, linkcheck
```

Full target list: `make help`.

## AWS Amplify Setup

These are one-time AWS account steps required before the GitHub Actions `deploy` job (in `.github/workflows/ci.yml`) can publish releases on push to `main`. Substitute your own AWS account ID, GitHub owner, and region in the commands below.

### 1. Create the Amplify Hosting app

The Amplify GitHub App must be authorized in the Console; this step cannot be scripted cleanly.

1. AWS Console → **Amplify** → **Create new app** → **Host web app**.
2. Source: **GitHub**. Authorize the AWS Amplify GitHub App for this repository only.
3. Repository: `<owner>/testingwithagents`. Branch: `main`.
4. App settings:
   - App name: `testingwithagents`.
   - Build settings: leave the auto-detected spec — Amplify reads `amplify.yml` from the repo root.
   - Frontend only; no backend.
5. Click **Save and deploy**. The first build runs against `main` and publishes to an `https://main.<random>.amplifyapp.com` URL.
6. Copy the App ID (visible in the Console URL or via `aws amplify list-apps`). Paste it into [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) in place of the `d1xxxxxxxxxxx` placeholder.

### 2. Create the GitHub OIDC provider in IAM

One per AWS account, idempotent. Skip if `aws iam list-open-id-connect-providers` already shows the `token.actions.githubusercontent.com` provider.

```sh
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

### 3. Create the deploy role

The trust policy restricts the role to this repository's `main` branch. The permission policy is scoped to the single Amplify app's `main` branch jobs.

```sh
# Replace <ACCOUNT_ID> and <GITHUB_OWNER>.
cat > /tmp/trust.json <<EOF
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
EOF

aws iam create-role \
  --role-name testingwithagents-deploy \
  --assume-role-policy-document file:///tmp/trust.json \
  --description "GitHub Actions OIDC role for testingwithagents Amplify deploys"
```

```sh
# Replace <ACCOUNT_ID>, <REGION>, and <AMPLIFY_APP_ID>.
cat > /tmp/policy.json <<EOF
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
EOF

aws iam put-role-policy \
  --role-name testingwithagents-deploy \
  --policy-name AmplifyStartJob \
  --policy-document file:///tmp/policy.json

# Capture the role ARN for the next step.
aws iam get-role --role-name testingwithagents-deploy --query 'Role.Arn' --output text
```

### 4. Add GitHub Actions secrets

GitHub → repository → **Settings → Secrets and variables → Actions**:

| Type     | Name                  | Value                                                       |
| -------- | --------------------- | ----------------------------------------------------------- |
| Secret   | `AWS_DEPLOY_ROLE_ARN` | role ARN from Step 3                                        |
| Secret   | `AMPLIFY_APP_ID`      | App ID from Step 1                                          |
| Variable | `AWS_REGION`          | optional; workflow defaults to `us-east-1` if not set       |

CLI alternative if `gh` is authenticated:

```sh
gh secret set AWS_DEPLOY_ROLE_ARN --body "<ROLE_ARN>"
gh secret set AMPLIFY_APP_ID --body "<AMPLIFY_APP_ID>"
```

### 5. Smoke-test the pipeline

1. Open a trivial PR and confirm every CI job (lint, typecheck, unit, build, e2e, a11y, linkcheck) goes green.
2. Merge to `main`. Confirm the new `deploy` job runs in GitHub Actions and shows a successful `aws amplify start-job` call.
3. In the Amplify Console, watch the resulting `main` build. Once finished, open the published URL and verify the homepage renders.

### 6. (Recommended) Branch protection on `main`

GitHub → repository → **Settings → Branches → Add branch protection rule**:

- Branch name pattern: `main`.
- Require status checks to pass before merging.
- Required checks: `lint`, `typecheck`, `unit`, `build`, `e2e`, `a11y`, `linkcheck`. Leave `deploy` unchecked — it only runs on push, not on PRs.
- Require branches to be up to date before merging.

### Manual deploy override

```sh
export AMPLIFY_APP_ID=<your_app_id>
make deploy
```

This calls `aws amplify start-job` against the current branch. Use it from a developer machine when GitHub Actions is unavailable.

Custom domain wiring (`testingwithagents.com` + `www`), ACM certificate validation, rollback procedure, and Phase 5 production cutover live in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
