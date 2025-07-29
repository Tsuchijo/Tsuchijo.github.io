const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  // Add syntax highlighting plugin
  eleventyConfig.addPlugin(syntaxHighlight);
  
  // Configure markdown-it with plugins for rich content
  let markdownIt = require("markdown-it");
  let markdownItFootnote = require("markdown-it-footnote");
  let markdownItAttrs = require("markdown-it-attrs");
  
  let options = {
    html: true,
    breaks: false,
    linkify: true
  };
  
  let markdownLib = markdownIt(options)
    .use(markdownItFootnote)
    .use(markdownItAttrs);
  
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
  
  // Copy static files
  eleventyConfig.addPassthroughCopy("src/blog/assets");
  eleventyConfig.addPassthroughCopy("pictures");
  eleventyConfig.addPassthroughCopy("styles.css");
  
  // Create blog post collection
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/posts/*.md").sort(function(a, b) {
      return b.date - a.date;
    });
  });
  
  // Add date filter
  eleventyConfig.addFilter("dateDisplay", function(dateObj) {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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