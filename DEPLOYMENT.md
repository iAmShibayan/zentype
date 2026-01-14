# Deployment Guide for ZenType

The easiest and best way to deploy your Next.js application for free is using **Vercel** (the creators of Next.js).

## Option 1: Deploy via GitHub (Recommended)

1.  **Push your code to GitHub**:
    -   Create a new repository on [GitHub](https://github.com/new).
    -   Push your local code to this repository:
        ```bash
        git remote add origin https://github.com/YOUR_USERNAME/zentype.git
        git branch -M main
        git push -u origin main
        ```

2.  **Connect to Vercel**:
    -   Go to [Vercel.com](https://vercel.com/signup) and sign up/login.
    -   Click **"Add New..."** -> **"Project"**.
    -   Select **"Import"** next to your `zentype` repository.

3.  **Configure and Deploy**:
    -   Vercel will automatically detect that it's a Next.js app.
    -   Click **"Deploy"**.
    -   Wait (~1 minute) for the build to finish.
    -   You will get a live URL (e.g., `zentype.vercel.app`).

---

## Option 2: Deploy via CLI (Command Line)

If you don't want to use GitHub, you can deploy directly from your terminal.

1.  **Install Vercel CLI**:
    ```bash
    npm i -g vercel
    ```

2.  **Login**:
    ```bash
    vercel login
    ```

3.  **Deploy**:
    Run this command in your project folder:
    ```bash
    vercel
    ```
    -   Follow the prompts (Hit Enter for default settings).
    -   It will give you a "Preview" URL.
    -   To push to production, run: `vercel --prod`

## Free Tier Limits
-   Vercel's "Hobby" plan is free forever for personal projects.
-   Includes SSL (https), global CDN, and automatic deployments.
