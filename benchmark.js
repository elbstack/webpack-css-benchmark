const { promisify } = require('util');
const webpackBase = require('webpack');
const fs = require('fs');
const table = require('markdown-table');

const webpack = promisify(webpackBase);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const webpackConfigs = [
  require('./webpack-emotion.config'),
  require('./webpack-linaria.config'),
  require('./webpack-css-modules.config'),
  require('./webpack-nostyles.config'),
];

(async () => {
  const rounds = 10;
  console.log(`prepare to run ${i} rounds. get a ☕️`);
  const measuresRaw = {};
  for (let i = 1; i <= rounds; i++) {
    for (config of webpackConfigs) {
      const title = Object.keys(config.entry)[0];
      console.log(`building ${title} in round ${i}`);
      const start = new Date();
      await webpack(config);
      const end = new Date() - start;
      if (!measuresRaw[title]) {
        measuresRaw[title] = [];
      }
      measuresRaw[title].push(end);
      console.log(`builded ${title} in round ${i} in ${end / 1000}s`);
    }
  }

  const measures = Object.entries(measuresRaw)
    .map(([key, values]) => [
      key,
      Math.min(...values) / 1000,
      Math.max(...values) / 1000,
      values.reduce((sum, value) => sum + value, 0) / values.length / 1000,
      // values,
    ])
    .sort(([, , , averangeA], [, , , averangeB]) => {
      if (averangeA < averangeB) {
        return -1;
      }
      if (averangeA < averangeB) {
        return 1;
      }

      return 0;
    });

  const mdTable = table([['name', 'min (seconds)', 'max (seconds)', 'averange (seconds)'], ...measures], {
    align: ['l', 'r', 'r', 'r'],
  });

  await writeFile('benchmark.md', `# Benchmark results after ${rounds} rounds\n\nsorted by lowest averange\n\n${mdTable}`);
  console.log(measures);
  console.log(`benchmark finished 🎉`);
})();
