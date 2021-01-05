'use strict'

const ffmpegProbe = require('ffmpeg-probe')
const fs = require('fs-extra')
const path = require('path')
const test = require('ava')
const imageSize = require('image-size')
const tempy = require('tempy')
const { sprintf } = require('sprintf-js')

const renderLottie = require('.')

const bodymovin = 'fixtures/bodymovin.json'

test('bodymovin.json => single frame png', async (t) => {
  const output = tempy.file({ extension: 'png' })

  await renderLottie({
    path: bodymovin,
    quiet: true,
    output
  })

  const image = imageSize(output)
  t.is(image.width, 1820)
  t.is(image.height, 275)

  await fs.remove(output)
})

test('bodymovin.json => single specific frame png', async (t) => {
  const output = tempy.file({ extension: 'png' })

  await renderLottie({
    path: bodymovin,
    quiet: true,
    frame: 103,
    output
  })

  const image = imageSize(output)
  t.is(image.width, 1820)
  t.is(image.height, 275)

  await fs.remove(output)
})

test('bodymovin.json => single frame jpg scale=640:-1', async (t) => {
  const output = tempy.file({ extension: 'jpg' })

  await renderLottie({
    path: bodymovin,
    quiet: true,
    width: 640,
    output
  })

  const image = imageSize(output)
  t.is(image.width, 640)
  t.is(image.height, 96)

  await fs.remove(output)
})

test('bodymovin.json => png frames scale=-1:100', async (t) => {
  const temp = tempy.directory()
  const output = path.join(temp, 'frame-%d.png')

  await renderLottie({
    path: bodymovin,
    quiet: true,
    height: 100,
    output
  })

  for (let i = 1; i < 103; ++i) {
    const image = imageSize(sprintf(output, i))
    t.is(image.width, 661)
    t.is(image.height, 100)
  }

  await fs.remove(output)
})

if (!process.env.CI) {
  test('bodymovin.json => GIF', async (t) => {
    const output = tempy.file({ extension: 'gif' })

    await renderLottie({
      path: bodymovin,
      quiet: true,
      output
    })

    console.log(output)
    const image = imageSize(output)
    console.log(image)
    t.is(image.width, 1820)
    t.is(image.height, 275)

    await fs.remove(output)
  })
}

test('bodymovin.json => mp4', async (t) => {
  const output = tempy.file({ extension: 'mp4' })

  await renderLottie({
    path: bodymovin,
    quiet: true,
    ffmpegOptions: {
      crf: 22,
      profileVideo: 'high',
      preset: 'fast'
    },
    output
  })

  const probe = await ffmpegProbe(output)
  // height is scaled up a bit because h264 encoder requires an even height
  t.is(probe.width, 1820)
  t.is(probe.height, 274)
  t.is(probe.streams[0].profile, 'High')

  await fs.remove(output)
})
