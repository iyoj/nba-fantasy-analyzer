# NBA Fantasy 9-Cat Analyzer 🏀

A web app to build and analyze your fantasy basketball team across all 9 categories.

---

## 🚀 DEPLOYMENT GUIDE (Step-by-Step for Beginners)

This guide will walk you through deploying your app to Vercel (free hosting) so you can share it with your league mates!

### Prerequisites

You'll need:
1. A **GitHub account** (free) - [Sign up here](https://github.com/signup)
2. A **Vercel account** (free) - [Sign up here](https://vercel.com/signup) (use "Continue with GitHub")
3. A **balldontlie.io API key** (free) - [Get one here](https://www.balldontlie.io/)

---

## 📋 STEP 1: Create a GitHub Account (Skip if you have one)

1. Go to [github.com/signup](https://github.com/signup)
2. Enter your email, create a password, and choose a username
3. Verify your email address

---

## 📋 STEP 2: Get Your API Key from balldontlie.io

1. Go to [balldontlie.io](https://www.balldontlie.io/)
2. Click "Get Started" or "Sign Up"
3. Create an account (free tier is fine)
4. Once logged in, find your API key in your dashboard
5. **Copy and save your API key somewhere safe** - you'll need it in Step 6!

---

## 📋 STEP 3: Create a New Repository on GitHub

1. Log into GitHub
2. Click the **+** icon in the top right corner
3. Click **"New repository"**
4. Fill in:
   - **Repository name:** `nba-fantasy-analyzer` (or whatever you want)
   - **Description:** (optional) "NBA Fantasy 9-Cat Team Analyzer"
   - Select **"Public"** (required for free Vercel hosting)
   - ✅ Check **"Add a README file"**
5. Click **"Create repository"**

---

## 📋 STEP 4: Upload the Project Files to GitHub

### Option A: Using GitHub's Web Interface (Easier for beginners)

1. In your new repository, click **"Add file"** → **"Upload files"**
2. Download the project files I've created (see below)
3. Drag and drop ALL the files into the upload area
4. Scroll down and click **"Commit changes"**

**Important:** You need to maintain the folder structure! The files should be organized like this:
```
├── package.json
├── next.config.js
├── app/
│   ├── layout.js
│   ├── globals.css
│   ├── page.js
│   └── api/
│       └── nba/
│           ├── players/
│           │   └── route.js
│           └── stats/
│               └── route.js
```

### Option B: Using Git Command Line (If you're comfortable with terminal)

```bash
# Clone your new repository
git clone https://github.com/YOUR_USERNAME/nba-fantasy-analyzer.git
cd nba-fantasy-analyzer

# Copy all the project files into this folder (maintaining the structure above)
# Then:
git add .
git commit -m "Initial commit - NBA Fantasy Analyzer"
git push origin main
```

---

## 📋 STEP 5: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and log in (use "Continue with GitHub")
2. Click **"Add New..."** → **"Project"**
3. Find your `nba-fantasy-analyzer` repository in the list
4. Click **"Import"**
5. On the "Configure Project" page:
   - **Framework Preset:** Should auto-detect as "Next.js" ✓
   - Leave other settings as default
6. Click **"Deploy"**
7. Wait 1-2 minutes for the build to complete

---

## 📋 STEP 6: Add Your API Key (IMPORTANT!)

The app won't fetch live data without this step!

1. In your Vercel project dashboard, click **"Settings"** (top menu)
2. Click **"Environment Variables"** (left sidebar)
3. Add a new variable:
   - **Key:** `BALLDONTLIE_API_KEY`
   - **Value:** Paste your API key from Step 2
   - **Environment:** Leave all checkboxes checked (Production, Preview, Development)
4. Click **"Save"**
5. Go to **"Deployments"** (top menu)
6. Click the **"..."** menu on your latest deployment
7. Click **"Redeploy"** → **"Redeploy"** (this applies the new environment variable)

---

## 📋 STEP 7: Share With Your League!

1. Once redeployed, go to your project dashboard
2. Your app URL will be something like: `https://nba-fantasy-analyzer.vercel.app`
3. **Share this URL with your league mates!** 🎉

---

## 🔧 Troubleshooting

### "Demo Mode" is showing instead of "Live Data"
- Make sure you completed Step 6 (adding the API key)
- Make sure you redeployed after adding the environment variable
- Check that the API key is correct (no extra spaces)

### Build Failed
- Check that all files are uploaded correctly
- Make sure the folder structure matches the layout shown above
- Look at the build logs in Vercel for specific errors

### API Errors
- The balldontlie.io free tier has rate limits (60 requests/minute)
- If too many people use it at once, it may temporarily fail
- The app will automatically fall back to demo mode if the API fails

---

## 💡 Features

- **Search any NBA player** and add them to your team
- **9-Category Analysis:** PTS, REB, AST, STL, BLK, 3PM, FG%, FT%, TO
- **Team Grades:** See your strengths and weaknesses
- **Works with 60+ players in demo mode** if API is unavailable

---

## 🔄 Updating the App

If you want to make changes:

1. Edit files in your GitHub repository
2. Vercel will automatically detect changes and redeploy!

---

## 📞 Need Help?

If you get stuck, the most common issues are:
1. **Folder structure is wrong** - Make sure `app/` folder exists with all the files inside
2. **API key not set** - Double-check Step 6
3. **Didn't redeploy** - You must redeploy after adding environment variables

---

## 📁 Project Structure

```
nba-fantasy-analyzer/
├── package.json           # Project dependencies
├── next.config.js         # Next.js configuration
└── app/
    ├── layout.js          # Root HTML layout
    ├── globals.css        # Global styles
    ├── page.js            # Main app component
    └── api/
        └── nba/
            ├── players/
            │   └── route.js   # API: Search players
            └── stats/
                └── route.js   # API: Get player stats
```

---

Made with ❤️ for fantasy basketball enthusiasts!
