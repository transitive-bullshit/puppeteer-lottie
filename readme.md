# puppeteer-lottie

> Render [lottie](http://airbnb.io/lottie) animations via [Puppeteer](https://github.com/GoogleChrome/puppeteer) to PNGs, GIF or MP4.

[![NPM](https://img.shields.io/npm/v/puppeteer-lottie.svg)](https://www.npmjs.com/package/puppeteer-lottie) [![Build Status](https://travis-ci.com/transitive-bullshit/puppeteer-lottie.svg?branch=master)](https://travis-ci.com/transitive-bullshit/puppeteer-lottie) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<p align="center">
  <img width="502" alt="Logo" src="https://raw.githubusercontent.com/transitive-bullshit/puppeteer-lottie/master/media/logo.png">
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

// render text with built-in font and no word-wrap
await renderrenderLottie({
  text: 'hello world',
  output: 'out0.png',
  style: {
    fontFamily: 'segue ui',
    fontSize: 64
  }
})

// render text with custom google font and word-wrap at 400px
await renderText({
  text: 'headless chrome is awesome',
  output: 'out1.png',
  loadGoogleFont: true,
  width: 400,
  style: {
    fontFamily: 'Roboto',
    fontSize: 32,
    padding: 16
  }
})

// render html with custom google font and custom word-wrap at 100px
await renderText({
  text: 'headless <b>chrome</b> is <span style="color: red: font-style: italic;">awesome</span>',
  output: 'out1.png',
  loadGoogleFont: true,
  width: 100,
  style: {
    fontFamily: 'Roboto',
    overflowWrap: 'break-word'
  }
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
