# Joel Tsuchitori's Personal Website

A personal portfolio and blog website built with 11ty (Eleventy), featuring markdown-based content management and automatic GitHub Pages deployment.

## 🚀 Quick Start

### Local Development

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Serve locally**:
    ```bash
    npm run serve
    ```
    Then visit `http://localhost:8080` (or the port shown in your terminal).

### Development Commands

| Command           | Description                                   |
|-------------------|-----------------------------------------------|
| `npm run build`   | Build the site to the `_site` directory       |
| `npm run build:watch` | Build and watch for changes (live reload) |
| `npm run serve`   | 11ty development server with live reload      |
| `npm run clean`   | Remove all generated files in `_site`         |

## 📁 Project Structure

```
├── src/                          # Source files (what you edit)
│   ├── index.njk                 # Homepage redirect
│   ├── pages/                    # Main pages (About, Resume, Portfolio listing)
│   │   ├── about.md
│   │   ├── portfolio.html        # Portfolio listing page
│   │   ├── portfolio/            # Individual portfolio project pages
│   │   │   └── *.md
│   │   └── resume.md
│   ├── blog/
│   │   ├── index.njk             # Blog listing page
│   │   └── posts/                # Blog posts in markdown
│   │       └── *.md
│   └── _layouts/                 # 11ty templates
│       ├── base.njk              # Base layout for all pages
│       ├── standalone.njk        # Full HTML layout for standalone pages
│       └── portfolio-item.njk    # Layout for individual portfolio items
│       └── post.njk              # Layout for individual blog posts
├── pictures/                     # Static images
├── gifs/                         # Static GIFs
├── styles.css                    # Main stylesheet
├── .eleventy.js                  # Eleventy configuration
├── package.json                  # Project dependencies and scripts
└── _site/                        # Generated files (output directory, ignored by git)
    ├── index.html                # Homepage redirect
    ├── about.html
    ├── resume.html
    ├── portfolio/
    │   ├── index.html
    │   └── *.html
    └── blog/
        ├── index.html
        └── exploring-machine-learning-in-photonics:-a-sample-post/
            └── index.html
```

## ✏️ Content Management

### Main Pages (About, Resume)

Edit markdown files in `src/pages/`:
- `src/pages/about.md`
- `src/pages/resume.md`

### Portfolio Projects

Create new `.md` files in `src/pages/portfolio/`:
- Each file represents a single project.
- Use `layout: portfolio-item.njk` in the front matter.

### Blog Posts

Create new `.md` files in `src/blog/posts/` with this format:

```markdown
---
title: "Your Post Title"
date: YYYY-MM-DD
tags: ["tag1", "tag2"]
excerpt: "Brief description for the blog index"
permalink: /blog/{{ title | slug }}/index.html
---

Your markdown content here...

## Features supported:
- Images: `![alt text](/pictures/image.jpg)` (use absolute paths from site root)
- Code blocks with syntax highlighting
- Footnotes: `text[^1]` and `[^1]: Citation`
- All standard markdown
```

### Images and GIFs

- Place images in `/pictures/` directory and GIFs in `/gifs/`.
- Reference in markdown using **absolute paths** from the site root:
  - `![alt text](/pictures/filename.jpg)`
  - `![alt text](/gifs/animation.gif)`

## 🔧 How It Works

### Architecture

- **All Pages**: Now standalone HTML files, including navigation and footer.
- **Homepage**: `index.html` in the root (`_site/index.html`) is a simple redirect to `/about.html`.
- **Content**: Written in Markdown, processed by 11ty.
- **Styling**: Unified CSS (`styles.css`).

### Build Process

1.  **11ty processes** markdown and Nunjucks files from `src/`.
2.  **Generates** full HTML files for all pages and posts into the `_site` directory.
3.  **Copies** static assets (CSS, images, GIFs) from the root into `_site`.

## 🚀 Deployment

### GitHub Actions (Automatic)

The site automatically deploys to GitHub Pages when you push to `main`:

1.  **Edit content** in `src/` directory.
2.  **Commit and push** to GitHub.
3.  **GitHub Actions** runs `npm run build` automatically.
4.  **Site updates** in ~2-3 minutes.

### Manual Deployment

If you need to build manually:

```bash
npm run build
```

## 🛠️ Troubleshooting

### Local Development Issues

**Styling/images broken locally?**
- Ensure you are running the Eleventy development server: `npm run serve`.
- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R).
- Verify that `styles.css`, `pictures/`, and `gifs/` are being copied to the `_site` directory during build (check `_site` contents).

**Build failing?**
```bash
npm run clean  # Clean generated files
npm run build  # Rebuild from scratch
```

### File Management

- **Never edit** files directly in the `_site` directory.
- **Always edit** source files in `src/`.
- **Generated files** in `_site` are ignored by Git.

## 🔍 Key Files

- `.eleventy.js` - 11ty configuration
- `.eleventyignore` - Files 11ty should ignore
- `.gitignore` - Files git should ignore
- `.github/workflows/deploy.yml` - GitHub Actions workflow
