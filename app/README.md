# GitHub Repository Preview - MVP

A lightweight web app that lets users paste a GitHub repository URL and explore its contents with a clean preview interface.

## Features

- 🔗 **Paste any GitHub repo URL** - Simply enter a public GitHub repository URL
- 📁 **Browse file tree** - View all HTML and Markdown files in the repository
- 📖 **Markdown rendering** - READMEs and other `.md` files are beautifully rendered
- 👁️ **HTML preview** - View HTML file contents (displayed as code, not rendered)
- 🔗 **Direct GitHub link** - Quick access to open the repository on GitHub
- 📱 **Responsive design** - Works on desktop and mobile devices

## Tech Stack

- Pure HTML, CSS, and JavaScript (no build process required)
- [Marked.js](https://marked.js.org/) CDN for Markdown rendering
- GitHub REST API for fetching repository data

## Local Development

Simply open `index.html` in your web browser. No build step or local server required!

```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Use a simple HTTP server (optional)
python -m http.server 8000
# Then visit http://localhost:8000
```

## GitHub Pages Deployment

This app is configured to work with GitHub Pages. Follow these steps to deploy:

### Option 1: Deploy from `/app` folder (Recommended)

1. **Go to your repository on GitHub**
   - Navigate to: `https://github.com/YOUR_USERNAME/YOUR_REPOSITORY`

2. **Open Settings**
   - Click on the **Settings** tab

3. **Configure GitHub Pages**
   - In the left sidebar, click on **Pages**
   - Under "Build and deployment":
     - Source: Select **Deploy from a branch**
     - Branch: Select **main** (or your default branch)
     - Folder: Select **/app** (not root)
     - Click **Save**

4. **Wait for deployment**
   - GitHub will build and deploy your site
   - This usually takes 1-2 minutes
   - You'll see a green checkmark when ready

5. **Access your site**
   - Your app will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`
   - GitHub Pages will automatically serve from the `/app` folder

### Option 2: Deploy using GitHub Actions (Alternative)

If you prefer using GitHub Actions for more control:

1. Create `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './app'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. In repository Settings → Pages:
   - Source: Select **GitHub Actions**

## Usage

1. **Open the app** in your browser
2. **Paste a GitHub repository URL** (e.g., `https://github.com/facebook/react`)
3. **Click "Load Repository"** or press Enter
4. **Browse files** in the sidebar - click any Markdown or HTML file to preview
5. **View rendered content** in the main panel
6. **Click "Open in GitHub"** to visit the repository on GitHub

## Limitations

- Only works with **public** repositories (GitHub API requirement)
- Only displays **Markdown (.md)** and **HTML (.html)** files
- Rate limited to 60 requests/hour per IP address (unauthenticated GitHub API)
- Large files may take longer to load

## Future Enhancements

Potential features for future versions:
- GitHub authentication for private repos and higher rate limits
- Support for more file types (JS, CSS, JSON, etc.)
- Syntax highlighting for code files
- Search functionality within files
- Folder/directory navigation
- File download capability
- Recent repositories history

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Requires internet connection to fetch from GitHub API

## License

Part of the RideWire Sites project.
