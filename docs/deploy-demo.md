# Deploy the static demo

The Vite playground in `apps/playground` is built by
`.github/workflows/deploy-demo.yml` on every push to `production` (or a manual
run selected on that branch). It runs checks and browser tests, uploads only the
static build to the VPS, then atomically switches the Nginx document root to the
new release. npm publishing remains manual and separate.

## One-time server and DNS setup

This follows the VPS/Nginx setup used by `aliaref.dev`. Point the DNS A record
for `afghanistan-province-chart.aliaref.dev` to the same VPS. Use a dedicated,
unprivileged deploy user with SSH access. On the VPS, create
`/var/www/afghanistan-province-chart.aliaref.dev/releases` and grant that user
write access to the site directory and its `releases` subdirectory. Nginx must
be able to traverse those directories and read the published files. Do not put
unrelated files in this directory; each release is a separate folder.
Install `rsync` on the VPS; the deploy user needs `mkdir`, `ln` and `mv` as
well. Keep `current` as a symlink (not a regular directory) for atomic updates.

Create `/etc/nginx/conf.d/afghanistan-province-chart.aliaref.dev.conf`:

```nginx
server {
    listen 80;
    server_name afghanistan-province-chart.aliaref.dev;
    root /var/www/afghanistan-province-chart.aliaref.dev/current;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

After the first deployment creates `current`, run `sudo nginx -t` and reload
Nginx. Issue a certificate with
`sudo certbot --nginx -d afghanistan-province-chart.aliaref.dev` and enable the
HTTPS redirect. If using Cloudflare proxying, choose **Full (strict)** after the
origin certificate is working. Confirm `/`, `/prs/`, `/ps/` and a built asset
load over HTTPS. The site is a multi-page static build, not an SPA rewrite.

## GitHub configuration

Create a `demo-production` environment under **Settings → Environments** and
restrict it to the `production` branch. Add environment secrets (repository
secrets also work):

| Secret                | Value                                            |
| --------------------- | ------------------------------------------------ |
| `VPS_HOST`            | VPS hostname or IP                               |
| `VPS_USER`            | unprivileged deploy SSH user                     |
| `VPS_PORT`            | SSH port (optional; defaults to 22)              |
| `VPS_SSH_PRIVATE_KEY` | private key for that user's authorized SSH key   |
| `VPS_SSH_KNOWN_HOSTS` | verified SSH host-key line for the host and port |

Generate a dedicated Ed25519 key pair and install **only the public key** in
the deploy user's `~/.ssh/authorized_keys`. Obtain the host key with
`ssh-keyscan -p PORT HOST`, but verify its fingerprint through a trusted channel
before saving the line in `VPS_SSH_KNOWN_HOSTS`. For a non-default SSH port,
the known-hosts entry must use `[HOST]:PORT`. Never commit private keys.

Push the workflow to `production` to enable automatic deployment. The deploy
job requires a passing build and browser test run. It uploads to a numbered
release folder and switches `current` only once all files arrive. A failed
upload leaves the prior site in place; old release folders remain for manual
cleanup or rollback. To roll back, atomically replace `current` with a symlink
to a previously verified release. Avoid removing a release still referenced by
`current`. Nginx does not need a reload for later releases.
