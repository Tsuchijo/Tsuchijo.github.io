const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  // Add syntax highlighting plugin
  eleventyConfig.addPlugin(syntaxHighlight);
  
  // Configure markdown-it with plugins for rich content
  let markdownIt = require("markdown-it");
  let markdownItFootnote = require("markdown-it-footnote");
  let markdownItAttrs = require("markdown-it-attrs");
  let markdownItAnchor = require("markdown-it-anchor");
  
  let options = {
    html: true,
    breaks: false,
    linkify: true
  };
  
  let markdownLib = markdownIt(options)
    .use(markdownItFootnote)
    .use(markdownItAttrs)
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink({
        class: "heading-anchor",
        safariReaderFix: true
      }),
      level: [2, 3, 4] // Only generate anchors for h2, h3, h4
    });
  
  // Customize footnote rendering to match your design
  markdownLib.renderer.rules.footnote_block_open = () => (
    '<section class="footnotes">\n' +
    '<div class="footnotes-title">Notes</div>\n' +
    '<ol class="footnotes-list">\n'
  );
  markdownLib.renderer.rules.footnote_block_close = () => (
    '</ol>\n' +
    '</section>\n'
  );
  
  eleventyConfig.setLibrary("md", markdownLib);

  // Copy static assets to the output directory
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("pictures");
  eleventyConfig.addPassthroughCopy("gifs");
  
  // Create blog post collection
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/posts/*.md").sort(function(a, b) {
      return b.date - a.date;
    });
  });

  // Create portfolio collection
  eleventyConfig.addCollection("portfolio", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/portfolio/*.md").sort(function(a, b) {
      return b.date - a.date;
    });
  });
  
  // Create main pages collection
  eleventyConfig.addCollection("pages", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/*.md");
  });
  
  // Add date filter
  eleventyConfig.addFilter("dateDisplay", function(dateObj) {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Table of Contents filter
  eleventyConfig.addFilter("toc", function(content) {
    // Extract headings from the rendered HTML content
    const headingRegex = /<h([2-4])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h[2-4]>/gi;
    const headings = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const id = match[2];
      const text = match[3].replace(/<[^>]+>/g, ''); // Strip HTML tags from heading text
      headings.push({ level, id, text });
    }
    
    if (headings.length === 0) {
      return '';
    }
    
    // Generate TOC HTML
    let tocHtml = '<nav class="table-of-contents" aria-label="Table of Contents">\n';
    tocHtml += '<h2 class="toc-title">Table of Contents</h2>\n';
    tocHtml += '<ul class="toc-list">\n';
    
    let stack = [2]; // Track the level stack, starting at h2
    
    headings.forEach((heading, index) => {
      // Close lists when moving to a higher (smaller number) level
      while (stack.length > 1 && stack[stack.length - 1] > heading.level) {
        tocHtml += '</ul>\n</li>\n';
        stack.pop();
      }
      
      // Open nested list when moving to a deeper (larger number) level
      if (heading.level > stack[stack.length - 1]) {
        // Don't close the previous li, start a nested ul
        if (index > 0) {
          tocHtml = tocHtml.replace(/<\/li>\n$/, '');
          tocHtml += '<ul class="toc-list toc-nested">\n';
        }
        stack.push(heading.level);
      }
      
      tocHtml += `<li class="toc-item toc-level-${heading.level}">\n`;
      tocHtml += `<a href="#${heading.id}" class="toc-link">${heading.text}</a>\n`;
      
      // Check if next heading is nested or at same level
      const nextHeading = headings[index + 1];
      if (!nextHeading || nextHeading.level <= heading.level) {
        tocHtml += '</li>\n';
      }
    });
    
    // Close any remaining nested lists
    while (stack.length > 1) {
      tocHtml += '</ul>\n</li>\n';
      stack.pop();
    }
    
    tocHtml += '</ul>\n</nav>\n';
    
    return tocHtml;
  });
  
  // Configure directories
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};