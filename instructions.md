# MeshCore Canada region proposal service activation

This is the handoff checklist for the MeshCore Canada administrator. It
activates anonymous boundary-proposal submission from the editor while keeping
the entire production path on MeshCore Canada-controlled infrastructure.

## Answer first: should PR #39 be merged before setup?

**No. Do not merge PR #39 first.** The safest order is:

1. Create the MeshCore Canada-owned GitHub App and Turnstile widget.
2. Deploy the proposal service from PR #39 to a MeshCore Canada production host.
3. Point `regions-api.meshcore.ca` at that host and prove the API, TLS, and CORS checks.
4. Merge PR #39.
5. Let the existing GitHub Pages workflow publish the editor from `main`.
6. Switch the service checkout to `main` and run one end-to-end test proposal.

The merge is required eventually because the live editor is published from
`main`, but it is not required to provision or test the backend. Deploying the
PR branch first prevents the live editor from pointing at an unavailable API.

## Production architecture

```text
Contributor
    |
    | opens the static editor
    v
https://meshcore.ca/config/editor/       MeshCore Canada GitHub Pages
    |
    | HTTPS submission; no GitHub login
    v
https://regions-api.meshcore.ca/...      MeshCore Canada DNS, Caddy, and host
    |
    | short-lived installation token
    v
MeshCore Canada GitHub App
    |
    v
MeshCore-ca/MeshCore-Canada issue
```

The local test appliance is not part of this path. Production must not depend
on a personal domain, personal account, home network, or contributor-owned
host. GitHub Pages remains the static front end; it cannot safely hold the App
private key or Turnstile secret, so the server-side service runs on a MeshCore
Canada host. See [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) for the static hosting model.

## Responsibilities

| Owner | One-time work |
| --- | --- |
| Mr. Alderson / MeshCore Canada admin | Choose the production host, create DNS, GitHub App, Turnstile widget, and protected secrets |
| MeshCore Canada host admin | Deploy the container, add the Caddy site block, verify TLS and health |
| PR author / maintainer | Keep PR #39 pointed only at `regions-api.meshcore.ca`, merge after backend verification, and run the browser test |

## 1. Choose the MeshCore Canada production host and DNS

Use a MeshCore Canada-managed Linux host with Docker Engine, Docker Compose,
Caddy, Git, and enough disk for the repository and generated region files. The
recommended placement is the existing production host that serves
`live.meshcore.ca`; the service is small and is limited to 384 MiB of memory and
one CPU in the supplied Compose file.

In the MeshCore Canada DNS account, create one record:

- Name: `regions-api`
- Type: `CNAME` to `live.meshcore.ca`, if using that production host; otherwise
  use an `A`/`AAAA` record for the chosen MeshCore Canada host.
- Proxying: direct DNS is sufficient; Caddy terminates HTTPS.

The final public endpoint is fixed in PR #39 as:

```text
https://regions-api.meshcore.ca/api/meshcore-regions/proposals
```

Do not point this hostname at the test appliance.

## 2. Create the organization-owned GitHub App

