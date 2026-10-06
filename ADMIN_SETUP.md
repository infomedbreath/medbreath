# Admin panel setup

The admin dashboard lives at `/admin`. It needs four things before it works:

1. A signed session secret
2. One or more admin accounts (email + password hash)
3. A Cloudflare D1 database for content
4. A Cloudflare R2 bucket for uploaded and replaced images

Without steps 3 and 4 the panel still runs, but it is **read-only** and shows a
"Local JSON" badge on the overview. That is by design: it lets you try the panel
on localhost before touching your Cloudflare account.

---

## 1. Generate the secrets

You need two values. Generate them with any password manager or:

```bash
# session secret - any random string of 32+ characters
openssl rand -base64 32

# password hash - replace the two values below
node -e "const c=require('crypto');const i=210000,s=c.randomBytes(16).toString('base64url');console.log('pbkdf2.'+i+'.'+s+'.'+c.pbkdf2Sync(process.argv[1],s,i,32,'sha256').toString('base64url'))" 'YOUR-PASSWORD-HERE'
```

Copy the output of the second command, then set these in `.env.local` for local
development, or as encrypted environment variables in Cloudflare:

```bash
ADMIN_SESSION_SECRET=<the 32+ character string>
ADMIN_USERS=you@gmail.com:pbkdf2.210000.<salt>.<hash>
```

> **Do not use `$` as a separator.** Next.js truncates `.env` values at `$`, so
> `pbkdf2$210000$...` silently becomes `pbkdf2` and every login fails. The format
> above uses `.`, which `base64url` never contains.

Notes:

- Only paste the **hash**, never the password itself.
- Passwords need 10+ characters. PBKDF2-SHA256 at 210,000 iterations is used.
- `ADMIN_USERS` accepts a comma-separated list, so you can have several admins:
  `ADMIN_USERS=a@x.com:pbkdf2....,b@y.com:pbkdf2....`
- To rotate a password without locking anyone out, append a second hash with
  `|`: `a@x.com:pbkdf2.old:pbkdf2.new`. Any of the listed hashes will sign in.

### Changing a password later

Open **Admin → Settings → Password**. It verifies your current password and
generates the new hash for you. Copy the displayed `ADMIN_USERS=...` line into
your environment and redeploy. The panel cannot write to its own environment
variables.

---

## 2. Create the D1 database (content)

In the Cloudflare dashboard, or with Wrangler:

```bash
npx wrangler d1 create medbreath
```

Copy the `database_id` from the output. Then set:

```bash
CLOUDFLARE_ACCOUNT_ID=<your account id>
CLOUDFLARE_D1_DATABASE_ID=<the database_id>
CLOUDFLARE_API_TOKEN=<token with D1 edit permission>
```

The table is created automatically on first write:

```sql
CREATE TABLE IF NOT EXISTS collections (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TEXT
);
```

After the first deploy, open **Admin → Settings → Database** and press
**Seed database from JSON files**. This copies your existing 33 products, 44
articles and 5 categories into D1 so they become editable. It never overwrites
collections that already have data.

---

## 3. Create the R2 bucket (images)

```bash
npx wrangler r2 bucket create medbreath-images
```

Then create an API token pair with Object Read & Write permission for that
bucket and set:

```bash
CLOUDFLARE_R2_BUCKET=medbreath-images
CLOUDFLARE_R2_ACCESS_KEY_ID=<access key id>
CLOUDFLARE_R2_SECRET_ACCESS_KEY=<secret access key>
```

R2 is reached over its S3-compatible API, so the two `..._ACCESS_KEY_...`
values are R2 API tokens (Cloudflare dashboard → R2 → Manage API tokens), not
your main Cloudflare API token.

---

## 4. Serving images from R2

Uploaded and replaced images are stored in R2, but they are addressed with a
normal `/images/...` path, so the pages do not change. You need those paths to
resolve to the bucket. Either:

- **Bind the bucket to your Worker/Pages function** and serve `public/` assets
  from R2, or
- Put Cloudflare in front and map `medbreath.co/images/*` to the bucket.

Until that mapping exists, R2 uploads will succeed but the images will not be
visible on the site. The **Local disk** mode needs no mapping at all, which is
the quickest way to test the panel.

---

## Environment variable reference

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_SESSION_SECRET` | yes | HMAC key for the session cookie. 32+ chars. |
| `ADMIN_USERS` | yes | Comma-separated `email:hash` admin list. |
| `CLOUDFLARE_ACCOUNT_ID` | for D1 | Cloudflare account id. |
| `CLOUDFLARE_D1_DATABASE_ID` | for D1 | D1 database id. |
| `CLOUDFLARE_API_TOKEN` | for D1 | Token with D1 edit permission. |
| `CLOUDFLARE_R2_BUCKET` | for R2 | R2 bucket name. |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | for R2 | R2 API token id. |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | for R2 | R2 API token secret. |

Without the Cloudflare variables the panel runs read-only and uploads land in
`public/uploads/`.

---

## Security notes

- The session cookie is `httpOnly`, `sameSite=lax` and `secure` in production,
  and expires after 7 days.
- Passwords are PBKDF2-SHA256 hashed and never stored in the database or repo.
- `src/proxy.ts` verifies the session before any admin page renders, and each
  admin page calls `requireAdmin()` again, since layouts do not re-run on
  client-side navigation.
- `/admin` sends `X-Robots-Tag: noindex, nofollow` and is disallowed in
  `robots.txt`.
- Replaced images are validated by parsing their header, so a renamed text or
  HTML file cannot be written over an image.

---

## What lives where

| Concern | File |
| --- | --- |
| D1 read/write, local fallback | `src/lib/content-store.ts` |
| Password hashing, session signing | `src/lib/session-core.ts` |
| Session cookie handling | `src/lib/admin-auth.ts` |
| R2 upload/replace, size probing | `src/lib/image-store.ts` |
| Shared size formatting | `src/lib/image-meta.ts` |
| Which page uses which image | `src/lib/image-usage.ts` |
| Site settings | `src/lib/settings-store.ts` |
| Route guard | `src/proxy.ts` |