// Create the HTML footer element
const footer = document.createElement('footer');

// Set the copyright information
const copyright = `&copy; 2023-${new Date().getFullYear()} Joel Tsuchitori`;

// Append the copyright information to the footer
footer.innerHTML = copyright;

// Insert the footer into the document
document.body.appendChild(footer);
