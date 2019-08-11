function buildHTML(name, symbol, number, description) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>The Elements - ${name}</title>
    <link rel="stylesheet" href="/css/styles.css">
  </head>
  <body>
    <h1>${name}</h1>
    <h2>${symbol}</h2>
    <h3>Atomic number ${number}</h3>
    <p>${description}</p>
    <p><a href="/">back</a></p>
  </body>
  </html>`;
}

module.exports = buildHTML;
