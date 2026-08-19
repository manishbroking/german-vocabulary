# Netlify production deployment

This project uses Netlify Database + Netlify Identity. Do not use **Publish deploy preview** to move a database preview to production.

## GitHub-connected Netlify site

1. Push this project to the GitHub repository connected to the Netlify site.
2. Commit and push to the site's production branch (normally `main`).
3. Let Netlify create a new **production deploy** from that branch.
4. Netlify will apply the migration in `netlify/database/migrations/` as part of the production deploy.
5. After the deploy succeeds, open the live site and create/login to a profile.
6. Practice a few words, refresh, log out/in, and verify that the profile data remains available.

## Important

- Do not delete `netlify/database/migrations/`.
- Do not remove `@netlify/database` or `drizzle-orm` from `package.json`.
- The `/api/profile` function stores data under the authenticated Netlify Identity user's ID, so profiles are isolated per account.
- Anonymous users continue using browser `localStorage`; signed-in users are synced to the database.

## Production check

After the production deploy, verify:

- Sign up works.
- Log in works.
- The account name/email appears in the header.
- The cloud sync indicator changes to synced.
- Vocabulary and stats survive a refresh.
- Logging into a different account does not show the first account's database data.
