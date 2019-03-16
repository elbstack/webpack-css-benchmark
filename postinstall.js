const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const rimrafBase = require('rimraf');

const writeFile = promisify(fs.writeFile);
const makeDirectory = promisify(fs.mkdir);
const rimraf = promisify(rimrafBase);

const app = () => `import React from "react";
import ReactDOM from "react-dom";
import * as components from "./components/index";

const App = () =>
  Object.entries(components).map(([component, Component]) => (
    <Component size={24} key={Component}>
      {component}
    </Component>
  ));

ReactDOM.render(<App />, document.getElementById("root"));
`;

const html = (name, options) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>${name} benchmark</title>
    ${options && options.stylesheet ? `\n    <link rel="stylesheet" type="text/css" href="/dist/styles-${name}.css" />` : ''}   
  </head>

  <body>
    <div id="root"></div>

    <script src="/dist/app-${name}.bundle.js"></script>
  </body>
</html>
`;

const variants = {
  'css-modules': {
    html: {
      stylesheet: true,
    },
    js: (hue, saturation, name) => `import { css${hue} } from "./Title${hue}.modules.css";
export const Title${hue}${saturation} = ({children}) => <h1 className={css${hue}}>{children}</h1>;`,
    'modules.css': (hue, saturation) => `.css${hue} {
  font-family: sans-serif;
  font-size: 24px;
  color: hsl(${hue}, ${saturation}%, 50%);
}`,
  },
  emotion: {
    js: (hue, saturation, name) => `import styled from '@emotion/styled';
export const Title${hue}${saturation} = styled.h1\`
  font-family: sans-serif;
  font-size: 24px;
  color: hsl(${hue}, ${saturation}%, 50%);
\`;`,
  },
  linaria: {
    html: {
      stylesheet: true,
    },
    js: (hue, saturation, name) => `import { styled } from 'linaria/react';
export const Title${hue}${saturation} = styled.h1\`
  font-family: sans-serif;
  font-size: 24px;
  color: hsl(${hue}, ${saturation}%, 50%);
\`;`,
  },
  nostyles: {
    js: (hue, saturation, name) => `import React from "react";
export const Title${hue}${saturation} = ({ children }) => <h1>{children}</h1>;`,
  },
};

const variantsKeys = Object.keys(variants);
const files = [];

(async () => {
  // delete directories
  await rimraf(`./src-*`);
  await rimraf(`./public`);

  for (let j = 0; j <= 3; j++) {
    for (let i = 0; i <= 360; i++) {
      const fileName = `${j}/Title${i}`;
      await Promise.all(
        variantsKeys.map(async key => {
          await makeDirectory(path.resolve(`./src-${key}/components/`, j + ''), {
            recursive: true,
          });
          await Promise.all(
            Object.entries(variants[key]).map(
              async ([suffix, fileContent]) =>
                typeof fileContent === 'function' &&
                (await writeFile(path.resolve(`./src-${key}/components/`, fileName + '.' + suffix), fileContent(i, j)))
            )
          );
        })
      );

      files.push(`./${fileName}`);
    }
  }

  await Promise.all(
    variantsKeys.map(async key => {
      await writeFile(path.resolve(`./src-${key}/components/`, 'index.js'), files.map(file => `export * from '${file}';`).join('\n'));
      await writeFile(path.resolve(`./src-${key}/`, 'App.js'), app());
    })
  );
  await makeDirectory(path.resolve(`./dist`), {
    recursive: true,
  });
  await writeFile(path.resolve(`./dist/index.html`), `<ul>${variantsKeys.map(key => `\n  <li><a href="${key}.html">${key}</a></li>` ).join('')}\n</ul>`);

  console.log('benchmark environment created 🎉');
})();
