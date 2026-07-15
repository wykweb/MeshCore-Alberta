# Anonymous region proposal gateway

This is the small server-side component that lets a contributor submit a
validated editor proposal without a GitHub account. It is designed for the Pi
behind `canadaverse.org` and uses only the Python standard library plus the
`openssl` executable.

The gateway does **not** edit region data. It opens a fixed-format issue in
`MeshCore-ca/MeshCore-Canada` with the fixed `enhancement` label. Maintainers
still review and apply accepted changes through the repository workflow.

## Browser contract

The default base path is `/api/meshcore-regions/proposals`.

- `GET <base>/config` returns
  `{"version":1,"turnstileSiteKey":"...","turnstileAction":"region_proposal"}`.
- `POST <base>` accepts exactly
  `{"version":1,"proposal":{...},"turnstileToken":"...","website":""}`.
- Success returns
  `{"ok":true,"issueNumber":123,"issueUrl":"https://github.com/...","proposalSha256":"...","duplicate":false}`.

`website` is a honeypot and must be the empty string. POST requests require an
exact allowlisted `Origin`; there is no wildcard or credentialed CORS. A
same-origin config GET may omit `Origin`. The service handles strict OPTIONS
preflights.

`proposalSha256` is the SHA-256 of UTF-8 JSON produced recursively with sorted
object keys, no ASCII escaping, and separators `,` and `:` (no trailing
newline). This gives the browser an exact value to verify before it displays the
created issue.

## What is validated

On every request the gateway checks whether any mounted authority file changed.
It reloads atomically when file name, size, nanosecond mtime, or inode changes.
The current membership CSV is hashed again during reload.

Startup and reload both fail closed unless all of the following hold:

- the catalog hierarchy is valid and every leaf has one jurisdiction;
- the membership CSV has unique DGUIDs and only valid same-jurisdiction leaves;
- the complete set of `cells-<PRUID>.topo.json` files matches membership;
- every TopoJSON DGUID, PRUID, and `leaf_tag` agrees with membership;
- every catalog leaf has exactly one matching `seed_tag` anchor;
- the proposal base hash is current, all `from` values are current, targets are
  valid same-province leaves, and no anchor is moved;
- a proposal changes one province, contains no duplicate/no-op cells, contains
  at most 25,000 changes, and the complete HTTP body is at most 2 MiB.

Contributor text is normalized to one line. Structural Markdown is escaped,
GitHub mentions are neutralized, and the exact canonical JSON uses a dynamic
code fence that user text cannot close.

## GitHub App setup

Create a GitHub App owned by the organization with only:

- Repository permission: **Issues — Read and write**
- No Contents permission
- No webhook required

Install it on **only** `MeshCore-ca/MeshCore-Canada`. Record its client ID and
installation ID, and download a private key. The gateway signs a short-lived
RS256 JWT (`iat` 60 seconds in the past, `exp` nine minutes in the future) with
`openssl`. It asks GitHub for an installation token restricted again to the
single repository and `issues: write`, then verifies the returned repository
and permission scope before using it. API requests use GitHub's
`2026-03-10` version header. No token or private key is sent to the browser.

There is no Contents API call and no undocumented attachment API. Small
canonical proposals are inline in the issue. Large proposals are deterministic
gzip data split into base64url issue-comment chunks (padding omitted). On a
retry, existing chunks are listed and only missing chunks are posted, with at
least one second between comment writes.

## Turnstile and abuse controls

Create a Cloudflare Turnstile widget for the exact production hostnames. The
backend verifies `success`, exact `hostname`, and action `region_proposal` at
Siteverify. Tokens longer than 2,048 characters are rejected. The primary
per-IP limit defaults to five successful-human-verification attempts per hour;
failed Turnstile tokens do not consume that low shared-NAT quota. A separate
higher pre-verification bound defaults to 30 attempts per IP per five minutes,
plus 300 total attempts per minute, so invalid tokens cannot cause unlimited
Siteverify traffic.

The gateway trusts forwarding headers only when its TCP peer is inside
`TRUSTED_PROXY_CIDRS`, which must contain private/loopback networks. The live
cloudflared container uses host networking; its connections reach Caddy from
the Pi's own `192.168.0.111` address. The Caddy route accepts the proposal API
only from that fixed local peer, rejects other LAN clients, deletes any
browser-supplied `X-Forwarded-For`, and replaces it with Cloudflare's verified
`CF-Connecting-IP`. If the tunnel networking changes, verify and update that
peer matcher before reloading Caddy. In the current Pi layout Caddy runs inside
`splashpage`, so the compose override adds a dedicated internal network where
it reaches `region-proposal-gateway:8787`; `127.0.0.1:8787` would incorrectly
point back to the Caddy container itself.
The gateway is not attached to the general `tunnel` network. A separate bridge
provides outbound GitHub/Turnstile access, and only the fixed Caddy `/32` is
trusted to supply one overwritten forwarding address (chains are rejected).

