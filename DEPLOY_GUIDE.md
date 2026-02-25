# Deployment Guide: Vercel + Turso

Since you need a free solution for 25 people that works reliably, the best modern approach is to use **Vercel** (for hosting the website) and **Turso** (for the database).

This setup is free, persistent (data won't be deleted), and professional.

## Step 1: Set up Turso (Database)

1.  Go to [turso.tech](https://turso.tech) and sign up (it's free).
2.  Install the Turso CLI on your computer (or use their web dashboard if available).
    *   Mac: `brew install tursodatabase/tap/turso`
    *   Windows: `curl -sSf https://binstall.netlify.app/install | bash -s -- --repo tursodatabase/turso-cli`
3.  Login: `turso auth login`
4.  Create a database: `turso db create ib-questions`
5.  Get the Database URL: `turso db show ib-questions`
    *   Copy the URL (starts with `libsql://`).
6.  Create an Auth Token: `turso db tokens create ib-questions`
    *   Copy the token.

## Step 2: Configure Local Environment

1.  Create a `.env` file in your project root (if you haven't already).
2.  Add your Turso credentials:
    ```env
    TURSO_DATABASE_URL="libsql://your-db-name-org.turso.io"
    TURSO_AUTH_TOKEN="your-long-token-here"
    ```
3.  Run the seed script to set up the tables in the cloud:
    ```bash
    npx tsx scripts/seed.ts
    ```

## Step 3: Deploy to Vercel

1.  Go to [vercel.com](https://vercel.com) and sign up.
2.  Install Vercel CLI: `npm i -g vercel`
3.  Login: `vercel login`
4.  Deploy:
    ```bash
    vercel
    ```
5.  Follow the prompts:
    *   Set up and deploy? **Yes**
    *   Link to existing project? **No**
    *   Project name? **ib-question-bank**
    *   Directory? **./** (default)
    *   **IMPORTANT:** When it asks "Want to modify these settings?", say **No**.
6.  **Add Environment Variables to Vercel:**
    *   Go to the Vercel Dashboard -> Project Settings -> Environment Variables.
    *   Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` with the same values as your local `.env`.
    *   Redeploy (or run `vercel --prod` in your terminal).

## Summary

*   **Vercel** hosts your React frontend and Express backend.
*   **Turso** hosts your SQLite database in the cloud.
*   **Result:** A free, fast, persistent app for your 25 friends.