Open the [pre-filled MeshCore Canada GitHub App registration](https://github.com/organizations/MeshCore-ca/settings/apps/new?name=MeshCore%20Canada%20Region%20Proposals&description=Creates%20public%20review%20issues%20for%20validated%20region%20boundary%20proposals&url=https%3A%2F%2Fmeshcore.ca%2Fconfig%2Feditor%2F&public=false&issues=write&webhook_active=false) while signed in as an organization owner or GitHub App manager.

Confirm these settings before creating it:

- GitHub App name: `MeshCore Canada Region Proposals`
- Homepage URL: `https://meshcore.ca/config/editor/`
- Callback URL: blank
- Webhook: disabled
- Repository permission: **Issues — Read and write**
- Every other repository and organization permission: **No access**
- App availability: only the MeshCore Canada organization

GitHub always supplies metadata read access. The App does not need Contents,
Pull requests, Actions, Members, or Administration access.

After creation:

1. Record the **Client ID** from the App settings page.
2. Generate and securely download one private-key PEM.
3. Install the App on the `MeshCore-ca` organization.
4. Select **Only select repositories** and choose only `MeshCore-Canada`.
5. Record the numeric installation ID from the installation URL ending in
   `/settings/installations/<installation-id>`.

Official references:

- [Register a GitHub App](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app)
- [Manage GitHub App private keys](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/managing-private-keys-for-github-apps)
- [Install a GitHub App](https://docs.github.com/en/apps/using-github-apps/installing-your-own-github-app)
- [Generate an installation token](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)

## 3. Create the MeshCore Canada Turnstile widget

In a Cloudflare account controlled by MeshCore Canada, open the
[Turnstile dashboard](https://dash.cloudflare.com/?to=/:account/turnstile) and
create a widget with:

- Name: `MeshCore Canada Region Proposals`
- Widget mode: **Managed**
- Allowed hostnames: `meshcore.ca` and `config.meshcore.ca`
- Pre-clearance: disabled

Record the public **site key** and secret **secret key**. The browser receives
only the site key. The proposal service validates every token server-side and
checks the exact hostname and action. See Cloudflare's
[widget setup](https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/),
[hostname management](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/),
and [server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

## 4. Check out PR #39 on the production host

Use a dedicated checkout. If `/opt/meshcore-region-proposals` does not exist:

```sh
sudo git clone https://github.com/MeshCore-ca/MeshCore-Canada.git \
  /opt/meshcore-region-proposals
```

Fetch the exact pull request without merging it:

```sh
sudo git -C /opt/meshcore-region-proposals fetch origin \
  pull/39/head:pr-39-region-proposals
sudo git -C /opt/meshcore-region-proposals switch pr-39-region-proposals
sudo git -C /opt/meshcore-region-proposals status --short --branch
sudo git -C /opt/meshcore-region-proposals rev-parse HEAD
```

The checkout must be clean. Record the displayed commit SHA in the deployment
notes so the tested backend and reviewed PR are traceable.

## 5. Create protected host configuration

Prepare the state and secret locations. The container runs as UID/GID 10001.

```sh
sudo install -d -o 10001 -g 10001 -m 0700 \
  /var/lib/meshcore-region-proposals
sudo install -d -o root -g root -m 0700 \
  /etc/meshcore-region-proposals
sudo install -o root -g root -m 0600 \
  /opt/meshcore-region-proposals/tools/region-proposal-gateway/environment.example \
  /etc/meshcore-region-proposals/environment
sudoedit /etc/meshcore-region-proposals/environment
```

Replace the three placeholders in the environment file:

```text
TURNSTILE_SITE_KEY=<public site key>
GITHUB_APP_CLIENT_ID=<GitHub App client ID>
GITHUB_APP_INSTALLATION_ID=<numeric installation ID>
```

Do not place either secret in that environment file. Install the App PEM and
Turnstile secret as separate files:

```sh
sudo install -o 10001 -g 10001 -m 0600 \
  /secure/download/location/meshcore-region-proposals.private-key.pem \
  /etc/meshcore-region-proposals/github-app.pem
sudoedit /etc/meshcore-region-proposals/turnstile
sudo chown 10001:10001 /etc/meshcore-region-proposals/turnstile
sudo chmod 0600 /etc/meshcore-region-proposals/turnstile
```

Paste only the Turnstile secret into the second file. Do not send either secret
through Discord, GitHub, email, an issue, a commit, or a browser-side setting.

Verify metadata without printing secret contents:

```sh
sudo stat -c '%u:%g %a %n' \
  /etc/meshcore-region-proposals/github-app.pem \
  /etc/meshcore-region-proposals/turnstile
```

Both secret files must show `10001:10001 600`.

## 6. Build and start the proposal service

First confirm that the host clock is synchronized, loopback port 8787 is free,
and outbound HTTPS reaches GitHub and Turnstile. GitHub App JWTs are time-bound.

```sh
timedatectl show -p NTPSynchronized --value
sudo ss -ltnp '( sport = :8787 )'
curl -fsS -o /dev/null https://api.github.com/
curl -fsS -o /dev/null \
  https://challenges.cloudflare.com/turnstile/v0/api.js
```

The first command should print `yes`; the port check should print no listener.
Do not continue until an unexpected listener is understood.

```sh
cd /opt/meshcore-region-proposals/tools/region-proposal-gateway
sudo docker compose \
  --env-file /etc/meshcore-region-proposals/environment \
  -f compose.example.yml config
sudo docker compose \
  --env-file /etc/meshcore-region-proposals/environment \
  -f compose.example.yml up -d --build
sudo docker compose \
  --env-file /etc/meshcore-region-proposals/environment \
  -f compose.example.yml ps
curl -fsS http://127.0.0.1:8787/healthz
sudo docker stats --no-stream
```

Expected result: the Compose config resolves without warnings, the container is
healthy, and the loopback health request succeeds. If Caddy itself runs in a
container rather than as a host service, do not expose port 8787 publicly;
attach both containers to one private network and set `TRUSTED_PROXY_CIDRS` to
the exact Caddy container address before proceeding.

## 7. Add the production Caddy route

The repository file
`tools/region-proposal-gateway/Caddyfile.example` contains the complete site
block for `regions-api.meshcore.ca`. Import or merge it into the existing Caddy
configuration; do not overwrite unrelated MeshCore Canada sites.

For a normal host-installed Caddy service:

```sh
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Caddy should obtain the certificate automatically once DNS reaches the host and
ports 80 and 443 are available.

## 8. Prove the public service before merging

Run:

```sh
curl -fsS \
  https://regions-api.meshcore.ca/api/meshcore-regions/proposals/config

curl -si \
  -H 'Origin: https://meshcore.ca' \
  https://regions-api.meshcore.ca/api/meshcore-regions/proposals/config

curl -si -X OPTIONS \
  -H 'Origin: https://meshcore.ca' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type' \
  https://regions-api.meshcore.ca/api/meshcore-regions/proposals
```

Required evidence:

- HTTPS certificate is valid for `regions-api.meshcore.ca`.
- Config returns HTTP 200 and JSON containing version `1`, the public Turnstile
  site key, and action `region_proposal`.
- The allowed-origin response contains
  `Access-Control-Allow-Origin: https://meshcore.ca`.
- The preflight succeeds for `POST` and `content-type`.
- Repeating the config request with `Origin: https://example.invalid` is denied
  and does not return an allow-origin header.

Only after all checks pass should PR #39 be approved and merged.

## 9. Merge, publish, and switch the service to `main`

Merge [PR #39](https://github.com/MeshCore-ca/MeshCore-Canada/pull/39). The
existing `Deploy MkDocs site` workflow publishes `docs/` from `main` to the
`gh-pages` branch and serves it at `meshcore.ca`.

After the merge succeeds:

```sh
sudo git -C /opt/meshcore-region-proposals fetch origin
sudo git -C /opt/meshcore-region-proposals switch main
sudo git -C /opt/meshcore-region-proposals pull --ff-only origin main
cd /opt/meshcore-region-proposals/tools/region-proposal-gateway
sudo docker compose \
  --env-file /etc/meshcore-region-proposals/environment \
  -f compose.example.yml up -d --build
```

Verify these live URLs:

- `https://meshcore.ca/config/editor/`
- `https://regions-api.meshcore.ca/api/meshcore-regions/proposals/config`

The editor should say that no account is needed, load the anti-spam check, and
retain **Download proposal** as a fallback.

### Keep the service authority synchronized

For every future `main` change that modifies `docs/assets/regions`, update the
production checkout and verify `/healthz` as part of the same release. The
service reloads changed authority files atomically. If the website publishes a
new membership table before the host receives it, submissions fail closed as
stale rather than creating an issue from mismatched data.

## 10. Run one end-to-end production test

1. Open `https://meshcore.ca/config/editor/` in a signed-out/private browser.
2. Make one small, valid same-province draft change.
3. Use reason: `Production submission test — do not apply`.
4. Complete Turnstile and select **Submit for review**.
5. Confirm a public issue is created without GitHub login.
6. Confirm the issue is attributed to the GitHub App, contains the proposal
   hash and canonical data, and exposes no secret.
7. Close the test issue without applying the boundary change.

The issue is review-only. The service never edits repository contents and never
changes the live region layer by itself.

## Rollback and key rotation

- If the editor deployment has a problem, revert the PR on `main`; the existing
  Download proposal path remains available.
- If the service has a problem, stop only `region-proposal-gateway`; no current
  boundary or GitHub Pages content is modified.
- Back up `/var/lib/meshcore-region-proposals` before host migrations.
- Rotate a GitHub App key by adding the new PEM, restarting and testing the
  service, then deleting the old key in GitHub.
- Rotate the Turnstile secret in the dashboard and protected file together.
- Never reuse a personal access token or a broad automation token for this
  service.

## Completion checklist

- [ ] Production host is owned and administered by MeshCore Canada.
- [ ] `regions-api.meshcore.ca` resolves only to that host.
- [ ] GitHub App is organization-owned and installed only on `MeshCore-Canada`.
- [ ] GitHub App has Issues read/write and no Contents permission.
- [ ] Turnstile widget is in a MeshCore Canada-controlled account.
- [ ] PEM and Turnstile secret are absent from the repository and browser.
- [ ] Loopback health, public config, TLS, allowed CORS, and denied CORS pass.
- [ ] PR #39 is merged only after the backend proof.
- [ ] GitHub Pages deployment succeeds from `main`.
- [ ] Signed-out browser creates one test issue automatically.
- [ ] Test issue is closed without changing region authority.
