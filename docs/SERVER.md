# Server and database guide

How the live site at https://www.winteriorsdecor.com runs, where its settings and data are, and how to change them safely. No secrets are stored in this file. By company decision, the repo's `.env` holds the same values as the server's settings file.

## At a glance

| What | Where |
|---|---|
| Server | GoDaddy VPS, Ubuntu 24.04, `184.168.126.18` (Singapore), user `winterior` |
| App | Node SSR build run by PM2, process name `winteriors-ssr`, listening on port 3000 behind nginx |
| Code on the server | `~/deploy/winteriors-decor-remix` (a git checkout of `main`) |
| App settings | `~/.config/winteriors/app.env` (outside the repo; deploys never touch it) |
| Database | PostgreSQL 18 on the same server, database `winteriors`, user `winteriors_app`, `127.0.0.1:5432` only |
| Database password | `~/.config/winteriors/db.pass` and `~/.pgpass` (readable by `winterior` only) |
| Backups | `~/backups/winteriors-YYYY-MM-DD.dump`, nightly at 02:00 UTC, kept 14 days |
| Deploys | Merge to `main` → GitHub Actions `.github/workflows/deploy.yml` → SSH to the server |

## Logging in

Use an SSH key, not a password. Ask an existing admin to add your public key to `~/.ssh/authorized_keys`, then:

```sh
ssh winterior@184.168.126.18
```

If nobody can log in, the GoDaddy account that owns the VPS has a browser console and a password reset.

## App settings

The app reads its settings from `~/.config/winteriors/app.env`. PM2 starts it with
`--node-args="--env-file=/home/winterior/.config/winteriors/app.env"`.
The setting names are listed in `.env.example` in the repo.

To change a setting:

```sh
nano ~/.config/winteriors/app.env
pm2 restart winteriors-ssr
```

The repo's `.env` is a committed copy of the server's active settings (company decision). The server does **not** read it, so deploys can never change the live settings. When you change a setting on the server, update `.env` in the repo to match.

The repository is public, so everything in `.env` is visible to anyone. The database only accepts connections from the server itself, which limits the use of its password; API keys in `.env` can be used by anyone and should be restricted in their provider's console.

For local development, put your own values in `.env.local` (git-ignored); it overrides `.env`.

Check which database the app will use (password hidden):

```sh
cd ~/deploy/winteriors-decor-remix
node --env-file=$HOME/.config/winteriors/app.env -e 'const u=process.env.DB_Connection||process.env.DATABASE_URL||"NOT SET"; console.log(u.replace(/:\/\/([^:]+):[^@]+@/,"://$1:****@"))'
```

## Database

```sh
# open a SQL prompt (password comes from ~/.pgpass)
psql -h 127.0.0.1 -U winteriors_app -d winteriors

# who is connected right now (load a page first; idle connections close after 30 s)
sudo -u postgres psql -c "select usename, datname, client_addr, state from pg_stat_activity where datname='winteriors';"
```

PostgreSQL listens on `127.0.0.1` only. Do not open port 5432 in any firewall. To reach the database from your own computer, use an SSH tunnel and connect to `localhost:5433`:

```sh
ssh -L 5433:127.0.0.1:5432 winterior@184.168.126.18
```

## Backups

Cron (`crontab -l`) runs `~/backups/backup-db.sh` every night at 02:00 UTC. Errors go to `~/backups/backup-errors.log`.

```sh
ls -lh ~/backups/                   # one file per day
~/backups/backup-db.sh              # take a backup now
```

Copy a backup off the server regularly; a backup kept only on the server is lost with the server:

```sh
scp winterior@184.168.126.18:backups/winteriors-YYYY-MM-DD.dump D:\backups\
```

Restore a backup into a fresh database (this replaces all data; take a backup first):

```sh
sudo -u postgres dropdb winteriors
sudo -u postgres createdb -O winteriors_app winteriors
pg_restore -h 127.0.0.1 -U winteriors_app -d winteriors --no-owner --no-acl ~/backups/winteriors-YYYY-MM-DD.dump
pm2 restart winteriors-ssr
```

## Deploys

Merging to `main` runs `.github/workflows/deploy.yml`: it builds on GitHub, then on the server runs `git pull`, `npm ci`, `npm run build` and `pm2 restart winteriors-ssr`.

A green run is not proof the site updated: the server script does not stop on errors. After a deploy, check the "Deploy to VPS via SSH" step's log for `Aborting` or `npm error`, and load the site.

Do not edit tracked files on the server: `git pull` then aborts and the old code keeps running.

## Changing the database structure

The database does not change when code is deployed. For a new table or column:

1. Write the change as a SQL file in the repo, e.g. `db/migrations/2026-12-01_add_project_location.sql`. Prefer additive changes (new nullable columns) so the running code keeps working.
2. Apply it to your local database and test.
3. Before merging: back up production (`~/backups/backup-db.sh`), then apply the SQL on the server with `psql -h 127.0.0.1 -U winteriors_app -d winteriors -f <file>`.
4. Merge; the deploy ships code that expects the new structure.

Never rename or drop a column in the same deploy as the code that stops using it.

## Local development

1. Install PostgreSQL 18 and create a database: `createdb -U postgres winteriors`.
2. Restore a backup (ask an admin for a recent one; it contains customer enquiries, so keep it private and never commit it):
   `pg_restore -U postgres -d winteriors --no-owner --no-acl <file>.dump`
3. Copy `.env.example` to `.env.local` and adjust the values.
4. `npm install` then `npm run dev` (http://localhost:8080).

Local work never touches the live database.

## Handover checklist

- At least two people can log in to the server, the GoDaddy account and the GitHub repo (admin).
- Passwords and keys are in the company password manager, not in chats or personal notes: server login, database password (`~/.config/winteriors/db.pass`), `GOOGLE_API_KEY`, SMTP2GO account, GoDaddy, GitHub.
- People who leave have their SSH key removed from `~/.ssh/authorized_keys`.
