# Deployment Options

You asked if the **adding feature** works on Netlify.

**Short Answer: No.**

**Long Answer:**
Netlify (and Vercel) are "serverless" platforms. This means they start a fresh server for every single request and destroy it immediately after.
*   **Current App:** Saves questions to a file (`questions.db`) on the server's hard drive.
*   **Netlify:** Wipes the hard drive after every request. Your new questions will disappear instantly.

## Recommended Free Options for 25 Users

Since you want to share this with ~25 friends for free, here are your best options:

### Option 1: Glitch.com (Easiest, No Code Changes)
Glitch is a friendly platform that keeps your files (including your database) forever.
*   **Pros:** Free, works with your current code immediately, no setup.
*   **Cons:** The app "sleeps" after 5 minutes of inactivity. The first person to visit will wait ~20 seconds for it to wake up.
*   **How to use:**
    1.  Go to [Glitch.com](https://glitch.com) and create an account.
    2.  Click **"New Project"** -> **"Import from GitHub"** (if you push this code to GitHub).
    3.  Or use **"glitch-hello-node"** and copy-paste your files.
    4.  It will just work.

### Option 2: Render.com + External Database (Best Performance)
If you want it to be fast and not sleep, you can use a free web host (like Render or Vercel) combined with a free cloud database.
*   **Pros:** Fast, professional, data is safe in the cloud.
*   **Cons:** Requires changing the code to use a cloud database instead of a local file.
*   **Recommended Stack:**
    *   **Frontend/Backend:** Vercel or Netlify
    *   **Database:** **Turso** (LibSQL) or **Neon** (Postgres) - both have generous free tiers.

### Option 3: Fly.io (Professional SQLite)
Fly.io allows you to run "real" servers that have persistent hard drives (Volumes).
*   **Pros:** Works with your current SQLite database, very fast.
*   **Cons:** Requires installing a command-line tool (`flyctl`) and adding a credit card (even for the free tier) to verify identity.

---

## Recommendation
For a school project or a small group of friends: **Use Glitch.com**. It's the simplest way to get a persistent database running for free without changing any code.
