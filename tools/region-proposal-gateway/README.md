# Anonymous region proposal service

This server-side service lets a contributor submit a validated boundary
proposal without a GitHub account. Production is designed to run on a MeshCore
Canada-managed Linux host at
`https://regions-api.meshcore.ca/api/meshcore-regions/proposals`. The static
editor, DNS, host, GitHub App, Turnstile widget, secrets, and issue repository
all remain under MeshCore Canada administration.

The service does **not** edit region data. It opens a fixed-format issue in
`MeshCore-ca/MeshCore-Canada` with the fixed `enhancement` label. Maintainers
still review and apply accepted changes through the repository workflow.

See the repository-root [`instructions.md`](../../instructions.md) for the
one-time administrator activation checklist and recommended merge order.

## Browser contract

The default base path is `/api/meshcore-regions/proposals`.

- `GET <base>/config` returns
  `{"version":1,"turnstileSiteKey":"...","turnstileAction":"region_proposal"}`.
- `POST <base>` accepts exactly
  `{"version":1,"proposal":{...},"turnstileToken":"...","website":""}`.
- Success returns
  `{"ok":true,"issueNumber":123,"issueUrl":"https://github.com/...","proposalSha256":"...","duplicate":false}`.

`website` is a honeypot and must be empty. POST requests require an exact
allowlisted `Origin`; there is no wildcard or credentialed CORS. A same-origin
config GET may omit `Origin`. The service handles strict OPTIONS preflights.

`proposalSha256` is the SHA-256 of UTF-8 JSON produced recursively with sorted
object keys, no ASCII escaping, and separators `,` and `:` with no trailing
newline. The browser verifies this exact value before displaying the issue.

## What is validated

On every request the service checks whether any mounted authority file changed
and reloads it atomically. Startup and reload fail closed unless:

- the catalog hierarchy is valid and every leaf has one jurisdiction;
- the membership CSV has unique DGUIDs and valid same-jurisdiction leaves;
- every `cells-<PRUID>.topo.json` file matches the membership table;
- every TopoJSON DGUID, PRUID, and `leaf_tag` agrees with membership;
- every catalog leaf has exactly one matching anchor;
- the proposal base hash and all `from` values are current;
- all target leaves are valid and in the same province or territory;
- no anchor moves; and
- request, proposal, and changed-cell limits are respected.

Contributor text is normalized to one line. Structural Markdown is escaped,
GitHub mentions are neutralized, and canonical JSON uses a dynamic code fence
that contributor text cannot close.

## GitHub App

The organization-owned App must have only:

- Repository permission: **Issues — Read and write**
- No Contents permission
- No webhook

Install it on **only** `MeshCore-ca/MeshCore-Canada`. The service signs a
short-lived RS256 JWT with `openssl`, requests an installation token restricted
again to that repository and `issues: write`, and verifies the returned scope.
No token or private key is sent to the browser.

There is no Contents API call or undocumented attachment API. Small proposals
are inline in the issue. Large proposals use deterministic gzip data split into
base64url issue-comment chunks. Retries resume only missing chunks.

## Turnstile and abuse controls

Create the Turnstile widget in a MeshCore Canada-controlled account for the
editor hostnames `meshcore.ca` and `config.meshcore.ca`. The service verifies
`success`, exact hostname, and action `region_proposal` at Siteverify. Tokens
are single-use and bounded to 2,048 characters.

The default verified limit is five attempts per IP per hour. Separate higher
pre-verification and global bounds prevent invalid tokens from creating
unlimited Siteverify traffic. Caddy is the only trusted proxy and is reached on
loopback. The service accepts exactly one forwarded client address from that
trusted peer; all other peers are treated as direct clients.

If the GitHub Pages editor later adds a Content-Security-Policy, it must allow
`https://challenges.cloudflare.com` in `script-src`, `frame-src`, and
`connect-src` while preserving all existing tile and geocoder hosts.

## Production deployment model

The supplied files assume:

