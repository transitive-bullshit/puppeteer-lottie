# puppeteer-lottie

> Renders [Lottie](http://airbnb.io/lottie) animations via [Puppeteer](https://github.com/GoogleChrome/puppeteer) to image, GIF or MP4.

[![NPM](https://img.shields.io/npm/v/puppeteer-lottie.svg)](https://www.npmjs.com/package/puppeteer-lottie) [![Build Status](https://travis-ci.com/transitive-bullshit/puppeteer-lottie.svg?branch=master)](https://travis-ci.com/transitive-bullshit/puppeteer-lottie) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<p align="center">
  <img width="100%" alt="Logo" src="https://raw.githubusercontent.com/transitive-bullshit/puppeteer-lottie/master/media/logo.gif">
</p>

This module is also available as a [CLI](https://github.com/transitive-bullshit/puppeteer-lottie-cli).

## Install

```bash
npm install --save puppeteer-lottie
```

## Usage

**TODO**

```js
const renderLottie = require('puppeteer-lottie')

// Create an MP4 from a lottie animation
await renderLottie({
  path: 'fixtures/bodymovin.json',
  output: 'example.mp4'
})

// Create a GIF with width 640px from a lottie animation
await renderLottie({
  path: 'fixtures/bodymovin.json',
  output: 'example.gif',
  width: 640
})

// Render each frame of the animation as PNG images with height 128px
await renderLottie({
  path: 'fixtures/bodymovin.json',
  output: 'frame-%d.png', // sprintf format
  height: 128
})

// Render the first frame of the animation as a JPEG with specific dimensions
// Note: the lottie-web renderer defaults to 'xMidyMid meet' so the resulting
// image will retain its original aspect ratio in the middle of the viewport and
// be padded with whitespace (or transparent regions if using png)
await renderLottie({
  path: 'fixtures/bodymovin.json',
  output: 'preview.jpg',
  width: 640,
  height: 480
})
```

Note that all CSS styles are specified via the [JS CSS syntax](https://www.w3schools.com/jsref/dom_obj_style.asp), which uses camelCase instead of hyphens. This is, for instance, what [React](https://reactjs.org/docs/dom-elements.html#style) uses for its inline styles.

## API

TODO

## Related

- [puppeteer-lottie-cli](https://github.com/transitive-bullshit/puppeteer-lottie-cli) - CLI for this module.
- [puppeteer](https://github.com/GoogleChrome/puppeteer) - Headless Chrome Node API.
- [awesome-puppeteer](https://github.com/transitive-bullshit/awesome-puppeteer) - Curated list of awesome puppeteer resources.
- [lottie](http://airbnb.io/lottie) - Render After Effects animations natively on Web, Android and iOS, and React Native.

## License

MIT © [Travis Fischer](https://transitivebullsh.it)
