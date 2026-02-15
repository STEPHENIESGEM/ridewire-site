# RideWire Homepage & Demo Assets

**Autopilot Control Panel for ridewire.tech**

This repository serves as the single source of truth for RideWire's homepage, demo assets, and deployment workflow. All changes flow through GitHub → WordPress/Hostinger via automated deployment.

## Directory Structure

```
ridewire-site/
├── README.md                    # This file
├── .github/
│   ├── workflows/
│   │   └── deploy.yml          # Auto-deploy workflow on push to main
│   └── ISSUE_TEMPLATE/
│       └── homepage-update.md  # Template for homepage changes
├── demo/
│   ├── README.md               # Demo update instructions
│   ├── script.md               # 30-60s demo script
│   ├── ridewire-demo.mp4       # Current static demo (MP4)
│   └── youtube-video-id.txt    # YouTube video ID for embed
└── sections/
    ├── hero.html               # Hero + CTAs
    ├── demo-static.html        # Option A: Autoplay MP4 section
    └── demo-youtube.html       # Option C: YouTube embed section
```

## Deployment Workflow

### Making Changes

1. **Identify the Change**  
   - Open a GitHub Issue with `homepage` label
   - Describe: goal, scope, expected outcome

2. **Edit in GitHub**  
   - Click the file in `sections/` folder
   - Click edit (pencil icon)
   - Make the change
   - Commit with clear message: `feat(homepage): [change description]`

3. **Deploy Automatically**  
   - GitHub Actions pulls the latest code to Hostinger
   - Changes appear live on ridewire.tech in ~60 seconds

4. **Verify Live**  
   - Test on ridewire.tech (desktop + mobile)
   - Close GitHub Issue only after verification

### Demo Video Updates

**Recording New Demo:**
1. Record 60-90s MP4 using Loom/OBS (P0300 misfire check-engine-light scenario)
2. Save as `ridewire-demo.mp4`
3. Upload to `/demo/` folder in this repo
4. If releasing on YouTube:
   - Upload video to YouTube
   - Copy video ID
   - Update `/demo/youtube-video-id.txt`

**Updating Demo Sections:**
- To change MP4 URL: Edit `/sections/demo-static.html`
- To change YouTube ID: Edit `/sections/demo-youtube.html`
- Commit and push; auto-deploy handles the rest

## Homepage Structure (Live)

The current homepage on ridewire.tech follows this order:

1. **Navigation + Logo**
2. **Hero Section** (`/sections/hero.html`)
   - Headline: "Three AI experts. One clear diagnostic plan."
   - Subheadline + 2 CTAs
3. **Static Demo Video** (`/sections/demo-static.html`)
   - Autoplay MP4, 30 seconds, no user click required
4. **Testimonials + Features**
5. **YouTube Demo** (`/sections/demo-youtube.html`)
   - Full 3-10 minute walkthrough
6. **Pricing → FAQ → Footer**

## Hostinger Integration

### First-Time Setup

1. In **Hostinger hPanel** → **Advanced** → **Git**
2. Link repo: `https://github.com/STEPHENIESGEM/ridewire-site`
3. Set target branch: `main`
4. Set deployment directory: `/wp-content/themes/ridewire-child/` (or equivalent)
5. Enable **Auto-deploy on push**

### Auto-Deployment

- Every commit to `main` triggers `/github/workflows/deploy.yml`
- GitHub Action uses SSH to pull latest files to Hostinger
- Changes live in ~60 seconds, no manual intervention

## Continuous Improvement Loop

**Weekly Standing Process:**

1. **Observe** (5 min)
   - Check YouTube demo stats (views, watch time, drop-off)
   - Check site analytics (demo scroll depth, CTA clicks, trial starts)

2. **Decide** (5 min)
   - Identify one friction point or opportunity
   - Open GitHub Issue with hypothesis

3. **Change** (10 min)
   - Edit the relevant HTML section file
   - Commit and push

4. **Verify** (5 min)
   - Test change live on ridewire.tech
   - Close Issue only after confirmation

**Allowed Standing Changes (no approval needed):**
- Copy tightening or sharpening
- CTA button text/styling
- Demo section copy or micro-copy
- Trust badges or proof elements
- Layout spacing or typography

**Requires Approval Before Change:**
- Core positioning pivot ("Three AI experts..." headline)
- Pricing changes
- New sections or pages
- Major visual identity shifts

## Quick Links

- **Live Site:** https://ridewire.tech
- **Admin:** https://ridewire.tech/wp-admin
- **Elementor Editor:** https://ridewire.tech/wp-admin/admin.php?page=elementor
- **GitHub Repo:** https://github.com/STEPHENIESGEM/ridewire-site

## Support

- **Questions about deployment?** Check `.github/workflows/deploy.yml`
- **Need to revert a change?** Use GitHub's version history or revert commit
- **Want to test a change before going live?** Create a branch, test on staging, then merge to `main`
## Hostinger Git Auto-Deploy Setup

To enable automatic deployments from this GitHub repository to Hostinger:

### 1. Access Hostinger hPanel
- Log in to https://hpanel.hostinger.com
- Navigate to **Websites** and select **ridewire.tech**
- Click **Manage**

### 2. Configure Git Repository
- In the left sidebar, find and click **Git**
- Click **Create a new repository entry**
- Enter Repository URL: `https://github.com/STEPHENIESGEM/ridewire-site`
- Set Branch: `main`
- Install Path: Leave as default (`public_html`)

### 3. Enable Auto-Deployment
- Click the **Auto-Deployment** button next to your repository
- A popup will display a **Webhook URL**
- Copy this URL (you'll need it for the next step)

### 4. Configure GitHub Webhook
- Go to your GitHub repository: https://github.com/STEPHENIESGEM/ridewire-site
- Click **Settings** → **Webhooks**
- Click **Add webhook**
- Paste the Webhook URL from step 3
- Set **Content type** to `application/json`
- Select **Let me select individual events** and check `push`
- Click **Add webhook**

### 5. Test the Setup
- Make a test commit to the main branch
- The webhook will trigger automatically
- Your Hostinger site will deploy within seconds

Once configured, every `git push` to the `main` branch will automatically deploy to `ridewire.tech`!


---

**This is the centralized deployment control panel. Changes here update ridewire.tech automatically.**
