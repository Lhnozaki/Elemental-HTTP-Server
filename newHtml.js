function buildHTML(list, num) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>The Elements</title>
    <link rel="stylesheet" href="/css/styles.css" />
  </head>
  <body>
    <h1>The Elements</h1>
    <h2>These are all the known elements.</h2>
    <h3>These are ${num}</h3>
    <ol>
        ${list}
    </ol>
  </body>
  </html>`;
}

module.exports = buildHTML;
