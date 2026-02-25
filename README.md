# IB Question Bank & Flashcards

This is a full-stack application for practicing IB questions and flashcards, built with React, Express, and SQLite.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

## Setup Instructions

1.  **Download the code** to your local machine.

2.  **Install dependencies**:
    Open a terminal in the project directory and run:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Copy the example environment file to a new file named `.env`:
    ```bash
    cp .env.example .env
    ```
    You don't strictly need to edit it for local development unless you are using specific features, but it's good practice.

4.  **Seed the Database** (Optional):
    To start with some sample questions, run:
    ```bash
    npx tsx scripts/seed.ts
    ```
    This will create a `questions.db` file in your root directory.

## Running the Application

### Development Mode
To run the application in development mode (with hot reloading):

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Mode
To build and run the application as it would look in production:

1.  Build the frontend:
    ```bash
    npm run build
    ```

2.  Start the server in production mode:
    ```bash
    NODE_ENV=production npx tsx server.ts
    ```

## Admin Access

To add or edit questions/flashcards, go to `/admin`.
The default password is: **password01#**

## Troubleshooting

### SqliteError: database disk image is malformed

If you see this error when starting the server locally, it means the `questions.db` file is corrupted or incompatible with your local system.

**Solution:**
1.  Delete the `questions.db` file in your project root directory.
2.  Run the seed script again to recreate it:
    ```bash
    npx tsx scripts/seed.ts
    ```
3.  Start the server again:
    ```bash
    npm run dev
    ```
