# Joel Tsuchitori's Personal Website

A personal portfolio and blog website built with 11ty (Eleventy) and HTMX, featuring markdown-based content management and automatic GitHub Pages deployment.

## 🚀 Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the site**:
   ```bash
   npm run build
   ```

3. **Serve locally**:
   ```bash
   npx serve .
   ```
   Then visit `http://localhost:3000`

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build the site from markdown sources |
| `npm run build:watch` | Build and watch for changes (live reload) |
| `npm run serve` | 11ty development server with live reload |
| `npm run clean` | Remove all generated files |

## 📁 Project Structure

```
├── src/                          # Source files (what you edit)
│   ├── pages/                    # Main pages (About, Portfolio, Resume)
│   │   ├── about.md
│   │   ├── portfolio.md
│   │   └── resume.md
│   ├── blog/
│   │   └── posts/               # Blog posts in markdown
│   │       └── *.md
│   └── _layouts/                # 11ty templates
├── pictures/                    # Static images
├── gifs/                       # Static GIFs
├── styles.css                  # Main stylesheet
├── index.html                  # Main HTMX page
└── Generated files (ignored by git):
    ├── about.html              # HTMX fragments
    ├── portfolio.html
    ├── resume.html
    └── blog/                   # Generated blog structure
```

## ✏️ Content Management

### Main Pages (About, Portfolio, Resume)

Edit markdown files in `src/pages/`:
- `src/pages/about.md`
- `src/pages/portfolio.md` 
- `src/pages/resume.md`

### Blog Posts

Create new `.md` files in `src/blog/posts/` with this format:

```markdown
---
title: "Your Post Title"
date: 2024-01-29
tags: ["tag1", "tag2"]
excerpt: "Brief description for the blog index"
---

Your markdown content here...

## Features supported:
- Images: `![alt text](pictures/image.jpg)`
- Code blocks with syntax highlighting
- Footnotes: `text[^1]` and `[^1]: Citation`
- All standard markdown
```

### Images

- Place images in `/pictures/` directory
- Reference in markdown: `![alt text](pictures/filename.jpg)`
- For blog posts: `![alt text](../../pictures/filename.jpg)`

## 🔧 How It Works

### Architecture

- **Main Site**: HTMX-powered single page application (`index.html`)
- **Blog**: Standalone pages + HTMX integration
- **Content**: Written in Markdown, processed by 11ty
- **Styling**: Unified CSS with custom properties

### Build Process

1. **11ty processes** markdown files in `src/`
2. **Generates** HTML fragments for HTMX integration
3. **Creates** standalone blog pages
4. **Preserves** static assets (CSS, images, main HTML)

### Dual Navigation

- **Main pages** (About, Portfolio, Resume): HTMX fragments only
- **Blog**: Full standalone functionality + HTMX integration
- **Images/CSS**: Relative paths work for both local and production

## 🚀 Deployment

### GitHub Actions (Automatic)

The site automatically deploys to GitHub Pages when you push to `main`:

1. **Edit content** in `src/` directory
2. **Commit and push** to GitHub
3. **GitHub Actions** runs `npm run build` automatically
4. **Site updates** in ~2-3 minutes

### Manual Deployment

If you need to deploy manually:

```bash
npm run build
git add .
git commit -m "Update content"
git push
```

## 🛠️ Troubleshooting

### Local Development Issues

**Styling/images broken locally?**
- Ensure you've run `npm run build` first
- Try clearing browser cache (Ctrl+Shift+R)
- Check that `styles.css` and image files aren't empty

**Build failing?**
```bash
npm run clean  # Clean generated files
npm run build  # Rebuild from scratch
```

**Images corrupted?**
```bash
git checkout HEAD -- pictures/ gifs/  # Restore from git
```

### File Management

- **Never edit** generated files (`about.html`, `portfolio.html`, `resume.html`, `blog/`)
- **Always edit** source files in `src/`
- **Generated files** are in `.gitignore` and shouldn't be committed

## 📝 Notes

- **Local URLs**: Use relative paths (no leading `/`)
- **Production**: Relative paths work on GitHub Pages too
- **Caching**: Hard refresh (Ctrl+Shift+R) if changes don't appear
- **Git**: Only source files are tracked, generated files are ignored

## 🔍 Key Files

- `.eleventy.js` - 11ty configuration
- `.eleventyignore` - Files 11ty should ignore
- `.gitignore` - Files git should ignore
- `.github/workflows/deploy.yml` - GitHub Actions workflow