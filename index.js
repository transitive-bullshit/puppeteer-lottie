'use strict'

const fs = require('fs-extra')
const execa = require('execa')
const ow = require('ow')
const path = require('path')
const puppeteer = require('puppeteer')
const tempy = require('tempy')
const util = require('util')

const { cssifyObject } = require('css-in-js-utils')

const lottieScript = fs.readFileSync(path.join(__dirname, 'lib', 'lottie.min.js'), 'utf8')

const injectLottie = `
<script>
  ${lottieScript}
</script>
`

/**
 * Renders the given Lottie animation via Puppeteer.
 *
 * Must pass either `path` or `animationData`.
 *
 * @name renderLottie
 * @function
 *
 * @param {object} opts - Configuration options
 * @param {string} opts.output - Path or pattern to store result
 * @param {object} [opts.animationData] - JSON exported animation data
 * @param {string} [opts.path] - Relative path to the animation object
 * @param {number} [opts.width] - Optional output width
 * @param {number} [opts.height] - Optional output height
 * @param {number} [opts.deviceScaleFactor=1] - Window device scale factor
 * @param {string} [opts.renderer='svg'] - Which lottie-web renderer to use
 * @param {object} [opts.rendererSettings] - Optional lottie renderer options
 * @param {object} [opts.puppeteerOptions] - Optional puppeteer launch options
 * @param {object} [opts.style={}] - Optional JS [CSS styles](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference) to apply to the animation container
 * @param {object} [opts.inject={}] - Optionally injects arbitrary string content into the head, style, or body elements.
 * @param {string} [opts.inject.head] - Optionally injected into the document <head>
 * @param {string} [opts.inject.style] - Optionally injected into a <style> tag within the document <head>
 * @param {string} [opts.inject.body] - Optionally injected into the document <body>
 *
 * @return {Promise}
 */
module.exports = async (opts) => {
  const {
    output,
    animationData = undefined,
    path: animationPath = undefined,
    deviceScaleFactor = 1,
    renderer = 'svg',
    rendererSettings = { },
    style = { },
    inject = { },
    puppeteerOptions = { },
    jpgQuality = 90,
    gifskiOptions = {
      fps: 10,
      quality: 80,
      fast: false
    }
  } = opts

  let {
    width = undefined,
    height = undefined
  } = opts

  ow(output, ow.string.nonEmpty, 'output')
  ow(deviceScaleFactor, ow.number.integer.positive, 'deviceScaleFactor')
  ow(renderer, ow.string.oneOf([ 'svg', 'canvas', 'html' ], 'renderer'))
  ow(rendererSettings, ow.object.plain, 'rendererSettings')
  ow(puppeteerOptions, ow.object.plain, 'puppeteerOptions')
  ow(style, ow.object.plain, 'style')
  ow(inject, ow.object.plain, 'inject')

  const ext = path.extname(output).slice(1).toLowerCase()
  const isGif = (ext === 'gif')
  const isMp4 = (ext === 'mp4')
  const isPng = (ext === 'png')
  const isJpg = (ext === 'jpg' || ext === 'jpeg')

  if (!(isGif || isMp4 || isPng || isJpg)) {
    throw new Error(`Unsupported output format "${output}"`)
  }

  const tempDir = isGif ? tempy.directory() : undefined
  const tempOutput = isGif
    ? path.join(tempDir, 'frame-%012d.png')
    : output
  const frameType = (isJpg ? 'jpeg' : 'png')
  const isMultiFrame = isMp4 || /%d|%\d{2,3}d/.test(tempOutput)

  let lottieData = animationData

  if (animationPath) {
    if (animationData) {
      throw new Error('"animationData" and "path" are mutually exclusive')
    }

    ow(animationPath, ow.string.nonEmpty, 'path')

    lottieData = fs.readJsonSync(animationPath)
  } else if (animationData) {
    ow(animationData, ow.object.plain.nonEmpty, 'animationData')
  } else {
    throw new Error('Must pass either "animationData" or "path"')
  }

  const fps = lottieData.fr
  const { w, h } = lottieData
  const aR = w / h

  ow(fps, ow.number.integer.positive, 'animationData.fr')
  ow(w, ow.number.integer.positive, 'animationData.w')
  ow(h, ow.number.integer.positive, 'animationData.h')

  if (width) {
    height = width / aR
  } else if (height) {
    width = height * aR
  } else {
    width = w
    height = h
  }

  const html = `
<html>
<head>
  <meta charset="UTF-8">

  ${inject.head || ''}
  ${injectLottie}

  <style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: transparent;

  ${width ? 'width: ' + width + 'px;' : ''}
  ${height ? 'height: ' + height + 'px;' : ''}

  overflow: hidden;
}

#root {
  ${cssifyObject(style)}
}

  ${inject.style || ''}
  </style>
</head>

<body>
${inject.body || ''}

<div id="root"></div>

<script>
  const animationData = ${JSON.stringify(lottieData)};
  let animation = null;
  let duration;
  let numFrames;

  function onReady () {
    animation = lottie.loadAnimation({
      container: document.getElementById('root'),
      renderer: '${renderer}',
      loop: false,
      autoplay: false,
      rendererSettings: ${JSON.stringify(rendererSettings)},
      animationData,
    });

    duration = animation.getDuration();
    numFrames = animation.getDuration(true);

    var div = document.createElement('div');
    div.className = 'ready';
    document.body.appendChild(div);
  }

  document.addEventListener('DOMContentLoaded', onReady);
</script>

</body>
</html>
`

  // useful for testing purposes
  // fs.writeFileSync('test.html', html)

  const browser = opts.browser || await puppeteer.launch({
    ...puppeteerOptions
  })
  const page = await browser.newPage()

  page.on('console', console.log)
  page.on('error', console.error)

  await page.setViewport({
    deviceScaleFactor,
    width,
    height
  })
  await page.setContent(html)
  await page.waitForSelector('.ready')
  const duration = await page.evaluate(() => duration)
  const numFrames = await page.evaluate(() => numFrames)

  const pageFrame = page.mainFrame()
  const rootHandle = await pageFrame.$('#root')

  const screenshotOpts = {
    omitBackground: true,
    type: frameType,
    quality: frameType === 'jpeg' ? jpgQuality : undefined
  }

  for (let frame = 1; frame <= numFrames; ++frame) {
    const frameOutputPath = isMultiFrame
      ? util.format(tempOutput, frame)
      : tempOutput

    // eslint-disable-next-line no-undef
    await page.evaluate((frame) => animation.goToAndStop(frame, true), frame)
    const screenshot = await rootHandle.screenshot({
      path: isMp4 ? undefined : frameOutputPath,
      ...screenshotOpts
    })

    // single screenshot
    if (!isMultiFrame) {
      break
    }

    if (isMp4) {
      // TODO
    }
  }

  await rootHandle.dispose()
  await browser.close()

  if (isGif) {
    const framePattern = tempOutput.replace('%012d', '*')
    const escapePath = arg => arg.replace(/(\s+)/g, '\\$1')

    const params = [
      '-o', escapePath(output),
      '--fps', gifskiOptions.fps,
      gifskiOptions.fast && '--fast',
      '--quality', gifskiOptions.quality,
      '--quiet',
      escapePath(framePattern)
    ].filter(Boolean)

    const executable = process.env.GIFSKI_PATH || 'gifski'
    const cmd = [ executable ].concat(params).join(' ')

    console.log(cmd)
    await execa.shell(cmd)
    await fs.remove(tempDir)
  }

  return html
}
