# webpack-css-benchmark

There are many CSS-in-JS solutions, but they all come with different performance issues. Some of them are rather slow when running in a browser (f.e. [emotion](https://emotion.sh)). Others might cause long webpack build times (f.e. [linaria](https://linaria.now.sh) or css-modules).

This is a small benchmark to test perfomance on webpack-build-time. All results can be found [here](benchmark.md);

## run your own benchmark
If you want to run the benchmark on your own computer, clone the repository and execute the command. It's recommended to close all other programs while running the benchmark in order to get the most meaningful results possible.

```
$ npm run benchmark
```