Turnstile also requires the editor CSP to include
`https://challenges.cloudflare.com` in **script-src**, **frame-src**, and
**connect-src**. Edit the existing global CSP line to add those hosts. Do not
add a second CSP header, and do not drop the existing tile/geocoder hosts.

## Pi deployment

Copy this directory to
`/home/neonx/splashpage/region-proposal-gateway`, beside the existing
splashpage paths, then prepare state and secret files. The container runs as UID/GID 10001 and rejects secret files
that are symlinks or readable/writable by group or other users.

```sh
mkdir -p secrets region-proposal-state
printf '%s' 'TURNSTILE-SECRET-HERE' > secrets/turnstile
cp /safe/download/location/meshcore-region-app.private-key.pem secrets/github-app.pem
sudo chown -R 10001:10001 secrets region-proposal-state
chmod 600 secrets/turnstile secrets/github-app.pem
chmod 700 secrets region-proposal-state
docker compose -f docker-compose.yml -f region-proposal-gateway/compose.example.yml build region-proposal-gateway
docker compose -f docker-compose.yml -f region-proposal-gateway/compose.example.yml up -d region-proposal-gateway splashpage
docker compose -f docker-compose.yml -f region-proposal-gateway/compose.example.yml ps
docker compose -f docker-compose.yml -f region-proposal-gateway/compose.example.yml exec region-proposal-gateway \
  python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8787/healthz', timeout=3).read()"
```

The example mounts the current Pi layout:

- `./debug/meshcore-regions/assets` for membership and catalog;
- `./region-editor-data` for the per-province TopoJSON files;
- `./region-proposal-state` as the writable SQLite ledger.

The override paths are relative to `/home/neonx/splashpage`, because the main
compose file is listed first. Alternatively, merge the example service into
that main compose file. Adjust only the host sides of mounts if the live
directories differ. Authority mounts and secret mounts stay read-only. The container root
filesystem is read-only and all Linux capabilities are dropped.

## Idempotency and ledger recovery

The canonical proposal hash is the idempotency key. The gateway signs
`mcc-region-proposal/v1:<hash>` with the GitHub App RSA key and embeds that
RS256 signature beside the hash. Recovery accepts a search result only when
both markers match, so a public user cannot counterfeit an idempotency issue.
Before creating an issue, the gateway searches for those fixed markers and writes a durable `pending`
ledger row. Immediately after GitHub returns `201`, it stores the exact issue
number and URL before posting any chunks. A retry with a `created` row resumes
chunks. A retry with only a `pending` row searches GitHub and fails closed if
search has not found the issue yet; it never blindly creates a second issue.

If a request definitely failed **before** GitHub received the create call but
left a pending row (for example, an operator-confirmed local network failure),
audit GitHub first for the proposal hash shown to the contributor. Only after
confirming no matching issue exists, stop the container, back up the ledger,
and clear that one hash:

```sh
docker compose -f docker-compose.yml -f region-proposal-gateway/compose.example.yml stop region-proposal-gateway
cp -a region-proposal-state region-proposal-state.audit-backup
sqlite3 region-proposal-state/proposals.sqlite3 \
  "SELECT proposal_sha256,state,issue_number,issue_url FROM proposals WHERE proposal_sha256='HASH';"
sqlite3 region-proposal-state/proposals.sqlite3 \
  "DELETE FROM proposals WHERE proposal_sha256='HASH' AND state='pending';"
docker compose -f docker-compose.yml -f region-proposal-gateway/compose.example.yml start region-proposal-gateway
```

Never delete a `created` row. Never clear `pending` merely because GitHub search
is briefly empty; search indexing is eventually consistent.

## Tests

No third-party packages or live credentials are needed:

```sh
python -m unittest discover -s tools/region-proposal-gateway/tests -v
```

The suite uses synthetic authority data and mocked Turnstile/GitHub transports.
It covers strict validation, authority reload, exact CORS/HTTP contracts,
Turnstile hostname/action checks, least-privilege token requests, idempotent
issue creation, URL validation, and resumable large-payload chunks.

The HTTP server uses a 15-second socket read timeout, closes every response,
bounds worker threads and rate-limit keys, and the compose example also caps
PIDs, memory, CPU, and Linux capabilities.
