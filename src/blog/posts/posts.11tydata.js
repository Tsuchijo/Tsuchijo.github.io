module.exports = {
  layout: "post.njk",
  tags: "posts",
  permalink: "/blog/{{ title | slugify }}/index.html"
};