- a MeshCore Canada-owned Linux host with Docker Engine and Compose;
- Caddy running directly on that host;
- DNS for `regions-api.meshcore.ca` pointing to the host;
- the repository checked out at `/opt/meshcore-region-proposals`;
- state at `/var/lib/meshcore-region-proposals`; and
- protected configuration at `/etc/meshcore-region-proposals`.

The host clock must be synchronized for GitHub App JWTs. Outbound HTTPS must
reach `api.github.com`, `challenges.cloudflare.com`, and Caddy's ACME provider.
Confirm that loopback port 8787 is unused before starting the service.

`compose.example.yml` is standalone. It uses Linux host networking so the
non-root container can bind `127.0.0.1:8787`, which is never exposed directly
to the Internet. `Caddyfile.example` is the public TLS entry point. The
container has a read-only root filesystem, dropped capabilities, resource and
log bounds, read-only authority/secret mounts, and one writable ledger mount.

Copy `environment.example` to the protected configuration directory and set
the public/non-secret IDs. Keep the Turnstile secret and GitHub App PEM as
separate mode-`0600` files owned by UID/GID 10001.

Typical lifecycle commands, run from
`/opt/meshcore-region-proposals/tools/region-proposal-gateway`, are:

```sh
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
```

Validate and reload Caddy only after the loopback health check passes. Then
verify the public configuration and exact CORS response:

```sh
curl -fsS \
  https://regions-api.meshcore.ca/api/meshcore-regions/proposals/config
curl -si \
  -H 'Origin: https://meshcore.ca' \
  https://regions-api.meshcore.ca/api/meshcore-regions/proposals/config
```

## Idempotency and ledger recovery

The canonical proposal hash is the idempotency key. The service signs
`mcc-region-proposal/v1:<hash>` with the GitHub App key and embeds that
signature beside the hash. Recovery accepts a search result only when both
markers match, preventing a public user from forging an idempotency match.

Before creating an issue, the service writes a durable `pending` ledger row.
After GitHub returns `201`, it stores the issue number and URL before posting
chunks. A retry with a `created` row resumes chunks. A retry with only a
`pending` row searches GitHub and fails closed if search has not indexed the
issue; it never blindly creates a second issue.

If an operator proves that a request failed before GitHub received it but left
a pending row, audit GitHub first for the proposal hash. Only after confirming
that no matching issue exists, stop the service, back up the ledger, and clear
that one pending hash:

```sh
cd /opt/meshcore-region-proposals/tools/region-proposal-gateway
sudo docker compose \
  --env-file /etc/meshcore-region-proposals/environment \
  -f compose.example.yml stop region-proposal-gateway
sudo cp -a /var/lib/meshcore-region-proposals \
  /var/lib/meshcore-region-proposals.audit-backup
sudo sqlite3 /var/lib/meshcore-region-proposals/proposals.sqlite3 \
  "SELECT proposal_sha256,state,issue_number,issue_url FROM proposals WHERE proposal_sha256='HASH';"
sudo sqlite3 /var/lib/meshcore-region-proposals/proposals.sqlite3 \
  "DELETE FROM proposals WHERE proposal_sha256='HASH' AND state='pending';"
sudo docker compose \
  --env-file /etc/meshcore-region-proposals/environment \
  -f compose.example.yml start region-proposal-gateway
```

Never delete a `created` row. Never clear `pending` merely because GitHub
search is briefly empty; search indexing is eventually consistent.

Keep the production checkout synchronized with every region-data release. The
service reloads changed authority files atomically and fails stale proposals
closed if the website and host temporarily have different membership data.

## Tests

No third-party Python packages or live credentials are needed:

```sh
python -m unittest discover -s tools/region-proposal-gateway/tests -v
```

The suite uses synthetic authority data and mocked Turnstile/GitHub transports.
It covers strict validation, authority reload, exact CORS/HTTP contracts,
Turnstile hostname/action checks, least-privilege token requests, idempotent
issue creation, URL validation, and resumable large-payload chunks.
